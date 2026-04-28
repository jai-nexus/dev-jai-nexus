#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const scriptPath = fileURLToPath(import.meta.url);
const portalRoot = path.resolve(path.dirname(scriptPath), "..");
const repoRoot = path.resolve(portalRoot, "..");

function usage() {
  console.error(
    "Usage: node portal/scripts/export-continuity-artifacts.mjs --write | --check",
  );
  process.exit(1);
}

function runContinuitySnapshot() {
  const code = `
    import { getSeededConversationRecords } from './src/lib/continuity/conversations.ts';
    import { getSeededWavePlans } from './src/lib/continuity/waves.ts';
    const payload = {
      conversations: getSeededConversationRecords(),
      waves: getSeededWavePlans(),
    };
    console.log(JSON.stringify(payload));
  `;

  const tsxCliPath = path.join(portalRoot, "node_modules", "tsx", "dist", "cli.mjs");
  const result = spawnSync(process.execPath, [tsxCliPath, "-e", code], {
    cwd: portalRoot,
    encoding: "utf8",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `Failed to load continuity model: ${result.stderr || result.stdout || "unknown error"}`,
    );
  }

  return JSON.parse(result.stdout);
}

function ensureChatIdConvention(chatId) {
  return /^\d{4}-\d{2}-\d{2}__[a-z0-9-]+__[a-z0-9-]+$/.test(chatId);
}

function flattenNodes(nodes, acc = []) {
  for (const node of nodes) {
    acc.push(node);
    flattenNodes(node.children, acc);
  }
  return acc;
}

function renderChatMarkdown(record) {
  const lines = [
    `# ${record.title}`,
    "",
    `- chat_id: ${record.chat_id}`,
    `- source_kind: ${record.source_kind}`,
    `- source_label: ${record.source_label}`,
    `- repo: ${record.repo_full_name}`,
    `- surface: ${record.surface_label}`,
    `- status: ${record.status}`,
    `- captured_at: ${record.captured_at}`,
    `- related_motion_ids: ${record.related_motion_ids.join(", ")}`,
    `- related_wave_ids: ${record.related_wave_ids.join(", ")}`,
    `- related_work_packet_ids: ${record.related_work_packet_ids.join(", ")}`,
    `- related_candidate_ids: ${record.related_candidate_ids.join(", ")}`,
    "",
    "## Summary",
    "",
    record.summary,
    "",
    "## Decisions",
    "",
    ...record.decisions.map((item) => `- ${item}`),
    "",
    "## Risks",
    "",
    ...record.risks.map((item) => `- ${item}`),
    "",
    "## Tasks",
    "",
    ...record.tasks.map((item) => `- ${item}`),
    "",
    "## Next Prompts",
    "",
    ...record.next_prompts.flatMap((prompt, index) => [
      `### Prompt ${index + 1}`,
      "",
      "```text",
      prompt,
      "```",
      "",
    ]),
  ];

  return `${lines.join("\n").trim()}\n`;
}

function renderWaveYaml(wave) {
  const wavePayload = {
    wave_id: wave.wave_id,
    title: wave.title,
    status: wave.status,
    repo: wave.repo_full_name,
    surface: wave.surface_label,
    project: wave.project_label,
    related_motion_ids: wave.related_motion_ids,
    related_chat_ids: wave.related_chat_ids,
    related_work_packet_ids: wave.related_work_packet_ids,
    related_candidate_ids: wave.related_candidate_ids,
    deliberation_route: wave.deliberation_route,
    artifact_paths: wave.artifact_path_preview,
    nodes: wave.nodes,
  };

  return yaml.dump(wavePayload, {
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  });
}

