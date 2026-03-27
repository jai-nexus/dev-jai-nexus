# Execution Plan - motion-0035

## Goal
Create the first canonical context substrate for dev-jai-nexus so future context bundles, motions, slot orchestration, and council reasoning can rely on governed structural artifacts instead of repeated ad hoc explanation.

## Plan
1. Add project constitution artifact
   - define JAI NEXUS identity, purpose, principles, governance assumptions, and role boundaries.

2. Add repo capsule schema
   - define the expected structure for repo-level context packets.
   - include identity, branch/head state, key paths, current work front, and bounded repo context sections.

3. Add motion / decision packet schema
   - define the bounded object a council reasons over.
   - include problem, proposal, constraints, risks, acceptance criteria, affected surfaces, and decision class.

4. Add slot policy artifact
   - define executor-role slot purposes and constraints.
   - keep policy role-first, diversity-aware, and provider-agnostic where possible.

5. Add scoring rubric artifact
   - define reusable evaluation dimensions.
   - include correctness, maintainability, governance coherence, traceability, reversibility, and scope discipline.

6. Validate internal coherence
   - confirm the artifacts do not conflict in terminology or intended use.
   - confirm the schemas and policy align with recent motions and current runtime architecture.

7. Create proof pack
   - read the five artifacts together as a compact constitutional context pack.
   - confirm they are small enough to reuse in future chat bootstraps and council setup.

## Suggested governed artifact set
- `.nexus/context/project-constitution.yaml`
- `.nexus/context/repo-capsule.schema.yaml`
- `.nexus/context/motion-packet.schema.json`
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`

## Suggested proof
- create all five artifacts,
- inspect them together for consistency,
- confirm they can serve as a stable constitutional substrate for future generated context bundles,
- confirm any touched code/type surfaces still pass local checks.

## Suggested acceptance criteria
- five governed substrate artifacts exist
- each artifact has a distinct purpose
- terminology is consistent with existing JAI NEXUS workflow
- slot policy is role-first and not provider-bound
- scoring rubric is usable for real implementation comparison
- artifacts are compact enough to serve future chat/council bootstrap use
- local validation passes

## Done means
- the first formal context substrate exists,
- future memory and council work can build on governed schema-level artifacts,
- motion-0035 is ratified.
