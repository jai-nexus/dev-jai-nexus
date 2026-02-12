// portal/src/app/operator/dct/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";
import { formatCentral, formatCentralTooltip } from "@/lib/time";
import { DCT_KINDS } from "@/lib/contracts/dctV01";

const kindLabels: Record<string, string> = {
    [DCT_KINDS.IDEA_CREATE]: "CREATE",
    [DCT_KINDS.IDEA_REVISE]: "REVISE",
    [DCT_KINDS.IDEA_STATUS]: "STATUS",
    [DCT_KINDS.IDEA_EDGE]: "EDGE",
    [DCT_KINDS.SLOT_BIND]: "SLOT",
};

const kindColors: Record<string, string> = {
    [DCT_KINDS.IDEA_CREATE]: "bg-emerald-900/40 text-emerald-300",
    [DCT_KINDS.IDEA_REVISE]: "bg-amber-900/40 text-amber-300",
    [DCT_KINDS.IDEA_STATUS]: "bg-purple-900/40 text-purple-300",
    [DCT_KINDS.IDEA_EDGE]: "bg-blue-900/40 text-blue-300",
    [DCT_KINDS.SLOT_BIND]: "bg-sky-900/40 text-sky-300",
};

const ideaStatusColors: Record<string, string> = {
    active: "bg-emerald-900/40 text-emerald-300",
    promoted: "bg-sky-900/40 text-sky-300",
    deprecated: "bg-red-900/40 text-red-300",
    superseded: "bg-amber-900/40 text-amber-300",
    draft: "bg-zinc-800/40 text-zinc-400",
};

