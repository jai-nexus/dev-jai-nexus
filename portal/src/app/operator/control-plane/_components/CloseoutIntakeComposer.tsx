"use client";

import { useMemo, useState } from "react";

import { ControlPlaneBadge } from "./ControlPlaneBadges";

const decisions = [
  "ACCEPT",
  "ACCEPT WITH CONDITIONS",
  "DEFER",
  "REJECT",
  "REQUIRES REVISION",
] as const;

type Decision = (typeof decisions)[number];

export interface CloseoutComposerState {
  source: string;
  closeoutType: string;
  relatedId: string;
  passalongBody: string;
  decision: Decision;
  acceptedArtifacts: string;
  acceptedBaseline: string;
  deferredItems: string;
  rejectedInterpretations: string;
  unresolvedQuestions: string;
  risks: string;
  nonAuthorizations: string;
  validationResults: string;
  recommendedNextRoute: string;
}

function bulletSection(title: string, value: string) {
  const entries = value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return `${title}:\n${
    entries.length > 0
      ? entries.map((entry) => `* ${entry}`).join("\n")
      : "* None recorded."
  }`;
}

export function buildCloseoutReconciliationDraft(
  state: CloseoutComposerState,
) {
  const source = state.source.trim() || "Not provided";
  const closeoutType = state.closeoutType.trim() || "Not provided";
  const relatedId = state.relatedId.trim() || "Not provided";
  const passalongBody = state.passalongBody.trim() || "No source body provided.";

  return `[CONTROL_THREAD  dev-jai-nexus]

Scope:
Closeout Intake Reconciliation Draft

Status:
NON-AUTHORIZING / OPERATOR-REVIEWED DRAFT

Decision:
${state.decision}

Intake source:
* Source lane/repo/model slot: ${source}
* Closeout type: ${closeoutType}
* Related motion or route ID: ${relatedId}

${bulletSection("Accepted files or artifacts", state.acceptedArtifacts)}

${bulletSection("Accepted baseline", state.acceptedBaseline)}

${bulletSection("Deferred items", state.deferredItems)}

${bulletSection("Rejected interpretations", state.rejectedInterpretations)}

${bulletSection("Unresolved questions", state.unresolvedQuestions)}

${bulletSection("Risks", state.risks)}

${bulletSection("Non-authorizations", state.nonAuthorizations)}

${bulletSection("Validation results", state.validationResults)}

${bulletSection("Recommended next route", state.recommendedNextRoute)}

Source closeout / passalong:
${passalongBody}

Authority note:
This generated draft is operator-reviewed and non-authorizing until manually sent to and accepted by CONTROL_THREAD.
Copy-only composer. Does not submit, persist, authorize, or execute.`;
}

const initialState: CloseoutComposerState = {
  source: "",
  closeoutType: "",
  relatedId: "",
  passalongBody: "",
  decision: "REQUIRES REVISION",
  acceptedArtifacts: "",
  acceptedBaseline: "",
  deferredItems: "",
  rejectedInterpretations: "",
  unresolvedQuestions: "",
  risks: "",
  nonAuthorizations: "",
  validationResults: "",
  recommendedNextRoute: "",
};

const inputClassName =
  "mt-1 w-full rounded-md border border-gray-700 bg-black/40 px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-sky-700";
