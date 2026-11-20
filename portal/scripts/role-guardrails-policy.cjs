"use strict";

// Pure role / path / evidence policy for .github/workflows/role-guardrails.yml.
// No network, filesystem, or process access: the workflow fetches the trusted
// rolemap from the PR base SHA and passes it in. Q4M11Y26-P2:A3 Packet A3-G.

const ROLE_DECLARATION =
  /^[ \t]{0,3}(?:[-*+][ \t]+)?(\*\*|__)?[ \t]*role[ \t]*(?::[ \t]*\1|\1[ \t]*:)(.*)$/i;
const FENCE_OPEN = /^[ \t]{0,3}(`{3,}|~{3,})(.*)$/;
const FENCE_CLOSE = /^[ \t]{0,3}(`{3,}|~{3,})[ \t]*$/;
const H2_BOUNDARY = /^[ \t]{0,3}##[ \t]+\S/;

function normalizeNewlines(text) {
  return String(text ?? "").replace(/\r\n?/g, "\n");
}

// Blanks every HTML comment (an unterminated one runs to the end of the
// body), keeping newlines so line positions are unchanged.
function maskHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?(?:-->|$)/g, (comment) => comment.replace(/[^\n]/g, " "));
}

// Classifies each line, CommonMark-style, after masking HTML comments:
// "content", "fence" (an opening or closing fence line), or "code" (inside a
// fence). A fence closes only on a line holding the same character, at least
// as many, and nothing else. An unclosed fence runs to the end of the body.
function scanLines(text) {
  const out = [];
  let fence = null;
  for (const line of maskHtmlComments(normalizeNewlines(text)).split("\n")) {
    if (fence) {
      const close = FENCE_CLOSE.exec(line);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) {
        fence = null;
        out.push({ text: line, kind: "fence" });
      } else {
        out.push({ text: line, kind: "code" });
      }
      continue;
    }
    const open = FENCE_OPEN.exec(line);
    // A backtick fence's info string may not contain backticks ("```x```" is inline code).
    if (open && !(open[1][0] === "`" && open[2].includes("`"))) {
      fence = open[1];
      out.push({ text: line, kind: "fence" });
      continue;
    }
    out.push({ text: line, kind: "content" });
  }
  return out;
}

// Lines outside fenced code blocks and HTML comments.
function declarativeLines(body) {
  return scanLines(body).filter((line) => line.kind === "content").map((line) => line.text);
}

