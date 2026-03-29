# Challenge - motion-0074

## Risks

### Risk 1 — Proof candidate motion-0070 was already implemented
motion-0070's implementation (councilPolicyKernel.mjs) is already merged.
Activating it creates a work packet for work that is done. The packet will
sit in QUEUED/DRAFT state with no natural executor unless manually closed.

**Response:** Acceptable for a proof slice. The goal is to prove the
activation bridge is functional, not to exercise a new execution lane.
The created packet can be canceled via the operator surface after
proof is confirmed. The motion tag makes it clearly identifiable.

### Risk 2 — Handoff issuance is irreversible
`issue-execution-handoff.mjs` refuses to overwrite an existing handoff.
Once issued, the handoff artifact is permanent without manual deletion.

**Response:** This is the intended invariant. The handoff for motion-0070
is legitimately authorized by its RATIFIED decision. There is no governance
reason to withhold a handoff from a fully ratified motion.

### Risk 3 — Created packet requires manual cleanup
The proof creates a real WorkPacket and AgentInboxItem in the production
database. These are not auto-cleaned.

**Response:** The packet is clearly tagged `motion:motion-0070` and
`route:ARCHITECT`, making it easy to find and cancel in the operator
work surface. This is a known, bounded side effect of a live DB proof.

### Risk 4 — DATABASE_URL unavailable in some environments
If `DATABASE_URL` is not set and `portal/.env.local` is absent, the
`--create` step fails before any write.

**Response:** A clear error is printed. The dry-run steps (0, 1, 2) still
pass and provide partial proof. The DB-dependent steps (3, 4) are attempted
and the failure is noted in evidence.

### Risk 5 — Proof is environment-specific
The created packet IDs are environment-specific. The proof evidence is
valid for the environment where it was run, not as a universal assertion.

**Response:** Expected and acceptable. The proof asserts script
correctness and tag shape, not specific ID values.

---

## Objections and responses

- **"Why not activate motion-0073 or 0072 instead?"**
  motion-0073's decision.yaml is DRAFT (not RATIFIED); it would fail
  the activatability check. motion-0072 similarly. motion-0070 is the
  most recently ratified motion with full artifact coverage.

- **"Why issue a handoff that will never be receipted?"**
  The handoff is a durable authorization artifact. Issuing it is correct
  governance even if a receipt is never written. The receipt is WS-4,
  not in scope here.

- **"Should this use a test database?"**
  This repo has no test database setup. The proof runs against the dev
  environment. The created packet is clearly tagged and can be cleaned up
  by the operator.

---

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.08
