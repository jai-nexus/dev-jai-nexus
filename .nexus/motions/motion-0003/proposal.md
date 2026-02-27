# Proposal (motion-0003)

## 0.0 Problem
Council v0.1 has a "dirty repo" problem where `verify.json` appends history on every run, causing git churn. It also lacks a persistent chat-style trace for training and auditing.

## 1.0 Implications
- Merge conflicts in `verify.json`.
- Loss of intermediate execution data (logs/tails).
- No clear record of "Tiered" agent interactions.

## 2.0 Solutions
- Move history to gitignored `trace/` folder.
- Keep `verify.json` as a scoreboard of ONLY the latest results.
- Introduce `chat.jsonl` for agent event logging.

## 3.0 Decision Proposal
- Adopt v0.2 formats and runner logic.

## 5.0 Next Actions
- Run `motion-0003` with the updated runner.
