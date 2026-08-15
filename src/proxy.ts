import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ===== Rate limiting en memoria (Edge) =====
const ipRequests = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 120;       // max requests
const RATE_WINDOW = 60_000;   // 1 minuto

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

// ===== Detectar bots / scanners =====
const BLOCKED_UAS = [
  "sqlmap", "nikto", "masscan", "nmap", "zgrab", "dirbuster",
  "nuclei", "nessus", "acunetix", "burpsuite", "curl/7",
];

function isMaliciousUA(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BLOCKED_UAS.some((b) => lower.includes(b));
}

// ===== Detectar path traversal / injection =====
const SUSPICIOUS_PATTERNS = [
  /\.\.\//,                    // path traversal
  /<script/i,                  // XSS
  /union\s+select/i,           // SQL injection
  /\bexec\s*\(/i,              // code injection
  /\beval\s*\(/i,
  /\balert\s*\(/i,
  /%00/,                       // null byte
  /\bOR\s+1=1/i,
  /\bdrop\s+table/i,
];

function isSuspiciousPath(url: string): boolean {
  return SUSPICIOUS_PATTERNS.some((p) => p.test(url));
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const fullPath = pathname + search;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  // 1. Bloquear user-agents maliciosos
  if (isMaliciousUA(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. Bloquear patrones sospechosos en la URL
  if (isSuspiciousPath(fullPath)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 3. Rate limiting global
  if (rateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  // 4. Seguridad de rutas /admin (solo sesión autenticada de Supabase)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Añadir headers de seguridad a todas las respuestas
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",          // Next.js necesita eval
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://avatars.githubusercontent.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
