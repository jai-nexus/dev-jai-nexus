# Claude Project Context Pack - dev-jai-nexus

## What this pack is
This is the compact Claude-facing onboarding packet for dev-jai-nexus.

Its job is to let Claude begin from governed repo context instead of repeated ad hoc explanation.

## Repo identity
- Repo: `dev-jai-nexus`
- Domain: `dev.jai.nexus`
- Role in JAI NEXUS: governed execution, operator surfaces, work packet lifecycle, context portability, and local substrate formalization

## What JAI NEXUS is
JAI NEXUS is a governed AI collaboration platform for structured polyrepo work, durable decision trace, executor-role orchestration, and motion-based governance.

## Core working model
JAI NEXUS uses motions as the canonical governed unit of meaningful change.

Canonical sequence:
1. problem framing
2. proposal
3. challenge
4. execution
5. policy evaluation
6. vote
7. decision
8. ratification

## Executor roles
- ARCHITECT -> planning/design evidence
- BUILDER -> patch/implementation evidence
- VERIFIER -> validation evidence
- OPERATOR -> governed routing and final human decisions
- LIBRARIAN -> structure, packaging, and durable memory

## Current proven foundation
Recent motion sequence established:
- governed live execution through operator decision,
- context bundle generation,
- formal context substrate artifacts.

This means dev-jai-nexus now has:
- a complete first governed vertical slice,
- reusable machine-generated context artifacts,
- a formal local substrate for future councils and slot work.

## Canonical substrate artifacts
These are the stable substrate references Claude should respect:

- `.nexus/context/project-constitution.yaml`
- `.nexus/context/repo-capsule.schema.yaml`
- `.nexus/context/motion-packet.schema.json`
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`

## Canonical workflow assumption
Claude should not replace motion governance.
Claude should help operate inside it.

That means:
- use motions for meaningful changes,
- preserve durable artifact structure,
- distinguish routing, execution, verification, and operator decision stages,
- prefer compact governed context over repeated narrative briefings.

## Context portability
Generated artifacts under `surfaces/chat-context/` are intended for chat/bootstrap reuse:
- motion snapshots
- repo capsules
- active path packs
- context bundle manifest

These help with portability, but canonical truth remains in motion and substrate artifacts.

## Practical operating stance
When helping inside dev-jai-nexus:
- be repo-specific,
- preserve terminology,
- avoid broad speculative redesigns unless motion-backed,
- prefer small coherent changes,
- be aware of role boundaries and proof requirements,
- optimize for maintainability, traceability, and governance coherence.

## Immediate bootstrap reading order
For a fresh Claude project or chat, read in this order:
1. `CLAUDE.md`
2. `.nexus/context/project-constitution.yaml`
3. `.nexus/context/slot-policy.yaml`
4. latest relevant motion package
5. relevant generated context bundle, if available

## What this pack is not
This is not:
- a replacement for motion folders,
- a full repo dump,
- a provider routing policy,
- a cross-repo federation document.

It is the minimal governed project-facing Claude context layer for dev-jai-nexus.
