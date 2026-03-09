# Challenge (motion-0019)

## Risks
- Bulk instantiation could create many files unexpectedly.

## Mitigations
- This motion is a controlled demo with a known manifest size.
- The command is manifest-gated and supports `--dry-run`.

risk_score: 0.04
