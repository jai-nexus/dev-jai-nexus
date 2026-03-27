# Proposal - motion-0060

## Title
Motion Factory v0 — operator playbook and canonical workflow

## Why this motion exists
Motion Factory v0 is fully built and proven across motions 0052–0059:
context, draft, revise, evidence, dual-provider support, parity proof.
But the practical operator workflow is scattered across motion artifacts
and chat history. A new operator (or the same operator in a new session)
has no single reference for how to use the factory correctly.

This motion creates that reference.

## What this motion adds

### .nexus/docs/motion-factory-playbook.md

A single canonical playbook covering six sections, each with concrete
CLI examples where applicable.

**1. Placeholder-first workflow**
- Every new motion starts with `motion-factory.mjs draft`
- Do not manually create the 9-file package from scratch
- Review and revise the generated package before ratification

**2. Command guide (with concrete examples)**

Each command includes copy-pastable CLI examples:
```
node portal/scripts/motion-factory.mjs context --intent "Reconcile model-routing.yaml with Phase 1 canon"
```
```
node portal/scripts/motion-factory.mjs draft --intent "Reconcile model-routing.yaml with Phase 1 canon"
```
```
node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup motion" --provider anthropic
```
```
node portal/scripts/motion-factory.mjs draft --intent "Quick scaffold" --no-api
```
```
node portal/scripts/motion-factory.mjs revise --motion motion-0060 --notes "Tighten proposal scope to one file change"
```
```
node portal/scripts/motion-factory.mjs revise --motion motion-0060 --notes "Rewrite summary" --files motion.yaml --provider anthropic
```
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0060 --evidence-file proof-output.txt --notes "All 5 panels scaffolded"
```
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0060 --evidence-file proof-output.txt --provider anthropic
```

Command details:
- `context --intent "..."` — inspect repo state and motion context before
  generation. No files written, no API calls. Useful for verifying the
  factory sees the right recent motions and governance state.
- `draft --intent "..."` — create a 9-file motion package. Structural files
  are deterministic. Narrative files are model-generated (or placeholder
  with --no-api). Does not overwrite existing motion directories.
- `revise --motion motion-NNNN --notes "..."` — update narrative files in
  an existing draft. Narrower than draft: default scope is proposal.md,
  challenge.md, execution.md. motion.yaml opt-in via --files. Atomic writes.
  Structural governance files never touched.
- `evidence --motion motion-NNNN --evidence-file path` — insert real
  operator-provided evidence into proof-motion narrative files. Narrower
  than revise: default scope is proposal.md, execution.md. Never touches
  motion.yaml. Evidence-fed only: model organizes provided evidence, never
  invents results. Atomic writes.

**3. Provider guide**
- OpenAI is the default provider when --provider is omitted
- Anthropic is available via `--provider anthropic`
- Provider choice is operator-selected, not auto-routed
- Both providers preserve the same trust boundaries
- Both providers are proven for functional parity (motion-0059)
- Provider choice does not affect structural governance files
- Default behavior (no --provider flag) always uses OpenAI

**4. Trust boundaries**
- Structural governance files (policy.yaml, decision.yaml, decision.md,
  vote.json, verify.json) are always deterministically generated
- Narrative content is DRAFT-only and requires human review
- Evidence insertion is source-fed: the model may quote, organize, and
  place provided evidence but must not invent PASS/FAIL claims or
  proof results
- The factory never generates vote entries, vote rationales, or
  ratification claims
- Human review before council:run is mandatory

**5. Recommended end-to-end workflow**
1. Define intent (decide what the motion should do)
2. Optionally run `context --intent "..."` to inspect repo state
3. Run `draft --intent "..."` to generate the 9-file package
4. Review the generated package
5. Run `revise --motion motion-NNNN --notes "..."` to tighten narrative
6. For proof motions: save terminal evidence to a file, run
   `evidence --motion motion-NNNN --evidence-file path`
7. Final human review (check diffs, verify no drift)
8. Run `council-run.mjs motion-NNNN` to execute gates and vote
9. Commit

**6. Failure handling and operator hygiene**
- Always check stdout after each command
- Inspect diffs before committing: `git diff .nexus/motions/motion-NNNN/`
- Prefer small targeted revisions over broad rewrites
- Keep proof evidence in files, not memory or chat
- If API fails, check the warning — structural files are preserved,
  narrative falls back to placeholders
- Verify no unintended file drift before ratification
- If a draft directory needs to be re-created, delete it manually first

**Provenance**
Motion Factory v0 was built and proven across motions 0052–0059:
- 0052: context gathering scaffold
- 0053: deterministic package scaffold
- 0054: OpenAI narrative generation
- 0055: revision command with atomic writes
- 0056: full-cycle proof and placeholder-first convention
- 0057: evidence insertion
- 0058: Anthropic provider extension
- 0059: provider parity proof

## What this motion does not change
- No code changes to motion-factory.mjs
- No governance config changes
- No staffing canon changes
- No new commands or features

## Design stance
This is a pure documentation motion. It canonizes the operator workflow
that has been proven across motions 0052–0059. The playbook reduces
dependence on session memory and makes the factory usable by any operator
in any session.

## Why now
The factory is complete and dual-provider proven. Before any future
expansion (v1 planning, enforcement gates, challenger generation), the
existing v0 workflow should be documented as a stable reference.
