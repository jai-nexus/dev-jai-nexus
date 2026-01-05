# Wave 0 — Q1 Registry Baseline (WaveRun 4)

## Goal
Establish a canonical Q1 registry snapshot and prove the full wave lifecycle:
READY -> PLANNING -> EXECUTING -> VERIFYING -> RELEASING -> ARCHIVING.

## Inputs
- Registry source: config/repos.yaml
- Snapshot lock: RegistrySnapshot.locked = true
- Gate: registry_hash_matches must PASS before leaving READY

## Execution Steps (EXECUTING)
1) Import registry from YAML into DB (idempotent)
   - Command: scripts/registry-import.ts
   - Expected: inserted=0 updated=0 unchanged=39 (after initial run)

2) Create WaveRun for Wave 0 (already done / waveRunId=4)

3) Gate: registry hash matches (must PASS)
   - Command: scripts/jai-gate-registry-hash.ts --waveRunId 4
   - Expected: GateRun status PASS

4) Apply wave execution (materialize any wave-specific artifacts / receipts)
   - Command: scripts/jai-wave-apply.ts --waveRunId 4
   - Expected: creates AgentRun + Artifact + optional SotEvent(s)

## Verification (VERIFYING)
- Confirm WaveRun state transitions recorded as AgentRuns + Artifacts
- Confirm SotEvents exist for:
  - wave.plan.written
  - wave.state.changed
  - (any apply / sync events emitted)
- Confirm Operator UI shows registry + wave notes

## Release / Archive
- Release: mark wave run as RELEASING only after verification pass
- Archive: finalize, emit completion receipts, set COMPLETE

## Acceptance Criteria
- RegistrySnapshot locked and hash gate PASS
- WaveRun reaches COMPLETE with:
  - at least 1 plan artifact
  - at least 1 state-transition artifact per step
  - SotEvents present for state changes
- Commands are PowerShell-safe using `--` passthrough

## Rollback
- If apply fails, mark WaveRun FAILED and emit SotEvent receipt
- Do not unlock snapshot; create a new snapshot/version instead
