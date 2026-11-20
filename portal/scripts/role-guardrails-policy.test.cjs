"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const policyLib = require("./role-guardrails-policy.cjs");
const {
  decodeContentsResponse,
  evaluatePullRequest,
  extractH2Section,
  loadTrustedPolicy,
  meaningfulEvidenceLines,
  parseRoleDeclarations,
  resolveDeclaredRole,
  validatePolicy,
} = policyLib;

const repoRoot = path.resolve(__dirname, "../..");
const P = "JAI::DEV::";

// Fixture shaped like roles/rolemap.json at 002a2f7 (no verifierBypassAllowedRoles key).
function basePolicy(overrides = {}) {
  return {
    repo: "fixture",
    rolePrefix: P,
    blockedPrefixes: ["vault/", "node_modules/"],
    blockedExact: [".env", "portal/dev.db"],
    rules: [
      { id: "role-system", pathsPrefix: ["roles/"], allowedRoles: [`${P}OPERATOR`, `${P}ARCHITECT`, `${P}BUILDER`, `${P}VERIFIER`, `${P}LIBRARIAN`], evidenceRequired: false },
      { id: "github-workflows", pathsPrefix: [".github/workflows/"], allowedRoles: [`${P}VERIFIER`], evidenceRequired: true },
      { id: "builder-only", pathsPrefix: ["portal/builder-only/"], allowedRoles: [`${P}BUILDER`], evidenceRequired: true },
      { id: "portal-docs", pathsPrefix: ["portal/docs/"], allowedRoles: [`${P}LIBRARIAN`, `${P}BUILDER`, `${P}VERIFIER`], evidenceRequired: false },
    ],
    defaultAllowedRoles: [`${P}BUILDER`, `${P}VERIFIER`],
    evidenceSectionTitle: "Evidence",
    ...overrides,
  };
}

const EVIDENCE = "## Evidence\n- node --test: 12/12 pass\n\n## Governance Boundary\n- Merge Authorized: false\n";
const body = (role, evidence = EVIDENCE) => `## Summary\nWork.\n\n${role}\n\n${evidence}`;
const files = (...names) => names.map((filename) => ({ filename }));

function evaluate({ policy = basePolicy(), prBody, changed }) {
  return evaluatePullRequest({ policy, body: prBody, files: changed });
}

test("verifier bypass is default-deny: absent and false deny, only literal true allows", () => {
  const prBody = body(`Role: ${P}VERIFIER`);
  const changed = files("portal/builder-only/a.ts");
  const absent = evaluate({ prBody, changed });
  assert.equal(absent.ok, false);
  assert.equal(absent.verifierBypass, false);
  assert.match(absent.errors.join("\n"), /not allowed to change portal\/builder-only\/a\.ts/);

  const disabled = evaluate({ policy: basePolicy({ verifierBypassAllowedRoles: false }), prBody, changed });
  assert.equal(disabled.ok, false);

  const enabled = evaluate({ policy: basePolicy({ verifierBypassAllowedRoles: true }), prBody, changed });
  assert.equal(enabled.ok, true, enabled.errors.join("\n"));
  assert.equal(enabled.verifierBypass, true);

  for (const truthy of ["true", 1, "yes"]) {
    assert.equal(validatePolicy(basePolicy({ verifierBypassAllowedRoles: truthy })).ok, false, `non-boolean ${JSON.stringify(truthy)} must invalidate the policy`);
    assert.equal(evaluate({ policy: basePolicy({ verifierBypassAllowedRoles: truthy }), prBody, changed }).ok, false);
  }
});

