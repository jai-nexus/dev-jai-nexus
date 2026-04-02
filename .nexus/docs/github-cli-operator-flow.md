# GitHub CLI Operator Flow — dev-jai-nexus

**Established:** motion-0115
**Date:** 2026-04-02

---

## Purpose

This document is the canonical operator reference for GitHub-native repo
actions in dev-jai-nexus. It defines which tool to use for each action class
and provides the exact command set for the standard branch → PR → merge cycle.

---

## Operator tool precedence

| Action class | Default tool | Rationale |
|---|---|---|
| GitHub-native repo operations | **GitHub CLI (`gh`)** | Auth, branch push, PR creation, PR status, PR merge |
| Local governance actions | **Local repo scripts** | `validate-motion.mjs`, `validate-agency.mjs`, `council-run.mjs`, motion artifact generation |
| Drafting / design / motion authoring | **Claude** | Judgment-requiring tasks: scoping, framing, policy, proposals |
| Orchestration / review / passalongs | **ChatGPT** | Cross-session orchestration, review, handoff documents |
| Codex | Optional | Eligible for scripted ratification and status checks per `codex-exec-policy.md`; not the default executor |

**Rule:** Do not use Codex or Claude for GitHub-native actions when `gh` is
available and authorized. Do not use `gh` for local governance script
execution.

---

## 1. Auth setup

Run once per machine. Persists across sessions.

```bash
# Interactive browser-based login
gh auth login

# Configure git to use gh credentials (avoids HTTPS prompt loops)
gh auth setup-git

# Confirm auth state
gh auth status
```

Expected output from `gh auth status`:

```
github.com
  ✓ Logged in to github.com as <username> (keyring)
  ✓ Git operations for github.com configured to use https protocol.
  ✓ Token: *******************
```

---

## 2. Branch workflow

```bash
# Create and switch to a new branch
git switch -c <branch-name>

# Example — sprint branch
git switch -c sprint/q2-my-feature-0099

# Push branch and set upstream tracking
git push -u origin <branch-name>
```

Convention for sprint branch names:

```
sprint/q2-<short-description>-<motion-id>
```

---

## 3. Committing governed motion work

After writing or editing motion artifacts:

```bash
# Stage only the motion directory (never git add -A without inspection)
git add .nexus/motions/motion-NNNN/

# Commit
git commit -m "docs(governance): <description> (motion-NNNN)"

# Push
git push
```

If pushing for the first time on the branch:

```bash
git push -u origin <branch-name>
```

---

## 4. PR creation

```bash
# Create PR — fills title/body from branch name and commit messages
gh pr create --fill

# Or with explicit title and body
gh pr create --title "Sprint/q2 <description> (motion-NNNN)" --body "$(cat <<'EOF'
## Summary
- <bullet points>

## Test plan
- [ ] validate-motion EXIT 0
- [ ] validate-agency EXIT 0
EOF
)"
```

`--fill` is preferred for standard sprint PRs. Use explicit `--title`/`--body`
when the PR covers multiple motions or requires a structured description.

---

## 5. PR inspection

```bash
# Show PR status (open/merged/closed, checks, reviewers)
gh pr status

# Show CI check results for the current branch PR
gh pr checks

# View PR in browser
gh pr view --web
```

`gh pr checks` is the first thing to run after `gh pr create`. Wait for all
required checks to pass before proceeding to merge.

---

## 6. PR merge

```bash
# Squash merge and delete the remote branch
gh pr merge --squash --delete-branch
```

**When to merge:**
- All required CI checks pass (`gh pr checks` shows green)
- Motion package is complete (all required artifacts present)
- Gate validators have been run locally and passed
- No open review comments blocking merge

**Squash merge is the standard.** This produces one clean commit per sprint
branch on main and preserves a readable linear history.

---

## 7. Local governance actions (not GitHub CLI)

These actions always use local repo scripts, never `gh`:

```bash
# Validate a motion package
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-NNNN/motion.yaml

# Validate agency registry
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus

# Run council (full ratification gate)
node portal/scripts/council-run.mjs motion-NNNN

# Generate context bundle
node portal/scripts/generate-context-bundle.mjs --motion motion-NNNN
```

These commands operate on local repo state. They do not require GitHub auth
and should not be routed through `gh` or Codex by default.

---

## Appendix: Useful gh aliases (optional, operator-local)

If you run these commands frequently, aliases reduce friction:

```bash
# Short alias for pr status
gh alias set ps 'pr status'

# Short alias for pr checks
gh alias set pc 'pr checks'
```

These are operator-local and are not committed to the repo.
