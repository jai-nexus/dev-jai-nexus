#!/usr/bin/env node
/**
 * grid-ingest-bundle.mjs (motion-0132)
 *
 * Parses a bundle.txt produced by MotionDraftModal (GridView.tsx, motion-0131),
 * validates structure and schema before any write, then materializes the four
 * motion package files under .nexus/motions/<motion-id>/.
 *
 * Usage:
 *   node portal/scripts/grid-ingest-bundle.mjs --bundle <path>
 *   node portal/scripts/grid-ingest-bundle.mjs --stdin
 *   cat bundle.txt | node portal/scripts/grid-ingest-bundle.mjs --stdin
 *   node portal/scripts/grid-ingest-bundle.mjs --bundle <path> --force
 *   node portal/scripts/grid-ingest-bundle.mjs --bundle <path> --dry-run
 *
 * Exit codes:
 *   0 = success (4 files written, validate-motion passed)
 *   1 = validation failure or conflict (no files written)
 *   2 = unexpected error
 *
 * Design invariants:
 *   - All validation runs before the first fs.mkdirSync() call.
 *   - Exactly four files are written on success; no vote/policy/decision artifacts.
 *   - No commit, no PR, no further mutation beyond .nexus/motions/<id>/ scaffold.
 *   - validate-motion is spawned post-write as a confirmation gate.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { parseMotionText } from "../src/lib/motion/motionLib.mjs";

// ── Constants ─────────────────────────────────────────────────────────────────

const MOTION_ID_PATTERN = /^motion-\d{4}$/;
const PLACEHOLDER = "motion-XXXX";
const REQUIRED_SECTIONS = ["motion.yaml", "proposal.md", "execution.md", "challenge.md"];

// Matches lines like: === motion.yaml ===
const SECTION_DELIMITER = /^=== ([\w.-]+) ===/m;

// ── CLI args ──────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    bundle: null,
    stdin: false,
    force: false,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--bundle" && argv[i + 1]) { args.bundle = argv[++i]; continue; }
    if (a === "--stdin")    { args.stdin = true;   continue; }
    if (a === "--force")    { args.force = true;   continue; }
    if (a === "--dry-run")  { args.dryRun = true;  continue; }
    if (a === "--help" || a === "-h") { printUsage(); process.exit(0); }
  }
  return args;
}

function printUsage() {
  console.log([
    "",
    "  grid-ingest-bundle — parse and materialize a MotionDraftModal bundle",
    "",
    "  Usage:",
    "    node portal/scripts/grid-ingest-bundle.mjs --bundle <path>",
    "    node portal/scripts/grid-ingest-bundle.mjs --stdin",
    "    cat bundle.txt | node portal/scripts/grid-ingest-bundle.mjs --stdin",
    "",
    "  Options:",
    "    --bundle <path>   Read bundle from a file",
    "    --stdin           Read bundle from stdin",
    "    --force           Overwrite existing target directory",
    "    --dry-run         Validate and print what would be written; no writes",
    "    --help            Show this message",
    "",
  ].join("\n"));
}

// ── Output helpers ────────────────────────────────────────────────────────────

function die(msg) {
  console.error("\n❌ " + msg + "\n");
  process.exit(1);
}

function ok(msg)   { console.log("✅ " + msg); }
function info(msg) { console.log("   " + msg); }
function warn(msg) { console.warn("⚠️  " + msg); }

// ── Bundle reader ─────────────────────────────────────────────────────────────

function readBundle(args) {
  if (args.bundle) {
    const abs = path.resolve(process.cwd(), args.bundle);
    if (!fs.existsSync(abs)) die(`Bundle file not found: ${abs}`);
    try {
      return fs.readFileSync(abs, "utf8");
    } catch (e) {
      die(`Cannot read bundle file: ${e.message}`);
    }
  }

  if (args.stdin) {
    try {
      return fs.readFileSync("/dev/stdin", "utf8");
    } catch {
      // fallback for Windows
      try {
        const buf = fs.readFileSync(0, "utf8"); // fd 0 = stdin
        return buf;
      } catch (e) {
        die(`Cannot read from stdin: ${e.message}`);
      }
    }
  }

  // shouldn't reach here — caller checks
  die("No input source specified. Use --bundle <path> or --stdin.");
}

// ── Bundle parser ─────────────────────────────────────────────────────────────

/**
 * Splits bundle text on "=== <filename> ===" delimiters.
 * Returns a Map<string, string> of section name → content.
 */
function parseBundle(bundleText) {
  const lines = bundleText.split(/\r?\n/);
  const sections = new Map();
  let currentName = null;
  const currentLines = [];

  function flushSection() {
    if (currentName !== null) {
      sections.set(currentName, currentLines.join("\n").trim());
    }
  }

  for (const line of lines) {
    const m = line.match(/^=== ([\w.-]+) ===\s*$/);
    if (m) {
      flushSection();
      currentName = m[1];
      currentLines.length = 0;
    } else if (currentName !== null) {
      currentLines.push(line);
    }
  }
  flushSection();

  return sections;
}

