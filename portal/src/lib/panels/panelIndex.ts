import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import {
    computePanelProgress,
    progressRank,
    type PanelProgressStatus,
} from "@/lib/panels/panelProgress";

export type WinnerStatus = "UNKNOWN" | "SELECTED";

export type PanelIndexItem = {
    motion_id: string;
    panel_id: string;
    role_id: string;
    selector: string;

    winner: string;
    winner_status: WinnerStatus;

    // --- motion-0023: progress ---
    progress_status: PanelProgressStatus;
    progress_reason: string;

    task: string;
    evidence_commands: number;
    completed: boolean;

    candidates_count: number;

    // --- motion-0022: binding summary ---
    bindings_label: string; // e.g. "openai:gpt-5" | "mixed" | "UNKNOWN"
    bound_slots: number; // count of non-UNKNOWN provider/model
    total_slots: number; // candidates + selector
    unknown_slots: number; // total - bound

    updated_at: string;
};

export type ListPanelsIndexFilters = {
    motionId?: string;
    panelId?: string;
    status?: WinnerStatus;
    completed?: boolean;
    progress?: PanelProgressStatus;
};

type SlotBinding = { provider: string; model: string; notes: string };
type ModelSlotsDoc = {
    version?: string;
    slots?: Record<string, { provider?: unknown; model?: unknown; notes?: unknown }>;
};

