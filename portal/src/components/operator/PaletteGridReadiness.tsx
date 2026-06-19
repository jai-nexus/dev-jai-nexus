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

const paletteContextCards = [
  {
    id: "SYN-PALETTE-CTX-0001",
    context: "Project context",
    source: "Local/static fixture map",
    freshness: "Snapshot only",
    boundary: "Relevant project context is advisory; context selection is not authority.",
  },
  {
    id: "SYN-PALETTE-CTX-0002",
    context: "Repo context",
    source: "Read-only registry/config references",
    freshness: "Derived display",
    boundary: "Repo context does not authorize repo mutation or branch/PR automation.",
  },
  {
    id: "SYN-PALETTE-CTX-0003",
    context: "Motion / receipt context",
    source: "Read-only canonical shape where already accepted",
    freshness: "Source-labeled",
    boundary: "Retrieval is not acceptance; receipts record, they do not decide.",
  },
  {
    id: "SYN-PALETTE-CTX-0004",
    context: "Council / Agent lane context",
    source: "Synthetic readiness records",
    freshness: "Fixture only",
    boundary: "Council and Agent lane context is advisory and non-executing.",
  },
];

const gridStateCards = [
  {
    id: "SYN-GRID-STATE-0001",
    state: "Operational state map",
    posture: "Displays relationships; it does not execute.",
    source: "Local/static configuration and derived display.",
  },
  {
    id: "SYN-GRID-STATE-0002",
    state: "Project / repo / work relationships",
    posture: "Relationship display is not routing authority.",
    source: "Read-only registry, fixture, or derived records.",
  },
  {
    id: "SYN-GRID-STATE-0003",
    state: "Route / motion / work queues",
    posture: "Queues are readiness posture, not autonomous scheduling.",
    source: "Existing read-only surfaces or synthetic readiness labels.",
  },
  {
    id: "SYN-GRID-STATE-0004",
    state: "Capability map",
    posture: "Capabilities remain gated, blocked, future, or read-only.",
    source: "Local/static readiness model.",
  },
];

const blockedContextClasses = [
  "Unknown-source context as canonical",
  "Customer data handling",
  "Private memory writes",
  "Hidden persistence",
  "Automatic context injection",
  "Retrieval engine",
  "Live memory write",
  "Model dispatch",
  "Agent dispatch",
  "Execution",
  "Gate evaluation",
  "Canon update",
];

const activationBlockers = [
  "Palette assembles context; it does not authorize.",
  "Grid displays operational state; it does not execute.",
  "Context selection is not authority.",
  "Retrieval is not acceptance.",
  "Dashboard display does not authorize.",
  "Unknown-source context must not appear canonical.",
  "CONTROL_THREAD decides.",
  "Validation is not acceptance.",
  "Receipts record; they do not decide.",
  "ZERO GATES GRANTED.",
];

function buildContextPacketDraft() {
  return [
    "JAI PALETTE / GRID CONTEXT PACKET DRAFT - MANUAL HANDOFF ONLY",
    "record_id: SYN-PALETTE-GRID-PACKET-0001",
    "mode: READINESS REVIEW",
    "non_authorizations: NO RETRIEVAL ENGINE; NO CONTEXT INJECTION;",
    "  NO MEMORY WRITE; NO CUSTOMER DATA HANDLING; NO MODEL DISPATCH;",
    "  NO AGENT DISPATCH; NO RECEIPT CREATION; NO CANON UPDATE;",
    "  ZERO GATES GRANTED",
    "required acknowledgements:",
    "- Palette assembles context; it does not authorize.",
    "- Grid displays operational state; it does not execute.",
    "- Context selection is not authority.",
    "- Retrieval is not acceptance.",
    "- Unknown-source context must not appear canonical.",
    "- CONTROL_THREAD decides.",
    "return shape: context_scope, source_posture, freshness, blocked_context, privacy_boundary, readiness_blockers",
  ].join("\n");
}

export function PaletteGridReadiness({
  index = "P/G",
  compact = false,
}: {
  index?: string;
  compact?: boolean;
}) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title="JAI Palette / Grid Readiness Surface"
        right={
          <>
            <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
            <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NO RETRIEVAL ENGINE</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / Palette + Grid readiness / Commit 4
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Palette readiness describes context assembly. Grid readiness
              describes operational-state display. Neither surface authorizes,
              retrieves, injects context, writes memory, dispatches models or
              Agents, handles customer data, persists hidden state, or executes.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="advisory">CONTEXT SELECTION IS NOT AUTHORITY</OperatorBadge>
              <OperatorBadge tone="advisory">RETRIEVAL IS NOT ACCEPTANCE</OperatorBadge>
              <OperatorBadge tone="blocked">NO CUSTOMER DATA HANDLING</OperatorBadge>
              <OperatorBadge tone="blocked">NO LIVE MEMORY WRITE</OperatorBadge>
            </div>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Compose-only context packet
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Local clipboard draft only. No submit, retrieval injection,
              memory write, persistence, dispatch, receipt creation, canon
              update, or state mutation.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <OperatorComposeButton text={buildContextPacketDraft}>
                Copy context packet
              </OperatorComposeButton>
              <OperatorBadge tone="composeOnly">REAL-COMPOSE</OperatorBadge>
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {paletteContextCards.map((card) => (
            <OperatorGateCard key={card.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {card.context}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{card.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge tone="fixture">CONTEXT FIXTURE</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    source /{" "}
                  </span>
                  {card.source}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    freshness /{" "}
                  </span>
                  {card.freshness}
                </div>
                <div className="text-amber-300">
                  <span className="font-mono uppercase text-amber-500">
                    boundary /{" "}
                  </span>
                  {card.boundary}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Context readiness</OperatorReadOnlyAction>
                <OperatorBlockedAction>Inject context</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {gridStateCards.map((card) => (
            <OperatorGateCard key={card.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {card.state}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{card.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge tone="readOnly">STATE DISPLAY</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    posture /{" "}
                  </span>
                  {card.posture}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    source /{" "}
                  </span>
                  {card.source}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Operational map</OperatorReadOnlyAction>
                <OperatorBlockedAction>Execute state</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Blocked context classes
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {blockedContextClasses.map((blocked) => (
                <OperatorBadge key={blocked} tone="blocked">
                  {blocked}
                </OperatorBadge>
              ))}
            </div>
          </div>

          <div className="rounded border border-amber-900 bg-amber-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Privacy / customer-data boundary
            </div>
            <p className="mt-2 text-xs text-amber-100">
              Customer data is not handled in this readiness surface. Private,
              unknown-source, or customer-origin context must remain blocked
              unless future gates, provenance, privacy review, and receipts are
              explicitly established.
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
