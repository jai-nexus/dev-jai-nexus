## Summary

Define the boundary for a no-provider, no-authority draft-review prototype that lets operators inspect a simulated draft package without enabling live agent drafting.

## Why

The repo already has sandbox fixtures and read-only readiness surfaces. The next safe seam is a review-only prototype boundary that makes it explicit what operators may inspect and what remains prohibited.

## Scope

- add canon defining allowed and prohibited draft-review prototype behavior
- keep the prototype static and read-only
- require human review
- preserve no-provider, no-authority, and not-canon posture

## Non-Goals

- opening Corpus V2
- generating draft content from a provider/model
- enabling live agent drafting
- granting write, PR, merge, or runtime authority
