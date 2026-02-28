#!/usr/bin/env node
/**
 * Motion Schema Validator (validate_motion gate)
 *
 * Validates motion.yaml shape/types so council-run can fail fast with a clean error.
 *
 * Usage:
 *   node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0003/motion.yaml
 *
 * Exit codes:
 *   0 = OK
 *   1 = Validation failed
 *   2 = Unexpected error
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";
import { z } from "zod";

const require = createRequire(import.meta.url);
const YAML = require("yaml");

// ---- args -----------------------------------------------------------------

function parseArgs(argv) {
    const args = { motion: null, verbose: false };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--motion" && argv[i + 1]) {
            args.motion = argv[++i];
            continue;
        }
        if (a === "--verbose") {
            args.verbose = true;
            continue;
        }
    }
    return args;
}

// ---- helpers --------------------------------------------------------------

function die(msg) {
    console.error("❌ " + msg);
    process.exit(1);
}
function ok(msg) {
    console.log("✅ " + msg);
}
function warn(msg) {
    console.log("⚠️  " + msg);
}

function isNonEmptyString(x) {
    return typeof x === "string" && x.trim().length > 0;
}

function coerceBooleanLike(v) {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "string") {
        const s = v.trim().toLowerCase().replace(/^"|"$/g, "");
        if (s === "true" || s === "1") return true;
        if (s === "false" || s === "0") return false;
    }
    return null;
}

const MotionSchema = z
    .object({
        title: z.string().min(1).optional(),

        target: z
            .object({
                domain: z.string().min(1).optional(),
                repo: z.string().min(1).optional(),
            })
            .optional(),

        // legacy support (optional)
        domain: z.string().min(1).optional(),
        repo: z.string().min(1).optional(),

        auto_ratify: z
            .object({
                enabled: z.any().optional(),
            })
            .optional(),

        max_risk_score: z.number().finite().optional(),

        checks_required: z.array(z.string().min(1)).optional(),
        checks_optional: z.array(z.string().min(1)).optional(),
    })
    .passthrough();

const KNOWN_GATES = new Set([
    "validate_motion",
    "validate_agency",
    "dct_replay_check",
    "execution_patch_exists",
    "patch_apply_check",
    "typecheck",
]);

// ---- main -----------------------------------------------------------------

(function main() {
    const args = parseArgs(process.argv);
    if (!args.motion) die("Missing --motion <path>.");

    try {
        const motionPath = path.resolve(process.cwd(), args.motion);
        if (!fs.existsSync(motionPath)) die(`Missing motion file: ${motionPath}`);

        const raw = fs.readFileSync(motionPath, "utf8");
        if (!raw.trim()) die(`Motion file is empty: ${motionPath}`);

        const parsed = YAML.parse(raw);
        if (!parsed || typeof parsed !== "object") {
            die(`Motion root must be a YAML mapping/object: ${motionPath}`);
        }

        const result = MotionSchema.safeParse(parsed);
        if (!result.success) {
            console.error(result.error.format());
            die("motion.yaml schema validation failed.");
        }

        const m = result.data;

        // normalize auto_ratify.enabled
        if (m.auto_ratify && "enabled" in m.auto_ratify) {
            const b = coerceBooleanLike(m.auto_ratify.enabled);
            if (b === null) die("auto_ratify.enabled must be boolean-like (true/false/1/0).");
        }

        // warn unknown gates
        const req = Array.isArray(m.checks_required) ? m.checks_required : [];
        const opt = Array.isArray(m.checks_optional) ? m.checks_optional : [];
        const unknown = [...req, ...opt].filter((g) => !KNOWN_GATES.has(g));
        if (unknown.length) warn(`Unknown gate ids (allowed but check spelling): ${unknown.join(", ")}`);

        const tDomain = m.target?.domain ?? m.domain ?? null;
        const tRepo = m.target?.repo ?? m.repo ?? null;

        ok("motion schema OK");
        console.log(`   Motion: ${path.relative(process.cwd(), motionPath)}`);
        console.log(`   Title: ${m.title ?? "(none)"}`);
        console.log(`   Target: domain=${tDomain ?? "(none)"} repo=${tRepo ?? "(none)"}`);

        if (args.verbose) {
            console.log("");
            console.log("Raw (parsed) motion keys:");
            console.log(Object.keys(m).sort().join(", "));
        }

        process.exit(0);
    } catch (e) {
        console.error("💥 Unexpected error while validating motion schema");
        console.error(e?.stack || e?.message || String(e));
        process.exit(2);
    }
})();
