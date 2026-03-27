# Proposal - motion-0064

## Title
Motion Factory v0 — preview mode for draft

## Why this motion exists
motion-0063 added preview mode for revise and evidence. Draft is the last
factory command that writes to the filesystem without a preview option.
While draft creates new directories rather than overwriting, operators
still benefit from inspecting the full proposed package before committing
to directory creation — especially when using API-backed narrative
generation where output quality varies.

## What this motion adds

### --preview flag for draft

**Preview with default provider (PowerShell-ready):**
```
node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup motion" --preview
```

**Preview with Anthropic:**
```
node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup" --provider anthropic --preview
```

**Preview with placeholder scaffold:**
```
node portal/scripts/motion-factory.mjs draft --intent "Quick scaffold" --no-api --preview
```

### Same pipeline, different final step
Preview mode shares the entire draft pipeline:
- same context gathering (buildContext)
- same next motion ID resolution
- same provider selection and API key validation
- same narrative generation (or placeholder fallback)
- same deterministic structural file generation
- same 9-file package assembly

Only the final step differs:
- **Normal draft:** creates the motion directory and writes 9 files
- **Preview draft:** prints proposed 9-file content to stdout with clear
  markers, creates no directory, writes no files

### Provisional motion ID
Preview mode shows the current next motion ID as a provisional candidate
only. It does not reserve that ID. The ID is not guaranteed to remain the
same by the time normal draft runs — for example, if another motion is
created between preview and apply, the ID will increment.

### Preview output semantics
Preview output must clearly identify:
- intent
- provider used (or placeholder/no-api mode)
- provisional next motion ID
- preview-only / no-write status

Preview output must:
- use clear per-file begin/end markers
- not use misleading success wording that implies files were written
  or a directory was created

### Proposed stdout format
```
[MOTION-FACTORY] Preview for motion-NNNN (draft)
[MOTION-FACTORY] Intent:       Legacy cleanup motion
[MOTION-FACTORY] Motion ID:    motion-NNNN (provisional, not reserved)
[MOTION-FACTORY] Provider:     model-generated (OpenAI)
[MOTION-FACTORY] Status:       PREVIEW ONLY — proposed content not applied
[MOTION-FACTORY] ─────────────────────────────────────────
[MOTION-FACTORY] === PREVIEW: motion.yaml ===
(proposed content)
[MOTION-FACTORY] === END PREVIEW ===
[MOTION-FACTORY] === PREVIEW: proposal.md ===
(proposed content)
[MOTION-FACTORY] === END PREVIEW ===
... (all 9 files)
[MOTION-FACTORY] ─────────────────────────────────────────
[MOTION-FACTORY] ⚠  PREVIEW ONLY — no files were written, no directory was created.
[MOTION-FACTORY]    Motion ID motion-NNNN is provisional and not reserved.
[MOTION-FACTORY]    To apply, run the same command without --preview.
```

### Preview failure semantics
On preview failure (API error, missing key, etc.):
- no files are written
- no directory is created
- stdout does not imply that a package was created
- the failure is reported as a failed proposed generation, not a partial creation

### What stays the same
- Normal draft (without --preview) is unchanged
- Directory creation behavior unchanged
- Structural file generation unchanged
- Narrative generation unchanged
- Provider selection unchanged
- API key validation unchanged

## What this motion does not add
- No approval or apply subcommands
- No diff engine
- No interactive confirmation
- No queuing system
- No motion ID reservation mechanism

## Design stance
This completes preview coverage for all three write-path factory commands.
The implementation follows the same pattern established in motion-0063:
same pipeline, different final step.

## Why now
Preview mode for revise and evidence was just ratified. Extending it to
draft completes the preview surface and gives the operator full inspection
capability across all factory write paths.
