// portal/scripts/wave-run-report.ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

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

function toInt(v: unknown) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    const waveRunId =
        toInt(args["waveRunId"]) ??
        toInt(args["wave_run_id"]) ??
        toInt(process.env.WAVE_RUN_ID);

    if (!waveRunId) {
        throw new Error(`[wave-run-report] Missing --waveRunId (or env WAVE_RUN_ID)`);
    }

    const waveRun = await prisma.waveRun.findUnique({
        where: { id: waveRunId },
    });

    const gateRuns = await prisma.gateRun.findMany({
        where: { waveRunId },
        orderBy: { gateId: "asc" as any },
    });

    const agentRuns = await prisma.agentRun.findMany({
        where: { waveRunId },
        orderBy: { id: "desc" },
        take: 25,
    });

    const artifacts = await prisma.artifact.findMany({
        where: { waveRunId },
        orderBy: { id: "desc" },
        take: 25,
    });

    // SotEvent filtering via JSON path is schema/engine sensitive; try both number and string.
    // If this throws, comment it out and rely on Studio for SotEvent.
    let sotEvents: any[] = [];
    try {
        sotEvents = await prisma.sotEvent.findMany({
            where: {
                OR: [
                    { payload: { path: ["waveRunId"], equals: waveRunId } as any },
                    { payload: { path: ["waveRunId"], equals: String(waveRunId) } as any },
                ],
            },
            orderBy: { id: "desc" },
            take: 50,
        });
    } catch (e) {
        sotEvents = [
            {
                warn:
                    "SotEvent JSON-path filter failed in this Prisma/PG setup. Use Prisma Studio or add a dedicated waveRunId column.",
                error: String((e as any)?.message ?? e),
            },
        ];
    }

    const out = {
        ok: true,
        waveRunId,
        waveRun,
        gateRuns,
        agentRuns,
        artifacts,
        sotEvents,
        at: new Date().toISOString(),
    };

    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main().catch((err) => {
    process.stderr.write(`[wave-run-report] ERROR: ${err?.stack ?? String(err)}\n`);
    process.exitCode = 1;
});
