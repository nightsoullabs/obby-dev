import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// Protected routes are determined via the use of the withAuth method,
// specifically whether the ensureSignedIn option is used.

export default authkitMiddleware();

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
export const config = {
  matcher: [
    "/",
    "/pricing",
    "/chat/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
