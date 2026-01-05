// portal/scripts/wave-run-advance.ts
import "dotenv/config";

import { prisma } from "../src/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// args
// - Supports: --key value, --key=value, --key (boolean)
// - Normalizes keys so these all match:
//   waveRunId, wave_run_id, wave-run-id, WAVE_RUN_ID (when passed as arg key), etc.
//   (Normalization: lowercase + remove "-" "_" )
//
// IMPORTANT: When running via pnpm exec + dotenv, you usually MUST add an extra `--`
// to forward args to tsx/node:
//
//   pnpm -C portal exec dotenv -e .env.local -- tsx scripts/wave-run-advance.ts -- --waveRunId 4 --dryRun
//
// Without that extra `--`, pnpm/dotenv often eats your args and your script sees none.
// ─────────────────────────────────────────────────────────────────────────────

type ArgVal = string | boolean;
type Args = Record<string, ArgVal>;

function normKey(k: string) {
    return k.toLowerCase().replace(/[-_]/g, "");
}

function parseArgs(argv: string[]): Args {
    const out: Args = {};

    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith("--")) continue;

        const body = a.slice(2);

        // --key=value
        const eq = body.indexOf("=");
        if (eq !== -1) {
            const rawKey = body.slice(0, eq).trim();
            const rawVal = body.slice(eq + 1).trim();
            const key = normKey(rawKey);
            out[key] = rawVal === "" ? true : rawVal;
            continue;
        }

        // --key value  OR  --flag
        const rawKey = body.trim();
        const key = normKey(rawKey);
        const next = argv[i + 1];

        if (!next || next.startsWith("--")) {
            out[key] = true;
        } else {
            out[key] = next;
            i++;
        }
    }

    return out;
}

function getArg(args: Args, key: string): ArgVal | undefined {
    return args[normKey(key)];
}

