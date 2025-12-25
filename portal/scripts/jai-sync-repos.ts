#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// portal/scripts -> portal -> repo root -> workspace
const WORKSPACE_ROOT = path.resolve(__dirname, "..", "..", "workspace");

const ACTIVE_REPO_STATUS = "active" as const;

async function main() {
  fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });

  // ✅ enum-safe (RepoStatus is a union of string literals; "active" is valid)
  const repos = await prisma.repo.findMany({
    where: { status: ACTIVE_REPO_STATUS },
  });

  for (const repo of repos) {
    if (!repo.githubUrl) {
      console.warn(`Skipping repo ${repo.name}: no githubUrl`);
      continue;
    }

    const { owner, name } = parseGithubUrl(repo.githubUrl);
    const cloneDir = path.join(WORKSPACE_ROOT, owner, name);

    const branch = repo.defaultBranch || "main";

    gitSync(repo.githubUrl, cloneDir, branch);

    const syncRun = await prisma.syncRun.create({
      data: {
        type: "file-index",
        status: "running",
        trigger: "manual",
        startedAt: new Date(),
        finishedAt: new Date(), // updated after indexing
        repo: { connect: { id: repo.id } },
      },
    });

    await rebuildFileIndexForRepo(repo.id, cloneDir, syncRun.id);

    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        summary: "FileIndex rebuilt",
      },
    });

    console.log(`Indexed repo ${repo.name}`);
  }
}

function parseGithubUrl(url: string): { owner: string; name: string } {
  const cleaned = url.trim().replace(/\.git$/, "");

  // git@github.com:owner/name
  if (cleaned.startsWith("git@github.com:")) {
    const rest = cleaned.slice("git@github.com:".length);
    const [owner, name] = rest.split("/");
    if (!owner || !name) throw new Error(`Bad githubUrl: ${url}`);
    return { owner, name };
  }

  // https://github.com/owner/name
  const parts = cleaned.split("/");
  const name = parts.pop();
  const owner = parts.pop();
  if (!owner || !name) throw new Error(`Bad githubUrl: ${url}`);
  return { owner, name };
}

function git(cmd: string) {
  execSync(cmd, {
    stdio: "inherit",
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
    },
  });
}

function gitSync(remote: string, dir: string, branch: string) {
  const hasGit = fs.existsSync(path.join(dir, ".git"));

  if (!hasGit) {
    fs.mkdirSync(dir, { recursive: true });
    git(`git clone --depth 1 --branch ${branch} ${remote} "${dir}"`);
    return;
  }

  git(`git -C "${dir}" remote set-url origin ${remote}`);
  git(`git -C "${dir}" fetch origin ${branch} --depth 1`);
  git(
    `git -C "${dir}" checkout ${branch} || git -C "${dir}" checkout -b ${branch}`
  );
  git(`git -C "${dir}" reset --hard origin/${branch}`);
}

async function rebuildFileIndexForRepo(
  repoId: number,
  root: string,
  syncRunId: number
) {
  await prisma.fileIndex.deleteMany({ where: { repoId } });

  const files: {
    repoId: number;
    syncRunId: number;
    path: string;
    dir: string;
    filename: string;
    extension: string;
    sizeBytes: number;
    sha256: string;
    indexedAt: Date;
  }[] = [];

  const walk = (dirPath: string) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dirPath, entry.name);
      const rel = path.relative(root, full).replace(/\\/g, "/");

      if (
        entry.name === ".git" ||
        entry.name === ".next" ||
        entry.name === "node_modules" ||
        rel.includes("/node_modules/")
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const stat = fs.statSync(full);
        const content = fs.readFileSync(full);
        const sha256 = crypto.createHash("sha256").update(content).digest("hex");
        const ext = path.extname(entry.name).replace(".", "");
        const dirRel = path.dirname(rel);

        files.push({
          repoId,
          syncRunId,
          path: rel,
          dir: dirRel === "." ? "" : dirRel,
          filename: entry.name,
          extension: ext,
          sizeBytes: stat.size,
          sha256,
          indexedAt: new Date(),
        });
      }
    }
  };

  walk(root);

  const chunkSize = 500;
  for (let i = 0; i < files.length; i += chunkSize) {
    await prisma.fileIndex.createMany({
      data: files.slice(i, i + chunkSize),
      skipDuplicates: true,
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
