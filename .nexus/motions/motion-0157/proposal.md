# Proposal: JAI Motion Operations Surface v0

**Motion:** motion-0157
**Kind:** builder-proof
**Program:** q2-motion-operations-surface-v0
**Basis:** motion-0156

---

## 1. Problem statement

The operator UI can already inspect chats, work packets, panels, and decisions, but it still
lacks one repo-native read-only surface for motion packages themselves.

Today a human operator must reconstruct motion state manually from:

- `.nexus/motions/*/motion.yaml`
- `.nexus/motions/*/decision.yaml`
- `.nexus/motions/*/policy.yaml`
- `.nexus/motions/*/verify.json`
- `.nexus/motions/*/vote.json`
- `.nexus/motions/*/execution.md`
- `.nexus/motions/*/proposal.md`
- `.nexus/motions/*/challenge.md`

That makes queue review, mismatch detection, and chat handoff heavier than necessary.

Motion-0157 closes that gap with one read-only operator Motions surface derived directly
from existing `.nexus/motions/**` files for `dev-jai-nexus` only.

---

## 2. Scope

In scope:

- `portal/src/lib/motion/motionSurface.ts`
- `portal/src/app/operator/motions/page.tsx`
- `portal/src/components/operator/OperatorSubnav.tsx`
- `.nexus/motions/motion-0157/**`

Not in scope:

- any mutation of `.nexus/motions/**` from the UI
- any mutation of runtime proof artifacts
- `runtime/**`
- `surfaces/agent-ops/**`
- automatic dispatch, automatic voting, automatic ratification
- scheduler behavior
- readiness-threshold scoring
- cross-repo behavior
- orchestration widening

---

## 3. Implementation

### 3.1 Motion surface loader

Add one server-side read-only loader that scans `.nexus/motions/motion-*`, reads the core
motion package files when present, recognizes optional secondary files, and derives a queue
item with:

- identity and metadata
- motion and decision status
- required gate and voting posture
- queue state
- attention flags
- missing core files
- updated timestamp

The loader must also expose a detail view for one selected motion, including core artifact
previews, secondary artifact inventory, execution excerpt, and chat-ready prompt/handoff
text.

### 3.2 Operator Motions route

Add one read-only operator route at:

- `/operator/motions`

The page remains chat-centric and non-orchestrating. It shows:

- a motion queue
- a selected motion detail panel
- package evidence previews
- a chat search link
- read-only prompt and handoff text

### 3.3 Operator subnav

Add `Motions` to the Operator subnav only once the route exists.

---

## 4. Acceptance criteria

- route exists at `/operator/motions`
- subnav includes `Motions`
- queue derives from `.nexus/motions/motion-*`
- detail panel reads existing package files only
- known status mismatch in `motion-0151` is surfaced read-only
- missing optional secondary files do not break rendering
- page remains read-only
- no runtime proof files are touched
- required portal gates pass

---

## 5. Non-goals

No automatic dispatch, no automatic voting, no automatic ratification, no ledger mutation,
no proof-artifact mutation, no runtime mutation, no readiness scoring, no cross-repo
behavior, and no orchestration widening.
