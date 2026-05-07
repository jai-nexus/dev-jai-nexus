export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import { getJaiChatSurfaceModel } from "@/lib/controlPlane/jaiChatSurface";
import { getConfiguredAgentScopeSubset, getFullRepoRegistry } from "@/lib/controlPlane/repoSurfaceModel";

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

export default function OperatorJaiPage() {
  const surface = getJaiChatSurfaceModel();
  const authorityPosture = getControlPlaneAuthorityPosture();
  const fullRepoRegistry = getFullRepoRegistry();
  const configuredScopes = getConfiguredAgentScopeSubset();
  const docsOpsExercised = authorityPosture.docs_ops_levels.filter(
    (entry) => entry.status === "exercised_planning_safe",
  );
  const docsOpsDisabled = authorityPosture.docs_ops_levels.filter(
    (entry) => entry.status === "modeled_disabled",
  );

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">dev.jai.nexus - JAI Chat</h1>
            {surface.badges.map((badge, index) => (
              <ToneBadge
                key={badge}
                tone={index === 0 ? "sky" : index === 1 ? "amber" : "rose"}
              >
                {badge}
              </ToneBadge>
            ))}
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Operator-facing JAI shell for draft prompts and read-only control-plane
            context. This v0 surface is intentionally static: it does not call a live
            provider, persist messages, execute repo actions, or grant any new
            authority.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Domain scope: <span className="font-mono text-sky-200">{surface.domain}</span>
            </p>
            <p className="mt-1">
              Repo scope: <span className="font-mono text-sky-200">{surface.repo_full_name}</span>
            </p>
            <p className="mt-1">
              Baseline canon for this v0 shell:{" "}
              <span className="font-mono text-amber-200">{surface.baseline_motion_id}</span>
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Repo registry"
            value={String(fullRepoRegistry.length)}
            detail="Full repo registry loaded from canonical repos.yaml-backed control-plane model."
          />
          <SummaryCard
            label="Configured scope subset"
            value={String(configuredScopes.length)}
            detail="Agent scope remains a bounded subset rather than the whole registry."
          />
          <SummaryCard
            label="Latest settled baseline"
            value={surface.baseline_motion_id}
            detail="This route is aligned to the settled baseline through motion-0178."
          />
          <SummaryCard
            label="Docs-ops posture"
            value="L0/L1/L2 only"
            detail="Planning-safe levels are exercised while higher authority remains disabled."
          />
          <SummaryCard
            label="Live provider state"
            value="offline"
            detail="No live model, provider, or backend chat integration exists in v0."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-medium text-gray-100">Context panel</h2>
              <ToneBadge tone="sky">control-plane scoped</ToneBadge>
              <ToneBadge tone="rose">read-only context</ToneBadge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">Domain</div>
                <div className="mt-2 font-mono text-sm text-sky-200">{surface.domain}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">Repo</div>
                <div className="mt-2 font-mono text-sm text-sky-200">
                  {surface.repo_full_name}
                </div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Latest visible baseline canon
                </div>
                <div className="mt-2 font-mono text-sm text-amber-200">
                  {surface.baseline_motion_id}
                </div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Agent Assets Library
                </div>
                <div className="mt-2 font-mono text-sm text-sky-200">
                  {authorityPosture.agent_assets.location}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  static operating material only
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Authority status</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3">
                  <div className="font-mono text-xs text-emerald-200">
                    Levels exercised
                  </div>
                  <p className="mt-2 text-sm text-gray-300">
                    {docsOpsExercised.map((entry) => `Level ${entry.level}`).join(", ")} are
                    planning-safe only.
                  </p>
                </div>
                <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3">
                  <div className="font-mono text-xs text-rose-200">Levels disabled</div>
                  <p className="mt-2 text-sm text-gray-300">
                    {docsOpsDisabled.map((entry) => `Level ${entry.level}`).join(", ")} remain
                    modeled but disabled.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-medium text-gray-100">Guardrails</h2>
                <ToneBadge tone="rose">authority preserved</ToneBadge>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {surface.guardrails.map((guardrail) => (
                  <li key={guardrail}>- {guardrail}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Read-only notes
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {surface.status_notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Section
          title="Draft chat shell"
          description="Prompt affordances and placeholder output are visible for operator drafting only. No live provider, runtime response, or saved conversation is added here."
        >
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Operator draft input</h3>
                <ToneBadge tone="amber">mock input only</ToneBadge>
                <ToneBadge tone="rose">no live submit</ToneBadge>
              </div>
              <textarea
                readOnly
                value="Draft-only prompt area. Copy a suggested operator action below or write a bounded prompt for manual use. This field does not submit to a model in v0."
                rows={8}
                className="mt-4 w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-sm text-gray-200"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {surface.draft_actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="rounded-full border border-sky-900/60 bg-sky-950/30 px-3 py-2 text-xs text-sky-100"
                    title={action.prompt}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Suggested draft actions
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  {surface.draft_actions.map((action) => (
                    <li key={`${action.label}-detail`}>
                      <div className="font-medium text-gray-100">{action.label}</div>
                      <div className="mt-1 text-gray-400">{action.prompt}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">
                  Example assistant placeholder
                </h3>
                <ToneBadge tone="slate">static copy</ToneBadge>
              </div>
              <div className="mt-4 rounded-lg border border-gray-800 bg-black/40 p-4 text-sm text-gray-300">
                {surface.placeholder_response}
              </div>
              <div className="mt-4 rounded-lg border border-rose-900/50 bg-rose-950/20 p-4 text-sm text-rose-200">
                v0 limitation: no live provider/model integration, no execution dispatch, no
                branch write, no PR creation, no scheduler, and no persistence.
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Related operator surfaces"
          description="This shell is intentionally adjacent to existing control-plane views rather than replacing them."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {surface.linked_surfaces.map((linkedSurface) => (
              <Link
                key={linkedSurface.href}
                href={linkedSurface.href}
                className="rounded-xl border border-gray-800 bg-zinc-950 p-4 transition-colors hover:bg-zinc-900/60"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-100">
                    {linkedSurface.label}
                  </h3>
                  <ToneBadge tone="sky">existing</ToneBadge>
                </div>
                <div className="mt-2 font-mono text-xs text-sky-200">{linkedSurface.href}</div>
                <p className="mt-3 text-sm text-gray-400">{linkedSurface.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
