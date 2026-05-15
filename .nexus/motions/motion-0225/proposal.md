## Summary

Add a compact read-only draft review section to `/operator/corpus` so operators can inspect the static draft fixture, validation expectations, and authority labels in one place.

## Why

The sandbox surface already exposes fixture traces and validator posture. A small draft-review block completes the inspection layer without adding a route, control surface, or runtime behavior.

## Scope

- add a compact draft-review section to `/operator/corpus`
- show draft identity, scope, contributors, validation expectations, and human review requirement
- keep labels explicit and read-only

## Non-Goals

- editing or promoting drafts
- live status
- controls, buttons, or API calls
- opening Corpus V2
