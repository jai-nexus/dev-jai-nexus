# Proposal — motion-0033

## Title
Context Bundle Generator v0: motion snapshots + repo capsule + active path pack

## Why this motion exists
The runtime strip has now been proven through verifier:
- architect live runner,
- builder live runner,
- verifier live runner,
- operator-review handoff.

The next major bottleneck is not runtime proof. It is context portability.

Today, motion state and repo context are being assembled manually into snapshot files. That creates four problems:
1. repeated manual labor,
2. inconsistent formatting,
3. oversized uploads,
4. context drift between chats.

JAI NEXUS needs a deterministic way to compile reusable context artifacts so the same project state can be carried into new model sessions without repeatedly reconstructing it by hand.

## What this motion changes
This motion adds a first text-first context bundle pipeline with three primary artifacts:

1. **Motion Snapshot**
   - dated compiled view of motion history and current governance state.

2. **Repo Capsule**
   - dated bounded summary of repo structure, purpose, commands, key files, and current work front.

3. **Active Path Pack**
   - dated task-local context pack focused on the current motion, touched files, or selected paths.

A manifest sidecar should also be emitted so later tooling can reason about the bundle programmatically.

## Proposed outputs
Suggested output names:
- `YYYY-MM-DD_motion-snapshots.txt`
- `YYYY-MM-DD_repo-capsule.txt`
- `YYYY-MM-DD_active-path-pack.txt`
- `YYYY-MM-DD_context-bundle_manifest.json`

Suggested output location:
- `surfaces/chat-context/`

If the repo prefers a different governed location, preserve the same artifact shapes.

## Design stance
This motion should compile context, not dump it.

That means:
- deterministic ordering,
- bounded length,
- exclusion of junk/build paths,
- compact summaries over raw copies when possible,
- text-first outputs that are easy to upload into chats.

## Suggested implementation surfaces
Likely new scripts:
- `portal/scripts/generate-motion-snapshot.mjs`
- `portal/scripts/generate-repo-capsule.mjs`
- `portal/scripts/generate-active-path-pack.mjs`
- `portal/scripts/generate-context-bundle.mjs`

Likely touched support surfaces:
- helper utilities for path filtering,
- helper utilities for motion parsing,
- package scripts for easy invocation.

## Why now
This motion improves every future workflow:
- new chat bootstrap,
- passalong quality,
- council continuity,
- multi-model slot context,
- audit-friendly context packaging.

It is the right next leverage move before expanding further executor automation.