async function pathExists(p: string): Promise<boolean> {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function findRepoRoot(startDir: string): Promise<string | null> {
    let cur = startDir;
    for (let i = 0; i < 10; i++) {
        const nexusDir = path.join(cur, ".nexus");
        if (await pathExists(nexusDir)) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

async function safeReadJson<T>(p: string): Promise<T | null> {
    try {
        const txt = await fs.readFile(p, "utf8");
        return JSON.parse(txt) as T;
    } catch {
        return null;
    }
}

function safeStr(v: unknown, fallback = "UNKNOWN") {
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
}

function toISO(ms: number) {
    return new Date(ms).toISOString();
}

async function newestMtimeISO(pathsToStat: string[]): Promise<string> {
    let newest = 0;
    for (const p of pathsToStat) {
        try {
            const st = await fs.stat(p);
            newest = Math.max(newest, st.mtimeMs);
        } catch {
            // ignore
        }
    }
    return newest ? toISO(newest) : toISO(0);
}

// --- model-slots.yaml loader (small cache) ---
let _slotsCache:
    | {
        repoRoot: string;
        mtimeMs: number;
        slots: Record<string, SlotBinding>;
    }
    | null = null;

async function loadModelSlots(repoRoot: string): Promise<Record<string, SlotBinding>> {
    const p = path.join(repoRoot, ".nexus", "model-slots.yaml");
    if (!(await pathExists(p))) return {};

    try {
        const st = await fs.stat(p);
        if (_slotsCache && _slotsCache.repoRoot === repoRoot && _slotsCache.mtimeMs === st.mtimeMs) {
            return _slotsCache.slots;
        }

        const raw = await fs.readFile(p, "utf8");
        const doc = yaml.load(raw) as ModelSlotsDoc | null;

        const slotsObj = doc?.slots && typeof doc.slots === "object" ? doc.slots : {};
        const out: Record<string, SlotBinding> = {};

        for (const [slotId, v] of Object.entries(slotsObj)) {
            const provider = typeof v?.provider === "string" && v.provider.trim() ? v.provider.trim() : "UNKNOWN";
            const model = typeof v?.model === "string" && v.model.trim() ? v.model.trim() : "UNKNOWN";
            const notes = typeof v?.notes === "string" ? v.notes : "";
            out[slotId] = { provider, model, notes };
        }

        _slotsCache = { repoRoot, mtimeMs: st.mtimeMs, slots: out };
        return out;
    } catch {
        return {};
    }
}

function bindingKey(b: SlotBinding): string {
    return `${b.provider}:${b.model}`;
}

function isUnknownBinding(b: SlotBinding): boolean {
    return b.provider === "UNKNOWN" || b.model === "UNKNOWN";
}

function computeBindingSummary(args: {
    candidateSlots: string[];
    selectorSlot: string | null;
    slotsMap: Record<string, SlotBinding>;
}): { bindings_label: string; bound_slots: number; total_slots: number; unknown_slots: number } {
    const ids = Array.from(new Set([...(args.candidateSlots ?? []), ...(args.selectorSlot ? [args.selectorSlot] : [])]))
        .filter((s) => typeof s === "string" && s.trim().length > 0);

    const total_slots = ids.length;
    if (total_slots === 0) {
        return { bindings_label: "UNKNOWN", bound_slots: 0, total_slots: 0, unknown_slots: 0 };
    }

    let bound_slots = 0;
    let unknown_slots = 0;

    const knownKeys = new Set<string>();
    for (const slotId of ids) {
        const b = args.slotsMap[slotId] ?? { provider: "UNKNOWN", model: "UNKNOWN", notes: "" };
        if (isUnknownBinding(b)) unknown_slots += 1;
        else bound_slots += 1;

        if (!isUnknownBinding(b)) knownKeys.add(bindingKey(b));
    }

    let bindings_label = "UNKNOWN";
    if (knownKeys.size === 0) bindings_label = "UNKNOWN";
    else if (knownKeys.size === 1) bindings_label = Array.from(knownKeys)[0];
    else bindings_label = "mixed";

    return { bindings_label, bound_slots, total_slots, unknown_slots };
}

export async function listPanelsIndex(filters: ListPanelsIndexFilters = {}): Promise<PanelIndexItem[]> {
    const repoRoot = await findRepoRoot(process.cwd());
    if (!repoRoot) return [];

    const motionsRoot = path.join(repoRoot, ".nexus", "motions");
    if (!(await pathExists(motionsRoot))) return [];

    const slotsMap = await loadModelSlots(repoRoot);
    const modelSlotsPath = path.join(repoRoot, ".nexus", "model-slots.yaml");

    const motionEntries = await fs.readdir(motionsRoot, { withFileTypes: true });
    const motionIds = motionEntries
        .filter((e) => e.isDirectory() && /^motion-\d+$/i.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b));

    const out: PanelIndexItem[] = [];

    for (const motion_id of motionIds) {
        if (filters.motionId && filters.motionId !== motion_id) continue;

        const panelsRoot = path.join(motionsRoot, motion_id, "panels");
        if (!(await pathExists(panelsRoot))) continue;

        const panelEntries = await fs.readdir(panelsRoot, { withFileTypes: true });
        const panelIds = panelEntries
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .sort((a, b) => a.localeCompare(b));

        for (const panel_id of panelIds) {
            if (filters.panelId && filters.panelId !== panel_id) continue;

            const panelDir = path.join(panelsRoot, panel_id);
            const panelJsonPath = path.join(panelDir, "panel.json");
            const selectionJsonPath = path.join(panelDir, "selection.json");
            const selectorMdPath = path.join(panelDir, "selector.md");
            const candidatesDir = path.join(panelDir, "candidates");

            const panel = await safeReadJson<any>(panelJsonPath);
            const selection = await safeReadJson<any>(selectionJsonPath);

            // candidates count + stat paths
            let candidates_count = 0;
            const statPaths: string[] = [panelJsonPath, selectionJsonPath, selectorMdPath, panelDir];

            // Include model-slots.yaml so "updated" changes if bindings change
            if (await pathExists(modelSlotsPath)) statPaths.push(modelSlotsPath);

            if (await pathExists(candidatesDir)) {
                const c = await fs.readdir(candidatesDir, { withFileTypes: true });
                const mdFiles = c
                    .filter((x) => x.isFile() && x.name.toLowerCase().endsWith(".md"))
                    .map((x) => path.join(candidatesDir, x.name));

                candidates_count = mdFiles.length;
                statPaths.push(candidatesDir, ...mdFiles);
            }

            const role_id = safeStr(panel?.role_id);
            const selector = safeStr(panel?.selector, "UNKNOWN");

            const winner = safeStr(selection?.winner);
            const winner_status: WinnerStatus = winner === "UNKNOWN" ? "UNKNOWN" : "SELECTED";

            const task = safeStr(selection?.task);
            const evidence_commands = Array.isArray(selection?.evidence_plan?.commands)
                ? selection.evidence_plan.commands.length
                : 0;

            // motion-0023 progress
            const progress = computePanelProgress(selection);
            const completed = progress.status === "COMPLETE";

            if (filters.status && filters.status !== winner_status) continue;
            if (typeof filters.completed === "boolean" && filters.completed !== completed) continue;
            if (filters.progress && filters.progress !== progress.status) continue;

            const candidateSlots = Array.isArray(panel?.candidates)
                ? panel.candidates.filter((x: any) => typeof x === "string")
                : [];
            const selectorSlot = typeof panel?.selector === "string" ? panel.selector : null;

            const binding = computeBindingSummary({ candidateSlots, selectorSlot, slotsMap });

            const updated_at = await newestMtimeISO(statPaths);

            out.push({
                motion_id,
                panel_id,
                role_id,
                selector,
                winner,
                winner_status,

                progress_status: progress.status,
                progress_reason: progress.reason,

                task,
                evidence_commands,
                completed,
                candidates_count,

                bindings_label: binding.bindings_label,
                bound_slots: binding.bound_slots,
                total_slots: binding.total_slots,
                unknown_slots: binding.unknown_slots,

                updated_at,
            });
        }
    }

    // stable sort: group by motion/panel, but you can still sort “needs attention” elsewhere
    out.sort((a, b) => {
        const m = a.motion_id.localeCompare(b.motion_id);
        if (m !== 0) return m;
        return a.panel_id.localeCompare(b.panel_id);
    });

    return out;
}

// handy helper for callers that want a consistent “needs attention” ordering
export function sortByProgressSeverity(items: PanelIndexItem[]): PanelIndexItem[] {
    return [...items].sort((a, b) => {
        const d = progressRank(b.progress_status) - progressRank(a.progress_status);
        if (d !== 0) return d;
        const m = a.motion_id.localeCompare(b.motion_id);
        if (m !== 0) return m;
        return a.panel_id.localeCompare(b.panel_id);
    });
}
