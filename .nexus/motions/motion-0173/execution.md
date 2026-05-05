# Execution: Q2M5 Control Thread Role Taxonomy v0

**Motion:** motion-0173
**Role:** BUILDER
**Date:** 2026-05-05
**Status:** RATIFIED

---

## Cost estimate

Category: standard
Basis: three new canon YAML files under `.nexus/canon/` and one new motion packet
under `.nexus/motions/motion-0173/`. No portal runtime changes. No cross-repo
changes. No execution enablement.

---

## Final ratification timestamp

Shared UTC timestamp used for all ratification fields:

- `2026-05-05T17:29:14.2951314Z`

---

## Boundary confirmation

This implementation must not:

- implement motion-0174
- enable execution
- expand branch-write authority
- expand PR-creation authority
- add hidden persistence
- add autonomous scheduling
- add DB/API mutation
- add credentials
- edit `docs-nexus`
- edit `jai-nexus`
- mutate `portal/**`

---

## Evidence log

### 1. Files changed for implementation and ratification

Observed file changes:

- `.nexus/canon/workflow-role-taxonomy.yaml`
- `.nexus/canon/passalong-schema.yaml`
- `.nexus/canon/repo-routing-target-schema.yaml`
- `.nexus/motions/motion-0173/motion.yaml`
- `.nexus/motions/motion-0173/proposal.md`
- `.nexus/motions/motion-0173/challenge.md`
- `.nexus/motions/motion-0173/execution.md`
- `.nexus/motions/motion-0173/decision.yaml`
- `.nexus/motions/motion-0173/policy.yaml`
- `.nexus/motions/motion-0173/verify.json`
- `.nexus/motions/motion-0173/vote.json`

No portal runtime files, no existing role canon files outside `.nexus/canon/`,
and no cross-repo surfaces were modified.

### 2. Acceptance checks

- workflow roles defined
- allowed outputs documented
- blocked outputs documented
- passalong schema documented
- repo routing target schema documented
- workflow-role vs JAI-agent-role distinction explicit
- `ORCHESTRATOR` distinction explicit
- future motion-0174 dependency noted but not implemented
- no authority guardrails weakened

### 3. Content verification summary

- workflow-role taxonomy is explicit and schema-first
- allowed outputs and blocked outputs are documented per workflow role
- passalong contract fields are explicit
- repo-routing target contract fields are explicit
- workflow-role vs JAI-agent-role distinction is explicit
- `ORCHESTRATOR` is explicitly valid as a workflow role only
- motion-0174 is referenced as deferred dependency only
- authority guardrails remain unchanged

### 4. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0173/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

Observed results are recorded in `verify.json` and summarized in the final report.

- `validate_motion` -> pass
- `validate_agency` -> pass
- `typecheck` -> pass

### 5. Guardrails preserved

- did not edit `docs-nexus`
- did not edit `jai-nexus`
- did not implement motion-0174
- did not implement Agentic Docs Operations
- did not implement Agent Assets Library
- did not add execution enablement
- did not expand branch-write authority
- did not expand PR-creation authority
- did not add hidden persistence
- did not add autonomous scheduling
- did not add DB/API mutation
- did not add credentials

### 6. Ratification closeout

Motion-0173 is ratified locally as a static/canon/design-only change.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- `policy.yaml` remains non-blocking with `required_ok: true`
- motion-0174 was explicitly not implemented
