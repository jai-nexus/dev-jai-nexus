// portal/src/middleware.ts
// Re-exports the proxy gatekeeper so Next.js picks it up as middleware.
export { proxy as middleware } from "./src/gatekeeper";

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