// ── Motion ID extractor ───────────────────────────────────────────────────────

/**
 * Extracts the motion_id value from motion.yaml text.
 * Returns null if not found.
 */
function extractMotionId(motionYamlText) {
  const m = motionYamlText.match(/^motion_id:\s*([^\s#]+)/m);
  return m ? m[1].trim() : null;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateBundle(sections, bundleText) {
  // 1. At least one delimiter found
  if (sections.size === 0) {
    die(
      'Bundle does not contain "=== <filename> ===" section delimiters.\n' +
      '   Use the bundle.txt tab in MotionDraftModal and copy the full content.',
    );
  }

  // 2. All required sections present
  const missing = REQUIRED_SECTIONS.filter((s) => !sections.has(s));
  if (missing.length > 0) {
    die(`Missing required sections: ${missing.join(", ")}`);
  }

  // 3. No section is empty
  for (const name of REQUIRED_SECTIONS) {
    if (!sections.get(name)) {
      die(`Section "${name}" is empty.`);
    }
  }

  // 4. No motion-XXXX placeholder remains in any section
  for (const name of REQUIRED_SECTIONS) {
    if (sections.get(name).includes(PLACEHOLDER)) {
      die(
        `"${PLACEHOLDER}" placeholder found in section "${name}".\n` +
        `   Enter a real motion ID in MotionDraftModal before copying the bundle.`,
      );
    }
  }

  // 5. Extract and validate motion ID
  const motionId = extractMotionId(sections.get("motion.yaml"));
  if (!motionId) {
    die('Could not find "motion_id:" field in motion.yaml section.');
  }
  if (!MOTION_ID_PATTERN.test(motionId)) {
    die(
      `Invalid motion ID format: "${motionId}"\n` +
      `   Expected: motion-NNNN (4 digits, e.g. motion-0132)`,
    );
  }

  // 6. motion.yaml passes parseMotionText schema
  try {
    parseMotionText(sections.get("motion.yaml"));
  } catch (e) {
    die(`motion.yaml schema validation failed:\n   ${e.message}`);
  }

  return motionId;
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async function main() {
  const args = parseArgs(process.argv);

  if (!args.bundle && !args.stdin) {
    printUsage();
    die("Specify --bundle <path> or --stdin.");
  }

  // ── Read ──
  const bundleText = readBundle(args);

  // ── Parse ──
  const sections = parseBundle(bundleText);

  // ── Validate (all checks before first write) ──
  const motionId = validateBundle(sections, bundleText);
  const targetDir = path.resolve(process.cwd(), `.nexus/motions/${motionId}`);

  // ── Conflict check ──
  if (fs.existsSync(targetDir)) {
    if (!args.force) {
      die(
        `Target directory already exists: ${targetDir}\n` +
        `   Use --force to overwrite.`,
      );
    }
    warn(`Overwriting existing directory: ${targetDir}`);
  }

  // ── Dry-run exit ──
  if (args.dryRun) {
    console.log("\n── Dry run: no files written ──\n");
    console.log(`Motion ID:    ${motionId}`);
    console.log(`Target dir:   ${targetDir}`);
    console.log(`Sections:     ${[...sections.keys()].join(", ")}`);
    console.log("\nAll validation checks passed. Remove --dry-run to write.\n");
    process.exit(0);
  }

  // ── Write ──
  fs.mkdirSync(targetDir, { recursive: true });

  for (const filename of REQUIRED_SECTIONS) {
    const dest = path.join(targetDir, filename);
    fs.writeFileSync(dest, sections.get(filename) + "\n", "utf8");
    info(`Written: ${dest.replace(process.cwd() + path.sep, "")}`);
  }

  // ── Post-write: validate-motion ──
  console.log("");
  const validatorPath = path.resolve(
    process.cwd(),
    "portal/scripts/validate-motion.mjs",
  );
  const motionYamlPath = path.join(targetDir, "motion.yaml");
  const vResult = spawnSync(
    process.execPath,
    [validatorPath, "--motion", motionYamlPath],
    { encoding: "utf8", cwd: process.cwd() },
  );

  if (vResult.stdout) process.stdout.write(vResult.stdout);
  if (vResult.stderr) process.stderr.write(vResult.stderr);

  if (vResult.status !== 0) {
    warn("validate-motion exited non-zero — review motion.yaml before running council:run.");
  }

  // ── Done ──
  console.log("");
  ok(`${motionId} package materialized at .nexus/motions/${motionId}/`);
  console.log("");
  info(`Next steps:`);
  info(`  git diff .nexus/motions/${motionId}/`);
  info(`  git add .nexus/motions/${motionId}/`);
  info(`  git commit -m "feat(governance): open ${motionId} — <title>"`);
  info(`  pnpm council:run ${motionId}`);
  console.log("");

  process.exit(vResult.status === 0 ? 0 : 1);
})();
