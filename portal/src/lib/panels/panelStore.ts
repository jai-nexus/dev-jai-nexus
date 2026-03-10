import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export type PanelMeta = {
    version: string;
    panel_id: string;
    role_id: string;
    candidates: string[];
    selector: string;
    rubric: Array<{ id: string; weight: number; description?: string }>;
};

export type SelectionRecord = {
    version: string;
    panel_id: string;
    motion_id: string;
    task: string;
    winner: string;
    scores: Record<string, { total: number; breakdown: Record<string, number> }>;
    winner_rationale: string[];
    reservations: Array<{
        reservation: string;
        risk: number;
        mitigation: string[];
        what_to_watch: string;
    }>;
    evidence_plan: { commands: string[]; expected: string[] };
    files: string[];
};

export type CandidatePreview = {
    filename: string;
    slot: string;
    preview: string;
};

export type ResolvedSlotBinding = {
    provider: string;
    model: string;
    notes: string;
};

export type PanelView = {
    repo_root: string;
    motion_id: string;
    panel_id: string;
    panel: PanelMeta;
    selection: SelectionRecord;
    candidates: CandidatePreview[];
    resolved_slots: Record<string, ResolvedSlotBinding>;
};

export type PanelCore = {
    repo_root: string;
    motion_id: string;
    panel_id: string;
    panel_dir: string;
    panel: PanelMeta;
    selection: SelectionRecord;
    panel_json_path: string;
    selection_json_path: string;
    selector_md_path: string;
    candidates_dir: string;
};

export type PanelCoverageItem = {
    motion_id: string;
    panel_id: string;
    winner: string;
    evidence_commands: number;
    completed: boolean;
    href: string;
};

function isSafeId(id: string): boolean {
    return /^[a-zA-Z0-9._-]+$/.test(id);
}

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

async function readJson<T>(p: string): Promise<T> {
    const txt = await fs.readFile(p, "utf8");
    return JSON.parse(txt) as T;
}

async function safeReadJson<T>(p: string): Promise<T | null> {
    try {
        return await readJson<T>(p);
    } catch {
        return null;
    }
}

function normalizeEofNewline(s: string): string {
    return String(s ?? "").replace(/\r\n/g, "\n").trimEnd() + "\n";
}

function truncate(s: string, max = 2400): string {
    const t = s.replace(/\r\n/g, "\n").trimEnd();
    if (t.length <= max) return t;
    return t.slice(0, max) + "\n…(truncated)…";
}

async function atomicWriteJsonIfChanged(p: string, obj: unknown): Promise<boolean> {
    const text = JSON.stringify(obj, null, 2) + "\n";

    let cur: string | null = null;
    try {
        cur = await fs.readFile(p, "utf8");
    } catch {
        // ignore
    }

    if (cur !== null && normalizeEofNewline(cur) === text) return false;

    const tmp = `${p}.tmp`;
    await fs.writeFile(tmp, text, "utf8");
    await fs.rename(tmp, p);
    return true;
}

type ModelSlotsYaml = {
    version?: string;
    slots?: Record<string, { provider?: unknown; model?: unknown; notes?: unknown }>;
};

let _modelSlotsCache:
    | {
        repoRoot: string;
        mtimeMs: number;
        slots: Record<string, ResolvedSlotBinding>;
    }
    | null = null;

async function loadModelSlots(repoRoot: string): Promise<Record<string, ResolvedSlotBinding>> {
    const p = path.join(repoRoot, ".nexus", "model-slots.yaml");
    if (!(await pathExists(p))) return {};

    // small cache to avoid re-parsing on every request
    try {
        const st = await fs.stat(p);
        if (_modelSlotsCache && _modelSlotsCache.repoRoot === repoRoot && _modelSlotsCache.mtimeMs === st.mtimeMs) {
            return _modelSlotsCache.slots;
        }

        const raw = await fs.readFile(p, "utf8");
        const doc = yaml.load(raw) as ModelSlotsYaml | null;

        const slotsObj = doc?.slots && typeof doc.slots === "object" ? doc.slots : {};
        const out: Record<string, ResolvedSlotBinding> = {};

        for (const [slotId, v] of Object.entries(slotsObj)) {
            const provider = typeof v?.provider === "string" && v.provider.trim() ? v.provider.trim() : "UNKNOWN";
            const model = typeof v?.model === "string" && v.model.trim() ? v.model.trim() : "UNKNOWN";
            const notes = typeof v?.notes === "string" ? v.notes : "";
            out[slotId] = { provider, model, notes };
        }

        _modelSlotsCache = { repoRoot, mtimeMs: st.mtimeMs, slots: out };
        return out;
    } catch {
        return {};
    }
}

function resolveSlot(slotsMap: Record<string, ResolvedSlotBinding>, slotId: string): ResolvedSlotBinding {
    const hit = slotsMap[slotId];
    if (hit) return hit;
    return { provider: "UNKNOWN", model: "UNKNOWN", notes: "" };
}

