# Challenge (motion-0067)

## Risks
- Discovery could make assumptions about candidate artifact shape that
  break if the shape evolves in future motions.
- Enumerating all candidate files could become slow if many candidates
  accumulate over time.
- Displaying candidate information in status and context could create
  visual clutter if the candidate list grows large.
- Malformed candidate files could accumulate silently if operators do
  not notice the skipped_malformed count.

## Objections
- Shape assumptions are mitigated by reading only fields already emitted
  by motion-0066 (candidateId, intent, status, createdAt, targetMotionId).
  The discovery helper does not anticipate future fields. If the shape
  evolves, the discovery code updates in a future motion.
- Performance is bounded: candidates are single small JSON files.
  Enumeration reads filenames and parses lightweight JSON. Even hundreds
  of candidates would enumerate in milliseconds.
- Visual clutter is managed by showing only the most recent candidate
  in status and a windowed list in context (same window size as recent
  motions). status --json does not include an unbounded full list.
- Malformed files are reported via skipped_malformed count in both
  human-readable and --json output. This is lightweight but visible.

## Mitigations
- Read-only: no writes, no mutation, no side effects.
- Graceful degradation: missing directory → count 0; malformed file → skip, count, warn.
- Only emitted fields are read — no anticipation of future shape.
- Windowed display prevents output bloat.
- skipped_malformed count surfaces file health without heavy error machinery.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
