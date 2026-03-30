# Proposal: Bounded Bootstrap Artifact Generator Implementation v0

**Motion:** motion-0089
**Parent:** motion-0084 (WS-D implementation)
**Spec:** motion-0088
**Date:** 2026-03-30

## Context

The planning stack is complete: WS-A through WS-D spec (motion-0085 through
motion-0088) define the project intake canon, agent demand planner, topology
and wave model, and the bootstrap manifest and generator contract.

The WS-D implementation motion is the correct next step. The spec is complete
and directly implementable — no further planning is needed before writing code.

## Implementation decisions

### CLI shape

```
node portal/scripts/generate-bootstrap.mjs
  --intake <path>      Required. Project intake instance YAML.
  --demand <path>      Optional. Agent demand matrix instance.
                       Falls back to intake.derived_agents if present.
  --topology <path>    Optional. Topology plan instance.
                       Falls back to derivation from intake.topology.
  --output <path>      Output root. Default: ./bootstrap-output/<project_id>
  --baseline <path>    Source for copied files. Default: this repo root.
  --dry-run            Print actions; do not write files.
  --force              Overwrite existing files (prompts unless --yes).
  --yes                Skip --force confirmation.
  --verbose            Extra output.
```

The `--intake` file is the only required argument. Demand and topology are
derived inline if not provided, using the same rules defined in WS-B and WS-C.
This allows the OffBook.ai intake example to be used directly as a test target.

### Input fallbacks

- If `--demand` absent: use `intake.derived_agents` (WS-B illustration field
  present in offbook-ai-intake-example.yaml) or derive from intake rules.
- If `--topology` absent: derive from `intake.topology` (shape, repos,
  governance_resident flag) using WS-C scope derivation rules.

### Artifact classification enforcement

Each `writeFileIdempotent` / `copyFileIdempotent` call carries a `label` arg
that is printed in every output line:

```
  » WRITE        [generated]   config/agency.yaml
  » COPY         [copied]      .nexus/council.config.yaml
  » WRITE        [stubbed]     .nexus/motions/motion-0001/motion.yaml
  » WRITE        [manual-only] .nexus/motions/motion-0001/proposal.md
```

### Idempotency

Default: skip existing files. `writeFileIdempotent` and `copyFileIdempotent`
both check `fs.existsSync` before writing. Output line prefix `~ SKIP (exists)`
for skipped files.

### Manual-only enforcement

`buildProposalShell()` emits only:
- Structural headings (`# Proposal:`, `## Context`, etc.)
- HTML comment placeholders: `<!-- TODO: author this section -->`
- No prose, no rationale, no example text

### Baseline file source

The `--baseline` defaults to the repo root (detected from `__dirname`).
Copied files are read from there verbatim. The baseline `repo-caspsule.schema.yaml`
(which has a typo in the source filename) is copied to the correctly-named
destination `repo-capsule.schema.yaml`. The generator checks both the corrected
and typo'd source names for resilience.

### Output location

Default: `./bootstrap-output/<project_id>` relative to cwd. This isolates
generated output from the dev-jai-nexus repo itself. For real project bootstrap,
the operator passes `--output <governance-resident-repo-root>`.

## What the generator does NOT do

- Does not emit Wave 1+ artifacts (agent-panels.yaml, model-slots.yaml,
  model-routing.yaml, .nexus/claude/ guides, surfaces/).
- Does not write `.env` files or secrets.
- Does not generate motions beyond motion-0001.
- Does not auto-author any governance prose.
- Does not touch portal src/, prisma/, or any runtime code.
