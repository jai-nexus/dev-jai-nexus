#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const FIXTURE_ROOT = path.join(
  REPO_ROOT,
  ".nexus",
  "fixtures",
  "corpus-v2",
  "agent-governance-sandbox",
);

const REQUIRED_FIXTURES = [
  "motion-draft.v0.json",
  "vote-ratification-trace.v0.json",
  "failure-traces.v0.json",
  "gate-evidence.v0.json",
];

const ALLOWED_FIXTURE_TYPES = new Set([
  "motion_draft_trace",
  "vote_ratification_trace",
  "failure_trace_collection",
  "gate_evidence_collection",
]);

const CANONICAL_VOTERS = new Set(["jai-proposer", "jai-challenger", "jai-arbiter"]);
const FORBIDDEN_VOTERS = new Set(["ARCHITECT", "BUILDER", "VERIFIER", "LIBRARIAN", "OPERATOR"]);
const READINESS_GATE_IDS = new Set([
  "drafting",
  "canonical_voting",
  "visible_ratification",
  "workflow_outputs",
  "human_override",
  "identity_distinction",
  "schema_generation",
  "snapshot_gate",
  "numbering_reset",
  "v1_immutability",
  "authority_boundary",
]);

function fail(message) {
  throw new Error(message);
}

function readJson(fileName) {
  const filePath = path.join(FIXTURE_ROOT, fileName);
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fail(`${fileName}: unable to read fixture (${error.message})`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`${fileName}: invalid JSON (${error.message})`);
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    fail(`${fileName}: top-level JSON value must be an object`);
  }

  return { filePath, data: parsed };
}

function requireString(record, key, scope) {
  if (typeof record[key] !== "string" || record[key].trim().length === 0) {
    fail(`${scope}: missing non-empty string field "${key}"`);
  }
}

function requireBoolean(record, key, scope) {
  if (typeof record[key] !== "boolean") {
    fail(`${scope}: missing boolean field "${key}"`);
  }
}

function requireArray(record, key, scope) {
  if (!Array.isArray(record[key])) {
    fail(`${scope}: missing array field "${key}"`);
  }
}

function requireLabels(labels, scope) {
  if (!Array.isArray(labels)) {
    fail(`${scope}: missing array field "fixture_labels"`);
  }
  if (!labels.includes("Fixture-only")) {
    fail(`${scope}: fixture labels must include "Fixture-only"`);
  }
  if (!labels.includes("Review-only")) {
    fail(`${scope}: fixture labels must include "Review-only"`);
  }
  if (!labels.includes("Corpus V2 not open")) {
    fail(`${scope}: fixture labels must include "Corpus V2 not open"`);
  }
  if (!labels.includes("Simulated")) {
    fail(`${scope}: fixture labels must include "Simulated"`);
  }
  if (!labels.includes("No authority") && !labels.includes("Non-authoritative")) {
    fail(`${scope}: fixture labels must include "No authority" or "Non-authoritative"`);
  }
}

function requireFixtureHeader(record, scope) {
  requireString(record, "fixture_id", scope);
  requireString(record, "fixture_type", scope);
  requireString(record, "fixture_status", scope);
  if (!ALLOWED_FIXTURE_TYPES.has(record.fixture_type)) {
    fail(`${scope}: unexpected fixture_type "${record.fixture_type}"`);
  }
  requireLabels(record.fixture_labels, scope);
}

function includesText(collection, matcher) {
  return Array.isArray(collection)
    && collection.some((value) => typeof value === "string" && matcher(value));
}

