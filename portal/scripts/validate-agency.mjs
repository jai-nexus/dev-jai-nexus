// portal/scripts/validate-agency.mjs
//
// Registry-backed agency validator (Council Pivot).
//
// What this validates:
//
// 1) agents.index.json structural integrity:
//    - version, generated_at, global, by_domain, by_repo
//    - Tier 0 seats present: steward/challenger/arbiter/meta_analyst/librarian
//    - Tier 1 domain seats present for --domain (default dev.jai.nexus) unless --no-domain
//    - Tier 2 repo seats present for --repo (default dev-jai-nexus) unless --no-repo
//
// 2) Seat IDs resolve to real agents in agents.generated.yaml (optional but enabled by default):
//    - Loads registry/agents.generated.yaml adjacent to agents.index.json
//    - Confirms every seat agent_id exists in that YAML
//
// Usage:
//   node portal/scripts/validate-agency.mjs
//   node portal/scripts/validate-agency.mjs --verbose
//   node portal/scripts/validate-agency.mjs --index workspace/jai-nexus/nexus-core/registry/agents.index.json
//   node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
//   node portal/scripts/validate-agency.mjs --no-domain
//   node portal/scripts/validate-agency.mjs --no-repo
//   node portal/scripts/validate-agency.mjs --no-domain --no-repo   (Tier 0 only)
//   node portal/scripts/validate-agency.mjs --no-yaml   (skip agents.generated.yaml cross-check)
//
// Exit codes:
//   0 = OK
//   1 = Validation failed
//   2 = Unexpected error

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("yaml");

// ---- args -----------------------------------------------------------------

function parseArgs(argv) {
    const args = {
        index: null, // optional explicit path to agents.index.json

        // defaults remain for backwards compatibility
        domain: "dev.jai.nexus",
        repo: "dev-jai-nexus",

        // allow motions (or callers) to explicitly validate Tier 0 only
        checkDomain: true,
        checkRepo: true,

        verbose: false,
        yamlCheck: true, // cross-check seat IDs exist in agents.generated.yaml
    };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];

        if (a === "--index" && argv[i + 1]) {
            args.index = argv[++i];
            continue;
        }

        if (a === "--domain" && argv[i + 1]) {
            args.domain = argv[++i];
            args.checkDomain = true;
            continue;
        }
        if (a === "--repo" && argv[i + 1]) {
            args.repo = argv[++i];
            args.checkRepo = true;
            continue;
        }

        if (a === "--no-domain") {
            args.checkDomain = false;
            continue;
        }
        if (a === "--no-repo") {
            args.checkRepo = false;
            continue;
        }

        if (a === "--verbose") {
            args.verbose = true;
            continue;
        }
        if (a === "--no-yaml") {
            args.yamlCheck = false;
            continue;
        }
    }

    // If we aren't checking domain/repo tiers, null them out for clearer output
    if (!args.checkDomain) args.domain = null;
    if (!args.checkRepo) args.repo = null;

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

function isBooleanOrObject(x) {
    return typeof x === "boolean" || (x && typeof x === "object");
}

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    try {
        return JSON.parse(raw);
    } catch (e) {
        throw new Error(`Failed to parse JSON at ${filePath}: ${e?.message || e}`);
    }
}

