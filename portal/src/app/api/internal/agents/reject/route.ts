
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { prisma } from "@/lib/prisma";
import { rmSync } from "node:fs";
import path from "node:path";
import { getWorkspaceRoot } from "@/lib/agentEdits";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

const IS_VERCEL =
    process.env.VERCEL === "1" ||
    process.env.VERCEL === "true" ||
    !!process.env.VERCEL_ENV ||
    process.env.NEXT_RUNTIME === "edge";

function parseGithubUrl(url: string): { owner: string; name: string } {
    const cleaned = url.trim().replace(/\.git$/, "");
    if (cleaned.startsWith("git@github.com:")) {
        const rest = cleaned.slice("git@github.com:".length);
        const [owner, name] = rest.split("/");
        return { owner, name };
    }
    const parts = cleaned.split("/");
    const name = parts.pop();
    const owner = parts.pop();
    return { owner: owner!, name: name! };
}

export async function POST(req: NextRequest) {
    if (IS_VERCEL) {
        return NextResponse.json(
            { ok: false, error: "Missing filesystem access (Vercel runtime)." },
            { status: 501 }
        );
    }

    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    let body: { syncRunId: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { syncRunId } = body;
    if (typeof syncRunId !== "number") {
        return NextResponse.json({ error: "Missing syncRunId" }, { status: 400 });
    }

    try {
        const syncRun = await prisma.syncRun.findUnique({
            where: { id: syncRunId },
            include: { repo: true }
        });

        if (!syncRun) {
            return NextResponse.json({ error: "SyncRun not found" }, { status: 404 });
        }
        if (syncRun.status !== "PENDING_REVIEW") {
            return NextResponse.json({ error: "SyncRun not pending review" }, { status: 400 });
        }
        if (!syncRun.repo) {
            return NextResponse.json({ error: "Repo not attached" }, { status: 400 });
        }

        const { owner, name } = parseGithubUrl(syncRun.repo.githubUrl || "");
        const workspaceRoot = getWorkspaceRoot();
        const repoRoot = path.join(workspaceRoot, owner, name);
        const stagingRoot = path.join(repoRoot, ".jai-agent-edits", String(syncRun.id));

        // Cleanup
        rmSync(stagingRoot, { recursive: true, force: true });

        // Update SyncRun
        const currentPayload = (syncRun.payload as Prisma.JsonObject) || {};
        await prisma.syncRun.update({
            where: { id: syncRunId },
            data: {
                status: "REJECTED",
                finishedAt: new Date(),
                payload: {
                    ...currentPayload,
                    rejectedAt: new Date().toISOString(),
                } as Prisma.InputJsonValue,
            },
        });

        return NextResponse.json({ ok: true, syncRunId });

    } catch (e: unknown) {
        console.error("Reject failed:", e);
        const msg = e instanceof Error ? e.message : "Reject failed";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
