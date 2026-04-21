# Proposal: JAI Control Thread Canon v0

**Motion:** motion-0140
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0139 (JAI Grid Governance Contract Hardening v0)

---

## Problem

Motions 0134–0139 established a coherent, hardened, read-only grid governance surface
covering grid:preflight, grid:vote-prep, grid:launch, grid:status, and grid:operator.
The surface is well-defined for in-repo execution. What is not yet defined is the
coordination layer above it.

Three gaps remain:

**1. No canonical definition of "control thread."**
The `/motion-passalong` skill (motion-0106) and `passalong-schema.md` imply a
layered model — orchestrator sessions above, dev sessions below — but neither
formally defines the control thread as a surface, its responsibilities, or its
boundary with repo execution threads.

**2. No formal role model for thread-level coordination.**
The repo has a well-defined execution role taxonomy (ARCHITECT, BUILDER, VERIFIER,
OPERATOR, LIBRARIAN in CLAUDE.md). There is no corresponding taxonomy for the
coordination modes a session operates in relative to the control thread: managing
program arc (CONTROL_THREAD), applying operator routing (OPERATOR), executing a
bounded motion (REPO_EXECUTION), or open-ended exploration and framing
(EXPLORATION). These modes exist in practice but are unnamed and undocumented.

**3. Passalong schema is missing fields from operational experience.**
`passalong-schema.md` (v1.0, motion-0106) specifies orchestrator and dev sections,
but is missing fields that have proven necessary in multi-session governance work:
- `tasks` — discrete next steps for the receiving session
- `risks` — open risks and mitigations relevant to the receiving session
- `next_chat_prompts` — exact prompt starters the receiving session can use

No formal sync rules specify when a repo thread is considered synced back to the
control thread. No explicit boundary rules state what a passalong is NOT doing
operationally.

---

## Solution

### Sub-line A — Control thread model doc

Add `.nexus/docs/control-thread-model.md` defining:

1. **Control thread definition** — A control thread is the top-level coordination
   surface for a program arc. It preserves canon, tracks active work, synchronizes
   repo threads, and routes the next bounded work item. It does not execute work or
   mutate repo or runtime state.

2. **Role model** — Four thread-level coordination modes:
   - `CONTROL_THREAD` — manages program arc; source of next direction; never executes
   - `OPERATOR` — applies governed routing and final decisions within a thread
   - `REPO_EXECUTION` — executes a bounded motion; reads governance artifacts; implements
   - `EXPLORATION` — open-ended framing or research; no implementation boundary

3. **Sync rules** — A repo thread is considered synced back to the control thread when:
   - Its active motion is ratified (decision.yaml status=RATIFIED), and
   - A passalong has been authored and recorded under surfaces/chat-context/

4. **Boundary rules** — Passalongs are continuity artifacts. They:
   - do not execute work
   - do not mutate repo or runtime state
   - do not replace repo-local governance judgment
   - do not substitute for canonical governance artifacts (motion packages, decision.yaml)

### Sub-line B — Passalong schema v1.1

Update `.nexus/codex/passalong-schema.md` to v1.1:

- Add `tasks` section (optional): discrete next steps for the receiving session,
  formatted as a bulleted checklist
- Add `risks` section (optional): open risks and mitigations relevant to the
  receiving session
- Add `next_chat_prompts` section (optional): exact prompt starters the receiving
  session can use to initialize work
- Add control-thread framing context to the "What a passalong is" section
- Update document templates to include the new optional sections
- Preserve full backward compatibility: all v1.0 passalongs remain valid

### Sub-line C — Example passalong templates

Add `.nexus/docs/examples/` with:
- `passalong-orchestrator-example.md` — example orchestrator passalong
  reflecting v1.1 schema including tasks, risks, next_chat_prompts
- `passalong-dev-example.md` — example dev passalong reflecting v1.1 schema

Examples are static illustrative documents, not live governance artifacts.

### Boundary preservation

This motion does not authorize:
- Automation engine or background orchestration
- Task runner or automatic branch/PR generation
- GitHub workflow integration
- Portal runtime mutation
- Passalong auto-generation scripts or pnpm commands
- Controller behavior over repo threads
- Any redesign of Grid/governance motions 0134–0139
- Database or cross-repo state mutation
- package.json changes

---

## Success criteria

- **SC-1** `.nexus/docs/control-thread-model.md` exists and defines: control thread,
  CONTROL_THREAD/OPERATOR/REPO_EXECUTION/EXPLORATION roles, sync rules, boundary rules
- **SC-2** `.nexus/codex/passalong-schema.md` is updated to v1.1 with `tasks`, `risks`,
  and `next_chat_prompts` as optional sections in both orchestrator and dev templates
- **SC-3** Boundary rules explicitly state passalongs do not execute work, mutate
  runtime state, or replace repo-local governance judgment
- **SC-4** `.nexus/docs/examples/passalong-orchestrator-example.md` and
  `.nexus/docs/examples/passalong-dev-example.md` exist and reflect v1.1 schema
- **SC-5** `validate-motion` passes for motion-0140
- **SC-6** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-7** `pnpm typecheck` passes
- **SC-8** No portal runtime, governance runner, automation, or grid script files modified

---

## Non-goals

- Automation engine or background orchestration
- Task runner or automatic passalong generation
- Automatic branch creation, PR generation, or GitHub workflow integration
- Portal runtime, database, or cross-repo state mutation
- Redesign of Grid/governance motions 0134–0139
- Controller behavior over repo threads
- package.json changes
- Codex skill authoring (may follow in a subsequent motion)
- Eval fixture authoring for the control thread model
- Any changes to existing `.claude/commands/` skills
