# Session Validation Checklist - dev-jai-nexus

Use this checklist before and during Claude code-edit sessions.

## Before work starts
- [ ] I identified the active motion id.
- [ ] I identified the exact bounded task.
- [ ] I chose the smallest validation preset that fits the task.
- [ ] I stated the validation command explicitly.
- [ ] I know which source files are actually in scope.
- [ ] I know whether generated artifacts are involved.

## During work
- [ ] The task is still within the intended preset shape.
- [ ] The validation plan still matches the actual touched surfaces.
- [ ] I have not confused generated artifacts with canonical source truth.
- [ ] I am keeping the validation expectation visible and explicit.

## Before closeout
- [ ] I ran the relevant validation command if code or executable behavior changed.
- [ ] I recorded PASS/FAIL clearly.
- [ ] I noted any reason the preset had to be overridden.
- [ ] I preserved the actual validation result in the motion/session evidence if needed.

## Quick reminder
A preset helps you start faster.
It does not remove the need to think about the real task.
