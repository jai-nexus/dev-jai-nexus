import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export type MotionQueueState =
  | "attention"
  | "draft"
  | "ready_for_vote"
  | "ratified"
  | "settled"
  | "unknown";

export type MotionQueueItem = {
  motion_id: string;
  title: string;
  subtitle: string | null;
  program: string | null;
  kind: string | null;
  basis: string | null;
  motion_status: string | null;
  decision_status: string | null;
  required_ok: boolean | null;
  eligible_to_vote: boolean | null;
  vote_result: string | null;
  created_at: string | null;
  decided_at: string | null;
  updated_at: string | null;
  queue_state: MotionQueueState;
  attention_flags: string[];
  missing_files: string[];
};

export type MotionArtifactKey =
  | "motion.yaml"
  | "decision.yaml"
  | "policy.yaml"
  | "verify.json"
  | "vote.json"
  | "execution.md"
  | "proposal.md"
  | "challenge.md";

export type MotionArtifactView = {
  key: MotionArtifactKey;
  path: string;
  present: boolean;
  parse_ok: boolean | null;
  preview: string | null;
};

export type MotionSecondaryArtifact = {
  label: string;
  path: string;
  present: boolean;
  detail: string | null;
};

export type MotionDetailView = {
  repo_root: string;
  motions_root: string;
  item: MotionQueueItem;
  core_artifacts: MotionArtifactView[];
  secondary_artifacts: MotionSecondaryArtifact[];
  execution_excerpt: string | null;
  prompt_pack: string;
  handoff_pack: string;
  chat_search_href: string;
};

type ParsedYaml = Record<string, unknown>;
type ParsedJson = Record<string, unknown>;

type MotionSurfaceScan = {
  item: MotionQueueItem;
  core_artifacts: MotionArtifactView[];
  secondary_artifacts: MotionSecondaryArtifact[];
  repo_root: string;
  motions_root: string;
};

const CORE_ARTIFACT_KEYS: MotionArtifactKey[] = [
  "motion.yaml",
  "decision.yaml",
  "policy.yaml",
  "verify.json",
  "vote.json",
  "execution.md",
  "proposal.md",
  "challenge.md",
];

const SECONDARY_ARTIFACT_KEYS = [
  "decision.md",
  "execution.handoff.json",
  "execution.activation.json",
  "execution.receipt.json",
  "escalation.yaml",
] as const;

