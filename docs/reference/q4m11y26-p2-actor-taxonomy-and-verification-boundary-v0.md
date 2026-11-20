# Q4M11Y26-P2 actor taxonomy and verification boundary

This reference applies to `Q4M11Y26-P2:A1` (`JAI-275`) at the accepted main commit `c0921ce771adece93c340f64605df77945cc467e`. The lane has one write repository, `jai-nexus/dev-jai-nexus`. Implementation requires a separate CONTROL_THREAD route. [A1 lane contract](../../.nexus/programs/corpus-v1/motion-0248/jai-five-slot-compounded-reasoning-shadow-kernel-v0/lanes/A1/contract.yaml)

## Actor responsibilities

| Actor | Principal | Routed responsibility |
| --- | --- | --- |
| `JAI::COUNCIL::ARCHITECT` | Gemini | Frames Chamber A conjectures, designs the architecture and synthesizes routes. Repository writes are outside this seat. |
| `JAI::COUNCIL::BUILDER` | ChatGPT (non-Codex) | Prepares engineering specifications and performs read-only cross-verification of Claude workflow PRs when routed. This seat has zero Git mutation authority. |
| `JAI::DEV::BUILDER` | Codex | Implements bounded Chamber B changes on a feature branch and issues the B9-CLASS-004 delivery receipt. |
| `JAI::DEV::VERIFIER` | Claude | Performs independent B9-CLASS-006 cold verification of Codex PRs, owns workflow changes under the rolemap and stewards the Linear mirror under B9-CLASS-013. |

## Verification and integration

B9-CLASS-006 requires a verifier from a different model family. Claude verifies Codex implementations. ChatGPT may verify Claude-authored workflow PRs when CONTROL_THREAD routes that review. ChatGPT and Codex share a family, so the Council Builder cannot verify a Codex PR. The verifier is the sole role permitted to change `.github/workflows/**`. [Repository rolemap](../../roles/rolemap.json)

All four AI seats carry `merge_authorized: false`. Under B9-CLASS-007, Jerry Ingram, acting as VERIFIED_HUMAN_OPERATOR, exclusively accepts and merges PRs and deletes remote branches.

## Repository and principal identity

| Field | Meaning |
| --- | --- |
| `github_repo_id` | Immutable numeric GitHub repository identity. A null value records unavailable identity evidence. |
| `owner/repo` | Canonical repository name at the observation, which can change on rename or transfer. |
| `nh_id` | Stable compatibility coordinate for existing database and API references. |
| `fleetDisplayIndex` | One-based alphabetical position in the current fleet. Adding or removing a repository can change this value. |
| Actor principal | Identifies who performed a routed action. Authority comes from the applicable route. Fleet observations carry `authority_granted: false`. |
