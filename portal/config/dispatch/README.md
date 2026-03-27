# DispatchConfig v0 (CRL-2)

Dispatch configs are small per-repo execution packets that make a repo “dispatchable”.
They’re used to generate WorkPackets deterministically from Motions.

## Location
`portal/config/dispatch/<repo-slug>.yaml`

## CRL mapping
- CRL-0: repo registered (exists in portal/config/repos.yaml)
- CRL-1: RepoCard exists (portal/config/repo-cards/<repo>.yaml)
- CRL-2: DispatchConfig exists (this file)
- CRL-3: Traceable (events + idea lineage/deprecations) — later

## Conventions
- Keep it minimal. Use `UNKNOWN` rather than inventing facts.
- Prefer gates from council-runner known set; do not invent gate ids.
- assigned_roles should reference the registry agent NHIDs.

## Minimal schema (v0)
```yaml
version: "dispatch.v0"
repo: "<repo-slug>"
domain_primary: "<domain>"
engine: "<backend|frontend|helper>"

available_gates:
  required: ["validate_motion", "validate_agency"]
  optional: ["typecheck"]

assigned_roles:
  proposer: "<nhid_...>"
  executor: "<nhid_...>"
  challenger: "<nhid_...>"
  arbiter: "<nhid_...>"

work_packet_template:
  summary: "UNKNOWN"
  tasks: []
  evidence:
    commands: []
    expected: []
