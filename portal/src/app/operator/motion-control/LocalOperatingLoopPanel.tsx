"use client";

import { useEffect, useRef, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import {
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopUiState,
  shouldApplyLocalOperatingLoopResponse,
  type LocalOperatingLoopAction,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopResponse,
  type LocalOperatingLoopSuccessResponse,
  type LocalOperatingLoopUiState,
} from "@/lib/controlPlane/motionKernel/local-operating-loop";
import type { Motion } from "@/lib/controlPlane/motionKernel/types";

const progression = [
  "DRAFT",
  "VALIDATED",
  "AWAITING_DECISION",
  "ACCEPTED | HELD | REJECTED",
] as const;

export function LocalOperatingLoopPanel({
  selectedMotion,
}: {
  selectedMotion: Motion | undefined;
}) {
  const projectedInput = projectLocalOperatingLoopInput(selectedMotion);
  const projectionKey = projectedInput
    ? createLocalOperatingLoopProjectionKey(projectedInput)
    : "no-selected-motion";

  return (
    <LocalOperatingLoopProjectionPanel
      key={projectionKey}
      projectedInput={projectedInput}
      projectionKey={projectionKey}
    />
  );
}

function LocalOperatingLoopProjectionPanel({
  projectedInput,
  projectionKey,
}: {
  projectedInput: LocalOperatingLoopInput | null;
  projectionKey: string;
}) {
  const [uiState, setUiState] = useState<LocalOperatingLoopUiState>(() =>
    createLocalOperatingLoopUiState(projectionKey),
  );
  const [statusMessage, setStatusMessage] = useState(
    "Select a motion, then validate the local-shadow input.",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const activeAbortController = useRef<AbortController | null>(null);
  const activeRequestId = useRef<number | null>(null);

  useEffect(() => {
    return () => activeAbortController.current?.abort();
  }, []);

  async function submitAction(
    action:
      | "VALIDATE"
      | "DELIBERATE"
      | "ACCEPT"
      | "HOLD"
      | "REJECT",
  ) {
    if (!projectedInput) {
      return;
    }

    const requestBody = buildRequestBody(action, projectedInput, uiState);
    if (!requestBody) {
      setErrorMessage("The required prior proof is not available.");
      return;
    }

    activeAbortController.current?.abort();
    const controller = new AbortController();
    activeAbortController.current = controller;
    const requestId = ++requestSequence.current;
    const requestProjectionKey = projectionKey;
    activeRequestId.current = requestId;
    setErrorMessage(null);
    setStatusMessage(`Submitting ${requestBody.action.toLowerCase()} request...`);
    setUiState((current) => ({
      ...current,
      activeRequestId: requestId,
    }));

    try {
      const response = await fetch(
        "/api/operator/motion-control/local-operating-loop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          cache: "no-store",
          signal: controller.signal,
        },
      );
      const responseText = await response.text();
      const value = JSON.parse(responseText) as LocalOperatingLoopResponse;

      if (
        controller.signal.aborted ||
        !shouldApplyLocalOperatingLoopResponse({
          currentProjectionKey: projectionKey,
          responseProjectionKey: requestProjectionKey,
          currentRequestId: activeRequestId.current,
          responseRequestId: requestId,
        })
      ) {
        return;
      }
      activeRequestId.current = null;
      setUiState((current) =>
        value.ok
          ? applySuccessResponse(current, value)
          : { ...current, activeRequestId: null },
      );
      if (!response.ok || !value.ok) {
        setErrorMessage(
          value.ok
            ? "The local operating-loop request failed safely."
            : value.error.message,
        );
        setStatusMessage("No downstream local-shadow output was produced.");
        return;
      }
      setStatusMessage(
        value.state === "ACCEPTED"
          ? "Accepted locally for proposed Work Packet generation only."
          : `Local-shadow state advanced to ${value.state}.`,
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }
      if (
        controller.signal.aborted ||
        !shouldApplyLocalOperatingLoopResponse({
          currentProjectionKey: projectionKey,
          responseProjectionKey: requestProjectionKey,
          currentRequestId: activeRequestId.current,
          responseRequestId: requestId,
        })
      ) {
        return;
      }
      activeRequestId.current = null;
      setUiState((current) => ({ ...current, activeRequestId: null }));
      setErrorMessage(
        "The request failed safely. No packet, persistence, routing, or execution occurred.",
      );
      setStatusMessage("Local-shadow state did not advance.");
    }
  }

  const pending = uiState.activeRequestId !== null;

  return (
    <OperatorPanel className="space-y-5 p-4">
      <OperatorSectionHeader
        index="D2"
        title="Founder local operating-loop proving seam"
        right={
          <OperatorBadge tone="blocked">
            local shadow / no execution authority
          </OperatorBadge>
        }
      />

      <OperatorGateCard>
        <div className="grid gap-2 md:grid-cols-4">
          {progression.map((stage) => (
            <div
              key={stage}
              className="rounded border border-slate-800 bg-slate-950 p-2"
            >
              <div className="font-mono text-xs text-slate-400">{stage}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <OperatorBadge tone="advisory">{uiState.state}</OperatorBadge>
          <OperatorBadge tone="blocked">ADMIN decision only</OperatorBadge>
          <OperatorBadge tone="readOnly">deterministic local advisory</OperatorBadge>
        </div>
      </OperatorGateCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-4">
          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
              canonical safe motion projection
            </div>
            {projectedInput ? (
              <dl className="mt-3 grid gap-3 md:grid-cols-2">
                <ProjectionField label="motion" value={projectedInput.motionId} />
                <ProjectionField label="repo" value={projectedInput.targetRepo} />
                <ProjectionField label="title" value={projectedInput.title} />
                <ProjectionField
                  label="target threads"
                  value={projectedInput.targetThreads.join(", ")}
                />
                <ProjectionField
                  label="evidence pointers"
                  value={String(projectedInput.evidencePointers.length)}
                />
                <ProjectionField
                  label="projection key"
                  value={projectionKey}
                  compact
                />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                No selected motion is available.
              </p>
            )}
          </OperatorGateCard>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitAction("VALIDATE")}
              disabled={!projectedInput || pending || uiState.state !== "DRAFT"}
              className="rounded border border-cyan-500 bg-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
            >
              Validate input
            </button>
            <button
              type="button"
              onClick={() => submitAction("DELIBERATE")}
              disabled={pending || uiState.state !== "VALIDATED"}
              className="rounded border border-cyan-500 bg-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
            >
              Run local deliberation
            </button>
            <button
              type="button"
              onClick={() => {
                activeAbortController.current?.abort();
                activeRequestId.current = null;
                setUiState(createLocalOperatingLoopUiState(projectionKey));
                setErrorMessage(null);
                setStatusMessage("Local-shadow state reset to DRAFT.");
              }}
              disabled={pending}
              className="rounded border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:text-slate-600"
            >
              Reset local shadow
            </button>
          </div>

          {uiState.state === "AWAITING_DECISION" ? (
            <OperatorGateCard>
              <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                explicit ADMIN decision
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => submitAction("ACCEPT")}
                  disabled={pending || uiState.recommendation !== "GO"}
                  className="rounded border border-emerald-500 bg-emerald-950 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  Accept for packet proposal
                </button>
                <button
                  type="button"
                  onClick={() => submitAction("HOLD")}
                  disabled={pending}
                  className="rounded border border-amber-500 bg-amber-950 px-4 py-2 text-sm font-semibold text-amber-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  Hold
                </button>
                <button
                  type="button"
                  onClick={() => submitAction("REJECT")}
                  disabled={pending}
                  className="rounded border border-red-700 bg-red-950 px-4 py-2 text-sm font-semibold text-red-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  Reject
                </button>
              </div>
            </OperatorGateCard>
          ) : null}

          <div aria-live="polite" role="status">
            <OperatorGateCard>
              <p className="text-sm text-slate-300">{statusMessage}</p>
            </OperatorGateCard>
          </div>
          {errorMessage ? (
            <div aria-live="assertive" role="alert">
              <OperatorGateCard>
                <p className="text-sm text-red-200">{errorMessage}</p>
              </OperatorGateCard>
            </div>
          ) : null}
        </div>

        <OperatorGateCard>
          <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
            server-derived recommendation
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <OperatorBadge
              tone={uiState.recommendation === "GO" ? "advisory" : "blocked"}
            >
              {uiState.recommendation ?? "not deliberated"}
            </OperatorBadge>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            {uiState.findingCodes.length === 0 ? (
              <li>no findings</li>
            ) : (
              uiState.findingCodes.map((finding) => (
                <li key={finding}>- {finding}</li>
              ))
            )}
          </ul>
          <p className="mt-3 text-xs text-red-200">
            Recommendation and proof are recomputed server-side. This panel does
            not persist, route, execute, or call a provider.
          </p>
        </OperatorGateCard>
      </div>

      {uiState.workPacket ? (
        <JsonOutput
          title="one proposed Work Packet"
          value={uiState.workPacket}
        />
      ) : null}
      {uiState.artifact ? (
        <JsonOutput
          title="ephemeral local-shadow decision artifact"
          value={uiState.artifact}
        />
      ) : null}
    </OperatorPanel>
  );
}

export function projectLocalOperatingLoopInput(
  motion: Motion | undefined,
): LocalOperatingLoopInput | null {
  if (!motion) {
    return null;
  }
  return {
    motionId: motion.id,
    title: motion.title,
    summary: motion.summary,
    targetRepo: motion.repoThread.repo,
    targetThreads: [...motion.roleSlotIds],
    evidencePointers: motion.evidencePointers.map((pointer) => pointer.ref),
  };
}

function buildRequestBody(
  action: "VALIDATE" | "DELIBERATE" | "ACCEPT" | "HOLD" | "REJECT",
  input: LocalOperatingLoopInput,
  state: LocalOperatingLoopUiState,
): LocalOperatingLoopAction | null {
  if (action === "VALIDATE") {
    return { action, input };
  }
  if (action === "DELIBERATE") {
    return state.validationProof
      ? {
          action,
          input,
          validationProof: state.validationProof,
        }
      : null;
  }
  return state.deliberationProof
    ? {
        action: "DECIDE",
        input,
        decision: action,
        deliberationProof: state.deliberationProof,
      }
    : null;
}

function applySuccessResponse(
  state: LocalOperatingLoopUiState,
  response: LocalOperatingLoopSuccessResponse,
): LocalOperatingLoopUiState {
  if (response.state === "VALIDATED") {
    return {
      ...state,
      state: response.state,
      validationProof: response.validationProof,
      deliberationProof: null,
      recommendation: null,
      findingCodes: [],
      workPacket: null,
      artifact: null,
      activeRequestId: null,
    };
  }
  if (response.state === "AWAITING_DECISION") {
    return {
      ...state,
      state: response.state,
      deliberationProof: response.deliberationProof,
      recommendation: response.recommendation,
      findingCodes: response.findingCodes,
      workPacket: null,
      artifact: null,
      activeRequestId: null,
    };
  }
  return {
    ...state,
    state: response.state,
    recommendation: response.recommendation,
    findingCodes: response.findingCodes,
    workPacket: response.workPacket,
    artifact: response.artifact,
    activeRequestId: null,
  };
}

function ProjectionField({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase text-slate-500">{label}</dt>
      <dd
        className={`mt-1 text-xs text-slate-200 ${
          compact ? "max-h-16 overflow-auto break-all font-mono" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function JsonOutput({ title, value }: { title: string; value: unknown }) {
  return (
    <OperatorGateCard>
      <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950 p-3 text-xs leading-6 text-slate-200">
        {JSON.stringify(value, null, 2)}
      </pre>
    </OperatorGateCard>
  );
}
