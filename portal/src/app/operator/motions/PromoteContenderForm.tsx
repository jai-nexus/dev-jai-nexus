"use client";

import { useEffect, useState } from "react";
import {
  buildMotionContenderPreview,
  parseMotionNumber,
  type MotionContenderPreview,
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
    selectedMotionProgram ?? "q2-motion-contender-draft-promotion-v0",
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

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as MotionContenderPreview[];
      if (!Array.isArray(parsed)) return;
      setContenders(parsed);
      setSelectedContenderId(parsed[0]?.contender_id ?? null);
    } catch {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(contenders));
  }, [contenders]);

  useEffect(() => {
    if (!selectedMotionId) return;
    setBasisMotionId((current) => current || selectedMotionId);
  }, [selectedMotionId]);

  const selectedContender =
    contenders.find((contender) => contender.contender_id === selectedContenderId) ??
    contenders[0] ??
    null;

  function nextPreviewBase(): number {
    return contenders.reduce((currentMax, contender) => {
      return Math.max(currentMax, parseMotionNumber(contender.provisional_motion_id));
    }, highestMotionNumber);
  }

  function handleGenerateContender() {
    if (!title.trim() || !boundedScope.trim() || !rationale.trim()) {
      setResult({
        ok: false,
        error: "missing_required_fields",
        message: "Title, bounded scope, and rationale are required to generate a contender.",
      });
      return;
    }

    const generatedAt = new Date().toISOString();
    const contender = buildMotionContenderPreview({
      highestMotionNumber: nextPreviewBase(),
      generatedAt,
      baseBranch: promotion.base_branch,
      input: {
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
      },
    });

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
          const rebuilt = buildMotionContenderPreview({
            highestMotionNumber: parseMotionNumber(errorPayload.expected_motion_id) - 1,
            generatedAt: selectedContender.generated_at,
            baseBranch: promotion.base_branch,
            input: selectedContender.input,
          });

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
    <section className="rounded border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-100">
            Motion contender queue and DRAFT promotion
          </div>
          <div className="mt-1 max-w-3xl text-xs text-gray-500">
            Preview-only contender generation is session-local. Promotion is explicit,
            branch-only, same-repo only, and never writes directly to the default branch.
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

      <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-4 rounded border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Contender builder
          </div>

          <div className="space-y-3">
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
                className="mt-1 h-28 w-full rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-gray-100"
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
            className="rounded border border-sky-800/60 bg-sky-900/30 px-3 py-2 text-xs text-sky-100 hover:bg-sky-900/50"
          >
            Generate contender preview
          </button>

          <div className="rounded border border-zinc-800 bg-black/30 px-3 py-3 text-xs text-gray-400">
            Preview boundary:
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>no LLM calls</li>
              <li>no filesystem writes</li>
              <li>no .nexus/candidates/** usage</li>
              <li>no motion package exists until explicit promotion succeeds</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-200">Session-local contenders</div>
                <div className="mt-1 text-xs text-gray-500">
                  Newest first. These previews are not repo state.
                </div>
              </div>
              <div className="font-mono text-xs text-gray-400">{contenders.length}</div>
            </div>

            {contenders.length === 0 ? (
              <div className="mt-4 rounded border border-zinc-800 bg-black/20 px-3 py-3 text-sm text-gray-400">
                No contender previews generated in this browser session.
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {contenders.map((contender) => (
                  <button
                    type="button"
                    key={contender.contender_id}
                    onClick={() => {
                      setSelectedContenderId(contender.contender_id);
                      setConfirmationText("");
                      setResult(null);
                    }}
                    className={`w-full rounded border px-3 py-3 text-left transition-colors ${
                      contender.contender_id === selectedContender?.contender_id
                        ? "border-sky-700 bg-sky-950/20"
                        : "border-zinc-800 bg-black/20 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-xs text-sky-300">
                          {contender.provisional_motion_id}
                        </div>
                        <div className="mt-1 text-sm font-medium text-gray-100">
                          {contender.input.title}
                        </div>
                      </div>
                      <span className="rounded border border-zinc-700 bg-zinc-900/70 px-2 py-1 text-[11px] font-mono text-gray-300">
                        preview
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedContender ? (
            <div className="space-y-4 rounded border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="font-mono text-xs text-sky-300">
                    {selectedContender.provisional_motion_id}
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-100">
                    {selectedContender.input.title}
                  </div>
                  {selectedContender.input.subtitle ? (
                    <div className="mt-2 text-sm text-gray-400">
                      {selectedContender.input.subtitle}
                    </div>
                  ) : null}
                </div>

                <div className="rounded border border-zinc-800 bg-black/30 px-3 py-2 text-xs text-gray-400">
                  Preview only
                  <div className="mt-1">
                    Real motion package path:
                    <div className="font-mono text-gray-200">
                      {selectedContender.write_root}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded border border-zinc-800 bg-black/20 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">
                    Provisional branch
                  </div>
                  <div className="mt-1 font-mono text-sm text-gray-100">
                    {selectedContender.provisional_branch_name}
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
                <div className="text-sm font-semibold text-gray-200">Promotion confirmation</div>
                <div className="mt-2 text-xs text-gray-500">
                  Type <span className="font-mono text-gray-200">{selectedContender.provisional_motion_id}</span>{" "}
                  to confirm branch-only promotion. The server will recompute the next motion id at
                  promotion time and reject stale previews with HTTP 409.
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    value={confirmationText}
                    onChange={(event) => setConfirmationText(event.target.value)}
                    placeholder={selectedContender.provisional_motion_id}
                    className="rounded border border-zinc-800 bg-black/40 px-3 py-2 font-mono text-sm text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={handlePromoteSelectedContender}
                    disabled={
                      submitting ||
                      !promotion.enabled ||
                      confirmationText.trim() !== selectedContender.provisional_motion_id
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

                {result ? (
                  result.ok ? (
                    <div className="mt-4 rounded border border-emerald-900/50 bg-emerald-950/20 px-3 py-3 text-xs text-emerald-200">
                      <div>Promoted: {result.motion_id}</div>
                      <div className="mt-1 font-mono text-emerald-100">{result.branch_name}</div>
                      <div className="mt-1 font-mono text-emerald-100">{result.commit_sha}</div>
                      {result.compare_url ? (
                        <div className="mt-2 break-all text-emerald-100">
                          {result.compare_url}
                        </div>
                      ) : null}
                      <div className="mt-2 text-emerald-100">{result.next_manual_action}</div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded border border-amber-900/50 bg-amber-950/20 px-3 py-3 text-xs text-amber-200">
                      {result.message}
                    </div>
                  )
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
