import { readFileSync } from "node:fs";
import path from "node:path";

import type { TaskContract } from "./taskContract.ts";

const SLOT_CONFIG_PATH = path.join(process.cwd(), ".nexus", "model-slots.yaml");
const OPENAI_ENV_VAR_NAME = "OPENAI_API_KEY";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

type ParsedSlotConfig = {
  provider?: string;
  model?: string;
  notes?: string;
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
  if (taskContract.slot.endsWith("_SELECTOR")) {
    return {
      ok: false,
      failure_note: "selector slots excluded from dispatch",
    };
  }

  if (taskContract.provider !== "openai") {
    return {
      ok: false,
      failure_note: `unsupported provider: ${taskContract.provider}`,
    };
  }

  return dispatchOpenAI(taskContract);
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
  taskContract: TaskContract,
): Promise<DispatchResult> {
  const apiKey = process.env[OPENAI_ENV_VAR_NAME];
  if (!apiKey) {
    return {
      ok: false,
      failure_note: `provider credentials not set: ${OPENAI_ENV_VAR_NAME}`,
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
        input: buildDispatchInput(taskContract),
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

function buildDispatchInput(taskContract: TaskContract): string {
  return [
    "You are executing one bounded JAI NEXUS task contract.",
    "Operate only within the contract.",
    "Do not claim repo mutation, commits, PR creation, or background execution.",
    "Return only the human-reviewable result content for the operator.",
    "",
    "Task contract:",
    JSON.stringify(taskContract, null, 2),
  ].join("\n");
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}
