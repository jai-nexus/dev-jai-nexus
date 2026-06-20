"use client";

import Link from "next/link";

import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorComposeButton,
  OperatorContradictionCard,
  OperatorDissentCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
} from "@/components/operator/slate";

const modelSlotReadiness = [
  {
    id: "SYN-JAI-SLOT-0001",
    slot: "Builder model slot",
    status: "Fixture only",
    source: "SYNTHETIC",
    outputBoundary: "Draft claims only",
    posture: "Prompt drafts may be composed for manual handoff.",
    blocker: "No provider SDK, no dispatch, no live model call.",
    requiredGate: "Provider/model dispatch gate",
  },
  {
    id: "SYN-JAI-SLOT-0002",
    slot: "Challenger model slot",
    status: "Fixture only",
    source: "SYNTHETIC",
    outputBoundary: "Dissent and objections",
    posture: "Dissent role remains visible and cannot be collapsed into agreement.",
    blocker: "No automatic synthesis or best-model selection.",
    requiredGate: "Council session gate",
  },
  {
    id: "SYN-JAI-SLOT-0003",
    slot: "Evidence model slot",
    status: "Fixture only",
    source: "SYNTHETIC",
    outputBoundary: "Evidence-linked claims",
    posture: "Outputs must cite evidence refs before they can be considered claims.",
    blocker: "Ungrounded output remains advisory and non-canonical.",
    requiredGate: "Evidence/source gate",
  },
  {
    id: "SYN-JAI-SLOT-0004",
    slot: "Future JAI slot",
    status: "Reserved",
    source: "FUTURE",
    outputBoundary: "No output in v0",
    posture: "Represents a possible internal capability, not a runtime.",
    blocker: "Live JAI runtime and Council runtime are not active in v0.",
    requiredGate: "JAI runtime gate",
  },
];

const councilLifecycle = [
  {
    id: "SYN-JAI-LIFE-0001",
    phase: "draft",
    posture: "Local prompt or packet draft may be composed.",
    boundary: "REAL-COMPOSE only; no submit or persistence.",
    action: "REAL-COMPOSE",
  },
  {
    id: "SYN-JAI-LIFE-0002",
    phase: "route",
    posture: "Manual operator handoff may carry the draft outside the UI.",
    boundary: "Route recommends; it does not execute.",
    action: "MANUAL HANDOFF",
  },
  {
    id: "SYN-JAI-LIFE-0003",
    phase: "advisory return",
    posture: "Return can be reviewed as claims and evidence refs.",
    boundary: "Return cannot decide, dispatch, merge, or create receipts.",
    action: "READ-ONLY",
  },
  {
    id: "SYN-JAI-LIFE-0004",
    phase: "dissent review",
    posture: "Dissent remains first-class and visible.",
    boundary: "No synthesis override and no majority collapse.",
    action: "READ-ONLY",
  },
  {
    id: "SYN-JAI-LIFE-0005",
    phase: "contradiction review",
    posture: "Contradictions stay open until CONTROL_THREAD decides.",
    boundary: "No automatic scoring, resolution, or best-model selection.",
    action: "READ-ONLY",
  },
  {
    id: "SYN-JAI-LIFE-0006",
    phase: "CONTROL_THREAD decision",
    posture: "Operator decision boundary remains outside Council agreement.",
    boundary: "Validation is not acceptance; CONTROL_THREAD decides.",
    action: "MANUAL HANDOFF",
  },
  {
    id: "SYN-JAI-LIFE-0007",
    phase: "receipt requirement",
    posture: "Future accepted decisions require receipt design.",
    boundary: "Receipts record; they do not decide.",
    action: "FUTURE",
  },
  {
    id: "SYN-JAI-LIFE-0008",
    phase: "canon update",
    posture: "Canon merge remains blocked in this spine.",
    boundary: "No output merge into canon and no canon update.",
    action: "BLOCKED",
  },
];

const crossSurfaceLinks = [
  {
    href: "/operator/jai",
    label: "JAI shell",
    detail: "Draft prompt and read-only control-plane context.",
  },
  {
    href: "/operator/council-prototype",
    label: "Council prototype",
    detail: "Advisory return, dissent, contradiction, and synthesis fixture.",
  },
  {
    href: "/operator/control-plane",
    label: "Control plane",
    detail: "Cockpit posture, gates, fixture lanes, and canonical motion read.",
  },
  {
    href: "/operator/live-dashboard",
    label: "Live dashboard",
    detail: "Live-readiness prototype; not a live runtime.",
  },
];

const activationBlockers = [
  "JAI is not live runtime in v0.",
  "JAI Council is advisory only.",
  "No model dispatch in v0.",
  "No live model calls in v0.",
  "No automatic Council dispatch.",
  "No automatic synthesis.",
  "No automatic best-agent or best-model selection.",
  "No output merge into canon.",
  "No receipt creation.",
  "CONTROL_THREAD decides.",
  "Council agreement is not authority.",
  "ZERO GATES GRANTED.",
];

function buildCouncilPromptDraft() {
  return [
    "JAI COUNCIL READINESS PROMPT DRAFT - MANUAL HANDOFF ONLY",
    "record_id: SYN-JAI-COUNCIL-PROMPT-0001",
    "mode: READINESS REVIEW",
    "non_authorizations: NO DISPATCH; NO LIVE MODEL CALL; NO RECEIPT; NO CANON UPDATE",
    "required acknowledgements:",
    "- JAI is not live runtime in v0.",
    "- JAI Council is advisory only.",
    "- Model-slot output produces claims, not facts.",
    "- Dissent and contradictions must remain visible.",
    "- CONTROL_THREAD decides.",
    "return shape: claims, evidence_refs, dissent, contradictions, unresolved_questions, blockers",
  ].join("\n");
}

