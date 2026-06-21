"use client";

import { useMemo, useState } from "react";

import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";

const repoChoices = [
  "dev-jai-nexus",
  "orchestrator-nexus",
  "jai-format",
  "jai",
  "jai-vscode",
  "jai-pilot",
  "jai-edge",
  "audit-nexus",
  "api-nexus",
  "docs-nexus",
  "jai-nexus",
] as const;

const laneTypeChoices = [
  "DOCS_REFERENCE",
  "DOCS_SPEC",
  "STATIC_DATA",
  "READ_ONLY_UI",
  "COMPOSE_ONLY_UI",
  "VALIDATION_ONLY",
  "QA_DENSITY",
  "ALIGNMENT_REVIEW",
  "DECISION_RECEIPT",
  "PROFILE_DRAFT",
  "BOUNDARY_REVIEW",
  "FUTURE_GATED_EXECUTION_DESIGN",
] as const;

const visibleLabels = [
  "COMPOSE ONLY",
  "LOCAL ONLY",
  "COPY ONLY",
  "NO DISPATCH",
  "NO PERSISTENCE",
  "NO EXECUTION",
  "CONTROL_THREAD REVIEW REQUIRED",
  "ZERO GATES GRANTED",
] as const;

const doctrinePhrases = [
  "Work packets coordinate work; they do not execute work.",
  "Route packets recommend; they do not route themselves.",
  "Closeout packets report; they do not accept themselves.",
  "Validation reports verify checks; they do not approve.",
  "Acceptance receipts record CONTROL_THREAD decisions.",
  "CONTROL_THREAD decides.",
  "ZERO GATES GRANTED.",
  "Broad batch does not mean broad authority.",
  "Toolchain visibility is not toolchain activation.",
  "jai-pilot remains high-risk and future-gated.",
  "jai-vscode manual handoff is not automation.",
  ".jai coordinates but does not execute.",
] as const;

const warningRail = [
  "This composer is local-only.",
  "Generated packets are copy-only.",
  "Generated packets do not dispatch work.",
  "Generated packets do not create branches.",
  "Generated packets do not open PRs.",
  "Generated packets do not call GitHub.",
  "Generated packets do not call providers/models.",
  "Generated packets do not invoke tools.",
  "Generated packets do not dispatch Agents.",
  "Generated packets do not create receipts.",
  "Generated packets do not update canon.",
  "Generated packets do not open gates.",
  "CONTROL_THREAD review is required.",
  "ZERO GATES GRANTED.",
] as const;

const defaultNonAuthorizations = [
  "execution",
  "runtime activation",
  "provider/model dispatch",
  "live model calls",
  "Agent execution",
  "Agent dispatch",
  "Agent creation",
  "Agent activation",
  "Agent instantiation",
  "tool invocation",
  "model calls",
  "GitHub integration",
  "GitHub API use",
  "repo mutation outside explicitly scoped UI/static/docs files",
  "file mutation outside explicitly scoped UI/static/docs files",
  "branch creation",
  "PR creation",
  "push",
  "merge",
  "branch/PR automation",
  "browser/desktop control",
  "terminal/command execution",
  "scheduler",
  "autonomous loop",
  "retrieval engine",
  "automatic context injection",
  "live memory writes",
  "hidden persistence",
  "live settings mutation",
  "new API routes",
  "new server actions",
  "DB writes",
  "Prisma changes",
  "telemetry",
  "auth/session changes",
  "customer-data handling",
  "production behavior",
  ".jai parser/runtime behavior",
  ".jai execution behavior",
  ".nexus active semantics",
  "policy enforcement",
  "execution gates opened",
  "automatic scoring",
  "automatic synthesis",
  "automatic best-agent selection",
  "automatic gate evaluation",
  "automatic profile validation",
  "recommendation submission",
  "recommendation persistence",
  "dashboard state creation",
  "dashboard activation",
  "project-state creation",
  "repo-lane creation",
  "route creation",
  "route-state mutation",
  "vote creation",
  "vote submission",
  "receipt creation",
  "canon update",
  "motion-state mutation",
  "gate opening",
] as const;

