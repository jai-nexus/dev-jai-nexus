// portal/src/lib/contextApiAuth.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const HEADER_NAME = "x-jai-context-key";

type AuthResult =
  | { ok: true; errorResponse: null }
  | { ok: false; errorResponse: NextResponse };

// Small helper so we can compare without revealing the key itself
function hashPreview(value: string | undefined | null): string {
  if (!value) return "none";
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex")
    .slice(0, 8); // first 8 chars is enough for debugging
}

export function requireContextApiAuth(req: NextRequest): AuthResult {
  const rawExpected = process.env.JAI_CONTEXT_API_KEY;

  if (!rawExpected) {
    console.warn(
      "[ContextAPI] JAI_CONTEXT_API_KEY not set; allowing all requests.",
    );
    return { ok: true, errorResponse: null };
  }

  const rawProvided = req.headers.get(HEADER_NAME);

  const expected = rawExpected.trim();
  const provided = rawProvided?.trim() ?? "";

  const match = provided === expected;

  console.log("[ContextAPI] key check", {
    hasHeader: Boolean(rawProvided),
    headerLength: rawProvided?.length ?? 0,
    hasEnv: Boolean(rawExpected),
    envLength: rawExpected.length,
    providedHash: hashPreview(rawProvided),
    expectedHash: hashPreview(rawExpected),
    match,
  });

  if (!rawProvided) {
    return {
      ok: false,
      errorResponse: NextResponse.json(
        { error: "Missing Context API key", header: HEADER_NAME },
        { status: 401 },
      ),
    };
  }

  if (!match) {
    return {
      ok: false,
      errorResponse: NextResponse.json(
        { error: "Invalid Context API key" },
        { status: 401 },
      ),
    };
  }

  return { ok: true, errorResponse: null };
}
