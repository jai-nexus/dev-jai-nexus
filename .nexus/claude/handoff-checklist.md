# Claude Handoff Checklist - dev-jai-nexus

Use this checklist before beginning meaningful Claude work.

## Pre-work checklist
- [ ] I generated the latest Claude bootstrap pack with `pnpm claude:bootstrap`.
- [ ] I identified the active motion id.
- [ ] I read `CLAUDE.md`.
- [ ] I read the stable substrate artifacts needed for this task.
- [ ] I read `.nexus/claude/project-context-pack.md`.
- [ ] I read the active motion package.
- [ ] I loaded the generated bootstrap pack or motion-local generated context if useful.
- [ ] I know which artifacts are canonical and which are generated handoff layers.
- [ ] I know the exact task I want Claude to perform.
- [ ] I know which repo surface is actually in scope.

## During-work checklist
- [ ] The work stays within the active motion scope.
- [ ] Claude is working from repo-specific context, not generic assumptions.
- [ ] The smallest coherent change is being targeted.
- [ ] Role boundaries and governance semantics are being preserved.
- [ ] I am not silently replacing canonical artifacts with generated summaries.

## Pre-closeout checklist
- [ ] Local validation was run if code changed.
- [ ] Evidence or proof was confirmed.
- [ ] The motion package is updated only after proof exists.
- [ ] Any passalong or bootstrap artifacts reflect the latest state if needed.