function validateMotionDraft(record) {
  const scope = "motion-draft.v0.json";
  requireFixtureHeader(record, scope);
  [
    "corpus_id",
    "draft_motion_id",
    "draft_state",
    "proposer_identity",
    "target_repo",
    "target_domain",
    "problem_statement",
  ].forEach((key) => requireString(record, key, scope));
  [
    "role_lens_contributors",
    "proposed_scope",
    "non_goals",
    "required_files",
    "validation_expectations",
    "authority_boundary",
  ].forEach((key) => requireArray(record, key, scope));
  requireBoolean(record, "human_review_required", scope);

  if (record.proposer_identity !== "jai-proposer") {
    fail(`${scope}: proposer_identity must be "jai-proposer"`);
  }
  if (record.corpus_id === "corpus-v2" || String(record.corpus_id).toLowerCase().includes("open")) {
    fail(`${scope}: corpus_id must not imply Corpus V2 is open`);
  }
  if (!record.role_lens_contributors.every((value) => typeof value === "string")) {
    fail(`${scope}: role_lens_contributors must contain strings`);
  }
  if (!includesText(record.authority_boundary, (value) => value.toLowerCase().includes("corpus v2 not open"))) {
    fail(`${scope}: authority_boundary must include a Corpus V2 not open note`);
  }
}

function validateVoteRatification(record) {
  const scope = "vote-ratification-trace.v0.json";
  requireFixtureHeader(record, scope);
  requireArray(record, "vote_trace", scope);
  if (!record.ratification_trace || typeof record.ratification_trace !== "object" || Array.isArray(record.ratification_trace)) {
    fail(`${scope}: missing object field "ratification_trace"`);
  }
  if (!record.blocked_trace_example || typeof record.blocked_trace_example !== "object" || Array.isArray(record.blocked_trace_example)) {
    fail(`${scope}: missing object field "blocked_trace_example"`);
  }
  requireArray(record, "authority_boundary", scope);

  if (record.vote_trace.length !== 3) {
    fail(`${scope}: vote_trace must contain exactly three canonical governance voters`);
  }

  for (const [index, vote] of record.vote_trace.entries()) {
    const voteScope = `${scope} vote_trace[${index}]`;
    if (!vote || typeof vote !== "object" || Array.isArray(vote)) {
      fail(`${voteScope}: entry must be an object`);
    }
    ["voter", "vote", "reason", "evidence_ref"].forEach((key) => requireString(vote, key, voteScope));
    if (FORBIDDEN_VOTERS.has(vote.voter)) {
      fail(`${voteScope}: voter "${vote.voter}" is an execution/lens label and is not allowed`);
    }
    if (!CANONICAL_VOTERS.has(vote.voter)) {
      fail(`${voteScope}: voter "${vote.voter}" is not a canonical governance voter identity`);
    }
  }

  const seenVoters = new Set(record.vote_trace.map((vote) => vote.voter));
  if (seenVoters.size !== 3 || [...CANONICAL_VOTERS].some((voter) => !seenVoters.has(voter))) {
    fail(`${scope}: vote_trace must include jai-proposer, jai-challenger, and jai-arbiter exactly once`);
  }

  requireString(record.ratification_trace, "simulated_result", `${scope} ratification_trace`);
  requireBoolean(record.ratification_trace, "human_intervention_required", `${scope} ratification_trace`);
  requireString(record.ratification_trace, "human_intervention_field", `${scope} ratification_trace`);
  requireArray(record.ratification_trace, "validation_evidence", `${scope} ratification_trace`);
  requireString(record.blocked_trace_example, "simulated_result", `${scope} blocked_trace_example`);
  requireString(record.blocked_trace_example, "blocker", `${scope} blocked_trace_example`);
  requireBoolean(record.blocked_trace_example, "human_intervention_required", `${scope} blocked_trace_example`);
}

