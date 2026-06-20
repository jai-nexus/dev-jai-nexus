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

function actionTone(action: string): OperatorSlateTone {
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

const paletteGridLinks = [
  {
    href: "/operator/grid",
    label: "Grid",
    posture: "Operational-state map and configuration posture.",
  },
  {
    href: "/operator/work",
    label: "Work",
    posture: "Deterministic agenda and work queue posture.",
  },
  {
    href: "/operator/portfolio-status",
    label: "Portfolio",
    posture: "Fixture-backed project/repo/work status.",
  },
  {
    href: "/operator/live-dashboard",
    label: "Live dashboard",
    posture: "Live-readiness prototype, not authority.",
  },
  {
    href: "/operator/control-plane",
    label: "Control plane",
    posture: "Current cockpit control-plane surface.",
  },
  {
    href: "/operator/corpus",
    label: "Corpus",
    posture: "Readiness evidence and blocked corpus posture.",
  },
  {
    href: "/operator/operating-context",
    label: "Operating context",
    posture: "Versioned context fixture display.",
  },
];

const paletteLifecycle = [
  {
    id: "SYN-PALETTE-LIFE-0001",
    phase: "Select context class",
    action: "READ-ONLY",
    boundary: "Context class selection orients review; it does not authorize.",
  },
  {
    id: "SYN-PALETTE-LIFE-0002",
    phase: "Label source posture",
    action: "READ-ONLY",
    boundary: "Unknown-source context must remain unknown, not canonical.",
  },
  {
    id: "SYN-PALETTE-LIFE-0003",
    phase: "Check freshness",
    action: "GATED",
    boundary: "Freshness is a label, not live verification or acceptance.",
  },
  {
    id: "SYN-PALETTE-LIFE-0004",
    phase: "Exclude blocked context",
    action: "BLOCKED",
    boundary:
      "Customer data, private memory, unknown-source canon, and injection remain blocked.",
  },
  {
    id: "SYN-PALETTE-LIFE-0005",
    phase: "Compose packet locally",
    action: "REAL-COMPOSE",
    boundary:
      "Clipboard draft only; no retrieval, injection, persistence, or dispatch.",
  },
  {
    id: "SYN-PALETTE-LIFE-0006",
    phase: "Manual handoff only",
    action: "MANUAL HANDOFF",
    boundary: "CONTROL_THREAD decides; packet display does not grant authority.",
  },
];

const gridLifecycle = [
  {
    id: "SYN-GRID-LIFE-0001",
    phase: "Display relationships",
    action: "READ-ONLY",
    boundary: "Project/repo/work relationships are display posture only.",
  },
  {
    id: "SYN-GRID-LIFE-0002",
    phase: "Display queues",
    action: "READ-ONLY",
    boundary: "Route, motion, and work queues do not schedule or execute.",
  },
  {
    id: "SYN-GRID-LIFE-0003",
    phase: "Display capability map",
    action: "GATED",
    boundary: "Capability display is not activation or gate evaluation.",
  },
  {
    id: "SYN-GRID-LIFE-0004",
    phase: "Display blockers",
    action: "BLOCKED",
    boundary: "Blockers remain visible and cannot be bypassed by dashboard state.",
  },
  {
    id: "SYN-GRID-LIFE-0005",
    phase: "No execution",
    action: "NOT AUTHORIZED IN V0",
    boundary: "Grid displays operational state; it does not execute.",
  },
  {
    id: "SYN-GRID-LIFE-0006",
    phase: "No mutation",
    action: "NOT AUTHORIZED IN V0",
    boundary:
      "No route-state, motion-state, repo, file, receipt, canon, or memory mutation.",
  },
];

const paletteContextCards = [
  {
    id: "SYN-PALETTE-CTX-0001",
    context: "Project context",
    posture: "Relevant project context",
    source: "Local/static fixture map",
    sourceLabel: "FIXTURE",
    freshness: "Snapshot only",
    boundary: "Relevant project context is advisory; context selection is not authority.",
  },
  {
    id: "SYN-PALETTE-CTX-0002",
    context: "Repo context",
    posture: "Relevant repo context",
    source: "Read-only registry/config references",
    sourceLabel: "DB READ-ONLY / DERIVED",
    freshness: "Derived display",
    boundary: "Repo context does not authorize repo mutation or branch/PR automation.",
  },
  {
    id: "SYN-PALETTE-CTX-0003",
    context: "Motion / receipt context",
    posture: "Relevant motion/receipt context",
    source: "Read-only canonical shape where already accepted",
    sourceLabel: "READ-ONLY CANONICAL",
    freshness: "Source-labeled",
    boundary: "Retrieval is not acceptance; receipts record, they do not decide.",
  },
  {
    id: "SYN-PALETTE-CTX-0004",
    context: "Council context",
    posture: "Relevant Council context",
    source: "Synthetic advisory readiness records",
    sourceLabel: "SYNTHETIC / ADVISORY",
    freshness: "Fixture only",
    boundary: "Council context is advisory; Council agreement is not authority.",
  },
  {
    id: "SYN-PALETTE-CTX-0005",
    context: "Agent lane context",
    posture: "Relevant Agent lane context",
    source: "Synthetic Agent readiness records",
    sourceLabel: "SYNTHETIC",
    freshness: "Fixture only",
    boundary: "Agent lane context is staged and non-executing.",
  },
];

const gridStateCards = [
  {
    id: "SYN-GRID-STATE-0001",
    state: "Operational state map",
    scope: "project / repo / work",
    posture: "Displays relationships; it does not execute.",
    source: "Local/static configuration and derived display.",
    sourceLabel: "DERIVED",
  },
  {
    id: "SYN-GRID-STATE-0002",
    state: "Project / repo / work relationships",
    scope: "relationship map",
    posture: "Relationship display is not routing authority.",
    source: "Read-only registry, fixture, or derived records.",
    sourceLabel: "DB READ-ONLY / FIXTURE",
  },
  {
    id: "SYN-GRID-STATE-0003",
    state: "Route / motion / work queues",
    scope: "queue posture",
    posture: "Queues are readiness posture, not autonomous scheduling.",
    source: "Existing read-only surfaces or synthetic readiness labels.",
    sourceLabel: "PARTIAL STREAM / SYNTHETIC",
  },
  {
    id: "SYN-GRID-STATE-0004",
    state: "Capability map",
    scope: "capability readiness",
    posture: "Capabilities remain gated, blocked, future, or read-only.",
    source: "Local/static readiness model.",
    sourceLabel: "FIXTURE",
  },
];

const sourceFreshnessLegend = [
  ["READ-ONLY CANONICAL", "Accepted stored shape shown for review; not executable."],
  ["DB READ-ONLY", "Database rows read for display; no write path added."],
  ["YAML-BACKED CANONICAL", "Checked-in canonical/config source; not dispatchable."],
  ["DERIVED", "Computed from already-read sources; not source-of-truth."],
  ["PARTIAL STREAM", "Known partial queue or event posture; not complete verification."],
  ["FIXTURE", "Local/static readiness record."],
  ["SYNTHETIC", "SYN-* future readiness record; non-canonical."],
  ["UNKNOWN SOURCE", "Must remain conservative and never appear canonical."],
];

const queuePostureCards = [
  {
    id: "SYN-GRID-QUEUE-0001",
    queue: "Route queue",
    posture: "Routes recommend; they do not execute.",
  },
  {
    id: "SYN-GRID-QUEUE-0002",
    queue: "Motion queue",
    posture: "Motion posture is read-only display, not motion-state mutation.",
  },
  {
    id: "SYN-GRID-QUEUE-0003",
    queue: "Work queue",
    posture: "Work queue posture does not schedule, dispatch, or run Agents.",
  },
];

const capabilityMapCards = [
  {
    id: "SYN-GRID-CAP-0001",
    capability: "Context assembly",
    posture: "Palette can frame a packet; it cannot inject it.",
  },
  {
    id: "SYN-GRID-CAP-0002",
    capability: "Operational map",
    posture: "Grid can display state; it cannot execute state.",
  },
  {
    id: "SYN-GRID-CAP-0003",
    capability: "Council context",
    posture: "Council output is advisory claims, not facts or authority.",
  },
  {
    id: "SYN-GRID-CAP-0004",
    capability: "Agent lane context",
    posture: "Agent lanes are staged, not executing or dispatching.",
  },
];

const blockedContextClasses = [
  "Unknown-source context as canonical",
  "Unknown-source records",
  "Stale records as current",
  "Customer data handling",
  "Private context without policy",
  "Private memory writes",
  "Hidden persistence",
  "Automatic context injection",
  "Retrieval engine",
  "Live memory write",
  "Model dispatch",
  "Agent dispatch",
  "Execution",
  "Gate evaluation",
  "Receipt creation",
  "Canon update",
];

const liveReadinessBlockers = [
  "No retrieval engine.",
  "No automatic context injection.",
  "No customer-data handling.",
  "No live memory writes.",
  "No model dispatch.",
  "No Agent dispatch.",
  "No execution gates opened.",
  "ZERO GATES GRANTED.",
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
  "Read-only is not authority.",
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
              dev.jai.nexus / Palette + Grid readiness / Commit 5
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Palette readiness describes context assembly. Grid readiness
              describes operational-state display. Neither surface authorizes,
              retrieves, injects context, writes memory, dispatches models or
              Agents, handles customer data, persists hidden state, or executes.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="advisory">PALETTE ASSEMBLES CONTEXT; IT DOES NOT AUTHORIZE</OperatorBadge>
              <OperatorBadge tone="readOnly">GRID DISPLAYS OPERATIONAL STATE</OperatorBadge>
              <OperatorBadge tone="blocked">GRID DOES NOT EXECUTE</OperatorBadge>
              <OperatorBadge tone="advisory">CONTEXT SELECTION IS NOT AUTHORITY</OperatorBadge>
              <OperatorBadge tone="advisory">RETRIEVAL IS NOT ACCEPTANCE</OperatorBadge>
              <OperatorBadge tone="advisory">READ-ONLY IS NOT AUTHORITY</OperatorBadge>
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

        <div className="grid gap-3 xl:grid-cols-2">
          <LifecyclePanel title="Palette context assembly lifecycle" items={paletteLifecycle} />
          <LifecyclePanel title="Grid operational-state lifecycle" items={gridLifecycle} />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
              <div className="mt-3 flex flex-wrap gap-2">
                <OperatorBadge tone="advisory">{card.posture}</OperatorBadge>
                <OperatorBadge tone="fixture">{card.sourceLabel}</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <LabeledLine label="source" value={card.source} />
                <LabeledLine label="freshness" value={card.freshness} />
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
              <div className="mt-3 flex flex-wrap gap-2">
                <OperatorBadge tone="advisory">{card.scope}</OperatorBadge>
                <OperatorBadge tone="fixture">{card.sourceLabel}</OperatorBadge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <LabeledLine label="posture" value={card.posture} />
                <LabeledLine label="source" value={card.source} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorReadOnlyAction>Operational map</OperatorReadOnlyAction>
                <OperatorBlockedAction>Execute state</OperatorBlockedAction>
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Source / freshness legend
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {sourceFreshnessLegend.map(([label, detail]) => (
                <div
                  key={label}
                  className="rounded border border-slate-800 bg-slate-950 p-3"
                >
                  <OperatorBadge
                    tone={label === "UNKNOWN SOURCE" ? "blocked" : "readOnly"}
                  >
                    {label}
                  </OperatorBadge>
                  <p className="mt-2 text-xs text-slate-400">{detail}</p>
                </div>
              ))}
            </div>
          </OperatorGateCard>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Queue and capability posture
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {[...queuePostureCards, ...capabilityMapCards].map((item) => (
                <div
                  key={item.id}
                  className="rounded border border-slate-800 bg-slate-950 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <OperatorIdChip>{item.id}</OperatorIdChip>
                    <OperatorBadge
                      tone={"queue" in item ? "readOnly" : "gated"}
                    >
                      {"queue" in item ? "READ-ONLY" : "CAPABILITY MAP"}
                    </OperatorBadge>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">
                    {"queue" in item ? item.queue : item.capability}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{item.posture}</p>
                </div>
              ))}
            </div>
          </OperatorGateCard>
        </div>

        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Palette / Grid route links
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {paletteGridLinks.map((link) => (
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
              {[...liveReadinessBlockers, ...activationBlockers].map((blocker) => (
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

function LabeledLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono uppercase text-slate-500">{label} / </span>
      {value}
    </div>
  );
}

function LifecyclePanel({
  title,
  items,
}: {
  title: string;
  items: Array<{
    id: string;
    phase: string;
    action: string;
    boundary: string;
  }>;
}) {
  return (
    <OperatorGateCard>
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {title}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded border border-slate-800 bg-slate-950 p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  {item.phase}
                </div>
                <div className="mt-1">
                  <OperatorIdChip>{item.id}</OperatorIdChip>
                </div>
              </div>
              <OperatorBadge tone={actionTone(item.action)}>
                {item.action}
              </OperatorBadge>
            </div>
            <p className="mt-3 text-xs text-slate-400">{item.boundary}</p>
          </div>
        ))}
      </div>
    </OperatorGateCard>
  );
}
