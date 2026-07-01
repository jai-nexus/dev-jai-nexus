"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import type {
  AdvisoryRatificationSummary,
  DeliberationParticipantOutput,
  DeliberationRunPersistenceStatus,
  EvidencePointer,
  JaiRoleSlotId,
  ModelSlotId,
  Motion,
  ProviderConnectorSafeStatus,
} from "@/lib/controlPlane/motionKernel/types";

type ManualActionRoleSlotOption = {
  id: JaiRoleSlotId;
  displayName: string;
  deliberationResponsibility: string;
};

type ManualActionModelSlotOption = {
  id: ModelSlotId;
  displayName: string;
  enabled: boolean;
  inferenceMode: string;
  providerFamily: string;
};

type ManualActionResult = {
  ok: boolean;
  persisted: boolean;
  operatorTriggeredOnly: true;
  providerStatus: ProviderConnectorSafeStatus;
  persistence: {
    id: string;
    status: DeliberationRunPersistenceStatus;
    safeAdvisoryMessage: string;
    createdAt: string;
  };
  connectorStatuses: Array<{
    roleSlotId: JaiRoleSlotId;
    status: ProviderConnectorSafeStatus;
    nonAuthorityDisclaimer: string;
  }>;
  participantOutputs: DeliberationParticipantOutput[];
  aggregateRatification: AdvisoryRatificationSummary;
  evidencePointers: EvidencePointer[];
  nonAuthorizations: string[];
};

