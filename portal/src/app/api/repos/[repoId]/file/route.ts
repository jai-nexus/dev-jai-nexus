import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";

const WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  "..",
  "workspace"
);

type RouteParams = {
  repoId: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { repoId } = await context.params;
  const repoIdNum = Number(repoId);

  if (Number.isNaN(repoIdNum)) {
    return NextResponse.json(
      { error: "Invalid repoId" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const relPath = searchParams.get("path");

  if (!relPath) {
    return NextResponse.json(
      { error: "Missing ?path=" },
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

  // Derive owner/name from githubUrl
  const parts = repo.githubUrl.replace(/\.git$/, "").split("/");
  const name = parts.pop()!;
  const owner = parts.pop()!;

  const fullPath = path.join(
    WORKSPACE_ROOT,
    owner,
    name,
    relPath
  );

  // basic safety: prevent ../ escapes
  const normalized = path.normalize(fullPath);
  if (!normalized.startsWith(path.join(WORKSPACE_ROOT, owner, name))) {
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
