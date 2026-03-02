# Proposal (motion-0006)

## 0.0 Problem
Polyrepo coverage has no durable “orientation packet” per repo, so agents and humans lack consistent inherited context and CRL scoring cannot advance beyond CRL-0.

## 1.0 Implications
- The cockpit cannot compute CRL-1 because RepoCards do not exist.
- Agents must rediscover basics (purpose, how to run, gates) each time.
- Pivots cause coherence loss because repo-level context is not standardized.

## 2.0 Solution
Introduce RepoCard v0 as a small YAML artifact per repo:
- Location: portal/config/repo-cards/<repo-slug>.yaml
- Minimal fields: repo, domains, engine, purpose, entrypoints, how_to_run, gates, dependencies, owner_agents, last_health_ref, tags
- Add a short schema doc (markdown) describing the fields and expectations.

Seed RepoCards for Wave 0 + Wave 1 repos (from the current wave plan).

## 3.0 Decision Proposal
Adopt RepoCard v0 as the required artifact for CRL-1.

## 4.0 Scope
- Add schema documentation for RepoCard v0
- Add initial RepoCard YAML files for Wave 0 + Wave 1 repos

No application code changes in this motion.

## 5.0 Next Actions
- Implement coverage endpoint to compute CRL counts using repos.yaml + RepoCards (motion-0007).
- Add dispatch scaffold configs (motion-0008).
