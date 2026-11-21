#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parseDocument } from "yaml";
import { HISTORICAL_TREE, verifyHistoricalMotions } from "./build-motion-snapshot.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const BASELINE = "2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8";
const SCHEMA = ".nexus/context/package-format-2.schema.json";
const AMENDMENT_ID = "amendment-01-q4m11y26-p2-scoping-and-format-2";
const AMENDMENT = ".nexus/amendments/corpus-v1/motion-0248/" + AMENDMENT_ID + ".yaml";
const HEX_SHA = /^[a-f0-9]{40}$/;
const PROGRAMS = ".nexus/programs/";
const LEDGER = ".nexus/ledger/";
const CONJECTURES = ".nexus/conjectures/";
const MOTIONS = ".nexus/motions/";

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

function git(root, ...args) {
  try {
    return execFileSync("git", ["--no-replace-objects", ...args], {
      cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0", GIT_NO_LAZY_FETCH: "1" },
    });
  } catch (error) {
    throw new Error("Git history or object check failed: git " + args.join(" ") + "\n" + (error.stderr || error.message));
  }
}

function splitPaths(output) {
  return output.split("\0").filter(Boolean);
}

function verifyHistory(root, suppliedBase) {
  const base = suppliedBase ?? git(root, "rev-parse", "--verify", "refs/remotes/origin/main^{commit}").trim();
  requireThat(HEX_SHA.test(base), "Comparison requires an exact Git base SHA");
  requireThat(git(root, "rev-parse", "--is-shallow-repository").trim() === "false", "Incomplete Git comparison history: shallow repository");
  git(root, "cat-file", "-e", base + "^{commit}");
  git(root, "merge-base", "--is-ancestor", BASELINE, base);
  git(root, "merge-base", "--is-ancestor", base, "HEAD");
  const historical = new Set();
  const headTrees = new Set(splitPaths(git(root, "ls-tree", "-z", "HEAD:.nexus/motions")));
  for (const row of splitPaths(git(root, "ls-tree", "-z", HISTORICAL_TREE))) {
    historical.add(row.split("\t")[1]);
    requireThat(headTrees.has(row), "Historical Motion tree differs from the accepted baseline: " + row);
  }
  const immutable = name => {
    if (name.startsWith(MOTIONS)) return historical.has(name.split("/")[2]);
    return name.startsWith(LEDGER) || name.startsWith(".nexus/amendments/") ||
      (name.startsWith(PROGRAMS) && /\/lanes\/[^/]+\/(?:contract|estimate)\.yaml$/.test(name));
  };
  function compare(...revisions) {
    const names = splitPaths(git(root, "diff", "--no-ext-diff", "--no-renames", "--diff-filter=CDMRTUXB",
      "--name-only", "-z", ...revisions, "--", MOTIONS, LEDGER, PROGRAMS, ".nexus/amendments/"));
    for (const name of names) requireThat(!immutable(name), "Immutable historical record changed: " + name);
  }
  // Inspect each edge so a later revert cannot mask a committed overwrite.
  const history = git(root, "rev-list", "--parents", base + "..HEAD").trim();
  for (const row of history.split("\n").filter(Boolean)) {
    const [commit, ...parents] = row.split(" ");
    requireThat(parents.length, "Incomplete comparison ancestry at " + commit);
    for (const parent of parents) compare(parent, commit);
  }
  compare("--cached", "HEAD");
  compare("HEAD");
  return base;
}

function readRecord(root, name) {
  const raw = fs.readFileSync(path.join(root, name), "utf8");
  if (name.endsWith(".json")) JSON.parse(raw);
  const doc = parseDocument(raw, { schema: "core", uniqueKeys: true, stringKeys: true });
  requireThat(!doc.errors.length && !doc.warnings.length, name + ": " + [...doc.errors, ...doc.warnings].join(", "));
  return doc.toJS({ maxAliasCount: 0 });
}

function filesIn(root, dir) {
  if (!fs.existsSync(path.join(root, dir))) return [];
  const info = fs.lstatSync(path.join(root, dir));
  requireThat(info.isDirectory(), "Expected canonical directory: " + dir);
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).sort((a, b) => compareText(a.name, b.name)).flatMap(entry => {
    const name = dir + "/" + entry.name;
    if (entry.isDirectory()) return filesIn(root, name);
    requireThat(entry.isFile(), "Unexpected link or special file: " + name);
    return [name];
  });
}

