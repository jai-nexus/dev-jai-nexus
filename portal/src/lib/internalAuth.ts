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
 */
export function assertInternalToken(
  req: NextRequest,
): { ok: true } | { ok: false; response: NextResponse } {
  const expected = process.env[VAR_NAME];

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
  const presented = bearer || legacy;

  if (!presented || !timingSafeEqualString(presented, expected)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true };
}
