# Motion 0171 Challenge

## Main risks

- committed projections could drift from the bundled continuity model
- exported artifact naming could diverge from the required conventions
- waves could still look like executable plans rather than planning spine artifacts

## Required mitigations

- use the bundled continuity model as the single generation source
- add deterministic `--write` and `--check` modes
- show committed artifact presence separately from bundled model preview
- keep all UI copy explicit about no automatic live capture or execution
