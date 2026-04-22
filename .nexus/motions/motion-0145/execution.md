# Execution: JAI Workflow Kit Canon v0

**Motion:** motion-0145
**Kind:** builder-proof
**Status:** DRAFT — awaiting implementation and gate results

---

## Implementation-ready plan

### Touch list (3 new files)

1. `.nexus/docs/workflow-kit-model.md` — new canon doc: kit definition, v0 catalog
   (4 kits), kit structure canon, state-carrying, kit-selection guidance, boundary
   rules, non-goals
2. `.nexus/docs/templates/kit-manifest-template.md` — new template for instantiating
   a single kit using the kit structure canon
3. `.nexus/docs/examples/workflow-kit-example.md` — new illustrative example covering
   Kit 1, Kit 2, Kit 3, and a filled kit manifest

(This file is updated after implementation with evidence.)

### No-touch list

- `.nexus/docs/control-thread-model.md` (motion-0140)
- `.nexus/docs/repo-execution-model.md` (motion-0141)
- `.nexus/docs/orchestrator-model.md` (motion-0142)
- `.nexus/docs/exploration-model.md` (motion-0143)
- `.nexus/docs/workflow-composition-model.md` (motion-0144)
- `.nexus/codex/passalong-schema.md`
- `.nexus/docs/templates/` (all existing templates)
- `.nexus/docs/examples/` (all existing examples)
- `portal/` (all files)
- `.nexus/codex/evals/`
- `.claude/commands/`
- `package.json`
- All grid governance scripts

---

## Per-path specifications

### `.nexus/docs/workflow-kit-model.md`

Model spec:

```
# JAI Workflow Kit Canon v0

## Workflow kit definition
[Definition: kit = named reusable multi-layer package specifying mode sequence,
state-carrying, artifacts, selection conditions. Guide not controller. Does not
dispatch sessions.]

## Kit structure canon
Each kit entry contains:
- Kit ID and name
- Role sequence (ordered list of modes)
- Per-transition state-carrying (state buckets per boundary, from composition model)
- Artifacts referenced (templates and docs per mode session)
- Selection conditions
- Boundary notes

## V0 kit catalog

### Kit 1: Normal delivery loop
[Sequence: CONTROL_THREAD → ORCHESTRATOR → REPO_EXECUTION → CONTROL_THREAD]
[State-carrying: all seven buckets at CT→ORC; current baseline + settled + tasks
+ routing at ORC→RE; current baseline + settled + what remains open at RE→CT]
[Artifacts: orchestrator templates; repo-execution templates; passalong schema]
[Selection conditions: clear scoped deliverable; bounded seam available; no
unresolved problem space]
[Boundary notes: ORCHESTRATOR produces a recommendation, does not execute work]

### Kit 2: Exploration-first loop
[Sequence: CONTROL_THREAD → EXPLORATION → ORCHESTRATOR → REPO_EXECUTION →
CONTROL_THREAD]
[State-carrying: all seven buckets at CT→EXP; exploration outcome + settled +
routing at EXP→ORC; full contract at ORC→RE; current baseline + settled + open
at RE→CT]
[Artifacts: exploration template; exploration-outcome template; orchestrator
templates; repo-execution templates; passalong schema]
[Selection conditions: problem space unresolved; investigation or option-shaping
required before seam can be identified]
[Boundary notes: EXPLORATION requires a stated bounded target before the session
begins; direct EXPLORATION→REPO_EXECUTION is an exception path requiring explicit
justification]

### Kit 3: Deferred/hold loop
[Sequence: ORCHESTRATOR → deferred item registered in CONTROL_THREAD →
CONTROL_THREAD (next cycle). CONTROL_THREAD itself may also register a hold
without routing through ORCHESTRATOR.]
[State-carrying: current baseline + what remains open + open risks at boundary;
deferred item recorded as open item in CONTROL_THREAD]
[Artifacts: passalong schema; CONTROL_THREAD deferred-item record]
[Selection conditions: seam identified but cannot close this cycle; resource
constraint, missing precondition, or governance hold]
[Boundary notes: no transition to REPO_EXECUTION occurs in this cycle; deferred
item must be explicitly registered, not silently dropped]

### Kit 4: Governance-readiness review loop
[Sequence: CONTROL_THREAD → EXPLORATION → CONTROL_THREAD]
[State-carrying: current baseline + settled + open risks at CT→EXP; exploration
assessment + settled + routing at EXP→CT]
[Artifacts: exploration template; exploration-outcome template; passalong schema]
[Selection conditions: arc-level pre-check required before ratification; EXPLORATION
used with a bounded governance-readiness target]
[Boundary notes: EXPLORATION session must have an explicit bounded target (the
governance-readiness question); ORCHESTRATOR and REPO_EXECUTION are not included
in this pattern; EXPLORATION produces an assessment, not a ratification decision]

## State-carrying
[Kits instantiate the seven-bucket contract from workflow-composition-model.md.
No new state buckets defined here.]

## Kit-selection guidance
[Matching table: clear deliverable → Kit 1; unresolved problem space → Kit 2;
identified-but-deferred seam → Kit 3; arc-level pre-check → Kit 4]
[When multiple apply: record selection condition and reason in passalong]

## Boundary rules
[Kits do not: dispatch sessions, enforce transitions, mutate state, override mode
docs, define new modes, define new state buckets, substitute for governed motions]
[Governance constraints apply regardless of active kit: no ratification without
evidence artifacts; no scope widening without new motion]

## Non-goals
[Automation engine; enforcement infrastructure; new coordination modes; new state
bucket schema; modifications to existing mode model docs]
```