const labelClassName =
  "block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400";

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={labelClassName}>
      {label}
      <input
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className={labelClassName}>
      {label}
      <textarea
        className={`${inputClassName} resize-y font-mono text-xs normal-case tracking-normal`}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function CloseoutIntakeComposer() {
  const [state, setState] = useState(initialState);
  const [copyStatus, setCopyStatus] = useState(
    "Select and copy manually, or use the local clipboard control.",
  );
  const draft = useMemo(
    () => buildCloseoutReconciliationDraft(state),
    [state],
  );

  function updateState<Key extends keyof CloseoutComposerState>(
    key: Key,
    value: CloseoutComposerState[Key],
  ) {
    setState((current) => ({ ...current, [key]: value }));
    setCopyStatus("Draft changed. Copy the updated text when ready.");
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Draft copied locally. No submission or dispatch occurred.");
    } catch {
      setCopyStatus(
        "Clipboard access was unavailable. Select the generated text and copy it manually.",
      );
    }
  }

  return (
    <section className="rounded-lg border border-sky-900/70 bg-sky-950/10 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <ControlPlaneBadge tone="rose">NON-AUTHORIZING</ControlPlaneBadge>
        <ControlPlaneBadge tone="sky">LOCAL COMPOSE ONLY</ControlPlaneBadge>
        <ControlPlaneBadge tone="emerald">REAL-COMPOSE</ControlPlaneBadge>
        <ControlPlaneBadge tone="rose">NO PERSISTENCE</ControlPlaneBadge>
        <ControlPlaneBadge tone="rose">NO DISPATCH</ControlPlaneBadge>
        <ControlPlaneBadge tone="amber">
          MANUAL OPERATOR REVIEW REQUIRED
        </ControlPlaneBadge>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-400">
        This composer only drafts text for manual review. It does not create a
        receipt, update canon, mutate state, submit a closeout, dispatch a
        model, run an Agent, open a PR, or authorize execution.
      </p>

      <div className="mt-5 space-y-5">
        <fieldset className="space-y-3">
          <legend className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gray-100">
            1. Intake Source
          </legend>
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Source lane / repo / model slot"
              value={state.source}
              onChange={(value) => updateState("source", value)}
            />
            <TextField
              label="Closeout type"
              value={state.closeoutType}
              onChange={(value) => updateState("closeoutType", value)}
            />
          </div>
          <TextField
            label="Related motion or route ID, if known"
            value={state.relatedId}
            onChange={(value) => updateState("relatedId", value)}
          />
          <TextAreaField
            label="Pasted passalong / closeout body"
            rows={8}
            value={state.passalongBody}
            onChange={(value) => updateState("passalongBody", value)}
          />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gray-100">
            2. Operator Review
          </legend>
          <label className={labelClassName}>
            Decision
            <select
              className={inputClassName}
              value={state.decision}
              onChange={(event) =>
                updateState("decision", event.target.value as Decision)
              }
            >
              {decisions.map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </select>
          </label>
          <TextAreaField
            label="Accepted files or artifacts"
            value={state.acceptedArtifacts}
            onChange={(value) => updateState("acceptedArtifacts", value)}
          />
          <TextAreaField
            label="Accepted baseline summary"
            value={state.acceptedBaseline}
            onChange={(value) => updateState("acceptedBaseline", value)}
          />
          <TextAreaField
            label="Deferred items"
            value={state.deferredItems}
            onChange={(value) => updateState("deferredItems", value)}
          />
          <TextAreaField
            label="Rejected interpretations"
            value={state.rejectedInterpretations}
            onChange={(value) => updateState("rejectedInterpretations", value)}
          />
          <TextAreaField
            label="Unresolved questions"
            value={state.unresolvedQuestions}
            onChange={(value) => updateState("unresolvedQuestions", value)}
          />
          <TextAreaField
            label="Risks"
            value={state.risks}
            onChange={(value) => updateState("risks", value)}
          />
          <TextAreaField
            label="Non-authorizations"
            value={state.nonAuthorizations}
            onChange={(value) => updateState("nonAuthorizations", value)}
          />
          <TextAreaField
            label="Validation results, if provided"
            value={state.validationResults}
            onChange={(value) => updateState("validationResults", value)}
          />
          <TextAreaField
            label="Recommended next route"
            value={state.recommendedNextRoute}
            onChange={(value) => updateState("recommendedNextRoute", value)}
          />
        </fieldset>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gray-100">
              3. Generated Draft
            </h3>
            <ControlPlaneBadge tone="emerald">REAL-COMPOSE</ControlPlaneBadge>
          </div>
          <p className="text-xs font-medium text-gray-200">
            Copy-only composer. Does not submit, persist, authorize, or execute.
          </p>
          <textarea
            aria-label="Generated CONTROL_THREAD reconciliation draft"
            className="min-h-96 w-full resize-y rounded-md border border-gray-700 bg-black/40 p-3 font-mono text-xs leading-relaxed text-gray-100 outline-none focus:border-sky-700"
            readOnly
            value={draft}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-md border border-sky-800 bg-sky-950 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-200 transition hover:bg-sky-900"
              type="button"
              onClick={copyDraft}
            >
              Copy draft locally
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">
              {copyStatus}
            </span>
          </div>
        </section>
      </div>
    </section>
  );
}
