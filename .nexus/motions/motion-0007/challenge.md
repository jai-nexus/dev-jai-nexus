# Challenge (motion-0007)

## Risks
- Performance: accidental recursive scans (workspace/, node_modules/, generated/).
- Incorrect CRL scoring if rules aren’t explicit.
- Endpoint becomes a dumping ground for future logic.

## Mitigations
- Only read known config dirs and explicit file lists.
- Make CRL rules explicit in code and keep them small.
- Return "UNKNOWN" rather than inventing repo facts.

## Risk score
risk_score: 0.10
