> NOTE: If this PR touches `.github/workflows/**`, Role must be `JAI::DEV::VERIFIER`.

## Role
Role: JAI::DEV::<OPERATOR|ARCHITECT|BUILDER|VERIFIER|LIBRARIAN>

## Goal
- What is this PR changing and why? (1–3 bullets)
- 

## Scope
- Areas: <UI | API | Prisma | CI | Docs | Scripts>
- Touched paths (high level):
  - 

## Outputs
- Key changes:
  - 

### API (if any)
- Routes:
  - 
- Request/Response notes:
  - 

### Prisma (if any)
- schema.prisma:
  - 
- Migration(s):
  - 

## Evidence
Evidence: <Required | N/A — explain why>

If **Required**, paste commands + result (fill what applies):
- `pnpm -w -r build`: PASS/FAIL (or N/A — why)
- `pnpm lint`: PASS/FAIL (or N/A — why)
- Other:
  - `<cmd>`: PASS/FAIL (or N/A — why)

Evidence is **Required** if touching any of:
- `.github/workflows/**`
- `portal/src/app/api/**`
- `portal/prisma/**`, `portal/prisma.config.ts`, `portal/src/lib/{prisma,dbPrisma}.ts`
- `portal/src/app/**`, `portal/src/components/**`, `portal/src/lib/**`
- `scripts/**`, `portal/scripts/**`, package/pnpm files, `Makefile`

## Risk
Risk: <Low | Medium | High>
- What could break:
- Mitigation:

## Notes / Handoff
- Next role + next action:
  - 
