# Challenge: JAI Grid Motion Draft Ingestion v0

**Motion:** motion-0130

---

## Risks

- **R-1: `motion-XXXX` placeholder not replaced before commit** — if the operator
  pastes `motion.yaml` without substituting `motion-XXXX`, `validate-motion` will
  reject the motion ID as malformed. Mitigation: the `MotionDraftModal` header
  shows a prominent placeholder warning; the scaffolded `motion.yaml` includes an
  inline comment: `# Replace XXXX with the next available motion ID before committing`.
  The validate-motion gate is a hard required gate that will surface the error
  before the motion is mergeable.

- **R-2: `protocol_version` drift in scaffold** — if `protocol_version` in the repo
  advances to `0.3.9` or later, the scaffolded `motion.yaml` will be behind. Mitigation:
  `gridMotionDraft.ts` hard-codes the version constant; it can be updated in a
  single-line change. The validate-motion gate will catch any mismatch before
  ratification. Risk is low in v0 scope.

- **R-3: Scaffold proposal.md is structurally correct but semantically thin** — the
  auto-generated `proposal.md` provides tables and stub success criteria but no
  operator intent. A motion submitted without filling "Why these changes" will be
  weak at the challenge stage. Mitigation: the scaffold explicitly labels the
  "Why these changes" section as `[Operator to complete: explain the intent]`.
  This is a review-stage concern, not a code correctness concern.

- **R-4: `MotionDraftModal` tab state interferes with ESC / connect mode** — the Grid
  already uses ESC to exit connection mode. Adding a modal with its own ESC dismiss
  could conflict. Mitigation: the modal renders at z-index 60 (above everything);
  clicking outside or pressing ESC dismisses it before propagating to the connect
  mode handler. Review carefully in GridView.tsx useEffect key handler scope.

- **R-5: Four copy buttons in one modal — operator copies wrong section** — if section
  labels are ambiguous, the operator might copy `execution.md` content as `motion.yaml`.
  Mitigation: each section header shows the exact filename to use (e.g.,
  `motion.yaml`, `proposal.md`). Copy button text includes the filename:
  "Copy motion.yaml", "Copy proposal.md".

---

## Objections

- **O-1: Why not just improve the existing DiffModal with a better hint?** — The
  existing hint ("Paste into proposal.md") fails to surface that three other files
  are required and that the diff content belongs inside proposal.md, not as the
  whole file. Improving the hint to say "also create motion.yaml with these fields"
  shifts the schema documentation burden onto the UI hint rather than generating
  correct schema. The scaffold approach generates correctly-structured files.

- **O-2: Why not write the files directly to `.nexus/motions/`?** — Runtime writes to
  `.nexus/motions/` from the portal would bypass `validate-motion` gating, operator
  review, and the governed ratification path. The scaffold-and-copy pattern keeps the
  operator in control of when and whether a motion is created. This is explicitly
  stated in motion-0129 proposal.md O-4.

- **O-3: Why not auto-generate the motion ID?** — Auto-incrementing requires reading
  `.nexus/motions/` at runtime to find the next available ID. This adds a server API
  call or server component data dependency to what is otherwise a purely client-side
  computation. The scope increase is not justified for v0. The placeholder pattern
  keeps the generator pure and the responsibility for ID assignment with the operator.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.15
