# Proposal - motion-0045

## Title
Full Motion Snapshot Generator v0: deterministic full-fidelity export + manifest

## Why this motion exists
dev-jai-nexus already has a motion snapshot workflow, but it has shown a clear fidelity failure:

- earlier motions exported with full content,
- later motions degraded into filename-only listings,
- nested motion artifacts were not consistently preserved,
- and branch ambiguity weakened trust in the exported artifact.

That means the current snapshot is useful as a partial bootstrapping layer, but not yet strong enough to act as a true full-governance export.

## What this motion changes
This motion adds one deterministic full-fidelity exporter for `.nexus/motions/`.

The exporter should:
- walk all motion directories in deterministic order,
- include full contents of standard motion files when present,
- recurse into nested subdirectories such as `panels/**` and `evidence/**`,
- append useful `.nexus/` root governance/config artifacts if desired by the implementation,
- emit one dated full snapshot artifact,
- emit one dated manifest sidecar.

## Why this matters
JAI NEXUS depends on portable context.

If motion exports are partial or inconsistent, then:
- new chats start with degraded governance memory,
- generated handoff artifacts become less trustworthy,
- later motion history becomes harder to reconstruct,
- and the system loses one of its strongest durability advantages.

A full motion snapshot generator improves:
- context portability,
- governance trace durability,
- branch-aware session bootstrapping,
- and future Claude / multi-model setup quality.

## Suggested script surface
- `portal/scripts/snapshot-motion-full.mjs`

## Suggested package script
- `snapshot:motions`

## Suggested output location
- `surfaces/chat-context/YYYY-MM-DD_motion-snapshot_full.txt`
- `surfaces/chat-context/YYYY-MM-DD_motion-snapshot_full_manifest.json`

## Design stance
This motion should strengthen export fidelity, not create a new abstraction layer.

The goal is not “another summary.”
The goal is a deterministic, full-content governed export of the repo’s motion history.

## Why now
This is the direct next fix after proving context portability layers and after identifying that the current motion snapshot still loses fidelity on later motions.

That makes motion-0045 a precision follow-up to the existing context substrate work rather than a speculative expansion.
