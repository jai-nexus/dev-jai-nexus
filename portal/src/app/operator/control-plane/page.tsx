import type { Metadata } from "next";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { CanonicalReadOnlySpine } from "@/components/operator/CanonicalReadOnlySpine";
import { LiveReadinessMatrix } from "@/components/operator/LiveReadinessMatrix";
import { RouteTopologyReadiness } from "@/components/operator/RouteTopologyReadiness";
import { controlPlanePrototypeFixture } from "@/lib/controlPlane/controlPlanePrototypeFixture";
import { readControlPlaneCanonicalPosture } from "@/lib/controlPlane/postureFromCanon";

import { ControlPlanePanels } from "./_components/ControlPlanePanels";

export const metadata: Metadata = {
  title: "Operator Control Plane | dev.jai.nexus",
  description: "Local static, non-authorizing Operator Control Plane prototype.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OperatorControlPlanePage() {
  const fixture = controlPlanePrototypeFixture;
  const canonicalPosture = await readControlPlaneCanonicalPosture();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-300 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  dev-jai-nexus / operator / control-plane
                </div>
                <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                  {fixture.title}
                </h1>
                <p className="mt-2 max-w-4xl text-sm text-slate-400">
                  Read-only operator cockpit combining canonical motion posture
                  with clearly labeled synthetic fixture panels. Nothing on this
                  page executes, dispatches, persists, or mutates system state.
                  This remains the current control-plane surface; it does not
                  replace `/operator` or promote `/operator/live-dashboard`.
                </p>
              </div>
              <div className="flex max-w-2xl flex-wrap justify-end gap-2">
                <OperatorBadge tone="pending">PRIMARY CONTROL PLANE</OperatorBadge>
                <OperatorBadge tone="gated">ROUTE DECISION PENDING</OperatorBadge>
                <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
                <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
                <OperatorBadge tone="fixture">LOCAL STATIC SNAPSHOT</OperatorBadge>
                <OperatorBadge tone="blocked">
                  ALL EXECUTION GATES CLOSED
                </OperatorBadge>
                <OperatorBadge tone="advisory">MANUAL HANDOFF</OperatorBadge>
                <OperatorBadge tone="advisory">ADVISORY ONLY</OperatorBadge>
                <OperatorBadge tone="fixture">REPRESENTATIONAL ONLY</OperatorBadge>
              </div>
            </div>

            <div className="mt-4 rounded border border-slate-700 bg-slate-950 p-3 font-mono text-xs uppercase tracking-wide text-slate-400">
              <OperatorBadge tone="fixture">FIXTURE PROVENANCE</OperatorBadge>
              <span className="ml-2">{fixture.provenance}</span>
            </div>

            <nav
              className="mt-4 flex flex-wrap gap-2 text-xs"
              aria-label="Control plane panels"
            >
              {[
                ["Motions", "motion-queue"],
                ["Routes", "route-queue"],
                ["Council", "council-slots"],
                ["Agent lanes", "agent-lanes"],
                ["Execution gates", "execution-gates"],
                ["Security gate model", "security-gate-model"],
              ].map(([label, target]) => (
                <a
                  key={target}
                  href={`#${target}`}
                  className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono uppercase tracking-wide text-slate-300 hover:border-sky-700 hover:text-sky-300"
                >
                  {label}
                </a>
              ))}
            </nav>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Control Plane Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">READ-ONLY CANONICAL</OperatorBadge>
              <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
            </div>
          </OperatorSafetyRail>
        </header>

        <ControlPlanePanels fixture={fixture} canonicalPosture={canonicalPosture} />

        <CanonicalReadOnlySpine
          index="CANON"
          cards={[
            {
              id: "CANON-MOTION",
              label: "Latest motion",
              value: canonicalPosture.latest_motion_id ?? "none",
              source: "READ-ONLY CANONICAL",
              freshness: canonicalPosture.source_label,
              detail:
                "Bundled motion posture display only; latest does not imply live verification.",
              href: "/operator/motions",
            },
            {
              id: "CANON-ATTN",
              label: "Attention",
              value: canonicalPosture.attention_count,
              source: "DERIVED",
              freshness: "Derived from current motion queue index read.",
              detail:
                "Attention count highlights stored package flags; it does not evaluate gates.",
              href: "/operator/motions?attention=1",
            },
            {
              id: "CANON-FIXTURE",
              label: "Fixture panels",
              value: fixture.fixture_id,
              source: "SYNTHETIC",
              freshness: fixture.snapshot_label,
              detail:
                "Control-plane panels remain local static fixture records, not canonical state.",
            },
            {
              id: "CANON-GATES",
              label: "Gates granted",
              value: fixture.gates_granted,
              source: "FIXTURE",
              freshness: "Local static gate posture fixture.",
              detail:
                "Gate display is non-authorizing; no execution gates are opened.",
            },
          ]}
        />

        <RouteTopologyReadiness index="TOPOLOGY" compact />

        <LiveReadinessMatrix index="MATRIX" />

        <OperatorPanel>
          <OperatorSectionHeader
            index="BOUNDARY"
            title="Explicit Non-Authorizations"
            right={
              <OperatorBadge tone="blocked">Not authorized in v0</OperatorBadge>
            }
          />
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {fixture.non_authorizations.map((boundary) => (
              <div
                key={boundary}
                className="rounded border border-red-900/70 bg-red-950/20 p-3 text-xs text-red-200"
              >
                {boundary}
              </div>
            ))}
          </div>
        </OperatorPanel>

        <footer className="flex flex-wrap items-center justify-center gap-2 text-center font-mono text-[10px] uppercase tracking-widest text-slate-500">
          <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
          <span>
            {fixture.fixture_id} / synthetic SYN-* data / local static snapshot
            / not production
          </span>
        </footer>
      </div>
    </main>
  );
}
