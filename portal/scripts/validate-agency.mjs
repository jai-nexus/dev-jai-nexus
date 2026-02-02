// portal/scripts/validate-agency.mjs
//
// Validates portal/config/agency.yaml for:
// - required top-level keys
// - agent shape (required fields, types)
// - NH uniqueness + formatting
// - parent existence (no orphans)
// - delegates_to references exist
// - scope non-empty for non-root agents
// - github_labels is an array of strings
//
// Usage:
//   node scripts/validate-agency.mjs
//   node scripts/validate-agency.mjs --file config/agency.yaml
//
// Exit codes:
//   0 = OK
//   1 = Validation failed
//   2 = Unexpected error (parse/read/etc.)

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("yaml");

// --- helpers ---------------------------------------------------------------

function isNonEmptyString(x) {
    return typeof x === "string" && x.trim().length > 0;
}

function isArrayOfNonEmptyStrings(x) {
    return Array.isArray(x) && x.every(isNonEmptyString);
}

// NH format: digits separated by dots (e.g., "1", "1.0", "1.2.3")
const NH_RE = /^\d+(?:\.\d+)*$/;

function parseArgs(argv) {
    const args = { file: "config/agency.yaml" };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--file" && argv[i + 1]) {
            args.file = argv[i + 1];
            i++;
        }
    }
    return args;
}

function loadYaml(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return yaml.parse(raw);
}

function validateTopLevel(doc) {
    const problems = [];

    if (!doc || typeof doc !== "object") {
        problems.push("YAML root must be an object.");
        return problems;
    }

    if (typeof doc.schema_version !== "number") {
        problems.push("schema_version must be a number (e.g., 0.1).");
    }

    if (!doc.owner || typeof doc.owner !== "object") {
        problems.push("owner is required and must be an object.");
    } else {
        const o = doc.owner;
        if (!isNonEmptyString(o.name)) problems.push("owner.name is required (string).");
        if (!isNonEmptyString(o.handle)) problems.push("owner.handle is required (string).");
        if (!isNonEmptyString(o.nh_root) || !NH_RE.test(o.nh_root)) {
            problems.push("owner.nh_root is required and must be a valid NH string.");
        }
    }

    if (!Array.isArray(doc.agents)) {
        problems.push("agents is required and must be an array.");
    } else if (doc.agents.length === 0) {
        problems.push("agents array is empty.");
    }

    return problems;
}

function validateAgentShape(agent, idx) {
    const problems = [];
    const where = `agents[${idx}]`;

    if (!agent || typeof agent !== "object") {
        problems.push(`${where}: must be an object.`);
        return problems;
    }

    // required fields
    const required = [
        "nh_id",
        "id",
        "agent_key",
        "label",
        "parent_nh_id",
        "tier",
        "role",
        "scope",
        "delegates_to",
        "github_labels",
    ];

    for (const k of required) {
        if (!(k in agent)) problems.push(`${where}: missing required field '${k}'.`);
    }

    // nh_id
    if (!isNonEmptyString(agent.nh_id) || !NH_RE.test(agent.nh_id)) {
        problems.push(`${where}: nh_id must be a valid NH string (e.g., "1.2.3").`);
    }

    // parent_nh_id can be null or NH string
    if ("parent_nh_id" in agent) {
        const p = agent.parent_nh_id;
        if (!(p === null || (isNonEmptyString(p) && NH_RE.test(p)))) {
            problems.push(`${where}: parent_nh_id must be null or a valid NH string.`);
        }
    }

    // strings
    if ("id" in agent && !isNonEmptyString(agent.id)) problems.push(`${where}: id must be a non-empty string.`);
    if ("agent_key" in agent && !isNonEmptyString(agent.agent_key)) problems.push(`${where}: agent_key must be a non-empty string.`);
    if ("label" in agent && !isNonEmptyString(agent.label)) problems.push(`${where}: label must be a non-empty string.`);
    if ("role" in agent && !isNonEmptyString(agent.role)) problems.push(`${where}: role must be a non-empty string.`);

    // tier
    if ("tier" in agent) {
        if (typeof agent.tier !== "number") {
            problems.push(`${where}: tier must be a number.`);
        } else if (!Number.isFinite(agent.tier) || agent.tier < 0) {
            problems.push(`${where}: tier must be a non-negative number.`);
        }
    }

    // scope
    if ("scope" in agent) {
        if (!isArrayOfNonEmptyStrings(agent.scope)) {
            problems.push(`${where}: scope must be an array of non-empty strings.`);
        } else if (agent.parent_nh_id !== null && agent.scope.length === 0) {
            problems.push(`${where}: scope must be non-empty for non-root agents.`);
        }
    }

    // delegates_to
    if ("delegates_to" in agent) {
        if (!isArrayOfNonEmptyStrings(agent.delegates_to)) {
            problems.push(`${where}: delegates_to must be an array of NH strings.`);
        } else {
            for (const d of agent.delegates_to) {
                if (!NH_RE.test(d)) problems.push(`${where}: delegates_to contains invalid NH '${d}'.`);
            }
        }
    }

    // github_labels
    if ("github_labels" in agent) {
        if (!isArrayOfNonEmptyStrings(agent.github_labels)) {
            problems.push(`${where}: github_labels must be an array of strings.`);
        }
    }

    // responsibilities optional but if present must be array of strings
    if ("responsibilities" in agent) {
        if (!isArrayOfNonEmptyStrings(agent.responsibilities)) {
            problems.push(`${where}: responsibilities must be an array of non-empty strings (if present).`);
        }
    }

    return problems;
}

