## Purpose

This artifact defines the boundary for reviewing a simulated agent-authored motion draft package without provider/model calls, live agent drafting, or any write authority.

This prototype is read-only, review-only, and static. It does not open Corpus V2, reset numbering, or promote fixture output to canon.

## Allowed Prototype Behavior

- Inspect a static draft fixture.
- Display draft package shape and placeholder draft identity.
- Show role/lens contributors alongside canonical governance-lane context.
- Show required files and validation expectations.
- Show explicit human review requirement.
- Show explicit no-authority labels.
- Source-reference the static fixture path.
- Source-reference related sandbox and readiness canon.

## Prohibited Behavior

- No provider/model call.
- No live agent drafting.
- No runtime execution.
- No branch write.
- No PR creation.
- No merge authority.
- No scheduler or automation.
- No API or DB mutation.
- No Corpus V2 opening.
- No fixture promotion to canon.
- No write or control buttons.

## Relationship To Sandbox Fixtures

The prototype reviews the static draft fixture at `.nexus/fixtures/corpus-v2/agent-governance-sandbox/motion-draft.v0.json`.

It depends on the sandbox boundary and prototype canon:

- `.nexus/canon/corpus/agent-governance-sandbox-boundary-v0.md`
- `.nexus/canon/corpus/agent-governance-sandbox-prototype-v0.md`

## Relationship To Corpus V2 Readiness

This prototype contributes only a review surface for future drafting posture. It does not satisfy live agent drafting, live governance, or opening requirements by itself.

Corpus V2 remains gated and not open.

## Human Review Boundary

Human review remains required for:

- inspecting fixture quality
- confirming scope and non-goals
- confirming role/lens contributors are not confused with governance voters
- deciding whether any future seam should be motionized

## Non-Goals

- opening Corpus V2
- resetting numbering
- generating draft content from a provider/model
- enabling live agent drafting
- enabling runtime execution
- adding authority or automation
- promoting fixture output to canon

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler
- No automation
- No API/DB mutation
- No hidden persistence

Prototype output is not canon unless later motionized explicitly.
