---
artifact_id: MODEL_EVALUATION_HARNESS_V0
artifact_type: harness_protocol
status:
  - NON-AUTHORIZING
version: v0
review_mode: human_only
---

# Model Evaluation Harness v0

## Purpose

This local/static harness supports human review of candidate model responses
against accepted JAI NEXUS doctrine baselines. It is a docs/fixtures-only
evaluation aid. Results inform operator review only.

The harness does not call models, score automatically, assign tiers
automatically, authorize model use, enforce policy, or create acceptance,
canon, production readiness, or execution authority.

## Documentary Baseline

The harness is organized for review against these CONTROL_THREAD-accepted
doctrine names:

- `JAI_NEXUS_DOCTRINE_CORE_V0`
- `VERSIONED_OPERATING_CONTEXT_V0`
- `JAI_AUTHORITY_CORE_V0`
- `BLOCKED_SETTINGS_AND_REFUSAL_REGISTER_V0`
- `VOC_CASCADE_SEMANTICS_V0`

It also preserves the accepted local/static compatibility posture:

- compatibility result:
  `compatible_as_local_static_versioned_operating_context_baseline_v0`
- authority alignment:
  `aligned_under_jai_authority_core_v0_zero_execution_gates`

These names are documentary references. This harness does not redefine them.

## Contents

- `rubric/`: R1-R8 and an uncalibrated threshold discussion
- `prompts/`: AP-001 through AP-017 adversarial prompts
- `keys/`: matching candidate expected-behavior guides
- `controls/`: OR-001 through OR-005 over-refusal controls and candidate keys
- `templates/`: manual run record and scoring sheet
- `checklists/`: operator acceptance checklist
- `guides/`: golden-answer guidance
- `registers/`: descriptive, non-enforcing disqualifier register
- `fixtures/`: synthetic primer, corpus, and `SYN-*` inventory
- `runs/`: manually completed or paper dry-run records

## Human Run Protocol

1. Select a declared condition: `primed` or `unprimed`.
2. For a primed run, provide only `fixtures/doctrine-primer-v0.md` as the
   declared primer.
3. Select one AP or OR prompt and copy its text into an external, manually
   operated evaluation context.
4. Do not include customer data, secrets, live repo state, or production
   claims.
5. Manually record the response in `templates/run-template.md`.
6. Compare the response with the matching `CANDIDATE` key.
7. Assign human scores using R1-R8 and record reasoning.
8. Record unresolved doctrine questions without resolving them through score
   arithmetic.
9. Submit the record for operator review. Do not infer authorization or
   automatic tiering from the score.

## Metadata Contract

Every AP/OR prompt declares:

- artifact ID and type
- `NON-AUTHORIZING` status
- condition compatibility
- primary rubric dimensions
- fixture references

Every expected-answer key declares `CANDIDATE`. AP-013 additionally declares
`OPEN-DOCTRINE`.

## Non-Authorizations

This harness provides:

- no execution
- no provider/model dispatch
- no repo mutation or branch/PR automation
- no browser or desktop control
- no live settings storage or API/DB-backed state
- no customer data handling
- no telemetry or billing enforcement
- no production readiness claim
- no `.jai` parser/runtime behavior
- no `.nexus` repository governance semantics
- no symbolic projection behavior
- no custom dashboard generation
- no autonomous Agent execution
- no policy enforcement engine or live refusal register
- no automatic scoring, auto-tiering, or model-usage authorization

## Change Boundary

V0 contains Markdown and synthetic fixtures only. A future shape validator,
blind/challenger workflow, model-call runner, scoring service, or production
evaluation system requires a separate CONTROL_THREAD route.

---

**NON-AUTHORIZING:** Documentary local/static harness only. Human review is
required; no score or result authorizes use, acceptance, canon, execution,
policy enforcement, or production readiness.
