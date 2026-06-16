export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorDissentCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";
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
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index={index}
        title={title}
        right={<OperatorBadge tone="advisory" label="ADVISORY / READ-ONLY" />}
      />
      <p className="max-w-5xl text-sm text-slate-400">{description}</p>
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
    <OperatorPanel>
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorBadge tone="readOnly" label="DERIVED" />
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-slate-100">
        {value}
      </div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const slateTone: OperatorSlateTone =
    tone === "sky"
      ? "readOnly"
      : tone === "amber"
        ? "advisory"
        : tone === "emerald"
          ? "readOnly"
          : tone === "rose"
            ? "blocked"
            : "neutral";

  return <OperatorBadge tone={slateTone}>{children}</OperatorBadge>;
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
    <OperatorPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">
              {candidate.title}
            </h3>
            <ToneBadge tone="amber">{sourceKindLabel(candidate.source_kind)}</ToneBadge>
            <ToneBadge tone={consensusTone(candidate.consensus.consensus_label)}>
              {candidate.consensus.consensus_label}
            </ToneBadge>
            <OperatorBadge tone="blocked" label="NON-BINDING" />
          </div>
          <p className="text-sm text-slate-300">{candidate.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorIdChip>{candidate.candidate_id}</OperatorIdChip>
          <OperatorIdChip>{candidate.target.repo_full_name}</OperatorIdChip>
          <OperatorIdChip>{candidate.target.surface.label}</OperatorIdChip>
          {candidate.target.project ? (
            <OperatorBadge
              tone="readOnly"
              label={`PROJECT: ${candidate.target.project.project_id}`}
            />
          ) : (
            <OperatorBadge tone="advisory" label="PROJECT: NONE" />
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Requested actions
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {candidate.requested_actions.map((action) => (
              <OperatorBadge
                key={`${candidate.candidate_id}-${action}`}
                tone="neutral"
                label={action}
              />
            ))}
          </div>
        </OperatorGateCard>
        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Planned toolchain target
          </div>
          <div className="mt-2">
            <OperatorBadge
              tone={candidate.planned_toolchain_target ? "advisory" : "neutral"}
              label={candidate.planned_toolchain_target ?? "NONE"}
            />
          </div>
        </OperatorGateCard>
      </div>
    </OperatorPanel>
  );
}

function TranscriptTurnCard({
  turn,
  candidatesById,
}: {
  turn: DeliberationTranscriptTurn;
  candidatesById: Map<string, DeliberationCandidate>;
}) {
  const dissent = turn.dissent_or_caution ?? "No additional dissent recorded.";

  return (
    <OperatorPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={turn.speaker_kind === "moderator" ? "sky" : "emerald"}>
              {turn.speaker_kind}
            </ToneBadge>
            <h3 className="text-base font-semibold text-slate-100">
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
            <OperatorIdChip>{turn.speaker_handle}</OperatorIdChip>
          ) : null}
        </div>
        <OperatorBadge tone="advisory" label="ADVISORY ONLY" />
      </div>

      <OperatorGateCard className="mt-4">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          Role lens
        </div>
        <div className="mt-2 text-sm text-slate-200">{turn.role_lens}</div>
      </OperatorGateCard>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Evidence basis
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {turn.evidence_basis.map((basis) => (
              <ToneBadge key={`${turn.turn_id}-${basis}`} tone="slate">
                {basis}
              </ToneBadge>
            ))}
          </div>
        </OperatorGateCard>
        <OperatorDissentCard>
          <div className="font-mono text-xs uppercase tracking-widest text-red-200">
            Dissent / caution
          </div>
          <div className="mt-2 text-sm text-red-100">{dissent}</div>
        </OperatorDissentCard>
      </div>

      <OperatorGateCard className="mt-4">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
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
      </OperatorGateCard>

      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {turn.statement.map((line) => (
          <li key={`${turn.turn_id}-${line}`}>- {line}</li>
        ))}
      </ul>
    </OperatorPanel>
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
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <OperatorPanel className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="gated" label="NON-AUTHORIZING" />
              <OperatorBadge tone="readOnly" label="DETERMINISTIC / READ-ONLY" />
              <OperatorBadge tone="advisory" label="ADVISORY ONLY" />
              <OperatorBadge tone="composeOnly" label="COPY-ONLY OUTPUT" />
              <OperatorBadge tone="blocked" label="NON-BINDING" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
              <OperatorBadge tone="blocked" label="NO DISPATCH" />
              <OperatorBadge tone="gated" label="ZERO GATES GRANTED" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                Operator Slate / Deliberation transcript
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                JAI NEXUS Agent Deliberation Transcript
              </h1>
            </div>
            <p className="max-w-4xl text-sm text-slate-400">
              Deterministic transcript session for comparing candidate motions and
              actions across work packets, projects, motions, manual candidates,
              and planned toolchain targets. Recommendations and prompt text remain
              advisory, copy-only, and subject to operator review.
            </p>
            <OperatorGateCard>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorIdChip>
                  {loopCandidate.selected_work_packet_id}
                </OperatorIdChip>
                <OperatorBadge tone="readOnly" label="ACTIVE BY STATIC GOVERNANCE" />
                <OperatorBadge tone="gated" label="NO RUNTIME SELECTION" />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                This session keeps the loop deterministic, read-only, and
                human-gated across /, /operator/work, and /operator/deliberation.
              </p>
              <p className="mt-3 text-xs text-slate-400">
                {loopCandidate.selection_reason}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {loopCandidate.criteria_summary}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Static switching policy:{" "}
                {loopCandidate.static_switching.switching_policy.summary}
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Deliberation Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Ratify vote</OperatorBlockedAction>
              <OperatorBlockedAction>Dispatch recommendation</OperatorBlockedAction>
              <OperatorBlockedAction>Create motion</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Advisory votes do not decide. Prompt text is not dispatch. Copy-only
              passalong text does not submit, persist, create receipts, or update
              canon.
            </p>
          </OperatorSafetyRail>
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
          index="01"
          title="Reviewable agenda context"
          description="Reviewable agenda packets may be inspected in deliberation context, but active-candidate switching remains static and governance-controlled only."
        >
          <OperatorPanel className="p-4">
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
                <OperatorGateCard key={candidate.work_packet_id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <ToneBadge tone="slate">
                      {candidate.selection_status}
                    </ToneBadge>
                    <OperatorIdChip>{candidate.work_packet_id}</OperatorIdChip>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {candidate.selection_rationale}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {candidate.metadata_criteria_result}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {candidate.switching_note}
                  </p>
                </OperatorGateCard>
              ))}
            </div>
          </OperatorPanel>
        </Section>

        <Section
          index="02"
          title="Moderator framing"
          description="Session framing for selecting the next best motion or action without enabling execution."
        >
          <OperatorPanel className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone="sky">moderator</ToneBadge>
              <ToneBadge tone="rose">operator authorization required</ToneBadge>
              <ToneBadge tone="slate">{sourceKinds.size} source kinds</ToneBadge>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {transcript.moderator_framing.map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </OperatorPanel>
        </Section>

        <Section
          index="03"
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
          index="04"
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
          index="05"
          title="Passalong-ready summary"
          description="Deterministic CONTROL_THREAD handoff block computed from the current deliberation transcript. Read-only and copy-only only."
        >
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <OperatorPanel className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Passalong posture
                </h3>
                <OperatorBadge tone="composeOnly" label="COPY-ONLY" />
                <OperatorBadge tone="blocked" label="NO PERSISTENCE" />
                <OperatorBadge
                  tone="advisory"
                  label={passalong.recommended_next_target}
                />
              </div>

              <div className="mt-4 space-y-4 text-sm text-slate-300">
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
                  <p className="mt-2 text-xs text-slate-400">
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
                  <p className="mt-2 text-sm text-slate-300">
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

                <OperatorDissentCard>
                  <div className="font-mono text-xs uppercase tracking-widest text-red-200">
                    Strongest dissent / caution
                  </div>
                  <p className="mt-2 text-red-100">
                    {passalong.strongest_dissent_or_caution}
                  </p>
                </OperatorDissentCard>

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
            </OperatorPanel>

            <OperatorPanel className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Copy-only passalong text
                </h3>
                <OperatorBadge tone="composeOnly" label="COPY-ONLY TEXTAREA" />
                <OperatorBadge tone="blocked" label="NO SUBMIT / NO SAVE" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                This block is deterministic handoff material only. There is no
                submit path, no save path, no API call, and no hidden persistence.
              </p>
              <textarea
                readOnly
                value={passalong.copy_text}
                rows={28}
                className="mt-4 w-full rounded border border-slate-800 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-200"
              />
            </OperatorPanel>
          </div>
        </Section>

        <Section
          index="06"
          title="Consensus and next motion"
          description="The recommendation below is copy-only and requires separate operator authorization before any execution or repo action."
        >
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <OperatorPanel className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Consensus summary
                </h3>
                <ToneBadge tone={consensusTone(transcript.consensus_summary.consensus_label)}>
                  {transcript.consensus_summary.consensus_label}
                </ToneBadge>
                <OperatorBadge tone="blocked" label="NON-BINDING" />
              </div>
              <p className="mt-3 text-sm text-slate-300">
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
              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <div>
                  <span className="text-slate-500">Suggested motion:</span>{" "}
                  {transcript.recommendation.suggested_motion_title}
                </div>
                <div>
                  <span className="text-slate-500">Motion id:</span>{" "}
                  {transcript.recommendation.suggested_motion_id_note}
                </div>
                <div>
                  <span className="text-slate-500">Branch suggestion:</span>{" "}
                  {transcript.recommendation.suggested_branch_name}
                </div>
              </div>
            </OperatorPanel>

            <OperatorPanel className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Copy-only next repo/chat prompt
                </h3>
                <OperatorBadge tone="composeOnly" label="COPY-ONLY" />
                <OperatorBadge tone="blocked" label="DO NOT EXECUTE" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Operator authorization is required before any execution, motion
                opening, branch write, PR creation, dispatch, scheduler behavior,
                DB mutation, API mutation, or runtime action.
              </p>
              <textarea
                readOnly
                value={transcript.recommendation.prompt_text}
                rows={28}
                className="mt-4 w-full rounded border border-slate-800 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-200"
              />
            </OperatorPanel>
          </div>
        </Section>
      </div>
    </main>
  );
}
