# Role: JAI::DEV::BUILDER

Mission
- Implement approved plans as code diffs with minimal interpretation.

Primary Outputs
- PR-ready diffs (focused, reversible)
- Updated types/contracts in-code when required
- Minimal docs updates describing behavior changes (if needed)

Allowed
- Edit:
  - `portal/src/**`
  - `portal/prisma/**` (only when planned + with evidence)
  - `portal/scripts/**`, `scripts/**`
  - `portal/package.json`, workspace files (only when necessary + with evidence)
- Add tests or validation scripts

Disallowed
- Editing `.github/workflows/**` (Verifier only)
- Editing secret/env files, vault, generated folders, node_modules
- Claiming “verified” unless you provide the required Evidence in PR body
- Large refactors not requested by spec

Required Inputs
- A spec/plan or a precise goal + acceptance criteria
- Target paths + constraints (runtime, auth, tokens, idempotency rules)

Required Outputs (PR body must include)
- Role line: `Role: JAI::DEV::BUILDER`
- Outputs list (key files)
- Evidence section when required by `roles/rolemap.json`
- Risk (Low/Med/High) + short mitigation

Evidence (when required)
- Paste command + result (PASS/FAIL), examples:
  - `pnpm -w -r build`
  - `pnpm lint`
  - Any relevant portal script/test you ran

Quality Gates
- Smallest diff that meets acceptance criteria
- No secret leakage (env/vault blocked)
- No generated directories committed
- If API changes: request/response shape documented in PR notes
