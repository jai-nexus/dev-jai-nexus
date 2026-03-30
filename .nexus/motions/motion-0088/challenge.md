# Challenge: Bounded Bootstrap Artifact Generator Spec v0

**Motion:** motion-0088
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The proposal is grounded in the dev-jai-nexus baseline and covers the Wave 0
artifact set cleanly. Four objections are raised.

---

### C-1: `council.config.yaml` should be "copied" but may need per-project defaults

**Concern:** `council.config.yaml` defines `required_roles`, `default_mode`,
and `max_amendment_rounds`. For some projects, these defaults may differ (e.g.,
a project with only 3 governance agents might need a different required_roles
list). Copying it verbatim would produce a council config that doesn't match
the project's agent setup.

**Resolution:** `council.config.yaml` in dev-jai-nexus already uses role names
(proposer, challenger, arbiter) that are stable across all JAI NEXUS projects
— they are governance role identifiers, not agent keys. The `required_roles`
list in council.config.yaml is governance-role-level, not agent-key-level, so
it is project-invariant. Projects that need non-standard council defaults can
modify the copied file post-generation. The generator copies it; human
modifies if needed. Classification as "copied" is correct. Accepted.

---

### C-2: `CLAUDE.md` should be "manual-only" not "stubbed"

**Concern:** CLAUDE.md is described as "stubbed" but the proposal also says
"## Purpose ... requires human authorship." This is effectively manual-only.
The stub value of pre-filling repo name and core commands seems minimal — a
human will have to replace most of it anyway.

**Resolution:** The distinction matters. "Stubbed" means the generator emits
a valid CLAUDE.md with correct headings, the repo name pre-filled, and the
canonical core commands section complete (those are deterministic from the
topology plan). A "manual-only" file would be an empty file or a comment.
The stub value is real: the headings, repo name, governance surface paths, and
pnpm command templates save the human from copying from scratch and ensure
structural consistency. Classification as "stubbed" is correct. Accepted.

---

### C-3: `repo-capsule.schema.yaml` is a schema file — should it be in Wave 0?

**Concern:** `repo-capsule.schema.yaml` in dev-jai-nexus is a schema
definition for repo capsule instances, not a capsule instance itself. New
projects won't generate repo capsule instances until Wave 1+ (they require
actual codebase context). Including the schema file in Wave 0 adds a file
that has no immediate use.

**Resolution:** The schema file is included because it is part of the stable
context substrate — agents and Claude sessions use it as a reference even
before any capsule instances exist. It costs nothing to copy and ensures
the context substrate is complete from Wave 0 onward. Including it maintains
parity with the dev-jai-nexus baseline. Accepted.

---

### C-4: The `.nexus/motions/motion-0001/proposal.md` stub may be misleading if it contains placeholder text

**Concern:** If the generator writes placeholder text like "[TODO: describe
inaugural governance decision]" into proposal.md, a human could accidentally
commit and ratify a motion with placeholder content. This is a governance
trace integrity risk.

**Resolution:** The generator spec explicitly states that proposal.md is
"manual-only" — the generator must emit only a bare structural shell with
commented-out section headers (Markdown comment syntax: `<!-- TODO -->`),
not placeholder prose that could be mistaken for content. The spec will add:
"For manual-only artifacts, the generator must emit only structural headings
and HTML comment placeholders. It must not emit any prose that could be
read as governance content." Accepted with this clarification added to
bootstrap-generator.spec.md.

---

## Verdict

No blocking objections. All four resolved. Motion-0088 may proceed.