### `.nexus/docs/templates/kit-manifest-template.md`

Template spec:

```
# Kit Manifest: [Kit ID — Kit Name]

## Instantiation context
- Motion: [motion-XXXX]
- Branch: [branch name]
- Date: [YYYY-MM-DD]
- Selecting session role: [CONTROL_THREAD | ORCHESTRATOR | REPO_EXECUTION | EXPLORATION] (the mode session that selects and references this kit)

## Kit selected
- Kit ID: [kit-1 | kit-2 | kit-3 | kit-4]
- Kit name: [name from v0 catalog]
- Selection condition: [which condition from kit-selection guidance applies]
- Selection rationale: [why this kit was chosen over alternatives]

## Role sequence
[Ordered list of modes for this instantiation]

## Per-transition state-carrying
[For each boundary in the sequence:]
- [Mode A] → [Mode B]: [list of state buckets required at this boundary]

## Artifacts referenced
[For each mode session in the sequence:]
- [Mode]: [templates and docs this session uses]

## Boundary notes
[Kit-specific constraints that apply to this instantiation]

## Instantiation notes
[Any session-specific context, deviations from standard kit, or open items]
```

### `.nexus/docs/examples/workflow-kit-example.md`

Example spec:

```
# Workflow Kit Example

> **Illustrative only.** This document uses fictional references and placeholder
> values. It is not a governance record. It does not establish new canon.

## Example scenario
[Fictional program with placeholder motion IDs, branch names, and dates]

## Kit 1 instantiation: Normal delivery loop
[Filled kit manifest for the normal delivery loop in the example scenario]
[Covers: CT→ORC→RE→CT; state-carrying at each boundary; artifacts; selection
condition note]

## Kit 2 instantiation: Exploration-first loop
[Narrative description of why Kit 2 was selected; key transitions; outcome routing]

## Kit 3 instantiation: Deferred/hold loop
[Narrative description of the deferred seam; what was registered in CT; why Kit 3
was selected instead of Kit 1]

## Filled kit manifest (normal delivery loop)
[Complete filled kit-manifest-template.md for the Kit 1 instantiation in the
example scenario, using placeholder values throughout]
```

---

## V-matrix

| Check | Criterion | Method |
|-------|-----------|--------|
| V-1 | workflow-kit-model.md exists | File check |
| V-2 | Kit definition present | grep "workflow kit" workflow-kit-model.md |
| V-3 | Exactly 4 kits in v0 catalog | Count Kit 1–4 headings |
| V-4 | Kit structure canon present (6 required fields) | grep field names |
| V-5 | State-carrying references composition model | grep "workflow-composition-model" |
| V-6 | Boundary rules present | grep "Boundary rules" |
| V-7 | kit-manifest-template.md exists | File check |
| V-8 | Template has all 7 required fields | grep field names in template |
| V-9 | workflow-kit-example.md exists | File check |
| V-10 | Example marked illustrative | grep "Illustrative only" |
| V-11 | Example covers Kit 1, Kit 2, Kit 3 + filled manifest | Section check |
| V-12 | No existing docs modified | git diff --name-only HEAD |
| V-13 | No dispatch language in new files | grep "the kit dispatches\|kit routes to\|session dispatched by kit" |
| V-14 | No new state buckets introduced | grep "state bucket" workflow-kit-model.md |
| V-15 | validate-motion passes | pnpm council:run motion-0145 (gate) |
| V-16 | validate-agency passes | gate result |
| V-17 | typecheck passes | pnpm -C portal typecheck |

