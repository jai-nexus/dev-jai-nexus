# Execution: Corpus V2 governed activation gate v0 — cost category and durable escalation outcome wiring

**Motion:** motion-0125
**Role:** LIBRARIAN
**Date:** 2026-04-09

## Cost estimate
Category: standard
Basis: bounded repo-local implementation touching the governed activation path, durable handoff/receipt artifacts, and operator read surfaces with no schema migration.

## Scope

Files modified:

```
portal/scripts/activate-motion.mjs
portal/scripts/issue-execution-handoff.mjs
portal/scripts/record-execution-receipt.mjs
portal/scripts/operator-approve-once.ts
portal/src/lib/work/workPacketContract.ts
portal/src/app/operator/work/page.tsx
portal/src/app/operator/work/[id]/page.tsx
```

Files added:

```
.nexus/motions/motion-0125/motion.yaml
.nexus/motions/motion-0125/proposal.md
.nexus/motions/motion-0125/challenge.md
.nexus/motions/motion-0125/execution.md
.nexus/motions/motion-0125/decision.yaml
.nexus/motions/motion-0125/decision.md
```

## Implementation

1. Preserve the existing live activation gate for Corpus V2 motions:
   - require cost estimate declaration
   - derive `PROCEED` / `ESCALATE` / `BLOCK`
   - write `execution.activation.json`
   - tag work packets with `cost:*` and `activation:*`

2. Extend `execution.handoff.json` with Corpus V2 metadata:
   - cost category
   - cost basis
   - tier hint
   - whether operator escalation is required
   - activation outcome once activation runs

3. Extend `execution.receipt.json` with the same Corpus V2 metadata so closure
   does not lose the activation decision semantics.

4. Ensure both script-based and operator-surface receipt writers preserve the
   same metadata.

5. Keep operator work surfaces aligned with the durable artifact chain.

## Evidence checklist

- [ ] Corpus V2 activation gate remains live in `activate-motion.mjs`
- [ ] `execution.activation.json` records cost + outcome semantics
- [ ] `execution.handoff.json` preserves Corpus V2 metadata
- [ ] `execution.receipt.json` preserves Corpus V2 metadata
- [ ] operator receipt paths preserve the same metadata
- [ ] operator work views surface the durable state
- [ ] no runtime/db behavior widened outside the governed activation slice
