# Execution Plan - motion-0059

## Goal
Prove functional provider parity across all provider-backed Motion Factory
v0 commands.

## Plan
1. Create a test draft with each provider
   - draft --provider openai --intent "Provider parity test"
   - draft --provider anthropic --intent "Provider parity test"
   - draft without --provider (confirm OpenAI default)
   - record outcomes

2. Revise with each provider
   - revise --provider openai on an existing draft
   - revise --provider anthropic on an existing draft
   - record outcomes

3. Evidence insertion with each provider
   - create a test evidence file
   - evidence --provider openai on an existing draft
   - evidence --provider anthropic on an existing draft
   - record outcomes

4. Structural governance preservation checks
   - confirm policy.yaml, decision.yaml, decision.md, vote.json, verify.json
     are deterministically generated and unaffected by provider choice
   - provider-specific narrative generation must not introduce governance
     artifact drift

5. Stdout inspectability checks
   - confirm each command's stdout identifies the provider used
   - confirm human-review reminder is present

6. Error path checks (pre-write failures)
   - temporarily unset OPENAI_API_KEY and confirm clear error before writes
   - temporarily unset ANTHROPIC_API_KEY and confirm clear error before writes

7. Record all evidence in proposal.md
   - complete the execution tables with real outcomes
   - note any defects or deferred tests

8. Clean up test artifacts
   - delete test motion directories created during validation

## Files touched
- None expected (proof-only motion)
- If a defect is found, minimal corrective edit to motion-factory.mjs

## Files explicitly not touched
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- portal/.env (read-only)

## Rollback plan
- No code changes expected. Delete test motion directories.

## Acceptance criteria
- All 7 provider-backed command tests recorded with real outcomes
- Structural governance files confirmed unaffected by provider choice
- Neither provider modifies governance artifacts beyond deterministic generation
- Stdout identifies provider in each case
- Missing-key errors confirmed to occur before any file writes
- proposal.md contains completed execution evidence
- No code changes required (unless defect found)

## Done means
- Both OpenAI and Anthropic are formally validated for functional parity
  across all provider-backed Motion Factory v0 commands,
- provider parity is governed and recorded,
- and motion-0059 is ratified.