const defaultFields = {
  source: "CONTROL_THREAD",
  targetRepo: "dev-jai-nexus",
  laneType: "COMPOSE_ONLY_UI",
  scope: "Operator Work Packet Composer v0",
  mode: "REPO_EXECUTION / COMPOSE-ONLY / LOCAL-ONLY / NO-RUNTIME / NO-EXECUTION",
  branch: "",
  currentBaseline:
    "Accepted read-only Operator surfaces for Agent Registry, vote review, Palette recommendations, local surface navigation, dashboard-state sketch posture, and route/v0 sketch posture.",
  purpose:
    "Draft local-only work packets, route packets, validation expectations, and closeout handoffs for CONTROL_THREAD review.",
  task:
    "Compose a bounded work packet using static/local inputs only. Do not dispatch, persist, route, execute, create receipts, update canon, or open gates.",
  filesAllowed: "Explicitly scoped UI/static/docs files named by CONTROL_THREAD.",
  filesBlocked:
    "API routes, server actions, DB/Prisma files, provider/model integrations, GitHub/tool integrations, route-state or motion-state mutation files, package/dependency files unless separately authorized.",
  requiredExactPhrases:
    "CONTROL_THREAD REVIEW REQUIRED\nZERO GATES GRANTED\nValidation reports verify checks; they do not approve.",
  validationExpectations:
    "Run targeted lint/typecheck for changed files if practical. Then run pnpm lint, pnpm typecheck, pnpm build, git diff --check, and pnpm -C portal validate:agency if configured.",
  closeoutRequirements:
    "Return branch name, files changed, route touched, behavior summary, validation results, audit results, manual smoke results, risks, unresolved questions, and recommended next route.",
  extraNotes:
    "Generated packet preview is plain text for manual handoff only.",
};

type ComposerFields = typeof defaultFields;
type ComposerField = keyof ComposerFields;

function slugifyScope(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);

  return slug || "operator-work-packet";
}

function branchPrefix(laneType: string) {
  if (
    laneType.startsWith("DOCS") ||
    laneType === "ALIGNMENT_REVIEW" ||
    laneType === "DECISION_RECEIPT" ||
    laneType === "PROFILE_DRAFT" ||
    laneType === "BOUNDARY_REVIEW"
  ) {
    return "docs";
  }

  return "feat";
}

function formatBullets(value: readonly string[]) {
  return value.map((item) => `* ${item}`).join("\n");
}

function buildPacketPreview(fields: ComposerFields, branchSuggestion: string) {
  return `[${fields.source}  ${fields.targetRepo}]

Scope:
${fields.scope}

Mode:
${fields.mode}

Branch:
${fields.branch || branchSuggestion}

Lane:
${fields.laneType}

## source
${fields.source}

## target repo
${fields.targetRepo}

## scope
${fields.scope}

## mode
${fields.mode}

## branch
${fields.branch || branchSuggestion}

Branch planning may be represented.
Branch creation is not authorized.

## current baseline
${fields.currentBaseline}

## purpose
${fields.purpose}

## task
${fields.task}

## files allowed
${fields.filesAllowed}

## files blocked
${fields.filesBlocked}

## required exact phrases
${fields.requiredExactPhrases}

CONTROL_THREAD REVIEW REQUIRED
ZERO GATES GRANTED

## non-authorizations
This packet must not authorize:
${formatBullets(defaultNonAuthorizations)}

## validation
${fields.validationExpectations}

Validation reports verify checks; they do not approve.

## closeout requirements
${fields.closeoutRequirements}

## extra notes
${fields.extraNotes}

Generated packet posture:
Work packets coordinate work; they do not execute work.
Route packets recommend; they do not route themselves.
Closeout packets report; they do not accept themselves.
Acceptance receipts record CONTROL_THREAD decisions.
CONTROL_THREAD decides.
ZERO GATES GRANTED.`;
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-600"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  rows = 4,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-600"
      />
    </label>
  );
}

