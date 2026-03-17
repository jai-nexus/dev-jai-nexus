# Motion Factory v0 — Operator Playbook

> Canonical operator reference for Motion Factory v0 in dev-jai-nexus.
> This playbook documents the proven workflow, commands, providers, trust
> boundaries, and operator hygiene for governed motion authoring.

---

## 1. Placeholder-First Workflow

Every new motion starts with a factory-generated scaffold.

Do not manually create the 9-file motion package from scratch. Instead:

1. Run `draft` to generate the scaffold
2. Review the generated package
3. Revise as needed
4. Ratify and commit

This convention was established in motion-0056 and applies to all future
motions in dev-jai-nexus.

**Exception:** manual creation is acceptable only when the factory is
unavailable or the motion structure requires a format the factory does
not yet support. This should be rare.

---

## 2. Command Guide

Motion Factory v0 has four commands. Each is progressively narrower in
scope and write authority.

### context

Inspect repo state and motion context before generation. No files written.
No API calls. Useful for verifying the factory sees the right recent motions,
staffing state, and governance config.
```
node portal/scripts/motion-factory.mjs context --intent "Reconcile model-routing.yaml with Phase 1 canon"
```

Machine-readable output:
```
node portal/scripts/motion-factory.mjs context --intent "Legacy cleanup" --json
```

### draft

Create a 9-file motion package in DRAFT state. Structural files are
deterministic. Narrative files are model-generated or placeholder.

Default (OpenAI):
```
node portal/scripts/motion-factory.mjs draft --intent "Reconcile model-routing.yaml with Phase 1 canon"
```

With Anthropic:
```
node portal/scripts/motion-factory.mjs draft --intent "Reconcile model-routing.yaml with Phase 1 canon" --provider anthropic
```

Placeholder only (no API call):
```
node portal/scripts/motion-factory.mjs draft --intent "Quick scaffold for review" --no-api
```

**Key behavior:**
- Does not overwrite existing motion directories (hard error if directory exists)
- Structural files (policy.yaml, decision.yaml, decision.md, vote.json, verify.json) are always deterministic
- Narrative files (motion.yaml, proposal.md, challenge.md, execution.md) are model-generated or placeholder
- If the API call fails, narrative falls back to placeholders with a warning

### revise

Update narrative files in an existing draft from human revision notes.
Narrower than draft. Atomic: all-or-nothing write.

Default scope (3 files):
```
node portal/scripts/motion-factory.mjs revise --motion motion-0060 --notes "Tighten proposal scope to one file change"
```

Narrow to one file:
```
node portal/scripts/motion-factory.mjs revise --motion motion-0060 --notes "Rewrite challenge risks" --files challenge.md
```

Include motion.yaml narrative fields:
```
node portal/scripts/motion-factory.mjs revise --motion motion-0060 --notes "Update summary" --files motion.yaml
```

With Anthropic:
```
node portal/scripts/motion-factory.mjs revise --motion motion-0060 --notes "Sharpen non-goals" --provider anthropic
```

**File scope:**
- Default: proposal.md, challenge.md, execution.md
- Allowed: proposal.md, challenge.md, execution.md, motion.yaml
- Never: policy.yaml, decision.yaml, decision.md, vote.json, verify.json

**Key behavior:**
- motion.yaml revision preserves structural fields (motion_id, title, status, created_at, owner, target, vote) — only narrative fields are updated
- Atomic writes: if the API fails or returns incomplete content, no files change
- Structural governance files are never touched

### evidence

Insert operator-provided proof evidence into targeted narrative files.
Narrower than revise. Atomic: all-or-nothing write.

Default scope (2 files):
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0060 --evidence-file proof-output.txt
```

With operator notes:
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0060 --evidence-file proof-output.txt --notes "All 5 panels scaffolded with 2 candidates"
```

