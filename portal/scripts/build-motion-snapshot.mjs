#!/usr/bin/env node
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const SNAPSHOT_PATH = path.join(
  "portal",
  "src",
  "lib",
  "motion",
  "motionSnapshot.json",
);

// Git objects at the accepted Corpus V1 baseline (2a6fbfc7). Both objects
// travel with a depth-one checkout of the unchanged historical substrate.
export const HISTORICAL_TREE = "efacb71341c16dd10da5de402721cbdf5a58f505";
const HISTORICAL_SNAPSHOT = "467ba2be1cdbc8f3941a4a978603f4a7084c7104";

function git(root, args) {
  return execFileSync("git", ["--no-replace-objects", ...args], {
    cwd: root, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: "0", GIT_NO_LAZY_FETCH: "1" },
  });
}

export async function verifyHistoricalMotions(root) {
  const motions = path.join(root, ".nexus", "motions");
  const rows = git(root, ["ls-tree", "-r", "-z", HISTORICAL_TREE]).toString().split("\0").filter(Boolean);
  const expected = new Map(rows.map(row => {
    const [, oid, name] = /^100644 blob ([a-f0-9]{40})\t(.+)$/.exec(row);
    return [name, oid];
  }));
  const historical = new Set([...expected.keys()].map(name => name.split("/")[0]));
  const ignored = new Set(git(root, [
    "ls-files", "-z", "--others", "--ignored", "--exclude-standard", "--", ".nexus/motions/",
  ]).toString().split("\0"));
  for (const id of historical) {
    const dir = path.join(motions, id);
    if (!(await fs.lstat(dir)).isDirectory()) throw new Error(`Historical Motion directory missing: ${id}`);
    const entries = await fs.readdir(dir, { recursive: true, withFileTypes: true });
    await Promise.all(entries.filter(entry => !entry.isDirectory()).map(async entry => {
      const file = path.join(entry.parentPath, entry.name);
      const name = path.relative(motions, file).split(path.sep).join("/");
      const oid = expected.get(name);
      if (!oid && ignored.has(`.nexus/motions/${name}`)) return;
      if (!entry.isFile() || !oid) throw new Error(`Unexpected historical Motion artifact: ${name}`);
      const bytes = await fs.readFile(file);
      const actual = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
      // Git may expand LF on checkout. In that case compare the actual
      // checkout representation of the accepted blob, including its filters.
      if (actual !== oid && !bytes.equals(git(root, [
        "cat-file", "--filters", `--path=.nexus/motions/${name}`, oid,
      ]))) throw new Error(`Historical Motion content drift: ${name}`);
      expected.delete(name);
    }));
  }
  if (expected.size) throw new Error(`Missing historical Motion artifact: ${expected.keys().next().value}`);
  return historical;
}

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
const FALLBACK_GENERATED_AT = "1970-01-01T00:00:00.000Z";

function printUsage() {
  console.log("Usage:");
  console.log("  node portal/scripts/build-motion-snapshot.mjs --write");
  console.log("  node portal/scripts/build-motion-snapshot.mjs --check");
  console.log("");
  console.log("Notes:");
  console.log("  --write regenerates portal/src/lib/motion/motionSnapshot.json");
  console.log("  --check exits 0 when the committed snapshot matches generated canon");
  console.log("  Running with no flag defaults to --write for backward compatibility.");
}

function parseCli(argv) {
  const args = new Set(argv);
  if (args.has("--help") || args.has("-h")) {
    return { mode: "help" };
  }

  const wantsWrite = args.has("--write");
  const wantsCheck = args.has("--check");
  if (wantsWrite && wantsCheck) {
    throw new Error("Choose either --write or --check, not both.");
  }

  return {
    mode: wantsCheck ? "check" : "write",
  };
}

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

