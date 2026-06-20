import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { agentRegistryStaticData } from "@/data/operator/agentRegistry";
import type { PaletteAgentRecommendation } from "@/data/operator/agentRegistry";

function CompactList({
  items,
  empty = "none recorded",
  limit,
}: {
  items: readonly string[];
  empty?: string;
  limit?: number;
}) {
  if (items.length === 0) {
    return <div className="text-xs text-slate-500">{empty}</div>;
  }

  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;
  const hiddenCount =
    typeof limit === "number" && items.length > limit ? items.length - limit : 0;

  return (
    <ul className="space-y-1 text-xs text-slate-400">
      {visibleItems.map((item) => (
        <li key={item}>- {item}</li>
      ))}
      {hiddenCount > 0 ? <li>- +{hiddenCount} more</li> : null}
    </ul>
  );
}

function BadgeList({
  items,
  limit,
}: {
  items: readonly string[];
  limit?: number;
}) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;
  const hiddenCount =
    typeof limit === "number" && items.length > limit ? items.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleItems.map((item) => (
        <OperatorBadge key={item} tone="blocked">
          {item}
        </OperatorBadge>
      ))}
      {hiddenCount > 0 ? (
        <OperatorBadge tone="neutral">+{hiddenCount}</OperatorBadge>
      ) : null}
    </div>
  );
}

function RecommendationStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-semibold text-slate-100">
        {value}
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: PaletteAgentRecommendation;
}) {
  const candidates = agentRegistryStaticData.projectAgentCandidates.filter(
    (candidate) =>
      recommendation.recommendedCandidates.includes(candidate.candidateId),
  );
  const sourceTemplates = Array.from(
    new Set(candidates.map((candidate) => candidate.roleTemplate)),
  );
  const sourceEngines = Array.from(
    new Set([
      recommendation.primaryDomainEngine,
      ...candidates.map((candidate) => candidate.domainEngine),
    ]),
  );
  const repoScopes = Array.from(
    new Set(candidates.flatMap((candidate) => candidate.repoScope)),
  );
  const riskPostures = Array.from(
    new Set(candidates.map((candidate) => candidate.riskPosture)),
  );
  const statusLabels = recommendation.statusLabels as readonly string[];
  const isHighRisk =
    statusLabels.includes("HIGH-RISK / FUTURE-GATED / NO EXECUTION") ||
    riskPostures.some((risk) => risk.includes("HIGH-RISK"));
  const isBlocked =
    recommendation.blockedCapabilities.length > 0 ||
    recommendation.requiredGates.length > 0;
  const hasMissingEvidence = recommendation.missingEvidence.length > 0;

  return (
    <OperatorGateCard className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
        <OperatorBadge tone="fixture">STATIC DATA</OperatorBadge>
        <OperatorBadge tone="advisory">
          PALETTE RECOMMENDATION  NOT CREATION
        </OperatorBadge>
        <OperatorBadge tone="blocked">NOT ACTIVATION</OperatorBadge>
        <OperatorBadge tone="blocked">NOT DISPATCH</OperatorBadge>
        <OperatorBadge tone="blocked">NOT AUTHORITY</OperatorBadge>
        <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
        {isHighRisk ? (
          <OperatorBadge tone="blocked">
            HIGH-RISK / FUTURE-GATED / NO EXECUTION
          </OperatorBadge>
        ) : null}
        {isBlocked ? <OperatorBadge tone="blocked">BLOCKED IN V0</OperatorBadge> : null}
        {hasMissingEvidence ? (
          <OperatorBadge tone="pending">MISSING EVIDENCE</OperatorBadge>
        ) : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              {recommendation.projectId} / {recommendation.primaryDomainEngine}
            </div>
            <h3 className="mt-1 text-sm font-semibold text-slate-100">
              {recommendation.displayName}
            </h3>
            <div className="mt-2">
              <OperatorIdChip>{recommendation.recommendationId}</OperatorIdChip>
            </div>
          </div>
          <p className="text-sm text-slate-300">{recommendation.rationale}</p>
          <OperatorPanel className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Target project, repo, domain, and source posture
            </div>
            <CompactList
              items={[
                `target project: ${recommendation.projectId}`,
                `target repo/domain: ${repoScopes.join(", ") || recommendation.scope}`,
                `scope: ${recommendation.scope}`,
                `source posture: ${recommendation.sourcePosture}`,
                `operator review required: ${String(recommendation.operatorReviewRequired)}`,
                `CONTROL_THREAD acceptance required: ${String(recommendation.controlThreadAcceptanceRequired)}`,
              ]}
            />
          </OperatorPanel>
        </div>

        <div className="grid gap-2">
          <OperatorPanel className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Recommended staged Agents
            </div>
            <CompactList items={recommendation.recommendedCandidates} />
          </OperatorPanel>
          <OperatorPanel className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Source templates and domain engines
            </div>
            <CompactList items={sourceTemplates} />
            <div className="pt-1">
              <CompactList items={sourceEngines} />
            </div>
          </OperatorPanel>
          <OperatorPanel className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Risk posture
            </div>
            <CompactList items={riskPostures} empty="static recommendation risk only" />
          </OperatorPanel>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <OperatorPanel className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Missing evidence
          </div>
          <CompactList items={recommendation.missingEvidence} />
        </OperatorPanel>
        <OperatorPanel className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Blocked capabilities
          </div>
          <CompactList items={recommendation.blockedCapabilities} />
        </OperatorPanel>
        <OperatorPanel className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Safe alternatives
          </div>
          <CompactList items={recommendation.safeAlternatives} />
        </OperatorPanel>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <OperatorPanel className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Required reviews and gates
          </div>
          <CompactList
            items={[...recommendation.requiredReviews, ...recommendation.requiredGates]}
          />
        </OperatorPanel>
        <OperatorPanel className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Non-authority labels
          </div>
          <BadgeList items={recommendation.statusLabels} limit={8} />
        </OperatorPanel>
      </div>

      <OperatorPanel className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Project-state/v0, receipt-v0, and authority boundary
        </div>
        <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-2 xl:grid-cols-4">
          {[
            "project-state/v0 represents project state structure.",
            "project-state/v0 does not create project state.",
            "project-state/v0 does not accept project state.",
            "project-state/v0 does not create Agents.",
            "project-state/v0 does not activate Agents.",
            "project-state/v0 does not dispatch Agents.",
            "receipt-v0 represents decision receipt structure.",
            "receipt-v0 does not create receipts.",
            "receipt records.",
            "acceptance decides.",
            "CONTROL_THREAD decides.",
            "ZERO GATES GRANTED.",
          ].map((item) => (
            <div
              key={item}
              className="rounded border border-slate-800 bg-slate-950 px-2 py-1"
            >
              {item}
            </div>
          ))}
        </div>
      </OperatorPanel>
    </OperatorGateCard>
  );
}

export function PaletteAgentRecommendationSurface() {
  const { paletteRecommendations } = agentRegistryStaticData;
  const recommendedCandidateCount = new Set(
    paletteRecommendations.flatMap(
      (recommendation) => recommendation.recommendedCandidates,
    ),
  ).size;
  const missingEvidenceCount = paletteRecommendations.reduce(
    (count, recommendation) => count + recommendation.missingEvidence.length,
    0,
  );
  const blockedCapabilityCount = paletteRecommendations.reduce(
    (count, recommendation) => count + recommendation.blockedCapabilities.length,
    0,
  );
  const requiredReviewCount = paletteRecommendations.reduce(
    (count, recommendation) => count + recommendation.requiredReviews.length,
    0,
  );
  const highRiskCount = paletteRecommendations.filter((recommendation) =>
    (recommendation.statusLabels as readonly string[]).includes(
      "HIGH-RISK / FUTURE-GATED / NO EXECUTION",
    ),
  ).length;

  return (
    <section className="space-y-4">
      <OperatorPanel className="space-y-4">
        <OperatorSectionHeader
          index="PR"
          title="Palette Agent Recommendations"
          right={
            <>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="fixture">STATIC DATA</OperatorBadge>
              <OperatorBadge tone="advisory">RECOMMENDATION ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            </>
          }
        />
        <p className="max-w-5xl text-sm text-slate-300">
          Palette recommendation is not creation. Palette recommendation is not
          activation. Palette recommendation is not dispatch. Palette
          recommendation is not authority. Palette recommends staged Agent
          candidates for review. Template expansion is recommendation. Template
          instantiation is review. Agent activation is gated. Registry visibility
          is not activation. Agent registry entries do not execute. Agent lanes do
          not execute. CONTROL_THREAD decides. ZERO GATES GRANTED.
        </p>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          <RecommendationStat label="Recommendations" value={paletteRecommendations.length} />
          <RecommendationStat label="Staged candidates" value={recommendedCandidateCount} />
          <RecommendationStat label="Missing evidence" value={missingEvidenceCount} />
          <RecommendationStat label="Blocked capabilities" value={blockedCapabilityCount} />
          <RecommendationStat label="Required reviews" value={requiredReviewCount} />
          <RecommendationStat label="High-risk blocked" value={highRiskCount} />
        </div>
        <OperatorGateCard>
          <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-2 xl:grid-cols-4">
            {[
              "No Agent creation.",
              "No Agent activation.",
              "No Agent dispatch.",
              "No best-agent selection.",
              "No recommendation submission.",
              "No recommendation persistence.",
              "No project-state creation.",
              "No receipt creation.",
              "CONTROL_THREAD REVIEW REQUIRED",
              "ZERO GATES GRANTED.",
            ].map((item) => (
              <div
                key={item}
                className="rounded border border-slate-800 bg-slate-950 px-2 py-1"
              >
                {item}
              </div>
            ))}
          </div>
        </OperatorGateCard>
      </OperatorPanel>

      <div className="grid gap-3">
        {paletteRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.recommendationId}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
}
