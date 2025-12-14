// portal/src/proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function isPublicPath(pathname: string) {
  // Public page + assets
  if (pathname === "/login") return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;

  // NextAuth must remain public
  if (pathname.startsWith("/api/auth")) return true;

  return false;
}

function isApi(pathname: string) {
  return pathname.startsWith("/api/");
}

function isInternalApi(pathname: string) {
  return pathname.startsWith("/api/internal/");
}

function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes through
  if (isPublicPath(pathname)) return NextResponse.next();

  // Internal API lane: machine token auth (no redirects)
  if (isInternalApi(pathname)) {
    const auth = req.headers.get("authorization") ?? "";
    const bearer = auth.replace(/^Bearer\s+/i, "").trim();

    const expected = process.env.JAI_INTERNAL_API_TOKEN;
    if (!expected || !bearer || bearer !== expected) return unauthorizedJson();

    return NextResponse.next();
  }

  // Everything else: session auth (NextAuth JWT)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // APIs get 401; pages get redirect to /login
    if (isApi(pathname)) return unauthorizedJson();

    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
