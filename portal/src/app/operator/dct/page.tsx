// portal/src/app/operator/dct/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";
import { formatCentral, formatCentralTooltip } from "@/lib/time";
import { DCT_KINDS, type DctAnchor, type DctIdea } from "@/lib/contracts/dctV01";

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

const ideaTypeColors: Record<string, string> = {
    decision: "bg-emerald-950/30 text-emerald-300 border-emerald-900/40",
    definition: "bg-sky-950/30 text-sky-300 border-sky-900/40",
    goal: "bg-indigo-950/30 text-indigo-300 border-indigo-900/40",
    plan: "bg-amber-950/30 text-amber-300 border-amber-900/40",
    rule: "bg-purple-950/30 text-purple-300 border-purple-900/40",
    observation: "bg-zinc-900/40 text-zinc-300 border-zinc-800",
};


function getStringProp(v: unknown, key: string): string | undefined {
    if (!v || typeof v !== "object") return undefined;
    const val = (v as Record<string, unknown>)[key];
    return typeof val === "string" ? val : undefined;
}

function getNumberProp(v: unknown, key: string): number | undefined {
    if (!v || typeof v !== "object") return undefined;
    const val = (v as Record<string, unknown>)[key];
    return typeof val === "number" ? val : undefined;
}

function hasLegacy(v: unknown): boolean {
    if (!v || typeof v !== "object") return false;
    return !!(v as Record<string, unknown>)._legacy;
}

type SlotBinding = { ideaId: string; anchor?: DctAnchor; ts: string; eventId: string };

// ─────────────────────────────────────────────────────────────────────────────
// Quality (server-local) — deterministic eval from projection
// ─────────────────────────────────────────────────────────────────────────────

type DctQualitySeverity = "pass" | "warn" | "fail";

type DctQualityAction =
    | { type: "revise_add_anchor"; ideaId: string; hint: string; curl: string }
    | { type: "investigate_missing_idea"; slot: string; ideaId: string; hint: string; curl: string }
    | { type: "dedupe_anchors"; ideaId: string; hint: string; curl: string };

