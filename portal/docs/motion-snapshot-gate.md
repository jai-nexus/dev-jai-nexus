# Motion Snapshot Gate

Date: 2026-05-10
Scope: `dev.jai.nexus` / `dev-jai-nexus`
Motion: `motion-0182`

## Purpose

Keep the bundled motion snapshot aligned with canonical `.nexus/motions/**` whenever
a PR changes motion artifacts.

This gate exists because `/operator/motions` can fall behind even when motion
packages are correctly merged, unless the bundled snapshot is explicitly rebuilt.

## Policy

Any PR that adds or changes files under:

- `.nexus/motions/motion-*/**`

must refresh and check the bundled motion snapshot before merge.

This gate is required for motion-bearing PRs because:

- the canonical motion package lives on disk
- the operator motion browser also depends on the bundled snapshot
- a merged motion without snapshot refresh produces visible parity drift

## Required commands for motion-bearing PRs

Run both:

```text
pnpm -C portal snapshot:motions
pnpm -C portal snapshot:motions:check
```

Equivalent direct commands:

```text
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
```

## Required PR evidence

Any motion-bearing PR should include:

- snapshot write command result
- snapshot check command result
- latest bundled motion id
- bundled motion count

Minimum closeout evidence shape:

- `node portal/scripts/build-motion-snapshot.mjs --write` -> PASS
- `node portal/scripts/build-motion-snapshot.mjs --check` -> PASS
- `latest bundled motion` -> `motion-XXXX`
- `bundled motion count` -> `N`

## Scope boundary

This gate applies when the PR changes motion canon or motion snapshot logic.

It does not automatically apply to:

- non-motion PRs
- unrelated portal UI work that does not touch motion packages or snapshot generation

If a PR changes motion rendering or snapshot generation logic, running the check is
still appropriate even if no new motion package is introduced.

## Implementation note

Root `package.json` already uses `snapshot:motions` for a different snapshot flow.
To avoid command-name collision, the motion snapshot aliases are defined in
`portal/package.json` rather than being redefined at repo root.
