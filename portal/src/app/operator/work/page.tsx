export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";

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
import { JaiAgentReadiness } from "@/components/operator/JaiAgentReadiness";
import { DevelopmentWorkReadiness } from "@/components/operator/DevelopmentWorkReadiness";
import { JaiReceiptGateAlignment } from "@/components/operator/JaiReceiptGateAlignment";
import { PaletteGridReadiness } from "@/components/operator/PaletteGridReadiness";
import { OperatorDomainEngineWorkspace } from "./_components/OperatorDomainEngineWorkspace";
import { OperatorWorkPacketComposer } from "./_components/OperatorWorkPacketComposer";
import { buildDraftWorkPacketTaskPrompt } from "@/lib/agents/workPacketTaskPrompts";
import type {
  DraftWorkPacketAction,
  DraftWorkPacketActionCompatibility,
  DraftWorkPacketCompatibilityState,
  DraftWorkPacketStatus,
} from "@/lib/agents/workPacketTypes";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import {
  getDeterministicAgendaModel,
  type DeterministicAgendaItem,
} from "@/lib/controlPlane/agendaModel";
import {
  getOperatorLoopCandidate,
  type LoopCandidateSelectionStatus,
} from "@/lib/controlPlane/operatorLoopCandidate";

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
        right={<OperatorBadge tone="readOnly" label="DERIVED / READ-ONLY" />}
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

function statusTone(status: DraftWorkPacketStatus): OperatorSlateTone {
  if (status === "blocked") return "blocked";
  if (status === "deferred") return "warning";
  if (status === "ready_for_review") return "pending";
  if (status === "settled") return "readOnly";
  return "advisory";
}

function selectionTone(status: LoopCandidateSelectionStatus): OperatorSlateTone {
  if (status === "blocked") return "blocked";
  if (status === "deferred") return "warning";
  if (status === "eligible") return "pending";
  return "readOnly";
}

function statusLabel(status: DraftWorkPacketStatus): string {
  return status.replace(/_/g, " ");
}

function compatibilityTone(
  state: DraftWorkPacketCompatibilityState,
): OperatorSlateTone {
  if (state === "compatible") return "readOnly";
  if (state === "preview_only") return "pending";
  return "blocked";
}

function actionLabel(action: DraftWorkPacketAction): string {
  if (action === "view_only") return "view only";
  if (action === "draft_plan") return "draft plan";
  if (action === "draft_files_preview") return "draft files preview";
  return "verify";
}

function compatibilityLabel(
  compatibility: DraftWorkPacketActionCompatibility,
): string {
  return actionLabel(compatibility.requested_action);
}

function promptTone(
  status: "ready_preview" | "warning" | "blocked",
): OperatorSlateTone {
  if (status === "ready_preview") return "composeOnly";
  if (status === "warning") return "warning";
  return "blocked";
}

function ChainRow({ label, value }: { label: string; value: string }) {
  return (
    <OperatorGateCard>
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </OperatorGateCard>
  );
}

function TextList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "blocked";
}) {
  const content = (
    <>
      <div
        className={`font-mono text-xs uppercase tracking-widest ${
          tone === "blocked" ? "text-red-300" : "text-slate-500"
        }`}
      >
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </>
  );

  return tone === "blocked" ? (
    <OperatorContradictionCard>{content}</OperatorContradictionCard>
  ) : (
    <OperatorGateCard>{content}</OperatorGateCard>
  );
}

