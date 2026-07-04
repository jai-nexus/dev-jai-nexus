import { NextResponse } from "next/server";

import {
  buildPersistedPassalongInput,
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
} from "@/lib/controlPlane/threadMemory";
import {
  listPersistedPassalongRecords,
  persistPassalongRecord,
} from "@/lib/controlPlane/threadMemory/passalong-persistence";
import type { PassalongRecord } from "@/lib/controlPlane/threadMemory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PassalongPersistenceRequestBody {
  passalongRecord?: PassalongRecord;
  input?: unknown;
}

export async function GET() {
  const result = await listPersistedPassalongRecords(50);
  return NextResponse.json({
    ok: result.available,
    records: result.records,
    persistence: {
      available: result.available,
      safeMessage: result.safeMessage,
    },
    nonAuthorizations: result.nonAuthorizations,
  });
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  const candidate = body.passalongRecord
    ? buildPersistedPassalongInput(body.passalongRecord)
    : { ok: true, value: body.input, errors: [] };

  if (!candidate.ok || !candidate.value) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Passalong field boundary validation blocked persistence; no record was saved.",
        errors: candidate.errors,
        nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
      },
      { status: 400 },
    );
  }

  const result = await persistPassalongRecord(candidate.value);
  return NextResponse.json(
    {
      ok: result.available && Boolean(result.record),
      record: result.record,
      errors: result.errors,
      persistence: {
        available: result.available,
        safeMessage: result.safeMessage,
      },
      nonAuthorizations: result.nonAuthorizations,
    },
    { status: result.record ? 200 : 400 },
  );
}

async function parseBody(
  request: Request,
): Promise<PassalongPersistenceRequestBody> {
  try {
    const value = (await request.json()) as PassalongPersistenceRequestBody;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}
