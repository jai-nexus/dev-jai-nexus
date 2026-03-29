# Challenge - motion-0075

## Risks

### Risk 1 — Filesystem read inside a database transaction
`loadMotionContext` performs synchronous filesystem reads inside the
existing `$transaction` block. The transaction holds a DB write lock
during `sotEvent.create`. If `execution.md` is unusually large (multi-MB),
this could extend the transaction window beyond normal expectations.

**Response:** Motion execution.md files are governance prose — typically
1–10 KB. The transaction timeout is 30 seconds. Synchronous filesystem
reads of small files take < 1 ms. No practical risk of timeout extension
for real motion artifacts.

### Risk 2 — `process.cwd()` differs between execution environments
`findRepoRoot(process.cwd())` assumes `process.cwd()` is within the repo
tree. In some Next.js deployment configurations or edge-like environments,
`cwd` might be outside the repo.

**Response:** `findRepoRoot` returns `null` if no `.nexus` directory is
found within 8 hops. The fallback path (`motionContext = null` → generic
plan) is safe and explicit. The runtime does not throw.

### Risk 3 — Motion title regex may miss multi-line YAML titles
The `title:` regex `^title:\s*["']?(.+?)["']?\s*$` only matches single-line
values. YAML block scalars (`title: >`) would not match.

**Response:** All motion.yaml files in this repo use single-line title
values. The regex fallback is `motionId` as title, which is still
governance-traceable. A full YAML parser is deferred to when needed.

### Risk 4 — Execution plan text in debug.plan SoT payload
The full `execution.md` text is embedded in the `debug.plan` SoT event
payload. If execution.md grows large (>100 KB), the JSON column in the
`sotEvent` table could grow.

**Response:** Motion execution.md files are governance prose — typically
< 10 KB. The SoT event payload is already a JSON column with no fixed
limit. This is not a practical concern for current motion artifacts.

### Risk 5 — `node:fs` import in Next.js bundle
`import fs from "node:fs"` in a file under `portal/src/lib/work/` could
be bundled for client or edge if the file is ever imported by a client
component.

**Response:** `architectRuntime.ts` is a pure server-side agent runtime.
It is only imported by `run-architect-once.ts` (a tsx script) and
`run-builder-once.ts` / similar. It is not imported by any Next.js
page, layout, or API route. TypeScript typecheck does not flag this.
If a future use changes this, the fs import should be gated or moved.

---

## Objections and responses

- **"Why read execution.md inside the transaction?"**
  The motion detection requires `inboxTags`, which are only available
  after `loadWorkPacketContext`. The alternative is to split the single
  transaction into two (one for load, one for emit). Splitting the
  transaction adds structural complexity. For small, fast filesystem
  reads, inline is cleaner and equivalent in practice.

- **"Why not read decision.yaml for a sanity check?"**
  The activation preconditions already verify RATIFIED status. Adding a
  runtime re-verification would duplicate the activation bridge logic
  without meaningful added safety. Deferred to a future coherence gate
  (WS-5).

- **"Why not cache the motion context?"**
  Per-claim caching would require a module-level map and introduces
  staleness risk if motion artifacts change between invocations. For the
  current claim frequency, re-reading on each claim is simpler and safe.

---

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.07
