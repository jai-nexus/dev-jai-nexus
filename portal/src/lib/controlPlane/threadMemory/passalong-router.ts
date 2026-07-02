import {
  PASSALONG_RECORDS,
  SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS,
  SANDBOX_POSTURE,
  SANDBOX_TARGET_OPTIONS,
  THREAD_MEMORY_AUTHORITY_FINDINGS,
  THREAD_MEMORY_NON_AUTHORIZATIONS,
  THREAD_MEMORY_RECORDS,
} from "./sample-data";
import type {
  ControlThreadId,
  CopyablePassalongPacket,
  PassalongQueue,
  PassalongRecord,
  RouteRecommendation,
  SandboxTargetOption,
  ThreadMemoryRecord,
} from "./types";

function getThreadLabel(threadId: ControlThreadId): string {
  return (
    THREAD_MEMORY_RECORDS.find((record) => record.threadId === threadId)
      ?.threadLabel ?? threadId
  );
}

function buildQueue(
  threadId: ControlThreadId,
  records: PassalongRecord[],
  selector: "sourceThread" | "targetThread",
): PassalongQueue {
  return {
    threadId,
    threadLabel: getThreadLabel(threadId),
    records: records.filter((record) => record[selector] === threadId),
  };
}

function recommendStatusTransition(record: PassalongRecord): string {
  if (record.status === "queued") {
    return "queued -> needs_review, by manual operator review only";
  }

  if (record.status === "needs_review") {
    return "needs_review -> recommended, if CONTROL_THREAD agrees manually";
  }

  if (record.status === "recommended") {
    return "recommended -> held, unless CONTROL_THREAD explicitly approves manual passalong";
  }

  if (record.status === "held") {
    return "held -> held; activation remains blocked";
  }

  if (record.status === "archived") {
    return "archived -> archived; reference only";
  }

  return `${record.status} -> ${record.status}; no automatic transition`;
}

function formatLines(title: string, lines: string[]): string[] {
  return [title, ...lines.map((line) => `- ${line}`)];
}

export function getThreadMemoryRecords(): ThreadMemoryRecord[] {
  return THREAD_MEMORY_RECORDS;
}

export function getPassalongRecords(): PassalongRecord[] {
  return PASSALONG_RECORDS;
}

export function buildInboxQueue(threadId: ControlThreadId): PassalongQueue {
  return buildQueue(threadId, PASSALONG_RECORDS, "targetThread");
}

export function buildOutboxQueue(threadId: ControlThreadId): PassalongQueue {
  return buildQueue(threadId, PASSALONG_RECORDS, "sourceThread");
}

export function buildAllInboxQueues(): PassalongQueue[] {
  return THREAD_MEMORY_RECORDS.map((record) => buildInboxQueue(record.threadId));
}

export function buildAllOutboxQueues(): PassalongQueue[] {
  return THREAD_MEMORY_RECORDS.map((record) => buildOutboxQueue(record.threadId));
}

export function findPassalongById(
  passalongId: string,
): PassalongRecord | undefined {
  return PASSALONG_RECORDS.find(
    (record) => record.passalongId === passalongId,
  );
}

export function getSandboxTargetOptions(): SandboxTargetOption[] {
  return SANDBOX_TARGET_OPTIONS;
}

export function getAuthorityFindings(): readonly string[] {
  return THREAD_MEMORY_AUTHORITY_FINDINGS;
}

export function getThreadMemoryNonAuthorizations(): readonly string[] {
  return THREAD_MEMORY_NON_AUTHORIZATIONS;
}

