# Proposal: Bounded Post-motion-0096 Proof Assessment and Governance Closeout Sweep

**Motion:** motion-0097
**Date:** 2026-03-31

## Context

The motion-0084 bootstrap-planning program and its downstream implementation
motions are now complete through motion-0096:

- motion-0084 through motion-0092: bootstrap planning closed
- motion-0093: first real OffBook.ai Wave 0 rollout, RATIFIED
- motion-0094: motion-0093 closeout sweep, RATIFIED
- motion-0095: bootstrap-manifest.instance.yaml emission — code merged, **DRAFT**
- motion-0096: staged workstream dispatch activation, RATIFIED, live-proven

Two gaps exist before this program can be considered fully closed:
1. motion-0095 governance gap (decision.yaml DRAFT despite merged code)
2. No durable record of what has been proven vs what remains unproven

## Problem

**Gap 1: motion-0095 governance debt.**
The bootstrap-manifest.instance.yaml emission code was merged at commit ab43667.
The decision.yaml was never updated from DRAFT to RATIFIED. vote.json, verify.json,
and policy.yaml were never created. Both required gates (validate_motion,
validate_agency) pass live. This is a clean governance debt with no technical
ambiguity.

**Gap 2: No assessment artifact.**
After motion-0096's live proof, the program has accumulated enough evidence to
define clear readiness layers. Without a durable document, this understanding
lives only in conversation context and commit messages. Future work risks
widening prematurely or re-proving things already settled.

## Proposal

### Part 1: Ratify motion-0095

Create the three required governance artifacts (vote.json, verify.json,
policy.yaml) and update decision.yaml and decision.md to RATIFIED.

Both required gates pass live. Code is in main. Ratification is honest.

### Part 2: Assessment artifact

Create `.nexus/planning/post-motion-0096-assessment.md` which:

1. Lists the reference layer (motion-0070 through motion-0096) with statuses
2. Records exactly what motion-0096 proved (with SoT event evidence)
3. Records what motion-0096 did not prove
4. Codifies five readiness layers, each with PROVEN/NOT PROVEN/PARTIAL status:
   - Staged rollout readiness (Layer 1)
   - Staged activation proof (Layer 2)
   - Generalized dispatch/runtime readiness (Layer 3)
   - Live repo promotion readiness (Layer 4)
   - Downstream builder-proof readiness (Layer 5)
5. Recommends next tracks A–D without implementing them

## Non-goals

- No runtime changes
- No queue behavior changes
- No builder/verifier proof (Track A is a separate motion)
- No second staged project (Track B is a separate motion)
- No live repo promotion planning (Track C is a separate motion)
- No Wave 1+ scoping (Track D is a separate motion)

## Success criteria

- motion-0095 decision.yaml status is RATIFIED
- `.nexus/planning/post-motion-0096-assessment.md` exists with all five layers
- All five readiness layers have unambiguous status
- No runtime, queue, or staged target mutations