function validateFailureTraces(record) {
  const scope = "failure-traces.v0.json";
  requireFixtureHeader(record, scope);
  requireArray(record, "traces", scope);

  const requiredTypes = new Set([
    "blocked_by_authority",
    "validation_failed",
    "human_review_required",
    "noncanonical_voter_rejected",
    "provider_dispatch_blocked",
  ]);

  for (const [index, trace] of record.traces.entries()) {
    const traceScope = `${scope} traces[${index}]`;
    if (!trace || typeof trace !== "object" || Array.isArray(trace)) {
      fail(`${traceScope}: trace must be an object`);
    }
    [
      "trace_id",
      "trace_type",
      "fixture_status",
      "simulated_condition",
      "simulated_reason",
      "expected_review_posture",
      "authority_note",
      "human_boundary_note",
      "source_design_ref",
    ].forEach((key) => requireString(trace, key, traceScope));
    requiredTypes.delete(trace.trace_type);
  }

  if (requiredTypes.size > 0) {
    fail(`${scope}: missing required trace types: ${[...requiredTypes].join(", ")}`);
  }
}

function validateGateEvidence(record) {
  const scope = "gate-evidence.v0.json";
  requireFixtureHeader(record, scope);
  requireArray(record, "evidence_records", scope);

  for (const [index, evidence] of record.evidence_records.entries()) {
    const evidenceScope = `${scope} evidence_records[${index}]`;
    if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
      fail(`${evidenceScope}: evidence record must be an object`);
    }
    [
      "evidence_id",
      "gate_id",
      "evidence_type",
      "source_ref",
      "status_claim",
      "limitations",
      "authority_note",
    ].forEach((key) => requireString(evidence, key, evidenceScope));
    if (!READINESS_GATE_IDS.has(evidence.gate_id)) {
      fail(`${evidenceScope}: gate_id "${evidence.gate_id}" is not part of the settled readiness gate model`);
    }
    const combinedText = `${evidence.status_claim} ${evidence.limitations} ${evidence.authority_note}`.toLowerCase();
    if (combinedText.includes("machine-enforced") || combinedText.includes("runtime enforcement")) {
      fail(`${evidenceScope}: evidence record must not claim machine or runtime enforcement`);
    }
  }
}

function main() {
  const checksPassed = [];
  const fixturePathsChecked = [];

  try {
    const motionDraft = readJson("motion-draft.v0.json");
    fixturePathsChecked.push(path.relative(REPO_ROOT, motionDraft.filePath).replace(/\\/g, "/"));
    validateMotionDraft(motionDraft.data);
    checksPassed.push("motion draft fixture shape OK");

    const voteTrace = readJson("vote-ratification-trace.v0.json");
    fixturePathsChecked.push(path.relative(REPO_ROOT, voteTrace.filePath).replace(/\\/g, "/"));
    validateVoteRatification(voteTrace.data);
    checksPassed.push("vote/ratification fixture shape OK");

    const failureTraces = readJson("failure-traces.v0.json");
    fixturePathsChecked.push(path.relative(REPO_ROOT, failureTraces.filePath).replace(/\\/g, "/"));
    validateFailureTraces(failureTraces.data);
    checksPassed.push("failure trace fixture shape OK");

    const gateEvidence = readJson("gate-evidence.v0.json");
    fixturePathsChecked.push(path.relative(REPO_ROOT, gateEvidence.filePath).replace(/\\/g, "/"));
    validateGateEvidence(gateEvidence.data);
    checksPassed.push("gate evidence fixture shape OK");

    console.log("mode: check");
    console.log("status: current");
    console.log(`fixture_root: ${path.relative(REPO_ROOT, FIXTURE_ROOT).replace(/\\/g, "/")}`);
    console.log(`fixture_paths_checked: ${fixturePathsChecked.join(", ")}`);
    console.log("checks_passed:");
    for (const check of checksPassed) {
      console.log(`- ${check}`);
    }
    process.exit(0);
  } catch (error) {
    console.log("mode: check");
    console.log("status: failed");
    console.log(`fixture_root: ${path.relative(REPO_ROOT, FIXTURE_ROOT).replace(/\\/g, "/")}`);
    if (fixturePathsChecked.length > 0) {
      console.log(`fixture_paths_checked: ${fixturePathsChecked.join(", ")}`);
    } else {
      console.log(`fixture_paths_checked: ${REQUIRED_FIXTURES.join(", ")}`);
    }
    console.log("errors:");
    console.log(`- ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
