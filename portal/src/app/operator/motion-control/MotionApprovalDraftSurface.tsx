"use client";

import { useMemo, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import {
  buildMotionApprovalDraftPacket,
  MOTION_APPROVAL_DRAFT_NON_AUTHORIZATIONS,
} from "@/lib/controlPlane/motionKernel/motion-approval-drafts";
import type {
  DeliberationRunPersistenceStatus,
  DeliberationRunSourceMode,
  Motion,
  MotionApprovalDraftDecisionValue,
} from "@/lib/controlPlane/motionKernel/types";

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

const decisionOptions: Array<{
  value: MotionApprovalDraftDecisionValue;
  label: string;
  description: string;
}> = [
  {
    value: "approve_for_draft",
    label: "Approve for draft",
    description:
      "Allows local copyable draft text for manual CONTROL_THREAD review only.",
  },
  {
    value: "request_revision",
    label: "Request revision",
    description:
      "Marks the motion as needing revision before draft use unless explicitly previewed.",
  },
  {
    value: "reject",
    label: "Reject",
    description:
      "Blocks draft generation unless the operator explicitly previews blocked text.",
  },
  {
    value: "hold",
    label: "Hold",
    description:
      "Keeps the motion paused without route, acceptance, or execution authority.",
  },
];

export function MotionApprovalDraftSurface({
  motions,
  recentRuns,
  selectedMotionId,
  onSelectedMotionIdChange,
}: {
  motions: Motion[];
  recentRuns: RecentRunBasis[];
  selectedMotionId?: string;
  onSelectedMotionIdChange?: (motionId: string) => void;
}) {
  const [localSelectedMotionId, setLocalSelectedMotionId] = useState(
    motions[1]?.id ?? motions[0]?.id ?? "",
  );
  const [decision, setDecision] =
    useState<MotionApprovalDraftDecisionValue>("hold");
  const [explicitOperatorSelection, setExplicitOperatorSelection] =
    useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const activeSelectedMotionId = selectedMotionId ?? localSelectedMotionId;

  const selectedMotion =
    motions.find((motion) => motion.id === activeSelectedMotionId) ?? motions[0];
  const recentBasis = useMemo(
    () =>
      recentRuns.find((run) => run.motionId === selectedMotion?.id) ??
      recentRuns[0],
    [recentRuns, selectedMotion?.id],
  );
  const deliberationBasisSummary = recentBasis
    ? `${recentBasis.id}; ${recentBasis.sourceMode}; ${recentBasis.persistenceStatus}; aggregate ${recentBasis.aggregateRatification}; participants ${recentBasis.participantCount}; evidence pointers ${recentBasis.evidencePointerCount}`
    : `${selectedMotion?.id ?? "no-motion"}; sample motion context; no persisted deliberation selected`;
  const packet = selectedMotion
    ? buildMotionApprovalDraftPacket({
        motion: selectedMotion,
        decision,
        explicitOperatorSelection,
        deliberationBasisSummary,
      })
    : null;

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(label);
    } catch {
      setCopiedSection("copy unavailable");
    }
  }

  if (!selectedMotion || !packet) {
    return (
      <OperatorPanel className="p-4">
        <OperatorSectionHeader
          index="05"
          title="Motion approval draft surface"
          right={<OperatorBadge tone="blocked">no motion selected</OperatorBadge>}
        />
      </OperatorPanel>
    );
  }

  return (
    <OperatorPanel className="space-y-5 p-4">
      <OperatorSectionHeader
        index="05"
        title="Motion approval draft surface"
        right={<OperatorBadge tone="blocked">copyable planning text only</OperatorBadge>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="advisory">local approval marker</OperatorBadge>
              <OperatorBadge tone="blocked">not final authority</OperatorBadge>
              <OperatorBadge tone="blocked">non-executing drafts</OperatorBadge>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              This surface lets an operator mark a local approval decision and
              generate copyable downstream draft text for manual CONTROL_THREAD
              use. It does not persist the decision, route work, execute work
              packets, mutate GitHub, or open production gates.
            </p>
            <p className="mt-2 text-xs text-red-200">
              CONTROL_THREAD remains authority. Linear remains a temporary mirror
              only. ZERO GATES GRANTED.
            </p>
          </OperatorGateCard>

          <div className="grid gap-3 lg:grid-cols-2">
            <label className="block rounded border border-slate-800 bg-slate-950 p-3">
              <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
                selected motion
              </span>
              <select
                value={activeSelectedMotionId}
                onChange={(event) => {
                  if (onSelectedMotionIdChange) {
                    onSelectedMotionIdChange(event.target.value);
                  } else {
                    setLocalSelectedMotionId(event.target.value);
                  }
                }}
                className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              >
                {motions.map((motion) => (
                  <option key={motion.id} value={motion.id}>
                    {motion.title}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Basis: {deliberationBasisSummary}
              </p>
            </label>

            <OperatorGateCard>
              <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                advisory ratification
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <OperatorBadge tone="readOnly">
                  {selectedMotion.ratificationRecommendation.value}
                </OperatorBadge>
                <OperatorBadge tone="blocked">JAI ratification is not final authority</OperatorBadge>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {selectedMotion.ratificationRecommendation.summary}
              </p>
            </OperatorGateCard>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
              human approval decision state
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {decisionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDecision(option.value)}
                  className={`rounded border p-3 text-left ${
                    decision === option.value
                      ? "border-cyan-500 bg-cyan-950 text-cyan-100"
                      : "border-slate-800 bg-slate-950 text-slate-300"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="mt-2 block text-xs text-slate-400">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
            <label className="mt-4 flex gap-3 rounded border border-slate-800 bg-slate-950 p-3">
              <input
                type="checkbox"
                checked={explicitOperatorSelection}
                onChange={(event) =>
                  setExplicitOperatorSelection(event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900"
              />
              <span>
                <span className="block text-sm text-slate-200">
                  Explicit operator selection for blocked draft preview
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Generates copyable draft text even for hold, revision, or reject
                  states. This is still not route authority or execution authority.
                </span>
              </span>
            </label>
          </OperatorGateCard>
        </div>

        <OperatorGateCard>
          <div className="flex flex-wrap gap-2">
            <OperatorIdChip>{packet.motionId}</OperatorIdChip>
            <OperatorBadge tone={packet.canGenerateDrafts ? "advisory" : "blocked"}>
              {packet.canGenerateDrafts ? "draft preview enabled" : "draft preview blocked"}
            </OperatorBadge>
            <OperatorBadge tone="readOnly">{packet.decision}</OperatorBadge>
          </div>
          <div className="mt-4 grid gap-2">
            {[
              ["program draft", "included"],
              ["batch draft", "included"],
              ["wave draft", "included"],
              ["lane draft", "included"],
              ["work packet draft", "included"],
              ["route packet draft", "included"],
              ["closeout placeholder", "included"],
              ["evidence pointer summary", "included"],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-slate-800 p-2">
                <div className="font-mono text-xs uppercase text-slate-500">
                  {label}
                </div>
                <div className="mt-1 text-xs text-slate-100">{value}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-red-200">
            Draft output is copyable planning text only. Draft output is
            non-executing and does not create route, acceptance, execution,
            GitHub mutation, production gate, or source-of-truth authority.
          </p>
        </OperatorGateCard>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <DraftTextBlock
          title="Full downstream draft packet"
          text={packet.fullDraftPacketText}
          onCopy={() => copyText("full draft packet", packet.fullDraftPacketText)}
        />
        <div className="space-y-3">
          <DraftTextBlock
            title="Program / batch / wave / lane"
            text={[
              packet.programDraftText,
              packet.batchDraftText,
              packet.waveDraftText,
              packet.laneDraftText,
            ].join("\n\n")}
            onCopy={() =>
              copyText(
                "program batch wave lane",
                [
                  packet.programDraftText,
                  packet.batchDraftText,
                  packet.waveDraftText,
                  packet.laneDraftText,
                ].join("\n\n"),
              )
            }
          />
          <DraftTextBlock
            title="Work packet / route / closeout / evidence"
            text={[
              packet.workPacketDraftText,
              packet.routePacketDraftText,
              packet.closeoutPlaceholderText,
              packet.evidencePointerSummaryText,
            ].join("\n\n")}
            onCopy={() =>
              copyText(
                "work packet route closeout evidence",
                [
                  packet.workPacketDraftText,
                  packet.routePacketDraftText,
                  packet.closeoutPlaceholderText,
                  packet.evidencePointerSummaryText,
                ].join("\n\n"),
              )
            }
          />
        </div>
      </div>

      {copiedSection ? (
        <OperatorGateCard>
          <OperatorBadge tone="readOnly">copy status</OperatorBadge>
          <p className="mt-3 text-sm text-slate-300">{copiedSection}</p>
        </OperatorGateCard>
      ) : null}

      <OperatorGateCard>
        <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
          draft non-authorizations
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {MOTION_APPROVAL_DRAFT_NON_AUTHORIZATIONS.map((note) => (
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
  );
}

function DraftTextBlock({
  title,
  text,
  onCopy,
}: {
  title: string;
  text: string;
  onCopy: () => void;
}) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
          {title}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
        >
          Copy
        </button>
      </div>
      <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950 p-3 text-xs leading-6 text-slate-200">
        {text}
      </pre>
    </OperatorGateCard>
  );
}
