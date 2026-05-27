# JAI Toolchain Active Capability Map v0

## Current baseline

`dev-jai-nexus` remains the Operator Control Plane and cross-repo
coordinator for JAI Toolchain planning, reference visibility, passalong
routing, and static operator-facing status framing.

Recent settled context relevant to this map:

- `jai-format` completed the workflow-packet strict schema lane and downstream
  strict-schema consumer evaluation
- `dev-jai-nexus` completed Workflow Packet Strict Schema Static Visibility
  Planning v0
- that `dev-jai-nexus` slice remained docs/plans only
- no portal/app files were changed in that slice
- no validation execution, schema enforcement, route selection, dispatch
  behavior, runtime behavior, or downstream enforcement was added

This capability map is planning-only and control-plane-facing. It does not
implement any capability and does not change authority.

## Settled canon

The following cross-repo/cross-lane posture is treated as settled input for
this capability map:

- `dev-jai-nexus` owns control-plane visibility, cross-repo routing, approval
  posture, and planning/reference coordination
- `jai-format` owns `.jai`, Routing Core, NHID, source style,
  `workflow-packet/v0`, `project-context-graph/v0`, the canonical permissive
  workflow-packet schema, and the optional strict workflow-packet schema
- `jai-format` strict schema is ready but unenforced
- `orchestrator-nexus` owns dry-run/manual-run packaging, normalized evidence,
  and evidence/routing vocabulary within separately governed scope
- `jai-edge` owns the read-only Edge Runner health snapshot utility and acts as
  a private/local evidence node
- `dev-jai-nexus` already has a static/read-only Edge Runner health operator
  surface
- Toolchain runtime integration remains not authorized
- Toolchain events and client payloads are not global SoT by default
- raw JSONL remains ingress evidence only unless separately governed

## Active work

Active today means capabilities or lanes that provide real operator value now,
even if they remain bounded and non-authorizing.

- `dev-jai-nexus`
  - cross-repo planning/canon routing
  - static visibility planning
  - passalong/routing coordination
  - static Edge Runner health operator visibility
- `orchestrator-nexus`
  - dry-run planning lane
  - manual runner lane
  - Edge Runner health evidence lane
  - Pi scheduled health observer lane
  - evidence normalization lane
- `jai-edge`
  - read-only health snapshot utility
  - Pi Edge Runner health evidence source
- `jai-format`
  - `.jai` language baseline
  - workflow-packet profile baseline
  - project-context-graph baseline
  - permissive and optional strict schema baseline

Known operational items:

- Pi Edge Runner scheduled health observer is active and writing hourly
  read-only evidence
- `orchestrator-nexus` has a manual runner / scheduled observer evidence lane
- `jai-edge` provides a read-only health snapshot utility
- `dev-jai-nexus` has a static/read-only Edge Runner health card
- `jai-format` has a strict schema baseline, but no enforcement
- `dev-jai-nexus` has strict-schema static visibility planning, but no
  portal/app implementation for that strict-schema lane

## Paused lanes

Paused means the lane is settled enough to stop active work for now, or it is
intentionally not being expanded until a better downstream seam is chosen.

- `dev-jai-nexus` strict-schema visibility work is paused after docs/plans-only
  review
- direct portal/app implementation for strict-schema visibility is paused
- deeper schema work in `dev-jai-nexus` is paused unless a real downstream
  consumer needs it
- runtime Toolchain integration is paused under `not_authorized` posture
- live dashboard implementation is paused

## Open questions

- Which next capability creates the most visible operator utility without
  widening authority?
- Should the next visible seam be a static `dev-jai-nexus` capability/status
  surface, or should evidence-index planning happen first in
  `orchestrator-nexus`?
- Is the next bottleneck visibility, consumability of evidence, or
  privacy/authority review before client handoff work?
- When should a downstream workflow-packet consumer be elected, if at all?
- How much detail should `dev-jai-nexus` mirror locally without drifting from
  upstream repo ownership?

## Deferred ideas

