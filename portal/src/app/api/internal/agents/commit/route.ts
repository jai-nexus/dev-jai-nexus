// portal/src/app/api/internal/agents/commit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { prisma } from "@/lib/prisma";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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

function getWorkspaceRoot() {
  // Prefer repo-root/workspace if present; otherwise portal/workspace
  const cwd = process.cwd(); // usually portal/
  const candidates = [
    path.resolve(cwd, "..", "workspace"),
    path.resolve(cwd, "workspace"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  // create-on-demand fallback (local/dev)
  return candidates[0];
}

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

function sanitizeRelPath(input: string) {
  const s = input.replace(/\\/g, "/").trim();

  if (!s || s.startsWith("/") || s.includes("\0")) {
    throw new Error("Invalid path");
  }

  // prevent traversal
  const parts = s.split("/").filter(Boolean);
  if (parts.some((p) => p === "." || p === "..")) {
    throw new Error("Invalid path (traversal)");
  }

  return parts.join("/");
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

  const workspaceRoot = getWorkspaceRoot();
  const repoRoot = path.join(workspaceRoot, owner, name);
  const editsRoot = path.join(repoRoot, ".jai-agent-edits");

  // Write the staged edit under .jai-agent-edits/<relPath>
  const outAbs = path.resolve(editsRoot, relPath);
  const editsAbs = path.resolve(editsRoot);

  if (!outAbs.startsWith(editsAbs + path.sep) && outAbs !== editsAbs) {
    return NextResponse.json({ error: "Invalid path (escape)" }, { status: 400 });
  }

  mkdirSync(path.dirname(outAbs), { recursive: true });
  writeFileSync(outAbs, content, "utf8");

  const checksum = crypto
    .createHash("sha256")
    .update(content, "utf8")
    .digest("hex");

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
}
