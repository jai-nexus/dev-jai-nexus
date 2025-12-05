#!/usr/bin/env tsx
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const ts = new Date().toISOString();

  const event = await prisma.sotEvent.create({
    data: {
      ts: new Date(ts),
      source: "offbook-deploy-script",
      kind: "OFFBOOK_V0_DEPLOYED",
      summary: "OffBook.ai v0 deployed to Vercel; landing + local beta signup live.",
      nhId: "2.1", // OffBook root NH_ID
      payload: {
        projectId: "offbook.v0",
        repo: "JerryIngram/offbook-ai",
        env: "production",
        url: "https://YOUR-VERCEL-URL/landing", // <-- update this
        tier: 1,
        notes:
          "V0 scope: marketing landing at /landing and local-only beta signup; no auth or DB yet.",
      },
    },
  });

  console.log("OFFBOOK_V0_DEPLOYED event written:", event.id);
}

main().catch((err) => {
  console.error("Failed to emit OFFBOOK_V0_DEPLOYED event:", err);
  process.exit(1);
});
