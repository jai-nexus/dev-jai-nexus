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

const agentLaneCandidates = [
  {
    id: "SYN-AGENT-LANE-0001",
    lane: "Builder lane candidate",
    expectedArtifact: "Patch plan, file list, and reviewed diff draft.",
    validation: "Targeted lint, typecheck, build, and human review.",
    receipt: "Receipt required only after CONTROL_THREAD acceptance.",
    rollback: "Named files, revert notes, and no unattended write path.",
  },
  {
    id: "SYN-AGENT-LANE-0002",
    lane: "Verifier lane candidate",
    expectedArtifact: "Validation summary, failed-check notes, and blocker list.",
    validation: "Evidence refs and command results copied by operator.",
    receipt: "Receipts record validation evidence; they do not decide.",
    rollback: "No mutation means rollback is a manual operator decision.",
  },
  {
    id: "SYN-AGENT-LANE-0003",
    lane: "Docs lane candidate",
    expectedArtifact: "Docs patch draft and source posture notes.",
    validation: "Docs lint or targeted review, if configured later.",
    receipt: "Receipt required before canon-facing acceptance.",
    rollback: "Manual revert instructions before any future write gate.",
  },
  {
    id: "SYN-AGENT-LANE-0004",
    lane: "Security lane candidate",
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
              dev.jai.nexus / JAI Agents readiness / Commit 3
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
              <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO AUTONOMOUS LOOP</OperatorBadge>
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
