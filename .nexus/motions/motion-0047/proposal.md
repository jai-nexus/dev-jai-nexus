# Proposal - motion-0047

## Title
Wire Librarian slot resolution to Phase 1 staffing canon

## Why this motion exists
motion-0046 ratified `.nexus/model-slots-phase1.yaml` as the canonical Phase 1
staffing manifest. That file now governs 10 live executor slots, 5 deferred
selectors, and 3 voting roles — but nothing in the repo actually reads it yet.

The existing slot-resolution path still points at `.nexus/model-slots.yaml`,
which contains 30 identical gpt-5 placeholders. The Phase 1 canon is ratified
but unconsumed.

This motion wires the first consumer.

## Why Librarian first
The Librarian panel is the safest first lane:

- it handles documentation and summarization, not builds or verification,
- it uses cost-efficient models (Haiku 4.5 / GPT-5 mini) where misconfiguration
  has the lowest cost and operational blast radius,
- it has no downstream dependencies that would cascade a bad resolution into
  broken builds or failed verifications,
- and it exercises the same slot-resolution code path that every other panel
  will eventually use.

If Librarian resolution works, the pattern is proven and subsequent panels can
be wired with confidence.

## What this motion changes
The existing slot-resolution helper in the portal layer is extended so that
when resolving slots for the Librarian panel, it reads from
`.nexus/model-slots-phase1.yaml` instead of the legacy file.

Specifically:
- `SLOT_LIBRARIAN_01` resolves to `anthropic / claude-haiku-4-5` (primary),
- `SLOT_LIBRARIAN_02` resolves to `openai / gpt-5-mini` (alternate).

No other panel's resolution path changes. No selector logic is activated.
The panel structure in `agent-panels.yaml` is untouched.

## What this motion does not change
- Architect, Builder, Verifier, and Operator remain on their current
  resolution path.
- `.nexus/agent-panels.yaml` is not rewritten.
- `.nexus/model-slots.yaml` is not deprecated or deleted.
- `.nexus/model-routing.yaml` is not changed.
- No runtime agent orchestration or execution loops are introduced.

## Design stance
This is a minimal consumer wiring motion. It proves the Phase 1 manifest is
consumable and establishes the resolution pattern for future panel wiring.
It deliberately avoids scope creep into panel restructuring, selector
activation, or routing abstraction.

## Why now
The staffing canon was just ratified. The fastest way to make it real — and to
surface any integration issues early — is to wire the safest consumer first,
validate resolution, and then expand panel by panel in subsequent motions.
