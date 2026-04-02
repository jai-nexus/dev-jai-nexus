# Decision: Establish GitHub CLI-first operator posture — add operator flow doc and update Codex exec policy

**Motion:** motion-0115
**Kind:** governance-policy

## Status

DRAFT

## Summary

Establishes a governed operator posture for GitHub-native repo actions in
dev-jai-nexus. Adds `.nexus/docs/github-cli-operator-flow.md` as the primary
operator reference for auth, branch, PR creation, PR inspection, and PR merge.
Amends `codex-exec-policy.md` to add §9 Operator tool precedence — GitHub CLI
first for GitHub-native actions, local scripts first for governance actions,
Codex optional not default. Amends `codex/README.md` with a one-line posture
note.

No runtime, UI, DB, or portal changes. No Codex artifacts removed.

This decision.md will be updated to RATIFIED after gate validation passes and
the vote is cast under motion-0115.
