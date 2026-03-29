# Execution Plan - motion-0074

## Goal
Prove the happy path for one real governed motion activation end-to-end.
Candidate: motion-0070 ("bounded council policy seam extraction").

---

## Pre-proof fix: PrismaPg adapter

**Finding:** `new PrismaClient()` in activate-motion.mjs failed with
`PrismaClientInitializationError` under Prisma v7.1.0 in this project's
environment. The portal uses `PrismaPg` adapter from `@prisma/adapter-pg`
(same pattern as `portal/src/lib/prisma.ts`). The script must use the
same adapter to connect.

**Fix applied to `portal/scripts/activate-motion.mjs` (runCreate only):**
- Import `PrismaPg` from `@prisma/adapter-pg` and `pg` dynamically.
- Use `DIRECT_URL || DATABASE_URL` as the connection string (mirrors prisma.ts).
- Pass `new PrismaPg(pool)` as the adapter option to `new PrismaClient({ adapter })`.
- Add `await pool.end()` in the finally block alongside `$disconnect()`.

This is the only code change in this proof slice.

---

## Proof sequence and evidence

### Step 0 — Syntax check

```
node --check portal/scripts/activate-motion.mjs
```
Output: `PASS: syntax check`

```
pnpm -C portal typecheck
```
Output: (no errors — clean exit 0)

---

### Step 1 — Issue execution handoff for motion-0070

```
node portal/scripts/issue-execution-handoff.mjs --motion motion-0070
```

Output:
```
[EXECUTION-HANDOFF] Execution handoff issued for motion-0070
[EXECUTION-HANDOFF] Path: .nexus/motions/motion-0070/execution.handoff.json
[EXECUTION-HANDOFF] Handoff ID: motion-0070-handoff-001
[EXECUTION-HANDOFF] Target: domain=dev.jai.nexus repo=dev-jai-nexus
[EXECUTION-HANDOFF] Status: ISSUED
```

Artifact written: `.nexus/motions/motion-0070/execution.handoff.json`

---

### Step 2 — Dry-run activation (all checks pass)

```
node portal/scripts/activate-motion.mjs --motion motion-0070
```

Output:
```
[ACTIVATE-MOTION] Motion: motion-0070
[ACTIVATE-MOTION] Repo root: ...dev-jai-nexus

[ACTIVATE-MOTION] PASS  motion_dir: .nexus/motions/motion-0070
[ACTIVATE-MOTION] PASS  motion_yaml: title="bounded council policy seam extraction"
[ACTIVATE-MOTION] PASS  decision_ratified: status=RATIFIED
[ACTIVATE-MOTION] PASS  handoff_present: execution.handoff.json found
[ACTIVATE-MOTION] PASS  handoff_issued: status=ISSUED handoff_id=motion-0070-handoff-001
[ACTIVATE-MOTION] PASS  target_repo: dev-jai-nexus
[ACTIVATE-MOTION] PASS  execution_md: present (WS-2 context binding ready)

[ACTIVATE-MOTION] --- Activation intent (dry-run) ---
[ACTIVATE-MOTION] Activation tag:   motion:motion-0070
[ACTIVATE-MOTION] Route tag:        route:ARCHITECT
[ACTIVATE-MOTION] Handoff ID:       motion-0070-handoff-001
[ACTIVATE-MOTION] Target repo:      dev-jai-nexus
[ACTIVATE-MOTION] Packet title:     [motion-0070] bounded council policy seam extraction
[ACTIVATE-MOTION] Tags:             ["motion:motion-0070", "route:ARCHITECT"]
[ACTIVATE-MOTION] execution.md:     PRESENT

[ACTIVATE-MOTION] This motion is ACTIVATABLE.
[ACTIVATE-MOTION] DRY-RUN ONLY — no database writes performed.
[ACTIVATE-MOTION] To create the packet: add --create
```

Exit: 0

---

### Step 3 — Real creation (happy path)

```
node portal/scripts/activate-motion.mjs --motion motion-0070 --create
```

