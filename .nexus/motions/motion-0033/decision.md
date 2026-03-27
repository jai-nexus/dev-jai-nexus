# Decision Record - motion-0033

## Decision
Proceed with the first text-first context bundle generator for dev-jai-nexus.

## Reason
Manual motion snapshots and repo context packs were slowing down chat bootstrapping and increasing context drift. A deterministic generator for motion snapshots, repo capsules, and active path packs is the smallest high-leverage step toward reusable machine-compiled project memory.

## Constraints
- keep the first version text-first,
- prefer compact compiled context over raw dumps,
- exclude build and generated junk,
- preserve deterministic ordering,
- do not expand this motion into retrieval or embeddings.

## Ratification condition
Ratify only after the bundle generator emits the expected dated artifacts and the three text artifacts remain stable across identical reruns.