function unwrapInlineMarkdown(value) {
  let v = value.trim();
  for (;;) {
    const m = /^(`+|\*\*|__|\*|_)([\s\S]*)\1$/.exec(v);
    if (!m) return v;
    v = m[2].trim();
  }
}

function knownRolesOf(policy) {
  if (Array.isArray(policy.knownRoles)) return [...policy.knownRoles];
  const roles = new Set(policy.defaultAllowedRoles || []);
  for (const rule of policy.rules || []) for (const role of rule.allowedRoles || []) roles.add(role);
  return [...roles];
}

function parseRoleDeclarations(body) {
  const declarations = [];
  for (const line of declarativeLines(body)) {
    const m = ROLE_DECLARATION.exec(line);
    if (m) declarations.push(unwrapInlineMarkdown(m[2]));
  }
  return declarations;
}

function resolveDeclaredRole(body, policy) {
  const prefix = policy.rolePrefix;
  const known = knownRolesOf(policy);
  const declarations = parseRoleDeclarations(body);
  const usage = `Declare exactly one line: Role: ${prefix}<${known.map((r) => r.slice(prefix.length)).join("|")}>`;
  if (declarations.length === 0) return { ok: false, reason: `Missing 'Role:' declaration in PR body. ${usage}` };
  if (declarations.length > 1) {
    return { ok: false, reason: `Found ${declarations.length} 'Role:' declarations (${declarations.map((d) => JSON.stringify(d)).join(", ")}); exactly one is required. ${usage}` };
  }
  const raw = declarations[0];
  const candidate = raw.toUpperCase();
  if (!/^[A-Z]+::[A-Z]+::[A-Z_]+$/.test(candidate) || !candidate.startsWith(prefix)) {
    return { ok: false, reason: `Malformed Role ${JSON.stringify(raw)}. ${usage}` };
  }
  if (!known.includes(candidate)) return { ok: false, reason: `Unknown Role ${JSON.stringify(raw)}. ${usage}` };
  return { ok: true, role: candidate };
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Content of the first top-level "## <title>" section, up to the next
// top-level H2 heading or the end of the body. Headings inside fenced code
// blocks or HTML comments are ignored, both as the section start and as its
// end. Comments in the returned text are blanked. Returns null when there is
// no top-level heading.
function extractH2Section(body, title) {
  const heading = new RegExp(`^[ \\t]{0,3}##[ \\t]+${escapeRegExp(title)}[ \\t]*#*[ \\t]*$`, "i");
  const lines = scanLines(body);
  const start = lines.findIndex((line) => line.kind === "content" && heading.test(line.text));
  if (start === -1) return null;
  const content = [];
  for (const line of lines.slice(start + 1)) {
    if (line.kind === "content" && H2_BOUNDARY.test(line.text)) break;
    content.push(line.text);
  }
  return content.join("\n").trim();
}

const HTML_TAGS = new Set([
  "a", "abbr", "b", "blockquote", "br", "code", "del", "details", "div", "em", "hr", "i", "img", "ins",
  "kbd", "li", "mark", "ol", "p", "pre", "s", "samp", "small", "span", "strong", "sub", "summary", "sup",
  "table", "tbody", "td", "th", "thead", "tr", "u", "ul",
]);

// Unfilled angle-bracket template slots such as <why>, <reason>, <Insert ...>,
// <cmd> or <Required | N/A>. Autolinks, emails, common HTML tags and anything
// inside inline code spans do not count.
function templateSlots(line) {
  const outsideCode = line.replace(/(`+)[\s\S]*?\1/g, " ");
  const slots = [];
  for (const match of outsideCode.matchAll(/<([^<>\n]*)>/g)) {
    const inner = match[1].trim();
    if (/^[a-z][a-z0-9+.-]*:\S+$/i.test(inner)) continue;
    if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(inner)) continue;
    const tag = /^\/?([a-z][a-z0-9]*)(?:[ \t][^<>]*)?\/?$/i.exec(inner);
    if (tag && HTML_TAGS.has(tag[1].toLowerCase())) continue;
    slots.push(match[0]);
  }
  return slots;
}

// Whole-line placeholders: N/A with nothing after it but punctuation,
// "why" or "explain why"; TBD/TODO/none/WIP-style stubs; a bare "Evidence:";
// and template PASS/FAIL lines.
function isPlaceholderText(text) {
  const trimmed = text.replace(/[\s.:;,!?—–-]+$/u, "").trim();
  if (/^(?:n\/?a|tbd|tba|todo|none|wip|pending|placeholder|fill(?:[ \t]+(?:me|in))?|\.{3}|…)$/i.test(trimmed)) return true;
  if (/^evidence$/i.test(trimmed)) return true;
  const notApplicable = /^n\/?a[\s:—–-]*(.*)$/i.exec(trimmed);
  if (notApplicable && /^\(?(?:(?:explain[ \t]+)?(?:why|reason))?\)?$/i.test(notApplicable[1].trim())) return true;
  return /PASS\/FAIL/.test(trimmed);
}

// Evidence lines that count: top-level content (not fenced code, not HTML
// comments, not headings) after bullet and checkbox markers are removed, with
// no unfilled template slot, and not a placeholder. Fenced output may appear
// in Evidence but cannot satisfy the requirement on its own.
function meaningfulEvidenceLines(text) {
  const meaningful = [];
  for (const { text: rawLine, kind } of scanLines(text)) {
    if (kind !== "content") continue;
    let line = rawLine.trim();
    if (!line || /^#{1,6}([ \t]|$)/.test(line)) continue;
    line = line.replace(/^(?:[-*+]|\d+[.)])[ \t]+/, "").replace(/^\[[ xX]\][ \t]*/, "").trim();
    if (templateSlots(line).length > 0) continue;
    const plain = line.replace(/<\/?[a-z][^<>]*>/gi, " ").replace(/[`*_~]+/g, "").trim();
    if (!/[a-z0-9]/i.test(plain) || isPlaceholderText(plain)) continue;
    meaningful.push(line);
  }
  return meaningful;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0);
}

function validatePolicy(policy) {
  const errors = [];
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) return { ok: false, errors: ["policy is not a JSON object"] };
  const prefix = policy.rolePrefix;
  if (typeof prefix !== "string" || !/^[A-Z]+::[A-Z]+::$/.test(prefix)) errors.push("rolePrefix must look like 'JAI::DEV::'");
  if ("verifierBypassAllowedRoles" in policy && typeof policy.verifierBypassAllowedRoles !== "boolean") {
    errors.push("verifierBypassAllowedRoles must be a boolean when present");
  }
  for (const key of ["blockedPrefixes", "blockedExact"]) {
    if (key in policy && !isStringArray(policy[key])) errors.push(`${key} must be an array of non-empty strings`);
  }
  if (!isStringArray(policy.defaultAllowedRoles)) errors.push("defaultAllowedRoles must be an array of non-empty strings");
  if (!Array.isArray(policy.rules) || policy.rules.length === 0) {
    errors.push("rules must be a non-empty array");
  } else {
    policy.rules.forEach((rule, index) => {
      const at = `rules[${index}]`;
      if (!rule || typeof rule !== "object") return errors.push(`${at} is not an object`);
      if (typeof rule.id !== "string" || !rule.id) errors.push(`${at}.id must be a non-empty string`);
      if (!isStringArray(rule.pathsPrefix) || rule.pathsPrefix.length === 0) errors.push(`${at}.pathsPrefix must be a non-empty string array`);
      if (!isStringArray(rule.allowedRoles)) errors.push(`${at}.allowedRoles must be a string array`);
      if ("evidenceRequired" in rule && typeof rule.evidenceRequired !== "boolean") errors.push(`${at}.evidenceRequired must be a boolean`);
    });
  }
  if ("knownRoles" in policy && (!isStringArray(policy.knownRoles) || policy.knownRoles.length === 0)) {
    errors.push("knownRoles must be a non-empty string array when present");
  }
  if ("evidenceSectionTitle" in policy && (typeof policy.evidenceSectionTitle !== "string" || !policy.evidenceSectionTitle.trim())) {
    errors.push("evidenceSectionTitle must be a non-empty string when present");
  }
  if (errors.length === 0) {
    for (const role of knownRolesOf(policy)) if (!role.startsWith(prefix)) errors.push(`role ${role} does not start with ${prefix}`);
  }
  return { ok: errors.length === 0, errors };
}

