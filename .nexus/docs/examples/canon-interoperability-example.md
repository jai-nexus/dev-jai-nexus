Illustrative example only. This file does not establish new canon, register live
entries, or modify any settled canon layer.

# Canon Interoperability Example

This example shows the registry layer in practice as a compact navigational view.
It uses settled canon entries as reference points without restating their full
definitions.

The example is documentary and non-executing.

---

## Illustrative stack map

```text
continuity foundation context
  .nexus/codex/passalong-schema.md

model docs: foundational
  control-thread-model.md
  repo-execution-model.md
  orchestrator-model.md
  exploration-model.md
  workflow-composition-model.md

model docs: derived
  workflow-kit-model.md
  governance-constraint-stack.md
  canon-authoring-conventions.md
  canon-interoperability-registry.md

templates
  canon-registration-template.md
  canon-authoring-checklist-template.md
  kit-manifest-template.md

examples
  canon-interoperability-example.md
  canon-authoring-example.md
  workflow-kit-example.md

filled artifacts / manifests / callouts
  passalong
  kit manifest
  constraint callout
  canon authoring checklist

motion packages
  .nexus/motions/motion-XXXX/
```

Navigation note:

- foundational model docs are the settled base for later extensions
- derived model docs extend or reference that base without changing authority
- templates and examples help readers use the stack without becoming authority
  layers themselves
- motion packages remain the authority source for ratification

---

## Illustrative filled canon registration entry

Illustrative example only. The following entry is a sample registration record for
navigation purposes.

### Artifact name

- `.nexus/docs/workflow-kit-model.md`

### Artifact class

- `model doc`

### Primary placement in the stack

- `derived model doc`

### Dependencies

- `.nexus/docs/control-thread-model.md (motion-0140)`
- `.nexus/docs/repo-execution-model.md (motion-0141)`
- `.nexus/docs/orchestrator-model.md (motion-0142)`
- `.nexus/docs/exploration-model.md (motion-0143)`
- `.nexus/docs/workflow-composition-model.md (motion-0144)`
- `.nexus/codex/passalong-schema.md (motions 0134 through 0139)`

### Relationship declarations

- `foundational`
  - `.nexus/docs/workflow-composition-model.md (motion-0144)`
- `extends`
  - `.nexus/docs/workflow-composition-model.md (motion-0144)`
- `composes`
  - `.nexus/docs/control-thread-model.md (motion-0140)`
  - `.nexus/docs/orchestrator-model.md (motion-0142)`
  - `.nexus/docs/repo-execution-model.md (motion-0141)`
  - `.nexus/docs/exploration-model.md (motion-0143)`
- `references`
  - `.nexus/codex/passalong-schema.md (motions 0134 through 0139)`
- `example-of`
  - `none`
- `constrained-by`
  - `.nexus/docs/governance-constraint-stack.md (motion-0146)`

### What must not be redefined

- settled role definitions from motions `0140` through `0143`
- settled transition classes and seven continuity buckets from motion-0144
- the explicit/manual council-run boundary where governance read-only surfaces are relevant

### Navigation entrypoint relevance

- `workflow kits`
- `constraint guidance`

### Advisory and non-executing status

- `This registry entry is documentary and advisory. It does not execute work, confer authority, or mutate state.`

### No-touch boundaries where relevant

- `portal/**`
- `.claude/**`
- `package.json`

---

## Navigation walkthrough: Workflow roles

Reader intent:

- understand a coordination role and how that role fits into later stack layers

Walkthrough:

1. start with the relevant foundational model doc:
   - `.nexus/docs/control-thread-model.md`
   - `.nexus/docs/repo-execution-model.md`
   - `.nexus/docs/orchestrator-model.md`
   - `.nexus/docs/exploration-model.md`
2. move to `.nexus/docs/workflow-composition-model.md` to see how roles interact
   across sessions
3. move to `.nexus/docs/workflow-kit-model.md` if the next question is about a
   reusable loop rather than a single role
4. move to `.nexus/docs/governance-constraint-stack.md` if the question becomes a
   boundary or non-mutation question

This walkthrough indexes the settled ladder without restating the upstream docs.

---

## Navigation walkthrough: Authoring guidance

Reader intent:

- write a new canon addition and place it correctly in the stack

Walkthrough:

1. start with `.nexus/docs/canon-authoring-conventions.md` to keep artifact type,
   phrasing, and non-executing status aligned with the settled corpus
2. use `.nexus/docs/templates/canon-registration-template.md` to declare artifact
   class, stack placement, dependencies, and no-redefinition boundaries
3. consult `.nexus/docs/canon-interoperability-registry.md` to place the entry in
   the current ladder and reuse the bounded relationship vocabulary
4. consult `.nexus/docs/governance-constraint-stack.md` if the new artifact touches
   governance read-only surfaces or needs explicit council-run boundary language

This walkthrough preserves:

- settled canon indexing rather than restatement
- advisory foundational vs derived framing
- no-redefinition boundaries
- the explicit/manual council-run boundary where governance surfaces appear
