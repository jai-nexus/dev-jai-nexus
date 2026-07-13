import { NextResponse } from "next/server";

import type { PassalongWriteResult } from "@/lib/controlPlane/routeContracts/adapters/passalong";
import {
  decidePassalongDetailMethodNotAllowed,
  decidePassalongDetailPatch,
} from "@/lib/controlPlane/routeDecisions/passalongRouteDecisions";
import { updatePersistedPassalongRecord } from "@/lib/controlPlane/threadMemory/passalong-persistence";
import type { PersistedPassalongRecord } from "@/lib/controlPlane/threadMemory/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ passalongId: string }> },
) {
  const { passalongId } = await context.params;
  const body = await parseBody(request);
  const writeResult = await updatePersistedPassalongRecord(passalongId, body);
  const normalizedWriteResult = normalizePassalongWriteResult(writeResult);
  const decision = decidePassalongDetailPatch(normalizedWriteResult);

  return NextResponse.json(decision.body, { status: decision.status });
}

function normalizePassalongWriteResult(
  writeResult: Awaited<ReturnType<typeof updatePersistedPassalongRecord>>,
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

async function parseBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function GET() {
  const decision = decidePassalongDetailMethodNotAllowed();
  return NextResponse.json(decision.body, { status: decision.status });
}
