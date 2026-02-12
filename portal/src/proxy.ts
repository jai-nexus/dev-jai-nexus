import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import crypto from "node:crypto";

/**
 * Proxy / gatekeeper for dev.jai.nexus.
 *
 * Goals:
 * - Never block public assets or NextAuth routes.
 * - Allow certain API routes to enforce their own auth "in-route".
 * - Provide a dedicated machine-token lane for internal endpoints.
 * - For everything else, require a NextAuth session (JWT), with sane API behavior:
 *   - APIs return JSON 401 (no redirects)
 *   - Pages redirect to /login?next=...
 */

const INTERNAL_TOKEN_ENV = "JAI_INTERNAL_API_TOKEN";

function isAuthPublic(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/api/auth");
}

function isStaticPublic(pathname: string) {
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/_next/static")) return true;
  if (pathname.startsWith("/_next/image")) return true;

  // HMR endpoint in dev
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/_next/webpack-hmr")) {
    return true;
  }

  return false;
}

function isApi(pathname: string) {
  return pathname.startsWith("/api/");
}

function isInternalApi(pathname: string) {
  return pathname.startsWith("/api/internal/");
}

// Endpoints that enforce auth in-route (Context API key, machine token, localhost allowlist, etc).
function isTokenAuthApi(pathname: string) {
  // Context API endpoints (protected by requireContextApiAuth in-route)
  if (pathname === "/api/repos" || pathname.startsWith("/api/repos/")) return true;
  if (pathname === "/api/agents/commit") return true;

  // Chat ingest endpoint (auth handled in-route; localhost allowed)
  if (pathname === "/api/ingest/chat") return true;

  // SoT events API (auth handled in-route)
  if (pathname === "/api/sot-events" || pathname.startsWith("/api/sot-events/")) return true;

  // DCT endpoints (auth handled in-route via assertInternalToken)
  if (pathname === "/api/dct" || pathname.startsWith("/api/dct/")) return true;

  // Dev-only debug routes (safe, no secrets)
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/api/_debug/")) return true;

  return false;
}

function isNextData(pathname: string) {
  return pathname.startsWith("/_next/data");
}

function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function timingSafeEqualString(a: string, b: string) {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function readBearer(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return (m?.[1] ?? "").trim();
}

function readMachineToken(req: NextRequest) {
  const bearer = readBearer(req);
  const legacy = (req.headers.get("x-jai-internal-token") ?? "").trim();
  return bearer || legacy;
}

function requireMachineToken(req: NextRequest) {
  const expected = (process.env[INTERNAL_TOKEN_ENV] ?? "").trim();
  if (!expected) {
    return NextResponse.json(
      { error: "Internal API token not configured", detail: `Missing ${INTERNAL_TOKEN_ENV}` },
      { status: 500 },
    );
  }

  const presented = readMachineToken(req);
  if (!presented || !timingSafeEqualString(presented, expected)) {
    return unauthorizedJson();
  }

  return null; // OK
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) Always allow auth + static
  if (isAuthPublic(pathname) || isStaticPublic(pathname)) {
    return NextResponse.next();
  }

  // 2) Allow "in-route auth" endpoints to run (they handle their own auth)
  //    This is critical for APIs like DCT where middleware would otherwise block
  //    GET/POST before the route handler can run.
  if (isTokenAuthApi(pathname)) {
    return NextResponse.next();
  }

  // 3) Internal API lane: machine token auth (never redirects)
  //    Keep this strict: internal endpoints should be callable by tools/automation without session cookies.
  if (isInternalApi(pathname)) {
    const deny = requireMachineToken(req);
    if (deny) return deny;
    return NextResponse.next();
  }

  // 4) Everything else: session auth (NextAuth JWT)
  //    - APIs return JSON 401 (no redirect)
  //    - Pages redirect to /login
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (isApi(pathname) || isNextData(pathname)) return unauthorizedJson();

    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
