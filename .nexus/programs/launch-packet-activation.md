# Launch-Packet Activation Path

**Established:** motion-0119
**Date:** 2026-04-04
**Template reference:** `.nexus/programs/motion-launch-packet.template.md`
**Schema reference:** `.nexus/programs/program-plan.schema.yaml`
**Context inheritance schema:** `.nexus/programs/context-inheritance.schema.yaml`

---

## Purpose

A filled-in launch packet is a planning artifact. This document defines the
governed path from a filled-in launch packet to a motion-ready execution state.
Without this path, a launch packet lives in isolation from the motion work it
is supposed to enable.

The activation path has four steps: validate, convert, inherit, and hand off.

---

## Step 1 — Validate the filled-in launch packet

Before converting a launch packet into motion-ready state, confirm it is
complete and internally consistent.

### Completeness check

All bracketed placeholders in the template must be replaced with real values.
A launch packet is not complete if it contains any of:
- `[bracketed placeholder]`
- `[motion-NNNN]` without a real motion ID assigned
- `[TBD]`, `[to be determined]`, or empty sections

Run the completeness check manually: open the filled-in launch packet and
search for `[`. Any match means the packet is incomplete.

### Constraint consistency check

For each constraint listed in §3 of the launch packet:
- Hard constraints must not be violated by any motion in the decomposition
  table (§4). If a motion in the table would violate a hard constraint,
  either remove the constraint (with stated reason) or remove the motion.
- Soft constraints must be acknowledged in the decomposition for any motion
  that adjusts them.

### Dependency graph validity check

The dependency graph (§5) must be a DAG (directed acyclic graph):
- No circular dependencies.
- Every motion in the decomposition table (§4) appears in the graph.
- The critical path is the longest sequential chain — verify it by tracing
  the longest dependency chain in the graph.

### First-motion self-containment check

The first motion scope (§7) and "what the first motion must prove" (§8)
must together be sufficient for a new operator or agent to open the first
motion package without reading any other document. Ask: if someone opened
the launch packet and nothing else, could they draft the first motion.yaml
and proposal.md correctly?

If not, add the missing context to §7 or §8 before proceeding.

---

## Step 2 — Convert the launch packet into motion-ready state

A validated launch packet converts into a motion-ready state when:

1. **The first motion package is created** at `.nexus/motions/motion-NNNN/`
   with all six files (motion.yaml, proposal.md, challenge.md, execution.md,
   decision.yaml, decision.md).

2. **The launch packet is filed** at its canonical location:
   `.nexus/programs/<program_id>-launch-packet.md`
   (renamed from the draft location, if applicable).

3. **The program graph is updated**: the new program_id is added to
   `.nexus/programs/program-graph.yaml` under the appropriate epic, with
   `status: open` and the motion_line populated with at least the first
   motion.

4. **Context inheritance is recorded** (optional at launch, required if
   there are explicit overrides): create a context-inheritance record at
   `.nexus/programs/<program_id>-context-inheritance-<motion_id>.yaml`
   following the schema at `.nexus/programs/context-inheritance.schema.yaml`.

The launch packet is now the authoritative context for the motion line.
The first motion inherits everything in the launch packet without restating it,
per context inheritance Rule 1 (inherit unless overriding).

---

## Step 3 — Inherit and update across subsequent motions

Each motion in the line inherits the launch packet's context and may produce
an updated launch packet for the next motion.

### What subsequent motions inherit without restatement

Following the four context inheritance rules from
`.nexus/docs/corpus-v1-program-planning-canon.md`:

- Goal framing (§1 of the launch packet)
- Hard constraints (§3 hard constraints)
- Dependency graph structure (§5), unless a motion changes the sequencing

A motion does not need to restate these sections. Restating inherited context
verbatim is noise, not rigor.

### What subsequent motions must restate if changed

- Baseline (§2): if the repo state changed materially since the prior motion
  (e.g., a dependency was ratified, a constraint was lifted).
- Soft constraints (§3 soft constraints): if a convention was adjusted for
  this motion, state the adjustment and the reason.
- First motion scope (§7): each motion replaces §7 with its own specific
  in-scope / out-of-scope statement.

### Producing an updated launch packet

If a motion in the line produces findings that change the remaining line
(e.g., a discovered dependency, a scope adjustment, a constraint that was
found to be incorrect), it must produce an updated launch packet filed at:
`.nexus/programs/<program_id>-launch-packet-<motion_id>.md`

The updated packet:
- Notes at the top what changed from the prior packet and why.
- Does not repeat unchanged sections — references the prior packet for those.
- Supersedes the prior packet for all remaining motions in the line.

---

## Step 4 — Session hand-off

When a session ends before the motion line is complete, the operator must
commit a clean hand-off state so the next session can resume without
re-deriving context.

### What must be committed before ending a session

1. **All in-progress motion-package files**: even if execution.md or
   decision.yaml are drafts, they must be committed to the branch so they
   are not lost. Mark draft status in the file content (e.g., `# DRAFT`
   header or `result: pending` in decision.yaml).

2. **An updated launch packet** (if the session produced findings that
   changed the plan): file it at the canonical location before ending.

3. **A passalong note** (optional but recommended): a brief file at
   `.nexus/programs/<program_id>-passalong-<date>.md` recording:
   - Where the line currently is (which motion is in progress, which are
     ratified, which are not yet started).
   - What the next session must do first (the specific task, not a general
     description).
   - Any open questions or blockers that were not resolved in this session.

### What the next session must do first

At the start of a new session continuing a motion line:

1. Read the most recent launch packet (the one with the highest motion_id
   suffix, or the base packet if no updates exist).
2. Read the passalong note if one exists.
3. Confirm the current branch and verify the last commit includes all
   in-progress work from the prior session.
4. Identify the first incomplete motion in the line and confirm its
   execution.md is actionable.

Only after completing these four steps should the next session begin
executing motion-package work.
