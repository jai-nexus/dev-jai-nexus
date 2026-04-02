# Proposal: Establish GitHub CLI-first operator posture — add operator flow doc and update Codex exec policy

**Motion:** motion-0115
**Kind:** governance-policy
**Date:** 2026-04-02

## Problem

dev-jai-nexus has no governed operator posture for GitHub-native repo actions
(branch push, PR creation, PR inspection, PR merge). The existing operator
docs stop at `git commit`. GitHub CLI (`gh`) is entirely absent from:

- `codex-exec-policy.md` — the handoff protocol names Codex as the executor
  for ratification and commit steps; no mention of GitHub-native actions
- `motion-factory-playbook.md` — the end-to-end workflow ends at `git commit`
- `operating-workflow.md` — entirely local; no GitHub-native guidance

The `codex-exec-policy.md` §4 handoff protocol implies Codex is the default
executor for all repo operations. This creates an ambiguous boundary: the
policy does not distinguish between local governance actions (where local
scripts are correct) and GitHub-native actions (where GitHub CLI is the right
tool and Codex is at best optional).

## Proposed repair

A docs/policy-only slice:

1. Add `.nexus/docs/github-cli-operator-flow.md` — the primary operator
   reference for GitHub-native actions in dev-jai-nexus. Covers: auth setup,
   branch workflow, PR creation, PR inspection, PR merge. Establishes the
   four-way tool precedence (GitHub CLI / local scripts / Claude / ChatGPT).

2. Amend `.nexus/codex/codex-exec-policy.md` — add §9 "Operator tool
   precedence" establishing that GitHub-native actions default to GitHub CLI,
   local governance actions default to local scripts, and Codex is optional
   (not default) for both.

3. Amend `.nexus/codex/README.md` — add a posture note that Codex is optional,
   not the default executor, for repo operations.

## What this does NOT do

- Does not remove Codex from the repo
- Does not delete or rewrite existing Codex policy sections
- Does not change runtime, UI, DB, or portal behavior
- Does not replace local governance scripts (validate-motion, validate-agency,
  council-run) with GitHub CLI
- Does not add package.json scripts
- Does not widen into `motion-factory-playbook.md` or `operating-workflow.md`

## Scope

Files created:

```
.nexus/docs/github-cli-operator-flow.md         (create)
```

Files edited:

```
.nexus/codex/codex-exec-policy.md               (edit: append §9)
.nexus/codex/README.md                          (edit: add posture note)
```

No other files changed. No scripts, runtime, UI, or DB changes.
