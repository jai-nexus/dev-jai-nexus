# Decision - motion-0059

## Status
RATIFIED — unanimous consent.

## Summary
Both OpenAI and Anthropic are formally validated for functional parity
across all provider-backed Motion Factory v0 commands. Neither provider
introduces governance artifact drift. This is a proof motion with no
code changes.

## Completed execution evidence

### Provider parity
| Test | Command | Provider | Outcome |
|------|---------|----------|---------|
| 1 | draft --provider openai | OpenAI | PASS — narrative generated |
| 2 | draft --provider anthropic | Anthropic | PASS — narrative generated |
| 3 | draft (no --provider) | OpenAI default | PASS — OpenAI used by default |
| 4 | revise --provider openai | OpenAI | PASS — 3 files revised |
| 5 | revise --provider anthropic | Anthropic | PASS — 3 files revised |
| 6 | evidence --provider openai | OpenAI | PASS — 2 files updated |
| 7 | evidence --provider anthropic | Anthropic | PASS — 2 files updated |

### Structural governance preservation
| Check | Outcome |
|-------|---------|
| Governance files unaffected by provider choice | PASS — deterministic generation confirmed |

### Stdout inspectability
| Check | Outcome |
|-------|---------|
| OpenAI stdout identifies provider | PASS — "model-generated (OpenAI)" |
| Anthropic stdout identifies provider | PASS — "model-generated (Anthropic)" |
| Human-review reminder present | PASS |

### Error paths (pre-write failures)
| Check | Outcome |
|-------|---------|
| Missing OPENAI_API_KEY → error before writes | PASS |
| Missing ANTHROPIC_API_KEY → error before writes | PASS |

## Evidence calibration
- Functional parity confirmed: both providers execute all commands successfully
- Trust boundaries preserved under both providers
- This proof does not claim equal prose quality or identical narrative output

## Outcome
All three required roles voted YES. No objections, no reservations.