test("non-verifier workflow edits are rejected; verifier workflow edits pass", () => {
  const builder = evaluate({ prBody: body(`Role: ${P}BUILDER`), changed: files(".github/workflows/ci.yml") });
  assert.equal(builder.ok, false);
  assert.match(builder.errors.join("\n"), /BUILDER' is not allowed to change \.github\/workflows\/ci\.yml \(rule: github-workflows/);

  const verifier = evaluate({ prBody: body(`Role: ${P}VERIFIER`), changed: files(".github/workflows/ci.yml") });
  assert.equal(verifier.ok, true, verifier.errors.join("\n"));
  assert.equal(verifier.evidenceRequired, true);
});

test("a PR that edits its own rolemap to self-grant is judged by the trusted base policy", () => {
  const trusted = basePolicy();
  const proposed = structuredClone(trusted);
  proposed.rules.find((r) => r.id === "github-workflows").allowedRoles.push(`${P}BUILDER`);
  const prBody = body(`Role: ${P}BUILDER`);
  const changed = files("roles/rolemap.json", ".github/workflows/ci.yml");

  assert.equal(evaluate({ policy: proposed, prBody, changed }).ok, true, "control: the PR's own proposed policy would admit it");
  const judged = evaluate({ policy: trusted, prBody, changed });
  assert.equal(judged.ok, false);
  assert.deepEqual(judged.errors.filter((e) => e.includes("not allowed")).length, 1);
});

test("renames are checked against both the old and the new path", () => {
  const result = evaluate({
    prBody: body(`Role: ${P}BUILDER`),
    changed: [{ filename: "portal/docs/moved.yml", previous_filename: ".github/workflows/ci.yml" }],
  });
  assert.equal(result.ok, false);
  assert.deepEqual(result.checkedPaths, ["portal/docs/moved.yml", ".github/workflows/ci.yml"]);
});

test("role declarations: plain, backticked, bold, bulleted, lowercase, and CRLF forms parse to one role", () => {
  const policy = basePolicy();
  const forms = [
    [`Role: ${P}VERIFIER`, `${P}VERIFIER`],
    ["Role: `JAI::DEV::BUILDER`", `${P}BUILDER`],
    ["**Role:** JAI::DEV::BUILDER", `${P}BUILDER`],
    ["**Role**: `JAI::DEV::ARCHITECT`", `${P}ARCHITECT`],
    ["__Role:__ JAI::DEV::LIBRARIAN", `${P}LIBRARIAN`],
    ["- Role: JAI::DEV::OPERATOR", `${P}OPERATOR`],
    ["role:   jai::dev::verifier  ", `${P}VERIFIER`],
  ];
  for (const [line, expected] of forms) {
    for (const eol of ["\n", "\r\n"]) {
      const text = ["## Summary", "x", "", line, "", "## Evidence", "- ok"].join(eol);
      assert.deepEqual(resolveDeclaredRole(text, policy), { ok: true, role: expected }, JSON.stringify({ line, eol }));
    }
  }
});

test("missing, duplicate, conflicting, malformed, unknown, and wrong-prefix roles are rejected", () => {
  const policy = basePolicy();
  const cases = [
    ["## Summary\nno role here", /Missing 'Role:'/],
    [`Role: ${P}BUILDER\n\nRole: ${P}BUILDER`, /2 'Role:' declarations/],
    [`Role: ${P}BUILDER\n**Role:** ${P}VERIFIER`, /2 'Role:' declarations/],
    ["Role:", /Malformed Role ""/],
    ["Role: JAI::DEV::<OPERATOR|ARCHITECT|BUILDER|VERIFIER|LIBRARIAN>", /Malformed Role/],
    ["Role: JAI:DEV::VERIFIER", /Malformed Role/],
    [`Role: ${P}VERIFIER (cross-verified)`, /Malformed Role/],
    ["Role: JAI::DEV::JANITOR", /Unknown Role/],
    ["Role: JAI::COUNCIL::BUILDER", /Malformed Role/],
  ];
  for (const [text, expected] of cases) {
    const result = resolveDeclaredRole(text, policy);
    assert.equal(result.ok, false, text);
    assert.match(result.reason, expected, text);
  }
});

test("role lines inside fenced code blocks and HTML comments are not declarations", () => {
  const policy = basePolicy();
  const fenced = "```\nRole: JAI::DEV::BUILDER\n```\n<!-- Role: JAI::DEV::VERIFIER -->";
  assert.deepEqual(parseRoleDeclarations(fenced), []);
  assert.equal(resolveDeclaredRole(fenced, policy).ok, false);
  const withReal = `${fenced}\nRole: ${P}VERIFIER`;
  assert.deepEqual(resolveDeclaredRole(withReal, policy), { ok: true, role: `${P}VERIFIER` });
});

test("Evidence passes as the final section or before another H2, with H3 kept inside", () => {
  const final = `Role: ${P}VERIFIER\n\n## Evidence\n- tsc --noEmit: exit 0`;
  assert.equal(extractH2Section(final, "Evidence"), "- tsc --noEmit: exit 0");
  assert.equal(evaluate({ prBody: final, changed: files(".github/workflows/ci.yml") }).ok, true, "final-section Evidence (no 'Z' anywhere) must pass");

  const mid = `Role: ${P}VERIFIER\n\n## Evidence\n- build: exit 0\n### Detail\n- 33/33\n## Governance Boundary\n- merge: false`;
  assert.equal(extractH2Section(mid, "Evidence"), "- build: exit 0\n### Detail\n- 33/33");
  assert.equal(evaluate({ prBody: mid, changed: files(".github/workflows/ci.yml") }).ok, true);

  const crlf = mid.replace(/\n/g, "\r\n");
  assert.equal(evaluate({ prBody: crlf, changed: files(".github/workflows/ci.yml") }).ok, true);

  const fencedHeading = `Role: ${P}VERIFIER\n\n## Evidence\n\`\`\`\n## not a heading\nexit 0\n\`\`\`\n## Next`;
  assert.match(extractH2Section(fencedHeading, "Evidence"), /## not a heading\nexit 0/);
});

test("missing, empty, and placeholder-only Evidence fail only when a rule requires evidence", () => {
  const changed = files(".github/workflows/ci.yml");
  const role = `Role: ${P}VERIFIER`;
  const failing = [
    [`${role}\n\n## Summary\nno evidence`, /no '## Evidence' section/],
    [`${role}\n\n## Evidence\n\n## Governance Boundary\n- x`, /empty or contains only placeholders/],
    [`${role}\n\n## Evidence`, /empty or contains only placeholders/],
    [`${role}\n\n## Evidence\n- <Insert exact local test counts>\n## Governance Boundary`, /only placeholders/],
    [`${role}\n\n## Evidence\nEvidence: <Required | N/A — explain why>\n- \`pnpm lint\`: PASS/FAIL (or N/A — why)\n- N/A\n- TBD\n<!-- fill me -->`, /only placeholders/],
    [`${role}\n\n### Evidence\n- exit 0`, /no '## Evidence' section/],
  ];
  for (const [prBody, expected] of failing) {
    const result = evaluate({ prBody, changed });
    assert.equal(result.ok, false, prBody);
    assert.match(result.errors.join("\n"), expected, prBody);
  }
  assert.deepEqual(meaningfulEvidenceLines("- N/A — policy-only change"), ["N/A — policy-only change"]);

  const noEvidenceNeeded = evaluate({ prBody: `Role: ${P}LIBRARIAN`, changed: files("portal/docs/readme.md") });
  assert.equal(noEvidenceNeeded.ok, true, noEvidenceNeeded.errors.join("\n"));
  assert.equal(noEvidenceNeeded.evidenceRequired, false);
});

test("blocked paths fail for every role, even with verifier bypass enabled", () => {
  const policy = basePolicy({ verifierBypassAllowedRoles: true });
  for (const blocked of [".env", "portal/dev.db", "vault/secret.txt", "portal/.env.local", "config/.env.production"]) {
    const result = evaluate({ policy, prBody: body(`Role: ${P}VERIFIER`), changed: files(blocked) });
    assert.equal(result.ok, false, blocked);
    assert.match(result.errors.join("\n"), /Blocked/, blocked);
  }
});

test("unreadable or invalid base policy fails closed", () => {
  assert.throws(() => decodeContentsResponse([{ type: "file" }]), /not a readable file/);
  assert.throws(() => decodeContentsResponse({ type: "file", encoding: "none", content: "" }), /not a readable file/);
  assert.throws(() => decodeContentsResponse({ type: "dir" }), /not a readable file/);
  assert.throws(() => decodeContentsResponse(undefined), /not a readable file/);
  const encoded = Buffer.from(JSON.stringify(basePolicy())).toString("base64");
  assert.equal(loadTrustedPolicy(decodeContentsResponse({ type: "file", encoding: "base64", content: encoded })).rolePrefix, P);

  assert.throws(() => loadTrustedPolicy(""), /empty/);
  assert.throws(() => loadTrustedPolicy(undefined), /empty/);
  assert.throws(() => loadTrustedPolicy("{not json"), /not valid JSON/);
  assert.throws(() => loadTrustedPolicy("[]"), /invalid/);
  assert.throws(() => loadTrustedPolicy(JSON.stringify({ ...basePolicy(), rules: [] })), /rules must be a non-empty array/);
  assert.throws(() => loadTrustedPolicy(JSON.stringify({ ...basePolicy(), rolePrefix: "" })), /rolePrefix/);
  assert.throws(() => loadTrustedPolicy(JSON.stringify(basePolicy({ knownRoles: ["OTHER::X::Y"] }))), /does not start with/);

  const invalid = evaluatePullRequest({ policy: { rules: "nope" }, body: `Role: ${P}VERIFIER`, files: files("a.ts") });
  assert.equal(invalid.ok, false);
  assert.match(invalid.errors[0], /^Trusted policy invalid/);
});

test("repository rolemap: valid, default-deny, VERIFIER-only workflows, CODEOWNERS, and CI guardrail scripts", () => {
  const policy = loadTrustedPolicy(readFileSync(path.join(repoRoot, "roles/rolemap.json"), "utf8"));
  assert.equal(policy.verifierBypassAllowedRoles, false);
  for (const [id, prefix] of [["github-workflows", ".github/workflows/"], ["github-codeowners", ".github/CODEOWNERS"], ["ci-guardrail-scripts", "portal/scripts/role-guardrails-policy.cjs"]]) {
    const rule = policy.rules.find((r) => r.id === id);
    assert.ok(rule, id);
    assert.ok(rule.pathsPrefix.includes(prefix), id);
    assert.deepEqual(rule.allowedRoles, [`${P}VERIFIER`], id);
    assert.equal(rule.evidenceRequired, true, id);
  }

  const a3g = files(
    "roles/rolemap.json", ".github/workflows/role-guardrails.yml", ".github/workflows/portal-ci-guardrails.yml", ".github/CODEOWNERS",
    "portal/scripts/role-guardrails-policy.cjs", "portal/scripts/role-guardrails-policy.test.cjs", "portal/scripts/control-plane-required-tests-v0.json",
    "portal/scripts/run-required-control-plane-tests.mjs", "portal/scripts/run-required-control-plane-tests.test.mjs",
    "docs/reference/q4m11y26-p2-a3-security-boundary-drill-and-reach-v0.md",
  );
  const asVerifier = evaluatePullRequest({ policy, body: body(`Role: ${P}VERIFIER`), files: a3g });
  assert.equal(asVerifier.ok, true, asVerifier.errors.join("\n"));
  const asBuilder = evaluatePullRequest({ policy, body: body(`Role: ${P}BUILDER`), files: a3g });
  assert.equal(asBuilder.ok, false);

  const a3iShaped = files(
    "portal/src/app/operator/motion-control/manual-inference/route.ts",
    "portal/src/app/operator/motion-control/manual-inference/route.test.ts",
    "docs/reference/q4m11y26-p2-a3-inference-and-kill-switch-drill-v0.md",
  );
  const builder = evaluatePullRequest({ policy, body: body(`Role: ${P}BUILDER`), files: a3iShaped });
  assert.equal(builder.ok, true, builder.errors.join("\n"));
});

test("role_guardrails workflow loads policy from the PR base SHA and never uses pull_request_target", () => {
  const workflow = readFileSync(path.join(repoRoot, ".github/workflows/role-guardrails.yml"), "utf8");
  assert.doesNotMatch(workflow, /^\s*pull_request_target\s*:/m, "pull_request_target must not be a trigger");
  assert.match(workflow, /^on:\r?\n {2}pull_request:\r?\n/m);
  assert.match(workflow, /ref:\s*baseSha/);
  assert.match(workflow, /baseSha = pr\.base && pr\.base\.sha/);
  assert.doesNotMatch(workflow, /readFileSync\([^)]*rolemap/);
  assert.match(workflow, /node --test portal\/scripts\/role-guardrails-policy\.test\.cjs/);
});
