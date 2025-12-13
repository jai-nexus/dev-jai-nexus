import OpenAI from "openai";
import type {
  WavePlan,
  WaveTask,
  WaveTaskKind,
  WaveTaskStatus,
  WaveTaskTarget,
} from "./types";

export type PlanWaveInput = {
  projectKey: string;
  waveLabel: string;
  title: string;
  repoName: string;
};

const MODEL = process.env.JAI_PLANNER_MODEL ?? "gpt-4.1-mini";

// Only create a client if we actually have a key
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ---- Raw model output shapes (to avoid any) -----------------------------

type RawTarget = {
  kind?: string;
  path?: string;
};

type RawTask = {
  id?: string;
  kind?: string;
  status?: string;
  title?: string;
  description?: string;
  repoName?: string;
  nhId?: string;
  target?: RawTarget | null;
};

type RawPlan = {
  summary?: string;
  notes?: string;
  tasks?: RawTask[] | null;
};

// ---- Helpers ------------------------------------------------------------

function makeTaskId(
  projectKey: string,
  waveLabel: string,
  index: number,
): string {
  // 2.1.2 + W1.0 + 1 => 2.1.2.W1.0.1
  return `${projectKey}.${waveLabel}.${index + 1}`;
}

const VALID_KINDS: WaveTaskKind[] = [
  "audit",
  "refactor",
  "feature",
  "bugfix",
  "infra",
];

const VALID_STATUS: WaveTaskStatus[] = ["pending", "in_progress", "done"];

const VALID_TARGET_KINDS: WaveTaskTarget["kind"][] = [
  "route",
  "api",
  "script",
  "db",
  "config",
];

function normalizeKind(kind: string | undefined): WaveTaskKind {
  if (kind && (VALID_KINDS as string[]).includes(kind)) {
    return kind as WaveTaskKind;
  }
  return "feature";
}

function normalizeStatus(status: string | undefined): WaveTaskStatus {
  if (status && (VALID_STATUS as string[]).includes(status)) {
    return status as WaveTaskStatus;
  }
  return "pending";
}

function normalizeTarget(raw?: RawTarget | null): WaveTaskTarget | undefined {
  if (!raw || !raw.path) return undefined;

  const kind: WaveTaskTarget["kind"] = VALID_TARGET_KINDS.includes(
    raw.kind as WaveTaskTarget["kind"],
  )
    ? (raw.kind as WaveTaskTarget["kind"])
    : "route";

  return {
    kind,
    path: String(raw.path),
  };
}

// ---- Stub plan (no OpenAI key or errors) --------------------------------

function buildStubPlan(input: PlanWaveInput): WavePlan {
  const { projectKey, waveLabel, title, repoName } = input;

  const tasks: WaveTask[] = [
    {
      id: makeTaskId(projectKey, waveLabel, 0),
      kind: "audit",
      status: "pending",
      title: "Review auth + route protection",
      description:
        "Check /login, /operator, and all app routes to ensure they are protected behind NextAuth sessions.",
      repoName,
      nhId: makeTaskId(projectKey, waveLabel, 0),
      target: {
        kind: "route",
        path: "src/app/(protected)/operator/page.tsx",
      },
    },
    {
      id: makeTaskId(projectKey, waveLabel, 1),
      kind: "infra",
      status: "pending",
      title: "Harden internal API guards",
      description:
        "Ensure all /api/internal/* routes enforce x-jai-internal-token and reject unauthenticated requests.",
      repoName,
      nhId: makeTaskId(projectKey, waveLabel, 1),
      target: {
        kind: "api",
        path: "src/app/api/internal/**/*",
      },
    },
    {
      id: makeTaskId(projectKey, waveLabel, 2),
      kind: "feature",
      status: "pending",
      title: "Expose basic wave planning in Operator UI",
      description:
        "Add an Operator view for a single wave, including plan summary and tasks.",
      repoName,
      nhId: makeTaskId(projectKey, waveLabel, 2),
      target: {
        kind: "route",
        path: "src/app/operator/waves/[sessionId]/page.tsx",
      },
    },
  ];

  return {
    projectKey,
    waveLabel,
    summary: `Plan for ${projectKey} ${waveLabel}: ${title}`,
    notes:
      "Stubbed by agentPlanner.buildStubPlan; replace with real agent output when OPENAI_API_KEY is configured.",
    tasks,
  };
}

// ---- Main entry point ---------------------------------------------------

export async function planWaveWithAgent(
  input: PlanWaveInput,
): Promise<WavePlan> {
  const { projectKey, waveLabel, title, repoName } = input;

  // No key → deterministic stub plan (what you already have today).
  if (!openai) {
    console.warn(
      "[planWaveWithAgent] OPENAI_API_KEY missing – returning stubbed plan",
    );
    return buildStubPlan(input);
  }

  const nhPrefix = `${projectKey}.${waveLabel}`;

  const systemPrompt = `
You are the JAI NEXUS wave planner.

You receive a projectKey (NH root), a waveLabel (e.g. "W1.0"),
a human-readable wave title, and a repoName.

Return a JSON object with this shape (no extra keys, no commentary):

{
  "summary": string,
  "notes": string,
  "tasks": [
    {
      "id": string,             // e.g. "${nhPrefix}.1"
      "kind": "audit" | "refactor" | "feature" | "bugfix" | "infra",
      "status": "pending",      // always "pending" initially
      "title": string,
      "description": string,
      "repoName": string,       // usually "${repoName}"
      "nhId": string,           // same as id
      "target": {
        "kind": "route" | "api" | "script" | "db" | "config",
        "path": string          // repo-relative path
      }
    }
  ]
}
`.trim();

  const userPayload = {
    projectKey,
    waveLabel,
    title,
    repoName,
  };

  // Catch ANY OpenAI issues and fall back to stub
  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Plan a small, focused wave for this input:\n${JSON.stringify(
            userPayload,
          )}`,
        },
      ],
    });
  } catch (err) {
    console.error(
      "[planWaveWithAgent] OpenAI call failed, returning stubbed plan.",
      err,
    );
    return buildStubPlan(input);
  }

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    console.error("[planWaveWithAgent] Empty model response, using stub.");
    return buildStubPlan(input);
  }

  let raw: RawPlan;
  try {
    raw = JSON.parse(content) as RawPlan;
  } catch (err) {
    console.error(
      "[planWaveWithAgent] Failed to parse JSON from model, using stub.",
      err,
    );
    return buildStubPlan(input);
  }

  const tasksRaw: RawTask[] = Array.isArray(raw.tasks) ? raw.tasks : [];

  const tasks: WaveTask[] = tasksRaw.map((t, index) => {
    const id = t.id || makeTaskId(projectKey, waveLabel, index);
    const kind = normalizeKind(t.kind);
    const status = normalizeStatus(t.status);
    const target = normalizeTarget(t.target ?? undefined);

    return {
      id,
      kind,
      status,
      title: t.title || `Task ${index + 1}`,
      description: t.description || "",
      repoName: t.repoName || repoName,
      nhId: t.nhId || id,
      target,
    };
  });

  const plan: WavePlan = {
    projectKey,
    waveLabel,
    summary: raw.summary || `Plan for ${projectKey} ${waveLabel}: ${title}`,
    notes:
      raw.notes ||
      "Generated by planWaveWithAgent using OpenAI; tasks normalized server-side.",
    tasks,
  };

  return plan;
}
