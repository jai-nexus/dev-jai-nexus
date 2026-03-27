# Execution Plan (motion-0006)

## Intended changes
1) Add RepoCard v0 schema doc:
   - portal/config/repo-cards/README.md

2) Seed RepoCards for Wave 0 + Wave 1 repos:
   - portal/config/repo-cards/<repo>.yaml for each repo in Wave 0 and Wave 1

## Acceptance criteria
- RepoCard schema doc exists.
- RepoCards exist for all Wave 0 and Wave 1 repos.
- No application code touched.

## Rollback plan
- Delete portal/config/repo-cards/ if schema is rejected.
