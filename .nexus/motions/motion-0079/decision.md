# Decision: bounded verifier runtime readiness for motion-linked packets

**Motion:** motion-0079
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0079` is a DRAFT WS-2 completion slice covering:
1. verifier motion-context binding in `verifierRuntime.ts`
2. verifier queue-readiness bridge via `enqueue-verifier-packet.mjs`

## Outcome

Verifier runtime is motion-context-aware and live-proof-ready.

This slice:
- detects motion-linked packets via the canonical motion tag path
- loads governed context from `motion.yaml` (title) and `execution.md`
- emits motion-grounded `debug.verify` payloads when motion context present
- preserves existing generic behavior for non-motion-linked packets
- falls back safely for incomplete motion context
- adds the symmetric VERIFIER queue bridge to unblock `run-verifier-once.ts`

## Evidence

- `portal/src/lib/work/verifierRuntime.ts` modified per motion-0079 proposal
- `portal/scripts/enqueue-verifier-packet.mjs` added
- `node --check portal/scripts/enqueue-verifier-packet.mjs` PASS
- `pnpm -C portal typecheck` PASS
- fallback behavior documented in execution.md

## Constraints honored

- No files outside `verifierRuntime.ts` and `enqueue-verifier-packet.mjs` changed
- No schema migration
- No operator UI changes
- No receipt closure changes
- No new SoT event kinds
- Existing architect and builder runtimes unchanged

## WS-2 complete

With motion-0079 ratified:
- motion-0075: architect context binding ✓
- motion-0076: architect queue readiness ✓
- motion-0077: builder context binding ✓
- motion-0078: builder queue readiness ✓
- motion-0079: verifier context binding + queue readiness ✓

All three execution runtimes are motion-aware. The full architect → builder
→ verifier proof chain is live-provable on motion-0070 / packet 880.

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.