function readYaml(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    try {
        return yaml.parse(raw);
    } catch (e) {
        throw new Error(`Failed to parse YAML at ${filePath}: ${e?.message || e}`);
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
// Kept deterministic to avoid "magic" scanning.
function findAgentsIndex(explicitPath) {
    if (explicitPath) {
        const abs = path.resolve(process.cwd(), explicitPath);
        if (!fileExists(abs)) die(`Missing agents.index.json at --index path: ${abs}`);
        return abs;
    }

    const candidates = [
        // when run from dev-jai-nexus repo root
        path.resolve(process.cwd(), "workspace/jai-nexus/nexus-core/registry/agents.index.json"),
        // when run from dev-jai-nexus/portal
        path.resolve(process.cwd(), "../workspace/jai-nexus/nexus-core/registry/agents.index.json"),
        // when run from portal/scripts directly
        path.resolve(process.cwd(), "../../workspace/jai-nexus/nexus-core/registry/agents.index.json"),
        // alternate mirror patterns
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
    if (!seatsObj || typeof seatsObj !== "object") die(`${where} is missing or not an object.`);
    const v = seatsObj[seat];
    if (!isNonEmptyString(v)) die(`${where} missing seat '${seat}' or value is not a string.`);
    return v;
}

function collectSeatIds(idx, domainKey, repoKey, { checkDomain, checkRepo }) {
    const seatIds = [];

    // Tier 0
    const globalSeats = idx.global;
    const globalRequired = ["steward", "challenger", "arbiter", "meta_analyst", "librarian"];
    for (const s of globalRequired) seatIds.push(assertSeat(globalSeats, s, "agents.index.json.global"));

    const tierSeats = ["proposer", "executor", "challenger", "arbiter"];

    // Tier 1 (domain) — optional
    let dom = null;
    if (checkDomain) {
        if (!isNonEmptyString(domainKey)) die(`--domain is required unless you pass --no-domain.`);
        dom = idx.by_domain?.[domainKey];
        if (!dom) die(`agents.index.json.by_domain missing domain '${domainKey}'.`);
        if (!isNonEmptyString(dom.engine)) die(`by_domain['${domainKey}'].engine missing or invalid.`);

        // index typing may allow boolean OR object OR absent
        if ("auto_ratify" in dom && dom.auto_ratify != null && !isBooleanOrObject(dom.auto_ratify)) {
            die(`by_domain['${domainKey}'].auto_ratify must be boolean or object when present.`);
        }

        for (const s of tierSeats) seatIds.push(assertSeat(dom, s, `agents.index.json.by_domain['${domainKey}']`));
    }

    // Tier 2 (repo) — optional
    let repo = null;
    if (checkRepo) {
        if (!isNonEmptyString(repoKey)) die(`--repo is required unless you pass --no-repo.`);
        repo = idx.by_repo?.[repoKey];
        if (!repo) die(`agents.index.json.by_repo missing repo '${repoKey}'.`);
        if (!isNonEmptyString(repo.primary_domain)) die(`by_repo['${repoKey}'].primary_domain missing or invalid.`);

        // secondary_domains may be optional in some index versions
        if ("secondary_domains" in repo && repo.secondary_domains != null && !Array.isArray(repo.secondary_domains)) {
            die(`by_repo['${repoKey}'].secondary_domains must be an array when present.`);
        }

        if (!isNonEmptyString(repo.engine)) die(`by_repo['${repoKey}'].engine missing or invalid.`);

        // external/apply may be optional booleans depending on index version
        if ("external" in repo && repo.external != null && typeof repo.external !== "boolean") {
            die(`by_repo['${repoKey}'].external must be boolean when present.`);
        }
        if ("apply" in repo && repo.apply != null && typeof repo.apply !== "boolean") {
            die(`by_repo['${repoKey}'].apply must be boolean when present.`);
        }

        for (const s of tierSeats) seatIds.push(assertSeat(repo, s, `agents.index.json.by_repo['${repoKey}']`));
    }

    // Consistency warning only (only meaningful if both are checked)
    if (checkRepo && checkDomain && repo && dom && repo.primary_domain !== domainKey) {
        warn(
            `Repo '${repoKey}' primary_domain is '${repo.primary_domain}' but validator domain is '${domainKey}'. ` +
            "This may be intentional; if not, fix repos.yaml in nexus-core."
        );
    }

    return { seatIds, dom, repo };
}

function loadAgentsGeneratedIdSet(indexPath) {
    // Expect agents.generated.yaml adjacent to agents.index.json
    const registryDir = path.dirname(indexPath);
    const yamlPath = path.join(registryDir, "agents.generated.yaml");
    if (!fileExists(yamlPath)) {
        die(
            `Missing agents.generated.yaml next to agents.index.json.\n` +
            `Expected: ${yamlPath}\n` +
            `If you intentionally don't want this check, run with --no-yaml.`
        );
    }

    const doc = readYaml(yamlPath);
    if (!doc || typeof doc !== "object") die(`agents.generated.yaml root must be an object: ${yamlPath}`);
    if (!Array.isArray(doc.agents)) die(`agents.generated.yaml must contain 'agents' array: ${yamlPath}`);

    const set = new Set();
    for (const a of doc.agents) {
        const id = a?.agent_id;
        if (isNonEmptyString(id)) set.add(id);
    }

    if (set.size === 0) die(`agents.generated.yaml produced 0 agent IDs: ${yamlPath}`);
    return { yamlPath, idSet: set, count: doc.agents.length };
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

        const { seatIds, dom, repo } = collectSeatIds(idx, args.domain, args.repo, {
            checkDomain: args.checkDomain,
            checkRepo: args.checkRepo,
        });

        // Cross-check seat IDs exist in agents.generated.yaml
        let yamlInfo = null;
        if (args.yamlCheck) {
            const { yamlPath, idSet, count } = loadAgentsGeneratedIdSet(indexPath);

            const missing = seatIds.filter((id) => !idSet.has(id));
            if (missing.length) {
                die(
                    `Seat IDs present in agents.index.json but missing from agents.generated.yaml (${path.relative(
                        process.cwd(),
                        yamlPath
                    )}):\n - ${missing.join("\n - ")}`
                );
            }

            yamlInfo = { yamlPath, count };
        }

        // Summary
        ok("registry-backed agency OK");
        console.log(`   Index: ${path.relative(process.cwd(), indexPath)}`);
        console.log("   Tier 0 (global): OK");

        if (args.checkDomain) {
            console.log(`   Domain: ${args.domain}`);
            console.log("   Tier 1 (domain): OK");
        } else {
            console.log("   Tier 1 (domain): SKIPPED (--no-domain)");
        }

        if (args.checkRepo) {
            console.log(`   Repo: ${args.repo}`);
            console.log("   Tier 2 (repo): OK");
        } else {
            console.log("   Tier 2 (repo): SKIPPED (--no-repo)");
        }

        if (yamlInfo) {
            console.log(
                `   agents.generated.yaml: OK (${path.relative(process.cwd(), yamlInfo.yamlPath)}; ${yamlInfo.count} agents)`
            );
        } else {
            console.log("   agents.generated.yaml: SKIPPED (--no-yaml)");
        }

        if (args.verbose) {
            console.log("");
            console.log("Seats (resolved IDs):");
            console.log("  global:", idx.global);

            if (args.checkDomain && dom) {
                console.log(`  domain[${args.domain}]:`, {
                    proposer: dom.proposer,
                    executor: dom.executor,
                    challenger: dom.challenger,
                    arbiter: dom.arbiter,
                });
            }

            if (args.checkRepo && repo) {
                console.log(`  repo[${args.repo}]:`, {
                    proposer: repo.proposer,
                    executor: repo.executor,
                    challenger: repo.challenger,
                    arbiter: repo.arbiter,
                });
            }
        }

        process.exit(0);
    } catch (err) {
        console.error("💥 Unexpected error while validating registry-backed agency");
        console.error(err?.stack || err?.message || String(err));
        process.exit(2);
    }
})();
