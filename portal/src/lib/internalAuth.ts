// portal/src/lib/internalAuth.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const VAR_NAME = "JAI_INTERNAL_API_TOKEN";

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
 * Internal auth for machine endpoints.
 *
 * Accepts either:
 *  - Authorization: Bearer <token>        (preferred)
 *  - x-jai-internal-token: <token>        (legacy/back-compat)
 *
 * Notes:
 * - Uses timing-safe compare to avoid token leak via timing.
 * - In dev, you can optionally enable minimal diagnostics by setting:
 *     JAI_INTERNAL_AUTH_DEBUG=1
 *   This logs only lengths + short prefixes (never full tokens).
 */
export function assertInternalToken(
  req: NextRequest,
): { ok: true } | { ok: false; response: NextResponse } {
  const expected = (process.env[VAR_NAME] ?? "").trim();

  if (!expected) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Internal API token not configured",
          detail: `Missing ${VAR_NAME} env var`,
        },
        { status: 500 },
      ),
    };
  }

  const bearer = readBearer(req);
  const legacy = (req.headers.get("x-jai-internal-token") ?? "").trim();
  const presented = (bearer || legacy).trim();

  // Optional debug (safe: no full secrets)
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.JAI_INTERNAL_AUTH_DEBUG === "1"
  ) {
    console.log("[internalAuth]", {
      expectedLen: expected.length,
      bearerLen: bearer.length,
      legacyLen: legacy.length,
      presentedLen: presented.length,
      bearerPrefix: bearer ? bearer.slice(0, 10) : "",
      legacyPrefix: legacy ? legacy.slice(0, 10) : "",
    });
  }

  if (!presented || !timingSafeEqualString(presented, expected)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true };
}
