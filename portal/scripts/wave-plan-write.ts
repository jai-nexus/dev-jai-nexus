// portal/scripts/wave-plan-write.ts
import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import { prisma } from "../src/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// args (supports --key value AND --key=value)
// IMPORTANT: when running via pnpm/tsx, use `--` before script args in PowerShell.
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv: string[]) {
    const out: Record<string, string | boolean> = {};

    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith("--")) continue;

        // Support --key=value
        const eq = a.indexOf("=");
        if (eq !== -1) {
            const key = a.slice(2, eq).trim();
            const val = a.slice(eq + 1).trim();
            out[key] = val === "" ? true : val;
            continue;
        }

        // Support --key value
        const key = a.slice(2).trim();
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

function toInt(v: unknown, fallback?: number) {
    if (v === undefined || v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function nowIso() {
    return new Date().toISOString();
}

function sha256Hex(input: string | Buffer) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

function normalizePath(p: string) {
    return p.replace(/\\/g, "/");
}

function isProbablyMarkdown(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    return ext === ".md" || ext === ".markdown";
}

// ─────────────────────────────────────────────────────────────────────────────
// main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    const args = parseArgs(process.argv.slice(2));

    // waveRunId from args OR env
    const argWaveRunId =
        args["waveRunId"] ??
        args["waveRunID"] ??
        args["wave_run_id"] ??
        args["wave_runId"] ??
        undefined;

    const waveRunId =
        argWaveRunId !== undefined
            ? toInt(argWaveRunId)
            : process.env.WAVE_RUN_ID
                ? toInt(process.env.WAVE_RUN_ID)
                : undefined;

    if (!waveRunId || !Number.isFinite(waveRunId)) {
        throw new Error(
            `[wave-plan-write] Missing --waveRunId (or env WAVE_RUN_ID). PowerShell safest form: -- --waveRunId 4`,
        );
    }

    const planFile = (args["planFile"] as string | undefined) ?? (args["file"] as string | undefined);
    const inlinePlan = (args["plan"] as string | undefined) ?? undefined;

    const dryRun = Boolean(args["dryRun"]);
    const agentId = (args["agentId"] as string | undefined) ?? process.env.AGENT_ID ?? "jai_operator";
    const action = (args["action"] as string | undefined) ?? "write_wave_plan";
    const reason = (args["reason"] as string | undefined) ?? "manual plan write";

    const createdByEmail =
        (args["userEmail"] as string | undefined) ?? process.env.WAVE_CREATED_BY_EMAIL ?? undefined;

    let userId: string | null = null;
    if (createdByEmail) {
        const u = await prisma.user.findUnique({
            where: { email: createdByEmail },
            select: { id: true },
        });
        userId = u?.id ?? null;
    }

    // Load wave run + snapshot context
    const waveRun = await prisma.waveRun.findUnique({
        where: { id: waveRunId },
        select: {
            id: true,
            quarter: true,
            wave: true,
            state: true,
            snapshotId: true,
            snapshot: {
                select: {
                    id: true,
                    quarter: true,
                    version: true,
                    locked: true,
                    contentHash: true,
                    sourcePath: true,
                    lockedAt: true,
                },
            },
        },
    });

    if (!waveRun) throw new Error(`[wave-plan-write] WaveRun not found: id=${waveRunId}`);

    // Read plan text
    let planText: string;
    let sourcePath: string | null = null;
    let format: "md" | "json" | "text" = "text";

    if (planFile) {
        const abs = path.isAbsolute(planFile) ? planFile : path.join(process.cwd(), planFile);
        const buf = await fs.readFile(abs);
        planText = buf.toString("utf8");
        sourcePath = normalizePath(path.relative(process.cwd(), abs));
        format = isProbablyMarkdown(planFile) ? "md" : "text";
    } else if (inlinePlan && inlinePlan.trim().length > 0) {
        planText = inlinePlan;
        sourcePath = null;
        format = "text";
    } else {
        throw new Error(`[wave-plan-write] Provide --planFile <path> or --plan "<text>"`);
    }

    const planHash = sha256Hex(planText);

    const outPreview = {
        ok: true,
        action: "wave.plan.write",
        dryRun,
        waveRunId,
        quarter: waveRun.quarter,
        wave: waveRun.wave,
        state: waveRun.state,
        snapshot: waveRun.snapshot
            ? {
                id: waveRun.snapshot.id,
                quarter: waveRun.snapshot.quarter,
                version: waveRun.snapshot.version,
                locked: waveRun.snapshot.locked,
                contentHash: waveRun.snapshot.contentHash,
                sourcePath: waveRun.snapshot.sourcePath,
                lockedAt: waveRun.snapshot.lockedAt ? waveRun.snapshot.lockedAt.toISOString() : null,
            }
            : null,
        plan: {
            format,
            sourcePath,
            sha256: planHash,
            bytes: Buffer.byteLength(planText, "utf8"),
            preview: planText.slice(0, 180),
        },
        agent: {
            agentId,
            userEmail: createdByEmail ?? null,
        },
        at: nowIso(),
    };

    if (dryRun) {
        process.stdout.write(`${JSON.stringify(outPreview, null, 2)}\n`);
        return;
    }

    const result = await prisma.$transaction(async (tx) => {
        // AgentRun receipt
        const agentRun = await tx.agentRun.create({
            data: {
                agentId,
                action,
                status: "SUCCEEDED" as any,
                startedAt: new Date(),
                finishedAt: new Date(),
                summary: `WaveRun ${waveRunId} plan written (${format}, ${planHash.slice(0, 12)}…)`,
                inputs: {
                    waveRunId,
                    quarter: waveRun.quarter,
                    wave: waveRun.wave,
                    reason,
                    plan: { format, sourcePath, sha256: planHash },
                },
                outputs: {
                    planHash,
                    bytes: Buffer.byteLength(planText, "utf8"),
                },
                userId,
                waveRunId,
            },
            select: { id: true },
        });

        // Artifact: wave plan
        const artifact = await tx.artifact.create({
            data: {
                type: "wave_plan",
                label: `WaveRun ${waveRunId} Plan (${waveRun.quarter} / wave ${waveRun.wave})`,
                content: {
                    waveRunId,
                    quarter: waveRun.quarter,
                    wave: waveRun.wave,
                    state: waveRun.state,
                    snapshotId: waveRun.snapshotId,
                    snapshotHash: waveRun.snapshot?.contentHash ?? null,
                    plan: {
                        format,
                        sourcePath,
                        sha256: planHash,
                        text: planText,
                    },
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

        // SotEvent receipt (idempotent-ish)
        const eventId = `wave-plan:${waveRunId}:${planHash.slice(0, 16)}:${new Date().toISOString()}`;
        await tx.sotEvent.create({
            data: {
                ts: new Date(),
                source: "dev.jai.nexus",
                kind: "wave.plan.written",
                nhId: "",
                eventId,
                summary: `WaveRun ${waveRunId} plan written`,
                payload: {
                    waveRunId,
                    quarter: waveRun.quarter,
                    wave: waveRun.wave,
                    snapshotId: waveRun.snapshotId,
                    snapshotHash: waveRun.snapshot?.contentHash ?? null,
                    plan: { format, sourcePath, sha256: planHash },
                    reason,
                    agentId,
                    agentRunId: agentRun.id,
                    artifactId: artifact.id,
                },
            },
        });

        return { agentRunId: agentRun.id, artifactId: artifact.id };
    });

    process.stdout.write(
        `${JSON.stringify(
            {
                ok: true,
                action: "wave.plan.write",
                waveRunId,
                quarter: waveRun.quarter,
                wave: waveRun.wave,
                artifactId: result.artifactId,
                agentRunId: result.agentRunId,
                plan: { format, sourcePath, sha256: planHash },
                at: nowIso(),
            },
            null,
            2,
        )}\n`,
    );
}

main().catch((err) => {
    process.stderr.write(`[wave-plan-write] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
