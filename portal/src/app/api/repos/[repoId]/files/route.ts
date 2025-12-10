import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // /api/repos/1/files -> ["api","repos","1","files"]
  const segments = url.pathname.split("/").filter(Boolean);
  const repoIdSegment = segments[2]; // index: 0=api, 1=repos, 2=:repoId, 3=files

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

  const { searchParams } = url;

  // ext can be "ts" or "ts,tsx,py"
  const extRaw = searchParams.get("ext");
  const prefix = searchParams.get("prefix") ?? undefined;
  const limitParam = searchParams.get("limit");

  const limit = (() => {
    const n = limitParam ? Number(limitParam) : 500;
    if (Number.isNaN(n)) return 500;
    return Math.min(n, 5000);
  })();

  const exts = extRaw
    ? extRaw
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
    : null;

  const files = await prisma.fileIndex.findMany({
    where: {
      repoId: repoIdNum,
      ...(exts ? { extension: { in: exts } } : {}),
      ...(prefix ? { path: { startsWith: prefix } } : {}),
    },
    orderBy: [{ dir: "asc" }, { filename: "asc" }],
    take: limit,
  });

  return NextResponse.json(
    files.map((f) => ({
      id: f.id,
      path: f.path,
      dir: f.dir,
      filename: f.filename,
      extension: f.extension,
      sizeBytes: f.sizeBytes,
      sha256: f.sha256,
      lastCommitSha: f.lastCommitSha,
    }))
  );
}
