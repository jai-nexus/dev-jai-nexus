import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

export async function GET(req: NextRequest) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  const repos = await prisma.repo.findMany({
    orderBy: [
      { engineGroup: "asc" },
      { domainPod: "asc" },
      { nhId: "asc" },
    ],
  });

  return NextResponse.json({
    ok: true,
    count: repos.length,
    repos: repos.map((r) => ({
      nhId: r.nhId,
      repo: r.name,            // <-- alias DB `name` as API `repo`
      description: r.description,
      domainPod: r.domainPod,
      engineGroup: r.engineGroup,
      language: r.language,
      status: r.status,
      owner: r.owner,
      notes: r.notes,
    })),
  });
}
