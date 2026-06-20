import Link from "next/link";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { PaletteGridReadiness } from "@/components/operator/PaletteGridReadiness";
import { getAgentGovernanceSandboxModel } from "@/lib/controlPlane/agentGovernanceSandbox";
import {
  corpusReadinessGates,
  getCorpusReadinessGateCounts,
} from "@/lib/controlPlane/corpusReadinessGates";
import { getDraftReviewPrototypeModel } from "@/lib/controlPlane/draftReviewPrototype";

function toneForStatus(status: string): OperatorSlateTone {
  if (status === "satisfied_by_canon") return "canonical";
  if (status === "partially_satisfied") return "advisory";
  if (status === "unmet_future") return "blocked";
  if (status === "blocked_by_authority") return "blocked";
  return "gated";
}

function fixtureTone(label: string): OperatorSlateTone {
  const normalized = label.toLowerCase();
  if (
    normalized.includes("no authority") ||
    normalized.includes("not open") ||
    normalized.includes("no runtime")
  ) {
    return "blocked";
  }
  if (normalized.includes("review") || normalized.includes("human")) {
    return "advisory";
  }
  return "fixture";
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: string;
}) {
  const slateTone: OperatorSlateTone =
    tone === "canonical" || tone.includes("emerald")
      ? "canonical"
      : tone === "advisory" || tone.includes("amber")
        ? "advisory"
        : tone === "blocked" || tone.includes("rose")
          ? "blocked"
          : tone === "gated"
            ? "gated"
            : "fixture";

  return <OperatorBadge tone={slateTone}>{children}</OperatorBadge>;
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: OperatorSlateTone;
}) {
  return (
    <OperatorPanel>
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorStatusChip status="READ-ONLY" tone={tone} />
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
    </OperatorPanel>
  );
}

