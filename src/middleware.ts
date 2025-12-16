import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If user is not authenticated and trying to access protected routes
  /*  if (!token && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If user is authenticated and trying to access auth routes, redirect to home.
    // Admin routes are currently disabled; avoid redirecting to /admin.
    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Client routes are now public - no authentication required
*/
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
          pathname.startsWith("/client") ||
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
