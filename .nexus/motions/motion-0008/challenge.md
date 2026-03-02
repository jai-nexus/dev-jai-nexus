# Challenge (motion-0008)

## Risks
- Dispatch configs could duplicate registry and drift.
- Overly strict templates could block velocity.

## Mitigations
- Keep DispatchConfig v0 minimal and allow partial/UNKNOWN fields.
- Treat registry as authoritative for domain/engine; dispatch only adds execution metadata.
- Seed only dev-jai-nexus first.

## Risk score
risk_score: 0.05
