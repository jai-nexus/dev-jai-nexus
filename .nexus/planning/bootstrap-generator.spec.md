# Bootstrap Generator Spec v0

**Artifact:** bootstrap-generator.spec
**Program:** q3-bootstrap-planning
**Workstream:** WS-D
**Motion:** motion-0088
**Version:** 0.1
**Date:** 2026-03-30

---

## Purpose

This document defines the behavioral contract for the future Bootstrap Artifact
Generator — the script or tool that emits a new JAI NEXUS project's Wave 0
governance substrate from the outputs of WS-A, WS-B, and WS-C.

This is a planning specification, not an implementation. The generator
implementation belongs to a separate WS-D implementation motion after this
spec is ratified.

---

## Input contract

The generator reads exactly three documents:

| Input | Source | Required |
|---|---|---|
| Project intake instance | WS-A schema instance | yes |
| Agent demand matrix instance | WS-B schema instance | yes |
| Topology plan instance | WS-C schema instance | yes |

The generator must validate that all three are present and conformant before
emitting any artifacts. If any input is absent or invalid, the generator must
halt with a descriptive error — it must not emit partial output.

**The generator does not read:**
- Existing project files (it is a greenfield emitter, not a patch tool)
- Model-slots files (Wave 1+ concern)
- Provider credentials or environment-specific config
- Any external registry or API

---

## Output contract

The generator emits exactly the 12 Wave 0 artifacts defined in
`bootstrap-manifest.schema.yaml`. It also emits:

- `bootstrap-manifest.instance.yaml` — a completed manifest instance recording
  what was emitted, generation timestamp, and input document hashes. Committed
  to `.nexus/planning/` in the governance-resident repo.

All artifacts are written to the governance-resident repo root. The generator
must create any missing directories before writing files.

---

## Synthesis rules

### `config/agency.yaml`

```
owner.name          ← intake.project_id (kebab → title-case or leave as-is)
owner.handle        ← intake.project_id (first segment)
owner.nh_root       ← demand.nh_root

agents[]            ← demand.governance_agents + demand.execution_agents
  .agent_key        ← demand.agent_key
  .nh_id            ← demand.nh_id
  .scope[repos]     ← demand.scope_repos → "repo:<name>"
  .scope[paths]     ← topology.repo_profiles[name].agent_scope_paths
  .scope[actions]   ← demand.scope_actions → "actions:<action>"
  .scope[deny]      ← standard deny entries from topology.repo_profiles[].agent_scope_paths
  .execution_roles  ← demand.execution_roles
  .governance_only  ← demand.governance_only
```

Safe to synthesize: all fields are mechanically derived. No judgment required.

### `.nexus/context/project-constitution.yaml`

```
project             ← intake.project_name
repo_scope          ← topology.governance_resident_repo
identity.summary    ← template: "<project_name> is a governed AI collaboration
                       platform for <domain>." (human may revise)
roles.executor_roles ← demand.required_roles + demand.optional_roles
current_scope.focus ← template: "<project_id> local substrate formalization"
current_scope.exclusions ← baseline defaults (cross-repo federation, etc.)
principles, invariants  ← copied from project-constitution baseline
```

Safe to synthesize: identity fields and role list are deterministic. The
`identity.summary` template is minimal and flagged for human review.

### `.nexus/agent-manifest.yaml`

```
version             ← "0.1"
description         ← "Local manifest for council runner in <project_id>"
notes               ← ["Currently used as an existence marker; content will be wired later."]
```

Safe to synthesize: existence marker only.

### `.nexus/motions/motion-0001/motion.yaml`

```
motion_id           ← "motion-0001"
status              ← "proposed"
created_at          ← ISO 8601 generation timestamp
owner               ← intake.project_id (placeholder; human may update)
title               ← "Inaugural Governance Motion — <project_name>"
target.domain       ← intake.domain
target.repo         ← topology.governance_resident_repo
kind                ← "governance-inaugural"
summary             ← "<!-- TODO: describe the inaugural governance scope -->"
proposal            ← []  (empty array; human populates)
vote.mode           ← "unanimous_consent"
vote.required_roles ← ["proposer", "challenger", "arbiter"]
```

Partially safe to synthesize: structural fields (ids, timestamps, target) are
deterministic. summary and proposal require human authorship.

### `CLAUDE.md`

