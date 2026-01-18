> NOTE: If this PR touches `.github/workflows/**`, Role must be `JAI::DEV::VERIFIER` (Builder not allowed).

## Role (pick one)
- [ ] Role: JAI::DEV::OPERATOR
- [ ] Role: JAI::DEV::ARCHITECT
- [ ] Role: JAI::DEV::BUILDER
- [ ] Role: JAI::DEV::VERIFIER
- [ ] Role: JAI::DEV::LIBRARIAN

> After selecting, delete the unchecked lines so only **one** Role remains.

---

## Goal
- <1–3 bullets. What is this PR changing and why?>

## Scope
- <UI | API | Prisma | CI | Docs | Scripts>
- Touched paths (high level): <e.g. portal/src/app/api, portal/prisma, scripts>

## Outputs
- <List key files / routes / scripts changed>
- <If API: list routes + request/response notes>
- <If Prisma: list schema + migration file name(s)>

## Evidence
Evidence is required if touching any of:
- `.github/workflows/**`
- `portal/src/app/api/**`
- `portal/prisma/**`, `portal/prisma.config.ts`, `portal/src/lib/{prisma,dbPrisma}.ts`
- `portal/src/app/**`, `portal/src/components/**`, `portal/src/lib/**`
- `scripts/**`, `portal/scripts/**`, package/pnpm files, `Makefile`

Paste commands + result:
- `pnpm -w -r build`: PASS/FAIL
- `pnpm lint`: PASS/FAIL
- `<any relevant script/test>`: PASS/FAIL

If CI-only / policy-only change: state why evidence is N/A.

## Risk
- [ ] Low
- [ ] Medium
- [ ] High
- <1 line: what could break + mitigation>

## Notes / Handoff
- <Next Role + next action. Example: "JAI::DEV::VERIFIER — review CI + approve merge.">