---

## Commit plan

**Commit 1** — Add workflow-kit-model.md
```
governance(motion-0145): add workflow-kit-model.md — JAI Workflow Kit Canon v0

Defines the workflow kit concept, v0 catalog of four standard kits,
kit structure canon, state-carrying (inherits composition model contract),
kit-selection guidance, and boundary rules.
```

**Commit 2** — Add kit-manifest-template.md + workflow-kit-example.md
```
governance(motion-0145): add kit-manifest-template and workflow-kit-example
```

**Commit 3** — Update execution.md with implementation evidence
```
governance(motion-0145): record implementation evidence in execution.md
```

---

## PR draft

Title: `governance: ratify motion-0145 JAI Workflow Kit Canon v0`

Body:
```
Implements motion-0145 — JAI Workflow Kit Canon v0.

Adds:
- .nexus/docs/workflow-kit-model.md — kit definition, v0 catalog (4 kits),
  kit structure canon, state-carrying, kit-selection guidance, boundary rules
- .nexus/docs/templates/kit-manifest-template.md
- .nexus/docs/examples/workflow-kit-example.md

No existing docs modified. All required gates pass.
Basis: motion-0144 (JAI Workflow Composition Canon v0).
```

---

## Rollback steps

1. `git revert <commit>` for each commit in the commit plan
2. Verify no existing docs were touched (V-12)
3. Motion returns to DRAFT status

---

## Defect traps

**Trap 1 — Dispatch language**
Before ratification: grep for "the kit dispatches", "kit routes to",
"session dispatched by kit" across all three new files. Any match is a defect.
Kits are guides; replace dispatch language with "the session that selects the kit."
(Note: "dispatch" and "routes to" may appear legitimately in boundary rule negations
— "kits do not dispatch sessions" — and should not be flagged.)

**Trap 2 — Kit count**
Count Kit 1, Kit 2, Kit 3, Kit 4 headings in workflow-kit-model.md. If the count
is not exactly 4, the catalog has drifted. Remove extras or restore missing entries.

**Trap 3 — New state buckets**
Grep for "state bucket" in workflow-kit-model.md. Any instance that defines a
bucket not present in workflow-composition-model.md is a defect. All bucket
references must point back to the composition model.

**Trap 4 — Template field parity**
Compare kit-manifest-template.md fields against the kit structure canon in
workflow-kit-model.md. Required fields: kit ID/name, role sequence, per-transition
state-carrying, artifacts, selection conditions, boundary notes, instantiation
notes. Missing or extra required fields are a defect.

**Trap 5 — Example illustrative marker**
grep "Illustrative only" workflow-kit-example.md. If the marker is absent, add it
as a blockquote before any content. The marker is a ratification requirement (SC-3).

**Trap 6 — Existing doc modification**
Run `git diff --name-only HEAD` before the ratification commit. Any existing
`.nexus/docs/` file in the diff is a defect. Revert the modification and verify
V-12 clears before proceeding.

---

## Implementation evidence

- workflow-kit-model.md: created at 2026-04-21T00:00:00.000Z
- kit-manifest-template.md: created at 2026-04-21T00:00:00.000Z
- workflow-kit-example.md: created at 2026-04-21T00:00:00.000Z
- Gate results: validate-motion PASS, validate-agency PASS, typecheck PASS
- Implementation confined to: .nexus/docs/workflow-kit-model.md,
  .nexus/docs/templates/kit-manifest-template.md,
  .nexus/docs/examples/workflow-kit-example.md,
  .nexus/motions/motion-0145/**
- No .claude/**, portal/**, package.json, or runtime/command surfaces touched
- V-matrix: all required checks pass (V-1 through V-17)
