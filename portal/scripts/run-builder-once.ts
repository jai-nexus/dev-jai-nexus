export { };

async function loadNextEnv() {
    const mod = await import("@next/env");

    const maybeNamed =
        "loadEnvConfig" in mod ? mod.loadEnvConfig : undefined;

    const maybeDefault =
        "default" in mod &&
            mod.default &&
            typeof mod.default === "object" &&
            "loadEnvConfig" in mod.default
            ? (mod.default as { loadEnvConfig?: (dir: string) => void }).loadEnvConfig
            : undefined;

    const loadEnvConfig = maybeNamed ?? maybeDefault;

    if (typeof loadEnvConfig !== "function") {
        throw new Error("Could not resolve loadEnvConfig from @next/env");
    }

    loadEnvConfig(process.cwd());
}

async function main() {
    await loadNextEnv();

    const nhId = String(process.argv[2] ?? "").trim();

    if (!nhId) {
        console.error("[BUILDER-ONCE] Usage: pnpm exec tsx scripts/run-builder-once.ts <agentNhId>");
        process.exit(1);
    }

    const [{ BuilderAgentRuntime }, { getAgentByNhId, isAgentEligibleForExecutionRole }] =
        await Promise.all([
            import("@/lib/work/builderRuntime"),
            import("@/lib/agencyConfig"),
        ]);

    const agent = getAgentByNhId(nhId);

    if (!agent) {
        console.error(`[BUILDER-ONCE] Agent not found: ${nhId}`);
        process.exit(1);
    }

    if (!agent.execution_capable) {
        console.error(
            `[BUILDER-ONCE] Agent ${nhId} (${agent.agent_key}) is not execution-capable.`,
        );
        process.exit(1);
    }

    if (!isAgentEligibleForExecutionRole(agent, "BUILDER")) {
        console.error(
            `[BUILDER-ONCE] Agent ${nhId} (${agent.agent_key}) is not eligible for BUILDER.`,
        );
        process.exit(1);
    }

    const runtime = new BuilderAgentRuntime(nhId);

    try {
        const ok = await runtime.runOnce();

        if (!ok) {
            console.log(`[BUILDER-ONCE] No claimable builder packet found for ${nhId}.`);
            return;
        }

        console.log(`[BUILDER-ONCE] Claimed and processed one builder packet for ${nhId}.`);
    } catch (err) {
        console.error("[BUILDER-ONCE] FAILED");
        console.error(err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("[BUILDER-ONCE] UNCAUGHT FAILURE");
    console.error(err);
    process.exit(1);
});
