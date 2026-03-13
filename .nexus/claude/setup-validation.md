# Claude Setup Validation - dev-jai-nexus

## Purpose
This note validates how the current Claude bootstrap layer should be used in practice.

## Validated setup flow
The current recommended setup flow is:

1. `pnpm claude:bootstrap`
2. read `CLAUDE.md`
3. read key substrate artifacts
4. read `.nexus/claude/project-context-pack.md`
5. read `surfaces/claude/YYYY-MM-DD_claude-bootstrap.md`
6. read the active motion package
7. read motion-local generated context only if needed
8. begin scoped work

## Why this flow is valid
This order works because it introduces context from most stable to most task-local:

- repo-local rules first,
- substrate next,
- Claude-facing repo behavior next,
- generated bootstrap handoff after that,
- active motion as the canonical current work object,
- generated motion-local context last.

This reduces recontextualization while preserving governance clarity.

## Canonical vs generated distinction
Canonical:
- repo source files
- motion artifacts
- substrate artifacts

Generated handoff layers:
- Claude bootstrap markdown
- chat-context generated artifacts
- manifests

Generated artifacts are useful because they compress context.
They are not authoritative over repo source artifacts.

## Practical conclusion
The current Claude bootstrap pack is validated as:
- a useful first handoff layer,
- a compact setup document,
- a good compression surface for repeated use,
- a supplement to canonical motion and substrate artifacts.

## Repeated-use recommendation
For repeated work in dev-jai-nexus:
- regenerate the Claude bootstrap pack when project state changes materially,
- always identify the active motion before asking Claude for implementation work,
- prefer the minimal governed setup path over whole-repo dumping,
- refresh motion-local generated context when work shifts significantly.

## Result
The repo now has a repeatable Claude setup routine that is:
- repo-centric,
- governance-aware,
- compact,
- practical for repeated use.
