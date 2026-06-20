"use client";

import Link from "next/link";

import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorComposeButton,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";

function statusTone(status: string): OperatorSlateTone {
  if (status === "REAL-COMPOSE") return "composeOnly";
  if (status === "READ-ONLY") return "readOnly";
  if (status === "BLOCKED" || status === "NOT AUTHORIZED IN V0") {
    return "blocked";
  }
  if (status === "MANUAL HANDOFF") return "advisory";
  return "gated";
}

const developmentLinks = [
  {
    href: "/operator/work",
    label: "Work",
    posture: "Deterministic agenda and compose posture.",
  },
  {
    href: "/operator/work/new",
    label: "New work",
    posture: "Existing mutation-capable draft path; not expanded here.",
  },
  {
    href: "/operator/repos",
    label: "Repos",
    posture: "DB read-only repo display.",
  },
  {
    href: "/operator/control-plane",
    label: "Control plane",
    posture: "Current cockpit control-plane surface.",
  },
  {
    href: "/operator/live-dashboard",
    label: "Live dashboard",
    posture: "Live-readiness prototype; not execution authority.",
  },
];

const developmentCapabilityRows = [
  {
    id: "SYN-DEV-WORK-0001",
    capability: "Branch planning",
    posture: "Representational planning only.",
    status: "REAL-COMPOSE",
    requirement: "Branch name may be composed; branch creation is not authorized.",
  },
  {
    id: "SYN-DEV-WORK-0002",
    capability: "Implementation plan",
    posture: "Scope, touched paths, validation, and boundaries may be drafted.",
    status: "REAL-COMPOSE",
    requirement: "Implementation plan is not execution and does not mutate files.",
  },
  {
    id: "SYN-DEV-WORK-0003",
    capability: "Diff / patch readiness",
    posture: "Patch intent and file lists may be reviewed.",
    status: "READ-ONLY",
    requirement: "No file mutation, code-generation execution path, or repo write.",
  },
  {
    id: "SYN-DEV-WORK-0004",
    capability: "Validation checklist",
    posture: "Validation requirements may be copied for manual review.",
    status: "REAL-COMPOSE",
    requirement: "Validation is not acceptance and does not execute checks.",
  },
  {
    id: "SYN-DEV-WORK-0005",
    capability: "PR description composition",
    posture: "PR body text may be drafted locally.",
    status: "REAL-COMPOSE",
    requirement: "PR creation, branch/PR automation, push, merge, and GitHub API are blocked.",
  },
  {
    id: "SYN-DEV-WORK-0006",
    capability: "Closeout draft",
    posture: "Closeout text may be drafted locally.",
    status: "REAL-COMPOSE",
    requirement: "Closeout draft is not a receipt and does not update canon.",
  },
  {
    id: "SYN-DEV-WORK-0007",
    capability: "Rollback / revert support",
    posture: "Rollback requirements may be represented.",
    status: "READ-ONLY",
    requirement: "Rollback/revert readiness does not execute rollback.",
  },
  {
    id: "SYN-DEV-WORK-0008",
    capability: "Future controlled workflow",
    posture: "Future only; requires explicit gates and receipts.",
    status: "FUTURE",
    requirement: "No execution gates opened in v0.",
  },
];

const workflowReadinessCards = [
  {
    id: "SYN-DEV-READY-0001",
    label: "Plan",
    detail: "Draft scope and touched paths for manual review.",
  },
  {
    id: "SYN-DEV-READY-0002",
    label: "Validate",
    detail: "Copy checklist; checks are run manually outside this surface.",
  },
  {
    id: "SYN-DEV-READY-0003",
    label: "Describe PR",
    detail: "Compose a PR body; no PR is created.",
  },
  {
    id: "SYN-DEV-READY-0004",
    label: "Close out",
    detail: "Compose passalong text; no receipt or canon update occurs.",
  },
];

const blockedDevelopmentActions = [
  "GitHub API",
  "GitHub integration",
  "Branch creation",
  "PR creation",
  "Code push",
  "Merge",
  "File mutation",
  "Repo write",
  "Code execution",
  "Commit automation",
  "Branch / PR automation",
  "Code-generation execution path",
  "Receipt creation",
  "Canon update",
  "Route-state mutation",
  "Motion-state mutation",
  "Gate evaluation",
  "Provider / model dispatch",
  "Agent execution",
  "Tool invocation",
  "Terminal / command execution",
];

