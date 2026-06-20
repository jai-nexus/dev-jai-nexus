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

function lifecycleTone(action: string): OperatorSlateTone {
  if (action === "BLOCKED" || action === "NOT AUTHORIZED IN V0") {
    return "blocked";
  }
  if (action === "REAL-COMPOSE") {
    return "composeOnly";
  }
  if (action === "MANUAL HANDOFF") {
    return "advisory";
  }
  if (action === "READ-ONLY") {
    return "readOnly";
  }
  return "gated";
}

const agentSpineLinks = [
  {
    href: "/operator/agents",
    label: "Agents",
    posture: "Agent registry and lane readiness.",
  },
  {
    href: "/operator/work",
    label: "Work",
    posture: "Deterministic agenda and manual work handoff.",
  },
  {
    href: "/operator/control-plane",
    label: "Control plane",
    posture: "Current control-plane surface.",
  },
  {
    href: "/operator/live-dashboard",
    label: "Live dashboard",
    posture: "Live-readiness prototype, not an executing cockpit.",
  },
];

const agentLifecycle = [
  {
    id: "SYN-AGENT-LIFE-0001",
    phase: "Candidate drafted",
    action: "READ-ONLY",
    boundary: "Candidate record describes a possible lane; it does not execute.",
  },
  {
    id: "SYN-AGENT-LIFE-0002",
    phase: "Manual handoff composed",
    action: "REAL-COMPOSE",
    boundary: "Local clipboard draft only; no submit, dispatch, or persistence.",
  },
  {
    id: "SYN-AGENT-LIFE-0003",
    phase: "Validation expected",
    action: "GATED",
    boundary: "Validation evidence is required later, but validation is not acceptance.",
  },
  {
    id: "SYN-AGENT-LIFE-0004",
    phase: "Artifact expected",
    action: "FUTURE",
    boundary: "Artifact shape is named for handoff; no files are written here.",
  },
  {
    id: "SYN-AGENT-LIFE-0005",
    phase: "Receipt expected",
    action: "FUTURE",
    boundary: "Receipt expectation is not receipt creation and grants no authority.",
  },
  {
    id: "SYN-AGENT-LIFE-0006",
    phase: "Rollback expected",
    action: "MANUAL HANDOFF",
    boundary: "Rollback must be documented for future work; rollback does not execute.",
  },
  {
    id: "SYN-AGENT-LIFE-0007",
    phase: "Execution blocked",
    action: "BLOCKED",
    boundary: "No Agent runner, tools, terminal command, browser control, or repo mutation.",
  },
  {
    id: "SYN-AGENT-LIFE-0008",
    phase: "CONTROL_THREAD decision required",
    action: "NOT AUTHORIZED IN V0",
    boundary: "CONTROL_THREAD decides before any future gate, receipt, or canon path.",
  },
];

const agentLaneCandidates = [
  {
    id: "SYN-AGENT-LANE-0001",
    lane: "Builder lane candidate",
    source: "SYNTHETIC",
    readiness: "STAGED",
    expectedArtifact: "Patch plan, file list, and reviewed diff draft.",
    validation: "Targeted lint, typecheck, build, and human review.",
    receipt: "Receipt required only after CONTROL_THREAD acceptance.",
    rollback: "Named files, revert notes, and no unattended write path.",
  },
  {
    id: "SYN-AGENT-LANE-0002",
    lane: "Verifier lane candidate",
    source: "SYNTHETIC",
    readiness: "STAGED",
    expectedArtifact: "Validation summary, failed-check notes, and blocker list.",
    validation: "Evidence refs and command results copied by operator.",
    receipt: "Receipts record validation evidence; they do not decide.",
    rollback: "No mutation means rollback is a manual operator decision.",
  },
  {
    id: "SYN-AGENT-LANE-0003",
    lane: "Docs lane candidate",
    source: "SYNTHETIC",
    readiness: "STAGED",
    expectedArtifact: "Docs patch draft and source posture notes.",
    validation: "Docs lint or targeted review, if configured later.",
    receipt: "Receipt required before canon-facing acceptance.",
    rollback: "Manual revert instructions before any future write gate.",
  },
  {
    id: "SYN-AGENT-LANE-0004",
    lane: "Security lane candidate",
    source: "SYNTHETIC",
    readiness: "STAGED",
    expectedArtifact: "Risk notes, blocked authority classes, and gate requests.",
    validation: "Security review and explicit non-authorization check.",
    receipt: "Gate requests require receipts; receipts do not grant gates.",
    rollback: "Escalation is manual handoff only.",
  },
];

