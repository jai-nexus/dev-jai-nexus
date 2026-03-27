# Proposal - motion-0057

## Title
Motion Factory v0 — evidence insertion for proof motions

## Why this motion exists
Proof motions require the operator to manually copy terminal output, command
logs, and expected-vs-actual results into proposal.md and execution.md.
In motions 0049 through 0051, this was done by hand — pasting scaffold
output, score results, and selection behavior into narrative files.

The factory can draft and revise narrative content, but has no path for
inserting real externally-sourced evidence. This motion adds that path.

## What this motion adds

### evidence command in portal/scripts/motion-factory.mjs

**Invocation:**
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0057 --evidence-file proof-output.txt
```

**With operator notes:**
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0057 --evidence-file proof-output.txt --notes "All 5 panels scaffolded with 2 candidates"
```

**With narrow file selection:**
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0057 --evidence-file proof-output.txt --files execution.md
```

**What it does:**
1. Validates --motion and --evidence-file are provided
2. Validates the target motion directory exists
3. Reads the evidence file as raw text
4. Validates the evidence file is non-empty
5. Reads existing draft files from the target motion directory
6. Gathers repo context (reuses existing context logic)
7. Calls the OpenAI API with existing content + evidence payload + operator
   notes, instructing the model to organize and place the evidence
8. Validates complete response for all targeted files (all-or-nothing)
9. Overwrites targeted narrative files atomically
10. Prints a summary of updated files and human-review reminder

**Default evidence insertion scope:**
- `proposal.md`
- `execution.md`

**Allowed scope (with --files):**
- `proposal.md`
- `execution.md`
- `challenge.md`

**Never updated by evidence command:**
- `motion.yaml`
- `policy.yaml`
- `decision.yaml`
- `decision.md`
- `vote.json`
- `verify.json`

## Critical design boundary: evidence-fed, not evidence-inventing
The model receives the raw evidence as input and is instructed to:
- organize the provided evidence into the appropriate narrative sections
- place terminal output, command logs, and results where they belong
- summarize evidence only when the source material supports it

The model is **explicitly prohibited** from:
- inventing PASS/FAIL claims not present in the evidence
- adding proof results that were not in the evidence file
- claiming tests passed or failed beyond what the evidence shows
- generating vote entries, vote rationales, or ratification claims

This boundary is enforced in the system prompt and verified by human review.

## How evidence differs from revision
| | revise | evidence |
|---|--------|----------|
| Input | human revision notes | real evidence file + optional notes |
| Purpose | tighten/rewrite narrative | insert proof/test results |
| Default scope | proposal.md, challenge.md, execution.md | proposal.md, execution.md |
| motion.yaml | allowed (opt-in, narrative only) | never |
| Trust model | narrative generation from notes | evidence organization from source |

## Failure semantics

### Missing --motion or --evidence-file
Clear error before any file access.

### Evidence file missing or empty
Clear error. No file generation.

### Target motion directory does not exist
Clear error.

### --files includes a disallowed file
Clear error listing the disallowed file and the allowed set.

### Missing OPENAI_API_KEY
Clear error before API call.

### API failure during evidence insertion
Existing files are not overwritten. Warning printed. Draft remains in
its pre-evidence state.

### Incomplete API response
If the model does not return content for all targeted files, no files
are overwritten (all-or-nothing).

## What this motion does not add
- No revision behavior changes (revise remains unchanged)
- No Anthropic or multi-provider support
- No motion.yaml evidence insertion
- No structural file updates

## Design stance
Evidence insertion is the narrowest possible factory extension for proof
motions. It accepts real evidence as input and helps the operator place it
correctly. It does not generate or infer proof. The hard boundary between
source-fed evidence and model-generated narrative is the most important
trust property of this command.

## Why now
The factory workflow is proven end-to-end. The remaining manual overhead
is concentrated in proof motions where terminal output must be organized
into narrative files. This is the next highest-leverage reduction in
manual authoring effort.
