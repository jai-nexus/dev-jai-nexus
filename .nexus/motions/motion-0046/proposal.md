# Proposal - motion-0046

## Title
Phase 1 Model Staffing: corrected dual-provider slot manifest + voting role assignments

## Why this motion exists
JAI NEXUS council is about to enter its first real multi-provider operational phase. The current `model-slots.yaml` was scaffolded early as a 30-slot all-OpenAI placeholder. It does not reflect the staffing decisions the project has actually converged on:

- dual-provider diversity (Anthropic + OpenAI),
- right-sized slot counts (2 per panel rather than 5),
- cost-tier alignment (smaller models for Operator and Librarian),
- explicit voting role assignments governed as a staffing decision,
- and honest deferral of selector slots until an evaluation harness exists.

Without a corrected manifest, Phase 1 launches with ambiguous staffing, overprovisioned slots that nothing consumes, and voting roles that are implicit rather than governed.

## What this motion changes
This motion commits `.nexus/model-slots-phase1.yaml` as the canonical Phase 1 staffing file.

The new manifest:
- defines exactly 10 live executor slots (2 per panel),
- assigns dual-provider primary/alternate pairs per panel,
- uses frontier models (Sonnet 4.6, GPT-5.4) for Architect, Builder, and Verifier,
- uses cost-efficient models (Haiku 4.5, GPT-5 mini) for Operator and Librarian,
- marks all 5 selector slots as DEFERRED with reason fields,
- adds a voting section for Proposer, Challenger, and Arbiter,
- restricts the provider allowlist to Anthropic and OpenAI,
- and removes any third-party pricing references.

## Panel staffing rationale

### Architect (Sonnet 4.6 primary / GPT-5.4 alternate)
Architecture planning benefits from strong reasoning. Sonnet 4.6 leads; GPT-5.4 provides cross-provider verification.

### Builder (Sonnet 4.6 primary / GPT-5.4 alternate)
Code generation needs top-tier models. Same pairing as Architect to keep the build pipeline on frontier models.

### Verifier (GPT-5.4 primary / Sonnet 4.6 alternate)
Verification gains independence when the primary verifier is from a different provider than the primary builder. GPT-5.4 leads verification; Sonnet 4.6 backstops.

### Operator (GPT-5 mini primary / Haiku 4.5 alternate)
Operational tasks (file moves, script runs, environment checks) are high-volume and low-complexity. Cost-efficient models handle these well.

### Librarian (Haiku 4.5 primary / GPT-5 mini alternate)
Documentation, summarization, and indexing are well-suited to fast, cost-efficient models. Haiku 4.5 leads; GPT-5 mini alternates.

## Voting role rationale

### Proposer → Claude Sonnet 4.6
The proposer drafts and amends motions. Strong reasoning and structured output matter most.

### Challenger → GPT-5.4
Cross-provider adversarial independence. The challenger should not share a provider with the proposer to avoid correlated blind spots.

### Arbiter → Claude Sonnet 4.6
The arbiter resolves deadlocks and makes final governance calls. Reasoning depth and structured judgment are critical.

## Selector slot deferral
All 5 selector slots are marked DEFERRED because:
- the multi-candidate scoring pipeline does not yet exist,
- no evaluation harness is available to drive selector decisions,
- and premature activation would create dead infrastructure.

These slots will be activated in a future motion when the panel evaluation harness is ready.

## Why now
The council is at the transition point between scaffolding and real operations. Every motion from here forward will be staffed by these assignments. Getting the staffing manifest right before the first governed multi-provider run prevents compounding configuration drift.
