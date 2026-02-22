// portal/src/gatekeeper.ts
//
// Edge-safe gatekeeper middleware logic for dev.jai.nexus.
// NOTE: Middleware runs in the Edge runtime. Avoid Node-only modules (e.g. node:crypto).
//
// This file is meant to be re-exported from portal/middleware.ts like:
//   export { proxy as middleware, config } from "./src/gatekeeper";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // Operator proxy routes (auth handled in-route)
  if (pathname === "/api/operator" || pathname.startsWith("/api/operator/")) return true;

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

/**
 * Edge-safe constant-time-ish string comparison.
 * Avoids Node's crypto.timingSafeEqual (not available in Edge runtime).
 */
function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
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
      { status: 500 }
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
  if (isTokenAuthApi(pathname)) {
    return NextResponse.next();
  }

  // 3) Internal API lane: machine token auth (never redirects)
  if (isInternalApi(pathname)) {
    const deny = requireMachineToken(req);
    if (deny) return deny;
    return NextResponse.next();
  }

  // 4) Everything else: session auth (NextAuth JWT)
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