function validateRelationships(agents) {
    const problems = [];
    const warnings = [];

    const nhSet = new Set(agents.map((a) => a.nh_id));
    const nhCounts = new Map();
    const keyCounts = new Map();
    const idCounts = new Map();

    for (const a of agents) {
        nhCounts.set(a.nh_id, (nhCounts.get(a.nh_id) || 0) + 1);
        keyCounts.set(a.agent_key, (keyCounts.get(a.agent_key) || 0) + 1);
        idCounts.set(a.id, (idCounts.get(a.id) || 0) + 1);
    }

    // duplicates
    for (const [nh, c] of nhCounts.entries()) {
        if (c > 1) problems.push(`Duplicate nh_id: '${nh}' appears ${c} times.`);
    }
    for (const [k, c] of keyCounts.entries()) {
        if (c > 1) problems.push(`Duplicate agent_key: '${k}' appears ${c} times.`);
    }
    for (const [id, c] of idCounts.entries()) {
        if (c > 1) problems.push(`Duplicate id: '${id}' appears ${c} times.`);
    }

    // orphans
    const orphans = agents.filter((a) => a.parent_nh_id && !nhSet.has(a.parent_nh_id));
    for (const a of orphans) {
        problems.push(`Orphan agent: '${a.nh_id}' parent_nh_id '${a.parent_nh_id}' does not exist.`);
    }

    // invalid delegates_to references
    for (const a of agents) {
        for (const d of a.delegates_to || []) {
            if (!nhSet.has(d)) problems.push(`Invalid delegates_to: '${a.nh_id}' -> '${d}' (missing target).`);
        }
    }

    // non-fatal hint: delegates_to should usually stay within the agent's subtree
    // IMPORTANT: subtree is defined by parent_nh_id links (ancestry), not string-prefix.
    const parentByNh = new Map(agents.map((a) => [a.nh_id, a.parent_nh_id]));

    function isDescendant(childNh, ancestorNh) {
        if (childNh === ancestorNh) return true;

        let cur = childNh;
        // Walk upwards using parent pointers until we hit null/unknown
        while (true) {
            const parent = parentByNh.get(cur);
            if (!parent) return false; // reached root or unknown node
            if (parent === ancestorNh) return true;
            cur = parent;
        }
    }

    for (const a of agents) {
        for (const d of a.delegates_to || []) {
            if (!isDescendant(d, a.nh_id)) {
                warnings.push(
                    `WARN: '${a.nh_id}' delegates_to '${d}' is outside its subtree (may be intentional).`
                );
            }
        }
    }

    return { problems, warnings };
}

// --- main ------------------------------------------------------------------

(function main() {
    const args = parseArgs(process.argv);
    const filePath = path.resolve(process.cwd(), args.file);

    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Missing file: ${filePath}`);
            process.exit(1);
        }

        const doc = loadYaml(filePath);

        const topProblems = validateTopLevel(doc);
        if (topProblems.length) {
            console.error("❌ Top-level validation failed:");
            for (const p of topProblems) console.error(" - " + p);
            process.exit(1);
        }

        const agents = doc.agents || [];

        // shape validation
        const shapeProblems = [];
        agents.forEach((a, i) => shapeProblems.push(...validateAgentShape(a, i)));
        if (shapeProblems.length) {
            console.error("❌ Agent shape validation failed:");
            for (const p of shapeProblems) console.error(" - " + p);
            process.exit(1);
        }

        // relationship validation
        const { problems: relProblems, warnings } = validateRelationships(agents);
        if (relProblems.length) {
            console.error("❌ Relationship validation failed:");
            for (const p of relProblems) console.error(" - " + p);
            process.exit(1);
        }

        // summary
        const nhSet = new Set(agents.map((a) => a.nh_id));
        console.log("✅ agency.yaml OK");
        console.log(`   File: ${path.relative(process.cwd(), filePath)}`);
        console.log(`   Agents: ${agents.length}`);
        console.log(`   Unique NH IDs: ${nhSet.size}`);
        console.log("   Orphans: None ✓");
        console.log("   Invalid delegates_to: None ✓");

        const missingScope = agents.filter(
            (a) => a.parent_nh_id !== null && (!a.scope || a.scope.length === 0)
        );
        console.log(
            `   Agents without scope: ${missingScope.length ? missingScope.map((a) => a.nh_id).join(", ") : "None ✓"}`
        );

        if (warnings.length) {
            console.log("");
            console.log("⚠️  Warnings (non-fatal):");
            for (const w of warnings.slice(0, 30)) console.log(" - " + w);
            if (warnings.length > 30) console.log(` - ...and ${warnings.length - 30} more`);
        }

        process.exit(0);
    } catch (err) {
        console.error("💥 Unexpected error while validating agency.yaml");
        console.error(err?.stack || err?.message || String(err));
        process.exit(2);
    }
})();
