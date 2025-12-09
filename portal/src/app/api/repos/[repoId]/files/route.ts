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

  if (Number.isNaN(repoIdNum)) {
    return NextResponse.json(
      { error: "Invalid repoId" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const ext = searchParams.get("ext");
  const prefix = searchParams.get("prefix");
  const limit = Number(searchParams.get("limit") ?? "500");

  const files = await prisma.fileIndex.findMany({
    where: {
      repoId: repoIdNum,
      ...(ext ? { extension: ext } : {}),
      ...(prefix ? { path: { startsWith: prefix } } : {}),
    },
    orderBy: [{ dir: "asc" }, { filename: "asc" }],
    take: Number.isNaN(limit) ? 500 : Math.min(limit, 5000),
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
