
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { prisma } from "../src/lib/prisma";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config is at repo root: portal/scripts -> portal -> root
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CONFIG_PATH = path.join(REPO_ROOT, "config", "repos.yaml");

// Type matching config/repos.yaml
interface YamlRepo {
    repo_id: string;
    org_repo: string;
    tier: number;
    role: string;
    project_ids: string[];
    nh_root?: string;
    wave?: number;
    triage_color?: string;
    owner?: string;
    status?: string;
    notes?: string;
}

interface YamlConfig {
    repos: YamlRepo[];
}

async function main() {
    console.log(`[sync:topology] Reading from ${CONFIG_PATH}...`);

    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    const data = yaml.load(raw) as YamlConfig;

    if (!data?.repos || !Array.isArray(data.repos)) {
        throw new Error("Invalid repos.yaml structure");
    }

    console.log(`[sync:topology] Found ${data.repos.length} repos in YAML.`);

    for (const r of data.repos) {
        const name = r.org_repo; // e.g. "jai-nexus/dev-jai-nexus"

        // Map status string to DB Enum (RepoStatus)
        // YAML: active, planned, frozen, parked
        // DB: active, frozen, planned, parked
        let status: any = r.status?.toLowerCase() || "planned";
        // basic validation/fallback
        if (!["active", "frozen", "planned", "parked"].includes(status)) {
            status = "planned";
        }

        // Construct githubUrl if missing
        const githubUrl = `https://github.com/${name}`;

        console.log(`-> Upserting ${name} (status=${status})...`);

        // Use Prisma upsert
        await prisma.repo.upsert({
            where: { name },
            update: {
                nhId: r.nh_root || "",
                status: status, // Prisma will cast string to Enum if valid
                owner: r.owner || null,
                notes: {
                    // Store extra metadata in JSON notes
                    sys_role: r.role,
                    tier: r.tier,
                    project_ids: r.project_ids,
                    triage_color: r.triage_color,
                    repo_id: r.repo_id,
                    original_notes: r.notes
                },
                wave: r.wave ?? null,
                githubUrl,
                // Don't overwrite description if manual? For now, we don't have descriptions in YAML.
                // We will leave description alone if it exists.
            },
            create: {
                name,
                nhId: r.nh_root || "",
                status: status,
                owner: r.owner || null,
                domainPod: "legacy", // default
                engineGroup: "legacy", // default
                notes: {
                    sys_role: r.role,
                    tier: r.tier,
                    project_ids: r.project_ids,
                    triage_color: r.triage_color,
                    repo_id: r.repo_id,
                    original_notes: r.notes
                },
                wave: r.wave ?? null,
                githubUrl,
                defaultBranch: "main" // assumption
            }
        });
    }

    console.log("[sync:topology] Done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