export default function OperatorCorpusPage() {
  const counts = getCorpusReadinessGateCounts();
  const sandbox = getAgentGovernanceSandboxModel();
  const draftReview = getDraftReviewPrototypeModel();

  return (
    <main className="min-h-screen bg-slate-950 px-8 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">
                Corpus V2 Readiness Drilldown
              </h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY CANON EVIDENCE</OperatorBadge>
              <OperatorBadge tone="fixture">SIMULATED FIXTURES</OperatorBadge>
              <OperatorBadge tone="blocked">CORPUS V2 NOT OPEN</OperatorBadge>
              <OperatorBadge tone="blocked">NO PROVIDER CALLS</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Static inspection surface for Corpus V2 readiness gates. Canon
              evidence, simulated fixtures, and human review boundaries remain
              visibly distinct. Readiness display does not open Corpus V2.
            </p>
            <OperatorGateCard className="mt-4 text-sm text-slate-300">
              Source of truth remains{" "}
              <OperatorIdChip>
                .nexus/canon/corpus/corpus-v2-readiness-checklist.md
              </OperatorIdChip>
              . Validation is not acceptance, and a satisfied gate does not grant
              runtime authority.
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Open Corpus V2</OperatorBlockedAction>
              <OperatorBlockedAction>Generate motion</OperatorBlockedAction>
              <OperatorBlockedAction>Ratify draft</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Gate status is review evidence only. No automatic gate evaluation,
              voting, ratification, or canon update occurs here.
            </p>
          </OperatorSafetyRail>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Canon satisfied" value={counts.satisfied_by_canon} tone="canonical" />
          <MetricCard label="Partial" value={counts.partially_satisfied} tone="advisory" />
          <MetricCard label="Unmet" value={counts.unmet_future} tone="blocked" />
          <MetricCard label="Authority blocked" value={counts.blocked_by_authority} tone="blocked" />
          <MetricCard label="Deferred" value={counts.deferred_until_v2_opening} tone="gated" />
        </section>

        <PaletteGridReadiness index="P/G" compact />

        <OperatorPanel>
          <OperatorSectionHeader
            index="01"
            title="Gate Drilldown"
            right={<OperatorBadge tone="readOnly">CANON-REFERENCED</OperatorBadge>}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Static local data model mirrored from readiness canon and
              machine-checkable gate modeling.
            </p>
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-wide text-amber-300 underline-offset-4 hover:underline"
            >
              Back to root overview
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-left">
                <tr>
                  <th className="px-3 py-2 text-xs text-slate-400">Gate</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Status</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Checkability</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Current evidence</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Missing before V2</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Authority note</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Source</th>
                </tr>
              </thead>
              <tbody>
                {corpusReadinessGates.map((gate) => (
                  <tr key={gate.gate_id} className="border-b border-slate-900 align-top hover:bg-slate-900/60">
                    <td className="px-3 py-3 text-xs text-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <OperatorIdChip>{gate.gate_id}</OperatorIdChip>
                        <span>{gate.gate_label}</span>
                      </div>
                    </td>
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
        </OperatorPanel>

        <OperatorPanel>
          <OperatorSectionHeader
            index="02"
            title="Sandbox Trace Review"
            right={<OperatorBadge tone="fixture">FIXTURE / SIMULATED</OperatorBadge>}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="border-amber-800 bg-amber-950 text-amber-200">Fixture-only</Badge>
            <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">Simulated</Badge>
            <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">Not canon</Badge>
            <Badge tone="border-rose-800 bg-rose-950 text-rose-200">No authority</Badge>
          </div>
          <p className="mt-3 text-sm text-slate-400">{sandbox.note}</p>
          <div className="mt-3">
            <OperatorIdChip>{sandbox.canon_ref}</OperatorIdChip>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-gray-100">Validator posture</div>
              <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">Static/manual validation</Badge>
              <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">Review-only</Badge>
              <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">No runtime enforcement</Badge>
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

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-gray-100">Fixture guard posture</div>
              <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">Guardrails only</Badge>
              <Badge tone="border-slate-800 bg-slate-950/70 text-slate-300">Not runtime enforcement</Badge>
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
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-gray-100">Sample draft trace</div>
                <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
              </div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.motion_draft.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.motion_draft.labels.map((label) => (
                  <Badge key={label} tone={fixtureTone(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.fixtures.motion_draft.summary}</p>
              <div className="mt-3 font-mono text-xs text-gray-400">
                {sandbox.fixtures.motion_draft.source_path}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-gray-100">
                  Sample vote/ratification trace
                </div>
                <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
              </div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.vote_ratification.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.vote_ratification.labels.map((label) => (
                  <Badge key={label} tone={fixtureTone(label)}>
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
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-gray-100">
                  Failure trace examples
                </div>
                <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
              </div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.failure_traces.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.failure_traces.labels.map((label) => (
                  <Badge key={label} tone={fixtureTone(label)}>
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

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-gray-100">
                  Gate evidence fixture
                </div>
                <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
              </div>
              <div className="mt-2 text-xs text-gray-400">{sandbox.fixtures.gate_evidence.fixture_id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sandbox.fixtures.gate_evidence.labels.map((label) => (
                  <Badge key={label} tone={fixtureTone(label)}>
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
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-sm font-semibold text-gray-100">Validation / evidence summary</div>
              <ul className="mt-3 space-y-1 text-sm text-gray-300">
                {sandbox.validation_summary.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <OperatorContradictionCard>
              <div className="text-sm font-semibold text-gray-100">Human boundary</div>
              <p className="mt-3 text-sm text-gray-300">{sandbox.human_boundary_note}</p>
            </OperatorContradictionCard>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-gray-100">Draft review prototype</div>
              <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
              {draftReview.authority_boundary_labels.map((label) => (
                <Badge key={label} tone={fixtureTone(label)}>
                  {label}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-300">{draftReview.draft_review_summary}</p>
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">Draft identity</div>
                <div className="mt-2 text-sm text-gray-300">{draftReview.fixture_id}</div>
                <div className="mt-1 text-sm text-gray-300">
                  {draftReview.draft_motion_id} / {draftReview.draft_state}
                </div>
                <div className="mt-1 text-sm text-gray-300">{draftReview.corpus_id}</div>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Target</div>
                <div className="mt-2 text-sm text-gray-300">
                  {draftReview.target_repo} / {draftReview.target_domain}
                </div>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Problem statement</div>
                <p className="mt-2 text-sm text-gray-300">{draftReview.problem_statement}</p>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Role/lens contributors</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>- proposer: {draftReview.proposer}</li>
                  {draftReview.role_lens_contributors.map((contributor) => (
                    <li key={contributor}>- contributor: {contributor}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">Proposed scope</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {draftReview.proposed_scope.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Non-goals</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {draftReview.non_goals.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Required files</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {draftReview.required_files.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">Validation expectations</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {draftReview.validation_expectations.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Manual checklist summary</div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {draftReview.validation_checklist_summary.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">Human review / authority boundary</div>
                <p className="mt-2 text-sm text-gray-300">
                  Human review required: {draftReview.human_review_required ? "true" : "false"}
                </p>
                <p className="mt-3 text-sm text-gray-300">{draftReview.no_authority_note}</p>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Source fixture</div>
                <div className="mt-2 font-mono text-xs text-gray-400">{draftReview.source_fixture_path}</div>

                <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Source canon</div>
                <ul className="mt-2 space-y-1 font-mono text-xs text-gray-400">
                  {draftReview.source_canon_paths.map((path) => (
                    <li key={path}>{path}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </OperatorPanel>
      </div>
    </main>
  );
}
