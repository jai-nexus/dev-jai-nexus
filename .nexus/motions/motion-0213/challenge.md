# Challenge: Static Vote/Ratification Trace Fixture v0

## Risks

- simulated votes could be mistaken for live votes
- ratification traces could imply autonomous approval
- blocked examples could look like active workflow rules

## Mitigations

- label the fixture as simulated, fixture-only, and non-authoritative
- require explicit human intervention fields
- keep blocked traces illustrative rather than normative
