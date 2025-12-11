#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const WORKSPACE_ROOT = path.resolve(__dirname, "..", "..", "workspace");

async function main() {
  const repos = await prisma.repo.findMany({
    where: { status: "ACTIVE" }, // or loosen this at first
  });

  for (const repo of repos) {
    if (!repo.githubUrl) {
      console.warn(`Skipping repo ${repo.name}: no githubUrl`);
      continue;
    }

    const { owner, name } = parseGithubUrl(repo.githubUrl);
    const cloneDir = path.join(WORKSPACE_ROOT, owner, name);
    fs.mkdirSync(cloneDir, { recursive: true });

    gitSync(repo.githubUrl, cloneDir, repo.defaultBranch || "main");

    const syncRun = await prisma.syncRun.create({
      data: {
        type: "file-index",
        status: "running",
        trigger: "manual",
        startedAt: new Date(),
        finishedAt: new Date(), // will be updated after indexing
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
  // naive v0: https://github.com/owner/name(.git)
  const parts = url.replace(/\.git$/, "").split("/");
  const name = parts.pop()!;
  const owner = parts.pop()!;
  return { owner, name };
}

function gitSync(remote: string, dir: string, branch: string) {
  if (!fs.existsSync(path.join(dir, ".git"))) {
    execSync(`git clone ${remote} "${dir}"`, { stdio: "inherit" });
  }
  execSync(`git -C "${dir}" fetch origin`, { stdio: "inherit" });
  execSync(`git -C "${dir}" checkout ${branch}`, { stdio: "inherit" });
  execSync(`git -C "${dir}" pull origin ${branch}`, { stdio: "inherit" });
}

async function rebuildFileIndexForRepo(
  repoId: number,
  root: string,
  syncRunId: number
) {
  // wipe existing rows for repo
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

      // Skip VCS + build dirs, but allow .github, .gitignore, etc.
      if (
        entry.name === ".git" ||
        entry.name === ".next" ||
        rel.includes("node_modules")
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const stat = fs.statSync(full);
        const content = fs.readFileSync(full);
        const sha256 = crypto
          .createHash("sha256")
          .update(content)
          .digest("hex");
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
