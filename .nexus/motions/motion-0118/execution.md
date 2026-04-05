# Execution: Corpus V1 Program Planning Canon v0 — pre-motion planning, program graph, context inheritance, and launch packets

**Motion:** motion-0118
**Role:** LIBRARIAN (with ARCHITECT input on schema design)
**Date:** 2026-04-03

---

## Scope

Files created (this motion package):

```
.nexus/motions/motion-0118/motion.yaml
.nexus/motions/motion-0118/proposal.md
.nexus/motions/motion-0118/challenge.md
.nexus/motions/motion-0118/execution.md
.nexus/motions/motion-0118/decision.yaml
.nexus/motions/motion-0118/decision.md
```

Files to create (implementation — in order):

```
.nexus/docs/corpus-v1-program-planning-canon.md        (create — primary narrative)
.nexus/docs/motion-quality-standard.md                 (create — quality checklist)
.nexus/programs/program-graph.schema.yaml              (create — schema)
.nexus/programs/program-plan.schema.yaml               (create — schema)
.nexus/programs/context-inheritance.schema.yaml        (create — schema)
.nexus/programs/program-graph.yaml                     (create — data, partial at v0)
.nexus/programs/motion-launch-packet.template.md       (create — template)
```

New directory created:

```
.nexus/programs/                                        (create)
```

Files NOT changed:
- All `.nexus/motions/` artifacts (motion-0001 through motion-0117)
- All `.nexus/context/` substrate
- All `.nexus/docs/` existing docs
- All `.nexus/codex/` conditioning artifacts
- All `portal/` runtime code
- `CLAUDE.md`
- No package.json changes

---

## Implementation sequence

The 7 artifacts have dependencies. Author in this order:

### Step 1 — `.nexus/docs/corpus-v1-program-planning-canon.md`

The primary narrative. Covers:
- The Corpus V1 / Corpus V2 era boundary definition
- Program graph vocabulary (all 8 terms from proposal §Concepts)
- The 9-phase pre-motion planning workflow (full detail per phase)
- Context inheritance rules (all 4 rules from proposal §Context inheritance)
- How to open a new program: checklist form of phases 1–9
- How to author a launch packet: what it must contain
- The relationship between this canon and the Corpus V2 transition

Length guidance: thorough but not padded. If a concept is clear in one
paragraph, do not expand it to three. The canon should be readable in a
single focused session.

### Step 2 — `.nexus/docs/motion-quality-standard.md`

The quality standard reference. Structure:

1. When to apply this standard (all motions entering a new program line;
   optional for small bounded repairs)
2. Five quality dimensions with pass/fail criteria:
   - **Proposal precision:** input state, change, and output state are explicit
   - **Challenge adversarialism:** strongest honest objections, not strawmen
   - **Execution specificity:** exact files, exact commands, exact expected output
   - **Evidence traceability:** claims are independently verifiable
   - **Decision rationale:** explains why the vote is correct, not just that it passed
3. Quick self-assessment checklist (yes/no, one line per criterion)
4. Relationship to agent review: how a future JAI Agent panel will use this
   standard (intent only — mechanism is Corpus V2 scope)

### Step 3 — `.nexus/programs/program-graph.schema.yaml`

YAML schema for a program graph. Fields:

```yaml
schema_version: "program-graph-0.1"
era:
  id: string           # "corpus-v1" | "corpus-v2"
  description: string
epics:
  - epic_id: string
    title: string
    description: string
    programs:
      - program_id: string
        title: string
        description: string
        parent_motion: string | null
        motion_lines:
          - line_id: string
            motions: [string]   # ordered list of motion_ids
            status: string      # open | closed
        status: string          # open | closed
coverage: string               # "partial" | "complete"
```

### Step 4 — `.nexus/programs/program-plan.schema.yaml`

YAML schema for a planning artifact. Fields correspond to the 9 phases:

```yaml
schema_version: "program-plan-0.1"
program_id: string
created_at: iso8601
phases:
  goal_framing:
    goal: string
    done_when: string
    success_criteria: [string]
  baseline_read:
    relevant_motions: [string]
    relevant_substrate: [string]
    current_state_summary: string
  constraint_mapping:
    hard_constraints: [string]
    soft_constraints: [string]
  program_decomposition:
    motions:
      - motion_id: string
        description: string
        input_state: string
        change: string
        output_state: string
  dependency_graph:
    edges:
      - from: string
        to: string
        type: string    # sequential | parallel | conditional
  agent_panel_strategy:
    per_motion:
      - motion_id: string
        role: string
        operating_mode: string
  cost_estimate:
    sessions: integer | null
    notes: string
  escalation_triggers: [string]
  launch_packet_ref: string    # path to the launch packet file
```

