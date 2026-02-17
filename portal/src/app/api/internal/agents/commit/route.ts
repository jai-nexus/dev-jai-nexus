import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { prisma } from "@/lib/prisma";
import { mkdirSync, writeFileSync } from "node:fs";
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

type CommitBody = {
  repoId: number;
  path: string;
  content: string;
  message?: string;
  agent?: string;
};

function parseGithubUrl(url: string): { owner: string; name: string } {
  const cleaned = url.trim().replace(/\.git$/, "");

  // git@github.com:owner/name
  if (cleaned.startsWith("git@github.com:")) {
    const rest = cleaned.slice("git@github.com:".length);
    const [owner, name] = rest.split("/");
    if (!owner || !name) throw new Error(`Bad githubUrl: ${url}`);
    return { owner, name };
  }

  // https://github.com/owner/name
  const parts = cleaned.split("/");
  const name = parts.pop();
  const owner = parts.pop();
  if (!owner || !name) throw new Error(`Bad githubUrl: ${url}`);
  return { owner, name };
}

/**
 * POST /api/internal/agents/commit
 * Headers:
 *   Authorization: Bearer <JAI_INTERNAL_API_TOKEN>
 *
 * Body:
 *   { repoId, path, content, message?, agent? }
 */
export async function POST(req: NextRequest) {
  // This endpoint writes to local disk; don’t run it on Vercel.
  if (IS_VERCEL) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "agents/commit is disabled on Vercel runtime (filesystem workspace required). Run locally or on a runner with a persistent workspace.",
      },
      { status: 501 },
    );
  }

  const auth = assertInternalToken(req);
  if (!auth.ok) return auth.response;

  let body: CommitBody;
  try {
    body = (await req.json()) as CommitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { repoId, path: relPathRaw, content, message, agent } = body;

  if (
    typeof repoId !== "number" ||
    typeof relPathRaw !== "string" ||
    typeof content !== "string"
  ) {
    return NextResponse.json(
      {
        error:
          "Missing/invalid fields: repoId (number), path (string), content (string)",
      },
      { status: 400 },
    );
  }

  try {
    const relPath = sanitizeRelPath(relPathRaw);

    const repo = await prisma.repo.findUnique({ where: { id: repoId } });
    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }
    if (!repo.githubUrl) {
      return NextResponse.json(
        { error: "Repo missing githubUrl" },
        { status: 400 },
      );
    }

    const { owner, name } = parseGithubUrl(repo.githubUrl);

    // 1. Create SyncRun FIRST (PENDING_REVIEW)
    const now = new Date();
    const syncRun = await prisma.syncRun.create({
      data: {
        type: "agent-commit",
        status: "PENDING_REVIEW",
        trigger: agent ?? "unknown",
        summary: message ?? `Agent edit to ${relPath}`,
        startedAt: now,
        finishedAt: now,
        repo: { connect: { id: repoId } },
      },
    });

    // 2. Compute Staging Root: <repoRoot>/.jai-agent-edits/<syncRunId>/
    const workspaceRoot = getWorkspaceRoot();
    const repoRoot = path.join(workspaceRoot, owner, name);
    const stagingRoot = path.join(repoRoot, ".jai-agent-edits", String(syncRun.id));

    // 3. Write File
    const outAbs = path.resolve(stagingRoot, relPath);

    // Safety check: ensure outAbs is within stagingRoot
    if (!outAbs.startsWith(stagingRoot + path.sep) && outAbs !== stagingRoot) {
      throw new Error("Invalid path (escape)");
    }

    mkdirSync(path.dirname(outAbs), { recursive: true });
    writeFileSync(outAbs, content, "utf8");

    // 4. Update SyncRun Payload
    const checksum = crypto
      .createHash("sha256")
      .update(content, "utf8")
      .digest("hex");

    const bytes = Buffer.byteLength(content, "utf8");

    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        payload: {
          agent: agent ?? "unknown",
          stagingRoot: `.jai-agent-edits/${syncRun.id}`,
          files: [{ relPath, sha256: checksum, bytes }]
        } as Prisma.InputJsonValue
      }
    });

    return NextResponse.json(
      {
        ok: true,
        repoId,
        relPath,
        checksum,
        syncRunId: syncRun.id,
        message: message ?? null,
        reviewUrl: `/operator/sync-runs/${syncRun.id}/review`,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.error("Commit failed:", e);
    const msg = e instanceof Error ? e.message : "Commit failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
