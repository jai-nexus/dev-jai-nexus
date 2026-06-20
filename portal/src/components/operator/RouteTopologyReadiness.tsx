import {
  OperatorBadge,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
} from "@/components/operator/slate";

type RouteTopologySurface = {
  id: string;
  route: string;
  labels: string[];
  role: string;
  currentPosture: string;
  relationship: string;
  deferredDecision: string;
  actionLabel: "READ-ONLY" | "GATED" | "BLOCKED" | "FUTURE" | "NOT AUTHORIZED IN V0";
  source: "SYNTHETIC" | "READ-ONLY CANONICAL";
};

const routeTopologySurfaces: RouteTopologySurface[] = [
  {
    id: "SYN-ROUTE-0001",
    route: "/operator",
    labels: ["PRIMARY", "READ-ONLY", "NO ACTIVATION"],
    role: "Current Operator entry point and orientation surface.",
    currentPosture: "Remains the Operator root in Commit 1.",
    relationship:
      "Points operators toward current read-only posture, source counts, and route topology without becoming a live cockpit.",
    deferredDecision: "Should another Operator surface become the root?",
    actionLabel: "READ-ONLY",
    source: "SYNTHETIC",
  },
  {
    id: "SYN-ROUTE-0002",
    route: "/operator/control-plane",
    labels: ["PRIMARY", "CONTROL PLANE", "READ-ONLY"],
    role: "Current control-plane surface for cockpit posture and gated readiness display.",
    currentPosture:
      "Retained with no redirect, replacement, or specialization decision.",
    relationship:
      "Carries canonical posture reads and synthetic panels; does not replace the Operator root.",
    deferredDecision: "Remain, redirect, or become a specialized subsection?",
    actionLabel: "READ-ONLY",
    source: "SYNTHETIC",
  },
  {
    id: "SYN-ROUTE-0003",
    route: "/operator/live-dashboard",
    labels: ["SECONDARY", "PROTOTYPE", "PENDING DECISION"],
    role: "Live-readiness prototype and future cockpit candidate.",
    currentPosture: "Not promoted to Operator root in Commit 1.",
    relationship:
      "Shows live-looking readiness fixtures only; route promotion requires a later CONTROL_THREAD decision.",
    deferredDecision: "Should live-dashboard become /operator?",
    actionLabel: "FUTURE",
    source: "SYNTHETIC",
  },
  {
    id: "SYN-ROUTE-0004",
    route: "/operator/council-prototype",
    labels: ["SECONDARY", "PROTOTYPE", "PENDING DECISION"],
    role: "Council prototype and advisory readiness surface.",
    currentPosture: "Not promoted to /operator/council in Commit 1.",
    relationship:
      "Represents Council returns, dissent, and synthesis; it is not an active Council route.",
    deferredDecision: "Should council-prototype become /operator/council?",
    actionLabel: "GATED",
    source: "SYNTHETIC",
  },
  {
    id: "SYN-ROUTE-0005",
    route: "/operator/design-system",
    labels: ["SECONDARY", "REFERENCE", "READ-ONLY"],
    role: "Operator Slate design and reference surface.",
    currentPosture: "Kept as a design/reference route.",
    relationship:
      "Documents route/action/status visual language; it does not govern route state.",
    deferredDecision: "Should design-system remain in the Operator subnav?",
    actionLabel: "READ-ONLY",
    source: "SYNTHETIC",
  },
  {
    id: "SYN-ROUTE-0006",
    route: "/operator/dct",
    labels: ["SECONDARY", "COMPATIBILITY", "READ-ONLY POSTURE"],
    role: "Decision/context tooling projection surface.",
    currentPosture:
      "Remains available; no DCT removal, redirect, or semantics change in Commit 1.",
    relationship:
      "Existing DCT paths include pre-existing mutation-capable API surfaces; this topology pass does not expand them.",
    deferredDecision: "Should DCT remain in the Operator subnav?",
    actionLabel: "NOT AUTHORIZED IN V0",
    source: "SYNTHETIC",
  },
  {
    id: "SYN-ROUTE-0007",
    route: "legacy top nav",
    labels: ["LEGACY", "COMPATIBILITY", "READ-ONLY LINKS"],
    role: "Existing global/top navigation posture.",
    currentPosture: "Remains available and unchanged in Commit 1.",
    relationship:
      "Global navigation stays compatible while Operator subnav topology remains undecided.",
    deferredDecision: "Should legacy top nav remain?",
    actionLabel: "READ-ONLY",
    source: "SYNTHETIC",
  },
];

