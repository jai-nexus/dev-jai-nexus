"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildMotionContenderPreview,
  markMotionContenderPromoted,
  markMotionContenderStale,
  parseMotionNumber,
  syncMotionContenderAvailability,
  type ContenderQueueState,
  type MotionContenderInput,
  type MotionContenderPreview,
  type MotionContenderPromotionResult,
} from "@/lib/motion/motionContenders";
import type { MotionPromotionAvailability } from "@/lib/motion/motionPromotion";

const SESSION_STORAGE_KEY = "jai.motion-contenders.v0";

type PromoteContenderFormProps = {
  highestMotionNumber: number;
  selectedMotionId: string | null;
  selectedMotionTitle: string | null;
  selectedMotionProgram: string | null;
  promotion: MotionPromotionAvailability;
};

type PromotionResult =
  | {
      ok: true;
      motion_id: string;
      branch_name: string;
      commit_sha: string;
      compare_url?: string | null;
      next_manual_action: string;
    }
  | {
      ok: false;
      status?: number;
      error: string;
      message: string;
    };

type PromotionApiPayload =
  | PromotionResult
  | {
      ok: false;
      status?: number;
      error: string;
      message: string;
      expected_motion_id?: string;
      expected_branch_name?: string;
    };

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function filePreviewLabel(pathValue: string): string {
  const slashIndex = pathValue.lastIndexOf("/");
  return slashIndex >= 0 ? pathValue.slice(slashIndex + 1) : pathValue;
}

function shortTs(value: string): string {
  return value.length >= 19 ? value.slice(0, 19) : value;
}

function queueStateTone(queueState: ContenderQueueState) {
  switch (queueState) {
    case "promoted":
      return "border-emerald-800/60 bg-emerald-900/20 text-emerald-200";
    case "ready_to_promote":
      return "border-sky-800/60 bg-sky-900/20 text-sky-200";
    case "promotion_blocked":
      return "border-amber-900/60 bg-amber-950/20 text-amber-200";
    case "stale_preview":
      return "border-violet-800/60 bg-violet-900/20 text-violet-200";
    default:
      return "border-zinc-700 bg-zinc-900/60 text-zinc-200";
  }
}

