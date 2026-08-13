import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// No blocking here — admin route protection is handled client-side
// in src/app/admin/layout.tsx via supabase.auth.getUser()
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