function newestIsoTimestamp(values) {
  const newest = values.reduce((currentMax, value) => {
    if (!value) return currentMax;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? Math.max(currentMax, parsed) : currentMax;
  }, 0);

  return newest > 0 ? new Date(newest).toISOString() : FALLBACK_GENERATED_AT;
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

async function scanMotion(motionsRoot, motionId, recordedTime) {
  const motionDir = path.join(motionsRoot, motionId);

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
    updated_at: recordedTime ?? newestIsoTimestamp([motionYaml?.aligned_at, decidedAt, createdAt]),
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

async function buildSnapshot(root) {
  const motionsRoot = path.join(root, ".nexus", "motions");
  await verifyHistoricalMotions(root);
  const original = JSON.parse(git(root, ["cat-file", "blob", HISTORICAL_SNAPSHOT]));
  const historicalTimes = new Map(original.entries.map(entry => [entry.motion_id, entry.item.updated_at]));
  const entries = await fs.readdir(motionsRoot, { withFileTypes: true });
  const motionIds = entries
    .filter((entry) => entry.isDirectory() && /^motion-\d+$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => parseMotionNumber(right) - parseMotionNumber(left));

  const snapshotEntries = [];
  for (const motionId of motionIds) {
    snapshotEntries.push(await scanMotion(motionsRoot, motionId, historicalTimes.get(motionId)));
  }

  return {
    snapshot_id: "operator-motions-snapshot-v0",
    schema_version: "0.1.0",
    generated_at: newestIsoTimestamp(snapshotEntries.map((entry) => entry.item.updated_at)),
    source_repo: "dev-jai-nexus",
    source_path: ".nexus/motions",
    motion_count: snapshotEntries.length,
    generator: "portal/scripts/build-motion-snapshot.mjs",
    entries: snapshotEntries,
  };
}

function serializeSnapshot(snapshot) {
  return `${JSON.stringify(snapshot, null, 2)}\n`;
}

function parseExistingSnapshotText(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildSnapshotSummary(snapshot) {
  const motionIds = Array.isArray(snapshot?.entries)
    ? snapshot.entries.map((entry) => entry.motion_id).filter((value) => typeof value === "string")
    : [];
  const motion0151 = Array.isArray(snapshot?.entries)
    ? snapshot.entries.find((entry) => entry.motion_id === "motion-0151")
    : null;

  return {
    motion_count: motionIds.length,
    latest_motion_id: motionIds[0] ?? null,
    has_motion_0161: motionIds.includes("motion-0161"),
    motion_0151_mismatch_present:
      motion0151?.item?.attention_flags?.includes(
        "status mismatch: motion.yaml=open while decision.yaml=RATIFIED",
      ) ?? false,
    motion_ids: motionIds,
  };
}

function buildDriftReport(currentSnapshot, nextSnapshot) {
  const currentSummary = buildSnapshotSummary(currentSnapshot);
  const nextSummary = buildSnapshotSummary(nextSnapshot);
  const currentIds = new Set(currentSummary.motion_ids);
  const nextIds = new Set(nextSummary.motion_ids);
  const missingMotionIds = currentSummary.motion_ids.filter((motionId) => !nextIds.has(motionId));
  const unexpectedMotionIds = nextSummary.motion_ids.filter((motionId) => !currentIds.has(motionId));

  const mismatchedMotionIds = [];
  if (Array.isArray(currentSnapshot?.entries) && Array.isArray(nextSnapshot?.entries)) {
    const currentEntries = new Map(
      currentSnapshot.entries.map((entry) => [entry.motion_id, JSON.stringify(entry)]),
    );
    for (const entry of nextSnapshot.entries) {
      const currentEntry = currentEntries.get(entry.motion_id);
      if (currentEntry && currentEntry !== JSON.stringify(entry)) {
        mismatchedMotionIds.push(entry.motion_id);
      }
    }
  }

  return {
    currentSummary,
    nextSummary,
    missingMotionIds,
    unexpectedMotionIds,
    mismatchedMotionIds,
  };
}

function printSnapshotSummary({ mode, status, currentSnapshot, nextSnapshot }) {
  const currentSummary = currentSnapshot ? buildSnapshotSummary(currentSnapshot) : null;
  const nextSummary = buildSnapshotSummary(nextSnapshot);

  console.log(`mode: ${mode}`);
  console.log(`status: ${status}`);
  console.log(`snapshot_path: ${SNAPSHOT_PATH.split(path.sep).join("/")}`);
  if (currentSummary) {
    console.log(`snapshot_count_before: ${currentSummary.motion_count}`);
  }
  console.log(`snapshot_count_after: ${nextSummary.motion_count}`);
  console.log(`latest_motion_id_after: ${nextSummary.latest_motion_id ?? "null"}`);
  console.log(`has_motion_0161: ${nextSummary.has_motion_0161}`);
  console.log(`motion_0151_mismatch_present: ${nextSummary.motion_0151_mismatch_present}`);
}

function printDriftReport(report) {
  console.log("drift: stale snapshot detected");
  console.log(`current_motion_count: ${report.currentSummary.motion_count}`);
  console.log(`expected_motion_count: ${report.nextSummary.motion_count}`);
  console.log(`current_latest_motion_id: ${report.currentSummary.latest_motion_id ?? "null"}`);
  console.log(`expected_latest_motion_id: ${report.nextSummary.latest_motion_id ?? "null"}`);
  console.log(
    `missing_motion_ids: ${report.missingMotionIds.length > 0 ? report.missingMotionIds.join(", ") : "none"}`,
  );
  console.log(
    `unexpected_motion_ids: ${report.unexpectedMotionIds.length > 0 ? report.unexpectedMotionIds.join(", ") : "none"}`,
  );
  console.log(
    `mismatched_motion_ids: ${report.mismatchedMotionIds.length > 0 ? report.mismatchedMotionIds.join(", ") : "none"}`,
  );
}

export async function run(root = REPO_ROOT, args = process.argv.slice(2)) {
  const cli = parseCli(args);
  if (cli.mode === "help") {
    printUsage();
    return;
  }

  const snapshotPath = path.join(root, SNAPSHOT_PATH);
  const nextSnapshot = await buildSnapshot(root);
  const nextText = serializeSnapshot(nextSnapshot);
  const currentText = await safeReadText(snapshotPath);
  const currentSnapshot = parseExistingSnapshotText(currentText);

  if (cli.mode === "check") {
    if (currentText === null) {
      printSnapshotSummary({
        mode: "check",
        status: "stale",
        currentSnapshot: null,
        nextSnapshot,
      });
      console.log("drift: committed snapshot file is missing");
      throw new Error("Committed snapshot missing");
    }

    if (normalizeNewlines(currentText) === normalizeNewlines(nextText)) {
      printSnapshotSummary({
        mode: "check",
        status: "current",
        currentSnapshot,
        nextSnapshot,
      });
      console.log(`MOTION_COUNT: ${nextSnapshot.motion_count}\nHISTORICAL_MOTION_DIFF: 0\nMOTION_SNAPSHOT_FILE_CHANGED: NO`);
      return;
    }

    printSnapshotSummary({
      mode: "check",
      status: "stale",
      currentSnapshot,
      nextSnapshot,
    });
    printDriftReport(buildDriftReport(currentSnapshot, nextSnapshot));
    throw new Error("Committed snapshot differs from canonical Motion content");
  }

  await fs.writeFile(snapshotPath, nextText, "utf8");
  const status =
    currentText !== null && normalizeNewlines(currentText) === normalizeNewlines(nextText)
      ? "current"
      : "updated";

  printSnapshotSummary({
    mode: "write",
    status,
    currentSnapshot,
    nextSnapshot,
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) run().catch((error) => {
  console.error("[build-motion-snapshot] FAILED");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
