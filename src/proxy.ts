import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPABASE_URL = "https://zzqzhgwlqqdplppoblyt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SV6MrwSnWFuO1UM4N4s2Ng_l9FZEGRI";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login through always
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    // Check for Supabase auth cookie
    const accessToken = request.cookies.get("sb-access-token")?.value
      || request.cookies.get("sb-zzqzhgwlqqdplppoblyt-auth-token")?.value;

    if (!accessToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate token with Supabase
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: SUPABASE_ANON_KEY,
        },
      });

      if (!res.ok) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