```
## Repo
<governance_resident_repo>

## Purpose
[TODO: describe project purpose and governance responsibilities]

## Working assumptions
[TODO: list project-specific working assumptions]

## Canonical governance surfaces
Primary motion location:
- `.nexus/motions/`

Context substrate:
- `.nexus/context/project-constitution.yaml`
- `.nexus/context/repo-capsule.schema.yaml`
- `.nexus/context/motion-packet.schema.json`
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`

Claude-facing setup:
- `CLAUDE.md`
- `.nexus/claude/project-context-pack.md`  <!-- emit when available -->
- `.nexus/claude/bootstrap-set.yaml`       <!-- emit when available -->

## Core commands
- `pnpm council:run motion-XXXX`
- `pnpm -C portal typecheck`
- `pnpm -C portal build`
- `node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX`

## Editing rules
[TODO: describe project-specific editing constraints]

## High-sensitivity surfaces
[TODO: list paths that require extra care]

## How to work in this repo
[TODO: describe project-specific workflow]
```

Partially safe to synthesize: governance surface paths are deterministic
from topology plan. All TODO sections require human authorship.

---

## Manual-only artifact rules

For artifacts classified `manual-only`:

1. The generator **must** create the file and parent directories.
2. The generator **must** emit structural headings appropriate to the file type.
3. The generator **must** use HTML comment placeholders for all content sections:
   `<!-- TODO: author this section -->`
4. The generator **must not** emit any prose, rationale, description, or
   decision text that could be read as governance content.
5. The generator **must not** pre-fill examples or sample text that a human
   might accidentally commit without review.

**Why this matters:** Motion governance artifacts (proposal.md, challenge.md)
are cited in ratification. Placeholder prose in these files creates false
governance trace — a core integrity failure.

---

## Hard prohibitions

The generator must never:

| Prohibition | Reason |
|---|---|
| Auto-author `proposal.md` body text | Governance decision text requires human judgment |
| Auto-author `challenge.md` | Challenge review is a governance act |
| Emit `decision.yaml` with `status: RATIFIED` | Ratification requires council process |
| Emit `vote.json` with `outcome: PASS` | Vote outcome is a governed result |
| Write `.env*` files | Secrets must never be in governance artifacts |
| Write `model-slots.yaml` | Staffing assignment is a Wave 1+ decision |
| Write `agent-panels.yaml` | Panel configuration requires expanded/panel tier decision |
| Emit motions beyond `motion-0001` | Motion-0002+ are created through governance process |
| Overwrite existing files without explicit `--force` flag | Bootstrap is idempotent by default |
| Emit artifacts to secondary repos | Wave 0 targets governance-resident repo only |

---

## Idempotency requirement

The generator must be idempotent:
- Running it twice on the same inputs must produce identical output.
- If a target file already exists, the generator must skip it unless `--force`
  is passed explicitly.
- `--force` mode should prompt for confirmation before overwriting existing files.
- The bootstrap manifest instance records whether generation was a fresh emit
  or a forced overwrite.

---

## Implementation notes for the WS-D implementation motion

These are planning-level notes for the implementer. They are not binding on
the spec, but they reflect constraints the implementer should be aware of.

1. **Input parsing:** All three input documents are YAML. A robust YAML parser
   is required. The generator should validate required fields before emitting.

2. **Template engine:** A simple string-interpolation approach is sufficient
   for most generated files. A full template engine is not required.

3. **Baseline file location:** Copied artifacts require access to the
   dev-jai-nexus baseline. The implementation should support a `--baseline`
   path argument or a bundled copy of the baseline files.

4. **Output directory:** The implementation should support a `--output` path
   argument pointing to the governance-resident repo root.

5. **Dry-run mode:** The implementation should support `--dry-run` to print
   what would be emitted without writing files. This is a low-cost safety
   mechanism with high value for first-time use.

6. **Manifest output:** `bootstrap-manifest.instance.yaml` should include
   SHA-256 hashes of input documents for reproducibility verification.

7. **Scope:** The initial implementation targets Wave 0 only. Waves 1–4 are
   driven by the normal governance loop, not the generator.

---

## What comes next after this spec

This spec is complete and implementable. The next step is a WS-D
**implementation** child motion that produces the actual generator script.
That motion is the first implementation-oriented child motion under
motion-0084.

WS-E (Dispatch and Coverage Integration) remains planning-only and is
independent of the generator implementation. It may proceed in parallel
with the WS-D implementation motion.
