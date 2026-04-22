import { readFileSync } from "node:fs";
import path from "node:path";

import {
  resolveTaskContract,
  type ResolvedTaskContract,
  type TaskContract,
} from "./taskContract.ts";

const SLOT_CONFIG_PATH = path.join(process.cwd(), ".nexus", "model-slots.yaml");
const OPENAI_ENV_VAR_NAME = "OPENAI_API_KEY";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

type ParsedSlotConfig = {
  provider?: string;
  model?: string;
  notes?: string;
};

type InputRefSectionResult =
  | {
      ok: true;
      section: string | null;
    }
  | {
      ok: false;
      failure_note: string;
    };

export type SlotConfig = {
  slot: string;
  provider: string;
  model: string;
  notes?: string;
};

export type SlotResolution =
  | {
      ok: true;
      slot: SlotConfig;
    }
  | {
      ok: false;
      failure_note: string;
    };

export type DispatchResult =
  | {
      ok: true;
      output: string;
    }
  | {
      ok: false;
      failure_note: string;
    };

export function resolveSlotConfig(slotName: string): SlotResolution {
  if (slotName.endsWith("_SELECTOR")) {
    return {
      ok: false,
      failure_note: "selector slots excluded from dispatch",
    };
  }

  let source: string;
  try {
    source = readFileSync(SLOT_CONFIG_PATH, "utf8");
  } catch (error) {
    return {
      ok: false,
      failure_note: `slot config read failed: ${getErrorMessage(error)}`,
    };
  }

  const parsedSlots = parseModelSlots(source);
  const parsedSlot = parsedSlots[slotName];

  if (!parsedSlot) {
    return {
      ok: false,
      failure_note: `slot not found: ${slotName}`,
    };
  }

  if (!parsedSlot.provider || !parsedSlot.model) {
    return {
      ok: false,
      failure_note: `slot config incomplete: ${slotName}`,
    };
  }

  return {
    ok: true,
    slot: {
      slot: slotName,
      provider: parsedSlot.provider,
      model: parsedSlot.model,
      notes: parsedSlot.notes,
    },
  };
}

export async function dispatchSlot(
  taskContract: TaskContract,
): Promise<DispatchResult> {
  const resolvedTaskContract = resolveTaskContract(taskContract);

  if (resolvedTaskContract.slot.endsWith("_SELECTOR")) {
    return {
      ok: false,
      failure_note: "selector slots excluded from dispatch",
    };
  }

  if (resolvedTaskContract.provider !== "openai") {
    return {
      ok: false,
      failure_note: `unsupported provider: ${resolvedTaskContract.provider}`,
    };
  }

  return dispatchOpenAI(resolvedTaskContract);
}

function parseModelSlots(source: string): Record<string, ParsedSlotConfig> {
  const slots: Record<string, ParsedSlotConfig> = {};
  let insideSlotsBlock = false;
  let currentSlotName: string | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, "  ");

    if (/^\s*slots:\s*$/.test(line)) {
      insideSlotsBlock = true;
      currentSlotName = null;
      continue;
    }

    if (!insideSlotsBlock || /^\s*(#.*)?$/.test(line)) {
      continue;
    }

    const slotMatch = line.match(/^  ([A-Z0-9_]+):\s*$/);
    if (slotMatch) {
      currentSlotName = slotMatch[1];
      slots[currentSlotName] = {};
      continue;
    }

    if (!currentSlotName) {
      continue;
    }

    const fieldMatch = line.match(/^    ([a-z_]+):\s*(.+?)\s*$/);
    if (!fieldMatch) {
      continue;
    }

    const [, fieldName, rawValue] = fieldMatch;
    if (
      fieldName !== "provider" &&
      fieldName !== "model" &&
      fieldName !== "notes"
    ) {
      continue;
    }

    slots[currentSlotName][fieldName] = parseYamlScalar(rawValue);
  }

  return slots;
}

function parseYamlScalar(rawValue: string): string {
  const trimmed = rawValue.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed.replace(/\s+#.*$/, "");
}

async function dispatchOpenAI(
  taskContract: ResolvedTaskContract,
): Promise<DispatchResult> {
  const apiKey = process.env[OPENAI_ENV_VAR_NAME];
  if (!apiKey) {
    return {
      ok: false,
      failure_note: `provider credentials not set: ${OPENAI_ENV_VAR_NAME}`,
    };
  }

  const inputRefSection = loadInputRefSection(taskContract);
  if (!inputRefSection.ok) {
    return {
      ok: false,
      failure_note: inputRefSection.failure_note,
    };
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: taskContract.model,
        input: buildDispatchInput(taskContract, inputRefSection.section),
      }),
      signal: AbortSignal.timeout(60_000),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const failureMessage = extractOpenAIErrorMessage(payload);
      if (
        isModelNotFoundFailure(
          response.status,
          failureMessage,
          taskContract.model,
        )
      ) {
        return {
          ok: false,
          failure_note: `model not found: ${taskContract.model}`,
        };
      }

      return {
        ok: false,
        failure_note: `openai dispatch failed (${response.status}): ${failureMessage}`,
      };
    }

    const output = extractOutputText(payload);
    if (!output) {
      return {
        ok: false,
        failure_note: "openai dispatch returned no output_text",
      };
    }

    return {
      ok: true,
      output,
    };
  } catch (error) {
    return {
      ok: false,
      failure_note: `openai dispatch failed: ${getErrorMessage(error)}`,
    };
  }
}

