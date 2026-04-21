# Challenge: JAI Control Thread Canon v0

**Motion:** motion-0140

---

## Risks

- **R-1: The passalong schema update (v1.0 → v1.1) could silently invalidate
  existing passalong skill prompts that reference schema_version "passalong-1.0"**
  — mitigated: new sections (`tasks`, `risks`, `next_chat_prompts`) are all optional.
  Existing v1.0 passalongs remain fully valid. The updated template adds new optional
  sections without removing or renaming any existing required sections. The
  `/motion-passalong` skill prompt does not need to change until a subsequent motion
  explicitly upgrades it.

- **R-2: The control thread model could be interpreted as imposing automated
  orchestration or authority over repo threads** — mitigated: the motion explicitly
  prohibits automation, background orchestration, and controller behavior. The model
  is definitional only: it names roles and defines boundaries but does not create
  infrastructure, tooling, or enforcement mechanisms.

- **R-3: The new role taxonomy (CONTROL_THREAD, OPERATOR, REPO_EXECUTION, EXPLORATION)
  could be misread as replacing or conflicting with the existing execution role taxonomy
  (ARCHITECT, BUILDER, VERIFIER, OPERATOR, LIBRARIAN in CLAUDE.md)** — mitigated: the
  two taxonomies are orthogonal. Execution roles describe what a session does within a
  motion (design / build / verify / route / maintain). Thread-level roles describe the
  coordination mode a session operates in relative to the program arc. A single session
  can hold an execution role (e.g., BUILDER) while operating in a thread-level mode
  (e.g., REPO_EXECUTION). The canon doc must state this orthogonality explicitly.

- **R-4: The sync rules could over-specify when a thread is considered "synced back,"
  creating governance friction for normal repo work** — mitigated: sync is defined as
  two conditions: (1) active motion ratified, (2) passalong authored. These are already
  common practice and do not add new process. The rules formalize what already happens,
  not impose new overhead.

- **R-5: The examples could be interpreted as canonical or prescriptive rather than
  illustrative** — mitigated: the example files are placed under `.nexus/docs/examples/`
  and their content explicitly states they are illustrative templates, not live
  governance artifacts.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.03
