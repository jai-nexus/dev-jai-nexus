// portal/src/lib/motion/motionLib.mjs
//
// Shared motion parsing + normalization for:
// - portal/scripts/validate-motion.mjs
// - portal/scripts/council-run.mjs
//
// Keeps Council Runner from doing YAML parsing via regex/indentation.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import YAML from "yaml";
import { z } from "zod";

function stripQuotes(s) {
    return String(s ?? "")
        .trim()
        .replace(/^"|"$/g, "")
        .replace(/^'|'$/g, "");
}

function nonEmptyOrNull(s) {
    const v = stripQuotes(s);
    return v.length ? v : null;
}

export function coerceBooleanLike(v) {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "string") {
        const s = stripQuotes(v).toLowerCase();
        if (s === "true" || s === "1") return true;
        if (s === "false" || s === "0") return false;
    }
    return null;
}

const ZMaxRiskScore = z.preprocess((v) => {
    if (typeof v === "string") {
        const n = Number(stripQuotes(v));
        return Number.isFinite(n) ? n : v;
    }
    return v;
}, z.number().finite());

export const MotionSchema = z
    .object({
        title: z.string().min(1).optional(),

        target: z
            .object({
                domain: z.string().min(1).optional(),
                repo: z.string().min(1).optional(),
            })
            .optional(),

        // legacy support
        domain: z.string().min(1).optional(),
        repo: z.string().min(1).optional(),

        auto_ratify: z
            .object({
                enabled: z.any().optional(),
            })
            .optional(),

        max_risk_score: ZMaxRiskScore.optional(),

        checks_required: z.array(z.string().min(1)).optional(),
        checks_optional: z.array(z.string().min(1)).optional(),
    })
    .passthrough();

export const KNOWN_GATES = new Set([
    "validate_motion",
    "validate_agency",
    "dct_replay_check",
    "execution_patch_exists",
    "patch_apply_check",
    "typecheck",
]);

export function parseMotionText(yamlText) {
    if (!yamlText || !String(yamlText).trim()) {
        throw new Error("motion.yaml is empty.");
    }

    const parsed = YAML.parse(String(yamlText));
    if (!parsed || typeof parsed !== "object") {
        throw new Error("motion.yaml root must be a YAML mapping/object.");
    }

    const res = MotionSchema.safeParse(parsed);
    if (!res.success) {
        const msg = JSON.stringify(res.error.format(), null, 2);
        throw new Error(`motion schema validation failed:\n${msg}`);
    }

    const m = res.data;

    const tDomain = nonEmptyOrNull(m.target?.domain ?? m.domain ?? "");
    const tRepo = nonEmptyOrNull(m.target?.repo ?? m.repo ?? "");

    const enabled = coerceBooleanLike(m.auto_ratify?.enabled);
    if (m.auto_ratify && "enabled" in m.auto_ratify && enabled === null) {
        throw new Error("auto_ratify.enabled must be boolean-like (true/false/1/0).");
    }

    const checks_required = Array.isArray(m.checks_required) ? m.checks_required.map((s) => s.trim()).filter(Boolean) : [];
    const checks_optional = Array.isArray(m.checks_optional) ? m.checks_optional.map((s) => s.trim()).filter(Boolean) : [];

    // normalize unknown-gate warnings (caller decides how to surface)
    const unknown_gates = [...checks_required, ...checks_optional].filter((g) => !KNOWN_GATES.has(g));

    return {
        // raw-ish fields
        title: m.title ?? null,
        target: { domain: tDomain, repo: tRepo },

        // gating/config
        auto_ratify_enabled: enabled ?? false,
        max_risk_score: typeof m.max_risk_score === "number" ? m.max_risk_score : null,
        checks_required,
        checks_optional,
        unknown_gates,

        // keep full parsed object around if you ever need it
        raw: m,
    };
}

export function loadMotionFromFile(motionPath) {
    const abs = path.resolve(process.cwd(), motionPath);
    if (!fs.existsSync(abs)) throw new Error(`Missing motion file: ${abs}`);
    const txt = fs.readFileSync(abs, "utf8");
    return parseMotionText(txt);
}
