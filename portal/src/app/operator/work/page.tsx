export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";

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
import { getOperatorLoopCandidate } from "@/lib/controlPlane/operatorLoopCandidate";

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

function statusTone(status: DraftWorkPacketStatus): "amber" | "emerald" | "rose" | "slate" {
  if (status === "ready_for_review") return "emerald";
  if (status === "blocked") return "rose";
  if (status === "settled") return "slate";
  return "amber";
}

function statusLabel(status: DraftWorkPacketStatus): string {
  return status.replace(/_/g, " ");
}

function compatibilityTone(
  state: DraftWorkPacketCompatibilityState,
): "emerald" | "amber" | "rose" {
  if (state === "compatible") return "emerald";
  if (state === "preview_only") return "amber";
  return "rose";
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

function promptTone(status: "ready_preview" | "warning" | "blocked") {
  if (status === "ready_preview") return "emerald";
  if (status === "warning") return "amber";
  return "rose";
}

function ChainRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-zinc-950/60 p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-sm text-gray-200">{value}</div>
    </div>
  );
}

function AgendaItemCard({ item }: { item: DeterministicAgendaItem }) {
  const { packet } = item;
  const prompt = buildDraftWorkPacketTaskPrompt(packet);

  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">{packet.title}</h3>
            <ToneBadge tone={statusTone(packet.status)}>
              agenda status: {statusLabel(packet.status)}
            </ToneBadge>
            {item.is_first_official_loop_candidate ? (
              <ToneBadge tone="sky">first official loop-through candidate</ToneBadge>
            ) : null}
            <ToneBadge tone="amber">draft-only activation</ToneBadge>
            <ToneBadge tone="rose">execution blocked</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-300">{packet.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ToneBadge tone="sky">scope subset: {packet.configured_scope_key}</ToneBadge>
          <ToneBadge tone="slate">{packet.packet_id}</ToneBadge>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-100">
            Deterministic chain coverage
          </h4>
          <ToneBadge tone="emerald">traceable activation chain</ToneBadge>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Every agenda item resolves agent, role, repo, surface, motion/seam,
          allowed output, validation gate, and human decision without enabling
          runtime execution.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          <ChainRow label="Assigned JAI Agent" value={item.chain.assigned_agent_label} />
          <ChainRow label="Canonical role mapping" value={item.chain.canonical_role_label} />
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
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Target model</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <ToneBadge tone="sky">{packet.target.repo_full_name}</ToneBadge>
              <ToneBadge tone="slate">surface: {packet.target.surface.label}</ToneBadge>
              {packet.target.project ? (
                <ToneBadge tone="emerald">project: {packet.target.project.name}</ToneBadge>
              ) : (
                <ToneBadge tone="amber">project: none</ToneBadge>
              )}
            </div>
            <ul className="mt-3 space-y-1 text-xs text-gray-400">
              <li>- repo: {packet.target.repo_full_name}</li>
              <li>- surface: {packet.target.surface.label}</li>
              <li>- project: {packet.target.project?.project_id ?? "not assigned"}</li>
            </ul>
          </div>

            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              {item.is_first_official_loop_candidate ? (
                <div className="mb-3 rounded-lg border border-sky-900 bg-sky-950/40 p-3 text-sm text-sky-100">
                  This seeded agenda item is the first official deterministic
                  loop-through candidate for root overview, agenda review,
                  deliberation, and CONTROL_THREAD passalong.
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Assigned identity
              </span>
              <Link
                href={`/operator/agents#${packet.agent.key}`}
                className="text-sm font-medium text-sky-300 underline"
              >
                {packet.agent.label}
              </Link>
              <ToneBadge
                tone={packet.agent.agent_class === "canonical_active" ? "emerald" : "amber"}
              >
                {packet.agent.agent_class === "canonical_active"
                  ? "canonical active"
                  : "palette draft"}
              </ToneBadge>
            </div>
            <div className="mt-2 font-mono text-xs text-gray-400">{packet.agent.handle}</div>
            <p className="mt-2 text-sm text-gray-300">{packet.agent.summary}</p>
            <div className="mt-3 rounded-lg border border-gray-800 bg-zinc-950/60 p-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Source activation seam
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ToneBadge tone={packet.source.kind === "motion" ? "emerald" : "amber"}>
                  {packet.source.kind}
                </ToneBadge>
                {packet.source.motion_id ? (
                  <ToneBadge tone="sky">{packet.source.motion_id}</ToneBadge>
                ) : null}
                <ToneBadge tone="slate">{packet.source.label}</ToneBadge>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Requested actions and compatibility
            </h4>
            <div className="mt-3 space-y-3">
              {packet.compatibility.requested_action_statuses.map((compatibility) => (
                <div
                  key={`${packet.packet_id}-${compatibility.requested_action}`}
                  className="rounded-lg border border-gray-800 bg-zinc-950/60 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ToneBadge tone={compatibilityTone(compatibility.status)}>
                      {compatibility.status}
                    </ToneBadge>
                    <span className="text-sm font-medium text-gray-100">
                      {compatibilityLabel(compatibility)}
                    </span>
                    <span className="text-xs text-gray-500">
                      via {compatibility.registry_capability_key}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{compatibility.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Authority posture</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <ToneBadge tone="rose">
                execution blocked: {item.authority_posture.execution_blocked ? "yes" : "no"}
              </ToneBadge>
              <ToneBadge tone="rose">
                branch_write disabled:{" "}
                {item.authority_posture.branch_write_disabled ? "yes" : "no"}
              </ToneBadge>
              <ToneBadge tone="rose">
                propose_pr disabled:{" "}
                {item.authority_posture.propose_pr_disabled ? "yes" : "no"}
              </ToneBadge>
              <ToneBadge tone="rose">
                execute_runtime disabled:{" "}
                {item.authority_posture.execute_runtime_disabled ? "yes" : "no"}
              </ToneBadge>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="text-sm font-semibold text-gray-100">Allowed paths</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {packet.allowed_paths.map((allowedPath) => (
                  <li key={allowedPath}>- {allowedPath}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="text-sm font-semibold text-gray-100">Blocked paths</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {packet.blocked_paths.map((blockedPath) => (
                  <li key={blockedPath}>- {blockedPath}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="text-sm font-semibold text-gray-100">Verification gates</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {packet.verification_commands.map((command) => (
                  <li key={command}>- {command}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="text-sm font-semibold text-gray-100">Human gates</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {packet.human_gates.map((gate) => (
                  <li key={gate}>- {gate}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="text-sm font-semibold text-gray-100">Evidence expectations</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {packet.evidence_expectations.map((expectation) => (
                  <li key={expectation}>- {expectation}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
              <h4 className="text-sm font-semibold text-gray-100">
                Next prompt / passalong target
              </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <ToneBadge tone="emerald">{packet.next_prompt_target.target}</ToneBadge>
              <ToneBadge tone="sky">{packet.next_prompt_target.label}</ToneBadge>
            </div>

            {item.is_first_official_loop_candidate ? (
              <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                <h4 className="text-sm font-semibold text-gray-100">Loop-through links</h4>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href="/" className="text-sky-300 underline">
                    Root overview
                  </Link>
                  <Link href="/operator/deliberation" className="text-sky-300 underline">
                    Deliberation and passalong
                  </Link>
                </div>
              </div>
            ) : null}
            <p className="mt-3 text-sm text-gray-300">{packet.next_prompt_target.prompt}</p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Guardrails</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>- no live agent runtime exists here</li>
              <li>- no branch write or PR creation controls exist here</li>
              <li>- no scheduler, automation, or hidden persistence exists here</li>
              <li>- prompt previews and branch suggestions remain copy-only</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-100">Task prompt preview</h4>
              <ToneBadge tone={promptTone(prompt.preview_status)}>
                {prompt.preview_status}
              </ToneBadge>
              <ToneBadge tone="amber">copy only</ToneBadge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <ToneBadge tone="slate">
                agenda status: {statusLabel(prompt.agenda_status)}
              </ToneBadge>
              <ToneBadge tone="sky">
                next target: {prompt.next_prompt_target}
              </ToneBadge>
              <ToneBadge tone="emerald">
                canonical role: {prompt.canonical_role_label ?? "none"}
              </ToneBadge>
            </div>
            <div className="mt-4 rounded-lg border border-gray-800 bg-zinc-950/70 p-3">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Prompt text
              </div>
              <textarea
                readOnly
                value={prompt.prompt_text}
                rows={30}
                className="mt-3 w-full rounded-lg border border-gray-800 bg-black px-3 py-3 font-mono text-xs text-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WorkPage() {
  const agenda = getDeterministicAgendaModel();
  const authorityPosture = getControlPlaneAuthorityPosture();
  const loopCandidate = getOperatorLoopCandidate();

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">
              JAI NEXUS - Deterministic Agent Agenda
            </h1>
            <ToneBadge tone="amber">draft-only activation</ToneBadge>
            <ToneBadge tone="rose">execution disabled in v0</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Read-only operator surface for deterministic JAI Agent activation
            agenda items. Every item binds agent, canonical role, repo, surface,
            motion or control-thread seam, allowed output, validation gate, and
            human decision without enabling runtime execution.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Shared alias <span className="font-mono">agent@jai.nexus</span>{" "}
              remains view-only and is not assignable as an execution identity.
              Requested actions here are deterministic planning/review outputs
              only: <span className="font-mono">view_only</span>,{" "}
              <span className="font-mono">draft_plan</span>,{" "}
              <span className="font-mono">draft_files_preview</span>, and{" "}
              <span className="font-mono">verify</span>.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Current selected loop-through candidate:{" "}
              <span className="font-mono">{loopCandidate.selected_work_packet_id}</span>.{" "}
              {loopCandidate.selection_reason}
            </p>
          </div>
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
            detail="Items that are fully framed and ready for operator review or bounded prompt packaging."
          />
          <SummaryCard
            label="Blocked or deferred"
            value={String(
              agenda.summary.status_counts.blocked + agenda.summary.status_counts.deferred,
            )}
            detail="Items that remain held behind scope, timing, or seam-order constraints."
          />
          <SummaryCard
            label="Target repos"
            value={String(agenda.summary.repo_count)}
            detail="Actual repo targets resolved by the current deterministic agenda."
          />
          <SummaryCard
            label="Action coverage"
            value={String(
              Object.values(agenda.summary.requested_action_counts).filter((count) => count > 0)
                .length,
            )}
            detail="Requested-action coverage includes view_only, draft_plan, draft_files_preview, and verify."
          />
        </section>

        <Section
          title="Agenda status coverage"
          description="Visible agenda states remain bounded to draft, ready_for_review, blocked, deferred, and settled."
        >
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(agenda.summary.status_counts).map(([status, count]) => (
                <ToneBadge key={status} tone={statusTone(status as DraftWorkPacketStatus)}>
                  {statusLabel(status as DraftWorkPacketStatus)}: {count}
                </ToneBadge>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="Authority posture"
          description="Activation agenda semantics remain planning/review-only and preserve the disabled control-plane boundary."
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap gap-2">
                <ToneBadge tone="rose">execution blocked</ToneBadge>
                <ToneBadge tone="rose">branch_write disabled</ToneBadge>
                <ToneBadge tone="rose">propose_pr disabled</ToneBadge>
                <ToneBadge tone="rose">execute_runtime disabled</ToneBadge>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {authorityPosture.notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Blocked capabilities
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {authorityPosture.blocked_capabilities.map((capability) => (
                  <ToneBadge key={capability} tone="rose">
                    {capability}
                  </ToneBadge>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Deterministic agenda queue"
          description="Each item resolves agent, role, repo, surface, source seam, allowed output, verification gates, human gates, evidence expectations, and next passalong target."
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
