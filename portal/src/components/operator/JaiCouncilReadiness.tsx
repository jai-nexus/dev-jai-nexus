"use client";

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
    readiness: "Fixture only",
    posture: "Prompt drafts may be composed for manual handoff.",
    blocker: "No provider SDK, no dispatch, no live model call.",
  },
  {
    id: "SYN-JAI-SLOT-0002",
    slot: "Challenger model slot",
    readiness: "Fixture only",
    posture: "Dissent role remains visible and cannot be collapsed into agreement.",
    blocker: "No automatic synthesis or best-model selection.",
  },
  {
    id: "SYN-JAI-SLOT-0003",
    slot: "Evidence model slot",
    readiness: "Fixture only",
    posture: "Outputs must cite evidence refs before they can be considered claims.",
    blocker: "Ungrounded output remains advisory and non-canonical.",
  },
  {
    id: "SYN-JAI-SLOT-0004",
    slot: "Future JAI slot",
    readiness: "Reserved",
    posture: "Represents a possible internal capability, not a runtime.",
    blocker: "Live JAI runtime and Council runtime are not active in v0.",
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
              dev.jai.nexus / JAI Council readiness / Commit 2
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
                <OperatorBadge tone="fixture">{slot.readiness}</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
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
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Readiness record</OperatorReadOnlyAction>
                <OperatorBlockedAction>Dispatch slot</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
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
      </OperatorPanel>
    </section>
  );
}
