# Proposal - motion-0063

## Title
Motion Factory v0 — preview mode for revise and evidence

## Why this motion exists
The revise and evidence commands overwrite files on successful runs.
Operators currently cannot inspect proposed changes before they are applied.
A preview mode provides a low-risk way to review generated changes before any write occurs.

## What this motion adds

### --preview flag for revise and evidence

Examples:
```
node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Tighten scope" --preview
```

```
node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof.txt --preview
```

With provider selection (same flag set):
```
node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --provider anthropic --preview
```

### Single pipeline, different terminal action
Preview reuses the existing pipeline for input validation, provider calls, parsing, and response validation. The only intentional change is the terminal action:
- Apply mode: writes files atomically.
- Preview mode: prints proposed content to stdout (no files written).

Preview is not an alternate parsing or validation path.

### Preview output semantics
Preview output MUST:
- be explicitly labeled as proposed-only and not applied,
- present clear per-file begin/end markers,
- avoid wording that implies files were written (no "Revision complete" or "Evidence insertion complete").

Preview stdout SHOULD follow a compact, machine-friendly format such as:
```
[MOTION-FACTORY] Preview for motion-NNNN (revise)
[MOTION-FACTORY] Provider: model-generated (provider name)
[MOTION-FACTORY] Files:    proposal.md, challenge.md
[MOTION-FACTORY] ─────────────────────────────────────────
[MOTION-FACTORY] === PREVIEW: proposal.md ===
(proposed content)
[MOTION-FACTORY] === END PREVIEW ===
[MOTION-FACTORY] === PREVIEW: challenge.md ===
(proposed content)
[MOTION-FACTORY] === END PREVIEW ===
[MOTION-FACTORY] ─────────────────────────────────────────
[MOTION-FACTORY] ⚠  PREVIEW ONLY — no files were written.
[MOTION-FACTORY]    To apply, run the same command without --preview.
```

### Evidence preview trust boundary
Preview preserves the same evidence-handling constraints as apply mode:
- models may quote, organize, or summarize provided evidence,
- models must not invent PASS/FAIL claims or resolve ambiguity into definitive assertions,
- inconclusive evidence remains presented as inconclusive.

Preview does not relax evidence non-invention rules.

### What stays the same
- Normal apply mode behavior is unchanged.
- Atomic write behavior is unchanged.
- Validation and scope guards apply in both modes.
- Provider selection and prompt/trust boundaries remain the same.

## What this motion does not add
- No preview for the draft command (draft creates new content; preview is targeted to overwrite commands)
- No file diff engine
- No side-by-side comparison UI
- No interactive approval prompt or confirmation step

## Known limitation
Preview and apply use the same prompts and pipeline, but separate provider calls can produce slightly different outputs. Previewed content is proposed and not guaranteed to match a later apply invocation exactly.

## Design stance
This is a narrow, bounded safety improvement limited to revise and evidence overwrite commands. It adds a print-instead-of-write terminal action to the existing pipeline to allow operator inspection without changing validation, parsing, or provider protocols.

## Why now
The factory is widely used for routine edits. Preview is a minimal, low-risk enhancement that improves operator trust for overwrite operations without expanding the system's scope.