export function OperatorWorkPacketComposer() {
  const [fields, setFields] = useState<ComposerFields>(defaultFields);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const branchSuggestion = useMemo(
    () =>
      `${branchPrefix(fields.laneType)}/q2-${slugifyScope(fields.scope)}-v0`,
    [fields.laneType, fields.scope],
  );

  const packetPreview = useMemo(
    () => buildPacketPreview(fields, branchSuggestion),
    [branchSuggestion, fields],
  );

  function updateField(field: ComposerField, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setCopyState("idle");
  }

  async function copyPacket() {
    try {
      await navigator.clipboard.writeText(packetPreview);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  function resetLocalDraft() {
    setFields(defaultFields);
    setCopyState("idle");
  }

  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index="COMPOSE"
        title="Operator Work Packet Composer"
        right={<OperatorBadge tone="composeOnly" label="LOCAL / COPY-ONLY" />}
      />

      <OperatorPanel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {visibleLabels.map((label) => (
            <OperatorBadge
              key={label}
              tone={label.includes("NO ") ? "blocked" : "composeOnly"}
              label={label}
            />
          ))}
        </div>

        <p className="max-w-5xl text-sm text-slate-300">
          Draft work packets, route packets, validation expectations, and
          closeout handoffs for manual CONTROL_THREAD review. The preview is
          local text only; it does not dispatch, persist, route, or execute.
        </p>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <OperatorContradictionCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="blocked" label="NO DISPATCH" />
              <OperatorBadge tone="blocked" label="NO PERSISTENCE" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
              <OperatorBadge tone="gated" label="ZERO GATES GRANTED" />
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
              {warningRail.map((warning) => (
                <li key={warning}>- {warning}</li>
              ))}
            </ul>
          </OperatorContradictionCard>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Doctrine rail
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {doctrinePhrases.map((phrase) => (
                <li key={phrase}>- {phrase}</li>
              ))}
            </ul>
          </OperatorGateCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <OperatorPanel className="space-y-4 bg-slate-950/45">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  target repo
                </span>
                <select
                  value={fields.targetRepo}
                  onChange={(event) =>
                    updateField("targetRepo", event.target.value)
                  }
                  className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-600"
                >
                  {repoChoices.map((repo) => (
                    <option key={repo} value={repo}>
                      {repo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  lane type
                </span>
                <select
                  value={fields.laneType}
                  onChange={(event) =>
                    updateField("laneType", event.target.value)
                  }
                  className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-600"
                >
                  {laneTypeChoices.map((laneType) => (
                    <option key={laneType} value={laneType}>
                      {laneType}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <TextInput
              label="source"
              value={fields.source}
              onChange={(value) => updateField("source", value)}
            />
            <TextInput
              label="scope"
              value={fields.scope}
              onChange={(value) => updateField("scope", value)}
            />
            <TextInput
              label="mode"
              value={fields.mode}
              onChange={(value) => updateField("mode", value)}
            />
            <TextInput
              label="branch text"
              value={fields.branch}
              onChange={(value) => updateField("branch", value)}
            />

            <OperatorGateCard>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorBadge tone="composeOnly" label="BRANCH TEXT ONLY" />
                <OperatorBadge tone="blocked" label="NO BRANCH CREATION" />
              </div>
              <p className="mt-2 font-mono text-sm text-slate-100">
                {fields.branch || branchSuggestion}
              </p>
            </OperatorGateCard>

            <TextArea
              label="current baseline"
              value={fields.currentBaseline}
              onChange={(value) => updateField("currentBaseline", value)}
            />
            <TextArea
              label="purpose"
              value={fields.purpose}
              onChange={(value) => updateField("purpose", value)}
            />
            <TextArea
              label="task"
              value={fields.task}
              onChange={(value) => updateField("task", value)}
            />
            <TextArea
              label="files allowed"
              value={fields.filesAllowed}
              onChange={(value) => updateField("filesAllowed", value)}
            />
            <TextArea
              label="files blocked"
              value={fields.filesBlocked}
              onChange={(value) => updateField("filesBlocked", value)}
            />
            <TextArea
              label="required exact phrases"
              rows={5}
              value={fields.requiredExactPhrases}
              onChange={(value) => updateField("requiredExactPhrases", value)}
            />
            <TextArea
              label="validation expectations"
              value={fields.validationExpectations}
              onChange={(value) => updateField("validationExpectations", value)}
            />
            <TextArea
              label="closeout requirements"
              value={fields.closeoutRequirements}
              onChange={(value) => updateField("closeoutRequirements", value)}
            />
            <TextArea
              label="extra notes"
              value={fields.extraNotes}
              onChange={(value) => updateField("extraNotes", value)}
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyPacket}
                className="rounded border border-sky-700 bg-sky-950 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:border-sky-500"
              >
                Copy packet
              </button>
              <button
                type="button"
                onClick={resetLocalDraft}
                className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Reset local draft
              </button>
              <span className="self-center text-xs text-slate-500">
                {copyState === "copied"
                  ? "Copied to local clipboard only."
                  : copyState === "failed"
                    ? "Clipboard copy unavailable in this browser context."
                    : "No packet is persisted or dispatched."}
              </span>
            </div>
          </OperatorPanel>

          <OperatorPanel className="space-y-4 bg-slate-950/45">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100">
                Generated packet preview
              </h3>
              <OperatorBadge tone="composeOnly" label="COPY ONLY" />
              <OperatorBadge tone="blocked" label="NO DISPATCH" />
              <OperatorBadge tone="blocked" label="NO PERSISTENCE" />
            </div>
            <p className="text-sm text-slate-400">
              Preview text is derived from local inputs only. It is not
              executable and does not create branches, PRs, receipts, canon
              updates, gates, route state, or motion state.
            </p>
            <pre className="max-h-[52rem] overflow-auto rounded border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              {packetPreview}
            </pre>
          </OperatorPanel>
        </div>

        <OperatorPanel className="bg-slate-950/45">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Blocked composer capabilities
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "dispatch work",
              "persist draft",
              "call GitHub",
              "create branch",
              "open PR",
              "invoke tool",
              "dispatch Agent",
              "create receipt",
              "update canon",
              "open gate",
            ].map((capability) => (
              <OperatorBlockedAction key={capability}>
                {capability}
              </OperatorBlockedAction>
            ))}
          </div>
        </OperatorPanel>
      </OperatorPanel>
    </section>
  );
}
