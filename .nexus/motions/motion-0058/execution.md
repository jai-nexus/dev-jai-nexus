# Execution Plan - motion-0058

## Goal
Extend portal/scripts/motion-factory.mjs to support Anthropic as an
optional operator-selected provider alongside OpenAI.

## Plan
1. Add --provider flag parsing
   - accept --provider openai or --provider anthropic
   - default to openai if not specified
   - reject unknown provider values with clear error

2. Add Anthropic API call functions
   - implement Anthropic-specific API calls for draft, revise, and evidence
   - use Anthropic Messages API (POST /v1/messages)
   - auth via x-api-key header from ANTHROPIC_API_KEY
   - model: claude-sonnet-4-6
   - parse response from content[].text
   - use the same system prompts and output format as OpenAI path

3. Add provider routing in each command
   - draft: route to OpenAI or Anthropic based on --provider
   - revise: route to OpenAI or Anthropic based on --provider
   - evidence: route to OpenAI or Anthropic based on --provider
   - --no-api (draft only) skips API regardless of provider

4. Update key validation
   - --provider anthropic requires ANTHROPIC_API_KEY
   - --provider openai (or default) requires OPENAI_API_KEY
   - missing key fails before writes

5. Update stdout
   - include provider name in output summary for all commands
   - preserve existing human-review reminder

6. Update usage text
   - document --provider flag and supported values

7. Validate
   - draft --provider anthropic with ANTHROPIC_API_KEY present
   - revise --provider anthropic on an existing draft
   - evidence --provider anthropic with evidence file
   - draft without --provider (confirm OpenAI default unchanged)
   - revise without --provider (confirm OpenAI default unchanged)
   - evidence without --provider (confirm OpenAI default unchanged)
   - draft --provider anthropic without ANTHROPIC_API_KEY (confirm error)
   - draft --provider unknown (confirm error)
   - confirm stdout identifies provider used in each case
   - confirm all atomic write and scope guarantees preserved

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add Anthropic provider support)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- portal/.env (read-only)

## Rollback plan
- Revert the Anthropic additions in motion-factory.mjs
- OpenAI path remains unchanged and functional

## Acceptance criteria
- --provider anthropic works for draft, revise, evidence
- Default (no --provider) uses OpenAI unchanged for all three commands
- Missing ANTHROPIC_API_KEY with --provider anthropic fails clearly
- Unknown --provider value fails clearly
- Stdout identifies provider used and preserves human-review reminder
- All existing atomic write and scope guarantees preserved
- Anthropic live connectivity validated with real API response during execution

## Done means
- Motion Factory v0 supports both OpenAI and Anthropic as operator-selected
  providers,
- existing OpenAI behavior is regression-safe,
- and motion-0058 is ratified.
