"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import {
  LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_COPY_STATUS_COPY,
  LOCAL_OPERATING_LOOP_PAGEHIDE_COPY,
  LOCAL_OPERATING_LOOP_PHASE_COPY,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL,
  LOCAL_OPERATING_LOOP_RESTORED_COPY,
  LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY,
  LOCAL_OPERATING_LOOP_TERMINAL_PRESENTATION_UNAVAILABLE_COPY,
  applyLocalOperatingLoopBrowserLifecycle,
  beginLocalOperatingLoopDecisionConfirmation,
  cancelLocalOperatingLoopDecisionConfirmation,
  classifyLocalOperatingLoopClientResponse,
  claimLocalOperatingLoopBoundaryReceiptCopyAttempt,
  claimLocalOperatingLoopDecisionConfirmation,
  clearLocalOperatingLoopBoundaryReceiptCopyState,
  clearLocalOperatingLoopDecisionConfirmation,
  createFounderSafeLocalOperatingLoopTerminalPresentation,
  createLocalOperatingLoopBoundaryReceipt,
  createLocalOperatingLoopBoundaryReceiptCopyState,
  createLocalOperatingLoopDecisionConfirmationPresentation,
  createLocalOperatingLoopProofStatus,
  createLocalOperatingLoopRecommendationExplanation,
  createLocalOperatingLoopRecoveryNotice,
  createLocalOperatingLoopStructuralRemediations,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopUiState,
  recoverLocalOperatingLoopClientFailure,
  recoverLocalOperatingLoopStructuralFailure,
  isLocalOperatingLoopDecisionConfirmationCurrent,
  serializeLocalOperatingLoopBoundaryReceipt,
  settleLocalOperatingLoopBoundaryReceiptCopyAttempt,
  shouldApplyLocalOperatingLoopResponse,
  type LocalOperatingLoopAction,
  type LocalOperatingLoopBoundaryReceipt,
  type LocalOperatingLoopBoundaryReceiptCopyState,
  type LocalOperatingLoopDecision,
  type LocalOperatingLoopDecisionConfirmationContext,
  type LocalOperatingLoopDecisionConfirmationState,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopRecoveryNotice,
  type LocalOperatingLoopStructuralRemediation,
  type LocalOperatingLoopSuccessResponse,
  type LocalOperatingLoopTerminalPresentation,
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
  const [decisionConfirmation, setDecisionConfirmation] =
    useState<LocalOperatingLoopDecisionConfirmationState>(() =>
      clearLocalOperatingLoopDecisionConfirmation(),
    );
  const requestSequence = useRef(0);
  const activeAbortController = useRef<AbortController | null>(null);
  const activeRequestId = useRef<number | null>(null);
  const remediationHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const decisionConfirmationRef =
    useRef<LocalOperatingLoopDecisionConfirmationState>(
      clearLocalOperatingLoopDecisionConfirmation(),
    );
  const confirmationHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const confirmationOriginDecisionRef =
    useRef<LocalOperatingLoopDecision | null>(null);
  const reviewButtonRefs = useRef<
    Record<LocalOperatingLoopDecision, HTMLButtonElement | null>
  >({ ACCEPT: null, HOLD: null, REJECT: null });

  const writeDecisionConfirmation = useCallback(
    (next: LocalOperatingLoopDecisionConfirmationState) => {
      decisionConfirmationRef.current = next;
      setDecisionConfirmation(next);
    },
    [],
  );

  const clearDecisionConfirmation = useCallback(() => {
    decisionConfirmationRef.current =
      clearLocalOperatingLoopDecisionConfirmation();
    confirmationOriginDecisionRef.current = null;
    setDecisionConfirmation(decisionConfirmationRef.current);
  }, []);

  const cancelDecisionConfirmationAndRestoreFocus = useCallback(() => {
    const current = decisionConfirmationRef.current;
    const next = cancelLocalOperatingLoopDecisionConfirmation(current);
    if (next === current) {
      return;
    }
    const originDecision = confirmationOriginDecisionRef.current;
    confirmationOriginDecisionRef.current = null;
    decisionConfirmationRef.current = next;
    setDecisionConfirmation(next);
    if (originDecision) {
      window.requestAnimationFrame(() => {
        reviewButtonRefs.current[originDecision]?.focus();
      });
    }
  }, []);

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
    clearDecisionConfirmation();
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
      clearDecisionConfirmation();
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
      decisionConfirmationRef.current =
        clearLocalOperatingLoopDecisionConfirmation();
      confirmationOriginDecisionRef.current = null;
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [clearDecisionConfirmation]);

  useEffect(() => {
    if (decisionConfirmation.phase !== "REVIEWING") {
      return;
    }
    confirmationHeadingRef.current?.focus();
  }, [decisionConfirmation.phase]);

  useEffect(() => {
    if (decisionConfirmation.phase !== "REVIEWING") {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelDecisionConfirmationAndRestoreFocus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [
    cancelDecisionConfirmationAndRestoreFocus,
    decisionConfirmation.phase,
  ]);

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
        clearDecisionConfirmation();
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
      if (
        classification.response.state === "ACCEPTED" ||
        classification.response.state === "HELD" ||
        classification.response.state === "REJECTED"
      ) {
        clearDecisionConfirmation();
      }
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
  const requiresFreshValidation =
    structuralRemediations.length > 0 ||
    recoveryNotice !== null ||
    statusMessage === LOCAL_OPERATING_LOOP_PAGEHIDE_COPY ||
    statusMessage === LOCAL_OPERATING_LOOP_RESTORED_COPY;
  const proofStatus = createLocalOperatingLoopProofStatus({
    state: uiState,
    currentProjectionKey: projectionKey,
    requiresFreshValidation,
  });
  const recommendationExplanation = projectedInput
    ? createLocalOperatingLoopRecommendationExplanation({
        motion: projectedInput,
        recommendation:
          proofStatus.code === "DELIBERATION_CURRENT" ||
          proofStatus.code === "DECISION_CURRENT"
            ? uiState.recommendation
            : null,
        findingCodes: uiState.findingCodes,
      })
    : null;
  const hasTerminalState =
    uiState.state === "ACCEPTED" ||
    uiState.state === "HELD" ||
    uiState.state === "REJECTED";
  const terminalPresentation =
    createFounderSafeLocalOperatingLoopTerminalPresentation(uiState);
  const boundaryReceipt = terminalPresentation
    ? createLocalOperatingLoopBoundaryReceipt(terminalPresentation)
    : null;
  const boundaryReceiptText = terminalPresentation
    ? serializeLocalOperatingLoopBoundaryReceipt(terminalPresentation)
    : null;
  const confirmationContext =
    useMemo<LocalOperatingLoopDecisionConfirmationContext | null>(
      () =>
        projectedInput
          ? {
              motion: projectedInput,
              state: uiState,
              currentProjectionKey: projectionKey,
              requiresFreshValidation,
            }
          : null,
      [projectedInput, projectionKey, requiresFreshValidation, uiState],
    );
  const confirmationPresentation = confirmationContext
    ? createLocalOperatingLoopDecisionConfirmationPresentation({
        confirmation: decisionConfirmation,
        context: confirmationContext,
      })
    : null;

  useEffect(() => {
    if (decisionConfirmationRef.current.phase === "IDLE") {
      return;
    }
    if (
      !confirmationContext ||
      !isLocalOperatingLoopDecisionConfirmationCurrent({
        confirmation: decisionConfirmationRef.current,
        context: confirmationContext,
      })
    ) {
      clearDecisionConfirmation();
    }
  }, [confirmationContext, clearDecisionConfirmation]);

  function beginDecisionReview(decision: LocalOperatingLoopDecision) {
    if (decisionConfirmationRef.current.phase !== "IDLE") {
      return;
    }
    if (!confirmationContext) {
      failClosed(null);
      return;
    }
    const next = beginLocalOperatingLoopDecisionConfirmation({
      confirmation: decisionConfirmationRef.current,
      context: confirmationContext,
      decision,
    });
    if (!next) {
      failClosed(null);
      return;
    }
    confirmationOriginDecisionRef.current = decision;
    writeDecisionConfirmation(next);
  }

  function confirmReviewedDecision() {
    if (decisionConfirmationRef.current.phase !== "REVIEWING") {
      return;
    }
    if (!confirmationContext) {
      failClosed(null);
      return;
    }
    const claimed = claimLocalOperatingLoopDecisionConfirmation({
      confirmation: decisionConfirmationRef.current,
      context: confirmationContext,
    });
    if (!claimed) {
      failClosed(null);
      return;
    }
    decisionConfirmationRef.current = claimed;
    setDecisionConfirmation(claimed);
    void submitAction(claimed.basis.decision);
  }

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
                  label="projection binding"
                  value="Current canonical projection is internally bound; raw key withheld."
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
                clearDecisionConfirmation();
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
                  ref={(node) => {
                    reviewButtonRefs.current.ACCEPT = node;
                  }}
                  type="button"
                  aria-controls="local-operating-loop-decision-confirmation"
                  onClick={() => beginDecisionReview("ACCEPT")}
                  disabled={
                    pending ||
                    decisionConfirmation.phase !== "IDLE" ||
                    uiState.recommendation !== "GO"
                  }
                  className="rounded border border-emerald-500 bg-emerald-950 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  Review ACCEPT
                </button>
                <button
                  ref={(node) => {
                    reviewButtonRefs.current.HOLD = node;
                  }}
                  type="button"
                  aria-controls="local-operating-loop-decision-confirmation"
                  onClick={() => beginDecisionReview("HOLD")}
                  disabled={
                    pending || decisionConfirmation.phase !== "IDLE"
                  }
                  className="rounded border border-amber-500 bg-amber-950 px-4 py-2 text-sm font-semibold text-amber-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  Review HOLD
                </button>
                <button
                  ref={(node) => {
                    reviewButtonRefs.current.REJECT = node;
                  }}
                  type="button"
                  aria-controls="local-operating-loop-decision-confirmation"
                  onClick={() => beginDecisionReview("REJECT")}
                  disabled={
                    pending || decisionConfirmation.phase !== "IDLE"
                  }
                  className="rounded border border-red-700 bg-red-950 px-4 py-2 text-sm font-semibold text-red-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                >
                  Review REJECT
                </button>
              </div>
              {confirmationPresentation ? (
                <section
                  id="local-operating-loop-decision-confirmation"
                  aria-labelledby="local-operating-loop-decision-confirmation-heading"
                  aria-describedby="local-operating-loop-decision-confirmation-description"
                  aria-busy={confirmationPresentation.phase === "CLAIMED"}
                  className="mt-4 border-t border-slate-800 pt-4"
                >
                  <h3
                    id="local-operating-loop-decision-confirmation-heading"
                    ref={confirmationHeadingRef}
                    tabIndex={-1}
                    className="text-sm font-semibold text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {confirmationPresentation.heading}
                  </h3>
                  <p
                    id="local-operating-loop-decision-confirmation-description"
                    className="mt-2 text-sm text-slate-300"
                  >
                    {confirmationPresentation.description}
                  </p>
                  <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                    <ProjectionField
                      label="selected decision"
                      value={confirmationPresentation.decision}
                    />
                    <ProjectionField
                      label="server-derived recommendation"
                      value={confirmationPresentation.recommendation}
                    />
                    <ProjectionField
                      label="proof status"
                      value={confirmationPresentation.proofStatus}
                    />
                  </dl>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-slate-400">
                        Decision effects
                      </h4>
                      <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-300">
                        {confirmationPresentation.consequences.map(
                          (consequence) => (
                            <li key={consequence}>{consequence}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-slate-400">
                        Authority boundary
                      </h4>
                      <ul className="mt-2 grid gap-2 text-xs leading-5 text-red-200 sm:grid-cols-2">
                        {confirmationPresentation.nonAuthorizations.map(
                          (boundary) => (
                            <li key={boundary}>{boundary}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                  {confirmationPresentation.submittingCopy ? (
                    <p
                      aria-live="polite"
                      role="status"
                      className="mt-4 text-sm font-semibold text-cyan-200"
                    >
                      {confirmationPresentation.submittingCopy}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={confirmReviewedDecision}
                      disabled={confirmationPresentation.phase === "CLAIMED"}
                      className="rounded border border-cyan-500 bg-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                    >
                      {confirmationPresentation.confirmLabel}
                    </button>
                    <button
                      type="button"
                      onClick={cancelDecisionConfirmationAndRestoreFocus}
                      disabled={confirmationPresentation.phase === "CLAIMED"}
                      className="rounded border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:text-slate-600"
                    >
                      Cancel decision
                    </button>
                  </div>
                </section>
              ) : null}
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
          <section
            aria-labelledby="local-operating-loop-recommendation-explanation-heading"
            className="mt-4 border-t border-slate-800 pt-4"
          >
            <h3
              id="local-operating-loop-recommendation-explanation-heading"
              className="text-sm font-semibold text-slate-100"
            >
              Why this recommendation
            </h3>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {recommendationExplanation?.summary ??
                "No active canonical motion projection is available."}
            </p>
            {recommendationExplanation?.findings.length ? (
              <ol
                aria-label="Deterministic semantic findings"
                className="mt-3 space-y-3"
              >
                {recommendationExplanation.findings.map((finding, index) => (
                  <li
                    key={finding.code ?? `fail-closed-${index}`}
                    className="border-l-2 border-slate-700 pl-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-100">
                        {finding.label}
                      </span>
                      {finding.code ? (
                        <span className="font-mono text-xs text-slate-500">
                          {finding.code}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {finding.sourceFact}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-cyan-200">
                      <span className="font-semibold">Remediation:</span>{" "}
                      {finding.remediation}
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
          <section
            aria-labelledby="local-operating-loop-proof-status-heading"
            className="mt-4 border-t border-slate-800 pt-4"
          >
            <h3
              id="local-operating-loop-proof-status-heading"
              className="text-sm font-semibold text-slate-100"
            >
              Proof-chain status
            </h3>
            <div className="mt-2 font-mono text-xs uppercase text-cyan-200">
              {proofStatus.label}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {proofStatus.message}
            </p>
            <p className="mt-2 text-xs leading-5 text-amber-200">
              {proofStatus.verificationBoundary}
            </p>
          </section>
          <p className="mt-3 text-xs text-red-200">
            Recommendation and proof are recomputed server-side. This panel does
            not persist, route, execute, or call a provider.
          </p>
        </OperatorGateCard>
      </div>

      {hasTerminalState ? (
        terminalPresentation ? (
          <TerminalPresentation
            presentation={terminalPresentation}
            boundaryReceipt={boundaryReceipt}
            boundaryReceiptText={boundaryReceiptText}
          />
        ) : (
          <div
            aria-labelledby="local-operating-loop-terminal-unavailable-heading"
            aria-live="assertive"
            role="alert"
          >
            <OperatorGateCard>
              <h3
                id="local-operating-loop-terminal-unavailable-heading"
                className="text-sm font-semibold text-red-100"
              >
                Terminal summary unavailable
              </h3>
              <p className="mt-2 text-sm text-red-200">
                {LOCAL_OPERATING_LOOP_TERMINAL_PRESENTATION_UNAVAILABLE_COPY}
              </p>
            </OperatorGateCard>
          </div>
        )
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-xs text-slate-200">{value}</dd>
    </div>
  );
}

function TerminalPresentation({
  presentation,
  boundaryReceipt,
  boundaryReceiptText,
}: {
  presentation: LocalOperatingLoopTerminalPresentation;
  boundaryReceipt: LocalOperatingLoopBoundaryReceipt | null;
  boundaryReceiptText: string | null;
}) {
  return (
    <OperatorGateCard>
      <section aria-labelledby="local-operating-loop-terminal-summary-heading">
        <h3
          id="local-operating-loop-terminal-summary-heading"
          className="text-sm font-semibold text-slate-100"
        >
          Terminal local-shadow summary
        </h3>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          This bounded summary limits the on-screen terminal presentation. It
          does not redact the underlying browser response or network tooling.
        </p>
        <dl className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ProjectionField
            label="terminal state"
            value={presentation.terminalState}
          />
          <ProjectionField label="decision" value={presentation.decision} />
          <ProjectionField
            label="recommendation"
            value={presentation.recommendation}
          />
          <ProjectionField
            label="finding count"
            value={String(presentation.findingCount)}
          />
          <ProjectionField
            label="Work Packet count"
            value={String(presentation.workPacketCount)}
          />
          <ProjectionField
            label="Work Packet status"
            value={presentation.workPacketStatus}
          />
          <ProjectionField
            label="Work Packet execution authority"
            value={String(presentation.workPacketExecutionAuthority)}
          />
          <ProjectionField
            label="artifact count"
            value={String(presentation.artifactCount)}
          />
          <ProjectionField
            label="receipt authority"
            value={presentation.receiptAuthority}
          />
          <ProjectionField
            label="persistence"
            value={presentation.persistence}
          />
          <ProjectionField
            label="program effect"
            value={presentation.programEffect}
          />
          <ProjectionField
            label="not a Control-Thread acceptance receipt"
            value={String(
              presentation.notAControlThreadAcceptanceReceipt,
            )}
          />
          <ProjectionField
            label="decision scope"
            value={presentation.decisionScope}
          />
          <ProjectionField
            label="artifact execution authority"
            value={String(presentation.artifactExecutionAuthority)}
          />
        </dl>
      </section>
      {boundaryReceipt && boundaryReceiptText ? (
        <BoundaryReceiptPreview
          key={boundaryReceiptText}
          receipt={boundaryReceipt}
          receiptText={boundaryReceiptText}
        />
      ) : null}
    </OperatorGateCard>
  );
}

function BoundaryReceiptPreview({
  receipt,
  receiptText,
}: {
  receipt: LocalOperatingLoopBoundaryReceipt;
  receiptText: string;
}) {
  const [copyState, setCopyState] =
    useState<LocalOperatingLoopBoundaryReceiptCopyState>(() =>
      createLocalOperatingLoopBoundaryReceiptCopyState(),
    );
  const copyStateRef = useRef<LocalOperatingLoopBoundaryReceiptCopyState>(
    createLocalOperatingLoopBoundaryReceiptCopyState(),
  );
  const mountedRef = useRef(false);
  const writeCopyState = useCallback(
    (next: LocalOperatingLoopBoundaryReceiptCopyState) => {
      copyStateRef.current = next;
      setCopyState(next);
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      copyStateRef.current =
        clearLocalOperatingLoopBoundaryReceiptCopyState(
          copyStateRef.current,
        );
    };
  }, []);

  // D8_BOUNDARY_RECEIPT_COPY_CONTROL_START
  function handleBoundaryReceiptCopy() {
    let clipboardAvailable = false;
    try {
      clipboardAvailable =
        window.isSecureContext &&
        typeof navigator.clipboard?.writeText === "function";
    } catch {
      clipboardAvailable = false;
    }
    const claim = claimLocalOperatingLoopBoundaryReceiptCopyAttempt({
      state: copyStateRef.current,
      clipboardAvailable,
    });
    writeCopyState(claim.state);
    if (!claim.shouldWrite || claim.attemptId === null) {
      return;
    }

    const attemptId = claim.attemptId;
    const settle = (outcome: "COPIED" | "FAILED") => {
      if (!mountedRef.current) {
        return;
      }
      const current = copyStateRef.current;
      const next = settleLocalOperatingLoopBoundaryReceiptCopyAttempt({
        state: current,
        attemptId,
        receiptIsCurrent: true,
        outcome,
      });
      if (next !== current) {
        writeCopyState(next);
      }
    };

    let writeResult: Promise<void>;
    try {
      writeResult = navigator.clipboard.writeText(receiptText);
    } catch {
      settle("FAILED");
      return;
    }
    void writeResult.then(
      () => settle("COPIED"),
      () => settle("FAILED"),
    );
  }
  // D8_BOUNDARY_RECEIPT_COPY_CONTROL_END

  const fields = [
    ["receipt_version", receipt.receipt_version],
    ["evidence_scope", receipt.evidence_scope],
    ["redaction_scope", receipt.redaction_scope],
    [
      "underlying_transport_redacted",
      String(receipt.underlying_transport_redacted),
    ],
    ["terminal_state", receipt.terminal_state],
    ["decision", receipt.decision],
    ["recommendation", receipt.recommendation],
    ["finding_count", String(receipt.finding_count)],
    ["work_packet_count", String(receipt.work_packet_count)],
    ["work_packet_status", receipt.work_packet_status],
    ["work_packet_content", receipt.work_packet_content],
    [
      "work_packet_execution_authority",
      String(receipt.work_packet_execution_authority),
    ],
    ["artifact_count", String(receipt.artifact_count)],
    ["receipt_authority", receipt.receipt_authority],
    [
      "terminal_response_persistence_claim",
      receipt.terminal_response_persistence_claim,
    ],
    ["program_effect_claim", receipt.program_effect_claim],
    [
      "not_control_thread_acceptance_receipt",
      String(receipt.not_control_thread_acceptance_receipt),
    ],
    ["decision_scope", receipt.decision_scope],
    [
      "artifact_execution_authority",
      String(receipt.artifact_execution_authority),
    ],
    ["server_hmac_authenticity", receipt.server_hmac_authenticity],
    ["transport_redaction", receipt.transport_redaction],
    ["external_persistence_effect", receipt.external_persistence_effect],
    ["provider_effect", receipt.provider_effect],
    ["github_effect", receipt.github_effect],
    ["linear_effect", receipt.linear_effect],
    ["agent_council_effect", receipt.agent_council_effect],
    ["customer_effect", receipt.customer_effect],
    ["execution_effect", receipt.execution_effect],
    ["deployment_effect", receipt.deployment_effect],
    ["export_method", receipt.export_method],
    ["clipboard_write_status", receipt.clipboard_write_status],
    ["clipboard_retention", receipt.clipboard_retention],
    [
      "copy_control_network_dispatch",
      receipt.copy_control_network_dispatch,
    ],
    [
      "copy_control_application_persistence",
      receipt.copy_control_application_persistence,
    ],
    [
      "copy_control_file_download",
      receipt.copy_control_file_download,
    ],
    ["verification_scope", receipt.verification_scope],
    ["receipt_authenticity", receipt.receipt_authenticity],
    ["authority_granted", String(receipt.authority_granted)],
  ] as const;
  const statusCopy =
    LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_COPY_STATUS_COPY[
      copyState.status
    ];
  const alertStatus =
    copyState.status === "UNAVAILABLE" || copyState.status === "FAILED";
  const unavailable = copyState.status === "UNAVAILABLE";

  return (
    <article
      aria-labelledby="local-operating-loop-boundary-receipt-heading"
      className="mt-6 border-t border-slate-800 pt-5"
    >
      <h3
        id="local-operating-loop-boundary-receipt-heading"
        className="text-sm font-semibold text-slate-100"
      >
        Redacted boundary receipt
      </h3>
      <p className="mt-2 font-mono text-xs text-cyan-200">
        {receipt.heading}
      </p>
      <p
        id="local-operating-loop-boundary-receipt-privacy-warning"
        className="mt-3 text-xs leading-5 text-amber-200"
      >
        Only this allowlisted redacted receipt will be copied. Work Packet
        content and sensitive source fields are omitted. Clipboard export is a
        separate browser and operating-system effect; retention and downstream
        paste behavior are outside JAI NEXUS control. This receipt does not
        redact browser memory, the underlying response, or network tooling.
        Persistence and external-system absence are not runtime-verified. The
        receipt is not signed, authoritative, durable, executable, or a
        Control-Thread receipt.
      </p>
      <dl className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {fields.map(([label, value]) => (
          <BoundaryReceiptField key={label} label={label} value={value} />
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBoundaryReceiptCopy}
          disabled={copyState.status === "COPYING" || unavailable}
          aria-busy={copyState.status === "COPYING"}
          aria-describedby="local-operating-loop-boundary-receipt-privacy-warning"
          className="rounded border border-cyan-500 bg-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
        >
          Copy redacted boundary receipt
        </button>
        {unavailable ? (
          <span className="font-mono text-xs uppercase text-red-200">
            Clipboard unavailable
          </span>
        ) : null}
      </div>
      {statusCopy ? (
        <p
          role={alertStatus ? "alert" : "status"}
          aria-live={alertStatus ? "assertive" : "polite"}
          className={`mt-3 text-xs leading-5 ${
            alertStatus ? "text-red-200" : "text-cyan-200"
          }`}
        >
          {statusCopy}
        </p>
      ) : null}
    </article>
  );
}

function BoundaryReceiptField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="break-words font-mono text-xs uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-xs text-slate-200">{value}</dd>
    </div>
  );
}
