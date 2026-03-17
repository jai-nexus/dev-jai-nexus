# Challenge (motion-0046)

## Risks
- Reducing from 5 to 2 candidates per panel removes redundancy; if both slots fail or degrade, the panel has no fallback without a hot-swap mechanism.
- Deferring selectors means Phase 1 panels operate in single-candidate mode with manual or round-robin dispatch — no automated quality gating between candidates.
- Voting role assignments (Proposer and Arbiter both Sonnet 4.6) share a provider, which could create correlated failure modes in governance decisions.

## Objections
- The 2-slot-per-panel design is pragmatically correct for Phase 1 but should be explicitly marked as a minimum viable staffing posture, not a target architecture.
- The manifest introduces a new file (model-slots-phase1.yaml) alongside the existing model-slots.yaml without deprecating the original. A future motion should clarify which file is canonical and whether model-routing.yaml needs updating.

## Mitigations
- 2 slots per panel is explicitly labeled Phase 1; the deferred_slots section preserves the path to richer candidate sets.
- Provider overlap on Proposer/Arbiter is acceptable because the Challenger is cross-provider (GPT-5.4), maintaining adversarial independence where it matters most.
- A follow-up motion should reconcile model-slots.yaml and model-routing.yaml with the new Phase 1 file.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
