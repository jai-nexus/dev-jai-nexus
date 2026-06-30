import "server-only";

import { prisma } from "@/lib/prisma";

import type {
  AdvisoryRatificationSummary,
  DeliberationParticipantOutput,
  DeliberationRunHistoryRecord,
  DeliberationRunPersistenceStatus,
  DeliberationRunSourceMode,
  EvidencePointer,
  ProviderConnectorSafeStatus,
} from "./types";

type DeliberationRunHistoryRow = {
  id: string;
  createdAt: Date;
  motionId: string;
  motionTitle: string;
  createdBy: string;
  sourceMode: string;
  connectorStatus: unknown;
  participantOutputs: unknown;
  aggregateAdvisoryRatification: unknown;
  evidencePointers: unknown;
  nonAuthorizations: unknown;
  persistenceStatus: string;
  safeAdvisoryMessage: string;
};

export async function persistDeliberationRunHistory(
  record: DeliberationRunHistoryRecord,
): Promise<DeliberationRunHistoryRecord> {
  try {
    await prisma.$executeRaw`
      INSERT INTO "DeliberationRunHistory" (
        "id",
        "motionId",
        "motionTitle",
        "createdBy",
        "sourceMode",
        "connectorStatus",
        "participantOutputs",
        "aggregateAdvisoryRatification",
        "evidencePointers",
        "nonAuthorizations",
        "persistenceStatus",
        "safeAdvisoryMessage"
      )
      VALUES (
        ${record.id},
        ${record.motionId},
        ${record.motionTitle},
        ${record.createdBy},
        ${record.sourceMode},
        ${JSON.stringify(record.connectorStatusSummary)}::jsonb,
        ${JSON.stringify(record.participantOutputs)}::jsonb,
        ${JSON.stringify(record.aggregateAdvisoryRatification)}::jsonb,
        ${JSON.stringify(record.evidencePointers)}::jsonb,
        ${JSON.stringify(record.nonAuthorizations)}::jsonb,
        'persisted',
        ${record.safeAdvisoryMessage}
      )
    `;

    return {
      ...record,
      persistenceStatus: "persisted",
      safeAdvisoryMessage:
        "Manual deliberation run history persisted as advisory-only metadata.",
    };
  } catch {
    return {
      ...record,
      persistenceStatus: "blocked",
      safeAdvisoryMessage:
        "Deliberation run history persistence is blocked; table or database access is unavailable. Run remains staged and non-authorizing.",
    };
  }
}

export async function listRecentDeliberationRunHistory(
  limit = 5,
): Promise<DeliberationRunHistoryRecord[]> {
  try {
    const safeLimit = Math.max(1, Math.min(limit, 20));
    const rows = await prisma.$queryRaw<DeliberationRunHistoryRow[]>`
      SELECT
        "id",
        "createdAt",
        "motionId",
        "motionTitle",
        "createdBy",
        "sourceMode",
        "connectorStatus",
        "participantOutputs",
        "aggregateAdvisoryRatification",
        "evidencePointers",
        "nonAuthorizations",
        "persistenceStatus",
        "safeAdvisoryMessage"
      FROM "DeliberationRunHistory"
      ORDER BY "createdAt" DESC
      LIMIT ${safeLimit}
    `;

    return rows.map(rowToRecord);
  } catch {
    return [createPersistenceBlockedPreviewRecord()];
  }
}

export function buildDeliberationRunHistoryRecord({
  motionId,
  motionTitle,
  sourceMode,
  connectorStatusSummary,
  participantOutputs,
  aggregateAdvisoryRatification,
  evidencePointers,
  nonAuthorizations,
}: {
  motionId: string;
  motionTitle: string;
  sourceMode: DeliberationRunSourceMode;
  connectorStatusSummary: ProviderConnectorSafeStatus;
  participantOutputs: DeliberationParticipantOutput[];
  aggregateAdvisoryRatification: AdvisoryRatificationSummary;
  evidencePointers: EvidencePointer[];
  nonAuthorizations: string[];
}): DeliberationRunHistoryRecord {
  const createdAt = new Date().toISOString();

  return {
    id: `deliberation-run-${motionId}-${Date.now()}`,
    motionId,
    motionTitle,
    createdAt,
    createdBy: "manual_operator",
    sourceMode,
    connectorStatusSummary,
    participantOutputs,
    aggregateAdvisoryRatification,
    evidencePointers,
    nonAuthorizations,
    persistenceStatus: "staged",
    safeAdvisoryMessage:
      "Manual deliberation run staged for persistence; stored records remain advisory only.",
  };
}

