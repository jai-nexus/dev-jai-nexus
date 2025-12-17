// portal/src/lib/contextApiAuth.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

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

/**
 * Require a Context API key for /api/repos[...] endpoints.
 *
 * Expects:
 *   Authorization: Bearer <JAI_CONTEXT_API_KEY>
 *
 * Dev behavior:
 *   If JAI_CONTEXT_API_KEY is missing AND NODE_ENV !== "production", auth is bypassed (with warning).
 *
 * Prod behavior:
 *   Missing key is a configuration error (500) — auth is NOT silently disabled.
 */
export function requireContextApiAuth(req: NextRequest): {
  ok: boolean;
  errorResponse?: NextResponse;
} {
  const expected = process.env.JAI_CONTEXT_API_KEY;

  if (!expected) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[ContextAPI] ⚠️ JAI_CONTEXT_API_KEY not set — auth disabled (dev only)",
      );
      return { ok: true };
    }

    return {
      ok: false,
      errorResponse: NextResponse.json(
        {
          error: "Context API key not configured",
          detail: "Missing JAI_CONTEXT_API_KEY env var",
        },
        { status: 500 },
      ),
    };
  }

  const token = readBearer(req);

  const ok = !!token && timingSafeEqualString(token, expected);

  if (!ok) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ContextAPI] 🚫 Unauthorized request", {
        hasAuthHeader: !!req.headers.get("authorization"),
      });
    }

    return {
      ok: false,
      errorResponse: NextResponse.json(
        { error: "Unauthorized: invalid context API key" },
        { status: 401 },
      ),
    };
  }

  return { ok: true };
}
