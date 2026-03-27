# Proposal (motion-0005)

## 0.0 Problem
JAI NEXUS has the registry + agent mappings for polyrepo coverage, but dev-jai-nexus is not yet acting as a “solo-dev multiplier” conductor.
The system can observe, but the write-path (motion → dispatch → work packets → review → trace) is not yet the default workflow.

## 1.0 Implications
- Coverage drifts because repos are not forced through a single governed loop.
- Context handoffs are manual; “civilization memory” exists but isn’t automatically updated.
- Pivots cause coherence loss because objectives + deprecations aren’t generated as canonical state.

## 2.0 Solution
Implement “Coverage v0” + “Conductor Dispatch v0” in dev-jai-nexus:
- Coverage Map: all apply=true repos visible with CRL level and next-action.
- RepoCard v0: minimal orientation packet per repo.
- Health Snapshot v0: last-known gates + timestamp.
- Dispatch v0: from a motion, generate per-repo work packets and stage edits via SyncRun review.
- Trace writes: append events + update living state (objectives, coverage, idea lineage/deprecations).

## 3.0 Decision Proposal
Adopt CRL levels:
- CRL-0: registered/visible only
- CRL-1: RepoCard + Health Snapshot
- CRL-2: Dispatchable (work packets) + gates runnable
- CRL-3: Traceable (events + idea lineage/deprecations updated)

## 4.0 Scope
Target repo: dev-jai-nexus (cockpit + write-path wiring)
Inputs consumed: registry, agency, rolemap, motions, work-packets, SyncRuns

## 5.0 Next Actions
- Create Coverage v0 scoring + UI surface.
- Implement RepoCard/HealthSnapshot generators.
- Add “Create Motion → Dispatch → Work Packets” path that respects role guardrails and evidence requirements.
