import type { Metadata } from "next";

import { controlPlanePrototypeFixture } from "@/lib/controlPlane/controlPlanePrototypeFixture";

import { ControlPlaneBadge } from "./_components/ControlPlaneBadges";
import { ControlPlanePanels } from "./_components/ControlPlanePanels";

export const metadata: Metadata = {
  title: "Operator Control Plane",
  description: "Local static, non-authorizing Operator Control Plane prototype.",
};

export default function OperatorControlPlanePage() {
  const fixture = controlPlanePrototypeFixture;

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-gray-100 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500">
                dev-jai-nexus / operator / control-plane
              </div>
              <h1 className="mt-2 text-3xl font-semibold">{fixture.title}</h1>
              <p className="mt-2 max-w-4xl text-sm text-gray-400">
                Local static prototype extracted from the v0 import. All displayed records are
                checked-in synthetic fixture data. Nothing on this page executes, dispatches,
                persists, or mutates system state.
              </p>
            </div>
            <div className="flex max-w-2xl flex-wrap justify-end gap-2">
              <ControlPlaneBadge tone="amber">NON-AUTHORIZING</ControlPlaneBadge>
              <ControlPlaneBadge tone="rose">ZERO GATES GRANTED</ControlPlaneBadge>
              <ControlPlaneBadge tone="sky">LOCAL STATIC SNAPSHOT</ControlPlaneBadge>
              <ControlPlaneBadge tone="rose">ALL EXECUTION GATES CLOSED</ControlPlaneBadge>
              <ControlPlaneBadge tone="sky">MANUAL HANDOFF</ControlPlaneBadge>
              <ControlPlaneBadge tone="sky">ADVISORY ONLY</ControlPlaneBadge>
              <ControlPlaneBadge tone="amber">REPRESENTATIONAL ONLY</ControlPlaneBadge>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-amber-900 bg-amber-950/30 p-3 font-mono text-xs uppercase tracking-wide text-amber-100">
            {fixture.provenance}
          </div>

          <nav className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Control plane panels">
            {[
              ["Motions", "motion-queue"],
              ["Routes", "route-queue"],
              ["Council", "council-slots"],
              ["Agent lanes", "agent-lanes"],
              ["Execution gates", "execution-gates"],
            ].map(([label, target]) => (
              <a
                key={target}
                href={`#${target}`}
                className="rounded-md border border-gray-700 bg-black/30 px-3 py-1.5 text-gray-300 hover:border-gray-500 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <ControlPlanePanels fixture={fixture} />

        <section className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-gray-100">Explicit Non-Authorizations</h2>
            <ControlPlaneBadge tone="rose">Not authorized in v0</ControlPlaneBadge>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {fixture.non_authorizations.map((boundary) => (
              <div
                key={boundary}
                className="rounded-lg border border-gray-800 bg-black/30 p-3 text-xs text-gray-300"
              >
                {boundary}
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center font-mono text-[10px] uppercase tracking-widest text-gray-500">
          {fixture.fixture_id} / synthetic SYN-* data / local static snapshot / not production
        </footer>
      </div>
    </main>
  );
}
