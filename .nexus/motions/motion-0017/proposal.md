# Proposal (motion-0017)

## 0.0 Problem
Panel creation is currently one-at-a-time (`panel-run scaffold --panel ...`). This does not scale when a motion should instantiate multiple registered panels.

## 1.0 Goal
Add a manifest-gated bulk instantiation command that scaffolds multiple panels for a single motion without inventing new panel IDs.

## 2.0 Solution
Extend `portal/scripts/panel-run.mjs` with:
- `instantiate --motion <id> --all` to scaffold all panels registered in `.nexus/agent-panels.yaml`
- `--panels A,B,C` to scaffold a subset
- `--only` / `--exclude` filters when using `--all`
- `--dry-run` to print the plan without writing
- respects existing `--force` behavior

## 3.0 Acceptance
- Dry-run prints deterministic list of panels to scaffold
- Instantiate creates `panels/<panelId>/{panel.json, selector.md, selection.json, candidates/*.md}` for each chosen panel
- Re-running is idempotent unless `--force` is provided
- `pnpm -C portal typecheck` PASS

## 4.0 Non-goals
- No LLM calls
- No scoring / winner selection (still separate tools)
