import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If user is not authenticated and trying to access protected routes
    if (
      !token &&
      (pathname.startsWith("/admin") || pathname.startsWith("/client"))
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If user is authenticated and trying to access auth routes, redirect based on role
    if (token && pathname.startsWith("/auth")) {
      const adminRoles = ["ADMIN", "ORGANIZER", "CO_ORGANIZER", "FACILITATOR"];

      if (adminRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Check if user has permission to access admin routes
    if (pathname.startsWith("/admin")) {
      const adminRoles = [
        "ADMIN",
        "ORGANIZER",
        "CO_ORGANIZER",
        "FACILITATOR",
        "TEAM_MEMBER",
      ];

      if (!token || !adminRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Allow access to client routes for authenticated users
    if (pathname.startsWith("/client")) {
      if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/teams") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon") ||
          pathname.includes(".")
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
