"use client";

import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorComposeButton,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
} from "@/components/operator/slate";

const developmentCapabilityRows = [
  {
    id: "SYN-DEV-WORK-0001",
    capability: "Branch planning",
    posture: "Representational planning only.",
    status: "GATED",
    requirement: "Branch name may be composed; branch creation is not authorized.",
  },
  {
    id: "SYN-DEV-WORK-0002",
    capability: "Diff / patch readiness",
    posture: "Patch intent and file lists may be reviewed.",
    status: "READ-ONLY",
    requirement: "No file mutation, code-generation execution path, or repo write.",
  },
  {
    id: "SYN-DEV-WORK-0003",
    capability: "Validation checklist",
    posture: "Validation requirements may be copied for manual review.",
    status: "REAL-COMPOSE",
    requirement: "Validation is not acceptance.",
  },
  {
    id: "SYN-DEV-WORK-0004",
    capability: "PR description composition",
    posture: "PR body text may be drafted locally.",
    status: "REAL-COMPOSE",
    requirement: "PR creation, branch/PR automation, push, merge, and GitHub API are blocked.",
  },
  {
    id: "SYN-DEV-WORK-0005",
    capability: "Closeout / receipt expectation",
    posture: "Closeout text may be drafted locally.",
    status: "GATED",
    requirement: "Receipt creation is not authorized; receipts record, they do not decide.",
  },
  {
    id: "SYN-DEV-WORK-0006",
    capability: "Rollback / revert support",
    posture: "Rollback requirements may be represented.",
    status: "READ-ONLY",
    requirement: "Rollback/revert readiness does not execute rollback.",
  },
];

const blockedDevelopmentActions = [
  "GitHub API",
  "Branch creation",
  "PR creation",
  "Code push",
  "Merge",
  "File mutation",
  "Repo write",
  "Commit automation",
  "Branch / PR automation",
  "Code-generation execution path",
  "Receipt creation",
  "Canon update",
  "Gate evaluation",
  "Provider / model dispatch",
  "Agent execution",
];

const activationBlockers = [
  "GitHub integration is not authorized.",
  "Branch creation is not authorized.",
  "PR creation is not authorized.",
  "Code push is not authorized.",
  "Repo mutation is not authorized.",
  "Receipt creation is not authorized.",
  "Validation is not acceptance.",
  "CONTROL_THREAD decides.",
  "Authentication is not authorization.",
  "Step-up verification confirms operator presence only.",
  "Verified session does not open execution gates.",
  "No code push authority in v0.",
  "ZERO GATES GRANTED.",
];

function buildBranchNameSuggestion() {
  return [
    "BRANCH NAME SUGGESTION - COPY ONLY",
    "record_id: SYN-DEV-BRANCH-0001",
    "suggested_branch: feat/dev-jai-nexus-readiness-review",
    "non_authorizations: NO BRANCH CREATION; NO PUSH; NO GITHUB API; NO REPO WRITE",
    "operator_note: Branch planning may be represented. Creation remains blocked.",
  ].join("\n");
}

function buildPrBodyDraft() {
  return [
    "PR BODY DRAFT - MANUAL HANDOFF ONLY",
    "record_id: SYN-DEV-PR-0001",
    "summary:",
    "- Describe intended development readiness change.",
    "- Identify touched routes and source posture.",
    "- Confirm no GitHub API, branch creation, PR creation, push, merge, or repo mutation.",
    "validation:",
    "- targeted ESLint for changed files",
    "- pnpm lint",
    "- pnpm typecheck",
    "- pnpm build",
    "- git diff --check",
    "non_authorizations: PR CREATION BLOCKED; RECEIPT CREATION BLOCKED; ZERO GATES GRANTED",
  ].join("\n");
}

function buildValidationChecklist() {
  return [
    "DEVELOPMENT VALIDATION CHECKLIST - COPY ONLY",
    "record_id: SYN-DEV-VALIDATION-0001",
    "[ ] targeted ESLint for changed files",
    "[ ] pnpm lint",
    "[ ] pnpm typecheck",
    "[ ] pnpm build",
    "[ ] git diff --check",
    "[ ] agency validator if configured",
    "[ ] route/nav/dependency/API/DB/provider/GitHub audit",
    "[ ] receipt/canon/gate-state audit",
    "boundary: Validation is not acceptance. CONTROL_THREAD decides.",
  ].join("\n");
}

