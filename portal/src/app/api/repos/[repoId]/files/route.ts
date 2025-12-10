import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  repoId: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { repoId } = await context.params;
  const repoIdNum = Number(repoId);

  if (!repoId || Number.isNaN(repoIdNum)) {
    return NextResponse.json(
      { error: `Invalid repoId: ${repoId}` },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(req.url);

  const extParam = searchParams.get("ext");
  const prefix = searchParams.get("prefix") ?? undefined;
  const limitParam = searchParams.get("limit");

  // support ext=ts or ext=ts,tsx
  const exts =
    extParam
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const limit = (() => {
    const n = limitParam ? Number(limitParam) : 500;
    if (Number.isNaN(n)) return 500;
    return Math.min(n, 5000);
  })();

  const files = await prisma.fileIndex.findMany({
    where: {
      repoId: repoIdNum,
      ...(exts.length === 1
        ? { extension: exts[0] }
        : exts.length > 1
        ? { extension: { in: exts } }
        : {}),
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
    })),
  );
}