function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function discover(root, historical) {
  requireThat(fs.lstatSync(path.join(root, ".nexus")).isDirectory(), "Invalid .nexus root");
  const legacy = new Set(splitPaths(git(root, "ls-tree", "-r", "-z", "--name-only", BASELINE, "--", PROGRAMS)));
  const names = [".nexus/corpus.yaml", ...filesIn(root, ".nexus/amendments"),
    ...filesIn(root, ".nexus/programs").filter(name => !legacy.has(name)),
    ...filesIn(root, ".nexus/ledger"), ...filesIn(root, ".nexus/conjectures")];
  requireThat(names.includes(AMENDMENT), "Missing external scoping amendment: " + AMENDMENT);
  for (const entry of fs.readdirSync(path.join(root, MOTIONS), { withFileTypes: true })) {
    if (historical.has(entry.name)) continue;
    requireThat(entry.isDirectory() && /^motion-\d{4}$/.test(entry.name) && Number(entry.name.slice(7)) > 248,
      "Unexpected Motion coordinate: " + entry.name);
    names.push(MOTIONS + entry.name + "/motion.yaml");
  }
  requireThat(!filesIn(root, ".nexus/pulses").length, "Pulse namespace is dormant");
  // Historical layouts stay readable. A new-format record cannot obtain an
  // exemption by declaring itself inside an old package or a context folder.
  const known = new Set([...names, SCHEMA]);
  const candidates = new Set([
    ...splitPaths(git(root, "diff", "--diff-filter=ACMRT", "--name-only", "-z", BASELINE, "--", ".nexus")),
    ...splitPaths(git(root, "ls-files", "--others", "--exclude-standard", "-z", "--", ".nexus")),
  ]);
  for (const name of candidates) {
    if (known.has(name) || !/\.(ya?ml|json)$/i.test(name)) continue;
    requireThat(fs.lstatSync(path.join(root, name)).isFile(), "Invalid record path: " + name);
    const raw = fs.readFileSync(path.join(root, name), "utf8");
    if (!raw.includes("package_format") && !raw.includes("document_kind")) continue;
    const record = readRecord(root, name);
    requireThat(record?.package_format !== 2 && !record?.document_kind, "Misplaced Package Format 2 document: " + name);
  }
  return names.sort(compareText);
}

function programKey(doc) {
  return [doc.corpus_id, doc.motion_id, doc.program_code].join("/");
}

function laneKey(doc, lane = doc.lane_coordinate) {
  return programKey(doc) + "/" + lane;
}

function programDir(doc) {
  return PROGRAMS + [doc.corpus_id, doc.motion_id, doc.program_slug].join("/");
}

function contractPath(doc) {
  return programDir(doc) + "/lanes/" + doc.lane_coordinate + "/contract.yaml";
}

function canonicalPath(doc) {
  switch (doc.document_kind) {
    case "corpus": return ".nexus/corpus.yaml";
    case "motion": return MOTIONS + doc.motion_id + "/motion.yaml";
    case "amendment": return ".nexus/amendments/" + [doc.corpus_id, doc.motion_id, doc.amendment_id].join("/") + ".yaml";
    case "program": return programDir(doc) + "/program.yaml";
    case "batches": return programDir(doc) + "/batches.yaml";
    case "lane_contract": return contractPath(doc);
    case "lane_estimate": return programDir(doc) + "/lanes/" + doc.lane_coordinate + "/estimate.yaml";
    case "conjecture": return CONJECTURES + doc.conjecture_id + ".yaml";
    case "ledger_event": {
      const utc = doc.timestamp.replace(/[-:.]/g, "");
      return LEDGER + [doc.corpus_id, doc.motion_id, doc.program_slug, doc.lane_coordinate, doc.writer_role,
        utc + "-" + doc.event_id + ".json"].join("/");
    }
    default: throw new Error("Unknown document kind");
  }
}

// The writer must validate every identity before using it as a Git path.
const ledgerSchema = JSON.parse(fs.readFileSync(path.join(ROOT, SCHEMA), "utf8"));
const ledgerAjv = new Ajv2020({ strict: true, ownProperties: true });
addFormats(ledgerAjv);
ledgerAjv.addSchema(ledgerSchema);
const checkLedgerEvent = ledgerAjv.getSchema(ledgerSchema.$id + "#/$defs/ledger_event");

export function ledgerEventPath(event) {
  requireThat(checkLedgerEvent(event), "Invalid ledger event: " + ledgerAjv.errorsText(checkLedgerEvent.errors));
  return canonicalPath(event);
}

function unique(map, key, value) {
  requireThat(!map.has(key), "Duplicate canonical identity: " + key);
  map.set(key, value);
}

