# Proposal: Operator Motions Snapshot Refresh Automation v0

**Motion:** motion-0162
**Kind:** builder-proof
**Program:** q2-motion-snapshot-refresh-automation
**Basis:** motion-0161

---

## 1. Problem statement

Deployed `/operator/motions` uses the bundled snapshot at
`portal/src/lib/motion/motionSnapshot.json`. That keeps the read-only canonical reference
working on Vercel, but it can silently lag merged `.nexus/motions/**` canon unless the
snapshot is refreshed deliberately.

Motion-0162 adds the narrowest deterministic refresh/check seam:

- `--write` regenerates the bundled snapshot from current `.nexus/motions/**`
- `--check` fails when the committed snapshot is stale
- no runtime GitHub fetch
- no DB writes
- no API mutation
- no change to the read-only canonical reference model

---

## 2. Scope

In scope:

- `portal/scripts/build-motion-snapshot.mjs`
- `portal/src/lib/motion/motionSnapshot.json`
- `.nexus/motions/motion-0162/**`

Not in scope:

- `runtime/**`
- mutation of existing `.nexus/motions/**`
- DB writes
- API mutation
- promotion enablement
- orchestration
- Vercel config restructuring
- CI workflow changes
- status label alignment

---

## 3. Acceptance criteria

- snapshot regenerates deterministically from current `.nexus/motions/**`
- refreshed snapshot includes merged canon through `motion-0161`
- `motion-0151` mismatch remains surfaced if still present
- repeated `--write` produces no diff
- `--check` passes when current
- `--check` fails clearly when stale
- required local gates pass

---

## 4. Non-goals

No runtime fetch path, no workflow automation in this seam, no feature change to
`/operator/motions`, and no write-path expansion.
