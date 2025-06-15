import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// Protected routes are determined via the use of the withAuth method,
// specifically whether the ensureSignedIn option is used.

// return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));

import { authkit } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Auth object contains the session, response headers and an auhorization
  // URL in the case that the session isn't valid. This method will automatically
  // handle setting the cookie and refreshing the session
  const {
    session: _session,
    headers,
    authorizationUrl: _authorizationUrl,
  } = await authkit(request, {
    debug: true,
  });

  if (request.url.endsWith("/chat")) {
    console.log("No session on protected path");
    return NextResponse.rewrite(new URL("/", request.url), {
      headers: headers,
    });
  }

  // Headers from the authkit response need to be included in every non-redirect
  // response to ensure that `withAuth` works as expected
  return NextResponse.next({
    headers: headers,
  });
}

// Match against pages that require authentication
export const config = {
  matcher: [
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
