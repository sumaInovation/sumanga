
// proxy.js
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    
    // If user is a student and profile is not completed, redirect to complete profile
    if (token?.role === "student" && !token?.profileCompleted) {
      // Don't redirect if already on complete-profile page
      if (!req.nextUrl.pathname.startsWith("/complete-profile")) {
        const url = new URL("/complete-profile", req.url);
        url.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return Response.redirect(url);
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/courses/:path*",
    "/api/protected/:path*",
  ],
};