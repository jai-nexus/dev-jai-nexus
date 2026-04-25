#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const MOTIONS_ROOT = path.join(REPO_ROOT, ".nexus", "motions");
const SNAPSHOT_PATH = path.join(REPO_ROOT, "portal", "src", "lib", "motion", "motionSnapshot.json");
// v0 is intentionally bounded to deployed canon through motion-0157.
const SNAPSHOT_MAX_MOTION_NUMBER = 157;

const CORE_ARTIFACT_KEYS = [
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
];

const MODERN_MOTION_STATUSES = new Set(["open", "ratified"]);
const DRAFT_LIKE_DECISION_STATUSES = new Set(["DRAFT", "PENDING", "PROPOSED"]);

function normalizeNewlines(text) {
  return String(text ?? "").replace(/\r\n/g, "\n");
}

function truncatePreview(text, maxLength = 6000) {
  const normalized = normalizeNewlines(text).trimEnd();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}\n...(truncated)...`;
}

function asString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBoolean(value) {
  return typeof value === "boolean" ? value : null;
}

function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function safeReadText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeParseYaml(text) {
  if (!text) return null;
  try {
    return asRecord(yaml.load(text));
  } catch {
    return null;
  }
}

function safeParseJson(text) {
  if (!text) return null;
  try {
    return asRecord(JSON.parse(text));
  } catch {
    return null;
  }
}

async function getMtime(targetPath) {
  try {
    const stats = await fs.stat(targetPath);
    return stats.mtimeMs;
  } catch {
    return null;
  }
}

function newestTimestamp(timestamps) {
  const newest = timestamps.reduce((currentMax, value) => {
    return value && Number.isFinite(value) ? Math.max(currentMax, value) : currentMax;
  }, 0);

  return newest > 0 ? new Date(newest).toISOString() : null;
}

async function countPanelDirs(panelsPath) {
  try {
    const entries = await fs.readdir(panelsPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).length;
  } catch {
    return 0;
  }
}

function parseMotionNumber(motionId) {
  const match = /^motion-(\d+)$/i.exec(motionId);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function buildQueueState({
  decisionStatus,
  motionStatus,
  requiredOk,
  eligibleToVote,
  voteResult,
  attentionFlags,
}) {
  if (attentionFlags.length > 0) return "attention";

  const normalizedDecisionStatus = decisionStatus?.toUpperCase() ?? null;
  const normalizedMotionStatus = motionStatus?.toLowerCase() ?? null;

  if (normalizedDecisionStatus === "RATIFIED") {
    if (requiredOk === true && voteResult?.toUpperCase() === "PASS") {
      return "settled";
    }
    return "ratified";
  }

  if (requiredOk === true && eligibleToVote === true) {
    return "ready_for_vote";
  }

  if (
    (normalizedDecisionStatus &&
      DRAFT_LIKE_DECISION_STATUSES.has(normalizedDecisionStatus)) ||
    normalizedMotionStatus === "open" ||
    normalizedMotionStatus === "proposed"
  ) {
    return "draft";
  }

  return "unknown";
}

function isModernStatusMismatch(motionStatus, decisionStatus) {
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

function buildPromptPack({
  motionId,
  title,
  queueState,
  decisionStatus,
  requiredOk,
  voteResult,
  attentionFlags,
  artifactPaths,
}) {
  const lines = [
    "Repo: dev-jai-nexus",
    `Motion: ${motionId}`,
    `Title: ${title}`,
    `Queue state: ${queueState}`,
    `Decision status: ${decisionStatus ?? "null"}`,
    `Required gates ok: ${requiredOk == null ? "null" : String(requiredOk)}`,
    `Vote result: ${voteResult ?? "null"}`,
    "",
    "Attention flags:",
  ];

  if (attentionFlags.length === 0) {
    lines.push("- none");
  } else {
    lines.push(...attentionFlags.map((flag) => `- ${flag}`));
  }

  lines.push("", "Read order:");
  lines.push(...artifactPaths.map((artifactPath, index) => `${index + 1}. ${artifactPath}`));
  lines.push(
    "",
    "Read-only boundary:",
    "- inspect the motion package only",
    "- do not dispatch, vote, ratify, or mutate repo artifacts unless separately instructed",
  );

  return lines.join("\n");
}

function buildHandoffPack({ motionId, artifactPaths, secondaryArtifacts }) {
  const lines = [
    `Motion handoff pack for ${motionId}`,
    "",
    "Core artifact paths:",
    ...artifactPaths.map((artifactPath) => `- ${artifactPath}`),
    "",
    "Secondary evidence surfaces:",
  ];

  const presentSecondary = secondaryArtifacts.filter((artifact) => artifact.present);
  if (presentSecondary.length === 0) {
    lines.push("- none");
  } else {
    lines.push(
      ...presentSecondary.map((artifact) =>
        artifact.detail ? `- ${artifact.path} (${artifact.detail})` : `- ${artifact.path}`,
      ),
    );
  }

  lines.push("", "Chat search:", `- /operator/chats?q=${encodeURIComponent(motionId)}`);
  return lines.join("\n");
}

async function scanMotion(motionId) {
  const motionDir = path.join(MOTIONS_ROOT, motionId);

  const coreArtifacts = await Promise.all(
    CORE_ARTIFACT_KEYS.map(async (artifactKey) => {
      const artifactPath = path.join(motionDir, artifactKey);
      const rawText = await safeReadText(artifactPath);
      const present = rawText !== null;
      const isYaml = artifactKey.endsWith(".yaml");
      const isJson = artifactKey.endsWith(".json");

      let parseOk = null;
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
          artifact.present &&
          artifact.parse_ok === false &&
          artifact.key !== "execution.md" &&
          artifact.key !== "proposal.md" &&
          artifact.key !== "challenge.md",
      )
      .map((artifact) => `parse error: ${artifact.key}`),
  ];

  if (isModernStatusMismatch(motionStatus, decisionStatus)) {
    attentionFlags.push(
      `status mismatch: motion.yaml=${motionStatus ?? "null"} while decision.yaml=${decisionStatus ?? "null"}`,
    );
  }

  const secondaryArtifacts = await Promise.all(
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

  const item = {
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

  const persistedCoreArtifacts = coreArtifacts.map(({ rawText, ...artifact }) => artifact);
  const artifactPaths = persistedCoreArtifacts.map((artifact) => artifact.path);
  const executionArtifact = persistedCoreArtifacts.find((artifact) => artifact.key === "execution.md");
  const executionExcerpt = executionArtifact?.preview
    ? truncatePreview(executionArtifact.preview, 1600)
    : null;

  return {
    motion_id: motionId,
    item,
    core_artifacts: persistedCoreArtifacts,
    secondary_artifacts: secondaryArtifacts,
    execution_excerpt: executionExcerpt,
    prompt_pack: buildPromptPack({
      motionId,
      title: item.title,
      queueState: item.queue_state,
      decisionStatus: item.decision_status,
      requiredOk: item.required_ok,
      voteResult: item.vote_result,
      attentionFlags: item.attention_flags,
      artifactPaths,
    }),
    handoff_pack: buildHandoffPack({
      motionId,
      artifactPaths,
      secondaryArtifacts,
    }),
    chat_search_href: `/operator/chats?q=${encodeURIComponent(motionId)}`,
  };
}

async function main() {
  const entries = await fs.readdir(MOTIONS_ROOT, { withFileTypes: true });
  const motionIds = entries
    .filter((entry) => entry.isDirectory() && /^motion-\d+$/i.test(entry.name))
    .filter((entry) => parseMotionNumber(entry.name) <= SNAPSHOT_MAX_MOTION_NUMBER)
    .map((entry) => entry.name)
    .sort((left, right) => parseMotionNumber(right) - parseMotionNumber(left));

  const snapshotEntries = [];
  for (const motionId of motionIds) {
    snapshotEntries.push(await scanMotion(motionId));
  }

  const snapshot = {
    snapshot_id: "operator-motions-snapshot-v0",
    schema_version: "0.1.0",
    generated_at: new Date().toISOString(),
    source_repo: "dev-jai-nexus",
    source_path: ".nexus/motions",
    motion_count: snapshotEntries.length,
    generator: "portal/scripts/build-motion-snapshot.mjs",
    entries: snapshotEntries,
  };

  await fs.writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  const has0157 = snapshotEntries.some((entry) => entry.motion_id === "motion-0157");
  const motion0151 = snapshotEntries.find((entry) => entry.motion_id === "motion-0151");
  const has0151Mismatch =
    motion0151?.item.attention_flags.includes(
      "status mismatch: motion.yaml=open while decision.yaml=RATIFIED",
    ) ?? false;

  console.log(`snapshot_path: ${path.relative(REPO_ROOT, SNAPSHOT_PATH).replace(/\\/g, "/")}`);
  console.log(`motion_count: ${snapshot.motion_count}`);
  console.log(`has_motion_0157: ${has0157}`);
  console.log(`motion_0151_mismatch_present: ${has0151Mismatch}`);
}

main().catch((error) => {
  console.error("[build-motion-snapshot] FAILED");
  console.error(error);
  process.exit(1);
});
