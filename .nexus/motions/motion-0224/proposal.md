## Summary

Add a static local data model that mirrors the simulated motion draft fixture for UI consumption without dynamic parsing or live agent output.

## Why

The draft-review surface should read from a stable local representation that references the fixture and canon paths directly. This keeps the prototype deterministic and low-risk.

## Scope

- add a static draft review model
- expose draft identity, scope, contributors, validation expectations, and authority labels
- keep the model read-only and non-authoritative

## Non-Goals

- parsing live drafts
- provider/model generation
- runtime execution
- control buttons or mutation controls
