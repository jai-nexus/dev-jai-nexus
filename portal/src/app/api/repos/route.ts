// portal/src/app/api/repos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { RepoSummary } from "@/lib/types/context-api";
import { requireContextApiAuth } from "@/lib/contextApiAuth";
import { RepoStatus } from "@/lib/dbEnums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Enforce Context API key
  const auth = requireContextApiAuth(req);
  if (!auth.ok) return auth.errorResponse!;

  try {
    const repos = await prisma.repo.findMany({
      // ✅ enum-backed (matches schema.prisma)
      where: { status: RepoStatus.active },
      select: {
        id: true,
        nhId: true,
        name: true,
        domainPod: true,
        engineGroup: true,
        status: true,
        githubUrl: true,
        defaultBranch: true,
      },
      orderBy: [{ nhId: "asc" }, { id: "asc" }],
    });

    const payload: RepoSummary[] = repos.map((r) => ({
      id: r.id,
      nhId: r.nhId,
      name: r.name,
      domainPod: r.domainPod,
      engineGroup: r.engineGroup,
      status: r.status,
      githubUrl: r.githubUrl,
      defaultBranch: r.defaultBranch,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("[GET /api/repos] Failed to load repos", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
