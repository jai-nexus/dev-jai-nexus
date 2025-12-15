// src/app/api/internal/sync-repos/route.ts
import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const IS_VERCEL = Boolean(process.env.VERCEL);

/**
 * On Vercel you can only write to /tmp (ephemeral).
 * Locally, we keep artifacts under ./data/runs.
 *
 * You can override with PILOTRUN_RUNS_DIR:
 * - absolute: /some/dir
 * - relative: data/runs (resolved against process.cwd())
 */
const RUNS_BASE_DIR_ABS = (() => {
  const custom = process.env.PILOTRUN_RUNS_DIR?.trim();
  if (custom) {
    return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  }
  return IS_VERCEL
    ? path.join(os.tmpdir(), "jai-nexus", "portal", "runs")
    : path.join(process.cwd(), "data", "runs");
})();

function toPosix(p: string) {
  return p.replace(/\\/g, "/");
}

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
      }),
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

  // 2) Artifact paths (ABS for writing, REL/logical for storing/returning)
  const artifactDirName = `pilotrun-${runRow.id}`;
  const artifactDirAbs = path.join(RUNS_BASE_DIR_ABS, artifactDirName);

  // store a logical path (don’t leak /tmp or /var/task absolute paths)
  const artifactDirRel = IS_VERCEL
    ? path.posix.join("tmp", "jai-nexus", "portal", "runs", artifactDirName)
    : path.posix.join("data", "runs", artifactDirName);

  const stdoutPathRel = path.posix.join(artifactDirRel, "stdout.log");
  const stderrPathRel = path.posix.join(artifactDirRel, "stderr.log");
  const resultPathRel = path.posix.join(artifactDirRel, "result.json");

  const stdoutPathAbs = path.join(artifactDirAbs, "stdout.log");
  const stderrPathAbs = path.join(artifactDirAbs, "stderr.log");
  const resultPathAbs = path.join(artifactDirAbs, "result.json");

  // If anything blows up, we still want to mark the run as failed + return JSON.
  let finishedAt = new Date();
  let ok = false;
  let code = 1;
  let indexedRepos = 0;
  let stdout = "";
  let stderr = "";

  try {
    // 3) Create artifact dir (Vercel => /tmp, local => ./data/runs)
    await fs.mkdir(artifactDirAbs, { recursive: true });

    // 4) Execute the script (Windows-safe for local; Linux for CI/Vercel)
    const isWin = process.platform === "win32";
    const cmd = isWin ? "cmd.exe" : "pnpm";
    const args = isWin
      ? ["/d", "/s", "/c", "pnpm exec tsx scripts/jai-sync-repos.ts"]
      : ["exec", "tsx", "scripts/jai-sync-repos.ts"];

    const r = await run(cmd, args, process.cwd());

    code = r.code ?? 1;
    stdout = r.stdout ?? "";
    stderr = r.stderr ?? "";

    finishedAt = new Date();
    indexedRepos = countIndexedRepos(stdout);
    ok = code === 0;

    // 5) Write artifacts (to ABS paths)
    await fs.writeFile(stdoutPathAbs, stdout, "utf8").catch(() => {});
    await fs.writeFile(stderrPathAbs, stderr, "utf8").catch(() => {});
    await fs
      .writeFile(
        resultPathAbs,
        JSON.stringify(
          {
            ok,
            code,
            startedAt: startedAt.toISOString(),
            finishedAt: finishedAt.toISOString(),
            indexedRepos,
            artifactDir: artifactDirRel,
            stdoutPath: stdoutPathRel,
            stderrPath: stderrPathRel,
          },
          null,
          2,
        ),
        "utf8",
      )
      .catch(() => {});
  } catch (err) {
    finishedAt = new Date();
    ok = false;
    code = 1;
    stderr =
      (stderr ? stderr + "\n" : "") +
      (err instanceof Error ? err.stack ?? err.message : String(err));

    // best-effort write error artifact (only if dir exists / can be created)
    try {
      await fs.mkdir(artifactDirAbs, { recursive: true });
      await fs.writeFile(stderrPathAbs, stderr, "utf8");
      await fs.writeFile(
        resultPathAbs,
        JSON.stringify(
          {
            ok: false,
            code: 1,
            startedAt: startedAt.toISOString(),
            finishedAt: finishedAt.toISOString(),
            indexedRepos: 0,
            error: err instanceof Error ? err.message : String(err),
            artifactDir: artifactDirRel,
          },
          null,
          2,
        ),
        "utf8",
      );
    } catch {
      // ignore
    }
  }

  const summary = ok
    ? `sync-repos OK · indexedRepos=${indexedRepos}`
    : `sync-repos FAILED · exitCode=${code}`;

  // 6) Update PilotRun row (success/failed) — best-effort
  try {
    await prisma.pilotRun.update({
      where: { id: runRow.id },
      data: {
        status: ok ? "success" : "failed",
        finishedAt,
        summary,
        artifactDir: toPosix(artifactDirRel),
        stdoutPath: toPosix(stdoutPathRel),
        stderrPath: toPosix(stderrPathRel),
      },
    });
  } catch {
    // ignore DB update failure here; still return response
  }

  return NextResponse.json(
    {
      ok,
      runId: runRow.id,
      summary,
      indexedRepos,
      code,
      artifactDir: toPosix(artifactDirRel),
      stdoutPath: toPosix(stdoutPathRel),
      stderrPath: toPosix(stderrPathRel),
      resultPath: toPosix(resultPathRel),
      // include a little stderr so Actions has *something* without downloading artifacts
      error: ok ? null : (stderr || "").slice(0, 4000),
    },
    { status: ok ? 200 : 500 },
  );
}
