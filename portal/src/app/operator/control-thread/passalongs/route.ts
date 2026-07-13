import { NextResponse } from "next/server";

import type {
  PassalongListResult,
  PassalongWriteResult,
} from "@/lib/controlPlane/routeContracts/adapters/passalong";
import {
  decidePassalongCollectionCreate,
  decidePassalongCollectionList,
} from "@/lib/controlPlane/routeDecisions/passalongRouteDecisions";
import { buildPersistedPassalongInput } from "@/lib/controlPlane/threadMemory/passalong-persistence-boundary";
import {
  listPersistedPassalongRecords,
  persistPassalongRecord,
} from "@/lib/controlPlane/threadMemory/passalong-persistence";
import type {
  PassalongRecord,
  PersistedPassalongRecord,
} from "@/lib/controlPlane/threadMemory/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PassalongPersistenceRequestBody {
  passalongRecord?: PassalongRecord;
  input?: unknown;
}

export async function GET() {
  const listResult = await listPersistedPassalongRecords(50);
  const normalizedListResult = listResult.available
    ? ({
        kind: "available",
        records: listResult.records,
        safeMessage: listResult.safeMessage,
      } satisfies PassalongListResult<PersistedPassalongRecord>)
    : ({
        kind: "unavailable",
        records: [],
        safeMessage: listResult.safeMessage,
        errors: [],
      } satisfies PassalongListResult<PersistedPassalongRecord>);
  const decision = decidePassalongCollectionList(normalizedListResult);

  return NextResponse.json(decision.body, { status: decision.status });
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  const candidate = body.passalongRecord
    ? buildPersistedPassalongInput(body.passalongRecord)
    : { ok: true, value: body.input, errors: [] };

  if (!candidate.ok || !candidate.value) {
    const decision = decidePassalongCollectionCreate({ candidate });
    return NextResponse.json(decision.body, { status: decision.status });
  }

  const writeResult = await persistPassalongRecord(candidate.value);
  const normalizedWriteResult = normalizePassalongWriteResult(writeResult);
  const decision = decidePassalongCollectionCreate({
    candidate,
    persistenceResult: normalizedWriteResult,
  });

  return NextResponse.json(decision.body, { status: decision.status });
}

function normalizePassalongWriteResult(
  writeResult: Awaited<ReturnType<typeof persistPassalongRecord>>,
): PassalongWriteResult<PersistedPassalongRecord> {
  if (writeResult.record) {
    return {
      kind: "succeeded",
      record: writeResult.record,
      errors: [],
      safeMessage: writeResult.safeMessage,
    } satisfies PassalongWriteResult<PersistedPassalongRecord>;
  }

  if (writeResult.available) {
    return {
      kind: "failed",
      record: null,
      errors: writeResult.errors,
      safeMessage: writeResult.safeMessage,
    } satisfies PassalongWriteResult<PersistedPassalongRecord>;
  }

  return {
    kind: "unavailable",
    record: null,
    errors: writeResult.errors,
    safeMessage: writeResult.safeMessage,
  } satisfies PassalongWriteResult<PersistedPassalongRecord>;
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
