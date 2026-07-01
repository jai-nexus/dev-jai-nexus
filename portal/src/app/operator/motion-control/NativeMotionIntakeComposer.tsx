"use client";

import { useMemo, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
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
  recentRuns,
}: {
  sampleMotions: Motion[];
  roleSlots: RoleSlotOption[];
  modelSlots: ModelSlotOption[];
  providerStatus: ProviderConnectorSafeStatus;
  recentRuns: RecentRunBasis[];
}) {
  const [draft, setDraft] = useState<MotionIntakeDraft>(
    defaultMotionIntakeDraft,
  );
  const [composedMotion, setComposedMotion] = useState<Motion | null>(null);
  const [selectedMotionId, setSelectedMotionId] = useState(
    sampleMotions[1]?.id ?? sampleMotions[0]?.id ?? "",
  );
  const motions = useMemo(
    () => (composedMotion ? [...sampleMotions, composedMotion] : sampleMotions),
    [sampleMotions, composedMotion],
  );
  const selectedMotion =
    motions.find((motion) => motion.id === selectedMotionId) ?? motions[0];
  const selectedBasisType = selectedMotion?.id.startsWith("local-composed-motion-")
    ? "native composed motion"
    : "sample motion";

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

  return (
    <div className="space-y-6">
      <OperatorPanel className="space-y-5 p-4">
        <OperatorSectionHeader
          index="04"
          title="Native motion intake composer"
          right={<OperatorBadge tone="blocked">local-only / non-durable</OperatorBadge>}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            <OperatorGateCard>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="advisory">operator-created motion</OperatorBadge>
                <OperatorBadge tone="blocked">not approved work</OperatorBadge>
                <OperatorBadge tone="blocked">not routed work</OperatorBadge>
                <OperatorBadge tone="readOnly">local state only</OperatorBadge>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Compose a native motion for a CONTROL_THREAD or repo-thread role,
                stage it locally, and use it as the selected basis for manual
                deliberation and copyable draft generation. This implementation
                does not persist composed motions; the draft is non-durable and
                will be lost on refresh unless copied or separately routed later.
              </p>
              <p className="mt-2 text-xs text-red-200">
                A composed motion is not approved work. Motion intake is not
                CONTROL_THREAD acceptance. Thread selection is not route authority.
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
                onClick={() => {
                  setDraft(defaultMotionIntakeDraft);
                  setComposedMotion(null);
                  setSelectedMotionId(sampleMotions[1]?.id ?? sampleMotions[0]?.id ?? "");
                }}
                className="rounded border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200"
              >
                Reset to sample basis
              </button>
            </div>
          </div>

          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">{selectedBasisType}</OperatorBadge>
              <OperatorBadge tone={composedMotion ? "advisory" : "blocked"}>
                {composedMotion ? "composed motion staged" : "sample only"}
              </OperatorBadge>
              <OperatorBadge tone="blocked">no persistence</OperatorBadge>
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
                </div>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-red-200">
              Native motion selection does not auto-run deliberation. Native
              motion selection does not auto-route work. Linear remains a
              temporary mirror only. CONTROL_THREAD remains authority.
            </p>
          </OperatorGateCard>
        </div>

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
