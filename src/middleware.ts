import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// Protected routes are determined via the use of the withAuth method,
// specifically whether the ensureSignedIn option is used.

export default authkitMiddleware();

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
export const config = { matcher: ["/"] };
