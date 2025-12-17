// portal/src/proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import crypto from "node:crypto";

function isAuthPublic(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/api/auth");
}

function isStaticPublic(pathname: string) {
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/_next/static")) return true;
  if (pathname.startsWith("/_next/image")) return true;

  if (
    process.env.NODE_ENV !== "production" &&
    pathname.startsWith("/_next/webpack-hmr")
  ) {
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

// These are NOT /api/internal/*, but they do their own token auth.
// Let them reach the route handler.
function isTokenAuthApi(pathname: string) {
  return pathname === "/api/agents/commit" || pathname === "/api/sot-events";
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

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Public routes
  if (isAuthPublic(pathname) || isStaticPublic(pathname)) {
    return NextResponse.next();
  }

  // Allow “token-auth APIs” to enforce auth in-route
  if (isTokenAuthApi(pathname)) {
    return NextResponse.next();
  }

  // Internal API lane: machine token auth (never redirects)
  if (isInternalApi(pathname)) {
    const auth = req.headers.get("authorization") ?? "";
    const bearer = auth.replace(/^Bearer\s+/i, "").trim();

    const expected = process.env.JAI_INTERNAL_API_TOKEN ?? "";
    if (!expected || !bearer || !timingSafeEqualString(bearer, expected)) {
      return unauthorizedJson();
    }

    return NextResponse.next();
  }

  // Everything else: session auth (NextAuth JWT)
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
