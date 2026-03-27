# Proposal - motion-0035

## Title
Context Substrate Foundation v0: project constitution + repo capsule schema + motion packet schema + slot policy + scoring rubric

## Why this motion exists
Motion-0033 proved that dev-jai-nexus can generate reusable context bundles:
- motion snapshots,
- repo capsules,
- active path packs,
- manifest sidecars.

That solved the packaging problem.

But it did not yet solve the substrate problem.

JAI NEXUS still needs canonical governed artifacts that define:
- what the project is,
- what a repo capsule is,
- what a motion packet is,
- how executor slots are supposed to work,
- how solutions should be scored.

Without those artifacts, future context bundles can carry useful information but still drift in meaning, scope, or evaluation standard.

## What this motion changes
This motion adds the first formal context substrate layer for dev-jai-nexus.

It should introduce five durable artifacts:

1. **Project Constitution**
   - stable project identity, purpose, principles, role boundaries, and governance assumptions

2. **Repo Capsule Schema**
   - required and optional fields for repo-level context packets

3. **Motion / Decision Packet Schema**
   - bounded structure for council-evaluated change objects

4. **Slot Policy**
   - role-specialized slot purposes, diversity logic, assignment constraints, and lane intent

5. **Scoring Rubric**
   - reusable dimensions for evaluating code outputs and decision quality

## Why this matters
JAI NEXUS is trying to become a governed multi-AI collaboration platform, not just a repo with scripts.

That means context must be:
- durable,
- structured,
- machine-readable,
- reusable across chats and councils,
- governed rather than ad hoc.

Motion-0033 created generated context artifacts.
Motion-0035 should now define the canonical substrate those artifacts are allowed to rely on.

## Suggested output location
A clean first governed location would be something like:

- `.nexus/context/project-constitution.yaml`
- `.nexus/context/repo-capsule.schema.yaml`
- `.nexus/context/motion-packet.schema.json`
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`

If the repo prefers a different governed path, preserve the same conceptual artifact set.

## Design stance
This motion is about **formalizing the substrate**, not maximizing complexity.

So v0 should:
- be compact,
- be explicit,
- use stable terminology,
- prefer durable schema/contract language,
- remain implementable by humans and machines,
- avoid over-expanding into full distributed memory infrastructure.

## Why now
This is the right next move because:
- the first governed vertical slice is now complete,
- context bundle generation already exists,
- future council and slot work will benefit from governed substrate artifacts,
- this motion raises the floor for all later multi-model work.
