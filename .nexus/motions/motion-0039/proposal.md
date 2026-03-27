# Proposal - motion-0039

## Title
Claude Setup Validation v0: first-project workflow + upload routine + handoff checklist

## Why this motion exists
Motion-0036 established the Claude-facing repo artifacts.
Motion-0037 established a generated Claude bootstrap pack.
Motion-0038 polished the generator and added a simple package command.

That means the technical side of Claude setup now exists.

The remaining gap is human workflow validation.

dev-jai-nexus still needs a governed answer to:
- what exactly should be uploaded or read first,
- what order should Claude context be introduced in,
- how should a new Claude project or chat be started,
- what checklist should be followed before meaningful work begins.

Without that, the bootstrap pack remains useful but partially informal in practice.

## What this motion changes
This motion validates Claude setup as an actual operating routine.

It should introduce:
1. a first-project setup workflow,
2. a recommended upload/read order,
3. a reusable handoff checklist,
4. a validation note showing how the generated bootstrap pack fits into the workflow.

## Why this matters
JAI NEXUS is trying to reduce recontextualization and improve governed multi-model work.

A polished bootstrap generator is valuable, but the next leverage step is making setup repeatable for the human operator.

This motion turns:
- "we have the files"
into
- "we know how to use them consistently."

## Suggested artifact set
A clean v0 could include:

- `.nexus/claude/first-project-workflow.md`
- `.nexus/claude/upload-order.yaml`
- `.nexus/claude/handoff-checklist.md`
- `.nexus/claude/setup-validation.md`

If the repo prefers slightly different names, preserve the same conceptual roles.

## Design stance
This motion should remain operational and compact.

It should:
- help immediate repeated use,
- rely on existing substrate and generator artifacts,
- stay repo-centric,
- avoid abstract prompt theory,
- avoid expanding into automation.

## Why now
This is the right next step because the Claude bootstrap layer is already proven and polished. The next highest-value move is validating how it should actually be used.
