// portal/scripts/registry-import.ts
//
// Registry Import (Q1 hardened / Prisma v7-safe)
// - Reads config/repos.yaml
// - Normalizes rows
// - Computes canonical hash (stable stringify; NO Prisma sentinels in canonical payload)
// - Upserts RegistrySnapshot (refuses to mutate if locked, unless --force)
// - Reconciles RegistryRepo rows (insert/update/delete)
// - Emits SotEvent registry.snapshot.imported (idempotent by eventId)
// - Prisma v7 JSON-null safe: uses Prisma.DbNull for nullable Json fields
//
// Usage (PowerShell-safe):
//   pnpm -C portal exec dotenv -e .env.local -- tsx scripts/registry-import.ts -- --repos config/repos.yaml --quarter 2026-Q1 --version v0.1 --pretty
//
// Env fallbacks:
//   REGISTRY_QUARTER, REGISTRY_VERSION, REPOS_FILE
//
// Options:
//   --repos <path>     path to repos.yaml (default: config/repos.yaml or REPOS_FILE)
//   --quarter <Q>      e.g. 2026-Q1
//   --version <V>      e.g. v0.1
//   --pretty           pretty JSON output
//   --debug            extra stderr diagnostics
//   --dry-run          compute + report only (no DB writes)
//   --force            allow updating a locked snapshot (use sparingly)

import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import YAML from "yaml";

import { prisma } from "../src/lib/prisma";
import { Prisma, type RepoStatus } from "@prisma/client";

type RepoYamlRow = {
    nh_id?: string;
    repo?: string;
    description?: string;
    tier?: number;
    role?: string;
    status?: string;
    wave?: number | null;
    notes?: string;
};

type ReposYamlFile = {
    schema_version?: string | number;
    repos?: RepoYamlRow[];
};

type NormalizedRepo = {
    nhId: string;
    repo: string;
    description: string | null;
    tier: number | null;
    role: string | null;
    status: RepoStatus | null;
    wave: number | null;
    isDeprecated: boolean;
    // keep "null" in your normalized layer; convert to Prisma.DbNull ONLY at write time
    notes: Prisma.InputJsonValue | null;
};

type Args = {
    repos?: string;
    quarter?: string;
    version?: string;
    pretty?: boolean;
    debug?: boolean;
    dryRun?: boolean;
    force?: boolean;
};

function parseArgs(argv: string[]): Args {
    const out: Args = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith("--")) continue;

        const key = a.slice(2);
        const next = argv[i + 1];

        const asBool = () => {
            (out as any)[key] = true;
        };
        const asVal = () => {
            (out as any)[key] = next;
            i++;
        };

        if (!next || next.startsWith("--")) asBool();
        else asVal();
    }

    // Normalize known keys (accept both kebab + camel)
    const pick = (k1: string, k2?: string) => (out as any)[k1] ?? (k2 ? (out as any)[k2] : undefined);

    const normalized: Args = {
        repos: pick("repos"),
        quarter: pick("quarter"),
        version: pick("version"),
        pretty: Boolean(pick("pretty")),
        debug: Boolean(pick("debug")),
        dryRun: Boolean(pick("dry-run", "dryRun")),
        force: Boolean(pick("force")),
    };

    // If a key was absent, Boolean(undefined) => false, which is fine.
    // But we want "undefined" rather than false for repo/quarter/version when absent.
    if (!pick("pretty")) normalized.pretty = false;
    if (!pick("debug")) normalized.debug = false;
    if (!pick("dry-run", "dryRun")) normalized.dryRun = false;
    if (!pick("force")) normalized.force = false;

    return normalized;
}

function nhIdParts(nh: string): Array<number | string> {
    return nh.split(".").map((p) => {
        const n = Number(p);
        return Number.isFinite(n) && String(n) === p ? n : p;
    });
}

function compareNhId(a: string, b: string) {
    const ap = nhIdParts(a);
    const bp = nhIdParts(b);
    const len = Math.max(ap.length, bp.length);

    for (let i = 0; i < len; i++) {
        const av = ap[i];
        const bv = bp[i];
        if (av === undefined) return -1;
        if (bv === undefined) return 1;

        if (typeof av === "number" && typeof bv === "number") {
            if (av !== bv) return av - bv;
            continue;
        }

        const as = String(av);
        const bs = String(bv);
        if (as !== bs) return as < bs ? -1 : 1;
    }

    return 0;
}

// stable stringify with sorted object keys
function stableStringify(value: unknown): string {
    const seen = new WeakSet<object>();

    const normalize = (v: any): any => {
        if (v === null || v === undefined) return v;
        if (typeof v !== "object") return v;

        if (v instanceof Date) return v.toISOString();

        if (seen.has(v)) return "[Circular]";
        seen.add(v);

        if (Array.isArray(v)) return v.map(normalize);

        const keys = Object.keys(v).sort();
        const out: Record<string, any> = {};
        for (const k of keys) out[k] = normalize(v[k]);
        return out;
    };

    return JSON.stringify(normalize(value));
}

