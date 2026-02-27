// portal/scripts/validate-agency.mjs
//
// Registry-backed agency validator (Council Pivot).
//
// Validates that nexus-core registry indexes define required Council seats:
// - Tier 0: global seats (steward/challenger/arbiter/meta_analyst/librarian)
// - Tier 1: domain seats for dev.jai.nexus (proposer/executor/challenger/arbiter)
// - Tier 2: repo seats for dev-jai-nexus (proposer/executor/challenger/arbiter)
//
// Optional: validates local agency config (NOT agent identities), e.g. council_dir/motion_dir.
//
// Usage:
//   node portal/scripts/validate-agency.mjs
//   node portal/scripts/validate-agency.mjs --index ../../workspace/jai-nexus/nexus-core/registry/agents.index.json
//   node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
//
// Exit codes:
//   0 = OK
//   1 = Validation failed
//   2 = Unexpected error

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// ---- args -----------------------------------------------------------------

function parseArgs(argv) {
    const args = {
        index: null, // optional explicit path to agents.index.json
        domain: "dev.jai.nexus",
        repo: "dev-jai-nexus",
        verbose: false,
    };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--index" && argv[i + 1]) {
            args.index = argv[++i];
            continue;
        }
        if (a === "--domain" && argv[i + 1]) {
            args.domain = argv[++i];
            continue;
        }
        if (a === "--repo" && argv[i + 1]) {
            args.repo = argv[++i];
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

function warn(msg) {
    console.log("⚠️  " + msg);
}

function ok(msg) {
    console.log("✅ " + msg);
}

function isNonEmptyString(x) {
    return typeof x === "string" && x.trim().length > 0;
}

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    try {
        return JSON.parse(raw);
    } catch (e) {
        throw new Error(`Failed to parse JSON at ${filePath}: ${e?.message || e}`);
    }
}

function fileExists(p) {
    try {
        fs.accessSync(p, fs.constants.R_OK);
        return true;
    } catch {
        return false;
    }
}

// Try a handful of likely locations for nexus-core registry indexes.
// We deliberately keep this simple and deterministic.
function findAgentsIndex(explicitPath) {
    if (explicitPath) {
        const abs = path.resolve(process.cwd(), explicitPath);
        if (!fileExists(abs)) {
            die(`Missing agents.index.json at --index path: ${abs}`);
        }
        return abs;
    }

    const candidates = [
        // when run from dev-jai-nexus repo root
        path.resolve(process.cwd(), "workspace/jai-nexus/nexus-core/registry/agents.index.json"),
        // when run from dev-jai-nexus/portal
        path.resolve(process.cwd(), "../workspace/jai-nexus/nexus-core/registry/agents.index.json"),
        // when run from portal/scripts directly
        path.resolve(process.cwd(), "../../workspace/jai-nexus/nexus-core/registry/agents.index.json"),
        // in case you mirror nexus-core differently
        path.resolve(process.cwd(), "workspace/nexus-core/registry/agents.index.json"),
        path.resolve(process.cwd(), "../workspace/nexus-core/registry/agents.index.json"),
    ];

    for (const c of candidates) {
        if (fileExists(c)) return c;
    }

    die(
        "Could not locate nexus-core registry agents.index.json. " +
        "Pass --index <path> explicitly, or ensure workspace/jai-nexus/nexus-core/registry/agents.index.json exists."
    );
}

function assertHas(obj, key, where) {
    if (!obj || typeof obj !== "object" || !(key in obj)) {
        die(`${where} missing required key '${key}'.`);
    }
}

function assertSeat(seatsObj, seat, where) {
    if (!seatsObj || typeof seatsObj !== "object") {
        die(`${where} is missing or not an object.`);
    }
    const v = seatsObj[seat];
    if (!isNonEmptyString(v)) {
        die(`${where} missing seat '${seat}' or value is not a string.`);
    }
    return v;
}

// ---- main -----------------------------------------------------------------

