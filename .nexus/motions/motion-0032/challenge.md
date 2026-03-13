# Challenge — motion-0032

## Main concern
The architect and builder proofs succeeded because the live runtime, queue row, packet routing, and UI interpretation all aligned. The verifier motion must preserve that same determinism and must not blur verification, operator review, and final approval into one ambiguous step.

## Risks
1. **Verifier runtime may claim the wrong packet**
   - If verifier claim logic depends only on assignment and not explicit role, it could accidentally process non-verifier work.

2. **Verification evidence may be too weak or too generic**
   - If `debug.verify` is vague, the packet may look "complete" without showing unmistakable verifier-shaped proof.

3. **Routing semantics may stay muddy**
   - Reusing `APPROVE` for verifier handoff would blur "send to operator review" with "final approval."

4. **Queue and inbox state may drift**
   - The packet could show operator-review-ready in the UI while tags/queue state lag behind or remain verifier-shaped.

5. **Auto-approval temptation**
   - It would be easy to let verifier completion imply approval. That should stay out of this motion.

## Required safeguards
- Verifier runner only claims verifier-routed work.
- Verifier proof emits all expected packet-linked SoT events.
- Verification evidence is explicit and readable in the packet detail view.
- Routing to operator review is explicit and visible.
- Manual operator assignment and approval remain the control point.

## Challenger standard for approval
I approve this motion only if:
- the live verifier claim works end-to-end,
- the emitted evidence is unmistakably verifier-shaped,
- the packet becomes operator-review-ready,
- routing uses explicit operator-review semantics,
- no hidden auto-approval behavior is added.

## Risk score
risk_score: 0.08