function stableStringify(value: unknown): string {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",")}}`;
}

function computeDctQuality(projection: ReturnType<typeof applyDct>, maxActions = 3) {
    // 1) slot-bound ideas with anchors=0
    const slotBoundNeedsProvenance: Array<{ slot: string; ideaId: string; boundAt: string; eventId: string }> = [];

    for (const [slot, binding] of Object.entries(projection.slots)) {
        const idea = projection.ideas[binding.ideaId];
        if (!idea) continue;
        if ((idea.anchors?.length ?? 0) === 0) {
            slotBoundNeedsProvenance.push({
                slot,
                ideaId: binding.ideaId,
                boundAt: binding.ts,
                eventId: binding.eventId,
            });
        }
    }

    // 2) slots referencing missing ideas
    const missingIdeasReferencedBySlots: Array<{ slot: string; ideaId: string; boundAt: string; eventId: string }> = [];

    for (const [slot, binding] of Object.entries(projection.slots)) {
        if (!projection.ideas[binding.ideaId]) {
            missingIdeasReferencedBySlots.push({
                slot,
                ideaId: binding.ideaId,
                boundAt: binding.ts,
                eventId: binding.eventId,
            });
        }
    }

    // 3) duplicate anchors per idea (stable match)
    const duplicateAnchors: Array<{ ideaId: string; duplicates: number; totalAnchors: number }> = [];

    for (const [ideaId, idea] of Object.entries(projection.ideas)) {
        const anchors = idea.anchors ?? [];
        if (anchors.length < 2) continue;

        const seen = new Set<string>();
        let dups = 0;
        for (const a of anchors) {
            const key = stableStringify(a);
            if (seen.has(key)) dups++;
            else seen.add(key);
        }
        if (dups > 0) duplicateAnchors.push({ ideaId, duplicates: dups, totalAnchors: anchors.length });
    }

    duplicateAnchors.sort(
        (a, b) => b.duplicates - a.duplicates || b.totalAnchors - a.totalAnchors || a.ideaId.localeCompare(b.ideaId),
    );

    // 4) operating set ideas w/ anchors=0 (truthier than “slot-bound only”)
    const operatingNeedsProvenance = projection.operatingSet
        .filter((i) => (i.anchors?.length ?? 0) === 0)
        .map((i) => i.id)
        .sort((a, b) => a.localeCompare(b));

    const skipped = {
        invalidPayload: projection.metrics.eventsSkippedInvalidPayload,
        kindMismatch: projection.metrics.eventsSkippedKindPayloadMismatch,
        unknownIdea: projection.metrics.eventsSkippedUnknownIdea,
        legacyAnchors: projection.metrics.eventsWithLegacyAnchors,
    };

    // Severity logic:
    // - FAIL: corrupted stream / hard blockers
    // - WARN: governance gaps / cleanup
    const fail =
        slotBoundNeedsProvenance.length > 0 ||
        missingIdeasReferencedBySlots.length > 0 ||
        skipped.invalidPayload > 0 ||
        skipped.kindMismatch > 0;

    const warn =
        !fail &&
        (skipped.unknownIdea > 0 ||
            skipped.legacyAnchors > 0 ||
            duplicateAnchors.length > 0 ||
            operatingNeedsProvenance.length > 0);

    const severity: DctQualitySeverity = fail ? "fail" : warn ? "warn" : "pass";

    // Deterministic top actions (order matters)
    const actions: DctQualityAction[] = [];

    // Prefer fixing missing refs first (hard corruption)
    for (const row of missingIdeasReferencedBySlots.sort((a, b) => a.slot.localeCompare(b.slot))) {
        actions.push({
            type: "investigate_missing_idea",
            slot: row.slot,
            ideaId: row.ideaId,
            hint: `Slot "${row.slot}" points to missing idea "${row.ideaId}"`,
            curl: `curl -sS -X GET "http://localhost:3000/api/dct/slots" -H "Authorization: Bearer $JAI_INTERNAL_API_TOKEN"`,
        });
    }

    // Then provenance gaps
    for (const row of slotBoundNeedsProvenance.sort((a, b) => a.slot.localeCompare(b.slot))) {
        actions.push({
            type: "revise_add_anchor",
            ideaId: row.ideaId,
            hint: `Add provenance anchor (slot "${row.slot}")`,
            curl: `curl -sS -X POST "http://localhost:3000/api/dct/idea-provenance" \\
  -H "Authorization: Bearer $JAI_INTERNAL_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"ideaId":"${row.ideaId}","anchor":{"type":"chat","chatExternalId":"TODO","lineNumber":1}}'`,
        });
    }

    // Then cleanup (duplicate anchors)
    for (const row of duplicateAnchors) {
        actions.push({
            type: "dedupe_anchors",
            ideaId: row.ideaId,
            hint: `Deduplicate anchors (${row.duplicates} duplicates)`,
            curl: `# no repair endpoint yet\n# projection-side dedupe recommended\n# ideaId: ${row.ideaId}`,
        });
    }

    return {
        pass: !fail,
        severity,
        counts: {
            operatingNeedsProvenance: operatingNeedsProvenance.length,
            slotBoundNeedsProvenance: slotBoundNeedsProvenance.length,
            missingIdeasReferencedBySlots: missingIdeasReferencedBySlots.length,
            duplicateAnchors: duplicateAnchors.length,
            skippedInvalidPayload: skipped.invalidPayload,
            skippedKindMismatch: skipped.kindMismatch,
            skippedUnknownIdea: skipped.unknownIdea,
            eventsWithLegacyAnchors: skipped.legacyAnchors,
        },
        topActions: actions.slice(0, maxActions),
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function DctPage() {
    // IMPORTANT:
    // Projection should be built from chronological order. Timeline can be reversed separately.
    const rawEventsAsc = await prisma.sotEvent.findMany({
        where: { kind: { startsWith: "dct." } },
        orderBy: [{ ts: "asc" }, { eventId: "asc" }],
        take: 5000,
        select: {
            eventId: true,
            ts: true,
            kind: true,
            source: true,
            summary: true,
            payload: true,
            nhId: true,
        },
    });

    const eventsAsc: DctEventInput[] = rawEventsAsc.map((e) => ({
        eventId: e.eventId,
        ts: e.ts,
        kind: e.kind,
        source: e.source,
        summary: e.summary,
        payload: e.payload as unknown,
        nhId: e.nhId,
    }));

    const projection = applyDct(eventsAsc);

    // Timeline view (reverse chronological) — keep separate from projection input
    const eventsDesc = [...eventsAsc].reverse();

    const operatingSet = projection.operatingSet;
    const activeIdeas = projection.activeIdeas;
    const edges = projection.edges;
    const m = projection.metrics;

    const slotEntries = Object.entries(projection.slots).sort(([a], [b]) => a.localeCompare(b));
    const totalSkipped = m.eventsSkippedInvalidPayload + m.eventsSkippedKindPayloadMismatch + m.eventsSkippedUnknownIdea;
    const hasLegacy = m.eventsWithLegacyAnchors > 0;

    // Precompute helpers for UI: slot refs + edge refs per idea
    const slotRefsByIdea = new Map<string, Array<{ slot: string } & SlotBinding>>();
    for (const [slot, b] of slotEntries) {
        const list = slotRefsByIdea.get(b.ideaId) ?? [];
        list.push({ slot, ...b });
        slotRefsByIdea.set(b.ideaId, list);
    }

    const edgesByIdea = new Map<string, typeof edges>();
    for (const e of edges) {
        const a = edgesByIdea.get(e.from) ?? [];
        a.push(e);
        edgesByIdea.set(e.from, a);

        const b = edgesByIdea.get(e.to) ?? [];
        b.push(e);
        edgesByIdea.set(e.to, b);
    }

    // URL + filters
    const url = await getServerUrlFromHeaders();
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "any").trim().toLowerCase();
    const scope = (url.searchParams.get("scope") ?? "operating").trim().toLowerCase();
    const needsProv = (url.searchParams.get("needsProv") ?? "").toLowerCase() === "true";

    const baseIdeas = scope === "all" ? Object.values(projection.ideas) : scope === "active" ? activeIdeas : operatingSet;

    const filteredIdeas = baseIdeas.filter((idea) => {
        if (status !== "any" && idea.status !== status) return false;
        if (needsProv && idea.anchors.length > 0) return false;

        if (q.length > 0) {
            const hay = `${idea.id} ${idea.type} ${idea.status} ${idea.text} ${(idea.tags ?? []).join(" ")}`.toLowerCase();
            if (!hay.includes(q)) return false;
        }
        return true;
    });

    // Selected idea via query param
    const selectedId = (url.searchParams.get("ideaId") ?? "").trim();
    const selectedIdea = selectedId ? projection.ideas[selectedId] ?? null : null;

    const selectedSlots = selectedIdea ? slotRefsByIdea.get(selectedIdea.id) ?? [] : [];
    const selectedEdges = selectedIdea ? edgesByIdea.get(selectedIdea.id) ?? [] : [];

    // Quality panel (computed locally, deterministic)
    const quality = computeDctQuality(projection, 3);

    return (
        <main className="min-h-screen bg-black text-gray-100 p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold">JAI NEXUS · DCT Projection</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Deterministic Concept Tracking — governance-grade projection from the SoT event stream.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6 mb-4">
                    <StatCard label="Total Ideas" value={m.totalIdeas} />
                    <StatCard label="Active" value={m.activeIdeasCount} />
                    <StatCard label="Operating" value={m.operatingIdeasCount} highlight />
                    <StatCard label="Edges" value={m.edgeCount} />
                    <StatCard label="Slots" value={m.slotCount} />
                    <StatCard label="Processed" value={m.eventsProcessed} />
                    <StatCard label="Skipped" value={totalSkipped} warn={totalSkipped > 0} />
                    <StatCard label="Legacy Anchors" value={m.eventsWithLegacyAnchors} warn={hasLegacy} />
                </div>

                {/* Quality Panel */}
                <div
                    className={`rounded-lg border p-4 mb-4 ${quality.severity === "fail"
                        ? "border-red-900/50 bg-red-950/20"
                        : quality.severity === "warn"
                            ? "border-amber-900/50 bg-amber-950/20"
                            : "border-emerald-900/50 bg-emerald-950/10"
                        }`}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono border ${quality.severity === "fail"
                                        ? "border-red-900/60 bg-red-950/30 text-red-300"
                                        : quality.severity === "warn"
                                            ? "border-amber-900/60 bg-amber-950/30 text-amber-300"
                                            : "border-emerald-900/60 bg-emerald-950/20 text-emerald-300"
                                        }`}
                                >
                                    QUALITY:{quality.severity.toUpperCase()}
                                </span>

                                <span className="text-xs text-zinc-500 font-mono">
                                    operating(no anchors): {quality.counts.operatingNeedsProvenance} · slots(no anchors):{" "}
                                    {quality.counts.slotBoundNeedsProvenance} · missing refs: {quality.counts.missingIdeasReferencedBySlots} · dup anchors:{" "}
                                    {quality.counts.duplicateAnchors}
                                </span>
                            </div>

                            <div className="text-xs text-zinc-500 mt-1 font-mono">
                                skipped invalid:{quality.counts.skippedInvalidPayload} · kind mismatch:{quality.counts.skippedKindMismatch} · unknown idea:
                                {quality.counts.skippedUnknownIdea} · legacy anchors:{quality.counts.eventsWithLegacyAnchors}
                            </div>
                        </div>

                        <Link
                            href={withQuery(url, { scope: "operating", needsProv: "true", ideaId: "" })}
                            className="text-[11px] font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900"
                        >
                            show needsProv
                        </Link>
                    </div>

                    {quality.topActions.length > 0 && (
                        <div className="mt-3">
                            <div className="text-[10px] text-zinc-500 font-mono mb-2">Top actions</div>
                            <div className="space-y-2">
                                {quality.topActions.map((a, idx) => {
                                    const ideaId = "ideaId" in a ? a.ideaId : "";
                                    return (
                                        <div key={`${a.type}-${idx}`} className="border border-zinc-800 bg-zinc-950/40 rounded px-3 py-2">
                                            <div className="flex items-center justify-between gap-2 text-xs font-mono">
                                                <span className="text-zinc-300">{a.hint}</span>
                                                {ideaId ? (
                                                    <Link href={withQuery(url, { ideaId })} className="text-sky-300 hover:text-sky-200 underline">
                                                        inspect
                                                    </Link>
                                                ) : (
                                                    <span className="text-zinc-600">—</span>
                                                )}
                                            </div>
                                            <pre className="mt-2 text-[11px] leading-relaxed font-mono text-zinc-400 whitespace-pre-wrap bg-black/30 border border-zinc-900 rounded p-2">
                                                {a.curl}
                                            </pre>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quality breakdown (legacy extraction diagnostics) */}
                {(totalSkipped > 0 || hasLegacy) && (
                    <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 mb-4 text-xs text-amber-300 font-mono space-y-0.5">
                        <p className="font-semibold mb-1 text-amber-200">⚠ Extraction Quality Diagnostics</p>
                        {m.eventsSkippedInvalidPayload > 0 && <p>Invalid payload: {m.eventsSkippedInvalidPayload}</p>}
                        {m.eventsSkippedKindPayloadMismatch > 0 && <p>Kind ≠ payload.type: {m.eventsSkippedKindPayloadMismatch}</p>}
                        {m.eventsSkippedUnknownIdea > 0 && <p>Unknown idea ref: {m.eventsSkippedUnknownIdea}</p>}
                        {m.eventsWithLegacyAnchors > 0 && <p>Events with legacy anchors: {m.eventsWithLegacyAnchors}</p>}
                    </div>
                )}

                {/* Filters (real GET form, works in server components) */}
                <form method="GET" className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-between">
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-zinc-500 font-mono">Search</span>
                                <input
                                    defaultValue={url.searchParams.get("q") ?? ""}
                                    name="q"
                                    placeholder="text / id / tag…"
                                    className="w-56 bg-black/40 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-200 placeholder:text-zinc-700"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-zinc-500 font-mono">Scope</span>
                                <select
                                    name="scope"
                                    defaultValue={scope}
                                    className="bg-black/40 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-200"
                                >
                                    <option value="operating">Operating</option>
                                    <option value="active">Active</option>
                                    <option value="all">All</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-zinc-500 font-mono">Status</span>
                                <select
                                    name="status"
                                    defaultValue={status}
                                    className="bg-black/40 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-200"
                                >
                                    <option value="any">Any</option>
                                    <option value="active">active</option>
                                    <option value="promoted">promoted</option>
                                    <option value="draft">draft</option>
                                    <option value="superseded">superseded</option>
                                    <option value="deprecated">deprecated</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-2 select-none">
                                <span className="text-[11px] text-zinc-500 font-mono">Needs provenance</span>
                                <input type="checkbox" name="needsProv" defaultChecked={needsProv} value="true" className="accent-amber-400" />
                            </label>

                            {/* reset selection on filter submit */}
                            <input type="hidden" name="ideaId" value="" />

                            <button
                                type="submit"
                                className="text-[11px] font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900"
                            >
                                apply
                            </button>

                            <Link
                                href="/operator/dct"
                                className="text-[11px] font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:bg-zinc-900/60"
                            >
                                reset
                            </Link>
                        </div>

                        <div className="text-xs text-zinc-500 font-mono">
                            showing <span className="text-zinc-300">{filteredIdeas.length}</span> /{" "}
                            <span className="text-zinc-300">{baseIdeas.length}</span>
                        </div>
                    </div>
                </form>
            </header>

            {/* Main layout: list + detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Ideas list */}
                <section className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-2 text-gray-200">
                        {scope === "all" ? "All Ideas" : scope === "active" ? "Active Ideas" : "Operating Set"}
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Click an idea to inspect slots, anchors, and connected edges.</p>

                    {filteredIdeas.length === 0 ? (
                        <EmptyState message="No ideas match the current filters." />
                    ) : (
                        <div className="space-y-2">
                            {filteredIdeas.map((idea) => (
                                <IdeaCard
                                    key={idea.id}
                                    idea={idea}
                                    selected={selectedIdea?.id === idea.id}
                                    href={withQuery(url, { ideaId: idea.id })}
                                    slotRefs={slotRefsByIdea.get(idea.id) ?? []}
                                    edgeRefs={edgesByIdea.get(idea.id) ?? []}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* RIGHT: Detail panel */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-200">Inspector</h2>
                        <p className="text-xs text-gray-500 mb-4">Selected idea + provenance + links.</p>

                        {!selectedIdea ? (
                            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                                Select an idea from the list to inspect it.
                            </div>
                        ) : (
                            // keep your inspector contents exactly as you have them below
                            // (unchanged to avoid introducing UI regressions)
                            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-mono text-zinc-500">ID</div>
                                        <div className="text-xs font-mono text-zinc-200 break-all">{selectedIdea.id}</div>
                                    </div>
                                    <Link href={withQuery(url, { ideaId: "" })} className="text-[11px] text-zinc-500 hover:text-zinc-300 underline">
                                        clear
                                    </Link>
                                </div>

                                <div>
                                    <div className="text-[10px] font-mono text-zinc-500">Text</div>
                                    <p className="text-sm text-zinc-100 leading-relaxed mt-1 whitespace-pre-wrap">{selectedIdea.text}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Pill className={ideaStatusColors[selectedIdea.status] ?? ideaStatusColors.draft}>{selectedIdea.status}</Pill>
                                    <Pill className={`border ${ideaTypeColors[selectedIdea.type] ?? "border-zinc-800 bg-zinc-900/40 text-zinc-300"}`}>
                                        {selectedIdea.type}
                                    </Pill>
                                    <Pill className="bg-zinc-900 border border-zinc-800 text-zinc-400">
                                        conf:{(selectedIdea.confidence * 100).toFixed(0)}%
                                    </Pill>
                                    {selectedIdea.anchors.length === 0 && (
                                        <Pill className="bg-amber-950/30 border border-amber-900/40 text-amber-300">needs provenance</Pill>
                                    )}
                                </div>

                                {/* Tags */}
                                <div>
                                    <div className="text-[10px] font-mono text-zinc-500">Tags</div>
                                    {selectedIdea.tags?.length ? (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedIdea.tags.map((t) => (
                                                <span
                                                    key={t}
                                                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-zinc-600 mt-1">—</div>
                                    )}
                                </div>

                                {/* Slots */}
                                <div>
                                    <div className="text-[10px] font-mono text-zinc-500">Slot refs</div>
                                    {selectedSlots.length === 0 ? (
                                        <div className="text-xs text-zinc-600 mt-1">—</div>
                                    ) : (
                                        <div className="mt-1 space-y-1">
                                            {selectedSlots.map((s) => (
                                                <div
                                                    key={s.slot}
                                                    className="flex items-center justify-between gap-2 text-xs font-mono border border-zinc-800 bg-zinc-900/20 rounded px-2 py-1"
                                                >
                                                    <span className="text-sky-300">{s.slot}</span>
                                                    <span className="text-zinc-500" title={formatCentralTooltip(s.ts)}>
                                                        {formatCentral(s.ts)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Anchors */}
                                <div>
                                    <div className="text-[10px] font-mono text-zinc-500">Anchors</div>
                                    {selectedIdea.anchors.length === 0 ? (
                                        <div className="text-xs text-amber-300 mt-1">none — add an anchor via revise/status/edge/bind to lock provenance</div>
                                    ) : (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedIdea.anchors.map((a, i) => (
                                                <AnchorBadge key={`${selectedIdea.id}-a-${i}`} anchor={a} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Edges */}
                                <div>
                                    <div className="text-[10px] font-mono text-zinc-500">Connected edges</div>
                                    {selectedEdges.length === 0 ? (
                                        <div className="text-xs text-zinc-600 mt-1">—</div>
                                    ) : (
                                        <div className="mt-1 space-y-1">
                                            {selectedEdges.slice(0, 12).map((e) => {
                                                const dir = e.from === selectedIdea.id ? "out" : e.to === selectedIdea.id ? "in" : "?";
                                                const other = e.from === selectedIdea.id ? e.to : e.from;
                                                return (
                                                    <div
                                                        key={`${e.eventId}-${dir}-${other}`}
                                                        className="text-xs font-mono border border-zinc-800 bg-zinc-900/20 rounded px-2 py-1"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-zinc-400">
                                                                <span className="text-zinc-600">{dir}</span>{" "}
                                                                <span className="text-blue-300">{e.relation}</span>{" "}
                                                                <span className="text-zinc-300">{other}</span>
                                                            </span>
                                                            <span className="text-zinc-600" title={formatCentralTooltip(e.ts)}>
                                                                {formatCentral(e.ts)}
                                                            </span>
                                                        </div>
                                                        {e.anchor && (
                                                            <div className="mt-1">
                                                                <AnchorBadge anchor={e.anchor} />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {selectedEdges.length > 12 && (
                                                <div className="text-[11px] text-zinc-600 font-mono">+{selectedEdges.length - 12} more…</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* ──────── Slot Bindings Table ──────── */}
            <section className="mt-10 mb-10">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">Slot Bindings</h2>
                <p className="text-xs text-gray-500 mb-4">Named pointers linking concepts to their current state.</p>

                {slotEntries.length === 0 ? (
                    <EmptyState message="No slot bindings yet." />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                                <tr>
                                    <th className="py-2 px-3 text-xs text-gray-400">Slot</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Bound Idea</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Idea Text</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Anchor</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Bound At</th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {slotEntries.map(([slot, binding]) => {
                                    const idea = projection.ideas[binding.ideaId];
                                    return (
                                        <tr key={slot} className="border-b border-gray-900 hover:bg-zinc-900/60">
                                            <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-sky-400">{slot}</td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-500">{binding.ideaId}</td>
                                            <td className="py-2 px-3 text-xs max-w-md truncate">{idea?.text ?? "—"}</td>
                                            <td className="py-2 px-3 text-xs font-mono text-zinc-500">
                                                {binding.anchor ? <AnchorBadge anchor={binding.anchor} /> : <span className="text-zinc-700">—</span>}
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs text-zinc-500" title={formatCentralTooltip(binding.ts)}>
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

            {/* ──────── Edges Table ──────── */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">Edges</h2>
                <p className="text-xs text-gray-500 mb-4">Directional relationships between ideas.</p>

                {edges.length === 0 ? (
                    <EmptyState message="No edges yet." />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                                <tr>
                                    <th className="py-2 px-3 text-xs text-gray-400">From</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Relation</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">To</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Confidence</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Anchor</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Time</th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {edges.map((edge, i) => (
                                    <tr key={`${edge.eventId}-${i}`} className="border-b border-gray-900 hover:bg-zinc-900/60">
                                        <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-400">{edge.from}</td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs">
                                            <span className="inline-flex items-center rounded-full bg-blue-900/30 text-blue-300 px-2 py-0.5 text-[10px] font-mono">
                                                {edge.relation}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-400">{edge.to}</td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs font-mono text-zinc-500">
                                            {(edge.confidence * 100).toFixed(0)}%
                                        </td>
                                        <td className="py-2 px-3 text-xs font-mono text-zinc-500">
                                            {edge.anchor ? <AnchorBadge anchor={edge.anchor} /> : <span className="text-zinc-700">—</span>}
                                        </td>
                                        <td className="py-2 px-3 whitespace-nowrap text-xs text-zinc-500" title={formatCentralTooltip(edge.ts)}>
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
                <h2 className="text-xl font-semibold mb-3 text-gray-200">Event Timeline</h2>
                <p className="text-xs text-gray-500 mb-4">All DCT events in reverse chronological order.</p>

                {eventsDesc.length === 0 ? (
                    <EmptyState message="No DCT events found. Run dct:extract to populate." />
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                                <tr>
                                    <th className="py-2 px-3 text-xs text-gray-400">Time</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Action</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Source</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Event ID</th>
                                    <th className="py-2 px-3 text-xs text-gray-400">Summary</th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {eventsDesc.slice(0, 250).map((evt) => {
                                    const label = kindLabels[evt.kind] ?? evt.kind;
                                    const color = kindColors[evt.kind] ?? "bg-zinc-800/40 text-zinc-400";
                                    return (
                                        <tr key={evt.eventId} className="border-b border-gray-900 hover:bg-zinc-900/60">
                                            <td className="py-2 px-3 whitespace-nowrap text-xs" title={formatCentralTooltip(evt.ts)}>
                                                {formatCentral(evt.ts)}
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap text-xs">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono ${color}`}>
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
                                            <td className="py-2 px-3 text-xs max-w-xl truncate">{evt.summary ?? "—"}</td>
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
// UI helpers (server-friendly)
// ─────────────────────────────────────────────────────────────────────────────

import { headers } from "next/headers";

async function getServerUrlFromHeaders(): Promise<URL> {
    try {
        // Next 15+: headers() can be async. Promise.resolve keeps it compatible either way.
        const h = await Promise.resolve(headers());

        const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
        const proto = h.get("x-forwarded-proto") ?? "http";
        const path = h.get("x-invoke-path") ?? h.get("next-url") ?? "/operator/dct";

        const raw = `${proto}://${host}${path.startsWith("/") ? "" : "/"}${path}`;
        return new URL(raw);
    } catch {
        return new URL("http://localhost:3000/operator/dct");
    }
}

function withQuery(url: URL, patch: Record<string, string>) {
    const u = new URL(url.toString());
    for (const [k, v] of Object.entries(patch)) {
        if (v === "") u.searchParams.delete(k);
        else u.searchParams.set(k, v);
    }
    return `${u.pathname}?${u.searchParams.toString()}`;
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
    const border = warn ? "border-amber-800" : highlight ? "border-sky-800" : "border-zinc-800";
    const text = warn ? "text-amber-300" : highlight ? "text-sky-300" : "text-zinc-200";
    return (
        <div className={`bg-zinc-900/50 border ${border} p-3 rounded`}>
            <div className="text-xs text-gray-400 uppercase tracking-tighter">{label}</div>
            <div className={`text-2xl font-mono ${text}`}>{value}</div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return <p className="text-sm text-gray-500 italic py-4">{message}</p>;
}

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono border ${className}`}>
            {children}
        </span>
    );
}

function IdeaCard({
    idea,
    selected,
    href,
    slotRefs,
    edgeRefs,
}: {
    idea: DctIdea;
    selected: boolean;
    href: string;
    slotRefs: Array<{ slot: string } & SlotBinding>;
    edgeRefs: Array<{
        from: string;
        to: string;
        relation: string;
        confidence: number;
        anchor?: DctAnchor;
        ts: string;
        eventId: string;
    }>;
}) {
    const needsProv = idea.anchors.length === 0;
    const slotsCount = slotRefs.length;
    const edgesCount = edgeRefs.length;

    return (
        <Link
            href={href}
            className={`block rounded-lg border p-4 transition ${selected ? "border-sky-800 bg-sky-950/15" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/30"
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{idea.text}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-zinc-500">{idea.id}</span>

                        {slotsCount > 0 && (
                            <span className="text-[10px] font-mono text-sky-300 border border-sky-900/40 bg-sky-950/20 rounded-full px-2 py-0.5">
                                slots:{slotsCount}
                            </span>
                        )}

                        {edgesCount > 0 && (
                            <span className="text-[10px] font-mono text-blue-300 border border-blue-900/40 bg-blue-950/20 rounded-full px-2 py-0.5">
                                edges:{edgesCount}
                            </span>
                        )}

                        {needsProv && (
                            <span className="text-[10px] font-mono text-amber-300 border border-amber-900/40 bg-amber-950/20 rounded-full px-2 py-0.5">
                                needs provenance
                            </span>
                        )}
                    </div>

                    {idea.anchors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {idea.anchors.slice(0, 6).map((a, i) => (
                                <AnchorBadge key={`${idea.id}-ab-${i}`} anchor={a} />
                            ))}
                            {idea.anchors.length > 6 && (
                                <span className="text-[9px] font-mono text-zinc-700">+{idea.anchors.length - 6} more…</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono ${ideaStatusColors[idea.status] ?? ideaStatusColors.draft
                            }`}
                    >
                        {idea.status}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">{idea.type}</span>
                    <span className="text-[10px] text-zinc-700 font-mono">conf:{(idea.confidence * 100).toFixed(0)}%</span>
                </div>
            </div>
        </Link>
    );
}

function AnchorBadge({ anchor }: { anchor: DctAnchor }) {
    const isLegacy = hasLegacy(anchor);
    const legacyLabel = isLegacy ? " (legacy)" : "";

    // safe property access helpers
    const type = anchor.type;

    if (type === "chat") {
        const ext = getStringProp(anchor, "chatExternalId");
        const chatId = getNumberProp(anchor, "chatId"); // old schema used number id sometimes? or string? assuming string/number mix in old data
        const chatIdStr = chatId !== undefined ? String(chatId) : getStringProp(anchor, "chatId");

        const line = getNumberProp(anchor, "lineNumber");

        const idPart = ext ? `chat:${ext}` : `chat#${chatIdStr ?? "?"}`;
        const linePart = line ? `:L${line}` : "";
        const label = `${idPart}${linePart}`;

        const style = isLegacy
            ? "border-amber-900/50 bg-amber-950/30 text-amber-500"
            : "bg-zinc-800 border-zinc-700 text-zinc-300";

        return (
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono border ${style}`}>
                {label}{legacyLabel}
            </span>
        );
    }

    if (type === "file") {
        const file = getStringProp(anchor, "filePath") ?? "file";
        const style = isLegacy
            ? "border-amber-900/50 bg-amber-950/30 text-amber-500"
            : "bg-zinc-800 border-zinc-700 text-zinc-300";
        return (
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono border ${style}`}>
                {file}{legacyLabel}
            </span>
        );
    }

    if (type === "url") {
        const url = getStringProp(anchor, "url") ?? "url";
        const style = isLegacy
            ? "border-amber-900/50 bg-amber-950/30 text-amber-500"
            : "bg-zinc-800 border-zinc-700 text-blue-300 hover:bg-zinc-700";

        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono border ${style}`}
            >
                web{legacyLabel}
            </a>
        );
    }

    // fallback
    const label = `${type}`;
    const style = isLegacy
        ? "border-amber-900/50 bg-amber-950/30 text-amber-500"
        : "bg-zinc-800 border-zinc-700 text-zinc-500";

    return (
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono border ${style}`}>
            {label}{legacyLabel}
        </span>
    );
}