(function main() {
    const args = parseArgs(process.argv);

    try {
        const indexPath = findAgentsIndex(args.index);
        const idx = readJson(indexPath);

        // Top-level structure
        assertHas(idx, "version", "agents.index.json");
        assertHas(idx, "generated_at", "agents.index.json");
        assertHas(idx, "global", "agents.index.json");
        assertHas(idx, "by_domain", "agents.index.json");
        assertHas(idx, "by_repo", "agents.index.json");

        // Tier 0 (global seats)
        const globalSeats = idx.global;
        const globalRequired = ["steward", "challenger", "arbiter", "meta_analyst", "librarian"];
        for (const s of globalRequired) {
            assertSeat(globalSeats, s, "agents.index.json.global");
        }

        // Tier 1 (domain seats)
        const dom = idx.by_domain?.[args.domain];
        if (!dom) {
            die(`agents.index.json.by_domain missing domain '${args.domain}'.`);
        }
        // optional metadata checks
        if (!isNonEmptyString(dom.engine)) {
            die(`by_domain['${args.domain}'].engine missing or invalid.`);
        }
        if (typeof dom.auto_ratify !== "boolean") {
            die(`by_domain['${args.domain}'].auto_ratify missing or not boolean.`);
        }
        const domainRequired = ["proposer", "executor", "challenger", "arbiter"];
        for (const s of domainRequired) {
            assertSeat(dom, s, `agents.index.json.by_domain['${args.domain}']`);
        }

        // Tier 2 (repo seats)
        const repo = idx.by_repo?.[args.repo];
        if (!repo) {
            die(`agents.index.json.by_repo missing repo '${args.repo}'.`);
        }
        if (!isNonEmptyString(repo.primary_domain)) {
            die(`by_repo['${args.repo}'].primary_domain missing or invalid.`);
        }
        if (!Array.isArray(repo.secondary_domains)) {
            die(`by_repo['${args.repo}'].secondary_domains missing or not array.`);
        }
        if (!isNonEmptyString(repo.engine)) {
            die(`by_repo['${args.repo}'].engine missing or invalid.`);
        }
        if (typeof repo.external !== "boolean") {
            die(`by_repo['${args.repo}'].external missing or not boolean.`);
        }
        if (typeof repo.apply !== "boolean") {
            die(`by_repo['${args.repo}'].apply missing or not boolean.`);
        }

        for (const s of domainRequired) {
            assertSeat(repo, s, `agents.index.json.by_repo['${args.repo}']`);
        }

        // Consistency: repo.primary_domain should match requested domain (strong signal)
        if (repo.primary_domain !== args.domain) {
            warn(
                `Repo '${args.repo}' primary_domain is '${repo.primary_domain}' but validator domain is '${args.domain}'. ` +
                "This may be intentional; if not, fix repos.yaml in nexus-core."
            );
        }

        // Summary
        ok("registry-backed agency OK");
        console.log(`   Index: ${path.relative(process.cwd(), indexPath)}`);
        console.log(`   Domain: ${args.domain}`);
        console.log(`   Repo: ${args.repo}`);
        console.log("   Tier 0 (global): OK");
        console.log("   Tier 1 (domain): OK");
        console.log("   Tier 2 (repo): OK");

        if (args.verbose) {
            console.log("");
            console.log("Seats (resolved IDs):");
            console.log("  global:", idx.global);
            console.log(`  domain[${args.domain}]:`, {
                proposer: dom.proposer,
                executor: dom.executor,
                challenger: dom.challenger,
                arbiter: dom.arbiter,
            });
            console.log(`  repo[${args.repo}]:`, {
                proposer: repo.proposer,
                executor: repo.executor,
                challenger: repo.challenger,
                arbiter: repo.arbiter,
            });
        }

        process.exit(0);
    } catch (err) {
        console.error("💥 Unexpected error while validating registry-backed agency");
        console.error(err?.stack || err?.message || String(err));
        process.exit(2);
    }
})();
