import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import YAML from "yaml";

import { prisma } from "../src/lib/prisma";

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

function parseArgs(argv: string[]) {
    const out: Record<string, string | boolean> = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith("--")) continue;
        const key = a.slice(2);
        const next = argv[i + 1];
        if (!next || next.startsWith("--")) out[key] = true;
        else {
            out[key] = next;
            i++;
        }
    }
    return out;
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

function stableStringify(value: any): string {
    const seen = new WeakSet<object>();
    const normalize = (v: any): any => {
        if (v === null || v === undefined) return v;
        if (typeof v !== "object") return v;
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

function normalizeStatus(raw?: string) {
    if (!raw) return null;
    const s = raw.trim().toLowerCase();
    if (s === "active" || s === "frozen" || s === "planned" || s === "parked") return s;
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

async function main() {
    const args = parseArgs(process.argv.slice(2));

    const quarter = (args["quarter"] as string | undefined) ?? process.env.REGISTRY_QUARTER ?? "2026-Q1";
    const version = (args["version"] as string | undefined) ?? process.env.REGISTRY_VERSION ?? "v0.1";

    // Optional: attach to an existing WaveRun
    const waveRunId =
        args["waveRunId"] !== undefined ? Number(args["waveRunId"]) :
            process.env.WAVE_RUN_ID ? Number(process.env.WAVE_RUN_ID) :
                undefined;

    const repoFile = (args["repos"] as string | undefined) ?? process.env.REPOS_FILE ?? path.join("config", "repos.yaml");
    const reposAbs = path.resolve(process.cwd(), repoFile);
    if (!fs.existsSync(reposAbs)) throw new Error(`[gate-registry-hash] repos.yaml not found: ${reposAbs}`);

    const reposYaml = readYamlFile<ReposYamlFile>(reposAbs);
    const rows = reposYaml.repos ?? [];
    if (!Array.isArray(rows)) throw new Error("[gate-registry-hash] repos.yaml invalid: repos is not an array");

    const normalized = rows
        .map((r) => {
            const nhId = String(r.nh_id ?? "").trim();
            const repo = String(r.repo ?? "").trim();
            if (!nhId || !repo) return null;
            return {
                nhId,
                repo,
                description: r.description?.trim() ?? null,
                tier: typeof r.tier === "number" ? r.tier : null,
                role: r.role?.trim() ?? null,
                status: normalizeStatus(r.status),
                wave: normalizeWave(r.wave),
                isDeprecated: isDeprecatedFromNotes(r.notes),
                notes: r.notes ? { text: r.notes } : null,
            };
        })
        .filter(Boolean) as Array<any>;

    normalized.sort((a, b) => compareNhId(a.nhId, b.nhId));

    const canonicalPayload = {
        quarter,
        version,
        sourcePath: path.relative(process.cwd(), reposAbs).replaceAll("\\", "/"),
        repos: normalized,
    };

    const actualHash = sha256Hex(stableStringify(canonicalPayload));

    const snap = await prisma.registrySnapshot.findFirst({
        where: { quarter, version },
        orderBy: { id: "desc" },
        select: { id: true, contentHash: true, sourcePath: true, locked: true },
    });

    if (!snap) {
        const out = {
            ok: false,
            gateId: "registry_hash_matches",
            status: "FAIL",
            reason: `No RegistrySnapshot found for ${quarter} ${version}`,
            actualHash,
        };
        process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
        process.exitCode = 2;
        return;
    }

    const expectedHash = snap.contentHash;
    const pass = expectedHash === actualHash;

    // Optional: persist GateRun if waveRunId provided
    if (waveRunId && Number.isFinite(waveRunId)) {
        const gateId = "registry_hash_matches";
        await prisma.gateRun.upsert({
            where: { waveRunId_gateId: { waveRunId: Number(waveRunId), gateId } },
            create: {
                waveRunId: Number(waveRunId),
                gateId,
                status: pass ? "PASS" : "FAIL",
                startedAt: new Date(),
                finishedAt: new Date(),
                summary: pass ? "Registry hash matches latest snapshot" : "Registry hash mismatch",
                results: {
                    expectedHash,
                    actualHash,
                    snapshotId: snap.id,
                    snapshotSourcePath: snap.sourcePath,
                    reposSourcePath: canonicalPayload.sourcePath,
                    locked: snap.locked,
                },
            },
            update: {
                status: pass ? "PASS" : "FAIL",
                finishedAt: new Date(),
                summary: pass ? "Registry hash matches latest snapshot" : "Registry hash mismatch",
                results: {
                    expectedHash,
                    actualHash,
                    snapshotId: snap.id,
                    snapshotSourcePath: snap.sourcePath,
                    reposSourcePath: canonicalPayload.sourcePath,
                    locked: snap.locked,
                },
            },
        });
    }

    const out = {
        ok: true,
        gateId: "registry_hash_matches",
        status: pass ? "PASS" : "FAIL",
        quarter,
        version,
        snapshotId: snap.id,
        expectedHash,
        actualHash,
    };

    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    process.exitCode = pass ? 0 : 3;
}

main().catch((err) => {
    process.stderr.write(`[gate-registry-hash] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
