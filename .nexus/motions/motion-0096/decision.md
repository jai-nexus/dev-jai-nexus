# Decision - motion-0096

## Status
DRAFT

## Summary
Motion `motion-0096` implements the thinnest honest seam converting the staged
OffBook.ai Wave 0 planning/dispatch declaration into a motion-linked work packet
entering the existing dev-jai-nexus governed execution lane.

Two artifacts created:
- `out/offbook-ai/coverage-declaration.yaml` — operator Wave 0 declaration,
  all 10 planner-owned dispatch handle fields satisfied from committed intake +
  agency artifacts
- `portal/scripts/activate-staged-project.mjs` — new script deriving dispatch
  handle from coverage-declaration, creating WorkPacket + AgentInboxItem with
  `project:offbook-ai` linkage tag, reusing the proven activate-motion lane

Dry-run validated. Idempotency confirmed. No existing scripts, runtime, or UI
changed.

## Activation prerequisites (after ratification)

```bash
node portal/scripts/activate-staged-project.mjs \
  --coverage out/offbook-ai/coverage-declaration.yaml \
  --motion motion-0096 --create

node portal/scripts/enqueue-motion-packet.mjs --motion motion-0096

pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10
```

## Scope boundary

- dev-jai-nexus remains owner of governance, packet creation, and execution lane
- No Wave 1+ work, no live repo promotion, no conductor/queue_binding wiring
- OffBook.ai agents (7.0.x) are staged — not active in the execution system
