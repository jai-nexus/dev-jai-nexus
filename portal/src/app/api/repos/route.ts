// portal/src/app/api/repos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const repos = await prisma.repo.findMany({
    orderBy: [{ nhId: "asc" }, { id: "asc" }],
  });

  return NextResponse.json(
    repos.map((r) => ({
      id: r.id,
      nhId: r.nhId,
      name: r.name,
      domainPod: r.domainPod,
      engineGroup: r.engineGroup,
      status: r.status,
      githubUrl: r.githubUrl,
      defaultBranch: r.defaultBranch,
    }))
  );
}
