# Proposal: Corpus V2 governed activation gate v0 — cost category and durable escalation outcome wiring

**Motion:** motion-0125
**Kind:** governance-policy
**Parent motion:** motion-0124
**Date:** 2026-04-09

## Problem

motion-0124 established the Corpus V2 deliberation protocol, including cost
discipline and escalation handling, but the repo still lacked a durable
operational path that preserved those rules once work entered execution.

The current branch already introduced the first live activation gate:
- `activate-motion.mjs` now reads a Corpus V2 cost estimate from `execution.md`
- activation derives `PROCEED`, `ESCALATE`, or `BLOCK`
- activation writes `execution.activation.json`
- created work packets carry `cost:*` and `activation:*` tags
- operator work surfaces render those values

That is the correct first live-value insertion point, but by itself it is not
durable enough. The new semantics stop at activation time. The governed
artifact chain still loses the Corpus V2 meaning when execution handoff and
receipt artifacts are written.

## Proposal

Package the current activation slice as the first governed operational follow-on
to motion-0124, and extend durability so the new semantics persist through the
execution artifact chain:

1. Keep the new activation gate in `portal/scripts/activate-motion.mjs`
2. Persist declared cost metadata into `execution.handoff.json`
3. Update handoff metadata with the resolved activation outcome after activation
4. Propagate the same Corpus V2 metadata into `execution.receipt.json`
5. Ensure operator-side receipt paths preserve the same fields
6. Keep the slice bounded to dev-jai-nexus governed activation only

## Scope

Code and artifact targets:

```
portal/scripts/activate-motion.mjs
portal/scripts/issue-execution-handoff.mjs
portal/scripts/record-execution-receipt.mjs
portal/scripts/operator-approve-once.ts
portal/src/lib/work/workPacketContract.ts
portal/src/app/operator/work/page.tsx
portal/src/app/operator/work/[id]/page.tsx
```

Motion package:

```
.nexus/motions/motion-0125/motion.yaml
.nexus/motions/motion-0125/proposal.md
.nexus/motions/motion-0125/challenge.md
.nexus/motions/motion-0125/execution.md
.nexus/motions/motion-0125/decision.yaml
.nexus/motions/motion-0125/decision.md
```

Out of scope:
- OffBook.ai
- unrelated motions
- new panel architecture
- new database schema
- replacing motion-0124

## Success criteria

- Corpus V2 motions require declared cost category before live activation
- activation writes durable outcome semantics (`PROCEED` / `ESCALATE` / `BLOCK`)
- `execution.handoff.json` carries Corpus V2 metadata
- `execution.receipt.json` carries the same metadata
- operator workflow continues to surface the resulting values
- the slice is captured as a proper governed motion package
