# Challenge (motion-0005)

## Risks
- Scope creep: cockpit becomes “everything app” instead of governance conductor.
- False coverage: CRL scores drift if not computed from real artifacts.
- Unsafe automation: agents editing protected paths without role/evidence enforcement.
- Performance: accidentally scanning huge directories (workspace/, node_modules/, generated/) to compute status.

## Risk score
risk_score: 0.10
