#!/usr/bin/env node
/**
 * Motion Schema Validator (validate_motion gate)
 *
 * Validates motion.yaml shape/types so council-run can fail fast with a clean error.
 * This version uses the shared motion parsing library:
 *   portal/src/lib/motion/motionLib.mjs
 *
 * Usage:
 *   node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0003/motion.yaml
 *
 * Exit codes:
 *   0 = OK
 *   1 = Validation failed
 *   2 = Unexpected error
 */

import path from "node:path";
import process from "node:process";
import { loadMotionFromFile } from "../src/lib/motion/motionLib.mjs";

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

// ---- main -----------------------------------------------------------------

(function main() {
    const args = parseArgs(process.argv);
    if (!args.motion) die("Missing --motion <path>.");

    try {
        const m = loadMotionFromFile(args.motion);

        if (m.unknown_gates.length) {
            warn(`Unknown gate ids (allowed but check spelling): ${m.unknown_gates.join(", ")}`);
        }

        ok("motion schema OK");
        console.log(`   Motion: ${args.motion.replace(/\//g, path.sep)}`);
        console.log(`   Title: ${m.title ?? "(none)"}`);
        console.log(`   Target: domain=${m.target.domain ?? "(none)"} repo=${m.target.repo ?? "(none)"}`);

        if (args.verbose) {
            console.log("");
            console.log("Raw motion keys:");
            console.log(Object.keys(m.raw || {}).sort().join(", "));
        }

        process.exit(0);
    } catch (e) {
        // motionLib throws an Error with a nicely formatted schema error message
        // (or a parse error). We treat it as "unexpected" here, but still show it.
        console.error("💥 Unexpected error while validating motion schema");
        console.error(e?.stack || e?.message || String(e));
        process.exit(2);
    }
})();
