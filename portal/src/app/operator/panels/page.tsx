import Link from "next/link";
import { listPanelsIndex } from "@/lib/panels/panelIndex";

export const dynamic = "force-dynamic";

export default async function PanelsIndexPage() {
    const items = await listPanelsIndex();

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-100 p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-sky-400">Panels</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Index of panel artifacts discovered under <span className="font-mono">.nexus/motions/*/panels/*</span>
                    </p>
                </div>
                <div className="text-xs text-gray-500 bg-zinc-900 px-3 py-2 rounded border border-gray-800">
                    Source: <span className="font-mono">.nexus/motions</span>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-5 text-gray-300">
                    <div className="font-semibold mb-2">No panels found</div>
                    <div className="text-sm text-gray-400">
                        Create one with:{" "}
                        <span className="font-mono">
                            node portal/scripts/panel-run.mjs scaffold --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0
                        </span>
                    </div>
                </div>
            ) : (
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-900 text-gray-400 border-b border-zinc-800">
                            <tr>
                                <th className="px-4 py-3">Motion</th>
                                <th className="px-4 py-3">Panel</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Winner</th>
                                <th className="px-4 py-3">Task</th>
                                <th className="px-4 py-3 text-right">Candidates</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {items.map((it) => (
                                <tr key={`${it.motion_id}:${it.panel_id}`} className="hover:bg-zinc-900/40">
                                    <td className="px-4 py-3 font-mono">{it.motion_id}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            className="font-mono text-sky-300 hover:underline"
                                            href={`/operator/panels/${it.motion_id}/${it.panel_id}`}
                                        >
                                            {it.panel_id}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-gray-300">{it.role_id}</td>
                                    <td className="px-4 py-3 font-mono text-gray-300">{it.winner}</td>
                                    <td className="px-4 py-3 text-gray-400 max-w-[420px] truncate" title={it.task}>
                                        {it.task}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-300">{it.candidates_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
