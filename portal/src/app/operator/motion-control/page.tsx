import type { Metadata } from "next";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorDissentCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import {
  buildDraftRoutePacket,
  canPrepareWorkPacketDraft,
  createManualDeliberationRunPreview,
  createWorkPacketDraftPreview,
  motionKernelRegistries,
  motionKernelVocabulary,
  runManualMotionKernelInference,
  summarizeManualDeliberationRun,
  type Motion,
} from "@/lib/controlPlane/motionKernel";
import { getSafeProviderStatus } from "@/lib/controlPlane/motionKernel/server-provider-config";

export const metadata: Metadata = {
  title: "Motion Control Kernel | dev.jai.nexus",
  description:
    "Manual internal motion deliberation, voting, and ratification kernel preview.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const boundaryCopy = [
  "JAI vote is not CONTROL_THREAD approval.",
  "JAI ratification is not CONTROL_THREAD approval.",
  "JAI ratification is not final authority.",
  "Human approval remains required.",
  "Human / CONTROL_THREAD approval remains required.",
  "Work packets remain draft-only until human approval.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No production gates.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden background execution.",
  "No automatic route execution.",
  "No work-packet execution.",
];

function FieldList({
  items,
}: {
  items: Array<{ label: string; value: string | number | null }>;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <OperatorGateCard key={item.label}>
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
            {item.label}
          </div>
          <div className="mt-1 font-mono text-sm text-slate-100">
            {item.value ?? "none"}
          </div>
        </OperatorGateCard>
      ))}
    </div>
  );
}

