export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";
import { getAgentDeliberationPanel } from "@/lib/agents/deliberationPanel";
import type {
  DeliberationAdvisoryVote,
  DeliberationCandidate,
  DeliberationCandidateSourceKind,
} from "@/lib/agents/deliberationTypes";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-800 bg-sky-950 text-sky-200"
      : tone === "amber"
        ? "border-amber-800 bg-amber-950 text-amber-200"
        : tone === "emerald"
          ? "border-emerald-800 bg-emerald-950 text-emerald-200"
          : tone === "rose"
            ? "border-rose-800 bg-rose-950 text-rose-200"
            : "border-gray-800 bg-zinc-900 text-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function sourceKindLabel(sourceKind: DeliberationCandidateSourceKind) {
  if (sourceKind === "work_packet") return "work packet";
  if (sourceKind === "project") return "project";
  if (sourceKind === "manual") return "manual candidate";
  if (sourceKind === "motion") return "motion candidate";
  return "planned toolchain";
}

function voteTone(vote: DeliberationAdvisoryVote) {
  if (vote === "support") return "emerald";
  if (vote === "support_with_caution") return "amber";
  if (vote === "defer") return "slate";
  return "rose";
}

function consensusTone(label: string) {
  if (label === "advisory support") return "emerald";
  if (label === "planned only" || label === "caution") return "amber";
  return "rose";
}

function CandidateCard({ candidate }: { candidate: DeliberationCandidate }) {
  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">
              {candidate.title}
            </h3>
            <ToneBadge tone="amber">{sourceKindLabel(candidate.source_kind)}</ToneBadge>
            <ToneBadge tone="rose">non-binding</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-300">{candidate.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ToneBadge tone="sky">{candidate.target.repo_full_name}</ToneBadge>
          <ToneBadge tone="slate">{candidate.target.surface.label}</ToneBadge>
          {candidate.target.project ? (
            <ToneBadge tone="emerald">{candidate.target.project.project_id}</ToneBadge>
          ) : (
            <ToneBadge tone="amber">project:none</ToneBadge>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Candidate target</h4>
            <ul className="mt-3 space-y-1 text-sm text-gray-300">
              <li>- source: {candidate.source_label}</li>
              <li>- repo: {candidate.target.repo_full_name}</li>
              <li>- surface: {candidate.target.surface.label}</li>
              <li>- project: {candidate.target.project?.name ?? "none"}</li>
              <li>
                - configured scope key: {candidate.configured_scope_key ?? "none"}
              </li>
              <li>
                - planned toolchain target:{" "}
                {candidate.planned_toolchain_target ?? "none"}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-100">
                Consensus summary
              </h4>
              <ToneBadge tone={consensusTone(candidate.consensus.consensus_label)}>
                {candidate.consensus.consensus_label}
              </ToneBadge>
              <ToneBadge tone="rose">non-binding</ToneBadge>
            </div>
            <p className="mt-3 text-sm text-gray-300">{candidate.consensus.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <ToneBadge tone="emerald">support {candidate.consensus.support}</ToneBadge>
              <ToneBadge tone="amber">
                caution {candidate.consensus.support_with_caution}
              </ToneBadge>
              <ToneBadge tone="slate">defer {candidate.consensus.defer}</ToneBadge>
              <ToneBadge tone="rose">
                out {candidate.consensus.out_of_scope}
              </ToneBadge>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Human gates and evidence expectations
            </h4>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Human gates
                </div>
                <ul className="mt-2 space-y-2 text-sm text-gray-300">
                  {candidate.human_gates.map((gate) => (
                    <li key={gate}>- {gate}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Evidence expectations
                </div>
                <ul className="mt-2 space-y-2 text-sm text-gray-300">
                  {candidate.evidence_expectations.map((expectation) => (
                    <li key={expectation}>- {expectation}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Verification commands
              </div>
              <ul className="mt-2 space-y-2 text-sm text-gray-300">
                {candidate.verification_commands.map((command) => (
                  <li key={command} className="font-mono text-xs text-gray-300">
                    - {command}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Per-agent advisory reasoning
            </h4>
            <div className="mt-3 space-y-3">
              {candidate.advisory.map((entry) => (
                <div
                  key={`${candidate.candidate_id}-${entry.agent.key}`}
                  className="rounded-lg border border-gray-800 bg-zinc-950/60 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium text-gray-100">
                      {entry.agent.label}
                    </div>
                    <ToneBadge tone={voteTone(entry.vote)}>{entry.vote}</ToneBadge>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-gray-500">
                    {entry.agent.handle}
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-gray-300">
                    {entry.reasoning.map((reason) => (
                      <li key={reason}>- {reason}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-100">
                Copy-only next repo/chat prompt
              </h4>
              <ToneBadge tone="amber">copy only</ToneBadge>
              <ToneBadge tone="rose">do not execute</ToneBadge>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              This prompt is advisory only. It does not authorize branch writes,
              PR creation, dispatch, runtime execution, or any live toolchain
              integration.
            </p>
            <textarea
              readOnly
              value={candidate.next_step_prompt.text}
              rows={24}
              className="mt-4 w-full rounded-lg border border-gray-800 bg-black px-3 py-3 font-mono text-xs text-gray-200"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DeliberationPage() {
  const panel = getAgentDeliberationPanel();
  const candidateCount = panel.candidates.length;
  const sourceKinds = new Set(panel.candidates.map((candidate) => candidate.source_kind));
  const plannedToolchainCount = panel.candidates.filter(
    (candidate) => candidate.planned_toolchain_target,
  ).length;

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">
              JAI NEXUS - Agent Deliberation
            </h1>
            <ToneBadge tone="amber">advisory only</ToneBadge>
            <ToneBadge tone="rose">non-binding</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-400">
            Deterministic panel for advisory-only agent reasoning over candidate
            repo work, project follow-ups, motion follow-ups, manual candidates,
            and planned toolchain targets. No execution or write capability is
            enabled here.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Votes shown here are non-binding. This surface cannot run agents,
              create motions, ratify decisions, write branches, open PRs, or
              integrate jai-pilot or vscode-nexus.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Participating agents"
            value={String(panel.participating_agents.length)}
            detail="Loaded directly from the Agent Registry."
          />
          <SummaryCard
            label="Candidate actions"
            value={String(candidateCount)}
            detail="Derived from work packets, projects, manual candidates, motions, and planned toolchain targets."
          />
          <SummaryCard
            label="Source kinds"
            value={String(sourceKinds.size)}
            detail="All advisory candidates tie back to the repo-surface-project model."
          />
          <SummaryCard
            label="Planned toolchain targets"
            value={String(plannedToolchainCount)}
            detail="jai-pilot and vscode-nexus remain planned-only targets with no integration."
          />
          <SummaryCard
            label="Execution posture"
            value="blocked"
            detail="No run, dispatch, branch write, PR creation, or runtime execution controls exist."
          />
        </section>

        <Section
          title="Participating agents"
          description="All participating agents come from the current configuration-only Agent Registry."
        >
          <div className="flex flex-wrap gap-2">
            {panel.participating_agents.map((agent) => (
              <ToneBadge key={agent.key} tone="sky">
                {agent.key}
              </ToneBadge>
            ))}
          </div>
        </Section>

        <Section
          title="Advisory candidate queue"
          description="Each candidate is evaluated against current agent scope and capability posture, then rendered with non-binding advisory votes and a copy-only next-step prompt."
        >
          <div className="space-y-4">
            {panel.candidates.map((candidate) => (
              <CandidateCard key={candidate.candidate_id} candidate={candidate} />
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
