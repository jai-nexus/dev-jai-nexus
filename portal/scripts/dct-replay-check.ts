// portal/scripts/dct-replay-check.ts
//
// Verification script: asserts that applyDct() is deterministic.
// Reads events from --file <path> (JSON array) or from DB.
// Runs projection twice and deep-equals the results.
// Prints full quality metrics for visibility.
//

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

function usage() {
    console.error(
        [
            "Usage:",
            "  npx tsx scripts/dct-replay-check.ts --file <events.json>",
            "  pnpm dct:replay-check",
            "",
            "Options:",
            "  --file <path>   Path to JSON array of SotEvent-like objects",
            "  --db            Read dct.* events from database (requires .env.local)",
            "",
            "If neither flag is given, defaults to --file scripts/fixtures/dct-test-fixture.json",
        ].join("\n")
    );
}

async function loadFromFile(filePath: string): Promise<DctEventInput[]> {
    const absPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absPath)) {
        console.error("File not found:", absPath);
        process.exit(1);
    }

    const raw = fs.readFileSync(absPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
        console.error("Expected JSON array in file:", absPath);
        process.exit(1);
    }
    return parsed as DctEventInput[];
}

async function loadFromDb(): Promise<DctEventInput[]> {
    // Dynamic import to avoid requiring DB setup for file-mode
    const { prisma } = await import("@/lib/prisma");
    try {
        const events = await prisma.sotEvent.findMany({
            where: { kind: { startsWith: "dct." } },
            orderBy: [{ ts: "asc" }, { eventId: "asc" }],
        });
        return events.map((e) => ({
            eventId: e.eventId,
            ts: e.ts,
            kind: e.kind,
            source: e.source,
            summary: e.summary,
            payload: e.payload as unknown,
            nhId: e.nhId,
        }));
    } finally {
        await prisma.$disconnect();
    }
}

function sha256(obj: unknown): string {
    const json = JSON.stringify(obj);
    return crypto.createHash("sha256").update(json).digest("hex");
}

function deepEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
    const args = process.argv.slice(2);
    let useDb = false;
    let filePath: string | undefined;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--file") {
            filePath = args[i + 1];
            i++;
        } else if (args[i] === "--db") {
            useDb = true;
        } else if (args[i] === "--help" || args[i] === "-h") {
            usage();
            process.exit(0);
        }
    }

    // Default: use the test fixture
    if (!useDb && !filePath) {
        filePath = path.resolve(
            process.cwd(),
            "scripts/fixtures/dct-test-fixture.json"
        );
    }

    console.log("DCT Replay Determinism Check");
    console.log("============================\n");

    const events = useDb
        ? await loadFromDb()
        : await loadFromFile(filePath!);

    console.log(
        `Loaded ${events.length} event(s) from ${useDb ? "database" : filePath}`
    );

    // Run 1
    const result1 = applyDct(events);
    const hash1 = sha256(result1);

    // Run 2
    const result2 = applyDct(events);
    const hash2 = sha256(result2);

    console.log(`\nRun 1 hash: ${hash1}`);
    console.log(`Run 2 hash: ${hash2}`);
    console.log("");

    // Projection Metrics
    const m = result1.metrics;
    console.log("Projection Metrics:");
    console.log(`  Total ideas:          ${m.totalIdeas}`);
    console.log(`  Active ideas:         ${m.activeIdeasCount}`);
    console.log(`  Operating ideas:      ${m.operatingIdeasCount}`);
    console.log(`  Edges:                ${m.edgeCount}`);
    console.log(`  Slot bindings:        ${m.slotCount}`);
    console.log(`  Events processed:     ${m.eventsProcessed}`);
    console.log("");

    // Quality Counters
    console.log("Quality Counters:");
    console.log(`  Skipped (invalid payload):   ${m.eventsSkippedInvalidPayload}`);
    console.log(`  Skipped (kind≠payload.type): ${m.eventsSkippedKindPayloadMismatch}`);
    console.log(`  Skipped (unknown idea):      ${m.eventsSkippedUnknownIdea}`);
    console.log(`  Events with Legacy Anchors:  ${m.eventsWithLegacyAnchors}`);
    console.log("");

    // Operating Set detail
    console.log("Operating Set (slot-bound ideas):");
    for (const idea of result1.operatingSet) {
        console.log(`  [${idea.status}] ${idea.id}: ${idea.text.slice(0, 80)}`);
    }
    console.log("");

    if (hash1 !== hash2 || !deepEqual(result1, result2)) {
        console.error("FAIL: projection is NOT deterministic!");
        console.error("  Hash mismatch or deep-equal failed.");
        process.exit(1);
    }

    console.log("PASS: projection is deterministic ✓");
    console.log(`Content hash: ${hash1}`);
}

main().catch((err) => {
    console.error("Replay check failed:", err);
    process.exit(1);
});