### Step 5 — `.nexus/programs/context-inheritance.schema.yaml`

YAML schema for context inheritance rules within a motion line:

```yaml
schema_version: "context-inheritance-0.1"
program_id: string
motion_line_id: string
inheritance_rules:
  inherited_from_parent:
    - goal_framing
    - baseline_read
    - constraints
  must_restate_if_changed:
    - any field with a stated override reason
  never_re-litigate:
    - resolved challenges from prior motions
    - ratified decisions
  launch_packet_updates:
    - each motion may emit an updated launch packet for the next motion
    - updated packet supersedes the prior one for the remaining line
overrides: []   # list of {field, reason} for any overridden inherited value
```

### Step 6 — `.nexus/programs/program-graph.yaml`

Initial data file for the Corpus V1 program graph. At v0, covers the major
known programs only. Mark coverage as `partial`. Known programs to include:

| Program | Parent motion | Motion line | Status |
|---|---|---|---|
| Q2 loop activation | motion-0071 | 0072–0083 | closed |
| Bootstrap planning | motion-0084 | 0085–0092 | closed |
| OffBook.ai Wave 0 rollout | motion-0093 | 0093–0094 | closed |
| Track A proof chain | motion-0095 | 0095–0101 | closed |
| Codex-exec conditioning | motion-0102 | 0102–0110 | closed |
| Q2 normalization arc | motion-0111 | 0111–0117 | closed |
| Corpus V1 planning canon | motion-0118 | 0118 | open |

Motions 0001–0070 and any unlisted motions: tagged `uncategorized` at v0.

### Step 7 — `.nexus/programs/motion-launch-packet.template.md`

Template for a launch packet. Sections:

```
# Launch Packet: [Program Title] — [First Motion Title]

**Program:** [program_id]
**First motion:** [motion_id]
**Date:** [iso8601]

## Goal
[One-sentence goal from Phase 1]

## Done when
[Explicit success criteria]

## Baseline
[Current state summary from Phase 2]

## Constraints
**Hard:** [list]
**Soft:** [list]

## Decomposition summary
[Table: motion_id | description | input→output]

## Dependency graph
[Mermaid DAG or table]

## Agent / panel strategy
[Table: motion_id | role | operating mode]

## First motion scope
[Exact scope of the first motion — what it does, what it does not do]

## What the first motion must prove
[Explicit exit criteria: what must be true after the first motion for the
second motion to begin]

## Cost estimate
[Sessions, notes]

## Escalation triggers
[List: conditions under which the program should pause or re-scope]
```

---

## Validation

After all 7 artifacts are committed:

```bash
# Confirm new directories and files
ls .nexus/docs/
ls .nexus/programs/

# Validate this motion
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0118/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

---

## Quality check before ratification

Before ratifying motion-0118, confirm against the quality standard:

- [ ] Primary doc is internally consistent and complete
- [ ] Quality standard doc is usable as a checklist without referencing the
      primary doc
- [ ] All 4 schemas are valid YAML and consistent with each other
- [ ] program-graph.yaml is schema-valid and `coverage: partial` is set
- [ ] Launch packet template covers all 9 phases
- [ ] No artifacts reference Corpus V2 mechanisms that are not yet defined

---

## Evidence checklist

- [ ] `.nexus/docs/corpus-v1-program-planning-canon.md` created
- [ ] `.nexus/docs/motion-quality-standard.md` created
- [ ] `.nexus/programs/program-graph.schema.yaml` created and valid
- [ ] `.nexus/programs/program-plan.schema.yaml` created and valid
- [ ] `.nexus/programs/context-inheritance.schema.yaml` created and valid
- [ ] `.nexus/programs/program-graph.yaml` created, coverage: partial
- [ ] `.nexus/programs/motion-launch-packet.template.md` created
- [ ] validate_motion EXIT 0 on motion-0118
- [ ] validate_agency EXIT 0
- [ ] No runtime, UI, DB, or portal files touched
- [ ] No prior motion artifacts modified
