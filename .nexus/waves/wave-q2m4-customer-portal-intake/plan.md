# Q2M4 customer portal intake continuity wave

- wave_id: wave-q2m4-customer-portal-intake
- status: planned
- repo: jai-nexus/jai-nexus
- surface: Customer portal
- project: JAI Internal / Spine
- related_motion_ids: motion-0169, motion-0170, motion-0171
- related_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- related_work_packet_ids: wp-customer-intake-map
- related_candidate_ids: candidate-wp-customer-intake-map
- deliberation_route: /operator/deliberation

## Next Prompt Preview

```text
# Deliberation Session Recommendation

Recommended candidate: Customer portal intake map
Candidate ID: candidate-wp-customer-intake-map
Suggested next motion title: Follow-up: Customer portal intake map
Suggested next motion id: assigned by operator
Suggested branch name: sprint/q2-customer-portal-intake-map-follow-up
Target repo: jai-nexus/jai-nexus
Target surface: Customer portal
Target project: JAI Internal / Spine

Why this was recommended:
- Advisory consensus supports an operator-reviewed next-step prompt while keeping execution blocked.
- Highest non-binding support rank among current deliberation candidates: advisory support.

Human gates:
- Human operator must confirm the intake-flow scope and target repo before any follow-up motion.
- Human operator must validate that the plan remains documentation-only in this seam.

Evidence expectations:
- Draft intake-map plan with actors, flows, and UI sections.
- Targeting note showing customer-portal as a surface under jai-nexus/jai-nexus.

Verification commands:
- # operator must supply jai-nexus/jai-nexus customer-portal verification commands before any execution is authorized
- # do not execute repository commands from this prompt without separate operator authorization

Operator guardrail: This is copy-only guidance.
Operator guardrail: Do not execute unless separately authorized by the operator.
Operator guardrail: No branch write, PR creation, dispatch, scheduler behavior, DB mutation, API mutation, or runtime execution is enabled from this session.
```

## nh_id Plan

### 0.0 Context and framing

- status: planned
- summary: Capture the deliberation transcript outcome as the planning spine for the next customer portal motion.
- linked_motion_ids: motion-0169, motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Transcript capture is durable and navigable.
- Operator authorization remains required before execution.

### 1.0 Target surface model

- status: planned
- summary: Keep customer-portal represented as a surface under jai-nexus/jai-nexus.
- linked_motion_ids: motion-0167, motion-0169, motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Repo-plus-surface targeting stays explicit.
- No standalone customer-portal repo is implied.

### 1.1 Customer portal intake map

- status: planned
- summary: Use the current deliberation recommendation as the central planning node.
- linked_motion_ids: motion-0169, motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Next motion title and prompt remain copy-only.

### 1.1.1 Auth/account entry

- status: planned
- summary: Clarify how customer entry points and account identity are framed in the intake path.
- linked_motion_ids: motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Operator guidance stays planning-only.

### 1.1.2 Stripe/customer billing assumptions

- status: planned
- summary: Document billing and customer-account assumptions before any implementation authority is considered.
- linked_motion_ids: motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No payment integration action is enabled from this wave.

### 1.1.3 Workspace/project creation

- status: planned
- summary: Capture workspace and project creation expectations as planned follow-up questions only.
- linked_motion_ids: motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Execution authority remains deferred.

### 2.0 Evidence and gates

- status: planned
- summary: Carry forward the verification commands and evidence expectations from the work packet and deliberation prompt.
- linked_motion_ids: motion-0169, motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Typecheck and agency validation remain the minimum repo gates.

### 3.0 Deferred execution authority

- status: deferred
- summary: Any branch writes, PR creation, runtime actions, or execution authority must be opened in a separate later seam.
- linked_motion_ids: motion-0170, motion-0171
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- This wave remains capture/index/planning only.
