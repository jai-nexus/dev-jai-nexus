# Challenge (motion-0017)

## Risks
- Bulk creation could generate lots of files unintentionally.
- Could bypass governance by inventing unregistered panel IDs.

## Mitigations
- Require motion folder to exist before writing.
- Only scaffold panel IDs present in `.nexus/agent-panels.yaml`.
- Provide `--dry-run` and `--only/--exclude` filters.

risk_score: 0.06
