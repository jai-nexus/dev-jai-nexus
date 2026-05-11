# .nexus Governance Spine Routing

## `.nexus` governance spine

`.nexus` is the governance spine for projects. It may contain:

- motions
- canon
- decisions
- validations
- passalongs
- routing artifacts
- audit/hygiene records where appropriate

## Cross-repo framing

Each repo/domain may own its own `.nexus` canon according to domain
responsibility.

Routing posture:
- `dev-jai-nexus`
  - control-plane routing and operator visibility
- `audit-nexus`
  - likely audit/hygiene/state-direction review records
- `docs-nexus`
  - likely documentation/source-intelligence canon
- other repos/domains
  - their own `.nexus` canon according to their product or technical role

## Constraint

This repo may map and reference the cross-repo `.nexus` governance spine, but
must not claim to own all `.nexus` canon across the JAI NEXUS system.
