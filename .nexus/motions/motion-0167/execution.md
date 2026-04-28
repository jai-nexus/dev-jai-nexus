# Execution: Q2M4 Control-Plane Clarity Update v0

**Motion:** motion-0167
**Kind:** builder-proof
**Program:** q2-control-plane-clarity-update
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/lib/controlPlane/types.ts`
- `portal/src/lib/controlPlane/repoSurfaceModel.ts`
- `portal/src/lib/agents/types.ts`
- `portal/src/lib/agents/agentRegistry.ts`
- `portal/src/lib/agents/workPacketTypes.ts`
- `portal/src/lib/agents/workPackets.ts`
- `portal/src/lib/agents/workPacketTaskPrompts.ts`
- `portal/src/app/operator/agents/page.tsx`
- `portal/src/app/operator/work/page.tsx`
- `portal/src/app/operator/projects/page.tsx`
- `portal/src/app/repos/page.tsx`
- `.nexus/motions/motion-0167/**`

---

## Ratified evidence record

The control plane now uses one shared vocabulary:

- repo = actual GitHub repository
- surface = product/app/domain area inside a repo
- project = workstream spanning one or more repos and surfaces
- agent scope = configured subset of repo/surface targets
- work packet target = repo + surface + optional project

Bundled model files added:

- `portal/src/lib/controlPlane/types.ts`
- `portal/src/lib/controlPlane/repoSurfaceModel.ts`

These files now drive:

- `/operator/agents`
- `/operator/work`
- `/operator/projects`
- `/repos`

### Canonical repo/surface clarification

Current control-plane canon now renders:

- `jai-nexus/jai-nexus` as the actual repo for:
  - landing page
  - customer portal
  - API Nexus
  - JAI Format
- `customer-portal` as a surface under `jai-nexus/jai-nexus`, not a
  standalone repo
- the five-key agent matrix as a configured scope subset, not the full repo
  universe

### Route-by-route evidence

`/operator/agents`

- relabeled agent scope as a configured subset
- added configured subset mapping table with actual repo and surface targets
- shows `customer-portal` resolving to repo `jai-nexus/jai-nexus` and surface
  `Customer portal`
- explains that `/repos` is the full repo registry while this page is only the
  configured subset for agent review

`/operator/work`

- draft work packets now target actual repo plus surface, with optional project
- current packet targets resolve to:
  - `wp-landing-homepage-refresh` -> `jai-nexus/jai-nexus` + `Landing page`
  - `wp-customer-intake-map` -> `jai-nexus/jai-nexus` + `Customer portal`
  - `wp-agent-registry-follow-up` -> `jai-nexus/dev-jai-nexus` + `Operator agents`
  - `wp-api-contract-review` -> `jai-nexus/jai-nexus` + `API Nexus`
- prompt previews now emit:
  - `Target repo: ...`
  - `Target surface: ...`
  - `Target project: ...`

`/operator/projects`

- now distinguishes projects from repos and surfaces explicitly
- projects render repo coverage and surface coverage separately
- planned repos remain visible as project references without being mislabeled as
  current repo-registry entries

`/repos`

- now presents the full repo registry
- explicitly contrasts the full repo registry with the configured subset shown
  on `/operator/agents`

### Data-level acceptance evidence

Resolved model outputs:

- configured scope count: `5`
- full repo registry count: `5`
- `customer-portal` configured subset:
  - repo: `jai-nexus/jai-nexus`
  - surface: `customer-portal`
- homepage prompt target:
  - repo: `jai-nexus/jai-nexus`
  - surface: `Landing page`
  - project: `JAI Internal / Spine`

### Acceptance evidence

Acceptance checks `CP-01` through `CP-15` passed:

- `CP-01` `/operator/agents` labels repo scope as configured subset
- `CP-02` `/operator/agents` shows customer portal as a surface under `jai-nexus/jai-nexus`
- `CP-03` `/operator/work` targets use repo + surface
- `CP-04` task prompt previews use corrected repo + surface target model
- `CP-05` `/operator/projects` distinguishes project from repo/surface
- `CP-06` `/repos` is labeled as full repo registry
- `CP-07` UI explains full repo registry vs configured agent scope subset
- `CP-08` no execution or write controls were added
- `CP-09` no API route or DB mutation was added
- `CP-10` no runtime or proof files changed
- `CP-11` no existing motions were modified
- `CP-12` no credentials or secret values are displayed
- `CP-13` `pnpm -C portal typecheck` passed
- `CP-14` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0167/motion.yaml` passed
- `CP-15` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed

### Guardrails preserved

- no execution
- no branch writes
- no PR creation
- no dispatch
- no scheduler
- no DB or API mutation
- no credentials or secret values
- no runtime changes
- no cross-repo mutation

### Caveats

- No browser or manual UI smoke test was run in this turn.
- `teacher-copilot` still references a planned repo not present in the current
  full repo registry, and that planned-state distinction is now surfaced
  explicitly instead of being flattened into repo identity.