export function buildRouteRecommendation(
  record: PassalongRecord,
): RouteRecommendation {
  const sandboxTarget = record.sandboxTargetId
    ? SANDBOX_TARGET_OPTIONS.find((target) => target.id === record.sandboxTargetId)
    : undefined;
  const importPosture = record.sandboxImportAdoptionPosture
    ? `${record.sandboxImportAdoptionPosture}: ${
        SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS[
          record.sandboxImportAdoptionPosture
        ]
      }`
    : null;

  return {
    passalongId: record.passalongId,
    recommendedSource: getThreadLabel(record.sourceThread),
    recommendedTarget: getThreadLabel(record.targetThread),
    recommendedStatusTransition: recommendStatusTransition(record),
    requestedDecision: record.requestedDecision,
    evidencePointerSummary:
      record.evidencePointers.length > 0
        ? record.evidencePointers.join("; ")
        : "No evidence pointers supplied.",
    sandboxPosture: sandboxTarget
      ? `${sandboxTarget.label}: ${sandboxTarget.posture}. ${SANDBOX_POSTURE.join(
          " ",
        )}`
      : null,
    importAdoptionPosture: record.sandboxOutputInvolved
      ? importPosture ??
        "Sandbox output involved; CONTROL_THREAD import/discard decision required."
      : importPosture,
    authorityBoundary: record.authorityBoundary,
    nonAuthorizations: record.nonAuthorizations,
    manualNextStep:
      "Operator may manually copy this packet into CONTROL_THREAD or hold it; no system sends, routes, executes, imports, or mutates anything.",
    advisoryOnly: true,
  };
}

export function buildRouteRecommendationText(record: PassalongRecord): string {
  const recommendation = buildRouteRecommendation(record);
  const lines = [
    "ROUTE RECOMMENDATION - ADVISORY ONLY",
    `passalong_id: ${recommendation.passalongId}`,
    `recommended_source: ${recommendation.recommendedSource}`,
    `recommended_target: ${recommendation.recommendedTarget}`,
    `recommended_status_transition: ${recommendation.recommendedStatusTransition}`,
    `requested_decision: ${recommendation.requestedDecision}`,
    `evidence_pointer_summary: ${recommendation.evidencePointerSummary}`,
  ];

  if (recommendation.sandboxPosture) {
    lines.push(`sandbox_posture: ${recommendation.sandboxPosture}`);
  }

  if (recommendation.importAdoptionPosture) {
    lines.push(`import_adoption_posture: ${recommendation.importAdoptionPosture}`);
  }

  lines.push(
    `authority_boundary: ${recommendation.authorityBoundary}`,
    `manual_next_step: ${recommendation.manualNextStep}`,
    "non_authorizations:",
    ...recommendation.nonAuthorizations.map((item) => `- ${item}`),
  );

  return lines.join("\n");
}

export function buildCopyablePassalongPacket(
  record: PassalongRecord,
): CopyablePassalongPacket {
  const recommendationText = buildRouteRecommendationText(record);
  const sandboxTarget = record.sandboxTargetId
    ? SANDBOX_TARGET_OPTIONS.find((target) => target.id === record.sandboxTargetId)
    : undefined;
  const importPosture = record.sandboxImportAdoptionPosture
    ? `${record.sandboxImportAdoptionPosture}: ${
        SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS[
          record.sandboxImportAdoptionPosture
        ]
      }`
    : null;

  return [
    "JAI_CONTROL_THREAD PASSALONG PACKET - COPYABLE TEXT ONLY",
    `passalong_id: ${record.passalongId}`,
    `source_thread: ${getThreadLabel(record.sourceThread)}`,
    `target_thread: ${getThreadLabel(record.targetThread)}`,
    `scope: ${record.scope}`,
    `mode: ${record.mode}`,
    `summary: ${record.summary}`,
    "evidence_pointers:",
    ...record.evidencePointers.map((pointer) => `- ${pointer}`),
    `requested_decision: ${record.requestedDecision}`,
    `status: ${record.status}`,
    "",
    recommendationText,
    "",
    `authority_boundary: ${record.authorityBoundary}`,
    ...(sandboxTarget
      ? formatLines("sandbox_posture:", [
          `${sandboxTarget.label}: ${sandboxTarget.posture}`,
          ...SANDBOX_POSTURE,
        ])
      : []),
    ...(importPosture
      ? [`import_adoption_posture: ${importPosture}`]
      : []),
    "non_authorizations:",
    ...record.nonAuthorizations.map((item) => `- ${item}`),
    "ZERO GATES GRANTED",
  ].join("\n");
}
