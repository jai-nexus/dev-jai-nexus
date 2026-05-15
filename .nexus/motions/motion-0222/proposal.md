# Proposal: Fixture Drift Response Playbook v0

## Purpose

Define the manual CONTROL_THREAD response path when sandbox fixture validation
fails or sandbox summary drift is detected.

## Scope

- add a manual drift-response playbook
- classify fixture drift by type
- preserve fixture-only and no-authority posture during response
- avoid automation, auto-correction, and runtime enforcement

## Non-goals

- no automatic correction
- no live rejection
- no Corpus V2 opening
- no authority expansion
