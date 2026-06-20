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
  OperatorGatedAction,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { JaiCouncilReadiness } from "@/components/operator/JaiCouncilReadiness";
import { JaiReceiptGateAlignment } from "@/components/operator/JaiReceiptGateAlignment";
import { PaletteGridReadiness } from "@/components/operator/PaletteGridReadiness";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import { getJaiChatSurfaceModel } from "@/lib/controlPlane/jaiChatSurface";
import { getConfiguredAgentScopeSubset, getFullRepoRegistry } from "@/lib/controlPlane/repoSurfaceModel";

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
        right={<OperatorBadge tone="fixture">STATIC SURFACE MODEL</OperatorBadge>}
      />
      <p className="text-sm text-slate-400">{description}</p>
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
        <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
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
    <main className="min-h-screen bg-slate-950 px-8 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">
                dev.jai.nexus - JAI Chat
              </h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="fixture">LOCAL STATIC SHELL</OperatorBadge>
              <OperatorBadge tone="advisory">DRAFT-ONLY</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY CONTEXT</OperatorBadge>
              <OperatorBadge tone="blocked">NO LIVE MODEL</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
              {surface.badges.map((badge) => (
                <OperatorStatusChip key={badge} status={badge} tone="fixture" />
              ))}
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Operator-facing shell for draft prompt reference and read-only
              control-plane context. Prompt text is not dispatch, draft selection
              is not submission, and display does not grant authority.
            </p>
            <OperatorGateCard className="mt-4">
              <div className="flex flex-wrap gap-2">
                <OperatorIdChip>{surface.domain}</OperatorIdChip>
                <OperatorIdChip>{surface.repo_full_name}</OperatorIdChip>
                <OperatorIdChip>{surface.baseline_motion_id}</OperatorIdChip>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Baseline display is read-only. It does not update canon or create
                acceptance.
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Send prompt</OperatorBlockedAction>
              <OperatorBlockedAction>Dispatch model</OperatorBlockedAction>
              <OperatorBlockedAction>Run Agent</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              The shell has no provider, memory service, execution console, or
              persistence path.
            </p>
          </OperatorSafetyRail>
        </div>

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

        <JaiCouncilReadiness index="00" />

        <PaletteGridReadiness index="P/G" />

        <JaiReceiptGateAlignment index="ALIGN" compact />

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-medium text-slate-100">Context panel</h2>
              <OperatorBadge tone="readOnly">CONTROL-PLANE SCOPED</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY CONTEXT</OperatorBadge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <OperatorGateCard>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Domain
                </div>
                <div className="mt-2"><OperatorIdChip>{surface.domain}</OperatorIdChip></div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Repo
                </div>
                <div className="mt-2">
                  <OperatorIdChip>{surface.repo_full_name}</OperatorIdChip>
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Latest visible baseline canon
                </div>
                <div className="mt-2">
                  <OperatorIdChip>{surface.baseline_motion_id}</OperatorIdChip>
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Agent Assets Library
                </div>
                <div className="mt-2">
                  <OperatorIdChip>{authorityPosture.agent_assets.location}</OperatorIdChip>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  static operating material only
                </div>
              </OperatorGateCard>
            </div>
            <OperatorGateCard className="mt-4">
              <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Authority status
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <OperatorGateCard>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-mono text-xs text-sky-300">
                    Levels exercised
                    </div>
                    <OperatorBadge tone="readOnly">PLANNING-SAFE ONLY</OperatorBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {docsOpsExercised.map((entry) => `Level ${entry.level}`).join(", ")} are
                    planning-safe only.
                  </p>
                </OperatorGateCard>
                <OperatorContradictionCard>
                  <div className="font-mono text-xs text-red-200">Levels disabled</div>
                  <p className="mt-2 text-sm text-slate-300">
                    {docsOpsDisabled.map((entry) => `Level ${entry.level}`).join(", ")} remain
                    modeled but disabled.
                  </p>
                </OperatorContradictionCard>
              </div>
            </OperatorGateCard>
          </OperatorPanel>

          <div className="space-y-4">
            <OperatorContradictionCard className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-medium text-red-100">Guardrails</h2>
                <OperatorBadge tone="blocked">AUTHORITY PRESERVED</OperatorBadge>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {surface.guardrails.map((guardrail) => (
                  <li key={guardrail}>- {guardrail}</li>
                ))}
              </ul>
            </OperatorContradictionCard>
            <OperatorPanel className="p-5">
              <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Read-only notes
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {surface.status_notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </OperatorPanel>
          </div>
        </section>

        <Section
          index="01"
          title="Draft chat shell"
          description="Prompt affordances and placeholder output are visible for operator drafting only. No live provider, runtime response, or saved conversation is added here."
        >
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <OperatorPanel className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Operator draft input
                </h3>
                <OperatorBadge tone="fixture">MOCK INPUT ONLY</OperatorBadge>
                <OperatorBadge tone="blocked">NO LIVE SUBMIT</OperatorBadge>
              </div>
              <textarea
                readOnly
                value="Draft-only prompt area. Copy a suggested operator action below or write a bounded prompt for manual use. This field does not submit to a model in v0."
                rows={8}
                className="mt-4 w-full rounded border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {surface.draft_actions.map((action) => (
                  <OperatorGatedAction key={action.label}>
                    {action.label}
                  </OperatorGatedAction>
                ))}
              </div>
              <OperatorGateCard className="mt-4">
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Suggested draft actions
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {surface.draft_actions.map((action) => (
                    <li key={`${action.label}-detail`}>
                      <div className="font-medium text-slate-100">{action.label}</div>
                      <div className="mt-1 text-slate-400">{action.prompt}</div>
                    </li>
                  ))}
                </ul>
              </OperatorGateCard>
            </OperatorPanel>

            <OperatorPanel className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Example assistant placeholder
                </h3>
                <OperatorBadge tone="fixture">STATIC COPY</OperatorBadge>
              </div>
              <OperatorGateCard className="mt-4 text-sm text-slate-300">
                {surface.placeholder_response}
              </OperatorGateCard>
              <OperatorContradictionCard className="mt-4 text-sm text-red-200">
                v0 limitation: no live provider/model integration, no execution dispatch, no
                branch write, no PR creation, no scheduler, and no persistence.
              </OperatorContradictionCard>
            </OperatorPanel>
          </div>
        </Section>

        <Section
          index="02"
          title="Related operator surfaces"
          description="This shell is intentionally adjacent to existing control-plane views rather than replacing them."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {surface.linked_surfaces.map((linkedSurface) => (
              <Link
                key={linkedSurface.href}
                href={linkedSurface.href}
                className="rounded border border-slate-800 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {linkedSurface.label}
                  </h3>
                  <OperatorBadge tone="readOnly">EXISTING ROUTE</OperatorBadge>
                </div>
                <div className="mt-2">
                  <OperatorIdChip>{linkedSurface.href}</OperatorIdChip>
                </div>
                <p className="mt-3 text-sm text-slate-400">{linkedSurface.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