export async function loadPanelCore(params: { motionId: string; panelId: string }): Promise<PanelCore> {
    const { motionId, panelId } = params;

    if (!isSafeId(motionId)) throw new Error(`Unsafe motionId: ${motionId}`);
    if (!isSafeId(panelId)) throw new Error(`Unsafe panelId: ${panelId}`);

    const repoRoot = await findRepoRoot(process.cwd());
    if (!repoRoot) throw new Error("Repo root not found (missing .nexus directory).");

    const panelDir = path.join(repoRoot, ".nexus", "motions", motionId, "panels", panelId);

    const panelJsonPath = path.join(panelDir, "panel.json");
    const selectionJsonPath = path.join(panelDir, "selection.json");
    const selectorMdPath = path.join(panelDir, "selector.md");
    const candidatesDir = path.join(panelDir, "candidates");

    if (!(await pathExists(panelDir))) {
        throw new Error(`Panel folder not found: .nexus/motions/${motionId}/panels/${panelId}`);
    }
    if (!(await pathExists(panelJsonPath))) {
        throw new Error(`Missing panel.json (run scaffold): ${path.relative(repoRoot, panelJsonPath)}`);
    }
    if (!(await pathExists(selectionJsonPath))) {
        throw new Error(`Missing selection.json (run scaffold): ${path.relative(repoRoot, selectionJsonPath)}`);
    }

    const panel = await readJson<PanelMeta>(panelJsonPath);
    const selection = await readJson<SelectionRecord>(selectionJsonPath);

    return {
        repo_root: repoRoot,
        motion_id: motionId,
        panel_id: panelId,
        panel_dir: panelDir,
        panel,
        selection,
        panel_json_path: panelJsonPath,
        selection_json_path: selectionJsonPath,
        selector_md_path: selectorMdPath,
        candidates_dir: candidatesDir,
    };
}

export async function writePanelSelection(params: {
    motionId: string;
    panelId: string;
    selection: SelectionRecord;
}): Promise<{ changed: boolean }> {
    const core = await loadPanelCore({ motionId: params.motionId, panelId: params.panelId });

    // self-heal ids
    const next: SelectionRecord = {
        ...params.selection,
        motion_id: core.motion_id,
        panel_id: core.panel_id,
    };

    const changed = await atomicWriteJsonIfChanged(core.selection_json_path, next);
    return { changed };
}

export async function loadPanelView(params: { motionId: string; panelId: string }): Promise<PanelView> {
    const core = await loadPanelCore(params);

    let candidates: CandidatePreview[] = [];
    if (await pathExists(core.candidates_dir)) {
        const entries = await fs.readdir(core.candidates_dir, { withFileTypes: true });
        const files = entries
            .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
            .map((e) => e.name)
            .sort((a, b) => a.localeCompare(b));

        candidates = await Promise.all(
            files.map(async (filename) => {
                const p = path.join(core.candidates_dir, filename);
                const raw = await fs.readFile(p, "utf8");
                const slot = filename.replace(/\.md$/i, "");
                return { filename, slot, preview: truncate(raw) };
            })
        );
    }

    // --- resolve model slots (motion-0021)
    const slotsMap = await loadModelSlots(core.repo_root);

    const candidateSlots = Array.isArray(core.panel?.candidates) ? core.panel.candidates : [];
    const selectorSlot = typeof core.panel?.selector === "string" ? core.panel.selector : "";

    const slotIds = Array.from(new Set([...(candidateSlots ?? []), ...(selectorSlot ? [selectorSlot] : [])]))
        .filter((s) => typeof s === "string" && s.length > 0)
        .sort((a, b) => a.localeCompare(b));

    const resolved_slots: Record<string, ResolvedSlotBinding> = {};
    for (const slotId of slotIds) {
        resolved_slots[slotId] = resolveSlot(slotsMap, slotId);
    }

    return {
        repo_root: core.repo_root,
        motion_id: core.motion_id,
        panel_id: core.panel_id,
        panel: core.panel,
        selection: core.selection,
        candidates,
        resolved_slots,
    };
}

export async function listPanelsForCoverage(): Promise<PanelCoverageItem[]> {
    const repoRoot = await findRepoRoot(process.cwd());
    if (!repoRoot) return [];

    const motionsRoot = path.join(repoRoot, ".nexus", "motions");
    const motionsEntries = await safeReadJson<string[]>(motionsRoot).catch(() => null);
    // If safeReadJson fails (directory), fall back to readdir:
    const motions = motionsEntries
        ? motionsEntries
        : (await fs.readdir(motionsRoot, { withFileTypes: true }))
            .filter((e) => e.isDirectory() && /^motion-\d+$/i.test(e.name))
            .map((e) => e.name)
            .sort((a, b) => a.localeCompare(b));

    const out: PanelCoverageItem[] = [];

    for (const motionId of motions) {
        const panelsRoot = path.join(motionsRoot, motionId, "panels");
        if (!(await pathExists(panelsRoot))) continue;

        const panelDirs = (await fs.readdir(panelsRoot, { withFileTypes: true }))
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .sort((a, b) => a.localeCompare(b));

        for (const panelId of panelDirs) {
            if (!isSafeId(motionId) || !isSafeId(panelId)) continue;

            const selectionPath = path.join(panelsRoot, panelId, "selection.json");
            const sel = await safeReadJson<SelectionRecord>(selectionPath);
            if (!sel) continue;

            const winner = typeof sel.winner === "string" ? sel.winner : "UNKNOWN";
            const evidenceCommands = Array.isArray(sel.evidence_plan?.commands) ? sel.evidence_plan.commands.length : 0;

            const completed = winner !== "UNKNOWN" && evidenceCommands > 0;

            out.push({
                motion_id: motionId,
                panel_id: panelId,
                winner,
                evidence_commands: evidenceCommands,
                completed,
                href: `/operator/panels/${motionId}/${panelId}`,
            });
        }
    }

    return out;
}
