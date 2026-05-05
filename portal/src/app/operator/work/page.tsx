export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";

import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import { buildDraftWorkPacketTaskPrompt } from "@/lib/agents/workPacketTaskPrompts";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import type {
  DraftWorkPacket,
  DraftWorkPacketActionCompatibility,
  DraftWorkPacketCompatibilityState,
} from "@/lib/agents/workPacketTypes";

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

function compatibilityTone(
  state: DraftWorkPacketCompatibilityState,
): "emerald" | "amber" | "rose" {
  if (state === "compatible") return "emerald";
  if (state === "preview_only") return "amber";
  return "rose";
}

function compatibilityLabel(
  compatibility: DraftWorkPacketActionCompatibility,
): string {
  if (compatibility.requested_action === "draft_plan") return "draft plan";
  if (compatibility.requested_action === "draft_files_preview") {
    return "draft files preview";
  }
  return "verify";
}

function promptTone(status: "ready_preview" | "warning" | "blocked") {
  if (status === "ready_preview") return "emerald";
  if (status === "warning") return "amber";
  return "rose";
}

function PacketCard({ packet }: { packet: DraftWorkPacket }) {
  const prompt = buildDraftWorkPacketTaskPrompt(packet);

  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">
              {packet.title}
            </h3>
            <ToneBadge tone="amber">draft only</ToneBadge>
            <ToneBadge tone="rose">execution disabled</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-300">{packet.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ToneBadge tone="sky">
            scope subset: {packet.configured_scope_key}
          </ToneBadge>
          <ToneBadge tone="slate">{packet.packet_id}</ToneBadge>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Target model</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <ToneBadge tone="sky">{packet.target.repo_full_name}</ToneBadge>
              <ToneBadge tone="slate">
                surface: {packet.target.surface.label}
              </ToneBadge>
              {packet.target.project ? (
                <ToneBadge tone="emerald">
                  project: {packet.target.project.name}
                </ToneBadge>
              ) : (
                <ToneBadge tone="amber">project: none</ToneBadge>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Work packet targets always resolve to an actual repo plus a named
              surface, with an optional project/workstream overlay.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-gray-400">
              <li>- repo: {packet.target.repo_full_name}</li>
              <li>- surface: {packet.target.surface.label}</li>
              <li>
                - project: {packet.target.project?.project_id ?? "not assigned"}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Assigned named agent
              </span>
              <Link
                href={`/operator/agents#${packet.agent.key}`}
                className="text-sm font-medium text-sky-300 underline"
              >
                {packet.agent.label}
              </Link>
              <ToneBadge tone="slate">configured identity</ToneBadge>
            </div>
            <div className="mt-2 font-mono text-xs text-gray-400">
              {packet.agent.handle}
            </div>
            <p className="mt-2 text-sm text-gray-300">{packet.agent.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-gray-400">
              <li>- agent exists: yes</li>
              <li>
                - shared alias <span className="font-mono">agent@jai.nexus</span>{" "}
                is not assignable as an execution identity
              </li>
              <li>
                - execution identity remains false for this named JAI agent in
                v0
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Requested actions and compatibility
            </h4>
            <div className="mt-3 space-y-3">
              {packet.compatibility.requested_action_statuses.map(
                (compatibility) => (
                  <div
                    key={`${packet.packet_id}-${compatibility.requested_action}`}
                    className="rounded-lg border border-gray-800 bg-zinc-950/60 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <ToneBadge
                        tone={compatibilityTone(compatibility.status)}
                      >
                        {compatibility.status}
                      </ToneBadge>
                      <span className="text-sm font-medium text-gray-100">
                        {compatibilityLabel(compatibility)}
                      </span>
                      <span className="text-xs text-gray-500">
                        via {compatibility.registry_capability_key}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      {compatibility.reason}
                    </p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ToneBadge
                tone={
                  packet.compatibility.configured_scope_exists ? "emerald" : "rose"
                }
              >
                scope key present:{" "}
                {packet.compatibility.configured_scope_exists ? "yes" : "no"}
              </ToneBadge>
              <ToneBadge
                tone={packet.compatibility.target_repo_in_scope ? "emerald" : "rose"}
              >
                target repo in scope:{" "}
                {packet.compatibility.target_repo_in_scope ? "yes" : "no"}
              </ToneBadge>
              <ToneBadge
                tone={
                  packet.compatibility.target_surface_in_scope ? "emerald" : "rose"
                }
              >
                target surface in scope:{" "}
                {packet.compatibility.target_surface_in_scope ? "yes" : "no"}
              </ToneBadge>
              <ToneBadge tone="rose">
                execution blocked:{" "}
                {packet.compatibility.execution_blocked ? "yes" : "no"}
              </ToneBadge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Human gates
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              {packet.human_gates.map((gate) => (
                <li key={gate}>- {gate}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Evidence expectations
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              {packet.evidence_expectations.map((expectation) => (
                <li key={expectation}>- {expectation}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Credential posture
            </h4>
            <p className="mt-2 text-xs text-gray-400">
              Env variable names only. No values are rendered and no credential
              enablement occurs in this seam.
            </p>
            <ul className="mt-3 space-y-3">
              {packet.agent.credential_posture.map((credential) => (
                <li key={`${packet.packet_id}-${credential.key}`}>
                  <div className="font-mono text-xs text-sky-200">
                    {credential.env_var}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {credential.purpose}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Guardrails</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>- no run, dispatch, or execute controls exist here</li>
              <li>- no branch write or PR creation controls exist here</li>
              <li>- no API or DB mutation path is added by this surface</li>
              <li>
                - promotion, runtime execution, and cross-repo mutation remain
                out of scope
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-100">
                Task prompt preview
              </h4>
              <ToneBadge tone={promptTone(prompt.status)}>
                {prompt.status}
              </ToneBadge>
              <ToneBadge tone="amber">copy only</ToneBadge>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Prompt previews are deterministic and copy-only. Do not execute
              unless separately authorized by the operator.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ToneBadge tone="slate">
                {prompt.assigned_agent_key} - {prompt.assigned_agent_label}
              </ToneBadge>
              <ToneBadge tone="sky">
                branch suggestion: {prompt.branch_name_suggestion}
              </ToneBadge>
            </div>

            {prompt.warnings.length > 0 ? (
              <div className="mt-4 rounded-lg border border-amber-800 bg-amber-950/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-amber-300">
                  Warnings
                </div>
                <ul className="mt-2 space-y-1 text-xs text-amber-100">
                  {prompt.warnings.map((warning) => (
                    <li key={warning}>- {warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {prompt.blocked_reasons.length > 0 ? (
              <div className="mt-4 rounded-lg border border-rose-800 bg-rose-950/40 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-rose-300">
                  Blocked reasons
                </div>
                <ul className="mt-2 space-y-1 text-xs text-rose-100">
                  {prompt.blocked_reasons.map((reason) => (
                    <li key={reason}>- {reason}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 rounded-lg border border-gray-800 bg-zinc-950/70 p-3">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Prompt text
              </div>
              <textarea
                readOnly
                value={prompt.prompt_text}
                rows={28}
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
  const packets = getDraftWorkPackets();
  const authorityPosture = getControlPlaneAuthorityPosture();
  const compatibleCount = packets.filter(
    (packet) =>
      packet.compatibility.agent_exists &&
      packet.compatibility.target_repo_in_scope &&
      packet.compatibility.target_surface_in_scope,
  ).length;

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - Work Packets</h1>
            <ToneBadge tone="amber">draft only</ToneBadge>
            <ToneBadge tone="rose">execution disabled in v0</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-400">
            Read-only operator surface for draft work packets linked to
            configured JAI agents, configured scope subset keys, and actual
            repo-plus-surface targets before any execution is enabled.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Shared alias <span className="font-mono">agent@jai.nexus</span>{" "}
              remains view-only and is not assignable as an execution identity.
              Promotion, dispatch, branch writes, PR creation, and runtime
              execution remain disabled.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Draft packets"
            value={String(packets.length)}
            detail="Seed packets are examples of proposed repo work only. They do not run."
          />
          <SummaryCard
            label="Configured links"
            value={String(compatibleCount)}
            detail="Every seed packet links to a configured named agent and a matching repo-plus-surface target."
          />
          <SummaryCard
            label="Target repos"
            value={String(
              new Set(packets.map((packet) => packet.target.repo_full_name)).size,
            )}
            detail="Actual GitHub repositories represented by the current packet set."
          />
          <SummaryCard
            label="Target surfaces"
            value={String(
              new Set(packets.map((packet) => packet.target.surface.key)).size,
            )}
            detail="Product or operator surfaces attached to those repo targets."
          />
          <SummaryCard
            label="Task prompts"
            value={String(packets.length)}
            detail="Every initial draft work packet generates a deterministic preview-only task prompt."
          />
        </section>

        <Section
          title="Docs-ops authority posture"
          description="Read-only visibility into exercised planning-safe levels, modeled disabled levels, and blocked capabilities."
        >
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">
                  Docs-ops levels
                </h3>
                <ToneBadge tone="amber">read-only visibility</ToneBadge>
                <ToneBadge tone="rose">no new authority</ToneBadge>
              </div>
              <div className="mt-3 space-y-3">
                {authorityPosture.docs_ops_levels.map((level) => (
                  <div
                    key={`docs-ops-level-${level.level}`}
                    className="rounded-lg border border-gray-800 bg-black/30 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-mono text-xs text-sky-200">
                        Level {level.level}
                      </div>
                      <ToneBadge
                        tone={
                          level.status === "modeled_disabled"
                            ? "rose"
                            : level.status === "static_material"
                              ? "amber"
                              : "emerald"
                        }
                      >
                        {level.status === "modeled_disabled"
                          ? "modeled disabled"
                          : "exercised / planning-safe"}
                      </ToneBadge>
                      <span className="text-sm text-gray-200">{level.label}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-300">{level.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Control-plane notes
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  {authorityPosture.notes.map((note) => (
                    <li key={note}>- {note}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-100">
                    Agent Assets Library
                  </h3>
                  <ToneBadge tone="amber">static material</ToneBadge>
                </div>
                <div className="mt-3 font-mono text-xs text-sky-200">
                  {authorityPosture.agent_assets.location}
                </div>
                <p className="mt-3 text-sm text-gray-300">
                  {authorityPosture.agent_assets.summary}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  Assets do not grant authority and do not enable docs-ops
                  Level 3, 4, or 5 capability.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Blocked capabilities"
          description="These capabilities remain disabled across the current control-plane posture."
        >
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap gap-2">
              {authorityPosture.blocked_capabilities.map((capability) => (
                <ToneBadge key={capability} tone="rose">
                  {capability}
                </ToneBadge>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="Draft work packet queue"
          description="Packets bind configured named agents to actual repo-plus-surface targets, while keeping every execution path disabled."
        >
          <div className="space-y-4">
            {packets.map((packet) => (
              <PacketCard key={packet.packet_id} packet={packet} />
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
