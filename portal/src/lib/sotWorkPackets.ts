import { prisma } from "@/lib/prisma";
import type { Prisma, WorkPacket, WorkPacketStatus } from "../../prisma/generated/prisma";
import { assertSotEventV01 } from "@/lib/contracts/sotEventV01";

type JsonScalar = string | number | boolean;
type JsonChange = { from: JsonScalar; to: JsonScalar };

// minimal “db-like” type for either prisma or tx
type DbLike = {
  sotEvent: {
    create: (args: Prisma.SotEventCreateArgs) => Promise<unknown>;
  };
};

export type WorkPacketActor = {
  email: string | null;
  name: string | null;
};

export type WorkPacketDiff = {
  changes: Record<string, JsonChange>;
  nonStatusChanges: Record<string, JsonChange>;
  statusChanged: { from: WorkPacketStatus; to: WorkPacketStatus } | null;
};

function scalar(v: unknown): JsonScalar {
  if (v === null || v === undefined) return "(null)";
  if (typeof v === "string") return v;
  if (typeof v === "number") return Number.isFinite(v) ? v : "(nan)";
  if (typeof v === "boolean") return v;
  return String(v);
}

function pushChange(
  changes: Record<string, JsonChange>,
  key: string,
  from: unknown,
  to: unknown,
) {
  const a = scalar(from);
  const b = scalar(to);
  if (a === b) return;
  changes[key] = { from: a, to: b };
}

export function diffWorkPacket(before: WorkPacket, after: WorkPacket): WorkPacketDiff {
  const changes: Record<string, JsonChange> = {};

  pushChange(changes, "nhId", before.nhId, after.nhId);
  pushChange(changes, "title", before.title, after.title);
  pushChange(changes, "status", before.status, after.status);
  pushChange(changes, "ac", before.ac, after.ac);
  pushChange(changes, "plan", before.plan, after.plan);
  pushChange(changes, "githubIssueUrl", before.githubIssueUrl, after.githubIssueUrl);
  pushChange(changes, "githubPrUrl", before.githubPrUrl, after.githubPrUrl);
  pushChange(changes, "verificationUrl", before.verificationUrl, after.verificationUrl);
  pushChange(changes, "repoId", before.repoId, after.repoId);

  const statusChanged =
    before.status !== after.status ? { from: before.status, to: after.status } : null;

  const nonStatusChanges: Record<string, JsonChange> = {};
  for (const [k, v] of Object.entries(changes)) {
    if (k === "status") continue;
    nonStatusChanges[k] = v;
  }

  return { changes, nonStatusChanges, statusChanged };
}

export type EmitWorkPacketSotEventArgs = {
  db?: DbLike; // prisma or tx
  ts?: Date;

  source?: string;
  kind: "WORK_PACKET_CREATED" | "WORK_PACKET_UPDATED" | "WORK_PACKET_STATUS_CHANGED";
  summary: string;

  nhId: string;
  repoId: number | null;

  workPacket: { id: number; nhId: string };
  actor: WorkPacketActor;

  mutationId: string;
  data?: Prisma.InputJsonValue;
};

export async function emitWorkPacketSotEvent(args: EmitWorkPacketSotEventArgs) {
  const db = args.db ?? prisma;

  const payload: Prisma.InputJsonValue = {
    schema: "work-packet-sot-0.1",
    mutationId: args.mutationId,
    workPacket: args.workPacket,
    actor: {
      email: args.actor.email ?? "",
      name: args.actor.name ?? "",
    },
    data: args.data ?? {},
  };

  await db.sotEvent.create({
    data: {
      ts: args.ts ?? new Date(),
      source: args.source ?? "jai-work-ui",
      kind: args.kind,
      nhId: args.nhId,
      summary: args.summary,
      payload,
      repoId: args.repoId ?? null,

      // ✅ Stable anchor for streams, independent of nhId edits
      workPacketId: args.workPacket.id,
    },
  });
}
