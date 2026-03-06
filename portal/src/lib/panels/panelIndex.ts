import fs from "node:fs/promises";
import path from "node:path";

export type WinnerStatus = "UNKNOWN" | "SELECTED";

export type PanelIndexItem = {
    motion_id: string;
    panel_id: string;
    role_id: string;
    selector: string;

    winner: string;
    winner_status: WinnerStatus;

    task: string;
    evidence_commands: number;
    completed: boolean;

    candidates_count: number;
    updated_at: string;
};

export type ListPanelsIndexFilters = {
    motionId?: string;
    panelId?: string;
    status?: WinnerStatus;
    completed?: boolean;
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

export async function listPanelsIndex(filters: ListPanelsIndexFilters = {}): Promise<PanelIndexItem[]> {
    const repoRoot = await findRepoRoot(process.cwd());
    if (!repoRoot) return [];

    const motionsRoot = path.join(repoRoot, ".nexus", "motions");
    if (!(await pathExists(motionsRoot))) return [];

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

            const completed = winner !== "UNKNOWN" && evidence_commands > 0;

            if (filters.status && filters.status !== winner_status) continue;
            if (typeof filters.completed === "boolean" && filters.completed !== completed) continue;

            const updated_at = await newestMtimeISO(statPaths);

            out.push({
                motion_id,
                panel_id,
                role_id,
                selector,
                winner,
                winner_status,
                task,
                evidence_commands,
                completed,
                candidates_count,
                updated_at,
            });
        }
    }

    out.sort((a, b) => {
        const m = a.motion_id.localeCompare(b.motion_id);
        if (m !== 0) return m;
        return a.panel_id.localeCompare(b.panel_id);
    });

    return out;
}
