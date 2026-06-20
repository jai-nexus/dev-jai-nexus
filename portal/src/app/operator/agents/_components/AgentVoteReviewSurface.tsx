import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { agentRegistryStaticData } from "@/data/operator/agentRegistry";
import type { AgentVoteBundle } from "@/data/operator/agentRegistry";

function roleFromNamespace(namespace: string) {
  return namespace.split("::").at(-1) ?? namespace;
}

function countVotes(
  bundles: readonly AgentVoteBundle[],
  voteClasses: readonly string[],
) {
  return bundles.reduce(
    (count, bundle) =>
      count +
      bundle.votes.filter((vote) => voteClasses.includes(vote.voteClass)).length,
    0,
  );
}

function CompactList({
  items,
  empty = "none recorded",
}: {
  items: readonly string[];
  empty?: string;
}) {
  if (items.length === 0) {
    return <div className="text-xs text-slate-500">{empty}</div>;
  }

  return (
    <ul className="space-y-1 text-xs text-slate-400">
      {items.map((item) => (
        <li key={item}>- {item}</li>
      ))}
    </ul>
  );
}

function ReviewStat({ label, value }: { label: string; value: number }) {
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

function BundleReviewCard({ bundle }: { bundle: AgentVoteBundle }) {
  const presentRoles = Array.from(
    new Set(bundle.participatingAgents.map(roleFromNamespace)),
  );
  const absentRoles = bundle.quorum.requiredRoles.filter(
    (role) => !presentRoles.includes(role),
  );
  const hasDissent = bundle.dissent.length > 0;
  const hasBlocker =
    bundle.blockers.length > 0 ||
    bundle.votes.some((vote) => vote.voteClass === "BLOCKER_RAISED");
  const hasMissingEvidence = bundle.votes.some(
    (vote) => vote.voteClass === "NEEDS_MORE_EVIDENCE",
  );
  const contradictions = bundle.votes.filter(
    (vote) => vote.voteClass === "CONTRADICTION_FOUND",
  );
  const safeAlternatives = bundle.votes.filter(
    (vote) => vote.voteClass === "SAFE_ALTERNATIVE_PROPOSED",
  );
  const revisionRequests = bundle.votes.filter(
    (vote) => vote.voteClass === "REQUEST_REVISION",
  );
  const approveRecommendations = bundle.votes.filter(
    (vote) => vote.voteClass === "APPROVE_RECOMMENDATION",
  );
  const riskVotes = bundle.votes.filter(
    (vote) =>
      vote.voteClass === "RISK_FLAG" ||
      vote.voteClass === "BLOCKER_RAISED" ||
      vote.voteClass === "REJECT_RECOMMENDATION",
  );
  const missingEvidence = bundle.votes.filter(
    (vote) => vote.voteClass === "NEEDS_MORE_EVIDENCE",
  );

  return (
    <OperatorGateCard className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
        <OperatorBadge tone="fixture">STATIC DATA</OperatorBadge>
        <OperatorBadge tone="advisory">ADVISORY ONLY</OperatorBadge>
        <OperatorBadge tone="blocked">NOT AUTHORITY</OperatorBadge>
        <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            {bundle.routeType} / {bundle.domainEngine}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-100">
            {bundle.voteBundleId}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorBadge tone="blocked">QUORUM IS NOT APPROVAL</OperatorBadge>
          <OperatorBadge tone="blocked">
            CONTROL_THREAD REVIEW REQUIRED
          </OperatorBadge>
          {hasDissent ? (
            <OperatorBadge tone="blocked">DISSENT PRESENT</OperatorBadge>
          ) : null}
          {hasBlocker ? (
            <OperatorBadge tone="blocked">BLOCKER RAISED</OperatorBadge>
          ) : null}
          {hasMissingEvidence ? (
            <OperatorBadge tone="pending">NEEDS MORE EVIDENCE</OperatorBadge>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <OperatorPanel className="p-0">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-950">
              <tr>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Issuing Agent
                </th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Role
                </th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Vote class
                </th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bundle.votes.map((vote) => (
                <tr key={`${bundle.voteBundleId}-${vote.agentNamespace}`}>
                  <td className="px-3 py-2 align-top">
                    <OperatorIdChip>{vote.agentNamespace}</OperatorIdChip>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-300">
                    {roleFromNamespace(vote.agentNamespace)}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <OperatorBadge
                      tone={
                        vote.voteClass === "APPROVE_RECOMMENDATION"
                          ? "advisory"
                          : "blocked"
                      }
                    >
                      {vote.voteClass}
                    </OperatorBadge>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-400">
                    {vote.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </OperatorPanel>

        <div className="grid gap-2">
          <OperatorPanel className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Quorum posture
            </div>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">{bundle.quorum.status}</OperatorBadge>
              <OperatorBadge tone="blocked">
                automatic approval: {String(bundle.quorum.automaticApproval)}
              </OperatorBadge>
            </div>
            <div className="grid gap-2 text-xs md:grid-cols-3 lg:grid-cols-1">
              <div>
                <div className="text-slate-500">required roles</div>
                <CompactList items={bundle.quorum.requiredRoles} />
              </div>
              <div>
                <div className="text-slate-500">present roles</div>
                <CompactList items={presentRoles} />
              </div>
              <div>
                <div className="text-slate-500">absent roles</div>
                <CompactList items={absentRoles} />
              </div>
            </div>
          </OperatorPanel>

          <OperatorPanel className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Review signals
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">
              <div>
                <div className="text-xs text-slate-500">approve recommendations</div>
                <CompactList
                  items={approveRecommendations.map((vote) => vote.evidence)}
                />
              </div>
              <div>
                <div className="text-xs text-slate-500">revision requests</div>
                <CompactList items={revisionRequests.map((vote) => vote.evidence)} />
              </div>
              <div>
                <div className="text-xs text-slate-500">blockers / risks</div>
                <CompactList
                  items={[
                    ...bundle.blockers,
                    ...riskVotes.map((vote) => vote.evidence),
                  ]}
                />
              </div>
              <div>
                <div className="text-xs text-slate-500">dissent</div>
                <CompactList items={bundle.dissent} />
              </div>
              <div>
                <div className="text-xs text-slate-500">contradictions</div>
                <CompactList items={contradictions.map((vote) => vote.evidence)} />
              </div>
              <div>
                <div className="text-xs text-slate-500">safe alternatives</div>
                <CompactList items={safeAlternatives.map((vote) => vote.evidence)} />
              </div>
              <div>
                <div className="text-xs text-slate-500">missing evidence</div>
                <CompactList items={missingEvidence.map((vote) => vote.evidence)} />
              </div>
            </div>
          </OperatorPanel>
        </div>
      </div>

      <OperatorPanel className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Non-authority boundary / gate posture
        </div>
        <p className="text-xs text-slate-300">{bundle.readinessEffect}</p>
        <p className="text-xs text-amber-200">{bundle.boundary}</p>
        <div className="flex flex-wrap gap-2">
          <OperatorBadge tone="blocked">No vote class triggers automatic progression.</OperatorBadge>
          <OperatorBadge tone="blocked">Even unanimous approval remains advisory.</OperatorBadge>
          <OperatorBadge tone="blocked">CONTROL_THREAD decides.</OperatorBadge>
          <OperatorBadge tone="blocked">ZERO GATES GRANTED.</OperatorBadge>
        </div>
      </OperatorPanel>
    </OperatorGateCard>
  );
}

export function AgentVoteReviewSurface() {
  const { voteBundles } = agentRegistryStaticData;
  const blockerCount = voteBundles.reduce(
    (count, bundle) =>
      count +
      bundle.blockers.length +
      bundle.votes.filter((vote) => vote.voteClass === "BLOCKER_RAISED").length,
    0,
  );
  const dissentCount =
    voteBundles.reduce((count, bundle) => count + bundle.dissent.length, 0) +
    countVotes(voteBundles, ["DISSENT"]);
  const missingEvidenceCount = countVotes(voteBundles, ["NEEDS_MORE_EVIDENCE"]);
  const contradictionCount = countVotes(voteBundles, ["CONTRADICTION_FOUND"]);
  const quorumReadyCount = voteBundles.filter(
    (bundle) => bundle.quorum.status === "QUORUM_COMPLETE_NOT_APPROVAL",
  ).length;
  const noConsensusCount = voteBundles.filter(
    (bundle) => bundle.quorum.status === "NO_CONSENSUS",
  ).length;

  return (
    <section className="space-y-4">
      <OperatorPanel className="space-y-4">
        <OperatorSectionHeader
          index="VR"
          title="Agent Vote Review"
          right={
            <>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="fixture">STATIC DATA</OperatorBadge>
              <OperatorBadge tone="advisory">VOTE REVIEW</OperatorBadge>
              <OperatorBadge tone="blocked">ADVISORY ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            </>
          }
        />
        <p className="max-w-5xl text-sm text-slate-300">
          Static advisory vote and quorum bundles are rendered for operator review.
          Agent votes are evidence, not authority. Agent votes do not decide.
          Quorum is readiness evidence, not approval. No vote class triggers
          automatic progression. Even unanimous approval remains advisory.
          CONTROL_THREAD decides. ZERO GATES GRANTED.
        </p>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-7">
          <ReviewStat label="Bundles" value={voteBundles.length} />
          <ReviewStat
            label="Votes"
            value={voteBundles.reduce(
              (count, bundle) => count + bundle.votes.length,
              0,
            )}
          />
          <ReviewStat label="Blockers" value={blockerCount} />
          <ReviewStat label="Dissent" value={dissentCount} />
          <ReviewStat label="Missing evidence" value={missingEvidenceCount} />
          <ReviewStat label="Contradictions" value={contradictionCount} />
          <ReviewStat label="No consensus" value={noConsensusCount} />
        </div>
        <OperatorGateCard>
          <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-2 xl:grid-cols-4">
            {[
              "receipt-v0 represents decision receipt structure.",
              "receipt-v0 does not create receipts.",
              "receipt records.",
              "acceptance decides.",
              "CONTROL_THREAD decides.",
              "QUORUM IS NOT APPROVAL",
              `quorum-ready bundles: ${quorumReadyCount}`,
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
        {voteBundles.map((bundle) => (
          <BundleReviewCard key={bundle.voteBundleId} bundle={bundle} />
        ))}
      </div>
    </section>
  );
}
