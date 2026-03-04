import fs from "node:fs/promises";
import path from "node:path";

export type PanelIndexItem = {
    motion_id: string;
    panel_id: string;
    role_id: string;
    winner: string;
    task: string;
    candidates_count: number;
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

export async function listPanelsIndex(): Promise<PanelIndexItem[]> {
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
        const panelsRoot = path.join(motionsRoot, motion_id, "panels");
        if (!(await pathExists(panelsRoot))) continue;

        const panelEntries = await fs.readdir(panelsRoot, { withFileTypes: true });
        const panelIds = panelEntries
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .sort((a, b) => a.localeCompare(b));

        for (const panel_id of panelIds) {
            const panelDir = path.join(panelsRoot, panel_id);
            const panelJsonPath = path.join(panelDir, "panel.json");
            const selectionJsonPath = path.join(panelDir, "selection.json");
            const candidatesDir = path.join(panelDir, "candidates");

            const panel = await safeReadJson<any>(panelJsonPath);
            const selection = await safeReadJson<any>(selectionJsonPath);

            let candidates_count = 0;
            if (await pathExists(candidatesDir)) {
                const c = await fs.readdir(candidatesDir, { withFileTypes: true });
                candidates_count = c.filter((x) => x.isFile() && x.name.toLowerCase().endsWith(".md")).length;
            }

            out.push({
                motion_id,
                panel_id,
                role_id: safeStr(panel?.role_id),
                winner: safeStr(selection?.winner),
                task: safeStr(selection?.task),
                candidates_count,
            });
        }
    }

    // deterministic order
    out.sort((a, b) => {
        const m = a.motion_id.localeCompare(b.motion_id);
        if (m !== 0) return m;
        return a.panel_id.localeCompare(b.panel_id);
    });

    return out;
}
