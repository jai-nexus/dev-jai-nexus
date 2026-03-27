# Challenge (motion-0063)

## Risks
- Preview mode calls the provider API, which costs tokens. Operators
  might preview and then apply, doubling the API cost.
- Preview output could be large for multi-file revisions, making stdout
  hard to read.
- Operators might rely on preview output quality as a guarantee that
  apply output will be identical. In practice, a second API call for
  apply may produce slightly different content.

## Objections
- API cost doubling is bounded: preview is optional and the operator
  chooses when to use it. For high-stakes motions the extra cost is
  worthwhile. For routine motions, preview can be skipped.
- Large output is mitigated by clear per-file markers that make sections
  navigable. The operator can also use --files to preview a single file.
- Preview and apply use the same prompt and pipeline, so output should
  be very similar. But the motion explicitly documents that preview
  output is proposed, not guaranteed to match a subsequent apply call.

## Mitigations
- Preview is optional (--preview flag, not default).
- Clear per-file begin/end markers make multi-file output navigable.
- Operators can narrow preview to specific files with --files.
- Preview output is explicitly labeled as proposed-only, not applied.
- Preview mode writes nothing under any success or failure path.
- Evidence preview preserves the same non-invention boundary as apply.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
