# RepoCard v0 (CRL-1)

RepoCards are small, durable orientation packets used by dev-jai-nexus to compute polyrepo coverage and to provide consistent inherited context to agents.

## Location
`portal/config/repo-cards/<repo-slug>.yaml`

## Canon
- RepoCards are NOT ground-truth for registry identity; `portal/config/repos.yaml` remains canonical for repo list + domains + engine + apply.
- RepoCards add *execution/orientation metadata* (purpose, entrypoints, how-to-run, gates, dependencies, owner agents, etc.).

## CRL mapping
- CRL-0: repo is registered (exists in `portal/config/repos.yaml`)
- CRL-1: RepoCard exists
- CRL-2: DispatchConfig exists (`portal/config/dispatch/<repo>.yaml`)
- CRL-3: Traceable (events + idea lineage/deprecations maintained) — computed later

## Conventions
- Use `UNKNOWN` when you don’t know something yet. Do not invent facts.
- Keep fields short; optimize for “Jerry can orient in 30 seconds.”
- Owner agents must match the registry agent IDs (proposer/executor/challenger/arbiter).

## Minimal schema (v0)
```yaml
version: "repo-card.v0"
repo: "<repo-slug>"
domains:
  primary: "<domain>"
  secondary: ["<domain2>"]
engine: "<backend|frontend|helper>"
apply: true

purpose: "UNKNOWN"
entrypoints: ["UNKNOWN"]
how_to_run:
  dev: "UNKNOWN"
  build: "UNKNOWN"
  test: "UNKNOWN"

gates:
  required: ["validate_motion", "validate_agency"]
  optional: ["typecheck"]

dependencies:
  repos: []
  services: []

owner_agents:
  proposer: "<nhid_...>"
  executor: "<nhid_...>"
  challenger: "<nhid_...>"
  arbiter: "<nhid_...>"

last_health:
  ts: null
  summary: "UNKNOWN"

tags: ["coverage", "repocard"]
notes: []
