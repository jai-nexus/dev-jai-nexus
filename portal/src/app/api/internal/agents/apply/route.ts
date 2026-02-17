
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { prisma } from "@/lib/prisma";
import { rmSync, cpSync, mkdirSync, statSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getWorkspaceRoot, sanitizeRelPath } from "@/lib/agentEdits";
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

// Helper to recursively walk a directory
function getAllFiles(dir: string, fileList: string[] = []) {
    try {
        const files = readdirSync(dir);
        files.forEach((file) => {
            const filePath = path.join(dir, file);
            if (statSync(filePath).isDirectory()) {
                getAllFiles(filePath, fileList);
            } else {
                fileList.push(filePath);
            }
        });
    } catch {
        // ignore if dir doesn't exist
    }
    return fileList;
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
            include: { repo: true },
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

        const { owner, name } = parseGithubUrl(syncRun.repo.githubUrl || ""); // assume valid if we got here
        const workspaceRoot = getWorkspaceRoot();
        const repoRoot = path.join(workspaceRoot, owner, name);
        const stagingRoot = path.join(repoRoot, ".jai-agent-edits", String(syncRun.id));

        // Walk staged files
        const files = getAllFiles(stagingRoot);
        const appliedFiles: Array<{ relPath: string; sha256: string; bytes: number }> = [];

        for (const sourcePath of files) {
            // derive relPath
            const relPath = path.relative(stagingRoot, sourcePath);
            // sanitize and resolve target
            const sanitized = sanitizeRelPath(relPath); // handles traversal check
            const targetPath = path.resolve(repoRoot, sanitized);

            // Verify target is within repoRoot (double check)
            if (!targetPath.startsWith(repoRoot + path.sep) && targetPath !== repoRoot) {
                throw new Error(`Target path escape detected: ${relPath}`);
            }

            // Copy file
            mkdirSync(path.dirname(targetPath), { recursive: true });
            cpSync(sourcePath, targetPath, { force: true });

            // Compute metadata (read from target to be sure)
            const content = readFileSync(targetPath);
            const checksum = crypto
                .createHash("sha256")
                .update(content)
                .digest("hex");

            appliedFiles.push({
                relPath: sanitized,
                sha256: checksum,
                bytes: content.length,
            });
        }

        // Update SyncRun
        const currentPayload = (syncRun.payload as Prisma.JsonObject) || {};
        await prisma.syncRun.update({
            where: { id: syncRunId },
            data: {
                status: "APPLIED",
                finishedAt: new Date(),
                payload: {
                    ...currentPayload,
                    appliedFiles,
                    appliedAt: new Date().toISOString(),
                } as Prisma.InputJsonValue,
            },
        });

        // Cleanup
        rmSync(stagingRoot, { recursive: true, force: true });

        return NextResponse.json({
            ok: true,
            syncRunId,
            appliedCount: appliedFiles.length,
            appliedFiles,
        });

    } catch (e: unknown) {
        console.error("Apply failed:", e);
        const msg = e instanceof Error ? e.message : "Apply failed";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