// Accepts a GitHub contents API response (raw string or base64 file object).
function decodeContentsResponse(data) {
  if (typeof data === "string") return data;
  if (data && !Array.isArray(data) && data.type === "file" && data.encoding === "base64" && typeof data.content === "string") {
    return Buffer.from(data.content, "base64").toString("utf8");
  }
  throw new Error("contents response is not a readable file");
}

function loadTrustedPolicy(rawText) {
  if (typeof rawText !== "string" || rawText.trim() === "") throw new Error("trusted base policy is empty");
  let policy;
  try {
    policy = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`trusted base policy is not valid JSON: ${error.message}`);
  }
  const validation = validatePolicy(policy);
  if (!validation.ok) throw new Error(`trusted base policy is invalid: ${validation.errors.join("; ")}`);
  return policy;
}

function matchRule(policy, filePath) {
  for (const rule of policy.rules) for (const prefix of rule.pathsPrefix) if (filePath.startsWith(prefix)) return rule;
  return null;
}

function blockedReason(policy, filePath) {
  if ((policy.blockedExact || []).includes(filePath)) return `Blocked file changed: ${filePath}`;
  for (const prefix of policy.blockedPrefixes || []) if (filePath.startsWith(prefix)) return `Blocked path changed: ${filePath}`;
  if (filePath.includes(".env")) return `Blocked: env-related file changed: ${filePath}`;
  return null;
}

// files: [{ filename, previous_filename? }] from pulls.listFiles. A rename is
// checked against both its old and its new path.
function evaluatePullRequest({ policy, body, files }) {
  const validation = validatePolicy(policy);
  if (!validation.ok) return { ok: false, errors: validation.errors.map((e) => `Trusted policy invalid: ${e}`), evidenceRequired: false, verifierBypass: false };

  const errors = [];
  const declared = resolveDeclaredRole(body, policy);
  if (!declared.ok) errors.push(declared.reason);
  const role = declared.ok ? declared.role : null;
  const verifierBypass = Boolean(policy.verifierBypassAllowedRoles === true);
  const isVerifier = role === `${policy.rolePrefix}VERIFIER`;

  const paths = [];
  for (const file of files || []) {
    for (const p of [file.filename, file.previous_filename]) if (typeof p === "string" && p && !paths.includes(p)) paths.push(p);
  }

  let evidenceRequired = false;
  for (const filePath of paths) {
    const blocked = blockedReason(policy, filePath);
    if (blocked) errors.push(blocked);
    const rule = matchRule(policy, filePath);
    const allowed = rule ? rule.allowedRoles : policy.defaultAllowedRoles;
    if (rule && rule.evidenceRequired === true) evidenceRequired = true;
    if (role && !(isVerifier && verifierBypass) && !allowed.includes(role)) {
      errors.push(`Role '${role}' is not allowed to change ${filePath} (rule: ${rule ? rule.id : "default"}; allowed: ${allowed.join(", ")})`);
    }
  }

  if (evidenceRequired) {
    const title = (policy.evidenceSectionTitle || "Evidence").trim();
    const section = extractH2Section(body, title);
    if (section === null) {
      errors.push(`Evidence required, but no '## ${title}' section was found in the PR body.`);
    } else if (meaningfulEvidenceLines(section).length === 0) {
      errors.push(`Evidence required, but the '## ${title}' section is empty or contains only placeholders.`);
    }
  }

  return { ok: errors.length === 0, role, errors, evidenceRequired, verifierBypass, checkedPaths: paths };
}

module.exports = {
  decodeContentsResponse,
  evaluatePullRequest,
  extractH2Section,
  loadTrustedPolicy,
  meaningfulEvidenceLines,
  parseRoleDeclarations,
  resolveDeclaredRole,
  validatePolicy,
};