const MODERN_MOTION_STATUSES = new Set(["open", "ratified"]);
const DRAFT_LIKE_DECISION_STATUSES = new Set(["DRAFT", "PENDING", "PROPOSED"]);

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function findRepoRoot(startDir: string): Promise<string | null> {
  let currentDir = startDir;
  for (let index = 0; index < 10; index += 1) {
    if (await pathExists(path.join(currentDir, ".nexus"))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  return null;
}

function normalizeNewlines(text: string): string {
  return String(text ?? "").replace(/\r\n/g, "\n");
}

function truncatePreview(text: string, maxLength = 6000): string {
  const normalized = normalizeNewlines(text).trimEnd();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}\n...(truncated)...`;
}

function truncatePreviewLegacy(text: string, maxLength = 6000): string {
  const normalized = normalizeNewlines(text).trimEnd();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}\n…(truncated)…`;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

async function safeReadText(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeParseYaml(text: string | null): ParsedYaml | null {
  if (!text) return null;
  try {
    const parsed = yaml.load(text);
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function safeParseJson(text: string | null): ParsedJson | null {
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function newestTimestamp(timestamps: Array<number | null>): string | null {
  const newest = timestamps.reduce<number>(
    (currentMax, value) =>
      value && Number.isFinite(value) ? Math.max(currentMax, value) : currentMax,
    0,
  );

  return newest > 0 ? new Date(newest).toISOString() : null;
}

async function getMtime(targetPath: string): Promise<number | null> {
  try {
    const stats = await fs.stat(targetPath);
    return stats.mtimeMs;
  } catch {
    return null;
  }
}

async function countPanelDirs(panelsPath: string): Promise<number> {
  try {
    const entries = await fs.readdir(panelsPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).length;
  } catch {
    return 0;
  }
}

function parseMotionNumber(motionId: string): number {
  const match = /^motion-(\d+)$/i.exec(motionId);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function buildQueueState(args: {
  decisionStatus: string | null;
  motionStatus: string | null;
  requiredOk: boolean | null;
  eligibleToVote: boolean | null;
  voteResult: string | null;
  attentionFlags: string[];
}): MotionQueueState {
  if (args.attentionFlags.length > 0) return "attention";

  const decisionStatus = args.decisionStatus?.toUpperCase() ?? null;
  const motionStatus = args.motionStatus?.toLowerCase() ?? null;

  if (decisionStatus === "RATIFIED") {
    if (args.requiredOk === true && args.voteResult?.toUpperCase() === "PASS") {
      return "settled";
    }
    return "ratified";
  }

  if (args.requiredOk === true && args.eligibleToVote === true) {
    return "ready_for_vote";
  }

  if (
    (decisionStatus && DRAFT_LIKE_DECISION_STATUSES.has(decisionStatus)) ||
    motionStatus === "open" ||
    motionStatus === "proposed"
  ) {
    return "draft";
  }

  return "unknown";
}

function buildPromptPack(args: {
  motionId: string;
  title: string;
  queueState: MotionQueueState;
  decisionStatus: string | null;
  requiredOk: boolean | null;
  voteResult: string | null;
  attentionFlags: string[];
  artifactPaths: string[];
}): string {
  const lines = [
    `Repo: dev-jai-nexus`,
    `Motion: ${args.motionId}`,
    `Title: ${args.title}`,
    `Queue state: ${args.queueState}`,
    `Decision status: ${args.decisionStatus ?? "null"}`,
    `Required gates ok: ${args.requiredOk == null ? "null" : String(args.requiredOk)}`,
    `Vote result: ${args.voteResult ?? "null"}`,
    "",
    "Attention flags:",
  ];

  if (args.attentionFlags.length === 0) {
    lines.push("- none");
  } else {
    lines.push(...args.attentionFlags.map((flag) => `- ${flag}`));
  }

  lines.push("", "Read order:");
  lines.push(...args.artifactPaths.map((artifactPath, index) => `${index + 1}. ${artifactPath}`));
  lines.push(
    "",
    "Read-only boundary:",
    "- inspect the motion package only",
    "- do not dispatch, vote, ratify, or mutate repo artifacts unless separately instructed",
  );

  return lines.join("\n");
}

function buildHandoffPack(args: {
  motionId: string;
  artifactPaths: string[];
  secondaryArtifacts: MotionSecondaryArtifact[];
}): string {
  const lines = [
    `Motion handoff pack for ${args.motionId}`,
    "",
    "Core artifact paths:",
    ...args.artifactPaths.map((artifactPath) => `- ${artifactPath}`),
    "",
    "Secondary evidence surfaces:",
  ];

  const presentSecondary = args.secondaryArtifacts.filter((artifact) => artifact.present);
  if (presentSecondary.length === 0) {
    lines.push("- none");
  } else {
    lines.push(
      ...presentSecondary.map((artifact) =>
        artifact.detail
          ? `- ${artifact.path} (${artifact.detail})`
          : `- ${artifact.path}`,
      ),
    );
  }

  lines.push(
    "",
    "Chat search:",
    `- /operator/chats?q=${encodeURIComponent(args.motionId)}`,
  );

  return lines.join("\n");
}

function isModernStatusMismatch(
  motionStatus: string | null,
  decisionStatus: string | null,
): boolean {
  if (!motionStatus || !decisionStatus) return false;

  const normalizedMotionStatus = motionStatus.toLowerCase();
  if (!MODERN_MOTION_STATUSES.has(normalizedMotionStatus)) return false;

  if (normalizedMotionStatus === "open" && decisionStatus.toUpperCase() === "RATIFIED") {
    return true;
  }

  if (normalizedMotionStatus === "ratified" && decisionStatus.toUpperCase() !== "RATIFIED") {
    return true;
  }

  return false;
}

async function scanMotion(motionId: string, repoRoot: string): Promise<MotionSurfaceScan> {
  const motionsRoot = path.join(repoRoot, ".nexus", "motions");
  const motionDir = path.join(motionsRoot, motionId);

  const coreArtifacts = await Promise.all(
    CORE_ARTIFACT_KEYS.map(async (artifactKey) => {
      const artifactPath = path.join(motionDir, artifactKey);
      const rawText = await safeReadText(artifactPath);
      const present = rawText !== null;
      const isYaml = artifactKey.endsWith(".yaml");
      const isJson = artifactKey.endsWith(".json");

      let parseOk: boolean | null = null;
      if (present && isYaml) parseOk = safeParseYaml(rawText) !== null;
      if (present && isJson) parseOk = safeParseJson(rawText) !== null;

      return {
        key: artifactKey,
        path: `.nexus/motions/${motionId}/${artifactKey}`,
        present,
        parse_ok: parseOk,
        preview: present ? truncatePreview(rawText) : null,
        rawText,
      };
    }),
  );

  const coreArtifactMap = new Map(coreArtifacts.map((artifact) => [artifact.key, artifact]));

  const motionYaml = safeParseYaml(coreArtifactMap.get("motion.yaml")?.rawText ?? null);
  const decisionYaml = safeParseYaml(coreArtifactMap.get("decision.yaml")?.rawText ?? null);
  const policyYaml = safeParseYaml(coreArtifactMap.get("policy.yaml")?.rawText ?? null);
  const verifyJson = safeParseJson(coreArtifactMap.get("verify.json")?.rawText ?? null);
  const voteJson = safeParseJson(coreArtifactMap.get("vote.json")?.rawText ?? null);

  const motionStatus = asString(motionYaml?.status ?? null);
  const decisionStatus = asString(decisionYaml?.status ?? null);
  const requiredOk = asBoolean(asRecord(verifyJson?.summary)?.required_ok);
  const eligibleToVote = asBoolean(policyYaml?.eligible_to_vote ?? null);
  const voteResult = asString(asRecord(voteJson?.outcome)?.result ?? null);
  const createdAt = asString(motionYaml?.created_at ?? null);
  const decidedAt =
    asString(decisionYaml?.decided_at ?? null) ?? asString(motionYaml?.decided_at ?? null);

  const missingFiles = coreArtifacts
    .filter((artifact) => !artifact.present)
    .map((artifact) => artifact.key);

  const attentionFlags = [
    ...missingFiles.map((fileName) => `missing core file: ${fileName}`),
    ...coreArtifacts
      .filter(
        (artifact) =>
          artifact.present && artifact.parse_ok === false && artifact.key !== "execution.md" && artifact.key !== "proposal.md" && artifact.key !== "challenge.md",
      )
      .map((artifact) => `parse error: ${artifact.key}`),
  ];

  if (isModernStatusMismatch(motionStatus, decisionStatus)) {
    attentionFlags.push(
      `status mismatch: motion.yaml=${motionStatus ?? "null"} while decision.yaml=${decisionStatus ?? "null"}`,
    );
  }

  const secondaryArtifacts: MotionSecondaryArtifact[] = await Promise.all(
    SECONDARY_ARTIFACT_KEYS.map(async (artifactName) => {
      const artifactPath = path.join(motionDir, artifactName);
      const present = await pathExists(artifactPath);
      return {
        label: artifactName,
        path: `.nexus/motions/${motionId}/${artifactName}`,
        present,
        detail: null,
      };
    }),
  );

  const panelsPath = path.join(motionDir, "panels");
  const panelsPresent = await pathExists(panelsPath);
  const panelCount = panelsPresent ? await countPanelDirs(panelsPath) : 0;
  secondaryArtifacts.push({
    label: "panels",
    path: `.nexus/motions/${motionId}/panels`,
    present: panelsPresent,
    detail: panelsPresent ? `${panelCount} panel${panelCount === 1 ? "" : "s"}` : null,
  });

  const timestamps = await Promise.all([
    ...CORE_ARTIFACT_KEYS.map((artifactKey) => getMtime(path.join(motionDir, artifactKey))),
    ...SECONDARY_ARTIFACT_KEYS.map((artifactKey) => getMtime(path.join(motionDir, artifactKey))),
    getMtime(panelsPath),
  ]);

  const queueItem: MotionQueueItem = {
    motion_id: motionId,
    title: asString(motionYaml?.title ?? null) ?? motionId,
    subtitle: asString(motionYaml?.subtitle ?? null),
    program: asString(motionYaml?.program ?? null),
    kind: asString(motionYaml?.kind ?? null),
    basis: asString(motionYaml?.basis ?? null),
    motion_status: motionStatus,
    decision_status: decisionStatus,
    required_ok: requiredOk,
    eligible_to_vote: eligibleToVote,
    vote_result: voteResult,
    created_at: createdAt,
    decided_at: decidedAt,
    updated_at: newestTimestamp(timestamps),
    queue_state: buildQueueState({
      decisionStatus,
      motionStatus,
      requiredOk,
      eligibleToVote,
      voteResult,
      attentionFlags,
    }),
    attention_flags: attentionFlags,
    missing_files: missingFiles,
  };

  return {
    item: queueItem,
    core_artifacts: coreArtifacts.map(({ rawText: _rawText, ...artifact }) => artifact),
    secondary_artifacts: secondaryArtifacts,
    repo_root: repoRoot,
    motions_root: motionsRoot,
  };
}

export async function listMotionQueue(): Promise<MotionQueueItem[]> {
  const repoRoot = await findRepoRoot(process.cwd());
  if (!repoRoot) return [];

  const motionsRoot = path.join(repoRoot, ".nexus", "motions");
  if (!(await pathExists(motionsRoot))) return [];

  const entries = await fs.readdir(motionsRoot, { withFileTypes: true });
  const motionIds = entries
    .filter((entry) => entry.isDirectory() && /^motion-\d+$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => parseMotionNumber(right) - parseMotionNumber(left));

  const scans = await Promise.all(motionIds.map((motionId) => scanMotion(motionId, repoRoot)));
  return scans.map((scan) => scan.item);
}

export async function loadMotionDetail(motionId: string): Promise<MotionDetailView> {
  if (!/^motion-\d+$/i.test(motionId)) {
    throw new Error(`Invalid motion id: ${motionId}`);
  }

  const repoRoot = await findRepoRoot(process.cwd());
  if (!repoRoot) {
    throw new Error("Repo root not found (missing .nexus directory).");
  }

  const scan = await scanMotion(motionId, repoRoot);
  const artifactPaths = scan.core_artifacts.map((artifact) => artifact.path);
  const executionArtifact = scan.core_artifacts.find((artifact) => artifact.key === "execution.md");
  const executionExcerpt = executionArtifact?.preview ? truncatePreview(executionArtifact.preview, 1600) : null;

  return {
    repo_root: scan.repo_root,
    motions_root: scan.motions_root,
    item: scan.item,
    core_artifacts: scan.core_artifacts,
    secondary_artifacts: scan.secondary_artifacts,
    execution_excerpt: executionExcerpt,
    prompt_pack: buildPromptPack({
      motionId: scan.item.motion_id,
      title: scan.item.title,
      queueState: scan.item.queue_state,
      decisionStatus: scan.item.decision_status,
      requiredOk: scan.item.required_ok,
      voteResult: scan.item.vote_result,
      attentionFlags: scan.item.attention_flags,
      artifactPaths,
    }),
    handoff_pack: buildHandoffPack({
      motionId: scan.item.motion_id,
      artifactPaths,
      secondaryArtifacts: scan.secondary_artifacts,
    }),
    chat_search_href: `/operator/chats?q=${encodeURIComponent(scan.item.motion_id)}`,
  };
}
