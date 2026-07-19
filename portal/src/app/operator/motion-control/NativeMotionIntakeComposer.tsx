"use client";

import { useMemo, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { LocalOperatingLoopPanel } from "./LocalOperatingLoopPanel";
import { ManualDeliberationAction } from "./ManualDeliberationAction";
import { MotionApprovalDraftSurface } from "./MotionApprovalDraftSurface";
import {
  buildComposedMotionBasis,
  defaultMotionIntakeDraft,
  MOTION_INTAKE_NON_AUTHORIZATIONS,
} from "@/lib/controlPlane/motionKernel/motion-intake";
import type {
  DeliberationRunPersistenceStatus,
  DeliberationRunSourceMode,
  JaiRoleSlotId,
  ModelSlotId,
  Motion,
  MotionIntakeDraft,
  MotionIntakeRecord,
  ProviderConnectorSafeStatus,
} from "@/lib/controlPlane/motionKernel/types";

type RoleSlotOption = {
  id: JaiRoleSlotId;
  displayName: string;
  deliberationResponsibility: string;
};

type ModelSlotOption = {
  id: ModelSlotId;
  displayName: string;
  enabled: boolean;
  inferenceMode: string;
  providerFamily: string;
};

type RecentRunBasis = {
  id: string;
  motionId: string;
  motionTitle: string;
  sourceMode: DeliberationRunSourceMode;
  persistenceStatus: DeliberationRunPersistenceStatus;
  aggregateRatification: string;
  participantCount: number;
  evidencePointerCount: number;
};

export function NativeMotionIntakeComposer({
  sampleMotions,
  roleSlots,
  modelSlots,
  providerStatus,
  persistedMotionRecords,
  persistedMotions,
  recentRuns,
}: {
  sampleMotions: Motion[];
  roleSlots: RoleSlotOption[];
  modelSlots: ModelSlotOption[];
  providerStatus: ProviderConnectorSafeStatus;
  persistedMotionRecords: MotionIntakeRecord[];
  persistedMotions: Motion[];
  recentRuns: RecentRunBasis[];
}) {
  const [draft, setDraft] = useState<MotionIntakeDraft>(
    defaultMotionIntakeDraft,
  );
  const [composedMotion, setComposedMotion] = useState<Motion | null>(null);
  const [savedRecords, setSavedRecords] = useState<MotionIntakeRecord[]>(
    persistedMotionRecords,
  );
  const [savedMotions, setSavedMotions] = useState<Motion[]>(persistedMotions);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedMotionId, setSelectedMotionId] = useState(
    sampleMotions[1]?.id ?? sampleMotions[0]?.id ?? "",
  );
  const motions = useMemo(
    () => [
      ...sampleMotions,
      ...(composedMotion ? [composedMotion] : []),
      ...savedMotions,
    ],
    [sampleMotions, composedMotion, savedMotions],
  );
  const selectedMotion =
    motions.find((motion) => motion.id === selectedMotionId) ?? motions[0];
  const selectedBasisType = getSelectedBasisType(selectedMotion?.id);

  function updateDraft<K extends keyof MotionIntakeDraft>(
    key: K,
    value: MotionIntakeDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function stageComposedMotion() {
    const motion = buildComposedMotionBasis({ draft });
    setComposedMotion(motion);
    setSelectedMotionId(motion.id);
  }

  async function persistMotionDraft() {
    setSaveStatus("Saving motion intake record...");
    try {
      const response = await fetch("/operator/motion-control/motion-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draft }),
      });
      if (!response.ok) {
        throw new Error("Motion intake route returned a non-OK response.");
      }
      const value = (await response.json()) as {
        record: MotionIntakeRecord;
        motionBasis: Motion;
      };
      setSavedRecords((current) => [
        value.record,
        ...current.filter((record) => record.id !== value.record.id),
      ]);
      setSavedMotions((current) => [
        value.motionBasis,
        ...current.filter((motion) => motion.id !== value.motionBasis.id),
      ]);
      setSelectedMotionId(value.motionBasis.id);
      setSaveStatus(value.record.safeAdvisoryMessage);
    } catch {
      setSaveStatus(
        "Motion intake persistence failed safely. No work was routed, approved, executed, or sent to GitHub.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <OperatorPanel className="space-y-5 p-4">
        <OperatorSectionHeader
          index="04"
          title="Native motion intake composer"
          right={<OperatorBadge tone="advisory">durable intake available</OperatorBadge>}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            <OperatorGateCard>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="advisory">operator-created motion</OperatorBadge>
                <OperatorBadge tone="blocked">not approved work</OperatorBadge>
                <OperatorBadge tone="blocked">not routed work</OperatorBadge>
                <OperatorBadge tone="readOnly">explicit save only</OperatorBadge>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Compose a native motion for a CONTROL_THREAD or repo-thread role,
                stage it locally or persist it as a durable non-authoritative
                intake record, and use it as the selected basis for manual
                deliberation and copyable draft generation. Persistence records
                operator-created intake only; it does not approve, route, accept,
                execute, or transfer source of truth.
              </p>
              <p className="mt-2 text-xs text-red-200">
                A composed motion is not approved work. Motion intake is not
                CONTROL_THREAD acceptance. Thread selection is not route authority.
                Persisted motion is not routed work.
              </p>
            </OperatorGateCard>

            <div className="grid gap-3 lg:grid-cols-2">
              <TextInput
                label="title"
                value={draft.title}
                onChange={(value) => updateDraft("title", value)}
              />
              <TextInput
                label="proposer"
                value={draft.proposer}
                onChange={(value) => updateDraft("proposer", value)}
              />
              <label className="block rounded border border-slate-800 bg-slate-950 p-3">
                <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
                  target thread
                </span>
                <select
                  value={draft.targetThread}
                  onChange={(event) =>
                    updateDraft("targetThread", event.target.value as JaiRoleSlotId)
                  }
                  className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                >
                  {roleSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.id}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Thread selection is not route authority.
                </p>
              </label>
              <TextInput
                label="repo target"
                value={draft.repoTarget}
                onChange={(value) => updateDraft("repoTarget", value)}
                help="Repo-thread target is intended review context only."
              />
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <TextArea
                label="purpose"
                value={draft.purpose}
                onChange={(value) => updateDraft("purpose", value)}
              />
              <TextArea
                label="scope"
                value={draft.scope}
                onChange={(value) => updateDraft("scope", value)}
              />
              <TextArea
                label="requested outcome"
                value={draft.requestedOutcome}
                onChange={(value) => updateDraft("requestedOutcome", value)}
              />
              <TextArea
                label="risks"
                value={draft.risks}
                onChange={(value) => updateDraft("risks", value)}
              />
              <TextArea
                label="constraints"
                value={draft.constraints}
                onChange={(value) => updateDraft("constraints", value)}
              />
              <TextArea
                label="evidence pointers"
                value={draft.evidencePointers}
                onChange={(value) => updateDraft("evidencePointers", value)}
                help="One metadata/reference pointer per line. Evidence pointer is not validation approval."
              />
            </div>

            <TextArea
              label="non-authorizations"
              value={draft.nonAuthorizations}
              onChange={(value) => updateDraft("nonAuthorizations", value)}
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={stageComposedMotion}
                className="rounded border border-cyan-500 bg-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-100"
              >
                Stage composed motion locally
              </button>
              <button
                type="button"
                onClick={persistMotionDraft}
                className="rounded border border-emerald-500 bg-emerald-950 px-4 py-2 text-sm font-semibold text-emerald-100"
              >
                Persist motion intake draft
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(defaultMotionIntakeDraft);
                  setComposedMotion(null);
                  setSaveStatus(null);
                  setSelectedMotionId(sampleMotions[1]?.id ?? sampleMotions[0]?.id ?? "");
                }}
                className="rounded border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200"
              >
                Reset to sample basis
              </button>
            </div>

            {saveStatus ? (
              <OperatorGateCard>
                <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                  persistence status
                </div>
                <p className="mt-2 text-sm text-slate-300">{saveStatus}</p>
                <p className="mt-2 text-xs text-red-200">
                  Persisted motion selection does not auto-run deliberation.
                  Persisted motion selection does not auto-route work.
                </p>
              </OperatorGateCard>
            ) : null}
          </div>

          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">{selectedBasisType}</OperatorBadge>
              <OperatorBadge tone={composedMotion ? "advisory" : "blocked"}>
                {composedMotion ? "composed motion staged" : "sample only"}
              </OperatorBadge>
              <OperatorBadge tone={savedRecords.length > 0 ? "advisory" : "blocked"}>
                {savedRecords.length} persisted intake records
              </OperatorBadge>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                  selected basis
                </div>
                <select
                  value={selectedMotionId}
                  onChange={(event) => setSelectedMotionId(event.target.value)}
                  className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                >
                  {sampleMotions.map((motion) => (
                    <option key={motion.id} value={motion.id}>
                      Sample: {motion.title}
                    </option>
                  ))}
                  {composedMotion ? (
                    <option value={composedMotion.id}>
                      Native composed: {composedMotion.title}
                    </option>
                  ) : null}
                  {savedMotions.map((motion) => (
                    <option key={motion.id} value={motion.id}>
                      Persisted: {motion.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMotion ? (
                <div className="space-y-2">
                  <OperatorIdChip>{selectedMotion.id}</OperatorIdChip>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {selectedMotion.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Target thread: {selectedMotion.roleSlotIds.join(", ")}
                  </p>
                  <p className="text-xs text-slate-400">
                    Repo target: {selectedMotion.repoThread.repo}
                  </p>
                  <p className="text-xs text-slate-400">
                    Evidence pointers: {selectedMotion.evidencePointers.length}
                  </p>
                  <p className="text-xs text-slate-400">
                    Selected source: {selectedBasisType}
                  </p>
                </div>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-red-200">
              Native motion selection does not auto-run deliberation. Native
              motion selection does not auto-route work. Persisted target thread
              is not route authority. Persisted repo target is not repo execution
              authority. Linear remains a temporary mirror only. CONTROL_THREAD
              remains authority.
            </p>
          </OperatorGateCard>
        </div>

        <OperatorGateCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                persisted motion intake records
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Persisted records are durable intake context only. Selected
                persisted motion basis is not final authority.
              </p>
            </div>
            <OperatorBadge tone={savedRecords.length > 0 ? "advisory" : "blocked"}>
              {savedRecords.length > 0 ? "records available" : "no records"}
            </OperatorBadge>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {savedRecords.length > 0 ? (
              savedRecords.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelectedMotionId(record.id)}
                  className="rounded border border-slate-800 bg-slate-950 p-3 text-left text-sm text-slate-200 hover:border-cyan-700"
                >
                  <div className="flex flex-wrap gap-2">
                    <OperatorBadge tone="readOnly">{record.intakeState}</OperatorBadge>
                    <OperatorBadge tone="blocked">{record.authorityState}</OperatorBadge>
                  </div>
                  <div className="mt-2 font-semibold text-slate-100">
                    {record.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {record.targetThread}
                    {record.repoTarget ? ` / ${record.repoTarget}` : ""}
                  </div>
                  <div className="mt-2 text-xs text-red-200">
                    Persisted motion is not approved work. Persisted motion is
                    not CONTROL_THREAD acceptance.
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">
                No durable motion intake records are currently available. Use
                the explicit persist action to create one; it will not auto-run
                deliberation or route work.
              </div>
            )}
          </div>
        </OperatorGateCard>

        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
            motion intake non-authorizations
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {MOTION_INTAKE_NON_AUTHORIZATIONS.map((note) => (
              <div
                key={note}
                className="rounded border border-red-900/70 bg-red-950/20 px-2 py-1 text-xs text-red-200"
              >
                {note}
              </div>
            ))}
          </div>
        </OperatorGateCard>
      </OperatorPanel>

      <LocalOperatingLoopPanel selectedMotion={selectedMotion} />

      <ManualDeliberationAction
        motions={motions}
        roleSlots={roleSlots}
        modelSlots={modelSlots}
        providerStatus={providerStatus}
        selectedMotionId={selectedMotionId}
        onSelectedMotionIdChange={setSelectedMotionId}
      />

      <MotionApprovalDraftSurface
        motions={motions}
        recentRuns={recentRuns}
        selectedMotionId={selectedMotionId}
        onSelectedMotionIdChange={setSelectedMotionId}
      />
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
}) {
  return (
    <label className="block rounded border border-slate-800 bg-slate-950 p-3">
      <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
      />
      {help ? <span className="mt-2 block text-xs text-slate-500">{help}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
}) {
  return (
    <label className="block rounded border border-slate-800 bg-slate-950 p-3">
      <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
      />
      {help ? <span className="mt-2 block text-xs text-slate-500">{help}</span> : null}
    </label>
  );
}

function getSelectedBasisType(motionId: string | undefined) {
  if (!motionId) {
    return "none";
  }
  if (
    motionId.startsWith("persisted-motion-intake-") ||
    motionId === "motion-intake-persistence-blocked-preview"
  ) {
    return "persisted";
  }
  if (motionId.startsWith("local-composed-motion-")) {
    return "local_composed";
  }
  return "sample";
}
