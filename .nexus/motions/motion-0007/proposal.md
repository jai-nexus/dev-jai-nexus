# Proposal (motion-0007)

## 0.0 Problem
We cannot measure “polyrepo coverage” inside the cockpit without a computed endpoint that reports CRL counts and highlights wilderness repos.

## 1.0 Implications
- Coverage remains conceptual; no dashboard truth.
- Hard to prioritize: no automated “next actions” per repo.
- Solo-dev load stays high because status must be inferred manually.

## 2.0 Solution
Add an internal endpoint that computes coverage:
- Route: portal/src/app/api/internal/registry/coverage/route.ts
- Inputs:
  - portal/config/repos.yaml (canonical repos list)
  - portal/config/repo-cards/ (RepoCard presence = CRL-1)
  - (future) portal/config/dispatch/ (Dispatch config presence = CRL-2)
- Output JSON:
  - total
  - crl0/crl1/crl2/crl3 counts
  - wilderness[] list of repos missing artifacts (and why)
  - optionally: by_domain breakdown

## 3.0 Decision Proposal
Adopt the endpoint as the canonical computed coverage signal for dev-jai-nexus UI.

## 4.0 Scope
- Add internal endpoint implementation
- Minimal helper(s) in portal/src/lib for reading repo config + artifact presence
- No UI changes required in this motion (UI can follow)

## 5.0 Next Actions
- Wire /operator/registry/coverage UI to this endpoint.
- Add dispatch scaffold configs (motion-0008).
