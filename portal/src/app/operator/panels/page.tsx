// portal/src/app/operator/panels/page.tsx
import Link from "next/link";
import { listPanelsIndex, type WinnerStatus } from "@/lib/panels/panelIndex";
import type { PanelProgressStatus } from "@/lib/panels/panelProgress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;

function firstParam(v: SearchParamValue): string | undefined {
    if (!v) return undefined;
    return Array.isArray(v) ? v[0] : v;
}

function sanitizeId(input?: string): string | undefined {
    const raw = (input ?? "").trim();
    if (!raw) return undefined;
    if (!/^[a-zA-Z0-9._-]+$/.test(raw)) return undefined;
    return raw.length > 140 ? raw.slice(0, 140) : raw;
}

function sanitizeStatus(input?: string): WinnerStatus | undefined {
    const raw = (input ?? "").trim().toUpperCase();
    if (raw === "UNKNOWN") return "UNKNOWN";
    if (raw === "SELECTED") return "SELECTED";
    return undefined;
}

function sanitizeCompleted(input?: string): boolean | undefined {
    const raw = (input ?? "").trim().toUpperCase();
    if (raw === "Y") return true;
    if (raw === "N") return false;
    return undefined; // ANY / missing
}

function sanitizeProgress(input?: string): PanelProgressStatus | undefined {
    const raw = (input ?? "").trim().toUpperCase();
    if (raw === "INVALID") return "INVALID";
    if (raw === "NEEDS_SCORES") return "NEEDS_SCORES";
    if (raw === "NEEDS_WINNER") return "NEEDS_WINNER";
    if (raw === "NEEDS_EVIDENCE") return "NEEDS_EVIDENCE";
    if (raw === "COMPLETE") return "COMPLETE";
    return undefined;
}

function isoDay(ts?: string) {
    if (!ts) return "—";
    return ts.length >= 10 ? ts.slice(0, 10) : ts;
}

function progressTone(status: PanelProgressStatus) {
    switch (status) {
        case "COMPLETE":
            return "text-emerald-300 border-emerald-800/50 bg-emerald-900/10";
        case "INVALID":
            return "text-red-300 border-red-800/50 bg-red-900/10";
        default:
            return "text-amber-300 border-amber-800/50 bg-amber-900/10";
    }
}

function buildPanelsHref(filters: {
    motionId?: string;
    panelId?: string;
    status?: WinnerStatus;
    completed?: boolean;
    progress?: PanelProgressStatus;
}) {
    const qp = new URLSearchParams();

    if (filters.motionId) qp.set("motionId", filters.motionId);
    if (filters.panelId) qp.set("panelId", filters.panelId);
    if (filters.status) qp.set("status", filters.status);
    if (typeof filters.completed === "boolean") qp.set("completed", filters.completed ? "Y" : "N");
    if (filters.progress) qp.set("progress", filters.progress);

    const qs = qp.toString();
    return qs ? `/operator/panels?${qs}` : "/operator/panels";
}

const antiExtensionProps = {
    autoComplete: "off" as const,
    spellCheck: false as const,
    "data-gramm": "false",
    "data-gramm_editor": "false",
    "data-enable-grammarly": "false",
    "data-lpignore": "true",
    "data-1p-ignore": "true",
    suppressHydrationWarning: true as const,
};

type RowModel = Awaited<ReturnType<typeof listPanelsIndex>>[number];

function PanelsTable({ rows }: { rows: React.ReactNode }) {
    return (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-gray-400 border-b border-zinc-800">
                    <tr>
                        <th className="px-4 py-3">Motion</th>
                        <th className="px-4 py-3">Panel</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Selector</th>
                        <th className="px-4 py-3">Bindings</th>
                        <th className="px-4 py-3">Bound</th>
                        <th className="px-4 py-3">Winner</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Progress</th>
                        <th className="px-4 py-3">Completed</th>
                        <th className="px-4 py-3 text-right">Evidence</th>
                        <th className="px-4 py-3 text-right">Candidates</th>
                        <th className="px-4 py-3">Updated</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">{rows}</tbody>
            </table>
        </div>
    );
}