const blockedAgentAuthority = [
  "Tool invocation",
  "Agent runner",
  "Scheduler",
  "Autonomous loop",
  "Terminal / command execution",
  "Repo mutation",
  "Branch creation",
  "PR creation",
  "Branch / PR automation",
  "Browser / desktop control",
  "Provider / model dispatch",
  "Live model calls",
  "Receipt creation",
  "Canon update",
  "Gate evaluation",
];

const expectedArtifacts = [
  {
    id: "SYN-AGENT-ART-0001",
    artifact: "Plan",
    expectation: "Human-readable task plan, scope, assumptions, and blocked actions.",
  },
  {
    id: "SYN-AGENT-ART-0002",
    artifact: "Diff summary",
    expectation: "Files and intended changes summarized for manual review.",
  },
  {
    id: "SYN-AGENT-ART-0003",
    artifact: "Validation transcript",
    expectation: "Named checks and outcomes copied by operator, not accepted by automation.",
  },
  {
    id: "SYN-AGENT-ART-0004",
    artifact: "Closeout passalong",
    expectation: "Manual passalong with risks, unresolved questions, and non-authorizations.",
  },
  {
    id: "SYN-AGENT-ART-0005",
    artifact: "Receipt request",
    expectation: "Request only; no receipt is created by this spine.",
  },
  {
    id: "SYN-AGENT-ART-0006",
    artifact: "Rollback note",
    expectation: "Manual rollback notes before any future write gate can be considered.",
  },
];

const preGateAllowedBehavior = [
  "READ-ONLY readiness review.",
  "REAL-COMPOSE local handoff draft.",
  "Copy local draft for manual routing outside the app.",
  "Manual handoff to CONTROL_THREAD.",
];

const agentActivationBlockers = [
  "Agents are staged, not executing.",
  "Agent lane candidate does not execute.",
  "No Agent execution authority in v0.",
  "No repo mutation.",
  "No browser/desktop control.",
  "No branch/PR automation.",
  "No autonomous loop.",
  "CONTROL_THREAD decides.",
  "Validation is not acceptance.",
  "Receipts record; they do not decide.",
  "ZERO GATES GRANTED.",
];

function buildAgentHandoffPrompt() {
  return [
    "JAI AGENT LANE HANDOFF DRAFT - MANUAL HANDOFF ONLY",
    "record_id: SYN-AGENT-HANDOFF-0001",
    "mode: READINESS REVIEW",
    "non_authorizations: NO TOOL INVOCATION; NO AGENT RUNNER; NO SCHEDULER;",
    "  NO TERMINAL EXECUTION; NO REPO MUTATION; NO BRANCH/PR AUTOMATION;",
    "  NO RECEIPT CREATION; NO CANON UPDATE; ZERO GATES GRANTED",
    "required acknowledgements:",
    "- Agents are staged, not executing.",
    "- Agent lane candidate does not execute.",
    "- Validation is not acceptance.",
    "- Receipts record; they do not decide.",
    "- CONTROL_THREAD decides.",
    "return shape: intended_artifact, validation_plan, receipt_expectation, rollback_plan, blockers",
  ].join("\n");
}