export function JaiCouncilReadiness({
  index = "JAI",
  compact = false,
}: {
  index?: string;
  compact?: boolean;
}) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title="JAI / Council Readiness Surface"
        right={
          <>
            <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
            <OperatorBadge tone="advisory">ADVISORY ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NO MODEL DISPATCH</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / JAI Council operator spine / Commit 3
            </div>
            <p className="mt-2 text-sm text-slate-300">
              JAI and JAI Council readiness is visible here without activating a
              runtime. Model-slot output produces claims, not facts. Council
              agreement is not authority. CONTROL_THREAD decides.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">JAI IS NOT LIVE RUNTIME IN V0</OperatorBadge>
              <OperatorBadge tone="blocked">NO LIVE MODEL CALLS</OperatorBadge>
              <OperatorBadge tone="advisory">CLAIMS, NOT FACTS</OperatorBadge>
              <OperatorBadge tone="advisory">MANUAL HANDOFF</OperatorBadge>
            </div>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Compose-only handoff
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Local clipboard draft only. No submit, persistence, dispatch,
              receipt creation, canon update, or state mutation.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <OperatorComposeButton text={buildCouncilPromptDraft}>
                Copy Council readiness prompt
              </OperatorComposeButton>
              <OperatorBadge tone="composeOnly">REAL-COMPOSE</OperatorBadge>
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {modelSlotReadiness.map((slot) => (
            <OperatorGateCard key={slot.id} className="border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {slot.slot}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{slot.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge tone="fixture">{slot.status}</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    source /{" "}
                  </span>
                  {slot.source}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    output /{" "}
                  </span>
                  {slot.outputBoundary}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    posture /{" "}
                  </span>
                  {slot.posture}
                </div>
                <div className="text-amber-300">
                  <span className="font-mono uppercase text-amber-500">
                    blocker /{" "}
                  </span>
                  {slot.blocker}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    required gate /{" "}
                  </span>
                  {slot.requiredGate}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Readiness record</OperatorReadOnlyAction>
                <OperatorBlockedAction>Dispatch slot</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div>
          <OperatorSectionHeader
            index={`${index}-LIFE`}
            title="Council Session Lifecycle Readiness"
            right={
              <>
                <OperatorBadge tone="fixture">SYN-* LIFECYCLE</OperatorBadge>
                <OperatorBadge tone="blocked">NO COUNCIL RUNTIME</OperatorBadge>
              </>
            }
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {councilLifecycle.map((phase) => (
              <OperatorGateCard key={phase.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-300">
                    {phase.phase}
                  </div>
                  <OperatorIdChip>{phase.id}</OperatorIdChip>
                </div>
                <p className="mt-2 text-xs text-slate-300">{phase.posture}</p>
                <p className="mt-2 text-xs text-amber-300">{phase.boundary}</p>
                <div className="mt-3">
                  <OperatorBadge
                    tone={
                      phase.action === "BLOCKED"
                        ? "blocked"
                        : phase.action === "FUTURE" || phase.action === "MANUAL HANDOFF"
                          ? "gated"
                          : phase.action === "REAL-COMPOSE"
                            ? "composeOnly"
                            : "readOnly"
                    }
                  >
                    {phase.action}
                  </OperatorBadge>
                </div>
              </OperatorGateCard>
            ))}
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
          <OperatorDissentCard>
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="dissent">DISSENT VISIBLE</OperatorBadge>
              <OperatorIdChip>SYN-JAI-DIS-0001</OperatorIdChip>
            </div>
            <p className="mt-2 text-sm text-red-100">
              Dissent remains first-class readiness data. It cannot be hidden by
              Council agreement, synthesis polish, or model-slot majority.
            </p>
          </OperatorDissentCard>

          <OperatorContradictionCard>
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="contradiction">CONTRADICTION OPEN</OperatorBadge>
              <OperatorIdChip>SYN-JAI-CON-0001</OperatorIdChip>
            </div>
            <p className="mt-2 text-sm text-red-100">
              Contradictions remain visible until CONTROL_THREAD records a
              decision path. They are not automatically resolved, scored, merged,
              or converted into canon.
            </p>
          </OperatorContradictionCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded border border-sky-900 bg-sky-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-sky-300">
              Council output boundary
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
              <li>Model-slot output produces claims, not facts.</li>
              <li>Claims require evidence refs and source posture labels.</li>
              <li>Agreement is advisory and does not create acceptance.</li>
              <li>Only CONTROL_THREAD can decide readiness progression.</li>
            </ul>
          </div>

          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Activation blockers
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {activationBlockers.map((blocker) => (
                <OperatorBadge key={blocker} tone="blocked">
                  {blocker}
                </OperatorBadge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <OperatorSectionHeader
            index={`${index}-LINKS`}
            title="JAI / Council Spine Links"
            right={<OperatorBadge tone="readOnly">READ-ONLY LINKS</OperatorBadge>}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {crossSurfaceLinks.map((surface) => (
              <Link
                key={surface.href}
                href={surface.href}
                className="rounded border border-slate-800 bg-slate-950/50 p-3 transition-colors hover:border-sky-800 hover:bg-slate-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-100">
                    {surface.label}
                  </span>
                  <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                </div>
                <div className="mt-2">
                  <OperatorIdChip>{surface.href}</OperatorIdChip>
                </div>
                <p className="mt-3 text-xs text-slate-400">{surface.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </OperatorPanel>
    </section>
  );
}