function AgendaItemCard({ item }: { item: DeterministicAgendaItem }) {
  const { packet } = item;
  const prompt = buildDraftWorkPacketTaskPrompt(packet);

  return (
    <OperatorPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">
              {packet.title}
            </h3>
            <OperatorStatusChip
              status={`AGENDA: ${statusLabel(packet.status)}`}
              tone={statusTone(packet.status)}
            />
            <OperatorStatusChip
              status={`SELECTION: ${item.selection_status}`}
              tone={selectionTone(item.selection_status)}
            />
            {item.is_first_official_loop_candidate ? (
              <OperatorBadge tone="readOnly" label="ACTIVE LOOP CANDIDATE" />
            ) : null}
            <OperatorBadge tone="advisory" label="DRAFT-ONLY" />
            <OperatorBadge tone="blocked" label="EXECUTION BLOCKED" />
          </div>
          <p className="max-w-4xl text-sm text-slate-300">{packet.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorBadge
            tone="readOnly"
            label={`SCOPE: ${packet.configured_scope_key}`}
          />
          <OperatorIdChip>{packet.packet_id}</OperatorIdChip>
        </div>
      </div>

      <OperatorPanel className="mt-4 bg-slate-950/50">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-100">
            Deterministic chain coverage
          </h4>
          <OperatorBadge tone="readOnly" label="TRACEABLE / DERIVED" />
          <OperatorBadge tone="gated" label="NOT EXECUTION AUTHORITY" />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Every agenda item resolves agent, role, repo, surface, source seam,
          allowed output, validation gate, and human decision without enabling
          runtime execution.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          <ChainRow label="Assigned JAI Agent" value={item.chain.assigned_agent_label} />
          <ChainRow
            label="Canonical role mapping"
            value={item.chain.canonical_role_label}
          />
          <ChainRow label="Target repo" value={item.chain.target_repo_full_name} />
          <ChainRow label="Target surface" value={item.chain.target_surface_label} />
          <ChainRow label="Source motion/seam" value={item.chain.source_label} />
          <ChainRow
            label="Motion id"
            value={item.chain.source_motion_id ?? "control-thread decision"}
          />
          <ChainRow label="Allowed output" value={item.chain.allowed_output} />
          <ChainRow label="Human decision" value={item.chain.human_decision_summary} />
        </div>
      </OperatorPanel>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">Target model</h4>
              <OperatorBadge tone="readOnly" label="DERIVED TARGET" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorIdChip>{packet.target.repo_full_name}</OperatorIdChip>
              <OperatorIdChip>{packet.target.surface.label}</OperatorIdChip>
              {packet.target.project ? (
                <OperatorBadge
                  tone="readOnly"
                  label={`PROJECT: ${packet.target.project.name}`}
                />
              ) : (
                <OperatorBadge tone="advisory" label="PROJECT: NONE" />
              )}
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              <li>- repo: {packet.target.repo_full_name}</li>
              <li>- surface: {packet.target.surface.label}</li>
              <li>- project: {packet.target.project?.project_id ?? "not assigned"}</li>
            </ul>
          </OperatorGateCard>

          <OperatorGateCard>
            {item.is_first_official_loop_candidate ? (
              <OperatorPanel className="mb-3 border-sky-900 bg-sky-950/30">
                <OperatorBadge tone="readOnly" label="ACTIVE BY STATIC GOVERNANCE" />
                <p className="mt-2 text-sm text-sky-100">
                  This seeded agenda item is the first official deterministic
                  loop-through candidate for root overview, agenda review,
                  deliberation, and CONTROL_THREAD passalong.
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Switching remains static/local and code/governance controlled only.
                  No runtime control, route state, query state, API call, or
                  persistence path exists for changing the active candidate.
                </p>
              </OperatorPanel>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Assigned identity
              </span>
              <Link
                href={`/operator/agents#${packet.agent.key}`}
                className="text-sm font-medium text-sky-300 underline"
              >
                {packet.agent.label}
              </Link>
              <OperatorStatusChip
                status={
                  packet.agent.agent_class === "canonical_active"
                    ? "CANONICAL ACTIVE"
                    : "PALETTE DRAFT"
                }
                tone={
                  packet.agent.agent_class === "canonical_active"
                    ? "canonical"
                    : "advisory"
                }
              />
            </div>
            <div className="mt-2">
              <OperatorIdChip>{packet.agent.handle}</OperatorIdChip>
            </div>
            <p className="mt-2 text-sm text-slate-300">{packet.agent.summary}</p>
            <OperatorGateCard className="mt-3">
              <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Source activation seam
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <OperatorBadge
                  tone={packet.source.kind === "motion" ? "readOnly" : "advisory"}
                  label={packet.source.kind}
                />
                {packet.source.motion_id ? (
                  <OperatorIdChip>{packet.source.motion_id}</OperatorIdChip>
                ) : null}
                <OperatorIdChip>{packet.source.label}</OperatorIdChip>
              </div>
            </OperatorGateCard>
          </OperatorGateCard>

          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">
              Requested actions and compatibility
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Compatibility is not acceptance and does not open a capability gate.
            </p>
            <div className="mt-3 space-y-3">
              {packet.compatibility.requested_action_statuses.map((compatibility) => (
                <OperatorGateCard
                  key={`${packet.packet_id}-${compatibility.requested_action}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <OperatorStatusChip
                      status={compatibility.status}
                      tone={compatibilityTone(compatibility.status)}
                    />
                    <span className="text-sm font-medium text-slate-100">
                      {compatibilityLabel(compatibility)}
                    </span>
                    <OperatorIdChip>
                      {compatibility.registry_capability_key}
                    </OperatorIdChip>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {compatibility.reason}
                  </p>
                </OperatorGateCard>
              ))}
            </div>
          </OperatorGateCard>

          <OperatorContradictionCard>
            <h4 className="text-sm font-semibold text-red-100">
              Authority posture
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge
                tone="blocked"
                label={`EXECUTION BLOCKED: ${item.authority_posture.execution_blocked ? "YES" : "NO"}`}
              />
              <OperatorBadge
                tone="blocked"
                label={`BRANCH WRITE DISABLED: ${item.authority_posture.branch_write_disabled ? "YES" : "NO"}`}
              />
              <OperatorBadge
                tone="blocked"
                label={`PROPOSE PR DISABLED: ${item.authority_posture.propose_pr_disabled ? "YES" : "NO"}`}
              />
              <OperatorBadge
                tone="blocked"
                label={`RUNTIME DISABLED: ${item.authority_posture.execute_runtime_disabled ? "YES" : "NO"}`}
              />
            </div>
          </OperatorContradictionCard>

          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">
              Selection metadata
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge
                tone="readOnly"
                label={`REPO: ${packet.selection_metadata.repo_posture}`}
              />
              <OperatorBadge
                tone="advisory"
                label={`WORK: ${packet.selection_metadata.work_class}`}
              />
              <OperatorBadge
                tone="neutral"
                label={`ACTION: ${packet.selection_metadata.requested_action_class}`}
              />
              <OperatorBadge
                tone="gated"
                label={`MUTATION: ${packet.selection_metadata.mutation_boundary}`}
              />
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {packet.selection_metadata.selection_notes.map((note) => (
                <li key={note}>- {note}</li>
              ))}
              <li>
                - deterministic chain complete:{" "}
                {packet.selection_metadata.deterministic_chain_complete ? "yes" : "no"}
              </li>
            </ul>
          </OperatorGateCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextList title="Allowed paths" items={packet.allowed_paths} />
            <TextList
              title="Blocked paths"
              items={packet.blocked_paths}
              tone="blocked"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <TextList
              title="Verification gates"
              items={packet.verification_commands}
            />
            <TextList title="Human gates" items={packet.human_gates} />
            <TextList
              title="Evidence expectations"
              items={packet.evidence_expectations}
            />
          </div>
        </div>

        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Deliberation review and next target
              </h4>
              <OperatorBadge tone="readOnly" label="NAVIGATION ONLY" />
            </div>
            <OperatorGateCard className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <OperatorStatusChip
                  status={`SWITCHING: ${item.switching_policy_mode}`}
                  tone="gated"
                />
                <Link
                  href={item.deliberation_context_href}
                  className="text-sm font-medium text-sky-300 underline"
                >
                  Review in deliberation
                </Link>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {item.deliberation_context_note}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {item.no_selection_mutation_note}
              </p>
            </OperatorGateCard>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge
                tone="advisory"
                label={`TARGET: ${packet.next_prompt_target.target}`}
              />
              <OperatorBadge
                tone="readOnly"
                label={packet.next_prompt_target.label}
              />
            </div>
            {item.is_first_official_loop_candidate ? (
              <OperatorGateCard className="mt-3">
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Loop-through links
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href="/" className="text-sky-300 underline">
                    Root overview
                  </Link>
                  <Link
                    href="/operator/deliberation"
                    className="text-sky-300 underline"
                  >
                    Deliberation and passalong
                  </Link>
                </div>
              </OperatorGateCard>
            ) : null}
            <p className="mt-3 text-sm text-slate-300">
              {packet.next_prompt_target.prompt}
            </p>
          </OperatorGateCard>

          <OperatorContradictionCard>
            <h4 className="text-sm font-semibold text-red-100">Guardrails</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>- no live agent runtime exists here</li>
              <li>- no branch write or PR creation controls exist here</li>
              <li>- no scheduler, automation, or hidden persistence exists here</li>
              <li>- prompt previews and branch suggestions remain copy-only</li>
            </ul>
          </OperatorContradictionCard>

          <OperatorPanel>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Task prompt preview
              </h4>
              <OperatorStatusChip
                status={prompt.preview_status}
                tone={promptTone(prompt.preview_status)}
              />
              <OperatorBadge tone="composeOnly" label="COPY-ONLY PREVIEW" />
              <OperatorBadge tone="gated" label="NO SUBMIT" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorStatusChip
                status={`AGENDA: ${statusLabel(prompt.agenda_status)}`}
                tone={statusTone(prompt.agenda_status)}
              />
              <OperatorBadge
                tone="readOnly"
                label={`NEXT: ${prompt.next_prompt_target}`}
              />
              <OperatorBadge
                tone={
                  prompt.canonical_role_label ? "canonical" : "advisory"
                }
                label={`ROLE: ${prompt.canonical_role_label ?? "NONE"}`}
              />
            </div>
            <OperatorGateCard className="mt-4">
              <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Prompt text
              </div>
              <textarea
                readOnly
                value={prompt.prompt_text}
                rows={30}
                className="mt-3 w-full rounded border border-slate-800 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-200"
              />
            </OperatorGateCard>
          </OperatorPanel>
        </div>
      </div>
    </OperatorPanel>
  );
}

export default function WorkPage() {
  const agenda = getDeterministicAgendaModel();
  const authorityPosture = getControlPlaneAuthorityPosture();
  const loopCandidate = getOperatorLoopCandidate();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <OperatorPanel className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="gated" label="NON-AUTHORIZING" />
              <OperatorBadge tone="readOnly" label="DERIVED / READ-ONLY" />
              <OperatorBadge tone="advisory" label="DRAFT-ONLY" />
              <OperatorBadge tone="composeOnly" label="COPY-ONLY PREVIEWS" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
              <OperatorBadge tone="blocked" label="NO DISPATCH" />
              <OperatorBadge tone="gated" label="ZERO GATES GRANTED" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                Operator Slate / Deterministic agenda
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                JAI NEXUS Deterministic Agent Agenda
              </h1>
            </div>
            <p className="max-w-4xl text-sm text-slate-400">
              Read-only operator surface for deterministic JAI Agent activation
              agenda items. Every item binds agent, canonical role, repo, surface,
              source seam, allowed output, validation gate, and human decision
              without enabling runtime execution.
            </p>
            <OperatorGateCard>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorIdChip>agent@jai.nexus</OperatorIdChip>
                <OperatorBadge tone="readOnly" label="VIEW-ONLY ALIAS" />
                <OperatorBadge tone="gated" label="NOT EXECUTION IDENTITY" />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Requested actions are deterministic planning and review outputs only:
                view_only, draft_plan, draft_files_preview, and verify.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <OperatorIdChip>{loopCandidate.selected_work_packet_id}</OperatorIdChip>
                <OperatorBadge tone="readOnly" label="ACTIVE BY STATIC GOVERNANCE" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {loopCandidate.selection_reason}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Selection criteria: {loopCandidate.criteria_summary}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Static switching policy:{" "}
                {loopCandidate.static_switching.switching_policy.summary}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Agenda-to-deliberation routing is navigation/context only. It does
                not change selected candidate, route state, query state, or
                persistence.
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Agenda Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Run Agent</OperatorBlockedAction>
              <OperatorBlockedAction>Write branch</OperatorBlockedAction>
              <OperatorBlockedAction>Route candidate</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Agent lane candidates are staged, not executing. Compatibility,
              readiness, validation, and dashboard display do not authorize action.
            </p>
          </OperatorSafetyRail>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Agenda items"
            value={String(agenda.summary.total_items)}
            detail="Deterministic work packets tracked as planning/review agenda items only."
          />
          <SummaryCard
            label="Ready for review"
            value={String(agenda.summary.status_counts.ready_for_review)}
            detail="Readiness means framed for human review, not accepted or executable."
          />
          <SummaryCard
            label="Blocked or deferred"
            value={String(
              agenda.summary.status_counts.blocked +
                agenda.summary.status_counts.deferred,
            )}
            detail="Items held behind scope, timing, or seam-order constraints."
          />
          <SummaryCard
            label="Target repos"
            value={String(agenda.summary.repo_count)}
            detail="Derived repo targets; display does not mutate repo state."
          />
          <SummaryCard
            label="Action coverage"
            value={String(
              Object.values(agenda.summary.requested_action_counts).filter(
                (count) => count > 0,
              ).length,
            )}
            detail="Coverage includes view, draft, preview, and verify actions only."
          />
        </section>

        <JaiAgentReadiness index="00" />

        <PaletteGridReadiness index="P/G" compact />

        <DevelopmentWorkReadiness index="DEV" />

        <JaiReceiptGateAlignment index="ALIGN" compact />

        <OperatorDomainEngineWorkspace />

        <OperatorWorkPacketComposer />

        <Section
          index="01"
          title="Agenda status coverage"
          description="Derived agenda states remain bounded to draft, ready for review, blocked, deferred, and settled."
        >
          <OperatorPanel>
            <div className="flex flex-wrap gap-2">
              {Object.entries(agenda.summary.status_counts).map(([status, count]) => (
                <OperatorStatusChip
                  key={status}
                  status={`${statusLabel(status as DraftWorkPacketStatus)}: ${count}`}
                  tone={statusTone(status as DraftWorkPacketStatus)}
                />
              ))}
            </div>
          </OperatorPanel>
        </Section>

        <Section
          index="02"
          title="Eligible Candidate Review Panel"
          description="Read-only posture for active, eligible, deferred, and blocked candidates. Review does not select or mutate."
        >
          <OperatorPanel>
            <div className="flex flex-wrap gap-2">
              <OperatorIdChip>
                ACTIVE: {loopCandidate.review_panel.active_candidate_id}
              </OperatorIdChip>
              <OperatorBadge
                tone="gated"
                label={`SWITCHING: ${loopCandidate.static_switching.switching_policy.mode}`}
              />
              <OperatorBadge tone="blocked" label="NO SELECTION MUTATION" />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {loopCandidate.review_panel.selection_criteria_summary}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {loopCandidate.review_panel.switching_policy_summary}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {loopCandidate.review_panel.no_selection_mutation_note}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <OperatorGateCard>
                <OperatorBadge tone="pending" label="ELIGIBLE" />
                <div className="mt-2 text-sm text-slate-200">
                  {loopCandidate.review_panel.eligible_candidate_ids.length > 0
                    ? loopCandidate.review_panel.eligible_candidate_ids.join(", ")
                    : "none"}
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <OperatorBadge tone="warning" label="DEFERRED" />
                <div className="mt-2 text-sm text-slate-200">
                  {loopCandidate.review_panel.deferred_candidate_ids.length > 0
                    ? loopCandidate.review_panel.deferred_candidate_ids.join(", ")
                    : "none"}
                </div>
              </OperatorGateCard>
              <OperatorContradictionCard>
                <OperatorBadge tone="blocked" label="BLOCKED" />
                <div className="mt-2 text-sm text-slate-200">
                  {loopCandidate.review_panel.blocked_candidate_ids.length > 0
                    ? loopCandidate.review_panel.blocked_candidate_ids.join(", ")
                    : "none"}
                </div>
              </OperatorContradictionCard>
            </div>
          </OperatorPanel>
        </Section>

        <Section
          index="03"
          title="Authority posture"
          description="Agenda semantics remain planning/review-only and preserve the disabled control-plane boundary."
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <OperatorContradictionCard>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="blocked" label="EXECUTION BLOCKED" />
                <OperatorBadge tone="blocked" label="BRANCH WRITE DISABLED" />
                <OperatorBadge tone="blocked" label="PROPOSE PR DISABLED" />
                <OperatorBadge tone="blocked" label="RUNTIME DISABLED" />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {authorityPosture.notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </OperatorContradictionCard>

            <OperatorPanel>
              <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Blocked capabilities
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {authorityPosture.blocked_capabilities.map((capability) => (
                  <OperatorBadge
                    key={capability}
                    tone="blocked"
                    label={capability}
                  />
                ))}
              </div>
            </OperatorPanel>
          </div>
        </Section>

        <Section
          index="04"
          title="Deterministic agenda queue"
          description="Each derived item resolves agent, role, repo, surface, source seam, allowed output, gates, evidence, and next advisory target."
        >
          <div className="space-y-4">
            {agenda.items.map((item) => (
              <AgendaItemCard key={item.packet.packet_id} item={item} />
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