function loadInputRefSection(
  taskContract: ResolvedTaskContract,
): InputRefSectionResult {
  if (taskContract.input_ref === null) {
    return {
      ok: true,
      section: null,
    };
  }

  const repoRoot = path.resolve(process.cwd());
  const absolutePath = path.resolve(repoRoot, taskContract.input_ref);
  const normalizedRepoRoot = `${repoRoot}${path.sep}`;

  if (
    absolutePath !== repoRoot &&
    !absolutePath.startsWith(normalizedRepoRoot)
  ) {
    return {
      ok: false,
      failure_note: `input_ref not readable: ${taskContract.input_ref}`,
    };
  }

  try {
    const content = readFileSync(absolutePath, "utf8");
    const repoRelativePath = normalizePathForDisplay(
      path.relative(repoRoot, absolutePath),
    );

    return {
      ok: true,
      section: [
        "Embedded operator-supplied input_ref file:",
        `Path: ${repoRelativePath}`,
        "--- BEGIN input_ref content ---",
        content,
        "--- END input_ref content ---",
      ].join("\n"),
    };
  } catch {
    return {
      ok: false,
      failure_note: `input_ref not readable: ${taskContract.input_ref}`,
    };
  }
}

function buildDispatchInput(
  taskContract: ResolvedTaskContract,
  inputRefSection: string | null,
): string {
  return [
    ...buildExecutionEnvelope(taskContract),
    "",
    `Execution mode: ${taskContract.execution_mode}`,
    `Objective: ${taskContract.objective || "No bounded objective recorded."}`,
    `Expected output: ${taskContract.expected_output}`,
    "",
    "Allowed scope:",
    ...formatBulletList(taskContract.allowed_scope),
    "",
    "Forbidden actions:",
    ...formatBulletList(taskContract.forbidden_actions),
    "",
    "Task contract:",
    JSON.stringify(taskContract, null, 2),
    ...(inputRefSection ? ["", inputRefSection] : []),
  ].join("\n");
}

function buildExecutionEnvelope(
  taskContract: ResolvedTaskContract,
): string[] {
  if (taskContract.execution_mode === "bounded_write") {
    return [
      "You are executing one bounded JAI NEXUS task contract.",
      "Produce output only. Any implementation-class content must remain inside the output artifact for operator review and manual application.",
      "You may produce bounded implementation output, including code, patch text, or file content, when it stays within the contract.",
      "Do not claim direct file writes, commits, pushes, pull requests, merges, or background execution.",
    ];
  }

  return [
    "You are executing one bounded JAI NEXUS task contract.",
    "Operate only within the contract.",
    "Do not claim repo mutation, direct file writes, commits, pull requests, merges, or background execution.",
    "Return only the human-reviewable result content for the operator.",
  ];
}

function formatBulletList(items: string[]): string[] {
  if (items.length === 0) {
    return ["- No additional scope items recorded."];
  }

  return items.map((item) => `- ${item}`);
}

function extractOpenAIErrorMessage(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return "request failed without a structured error payload";
}

function isModelNotFoundFailure(
  status: number,
  message: string,
  modelId: string,
): boolean {
  const normalizedMessage = message.toLowerCase();
  const normalizedModel = modelId.toLowerCase();

  if (status === 404 && normalizedMessage.includes("model")) {
    return true;
  }

  return (
    normalizedMessage.includes(normalizedModel) &&
    (
      normalizedMessage.includes("not found") ||
      normalizedMessage.includes("does not exist") ||
      normalizedMessage.includes("unknown model") ||
      normalizedMessage.includes("unrecognized model") ||
      normalizedMessage.includes("invalid model")
    )
  );
}

function extractOutputText(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "output_text" in payload &&
    typeof payload.output_text === "string" &&
    payload.output_text.trim()
  ) {
    return payload.output_text;
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("output" in payload) ||
    !Array.isArray(payload.output)
  ) {
    return null;
  }

  const chunks: string[] = [];

  for (const item of payload.output) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("content" in item) ||
      !Array.isArray(item.content)
    ) {
      continue;
    }

    for (const content of item.content) {
      if (
        typeof content === "object" &&
        content !== null &&
        "type" in content &&
        content.type === "output_text" &&
        "text" in content &&
        typeof content.text === "string"
      ) {
        chunks.push(content.text);
      }
    }
  }

  const joined = chunks.join("").trim();
  return joined || null;
}

function normalizePathForDisplay(targetPath: string): string {
  return targetPath.split(path.sep).join("/");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}
