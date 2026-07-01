import "server-only";

import { prisma } from "@/lib/prisma";

import {
  buildMotionIntakeRecordFromDraft,
  MOTION_INTAKE_NON_AUTHORIZATIONS,
} from "./motion-intake";
import type {
  EvidencePointer,
  MotionIntakeDraft,
  MotionIntakeRecord,
  MotionIntakeState,
  MotionIntakeTargetThread,
} from "./types";

type MotionIntakeRecordRow = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  proposer: string;
  targetThread: string;
  repoTarget: string;
  purpose: string;
  scope: string;
  requestedOutcome: string;
  risks: string;
  constraints: string;
  evidencePointers: unknown;
  nonAuthorizations: unknown;
  intakeState: string;
  authorityState: string;
  advisoryOnly: boolean;
  safeAdvisoryMessage: string;
};

export async function persistMotionIntakeRecord(
  record: MotionIntakeRecord,
): Promise<MotionIntakeRecord> {
  try {
    await prisma.$executeRaw`
      INSERT INTO "MotionIntakeRecord" (
        "id",
        "title",
        "proposer",
        "targetThread",
        "repoTarget",
        "purpose",
        "scope",
        "requestedOutcome",
        "risks",
        "constraints",
        "evidencePointers",
        "nonAuthorizations",
        "intakeState",
        "authorityState",
        "advisoryOnly",
        "safeAdvisoryMessage"
      )
      VALUES (
        ${record.id},
        ${record.title},
        ${record.proposer},
        ${record.targetThread},
        ${record.repoTarget},
        ${record.purpose},
        ${record.scope},
        ${record.requestedOutcome},
        ${record.risks},
        ${record.constraints},
        ${JSON.stringify(record.evidencePointers)}::jsonb,
        ${JSON.stringify(record.nonAuthorizations)}::jsonb,
        ${record.intakeState},
        'non_authoritative',
        true,
        ${record.safeAdvisoryMessage}
      )
    `;

    return {
      ...record,
      safeAdvisoryMessage:
        "Persisted motion intake record is durable advisory metadata only.",
    };
  } catch {
    return {
      ...record,
      intakeState: "draft",
      authorityState: "non_authoritative",
      advisoryOnly: true,
      safeAdvisoryMessage:
        "Motion intake persistence is blocked; table or database access is unavailable. Record remains non-authoritative.",
    };
  }
}

export async function listRecentMotionIntakeRecords(
  limit = 5,
): Promise<MotionIntakeRecord[]> {
  try {
    const safeLimit = Math.max(1, Math.min(limit, 20));
    const rows = await prisma.$queryRaw<MotionIntakeRecordRow[]>`
      SELECT
        "id",
        "createdAt",
        "updatedAt",
        "title",
        "proposer",
        "targetThread",
        "repoTarget",
        "purpose",
        "scope",
        "requestedOutcome",
        "risks",
        "constraints",
        "evidencePointers",
        "nonAuthorizations",
        "intakeState",
        "authorityState",
        "advisoryOnly",
        "safeAdvisoryMessage"
      FROM "MotionIntakeRecord"
      ORDER BY "createdAt" DESC
      LIMIT ${safeLimit}
    `;

    return rows.map(rowToRecord);
  } catch {
    return [createPersistenceBlockedPreviewRecord()];
  }
}

export function buildPersistableMotionIntakeRecord(
  draft: MotionIntakeDraft,
): MotionIntakeRecord {
  return buildMotionIntakeRecordFromDraft({ draft });
}

function rowToRecord(row: MotionIntakeRecordRow): MotionIntakeRecord {
  return {
    id: row.id,
    title: row.title,
    proposer: row.proposer,
    targetThread: readTargetThread(row.targetThread),
    repoTarget: row.repoTarget,
    purpose: row.purpose,
    scope: row.scope,
    requestedOutcome: row.requestedOutcome,
    risks: row.risks,
    constraints: row.constraints,
    evidencePointers: readEvidencePointers(row.evidencePointers),
    nonAuthorizations: readStringArray(row.nonAuthorizations),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    intakeState: readIntakeState(row.intakeState),
    authorityState: "non_authoritative",
    advisoryOnly: true,
    safeAdvisoryMessage: row.safeAdvisoryMessage,
  };
}

function createPersistenceBlockedPreviewRecord(): MotionIntakeRecord {
  return {
    id: "motion-intake-persistence-blocked-preview",
    title: "Motion intake persistence boundary preview",
    proposer: "manual_operator",
    targetThread: "JAI_CONTROL_THREAD",
    repoTarget: "dev-jai-nexus",
    purpose: "Show that durable motion intake persistence is unavailable.",
    scope: "Persistence fallback preview only.",
    requestedOutcome:
      "Apply the MotionIntakeRecord migration before expecting durable intake records.",
    risks: "Operator could mistake unavailable persistence for durable state.",
    constraints: "Preview remains non-authoritative.",
    evidencePointers: [],
    nonAuthorizations: [...MOTION_INTAKE_NON_AUTHORIZATIONS],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    intakeState: "draft",
    authorityState: "non_authoritative",
    advisoryOnly: true,
    safeAdvisoryMessage:
      "No durable motion intake persistence exists until the migration is applied.",
  };
}

function readTargetThread(value: string): MotionIntakeTargetThread {
  if (
    value === "JAI_CONTROL_THREAD" ||
    value === "JAI_ORCHESTRATOR_NEXUS" ||
    value === "JAI_DEV_JAI_NEXUS" ||
    value === "JAI_AUDIT_NEXUS" ||
    value === "JAI_FORMAT" ||
    value === "JAI_REPO_GENERIC"
  ) {
    return value;
  }
  return "JAI_CONTROL_THREAD";
}

function readIntakeState(value: string): MotionIntakeState {
  if (
    value === "draft" ||
    value === "staged" ||
    value === "selected" ||
    value === "archived"
  ) {
    return value;
  }
  return "draft";
}

function readEvidencePointers(value: unknown): EvidencePointer[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is EvidencePointer =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as EvidencePointer).id === "string" &&
      typeof (item as EvidencePointer).ref === "string",
  );
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export const motionIntakeRepository = {
  create: persistMotionIntakeRecord,
  listRecent: listRecentMotionIntakeRecords,
};
