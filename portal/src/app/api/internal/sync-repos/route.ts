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
  !!process.env.VERCEL_ENV ||
  process.env.NEXT_RUNTIME === "edge";

type RunResult = { code: number; stdout: string; stderr: string };

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function safeOneLine(s: string, max = 300) {
  const one = (s ?? "").replace(/\s+/g, " ").trim();
  return one.length > max ? one.slice(0, max - 1) + "…" : one;
}

function countIndexedRepos(stdout: string) {
  return stdout
    .split(/\r?\n/g)
    .filter((l) => l.trim().startsWith("Indexed repo "))
    .length;
}

function run(cmd: string, args: string[], cwd: string): Promise<RunResult> {
  return new Promise<RunResult>((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      // prevent any git prompts from hanging the process
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("close", (code) => resolve({ code: code ?? 0, stdout, stderr }));

    child.on("error", (err: unknown) =>
      resolve({
        code: 1,
        stdout,
        stderr: `${stderr}\n${getErrorMessage(err)}`,
      }),
    );
  });
}

export async function POST() {
  // Vercel/serverless: do NOT attempt spawn + filesystem artifacts here.
  // Run the indexer from GitHub Actions instead.
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
    data: { kind: "sync-repos", status: "running", startedAt },
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

    return NextResponse.json(
      { ok: false, runId: runRow.id, summary, error: msg },
      { status: 500 },
    );
  }
}