function renderRow(it: RowModel) {
    const href = `/operator/panels/${it.motion_id}/${it.panel_id}`;

    const bindingsTone =
        it.total_slots === 0
            ? "text-gray-500 border-zinc-800 bg-zinc-950/30"
            : it.unknown_slots === 0
                ? "text-emerald-300 border-emerald-800/50 bg-emerald-900/10"
                : "text-amber-300 border-amber-800/50 bg-amber-900/10";

    const boundTone =
        it.total_slots === 0
            ? "text-gray-500"
            : it.unknown_slots === 0
                ? "text-emerald-300"
                : "text-amber-300";

    return (
        <tr key={`${it.motion_id}:${it.panel_id}`} className="hover:bg-zinc-900/40">
            <td className="px-4 py-3 font-mono text-gray-200">{it.motion_id}</td>

            <td className="px-4 py-3">
                <Link className="font-mono text-sky-300 hover:underline" href={href} prefetch={false}>
                    {it.panel_id}
                </Link>
            </td>

            <td className="px-4 py-3 font-mono text-gray-300">{it.role_id}</td>
            <td className="px-4 py-3 font-mono text-gray-300">{it.selector}</td>

            <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded border px-2 py-1 font-mono ${bindingsTone}`}>
                    {it.bindings_label}
                </span>
            </td>

            <td className={`px-4 py-3 font-mono ${boundTone}`}>
                {it.total_slots ? `${it.bound_slots}/${it.total_slots}` : "—"}
            </td>

            <td className="px-4 py-3 font-mono text-gray-300">{it.winner}</td>

            <td className="px-4 py-3 font-mono">
                <span className={it.winner_status === "SELECTED" ? "text-emerald-300" : "text-gray-500"}>
                    {it.winner_status}
                </span>
            </td>

            <td className="px-4 py-3 font-mono">
                <span
                    className={`inline-flex items-center rounded border px-2 py-1 ${progressTone(it.progress_status)}`}
                    title={it.progress_reason}
                >
                    {it.progress_status}
                </span>
            </td>

            <td className="px-4 py-3 font-mono">
                <span className={it.completed ? "text-emerald-300" : "text-amber-300"}>
                    {it.completed ? "Y" : "N"}
                </span>
            </td>

            <td className="px-4 py-3 text-right font-mono text-gray-300">{it.evidence_commands}</td>
            <td className="px-4 py-3 text-right font-mono text-gray-300">{it.candidates_count}</td>

            <td className="px-4 py-3 font-mono text-gray-400" suppressHydrationWarning>
                {isoDay(it.updated_at)}
            </td>
        </tr>
    );
}

export default async function PanelsIndexPage(props: {
    searchParams?: Promise<Record<string, SearchParamValue>> | Record<string, SearchParamValue>;
}) {
    const sp = (await Promise.resolve(props.searchParams ?? {})) as Record<string, SearchParamValue>;

    const motionId = sanitizeId(firstParam(sp.motionId));
    const panelId = sanitizeId(firstParam(sp.panelId));
    const status = sanitizeStatus(firstParam(sp.status));
    const completed = sanitizeCompleted(firstParam(sp.completed));
    const progress = sanitizeProgress(firstParam(sp.progress));

    const [allItems, items] = await Promise.all([
        listPanelsIndex(),
        listPanelsIndex({ motionId, panelId, status, completed, progress }),
    ]);

    const completedCount = items.filter((x) => x.completed).length;

    const queueCounts = {
        INVALID: allItems.filter((x) => x.progress_status === "INVALID").length,
        NEEDS_SCORES: allItems.filter((x) => x.progress_status === "NEEDS_SCORES").length,
        NEEDS_WINNER: allItems.filter((x) => x.progress_status === "NEEDS_WINNER").length,
        NEEDS_EVIDENCE: allItems.filter((x) => x.progress_status === "NEEDS_EVIDENCE").length,
        COMPLETE: allItems.filter((x) => x.progress_status === "COMPLETE").length,
    };

    const rows = items.map(renderRow);

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-100 p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-sky-400">Panels</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Index of panel artifacts discovered under{" "}
                        <span className="font-mono">.nexus/motions/*/panels/*</span>
                    </p>
                </div>
                <div className="text-xs text-gray-500 bg-zinc-900 px-3 py-2 rounded border border-gray-800">
                    Source: <span className="font-mono">.nexus/motions</span>
                </div>
            </div>

            <div className="mb-4 border border-zinc-800 rounded-lg bg-zinc-900/20 p-4">
                <div className="text-sm font-semibold text-gray-200 mb-3">Work Queue</div>
                <div className="flex flex-wrap gap-2 text-xs">
                    {(
                        [
                            ["INVALID", queueCounts.INVALID],
                            ["NEEDS_SCORES", queueCounts.NEEDS_SCORES],
                            ["NEEDS_WINNER", queueCounts.NEEDS_WINNER],
                            ["NEEDS_EVIDENCE", queueCounts.NEEDS_EVIDENCE],
                            ["COMPLETE", queueCounts.COMPLETE],
                        ] as Array<[PanelProgressStatus, number]>
                    ).map(([state, count]) => (
                        <Link
                            key={state}
                            href={buildPanelsHref({ progress: state })}
                            prefetch={false}
                            className={`inline-flex items-center gap-2 rounded border px-3 py-2 font-mono hover:bg-zinc-900 ${progressTone(state)}`}
                        >
                            <span>{state}</span>
                            <span className="text-gray-300">{count}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <form method="GET" className="mb-4 flex flex-wrap items-end gap-3" suppressHydrationWarning>
                <div>
                    <div className="text-[11px] text-gray-500 mb-1">motionId</div>
                    <input
                        {...antiExtensionProps}
                        name="motionId"
                        defaultValue={motionId ?? ""}
                        placeholder="motion-0010"
                        className="w-[200px] rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-mono text-gray-200 placeholder:text-gray-600"
                    />
                </div>

                <div>
                    <div className="text-[11px] text-gray-500 mb-1">panelId</div>
                    <input
                        {...antiExtensionProps}
                        name="panelId"
                        defaultValue={panelId ?? ""}
                        placeholder="JAI_DEV_BUILDER_PANEL_V0"
                        className="w-[320px] rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-mono text-gray-200 placeholder:text-gray-600"
                    />
                </div>

                <div>
                    <div className="text-[11px] text-gray-500 mb-1">status</div>
                    <select
                        {...antiExtensionProps}
                        name="status"
                        defaultValue={status ?? ""}
                        className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-mono text-gray-200"
                    >
                        <option value="">ANY</option>
                        <option value="UNKNOWN">UNKNOWN</option>
                        <option value="SELECTED">SELECTED</option>
                    </select>
                </div>

                <div>
                    <div className="text-[11px] text-gray-500 mb-1">progress</div>
                    <select
                        {...antiExtensionProps}
                        name="progress"
                        defaultValue={progress ?? ""}
                        className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-mono text-gray-200"
                    >
                        <option value="">ANY</option>
                        <option value="INVALID">INVALID</option>
                        <option value="NEEDS_SCORES">NEEDS_SCORES</option>
                        <option value="NEEDS_WINNER">NEEDS_WINNER</option>
                        <option value="NEEDS_EVIDENCE">NEEDS_EVIDENCE</option>
                        <option value="COMPLETE">COMPLETE</option>
                    </select>
                </div>

                <div>
                    <div className="text-[11px] text-gray-500 mb-1">completed</div>
                    <select
                        {...antiExtensionProps}
                        name="completed"
                        defaultValue={typeof completed === "boolean" ? (completed ? "Y" : "N") : ""}
                        className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-mono text-gray-200"
                    >
                        <option value="">ANY</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-gray-200 hover:bg-zinc-900"
                >
                    Apply
                </button>

                <Link
                    href="/operator/panels"
                    className="rounded border border-zinc-800 bg-transparent px-3 py-2 text-xs text-gray-400 hover:bg-zinc-900 hover:text-gray-200"
                    prefetch={false}
                >
                    Clear
                </Link>

                <div className="ml-auto flex items-center gap-4 text-xs text-gray-500" suppressHydrationWarning>
                    <div>
                        Found <span className="font-mono text-gray-200">{items.length}</span>
                    </div>
                    <div>
                        Completed <span className="font-mono text-emerald-300">{completedCount}</span>
                    </div>
                </div>
            </form>

            {items.length === 0 ? (
                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-5 text-gray-300">
                    <div className="font-semibold mb-2">No panels found</div>
                    <div className="text-sm text-gray-400">
                        Expected path: <span className="font-mono">.nexus/motions/*/panels/*</span>
                    </div>
                </div>
            ) : (
                <PanelsTable rows={rows} />
            )}
        </div>
    );
}
