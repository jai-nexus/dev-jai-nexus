# Proposal: Motion corpus audit — schema family classification and normalization inventory

**Motion:** motion-0111
**Date:** 2026-03-31
**Kind:** documentation

## Context

The dev-jai-nexus motion corpus contains 108 motions (0001–0108) accumulated
across multiple program epochs. The motion schema evolved over time: motion.yaml
structure changed, decision.yaml gained `protocol_version`, artifact sets grew,
and the canonical governance contract matured.

As of motion-0108, the modern canonical family is well-defined (Family D,
0098–0108). However, the relationship between the older motions and the modern
contract is not documented. When operating on motions or writing normalization
tooling, sessions must re-derive family boundaries from first principles each
time.

## Problem

Without a committed inventory document:

- Future normalization motions have no shared reference for which motions belong
  to which schema family
- The four truly open motions (with governance-open status, not just schema gaps)
  are not distinguished from schema-evolution artifacts
- The canonical forward contract is implicit in the most recent motions but
  not formally stated anywhere
- Normalization scope cannot be bounded without knowing what "already correct"
  means

## Approach

Produce one committed document: `.nexus/docs/motion-corpus-audit.md`.

The document records:
1. Audit scope and method (read from repo, not assumed)
2. Schema family classification (four families, boundaries, distinguishing criteria)
3. Artifact completeness summary per family
4. Open motion register — the four motions with genuine governance-open status
5. Canonical forward contract — what a fully normalized motion package looks like
6. Normalization action registry — what each family needs, in priority order

The document does NOT:
- execute any normalization
- edit any existing motion
- claim authority to close open motions without a separate governed motion
- judge legacy motions by the modern standard (each family is evaluated by its own era)

## Non-goals

- No normalization of any existing motion in this motion
- No changes to portal scripts or validators
- No runtime, DB, or UI changes
- No reopening of implementation tracks

## Success criteria

- `.nexus/docs/motion-corpus-audit.md` committed with accurate family classification
  (verified from actual repo artifacts)
- Open motion register lists exactly the four governance-open motions with
  anomaly types
- Canonical forward contract is stated explicitly and matches motion-0098–0108
  observed structure
- Normalization action registry is grounded in actual artifact gaps per family
- validate_motion and validate_agency both exit 0