const pendingQuestions = [
  "Should /operator/live-dashboard become /operator?",
  "Should /operator/council-prototype become /operator/council?",
  "Should /operator/control-plane remain, redirect, or become a specialized subsection?",
  "Should /operator/design-system remain in subnav?",
  "Should DCT remain in subnav?",
  "Should legacy top nav remain?",
  "Should phase-clustered navigation be introduced?",
  "Which route should become the primary future live cockpit once gates exist?",
];

const blockedBehavior = [
  "Route promotion",
  "Route redirects",
  "DCT removal",
  "Legacy top-nav removal",
  "Phase-clustered navigation implementation",
  "Navigation redesign",
  "Execution, dispatch, persistence, receipt creation, canon update, or gate evaluation",
];

export function RouteTopologyReadiness({
  index = "ROUTE",
  compact = false,
}: {
  index?: string;
  compact?: boolean;
}) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title="Route Topology Readiness Shell"
        right={
          <>
            <OperatorBadge tone="pending">DECISION PENDING</OperatorBadge>
            <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / route topology readiness / Commit 1
            </div>
            <p className="mt-2 text-sm text-slate-300">
              This shell makes the current Operator route relationships legible
              without deciding, promoting, redirecting, or redesigning them.
              Routes recommend and orient; they do not execute or authorize.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
            <OperatorBadge tone="advisory">MANUAL HANDOFF</OperatorBadge>
            <OperatorBadge tone="blocked">NOT AUTHORIZED IN V0</OperatorBadge>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {routeTopologySurfaces.map((surface) => (
            <article
              key={surface.id}
              className="rounded border border-slate-800 bg-slate-950/50 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-sm text-slate-100">
                  {surface.route}
                </div>
                <OperatorIdChip>{surface.id}</OperatorIdChip>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {surface.labels.map((label) => (
                  <OperatorBadge
                    key={`${surface.id}-${label}`}
                    tone={
                      label === "PRIMARY"
                        ? "pending"
                        : label === "LEGACY"
                          ? "advisory"
                          : label === "PENDING DECISION"
                            ? "gated"
                            : "neutral"
                    }
                  >
                    {label}
                  </OperatorBadge>
                ))}
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    role /{" "}
                  </span>
                  {surface.role}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    posture /{" "}
                  </span>
                  {surface.currentPosture}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    relationship /{" "}
                  </span>
                  {surface.relationship}
                </div>
                <div>
                  <span className="font-mono uppercase text-slate-500">
                    pending /{" "}
                  </span>
                  <span className="text-sky-300">
                    {surface.deferredDecision}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <OperatorBadge tone="fixture">{surface.source}</OperatorBadge>
                <OperatorBadge
                  tone={
                    surface.actionLabel === "READ-ONLY"
                      ? "readOnly"
                      : surface.actionLabel === "BLOCKED" ||
                          surface.actionLabel === "NOT AUTHORIZED IN V0"
                        ? "blocked"
                        : "gated"
                  }
                >
                  {surface.actionLabel}
                </OperatorBadge>
                <OperatorReadOnlyAction>Topology label only</OperatorReadOnlyAction>
              </div>
            </article>
          ))}
        </div>

        <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className="rounded border border-sky-900 bg-sky-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-sky-300">
              Route topology decisions deferred
            </div>
            <ul className="mt-2 space-y-1.5">
              {pendingQuestions.map((question) => (
                <li
                  key={question}
                  className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300"
                >
                  {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Blocked in Commit 1
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {blockedBehavior.map((behavior) => (
                <OperatorBadge key={behavior} tone="blocked">
                  {behavior}
                </OperatorBadge>
              ))}
            </div>
            <p className="mt-3 text-xs text-red-200">
              Authentication is not authorization. Verified sessions, dashboard
              display, read-only labels, council agreement, and route posture do
              not open execution gates.
            </p>
          </div>
        </div>
      </OperatorPanel>
    </section>
  );
}
