// portal/scripts/wave-run-apply.ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// args (supports --key value AND --key=value)
function parseArgs(argv: string[]) {
    const out: Record<string, string | boolean> = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith("--")) continue;

        const eq = a.indexOf("=");
        if (eq !== -1) {
            const key = a.slice(2, eq).trim();
            const val = a.slice(eq + 1).trim();
            out[key] = val === "" ? true : val;
            continue;
        }

        const key = a.slice(2).trim();
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

function nowIso() {
    return new Date().toISOString();
}

async function requireGatePassTx(tx: typeof prisma, waveRunId: number, gateId: string) {
    const gate = await tx.gateRun.findUnique({
        where: { waveRunId_gateId: { waveRunId, gateId } },
        select: { status: true, updatedAt: true },
    });
    if (!gate) throw new Error(`[wave-run-apply] Missing GateRun "${gateId}" for waveRunId=${waveRunId}`);
    if (gate.status !== ("PASS" as any)) {
        throw new Error(`[wave-run-apply] Gate "${gateId}" must be PASS. Current=${gate.status} (waveRunId=${waveRunId})`);
    }
    return gate;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    const waveRunIdRaw =
        args["waveRunId"] ??
        args["waveRunID"] ??
        args["wave_run_id"] ??
        process.env.WAVE_RUN_ID;

    const waveRunId = toInt(waveRunIdRaw);
    if (!waveRunId || !Number.isFinite(waveRunId)) {
        throw new Error(`[wave-run-apply] Missing --waveRunId (or env WAVE_RUN_ID)`);
    }

    const dryRun = Boolean(args["dryRun"]);
    const force = Boolean(args["force"]);
    const agentId = (args["agentId"] as string | undefined) ?? process.env.AGENT_ID ?? "jai_operator";
    const action = (args["action"] as string | undefined) ?? "apply_wave";
    const reason = (args["reason"] as string | undefined) ?? "manual apply";

    const createdByEmail = (args["userEmail"] as string | undefined) ?? process.env.WAVE_CREATED_BY_EMAIL;
    let userId: string | null = null;
    if (createdByEmail) {
        const u = await prisma.user.findUnique({ where: { email: createdByEmail }, select: { id: true } });
        userId = u?.id ?? null;
    }

    const waveRun = await prisma.waveRun.findUnique({
        where: { id: waveRunId },
        select: {
            id: true,
            quarter: true,
            wave: true,
            state: true,
            startedAt: true,
            finishedAt: true,
            snapshotId: true,
            snapshot: { select: { id: true, locked: true, contentHash: true, sourcePath: true, version: true } },
        },
    });
    if (!waveRun) throw new Error(`[wave-run-apply] WaveRun not found: id=${waveRunId}`);

    const expectedState = "EXECUTING";
    if (!force && String(waveRun.state) !== expectedState) {
        throw new Error(`[wave-run-apply] Refusing to apply unless state=${expectedState}. Current=${waveRun.state} (use --force to override)`);
    }

    const gate = await prisma.gateRun.findUnique({
        where: { waveRunId_gateId: { waveRunId, gateId: "registry_hash_matches" } },
        select: { status: true, updatedAt: true },
    });

    if (dryRun) {
        process.stdout.write(
            JSON.stringify(
                {
                    ok: true,
                    action: "wave.run.apply",
                    dryRun: true,
                    waveRunId,
                    quarter: waveRun.quarter,
                    wave: waveRun.wave,
                    state: waveRun.state,
                    requires: { gateId: "registry_hash_matches", status: gate?.status ?? "MISSING" },
                    snapshot: waveRun.snapshot,
                    at: nowIso(),
                },
                null,
                2,
            ) + "\n",
        );
        return;
    }

    const result = await prisma.$transaction(async (tx) => {
        // hard requirement inside tx
        await requireGatePassTx(tx as any, waveRunId, "registry_hash_matches");

        const agentRun = await tx.agentRun.create({
            data: {
                agentId,
                action,
                status: "SUCCEEDED" as any,
                startedAt: new Date(),
                finishedAt: new Date(),
                summary: `WaveRun ${waveRunId} applied (wave ${waveRun.wave}, ${waveRun.quarter})`,
                inputs: { waveRunId, force, reason },
                outputs: { snapshotId: waveRun.snapshotId, snapshotHash: waveRun.snapshot?.contentHash },
                userId,
                waveRunId,
            },
            select: { id: true },
        });

        const artifact = await tx.artifact.create({
            data: {
                type: "wave_apply_receipt",
                label: `WaveRun ${waveRunId}: apply`,
                content: {
                    waveRunId,
                    quarter: waveRun.quarter,
                    wave: waveRun.wave,
                    snapshot: waveRun.snapshot,
                    gate: { gateId: "registry_hash_matches", status: "PASS" },
                    force,
                    reason,
                    agentId,
                    agentRunId: agentRun.id,
                    at: new Date().toISOString(),
                },
                waveRunId,
                agentRunId: agentRun.id,
            },
            select: { id: true },
        });

        const eventId = `wave-apply:${waveRunId}:${new Date().toISOString()}`;
        await tx.sotEvent.create({
            data: {
                ts: new Date(),
                source: "dev.jai.nexus",
                kind: "wave.apply",
                nhId: "",
                eventId,
                summary: `WaveRun ${waveRunId} apply`,
                payload: {
                    waveRunId,
                    quarter: waveRun.quarter,
                    wave: waveRun.wave,
                    snapshotId: waveRun.snapshotId,
                    snapshotHash: waveRun.snapshot?.contentHash,
                    agentId,
                    agentRunId: agentRun.id,
                    artifactId: artifact.id,
                    force,
                    reason,
                },
            },
        });

        return { agentRunId: agentRun.id, artifactId: artifact.id };
    });

    process.stdout.write(
        JSON.stringify(
            {
                ok: true,
                action: "wave.run.apply",
                waveRunId,
                quarter: waveRun.quarter,
                wave: waveRun.wave,
                state: waveRun.state,
                agentId,
                reason,
                ...result,
                at: nowIso(),
            },
            null,
            2,
        ) + "\n",
    );
}

main().catch((err) => {
    process.stderr.write(`[wave-run-apply] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