Narrow to one file:
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0060 --evidence-file proof-output.txt --files execution.md
```

With Anthropic:
```
node portal/scripts/motion-factory.mjs evidence --motion motion-0060 --evidence-file proof-output.txt --provider anthropic
```

**File scope:**
- Default: proposal.md, execution.md
- Allowed: proposal.md, execution.md, challenge.md
- Never: motion.yaml, policy.yaml, decision.yaml, decision.md, vote.json, verify.json

**Key behavior:**
- Evidence must be file-based (--evidence-file required)
- The model may quote, organize, summarize, or place provided evidence
- The model must NOT invent PASS/FAIL claims, upgrade ambiguity into conclusions, or add results not present in the evidence file
- If evidence is inconclusive, the output preserves that ambiguity
- Atomic writes: if the API fails or returns incomplete content, no files change
- motion.yaml is never touched by the evidence command

---

## 3. Provider Guide

Motion Factory v0 supports two providers. Provider choice is operator-selected,
not auto-routed.

| Provider | Flag | API Key | Model |
|----------|------|---------|-------|
| OpenAI (default) | omit --provider, or --provider openai | OPENAI_API_KEY | gpt-5-mini |
| Anthropic | --provider anthropic | ANTHROPIC_API_KEY | claude-sonnet-4-6 |

**Default behavior:** when --provider is omitted, OpenAI is used. This is
unchanged from the original factory implementation.

**What stays the same regardless of provider:**
- Structural governance files are always deterministic
- Narrative-only write scopes are unchanged
- Atomic write guarantees are unchanged
- Non-evidence-inventing boundary is unchanged
- DRAFT-only output is unchanged
- Human review is still required

**What differs between providers:**
- Narrative prose style and quality may differ (functional parity, not
  identical output)
- API authentication headers differ (Bearer token vs x-api-key)
- Response parsing differs internally (handled by the factory)

Both providers are proven for functional parity across all commands
(motion-0059).

---

## 4. Trust Boundaries

These boundaries apply regardless of provider choice.

**Structural governance files are deterministic.**
policy.yaml, decision.yaml, decision.md, vote.json, and verify.json are
always generated from templates. Provider-specific narrative generation
does not affect them. Provider choice does not introduce governance
artifact drift.

**Narrative content is DRAFT-only.**
All model-generated content (from draft, revise, or evidence) is draft
material that requires human review before ratification. The factory
does not produce ratification-ready content.

**Evidence is source-fed, not model-invented.**
The evidence command accepts real operator-provided evidence and places
it into narrative files. The model may organize and quote that evidence.
The model must not invent results, upgrade ambiguity, or add claims
not present in the source material.

**The factory never generates:**
- Vote entries or vote rationales
- Ratification claims or ratification outcomes
- PASS/FAIL claims not supported by provided evidence
- Content implying work has been performed or validated

**Human review before council:run is mandatory.**
No factory output should be ratified without human inspection.

---

## 5. Recommended End-to-End Workflow

### For a new motion

1. **Define intent.** Decide what the motion should do.

2. **Inspect context** (optional).
```
   node portal/scripts/motion-factory.mjs context --intent "Your intent here"
```
   Verify the factory sees the correct recent motions and repo state.

3. **Generate the draft.**
```
   node portal/scripts/motion-factory.mjs draft --intent "Your intent here"
```

4. **Review the generated package.** Read the 9 files. Check that the
   narrative matches your intent and the structural files look correct.

5. **Revise if needed.**
```
   node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Your revision notes"
```
   Prefer small targeted revisions. Multiple narrow passes are better
   than one broad rewrite.

6. **Insert evidence** (proof motions only). Save terminal output or
   test results to a file, then:
```
   node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof-output.txt
```

7. **Final human review.** Check diffs. Verify no unintended drift.
```
   git diff .nexus/motions/motion-NNNN/
```

8. **Run council.**
```
   node portal/scripts/council-run.mjs motion-NNNN
```

9. **Commit.**
```
   git add .nexus/motions/motion-NNNN
   git commit -m "feat(council): Your commit message (motion-NNNN)"
```

---

## 6. Failure Handling and Operator Hygiene

**Always check stdout.** Every command prints a summary including files
written, provider used, and warnings. Read it.

**Inspect diffs before committing.** Run `git diff` on the motion directory
before `git add`. Look for unintended changes to files that should not have
been modified.

**Prefer small targeted revisions.** Use `--files` to narrow the scope.
Revise one or two files at a time rather than all three.

**Keep proof evidence in files.** Copy terminal output to a text file before
running the evidence command. Do not rely on chat history or memory for
proof evidence.

**API failures are safe.** If the API call fails during draft, narrative
falls back to placeholders. If the API call fails during revise or evidence,
existing files are not overwritten. The factory always prints a warning.

**Missing API keys fail before writes.** If the required API key is not set,
the factory exits with a clear error before creating or modifying any files.

**Do not re-draft over an existing directory.** The draft command refuses to
overwrite an existing motion directory. If you need to re-draft, delete the
directory manually first:
```
Remove-Item -Recurse -Force .nexus\motions\motion-NNNN
```

**Verify structural files are unchanged.** After any revise or evidence
command, confirm that policy.yaml, decision.yaml, decision.md, vote.json,
and verify.json were not modified. These are never targeted by revise or
evidence, but checking is good hygiene.

---

## Provenance

Motion Factory v0 was built and proven across governed motions 0052–0059
in dev-jai-nexus:

| Motion | What it proved |
|--------|---------------|
| 0052 | Context gathering scaffold |
| 0053 | Deterministic package scaffold |
| 0054 | OpenAI narrative generation |
| 0055 | Revision command with atomic writes |
| 0056 | Full-cycle proof and placeholder-first convention |
| 0057 | Evidence insertion for proof motions |
| 0058 | Anthropic provider extension |
| 0059 | Provider parity proof |

This playbook documents the stable v0 surface. Future motions that change
factory behavior should update this playbook as part of their scope.
