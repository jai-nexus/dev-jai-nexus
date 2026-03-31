# motion-create — Motion Package Scaffolding

Scaffold a new DRAFT motion package for the kind and title specified in: `$ARGUMENTS`

You are operating as **LIBRARIAN** role inside dev-jai-nexus governance.

---

## Important constraints

This skill creates **template shells only**. It does not:
- ratify anything
- decide scope, program, or parent_motion (those require human judgment)
- run agents or touch runtime surfaces

The user must fill in proposal.md, challenge.md, and execution.md content after scaffolding.

---

## Steps

### 1 — Parse arguments

Parse `$ARGUMENTS` as: `<kind> <title>`

- `kind` — the first token (e.g. `codex-conditioning`)
- `title` — everything after the kind token (e.g. `Proof lane execution skill`)

If either is missing or ambiguous, stop and ask. Do not guess.

### 2 — Validate kind

`kind` must be one of the known motion kinds for this repo:

| Kind | Typical use |
|---|---|
| `documentation` | Plans, notes, design documents |
| `governance-closure` | Closing a governance gap or sweep |
| `post-proof-assessment` | Assessment after a proof series |
| `builder-proof` | Runtime proof of builder stage |
| `verifier-proof` | Runtime proof of verifier stage |
| `operator-closeout` | Operator review / approval closeout |
| `staged-activation-proof` | Full staged packet activation proof |
| `codex-conditioning` | Codex conditioning skills and evals |
| `codex-exec-policy` | Codex execution policy documents |
| `bootstrap-manifest` | Bootstrap manifest artifact creation |

If kind is not in this list, stop and report. Do not create a motion with an unknown kind.

### 3 — Determine next motion number

Use the Glob tool to list all directories matching `.nexus/motions/motion-????/`.
Find the highest four-digit number. The new motion number is that + 1, zero-padded to 4 digits.

Example: if the highest existing directory is `motion-0103`, the new motion ID is `motion-0104`.

### 4 — Create the six-file draft package

Create `.nexus/motions/{motionId}/` with exactly these six files. Use the exact
templates below — substitute `{motionId}`, `{kind}`, `{title}`, and the current
ISO 8601 date/timestamp where shown.

---

**`motion.yaml`**
```yaml
protocol_version: "0.3.8"
motion_id: {motionId}
kind: {kind}
status: proposed
title: "{title}"
program: offbook-ai-bootstrap
# parent_motion: motion-XXXX   # set if this extends a prior motion; requires judgment
proposer_nh_id: "6.0.1"
council_nh_id: "6.0"
target:
  repo: dev-jai-nexus
  domain: dev.jai.nexus
required_gates: [validate_motion, validate_agency]
created_at: "{current ISO 8601 timestamp}"
```

---

**`proposal.md`**
```markdown
# Proposal: {title}

**Motion:** {motionId}
**Date:** {YYYY-MM-DD}
**Kind:** {kind}

## Context

<!-- What precedes this motion? What state does the repo/program need to be in? -->

## Problem

<!-- What gap or need does this motion address? -->

## Approach

<!-- What will be created, changed, or proven? List primary artifacts. -->

## Non-goals

<!-- What is explicitly out of scope? -->

## Success criteria

<!-- What must be true for this motion to be considered complete? -->
```

---

**`challenge.md`**
```markdown
# Challenge: {title}

**Motion:** {motionId}
**Date:** {YYYY-MM-DD}

<!-- Challenge each significant assumption, scope claim, or design choice in the proposal. -->
<!-- Use Q&A format. End with a resolution statement. -->

## Resolution

No blocking challenge identified. Proceed to execution.
```

---

**`execution.md`**
```markdown
# Execution: {title}

**Motion:** {motionId}
**Role:** <!-- ARCHITECT / BUILDER / VERIFIER / LIBRARIAN / OPERATOR -->
**Date:** {YYYY-MM-DD}

## Scope

<!-- What files are created or changed? List them explicitly. -->

## Steps

<!-- Numbered steps. Include commands run and their exact output. -->

## Evidence

<!-- Bullet list of completed proof points. -->

## Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/{motionId}/motion.yaml
→ EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ EXIT: 0
```
```

---

**`decision.yaml`**
```yaml
protocol_version: "0.3.8"
motion_id: {motionId}
status: DRAFT
ratified_by: null
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_gates: [validate_motion, validate_agency]
last_updated: "{current ISO 8601 timestamp}"
notes: "DRAFT: {title}"
```

---

**`decision.md`**
```markdown
# Decision: {title}

**Motion:** {motionId}
**Kind:** {kind}

## Status

DRAFT

## Summary

<!-- Fill in after execution is complete. -->
```

---

### 5 — Validate the scaffold

Run gate validation on the new motion.yaml:

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/{motionId}/motion.yaml
```

If this exits non-zero, report the schema error immediately. Do not proceed further until fixed.
Do **not** run `validate-agency.mjs` at this stage — that is a ratification-time gate.

### 6 — Report

Print:
- The new motion ID and directory path
- The 6 files created
- The validate-motion result
- Which fields the user must fill in: proposal.md context/problem/approach, challenge.md challenges, execution.md steps and evidence, parent_motion if applicable
- Suggested next step: fill in proposal.md, then run `/motion-ratify {motionId}` when complete

---

## Hard constraints

- **Do NOT** fill in proposal.md, challenge.md, or execution.md content — leave the shells.
- **Do NOT** set `parent_motion` in motion.yaml — leave it commented out.
- **Do NOT** run `validate-agency.mjs` during scaffolding.
- **Do NOT** create a motion with a kind not in the known kinds table.
- **Do NOT** ratify, vote, or create `vote.json`, `verify.json`, or `policy.yaml`.
- **Do NOT** modify any existing motion package.
- **Do NOT** commit unless explicitly asked.
- **Do NOT** create more than one motion package per invocation.
