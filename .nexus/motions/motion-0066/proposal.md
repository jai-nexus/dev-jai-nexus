# Proposal - motion-0066

## Title
candidate motion consumption and promotion in dev-jai-nexus

## Intent
Consume canonical `candidate.motion` artifacts in Waves UI and define the bounded promotion path from Candidate Motion into Motion Factory draft creation.

## Why this motion exists
`candidate.motion` is now canonically representable in `jai-format` as a v0.1 contract artifact. That means `dev-jai-nexus` no longer needs to define the concept from scratch. Instead, it needs to become a downstream consumer of the canonical contract.

This creates a clear next integration need:

- Waves planning can persist and render plans, but it does not yet consume Candidate Motion as a first-class artifact.
- Agent planning can produce wave plans, but it does not yet emit or attach canonical `candidate.motion` artifacts.
- Motion Factory can create numbered formal motions, but it does not yet define a bounded promotion contract from Candidate Motion into numbered draft creation.
- JAI NEXUS needs a governed preparation layer that remains distinct from both generic task lists and formal motions.

This motion addresses that gap by integrating canonical Candidate Motion consumption into `dev-jai-nexus`, starting with Waves and Motion Factory.

## What this motion changes
- Introduces downstream consumption of canonical `candidate.motion` artifacts inside `dev-jai-nexus`.
- Defines how Waves sessions can attach, store, and render one or more Candidate Motions.
- Defines a bounded mapping from agent planning output into Candidate Motion-shaped artifacts.
- Defines the promotion contract from Candidate Motion into Motion Factory draft creation.
- Preserves lineage between:
  - wave session
  - candidate motion
  - numbered formal motion
- Clarifies that Candidate Motion remains a prep-layer artifact, not a formal Motion.

## What this motion does not change
- No broad terminal-backed execution expansion in this motion.
- No autonomous apply flows in this motion.
- No redefinition of the `candidate.motion` contract inside `dev-jai-nexus`.
- No formal Motion contract introduction in `jai-format`.
- No change to Council voting semantics or ratification rules.
- No full Work UI execution integration beyond future linkage planning.
- No collapse of Candidate Motion into WaveTask or formal Motion.

## Design stance
Candidate Motion is already canonically defined upstream. `dev-jai-nexus` should consume that contract faithfully, render it clearly, and provide an explicit promotion path into formal Motion Factory drafts. Preparation, formalization, execution, and ratification must remain distinct layers.

## Why now
The contract boundary is now established in `jai-format`, which makes downstream integration the correct next step. This is the narrowest, highest-leverage slice that connects Waves UI, agent planning, and Motion Factory without prematurely expanding broad agent execution power.