function checkDag(contracts) {
  const done = new Set();
  const visiting = new Set();
  function visit(key) {
    if (done.has(key)) return;
    requireThat(!visiting.has(key), "Dependency DAG cycle: " + key);
    const lane = contracts.get(key);
    requireThat(lane, "Missing dependency: " + key);
    visiting.add(key);
    for (const dependency of lane.depends_on) visit(laneKey(lane, dependency));
    visiting.delete(key);
    done.add(key);
  }
  for (const key of contracts.keys()) visit(key);
}

function bindSource(root, source) {
  requireThat(!source.path.toLowerCase().startsWith(CONJECTURES), "Chamber A cannot supply authoritative evidence: " + source.path);
  git(root, "merge-base", "--is-ancestor", source.source_commit, "HEAD");
  const entry = git(root, "ls-tree", "-z", source.source_commit, "--", source.path);
  requireThat(["100644", "100755"].some(mode => entry === mode + " blob " + source.source_blob + "\t" + source.path + "\0"),
    "Unbound source blob: " + source.path);
  git(root, "cat-file", "-e", source.source_blob + "^{blob}");
}

// RFC 8785 ordering for the schema's finite JSON scalar/array/object domain.
export function canonicalJson(value) {
  if (Array.isArray(value)) return "[" + Array.from(value, canonicalJson).join(",") + "]";
  if (value && typeof value === "object") {
    requireThat([Object.prototype, null].includes(Object.getPrototypeOf(value)), "Expected plain JSON object");
    return "{" + Object.keys(value).sort().map(key => canonicalJson(key) + ":" + canonicalJson(value[key])).join(",") + "}";
  }
  requireThat(value === null || typeof value === "boolean" || Number.isFinite(value) ||
    (typeof value === "string" && value.isWellFormed()), "Invalid JCS scalar");
  return JSON.stringify(value);
}

export function receiptHash(event) {
  return createHash("sha256").update("JAI-RECEIPT-v1\0").update(canonicalJson(event)).digest("hex");
}

// Actor strings label observations. Authentication and human acceptance are external.
export function parseSessionId(id) {
  const parts = typeof id === "string" ? id.split("::") : [];
  const [prefix, plane, role, model, effort, instance] = parts;
  const token = /^[A-Z0-9]+(?:[._-][A-Z0-9]+)*$/;
  requireThat(prefix === "JAI" && [3, 6].includes(parts.length) &&
    /^[A-Z][A-Z0-9_]*$/.test(plane) && /^[A-Z][A-Z0-9_]*$/.test(role), "Invalid positional JAI seat");
  const seat = parts.slice(0, 3).join("::");
  if (parts.length === 3) return { seat, session: false, declared: false };
  requireThat(token.test(model) && token.test(effort) && /^\d{4}-\d{2}-\d{2}(?:\.\d{2})?$/.test(instance),
    "Invalid positional JAI session");
  const date = instance.slice(0, 10);
  const time = Date.parse(date + "T00:00:00Z");
  requireThat(Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date, "Invalid session date");
  return { seat, session: true, declared: !parts.includes("UNDECLARED") };
}

const writerSeats = new Map([
  ["builder", "JAI::DEV::BUILDER"],
  ["verifier", "JAI::DEV::VERIFIER"],
]);

export function assertWriterIdentity(event) {
  if (event.writer_role === "control-thread") {
    requireThat(event.actor_id === event.principal_id && !event.actor_id.startsWith("JAI::"),
      "Expected exact human principal attribution");
    return;
  }
  requireThat(!event.receipt_class.startsWith("B9-CLASS-007"), "Human control principal required");
  const actor = parseSessionId(event.actor_id);
  requireThat(actor.session && actor.seat === writerSeats.get(event.writer_role), "Invalid writer seat: " + event.actor_id);
}

// Classify the session's model field independently of the contract principal's name.
function modelFamily(actorId) {
  const model = actorId.split("::")[3];
  if (/^(?:OPENAI|GPT|CHATGPT|CODEX|ASTRA|O[134])(?:[._-]|$)/.test(model)) return "OpenAI";
  if (/^(?:ANTHROPIC|CLAUDE|OPUS|SONNET|HAIKU|FABLE)(?:[._-]|$)/.test(model)) return "Anthropic";
  if (/^(?:GOOGLE|GEMINI)(?:[._-]|$)/.test(model)) return "Google";
  return undefined;
}

