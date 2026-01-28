
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// schema.prisma is at portal/prisma/schema.prisma
const SCHEMA_PATH = path.join(__dirname, "..", "prisma", "schema.prisma");

async function main() {
    console.log(`[schema:fingerprint] Hashing ${SCHEMA_PATH}...`);

    const content = await fs.readFile(SCHEMA_PATH, "utf8");
    const sha256 = crypto.createHash("sha256").update(content).digest("hex");
    const eventId = `schema-v1-${sha256}`;

    console.log(`[schema:fingerprint] Hash: ${sha256}`);

    // Check if exists
    const existing = await prisma.sotEvent.findUnique({
        where: { eventId }
    });

    if (existing) {
        console.log(`[schema:fingerprint] Event already exists (id=${existing.id}). No-op.`);
    } else {
        const event = await prisma.sotEvent.create({
            data: {
                eventId,
                ts: new Date(),
                source: "dev-jai-nexus",
                kind: "system.schema.snapshot",
                summary: "Control Plane Prisma Schema Fingerprint",
                payload: {
                    sha256,
                    file: "portal/prisma/schema.prisma"
                }
            }
        });
        console.log(`[schema:fingerprint] Created SotEvent (id=${event.id}).`);
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
