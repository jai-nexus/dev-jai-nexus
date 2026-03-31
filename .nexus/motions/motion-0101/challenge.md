# Challenge: Operator Review Closeout — WorkPacket 882 (OffBook.ai staged activation)

**Motion:** motion-0101
**Date:** 2026-03-31
**Track:** A continuation (motion-0100 proved verifier stage)

## Scope challenge

**Q: Is a one-shot script the right surface for OPERATOR_REVIEW, or should the web UI be used directly?**

The web UI (`/operator/work/882`) is the canonical operator decision surface. For a bounded governance proof, a script that calls the same `applyPacketRouteAction` path with a known actor provides a traceable, repeatable evidence artifact. The script is explicitly scoped to this proof and does not replace or suppress the UI path.

**Q: Does the `execution.handoff.json` absence block this closeout?**

No. `computeLoopCoherence` is display logic only. `runDecisionAction` in the web UI calls `applyPacketRouteAction` directly — it does not gate on coherence. The INCOHERENT display state for motion-0096 is a known artifact (handoff pattern not established until after motion-0096 was created). Documented; out of scope to fix.

**Q: Should `execution.receipt.json` be written to motion-0096 or motion-0101?**

motion-0096 — the receipt belongs to the WorkPacket's own motion directory. The receipt records closure of the work associated with motion-0096, not the proof motion (motion-0101). This matches the behavior of `writeReceiptArtifact` in the web UI operator page.

## Constraint challenge

**Q: Does this create a general operator automation framework?**

No. `operator-approve-once.ts` is a bounded one-shot script with a hard guard (`currentRoute !== "OPERATOR_REVIEW"` → EXIT 1). It carries no loop, no scheduling, and no generalisation path.

**Q: Is this opening motion-0096?**

No. No files in `.nexus/motions/motion-0096/` are modified except the addition of `execution.receipt.json`, which is written by the approval action itself (same as the web UI path). The motion-0096 governance artifacts are untouched.

## Risk challenge

**Risk: script actor identity `operator-approve-script:6.0.14` is not a real agent.**

Accepted. The actor name is a governed proof identity (matches proposer_nh_id 6.0.14 from motion-0101). The SoT event records this actor. It is a proof artifact, not a production agent identity.

## Resolution

No blocking challenge identified. Proceed to execution.