Output:
```
[ACTIVATE-MOTION] Motion: motion-0070
[ACTIVATE-MOTION] Repo root: ...dev-jai-nexus

[ACTIVATE-MOTION] PASS  motion_dir: .nexus/motions/motion-0070
[ACTIVATE-MOTION] PASS  motion_yaml: title="bounded council policy seam extraction"
[ACTIVATE-MOTION] PASS  decision_ratified: status=RATIFIED
[ACTIVATE-MOTION] PASS  handoff_present: execution.handoff.json found
[ACTIVATE-MOTION] PASS  handoff_issued: status=ISSUED handoff_id=motion-0070-handoff-001
[ACTIVATE-MOTION] PASS  target_repo: dev-jai-nexus
[ACTIVATE-MOTION] PASS  execution_md: present (WS-2 context binding ready)

[ACTIVATE-MOTION] All preconditions passed. Creating work packet...

[ACTIVATE-MOTION] --- Work packet created ---
[ACTIVATE-MOTION] WorkPacket ID:   880
[ACTIVATE-MOTION] nhId:            motion-0070
[ACTIVATE-MOTION] Title:           [motion-0070] bounded council policy seam extraction
[ACTIVATE-MOTION] Status:          DRAFT
[ACTIVATE-MOTION] InboxItem ID:    9
[ACTIVATE-MOTION] Inbox status:    QUEUED
[ACTIVATE-MOTION] Inbox priority:  60
[ACTIVATE-MOTION] Tags:            ["motion:motion-0070","route:ARCHITECT"]

[ACTIVATE-MOTION] Motion motion-0070 is now LIVE in the execution system.
```

Exit: 0

**Created packet identity:**
- WorkPacket ID: `880`
- WorkPacket nhId: `motion-0070`
- InboxItem ID: `9`
- Tags: `["motion:motion-0070", "route:ARCHITECT"]`
- Motion tag present: YES
- Route tag present: YES
- Initial routing intent: ARCHITECT

---

### Step 4 — Duplicate prevention

```
node portal/scripts/activate-motion.mjs --motion motion-0070 --create
```

Output:
```
[ACTIVATE-MOTION] PASS  motion_dir: .nexus/motions/motion-0070
[ACTIVATE-MOTION] PASS  motion_yaml: title="bounded council policy seam extraction"
[ACTIVATE-MOTION] PASS  decision_ratified: status=RATIFIED
[ACTIVATE-MOTION] PASS  handoff_present: execution.handoff.json found
[ACTIVATE-MOTION] PASS  handoff_issued: status=ISSUED handoff_id=motion-0070-handoff-001
[ACTIVATE-MOTION] PASS  target_repo: dev-jai-nexus
[ACTIVATE-MOTION] PASS  execution_md: present (WS-2 context binding ready)

[ACTIVATE-MOTION] All preconditions passed. Creating work packet...
[ACTIVATE-MOTION] REFUSE: Live packet already exists for motion-0070
[ACTIVATE-MOTION] Existing inbox item ID:   9
[ACTIVATE-MOTION] Existing work packet ID:  880
[ACTIVATE-MOTION] Existing status:          QUEUED
[ACTIVATE-MOTION] Resolve or close the existing packet before re-activating.
```

Exit: 1

Duplicate creation refused. Existing packet identity printed. No new packet created.

---

## Success criteria check

| Criterion | Result |
|---|---|
| motion-0070 has execution.handoff.json with status=ISSUED | PASS |
| dry-run exits 0 | PASS |
| --create exits 0 and prints WorkPacket ID, InboxItem ID, tags | PASS |
| tags contain motion:motion-0070 and route:ARCHITECT | PASS |
| second --create exits 1 and prints existing IDs | PASS |
| node --check passes | PASS |
| pnpm typecheck passes | PASS |

---

## Files changed

| File | Change |
|---|---|
| `portal/scripts/activate-motion.mjs` | PrismaPg adapter fix in runCreate |
| `.nexus/motions/motion-0070/execution.handoff.json` | issued (new artifact) |
| `.nexus/motions/motion-0074/` | governance package (new) |

---

## Rollback plan

- Revert PrismaPg adapter lines in activate-motion.mjs runCreate.
- Delete `.nexus/motions/motion-0070/execution.handoff.json` if needed.
- Cancel WorkPacket 880 / InboxItem 9 via operator work surface.