function buildCloseoutDraft() {
  return [
    "CLOSEOUT DRAFT - MANUAL REVIEW REQUIRED",
    "record_id: SYN-DEV-CLOSEOUT-0001",
    "decision: [CONTROL_THREAD]",
    "validation_summary: [operator fills]",
    "rollback_notes: [operator fills]",
    "receipt_expectation: receipt required only if later authorized",
    "non_authorizations: DOES NOT CREATE RECEIPT; DOES NOT UPDATE CANON; ZERO GATES GRANTED",
  ].join("\n");
}

export function DevelopmentWorkReadiness({
  index = "DEV",
  compact = false,
}: {
  index?: string;
  compact?: boolean;
}) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title="Development Work Readiness Surface"
        right={
          <>
            <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
            <OperatorBadge tone="advisory">MANUAL HANDOFF</OperatorBadge>
            <OperatorBadge tone="blocked">NO GITHUB INTEGRATION</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / development work readiness / Commit 5
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Development workflow readiness can represent branch planning, PR
              body drafting, validation requirements, diff/patch posture,
              closeout expectations, rollback requirements, and security gates.
              It does not authorize GitHub integration, branch creation, PR
              creation, push, merge, file mutation, repo write, commit
              automation, receipt creation, canon update, or execution.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="advisory">BRANCH PLANNING MAY BE REPRESENTED</OperatorBadge>
              <OperatorBadge tone="advisory">PR DESCRIPTIONS MAY BE COMPOSED</OperatorBadge>
              <OperatorBadge tone="blocked">NO CODE PUSH AUTHORITY IN V0</OperatorBadge>
              <OperatorBadge tone="advisory">VALIDATION IS NOT ACCEPTANCE</OperatorBadge>
            </div>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Compose-only development handoff
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Clipboard drafts only. No submit, persistence, dispatch, GitHub
              API, branch creation, PR creation, repo write, file mutation, code
              execution, receipt creation, canon update, or state mutation.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <OperatorComposeButton text={buildBranchNameSuggestion}>
                Copy branch suggestion
              </OperatorComposeButton>
              <OperatorComposeButton text={buildPrBodyDraft}>
                Copy PR body draft
              </OperatorComposeButton>
              <OperatorComposeButton text={buildValidationChecklist}>
                Copy validation checklist
              </OperatorComposeButton>
              <OperatorComposeButton text={buildCloseoutDraft}>
                Copy closeout draft
              </OperatorComposeButton>
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {developmentCapabilityRows.map((row) => (
            <OperatorGateCard key={row.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {row.capability}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{row.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge
                  tone={
                    row.status === "REAL-COMPOSE"
                      ? "composeOnly"
                      : row.status === "READ-ONLY"
                        ? "readOnly"
                        : "gated"
                  }
                >
                  {row.status}
                </OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    posture /{" "}
                  </span>
                  {row.posture}
                </div>
                <div className="text-amber-300">
                  <span className="font-mono uppercase text-amber-500">
                    requirement /{" "}
                  </span>
                  {row.requirement}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Readiness record</OperatorReadOnlyAction>
                <OperatorBlockedAction>Execute workflow</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Blocked development actions
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {blockedDevelopmentActions.map((blocked) => (
                <OperatorBadge key={blocked} tone="blocked">
                  {blocked}
                </OperatorBadge>
              ))}
            </div>
          </div>

          <div className="rounded border border-amber-900 bg-amber-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Step-up / security requirements
            </div>
            <p className="mt-2 text-xs text-amber-100">
              Authentication is not authorization. Step-up verification confirms
              operator presence only. Verified session does not open execution
              gates. Future branch, PR, push, merge, repo write, validation,
              receipt, rollback, and security gates require explicit
              CONTROL_THREAD authority.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activationBlockers.map((blocker) => (
                <OperatorBadge key={blocker} tone="blocked">
                  {blocker}
                </OperatorBadge>
              ))}
            </div>
          </div>
        </div>
      </OperatorPanel>
    </section>
  );
}
