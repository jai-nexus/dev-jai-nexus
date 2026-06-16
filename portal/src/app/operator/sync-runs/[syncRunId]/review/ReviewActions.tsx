"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { OperatorBadge } from "@/components/operator/slate";

type Action = "apply" | "reject";

type ApiResult =
  | { ok: true; data?: unknown; detail?: unknown }
  | { ok: false; error: string; detail?: unknown };

function payloadMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  if ("error" in payload && typeof payload.error === "string") {
    return payload.error;
  }
  if ("message" in payload && typeof payload.message === "string") {
    return payload.message;
  }
  return null;
}

function prettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function ReviewButtons({ syncRunId }: { syncRunId: number }) {
  const router = useRouter();

  const [busyAction, setBusyAction] = useState<Action | null>(null);
  const [holdReject, setHoldReject] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const isBusy = busyAction !== null;

  const rejectLabel = useMemo(() => {
    if (busyAction === "reject") return "Rejecting...";
    return holdReject ? "Release to Cancel" : "Hold to Reject";
  }, [busyAction, holdReject]);

  async function callAction(action: Action) {
    setBusyAction(action);
    setResult(null);

    try {
      // IMPORTANT: call operator proxy route, not internal route.
      // This is pre-existing mutation behavior; Slate containment does not add authority.
      const res = await fetch(`/api/operator/sync-runs/${syncRunId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let payload: unknown = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          payload = await res.json();
        } catch {
          payload = null;
        }
      } else {
        try {
          payload = { message: await res.text() };
        } catch {
          payload = null;
        }
      }

      if (res.ok) {
        setResult({ ok: true, data: payload });
        router.refresh();
      } else {
        const msg = payloadMessage(payload) || `Request failed (${res.status})`;
        setResult({ ok: false, error: msg, detail: payload ?? undefined });
      }
    } catch (e: unknown) {
      setResult({
        ok: false,
        error: "Network error calling API",
        detail: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setBusyAction(null);
      setHoldReject(false);
    }
  }

  async function onApprove() {
    if (isBusy) return;
    const ok = window.confirm("Approve & apply staged edits?");
    if (!ok) return;
    await callAction("apply");
  }

  function onRejectMouseDown() {
    if (isBusy) return;
    setHoldReject(true);
  }

  function onRejectMouseUp() {
    if (isBusy) return;
    if (!holdReject) return;
    void callAction("reject");
  }

  function onRejectMouseLeave() {
    if (isBusy) return;
    setHoldReject(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <OperatorBadge tone="gated">PRE-EXISTING MUTATION</OperatorBadge>
        <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onApprove}
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-2 rounded border border-amber-700 bg-amber-950/50 px-4 py-2 text-sm font-semibold text-amber-100 shadow-sm transition hover:bg-amber-900/50 disabled:opacity-50 disabled:hover:bg-amber-950/50"
        >
          {busyAction === "apply" ? (
            <span className="animate-pulse">Applying...</span>
          ) : (
            <>
              <span aria-hidden>!</span>
              <span>Apply staged edits</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isBusy}
          onMouseDown={onRejectMouseDown}
          onMouseUp={onRejectMouseUp}
          onMouseLeave={onRejectMouseLeave}
          onTouchStart={onRejectMouseDown}
          onTouchEnd={onRejectMouseUp}
          className={`inline-flex items-center justify-center gap-2 rounded border px-4 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${
            holdReject
              ? "border-red-500/40 bg-red-600 text-white"
              : "border-red-900 bg-red-950/60 text-red-100 hover:bg-red-900/60"
          }`}
          title="Hold to confirm reject"
        >
          {busyAction === "reject" ? (
            <span className="animate-pulse">Rejecting...</span>
          ) : (
            <>
              <span aria-hidden>x</span>
              <span>{rejectLabel}</span>
            </>
          )}
        </button>
      </div>

      {result ? (
        <div
          className={`rounded border px-4 py-3 text-sm ${
            result.ok
              ? "border-sky-500/25 bg-sky-500/10 text-sky-200"
              : "border-red-500/25 bg-red-500/10 text-red-200"
          }`}
        >
          <div className="font-semibold">{result.ok ? "Result" : "Failed"}</div>

          {!result.ok ? <div className="mt-1">{result.error}</div> : null}

          {result.detail != null ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs opacity-80">
                Details
              </summary>
              <pre className="mt-2 overflow-auto rounded border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                {prettyJson(result.detail)}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}

      <div className="text-xs text-slate-500">
        Existing mutation controls are not new Slate authority. Actions are
        routed via the pre-existing operator API.
      </div>
    </div>
  );
}
