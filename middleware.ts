import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;
  
  const publicRoutes = ["/auth", "/", "/gallery", "/leaderboard"];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  if (!accessToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (accessToken) {
    try {
      const decoded: any = jwtDecode(accessToken);
      
      if (isPublicRoute && pathname === "/auth") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        if (decoded.role !== "admin" && decoded.role !== "super") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
