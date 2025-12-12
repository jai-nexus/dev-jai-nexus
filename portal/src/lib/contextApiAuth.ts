// portal/src/lib/contextApiAuth.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Require a Context API key for /api/repos[...] endpoints.
 *
 * Expects:
 *   Authorization: Bearer <JAI_CONTEXT_API_KEY>
 *
 * Returns:
 *   - { ok: true } if valid or auth disabled (for local dev)
 *   - { ok: false, errorResponse: NextResponse } if unauthorized
 */
export function requireContextApiAuth(req: NextRequest): {
  ok: boolean;
  errorResponse?: NextResponse;
} {
  const expected = process.env.JAI_CONTEXT_API_KEY;

  // Allow local dev without key (but warn loudly)
  if (!expected) {
    console.warn("[ContextAPI] ⚠️ JAI_CONTEXT_API_KEY not set — auth disabled (dev mode)");
    return { ok: true };
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const isBearer = authHeader.toLowerCase().startsWith("bearer ");
  const token = isBearer ? authHeader.slice("bearer ".length).trim() : "";

  const ok = !!token && token === expected;

  if (!ok) {
    console.warn("[ContextAPI] 🚫 Unauthorized Context API request", {
      hasHeader: !!authHeader,
      headerSample: authHeader.slice(0, 16),
    });

    const errorResponse = NextResponse.json(
      { error: "Unauthorized: invalid context API key" },
      { status: 401 }
    );

    return { ok: false, errorResponse };
  }

  return { ok: true };
}
