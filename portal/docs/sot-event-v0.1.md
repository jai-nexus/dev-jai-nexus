# SoT Event — v0.1 (`sot-event-0.1`)

This is the canonical envelope for SoT events stored in the `SotEvent` table
and transported via the `/api/sot-events` endpoint.

It is intentionally small and stable. Everything else hangs off of this.

---

## Required fields

- `version` — literal string `"sot-event-0.1"`
- `ts` — ISO8601 timestamp **when the event happened**, e.g.
  - `"2025-12-06T12:00:00Z"` (UTC)
  - `"2025-12-06T06:00:00-06:00"` (America/Chicago)
- `source` — high-level source, lower-case snake or kebab, e.g.
  - `chatgpt`
  - `jai-runner`
  - `offbook-deploy-script`
  - `jai-autopilot-win`
  - `manual`
- `kind` — logical type / event kind, e.g.
  - `"conversation"`
  - `"OFFBOOK_V0_DEPLOYED"`
  - `"AUDIT_Q4_2025_COMPLETED"`
  - `"AUTOPILOT_PROJECT_REGISTERED"`
  - `"AUTOPILOT_BUILD_STARTED"`
  - `"AUTOPILOT_BUILD_FAILED"`
  - `"AUTOPILOT_BUILD_SUCCEEDED"`
- `summary` — short human-readable one-liner (<= 200 chars)
- `payload` — opaque blob (`object | array | primitive`)  
  Usually jai-format, but the envelope does **not** enforce structure here.

---

## Optional linking / metadata

These fields help tie the event back into the NH tree, repos, and domains.

- `nhId` — NH marker (e.g. `"1.3"`, `"2.1.3"`)
- `jaiAgent` — which JAI agent / model produced this (string)
- `tags` — `string[]` for flexible querying

Repo / domain linking (resolved server-side):

- `repoName` — used to resolve `repoId` via `Repo.name`
- `domainName` — used to resolve `domainId` via `Domain.domain`

On write:

- `repoId` and `domainId` may be passed directly.
- If only `repoName` / `domainName` are present, the API will resolve IDs when possible.
- If resolution fails, the event is still accepted; `repoId`/`domainId` remain `null`.

---

## Storage model (`SotEvent` table)

The Prisma model (simplified):

```ts
model SotEvent {
  id        Int       @id @default(autoincrement())
  ts        DateTime  // canonical event time (UTC)
  createdAt DateTime  @default(now()) // ingestion time
  source    String
  kind      String
  nhId      String?
  summary   String?
  payload   Json?

  repoId    Int?
  repo      Repo?     @relation(fields: [repoId], references: [id])

  domainId  Int?
  domain    Domain?   @relation(fields: [domainId], references: [id])
}
