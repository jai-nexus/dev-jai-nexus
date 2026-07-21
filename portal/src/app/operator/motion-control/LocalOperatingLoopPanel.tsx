"use client";

import { useEffect, useRef, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import {
  LOCAL_OPERATING_LOOP_PAGEHIDE_COPY,
  LOCAL_OPERATING_LOOP_PHASE_COPY,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL,
  LOCAL_OPERATING_LOOP_RESTORED_COPY,
  LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY,
  applyLocalOperatingLoopBrowserLifecycle,
  classifyLocalOperatingLoopClientResponse,
  createLocalOperatingLoopRecoveryNotice,
  createLocalOperatingLoopStructuralRemediations,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopUiState,
  recoverLocalOperatingLoopClientFailure,
  recoverLocalOperatingLoopStructuralFailure,
  shouldApplyLocalOperatingLoopResponse,
  type LocalOperatingLoopAction,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopRecoveryNotice,
  type LocalOperatingLoopStructuralRemediation,
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
  const [recoveryNotice, setRecoveryNotice] =
    useState<LocalOperatingLoopRecoveryNotice | null>(null);
  const [structuralRemediations, setStructuralRemediations] = useState<
    LocalOperatingLoopStructuralRemediation[]
  >([]);
  const requestSequence = useRef(0);
  const activeAbortController = useRef<AbortController | null>(null);
  const activeRequestId = useRef<number | null>(null);
  const remediationHeadingRef = useRef<HTMLHeadingElement | null>(null);

  function abortAndReleaseActiveRequest() {
    const controller = activeAbortController.current;
    activeAbortController.current = null;
    activeRequestId.current = null;
    controller?.abort();
  }

  function releaseRequestOwnership(
    controller: AbortController,
    requestId: number,
  ) {
    if (activeAbortController.current === controller) {
      activeAbortController.current = null;
    }
    if (activeRequestId.current === requestId) {
      activeRequestId.current = null;
    }
  }

  function failClosed(code: unknown) {
    abortAndReleaseActiveRequest();
    const notice = createLocalOperatingLoopRecoveryNotice(code);
    setUiState((current) =>
      recoverLocalOperatingLoopClientFailure(current),
    );
    setStructuralRemediations([]);
    setRecoveryNotice(notice);
    setStatusMessage(notice.statusMessage);
  }

  useEffect(() => {
    const resetForBrowserLifecycle = (
      event:
        | { type: "PAGEHIDE" }
        | { type: "PAGESHOW"; persisted: boolean },
      message: string,
    ) => {
      const controller = activeAbortController.current;
      activeAbortController.current = null;
      activeRequestId.current = null;
      controller?.abort();
      setUiState((current) =>
        applyLocalOperatingLoopBrowserLifecycle(current, event),
      );
      setStructuralRemediations([]);
      setRecoveryNotice(null);
      setStatusMessage(message);
    };
    const handlePageHide = () => {
      resetForBrowserLifecycle(
        { type: "PAGEHIDE" },
        LOCAL_OPERATING_LOOP_PAGEHIDE_COPY,
      );
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        return;
      }
      resetForBrowserLifecycle(
        { type: "PAGESHOW", persisted: true },
        LOCAL_OPERATING_LOOP_RESTORED_COPY,
      );
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      const controller = activeAbortController.current;
      activeAbortController.current = null;
      activeRequestId.current = null;
      controller?.abort();
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (structuralRemediations.length > 0) {
      remediationHeadingRef.current?.focus();
    }
  }, [structuralRemediations]);

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
      failClosed("INVALID_PROOF");
      return;
    }

    abortAndReleaseActiveRequest();
    const controller = new AbortController();
    activeAbortController.current = controller;
    const requestId = ++requestSequence.current;
    const requestProjectionKey = projectionKey;
    activeRequestId.current = requestId;
    setRecoveryNotice(null);
    setStructuralRemediations([]);
    setStatusMessage(
      action === "VALIDATE"
        ? LOCAL_OPERATING_LOOP_PHASE_COPY.VALIDATING
        : action === "DELIBERATE"
          ? LOCAL_OPERATING_LOOP_PHASE_COPY.DELIBERATING
          : `Submitting ${requestBody.action.toLowerCase()} request...`,
    );
    setUiState((current) => ({
      ...current,
      activeRequestId: requestId,
    }));

    const responseStillOwned = () =>
      !controller.signal.aborted &&
      shouldApplyLocalOperatingLoopResponse({
        currentProjectionKey: projectionKey,
        responseProjectionKey: requestProjectionKey,
        currentRequestId: activeRequestId.current,
        responseRequestId: requestId,
      });

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
      const value: unknown = JSON.parse(responseText);

      if (!responseStillOwned()) {
        return;
      }
      const classification =
        await classifyLocalOperatingLoopClientResponse(value, {
          request: requestBody,
          requestProjectionKey,
          currentProjectionKey: projectionKey,
        });
      if (!responseStillOwned()) {
        return;
      }

      if (!response.ok && classification.kind === "SUCCESS") {
        failClosed(null);
        return;
      }

      if (classification.kind === "STRUCTURAL_FAILURE") {
        if (!responseStillOwned()) {
          return;
        }
        releaseRequestOwnership(controller, requestId);
        setUiState((current) =>
          recoverLocalOperatingLoopStructuralFailure(current),
        );
        setRecoveryNotice(null);
        setStructuralRemediations(
          createLocalOperatingLoopStructuralRemediations(
            classification.issues,
          ),
        );
        setStatusMessage(LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY);
        return;
      }

      if (classification.kind === "RECOVERY") {
        if (!responseStillOwned()) {
          return;
        }
        failClosed(classification.code);
        return;
      }

      if (!responseStillOwned()) {
        return;
      }
      releaseRequestOwnership(controller, requestId);
      setUiState((current) =>
        applySuccessResponse(current, classification.response),
      );
      setStructuralRemediations([]);
      setRecoveryNotice(null);
      setStatusMessage(
        LOCAL_OPERATING_LOOP_PHASE_COPY[classification.response.state],
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }
      if (!responseStillOwned()) {
        return;
      }
      failClosed(null);
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
                abortAndReleaseActiveRequest();
                setUiState(createLocalOperatingLoopUiState(projectionKey));
                setRecoveryNotice(null);
                setStructuralRemediations([]);
                setStatusMessage(LOCAL_OPERATING_LOOP_PHASE_COPY.DRAFT);
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
          {structuralRemediations.length > 0 ? (
            <div
              aria-labelledby="local-operating-loop-remediation-heading"
              aria-live="assertive"
              role="alert"
            >
              <OperatorGateCard>
                <h3
                  id="local-operating-loop-remediation-heading"
                  ref={remediationHeadingRef}
                  tabIndex={-1}
                  className="text-sm font-semibold text-red-100 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Request structure needs attention
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Structural validation checks request shape only. Correct the
                  listed fields, then validate again.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-red-200">
                  {structuralRemediations.map((remediation) => (
                    <li key={remediation.id}>
                      <span className="font-semibold">
                        {remediation.field}:
                      </span>{" "}
                      {remediation.message}
                    </li>
                  ))}
                </ul>
              </OperatorGateCard>
            </div>
          ) : null}
          {recoveryNotice ? (
            <div
              aria-labelledby="local-operating-loop-recovery-heading"
              aria-live="assertive"
              role="alert"
            >
              <OperatorGateCard>
                <h3
                  id="local-operating-loop-recovery-heading"
                  className="text-sm font-semibold text-red-100"
                >
                  {recoveryNotice.heading}
                </h3>
                <p className="mt-2 text-sm text-red-200">
                  {recoveryNotice.message}
                </p>
                {recoveryNotice.requiresReauthentication ? (
                  <a
                    href={LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF}
                    className="mt-3 inline-flex rounded border border-cyan-500 bg-cyan-950 px-3 py-2 text-sm font-semibold text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL}
                  </a>
                ) : null}
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
