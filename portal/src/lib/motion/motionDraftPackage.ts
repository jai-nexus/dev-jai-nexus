export const DRAFT_MOTION_FILE_NAMES = [
  "motion.yaml",
  "proposal.md",
  "challenge.md",
  "execution.md",
  "decision.yaml",
  "policy.yaml",
  "verify.json",
  "vote.json",
] as const;

export type DraftMotionFileName = (typeof DRAFT_MOTION_FILE_NAMES)[number];

export type MotionDraftPackageInput = {
  motionId: string;
  title: string;
  subtitle: string | null;
  program: string | null;
  kind: string | null;
  basisMotionId: string | null;
  scope: string;
  touchedPaths: string[];
  nonGoals: string[];
  rationale: string;
  risks: string[];
  createdAt: string;
  targetRepo: string;
  targetDomain: string;
};

export type DraftMotionFile = {
  name: DraftMotionFileName;
  path: string;
  content: string;
};

export type DraftMotionPackage = {
  motion_id: string;
  write_root: string;
  created_at: string;
  files: DraftMotionFile[];
};

function quoteYaml(value: string): string {
  return JSON.stringify(value);
}

function normalizeSingleLine(value: string | null | undefined): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  return raw.replace(/\s+/g, " ");
}

function normalizeList(items: string[]): string[] {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/\s+/g, " "));
}

