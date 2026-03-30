# Proposal: bounded operator motion state surface

**Motion:** motion-0080
**Parent:** motion-0071 (WS-3 phase 1)
**Date:** 2026-03-30

## Context

WS-2 is complete. Packet 880 / motion-0070 has progressed through
architect → builder → verifier and is now at OPERATOR_REVIEW. The loop
is alive at the execution layer but not legible at the operator surface.

## What's already visible

In `/operator/work` (list):
- Packet title includes `[motion-0070]` prefix (set by `activate-motion.mjs`)
- The lane chip shows `OPERATOR_REVIEW`
- Raw tags are visible in `/operator/work/[id]` Contract Summary

In `/operator/work/[id]` (detail):
- `tags:` line shows `motion:motion-0070, route:OPERATOR_REVIEW` (raw)
- Vertical Slice Progress shows all 4 stages as COMPLETE / IN_PROGRESS
- No interpretation of the motion tag against `.nexus/` artifacts

## What's missing

No section on the detail page tells the operator:
- Which motion governs this packet (by name, not just tag)
- What the council decision state is (RATIFIED/DRAFT)
- Whether a handoff was formally issued
- Whether a receipt has been recorded

## Proposed change

Add a **"Governing Motion"** section to `portal/src/app/operator/work/[id]/page.tsx`.

The section is inserted between the page header and the eligibility mismatch
banner (before the 4-card grid). It is rendered only for motion-linked
packets — packets without a `motion:` tag show no change.

**Data loaded server-side:**
- `getMotionFromTags(inboxTags)` → motionId (existing canonical helper)
- `fs.readFileSync(.nexus/motions/<id>/motion.yaml)` → title (regex)
- `fs.readFileSync(.nexus/motions/<id>/decision.yaml)` → status (regex)
- `fs.readFileSync(.nexus/motions/<id>/execution.handoff.json)` → status (JSON)
- `fs.readFileSync(.nexus/motions/<id>/execution.receipt.json)` → status (JSON, absent = pending)

All reads are synchronous with try/catch. No crash on missing artifacts.

**Fields displayed:**
| Field | Source | Chip color |
|---|---|---|
| motion | `getMotionFromTags` | sky text (mono) |
| title | `motion.yaml` | plain text |
| council decision | `decision.yaml` status | emerald=RATIFIED, amber=other, slate=— |
| handoff | `execution.handoff.json` status | sky=ISSUED, amber=other, slate=— |
| receipt | `execution.receipt.json` status | emerald=COMPLETED, amber=other, slate=pending |

## Scope boundary

One file changed: `portal/src/app/operator/work/[id]/page.tsx`.
