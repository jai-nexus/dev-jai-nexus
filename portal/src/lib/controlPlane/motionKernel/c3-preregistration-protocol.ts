import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { z } from "zod";
import { canonicalJson } from "../receiptLedger/receiptLedger";
import { evaluateCrossFamilyVerifierSeparation, type IntelligenceConfiguration } from "./c1-five-slot-decision-contract";
import { strictJson } from "./c2-ledger-snapshot";

export const EXACT_CASE_COUNT = 15;
export const MIN_SEEDED_P1_DEFECT_CASES = 5;
export const TASK_COMPLEXITY_TIERS = ["T1_ATOMIC", "T2_COMPOSABLE", "T3_CROSS_DOMAIN", "T4_PARADOX"] as const;
export const MEASURED_ARMS = ["2-Seat Baseline", "Compute-Matched Unstructured", "5-Slot Shadow Kernel"] as const;
export type Arm = typeof MEASURED_ARMS[number];
export const structured_call_budget_per_case = Object.freeze({
  "2-Seat Baseline": 2, "Compute-Matched Unstructured": 5, "5-Slot Shadow Kernel": 5,
});
export const thresholds = Object.freeze({
  T1: "<2 additional critical errors caught by five-slot vs. two-seat across the 15 cases OR >1.5x baseline founder minutes => recommend downgrade 5 -> 3 seats -> 2 seats; a later three-seat evaluation requires separate authorization and does not become a fourth arm mid-study.",
  T2: ">=3 adversarial false-consensus convergences => suspend role-collapsed configuration.",
  T3: "<13/15 independently cold-reconstructable packets => reject the benchmark's verification claim.",
});
export const anchors = Object.freeze({
  base: "cffbe25c09f4612bf931cc76aca5726536b646c4",
  contract: "20ae7ea20a2d94197d975345325b0d74e4b87d24",
  estimate: "edb03da29d452895c0730ed6835b05e762f4eeb5",
  amendment: "b8557877d6fe978998beb08a078fac6394690cdc",
  spec: "adac53a5ed93c566478cdffab45da1f33d1e4c98aa04a03c708e3d51ec30cbc1",
});
export function requireC3(value: unknown, code: string): asserts value {
  if (!value) throw new Error(code);
}
function hash(domain: string, value: string) {
  return createHash("sha256").update(domain + "\0").update(value, "utf8").digest("hex");
}
export function computeCanonicalSpecSectionHash(text: string) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const start = lines.indexOf("## Permitted candidate files");
  const endHeading = lines.indexOf("## Non-authorizations", start);
  requireC3(start >= 0 && endHeading > start && lines.lastIndexOf("## Permitted candidate files") === start &&
    lines.lastIndexOf("## Non-authorizations") === endHeading, "C3_SPEC_BOUNDARY");
  let end = endHeading + 1;
  while (end < lines.length && !/^## /.test(lines[end])) end++;
  while (end > endHeading + 1 && lines[end - 1] === "") end--;
  requireC3(end > endHeading + 1, "C3_SPEC_BOUNDARY");
  return hash("JAI-C3-SPEC-ANCHOR-v1", lines.slice(start, end).join("\n"));
}
export const id = z.string().min(1).refine(s => s.trim() === s);
export const integer = z.number().int().nonnegative().safe();
export const hex64 = z.string().regex(/^[a-f0-9]{64}$/);
const hex40 = z.string().regex(/^[a-f0-9]{40}$/);
export const isolation = z.object({
  fresh_temporary_session: z.literal(true), web_search: z.literal(false), repo_connectors: z.literal(false),
  drive_connectors: z.literal(false), file_tools: z.literal(false), cross_chat_memory: z.literal(false),
}).strict();
export const tokenTelemetry = z.discriminatedUnion("telemetry_status", [
  z.object({ rate_card_pinned_date: z.literal("2026-11-19"), telemetry_status: z.literal("OBSERVED_EXACT"),
    observed_input_tokens: integer, observed_output_tokens: integer }).strict(),
  z.object({ rate_card_pinned_date: z.literal("2026-11-19"), telemetry_status: z.literal("UNOBSERVABLE_SUBSCRIPTION_SURFACE"),
    observed_input_tokens: z.null(), observed_output_tokens: z.null() }).strict(),
]);
export function isolatedConfiguration(config: IntelligenceConfiguration) {
  return evaluateCrossFamilyVerifierSeparation(config, "anthropic").separated &&
    config.CONSTRUCTION.tools.length === 0 && config.CONSTRUCTION.models.every(m =>
      m.provider_family?.trim().toLowerCase() === "openai" && Boolean(m.model_id?.trim()));
}
function decoded(payload: unknown) {
  return typeof payload === "string" || payload instanceof Uint8Array
    ? strictJson(typeof payload === "string" ? Buffer.from(payload) : payload) : payload;
}
export function computeC3CorpusSeal(corpusPayload: unknown, saltHex: string) {
  hex64.parse(saltHex);
  return hash("JAI-C3-CORPUS-SEAL-v1", canonicalJson({ corpus: decoded(corpusPayload), salt_hex: saltHex }));
}
export function computeC3AnswerKeySeal(answerKeyPayload: unknown, saltHex: string) {
  hex64.parse(saltHex);
  return hash("JAI-C3-ANSWER-SEAL-v1", canonicalJson({ answer_key: decoded(answerKeyPayload), salt_hex: saltHex }));
}
const source = z.object({ path: id, source_commit: hex40, source_blob: hex40 }).strict();
const defect = z.object({ defect_id: id, severity: z.enum(["CRITICAL_P1", "MAJOR"]), target_clause_id: id,
  defect_class: id, required_remediation_code: id, adversarial_trap: z.boolean(), p1_source: source.nullable() }).strict();
