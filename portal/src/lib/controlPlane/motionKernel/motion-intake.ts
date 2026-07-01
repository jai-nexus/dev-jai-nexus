import type {
  EvidencePointer,
  JaiRoleSlotId,
  Motion,
  MotionIntakeDraft,
  MotionIntakeRecord,
} from "./types";

export const MOTION_INTAKE_NON_AUTHORIZATIONS = [
  "Persisted motion is not approved work.",
  "Persisted motion is not routed work.",
  "Persisted motion is not CONTROL_THREAD acceptance.",
  "Persisted motion is not autonomous execution.",
  "Persisted target thread is not route authority.",
  "Persisted repo target is not repo execution authority.",
  "Persisted evidence pointer is not validation approval.",
  "Selected persisted motion basis is not final authority.",
  "A composed motion is not approved work.",
  "A submitted motion is not routed work.",
  "Motion intake is not CONTROL_THREAD acceptance.",
  "Motion composition is not autonomous execution.",
  "Thread selection is not route authority.",
  "Repo-thread target is not repo execution authority.",
  "Evidence pointer is not validation approval.",
  "Draft work packet is not routed work.",
  "Draft route packet is not CONTROL_THREAD acceptance.",
  "Closeout placeholder is not closeout.",
  "CONTROL_THREAD remains authority.",
  "Linear remains a temporary mirror only.",
  "Human / CONTROL_THREAD approval remains required before proceeding.",
  "Draft output is copyable planning text only.",
  "Draft output is non-executing.",
  "Manual deliberation is operator-triggered only.",
  "Native motion selection does not auto-run deliberation.",
  "Native motion selection does not auto-route work.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden background execution.",
  "No automatic route execution.",
  "No work-packet execution.",
  "No auto-submit to agents.",
  "No auto-run deliberation.",
  "No auto-route work.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
  "No final CONTROL_THREAD approval by persisted motion.",
  "No final CONTROL_THREAD approval by composed motion.",
  "No final CONTROL_THREAD approval by motion intake.",
  "No final CONTROL_THREAD approval by selected motion basis.",
  "No route authority by persisted motion.",
  "No route authority by target thread selection.",
  "No route authority by repo-thread target.",
  "No execution authority by persisted motion.",
  "No execution authority by target thread selection.",
  "No execution authority by repo-thread target.",
  "No production gate authority by persisted motion.",
  "No production gate authority by composed motion.",
  "No production gate authority by selected motion basis.",
] as const;

export const defaultMotionIntakeDraft: MotionIntakeDraft = {
  title: "Native operator motion draft",
  proposer: "manual_operator",
  targetThread: "JAI_CONTROL_THREAD",
  repoTarget: "dev-jai-nexus",
  purpose: "Compose a local motion for manual control-plane review.",
  scope: "Motion intake draft only.",
  requestedOutcome:
    "Stage a motion basis for manual deliberation and copyable draft planning.",
  risks:
    "Motion composition could be mistaken for routed or approved work if boundaries are hidden.",
  constraints:
    "No autonomous execution, no GitHub mutation, no production gates, and CONTROL_THREAD remains authority.",
  evidencePointers:
    "Operator note: Native motion intake composer request and local draft basis.",
  nonAuthorizations: MOTION_INTAKE_NON_AUTHORIZATIONS.join("\n"),
};

export function normalizeMotionIntakeDraft(
  draft: MotionIntakeDraft,
): MotionIntakeDraft {
  return {
    title: readText(draft.title, "Untitled native motion draft"),
    proposer: readText(draft.proposer, "manual_operator"),
    targetThread: draft.targetThread,
    repoTarget: readText(draft.repoTarget, "dev-jai-nexus"),
    purpose: readText(draft.purpose, "No purpose provided."),
    scope: readText(draft.scope, "No scope provided."),
    requestedOutcome: readText(
      draft.requestedOutcome,
      "No requested outcome provided.",
    ),
    risks: readText(draft.risks, "No risks provided."),
    constraints: readText(draft.constraints, "No constraints provided."),
    evidencePointers: readText(
      draft.evidencePointers,
      "Operator note: No evidence pointer provided.",
    ),
    nonAuthorizations: readText(
      draft.nonAuthorizations,
      MOTION_INTAKE_NON_AUTHORIZATIONS.join("\n"),
    ),
  };
}