function sha256Hex(s: string) {
    return crypto.createHash("sha256").update(s).digest("hex");
}

function normalizeStatus(raw?: string): RepoStatus | null {
    if (!raw) return null;
    const s = raw.trim().toLowerCase();

    if (s === "active") return "active";
    if (s === "frozen") return "frozen";
    if (s === "planned") return "planned";
    if (s === "parked") return "parked";
    return null;
}

function normalizeWave(raw: unknown): number | null {
    if (raw === null || raw === undefined) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function isDeprecatedFromNotes(notes?: string): boolean {
    if (!notes) return false;
    return notes.toUpperCase().includes("DEPRECATED");
}

function readYamlFile<T>(absPath: string): T {
    const txt = fs.readFileSync(absPath, "utf8");
    return YAML.parse(txt) as T;
}

function boolEnv(v: unknown): boolean {
    if (typeof v !== "string") return false;
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "y";
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    const quarter = args.quarter ?? process.env.REGISTRY_QUARTER ?? "2026-Q1";
    const version = args.version ?? process.env.REGISTRY_VERSION ?? "v0.1";

    const repoFile = args.repos ?? process.env.REPOS_FILE ?? path.join("config", "repos.yaml");
    const reposAbs = path.resolve(process.cwd(), repoFile);

    const pretty = args.pretty ?? boolEnv(process.env.PRETTY);
    const debug = args.debug ?? boolEnv(process.env.DEBUG);
    const dryRun = args.dryRun ?? boolEnv(process.env.DRY_RUN);
    const force = args.force ?? boolEnv(process.env.FORCE);

    if (!fs.existsSync(reposAbs)) {
        throw new Error(`[registry-import] repos.yaml not found: ${reposAbs}`);
    }

    const reposYaml = readYamlFile<ReposYamlFile>(reposAbs);
    const rows = reposYaml.repos ?? [];
    if (!Array.isArray(rows)) {
        throw new Error("[registry-import] repos.yaml invalid: repos is not an array");
    }

    const normalized: NormalizedRepo[] = rows
        .map((r): NormalizedRepo | null => {
            const nhId = String(r.nh_id ?? "").trim();
            const repo = String(r.repo ?? "").trim();
            if (!nhId || !repo) return null;

            const notesText = r.notes?.trim();

            return {
                nhId,
                repo,
                description: r.description?.trim() ?? null,
                tier: typeof r.tier === "number" ? r.tier : null,
                role: r.role?.trim() ?? null,
                status: normalizeStatus(r.status),
                wave: normalizeWave(r.wave),
                isDeprecated: isDeprecatedFromNotes(notesText),
                notes: notesText ? ({ text: notesText } satisfies Prisma.InputJsonValue) : null,
            };
        })
        .filter((x): x is NormalizedRepo => Boolean(x));

    normalized.sort((a, b) => compareNhId(a.nhId, b.nhId));

    // IMPORTANT: canonical payload should NOT include Prisma sentinels (DbNull/JsonNull)
    // Use plain null for missing JSON so hashing stays stable + portable.
    const canonicalPayload = {
        quarter,
        version,
        sourcePath: path.relative(process.cwd(), reposAbs).replaceAll("\\", "/"),
        repos: normalized.map((r) => ({
            nhId: r.nhId,
            repo: r.repo,
            description: r.description,
            tier: r.tier,
            role: r.role,
            status: r.status,
            wave: r.wave,
            isDeprecated: r.isDeprecated,
            notes: r.notes ?? null,
        })),
    };

    const canonicalJson = stableStringify(canonicalPayload);
    const contentHash = sha256Hex(canonicalJson);
    const sourcePath = canonicalPayload.sourcePath;

    if (debug) {
        process.stderr.write(
            `[registry-import] reposAbs=${reposAbs}\n` +
            `[registry-import] quarter=${quarter} version=${version}\n` +
            `[registry-import] rows=${rows.length} normalized=${normalized.length}\n` +
            `[registry-import] hash=${contentHash}\n` +
            `[registry-import] dryRun=${dryRun} force=${force}\n`
        );
    }

    if (dryRun) {
        const out = {
            ok: true,
            dryRun: true,
            quarter,
            version,
            sourcePath,
            contentHash,
            metrics: { total: normalized.length },
        };
        process.stdout.write(JSON.stringify(out, null, pretty ? 2 : 0) + "\n");
        return;
    }

    // NOTE: avoid compound-unique reliance; use findFirst
    const existingSnap = await prisma.registrySnapshot.findFirst({
        where: { quarter, version },
        select: { id: true, contentHash: true, sourcePath: true, locked: true, lockedAt: true },
    });

    let snapshotId: number;

    if (!existingSnap) {
        const created = await prisma.registrySnapshot.create({
            data: {
                quarter,
                version,
                locked: false,
                contentHash,
                sourcePath,
                notes: { importedFrom: sourcePath },
            },
            select: { id: true },
        });
        snapshotId = created.id;
    } else {
        snapshotId = existingSnap.id;

        const shouldUpdate = existingSnap.contentHash !== contentHash || existingSnap.sourcePath !== sourcePath;

        if (shouldUpdate) {
            if (existingSnap.locked && !force) {
                throw new Error(
                    `[registry-import] Snapshot is locked (quarter=${quarter} version=${version} id=${snapshotId}). Refusing to update. Use --force if intentional.`
                );
            }

            await prisma.registrySnapshot.update({
                where: { id: snapshotId },
                data: { contentHash, sourcePath },
            });
        }
    }

    const existingRepos = await prisma.registryRepo.findMany({
        where: { snapshotId },
        select: {
            id: true,
            nhId: true,
            repo: true,
            description: true,
            tier: true,
            role: true,
            status: true,
            wave: true,
            isDeprecated: true,
            notes: true,
        },
    });

    const existingByNh = new Map(existingRepos.map((r) => [r.nhId, r]));
    const incomingNh = new Set(normalized.map((r) => r.nhId));

    const inserts: Prisma.RegistryRepoCreateManyInput[] = [];
    const updates: Array<{ id: number; data: Prisma.RegistryRepoUpdateInput }> = [];
    let unchanged = 0;

    for (const r of normalized) {
        const cur = existingByNh.get(r.nhId);

        if (!cur) {
            inserts.push({
                snapshotId,
                nhId: r.nhId,
                repo: r.repo,
                description: r.description,
                tier: r.tier,
                role: r.role,
                status: r.status,
                wave: r.wave,
                isDeprecated: r.isDeprecated,
                // Prisma v7: Json? does NOT accept JS null. Use DbNull for SQL NULL.
                notes: r.notes ?? Prisma.DbNull,
            });
            continue;
        }

        const same =
            cur.repo === r.repo &&
            (cur.description ?? null) === r.description &&
            (cur.tier ?? null) === r.tier &&
            (cur.role ?? null) === r.role &&
            (cur.status ?? null) === r.status &&
            (cur.wave ?? null) === r.wave &&
            cur.isDeprecated === r.isDeprecated &&
            stableStringify(cur.notes ?? null) === stableStringify(r.notes ?? null);

        if (same) {
            unchanged++;
            continue;
        }

        updates.push({
            id: cur.id,
            data: {
                repo: r.repo,
                description: r.description,
                tier: r.tier,
                role: r.role,
                status: r.status,
                wave: r.wave,
                isDeprecated: r.isDeprecated,
                // Prisma v7: Json? does NOT accept JS null. Use DbNull for SQL NULL.
                notes: r.notes ?? Prisma.DbNull,
            },
        });
    }

    const toDeleteIds = existingRepos.filter((r) => !incomingNh.has(r.nhId)).map((r) => r.id);

    const { inserted, updated, deleted } = await prisma.$transaction(async (tx) => {
        let inserted = 0;
        let updated = 0;
        let deleted = 0;

        if (inserts.length > 0) {
            const res = await tx.registryRepo.createMany({
                data: inserts,
                skipDuplicates: true,
            });
            inserted = res.count;
        }

        for (const u of updates) {
            await tx.registryRepo.update({ where: { id: u.id }, data: u.data });
            updated++;
        }

        if (toDeleteIds.length > 0) {
            const res = await tx.registryRepo.deleteMany({
                where: { id: { in: toDeleteIds } },
            });
            deleted = res.count;
        }

        const eventId = `registry-import:${quarter}:${version}:${contentHash}`;
        const ts = new Date();

        await tx.sotEvent.upsert({
            where: { eventId },
            create: {
                ts,
                source: "dev.jai.nexus",
                kind: "registry.snapshot.imported",
                nhId: "",
                eventId,
                summary: `Imported registry snapshot ${quarter} ${version}`,
                payload: {
                    quarter,
                    version,
                    sourcePath,
                    contentHash,
                    metrics: { inserted, updated, deleted, unchanged, total: normalized.length },
                },
            },
            update: {
                ts,
                summary: `Imported registry snapshot ${quarter} ${version}`,
                payload: {
                    quarter,
                    version,
                    sourcePath,
                    contentHash,
                    metrics: { inserted, updated, deleted, unchanged, total: normalized.length },
                },
            },
        });

        return { inserted, updated, deleted };
    });

    const out = {
        ok: true,
        quarter,
        version,
        sourcePath,
        contentHash,
        snapshot: { id: snapshotId },
        metrics: {
            total: normalized.length,
            inserted,
            updated,
            deleted,
            unchanged,
        },
    };

    process.stdout.write(JSON.stringify(out, null, pretty ? 2 : 0) + "\n");
}

main().catch((err) => {
    process.stderr.write(`[registry-import] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