const keySchema = z.array(z.object({ case_id: id, defects: z.array(defect) }).strict()).length(EXACT_CASE_COUNT);
const corpusSchema = z.object({
  max_case_input_utf8_bytes: integer.min(1), max_output_chars_per_pass: integer.min(1), wall_clock_cap_seconds_per_case: integer.min(1),
  cases: z.array(z.object({ case_id: id, task_complexity_tier: z.enum(TASK_COMPLEXITY_TIERS), case_input: id }).strict()).length(EXACT_CASE_COUNT),
}).strict();
type Study = { corpus: z.infer<typeof corpusSchema>; key: z.infer<typeof keySchema> };
const verified = new WeakSet<Study>();
export function assertVerifiedStudy(study: Study) { requireC3(verified.has(study), "C3_UNVERIFIED_REVEAL"); }
function freeze(value: object) {
  Object.freeze(value);
  for (const child of Object.values(value)) if (child && typeof child === "object") freeze(child);
}
function verifyP1(root: string, ref: z.infer<typeof source>) {
  requireC3(/^docs\/reference\/q3m7(?:y26-p1)?-[\w.-]+\.md$/.test(ref.path), "C3_P1_PATH");
  const git = (...args: string[]) => execFileSync("git", ["--no-replace-objects", ...args], {
    cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_ALLOW_PROTOCOL: "file", GIT_OPTIONAL_LOCKS: "0" },
  });
  git("merge-base", "--is-ancestor", ref.source_commit, anchors.base);
  requireC3(git("ls-tree", "-z", ref.source_commit, "--", ref.path) === "100644 blob " + ref.source_blob + "\t" + ref.path + "\0", "C3_P1_BLOB");
  git("cat-file", "-e", ref.source_blob + "^{blob}");
}
export function verifyC3Reveal(root: string, corpusBytes: Uint8Array, keyBytes: Uint8Array, corpusSalt: string, keySalt: string,
  frozen: { corpus_seal: string; answer_key_seal: string; spec_hash: string }): Study {
  const corpusValue = strictJson(corpusBytes), keyValue = strictJson(keyBytes);
  requireC3(frozen.spec_hash === anchors.spec && computeC3CorpusSeal(corpusValue, corpusSalt) === frozen.corpus_seal &&
    computeC3AnswerKeySeal(keyValue, keySalt) === frozen.answer_key_seal, "C3_SEAL_MISMATCH");
  const corpus = corpusSchema.parse(corpusValue), key = keySchema.parse(keyValue);
  const cases = new Set(corpus.cases.map(c => c.case_id));
  requireC3(cases.size === EXACT_CASE_COUNT && new Set(key.map(k => k.case_id)).size === EXACT_CASE_COUNT &&
    key.every(k => cases.has(k.case_id)) && new Set(corpus.cases.map(c => c.task_complexity_tier)).size === 4 &&
    corpus.cases.every(c => Buffer.byteLength(c.case_input) <= corpus.max_case_input_utf8_bytes), "C3_CASE_MATRIX");
  const checked = new Set<string>();
  let seeded = 0;
  for (const row of key) {
    requireC3(new Set(row.defects.map(d => d.defect_id)).size === row.defects.length &&
      new Set(row.defects.map(d => canonicalJson([d.target_clause_id, d.defect_class, d.required_remediation_code]))).size === row.defects.length,
      "C3_DUPLICATE_DEFECT");
    if (row.defects.some(d => d.p1_source)) seeded++;
    for (const d of row.defects) {
      requireC3(d.severity !== "CRITICAL_P1" || d.p1_source, "C3_P1_SOURCE_REQUIRED");
      if (d.p1_source && !checked.has(canonicalJson(d.p1_source))) {
        verifyP1(root, d.p1_source);
        checked.add(canonicalJson(d.p1_source));
      }
    }
  }
  requireC3(seeded >= MIN_SEEDED_P1_DEFECT_CASES, "C3_SEED_FLOOR");
  const study = { corpus, key };
  freeze(study);
  verified.add(study);
  return study;
}
