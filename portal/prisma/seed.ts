// portal/prisma/seed.ts
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";
import { normalizeRepoStatus } from "../src/lib/registryEnums";

// IMPORTANT: match the SAME Prisma client output your app uses.
// Given schema.prisma output = "generated/prisma", and seed.ts is in prisma/,
// this should be "./generated/prisma".
import type { Prisma, Role } from "./generated/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type YamlRepoRow = {
  nh_id?: string;
  repo: string;
  description?: string;
  tier?: number;
  role?: string;
  status?: string;
  owner_agent_nh_id?: string;
  notes?: string;
};

function readReposYaml(): YamlRepoRow[] {
  const candidates = [
    // when running from portal/
    path.join(process.cwd(), "config", "repos.yaml"),
    // when running from repo root
    path.join(process.cwd(), "portal", "config", "repos.yaml"),
    // relative to portal/prisma
    path.join(__dirname, "..", "config", "repos.yaml"),
  ];

  const configPath = candidates.find((p) => fs.existsSync(p));
  if (!configPath) return [];

  const raw = fs.readFileSync(configPath, "utf8");
  const parsed: unknown = YAML.parse(raw);

  if (Array.isArray(parsed)) return parsed as YamlRepoRow[];

  if (parsed && typeof parsed === "object" && "repos" in parsed) {
    const maybeRepos = (parsed as { repos?: unknown }).repos;
    if (Array.isArray(maybeRepos)) return maybeRepos as YamlRepoRow[];
  }

  return [];
}

function inferDomainPod(repo: string, role?: string): string | null {
  if (role === "operator-console") return "DEV";
  if (role === "docs") return "DOCS";
  if (role === "product") return "PRODUCT";
  if (role === "core") return "CORE";
  if (role === "meta") return "META";
  if (repo.startsWith("jai-nexus/")) return "NEXUS";
  return null;
}

function inferEngineGroup(role?: string): string | null {
  return role ?? null;
}

function inferGithubUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

// Json? fields: use object OR omit (undefined). Do NOT pass null.
function notesJson(notes?: string): Prisma.InputJsonValue | undefined {
  const t = (notes ?? "").trim();
  return t ? ({ text: t } as Prisma.InputJsonValue) : undefined;
}

async function seedReposFromYaml() {
  const rows = readReposYaml();
  if (rows.length === 0) {
    console.warn("⚠️ No repos found in repos.yaml; skipping repo seed.");
    return;
  }

  for (const r of rows) {
    const createData: Prisma.RepoCreateInput = {
      name: r.repo,
      nhId: r.nh_id ?? "",
      description: r.description ?? null,
      domainPod: inferDomainPod(r.repo, r.role),
      engineGroup: inferEngineGroup(r.role),
      status: normalizeRepoStatus(r.status ?? "planned"),
      owner: r.owner_agent_nh_id ? `agent:${r.owner_agent_nh_id}` : null,
      githubUrl: inferGithubUrl(r.repo),
      defaultBranch: "main",
      notes: notesJson(r.notes),
    };

    await prisma.repo.upsert({
      where: { name: createData.name },
      update: {
        nhId: createData.nhId,
        description: createData.description,
        domainPod: createData.domainPod,
        engineGroup: createData.engineGroup,
        status: createData.status,
        owner: createData.owner,
        githubUrl: createData.githubUrl,
        defaultBranch: createData.defaultBranch,
        notes: createData.notes, // InputJsonValue | undefined
      },
      create: createData,
    });
  }

  console.log(`✅ Repo registry seeded from repos.yaml (${rows.length} repos)`);
}

async function seedUsers() {
  const adminPasswordHash = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@jai.nexus" },
    update: {
      name: "JAI Admin",
      role: "ADMIN" as Role,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@jai.nexus",
      name: "JAI Admin",
      role: "ADMIN" as Role,
      passwordHash: adminPasswordHash,
    },
  });

  const agentPasswordHash = await bcrypt.hash("agent1234", 12);
  await prisma.user.upsert({
    where: { email: "agent@jai.nexus" },
    update: {
      name: "JAI Agent",
      role: "AGENT" as Role,
      passwordHash: agentPasswordHash,
    },
    create: {
      email: "agent@jai.nexus",
      name: "JAI Agent",
      role: "AGENT" as Role,
      passwordHash: agentPasswordHash,
    },
  });

  console.log("✅ Users seeded: admin@jai.nexus, agent@jai.nexus");
}

// keep as no-op until InboxItem model is migrated + you decide the default behavior
async function seedAgentInboxItems() {
  return;
}

async function main() {
  console.log("🌱 Using DATABASE_URL:", process.env.DATABASE_URL);
  await seedReposFromYaml();
  await seedUsers();
  await seedAgentInboxItems();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
