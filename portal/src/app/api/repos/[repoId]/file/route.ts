import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "workspace");

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const segments = url.pathname.split("/").filter(Boolean);
  // /api/repos/1/file -> ["api","repos","1","file"]
  const repoIdSegment = segments[2];

  if (!repoIdSegment) {
    return NextResponse.json(
      { error: "Invalid repoId: missing" },
      { status: 400 }
    );
  }

  const repoIdNum = Number(repoIdSegment);
  if (Number.isNaN(repoIdNum)) {
    return NextResponse.json(
      { error: `Invalid repoId: ${repoIdSegment}` },
      { status: 400 }
    );
  }

  const relPath = url.searchParams.get("path");
  if (!relPath) {
    return NextResponse.json(
      { error: "Missing 'path' query param" },
      { status: 400 }
    );
  }

  const repo = await prisma.repo.findUnique({
    where: { id: repoIdNum },
  });

  if (!repo || !repo.githubUrl) {
    return NextResponse.json(
      { error: "Repo not found or missing githubUrl" },
      { status: 404 }
    );
  }

  const [_, owner, repoName] = new URL(repo.githubUrl).pathname
    .split("/")
    .filter(Boolean); // ["jai-nexus","dev-jai-nexus"]

  const fullPath = path.join(
    WORKSPACE_ROOT,
    owner,
    repoName,
    relPath.replace(/\\/g, "/")
  );
  const normalized = path.normalize(fullPath);
  const repoRoot = path.join(WORKSPACE_ROOT, owner, repoName) + path.sep;

  if (!normalized.startsWith(repoRoot)) {
    return NextResponse.json(
      { error: "Invalid path" },
      { status: 400 }
    );
  }

  if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }

  const content = fs.readFileSync(normalized, "utf8");

  return NextResponse.json({
    repoId: repoIdNum,
    path: relPath,
    content,
  });
}
