// portal/scripts/sql-wave-run-4.ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { Prisma } from "@prisma/client";

type Args = {
    waveRunId?: number;
    limit?: number;
    pretty?: boolean;
    debug?: boolean;
};

function parseArgs(argv: string[]): Args {
    const args: Args = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];

        if (a === "--waveRunId" || a === "--wave-run-id") {
            const v = argv[i + 1];
            if (v) args.waveRunId = Number(v);
            i++;
            continue;
        }
        if (a.startsWith("--waveRunId=")) {
            args.waveRunId = Number(a.split("=", 2)[1]);
            continue;
        }

        if (a === "--limit") {
            const v = argv[i + 1];
            if (v) args.limit = Number(v);
            i++;
            continue;
        }
        if (a.startsWith("--limit=")) {
            args.limit = Number(a.split("=", 2)[1]);
            continue;
        }

        if (a === "--pretty") args.pretty = true;
        if (a === "--debug") args.debug = true;
    }
    return args;
}

function asInt(v: unknown): number | undefined {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

async function main() {
    const argv = process.argv.slice(2);
    const parsed = parseArgs(argv);

    const envWaveRunId = asInt(process.env.WAVE_RUN_ID);
    const waveRunId = parsed.waveRunId ?? envWaveRunId ?? 4;

    const limit = clamp(parsed.limit ?? 20, 1, 200);
    const pretty = parsed.pretty ?? false;
    const debug = parsed.debug ?? false;

    if (!Number.isInteger(waveRunId) || waveRunId <= 0) {
        throw new Error(
            `[sql-wave-run] Invalid waveRunId="${waveRunId}". Use --waveRunId <int> or env WAVE_RUN_ID.`
        );
    }

    if (debug) {
        process.stderr.write(
            `[sql-wave-run] waveRunId=${waveRunId} limit=${limit} pretty=${pretty}\n`
        );
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
            updatedAt: true,
        },
    });

    if (!waveRun) {
        process.stdout.write(
            JSON.stringify(
                { ok: false, error: `WaveRun not found (id=${waveRunId})`, waveRunId, at: new Date().toISOString() },
                null,
                pretty ? 2 : 0
            ) + "\n"
        );
        return;
    }

    const agentRuns = await prisma.agentRun.findMany({
        where: { waveRunId },
        orderBy: { id: "desc" },
        take: 10,
        select: {
            id: true,
            agentId: true,
            action: true,
            status: true,
            startedAt: true,
            finishedAt: true,
            summary: true,
        },
    });

    const artifacts = await prisma.artifact.findMany({
        where: { waveRunId },
        orderBy: { id: "desc" },
        take: 10,
        select: {
            id: true,
            type: true,
            label: true,
            createdAt: true,
        },
    });

    // payload is JSON; filter with ->> (text extraction)
    const sotEvents = await prisma.$queryRaw<
        Array<{ id: number; ts: Date; kind: string; eventId: string; summary: string | null }>
    >(Prisma.sql`
    select
      id,
      ts,
      kind,
      "eventId" as "eventId",
      summary
    from "SotEvent"
    where payload->>'waveRunId' = ${String(waveRunId)}
    order by id desc
    limit ${limit};
  `);

    const out = {
        ok: true,
        waveRunId,
        limits: { sotEvents: limit, agentRuns: 10, artifacts: 10 },
        waveRun,
        agentRuns,
        artifacts,
        sotEvents,
        at: new Date().toISOString(),
    };

    process.stdout.write(JSON.stringify(out, null, pretty ? 2 : 0) + "\n");
}

main().catch((err) => {
    process.stderr.write(String(err?.stack ?? err) + "\n");
    process.exitCode = 1;
});
