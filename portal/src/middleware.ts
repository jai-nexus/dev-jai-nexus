// portal/src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // where unauthenticated users are sent
  },
});

// Protect everything except:
// - Next.js internals
// - API routes (for Context API)
// - the login page itself
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