export default async function DctPage() {
    // Load all DCT events from SotEvent table
    const rawEvents = await prisma.sotEvent.findMany({
        where: { kind: { startsWith: "dct." } },
        orderBy: [{ ts: "desc" }, { eventId: "desc" }],
        take: 500,
    });

    const events: DctEventInput[] = rawEvents.map((e) => ({
        eventId: e.eventId,
        ts: e.ts,
        kind: e.kind,
        source: e.source,
        summary: e.summary,
        payload: e.payload as unknown,
        nhId: e.nhId,
    }));

    // Run projection
    const projection = applyDct(events);

    const operatingSet = projection.operatingSet;
    const activeIdeas = projection.activeIdeas;
    const edges = projection.edges;
    const m = projection.metrics;
    const slotEntries = Object.entries(projection.slots).sort(([a], [b]) =>
        a.localeCompare(b)
    );

    const totalSkipped =
        m.eventsSkippedInvalidPayload +
        m.eventsSkippedKindPayloadMismatch +
        m.eventsSkippedUnknownIdea;

    const hasLegacy = m.eventsWithLegacyAnchors > 0;

    return (
        <main className="min-h-screen bg-black text-gray-100 p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold">
                    JAI NEXUS · DCT Projection
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Deterministic Concept Tracking — governance-grade projection
                    from the SoT event stream.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6 mb-4">
                    <StatCard label="Total Ideas" value={m.totalIdeas} />
                    <StatCard label="Active" value={m.activeIdeasCount} />
                    <StatCard
                        label="Operating"
                        value={m.operatingIdeasCount}
                        highlight
                    />
                    <StatCard label="Edges" value={m.edgeCount} />
                    <StatCard label="Slots" value={m.slotCount} />
                    <StatCard label="Processed" value={m.eventsProcessed} />
                    <StatCard
                        label="Skipped"
                        value={totalSkipped}
                        warn={totalSkipped > 0}
                    />
                    <StatCard
                        label="Legacy Anchors"
                        value={m.eventsWithLegacyAnchors}
                        warn={hasLegacy}
                    />
                </div>

                {/* Quality breakdown if any skipped */}
                {(totalSkipped > 0 || hasLegacy) && (
                    <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 mb-4 text-xs text-amber-300 font-mono space-y-0.5">
                        <p className="font-semibold mb-1 text-amber-200">
                            ⚠ Extraction Quality Diagnostics
                        </p>
                        {m.eventsSkippedInvalidPayload > 0 && (
                            <p>
                                Invalid payload:{" "}
                                {m.eventsSkippedInvalidPayload}
                            </p>
                        )}
                        {m.eventsSkippedKindPayloadMismatch > 0 && (
                            <p>
                                Kind ≠ payload.type:{" "}
                                {m.eventsSkippedKindPayloadMismatch}
                            </p>
                        )}
                        {m.eventsSkippedUnknownIdea > 0 && (
                            <p>
                                Unknown idea ref:{" "}
                                {m.eventsSkippedUnknownIdea}
                            </p>
                        )}
                        {m.eventsWithLegacyAnchors > 0 && (
                            <p>
                                Events with legacy anchors:{" "}
                                {m.eventsWithLegacyAnchors}
                            </p>
                        )}
                    </div>
                )}
            </header>

            {/* ──────── Operating Set (Slot Truth) ──────── */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-1 text-gray-200">
                    Operating Set
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    Ideas currently bound via slots — the governance truth.
                </p>

                {operatingSet.length === 0 ? (
                    <EmptyState message="No slot-bound ideas. Run dct:extract and bind slots to populate." />
                ) : (
                    <div className="space-y-2">
                        {operatingSet.map((idea) => (
                            <IdeaCard key={idea.id} idea={idea} />
                        ))}
                    </div>
                )}
            </section>

            {/* ──────── Active Ideas (Informational) ──────── */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-1 text-gray-200">
                    Active Ideas
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    All ideas with status active or promoted (informational —
                    not necessarily slot-bound).
                </p>

                {activeIdeas.length === 0 ? (
                    <EmptyState message="No active ideas. Run dct:extract to populate." />
                ) : (
                    <div className="space-y-2">
                        {activeIdeas.map((idea) => (
                            <IdeaCard key={idea.id} idea={idea} />
                        ))}
                    </div>
                )}
            </section>

            {/* ──────── Slot Bindings ──────── */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">
                    Slot Bindings
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    Named pointers linking concepts to their current state.
                </p>

                {slotEntries.length === 0 ? (
                    <EmptyState message="No slot bindings yet." />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                                <tr>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Slot
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Bound Idea
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Idea Text
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Anchor
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Bound At
                                    </th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {slotEntries.map(([slot, binding]) => {
                                    const idea =
                                        projection.ideas[binding.ideaId];
                                    return (
                                        <tr
                                            key={slot}
                                            className="border-b border-gray-900 hover:bg-zinc-900/60"
                                        >
                                            <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-sky-400">
                                                {slot}
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-500">
                                                {binding.ideaId}
                                            </td>
                                            <td className="py-2 px-3 text-xs max-w-md truncate">
                                                {idea?.text ?? "—"}
                                            </td>
                                            <td className="py-2 px-3 text-xs font-mono text-zinc-500">
                                                {binding.anchor ? (
                                                    <AnchorBadge
                                                        anchor={binding.anchor}
                                                    />
                                                ) : (
                                                    <span className="text-zinc-700">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                className="py-2 px-3 whitespace-nowrap text-xs text-zinc-500"
                                                title={formatCentralTooltip(
                                                    binding.ts
                                                )}
                                            >
                                                {formatCentral(binding.ts)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* ──────── Edges ──────── */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">
                    Edges
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    Directional relationships between ideas.
                </p>

                {edges.length === 0 ? (
                    <EmptyState message="No edges yet." />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                                <tr>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        From
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Relation
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        To
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Confidence
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Anchor
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {edges.map((edge, i) => (
                                    <tr
                                        key={`${edge.eventId}-${i}`}
                                        className="border-b border-gray-900 hover:bg-zinc-900/60"
                                    >
                                        <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-400">
                                            {edge.from}
                                        </td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs">
                                            <span className="inline-flex items-center rounded-full bg-blue-900/30 text-blue-300 px-2 py-0.5 text-[10px] font-mono">
                                                {edge.relation}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-400">
                                            {edge.to}
                                        </td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-500">
                                            {(edge.confidence * 100).toFixed(0)}
                                            %
                                        </td>
                                        <td className="py-2 px-3 text-xs font-mono text-zinc-500">
                                            {edge.anchor ? (
                                                <AnchorBadge
                                                    anchor={edge.anchor}
                                                />
                                            ) : (
                                                <span className="text-zinc-700">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td
                                            className="py-2 px-3 whitespace-nowrap text-xs text-zinc-500"
                                            title={formatCentralTooltip(
                                                edge.ts
                                            )}
                                        >
                                            {formatCentral(edge.ts)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* ──────── Timeline ──────── */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">
                    Event Timeline
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    All DCT events in reverse chronological order.
                </p>

                {events.length === 0 ? (
                    <EmptyState message="No DCT events found. Run dct:extract to populate." />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                                <tr>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Time
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Action
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Source
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Event ID
                                    </th>
                                    <th className="py-2 px-3 text-xs text-gray-400">
                                        Summary
                                    </th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {events.slice(0, 200).map((evt) => {
                                    const label =
                                        kindLabels[evt.kind] ?? evt.kind;
                                    const color =
                                        kindColors[evt.kind] ??
                                        "bg-zinc-800/40 text-zinc-400";

                                    return (
                                        <tr
                                            key={evt.eventId}
                                            className="border-b border-gray-900 hover:bg-zinc-900/60"
                                        >
                                            <td
                                                className="py-2 px-3 whitespace-nowrap text-xs"
                                                title={formatCentralTooltip(
                                                    evt.ts
                                                )}
                                            >
                                                {formatCentral(evt.ts)}
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono ${color}`}
                                                >
                                                    {label}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs">
                                                <Link
                                                    href={`/operator/events?source=${encodeURIComponent(evt.source)}`}
                                                    className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                                                >
                                                    {evt.source}
                                                </Link>
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-600 font-mono">
                                                {evt.eventId.slice(0, 12)}…
                                            </td>
                                            <td className="py-2 px-3 text-xs max-w-xl truncate">
                                                {evt.summary ?? "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    highlight,
    warn,
}: {
    label: string;
    value: number;
    highlight?: boolean;
    warn?: boolean;
}) {
    const border = warn
        ? "border-amber-800"
        : highlight
            ? "border-sky-800"
            : "border-zinc-800";
    const text = warn
        ? "text-amber-300"
        : highlight
            ? "text-sky-300"
            : "text-zinc-200";
    return (
        <div className={`bg-zinc-900/50 border ${border} p-3 rounded`}>
            <div className="text-xs text-gray-400 uppercase tracking-tighter">
                {label}
            </div>
            <div className={`text-2xl font-mono ${text}`}>{value}</div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return <p className="text-sm text-gray-500 italic py-4">{message}</p>;
}

function IdeaCard({ idea }: { idea: { id: string; text: string; type: string; status: string; confidence: number; nhId: string; anchors: Array<{ type: string; chatId?: number; lineNumber?: number; filePath?: string; url?: string; _legacy?: boolean }> } }) {
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-100 leading-relaxed">
                        {idea.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-zinc-500">
                            {idea.id}
                        </span>
                        {idea.nhId && (
                            <span className="text-[10px] font-mono text-zinc-600">
                                NH:{idea.nhId}
                            </span>
                        )}
                    </div>
                    {idea.anchors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {idea.anchors.map((a, i) => (
                                <AnchorBadge key={i} anchor={a} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono ${ideaStatusColors[idea.status] ?? ideaStatusColors.draft}`}
                    >
                        {idea.status}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">
                        {idea.type}
                    </span>
                    <span className="text-[10px] text-zinc-700 font-mono">
                        conf:{(idea.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

function AnchorBadge({
    anchor,
}: {
    anchor: {
        type: string;
        chatId?: number;
        lineNumber?: number;
        filePath?: string;
        url?: string;
        _legacy?: boolean;
    };
}) {
    let label: string;
    if (anchor.type === "chat") {
        label = `chat#${anchor.chatId ?? "?"}${anchor.lineNumber ? `:L${anchor.lineNumber}` : ""}`;
    } else if (anchor.type === "file") {
        label = anchor.filePath ?? "file";
    } else {
        label = anchor.url ?? "url";
    }

    const legacyStyle = anchor._legacy
        ? "border-amber-900/50 bg-amber-950/30 text-amber-500"
        : "bg-zinc-900 border-zinc-800 text-zinc-500";

    return (
        <span className={`text-[9px] font-mono border rounded px-1 py-0.5 ${legacyStyle}`}>
            {label}
            {anchor._legacy && " (legacy)"}
        </span>
    );
}
