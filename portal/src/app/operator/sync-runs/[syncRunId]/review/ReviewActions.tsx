"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Action = "apply" | "reject";

type ApiResult =
    | { ok: true; data?: unknown; detail?: unknown }
    | { ok: false; error: string; detail?: unknown };

function prettyJson(v: unknown) {
    try {
        return JSON.stringify(v, null, 2);
    } catch {
        return String(v);
    }
}

export default function ReviewButtons({ syncRunId }: { syncRunId: number }) {
    const router = useRouter();

    const [busyAction, setBusyAction] = useState<Action | null>(null);
    const [holdReject, setHoldReject] = useState(false);
    const [result, setResult] = useState<ApiResult | null>(null);

    const isBusy = busyAction !== null;

    const rejectLabel = useMemo(() => {
        if (busyAction === "reject") return "Rejecting…";
        return holdReject ? "Release to Cancel" : "Hold to Reject";
    }, [busyAction, holdReject]);

    async function callAction(action: Action) {
        setBusyAction(action);
        setResult(null);

        try {
            // IMPORTANT: call operator proxy route, not internal route
            const res = await fetch(`/api/operator/sync-runs/${syncRunId}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            let payload: any = null;
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                try {
                    payload = await res.json();
                } catch {
                    payload = null;
                }
            } else {
                // if non-JSON, try text (helps debugging)
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
                const msg =
                    (payload && (payload.error || payload.message)) ||
                    `Request failed (${res.status})`;
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                    type="button"
                    onClick={onApprove}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-600/90"
                >
                    {busyAction === "apply" ? (
                        <span className="animate-pulse">Applying…</span>
                    ) : (
                        <>
                            <span aria-hidden>✓</span>
                            <span>Approve & Apply</span>
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
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${holdReject
                            ? "border-red-500/40 bg-red-600 text-white"
                            : "border-white/10 bg-red-600/85 text-white hover:bg-red-600"
                        }`}
                    title="Hold to confirm reject"
                >
                    {busyAction === "reject" ? (
                        <span className="animate-pulse">Rejecting…</span>
                    ) : (
                        <>
                            <span aria-hidden>✕</span>
                            <span>{rejectLabel}</span>
                        </>
                    )}
                </button>
            </div>

            {result && (
                <div
                    className={`rounded-xl border px-4 py-3 text-sm ${result.ok
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                            : "border-red-500/25 bg-red-500/10 text-red-200"
                        }`}
                >
                    <div className="font-semibold">{result.ok ? "Success" : "Failed"}</div>

                    {!result.ok && <div className="mt-1">{result.error}</div>}

                    {result.detail != null && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-xs opacity-80">
                                Details
                            </summary>
                            <pre className="mt-2 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/80">
                                {prettyJson(result.detail)}
                            </pre>
                        </details>
                    )}
                </div>
            )}

            <div className="text-xs text-white/40">
                Note: actions are routed via operator API (server-side).
            </div>
        </div>
    );
}