function renderWavePlanMarkdown(wave) {
  const lines = [
    `# ${wave.title}`,
    "",
    `- wave_id: ${wave.wave_id}`,
    `- status: ${wave.status}`,
    `- repo: ${wave.repo_full_name}`,
    `- surface: ${wave.surface_label}`,
    `- project: ${wave.project_label ?? "none"}`,
    `- related_motion_ids: ${wave.related_motion_ids.join(", ")}`,
    `- related_chat_ids: ${wave.related_chat_ids.join(", ")}`,
    `- related_work_packet_ids: ${wave.related_work_packet_ids.join(", ")}`,
    `- related_candidate_ids: ${wave.related_candidate_ids.join(", ")}`,
    `- deliberation_route: ${wave.deliberation_route}`,
    "",
    "## Next Prompt Preview",
    "",
    "```text",
    wave.next_prompt_preview,
    "```",
    "",
    "## nh_id Plan",
    "",
  ];

  for (const node of flattenNodes(wave.nodes)) {
    lines.push(`### ${node.nh_id} ${node.title}`);
    lines.push("");
    lines.push(`- status: ${node.status}`);
    lines.push(`- summary: ${node.summary}`);
    lines.push(`- linked_motion_ids: ${node.linked_motion_ids.join(", ")}`);
    lines.push(`- linked_chat_ids: ${node.linked_chat_ids.join(", ")}`);
    lines.push(`- linked_work_packet_ids: ${node.linked_work_packet_ids.join(", ")}`);
    lines.push(`- linked_candidate_ids: ${node.linked_candidate_ids.join(", ")}`);
    lines.push("");
    lines.push("Acceptance notes:");
    lines.push(...node.acceptance_notes.map((note) => `- ${note}`));
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function buildArtifacts(model) {
  const artifacts = [];

  for (const record of model.conversations) {
    if (!ensureChatIdConvention(record.chat_id)) {
      throw new Error(`Invalid chat id convention: ${record.chat_id}`);
    }

    artifacts.push({
      path: path.join(repoRoot, record.artifact_path_preview),
      relativePath: record.artifact_path_preview,
      content: renderChatMarkdown(record),
      kind: "chat",
      id: record.chat_id,
    });
  }

  for (const wave of model.waves) {
    artifacts.push({
      path: path.join(repoRoot, wave.artifact_path_preview.wave_yaml),
      relativePath: wave.artifact_path_preview.wave_yaml,
      content: renderWaveYaml(wave),
      kind: "wave_yaml",
      id: wave.wave_id,
    });
    artifacts.push({
      path: path.join(repoRoot, wave.artifact_path_preview.plan_md),
      relativePath: wave.artifact_path_preview.plan_md,
      content: renderWavePlanMarkdown(wave),
      kind: "wave_plan",
      id: wave.wave_id,
    });
  }

  return artifacts.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function writeArtifacts(artifacts) {
  for (const artifact of artifacts) {
    fs.mkdirSync(path.dirname(artifact.path), { recursive: true });
    fs.writeFileSync(artifact.path, artifact.content, "utf8");
  }
}

function diffArtifacts(artifacts) {
  const drift = [];

  for (const artifact of artifacts) {
    const exists = fs.existsSync(artifact.path);
    if (!exists) {
      drift.push({
        path: artifact.relativePath,
        reason: "missing",
      });
      continue;
    }

    const current = fs.readFileSync(artifact.path, "utf8");
    if (current !== artifact.content) {
      drift.push({
        path: artifact.relativePath,
        reason: "content_mismatch",
      });
    }
  }

  return drift;
}

const mode = process.argv[2];
if (mode !== "--write" && mode !== "--check") {
  usage();
}

const model = runContinuitySnapshot();
const artifacts = buildArtifacts(model);

if (mode === "--write") {
  writeArtifacts(artifacts);
  console.log(
    JSON.stringify(
      {
        status: "written",
        artifactCount: artifacts.length,
        chatIds: model.conversations.map((record) => record.chat_id),
        waveIds: model.waves.map((wave) => wave.wave_id),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const drift = diffArtifacts(artifacts);
if (drift.length > 0) {
  console.error(
    JSON.stringify(
      {
        status: "stale",
        artifactCount: artifacts.length,
        drift,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "current",
      artifactCount: artifacts.length,
      chatIds: model.conversations.map((record) => record.chat_id),
      waveIds: model.waves.map((wave) => wave.wave_id),
    },
    null,
    2,
  ),
);
