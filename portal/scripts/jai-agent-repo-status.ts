// portal/scripts/jai-agent-repo-status.ts
import "dotenv/config";
import fetch from "node-fetch";

type RepoRecord = {
  nhId: string;
  repo: string | null;
  description: string | null;
  domainPod: string | null;
  engineGroup: string | null;
  language: string | null;
  status: string;
  owner: string | null;
  notes: unknown;
};

type ListReposResponse = {
  ok: boolean;
  count: number;
  repos: RepoRecord[];
};

type StatusResponse = {
  ok: boolean;
  repo: {
    nhId: string;
    name: string | null;
    status: string;
    notes: unknown;
  };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name} in env`);
    process.exit(1);
  }
  return value;
}

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN = requireEnv("JAI_INTERNAL_API_TOKEN");

async function listRepos() {
  const res = await fetch(`${BASE}/api/internal/repos`, {
    headers: {
      "x-jai-internal-token": TOKEN,
    },
  });

  if (!res.ok) {
    console.error("Failed to list repos:", res.status, await res.text());
    process.exit(1);
  }

  const data = (await res.json()) as ListReposResponse;

  console.log(`Found ${data.count} repos:`);
  for (const r of data.repos) {
    const name = r.repo ?? "(no-name)";
    console.log(
      `- ${r.nhId} :: ${name} [${r.domainPod}/${r.engineGroup}] :: ${r.status}`,
    );
  }
}

async function setStatus(nhId: string, status: string, notes?: string) {
  const res = await fetch(
    `${BASE}/api/internal/repos/${encodeURIComponent(nhId)}/status`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-jai-internal-token": TOKEN,
      },
      body: JSON.stringify({
        nhId,          // also send in body for extra safety
        status,
        notes: notes ?? null,
      }),
    },
  );

  if (!res.ok) {
    console.error(
      `Failed to update status for ${nhId}:`,
      res.status,
      await res.text(),
    );
    process.exit(1);
  }

  const data = (await res.json()) as StatusResponse;

  console.log(
    `Updated repo ${data.repo.nhId} :: ${data.repo.name ?? "(no-name)"} -> ${
      data.repo.status
    }${data.repo.notes ? ` (${JSON.stringify(data.repo.notes)})` : ""}`,
  );
}

// Handle tsx on Windows where argv[0] may be the script path
function getArgs(): string[] {
  const argv = process.argv.slice(2);
  if (
    argv[0]?.endsWith(".ts") ||
    argv[0]?.includes("/") ||
    argv[0]?.includes("\\")
  ) {
    return argv.slice(1);
  }
  return argv;
}

async function main() {
  const [cmd, nhId, status, ...noteParts] = getArgs();

  if (!cmd || cmd === "list") {
    await listRepos();
    return;
  }

  if (cmd === "set") {
    if (!nhId || !status) {
      console.error(
        "Usage: npm run jai:agent:repos -- set <nhId> <status> [notes...]",
      );
      process.exit(1);
    }
    const notes = noteParts.length ? noteParts.join(" ") : undefined;
    await setStatus(nhId, status, notes);
    return;
  }

  console.error(
    `Unknown command: ${cmd}\n\nUsage:\n  npm run jai:agent:repos\n  npm run jai:agent:repos -- set <nhId> <status> [notes...]`,
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
