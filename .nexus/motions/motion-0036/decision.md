# Decision Record - motion-0036

## Decision
Proceed with the first governed Claude-facing operating layer for dev-jai-nexus.

## Reason
Motion-0033 established generated context bundles and motion-0035 established the formal context substrate, but Claude usage still depended on manual briefing and inconsistent repo setup. Motion-0036 closes that gap by adding a repo-root CLAUDE.md, a Claude project context pack, a compact bootstrap-set artifact, and a Claude operating workflow grounded in the new substrate.

## Constraints
- keep the Claude setup repo-centric and governance-aware,
- derive Claude-facing guidance from existing substrate artifacts,
- avoid expansion into provider orchestration or account automation,
- preserve motion governance as canonical,
- keep bootstrap guidance compact and reusable.

## Ratification condition
Ratify only after the Claude-facing artifact set exists and can be read together as a coherent repo-centric setup pack:
- `CLAUDE.md`
- `.nexus/claude/project-context-pack.md`
- `.nexus/claude/bootstrap-set.yaml`
- `.nexus/claude/operating-workflow.md`
