# Proposal - motion-0062

## Title
Motion Factory v0 — discoverability and copy-paste example cleanup

## Why this motion exists
Motion Factory v0 was built incrementally across motions 0052–0061. The
help text and playbook were added at different stages and may not perfectly
reflect the final 5-command surface. Operators benefit from consistent
copy-paste examples, clear flag descriptions, and exact CLI parity between
the help text and the playbook.

## What this motion changes

### portal/scripts/motion-factory.mjs — help text only

Tighten the `usage()` output to include:

**Copy-paste examples section** appended to the existing help. All examples
are copy-paste ready for the normal PowerShell operator environment with
clear quoting and no ambiguous shell syntax:
```
Examples:
  node portal/scripts/motion-factory.mjs context --intent "Reconcile model-routing.yaml"
  node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup motion"
  node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup" --provider anthropic
  node portal/scripts/motion-factory.mjs draft --intent "Quick scaffold" --no-api
  node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Tighten scope"
  node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Rewrite" --provider anthropic
  node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof.txt
  node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof.txt --provider anthropic
  node portal/scripts/motion-factory.mjs status
  node portal/scripts/motion-factory.mjs status --json
```

**Consistency fixes:**
- Ensure every command that accepts --provider says so in its description
- Ensure --json is listed for both context and status
- Make the status vs context distinction explicit:
  - `status` = local factory configuration snapshot (no intent required)
  - `context` = motion-specific repo context for a given intent (--intent required)

**No behavioral changes.** Only the string output of `usage()` is modified.
This means: no command routing changes, no provider selection semantic
changes, no file-scope changes, no write behavior changes, no atomicity
changes.

### .nexus/docs/motion-factory-playbook.md — conditional parity update

The playbook is updated **only if actual CLI/help-text drift is found**.
If the playbook already matches the current CLI surface, it is left
untouched. This is important for low-churn repo posture.

Specific parity checks:
- Is the status command documented in the command guide?
- Is status --json documented?
- Does the status vs context distinction match the help text?
- Are all copy-paste examples current and PowerShell-ready?

If all checks pass, no playbook changes are made.

## What stays the same
- All command behavior unchanged
- All command routing unchanged
- All provider selection semantics unchanged
- All write semantics unchanged
- All atomicity guarantees unchanged
- All file scopes unchanged
- All trust boundaries unchanged

## What "no behavioral changes" means explicitly
- No command routing changes
- No provider selection semantic changes
- No file-scope changes
- No write behavior changes
- No atomicity changes
- Only operator-facing string output of usage() is modified

## Trust boundaries preserved in operator-facing text
- Structural governance files remain deterministic
- Narrative generation is DRAFT-only
- Evidence must be source-fed
- Human review remains required
- Key presence in status is environmental only

## Design stance
This is a pure polish motion. It improves the operator experience of an
already-complete system without changing any behavior. The smallest
useful step before any future expansion.

## Why now
The factory is complete and the command surface is stable. Polishing the
help text and playbook now means all operator-facing documentation is
accurate before the system is used in production or by new operators.
