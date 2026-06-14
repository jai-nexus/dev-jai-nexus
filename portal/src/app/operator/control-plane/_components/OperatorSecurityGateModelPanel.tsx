import { operatorSecurityGateModelFixture as model } from "@/lib/controlPlane/operatorSecurityGateModelFixture";

import {
  OperatorBadge,
  OperatorGateCard,
} from "@/components/operator/slate/OperatorSlatePrimitives";
import type { OperatorSlateTone } from "@/components/operator/slate/tokens";

function SecurityBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: OperatorSlateTone;
}) {
  return <OperatorBadge tone={tone}>{children}</OperatorBadge>;
}

export function OperatorSecurityGateModelPanel() {
  return (
    <section
      id="security-gate-model"
      className="scroll-mt-6 overflow-hidden rounded-xl border border-gray-800 bg-zinc-950 lg:col-span-12"
    >
      <header className="flex flex-wrap items-start gap-3 border-b border-gray-800 bg-black/30 px-4 py-3">
        <span className="font-mono text-xs text-gray-500">10</span>
        <div>
          <h2 className="font-semibold text-gray-100">Operator Security Gate Model v0</h2>
          <p className="mt-1 max-w-4xl text-xs text-gray-400">{model.summary}</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <SecurityBadge tone="fixture">FIXTURE</SecurityBadge>
          <SecurityBadge tone="danger">ZERO GATES GRANTED</SecurityBadge>
        </div>
      </header>

      <div className="space-y-5 p-4">
        <div className="flex flex-wrap gap-2">
          {model.posture_labels.map((label) => (
            <OperatorBadge
              key={label}
              tone={
                label.includes("NO ") ||
                label.includes("CLOSED") ||
                label.includes("ZERO")
                  ? "danger"
                  : label === "READ-ONLY"
                    ? "readOnly"
                    : "advisory"
              }
            >
              {label}
            </OperatorBadge>
          ))}
          <SecurityBadge>{model.model_id}</SecurityBadge>
          <SecurityBadge tone="fixture">FIXTURE</SecurityBadge>
        </div>

        <div className="rounded-lg border border-rose-900 bg-rose-950/20 p-3">
          <strong className="text-sm text-rose-100">
            ALL EXECUTION GATES CLOSED
          </strong>
          <p className="mt-1 text-xs text-rose-200">
            These classes are future-review vocabulary only. No gate is evaluated,
            enforced, granted, or opened by this model.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-300">
            Future-review gate classes
          </h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {model.gate_classes.map((gate) => (
              <OperatorGateCard
                key={gate.gate_id}
                className="border-gray-800 bg-black/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-gray-300">
                        {gate.gate_id}
                      </span>
                      <SecurityBadge tone="fixture">FIXTURE</SecurityBadge>
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-gray-100">
                      {gate.name}
                    </h4>
                  </div>
                  <SecurityBadge tone="danger">{gate.v0_status}</SecurityBadge>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">
                  {gate.purpose}
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-gray-500">
                      Required evidence
                    </div>
                    <ul className="mt-1 space-y-1 text-xs text-gray-300">
                      {gate.required_evidence.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-gray-500">
                      Future activation requirements
                    </div>
                    <ul className="mt-1 space-y-1 text-xs text-gray-300">
                      {gate.future_activation_requirements.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {gate.blocked_capabilities.map((capability) => (
                    <SecurityBadge key={capability} tone="danger">
                      {capability}
                    </SecurityBadge>
                  ))}
                </div>
                <p className="mt-3 border-t border-gray-800 pt-2 text-[10px] uppercase tracking-wide text-amber-200">
                  {gate.non_authorizing_note}
                </p>
              </OperatorGateCard>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-300">
            Capability matrix
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full min-w-[800px] text-left text-xs">
              <thead className="border-b border-gray-800 bg-black/30 text-[10px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="p-3">Capability</th>
                  <th className="p-3">Fixture ID</th>
                  <th className="p-3">v0 status</th>
                  <th className="p-3">Future gate requirements</th>
                </tr>
              </thead>
              <tbody>
                {model.capability_matrix.map((entry) => (
                  <tr
                    key={entry.capability_id}
                    className="border-b border-gray-800 last:border-0"
                  >
                    <td className="p-3 font-medium text-gray-200">
                      {entry.capability}
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-gray-400">
                        {entry.capability_id}
                      </span>{" "}
                      <SecurityBadge tone="fixture">FIXTURE</SecurityBadge>
                    </td>
                    <td className="p-3">
                      <SecurityBadge tone="danger">
                        {entry.v0_status}
                      </SecurityBadge>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-gray-400">
                      {entry.future_gate_requirements.join(" / ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-amber-900 bg-amber-950/10 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-200">
              Doctrine invariants
            </h3>
            <ul className="mt-2 space-y-1.5">
              {model.doctrine_invariants.map((invariant) => (
                <li key={invariant} className="font-mono text-xs text-gray-200">
                  {invariant}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-gray-800 bg-black/30 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
              Deferred review
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-400">
              {model.deferred_items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-300">
              Review questions
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-400">
              {model.review_questions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-rose-900 bg-rose-950/10 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-200">
              Explicit non-authorizations
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
              {model.non_authorizations.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-gray-800 bg-black/30 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
              Recommended next routes
            </h3>
            <ul className="mt-2 space-y-2">
              {model.recommended_next_routes.map((route) => (
                <li
                  key={route}
                  className="rounded border border-gray-800 px-3 py-2 font-mono text-xs text-gray-300"
                >
                  {route}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
