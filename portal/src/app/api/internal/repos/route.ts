// portal/src/app/api/internal/repos/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import { RepoStatus } from "@/lib/dbEnums";

type SearchParamValue = string | string[] | undefined;

function firstParam(v: SearchParamValue): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function sanitizeQuery(input?: string): string | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  return raw.length > 120 ? raw.slice(0, 120) : raw;
}

function sanitizeRepoStatus(input?: string): RepoStatus | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;

  // Accept "ACTIVE" or "active" in query params, regardless of enum casing
  const want = raw.toUpperCase();
  const hit = (Object.values(RepoStatus) as string[]).find(
    (v) => v.toUpperCase() === want,
  );

  return hit as RepoStatus | undefined;
}

export async function GET(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = sanitizeQuery(firstParam(url.searchParams.getAll("q")));
  const status =
    sanitizeRepoStatus(firstParam(url.searchParams.getAll("status"))) ??
    RepoStatus.ACTIVE;

  const repos = await prisma.repo.findMany({
    where: {
      status,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { nhId: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { domainPod: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      nhId: true,
      name: true,
      description: true,
      domainPod: true,
      engineGroup: true,
      language: true,
      status: true,
      owner: true,
      defaultBranch: true,
      githubUrl: true,
      updatedAt: true,
    },
    take: 500,
  });

  return NextResponse.json({ ok: true, repos });
}
