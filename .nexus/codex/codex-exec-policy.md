# Codex Execution Policy — dev-jai-nexus

**Version:** 1.0
**Established:** motion-0102
**Date:** 2026-03-31

---

## 1. Purpose

This document defines the operating split between:

- **Codex** — the executor of scripted, repo-native workflows
- **Claude** — the drafter of capabilities, policies, and motion proposals

The split is not about model identity. It is about task class. Tasks that
are fully specified by a repo-native skill prompt and have deterministic
expected outputs are Codex-eligible. Tasks that require judgment — scoping,
framing, design, tradeoff resolution — are Claude-retained.

---

## 2. Codex-eligible motion classes

Codex may run the following task types autonomously, using the corresponding
repo-native skill prompts:

| Task class | Skill / command | Notes |
|---|---|---|
| Motion ratification sweep | `/motion-ratify <motionId>` | All required gates must pass first |
| Activation lane status check | `/motion-status <motionId>` | Read-only, no side effects |
| Motion package scaffolding | `/motion-create <kind> <title>` | Template-based, no judgment |
| Proof lane execution | `/run-proof-lane <stage> <motionId>` | Enqueue + run-once + verify (when skill exists) |
| Context bundle generation | `node portal/scripts/generate-context-bundle.mjs --motion <motionId>` | Deterministic output |

**Codex-eligible conditions:** The task class appears in this table AND
a corresponding skill prompt exists in `.claude/commands/`. If the skill
prompt does not exist, the task is not Codex-eligible — Claude must draft
the skill first.

---

## 3. Claude-retained responsibilities

Claude retains ownership of all tasks that require judgment:

| Responsibility | Why Claude-retained |
|---|---|
| Skill prompt authoring | Requires understanding of repo conventions and edge cases |
| Eval fixture authoring | Requires design of acceptance criteria and negative cases |
| New motion proposals | Require scope judgment, framing, constraint identification |
| Policy document drafting | This document; requires understanding of program direction |
| Architecture decisions | Tradeoff resolution between competing valid approaches |
| Challenge document authoring | Requires adversarial reasoning about the motion |
| Council seam / gate script authorship | High-sensitivity surfaces; control-plane adjacency |
| Wave 1+ planning | Program-level judgment outside current scope |

---

## 4. Handoff protocol

The standard handoff for a Codex-eligible ratification:

```
1. Claude drafts motion package (motion.yaml, proposal.md, challenge.md,
   execution.md, decision.yaml DRAFT, decision.md DRAFT)
2. Claude commits the motion package to the sprint branch
3. Codex runs: /motion-ratify <motionId>
   → creates vote.json, verify.json, policy.yaml
   → updates decision.yaml to RATIFIED
   → updates decision.md to RATIFIED
4. Codex commits the ratification artifacts
5. PR merged — loop closed
```

For proof execution (when `/run-proof-lane` skill exists):

```
1. Claude confirms packet is at the correct stage (via /motion-status)
2. Codex runs: /run-proof-lane <stage> <motionId>
   → enqueues packet for correct agent
   → runs run-once script
   → captures SoT evidence
3. Claude reviews evidence
4. Codex ratifies the proof motion
```

---

## 5. Non-delegation rules

Codex must NOT attempt the following without explicit Claude review:

- Proposing a new motion (new motion numbers, new scopes, new programs)
- Editing `.nexus/context/` substrate artifacts
- Modifying gate scripts (`portal/scripts/validate-*.mjs`, `council-run.mjs`)
- Making decisions about motion scope, kind classification, or parent_motion assignment
- Running `applyPacketRouteAction` outside a governed one-shot proof script
- Touching `portal/src/lib/work/*` or `portal/src/lib/agentRuntime.ts`

---

## 6. dev-jai-nexus boundary commitments

Regardless of the Codex-exec / Claude-drafts split, dev-jai-nexus retains:

- All live governance artifacts (`.nexus/motions/`, `.nexus/context/`)
- All gate scripts and council infrastructure
- All DB-adjacent control-plane behavior (`portal/src/lib/work/*`, `portal/src/lib/agentRuntime.ts`)
- All operator-facing surfaces (`portal/src/app/operator/`)
- The authoritative motion registry and agent registry

The split is an operating convention, not a boundary between repos.
dev-jai-nexus remains the single source of truth for governed execution.

---

## 7. Conditioning interface

The interface between Claude and Codex is the `.claude/commands/` skill directory.

- Claude writes skill prompts to `.claude/commands/*.md`
- Codex invokes skills as `/skill-name [args]` in Claude Code
- Eval fixtures in `.nexus/codex/evals/` specify acceptance criteria for skill behavior

Adding a new Codex-eligible task class requires:
1. Claude drafts the skill prompt
2. Claude drafts an eval fixture (or extends an existing one)
3. A motion ratifies the conditioning expansion
4. The skill is listed in this policy (section 2)

---

## 8. Current program context

As of motion-0102:

- Track A proof chain: governance-coherent end-to-end (motions 0095–0101)
- WorkPacket 882 (OffBook.ai staged activation): DONE
- Conditioning layer: 2 skills, 1 eval fixture
- Codex-exec posture: ratification and status checks only

Upcoming conditioning expansions (motions 0103–0104):
- `/motion-create` — motion package scaffolding
- `/run-proof-lane` — proof lane execution
- `motion-status-eval.yaml` — status skill eval fixture

These expansions are Claude-drafted and will be Codex-ratified via `/motion-ratify`.
