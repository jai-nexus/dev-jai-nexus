# Proposal - motion-0054

## Title
Motion Factory v0 — first proposer generation lane via OpenAI API

## Why this motion exists
motion-0053 proved that the factory can scaffold a structurally correct 9-file
package, but the narrative files are empty stubs. The human still writes all
narrative content by hand. That is the remaining drafting bottleneck.

The context payload (motion-0052) and structural scaffold (motion-0053)
provide the foundation. This motion adds the first working provider-backed
narrative generation path using the OpenAI API.

## What this motion changes

### portal/scripts/motion-factory.mjs

The `draft` command gains an API-backed narrative generation path:

1. Gather context (existing, unchanged)
2. Determine next motion ID (existing, unchanged)
3. Check target directory does not exist (existing, unchanged)
4. Generate deterministic structural files (existing, unchanged)
5. Call the OpenAI API with context + intent to generate narrative content
6. Assemble final files combining deterministic structure + model narrative
7. Write all 9 files to the motion directory

**Invocation:**
```
node portal/scripts/motion-factory.mjs draft --intent "Reconcile model-routing.yaml with Phase 1 canon"
```

**With API disabled (preserves motion-0053 behavior):**
```
node portal/scripts/motion-factory.mjs draft --intent "..." --no-api
```

**What the model generates:**
- `motion.yaml` narrative fields: summary, problem, proposal, non_goals,
  success_criteria
- `proposal.md`: full narrative
- `challenge.md`: full narrative
- `execution.md`: full narrative

**What remains deterministic:**
- `motion.yaml` structural fields: motion_id, title, status, created_at,
  owner, target, vote config
- `policy.yaml`: protocol version, vote mode, required voters, risk defaults
- `decision.yaml`: DRAFT scaffold
- `decision.md`: DRAFT placeholder
- `vote.json`: PENDING scaffold
- `verify.json`: pending scaffold

**API details:**
- Provider: OpenAI
- API key: read from `process.env.OPENAI_API_KEY`
- If key is missing in API mode: clear error before generation
- If API call fails after scaffolding begins: structural files kept,
  narrative falls back to placeholder content, visible warning printed
- The prompt includes the context payload (recent motions, governance config,
  staffing summary, panel summary) plus the human intent

**Hard rules for generated content:**
- No evidence tables or PASS/FAIL claims
- No executed test-result claims
- No vote entries or vote rationales
- No ratification claims
- Content is draft-quality, not presented as final or evidence-backed

## Failure semantics

### Case A: --no-api
Deterministic placeholder scaffold only. No API call attempted.
Preserves motion-0053 behavior exactly.

### Case B: API mode, OPENAI_API_KEY missing
Clear error before any file generation. No partial output.

### Case C: API mode, key present, API call fails
Deterministic structural files are kept. Narrative files fall back to
clearly marked placeholder content. Visible warning printed to stdout.

## What this motion does not add
- No revision command
- No multi-provider generation
- No evidence insertion from terminal output
- No overwrite/force behavior

## Design stance
This motion completes the core draft path for Motion Factory v0: context
gathering + deterministic scaffolding + model-assisted narrative. The split
between deterministic structure and model-generated narrative is preserved.
The model fills in what a human would otherwise write by hand.

## Why now
The factory has context and scaffolding. Adding narrative generation
completes the draft command and delivers the primary relief: a human can
run one command and get a reviewable motion package instead of manually
authoring 9 files from scratch.
