# Decision - motion-0096

## Status
RATIFIED

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

## Live activation proof (2026-03-31)

```
activate-staged-project.mjs --create
→ WorkPacket ID: 882  nhId: motion-0096  status: DRAFT
→ InboxItem ID:  11   tags: ["motion:motion-0096","project:offbook-ai","route:ARCHITECT"]

enqueue-motion-packet.mjs --motion motion-0096
→ AgentQueueItem: e23a3217  agentNhId: 6.0.10  status: PENDING  repoScope: ["dev-jai-nexus"]

run-architect-once.ts 6.0.10
→ WORK_CLAIMED:    Work claimed: motion-0096 by 6.0.10
→ debug.plan:      Architect plan recorded: motion-0096
→ WORK_COMPLETED:  Work completed: motion-0096 by 6.0.10
→ WORK_ROUTED:     Work routed: motion-0096 -> BUILDER

Resulting inbox tags: ["motion:motion-0096","project:offbook-ai","route:BUILDER"]
(project:offbook-ai persists through routing — operator surface visibility confirmed)

Rerun safety: --create refused with EXIT 1 when live packet exists ✓
```

## Scope boundary

- dev-jai-nexus remains owner of governance, packet creation, and execution lane
- No Wave 1+ work, no live repo promotion, no conductor/queue_binding wiring
- OffBook.ai agents (7.0.x) are staged — not active in the execution system
