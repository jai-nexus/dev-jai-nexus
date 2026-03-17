# Proposal - motion-0055

## Title
Motion Factory v0 — revision command

## Why this motion exists
motion-0054 completed the draft path: one command generates a reviewable
9-file motion package. But after initial generation, the human still
manually edits narrative files to incorporate feedback, tighten scope,
or fix issues raised during review. This revision overhead is the next
bottleneck.

A bounded `revise` command that re-generates selected narrative files
from human notes reduces iteration time without broadening factory authority.

## What this motion adds

### revise command in portal/scripts/motion-factory.mjs

**Invocation:**
```
node portal/scripts/motion-factory.mjs revise --motion motion-0055 --notes "Narrow scope: only touch proposal.md, remove references to multi-provider"
```

**With explicit file selection:**
```
node portal/scripts/motion-factory.mjs revise --motion motion-0055 --notes "Tighten challenge risks" --files challenge.md
```

**Including motion.yaml narrative fields:**
```
node portal/scripts/motion-factory.mjs revise --motion motion-0055 --notes "Rewrite summary to be more concise" --files motion.yaml
```

**What it does:**
1. Validates that --motion and --notes are provided
2. Validates that the target motion directory exists
3. Reads existing draft files from the target motion directory
4. Gathers repo context (reuses context-gathering logic)
5. Calls the OpenAI API with existing content + context + revision notes
6. Overwrites the targeted narrative files with revised content
7. Prints a summary of revised files and a human-review reminder

**Default revise scope (no --files flag):**
- `proposal.md`
- `challenge.md`
- `execution.md`

**Allowed revise scope (with --files flag):**
- `proposal.md`
- `challenge.md`
- `execution.md`
- `motion.yaml` (narrative fields only: summary, problem, proposal,
  non_goals, success_criteria — structural fields preserved)

**Never revised:**
- `policy.yaml`
- `decision.yaml`
- `decision.md`
- `vote.json`
- `verify.json`

Requesting a file outside the allowed set produces a clear error.

**What the model receives as input:**
- the existing content of the targeted file(s)
- the context payload (recent motions, governance config, staffing summary,
  panel summary)
- the human revision notes from --notes
- the original intent from the existing motion.yaml title

**Hard rules for revised content:**
- No evidence tables or PASS/FAIL claims
- No executed test-result claims
- No vote entries or vote rationales
- No ratification claims
- Revised content is draft-quality, not presented as final

## Failure semantics

### Missing --motion or --notes
Clear error before any file access. No partial output.

### Target motion directory does not exist
Clear error. No file creation.

### --files includes a disallowed file
Clear error listing the disallowed file and the allowed set.

### Missing OPENAI_API_KEY
Clear error before API call.

### API failure during revision
Existing files are not overwritten. Warning printed to stdout. The draft
remains in its pre-revision state.

## What this motion does not add
- No evidence insertion
- No Anthropic or multi-provider support
- No structural file revision
- No overwrite of governance artifacts
- No new commands beyond revise

## Design stance
Revision is narrower than drafting. The `draft` command creates all 9 files.
The `revise` command only touches narrative files, only when the human
provides explicit revision notes, and only within the allowed file set.
This asymmetry is intentional: structural governance artifacts should not
drift through casual revision.

## Why now
The draft path is complete. The next pain is revision friction. Adding
`revise` now means the full author-review-revise cycle can be completed
through the factory, which is the primary goal of Motion Factory v0.
