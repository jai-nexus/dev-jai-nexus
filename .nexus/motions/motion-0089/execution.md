# Execution: Bounded Bootstrap Artifact Generator Implementation v0

**Motion:** motion-0089
**Role:** BUILDER
**Date:** 2026-03-30

## Scope

Two file changes:

```
portal/scripts/generate-bootstrap.mjs   (new)
package.json                            (add bootstrap:gen command)
```

No other files modified. No portal src/, prisma/, or runtime code touched.

## Implementation summary

### portal/scripts/generate-bootstrap.mjs

ES module script (~330 lines) following the `.mjs` + `createRequire(yaml)` +
`node:fs` / `node:path` conventions of the existing `portal/scripts/` baseline.

**Inputs:**
- `--intake <path>` (required) — project intake instance YAML
- `--demand <path>` (optional) — agent demand matrix instance; falls back to
  `intake.derived_agents` if present, then inline WS-B rule derivation
- `--topology <path>` (optional) — topology plan instance; falls back to
  inline WS-C derivation from `intake.topology`
- `--output`, `--baseline`, `--dry-run`, `--force`, `--yes`, `--verbose`

**Output (Wave 0 only — 12 artifacts):**

| # | Path | Classification |
|---|---|---|
| 1 | `config/agency.yaml` | generated |
| 2 | `.nexus/context/project-constitution.yaml` | generated |
| 3 | `.nexus/agent-manifest.yaml` | generated |
| 4 | `.nexus/council.config.yaml` | copied |
| 5 | `.nexus/council.deps.yaml` | copied |
| 6 | `.nexus/context/slot-policy.yaml` | copied |
| 7 | `.nexus/context/scoring-rubric.yaml` | copied |
| 8 | `.nexus/context/motion-packet.schema.json` | copied |
| 9 | `.nexus/context/repo-capsule.schema.yaml` | copied |
| 10 | `.nexus/motions/motion-0001/motion.yaml` | stubbed |
| 11 | `.nexus/motions/motion-0001/proposal.md` | manual-only |
| 12 | `CLAUDE.md` | stubbed |

**Key behaviors:**
- Idempotent by default: `fs.existsSync` check before each write; skips with
  `~ SKIP (exists)` prefix
- `--dry-run` prints `» WRITE/COPY/SKIP` lines with classification labels;
  no files written
- `--force` overwrites; prompts for confirmation unless `--yes` is also set
- `buildProposalShell()` enforces manual-only: headings + HTML comment
  placeholders only — no prose
- Baseline typo resilience: tries `repo-capsule.schema.yaml` first, falls
  back to `repo-caspsule.schema.yaml` (existing filename typo in this repo)

### package.json

Added `"bootstrap:gen": "node portal/scripts/generate-bootstrap.mjs"` to
the root package.json scripts section. Follows the existing `council:run`,
`claude:bootstrap` command pattern.

## Validation

**Syntax check:**
```
node --check portal/scripts/generate-bootstrap.mjs
→ SYNTAX OK
```

**OffBook.ai dry-run proof:**
```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake-example.yaml \
  --dry-run
```

Output:
- Project: OffBook AI (offbook-ai), Domain: offbook.ai, Topology: polyrepo
- NH root: 7.0, Gov repo: offbook-core
- Agents: 5 governance + 4 execution (9 total — matches WS-B demand)
- 12 artifacts listed with correct classification labels
- Would write/copy: 12, Would skip: 0
- agency.yaml scoped to offbook-core + offbook-web for ARCHITECT/BUILDER/VERIFIER;
  OPERATOR scoped to offbook-core only

## Evidence

Script committed to `portal/scripts/generate-bootstrap.mjs`.
Dry-run output confirms correct artifact list, classification labels, and
OffBook.ai agent demand derivation.
