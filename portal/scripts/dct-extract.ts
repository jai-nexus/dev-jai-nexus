// portal/scripts/dct-extract.ts
//
// Ingest hook: reads existing Decision records from the portal DB,
// maps each to a dct.idea.create SoT event with a chat anchor,
// and emits dct.slot.bind for active decisions.
//
// Usage:
//   pnpm dct:extract                    # write DCT events to DB
//   pnpm dct:extract -- --dry-run       # print events as JSON (no DB write)
//   npx tsx scripts/dct-extract.ts --dry-run
//

import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import type {
    IdeaCreatePayload,
    SlotBindPayload,
} from "@/lib/contracts/dctV01";
import type { IdeaType } from "@/lib/contracts/dctV01";

function mapCategory(category: string | null): IdeaType {
    switch (category) {
        case "deprecated":
            return "observation";
        case "milestone":
            return "definition";
        case "timeline":
            return "plan";
        case "architecture":
            return "decision";
        case "decision":
            return "decision";
        default:
            return "decision";
    }
}

function stableId(prefix: string, ...parts: (string | number)[]): string {
    const input = [prefix, ...parts.map(String)].join("|");
    const hash = crypto.createHash("sha256").update(input).digest("hex");
    return `${prefix}-${hash.slice(0, 12)}`;
}

async function main() {
    const dryRun = process.argv.includes("--dry-run");

    console.log("DCT Extract — Decision → Idea Mapper");
    console.log("=====================================\n");

    if (dryRun) {
        console.log("Mode: DRY RUN (no DB writes)\n");
    }

    // Load decisions with their source chat
    const decisions = await prisma.decision.findMany({
        orderBy: { createdAt: "asc" },
        include: {
            chat: {
                select: {
                    id: true,
                    chatId: true,
                    title: true,
                    chatDate: true,
                    source: true,
                    nhId: true,
                },
            },
        },
    });

    console.log(`Found ${decisions.length} decisions\n`);

    // Check for existing DCT events to avoid duplicates
    const existingDctCount = await prisma.sotEvent.count({
        where: { kind: { startsWith: "dct." } },
    });

    if (existingDctCount > 0 && !dryRun) {
        console.log(
            `⚠️  ${existingDctCount} DCT events already exist. Skipping to avoid duplicates.`
        );
        console.log(
            "   To re-extract, first run: DELETE FROM \"SotEvent\" WHERE kind LIKE 'dct.%'"
        );
        return;
    }

    type EventToCreate = {
        eventId: string;
        ts: Date;
        source: string;
        kind: string;
        nhId: string;
        summary: string;
        payload: Prisma.InputJsonValue;
        chatId: number | null;
    };

    const eventsToCreate: EventToCreate[] = [];

    for (const d of decisions) {
        const ideaId = stableId("idea", d.chatId, d.lineNumber ?? 0, d.text.slice(0, 80));
        const ts = d.chat.chatDate ?? d.createdAt;

        // 1. IDEA_CREATE
        const createPayload: IdeaCreatePayload = {
            type: "dct.idea.create",
            ideaId,
            text: d.text,
            ideaType: mapCategory(d.category),
            status: d.status === "active" ? "active" : "deprecated",
            confidence: 0.7,
            anchor: {
                type: "chat",
                chatId: d.chatId,
                chatExternalId: d.chat.chatId,
                lineNumber: d.lineNumber ?? undefined,
            },
            tags: d.category ? [d.category] : [],
            nhId: d.chat.nhId || d.nhId || "",
        };

        eventsToCreate.push({
            eventId: stableId("evt-dct", d.chatId, d.lineNumber ?? 0, "create"),
            ts,
            source: "dct-extract",
            kind: "dct.idea.create",
            nhId: createPayload.nhId,
            summary: `Create idea: ${d.text.slice(0, 80)}`,
            payload: createPayload as unknown as Prisma.InputJsonValue,
            chatId: d.chat.id,
        });

        // 2. SLOT_BIND for active decisions
        if (d.status === "active" && d.category) {
            const slotKey = `${d.category}.latest`;
            const bindPayload: SlotBindPayload = {
                type: "dct.slot.bind",
                slot: slotKey,
                ideaId,
            };

            eventsToCreate.push({
                eventId: stableId("evt-dct", d.chatId, d.lineNumber ?? 0, "bind", slotKey),
                ts: new Date(ts.getTime() + 1), // 1ms after create for ordering
                source: "dct-extract",
                kind: "dct.slot.bind",
                nhId: createPayload.nhId,
                summary: `Bind slot ${slotKey} → ${ideaId}`,
                payload: bindPayload as unknown as Prisma.InputJsonValue,
                chatId: d.chat.id,
            });
        }
    }

    console.log(`Generated ${eventsToCreate.length} DCT events\n`);

    if (dryRun) {
        // Print events as JSON
        const output = eventsToCreate.map((e) => ({
            eventId: e.eventId,
            ts: e.ts.toISOString(),
            source: e.source,
            kind: e.kind,
            nhId: e.nhId,
            summary: e.summary,
            payload: e.payload,
        }));
        console.log(JSON.stringify(output, null, 2));
        return;
    }

    // Write to DB
    let created = 0;
    for (const e of eventsToCreate) {
        await prisma.sotEvent.create({
            data: {
                eventId: e.eventId,
                ts: e.ts,
                source: e.source,
                kind: e.kind,
                nhId: e.nhId,
                summary: e.summary,
                payload: e.payload,
                chatId: e.chatId,
            },
        });
        created++;
    }

    console.log(`Done. Created ${created} DCT SoT events.`);
}

main()
    .catch((err) => {
        console.error("DCT extract failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