function rowToRecord(row: DeliberationRunHistoryRow): DeliberationRunHistoryRecord {
  return {
    id: row.id,
    motionId: row.motionId,
    motionTitle: row.motionTitle,
    createdAt: row.createdAt.toISOString(),
    createdBy: row.createdBy,
    sourceMode: readSourceMode(row.sourceMode),
    connectorStatusSummary:
      row.connectorStatus as ProviderConnectorSafeStatus,
    participantOutputs: row.participantOutputs as DeliberationParticipantOutput[],
    aggregateAdvisoryRatification:
      row.aggregateAdvisoryRatification as AdvisoryRatificationSummary,
    evidencePointers: row.evidencePointers as EvidencePointer[],
    nonAuthorizations: readStringArray(row.nonAuthorizations),
    persistenceStatus: readPersistenceStatus(row.persistenceStatus),
    safeAdvisoryMessage: row.safeAdvisoryMessage,
  };
}

function createPersistenceBlockedPreviewRecord(): DeliberationRunHistoryRecord {
  return {
    id: "deliberation-run-history-persistence-blocked-preview",
    motionId: "preview-only",
    motionTitle: "Persistence boundary preview",
    createdAt: new Date(0).toISOString(),
    createdBy: "manual_operator",
    sourceMode: "persistence_staged",
    connectorStatusSummary: {
      liveInferenceEnabled: false,
      providerConfigured: false,
      providerKeyPresent: false,
      providerName: null,
      modelName: null,
      mode: "provider_disabled",
      advisoryMessage:
        "Persistence table is unavailable in this environment; preview is non-durable.",
    },
    participantOutputs: [],
    aggregateAdvisoryRatification: {
      value: "not_ratified",
      summary:
        "No durable deliberation run history is available until migration is applied.",
      requiredRevisions: [
        "Apply the DeliberationRunHistory migration before expecting durable history.",
      ],
      blockers: ["Persistence unavailable."],
      voteCounts: {
        approve: 0,
        reject: 0,
        abstain: 0,
        revise: 0,
        blocked: 0,
      },
      advisoryOnly: true,
      humanApprovalRequired: true,
      nonAuthorityDisclaimer:
        "Persistence preview is not CONTROL_THREAD approval or route authority.",
    },
    evidencePointers: [],
    nonAuthorizations: [...PERSISTENCE_NON_AUTHORIZATIONS],
    persistenceStatus: "blocked",
    safeAdvisoryMessage:
      "No durable persistence exists until the migration is applied.",
  };
}

const PERSISTENCE_NON_AUTHORIZATIONS = [
  "Stored deliberation is not CONTROL_THREAD approval.",
  "Stored JAI vote is not route authority.",
  "Stored ratification is not final authority.",
  "Stored provider output is not source-of-truth transfer.",
  "Stored evidence pointer is not validation approval.",
  "Stored work-packet draft is not routed work.",
  "Human / CONTROL_THREAD approval remains required.",
  "Persistence does not create execution authority.",
  "Persistence does not create GitHub mutation authority.",
  "Persistence does not create production gate authority.",
  "Persistence does not create source-of-truth authority.",
  "Persistence does not create route authority.",
  "Persistence does not create acceptance authority.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
] as const;

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function readSourceMode(value: string): DeliberationRunSourceMode {
  if (
    value === "mock" ||
    value === "provider" ||
    value === "provider_disabled" ||
    value === "provider_unavailable" ||
    value === "persistence_staged"
  ) {
    return value;
  }
  return "persistence_staged";
}

function readPersistenceStatus(value: string): DeliberationRunPersistenceStatus {
  if (
    value === "persisted" ||
    value === "staged" ||
    value === "preview_only" ||
    value === "blocked"
  ) {
    return value;
  }
  return "blocked";
}

export const deliberationRunHistoryRepository = {
  create: persistDeliberationRunHistory,
  listRecent: listRecentDeliberationRunHistory,
};

export { PERSISTENCE_NON_AUTHORIZATIONS };
