# Execution Plan - motion-0054

## Goal
Extend the Motion Factory v0 draft command to generate narrative content
via the OpenAI API while preserving deterministic structural scaffolding.

## Plan
1. Add API call logic to motion-factory.mjs
   - read OPENAI_API_KEY from process.env
   - if --no-api is set, skip API entirely (Case A)
   - if key is missing in API mode, fail with clear error (Case B)
   - construct a prompt from the context payload + human intent
   - call OpenAI API for narrative content
   - if API call fails, fall back to placeholder narrative + warning (Case C)

2. Construct the API prompt
   - include: intent, next motion ID, recent motions, governance summary,
     staffing summary, panel summary
   - instruct the model to generate: summary, problem, proposal, non_goals,
     success_criteria, proposal.md, challenge.md, execution.md
   - hard-ban: evidence tables, PASS/FAIL claims, vote entries, vote
     rationales, ratification claims, executed test-result claims
   - instruct the model to use repo-native conventions

3. Integrate model output with deterministic scaffolds
   - structural files (policy.yaml, decision.yaml, decision.md, vote.json,
     verify.json) remain deterministic
   - motion.yaml: structural fields deterministic, narrative fields from model
   - proposal.md, challenge.md, execution.md: from model
   - decision.md: deterministic

4. Update stdout summary
   - note whether narrative was model-generated or placeholder
   - preserve scaffold-only reminder
   - on API failure (Case C), print visible warning

5. Validate
   - run draft with OPENAI_API_KEY present and confirm narrative generated
   - run draft with --no-api and confirm placeholder scaffolds
   - run draft without OPENAI_API_KEY and confirm clear error
   - inspect generated narrative for absence of evidence tables, vote entries,
     and ratification claims
   - confirm structural files remain deterministic
   - simulate or trigger API failure and confirm Case C fallback

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add API narrative generation)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- portal/.env (read-only, not modified)

## Rollback plan
- Revert the API additions in motion-factory.mjs
- --no-api flag preserves pre-API behavior without full rollback
- Delete any test motion directories created during validation

## Acceptance criteria
- draft with OPENAI_API_KEY generates narrative in motion.yaml, proposal.md,
  challenge.md, execution.md
- Structural files (policy.yaml, decision.yaml, decision.md, vote.json,
  verify.json) remain deterministic
- --no-api falls back to placeholder scaffolds (Case A)
- Missing key in API mode produces clear error (Case B)
- API failure falls back to placeholder narrative + warning (Case C)
- No evidence tables, PASS/FAIL claims, vote entries, or ratification claims
  in generated content
- stdout notes whether narrative was model-generated
- No files written outside motion directory

## Done means
- Motion Factory v0 draft command generates reviewable narrative content
  via the OpenAI API,
- the core draft path (context + scaffold + narrative) is complete,
- and motion-0054 is ratified.
