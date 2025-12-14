import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function run(cmd: string, args: string[], cwd: string) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      env: process.env,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => resolve({ code: code ?? 0, stdout, stderr }));
    child.on("error", (err) =>
      resolve({
        code: 1,
        stdout,
        stderr: stderr + "\n" + (err?.message ?? String(err)),
      })
    );
  });
}

function countIndexedRepos(stdout: string) {
  return stdout
    .split(/\r?\n/g)
    .filter((l) => l.trim().startsWith("Indexed repo "))
    .length;
}

export async function POST() {
  const startedAt = new Date();

  // 1) Create PilotRun row first (running)
  const runRow = await prisma.pilotRun.create({
    data: {
      kind: "sync-repos",
      status: "running",
      startedAt,
    },
  });

  // 2) Create artifact dir
  const artifactDirRel = path.join("data", "runs", `pilotrun-${runRow.id}`);
  const artifactDirAbs = path.join(process.cwd(), artifactDirRel);
  await fs.mkdir(artifactDirAbs, { recursive: true });

  const stdoutPathRel = path.join(artifactDirRel, "stdout.log");
  const stderrPathRel = path.join(artifactDirRel, "stderr.log");
  const resultPathRel = path.join(artifactDirRel, "result.json");

  // 3) Execute the script (same Windows-safe approach as before)
  const isWin = process.platform === "win32";
  const cmd = isWin ? "cmd.exe" : "pnpm";
  const args = isWin
    ? ["/d", "/s", "/c", "pnpm exec tsx scripts/jai-sync-repos.ts"]
    : ["exec", "tsx", "scripts/jai-sync-repos.ts"];

  const { code, stdout, stderr } = await run(cmd, args, process.cwd());

  // 4) Write artifacts
  await fs.writeFile(path.join(process.cwd(), stdoutPathRel), stdout ?? "", "utf8");
  await fs.writeFile(path.join(process.cwd(), stderrPathRel), stderr ?? "", "utf8");
  await fs.writeFile(
    path.join(process.cwd(), resultPathRel),
    JSON.stringify(
      {
        ok: code === 0,
        code,
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        indexedRepos: countIndexedRepos(stdout ?? ""),
      },
      null,
      2
    ),
    "utf8"
  );

  // 5) Update PilotRun row (success/failed)
  const finishedAt = new Date();
  const indexedRepos = countIndexedRepos(stdout ?? "");
  const ok = code === 0;

  const summary = ok
    ? `sync-repos OK · indexedRepos=${indexedRepos}`
    : `sync-repos FAILED · exitCode=${code}`;

  await prisma.pilotRun.update({
    where: { id: runRow.id },
    data: {
      status: ok ? "success" : "failed",
      finishedAt,
      summary,
      artifactDir: artifactDirRel.replace(/\\/g, "/"),
      stdoutPath: stdoutPathRel.replace(/\\/g, "/"),
      stderrPath: stderrPathRel.replace(/\\/g, "/"),
    },
  });

  return NextResponse.json(
    {
      ok,
      runId: runRow.id,
      summary,
      artifactDir: artifactDirRel.replace(/\\/g, "/"),
    },
    { status: ok ? 200 : 500 }
  );
}
