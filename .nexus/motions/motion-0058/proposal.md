# Proposal - motion-0058

## Title
Motion Factory v0 — Anthropic provider extension

## Why this motion exists
Motion Factory v0 currently uses OpenAI exclusively for narrative generation.
The Phase 1 staffing canon (motion-0046) includes both Anthropic and OpenAI
as approved providers. Adding Anthropic as an operator-selected option gives
the operator flexibility without introducing routing complexity.

## What this motion changes

### portal/scripts/motion-factory.mjs

A `--provider` flag is added to the `draft`, `revise`, and `evidence` commands.

**Invocation examples:**
```
node portal/scripts/motion-factory.mjs draft --intent "..." --provider anthropic
node portal/scripts/motion-factory.mjs revise --motion motion-0058 --notes "..." --provider anthropic
node portal/scripts/motion-factory.mjs evidence --motion motion-0058 --evidence-file proof.txt --provider anthropic
```

**Default behavior (no --provider flag):**
OpenAI, exactly as before. No change to existing workflows. All existing
OpenAI-backed draft, revise, and evidence behavior remains unchanged when
--provider is omitted.

**Provider details:**
- `openai` (default): uses OPENAI_API_KEY, existing OpenAI Responses API
- `anthropic`: uses ANTHROPIC_API_KEY, Anthropic Messages API (claude-sonnet-4-6)

**Key handling:**
- Each provider requires its own environment variable
- Missing the required key for the selected provider produces a clear error
  before any file writes
- --no-api (draft only) skips API regardless of --provider

**What stays the same:**
- Deterministic structural files (policy.yaml, decision.yaml, decision.md,
  vote.json, verify.json) are always template-generated
- Narrative-only write scopes unchanged
- Atomic write guarantees unchanged
- Non-evidence-inventing boundary unchanged
- DRAFT-only output unchanged
- Human review required

## How Anthropic API integration works
The Anthropic Messages API uses a different request/response shape than
the OpenAI Responses API:

- Endpoint: `https://api.anthropic.com/v1/messages`
- Auth: `x-api-key` header (not Bearer token)
- Version header: `anthropic-version: 2023-06-01`
- Model: `claude-sonnet-4-6`
- Response: `content[].text` (not output[].message.content[].output_text)

The implementation adds provider-specific API call functions within the
existing script and routes to the correct one based on `--provider`. The
system prompts and output format remain the same regardless of provider.

## Anthropic live validation
Anthropic API connectivity is validated during execution of this motion by
running the draft, revise, or evidence commands with --provider anthropic
and recording the real API response. Live status is not pre-claimed.

## What this motion does not change
- Default provider (OpenAI)
- Deterministic structural file generation
- Narrative-only write scopes
- Atomic write behavior
- Provider staffing canon or model-slot assignments
- Routing policy
- Governance config files

## What this motion does not add
- No auto-provider selection
- No routing logic
- No new config family
- No additional providers beyond OpenAI and Anthropic
- No staffing canon changes
- No model-slot assignment changes

## Design stance
This is a minimal provider extension. It gives the operator a choice
without introducing automation or routing. The default remains OpenAI
for continuity with existing workflows. This motion extends Motion Factory
implementation only — it does not modify staffing canon or routing policy.

## Why now
The Phase 1 staffing canon already includes both providers. Adding the
second provider to the factory means the operator can compare generation
quality between providers and choose the best fit per motion.