export function buildComposedMotionBasis({
  draft,
  composedAt,
}: {
  draft: MotionIntakeDraft;
  composedAt?: string;
}): Motion {
  const normalized = normalizeMotionIntakeDraft(draft);
  const timestamp = composedAt ?? new Date().toISOString();
  const slug = timestamp.replace(/[^0-9]/g, "").slice(0, 14) || "local";
  const motionId = `local-composed-motion-${slug}`;
  const targetThread = normalized.targetThread;
  const roleSlotIds = buildRoleSlotIds(targetThread);
  const nonAuthorizations = [
    ...MOTION_INTAKE_NON_AUTHORIZATIONS,
    ...splitLines(normalized.nonAuthorizations),
  ];

  return {
    id: motionId,
    title: normalized.title,
    summary: [
      `Purpose: ${normalized.purpose}`,
      `Scope: ${normalized.scope}`,
      `Requested outcome: ${normalized.requestedOutcome}`,
      `Risks: ${normalized.risks}`,
      `Constraints: ${normalized.constraints}`,
      `Proposer: ${normalized.proposer}`,
      `Target thread: ${targetThread}`,
      `Repo target: ${normalized.repoTarget}`,
    ].join("\n"),
    lifecycleStatus: "draft",
    controlThread: {
      id: `control-thread-local-${slug}`,
      label: "local native motion intake",
      scope: normalized.scope,
      authorityNote:
        "Motion intake is not CONTROL_THREAD acceptance. CONTROL_THREAD remains authority.",
    },
    repoThread: {
      id: `repo-thread-local-${slug}`,
      repo: normalized.repoTarget,
      branchCandidate: undefined,
      scope: normalized.scope,
      authorityNote:
        "Repo-thread target is not repo execution authority and does not mutate the target repo.",
    },
    roleSlotIds,
    modelSlotIds: [
      "model-slot-mock-deliberator",
      "model-slot-env-gated-live-placeholder",
    ],
    deliberations: [],
    critiques: [],
    votes: [],
    ratificationRecommendation: {
      id: `ratification-local-${slug}`,
      motionId,
      value: "not_ratified",
      summary:
        "Native composed motion has not been manually deliberated or ratified.",
      conditions: [
        "Manual deliberation is operator-triggered only.",
        "Native motion selection does not auto-run deliberation.",
      ],
      advisoryOnly: true,
      humanApprovalRequired: true,
    },
    humanApprovalDecision: {
      id: `human-approval-local-${slug}`,
      motionId,
      value: "pending",
      decidedBy: null,
      decidedAt: null,
      notes: [
        "Local composed motion remains pending human / CONTROL_THREAD review.",
      ],
      doesNotAuthorizeAutonomousExecution: true,
      doesNotAuthorizeGitHubMutation: true,
      doesNotOpenProductionGates: true,
      doesNotTransferSourceOfTruth: true,
    },
    downstreamDrafts: {
      programDraft: {
        id: `program-draft-local-${slug}`,
        title: normalized.title,
        status: "blocked_until_human_approval",
        summary: normalized.purpose,
      },
      batchDraft: {
        id: `batch-draft-local-${slug}`,
        label: "Native motion intake batch draft",
        status: "blocked_until_human_approval",
        summary: normalized.scope,
      },
      waveDraft: {
        id: `wave-draft-local-${slug}`,
        label: "Native motion intake wave draft",
        status: "blocked_until_human_approval",
        summary: normalized.requestedOutcome,
      },
      laneDraft: {
        id: `lane-draft-local-${slug}`,
        label: "Native motion intake lane draft",
        status: "blocked_until_human_approval",
        repo: normalized.repoTarget,
        scope: normalized.scope,
      },
      workPacketDraft: {
        id: `work-packet-draft-local-${slug}`,
        label: normalized.title,
        status: "blocked_until_human_approval",
        targetRepo: normalized.repoTarget,
        targetBranchCandidate: "manual-control-thread-draft-only",
        instructions: [
          normalized.purpose,
          normalized.scope,
          normalized.requestedOutcome,
          normalized.constraints,
        ],
        nonAuthorizationNotes: nonAuthorizations,
      },
    },
    evidencePointers: buildEvidencePointers({
      motionId,
      evidenceText: normalized.evidencePointers,
    }),
    closeoutPlaceholder: {
      id: `closeout-placeholder-local-${slug}`,
      label: "Native motion intake closeout placeholder",
      status: "not_started",
      notes: [
        "Closeout placeholder is not closeout.",
        "Motion intake is not CONTROL_THREAD acceptance.",
      ],
      acceptanceAuthority: "none",
    },
    nonAuthorizations,
  };
}

