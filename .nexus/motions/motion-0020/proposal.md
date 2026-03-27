# Proposal (motion-0020)

## 0.0 Problem
Panels and slots are registered and instantiation works at scale, but all slots are still configured as provider/model = UNKNOWN, which prevents consistent operational use and makes the system feel inert.

## 1.0 Goal
Bind all model slots to an initial OpenAI-only configuration so every role panel has a consistent provider/model assignment.

## 2.0 Change
Update `.nexus/model-slots.yaml`:
- Set `provider: "openai"` for all slots
- Assign initial model names per role:
  - Builder: a coding-strong default
  - Architect/Verifier/Operator: a general reasoning default
  - Librarian: a writing/summarization default
- Keep this configuration non-secret and changeable later.

## 3.0 Acceptance
- `pnpm -C portal typecheck` PASS
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0020 --all --dry-run` lists 5 panels
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0020 --all` scaffolds successfully
- `/operator/panels?motionId=motion-0020` lists the panels and each viewer loads

## 4.0 Non-goals
- No routing/multi-provider selection logic
- No token budgeting or cost optimization yet
