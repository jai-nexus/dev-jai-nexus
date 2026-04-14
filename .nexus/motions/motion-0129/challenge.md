# Challenge: JAI Grid Configuration Mode v0

**Motion:** motion-0129

---

## Risks

- **R-1: OperatorSubnav.tsx touch** — OperatorSubnav is shared across all operator routes.
  Adding one entry to the `links` array is minimal risk, but a type error or bad import
  in the Grid route could break the subnav for all operator tabs. Mitigation: Grid link
  is a plain object with href/label strings; no new imports into OperatorSubnav itself.
  Typecheck gate catches any errors introduced.

- **R-2: `getAgencyConfig()` called server-side in new route** — agencyConfig reads
  from disk via `fs.readFileSync`. Calling it from the new server component is safe
  (same pattern as `/operator/agents/page.tsx`) but a misconfigured path in the
  grid route would produce a 500. Mitigation: grid `page.tsx` mirrors the agents page
  pattern exactly.

- **R-3: slot-policy.yaml read in lib/grid/gridConfig.ts** — gridConfig.ts must
  locate `slot-policy.yaml` relative to repo root. A hardcoded path assumption would
  break if the working directory shifts. Mitigation: use the same `findRepoRoot()`
  walker pattern already used in `list-escalations.mjs`.

- **R-4: Client-side GridDraftState complexity** — Staging position and connection
  changes in React state with a reducer could become complex if the diff shape is not
  precisely typed. Mitigation: `gridDraft.ts` defines a narrow discriminated union
  (`PositionChange | ConnectionChange`); reducer only appends; no complex merging
  logic in v0.

- **R-5: Connection validation false confidence** — The connection validator can only
  enforce structural rules (role pairs, same-agent loops). It cannot verify runtime
  correctness (e.g., whether an agent is reachable). Mitigation: validator scope is
  explicitly structural-only; the governed diff output makes the operator responsible
  for semantic correctness before routing to a motion.

- **R-6: Motion-draft YAML output format drift** — If the serialized diff YAML format
  drifts from what council-run or validate-motion expects, the operator will get a
  non-parseable draft. Mitigation: v0 draft output is labeled as an operator template
  (not machine-consumed by council-run directly); format is documented in the diff
  serializer; no council-run dependency on this format is introduced in this motion.

---

## Objections

- **O-1: Why not just edit the YAML files?** — Hand-editing YAML has no structural
  validation, no connection validation, and no diff visualization. The canvas surface
  makes intent explicit before it enters governance. The governed diff path ensures
  changes are not silently canonicalized.

- **O-2: Why is connection drawing in Configuration Mode and not a separate mode?** —
  Connection drawing is inherently a structural change operation. Separating it into
  its own mode would require a separate staged state, separate discard path, and
  separate diff export. Keeping it within Configuration Mode means a single draft
  accumulates all structural intent and a single "Propose Changes" exports it.

- **O-3: Why not persist canvas positions to the database?** — Position persistence
  is a convenience feature, not a governance requirement. Adding a DB write for layout
  positions would require a schema change and widen the blast radius of this motion.
  Deferred to a later motion when the value is demonstrated.

- **O-4: Why not auto-create a motion from the diff?** — Automatic motion creation
  would require the Grid surface to write into `.nexus/motions/`, bypassing the
  operator's review and the validate-motion gate. The operator-copy pattern keeps the
  motion creation path human-intentional.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.19
