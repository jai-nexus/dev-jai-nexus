# Program 1 unfreeze reconciliation and control decision

On November 17, 2026, HUMAN_OPERATOR / CONTROL_THREAD ratified
`CT-DECISION-2026-11-17-Q3M7Y26-P1-UNFREEZE-AND-DEBT-CLEARANCE-v0`
at repository baseline `ab658d65b5bf06331006990f47e7bae872df4c0e`.
This record transcribes that decision for Program 1,
`jai-governance-intelligence-main-state-operating-loop-v0`.

## August decisions reconciled

| Coordinate | Ratified CONTROL_THREAD token | Evidence ceiling |
| --- | --- | --- |
| Q3M7Y26-P1:A15 | `ACCEPT_A15_AND_BATCH_A_DOCUMENTARY_EXIT` | Batch A documentary exit |
| Q3M7Y26-P1:B15R2 | `ACCEPT_B15R2_AND_BATCH_B_LIFECYCLE_RECEIPT_CANON_EXIT` | Batch B lifecycle and receipt canon |
| Q3M7Y26-P1:C15 | `ACCEPT_C15_EVIDENCE_AND_BATCH_C_EXIT` | C15 verification evidence and Batch C exit |
| Q3M7Y26-P1:D9 | `ACCEPT_D9_RETROACTIVELY_UNDER_B12_BOUNDED_EXCEPTION` | `TESTED_DETERMINISTIC_LOCAL_SHADOW_BATCH_B_CONTRACT_ADAPTER_ONLY` |

## B13 planning supersession

B13 consolidated the unexecuted D10 through F15 planning tail into six lanes in this order.

1. `Q3M7Y26-P1:D-impl`
2. `Q3M7Y26-P1:D-exit`
3. `Q3M7Y26-P1:E-suite`
4. `Q3M7Y26-P1:E-exit`
5. `Q3M7Y26-P1:F-evidence`
6. `Q3M7Y26-P1:F-close`

The 21 legacy pre-Program-1 branches have disposition
`HISTORICAL_INACTIVE_NON_AUTOROUTING`. CONTROL_THREAD retains acceptance
authority for the consolidated lanes, Batch D exit, and Program exit.

## Economic and execution posture

The authorized Program 1 Layer 2 API spend ceiling is **$0.00**.
The November 17 [wallet ledger](../../wallet/ledger-v0.yaml) records the
allocation, settled charges, reported balance, and December renewal reserve.
The implementation runs under `JAI_NOT_ACTIVATED / MOCK_INFERENCE_ONLY`.