const activationBlockers = [
  "Branch planning may be represented.",
  "PR descriptions may be composed.",
  "GitHub integration is not authorized.",
  "Branch creation is not authorized.",
  "PR creation is not authorized.",
  "Code push is not authorized.",
  "Repo mutation is not authorized.",
  "Receipt creation is not authorized.",
  "Validation is not acceptance.",
  "CONTROL_THREAD decides.",
  "No code push authority in v0.",
  "No execution gates opened.",
  "ZERO GATES GRANTED.",
];

function buildBranchNameSuggestion() {
  return [
    "BRANCH NAME SUGGESTION - COPY ONLY",
    "record_id: SYN-DEV-BRANCH-0001",
    "suggested_branch: feat/dev-jai-nexus-readiness-review",
    "source_posture: SYNTHETIC / LOCAL STATIC",
    "non_authorizations: NO BRANCH CREATION; NO PUSH; NO GITHUB API; NO REPO WRITE",
    "operator_note: Branch planning may be represented. Creation remains blocked.",
  ].join("\n");
}

function buildImplementationPlanDraft() {
  return [
    "IMPLEMENTATION PLAN DRAFT - MANUAL HANDOFF ONLY",
    "record_id: SYN-DEV-PLAN-0001",
    "scope: [operator fills]",
    "touched_paths: [operator fills]",
    "validation_plan:",
    "- targeted ESLint for changed files",
    "- pnpm lint",
    "- pnpm typecheck",
    "- pnpm build",
    "- git diff --check",
    "boundaries:",
    "- no GitHub API; no branch/PR creation; no push/merge",
    "- no repo/file mutation from this composer",
    "- no code execution; no commit automation",
    "manual_handoff_note: CONTROL_THREAD decides. Plan is not execution.",
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
    "[ ] repo/file mutation and code-execution audit",
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
    "files_changed: [operator fills]",
    "routes_touched: [operator fills]",
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
        title="Development Work Compose Spine"
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
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / development work compose spine / Commit 6
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Development workflow readiness can compose branch suggestions, PR
              bodies, validation checklists, closeout drafts, and implementation
              plans for manual handoff. It does not authorize GitHub
              integration, branch creation, PR creation, push, merge, file
              mutation, repo write, commit automation, receipt creation, canon
              update, or execution.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="advisory">BRANCH PLANNING MAY BE REPRESENTED</OperatorBadge>
              <OperatorBadge tone="advisory">PR DESCRIPTIONS MAY BE COMPOSED</OperatorBadge>
              <OperatorBadge tone="blocked">NO GITHUB API</OperatorBadge>
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
              <ComposeAction text={buildBranchNameSuggestion} label="Copy branch suggestion" />
              <ComposeAction text={buildImplementationPlanDraft} label="Copy implementation plan" />
              <ComposeAction text={buildPrBodyDraft} label="Copy PR body draft" />
              <ComposeAction text={buildValidationChecklist} label="Copy validation checklist" />
              <ComposeAction text={buildCloseoutDraft} label="Copy closeout draft" />
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {workflowReadinessCards.map((card) => (
            <OperatorGateCard key={card.id}>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorIdChip>{card.id}</OperatorIdChip>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-100">
                {card.label}
              </div>
              <p className="mt-2 text-xs text-slate-400">{card.detail}</p>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                <OperatorBadge tone={statusTone(row.status)}>
                  {row.status}
                </OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <LabeledLine label="posture" value={row.posture} />
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

        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Development route links
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {developmentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-sky-300 hover:border-sky-700"
              >
                <span className="font-semibold">{link.label}</span>
                <span className="mt-2 block text-xs text-slate-400">
                  {link.posture}
                </span>
                <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  READ-ONLY LINK
                </span>
              </Link>
            ))}
          </div>
        </OperatorGateCard>

        <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Blocked / gated development capabilities
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
              Manual handoff / authority boundary
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

function ComposeAction({
  text,
  label,
}: {
  text: () => string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <OperatorComposeButton text={text}>{label}</OperatorComposeButton>
      <OperatorBadge tone="composeOnly">REAL-COMPOSE</OperatorBadge>
    </span>
  );
}

function LabeledLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono uppercase text-slate-500">{label} / </span>
      {value}
    </div>
  );
}
