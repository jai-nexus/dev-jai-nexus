# B2 canonical fleet snapshot

`Q4M11Y26-P2:B2` (JAI-279) exports a read-only fleet identity record from `jai-nexus/dev-jai-nexus`. Schema `JAI-FLEET-SNAPSHOT-v0` uses `repo_id` (the case-preserving GitHub `owner/repo`) as its primary key. The export rejects unknown schema versions during verification. [Snapshot](../../config/fleet/q4m11y26-p2-b2-canonical-fleet-snapshot-v0.json) · [Frozen B2 contract](../../.nexus/programs/corpus-v1/motion-0248/jai-five-slot-compounded-reasoning-shadow-kernel-v0/lanes/B2/contract.yaml)

## Inputs and provenance

The A1 fixture supplies the curated identities, numeric GitHub IDs, observed presence and archive state, and governance dispositions. The portal registry supplies status and corroborates each NHID. Its additional organization row appears separately in `organization_meta` as `jai-nexus`, NHID `1.1`, role `meta`. The root topology supplies membership and status for five repositories. [A1 identities](../../portal/src/lib/controlPlane/__fixtures__/q4m11y26-p2-a1-fleet-identity-v0.json) · [Portal registry](../../portal/config/repos.yaml) · [Root topology](../../config/repos.yaml)

`source_provenance.input_digests` keys each SHA-256 hex digest by its repository-relative input path. The exporter reads exact Git blob bytes at HEAD and rejects local input edits. This keeps the digests reproducible across checkout line-ending conventions. A1 supplies `source_sha` but no separate observation date. The v0 cutoff is the recorded committer date of that immutable source commit, `2026-11-20`, verifiable with `git show -s --format=%cs c0921ce771adece93c340f64605df77945cc467e`.

## Repository rows

Rows use ascending UTF-16 code-unit order by `repo_id`. Each carries a unique short `alias`, canonical HTTPS Git clone URL, compatibility `nhid`, and nullable numeric `github_repo_id`. The export rejects duplicate identities, missing joins, inconsistent root membership, and unknown lifecycle inputs. It preserves the underlying disposition, presence, archive observation and portal status alongside the derived lifecycle.

| Lifecycle | Source rule | Current count |
| --- | --- | ---: |
| `LIVE` | `KEEP`, `LIVE_VERIFIED`, archive observation `false`, portal `active` | 16 |
| `PARKED` | `PARK`, `LIVE_VERIFIED`, archive observation `false`, portal `frozen` | 4 |
| `ARCHIVED` | Compatibility-retained disposition, an observed archive, or portal `deprecated`, with recognized source values | 1 |

`jai-nexus/teacher-copilot` falls under the compatibility rule. Its GitHub ID and archive observation are both `null`, and its presence is `UNVERIFIED_ACCESS`. `JerryIngram/offbook-ai` is `LIVE` with portal status `active`, root membership `true` and root status `planned`. Rows outside the five-repository topology have a null root status. The separate `retired_unverified_placeholders` list preserves all 21 dropped names, historical NHIDs, `UNVERIFIED_ACCESS` observations and `DROPPED_FROM_ACTIVE_REGISTRY` dispositions.

## Reproduction and downstream pins

From the repository root, run `node portal/scripts/export-canonical-fleet-snapshot.mjs --write` to export and `node portal/scripts/export-canonical-fleet-snapshot.mjs --check` to verify. Artifact bytes use UTF-8, two-space JSON indentation and a final LF. For `snapshot_digest`, remove only the top-level digest field, serialize the full remaining payload with the B1 RFC 8785 canonicalizer, and hash the UTF-8 bytes of `JAI-FLEET-SNAPSHOT-v0`, one NUL byte and that serialization, in order. Prefix the lowercase SHA-256 hex result with `sha256:`.

After human acceptance, B3 pins these five values together:

1. Source repository `jai-nexus/dev-jai-nexus`.
2. Exact merged `main` commit containing the accepted export.
3. Repository-relative path `config/fleet/q4m11y26-p2-b2-canonical-fleet-snapshot-v0.json`.
4. Git blob OID obtained with `git rev-parse <merged-sha>:<path>`.
5. Independently recomputed `snapshot_digest`.

B3 joins `repo_id` to the owner/repo in its `[[repo]].url` and can cross-check `alias` against `name`. Its checkout paths, Compose files, profiles, orchestration lanes and execution/sync flags remain locally authored. Under CRED-1, the Git blob and payload digest establish content integrity. The snapshot and repository rows carry `authority_granted: false`. Runtime execution, NHID allocation, credential grants and repository writes each require separate authority.
