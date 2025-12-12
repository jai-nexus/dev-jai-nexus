// portal/src/lib/internalAuth.ts
import { NextRequest, NextResponse } from "next/server";

const VAR_NAME = "JAI_INTERNAL_API_TOKEN";

export function assertInternalToken(req: NextRequest):
  | { ok: true }
  | { ok: false; response: NextResponse } {
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

  const token = req.headers.get("x-jai-internal-token");

  if (!token || token !== expected) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  return { ok: true };
}
