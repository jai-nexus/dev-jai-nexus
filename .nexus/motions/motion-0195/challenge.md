# Challenge: Cross-Repo Ownership Sweep Consolidation v0

## Risks

- the control-plane repo could still be overread as the owner of destination canon
- settled repo-local boundaries could be mistaken for globally settled doctrine

## Mitigations

- repeat that `dev-jai-nexus` is coordinator/reference surface only
- mark unresolved/global seams as future-routed
- avoid rewriting destination repo canon
