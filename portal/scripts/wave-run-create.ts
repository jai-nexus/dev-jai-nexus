import "dotenv/config";

import { prisma } from "../src/lib/prisma";

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

function toInt(v: unknown, fallback?: number) {
    if (v === undefined || v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    const quarter = (args["quarter"] as string | undefined) ?? process.env.REGISTRY_QUARTER ?? "2026-Q1";
    const version = (args["version"] as string | undefined) ?? process.env.REGISTRY_VERSION ?? "v0.1";
    const wave = toInt(args["wave"], 0);

    if (wave === undefined || wave === null || wave < 0 || wave > 9) {
        throw new Error(`[wave-run-create] Invalid --wave. Expected 0..9, got: ${args["wave"]}`);
    }

    const allowUnlocked = Boolean(args["allowUnlocked"]);
    const initGates = args["initGates"] === undefined ? true : Boolean(args["initGates"]);
    const createdByEmail = (args["createdByEmail"] as string | undefined) ?? process.env.WAVE_CREATED_BY_EMAIL;

    const snapshot = await prisma.registrySnapshot.findFirst({
        where: { quarter, version },
        orderBy: { id: "desc" },
        select: { id: true, quarter: true, version: true, locked: true, contentHash: true, sourcePath: true },
    });

    if (!snapshot) {
        throw new Error(`[wave-run-create] No RegistrySnapshot found for ${quarter} ${version}. Run registry-import.ts first.`);
    }

    if (!snapshot.locked && !allowUnlocked) {
        throw new Error(
            `[wave-run-create] Snapshot ${quarter} ${version} is not locked. Refusing to create WaveRun. (Use --allowUnlocked to override.)`,
        );
    }

    let createdByUserId: string | undefined = undefined;
    if (createdByEmail) {
        const u = await prisma.user.findUnique({
            where: { email: createdByEmail },
            select: { id: true },
        });
        if (u) createdByUserId = u.id;
    }

    const defaultGateIds = ["registry_hash_matches"];

    const created = await prisma.$transaction(async (tx) => {
        const waveRun = await tx.waveRun.create({
            data: {
                quarter,
                wave,
                state: "READY" as any,
                snapshotId: snapshot.id,
                createdByUserId: createdByUserId ?? null,
            },
            select: { id: true, createdAt: true, quarter: true, wave: true, state: true, snapshotId: true },
        });

        if (initGates) {
            await tx.gateRun.createMany({
                data: defaultGateIds.map((gateId) => ({
                    waveRunId: waveRun.id,
                    gateId,
                    status: "PENDING" as any,
                })),
                // If rerun accidentally, avoid blowups:
                skipDuplicates: true,
            });
        }

        return waveRun;
    });

    const out = {
        ok: true,
        action: "wave.run.create",
        waveRunId: created.id,
        quarter,
        version,
        wave,
        state: created.state,
        snapshot: {
            id: snapshot.id,
            locked: snapshot.locked,
            contentHash: snapshot.contentHash,
            sourcePath: snapshot.sourcePath,
        },
        gatesInitialized: initGates ? ["registry_hash_matches"] : [],
        createdAt: created.createdAt.toISOString(),
    };

    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main().catch((err) => {
    process.stderr.write(`[wave-run-create] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
