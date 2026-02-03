import { ArchitectAgent } from "@/agents/architectAgent";

async function main() {
    const agent = new ArchitectAgent();

    console.log("ARCHITECT 1.2.1 polling…");

    await agent.start();

    const shutdown = async (signal: string) => {
        console.log(`[ARCHITECT 1.2.1] received ${signal}, stopping…`);
        await agent.stop();
        process.exit(0);
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((e) => {
    console.error("[ARCHITECT 1.2.1] fatal error", e);
    process.exit(1);
});
