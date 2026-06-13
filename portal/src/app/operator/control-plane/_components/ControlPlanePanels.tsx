import type {
  ControlPlanePrototypeFixture,
  ControlPlaneRisk,
} from "@/lib/controlPlane/controlPlanePrototypeFixture";
import type { ControlPlaneCanonicalPosture } from "@/lib/controlPlane/postureFromCanon";

import { CloseoutIntakeComposer } from "./CloseoutIntakeComposer";
import {
  ControlPlaneBadge,
  InertControl,
  statusTone,
} from "./ControlPlaneBadges";

function Panel({
  index,
  id,
  title,
  description,
  children,
  className = "",
}: {
  index: number;
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-6 overflow-hidden rounded-xl border border-gray-800 bg-zinc-950 ${className}`}
    >
      <header className="flex flex-wrap items-start gap-3 border-b border-gray-800 bg-black/30 px-4 py-3">
        <span className="font-mono text-xs text-gray-500">{String(index).padStart(2, "0")}</span>
        <div>
          <h2 className="font-semibold text-gray-100">{title}</h2>
          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <ControlPlaneBadge tone="amber">NON-AUTHORIZING</ControlPlaneBadge>
          <ControlPlaneBadge>fixture</ControlPlaneBadge>
        </div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-800 py-2 last:border-0">
      <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-right text-xs text-gray-300">{value}</span>
    </div>
  );
}

function riskTone(risk: ControlPlaneRisk) {
  if (risk === "low") return "emerald";
  if (risk === "moderate") return "amber";
  return "rose";
}

export function ControlPlanePanels({
  fixture,
  canonicalPosture,
}: {
  fixture: ControlPlanePrototypeFixture;
  canonicalPosture: ControlPlaneCanonicalPosture;
}) {
  const activeMotions = fixture.motions.filter((motion) => motion.status !== "accepted").length;
  const pendingCloseouts = fixture.closeouts.filter(
    (closeout) => closeout.approval_state === "needs-review",
  ).length;
  const heldCapabilities = fixture.repos.reduce(
    (total, repo) => total + repo.held_capabilities,
    0,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel
        index={1}
        id="control-thread-status"
        title="Control Thread Status"
        description={`${fixture.control_thread.syn_id} / ${fixture.control_thread.authority_state}`}
        className="lg:col-span-12"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
            Synthetic baseline posture
          </h3>
          <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
          <ControlPlaneBadge tone="amber">{fixture.control_thread.syn_id}</ControlPlaneBadge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ["Doctrine baseline", fixture.control_thread.doctrine_baseline],
            ["Active batch", fixture.control_thread.active_batch],
            ["Active motions", activeMotions],
            ["Accepted baselines", fixture.control_thread.accepted_baseline_count],
            ["Pending closeouts", pendingCloseouts],
            ["Held capabilities", heldCapabilities],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-gray-800 bg-black/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
                <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
              </div>
              <div className="mt-2 break-words font-mono text-sm font-semibold text-gray-100">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-rose-900 bg-rose-950/30 p-3">
          <ControlPlaneBadge tone="rose">
            GATES GRANTED: {fixture.gates_granted}
          </ControlPlaneBadge>
          <strong className="text-sm text-rose-100">ALL EXECUTION GATES CLOSED</strong>
        </div>
        <div className="my-5 border-t border-gray-800" />
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
            Canonical motion posture
          </h3>
          <ControlPlaneBadge tone="emerald">{canonicalPosture.source_kind}</ControlPlaneBadge>
          <ControlPlaneBadge tone="sky">READ-ONLY</ControlPlaneBadge>
          <ControlPlaneBadge tone="amber">NON-AUTHORIZING</ControlPlaneBadge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ["Latest motion", canonicalPosture.latest_motion_id ?? "none"],
            ["Motion count", canonicalPosture.motion_count],
            ["Attention", canonicalPosture.attention_count],
            ["Ratified", canonicalPosture.ratified_count],
            ["Status mismatches", canonicalPosture.status_mismatch_count],
            ["Source mode", canonicalPosture.source_kind],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-emerald-900/60 bg-emerald-950/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
                <ControlPlaneBadge tone="emerald">CANONICAL</ControlPlaneBadge>
              </div>
              <div className="mt-2 break-words font-mono text-sm font-semibold text-gray-100">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-gray-800 bg-black/30 p-3 text-xs text-gray-400">
          Source: <span className="font-mono text-gray-200">{canonicalPosture.source_label}</span>
        </div>
        {canonicalPosture.warning ? (
          <div className="mt-3 rounded-lg border border-amber-900 bg-amber-950/20 p-3 text-xs text-amber-200">
            {canonicalPosture.warning}
          </div>
        ) : null}
      </Panel>

      <Panel
        index={2}
        id="motion-queue"
        title="Motion Queue"
        description="Synthetic motion posture; statuses do not execute or route work."
        className="lg:col-span-12"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-gray-800 text-[10px] uppercase tracking-wide text-gray-500">
              <tr>
                <th className="pb-2">Motion</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Approval</th>
                <th className="pb-2">Repo</th>
                <th className="pb-2">Next action</th>
                <th className="pb-2">Risk</th>
              </tr>
            </thead>
            <tbody>
              {fixture.motions.map((motion) => (
                <tr key={motion.syn_id} className="border-b border-gray-800 last:border-0">
                  <td className="py-3 font-mono text-gray-300">
                    <div className="flex flex-wrap items-center gap-2">
                      {motion.syn_id}
                      <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-200">{motion.title}</td>
                  <td className="py-3">
                    <ControlPlaneBadge tone={statusTone(motion.status)}>
                      {motion.status}
                    </ControlPlaneBadge>
                  </td>
                  <td className="py-3 font-mono text-gray-400">{motion.approval_state}</td>
                  <td className="py-3 font-mono text-gray-400">{motion.target_repo}</td>
                  <td className="py-3 pr-4 text-gray-400">{motion.next_action}</td>
                  <td className="py-3">
                    <ControlPlaneBadge tone={riskTone(motion.risk)}>{motion.risk}</ControlPlaneBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        index={3}
        id="route-queue"
        title="Route Queue"
        description="MANUAL HANDOFF only; route cards do not dispatch."
        className="lg:col-span-7"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {fixture.routes.map((route) => (
            <article key={route.syn_id} className="rounded-lg border border-gray-800 bg-black/30 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold text-gray-100">
                  {route.syn_id}
                  <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                </span>
                <ControlPlaneBadge tone={statusTone(route.state)}>{route.state}</ControlPlaneBadge>
              </div>
              <div className="mt-2 font-mono text-xs text-sky-300">{route.target_repo}</div>
              <div className="mt-2">
                <Field label="Mode" value={route.mode} />
                <Field label="Scope" value={route.scope} />
                <Field label="Validation" value={route.validation_expected} />
                <Field label="Boundary" value={route.authority_boundary} />
                <Field label="Gate" value={route.gate_status} />
              </div>
              <div className="mt-3">
                <InertControl>Compose handoff packet</InertControl>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-wide text-gray-500">
                Manual paste/import only
              </p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel
        index={4}
        id="council-slots"
        title="JAI Council / Model Slots"
        description="ADVISORY ONLY; no model call or provider dispatch."
        className="lg:col-span-5"
      >
        <div className="space-y-3">
          {fixture.council_slots.map((slot) => (
            <article key={slot.syn_id} className="rounded-lg border border-gray-800 bg-black/30 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="flex flex-wrap items-center gap-2 text-sm text-gray-100">
                  {slot.name}
                  <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                </strong>
                <ControlPlaneBadge>{slot.status}</ControlPlaneBadge>
              </div>
              <p className="mt-1 text-xs text-gray-400">{slot.role}</p>
              <p className="mt-2 text-xs text-gray-300">{slot.last_advisory}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <ControlPlaneBadge tone="sky">ADVISORY ONLY</ControlPlaneBadge>
                <ControlPlaneBadge tone="rose">GATED</ControlPlaneBadge>
              </div>
            </article>
          ))}
          <InertControl>Model comparison not authorized in v0</InertControl>
        </div>
      </Panel>

      <Panel
        index={5}
        id="agent-lanes"
        title="Agent Lane Staging"
        description="REPRESENTATIONAL ONLY; autonomous Agent execution is unavailable."
        className="lg:col-span-12"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {fixture.agent_lanes.map((lane) => (
            <article key={lane.syn_id} className="rounded-lg border border-gray-800 bg-black/30 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="flex flex-wrap items-center gap-2 text-sm text-gray-100">
                  {lane.name}
                  <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                </strong>
                <ControlPlaneBadge tone="rose">GATED</ControlPlaneBadge>
              </div>
              <div className="mt-1 font-mono text-[10px] text-gray-500">{lane.syn_id}</div>
              <div className="mt-3">
                <Field label="Repo" value={lane.target_repo} />
                <Field label="Scope" value={lane.allowed_scope} />
                <Field label="Validation" value={lane.required_validation} />
                <Field label="Evidence" value={lane.evidence_expected} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {lane.blocked_behaviors.map((behavior) => (
                  <ControlPlaneBadge key={behavior} tone="rose">
                    {behavior}
                  </ControlPlaneBadge>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel
        index={6}
        id="polyrepo-map"
        title="Polyrepo Authority Map"
        description="Fixture-backed repo posture; no live repo inspection or mutation."
        className="lg:col-span-7"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="border-b border-gray-800 text-[10px] uppercase tracking-wide text-gray-500">
              <tr>
                <th className="pb-2">Repo</th>
                <th className="pb-2">Lane</th>
                <th className="pb-2">Accepted</th>
                <th className="pb-2">Held</th>
                <th className="pb-2">Next route</th>
                <th className="pb-2">Risk</th>
              </tr>
            </thead>
            <tbody>
              {fixture.repos.map((repo) => (
                <tr key={repo.syn_id} className="border-b border-gray-800 last:border-0">
                  <td className="py-3 font-mono text-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      {repo.name}
                      <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400">{repo.current_lane}</td>
                  <td className="py-3 font-mono text-emerald-300">{repo.accepted_artifacts}</td>
                  <td className="py-3 font-mono text-rose-300">{repo.held_capabilities}</td>
                  <td className="py-3 text-gray-400">{repo.next_route}</td>
                  <td className="py-3">
                    <ControlPlaneBadge tone={riskTone(repo.risk)}>{repo.risk}</ControlPlaneBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        index={7}
        id="closeout-intake"
        title="Closeout / Receipt Intake"
        description="Receipts are evidence records; acceptance is not automatic."
        className="lg:col-span-12"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <section>
            <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Fixture intake records
            </h3>
            <div className="space-y-3">
              {fixture.closeouts.map((closeout) => (
                <article
                  key={closeout.syn_id}
                  className="rounded-lg border border-gray-800 bg-black/30 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-gray-100">
                      {closeout.syn_id}
                      <span className="ml-2">
                        <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                      </span>
                    </span>
                    <ControlPlaneBadge tone={statusTone(closeout.disposition)}>
                      {closeout.disposition}
                    </ControlPlaneBadge>
                  </div>
                  <div className="mt-2">
                    <Field label="Source" value={closeout.source_repo} />
                    <Field label="Evidence" value={closeout.evidence_basis} />
                    <Field
                      label="Validation"
                      value={closeout.validation_status}
                    />
                    <Field label="Approval" value={closeout.approval_state} />
                  </div>
                </article>
              ))}
            </div>
          </section>
          <CloseoutIntakeComposer />
        </div>
      </Panel>

      <Panel
        index={8}
        id="execution-gates"
        title="Execution Gates / Blocked Capabilities"
        description="Protected constraints are not removable from this surface."
        className="lg:col-span-7"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <ControlPlaneBadge tone="rose">
            GATES GRANTED: {fixture.gates_granted}
          </ControlPlaneBadge>
          <strong className="text-sm text-rose-100">ALL EXECUTION GATES CLOSED</strong>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {fixture.execution_gates.map((gate) => (
            <li key={gate.syn_id} className="rounded-lg border border-rose-900 bg-rose-950/20 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-100">
                  {gate.label}
                  <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                </span>
                <ControlPlaneBadge tone="rose">CLOSED</ControlPlaneBadge>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-rose-200">{gate.note}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        index={9}
        id="next-prompt-queue"
        title="Next Prompt Queue"
        description="Manual prompt starters only; no dispatch or automated routing."
        className="lg:col-span-5"
      >
        <div className="space-y-3">
          {fixture.next_prompts.map((prompt) => (
            <article key={prompt.syn_id} className="rounded-lg border border-gray-800 bg-black/30 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold text-gray-100">
                  {prompt.syn_id}
                  <ControlPlaneBadge>FIXTURE</ControlPlaneBadge>
                </span>
                <span className="font-mono text-xs text-sky-300">{prompt.target}</span>
              </div>
              <div className="mt-2">
                <Field label="Scope" value={prompt.scope} />
                <Field label="Mode" value={prompt.mode} />
                <Field label="Reason" value={prompt.reason} />
                <Field label="Dependencies" value={prompt.dependencies} />
              </div>
              <div className="mt-3">
                <InertControl>Compose handoff packet</InertControl>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
