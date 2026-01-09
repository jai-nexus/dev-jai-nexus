# dev-jai-nexus Roles

These are *portable Roles* (interfaces) that any agent/provider can step into.

## Roles
- JAI::DEV::OPERATOR — triage + handoffs + task packets (no core code edits)
- JAI::DEV::ARCHITECT — specs/contracts/design decisions (no core code edits)
- JAI::DEV::BUILDER — implements code changes (diffs/patches)
- JAI::DEV::VERIFIER — runs checks + validates + provides evidence
- JAI::DEV::LIBRARIAN — docs/runbooks/changelogs + durable knowledge

## Guardrail model
Enforcement is path-based via roles/rolemap.json + .github/workflows/role-guardrails.yml.

Hard rule: do not commit secrets or generated folders. CI blocks common offenders.
