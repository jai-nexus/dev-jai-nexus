import { NextResponse } from "next/server";

import { PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS } from "@/lib/controlPlane/threadMemory";
import { updatePersistedPassalongRecord } from "@/lib/controlPlane/threadMemory/passalong-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ passalongId: string }> },
) {
  const { passalongId } = await context.params;
  const body = await parseBody(request);
  const result = await updatePersistedPassalongRecord(passalongId, body);

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

async function parseBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function GET() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Direct passalong mutation endpoint supports PATCH only. It does not send, route, execute, or approve passalongs.",
      nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
    },
    { status: 405 },
  );
}
