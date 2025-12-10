// portal/src/app/api/repos/[repoId]/file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs";

type RouteParams = {
  repoId: string;
};

// Must match scripts/jai-sync-repos.ts
const WORKSPACE_ROOT =
  process.env.WORKSPACE_ROOT ??
  path.join(process.cwd(), "..", "workspace");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  // --- 1) Unwrap dynamic params --------------------------------
  const { repoId } = await params;
  const repoIdNum = Number(repoId);

  if (!repoId || Number.isNaN(repoIdNum)) {
    return NextResponse.json(
      { error: `Invalid repoId: ${repoId ?? "missing"}` },
      { status: 400 }
    );
  }

  // --- 2) Read ?path=... ---------------------------------------
  const { searchParams } = new URL(req.url);
  const relPath = searchParams.get("path");

  if (!relPath) {
    return NextResponse.json(
      { error: "Missing path query parameter `path`" },
      { status: 400 }
    );
  }

  // --- 3) Look up repo to get owner/name -----------------------
  const repo = await prisma.repo.findUnique({
    where: { id: repoIdNum },
  });

  if (!repo) {
    return NextResponse.json(
      { error: `Repo not found for id ${repoIdNum}` },
      { status: 404 }
    );
  }

  // repo.name is like "jai-nexus/dev-jai-nexus"
  const [owner, repoName] = repo.name.split("/");
  if (!owner || !repoName) {
    return NextResponse.json(
      { error: `Invalid repo.name format: ${repo.name}` },
      { status: 500 }
    );
  }

  // --- 4) Build safe absolute path inside that repo ------------
  const safeRelPath = relPath.replace(/^[/\\]+/, "");

  const repoRoot = path.join(WORKSPACE_ROOT, owner, repoName) + path.sep;
  const fullPath = path.join(repoRoot, safeRelPath);
  const normalized = path.normalize(fullPath);

  // Prevent escaping workspace
  if (!normalized.startsWith(repoRoot)) {
    return NextResponse.json(
      { error: "Invalid path", details: { relPath } },
      { status: 400 }
    );
  }

  if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
    return NextResponse.json(
      {
        error: "File not found",
        // TEMP debug so we can see what it's checking
        debug: {
          relPath,
          normalized,
          repoRoot,
        },
      },
      { status: 404 }
    );
  }

  // --- 5) Read and return content ------------------------------
  const content = fs.readFileSync(normalized, "utf8");

  return NextResponse.json({
    repoId: repoIdNum,
    path: relPath,
    content,
  });
}
