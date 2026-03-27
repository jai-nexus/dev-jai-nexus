# Decision Record - motion-0042

## Decision
Proceed with the first task-local code surface pack generator for dev-jai-nexus.

## Reason
Motion-0041 proved that the Claude setup stack remained usable under code-heavy bounded-task conditions, but relevant file selection still depended too heavily on manual operator judgment. Motion-0042 closes that gap by adding a deterministic generator that compiles a bounded task-local code pack with canonical file references, bounded excerpts, and a manifest sidecar.

## Constraints
- keep the output compact and path-oriented,
- preserve canonical truth in repo source files,
- avoid whole-repo dumping,
- avoid semantic retrieval or embeddings in this motion,
- keep the generated pack clearly secondary to source truth.

## Ratification condition
Ratify only after:
- a dated task-local code pack is generated,
- a manifest sidecar is generated,
- selected files are sensible and bounded,
- rerun behavior is stable enough for repeated use,
- the resulting pack is practically useful for code-heavy Claude setup.