function toInt(v: unknown, fallback?: number) {
    if (v === undefined || v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function nowIso() {
    return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// wave states
// ─────────────────────────────────────────────────────────────────────────────
type WaveState =
    | "READY"
    | "PLANNING"
    | "EXECUTING"
    | "VERIFYING"
    | "RELEASING"
    | "ARCHIVING"
    | "COMPLETE"
    | "FAILED"
    | "CANCELED";

const ORDER: WaveState[] = [
    "READY",
    "PLANNING",
    "EXECUTING",
    "VERIFYING",
    "RELEASING",
    "ARCHIVING",
    "COMPLETE",
];

function nextState(cur: WaveState): WaveState | null {
    const idx = ORDER.indexOf(cur);
    if (idx < 0) return null;
    if (idx === ORDER.length - 1) return null;
    return ORDER[idx + 1] ?? null;
}

function isTerminal(s: WaveState) {
    return s === "COMPLETE" || s === "FAILED" || s === "CANCELED";
}

// ─────────────────────────────────────────────────────────────────────────────
// gates
// ─────────────────────────────────────────────────────────────────────────────
async function getGate(waveRunId: number, gateId: string) {
    return prisma.gateRun.findUnique({
        where: { waveRunId_gateId: { waveRunId, gateId } },
        select: { status: true, updatedAt: true },
    });
}

async function requireGatePassTx(tx: typeof prisma, waveRunId: number, gateId: string) {
    const gate = await tx.gateRun.findUnique({
        where: { waveRunId_gateId: { waveRunId, gateId } },
        select: { status: true, updatedAt: true },
    });

    if (!gate) {
        throw new Error(`[wave-run-advance] Missing GateRun "${gateId}" for waveRunId=${waveRunId}`);
    }

    if (gate.status !== ("PASS" as any)) {
        throw new Error(
            `[wave-run-advance] Gate "${gateId}" must be PASS to advance. Current=${gate.status} (waveRunId=${waveRunId})`,
        );
    }

    return gate;
}

// ─────────────────────────────────────────────────────────────────────────────
// main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    const argv = process.argv.slice(2);
    const args = parseArgs(argv);

    const debugArgs = process.env.DEBUG_ARGS === "1" || getArg(args, "debugArgs") === true;
    if (debugArgs) {
        // Show exactly what we received (helps detect pnpm/dotenv swallowing args)
        process.stdout.write(`[wave-run-advance] argv(raw)  = ${JSON.stringify(process.argv)}\n`);
        process.stdout.write(`[wave-run-advance] argv(tail) = ${JSON.stringify(argv)}\n`);
        process.stdout.write(`[wave-run-advance] parsed     = ${JSON.stringify(args)}\n`);
    }

    const argWaveRunId =
        getArg(args, "waveRunId") ??
        getArg(args, "waveRunID") ??
        getArg(args, "wave_run_id") ??
        getArg(args, "wave-run-id");

    const waveRunId =
        argWaveRunId !== undefined
            ? toInt(argWaveRunId)
            : process.env.WAVE_RUN_ID
                ? toInt(process.env.WAVE_RUN_ID)
                : undefined;

    if (!waveRunId || !Number.isFinite(waveRunId)) {
        const hint =
            argv.length === 0
                ? ` Tip: your command likely swallowed args. With pnpm+dotenv use:\n` +
                `  pnpm -C portal exec dotenv -e .env.local -- tsx scripts/wave-run-advance.ts -- --waveRunId 4\n`
                : ` Tip: PowerShell safest form is: --waveRunId 4 (space, not equals). Also consider the extra \`--\` after the script path.`;

        throw new Error(`[wave-run-advance] Missing --waveRunId (or env WAVE_RUN_ID).${hint}`);
    }

    const to = (String(getArg(args, "to") ?? "").trim().toUpperCase() || undefined) as WaveState | undefined;

    const force = Boolean(getArg(args, "force"));
    const dryRun = Boolean(getArg(args, "dryRun")) || Boolean(getArg(args, "dryrun"));

    const agentId =
        (getArg(args, "agentId") as string | undefined) ??
        (process.env.AGENT_ID || undefined) ??
        "jai_operator";

    const action = (getArg(args, "action") as string | undefined) ?? "advance_wave";
    const reason = (getArg(args, "reason") as string | undefined) ?? "manual advance";

    const createdByEmail =
        (getArg(args, "userEmail") as string | undefined) ??
        (process.env.WAVE_CREATED_BY_EMAIL || undefined);

    let userId: string | null = null;
    if (createdByEmail) {
        const u = await prisma.user.findUnique({
            where: { email: createdByEmail },
            select: { id: true },
        });
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
            snapshot: { select: { contentHash: true, locked: true, version: true } },
        },
    });

    if (!waveRun) throw new Error(`[wave-run-advance] WaveRun not found: id=${waveRunId}`);

    const from = waveRun.state as WaveState;
    if (!from) throw new Error(`[wave-run-advance] WaveRun state is null (id=${waveRunId})`);

    if (isTerminal(from)) {
        throw new Error(`[wave-run-advance] WaveRun is terminal (${from}); refusing to advance (id=${waveRunId})`);
    }

    // Determine target state
    const computedNext = nextState(from);
    if (!computedNext) throw new Error(`[wave-run-advance] No next state from "${from}" (id=${waveRunId})`);
    const target: WaveState = to ?? computedNext;

    // Validate state transition (no skipping unless --force)
    const fromIdx = ORDER.indexOf(from);
    const toIdx = ORDER.indexOf(target);
    if (fromIdx < 0 || toIdx < 0) {
        throw new Error(`[wave-run-advance] Invalid state(s): from=${from} to=${target}`);
    }
    if (!force && toIdx !== fromIdx + 1) {
        throw new Error(
            `[wave-run-advance] Refusing to skip states without --force. from=${from} to=${target} (id=${waveRunId})`,
        );
    }

    // Gate logic: leaving READY requires registry gate (unless forced)
    const requiresRegistryGate = from === "READY" && target !== "READY";
    const registryGate = requiresRegistryGate ? await getGate(waveRunId, "registry_hash_matches") : null;

    const canAdvance =
        force ||
        !requiresRegistryGate ||
        (registryGate?.status === ("PASS" as any));

    // Dry-run should NEVER hard-fail; it should report the situation.
    if (dryRun) {
        const out = {
            ok: true,
            action: "wave.run.advance",
            dryRun: true,
            waveRunId,
            quarter: waveRun.quarter,
            wave: waveRun.wave,
            from,
            to: target,
            force,
            requiresRegistryGate,
            registryGate,
            canAdvance,
            timestamps: {
                startedAtWillSet: from === "READY" && target !== "READY" && !waveRun.startedAt,
                finishedAtWillSet: target === "COMPLETE" && !waveRun.finishedAt,
            },
            at: nowIso(),
        };

        process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
        return;
    }

    // Determine timestamps
    const setStartedAt = from === "READY" && target !== "READY" && !waveRun.startedAt;
    const setFinishedAt = target === "COMPLETE" && !waveRun.finishedAt;

    const plannedUpdate: any = { state: target as any };
    if (setStartedAt) plannedUpdate.startedAt = new Date();
    if (setFinishedAt) plannedUpdate.finishedAt = new Date();

    const result = await prisma.$transaction(async (tx) => {
        // Re-fetch inside tx to avoid races
        const current = await tx.waveRun.findUnique({
            where: { id: waveRunId },
            select: { state: true, startedAt: true, finishedAt: true },
        });

        if (!current) {
            throw new Error(`[wave-run-advance] WaveRun vanished during tx (id=${waveRunId})`);
        }

        const curState = current.state as WaveState;
        if (curState !== from) {
            throw new Error(
                `[wave-run-advance] State changed concurrently: expected=${from} actual=${curState} (id=${waveRunId})`,
            );
        }

        // Enforce gate inside tx (unless forced)
        if (requiresRegistryGate && !force) {
            await requireGatePassTx(tx as any, waveRunId, "registry_hash_matches");
        }

        // Create AgentRun (audit)
        const agentRun = await tx.agentRun.create({
            data: {
                agentId,
                action,
                status: "SUCCEEDED" as any,
                startedAt: new Date(),
                finishedAt: new Date(),
                summary: `WaveRun ${waveRunId} advanced ${from} -> ${target}`,
                inputs: { waveRunId, from, to: target, force, reason },
                outputs: { updated: plannedUpdate },
                userId,
                waveRunId,
            },
            select: { id: true },
        });

        // Update WaveRun state
        const updatedWaveRun = await tx.waveRun.update({
            where: { id: waveRunId },
            data: plannedUpdate,
            select: { id: true, state: true, startedAt: true, finishedAt: true, updatedAt: true },
        });

        // Artifact receipt
        const artifact = await tx.artifact.create({
            data: {
                type: "wave_state_transition",
                label: `WaveRun ${waveRunId}: ${from} -> ${target}`,
                content: {
                    waveRunId,
                    from,
                    to: target,
                    at: new Date().toISOString(),
                    force,
                    reason,
                    agentId,
                    agentRunId: agentRun.id,
                },
                waveRunId,
                agentRunId: agentRun.id,
            },
            select: { id: true },
        });

        // SotEvent receipt
        const eventId = `wave-state:${waveRunId}:${from}->${target}:${updatedWaveRun.updatedAt.toISOString()}`;
        await tx.sotEvent.create({
            data: {
                ts: new Date(),
                source: "dev.jai.nexus",
                kind: "wave.state.changed",
                nhId: "",
                eventId,
                summary: `WaveRun ${waveRunId} ${from} -> ${target}`,
                payload: {
                    waveRunId,
                    from,
                    to: target,
                    force,
                    reason,
                    agentId,
                    agentRunId: agentRun.id,
                    artifactId: artifact.id,
                },
            },
        });

        return {
            agentRunId: agentRun.id,
            artifactId: artifact.id,
            waveRun: updatedWaveRun,
        };
    });

    const out = {
        ok: true,
        action: "wave.run.advance",
        waveRunId,
        quarter: waveRun.quarter,
        wave: waveRun.wave,
        from,
        to: target,
        force,
        reason,
        agentId,
        agentRunId: result.agentRunId,
        artifactId: result.artifactId,
        waveRun: {
            state: result.waveRun.state,
            startedAt: result.waveRun.startedAt?.toISOString() ?? null,
            finishedAt: result.waveRun.finishedAt?.toISOString() ?? null,
            updatedAt: result.waveRun.updatedAt.toISOString(),
        },
        at: nowIso(),
    };

    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main().catch((err) => {
    process.stderr.write(`[wave-run-advance] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
