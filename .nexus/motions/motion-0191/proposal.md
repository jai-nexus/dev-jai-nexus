# Proposal: Static Loop Candidate Switching v0

## Purpose

Define a static selected-candidate switching model for future operator-loop
candidates.

## Scope

- preserve `wp-agent-registry-follow-up` as the current active selected candidate
- add a static/local switching model that exposes:
  - current active candidate
  - eligible candidate ids
  - per-candidate selection status
  - selection rationale
  - metadata criteria result
  - explicit code/governance-controlled switching note
- surface the switching model where low-risk across root overview, agenda, and
  deliberation
- refresh the bundled motion snapshot through `motion-0191`

## Non-goals

- no runtime switching controls
- no query state or route state
- no persistence or passalong index
- no scoring or ranking engine
- no provider/model calls
- no runtime execution or write authority
