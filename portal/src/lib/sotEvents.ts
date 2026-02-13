// portal/src/lib/sotEvents.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { parseSotTimestamp } from "@/lib/time";
import crypto from "node:crypto";

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

  const ts = parseSotTimestamp(input.ts);
  if (!ts) {
    throw new Error(`recordSotEvent: invalid ts "${input.ts}"`);
  }

  let repoId = input.repoId;
  let domainId = input.domainId;

  if (!repoId && input.repoName) {
    const repo = await prisma.repo.findUnique({
      where: { name: input.repoName },
    });
    repoId = repo?.id;
  }

  if (!domainId && input.domainName) {
    const domain = await prisma.domain.findUnique({
      where: { domain: input.domainName },
    });
    domainId = domain?.id;
  }

  return prisma.sotEvent.create({
    data: {
      eventId: crypto.randomUUID(),
      ts,
      source: input.source,
      kind: input.kind,
      nhId: input.nhId ?? "",
      summary: input.summary,
      payload: input.payload ?? Prisma.DbNull,
      repoId: repoId ?? null,
      domainId: domainId ?? null,
    },
  });
}
