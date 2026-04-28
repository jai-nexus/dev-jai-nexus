# Proposal: JAI Agent Deliberation Panel v0

**Motion:** motion-0168  
**Basis:** motion-0167  
**Program:** q2-agent-deliberation-panel-v0

## Intent

Add an advisory-only operator deliberation panel that:

- loads participating agents from the Agent Registry
- derives candidate actions from existing planning surfaces
- renders deterministic per-agent reasoning and non-binding votes
- emits copy-only next-step prompts

## Scope

- add `/operator/deliberation`
- add deterministic deliberation model and types
- include candidates from work packets, projects, manual candidates, motions,
  and planned toolchain targets
- represent `jai-pilot` and `vscode-nexus` as planned-only targets

## Boundaries

- no execution
- no branch writes
- no PR creation
- no dispatch
- no scheduler
- no DB writes
- no API mutation
- no credentials or token enablement
- no cross-repo mutation
- no auto-created motions
- no auto-ratification
- no live LLM calls
