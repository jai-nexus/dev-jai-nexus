# Challenge - motion-0073

## Risks

### Risk 1 — Idempotency rule allows re-activation after DONE
If a motion's packet reaches DONE (operator approved) and the operator
runs `--create` again, the idempotency check passes (DONE is terminal)
and a second packet is created. This is intentional by design — a
motion could legitimately be re-executed — but may be surprising.

### Risk 2 — nhId format diverges from UI convention
The UI creation form uses dotted-number nhIds (e.g., `1.2.3`) validated
by `sanitizeNhLike`. Script-created packets use `motionId` as nhId
(e.g., `motion-0073`). The Prisma schema has no format constraint on
nhId, so both are valid. However, downstream consumers that parse nhId
as a dotted number would break on script-created packets.

### Risk 3 — No SoT event emitted at creation
The operator creation path (`page.tsx`) emits `WORK_PACKET_CREATED` and
optionally `WORK_DELEGATED` SoT events. This script does not. The
execution audit trail is incomplete for motion-linked packets created
via the script path until SoT event emission is added.

### Risk 4 — No repoId at creation
Without a repoId, agent queue filtering by repo scope may not work
correctly if the system expects a repoId for assignment eligibility.
This is deferred by design but limits the packet's usability until an
operator explicitly sets the repo via the routing surface.

### Risk 5 — Prisma client loaded in a governance script
`activate-motion.mjs` was originally a pure filesystem script.
Adding a Prisma import changes its nature: it now requires a live DB
connection to run in `--create` mode. A misconfigured DATABASE_URL
could cause the script to silently fail or error.

---

## Objections and responses

- **Re-activation after DONE**: Intentional. If an operator needs to
  re-execute a completed motion, that is a valid governance decision.
  The operator is responsible for recognizing the prior execution.

- **nhId format divergence**: The nhId field has no schema constraint.
  Using `motionId` is more traceable than an arbitrary dotted number.
  Downstream consumers should use the `motion:` tag — not nhId — for
  identity. This risk is low unless a consumer parses nhId numerically.

- **No SoT event**: Acceptable for this slice. SoT events can be added
  in a future bounded patch without changing the creation contract.
  The packet is immediately visible in the operator work surface.

- **No repoId**: Acceptable for this slice. The operator can set repoId
  via the existing routing surface. The mission of phase 2 is to get a
  live packet into the system with motion identity — repo scoping is
  a routing step, not a creation step.

- **Prisma in script**: The `--create` flag is explicit. The dry-run
  mode (default) remains purely filesystem. A missing DATABASE_URL
  fails loudly before any Prisma call, and dotenv loading is limited to
  `portal/.env.local`. The change does not affect the dry-run path.

---

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.10
