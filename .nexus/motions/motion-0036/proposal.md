# Proposal - motion-0036

## Title
Claude Project Integration v0: project context pack + CLAUDE.md + repo-centric operating setup

## Why this motion exists
Motion-0033 proved that dev-jai-nexus can generate reusable context bundles:
- motion snapshots,
- repo capsules,
- active path packs,
- bundle manifests.

Motion-0035 then established the formal context substrate:
- project constitution,
- repo capsule schema,
- motion packet schema,
- slot policy,
- scoring rubric.

That means the next practical step is to make this substrate usable in the coding workflow that matters right now: Claude-centered project work.

At the moment, Claude usage is still under-governed:
- setup depends on manual explanation,
- repo conventions are not captured in a single Claude-facing file,
- substrate artifacts exist but are not yet assembled into a clear Claude project pack.

## What this motion changes
This motion adds the first governed Claude-facing integration layer for dev-jai-nexus.

It should introduce:
1. a Claude project context pack,
2. a repo-root `CLAUDE.md`,
3. a minimal recommended bootstrap set for Claude project setup,
4. a repo-centric workflow description for how Claude should be used in dev-jai-nexus.

## Why this matters
The goal is not merely to "use Claude."

The goal is to make Claude operate from governed repo context rather than repeated ad hoc explanation.

That means:
- stable terminology,
- repo-specific guidance,
- governed bootstrap artifacts,
- reduced recontextualization,
- better alignment between Claude work and motion-based governance.

## Suggested artifact set
A clean v0 could include:

- `CLAUDE.md`
- `.nexus/claude/project-context-pack.md`
- `.nexus/claude/bootstrap-set.yaml`
- `.nexus/claude/operating-workflow.md`

If the repo prefers a slightly different governed path, preserve the same conceptual structure.

## Design stance
This motion should remain practical and small.

It should:
- help immediate Claude setup,
- be grounded in the newly ratified substrate,
- stay repo-centric,
- avoid provider-general abstractions unless directly useful,
- avoid turning into a full multi-provider integration motion.

## Why now
This motion has high leverage because it directly improves day-to-day coding speed while standing on top of the durable substrate just established.