export function createLocalComposedMotion(
  draft: MotionIntakeDraft,
): Motion {
  return buildComposedMotionBasis({ draft });
}

export function buildMotionIntakeRecordFromDraft({
  draft,
  createdAt,
}: {
  draft: MotionIntakeDraft;
  createdAt?: string;
}): MotionIntakeRecord {
  const normalized = normalizeMotionIntakeDraft(draft);
  const timestamp = createdAt ?? new Date().toISOString();
  const slug = timestamp.replace(/[^0-9]/g, "").slice(0, 14) || "local";
  const id = `persisted-motion-intake-${slug}`;
  const evidencePointers = buildEvidencePointers({
    motionId: id,
    evidenceText: normalized.evidencePointers,
  });
  const nonAuthorizations = [
    ...MOTION_INTAKE_NON_AUTHORIZATIONS,
    ...splitLines(normalized.nonAuthorizations),
  ];

  return {
    id,
    title: normalized.title,
    proposer: normalized.proposer,
    targetThread: normalized.targetThread,
    repoTarget: normalized.repoTarget,
    purpose: normalized.purpose,
    scope: normalized.scope,
    requestedOutcome: normalized.requestedOutcome,
    risks: normalized.risks,
    constraints: normalized.constraints,
    evidencePointers,
    nonAuthorizations,
    createdAt: timestamp,
    updatedAt: timestamp,
    intakeState: "staged",
    authorityState: "non_authoritative",
    advisoryOnly: true,
    safeAdvisoryMessage:
      "Persisted motion intake record is durable advisory metadata only.",
  };
}

export function buildMotionFromMotionIntakeRecord(
  record: MotionIntakeRecord,
): Motion {
  const motion = buildComposedMotionBasis({
    draft: {
      title: record.title,
      proposer: record.proposer,
      targetThread: record.targetThread,
      repoTarget: record.repoTarget,
      purpose: record.purpose,
      scope: record.scope,
      requestedOutcome: record.requestedOutcome,
      risks: record.risks,
      constraints: record.constraints,
      evidencePointers: record.evidencePointers
        .map((pointer) => pointer.ref)
        .join("\n"),
      nonAuthorizations: record.nonAuthorizations.join("\n"),
    },
    composedAt: record.createdAt,
  });

  return {
    ...motion,
    id: record.id,
    controlThread: {
      ...motion.controlThread,
      id: `control-thread-${record.id}`,
      label: "persisted native motion intake",
    },
    repoThread: {
      ...motion.repoThread,
      id: `repo-thread-${record.id}`,
    },
    ratificationRecommendation: {
      ...motion.ratificationRecommendation,
      id: `ratification-${record.id}`,
      motionId: record.id,
    },
    humanApprovalDecision: {
      ...motion.humanApprovalDecision,
      id: `human-approval-${record.id}`,
      motionId: record.id,
    },
    evidencePointers: record.evidencePointers,
    nonAuthorizations: record.nonAuthorizations,
  };
}

function buildRoleSlotIds(targetThread: JaiRoleSlotId): JaiRoleSlotId[] {
  if (targetThread === "JAI_CONTROL_THREAD") {
    return ["JAI_CONTROL_THREAD"];
  }
  return ["JAI_CONTROL_THREAD", targetThread];
}

function buildEvidencePointers({
  motionId,
  evidenceText,
}: {
  motionId: string;
  evidenceText: string;
}): EvidencePointer[] {
  return splitLines(evidenceText).map((line, index) => ({
    id: `${motionId}-evidence-${index + 1}`,
    label: `Composed evidence pointer ${index + 1}`,
    sourceType: "operator_note",
    ref: line,
    summary:
      "Operator-entered evidence pointer metadata. Evidence pointer is not validation approval.",
    validationAuthority: "none",
  }));
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function readText(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
