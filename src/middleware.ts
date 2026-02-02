import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@/lib/shared/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      // Redirect to login if no session
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session by calling the session API
    // Note: In middleware, we can't use the full session validation (which requires DB access)
    // Instead, we rely on the session cookie existing and validate on the server components
    // For stricter validation, the admin pages themselves should verify admin status

    return NextResponse.next();
  }

  // Auth routes - redirect to home if already logged in
  if (pathname === "/login" || pathname === "/verify") {
    const sessionToken = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;

    if (sessionToken && pathname === "/login") {
      // If user has session and tries to access login, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes
    "/admin/:path*",
    // Match auth routes
    "/login",
    "/verify",
  ],
};
