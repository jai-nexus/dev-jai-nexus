// portal/src/lib/sotEvents.ts
import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../prisma/generated/prisma";

export type SotEventEnvelopeV01 = {
  version?: "sot-event-0.1";

  ts: string;
  source: string;
  kind: string;
  summary: string;

  nhId?: string;
  payload?: Prisma.InputJsonValue;

  repoId?: number;
  domainId?: number;
  repoName?: string;
  domainName?: string;

  // Optional: link event stream to a WorkPacket
  workPacketId?: number;
};

export async function recordSotEvent(input: SotEventEnvelopeV01) {
  if (input.version && input.version !== "sot-event-0.1") {
    console.warn(
      `recordSotEvent: unexpected version "${input.version}", expected "sot-event-0.1"`,
    );
  }

  if (!input.ts || !input.source || !input.kind || !input.summary) {
    throw new Error("recordSotEvent: missing ts/source/kind/summary");
  }

  const ts = new Date(input.ts);
  if (Number.isNaN(ts.getTime())) {
    throw new Error(`recordSotEvent: invalid ts "${input.ts}"`);
  }

  let repoId = input.repoId;
  let domainId = input.domainId;
  const workPacketId = input.workPacketId ?? null;

  if (!repoId && input.repoName) {
    const repo = await prisma.repo.findUnique({
      where: { name: input.repoName },
      select: { id: true },
    });
    repoId = repo?.id;
  }

  if (!domainId && input.domainName) {
    const domain = await prisma.domain.findUnique({
      where: { domain: input.domainName },
      select: { id: true },
    });
    domainId = domain?.id;
  }

  const created = await prisma.sotEvent.create({
    data: {
      ts,
      source: input.source,
      kind: input.kind,
      nhId: input.nhId ?? "",
      summary: input.summary,
      payload: input.payload,
      repoId,
      domainId,
      workPacketId,
    },
  });

  return created;
}
