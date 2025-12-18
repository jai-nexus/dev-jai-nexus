// portal/src/lib/sotWorkPackets.ts
import { prisma } from "@/lib/prisma";
import type { Prisma, WorkPacket } from "../../prisma/generated/prisma";

export type WorkPacketSotKind =
  | "WORK_PACKET_CREATED"
  | "WORK_PACKET_UPDATED"
  | "WORK_PACKET_STATUS_CHANGED";

type EmitArgs = {
  kind: WorkPacketSotKind;
  summary: string;
  nhId: string;
  repoId?: number | null;
  payload?: Prisma.InputJsonValue;
  actor?: { email?: string | null; name?: string | null } | null;
};

export async function emitWorkPacketSotEvent(args: EmitArgs) {
  const { kind, summary, nhId, repoId, payload, actor } = args;

  return prisma.sotEvent.create({
    data: {
      ts: new Date(),
      source: "dev-portal",
      kind,
      nhId,
      summary,
      payload:
        payload ??
        ({
          actor: actor ?? null,
        } satisfies Prisma.InputJsonObject),
      repoId: repoId ?? null,
    },
  });
}

type DiffKey =
  | "nhId"
  | "title"
  | "status"
  | "ac"
  | "plan"
  | "githubIssueUrl"
  | "githubPrUrl"
  | "verificationUrl"
  | "repoId";

type JsonPrimitive = string | number | boolean | null;

function toJsonPrimitive(v: WorkPacket[DiffKey]): JsonPrimitive {
  if (v === null) return null;
  if (typeof v === "string") return v;
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v;
  // enums come through as strings, but TS doesn’t always narrow cleanly
  return String(v);
}

export function diffWorkPacket(before: WorkPacket, after: WorkPacket) {
  const changes: Record<string, { from: JsonPrimitive; to: JsonPrimitive }> = {};

  const fields: DiffKey[] = [
    "nhId",
    "title",
    "status",
    "ac",
    "plan",
    "githubIssueUrl",
    "githubPrUrl",
    "verificationUrl",
    "repoId",
  ];

  for (const f of fields) {
    const b = before[f];
    const a = after[f];
    if (b !== a) {
      changes[f] = { from: toJsonPrimitive(b), to: toJsonPrimitive(a) };
    }
  }

  const statusChanged =
    before.status !== after.status
      ? { from: String(before.status), to: String(after.status) }
      : null;

  return { changes, statusChanged };
}
