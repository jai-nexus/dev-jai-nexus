import { loadPanelView, loadPanelCore, writePanelSelection } from "@/lib/panels/panelStore";
import { computeSelection, computeSlotTotal, normalizeBreakdown } from "@/lib/panels/panelSelectCore.mjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeStr(v: unknown, fallback = "UNKNOWN") {
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
}

function num(v: unknown, fallback = 0) {
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function clamp10(v: unknown) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    if (n < 0) return 0;
    if (n > 10) return 10;
    return n;
}

type Params = { motionId: string; panelId: string };

// -------- server actions (write lane) --------
async function saveSlotScores(formData: FormData) {
    "use server";

    const motionId = safeStr(formData.get("motionId"), "");
    const panelId = safeStr(formData.get("panelId"), "");
    const slot = safeStr(formData.get("slot"), "");

    if (!motionId || !panelId || !slot) {
        redirect(`/operator/panels/${encodeURIComponent(motionId)}/${encodeURIComponent(panelId)}?err=missing`);
    }

    const core = await loadPanelCore({ motionId, panelId });
    const rubric = Array.isArray(core.panel.rubric) ? core.panel.rubric : [];

    const sel = { ...core.selection };
    sel.motion_id = core.motion_id;
    sel.panel_id = core.panel_id;

    sel.scores = { ...(sel.scores || {}) };
    const entry = sel.scores[slot] ?? { total: 0, breakdown: {} };

    const nextBreakdown: Record<string, number> = { ...(entry.breakdown || {}) };
    for (const r of rubric) {
        const id = String((r as any)?.id ?? "").trim();
        if (!id) continue;
        const v = clamp10(formData.get(`score_${id}`));
        nextBreakdown[id] = v;
    }

    const normalized = normalizeBreakdown(nextBreakdown, rubric);
    const total = computeSlotTotal(normalized, rubric);

    sel.scores[slot] = { total, breakdown: normalized };

    // do not change winner here — winner is computed explicitly via the action below
    await writePanelSelection({ motionId, panelId, selection: sel });

    redirect(`/operator/panels/${encodeURIComponent(motionId)}/${encodeURIComponent(panelId)}?saved=${encodeURIComponent(slot)}`);
}

async function computeWinnerAction(formData: FormData) {
    "use server";

    const motionId = safeStr(formData.get("motionId"), "");
    const panelId = safeStr(formData.get("panelId"), "");

    const core = await loadPanelCore({ motionId, panelId });
    const { next } = computeSelection(core.panel, core.selection, { forceWinner: false });

    // keep ids consistent
    next.motion_id = core.motion_id;
    next.panel_id = core.panel_id;

    await writePanelSelection({ motionId, panelId, selection: next });

    redirect(`/operator/panels/${encodeURIComponent(motionId)}/${encodeURIComponent(panelId)}?computed=1`);
}