function MotionCard({ motion }: { motion: Motion }) {
  const draftPreview = createWorkPacketDraftPreview(motion);
  const draftAvailable = canPrepareWorkPacketDraft(motion.humanApprovalDecision);
  const routePacketPreview = buildDraftRoutePacket(motion);
  const mockInference = runManualMotionKernelInference({
    motionId: motion.id,
    roleSlotId: motion.roleSlotIds[0],
    modelSlotId: "model-slot-mock-deliberator",
    operatorPrompt: motion.summary,
  });
  const manualRun = createManualDeliberationRunPreview({
    motion,
    roleSlotIds: motion.roleSlotIds,
    modelSlotId: "model-slot-mock-deliberator",
    requestedMode: "mock",
  });
  const runSummary = summarizeManualDeliberationRun(manualRun);

  return (
    <OperatorPanel className="space-y-5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <OperatorIdChip>{motion.id}</OperatorIdChip>
            <OperatorBadge tone="advisory">{motion.lifecycleStatus}</OperatorBadge>
            <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-slate-100">
            {motion.title}
          </h2>
          <p className="mt-2 max-w-4xl text-sm text-slate-400">
            {motion.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorBadge tone="readOnly">
            {motion.ratificationRecommendation.value}
          </OperatorBadge>
          <OperatorBadge tone={draftAvailable ? "advisory" : "blocked"}>
            human approval: {motion.humanApprovalDecision.value}
          </OperatorBadge>
        </div>
      </div>

      <FieldList
        items={[
          {
            label: "control thread",
            value: motion.controlThread.label,
          },
          {
            label: "repo thread",
            value: motion.repoThread.id,
          },
          {
            label: "repo",
            value: motion.repoThread.repo,
          },
          {
            label: "branch candidate",
            value: motion.repoThread.branchCandidate ?? "none",
          },
          {
            label: "ratification",
            value: motion.ratificationRecommendation.value,
          },
          {
            label: "human approval",
            value: motion.humanApprovalDecision.value,
          },
        ]}
      />

      <section>
        <OperatorSectionHeader
          index="ROLE"
          title="Role-slot deliberation and critiques"
          right={<OperatorBadge tone="readOnly">provider agnostic</OperatorBadge>}
        />
        <div className="grid gap-3 xl:grid-cols-2">
          {motion.deliberations.length === 0 ? (
            <OperatorGateCard>
              <div className="text-sm text-slate-400">
                No deliberation entries yet. Draft motions are not inferred or
                dispatched automatically.
              </div>
            </OperatorGateCard>
          ) : (
            motion.deliberations.map((entry) => (
              <OperatorGateCard key={entry.id}>
                <div className="flex flex-wrap gap-2">
                  <OperatorIdChip>{entry.roleSlotId}</OperatorIdChip>
                  <OperatorBadge tone="neutral">{entry.modelSlotId}</OperatorBadge>
                  <OperatorBadge tone="readOnly">{entry.inferenceMode}</OperatorBadge>
                </div>
                <p className="mt-3 text-sm text-slate-200">{entry.summary}</p>
                <ul className="mt-3 space-y-1 text-xs text-slate-400">
                  {entry.reasoning.map((line) => (
                    <li key={`${entry.id}-${line}`}>- {line}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-amber-300">
                  {entry.nonAuthorityNote}
                </p>
              </OperatorGateCard>
            ))
          )}
          {motion.critiques.map((critique) => (
            <OperatorDissentCard key={critique.id}>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="blocked">{critique.severity}</OperatorBadge>
                <OperatorIdChip>{critique.roleSlotId}</OperatorIdChip>
              </div>
              <p className="mt-3 text-sm text-red-100">{critique.summary}</p>
              <p className="mt-2 text-xs text-red-200">
                Follow-up: {critique.requiredFollowUp}
              </p>
            </OperatorDissentCard>
          ))}
        </div>
      </section>

      <section>
        <OperatorSectionHeader
          index="VOTE"
          title="Advisory votes and ratification recommendation"
          right={<OperatorBadge tone="blocked">not final authority</OperatorBadge>}
        />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {motion.votes.length === 0 ? (
              <OperatorGateCard>
                <div className="text-sm text-slate-400">
                  No votes recorded. Draft status remains non-authorizing.
                </div>
              </OperatorGateCard>
            ) : (
              motion.votes.map((vote) => (
                <OperatorGateCard key={vote.id}>
                  <div className="flex flex-wrap gap-2">
                    <OperatorBadge tone="advisory">{vote.value}</OperatorBadge>
                    <OperatorIdChip>{vote.roleSlotId}</OperatorIdChip>
                    <OperatorBadge tone="blocked">non-binding</OperatorBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{vote.rationale}</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-400">
                    {vote.conditions.map((condition) => (
                      <li key={`${vote.id}-${condition}`}>- {condition}</li>
                    ))}
                  </ul>
                </OperatorGateCard>
              ))
            )}
          </div>
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">
                {motion.ratificationRecommendation.value}
              </OperatorBadge>
              <OperatorBadge tone="blocked">advisory only</OperatorBadge>
              <OperatorBadge tone="blocked">human approval required</OperatorBadge>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {motion.ratificationRecommendation.summary}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              {motion.ratificationRecommendation.conditions.map((condition) => (
                <li key={`${motion.id}-${condition}`}>- {condition}</li>
              ))}
            </ul>
          </OperatorGateCard>
        </div>
      </section>

      <section>
        <OperatorSectionHeader
          index="DRAFT"
          title="Downstream draft preparation"
          right={<OperatorBadge tone={draftAvailable ? "advisory" : "blocked"}>{draftPreview.workPacketDraft.status}</OperatorBadge>}
        />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              draftPreview.programDraft,
              draftPreview.batchDraft,
              draftPreview.waveDraft,
              draftPreview.laneDraft,
              draftPreview.workPacketDraft,
            ].map((draft) => (
              <OperatorGateCard key={draft.id}>
                <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                  {draft.id}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-100">
                  {"title" in draft ? draft.title : draft.label}
                </div>
                <div className="mt-2">
                  <OperatorBadge tone={draft.status === "draft_only" ? "advisory" : "blocked"}>
                    {draft.status}
                  </OperatorBadge>
                </div>
              </OperatorGateCard>
            ))}
          </div>
          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
              draft route packet preview
            </div>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950 p-3 text-xs leading-6 text-slate-200">
              {routePacketPreview}
            </pre>
          </OperatorGateCard>
        </div>
      </section>

      <section>
        <OperatorSectionHeader
          index="EVIDENCE"
          title="Evidence and closeout placeholders"
          right={<OperatorBadge tone="readOnly">metadata only</OperatorBadge>}
        />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-3 md:grid-cols-2">
            {motion.evidencePointers.map((pointer) => (
              <OperatorGateCard key={pointer.id}>
                <div className="flex flex-wrap gap-2">
                  <OperatorBadge tone="readOnly">{pointer.sourceType}</OperatorBadge>
                  <OperatorBadge tone="blocked">
                    validation authority: {pointer.validationAuthority}
                  </OperatorBadge>
                </div>
                <div className="mt-2 font-mono text-xs text-slate-300">
                  {pointer.ref}
                </div>
                <p className="mt-2 text-sm text-slate-400">{pointer.summary}</p>
              </OperatorGateCard>
            ))}
          </div>
          <OperatorGateCard>
            <OperatorBadge tone="blocked">
              {motion.closeoutPlaceholder.status}
            </OperatorBadge>
            <h3 className="mt-3 text-sm font-semibold text-slate-100">
              {motion.closeoutPlaceholder.label}
            </h3>
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              {motion.closeoutPlaceholder.notes.map((note) => (
                <li key={`${motion.id}-${note}`}>- {note}</li>
              ))}
            </ul>
          </OperatorGateCard>
        </div>
      </section>

      <section>
        <OperatorSectionHeader
          index="INFERENCE"
          title="Manual mock inference preview"
          right={<OperatorBadge tone="blocked">no live provider call</OperatorBadge>}
        />
        <OperatorGateCard>
          <div className="flex flex-wrap gap-2">
            <OperatorBadge tone="readOnly">{mockInference.mode}</OperatorBadge>
            <OperatorBadge tone="blocked">manual/operator-triggered only</OperatorBadge>
          </div>
          <p className="mt-3 text-sm text-slate-300">{mockInference.summary}</p>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            {mockInference.reasoning.map((line) => (
              <li key={`${motion.id}-${line}`}>- {line}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-amber-300">
            {mockInference.nonAuthorityDisclaimer}
          </p>
        </OperatorGateCard>
      </section>

      <section>
        <OperatorSectionHeader
          index="RUN"
          title="Manual deliberation run preview"
          right={<OperatorBadge tone="blocked">static preview / not persisted</OperatorBadge>}
        />
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-3">
            <OperatorGateCard>
              <div className="flex flex-wrap gap-2">
                <OperatorIdChip>{manualRun.run.id}</OperatorIdChip>
                <OperatorBadge tone="readOnly">{manualRun.run.requestedMode}</OperatorBadge>
                <OperatorBadge tone="blocked">operator-triggered only</OperatorBadge>
                <OperatorBadge tone="blocked">not persisted</OperatorBadge>
              </div>
              <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950 p-3 text-xs leading-6 text-slate-200">
                {runSummary}
              </pre>
            </OperatorGateCard>
            <div className="grid gap-3 lg:grid-cols-2">
              {manualRun.participantOutputs.map((output) => (
                <OperatorGateCard key={`${manualRun.run.id}-${output.roleSlotId}`}>
                  <div className="flex flex-wrap gap-2">
                    <OperatorIdChip>{output.roleSlotId}</OperatorIdChip>
                    <OperatorBadge tone="neutral">{output.modelSlotId}</OperatorBadge>
                    <OperatorBadge tone="advisory">{output.voteValue}</OperatorBadge>
                    <OperatorBadge tone="readOnly">
                      {output.ratificationRecommendation}
                    </OperatorBadge>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {output.critiqueSummary}
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                        required revisions
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-slate-400">
                        {output.requiredRevisions.length === 0 ? (
                          <li>none</li>
                        ) : (
                          output.requiredRevisions.map((revision) => (
                            <li key={`${output.roleSlotId}-${revision}`}>- {revision}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                        blockers
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-slate-400">
                        {output.blockers.length === 0 ? (
                          <li>none</li>
                        ) : (
                          output.blockers.map((blocker) => (
                            <li key={`${output.roleSlotId}-${blocker}`}>- {blocker}</li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-amber-300">
                    {output.confidenceReadinessNote}
                  </p>
                </OperatorGateCard>
              ))}
            </div>
          </div>
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">aggregate is advisory</OperatorBadge>
              <OperatorBadge tone="readOnly">
                {manualRun.aggregateRatification.value}
              </OperatorBadge>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {manualRun.aggregateRatification.summary}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(manualRun.aggregateRatification.voteCounts).map(
                ([vote, count]) => (
                  <div
                    key={`${manualRun.run.id}-${vote}`}
                    className="rounded border border-slate-800 bg-slate-950 p-2"
                  >
                    <div className="font-mono text-xs uppercase text-slate-500">
                      {vote}
                    </div>
                    <div className="mt-1 font-mono text-lg text-slate-100">
                      {count}
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-wide text-slate-500">
              aggregate blockers
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              {manualRun.aggregateRatification.blockers.length === 0 ? (
                <li>none</li>
              ) : (
                manualRun.aggregateRatification.blockers.map((blocker) => (
                  <li key={`${manualRun.run.id}-${blocker}`}>- {blocker}</li>
                ))
              )}
            </ul>
            <p className="mt-3 text-xs text-red-200">
              {manualRun.aggregateRatification.nonAuthorityDisclaimer}
            </p>
          </OperatorGateCard>
        </div>
      </section>
    </OperatorPanel>
  );
}

export default function MotionControlPage() {
  const { roleSlots, modelSlots, motions } = motionKernelRegistries;
  const providerStatus = getSafeProviderStatus();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <OperatorPanel className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">INTERNAL CONTROL PLANE</OperatorBadge>
              <OperatorBadge tone="advisory">MOTION KERNEL V0</OperatorBadge>
              <OperatorBadge tone="blocked">NO AUTONOMOUS EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO GITHUB MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO PRODUCTION GATES</OperatorBadge>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                dev.jai.nexus / operator / motion-control
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                Motion / Deliberation / Vote / Ratification Kernel
              </h1>
            </div>
            <p className="max-w-5xl text-sm text-slate-400">
              Manual internal surface for reviewing typed motions, provider-agnostic
              JAI role slots, provider-agnostic model slots, deliberation entries,
              critiques, advisory votes, ratification recommendations, human
              approval separation, and downstream draft placeholders.
            </p>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
              <OperatorGateCard>
                <div className="font-mono text-xs text-slate-500">motions</div>
                <div className="mt-1 font-mono text-2xl text-slate-100">
                  {motions.length}
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs text-slate-500">role slots</div>
                <div className="mt-1 font-mono text-2xl text-slate-100">
                  {roleSlots.length}
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs text-slate-500">model slots</div>
                <div className="mt-1 font-mono text-2xl text-slate-100">
                  {modelSlots.length}
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs text-slate-500">lifecycle</div>
                <div className="mt-1 font-mono text-2xl text-slate-100">
                  {motionKernelVocabulary.lifecycle.length}
                </div>
              </OperatorGateCard>
              <OperatorGateCard>
                <div className="font-mono text-xs text-slate-500">gates</div>
                <div className="mt-1 font-mono text-2xl text-red-300">0</div>
              </OperatorGateCard>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Motion Kernel Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="space-y-2">
              {boundaryCopy.map((boundary) => (
                <div
                  key={boundary}
                  className="rounded border border-red-900/70 bg-red-950/20 px-2 py-1 text-xs text-red-200"
                >
                  {boundary}
                </div>
              ))}
            </div>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="01"
            title="Provider-agnostic role slots"
            right={<OperatorBadge tone="blocked">provider is not authority</OperatorBadge>}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {roleSlots.map((slot) => (
              <OperatorGateCard key={slot.id}>
                <OperatorIdChip>{slot.id}</OperatorIdChip>
                <h2 className="mt-3 text-sm font-semibold text-slate-100">
                  {slot.displayName}
                </h2>
                <p className="mt-2 text-sm text-slate-400">{slot.purpose}</p>
                <p className="mt-2 text-xs text-slate-300">
                  Responsibility: {slot.deliberationResponsibility}
                </p>
                <p className="mt-2 text-xs text-amber-300">
                  {slot.authorityDisclaimer}
                </p>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="02"
            title="Provider-agnostic model slots"
            right={<OperatorBadge tone="blocked">manual trigger only</OperatorBadge>}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {modelSlots.map((slot) => (
              <OperatorGateCard key={slot.id}>
                <div className="flex flex-wrap gap-2">
                  <OperatorIdChip>{slot.id}</OperatorIdChip>
                  <OperatorBadge tone={slot.enabled ? "advisory" : "blocked"}>
                    {slot.enabled ? "enabled" : "disabled"}
                  </OperatorBadge>
                  <OperatorBadge tone="readOnly">{slot.inferenceMode}</OperatorBadge>
                </div>
                <h2 className="mt-3 text-sm font-semibold text-slate-100">
                  {slot.displayName}
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Provider family: {slot.providerFamily}
                </p>
                {slot.envGate ? (
                  <p className="mt-2 font-mono text-xs text-slate-500">
                    Env gate: {slot.envGate}; provider: JAI_MODEL_SLOT_PROVIDER;
                    model: JAI_MODEL_SLOT_MODEL; credential remains server-only
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-amber-300">
                  {slot.nonAuthorityDisclaimer}
                </p>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="03"
            title="Secure provider connector boundary"
            right={<OperatorBadge tone="blocked">server-side POST only</OperatorBadge>}
          />
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <FieldList
              items={[
                {
                  label: "live inference enabled",
                  value: String(providerStatus.liveInferenceEnabled),
                },
                {
                  label: "provider configured",
                  value: String(providerStatus.providerConfigured),
                },
                {
                  label: "provider key present",
                  value: String(providerStatus.providerKeyPresent),
                },
                {
                  label: "provider",
                  value: providerStatus.providerName ?? "not configured",
                },
                {
                  label: "model",
                  value: providerStatus.modelName ?? "not configured",
                },
                {
                  label: "mode",
                  value: providerStatus.mode,
                },
              ]}
            />
            <OperatorGateCard>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="blocked">manual/operator-triggered</OperatorBadge>
                <OperatorBadge tone="blocked">no render-time provider call</OperatorBadge>
                <OperatorBadge tone="readOnly">mock fallback</OperatorBadge>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                {providerStatus.advisoryMessage}
              </p>
              <p className="mt-3 font-mono text-xs text-slate-400">
                POST /operator/motion-control/manual-inference
              </p>
              <p className="mt-2 text-xs text-amber-300">
                The route returns safe status, normalized advisory participant
                outputs, and aggregate ratification. It never returns provider
                keys, does not persist results, and does not execute work packets.
              </p>
            </OperatorGateCard>
          </div>
        </OperatorPanel>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="04"
            title="Canonical vocabulary"
            right={<OperatorBadge tone="readOnly">stable values</OperatorBadge>}
          />
          <div className="grid gap-3 lg:grid-cols-4">
            {Object.entries(motionKernelVocabulary).map(([label, values]) => (
              <OperatorGateCard key={label}>
                <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                  {label}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {values.map((value) => (
                    <OperatorBadge key={value} tone="neutral">
                      {value}
                    </OperatorBadge>
                  ))}
                </div>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="05"
            title="Participant output contract"
            right={<OperatorBadge tone="blocked">all outputs advisory</OperatorBadge>}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              "role slot id",
              "model slot id",
              "critique summary",
              "vote value",
              "ratification recommendation",
              "required revisions",
              "blockers",
              "confidence / readiness note",
              "non-authorizations",
            ].map((field) => (
              <OperatorGateCard key={field}>
                <div className="font-mono text-xs uppercase tracking-wide text-slate-300">
                  {field}
                </div>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

        <section className="space-y-6">
          <OperatorSectionHeader
            index="06"
            title="Manual motion review"
            right={<OperatorBadge tone="blocked">no submit / no save / no API call</OperatorBadge>}
          />
          {motions.map((motion) => (
            <MotionCard key={motion.id} motion={motion} />
          ))}
        </section>
      </div>
    </main>
  );
}