function checkEvents(root, events, contracts) {
  const builderFamilies = new Map();
  for (const event of events) {
    if (event.writer_role !== "builder") continue;
    const family = modelFamily(event.actor_id);
    const key = laneKey(event);
    if (!builderFamilies.has(key)) builderFamilies.set(key, new Set());
    builderFamilies.get(key).add(family);
  }
  const previous = new Map();
  const ids = new Map();
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  // Canonical path order is (lane, writer, UTC, ULID). Each writer appends
  // to its namespace inside the single ledger. The lane contract pins its principal.
  for (const event of events) {
    const file = canonicalPath(event);
    unique(ids, event.event_id, file);
    const time = [...event.event_id.slice(0, 10)].reduce((n, char) => n * 32 + alphabet.indexOf(char), 0);
    requireThat(new Date(time).toISOString() === event.timestamp, "ULID timestamp mismatch: " + file);
    const lane = contracts.get(laneKey(event));
    requireThat(lane && Object.hasOwn(lane.writers, event.writer_role) && lane.writers[event.writer_role] === event.principal_id,
      "Unbound writer principal: " + file);
    requireThat(event.writer_role === "control-thread" || event.actor_id !== lane.writers["control-thread"],
      "Agent actor cannot equal the frozen control-thread principal: " + file);
    assertWriterIdentity(event);
    if (event.receipt_class.startsWith("B9-CLASS-006")) {
      requireThat(event.writer_role === "verifier" && Object.hasOwn(lane.writers, "builder") &&
        lane.writers.builder !== event.principal_id, "Independent verifier required: " + file);
      const builders = builderFamilies.get(laneKey(event));
      const verifier = modelFamily(event.actor_id);
      requireThat(verifier && builders?.size && !builders.has(undefined),
        "Recognized builder and verifier model families required: " + file);
      requireThat(!builders.has(verifier), "Verifier shares builder model family: " + file);
    }
    bindSource(root, event.contract_source);
    requireThat(event.contract_source.path === contractPath(lane) &&
      git(root, "hash-object", "--", contractPath(lane)).trim() === event.contract_source.source_blob,
      "Event contract source mismatch: " + file);
    const stream = path.posix.dirname(file);
    requireThat(event.prev_ledger_entry_hash === (previous.get(stream) ?? null), "Broken ledger predecessor: " + file);
    previous.set(stream, receiptHash(event));
  }
}

function checkScoping(root, doc, sequence) {
  requireThat(doc.governing_motion === doc.corpus_id + "/" + doc.motion_id &&
    doc.parent.path === MOTIONS + doc.motion_id, "Inconsistent governing Motion");
  git(root, "merge-base", "--is-ancestor", doc.parent.source_commit, "HEAD");
  requireThat(git(root, "rev-parse", doc.parent.source_commit + ":" + doc.parent.path).trim() === doc.parent.source_tree &&
    git(root, "cat-file", "-t", doc.parent.source_tree).trim() === "tree", "Unbound amendment parent tree");
  requireThat(JSON.stringify(doc.program_sequence) === JSON.stringify(sequence), "Amendment changed parent Program order");
  if (canonicalPath(doc) === AMENDMENT) requireThat(
    doc.decision_id === "CT-DECISION-2026-11-19-RATIFY-PACKAGE-FORMAT-2-AND-M1-EXTERNAL-TOPOLOGY-v0" &&
    doc.parent.source_commit === BASELINE && doc.principal_id === "Jerry Ingram" &&
    doc.program_code === "Q4M11Y26-P2" && doc.legacy_alias === "Q3M7Y26-P2", "Unknown scoping decision or Program crosswalk");
}