export function ManualDeliberationAction({
  motions,
  roleSlots,
  modelSlots,
  providerStatus,
  selectedMotionId,
  onSelectedMotionIdChange,
}: {
  motions: Motion[];
  roleSlots: ManualActionRoleSlotOption[];
  modelSlots: ManualActionModelSlotOption[];
  providerStatus: ProviderConnectorSafeStatus;
  selectedMotionId?: string;
  onSelectedMotionIdChange?: (motionId: string) => void;
}) {
  const router = useRouter();
  const [localSelectedMotionId, setLocalSelectedMotionId] = useState(
    motions[1]?.id ?? motions[0]?.id ?? "",
  );
  const [selectedModelSlotId, setSelectedModelSlotId] = useState<ModelSlotId>(
    "model-slot-mock-deliberator",
  );
  const [selectedRoleSlotIds, setSelectedRoleSlotIds] = useState<JaiRoleSlotId[]>(
    motions[1]?.roleSlotIds ?? motions[0]?.roleSlotIds ?? [],
  );
  const [mode, setMode] = useState<"mock" | "env_gated_provider">("mock");
  const [result, setResult] = useState<ManualActionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeSelectedMotionId = selectedMotionId ?? localSelectedMotionId;

  const selectedMotion = useMemo(
    () => motions.find((motion) => motion.id === activeSelectedMotionId),
    [motions, activeSelectedMotionId],
  );

  useEffect(() => {
    if (selectedMotion) {
      setSelectedRoleSlotIds(selectedMotion.roleSlotIds);
    }
  }, [selectedMotion]);

  const canRun =
    activeSelectedMotionId.length > 0 && selectedRoleSlotIds.length > 0;

  function updateSelectedMotion(motionId: string) {
    if (onSelectedMotionIdChange) {
      onSelectedMotionIdChange(motionId);
    } else {
      setLocalSelectedMotionId(motionId);
    }
    const motion = motions.find((candidate) => candidate.id === motionId);
    if (motion) {
      setSelectedRoleSlotIds(motion.roleSlotIds);
    }
  }

  function toggleRoleSlot(roleSlotId: JaiRoleSlotId) {
    setSelectedRoleSlotIds((current) =>
      current.includes(roleSlotId)
        ? current.filter((candidate) => candidate !== roleSlotId)
        : [...current, roleSlotId],
    );
  }

  function runManualDeliberation() {
    if (!canRun || isPending) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/operator/motion-control/manual-inference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            motionId: activeSelectedMotionId,
            roleSlotIds: selectedRoleSlotIds,
            modelSlotId: selectedModelSlotId,
            mode,
            motionBasis: selectedMotion?.id.startsWith("local-composed-motion-")
              ? selectedMotion
              : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Manual deliberation route returned a non-OK response.");
        }

        const value = (await response.json()) as ManualActionResult;
        setResult(value);
        router.refresh();
      } catch {
        setError(
          "Manual deliberation run failed safely. No work was routed, executed, persisted as authority, or sent to GitHub.",
        );
      }
    });
  }

  return (
    <OperatorPanel className="space-y-5 p-4">
      <OperatorSectionHeader
        index="04"
        title="Manual deliberation action"
        right={<OperatorBadge tone="blocked">operator-triggered only</OperatorBadge>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="advisory">manual deliberation run</OperatorBadge>
              <OperatorBadge tone="readOnly">mock default</OperatorBadge>
              <OperatorBadge tone="blocked">advisory only</OperatorBadge>
              <OperatorBadge tone="blocked">no route authority</OperatorBadge>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              This control calls the internal manual inference route only after an
              operator clicks Run deliberation. Provider mode remains server-side,
              env-gated, and non-authorizing.
            </p>
            <p className="mt-2 text-xs text-red-200">
              Manual deliberation run is not CONTROL_THREAD approval. Human /
              CONTROL_THREAD approval remains required before proceeding.
            </p>
          </OperatorGateCard>

          <div className="grid gap-3 lg:grid-cols-2">
            <label className="block rounded border border-slate-800 bg-slate-950 p-3">
              <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
                motion
              </span>
              <select
                value={activeSelectedMotionId}
                onChange={(event) => updateSelectedMotion(event.target.value)}
                className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              >
                {motions.map((motion) => (
                  <option key={motion.id} value={motion.id}>
                    {motion.title}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-xs text-slate-500">
                {selectedMotion?.lifecycleStatus ?? "no motion selected"}
              </div>
            </label>

            <label className="block rounded border border-slate-800 bg-slate-950 p-3">
              <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
                model slot
              </span>
              <select
                value={selectedModelSlotId}
                onChange={(event) =>
                  setSelectedModelSlotId(event.target.value as ModelSlotId)
                }
                className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              >
                {modelSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.displayName}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-xs text-slate-500">
                Inference:{" "}
                {modelSlots.find((slot) => slot.id === selectedModelSlotId)
                  ?.inferenceMode ?? "unknown"}
              </div>
            </label>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
              run mode
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("mock")}
                className={`rounded border px-3 py-2 text-sm ${
                  mode === "mock"
                    ? "border-cyan-500 bg-cyan-950 text-cyan-100"
                    : "border-slate-800 bg-slate-950 text-slate-300"
                }`}
              >
                Mock mode
              </button>
              <button
                type="button"
                onClick={() => setMode("env_gated_provider")}
                className={`rounded border px-3 py-2 text-sm ${
                  mode === "env_gated_provider"
                    ? "border-amber-500 bg-amber-950 text-amber-100"
                    : "border-slate-800 bg-slate-950 text-slate-300"
                }`}
              >
                Env-gated provider
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Provider mode only returns safe status and advisory output. Provider
              credentials remain server-only and are never rendered in this
              client action.
            </p>
          </OperatorGateCard>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
              role slots
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {roleSlots.map((slot) => (
                <label
                  key={slot.id}
                  className="flex gap-3 rounded border border-slate-800 bg-slate-950 p-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleSlotIds.includes(slot.id)}
                    onChange={() => toggleRoleSlot(slot.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900"
                  />
                  <span>
                    <span className="block font-mono text-xs text-slate-200">
                      {slot.id}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {slot.deliberationResponsibility}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </OperatorGateCard>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runManualDeliberation}
              disabled={!canRun || isPending}
              className="rounded border border-cyan-500 bg-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
            >
              {isPending ? "Running deliberation..." : "Run deliberation"}
            </button>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200"
            >
              Refresh history
            </button>
          </div>

          {error ? (
            <OperatorGateCard>
              <OperatorBadge tone="blocked">safe failure</OperatorBadge>
              <p className="mt-3 text-sm text-red-200">{error}</p>
            </OperatorGateCard>
          ) : null}
        </div>

        <OperatorGateCard>
          <div className="flex flex-wrap gap-2">
            <OperatorBadge tone="readOnly">{providerStatus.mode}</OperatorBadge>
            <OperatorBadge tone="blocked">server-side connector</OperatorBadge>
            <OperatorBadge tone="blocked">no secrets exposed</OperatorBadge>
          </div>
          <div className="mt-4 grid gap-2">
            {[
              ["live inference enabled", String(providerStatus.liveInferenceEnabled)],
              ["provider configured", String(providerStatus.providerConfigured)],
              ["provider key present", String(providerStatus.providerKeyPresent)],
              ["provider", providerStatus.providerName ?? "not configured"],
              ["model", providerStatus.modelName ?? "not configured"],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-slate-800 p-2">
                <div className="font-mono text-xs uppercase text-slate-500">
                  {label}
                </div>
                <div className="mt-1 font-mono text-xs text-slate-100">
                  {value}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {providerStatus.advisoryMessage}
          </p>
        </OperatorGateCard>
      </div>

      {result ? <ManualActionResultView result={result} /> : null}
    </OperatorPanel>
  );
}

function ManualActionResultView({ result }: { result: ManualActionResult }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <OperatorGateCard>
          <div className="flex flex-wrap gap-2">
            <OperatorIdChip>{result.persistence.id}</OperatorIdChip>
            <OperatorBadge tone={result.persisted ? "advisory" : "blocked"}>
              {result.persistence.status}
            </OperatorBadge>
            <OperatorBadge tone="readOnly">{result.providerStatus.mode}</OperatorBadge>
            <OperatorBadge tone="blocked">not approval</OperatorBadge>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {result.persistence.safeAdvisoryMessage}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Created at {result.persistence.createdAt}
          </p>
        </OperatorGateCard>

        <OperatorGateCard>
          <div className="flex flex-wrap gap-2">
            <OperatorBadge tone="blocked">aggregate advisory</OperatorBadge>
            <OperatorBadge tone="readOnly">
              {result.aggregateRatification.value}
            </OperatorBadge>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {result.aggregateRatification.summary}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(result.aggregateRatification.voteCounts).map(
              ([vote, count]) => (
                <div key={vote} className="rounded border border-slate-800 p-2">
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
          <p className="mt-3 text-xs text-red-200">
            {result.aggregateRatification.nonAuthorityDisclaimer}
          </p>
        </OperatorGateCard>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {result.participantOutputs.map((output) => (
          <OperatorGateCard key={`${output.roleSlotId}-${output.modelSlotId}`}>
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
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <ListBlock
                title="required revisions"
                items={output.requiredRevisions}
              />
              <ListBlock title="blockers" items={output.blockers} />
            </div>
            <p className="mt-3 text-xs text-amber-300">
              {output.confidenceReadinessNote}
            </p>
            <ListBlock
              title="non-authorizations"
              items={output.nonAuthorizations}
            />
          </OperatorGateCard>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
            connector status by role
          </div>
          <div className="mt-3 space-y-2">
            {result.connectorStatuses.map((connector) => (
              <div
                key={connector.roleSlotId}
                className="rounded border border-slate-800 bg-slate-950 p-2"
              >
                <div className="flex flex-wrap gap-2">
                  <OperatorIdChip>{connector.roleSlotId}</OperatorIdChip>
                  <OperatorBadge tone="readOnly">
                    {connector.status.mode}
                  </OperatorBadge>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {connector.status.advisoryMessage}
                </p>
                <p className="mt-2 text-xs text-amber-300">
                  {connector.nonAuthorityDisclaimer}
                </p>
              </div>
            ))}
          </div>
        </OperatorGateCard>

        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
            evidence pointers
          </div>
          <div className="mt-2 font-mono text-2xl text-slate-100">
            {result.evidencePointers.length}
          </div>
          <p className="mt-2 text-xs text-red-200">
            Evidence pointer is not validation approval.
          </p>
          <ListBlock
            title="manual action non-authorizations"
            items={result.nonAuthorizations}
          />
        </OperatorGateCard>
      </div>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-xs text-slate-400">
        {items.length === 0 ? (
          <li>none</li>
        ) : (
          items.map((item, index) => <li key={`${title}-${index}`}>- {item}</li>)
        )}
      </ul>
    </div>
  );
}
