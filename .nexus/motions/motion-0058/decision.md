# Decision - motion-0058

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 now supports Anthropic as an operator-selected provider
alongside OpenAI. Provider choice is via --provider flag. OpenAI remains
the default. All existing boundaries preserved.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — Anthropic provider support)

## What was proved
| Test | Result |
|------|--------|
| draft --provider anthropic | PASS — narrative generated via Anthropic |
| draft --no-api (OpenAI default) | PASS — placeholder, unchanged behavior |
| draft --provider gemini (unknown) | PASS — clear error |
| Anthropic API connectivity | PASS — claude-sonnet-4-6, status 200 |

## Motion Factory v0 — complete status
| Command | OpenAI | Anthropic | Motion |
|---------|--------|-----------|--------|
| context | proven | n/a (no API) | 0052 |
| draft | proven | proven | 0053, 0054, 0058 |
| revise | proven | available | 0055, 0058 |
| evidence | proven | available | 0057, 0058 |

## Outcome
All three required roles voted YES. No objections, no reservations.
