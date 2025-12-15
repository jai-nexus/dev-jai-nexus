// portal/src/app/api/internal/sync-repos/route.ts
import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const IS_VERCEL =
  process.env.VERCEL === "1" ||
  process.env.VERCEL === "true" ||
  process.env.VERCEL === "yes";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function safeOneLine(s: string, max = 300) {
  const one = (s ?? "").replace(/\s+/g, " ").trim();
  return one.length > max ? one.slice(0, max - 1) + "…" : one;
}

function run(cmd: string, args: string[], cwd: string) {
  return new Promise<{ code: number; stdout: string; stderr: string }>(
    (resolve) => {
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
          stderr: stderr + "\n" + safeOneLine(getErrorMessage(err)),
        }),
      );
    },
  );
}

function countIndexedRepos(stdout: string) {
  return stdout
    .split(/\r?\n/g)
    .filter((l) => l.trim().startsWith("Indexed repo "))
    .length;
}

export async function POST() {
  // Vercel can’t safely spawn pnpm/tsx or write persistent artifacts under /var/task.
  // This endpoint is local/dev only. Use the GitHub Action to run the indexer.
  if (IS_VERCEL) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "sync-repos is disabled on Vercel runtime. Run the Portal · sync-repos GitHub Action (recommended) or run locally.",
      },
      { status: 501 },
    );
  }

  const startedAt = new Date();

  const runRow = await prisma.pilotRun.create({
    data: {
      kind: "sync-repos",
      status: "running",
      startedAt,
    },
  });

  let artifactDirRel: string | null = null;
  let stdoutPathRel: string | null = null;
  let stderrPathRel: string | null = null;

  try {
    artifactDirRel = path.join("data", "runs", `pilotrun-${runRow.id}`);
    const artifactDirAbs = path.join(process.cwd(), artifactDirRel);
    await fs.mkdir(artifactDirAbs, { recursive: true });

    stdoutPathRel = path.join(artifactDirRel, "stdout.log");
    stderrPathRel = path.join(artifactDirRel, "stderr.log");
    const resultPathRel = path.join(artifactDirRel, "result.json");

    const isWin = process.platform === "win32";
    const cmd = isWin ? "cmd.exe" : "pnpm";
    const args = isWin
      ? ["/d", "/s", "/c", "pnpm exec tsx scripts/jai-sync-repos.ts"]
      : ["exec", "tsx", "scripts/jai-sync-repos.ts"];

    const { code, stdout, stderr } = await run(cmd, args, process.cwd());

    const exitCode = code ?? 1;
    const indexedRepos = countIndexedRepos(stdout ?? "");
    const ok = exitCode === 0;

    await fs.writeFile(
      path.join(process.cwd(), stdoutPathRel),
      stdout ?? "",
      "utf8",
    );
    await fs.writeFile(
      path.join(process.cwd(), stderrPathRel),
      stderr ?? "",
      "utf8",
    );
    await fs.writeFile(
      path.join(process.cwd(), resultPathRel),
      JSON.stringify(
        {
          ok,
          code: exitCode,
          startedAt: startedAt.toISOString(),
          finishedAt: new Date().toISOString(),
          indexedRepos,
        },
        null,
        2,
      ),
      "utf8",
    );

    const finishedAt = new Date();
    const summary = ok
      ? `sync-repos OK · indexedRepos=${indexedRepos}`
      : `sync-repos FAILED · exitCode=${exitCode}`;

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
        indexedRepos,
        code: exitCode,
        artifactDir: artifactDirRel.replace(/\\/g, "/"),
      },
      { status: ok ? 200 : 500 },
    );
  } catch (err: unknown) {
    const finishedAt = new Date();
    const msg = safeOneLine(getErrorMessage(err));
    const summary = `sync-repos FAILED · ${msg}`;

    // best-effort DB update
    try {
      await prisma.pilotRun.update({
        where: { id: runRow.id },
        data: {
          status: "failed",
          finishedAt,
          summary,
          artifactDir: artifactDirRel ? artifactDirRel.replace(/\\/g, "/") : null,
          stdoutPath: stdoutPathRel ? stdoutPathRel.replace(/\\/g, "/") : null,
          stderrPath: stderrPathRel ? stderrPathRel.replace(/\\/g, "/") : null,
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json(
      { ok: false, runId: runRow.id, summary, error: msg },
      { status: 500 },
    );
  }
}