function markdownList(items: string[], emptyLine: string): string {
  const normalized = normalizeList(items);
  if (normalized.length === 0) {
    return `- ${emptyLine}`;
  }

  return normalized.map((item) => `- ${item.startsWith("`") ? item : `\`${item}\``}`).join("\n");
}

function textList(items: string[], emptyLine: string): string {
  const normalized = normalizeList(items);
  if (normalized.length === 0) {
    return `- ${emptyLine}`;
  }
  return normalized.map((item) => `- ${item}`).join("\n");
}

function buildMotionYaml(input: MotionDraftPackageInput): string {
  const lines = [
    `motion_id: ${input.motionId}`,
    `version: "0.1"`,
    `protocol_version: "0.3.8"`,
    `title: ${quoteYaml(normalizeSingleLine(input.title) ?? input.motionId)}`,
  ];

  const subtitle = normalizeSingleLine(input.subtitle);
  if (subtitle) {
    lines.push(`subtitle: ${quoteYaml(subtitle)}`);
  }

  lines.push(`kind: ${normalizeSingleLine(input.kind) ?? "builder-proof"}`);
  lines.push(`program: ${normalizeSingleLine(input.program) ?? "q2-motion-contender-draft-promotion-v0"}`);
  lines.push(`basis: ${normalizeSingleLine(input.basisMotionId) ?? "motion-0158"}`);
  lines.push(`status: open`);
  lines.push(`created_at: ${quoteYaml(input.createdAt)}`);
  lines.push(`proposer: ARCHITECT`);
  lines.push(`challenger: VERIFIER`);
  lines.push(`arbiter: OPERATOR`);
  lines.push(`target:`);
  lines.push(`  domain: ${quoteYaml(input.targetDomain)}`);
  lines.push(`  repo: ${quoteYaml(input.targetRepo)}`);
  lines.push(`checks_required: [validate_motion, validate_agency, typecheck]`);
  lines.push(`checks_optional: []`);

  return `${lines.join("\n")}\n`;
}

function buildProposalMd(input: MotionDraftPackageInput): string {
  return `# Proposal: ${normalizeSingleLine(input.title) ?? input.motionId}

**Motion:** ${input.motionId}
**Kind:** ${normalizeSingleLine(input.kind) ?? "builder-proof"}
**Program:** ${normalizeSingleLine(input.program) ?? "q2-motion-contender-draft-promotion-v0"}
**Basis:** ${normalizeSingleLine(input.basisMotionId) ?? "motion-0158"}

---

## 1. Problem statement

${input.scope.trim()}

---

## 2. Scope

In scope:

${markdownList(input.touchedPaths, "operator to confirm touched paths before promotion")}

Not in scope:

${textList(
    [
      ...normalizeList(input.nonGoals),
      "automatic PR creation",
      "voting or ratification",
      "dispatch, scheduling, or orchestration",
      "database writes or API mutation outside the bounded promotion path",
      "mutation of existing motions",
    ],
    "operator to enumerate non-goals",
  )}

---

## 3. Rationale

${input.rationale.trim()}

---

## 4. Promotion posture

If promoted, this package is created in DRAFT/open posture only.

- branch-only GitHub write
- same-repo target only
- no direct write to main/default branch
- no PR creation
- no execution, vote, or ratification claims
`;
}

function buildChallengeMd(input: MotionDraftPackageInput): string {
  return `# Challenge: ${normalizeSingleLine(input.title) ?? input.motionId}

**Motion:** ${input.motionId}

---

## 1. Key risks

${textList(input.risks, "operator to enumerate promotion-specific risks")}

---

## 2. Required protections

- keep contender generation preview-only until explicit operator confirmation
- write only .nexus/motions/${input.motionId}/**
- fail if the computed motion id or target branch becomes stale
- keep promotion same-repo only and branch-only
- block promotion when feature flag, GitHub env, or admin session requirements are not satisfied

---

## 3. Out of scope

- direct writes to main/default branch
- modification of existing motions
- automatic PR creation
- automatic voting or ratification
- dispatch, scheduling, readiness scoring, or orchestration
`;
}

function buildExecutionMd(input: MotionDraftPackageInput): string {
  return `# Execution: ${normalizeSingleLine(input.title) ?? input.motionId}

**Motion:** ${input.motionId}
**Kind:** ${normalizeSingleLine(input.kind) ?? "builder-proof"}
**Program:** ${normalizeSingleLine(input.program) ?? "q2-motion-contender-draft-promotion-v0"}
**Status:** DRAFT

---

## Implementation scope

If promoted, implementation is intended to stay bounded to:

${markdownList(input.touchedPaths, "operator to confirm touched paths before implementation")}

---

## Promotion status

This file is scaffold-only in DRAFT posture.

- no execution has been run
- no review evidence is recorded yet
- no gates are marked passing yet
- no ratification claims are made here

---

## Evidence log

Pending. Populate only after real implementation and verification work occurs.
`;
}

function buildDecisionYaml(input: MotionDraftPackageInput): string {
  return `protocol_version: "0.3.8"
motion_id: ${input.motionId}
status: DRAFT
decided_at: null
ratified_by: null
target_domain: ${quoteYaml(input.targetDomain)}
target_repo: ${quoteYaml(input.targetRepo)}
vote_mode: "unanimous_consent"
required_gates: [validate_motion, validate_agency, typecheck]
last_updated: ${quoteYaml(input.createdAt)}
notes: "DRAFT: not yet voted or ratified."
`;
}

function buildPolicyYaml(input: MotionDraftPackageInput): string {
  return `protocol_version: "0.3.8"
motion_id: ${input.motionId}
evaluated_at: ${quoteYaml(input.createdAt)}
target_domain: ${quoteYaml(input.targetDomain)}
target_repo: ${quoteYaml(input.targetRepo)}
vote_mode: "unanimous_consent"
required_voters: [proposer, challenger, arbiter]
risk_score: 0.10
max_risk_score: 0.20
required_gates: [validate_motion, validate_agency, typecheck]
optional_gates: []
failed_required_gates: []
failed_optional_gates: []
required_ok: false
eligible_to_vote: false
recommended_vote: null
blocking_reasons:
  - "DRAFT package only: promotion preview or branch write does not satisfy implementation evidence."
warnings:
  - "Scope is limited to contender preview and explicit DRAFT package promotion only."
escalation_state: null
`;
}

function buildVerifyJson(input: MotionDraftPackageInput): string {
  return `${JSON.stringify(
    {
      version: "0.2",
      motion_id: input.motionId,
      latest: {
        validate_motion: {
          gate: "validate_motion",
          ok: false,
          status: null,
          ts: null,
          command: `node portal/scripts/validate-motion.mjs --motion .nexus/motions/${input.motionId}/motion.yaml`,
          cwd: ".",
          required: true,
        },
        validate_agency: {
          gate: "validate_agency",
          ok: false,
          status: null,
          ts: null,
          command: "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus",
          cwd: ".",
          required: true,
        },
        typecheck: {
          gate: "typecheck",
          ok: false,
          status: null,
          ts: null,
          command: "pnpm -C portal typecheck",
          cwd: ".",
          required: true,
        },
      },
      summary: {
        required_ok: false,
        last_updated: input.createdAt,
      },
    },
    null,
    2,
  )}\n`;
}

function buildVoteJson(input: MotionDraftPackageInput): string {
  return `${JSON.stringify(
    {
      motion_id: input.motionId,
      version: "0.2",
      protocol_version: "0.3.8",
      vote_mode: "unanimous_consent",
      required_roles: ["proposer", "challenger", "arbiter"],
      votes: [
        { role: "proposer", vote: "pending" },
        { role: "challenger", vote: "pending" },
        { role: "arbiter", vote: "pending" },
      ],
      outcome: {
        yes: 0,
        no: 0,
        abstain: 0,
        yes_with_reservations: 0,
        result: "PENDING",
        reasons: [
          "DRAFT package scaffold only; voting has not started.",
          "Implementation evidence and required gates remain pending.",
        ],
        missing_required_roles: ["proposer", "challenger", "arbiter"],
      },
      last_updated: input.createdAt,
    },
    null,
    2,
  )}\n`;
}

export function buildDraftMotionPackage(input: MotionDraftPackageInput): DraftMotionPackage {
  const writeRoot = `.nexus/motions/${input.motionId}`;
  const files: DraftMotionFile[] = [
    {
      name: "motion.yaml",
      path: `${writeRoot}/motion.yaml`,
      content: buildMotionYaml(input),
    },
    {
      name: "proposal.md",
      path: `${writeRoot}/proposal.md`,
      content: buildProposalMd(input),
    },
    {
      name: "challenge.md",
      path: `${writeRoot}/challenge.md`,
      content: buildChallengeMd(input),
    },
    {
      name: "execution.md",
      path: `${writeRoot}/execution.md`,
      content: buildExecutionMd(input),
    },
    {
      name: "decision.yaml",
      path: `${writeRoot}/decision.yaml`,
      content: buildDecisionYaml(input),
    },
    {
      name: "policy.yaml",
      path: `${writeRoot}/policy.yaml`,
      content: buildPolicyYaml(input),
    },
    {
      name: "verify.json",
      path: `${writeRoot}/verify.json`,
      content: buildVerifyJson(input),
    },
    {
      name: "vote.json",
      path: `${writeRoot}/vote.json`,
      content: buildVoteJson(input),
    },
  ];

  return {
    motion_id: input.motionId,
    write_root: writeRoot,
    created_at: input.createdAt,
    files,
  };
}
