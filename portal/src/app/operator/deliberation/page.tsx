export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";
import { getAgentDeliberationPanel } from "@/lib/agents/deliberationPanel";
import { buildDeliberationPassalongSummary } from "@/lib/controlPlane/deliberationPassalong";
import { getOperatorLoopCandidate } from "@/lib/controlPlane/operatorLoopCandidate";
import type {
  DeliberationAdvisoryVote,
  DeliberationCandidate,
  DeliberationCandidateSourceKind,
  DeliberationConfidence,
  DeliberationRecommendationPosture,
  DeliberationTranscriptTurn,
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

function voteTone(vote: DeliberationAdvisoryVote | "framing") {
  if (vote === "support") return "emerald";
  if (vote === "support_with_caution") return "amber";
  if (vote === "defer" || vote === "framing") return "slate";
  return "rose";
}

function postureTone(posture: DeliberationRecommendationPosture | "framing") {
  if (posture === "support") return "emerald";
  if (posture === "support_with_caution") return "amber";
  if (posture === "framing") return "sky";
  return "rose";
}

function confidenceTone(confidence: DeliberationConfidence) {
  if (confidence === "high") return "emerald";
  if (confidence === "medium") return "amber";
  return "rose";
}

function consensusTone(label: string) {
  if (label === "advisory support") return "emerald";
  if (label === "planned only" || label === "caution") return "amber";
  return "rose";
}

function CandidateDocketCard({ candidate }: { candidate: DeliberationCandidate }) {
  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">
              {candidate.title}
            </h3>
            <ToneBadge tone="amber">{sourceKindLabel(candidate.source_kind)}</ToneBadge>
            <ToneBadge tone={consensusTone(candidate.consensus.consensus_label)}>
              {candidate.consensus.consensus_label}
            </ToneBadge>
            <ToneBadge tone="rose">non-binding</ToneBadge>
          </div>
          <p className="text-sm text-gray-300">{candidate.summary}</p>
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

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Requested actions
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {candidate.requested_actions.map((action) => (
              <ToneBadge key={`${candidate.candidate_id}-${action}`} tone="slate">
                {action}
              </ToneBadge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Planned toolchain target
          </div>
          <div className="mt-2">
            <ToneBadge tone={candidate.planned_toolchain_target ? "amber" : "slate"}>
              {candidate.planned_toolchain_target ?? "none"}
            </ToneBadge>
          </div>
        </div>
      </div>
    </article>
  );
}

function TranscriptTurnCard({
  turn,
  candidatesById,
}: {
  turn: DeliberationTranscriptTurn;
  candidatesById: Map<string, DeliberationCandidate>;
}) {
  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={turn.speaker_kind === "moderator" ? "sky" : "emerald"}>
              {turn.speaker_kind}
            </ToneBadge>
            <h3 className="text-base font-semibold text-gray-100">
              Turn {turn.order}: {turn.speaker_label}
            </h3>
            <ToneBadge tone={voteTone(turn.advisory_vote)}>
              {turn.advisory_vote}
            </ToneBadge>
            <ToneBadge tone={postureTone(turn.recommendation_posture)}>
              {turn.recommendation_posture}
            </ToneBadge>
            <ToneBadge tone={confidenceTone(turn.confidence)}>
              confidence: {turn.confidence}
            </ToneBadge>
          </div>
          {turn.speaker_handle ? (
            <div className="font-mono text-[11px] text-gray-500">
              {turn.speaker_handle}
            </div>
          ) : null}
        </div>
        <ToneBadge tone="rose">advisory only</ToneBadge>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Role lens
        </div>
        <div className="mt-2 text-sm text-gray-200">{turn.role_lens}</div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Evidence basis
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {turn.evidence_basis.map((basis) => (
              <ToneBadge key={`${turn.turn_id}-${basis}`} tone="slate">
                {basis}
              </ToneBadge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Dissent / caution
          </div>
          <div className="mt-2 text-sm text-gray-300">
            {turn.dissent_or_caution ?? "none"}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Focus candidates
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {turn.focus_candidate_ids.map((candidateId) => {
            const candidate = candidatesById.get(candidateId);
            return (
              <ToneBadge key={`${turn.turn_id}-${candidateId}`} tone="slate">
                {candidate?.title ?? candidateId}
              </ToneBadge>
            );
          })}
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-gray-300">
        {turn.statement.map((line) => (
          <li key={`${turn.turn_id}-${line}`}>- {line}</li>
        ))}
      </ul>
    </article>
  );
}

export default function DeliberationPage() {
  const panel = getAgentDeliberationPanel();
  const transcript = panel.transcript_session;
  const passalong = buildDeliberationPassalongSummary(panel);
  const loopCandidate = getOperatorLoopCandidate();
  const candidatesById = new Map(
    panel.candidates.map((candidate) => [candidate.candidate_id, candidate] as const),
  );
  const sourceKinds = new Set(panel.candidates.map((candidate) => candidate.source_kind));
  const plannedToolchainCount = panel.candidates.filter(
    (candidate) => candidate.planned_toolchain_target,
  ).length;
  const reviewableCandidates = loopCandidate.static_switching.candidates.filter(
    (candidate) =>
      candidate.selection_status === "active" ||
      candidate.selection_status === "eligible" ||
      candidate.selection_status === "deferred",
  );

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">
              JAI NEXUS - Agent Deliberation Transcript
            </h1>
            <ToneBadge tone="amber">advisory only</ToneBadge>
            <ToneBadge tone="rose">non-binding</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Deterministic transcript session for comparing candidate motions and
            actions across work packets, projects, motions, manual candidates, and
            planned toolchain targets. This surface recommends a next motion,
            branch, and prompt as copy-only output. Operator authorization is
            required before any execution or repo action.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              First official agenda deliberation passalong candidate:{" "}
              <span className="font-mono">{loopCandidate.selected_work_packet_id}</span>. This
              session keeps the loop deterministic, read-only, and human-gated
              across <span className="font-mono">/</span>,{" "}
              <span className="font-mono">/operator/work</span>, and{" "}
              <span className="font-mono">/operator/deliberation</span>.
            </p>
            <p className="mt-3 text-xs text-gray-400">{loopCandidate.selection_reason}</p>
            <p className="mt-2 text-xs text-gray-400">{loopCandidate.criteria_summary}</p>
            <p className="mt-2 text-xs text-gray-400">
              Static switching policy:{" "}
              {loopCandidate.static_switching.switching_policy.summary}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Votes shown here are non-binding. This transcript cannot run agents,
              create motions automatically, ratify anything, write branches, open
              PRs, dispatch work, schedule work, or integrate jai-pilot or
              vscode-nexus.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Agenda-to-deliberation movement is navigation/context only.
              Reviewing other agenda items here does not switch the active
              candidate, add route state, add query state, or persist any
              selection.
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
            value={String(panel.candidates.length)}
            detail="Evaluated across work packets, projects, manual candidates, motions, and planned toolchain targets."
          />
          <SummaryCard
            label="Transcript turns"
            value={String(transcript.turns.length)}
            detail="Moderator framing plus ordered agent turns."
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
          title="Reviewable agenda context"
          description="Reviewable agenda packets may be inspected in deliberation context, but active-candidate switching remains static and governance-controlled only."
        >
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
            <div className="flex flex-wrap gap-2">
              <ToneBadge tone="slate">
                switching: {loopCandidate.static_switching.switching_policy.mode}
              </ToneBadge>
              <ToneBadge tone="rose">no runtime selection</ToneBadge>
              <ToneBadge tone="amber">review only</ToneBadge>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              {loopCandidate.static_switching.switching_policy.review_navigation_note}
            </p>
            <div className="mt-4 space-y-3">
              {reviewableCandidates.map((candidate) => (
                <div
                  key={candidate.work_packet_id}
                  className="rounded-lg border border-gray-800 bg-black/30 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ToneBadge tone="slate">
                      {candidate.selection_status}
                    </ToneBadge>
                    <span className="font-mono text-sm text-gray-200">
                      {candidate.work_packet_id}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">
                    {candidate.selection_rationale}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {candidate.metadata_criteria_result}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {candidate.switching_note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="Moderator framing"
          description="Session framing for selecting the next best motion or action without enabling execution."
        >
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone="sky">moderator</ToneBadge>
              <ToneBadge tone="rose">operator authorization required</ToneBadge>
              <ToneBadge tone="slate">{sourceKinds.size} source kinds</ToneBadge>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              {transcript.moderator_framing.map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          title="Candidate docket"
          description="Transcript inputs are tied to the shared repo-plus-surface-plus-optional-project model."
        >
          <div className="space-y-4">
            {panel.candidates.map((candidate) => (
              <CandidateDocketCard key={candidate.candidate_id} candidate={candidate} />
            ))}
          </div>
        </Section>

        <Section
          title="Deliberation transcript"
          description="Ordered turns show per-agent reasoning, visible votes, and non-binding focus across multiple candidate actions."
        >
          <div className="space-y-4">
            {transcript.turns.map((turn) => (
              <TranscriptTurnCard
                key={turn.turn_id}
                turn={turn}
                candidatesById={candidatesById}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Passalong-ready summary"
          description="Deterministic CONTROL_THREAD handoff block computed from the current deliberation transcript. Read-only and copy-only only."
        >
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-gray-100">
                  Passalong posture
                </h3>
                <ToneBadge tone="amber">copy only</ToneBadge>
                <ToneBadge tone="rose">no persistence</ToneBadge>
                <ToneBadge tone="sky">{passalong.recommended_next_target}</ToneBadge>
              </div>

              <div className="mt-4 space-y-4 text-sm text-gray-300">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Reviewed motion / seam
                  </div>
                  <div className="mt-2">{passalong.reviewed_motion_or_seam}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    First official loop-through candidate
                  </div>
                  <ul className="mt-2 space-y-1">
                    <li>- packet: {passalong.selected_packet_id ?? "none"}</li>
                    <li>- status: {passalong.selected_status_label ?? "none"}</li>
                    <li>- agent: {passalong.selected_assigned_agent_label ?? "none"}</li>
                    <li>- canonical role: {passalong.selected_canonical_role_label ?? "none"}</li>
                    <li>- repo: {passalong.selected_target_repo_full_name ?? "none"}</li>
                    <li>- surface: {passalong.selected_target_surface_label ?? "none"}</li>
                    <li>- source seam: {passalong.selected_source_label ?? "none"}</li>
                  </ul>
                  <p className="mt-2">{passalong.selection_reason ?? "none"}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    Switching policy:{" "}
                    {loopCandidate.static_switching.switching_policy.summary}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Participant roles
                  </div>
                  <ul className="mt-2 space-y-1">
                    {passalong.participant_role_summary.map((entry) => (
                      <li key={entry}>- {entry}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Posture summary
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ToneBadge tone="emerald">
                      support {passalong.posture_summary.support}
                    </ToneBadge>
                    <ToneBadge tone="amber">
                      caution {passalong.posture_summary.caution}
                    </ToneBadge>
                    <ToneBadge tone="slate">
                      defer/hold {passalong.posture_summary.defer_or_hold}
                    </ToneBadge>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">
                    Recommendation: {passalong.posture_summary.recommendation}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Evidence basis
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {passalong.evidence_basis_summary.map((basis) => (
                      <ToneBadge key={basis} tone="slate">
                        {basis}
                      </ToneBadge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Strongest dissent / caution
                  </div>
                  <p className="mt-2">{passalong.strongest_dissent_or_caution}</p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Arbiter synthesis
                  </div>
                  <p className="mt-2">{passalong.arbiter_synthesis}</p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Recommended next routing
                  </div>
                  <p className="mt-2">Target: {passalong.recommended_next_target}</p>
                  <p className="mt-2">{passalong.recommended_next_action}</p>
                  <p className="mt-2">
                    Validation gate: {passalong.selected_validation_gate ?? "none"}
                  </p>
                  <p className="mt-2">
                    Human decision: {passalong.selected_human_decision_gate ?? "none"}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Authority boundary
                  </div>
                  <ul className="mt-2 space-y-1">
                    {passalong.authority_boundary.map((entry) => (
                      <li key={entry}>- {entry}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-gray-100">
                  Copy-only passalong text
                </h3>
                <ToneBadge tone="amber">textarea only</ToneBadge>
                <ToneBadge tone="rose">no submit / no save</ToneBadge>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                This block is deterministic handoff material only. There is no
                submit path, no save path, no API call, and no hidden persistence.
              </p>
              <textarea
                readOnly
                value={passalong.copy_text}
                rows={28}
                className="mt-4 w-full rounded-lg border border-gray-800 bg-black px-3 py-3 font-mono text-xs text-gray-200"
              />
            </div>
          </div>
        </Section>

        <Section
          title="Consensus and next motion"
          description="The recommendation below is copy-only and requires separate operator authorization before any execution or repo action."
        >
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-gray-100">
                  Consensus summary
                </h3>
                <ToneBadge tone={consensusTone(transcript.consensus_summary.consensus_label)}>
                  {transcript.consensus_summary.consensus_label}
                </ToneBadge>
                <ToneBadge tone="rose">non-binding</ToneBadge>
              </div>
              <p className="mt-3 text-sm text-gray-300">
                {transcript.consensus_summary.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <ToneBadge tone="emerald">
                  support {transcript.consensus_summary.support}
                </ToneBadge>
                <ToneBadge tone="amber">
                  caution {transcript.consensus_summary.support_with_caution}
                </ToneBadge>
                <ToneBadge tone="slate">
                  defer {transcript.consensus_summary.defer}
                </ToneBadge>
                <ToneBadge tone="rose">
                  out {transcript.consensus_summary.out_of_scope}
                </ToneBadge>
              </div>
              <div className="mt-5 space-y-2 text-sm text-gray-300">
                <div>
                  <span className="text-gray-500">Suggested motion:</span>{" "}
                  {transcript.recommendation.suggested_motion_title}
                </div>
                <div>
                  <span className="text-gray-500">Motion id:</span>{" "}
                  {transcript.recommendation.suggested_motion_id_note}
                </div>
                <div>
                  <span className="text-gray-500">Branch suggestion:</span>{" "}
                  {transcript.recommendation.suggested_branch_name}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-gray-100">
                  Copy-only next repo/chat prompt
                </h3>
                <ToneBadge tone="amber">copy only</ToneBadge>
                <ToneBadge tone="rose">do not execute</ToneBadge>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Operator authorization is required before any execution, motion
                opening, branch write, PR creation, dispatch, scheduler behavior,
                DB mutation, API mutation, or runtime action.
              </p>
              <textarea
                readOnly
                value={transcript.recommendation.prompt_text}
                rows={28}
                className="mt-4 w-full rounded-lg border border-gray-800 bg-black px-3 py-3 font-mono text-xs text-gray-200"
              />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
