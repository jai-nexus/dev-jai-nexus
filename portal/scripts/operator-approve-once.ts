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

async function findRepoRoot(startDir: string): Promise<string | null> {
    const { existsSync } = await import("node:fs");
    const { dirname, join } = await import("node:path");
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        if (existsSync(join(cur, ".nexus"))) return cur;
        const parent = dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

async function main() {
    await loadNextEnv();

    const packetId = Number(String(process.argv[2] ?? "").trim());

    if (!packetId || Number.isNaN(packetId)) {
        console.error("[OPERATOR-APPROVE-ONCE] Usage: pnpm exec tsx scripts/operator-approve-once.ts <workPacketId>");
        process.exit(1);
    }

    const [
        { prisma },
        { applyPacketRouteAction },
        { coerceStringArray, getMotionFromTags },
        { existsSync, writeFileSync },
        { join },
    ] = await Promise.all([
        import("@/lib/prisma"),
        import("@/lib/work/workPacketActions"),
        import("@/lib/work/workPacketContract"),
        import("node:fs"),
        import("node:path"),
    ]);

    // --- verify pre-condition ---

    const packet = await prisma.workPacket.findUnique({
        where: { id: packetId },
        select: { id: true, nhId: true, status: true },
    });

    if (!packet) {
        console.error(`[OPERATOR-APPROVE-ONCE] WorkPacket not found: ${packetId}`);
        process.exit(1);
    }

    const inbox = await prisma.agentInboxItem.findFirst({
        where: { workPacketId: packetId },
        orderBy: { id: "desc" },
        select: { tags: true },
    });

    const tags = coerceStringArray(inbox?.tags);
    const routeTag = tags.find((t: string) => t.startsWith("route:"));
    const currentRoute = routeTag?.slice("route:".length).toUpperCase() ?? null;

    if (currentRoute !== "OPERATOR_REVIEW") {
        console.error(`\n[OPERATOR-APPROVE-ONCE] ERROR: Packet is not at OPERATOR_REVIEW stage.`);
        console.error(`[OPERATOR-APPROVE-ONCE] Current route: ${currentRoute ?? "(none — no route tag)"}`);
        console.error(`[OPERATOR-APPROVE-ONCE] Current tags:  ${JSON.stringify(tags)}`);
        console.error(`[OPERATOR-APPROVE-ONCE] Only packets at route:OPERATOR_REVIEW can be approved.\n`);
        process.exit(1);
    }

    console.log(`[OPERATOR-APPROVE-ONCE] Packet:  ${packet.nhId} (id=${packet.id})`);
    console.log(`[OPERATOR-APPROVE-ONCE] Route:   ${currentRoute} ✓`);
    console.log(`[OPERATOR-APPROVE-ONCE] Status:  ${packet.status}`);
    console.log(`[OPERATOR-APPROVE-ONCE] Tags:    ${JSON.stringify(tags)}`);
    console.log();

    const actor = { email: null as null, name: "operator-approve-script:6.0.14" };

    // --- apply APPROVE action ---

    const result = await applyPacketRouteAction({
        packetId: packet.id,
        action: "APPROVE",
        actor,
        note: "Operator approval via governed proof script (operator-approve-once.ts).",
    });

    console.log(`[OPERATOR-APPROVE-ONCE] applyPacketRouteAction:`);
    console.log(`[OPERATOR-APPROVE-ONCE]   ok:         ${result.ok}`);
    console.log(`[OPERATOR-APPROVE-ONCE]   kind:       ${result.kind}`);
    console.log(`[OPERATOR-APPROVE-ONCE]   nextStatus: ${result.nextStatus}`);
    console.log(`[OPERATOR-APPROVE-ONCE]   inboxStatus:${result.inboxStatus}`);
    console.log();

    // --- write execution.receipt.json (mirrors web UI behavior) ---

    const motionId = getMotionFromTags(tags);
    if (motionId && packet.nhId) {
        const repoRoot = await findRepoRoot(process.cwd());
        if (repoRoot) {
            const motionDir = join(repoRoot, ".nexus", "motions", motionId);
            if (existsSync(motionDir)) {
                const receipt = {
                    version: "0.1",
                    motion_id: motionId,
                    packet_nh_id: packet.nhId,
                    receipt_id: `${motionId}-receipt-001`,
                    closed_at: new Date().toISOString(),
                    closed_by: actor.name ?? "operator:unknown",
                    outcome: "COMPLETED",
                    status: "COMPLETED",
                    operator_action: "APPROVE",
                    notes: "Operator approval via governed proof script.",
                };
                writeFileSync(
                    join(motionDir, "execution.receipt.json"),
                    JSON.stringify(receipt, null, 2) + "\n",
                    "utf-8",
                );
                console.log(`[OPERATOR-APPROVE-ONCE] Receipt written: .nexus/motions/${motionId}/execution.receipt.json`);
            }
        }
    }

    console.log();
    console.log(`[OPERATOR-APPROVE-ONCE] --- Approval complete ---`);
    console.log(`[OPERATOR-APPROVE-ONCE] WorkPacket ${packetId} approved.`);
    console.log(`[OPERATOR-APPROVE-ONCE] WorkPacket status: DONE`);
    console.log(`[OPERATOR-APPROVE-ONCE] SoT kind: WORK_APPROVED`);
}

main().catch((err) => {
    console.error("[OPERATOR-APPROVE-ONCE] UNCAUGHT FAILURE");
    console.error(err);
    process.exit(1);
});