export function JaiAgentReadiness({
  index = "AGENT",
  compact = false,
}: {
  index?: string;
  compact?: boolean;
}) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title="JAI Agent Readiness Surface"
        right={
          <>
            <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
            <OperatorBadge tone="advisory">MANUAL HANDOFF</OperatorBadge>
            <OperatorBadge tone="blocked">NO AGENT EXECUTION</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / JAI Agents readiness / Commit 4
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Agent readiness is represented as staged lane candidates, expected
              artifacts, validation requirements, receipt expectations, rollback
              requirements, and blocked authority classes. No Agent runtime,
              runner, scheduler, autonomous loop, terminal command, browser
              control, or repo mutation is activated here.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">AGENTS ARE STAGED, NOT EXECUTING</OperatorBadge>
              <OperatorBadge tone="blocked">AGENT LANE CANDIDATE DOES NOT EXECUTE</OperatorBadge>
              <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO BROWSER/DESKTOP CONTROL</OperatorBadge>
              <OperatorBadge tone="blocked">NO BRANCH/PR AUTOMATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO AUTONOMOUS LOOP</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION GATES OPENED</OperatorBadge>
              <OperatorBadge tone="advisory">VALIDATION IS NOT ACCEPTANCE</OperatorBadge>
            </div>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Compose-only Agent handoff
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Local clipboard draft only. No submit, persistence, dispatch, tool
              invocation, Agent execution, receipt creation, canon update, or
              state mutation.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <OperatorComposeButton text={buildAgentHandoffPrompt}>
                Copy Agent handoff prompt
              </OperatorComposeButton>
              <OperatorBadge tone="composeOnly">REAL-COMPOSE</OperatorBadge>
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {agentLifecycle.map((item) => (
            <OperatorGateCard key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {item.phase}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{item.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge tone={lifecycleTone(item.action)}>
                  {item.action}
                </OperatorBadge>
              </div>
              <p className="mt-3 text-xs text-slate-400">{item.boundary}</p>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {agentLaneCandidates.map((candidate) => (
            <OperatorGateCard key={candidate.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {candidate.lane}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{candidate.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge tone="gated">CANDIDATE ONLY</OperatorBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <OperatorBadge tone="fixture">{candidate.source}</OperatorBadge>
                <OperatorBadge tone="advisory">{candidate.readiness}</OperatorBadge>
                <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    artifact /{" "}
                  </span>
                  {candidate.expectedArtifact}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    validation /{" "}
                  </span>
                  {candidate.validation}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    receipt /{" "}
                  </span>
                  {candidate.receipt}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    rollback /{" "}
                  </span>
                  {candidate.rollback}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Readiness record</OperatorReadOnlyAction>
                <OperatorBlockedAction>Run lane</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Expected artifacts
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {expectedArtifacts.map((item) => (
                <div
                  key={item.id}
                  className="rounded border border-slate-800 bg-slate-950 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <OperatorIdChip>{item.id}</OperatorIdChip>
                    <OperatorBadge tone="advisory">EXPECTED</OperatorBadge>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">
                    {item.artifact}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {item.expectation}
                  </p>
                </div>
              ))}
            </div>
          </OperatorGateCard>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Pre-gate allowed behavior
            </div>
            <div className="mt-3 space-y-2">
              {preGateAllowedBehavior.map((behavior) => (
                <div
                  key={behavior}
                  className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300"
                >
                  {behavior}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              These behaviors do not invoke tools, dispatch Agents, mutate repos,
              create receipts, update canon, evaluate gates, or execute rollback.
            </p>
          </OperatorGateCard>
        </div>

        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Agent spine route links
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {agentSpineLinks.map((link) => (
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
              Blocked Agent authority classes
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {blockedAgentAuthority.map((blocked) => (
                <OperatorBadge key={blocked} tone="blocked">
                  {blocked}
                </OperatorBadge>
              ))}
            </div>
          </div>

          <div className="rounded border border-amber-900 bg-amber-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Activation blockers
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {agentActivationBlockers.map((blocker) => (
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