export async function validate(root = ROOT, base) {
  const comparison = verifyHistory(root, base);
  const historical = await verifyHistoricalMotions(root);
  const ajv = new Ajv2020({ strict: true, ownProperties: true });
  addFormats(ajv);
  const schema = readRecord(root, SCHEMA);
  const kinds = ["corpus", "motion", "amendment", "program", "batches", "lane_contract", "lane_estimate", "ledger_event", "conjecture"];
  requireThat(schema.$id === "urn:jai-nexus:package-format:2:v0" && schema.oneOf?.length === kinds.length &&
    kinds.every(kind => schema.oneOf.some(branch => branch.$ref === "#/$defs/" + kind) &&
      schema.$defs?.[kind]?.additionalProperties === false && schema.$defs[kind].properties?.document_kind?.const === kind),
    "Invalid Package Format 2 schema envelope or discriminator");
  const check = ajv.compile(schema);
  const docs = [];
  for (const name of discover(root, historical)) {
    requireThat(fs.lstatSync(path.join(root, name)).isFile(), "Invalid canonical file: " + name);
    requireThat(/\.(yaml|json)$/.test(name), "Unknown canonical document: " + name);
    const doc = readRecord(root, name);
    if (!check(doc)) {
      const branch = ajv.getSchema(schema.$id + "#/$defs/" + doc?.document_kind);
      if (branch) branch(doc);
      throw new Error(name + ": " + ajv.errorsText(branch?.errors ?? check.errors, { separator: "\n" }));
    }
    requireThat(canonicalPath(doc) === name, "Document identity/path mismatch: " + name);
    docs.push(doc);
  }
  const programs = new Map(), contracts = new Map(), ordinals = new Map(), amendments = new Map();
  const sequences = new Map();
  for (const doc of docs) {
    if (doc.motion_id && !sequences.has(doc.motion_id)) {
      const motion = readRecord(root, MOTIONS + doc.motion_id + "/motion.yaml");
      sequences.set(doc.motion_id, motion.program_sequence?.map(p => typeof p === "string" ? p : p.program_id));
    }
    if (doc.program_code) {
      const ordinal = Number(doc.program_code.split("-P")[1]);
      requireThat(sequences.get(doc.motion_id)?.[ordinal - 1] === doc.program_id, "Unknown Program identity: " + programKey(doc));
    }
    if (doc.document_kind === "amendment") {
      checkScoping(root, doc, sequences.get(doc.motion_id));
      unique(amendments, doc.motion_id + "/" + doc.program_id, doc);
    }
    if (doc.document_kind === "program") {
      unique(programs, programKey(doc), doc);
      unique(ordinals, doc.motion_id + "/" + doc.program_code.split("-P")[1], doc);
    }
    if (doc.document_kind === "lane_contract") unique(contracts, laneKey(doc), doc);
    for (const source of doc.evidence ?? []) bindSource(root, source);
  }
  requireThat([...programs.values()].filter(p => p.status === "OPEN").length <= 1, "More than one active Program");
  for (const doc of docs) {
    if (doc.document_kind === "corpus") {
      for (const source of doc.sources) {
        const file = path.join(root, source);
        const canon = fs.realpathSync(path.join(root, ".nexus/canon")) + path.sep;
        requireThat(source.startsWith(".nexus/canon/") && fs.realpathSync(file).startsWith(canon) && fs.lstatSync(file).isFile(),
          "Corpus source outside the constitutional canon: " + source);
      }
    }
    if (!doc.program_code || doc.document_kind === "amendment") continue;
    const program = programs.get(programKey(doc));
    requireThat(program?.program_slug === doc.program_slug && program.program_id === doc.program_id, "Unbound Program: " + programKey(doc));
    const scope = amendments.get(doc.motion_id + "/" + doc.program_id);
    if (scope) requireThat(scope.program_code === doc.program_code && scope.program_slug === doc.program_slug, "Program crosswalk mismatch");
    if (scope && doc.document_kind === "lane_contract") {
      const plan = scope.topology;
      requireThat([...plan.batch_a, ...plan.batch_b, ...plan.batch_c].includes(doc.lane_coordinate), "Lane outside amended topology");
      if (plan.batch_c.includes(doc.lane_coordinate)) {
        const required = [...plan.batch_c_external_technical_dependencies, ...plan.batch_c_internal_dependencies[doc.lane_coordinate]];
        requireThat(required.length === doc.depends_on.length && required.every(dep => doc.depends_on.includes(dep)),
          "Batch C technical dependencies differ from the amended scope");
      }
    }
    if (doc.lane_coordinate) requireThat(contracts.has(laneKey(doc)), "Missing lane contract: " + laneKey(doc));
    if (doc.document_kind === "batches") {
      const lanes = new Set();
      const batches = new Map();
      for (const batch of doc.batches) {
        unique(batches, batch.batch_id, batch);
        for (const lane of batch.lanes) {
          requireThat(lane.replace(/\d+$/, "") === batch.batch_id && !lanes.has(lane) && contracts.has(laneKey(doc, lane)),
            "Unbound or duplicate batch lane: " + lane);
          lanes.add(lane);
        }
      }
    }
  }
  checkDag(contracts);
  checkEvents(root, docs.filter(doc => doc.document_kind === "ledger_event"), contracts);
  return { comparison, documents: docs.length, historical: historical.size };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    requireThat(!args.length || (args.length === 2 && args[0] === "--base-sha" && HEX_SHA.test(args[1])), "Usage: validate-package-format-2.mjs [--base-sha <40-hex-sha>]");
    const result = await validate(ROOT, args[1]);
    console.log("Package Format 2 PASS", JSON.stringify(result), "ZERO_GATES_GRANTED");
  } catch (error) {
    console.error("[validate-package-format-2] FAILED:", error.message);
    process.exitCode = 1;
  }
}
