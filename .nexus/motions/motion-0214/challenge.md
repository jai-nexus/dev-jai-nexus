# Challenge: Sandbox Trace Review Surface v0

## Risks

- fixture review UI could be mistaken for a live sandbox
- static summaries could be mistaken for canonical records
- extra surface copy could imply agents are active

## Mitigations

- label the section as fixture-only, simulated, not canon, review-only, and no
  authority
- keep the section compact and clearly separate from readiness gates
- avoid controls, live status, and mutation paths
