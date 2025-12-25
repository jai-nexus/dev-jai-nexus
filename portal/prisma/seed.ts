// portal/prisma/seed.ts
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";
import { normalizeRepoStatus } from "../src/lib/registryEnums";

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

function notesJson(notes?: string) {
  const t = (notes ?? "").trim();
  // IMPORTANT: return undefined (omit) instead of null
  return t ? ({ text: t } as const) : undefined;
}

async function seedReposFromYaml() {
  const rows = readReposYaml();
  if (rows.length === 0) {
    console.warn("⚠️ No repos found in repos.yaml; skipping repo seed.");
    return;
  }

  for (const r of rows) {
    const data = {
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
      where: { name: data.name },
      update: {
        nhId: data.nhId,
        description: data.description,
        domainPod: data.domainPod,
        engineGroup: data.engineGroup,
        status: data.status,
        owner: data.owner,
        githubUrl: data.githubUrl,
        defaultBranch: data.defaultBranch,
        // JSON field: must be InputJsonValue | undefined (NOT null)
        notes: data.notes,
      },
      create: data,
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
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@jai.nexus",
      name: "JAI Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  const agentPasswordHash = await bcrypt.hash("agent1234", 12);
  await prisma.user.upsert({
    where: { email: "agent@jai.nexus" },
    update: {
      name: "JAI Agent",
      role: "AGENT",
      passwordHash: agentPasswordHash,
    },
    create: {
      email: "agent@jai.nexus",
      name: "JAI Agent",
      role: "AGENT",
      passwordHash: agentPasswordHash,
    },
  });

  console.log("✅ Users seeded: admin@jai.nexus, agent@jai.nexus");
}

/**
 * Seed backlog inbox items:
 * - Schema guarantees 1 inbox item per WorkPacket via `workPacketId @unique`.
 * - So we can create for every WorkPacket and skip duplicates safely.
 * - This avoids N+1 queries and is race-safe.
 */
async function seedAgentInboxItems() {
  const packets = await prisma.workPacket.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  if (packets.length === 0) {
    console.log("ℹ️ No WorkPackets found; skipping AgentInboxItem seed.");
    return;
  }

  const res = await prisma.agentInboxItem.createMany({
    data: packets.map((wp) => ({
      workPacketId: wp.id,
      status: "QUEUED",
      priority: 50,
      tags: [],
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Agent inbox seeded (${res.count} created)`);
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
