
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data is at repo root: portal/scripts -> portal -> root
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const BUNDLE_PATH = path.join(REPO_ROOT, "data", "sourcetree.bundle.json");

interface BundleItem {
    nh: string;
    path: string;
    type: "file" | "dir";
    sha256?: string;
    sha12?: string;
    repo: string; // e.g. "jai-nexus"
}

interface Bundle {
    items: BundleItem[];
}

async function main() {
    console.log(`[ingest:sourcetree] Reading from ${BUNDLE_PATH}...`);

    if (!(await fs.stat(BUNDLE_PATH).catch(() => null))) {
        console.error("Bundle file not found. Run scripts/sourcetree_bundle.sh first.");
        process.exit(1);
    }

    const raw = await fs.readFile(BUNDLE_PATH, "utf8");
    const data = JSON.parse(raw) as Bundle;

    if (!data?.items || !Array.isArray(data.items)) {
        throw new Error("Invalid bundle structure");
    }

    console.log(`[ingest:sourcetree] Found ${data.items.length} items in bundle.`);

    // 1. Get Repo ID mapping from DB
    const repos = await prisma.repo.findMany({ select: { id: true, name: true } });
    const repoNameMap = new Map<string, number>();
    for (const r of repos) {
        // Map both "jai-nexus/dev-jai-nexus" and "dev-jai-nexus"
        repoNameMap.set(r.name, r.id);
        if (r.name.includes("/")) {
            repoNameMap.set(r.name.split("/")[1], r.id);
        }
    }

    // 2. Process in batches
    const BATCH_SIZE = 500;
    let itemsToInsert = [];
    let count = 0;

    for (const item of data.items) {
        if (item.type === "dir") continue; // We only index files in FileIndex for now

        const repoId = repoNameMap.get(item.repo);
        if (!repoId) {
            // console.warn(`Unknown repo: ${item.repo}`);
            continue;
        }

        const sha = item.sha256 || item.sha12 || "";
        const ext = path.extname(item.path).replace(".", "");
        const dir = path.dirname(item.path);

        itemsToInsert.push({
            repoId,
            path: item.path,
            dir: dir === "." ? "" : dir,
            filename: path.basename(item.path),
            extension: ext,
            sizeBytes: 0, // Bundle currently doesn't have size
            sha256: sha,
            indexedAt: new Date()
        });

        if (itemsToInsert.length >= BATCH_SIZE) {
            // Use createMany with skipDuplicates to be idempotent
            await prisma.fileIndex.createMany({
                data: itemsToInsert,
                skipDuplicates: true
            });
            count += itemsToInsert.length;
            itemsToInsert = [];
            console.log(`-> Indexed ${count} files...`);
        }
    }

    if (itemsToInsert.length > 0) {
        await prisma.fileIndex.createMany({
            data: itemsToInsert,
            skipDuplicates: true
        });
        count += itemsToInsert.length;
    }

    console.log(`[ingest:sourcetree] Done. Total files indexed: ${count}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
