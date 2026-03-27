# Challenge - motion-0034

## Main concern
The operator stage currently sits at the boundary between routing semantics and final decision semantics. If approval and request-changes are modeled ambiguously, the system may emit the right events but still leave the packet in a confusing or misleading state.

## Risks
1. **Approval ambiguity**
   - The approve path may still behave like a routing action instead of a final operator decision.

2. **Status mismatch**
   - The UI may claim a packet is approved or changes-requested while the underlying packet status model does not cleanly support that result.

3. **Event/state drift**
   - `WORK_APPROVED` or `WORK_REVIEW_REQUESTED` may fire, but control-state, inbox tags, or visible packet status may lag or conflict.

4. **Request-changes ambiguity**
   - A request-changes decision may fail to indicate clearly what happened next, leaving the packet in an unclear operator/review state.

5. **Over-scope temptation**
   - It may be tempting to redesign the entire rework workflow or add operator automation. That should remain out of scope.

## Required safeguards
- operator actions must remain manual and explicit,
- approval must read as a final decision, not just another route,
- request-changes must read as a real operator judgment,
- packet UI must reflect the decision clearly,
- event emission and visible state must stay aligned.

## Challenger standard for approval
I approve this motion only if:
- both operator branches are proven live,
- the SoT events are correct,
- the operator UI reflects decision outcomes coherently,
- no misleading status behavior is introduced,
- the motion stays scoped to operator decision proof.

## Risk score
risk_score: 0.09