- unified live Toolchain dashboard
- runtime packet ingestion
- parser/projection runtime
- schema enforcement in `dev-jai-nexus`
- API/DB persistence
- provider/model dispatch path
- approved desktop/browser handoff implementation
- automated branch/PR workflow
- customer-facing `.jai` surfaces
- production infrastructure / customer workload path

## Current useful capabilities

Useful now means the capability can already help `CONTROL_THREAD` or an
operator without adding new runtime or execution authority.

### Edge Runner health evidence loop

- `jai-edge` read-only signal source
- `orchestrator-nexus` normalized evidence, manual runner, and scheduled
  observer lane
- `dev-jai-nexus` static operator visibility

This is the clearest currently useful end-to-end lane.

### `CONTROL_THREAD` passalong and routing workflow

- cross-repo sequencing
- baseline preservation
- deferred-item preservation
- next-seam routing

### `dev-jai-nexus` cross-repo planning/canon surface

- static planning and reference surfaces
- operator-facing read-only context
- explicit authority boundary reminders

### `jai-format` workflow packet and context graph baseline

- shared grammar/reference utility
- clarity on representation versus execution
- durable reference base for future consumers

### Static docs/reference coordination maps

- workflow spine
- repo role map
- packet flow map
- static `.jai` context visibility review
- workflow-packet strict-schema static visibility planning

## Missing utility gaps

The system is still missing several things that would make it more visibly
useful, even though the foundational boundaries are stronger now.

- no unified live Toolchain dashboard
- no runtime packet ingestion
- no schema enforcement in `dev-jai-nexus`
- no downstream workflow-packet consumer selected
- no parser/projection runtime
- no API/DB persistence
- no provider/model dispatch path
- no approved desktop/browser handoff implementation
- no automated branch/PR workflow
- no production infrastructure/customer workload path
- no customer-facing `.jai` surfaces

## Candidate next capabilities

### Candidate 1 - `dev-jai-nexus` static Operator Control Plane status card / capability map surface planning

- value: visible operator utility
- risk: low if docs/static first
- boundary: no live data, no controls, no API/DB
- likely usefulness: high

### Candidate 2 - `orchestrator-nexus` evidence index / `latest.json` consumption planning

- value: makes evidence easier to consume later
- risk: medium if it drifts toward live ingestion
- boundary: planning/evidence-index only
- likely usefulness: high, but should remain non-live unless routed

### Candidate 3 - `jai-format` typed-reference fixture examples

- value: improves grammar/schema clarity
- risk: low
- boundary: schema/reference only
- likely usefulness: medium unless a downstream consumer is ready

### Candidate 4 - `vscode-nexus` local packet display / handoff planning

- value: IDE operator utility
- risk: context over-collection if not bounded
- boundary: explicit file/context inclusion only
- likely usefulness: medium/high after packet grammar stabilizes

### Candidate 5 - `jai-pilot` desktop/browser handoff boundary planning

- value: future user-approved browser/desktop handoff
- risk: high if it drifts into desktop/browser control
- boundary: planning/UX only
- likely usefulness: medium, but needs tight audit posture

### Candidate 6 - `audit-nexus` packet/schema authority and privacy review

- value: reduces privacy/authority risk before client handoff
- risk: low
- boundary: review only
- likely usefulness: high before client or runtime work

## Recommended next move

Recommended decision:

- route next to `dev-jai-nexus` for Static Toolchain Status / Capability Map
  Surface Planning v0

Reason:

- the system needs visible operator utility more than additional schema detail
  right now
- `dev-jai-nexus` is already the control-plane coordinator and static
  visibility owner
- a unified static status/capability view can summarize operational, paused,
  planning-only, and future lanes without widening authority
- this remains docs/static planning first and preserves all current
  non-authorizations

If `CONTROL_THREAD` prefers not to expand visibility yet, the fallback is:

- pause after this capability map and keep the current planning/reference
  package as the temporary unified view

## Non-authorizations

This artifact does not authorize:

- portal/app code
- schema changes
- `jai-format` mutation
- validation execution
- parser implementation
- formatter implementation
- projection implementation
- CLI implementation
- CI wiring
- runtime interpreter
- live routing
- automation
- provider/model dispatch
- desktop/browser control
- API/DB mutation
- branch/PR automation
- production/customer workload authority
- deployment/sync/migration authority
- downstream enforcement
- customer data handling
- credential/session/token capture
- live telemetry
- control buttons
- remediation controls

