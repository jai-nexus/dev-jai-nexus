// portal/scripts/jai-sync-repos.ts
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { prisma } from "../src/lib/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// portal/scripts -> portal -> repo root -> workspace
const WORKSPACE_ROOT =
  process.env.JAI_WORKSPACE_ROOT ??
  path.resolve(__dirname, "..", "..", "workspace");

function safeBranch(branch: string): string {
  const b = (branch || "main").trim();
  if (!/^[A-Za-z0-9._/-]+$/.test(b)) {
    throw new Error(`Unsafe branch name: ${JSON.stringify(branch)}`);
  }
  return b;
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

function gitOut(cmd: string): string {
  return execSync(cmd, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
    },
  }).trim();
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

function ensureEmptyDirIfNoGit(dir: string) {
  if (!fs.existsSync(dir)) return;

  const gitDir = path.join(dir, ".git");
  if (fs.existsSync(gitDir)) return;

  // dir exists but is not a git repo. For a mirror workspace, wipe it.
  const entries = fs.readdirSync(dir);
  if (entries.length > 0) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
  }
}

function gitSync(remote: string, dir: string, branchRaw: string) {
  const branch = safeBranch(branchRaw);
  const hasGit = fs.existsSync(path.join(dir, ".git"));

  if (!hasGit) {
    fs.mkdirSync(dir, { recursive: true });
    ensureEmptyDirIfNoGit(dir);
    git(`git clone --depth 1 --branch ${branch} ${remote} "${dir}"`);
    return;
  }

  // deterministic update
  git(`git -C "${dir}" remote set-url origin ${remote}`);
  git(`git -C "${dir}" fetch origin ${branch} --depth 1`);
  git(
    `git -C "${dir}" checkout ${branch} || git -C "${dir}" checkout -b ${branch}`,
  );
  git(`git -C "${dir}" reset --hard origin/${branch}`);
}

function serializeError(err: unknown) {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return { message: String(err) };
}

/**
 * Resolve the *actual* DB enum label for RepoStatus "active".
 * This avoids drift between Prisma enum names (e.g. ACTIVE) and Postgres enum labels (e.g. active).
 */
async function resolveActiveRepoStatusDbLabel(): Promise<string> {
  const enumTypeName = "RepoStatus";

  const rows = await prisma.$queryRaw<{ enumlabel: string }[]>`
    SELECT e.enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = ${enumTypeName}
    ORDER BY e.enumsortorder
  `;

  const labels = rows.map((r) => r.enumlabel);

  const hit =
    labels.find((l) => l.toLowerCase() === "active") ??
    labels.find((l) => l.toUpperCase() === "ACTIVE");

  if (!hit) {
    throw new Error(
      `Could not resolve RepoStatus label for active. DB has: ${JSON.stringify(labels)}`,
    );
  }

  return hit;
}

type ActiveRepoRow = {
  id: number;
  name: string;
  githubUrl: string | null;
  defaultBranch: string | null;
};

async function fetchActiveRepos(activeDbLabel: string): Promise<ActiveRepoRow[]> {
  // NOTE: `"Repo"` is Prisma’s default table name for model Repo (quoted, case-sensitive).
  // If your schema uses @@map / different casing, adjust the table/column names here.
  return prisma.$queryRaw<ActiveRepoRow[]>`
    SELECT
      id,
      name,
      "githubUrl",
      "defaultBranch"
    FROM "Repo"
    WHERE status = ${activeDbLabel}::"RepoStatus"
    ORDER BY name ASC
  `;
}

async function rebuildFileIndexForRepo(
  repoId: number,
  root: string,
  syncRunId: number,
  lastCommitSha: string | null,
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
    lastCommitSha: string | null;
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
          lastCommitSha,
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
    });
  }

  return { fileCount: files.length };
}

async function main() {
  fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });

  const activeDbLabel = await resolveActiveRepoStatusDbLabel();
  console.log(
    `[sync:repos] RepoStatus active DB label = ${JSON.stringify(activeDbLabel)}`,
  );

  const repos = await fetchActiveRepos(activeDbLabel);

  for (const repo of repos) {
    if (!repo.githubUrl) {
      console.warn(`Skipping repo ${repo.name}: no githubUrl`);
      continue;
    }

    const syncRun = await prisma.syncRun.create({
      data: {
        type: "file-index",
        status: "running",
        trigger: "manual",
        startedAt: new Date(),
        finishedAt: new Date(), // required by schema; updated at end
        repo: { connect: { id: repo.id } },
      },
    });

    try {
      const { owner, name } = parseGithubUrl(repo.githubUrl);
      const cloneDir = path.join(WORKSPACE_ROOT, owner, name);
      const branch = repo.defaultBranch || "main";

      gitSync(repo.githubUrl, cloneDir, branch);

      const headSha = gitOut(`git -C "${cloneDir}" rev-parse HEAD`) || null;

      const { fileCount } = await rebuildFileIndexForRepo(
        repo.id,
        cloneDir,
        syncRun.id,
        headSha,
      );

      await prisma.syncRun.update({
        where: { id: syncRun.id },
        data: {
          status: "success",
          finishedAt: new Date(),
          summary: `FileIndex rebuilt (${fileCount} files)`,
          payload: {
            repoName: repo.name,
            githubUrl: repo.githubUrl,
            branch,
            headSha,
            fileCount,
          },
        },
      });

      console.log(`Indexed repo ${repo.name}`);
    } catch (err) {
      await prisma.syncRun.update({
        where: { id: syncRun.id },
        data: {
          status: "failed",
          finishedAt: new Date(),
          summary: "Sync failed (see payload.error)",
          payload: {
            repoName: repo.name,
            githubUrl: repo.githubUrl,
            error: serializeError(err),
          },
        },
      });

      console.error(`❌ Failed repo ${repo.name} — continuing`);
      console.error(err);
    }
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
