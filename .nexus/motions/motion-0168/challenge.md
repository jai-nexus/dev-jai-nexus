# Challenge: JAI Agent Deliberation Panel v0

## Review focus

- Ensure advisory votes are explicitly non-binding.
- Ensure all candidate actions stay tied to the repo + surface + optional
  project model.
- Ensure planned toolchain targets stay planned-only and do not imply
  integration or execution.

## Risks

- Candidate rows could be mistaken for runnable actions if the UI does not
  state copy-only and non-binding posture clearly.
- Per-agent reasoning could drift from actual configured scope if the model is
  not driven from the Agent Registry.
- Planned toolchain targets could be misread as integrated capabilities.

## Required protections

- no run, dispatch, or execute controls
- no branch write or PR creation controls
- no API routes or DB writes
- no runtime or proof file changes
