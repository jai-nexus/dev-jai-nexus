# Proposal - motion-0059

## Title
Motion Factory v0 — provider parity proof

## Why this motion exists
motion-0058 added Anthropic as an operator-selected provider and validated
draft generation with both providers. But revise and evidence have not been
formally proved with Anthropic, and no governed motion has validated the
full provider surface together with recorded execution evidence.

This motion closes that gap by proving all provider-backed commands function
correctly with both providers.

## What parity means in this motion
Parity in this motion means **functional parity**, not identical output:
- both providers successfully execute the existing factory commands
- both providers preserve the same trust boundaries (narrative-only writes,
  atomic write guarantees, non-evidence-inventing boundary)
- both providers preserve the same structural governance file guarantees
  (deterministically generated, unaffected by provider choice)
- provider choice does not introduce governance artifact drift

This motion does **not** claim:
- equal prose quality between providers
- identical narrative output between providers
- provider ranking or quality comparison

## What this motion proves

### Provider parity execution record
The following table is a proof record to be completed with real command
outcomes during execution of this motion, before ratification.

| Test | Command | Provider | Outcome |
|------|---------|----------|---------|
| 1 | draft --provider openai | OpenAI | To be recorded |
| 2 | draft --provider anthropic | Anthropic | To be recorded |
| 3 | draft (no --provider) | OpenAI default | To be recorded |
| 4 | revise --provider openai | OpenAI | To be recorded |
| 5 | revise --provider anthropic | Anthropic | To be recorded |
| 6 | evidence --provider openai | OpenAI | To be recorded |
| 7 | evidence --provider anthropic | Anthropic | To be recorded |

### Structural governance preservation checks
Structural governance files are deterministically generated and must be
unaffected by provider-specific narrative generation. Provider choice
must not introduce governance artifact drift.

| Check | Outcome |
|-------|---------|
| policy.yaml unaffected by provider choice | To be recorded |
| decision.yaml unaffected by provider choice | To be recorded |
| decision.md unaffected by provider choice | To be recorded |
| vote.json unaffected by provider choice | To be recorded |
| verify.json unaffected by provider choice | To be recorded |

### Stdout inspectability checks
| Check | Outcome |
|-------|---------|
| OpenAI stdout identifies provider | To be recorded |
| Anthropic stdout identifies provider | To be recorded |
| Human-review reminder present | To be recorded |

### Error path checks (pre-write failures)
Missing-key errors must occur before any file writes.

| Check | Outcome |
|-------|---------|
| Missing OPENAI_API_KEY → error before writes | To be recorded |
| Missing ANTHROPIC_API_KEY → error before writes | To be recorded |

These tables must be completed with real outcomes before ratification.

## What this motion does not change
- No code changes to motion-factory.mjs (unless a defect is found)
- No governance config changes
- No staffing canon changes
- No new commands or features

## What this motion does not prove
- Equal prose quality between providers
- Identical narrative output between providers
- Auto-provider routing (not implemented, not in scope)
- Provider ranking or quality comparison
- Full Motion Factory v1 behavior

## Design stance
This is a bounded functional parity proof. It validates that the existing
factory commands work correctly with both Phase 1 approved providers,
preserve the same trust boundaries, and do not introduce governance
artifact drift. It does not compare or rank provider output quality.

## Why now
Anthropic was just added. Before any future work builds on dual-provider
support, the full surface should be formally validated with recorded
evidence under both providers.
