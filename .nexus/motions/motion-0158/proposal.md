# Proposal: Operator Motions Static Snapshot Fallback v0

**Motion:** motion-0158
**Kind:** builder-proof
**Program:** q2-motion-operations-static-snapshot
**Basis:** motion-0157

---

## 1. Problem statement

The read-only Operator Motions surface now works locally because the portal can resolve
repo-root `.nexus/motions`. Deployed `dev.jai.nexus` cannot rely on that live repo path
because Vercel runs from `/var/task/portal` and only has portal-bundled files.

The current deployed warning is accurate:

- `Motion source not found: .nexus/motions could not be resolved from portal cwd (/var/task/portal)`

Motion-0158 closes that deployment gap by keeping live repo-root `.nexus/motions`
preferred in local/dev while adding one bundled static snapshot fallback for deployment.

---

## 2. Scope

In scope:

- `portal/scripts/build-motion-snapshot.mjs`
- `portal/src/lib/motion/motionSnapshot.json`
- `portal/src/lib/motion/motionSurface.ts`
- `portal/src/app/operator/motions/page.tsx`
- `.nexus/motions/motion-0158/**`

Not in scope:

- mutation of `.nexus/motions/**`
- runtime proof files
- `surfaces/agent-ops/**`
- database writes
- API mutation
- dispatch, vote, ratify, scheduler behavior
- readiness scoring
- orchestration widening

---

## 3. Implementation

### 3.1 Deterministic snapshot generator

Add:

- `portal/scripts/build-motion-snapshot.mjs`

The script reads repo-root `.nexus/motions/motion-*`, derives the queue and detail fields
already used by `/operator/motions`, and writes one deterministic bundled JSON snapshot:

- `portal/src/lib/motion/motionSnapshot.json`

The snapshot keeps:

- all current motion entries
- queue state
- attention flags
- core artifact previews
- secondary artifact presence
- execution excerpt
- prompt pack and handoff pack

It does not repair or normalize motion packages.

### 3.2 Live-first, snapshot-fallback loader behavior

Keep local/dev preference for live repo-root `.nexus/motions`.

If live source resolution fails, fall back to the bundled snapshot for:

- motion queue
- motion detail
- prompt/handoff content

### 3.3 Read-only boundary

The fallback remains read-only. It does not mutate motion packages, proof artifacts, DB
state, or any other repo surface.

---

## 4. Acceptance criteria

- snapshot generator writes `portal/src/lib/motion/motionSnapshot.json`
- bundled snapshot count is `157`
- `motion-0157` appears in the bundled snapshot
- `motion-0151` mismatch remains surfaced as attention
- local/dev still resolves live repo-root `.nexus/motions`
- simulated missing live source returns snapshot mode rather than a false empty queue
- no false successful `0` motions state
- required gates pass

---

## 5. Non-goals

No `.nexus/motions/**` mutation, no runtime proof changes, no DB writes, no API mutation,
no dispatch, no voting, no ratification, no scheduler behavior, no readiness scoring, and
no orchestration widening.
