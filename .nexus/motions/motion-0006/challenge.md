# Challenge (motion-0006)

## Risks
- RepoCards drift if not derived from or reconciled with registry.
- Over-designing the schema slows adoption; keep it minimal.
- If fields are ambiguous, agents will fill with invented facts.

## Mitigations
- Keep RepoCard v0 minimal and explicitly allow "UNKNOWN" for missing fields.
- Reference registry for domain/engine fields where possible.
- Treat RepoCard as orientation + planning metadata, not ground truth.

## Risk score
risk_score: 0.05
