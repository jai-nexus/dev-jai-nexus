# Challenge (motion-0071)

## Risks

### Risk 1 — Program scope creep
An umbrella motion is a natural attractor for unrelated work. Once the
quarter program is ratified, pressure may build to include snapshot
generation improvements, Motion Factory changes, panel orchestration,
or additional council seam work under its name. Each addition stretches
the program toward an undifferentiated refactor branch.

### Risk 2 — .nexus artifacts coupled to DB state
WS-1 and WS-3 create a live dependency between file-based governance
artifacts (`.nexus/motions/*/decision.yaml`, `execution.handoff.json`,
`execution.receipt.json`) and database-backed execution state (work
packets, SoT events). If the file artifacts and DB state can diverge
— a motion is RATIFIED but the work packet is deleted, or the receipt
is written but the packet is already in DONE state from a different
path — the operator surface could show contradictory state.

### Risk 3 — Tag convention fragility
Using `AgentInboxItem.tags` to carry `motion:X` identity avoids a
schema migration but means the motion link is a string convention, not
a foreign key. Tags can be cleared, not copied on requeue, or
accidentally omitted on routing. A packet could lose its motion
identity mid-execution.

### Risk 4 — Overcommitting the quarter
Five workstreams across governance-to-execution boundary work is
ambitious. WS-2 (agent runtime context binding) requires real behavior
change in the architect runtime. WS-4 (receipt closure) touches the
operator approval flow. Both carry regression risk if rushed.

### Risk 5 — Agent runtimes produce governed artifacts without
understanding their governed semantics
If the architect runtime is given motion context but still produces a
stub-shaped plan, the binding is cosmetic. WS-2 is only meaningful if
the plan artifact is actually grounded in `execution.md` content, not
just annotated with the motionId.

---

## Objections

- Connecting the two loops is the stated quarter goal. A program motion
  is the correct governance unit for this scope.
- The workstreams are sequenced by dependency, not by ambition. WS-1
  is a narrow two-file slice. WS-5 is a validator. No workstream
  requires broad control-plane changes.
- Umbrella motions are planning artifacts, not implementation
  permissions. Each workstream still requires its own child
  branch/motion and ratification before code lands.

---

## Mitigations

- **Against scope creep:** motion-0071 explicitly excludes snapshot,
  panel, Motion Factory, and council seam work in non_goals. Any
  proposed addition must justify a new motion, not an amendment to
  this one.
- **Against divergence:** WS-3 reads `.nexus/` files server-side as
  read-only truth. The operator surface reflects file state, not
  derived DB state. Divergence is visible rather than hidden.
- **Against tag fragility:** WS-5 (coherence gate) exists specifically
  to detect when the tag link is broken. Tag durability is validated
  rather than assumed. A future schema migration to add `motionId` as a
  first-class field is a clean follow-on if tag fragility proves
  problematic in practice.
- **Against overcommit:** the quarter program is decomposed into
  independent slices. If WS-3 or WS-4 slips, WS-1 and WS-2 still
  deliver meaningful loop activation. The program has a useful partial
  delivery path.
- **Against cosmetic binding:** WS-2 acceptance criteria must require
  that the plan artifact contains content derived from `execution.md`,
  not merely annotated with the motionId. The child motion for WS-2
  will specify this explicitly.

---

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.15
