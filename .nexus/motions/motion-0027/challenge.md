# Challenge (motion-0027)

## Primary concern
The main risk is wiring execution-loop actions into the UI in a way that bypasses or duplicates shared packet-routing semantics.

## Mitigation
- use shared helpers from portal/src/lib/work/**
- keep routing actions server-side
- keep packet-linked SoT emission centralized
- keep operator review as the explicit control boundary
