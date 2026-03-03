import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  const pathname = req.nextUrl.pathname;
  const publicRoutes = ["/auth", "/", "/gallery" , "/leaderboard"];

  if (!accessToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  let decoded: any = null;
  if (accessToken) {
    try {
      decoded = jwtDecode(accessToken);
    } catch (err) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  if (
    pathname.startsWith("/dashboard") &&
    decoded &&
    decoded.role !== "admin" &&
    decoded.role !== "super"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (accessToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
