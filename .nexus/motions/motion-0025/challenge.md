# Challenge (motion-0025)

## Primary concern
The main risk is introducing a second inconsistent packet model in the UI layer.

## Mitigation
- define one shared contract helper layer in portal/src/lib/work/**
- keep Prisma as source of truth
- derive lifecycle/control state from existing packet + inbox + SoT events
- avoid schema churn in v0
