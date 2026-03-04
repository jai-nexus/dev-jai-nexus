import { loadPanelView } from "@/lib/panels/panelStore";

export const dynamic = "force-dynamic";

function safeStr(v: unknown, fallback = "UNKNOWN") {
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
}

function num(v: unknown, fallback = 0) {
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

type Params = { motionId: string; panelId: string };

export default async function PanelViewerPage(props: { params: Promise<Params> | Params }) {
    // Next 16: params may be a Promise — unwrap it safely.
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
                    <div className="text-sm text-gray-300 space-y-1">
                        <div>
                            <span className="text-gray-500">winner:</span>{" "}
                            <span className="font-mono text-emerald-300">{winner}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">task:</span>{" "}
                            <span className="font-mono">{safeStr(selection.task)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">motion_id:</span>{" "}
                            <span className="font-mono">{safeStr(selection.motion_id)}</span>
                        </div>
                    </div>
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

                            {scoreEntries.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-3 text-gray-500" colSpan={2 + rubric.length}>
                                        No scores found in selection.json
                                    </td>
                                </tr>
                            ) : null}
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