## Routing table

| Repo | Current capability | Category | Useful now? | Current owner role | Missing utility gap | Next useful move | Explicit non-authority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dev-jai-nexus` | Operator Control Plane, cross-repo coordinator, static visibility planning, static Edge Runner health surface, strict-schema visibility planning | reference/static only; planning-only | yes | control-plane visibility and routing owner | no unified static Toolchain capability surface | static Toolchain Status / Capability Map surface planning | no runtime authority, no validator role, no portal controls, no API/DB mutation |
| `jai-format` | `.jai`, Routing Core, NHID, source style, workflow-packet profile, project-context-graph profile, permissive schema, optional strict schema | strict-schema ready but unenforced | yes, as reference | grammar/schema/profile owner | no elected downstream consumer and no enforcement | grammar/schema stewardship only if more schema/profile work is needed | no runtime interpretation, no enforcement by implication, no execution authority |
| `orchestrator-nexus` | dry-run planning lane, manual runner lane, Edge Runner health evidence lane, Pi scheduled observer lane, evidence normalization | currently operational | yes | evidence/dry-run/manual-run owner | evidence remains harder to consume broadly without a unified static index | evidence index / `latest.json` consumption planning | no broad execution authority beyond separately governed scope |
| `jai-edge` | read-only health snapshot utility, Pi health evidence source, private/local evidence node | currently operational | yes | read-only signal source owner | narrow scope; not a general Toolchain execution surface | preserve as read-only source and connect only through governed evidence lanes | no deployment authority, no customer workload authority |
| `jai` | portable substrate, council reasoning semantics, motion/council semantics | reference/static only | yes, as semantics baseline | substrate semantics owner | no visible downstream product/operator surface by itself | continue semantics stewardship or support downstream packet/approval clarity | no product UI, no API runtime, no execution authority |
| `vscode-nexus` | IDE bridge, role packet/preflight direction, repo-context bridge, explicit context inclusion posture | future tooling candidate | not yet | future IDE-side review surface owner | no selected handoff implementation and no visible local packet surface yet | local packet display / handoff planning | no hidden file capture, no autonomous repo mutation, no global SoT |
| `jai-pilot` | future desktop/browser/operator handoff surface, explicit user-approved handoff UX candidate | future UI candidate | not yet | future browser/desktop handoff owner | no approved UX boundary implementation | handoff boundary planning | no hidden scraping, no credential capture, no autonomous browser/desktop actions |
| `api-nexus` | future interface/integration/data-contract surface | future runtime candidate | not yet | future interface boundary owner | no runtime Toolchain integration and no downstream enforcement | interface planning only after clearer packet consumer demand | no global SoT by default, no downstream enforcement, no runtime Toolchain authority |
| `audit-nexus` | packet/context/privacy/security review lane | planning-only | not directly | review gate candidate | review lane not yet paired with a concrete client-handoff seam | packet/schema authority and privacy review | does not grant implementation authority by itself |
| `docs-nexus` | documentation, source intelligence, canon support | reference/static only | yes, indirectly | documentation/canon support owner | no direct operator utility surface by itself | support canon packaging and source-intelligence continuity | no runtime execution, no product state |

## Residual risks

- capability categories may still be overread as readiness for implementation
  if the non-authorizations are not kept visible
- operational evidence lanes may be mistaken for broad runtime authority
- strict-schema readiness may still be mistaken for enforcement or production
  readiness
- a future visibility surface could drift into live/dashboard expectations if
  static/manual posture is weakened
- client-side lanes may be pursued before audit/privacy review is sufficiently
  explicit
- deeper schema or packet work could continue even if visible operator utility
  remains the more urgent gap

## Authority boundary

This artifact is docs/plans only.

It does not:

- implement any capability
- authorize portal/app changes
- authorize runtime integration
- authorize execution or automation
- authorize downstream enforcement
- authorize cross-repo mutation
