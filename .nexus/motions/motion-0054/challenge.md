# Challenge (motion-0054)

## Risks
- Model-generated narrative could be low quality, off-target, or
  stylistically inconsistent with the repo's established motion conventions.
- The model could hallucinate evidence, claim proof that hasn't been
  executed, or insert PASS/FAIL tables despite the hard rule against it.
- API failures could leave a partially written package. The failure
  semantics must handle this gracefully.
- The prompt could grow if recent motion context expands, eventually
  hitting token limits.

## Objections
- Generated content is explicitly draft quality. The human reviews and
  edits before ratification. Low-quality output is caught during review,
  not shipped as canon.
- The hard rule against evidence content is enforced in the system prompt.
  The human review step is the second line of defense.
- API failure is handled by Case C semantics: structural files kept,
  narrative falls back to placeholders, warning printed. No partial or
  corrupted packages.
- The context payload is bounded (recent 5 motions metadata-first, config
  summaries). Token limits are unlikely to be hit in v0.

## Mitigations
- System prompt explicitly instructs the model to not generate evidence
  tables, PASS/FAIL claims, vote entries, or ratification claims.
- --no-api flag preserves motion-0053 placeholder behavior as a fallback.
- Three distinct failure cases are handled explicitly.
- stdout notes whether narrative was model-generated or placeholder.
- Human review before council:run remains the governance boundary.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.10
