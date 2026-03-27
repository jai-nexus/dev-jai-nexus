# Proposal (motion-0008)

## 0.0 Problem
Even with RepoCards, the system cannot become “dispatchable” (CRL-2) without a standard per-repo dispatch config describing gates, templates, and assigned roles.

## 1.0 Implications
- Motions cannot deterministically become repo work packets.
- Agents don’t have consistent instructions per repo.
- Solo-dev orchestration remains manual.

## 2.0 Solution
Introduce DispatchConfig v0 as YAML per repo:
- Location: portal/config/dispatch/<repo-slug>.yaml
- Fields:
  - repo, domain_primary, engine
  - available_gates (subset of known gates)
  - work_packet_template (minimal: goal, tasks, evidence)
  - assigned_roles (proposer/executor/challenger/arbiter IDs or references)
  - touched_paths_allowlist (optional)
  - evidence_commands (optional)

Seed only dev-jai-nexus first (self-referential), so we can validate the workflow before spreading.

## 3.0 Decision Proposal
Adopt DispatchConfig v0 as the required artifact for CRL-2.

## 4.0 Scope
- Add schema doc: portal/config/dispatch/README.md
- Add seed: portal/config/dispatch/dev-jai-nexus.yaml

No application code changes in this motion.

## 5.0 Next Actions
- Use DispatchConfig in wave planner / work packet generator.
- Expand seeds to Wave 0 and Wave 1 repos.
