import Link from "next/link";

import { getAgentGovernanceSandboxModel } from "@/lib/controlPlane/agentGovernanceSandbox";
import {
  corpusReadinessGates,
  getCorpusReadinessGateCounts,
} from "@/lib/controlPlane/corpusReadinessGates";

function toneForStatus(status: string): string {
  if (status === "satisfied_by_canon") return "border-emerald-800 bg-emerald-950 text-emerald-200";
  if (status === "partially_satisfied") return "border-amber-800 bg-amber-950 text-amber-200";
  if (status === "unmet_future") return "border-rose-800 bg-rose-950 text-rose-200";
  if (status === "blocked_by_authority") return "border-rose-800 bg-rose-950 text-rose-200";
  return "border-gray-800 bg-zinc-900 text-gray-200";
}

function Badge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {children}
    </span>
  );
}

export default function OperatorCorpusPage() {
  const counts = getCorpusReadinessGateCounts();
  const sandbox = getAgentGovernanceSandboxModel();

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">Corpus V2 Readiness Drilldown</h1>
            <Badge tone="border-amber-800 bg-amber-950 text-amber-200">read-only</Badge>
            <Badge tone="border-rose-800 bg-rose-950 text-rose-200">not open</Badge>
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Static inspection surface for Corpus V2 readiness gates. This page is
            visibility-only and does not open Corpus V2, reset numbering, or
            add live drafting, voting, ratification, or runtime authority.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            Source of truth remains
            {" "}
            <span className="font-mono">.nexus/canon/corpus/corpus-v2-readiness-checklist.md</span>.
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Canon satisfied</div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">{counts.satisfied_by_canon}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Partial</div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">{counts.partially_satisfied}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Unmet</div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">{counts.unmet_future}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Authority blocked</div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">{counts.blocked_by_authority}</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Deferred</div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">{counts.deferred_until_v2_opening}</div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-gray-100">Gate Drilldown</h2>
              <p className="mt-1 text-sm text-gray-400">
                Static local data model mirrored from readiness canon and machine-checkable gate modeling.
              </p>
            </div>
            <Link href="/" className="text-sm text-sky-300 underline">
              Back to root overview
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-gray-800 bg-black/20 text-left">
                <tr>
                  <th className="px-3 py-2 text-xs text-gray-400">Gate</th>
                  <th className="px-3 py-2 text-xs text-gray-400">Status</th>
                  <th className="px-3 py-2 text-xs text-gray-400">Checkability</th>
                  <th className="px-3 py-2 text-xs text-gray-400">Current evidence</th>
                  <th className="px-3 py-2 text-xs text-gray-400">Missing before V2</th>
                  <th className="px-3 py-2 text-xs text-gray-400">Authority note</th>
                  <th className="px-3 py-2 text-xs text-gray-400">Source</th>
                </tr>
              </thead>
              <tbody>
                {corpusReadinessGates.map((gate) => (
                  <tr key={gate.gate_id} className="border-b border-gray-900 align-top hover:bg-zinc-900/60">
                    <td className="px-3 py-3 text-xs text-gray-200">{gate.gate_label}</td>
                    <td className="px-3 py-3 text-xs">
                      <Badge tone={toneForStatus(gate.status)}>{gate.status}</Badge>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-300">{gate.checkability}</td>
                    <td className="px-3 py-3 text-xs text-gray-300">{gate.current_evidence}</td>
                    <td className="px-3 py-3 text-xs text-gray-300">{gate.missing_before_v2}</td>
                    <td className="px-3 py-3 text-xs text-gray-300">{gate.authority_note}</td>
                    <td className="px-3 py-3 font-mono text-xs text-gray-400">{gate.source_artifact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-gray-100">Sandbox Trace Review</h2>
            <Badge tone="border-amber-800 bg-amber-950 text-amber-200">Fixture-only</Badge>
            <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">Simulated</Badge>
            <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">Not canon</Badge>
            <Badge tone="border-rose-800 bg-rose-950 text-rose-200">No authority</Badge>
          </div>
          <p className="mt-3 text-sm text-gray-400">{sandbox.note}</p>
          <div className="mt-3 font-mono text-xs text-gray-400">{sandbox.canon_ref}</div>

          <div className="mt-4 rounded-xl border border-gray-800 bg-black/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-gray-100">Validator posture</div>
              <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">Static/manual validation</Badge>
              <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">Review-only</Badge>
              <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">No runtime enforcement</Badge>
              <Badge tone="border-rose-800 bg-rose-950 text-rose-200">No authority</Badge>
            </div>
            <p className="mt-3 text-sm text-gray-300">{sandbox.validator.note}</p>
            <div className="mt-3 font-mono text-xs text-gray-400">{sandbox.validator.command}</div>
            <div className="mt-3 grid gap-4 xl:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Checked categories</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {sandbox.validator.checked_categories.map((category) => (
                    <li key={category}>- {category}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Source files</div>
                <ul className="mt-2 space-y-1 font-mono text-xs text-gray-400">
                  {sandbox.validator.source_paths.map((sourcePath) => (
                    <li key={sourcePath}>{sourcePath}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 grid gap-2 font-mono text-xs text-gray-400 xl:grid-cols-2">
              <div>{sandbox.validator.evidence_ref}</div>
              <div>{sandbox.validator.playbook_ref}</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-800 bg-black/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-gray-100">Fixture guard posture</div>
              <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">Guardrails only</Badge>
              <Badge tone="border-gray-800 bg-zinc-900 text-gray-200">Not runtime enforcement</Badge>
              <Badge tone="border-rose-800 bg-rose-950 text-rose-200">Corpus V2 not open</Badge>
            </div>
            <p className="mt-3 text-sm text-gray-300">{sandbox.guardrails.note}</p>
            <div className="mt-3 grid gap-4 xl:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Categories</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {sandbox.guardrails.categories.map((category) => (
                    <li key={category}>- {category}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Required fields</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {sandbox.guardrails.required_fields.map((field) => (
                    <li key={field}>- {field}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Required labels</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {sandbox.guardrails.required_labels.map((label) => (
                    <li key={label}>- {label}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 font-mono text-xs text-gray-400">{sandbox.guardrails.source_path}</div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
              <div className="text-sm font-semibold text-gray-100">Sample draft trace</div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.motion_draft.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.motion_draft.labels.map((label) => (
                  <Badge key={label} tone="border-gray-800 bg-zinc-900 text-gray-200">
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.fixtures.motion_draft.summary}</p>
              <div className="mt-3 font-mono text-xs text-gray-400">
                {sandbox.fixtures.motion_draft.source_path}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
              <div className="text-sm font-semibold text-gray-100">Sample vote/ratification trace</div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.vote_ratification.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.vote_ratification.labels.map((label) => (
                  <Badge key={label} tone="border-gray-800 bg-zinc-900 text-gray-200">
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.fixtures.vote_ratification.summary}</p>
              <div className="mt-3 font-mono text-xs text-gray-400">
                {sandbox.fixtures.vote_ratification.source_path}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
              <div className="text-sm font-semibold text-gray-100">Failure trace examples</div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.failure_traces.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.failure_traces.labels.map((label) => (
                  <Badge key={label} tone="border-gray-800 bg-zinc-900 text-gray-200">
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.fixtures.failure_traces.summary}</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-300">
                {sandbox.failure_trace_examples.map((trace) => (
                  <li key={trace}>- {trace}</li>
                ))}
              </ul>
              <div className="mt-3 font-mono text-xs text-gray-400">
                {sandbox.fixtures.failure_traces.source_path}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
              <div className="text-sm font-semibold text-gray-100">Gate evidence fixture</div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.gate_evidence.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.gate_evidence.labels.map((label) => (
                  <Badge key={label} tone="border-gray-800 bg-zinc-900 text-gray-200">
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.fixtures.gate_evidence.summary}</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-300">
                {sandbox.gate_evidence_summary.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <div className="mt-3 font-mono text-xs text-gray-400">
                {sandbox.fixtures.gate_evidence.source_path}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
            <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
              <div className="text-sm font-semibold text-gray-100">Validation / evidence summary</div>
              <ul className="mt-3 space-y-1 text-sm text-gray-300">
                {sandbox.validation_summary.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
              <div className="text-sm font-semibold text-gray-100">Human boundary</div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.human_boundary_note}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
