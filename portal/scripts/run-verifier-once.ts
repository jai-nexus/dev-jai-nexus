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
        console.error("[VERIFIER-ONCE] Usage: pnpm exec tsx scripts/run-verifier-once.ts <agentNhId>");
        process.exit(1);
    }

    const [{ VerifierAgentRuntime }, { getAgentByNhId, isAgentEligibleForExecutionRole }] =
        await Promise.all([
            import("@/lib/work/verifierRuntime"),
            import("@/lib/agencyConfig"),
        ]);

    const agent = getAgentByNhId(nhId);

    if (!agent) {
        console.error(`[VERIFIER-ONCE] Agent not found: ${nhId}`);
        process.exit(1);
    }

    if (!agent.execution_capable) {
        console.error(
            `[VERIFIER-ONCE] Agent ${nhId} (${agent.agent_key}) is not execution-capable.`,
        );
        process.exit(1);
    }

    if (!isAgentEligibleForExecutionRole(agent, "VERIFIER")) {
        console.error(
            `[VERIFIER-ONCE] Agent ${nhId} (${agent.agent_key}) is not eligible for VERIFIER.`,
        );
        process.exit(1);
    }

    const runtime = new VerifierAgentRuntime(nhId);

    try {
        const ok = await runtime.runOnce();

        if (!ok) {
            console.log(`[VERIFIER-ONCE] No claimable verifier packet found for ${nhId}.`);
            return;
        }

        console.log(`[VERIFIER-ONCE] Claimed and processed one verifier packet for ${nhId}.`);
    } catch (err) {
        console.error("[VERIFIER-ONCE] FAILED");
        console.error(err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("[VERIFIER-ONCE] UNCAUGHT FAILURE");
    console.error(err);
    process.exit(1);
});