function queueStateLabel(queueState: ContenderQueueState) {
  switch (queueState) {
    case "ready_to_promote":
      return "ready to promote";
    case "promotion_blocked":
      return "promotion blocked";
    case "stale_preview":
      return "stale preview";
    default:
      return queueState.replace(/_/g, " ");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function readPromotionResult(value: unknown): MotionContenderPromotionResult | null {
  if (!isRecord(value)) return null;

  const motionId = readString(value.motion_id);
  const branchName = readString(value.branch_name);
  const commitSha = readString(value.commit_sha);
  if (!motionId || !branchName || !commitSha) {
    return null;
  }

  return {
    motion_id: motionId,
    branch_name: branchName,
    commit_sha: commitSha,
    compare_url: readString(value.compare_url),
  };
}

function normalizeStoredContender(
  value: unknown,
  promotion: MotionPromotionAvailability,
): MotionContenderPreview | null {
  if (!isRecord(value) || !isRecord(value.input)) {
    return null;
  }

  const inputRecord = value.input;
  const generatedAt = readString(value.generated_at);
  if (!generatedAt) {
    return null;
  }

  const provisionalMotionId =
    readString(value.provisional_motion_id_preview) ??
    readString(value.provisional_motion_id);

  const rebuilt = buildMotionContenderPreview({
    highestMotionNumber: Math.max(0, parseMotionNumber(provisionalMotionId) - 1),
    generatedAt,
    baseBranch: readString(value.base_branch) ?? promotion.base_branch,
    targetRepo: readString(value.target_repo) ?? promotion.target_repo,
    targetDomain: readString(value.target_domain),
    input: {
      title: readString(inputRecord.title) ?? "",
      subtitle: readString(inputRecord.subtitle),
      program: readString(inputRecord.program),
      kind: readString(inputRecord.kind),
      basisMotionId: readString(inputRecord.basisMotionId),
      boundedScope: readString(inputRecord.boundedScope) ?? "",
      touchedPaths: readStringList(inputRecord.touchedPaths),
      nonGoals: readStringList(inputRecord.nonGoals),
      rationale: readString(inputRecord.rationale) ?? "",
      risks: readStringList(inputRecord.risks),
      generatedFromMotionId: readString(inputRecord.generatedFromMotionId),
    },
  });

  const storedQueueState = readString(value.queue_state);
  const queueState =
    storedQueueState === "preview_only" ||
    storedQueueState === "ready_to_promote" ||
    storedQueueState === "promotion_blocked" ||
    storedQueueState === "stale_preview" ||
    storedQueueState === "promoted"
      ? storedQueueState
      : rebuilt.queue_state;

  const hydrated: MotionContenderPreview = {
    ...rebuilt,
    queue_state: queueState,
    blocking_reasons: readStringList(value.blocking_reasons),
    promotion_result: readPromotionResult(value.promotion_result),
  };

  return syncMotionContenderAvailability(hydrated, {
    promotionEnabled: promotion.enabled,
    blockingReasons: promotion.blocking_reasons,
  });
}

function countByQueueState(
  contenders: MotionContenderPreview[],
  queueState: ContenderQueueState,
): number {
  return contenders.filter((contender) => contender.queue_state === queueState).length;
}

export function PromoteContenderForm({
  highestMotionNumber,
  selectedMotionId,
  selectedMotionTitle,
  selectedMotionProgram,
  promotion,
}: PromoteContenderFormProps) {
  const [title, setTitle] = useState(
    selectedMotionTitle ? `${selectedMotionTitle} follow-on` : "",
  );
  const [subtitle, setSubtitle] = useState("");
  const [program, setProgram] = useState(
    selectedMotionProgram ?? "q2-motion-contender-queue-v0",
  );
  const [kind, setKind] = useState("builder-proof");
  const [basisMotionId, setBasisMotionId] = useState(selectedMotionId ?? "");
  const [boundedScope, setBoundedScope] = useState("");
  const [touchedPaths, setTouchedPaths] = useState("");
  const [nonGoals, setNonGoals] = useState("");
  const [rationale, setRationale] = useState("");
  const [risks, setRisks] = useState("");
  const [contenders, setContenders] = useState<MotionContenderPreview[]>([]);
  const [selectedContenderId, setSelectedContenderId] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PromotionResult | null>(null);
  const promotionBlockingKey = promotion.blocking_reasons.join("||");

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;

      const hydrated = parsed
        .map((entry) => normalizeStoredContender(entry, promotion))
        .filter((entry): entry is MotionContenderPreview => entry !== null);

      setContenders(hydrated);
      setSelectedContenderId(hydrated[0]?.contender_id ?? null);
    } catch {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(contenders));
  }, [contenders]);

  useEffect(() => {
    setContenders((current) =>
      current.map((contender) =>
        syncMotionContenderAvailability(contender, {
          promotionEnabled: promotion.enabled,
          blockingReasons: promotion.blocking_reasons,
        }),
      ),
    );
  }, [promotion.enabled, promotionBlockingKey]);

  useEffect(() => {
    if (contenders.length === 0) {
      setSelectedContenderId(null);
      return;
    }

    if (
      !selectedContenderId ||
      !contenders.some((contender) => contender.contender_id === selectedContenderId)
    ) {
      setSelectedContenderId(contenders[0].contender_id);
    }
  }, [contenders, selectedContenderId]);

  useEffect(() => {
    if (!selectedMotionId) return;
    setBasisMotionId((current) => current || selectedMotionId);
  }, [selectedMotionId]);

  useEffect(() => {
    if (!selectedMotionTitle) return;
    setTitle((current) => current || `${selectedMotionTitle} follow-on`);
  }, [selectedMotionTitle]);

  useEffect(() => {
    if (!selectedMotionProgram) return;
    setProgram((current) => current || selectedMotionProgram);
  }, [selectedMotionProgram]);

  const selectedContender =
    contenders.find((contender) => contender.contender_id === selectedContenderId) ??
    contenders[0] ??
    null;

  const summary = useMemo(
    () => ({
      total: contenders.length,
      ready: countByQueueState(contenders, "ready_to_promote"),
      blocked: countByQueueState(contenders, "promotion_blocked"),
      promoted: countByQueueState(contenders, "promoted"),
    }),
    [contenders],
  );

  function nextPreviewBase(): number {
    return contenders.reduce((currentMax, contender) => {
      return Math.max(
        currentMax,
        parseMotionNumber(
          contender.provisional_motion_id_preview ?? contender.provisional_motion_id,
        ),
      );
    }, highestMotionNumber);
  }

  function buildInput(): MotionContenderInput {
    return {
      title,
      subtitle: subtitle || null,
      program: program || null,
      kind: kind || null,
      basisMotionId: basisMotionId || null,
      boundedScope,
      touchedPaths: parseLines(touchedPaths),
      nonGoals: parseLines(nonGoals),
      rationale,
      risks: parseLines(risks),
      generatedFromMotionId: selectedMotionId,
    };
  }

  function handleGenerateContender() {
    if (!title.trim() || !boundedScope.trim() || !rationale.trim()) {
      setResult({
        ok: false,
        error: "missing_required_fields",
        message:
          "Title, bounded scope, and rationale are required to generate a contender.",
      });
      return;
    }

    const contender = syncMotionContenderAvailability(
      buildMotionContenderPreview({
        highestMotionNumber: nextPreviewBase(),
        generatedAt: new Date().toISOString(),
        baseBranch: promotion.base_branch,
        input: buildInput(),
      }),
      {
        promotionEnabled: promotion.enabled,
        blockingReasons: promotion.blocking_reasons,
      },
    );

    setContenders((current) => [contender, ...current]);
    setSelectedContenderId(contender.contender_id);
    setConfirmationText("");
    setResult(null);
  }

  async function handlePromoteSelectedContender() {
    if (!selectedContender) return;
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/operator/motions/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contender: selectedContender.input,
          generated_at: selectedContender.generated_at,
          provisional_motion_id: selectedContender.provisional_motion_id,
          provisional_branch_name: selectedContender.provisional_branch_name,
          confirmation_text: confirmationText,
        }),
      });

      const payload = (await response.json().catch(() => null)) as PromotionApiPayload | null;

      if (!response.ok || !payload || payload.ok === false) {
        const errorPayload =
          payload && "error" in payload
            ? payload
            : {
                ok: false as const,
                error: "promotion_failed",
                message: "Motion promotion failed.",
              };

        setResult({
          ok: false,
          status: response.status,
          error: errorPayload.error,
          message: errorPayload.message,
        });

        if (
          response.status === 409 &&
          errorPayload.error === "stale_provisional_motion_id" &&
          "expected_motion_id" in errorPayload &&
          "expected_branch_name" in errorPayload &&
          typeof errorPayload.expected_motion_id === "string" &&
          typeof errorPayload.expected_branch_name === "string"
        ) {
          const rebuilt = markMotionContenderStale(
            syncMotionContenderAvailability(
              buildMotionContenderPreview({
                highestMotionNumber:
                  parseMotionNumber(errorPayload.expected_motion_id) - 1,
                generatedAt: selectedContender.generated_at,
                baseBranch: promotion.base_branch,
                input: selectedContender.input,
              }),
              {
                promotionEnabled: promotion.enabled,
                blockingReasons: promotion.blocking_reasons,
              },
            ),
            errorPayload.message,
          );

          setContenders((current) =>
            current.map((contender) =>
              contender.contender_id === selectedContender.contender_id ? rebuilt : contender,
            ),
          );
          setSelectedContenderId(rebuilt.contender_id);
          setConfirmationText("");
        }
        return;
      }

      const promotionResult: MotionContenderPromotionResult = {
        motion_id: payload.motion_id,
        branch_name: payload.branch_name,
        commit_sha: payload.commit_sha,
        compare_url: payload.compare_url ?? null,
      };

      setContenders((current) =>
        current.map((contender) =>
          contender.contender_id === selectedContender.contender_id
            ? markMotionContenderPromoted(contender, promotionResult)
            : contender,
        ),
      );
      setResult(payload);
      setConfirmationText("");
    } catch (error) {
      setResult({
        ok: false,
        error: "promotion_failed",
        message:
          error instanceof Error ? error.message : "Motion promotion failed unexpectedly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            Total contenders
          </div>
          <div className="mt-1 font-mono text-2xl text-gray-100">{summary.total}</div>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            Ready to promote
          </div>
          <div className="mt-1 font-mono text-2xl text-sky-300">{summary.ready}</div>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            Promotion blocked
          </div>
          <div className="mt-1 font-mono text-2xl text-amber-300">{summary.blocked}</div>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            Promoted in session
          </div>
          <div className="mt-1 font-mono text-2xl text-emerald-300">{summary.promoted}</div>
        </div>
      </section>

      <section className="rounded border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-100">Contender Queue</div>
            <div className="mt-1 max-w-3xl text-xs text-gray-500">
              Generated contenders are preview only, not a motion package yet, and
              promotion creates the first real DRAFT package on a guarded same-repo
              branch.
            </div>
          </div>

          <div className="rounded border border-zinc-800 bg-black/30 px-3 py-2 text-xs text-gray-400">
            Target repo:{" "}
            <span className="font-mono text-gray-200">{promotion.target_repo}</span>
            <div className="mt-1">
              Base branch:{" "}
              <span className="font-mono text-gray-200">{promotion.base_branch}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-200">
                    Session-local contender queue
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Newest first. These rows are previews, not repo-native motion packages.
                  </div>
                </div>
                <div className="font-mono text-xs text-gray-400">{contenders.length}</div>
              </div>

              {contenders.length === 0 ? (
                <div className="mt-4 rounded border border-zinc-800 bg-black/20 px-3 py-3 text-sm text-gray-400">
                  No contenders yet. Generate a preview to start the queue.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {contenders.map((contender) => {
                    const active = contender.contender_id === selectedContender?.contender_id;

                    return (
                      <button
                        type="button"
                        key={contender.contender_id}
                        onClick={() => {
                          setSelectedContenderId(contender.contender_id);
                          setConfirmationText("");
                          setResult(null);
                        }}
                        className={`w-full rounded border px-3 py-3 text-left transition-colors ${
                          active
                            ? "border-sky-700 bg-sky-950/20"
                            : "border-zinc-800 bg-black/20 hover:border-zinc-700 hover:bg-zinc-900/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-mono text-xs text-sky-300">
                              {contender.provisional_motion_id_preview}
                            </div>
                            <div className="mt-1 text-sm font-medium text-gray-100">
                              {contender.title}
                            </div>
                            {contender.subtitle ? (
                              <div className="mt-1 text-xs text-gray-500">
                                {contender.subtitle}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="rounded border border-zinc-700 bg-zinc-900/70 px-2 py-1 text-[11px] font-mono text-gray-300">
                              preview only
                            </span>
                            <span
                              className={`rounded border px-2 py-1 text-[11px] font-mono ${queueStateTone(
                                contender.queue_state,
                              )}`}
                            >
                              {queueStateLabel(contender.queue_state)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-[11px] text-gray-500">
                          not a motion package yet
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                          <div>
                            <div className="text-gray-500">generated</div>
                            <div className="font-mono text-gray-300">
                              {shortTs(contender.generated_at)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">basis</div>
                            <div className="font-mono text-gray-300">
                              {contender.basis_motion_id ?? "null"}
                            </div>
                          </div>
                        </div>

                        {contender.blocking_reasons[0] ? (
                          <div className="mt-3 rounded border border-amber-900/50 bg-amber-950/20 px-2 py-2 text-[11px] text-amber-200">
                            {contender.blocking_reasons[0]}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-sm font-semibold text-gray-200">Generate contender</div>
              <div className="mt-1 text-xs text-gray-500">
                Deterministic preview only. No LLM calls, no file writes, and no
                `.nexus/candidates/**` usage.
              </div>

              {selectedMotionId ? (
                <div className="mt-4 rounded border border-zinc-800 bg-black/20 px-3 py-3 text-xs text-gray-400">
                  Current canonical reference:
                  <div className="mt-1 font-mono text-gray-200">{selectedMotionId}</div>
                  {selectedMotionTitle ? (
                    <div className="mt-1 text-gray-500">{selectedMotionTitle}</div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4 space-y-3">
                <label className="block text-xs text-gray-400">
                  Title
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-1 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                  />
                </label>

                <label className="block text-xs text-gray-400">
                  Subtitle
                  <input
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                    className="mt-1 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-xs text-gray-400">
                    Program
                    <input
                      value={program}
                      onChange={(event) => setProgram(event.target.value)}
                      className="mt-1 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                    />
                  </label>

                  <label className="block text-xs text-gray-400">
                    Kind
                    <input
                      value={kind}
                      onChange={(event) => setKind(event.target.value)}
                      className="mt-1 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                    />
                  </label>
                </div>

                <label className="block text-xs text-gray-400">
                  Basis motion id
                  <input
                    value={basisMotionId}
                    onChange={(event) => setBasisMotionId(event.target.value)}
                    className="mt-1 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 font-mono text-sm text-gray-100"
                  />
                </label>

                <label className="block text-xs text-gray-400">
                  Bounded scope
                  <textarea
                    value={boundedScope}
                    onChange={(event) => setBoundedScope(event.target.value)}
                    className="mt-1 h-24 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                  />
                </label>

                <label className="block text-xs text-gray-400">
                  Touched paths
                  <textarea
                    value={touchedPaths}
                    onChange={(event) => setTouchedPaths(event.target.value)}
                    placeholder="one path per line"
                    className="mt-1 h-20 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 font-mono text-xs text-gray-100"
                  />
                </label>

                <label className="block text-xs text-gray-400">
                  Non-goals
                  <textarea
                    value={nonGoals}
                    onChange={(event) => setNonGoals(event.target.value)}
                    placeholder="one non-goal per line"
                    className="mt-1 h-20 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                  />
                </label>

                <label className="block text-xs text-gray-400">
                  Rationale
                  <textarea
                    value={rationale}
                    onChange={(event) => setRationale(event.target.value)}
                    className="mt-1 h-24 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                  />
                </label>

                <label className="block text-xs text-gray-400">
                  Risks
                  <textarea
                    value={risks}
                    onChange={(event) => setRisks(event.target.value)}
                    placeholder="one risk per line"
                    className="mt-1 h-20 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleGenerateContender}
                className="mt-4 rounded border border-sky-800/60 bg-sky-900/30 px-3 py-2 text-xs text-sky-100 hover:bg-sky-900/50"
              >
                Generate contender preview
              </button>
            </div>

            <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4">
              {!selectedContender ? (
                <div className="rounded border border-zinc-800 bg-black/20 px-4 py-6 text-sm text-gray-400">
                  Select a contender from the queue to inspect its preview-only package
                  and guarded promotion path.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="font-mono text-xs text-sky-300">
                        {selectedContender.provisional_motion_id_preview}
                      </div>
                      <div className="mt-1 text-xl font-semibold text-gray-100">
                        {selectedContender.title}
                      </div>
                      {selectedContender.subtitle ? (
                        <div className="mt-2 text-sm text-gray-400">
                          {selectedContender.subtitle}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded border border-zinc-800 bg-black/30 px-3 py-2 text-xs text-gray-400">
                      <div className="font-medium text-gray-200">preview only</div>
                      <div className="mt-1">not a motion package yet</div>
                      <div className="mt-1">
                        promotion creates the first real DRAFT package
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Provisional motion id
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.provisional_motion_id_preview}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Provisional branch
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.provisional_branch_name_preview}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Queue state
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {queueStateLabel(selectedContender.queue_state)}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Target repo
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.target_repo}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Base branch
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.base_branch}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Write root preview
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.write_root_preview}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Generated at
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {shortTs(selectedContender.generated_at)}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Generated from
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.generated_from_motion_id ?? "null"}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Basis motion
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.basis_motion_id ?? "null"}
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black/20 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Exact files
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-100">
                        {selectedContender.written_paths_preview.length}
                      </div>
                    </div>
                  </div>

                  <div className="rounded border border-zinc-800 bg-black/20 p-4">
                    <div className="text-sm font-semibold text-gray-200">
                      Exact DRAFT package preview
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Promotion writes exactly these 8 files if explicitly confirmed.
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedContender.draft_package.files.map((file) => (
                        <details
                          key={file.path}
                          className="rounded border border-zinc-800 bg-zinc-950/40"
                        >
                          <summary className="cursor-pointer list-none px-3 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="font-mono text-sm text-gray-100">
                                  {filePreviewLabel(file.path)}
                                </div>
                                <div className="mt-1 font-mono text-[11px] text-gray-500">
                                  {file.path}
                                </div>
                              </div>
                              <span className="rounded border border-zinc-700 bg-zinc-900/70 px-2 py-1 text-[11px] text-gray-300">
                                preview
                              </span>
                            </div>
                          </summary>
                          <pre className="max-h-72 overflow-auto border-t border-zinc-800 bg-black/40 p-3 text-xs leading-6 text-gray-200">
                            {file.content}
                          </pre>
                        </details>
                      ))}
                    </div>
                  </div>

                  <div className="rounded border border-zinc-800 bg-black/20 p-4">
                    <div className="text-sm font-semibold text-gray-200">
                      Promotion confirmation
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Type{" "}
                      <span className="font-mono text-gray-200">
                        {selectedContender.provisional_motion_id_preview}
                      </span>{" "}
                      to confirm guarded branch-only promotion. The server recomputes the
                      latest motion id at promotion time and rejects stale previews with
                      HTTP 409.
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                      <input
                        value={confirmationText}
                        onChange={(event) => setConfirmationText(event.target.value)}
                        placeholder={selectedContender.provisional_motion_id_preview}
                        className="rounded border border-zinc-800 bg-black/40 px-3 py-2 font-mono text-sm text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={handlePromoteSelectedContender}
                        disabled={
                          submitting ||
                          !promotion.enabled ||
                          confirmationText.trim() !==
                            selectedContender.provisional_motion_id_preview
                        }
                        className="rounded border border-emerald-800/60 bg-emerald-900/20 px-3 py-2 text-xs text-emerald-100 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-900/40 disabled:text-gray-500"
                      >
                        {submitting ? "Promoting..." : "Promote to draft branch"}
                      </button>
                    </div>

                    {!promotion.enabled ? (
                      <div className="mt-4 rounded border border-amber-900/50 bg-amber-950/20 px-3 py-3 text-xs text-amber-200">
                        Promotion disabled:
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          {promotion.blocking_reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {selectedContender.queue_state === "stale_preview" &&
                    selectedContender.blocking_reasons[0] ? (
                      <div className="mt-4 rounded border border-violet-900/50 bg-violet-950/20 px-3 py-3 text-xs text-violet-200">
                        {selectedContender.blocking_reasons[0]}
                      </div>
                    ) : null}

                    {selectedContender.promotion_result ? (
                      <div className="mt-4 rounded border border-emerald-900/50 bg-emerald-950/20 px-3 py-3 text-xs text-emerald-200">
                        <div>
                          Promoted: {selectedContender.promotion_result.motion_id}
                        </div>
                        <div className="mt-1 font-mono text-emerald-100">
                          {selectedContender.promotion_result.branch_name}
                        </div>
                        <div className="mt-1 font-mono text-emerald-100">
                          {selectedContender.promotion_result.commit_sha}
                        </div>
                        {selectedContender.promotion_result.compare_url ? (
                          <div className="mt-2 break-all text-emerald-100">
                            {selectedContender.promotion_result.compare_url}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {result && !result.ok ? (
                      <div className="mt-4 rounded border border-amber-900/50 bg-amber-950/20 px-3 py-3 text-xs text-amber-200">
                        {result.message}
                      </div>
                    ) : null}

                    {result && result.ok ? (
                      <div className="mt-4 text-xs text-gray-400">
                        {result.next_manual_action}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
