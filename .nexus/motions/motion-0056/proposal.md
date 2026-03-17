# Proposal - motion-0056

## Title
Motion Factory v0 — first full-cycle proof and placeholder-first workflow

## Why this motion exists
Motions 0052 through 0055 proved each Motion Factory v0 command individually:
context, draft, draft with API, and revise. But no single motion has been
executed end-to-end through the factory workflow with a recorded evidence
trail. This motion closes that gap by using the factory to author itself
and recording each step as it happens.

Additionally, there is no formal convention requiring that new motions start
from a factory-generated scaffold. This motion establishes that convention.

## What this motion proves

### Full-cycle workflow proof
motion-0056 executes the Motion Factory v0 workflow and records the resulting
command/evidence trail below. The following table is a proof record template
to be completed with real command/action outcomes during execution of the
motion, before ratification.

| Step | Command / Action | Outcome |
|------|-----------------|---------|
| 1. Intent | Human provides intent | To be recorded |
| 2. Context | `motion-factory.mjs context --intent "..."` | To be recorded |
| 3. Draft | `motion-factory.mjs draft --intent "..."` | To be recorded |
| 4. Review | Human reviews generated package | To be recorded |
| 5. Revise | `motion-factory.mjs revise --motion motion-0056 --notes "..."` | To be recorded |
| 6. Final review | Human reviews revised package | To be recorded |
| 7. Council run | `council-run.mjs motion-0056` | To be recorded |
| 8. Ratify | Vote recorded | To be recorded |
| 9. Commit | `git commit` | To be recorded |

This table must be completed with real outcomes before ratification. Steps
7–9 are completed during the ratification process itself.

### Placeholder-first workflow convention
From motion-0056 forward, the expected default operator workflow for new
motions in dev-jai-nexus is:

1. Define intent (human decides what the next motion should do)
2. Run `node portal/scripts/motion-factory.mjs draft --intent "..."`
3. Review the generated 9-file package
4. Optionally run `revise` with notes to tighten specific narrative files
5. Complete final human review
6. Run `council-run.mjs` to execute gates and vote
7. Commit

This is an **operator convention**, not an enforcement gate. There is nothing
in this motion that prevents a human from manually creating motion files
without the factory. The convention establishes the expected workflow to
reduce overhead, not to automate governance authority.

This replaces the previous pattern of manually creating all 9 files from
scratch in chat or by hand.

## What this motion does not change
- No new commands are added to motion-factory.mjs
- No governance config files are modified
- No structural changes to the factory
- No selector activation
- No orchestration behavior
- No enforcement gates for the placeholder-first convention

## What this motion does not prove
- Multi-provider support (Anthropic not yet live)
- Evidence insertion workflow
- Automated revision without human notes
- Full autonomous governance (factory remains a drafting assistant)
- Enforcement of the placeholder-first convention

## Design stance
This is a workflow proof and convention motion. It executes the factory
end-to-end on a real governed motion, records the evidence trail, and
establishes a practical operator convention that reduces future manual
overhead.

## Why now
The factory commands are individually proven. The next step before any
further automation is confirming the full cycle works on a real motion
and making the placeholder-first workflow the default starting pattern.