export default async function PanelViewerPage(props: { params: Promise<Params> | Params }) {
    const resolvedParams = (await Promise.resolve(props.params)) as Params;
    const motionId = resolvedParams?.motionId;
    const panelId = resolvedParams?.panelId;

    let view: Awaited<ReturnType<typeof loadPanelView>> | null = null;
    let err: string | null = null;

    try {
        view = await loadPanelView({ motionId, panelId });
    } catch (e: any) {
        err = e?.message || String(e);
    }

    if (!view) {
        return (
            <div className="min-h-screen bg-zinc-950 text-gray-100 p-8">
                <h1 className="text-2xl font-bold text-red-400 mb-3">Panel Viewer Unavailable</h1>
                <p className="text-sm text-gray-400 mb-6">
                    Could not load panel artifacts for{" "}
                    <span className="font-mono">{motionId ?? "(missing motionId)"}</span> /{" "}
                    <span className="font-mono">{panelId ?? "(missing panelId)"}</span>.
                </p>

                <pre className="text-xs bg-zinc-900 border border-zinc-800 rounded p-4 overflow-x-auto">
                    {err ?? "UNKNOWN_ERROR"}
                </pre>

                <div className="mt-6 text-sm text-gray-300">
                    <p className="mb-2">Checklist:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>
                            Ensure panel scaffold exists under{" "}
                            <span className="font-mono">.nexus/motions/{motionId}/panels/{panelId}</span>
                        </li>
                        <li>
                            Run:{" "}
                            <span className="font-mono">
                                node portal/scripts/panel-run.mjs scaffold --motion {motionId} --panel {panelId}
                            </span>
                        </li>
                        <li>
                            Confirm <span className="font-mono">panel.json</span> and{" "}
                            <span className="font-mono">selection.json</span> exist
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    const { panel, selection, candidates, motion_id, panel_id } = view;

    const rubric = Array.isArray(panel.rubric) ? panel.rubric : [];
    const scoreEntries = Object.entries(selection.scores ?? {}).map(([slot, v]) => ({
        slot,
        total: num((v as any)?.total, 0),
        breakdown: (v as any)?.breakdown ?? {},
    }));

    scoreEntries.sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return a.slot.localeCompare(b.slot);
    });

    const winner = safeStr(selection.winner, "UNKNOWN");

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-100 p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-sky-400">Panel Viewer</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Motion <span className="font-mono">{motion_id}</span> · Panel{" "}
                        <span className="font-mono">{panel_id}</span>
                    </p>
                </div>
                <div className="text-xs text-gray-500 bg-zinc-900 px-3 py-2 rounded border border-gray-800">
                    Source: <span className="font-mono">.nexus/motions/*/panels/*</span>
                </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-4">
                    <h2 className="font-semibold text-gray-200 mb-2">Panel Meta</h2>
                    <div className="text-sm text-gray-300 space-y-1">
                        <div>
                            <span className="text-gray-500">role_id:</span>{" "}
                            <span className="font-mono">{safeStr((panel as any).role_id)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">selector:</span>{" "}
                            <span className="font-mono">{safeStr((panel as any).selector)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">candidates:</span>{" "}
                            <span className="font-mono">{((panel as any).candidates ?? []).join(", ") || "—"}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-4">
                    <h2 className="font-semibold text-gray-200 mb-2">Selection</h2>
                    <div className="text-sm text-gray-300 space-y-2">
                        <div>
                            <span className="text-gray-500">winner:</span>{" "}
                            <span className="font-mono text-emerald-300">{winner}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">task:</span>{" "}
                            <span className="font-mono">{safeStr(selection.task)}</span>
                        </div>

                        <form action={computeWinnerAction} className="pt-2">
                            <input type="hidden" name="motionId" value={motion_id} />
                            <input type="hidden" name="panelId" value={panel_id} />
                            <button
                                type="submit"
                                className="text-xs px-3 py-2 rounded border border-emerald-800 bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-200"
                            >
                                Compute winner (recalc totals)
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Score Entry */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
                <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800">
                    <h2 className="font-semibold text-gray-200">Score Entry</h2>
                    <p className="text-xs text-gray-500 mt-1">Enter 0–10 per criterion. Save updates totals for that slot. Winner updates when you compute.</p>
                </div>

                <div className="divide-y divide-zinc-800">
                    {scoreEntries.map((e) => (
                        <details key={e.slot} className="px-4 py-3">
                            <summary className="cursor-pointer text-sm text-gray-200 font-mono">
                                {e.slot} <span className="text-gray-500">· total</span>{" "}
                                <span className="text-gray-300">{e.total}</span>
                                {e.slot === winner ? <span className="text-emerald-300"> ★</span> : null}
                            </summary>

                            <form action={saveSlotScores} className="mt-3">
                                <input type="hidden" name="motionId" value={motion_id} />
                                <input type="hidden" name="panelId" value={panel_id} />
                                <input type="hidden" name="slot" value={e.slot} />

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border border-zinc-800 rounded">
                                        <thead className="bg-zinc-900/60 text-gray-400 border-b border-zinc-800">
                                            <tr>
                                                <th className="px-3 py-2">criterion</th>
                                                <th className="px-3 py-2">weight</th>
                                                <th className="px-3 py-2">score (0–10)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {rubric.map((r: any) => (
                                                <tr key={r.id}>
                                                    <td className="px-3 py-2 font-mono text-gray-200">{r.id}</td>
                                                    <td className="px-3 py-2 font-mono text-gray-400">{Number(r.weight).toFixed(2)}</td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            name={`score_${r.id}`}
                                                            defaultValue={num((e.breakdown as any)?.[r.id], 0)}
                                                            className="w-24 px-2 py-1 rounded bg-zinc-950 border border-zinc-800 font-mono text-gray-200"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        className="text-xs px-3 py-2 rounded border border-sky-800 bg-sky-900/20 hover:bg-sky-900/30 text-sky-200"
                                    >
                                        Save slot scores
                                    </button>
                                </div>
                            </form>
                        </details>
                    ))}

                    {scoreEntries.length === 0 ? (
                        <div className="px-4 py-4 text-sm text-gray-500">No scores found in selection.json</div>
                    ) : null}
                </div>
            </div>

            {/* Score Table */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
                <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800">
                    <h2 className="font-semibold text-gray-200">Scores</h2>
                    <p className="text-xs text-gray-500 mt-1">Sorted by total desc. Totals should be 0–100.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-900/60 text-gray-400 border-b border-zinc-800">
                            <tr>
                                <th className="px-4 py-2">Slot</th>
                                <th className="px-4 py-2">Total</th>
                                {rubric.map((r: any) => (
                                    <th key={r.id} className="px-4 py-2">
                                        {r.id} <span className="text-gray-600">({Number(r.weight).toFixed(2)})</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-800">
                            {scoreEntries.map((e) => {
                                const isWinner = e.slot === winner;
                                return (
                                    <tr key={e.slot} className={isWinner ? "bg-emerald-900/10" : "hover:bg-zinc-900/40"}>
                                        <td className="px-4 py-2 font-mono text-gray-200">
                                            {isWinner ? <span className="text-emerald-300">★ </span> : null}
                                            {e.slot}
                                        </td>
                                        <td className="px-4 py-2 font-mono text-gray-200">{e.total}</td>
                                        {rubric.map((r: any) => (
                                            <td key={r.id} className="px-4 py-2 font-mono text-gray-400">
                                                {num((e.breakdown as any)?.[r.id], 0)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Candidates */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800">
                    <h2 className="font-semibold text-gray-200">Candidates</h2>
                    <p className="text-xs text-gray-500 mt-1">Previews are truncated for safety/readability.</p>
                </div>

                <div className="divide-y divide-zinc-800">
                    {candidates.map((c) => (
                        <details key={c.filename} className="px-4 py-3">
                            <summary className="cursor-pointer text-sm text-gray-200 font-mono">{c.filename}</summary>
                            <pre className="mt-3 text-xs bg-zinc-950 border border-zinc-800 rounded p-3 overflow-x-auto text-gray-300">
                                {c.preview}
                            </pre>
                        </details>
                    ))}

                    {candidates.length === 0 ? (
                        <div className="px-4 py-4 text-sm text-gray-500">No candidate markdown files found.</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
