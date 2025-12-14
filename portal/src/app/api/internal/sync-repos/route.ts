import { NextResponse } from "next/server";
import { spawn } from "node:child_process";

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
      resolve({ code: 1, stdout, stderr: stderr + "\n" + (err?.message ?? String(err)) })
    );
  });
}

export async function POST() {
  const cwd = process.cwd();

  const isWin = process.platform === "win32";

  // IMPORTANT: On Windows, run pnpm via cmd.exe so .cmd resolution works.
  const cmd = isWin ? "cmd.exe" : "pnpm";
  const args = isWin
    ? ["/d", "/s", "/c", "pnpm exec tsx scripts/jai-sync-repos.ts"]
    : ["exec", "tsx", "scripts/jai-sync-repos.ts"];

  const { code, stdout, stderr } = await run(cmd, args, cwd);

  const payload = { ok: code === 0, code, stdout, stderr };

  return NextResponse.json(payload, { status: code === 0 ? 200 : 500 });
}
