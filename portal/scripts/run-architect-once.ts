import "../env-register";

import { prisma } from "../src/lib/prisma";
import { getAgentByNhId } from "../src/lib/agencyConfig";
import { createArchitectAgentRuntime } from "../src/lib/work/architectRuntime";

async function main() {
    const nhId = String(process.argv[2] ?? "").trim();

    if (!nhId) {
        console.error("Usage: pnpm exec tsx scripts/run-architect-once.ts <agentNhId>");
        process.exitCode = 1;
        return;
    }

    const agent = getAgentByNhId(nhId);
    if (!agent) {
        throw new Error(`Agent not found: ${nhId}`);
    }

    if (!agent.execution_capable) {
        throw new Error(`Agent ${nhId} is not execution-capable.`);
    }

    if (!agent.execution_roles.includes("ARCHITECT")) {
        throw new Error(
            `Agent ${nhId} is not architect-eligible. Roles: ${agent.execution_roles.join(", ") || "—"}`,
        );
    }

    const runtime = createArchitectAgentRuntime(nhId);
    const ran = await runtime.runOnce();

    if (ran) {
        console.log(`[ARCHITECT-ONCE] Claimed and processed one architect packet for ${nhId}.`);
    } else {
        console.log(`[ARCHITECT-ONCE] No claimable architect packet found for ${nhId}.`);
    }
}

main()
    .catch((err) => {
        console.error("[ARCHITECT-ONCE] FAILED");
        console.error(err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
