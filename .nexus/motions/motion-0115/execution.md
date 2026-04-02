# Execution: Establish GitHub CLI-first operator posture — add operator flow doc and update Codex exec policy

**Motion:** motion-0115
**Role:** LIBRARIAN
**Date:** 2026-04-02

## Scope

Files created:

```
.nexus/docs/github-cli-operator-flow.md         (create)
```

Files edited:

```
.nexus/codex/codex-exec-policy.md               (edit: append §9 Operator tool precedence)
.nexus/codex/README.md                          (edit: add posture note under Operating policy)
```

Files NOT changed:
- All `.nexus/motions/` artifacts
- All `.nexus/context/` substrate
- All `.claude/commands/` skill files
- All `portal/` runtime code
- `CLAUDE.md`
- `.nexus/docs/motion-factory-playbook.md`
- `.nexus/claude/operating-workflow.md`

## Steps

### Step 1 — Confirm current state

```bash
ls .nexus/docs/
grep -n "GitHub" .nexus/codex/codex-exec-policy.md
grep -n "GitHub" .nexus/codex/README.md
```

Expected: no `github-cli-operator-flow.md` present; no GitHub CLI references
in either policy file.

### Step 2 — Create `.nexus/docs/github-cli-operator-flow.md`

Write the full operator guide. Sections:
1. Purpose
2. Operator tool precedence table
3. Auth setup (`gh auth login`, `gh auth setup-git`, `gh auth status`)
4. Branch workflow (`git switch -c`, `git push -u origin`)
5. Committing governed motion work (stage → commit → push)
6. PR creation (`gh pr create --fill` and explicit form)
7. PR inspection (`gh pr status`, `gh pr checks`, `gh pr view --web`)
8. PR merge (`gh pr merge --squash --delete-branch`)
9. Local governance actions (validate-motion, validate-agency, council-run)
10. Appendix: optional gh aliases

### Step 3 — Append §9 to `codex-exec-policy.md`

Append after §8 Current program context. No existing sections modified.

Content: operator tool precedence table establishing GitHub CLI first for
GitHub-native actions, local scripts first for governance actions, Codex
optional not default. Reference to `github-cli-operator-flow.md`.

### Step 4 — Add posture note to `codex/README.md`

Add under the `## Operating policy` section:

> For GitHub-native repo operations (push, PR creation, merge), GitHub CLI
> (`gh`) is the default tool. Codex is optional for governance artifact tasks
> per `codex-exec-policy.md §2`; it is not the default executor for repo
> operations. See `.nexus/docs/github-cli-operator-flow.md` for the full
> operator tool precedence and command reference.

### Step 5 — Gate validation

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0115/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Expected: both EXIT 0.

### Step 6 — Confirm writes

```bash
ls .nexus/docs/
grep -n "Operator tool precedence\|GitHub CLI" .nexus/codex/codex-exec-policy.md
grep -n "GitHub CLI\|optional" .nexus/codex/README.md
```

## Evidence checklist

- [ ] `.nexus/docs/github-cli-operator-flow.md` created
- [ ] `codex-exec-policy.md` §9 appended, §1–§8 unchanged
- [ ] `README.md` posture note added
- [ ] validate_motion EXIT 0 on motion-0115
- [ ] validate_agency EXIT 0
- [ ] No existing Codex policy sections modified
- [ ] No runtime, UI, DB, or portal files touched
