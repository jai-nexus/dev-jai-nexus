import fs from "node:fs/promises";
import path from "node:path";

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
    scores: Record<
        string,
        { total: number; breakdown: Record<string, number> }
    >;
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

export type PanelView = {
    repo_root: string;
    motion_id: string;
    panel_id: string;
    panel: PanelMeta;
    selection: SelectionRecord;
    candidates: CandidatePreview[];
};

function isSafeId(id: string): boolean {
    // allow motion-0001 style + panel ids with letters, numbers, underscores, hyphens, dots
    // reject any path separators or traversal.
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

function truncate(s: string, max = 2400): string {
    const t = s.replace(/\r\n/g, "\n").trimEnd();
    if (t.length <= max) return t;
    return t.slice(0, max) + "\n…(truncated)…";
}

export async function loadPanelView(params: {
    motionId: string;
    panelId: string;
}): Promise<PanelView> {
    const { motionId, panelId } = params;

    if (!isSafeId(motionId)) throw new Error(`Unsafe motionId: ${motionId}`);
    if (!isSafeId(panelId)) throw new Error(`Unsafe panelId: ${panelId}`);

    const repoRoot = await findRepoRoot(process.cwd());
    if (!repoRoot) throw new Error("Repo root not found (missing .nexus directory).");

    const panelDir = path.join(
        repoRoot,
        ".nexus",
        "motions",
        motionId,
        "panels",
        panelId
    );

    const panelJsonPath = path.join(panelDir, "panel.json");
    const selectionJsonPath = path.join(panelDir, "selection.json");
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

    let candidates: CandidatePreview[] = [];
    if (await pathExists(candidatesDir)) {
        const entries = await fs.readdir(candidatesDir, { withFileTypes: true });
        const files = entries
            .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
            .map((e) => e.name)
            .sort((a, b) => a.localeCompare(b));

        candidates = await Promise.all(
            files.map(async (filename) => {
                const p = path.join(candidatesDir, filename);
                const raw = await fs.readFile(p, "utf8");
                const slot = filename.replace(/\.md$/i, "");
                return { filename, slot, preview: truncate(raw) };
            })
        );
    }

    return {
        repo_root: repoRoot,
        motion_id: motionId,
        panel_id: panelId,
        panel,
        selection,
        candidates,
    };
}
