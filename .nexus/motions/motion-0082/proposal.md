# Proposal: bounded loop coherence gate

**Motion:** motion-0082
**Parent:** motion-0071 (WS-5)
**Date:** 2026-03-30

## Context

WS-4 (motion-0081) is complete. Operator approval of packet 880 / motion-0070
writes `execution.receipt.json` with `status: "COMPLETED"`. The governed
loop now closes durably. However, no code path evaluates whether the full
chain is self-consistent. The operator sees individual state chips but no
unified verdict.

## What's already computed in the page render

`portal/src/app/operator/work/[id]/page.tsx` already computes:

- `governingMotion` — `GoverningMotionState` with `decisionStatus`,
  `handoffStatus`, `receiptStatus` (from `.nexus/` file reads)
- `architectEvt`, `builderEvt`, `verifierEvt`, `operatorEvt` — debug event
  presence from DB
- `p.githubPrUrl`, `p.verificationUrl` — supplementary evidence
- `operatorDecisionKind` — `WORK_APPROVED` / `WORK_REVIEW_REQUESTED` / null

All coherence inputs are already present. No new DB queries or file reads
are required.

## Proposed change

### 1. Types and `computeLoopCoherence` function

Added inline in `portal/src/app/operator/work/[id]/page.tsx` before
`writeReceiptArtifact`.

```typescript
type LoopCoherenceVerdict = "COHERENT" | "PROGRESSING" | "INCOHERENT" | "NOT_GOVERNED";

type LoopCoherenceState = {
  verdict: LoopCoherenceVerdict;
  reasons: string[];
};
```

**Coherence conditions:**

| # | Condition                              | Failure → verdict  |
|---|----------------------------------------|--------------------|
| 1 | governingMotion non-null               | NOT_GOVERNED       |
| 2 | decisionStatus === "RATIFIED"          | INCOHERENT         |
| 3 | handoffStatus === "ISSUED"             | INCOHERENT         |
| 4 | architect + builder + verifier present | PROGRESSING        |
| 5 | WORK_APPROVED + receipt COMPLETED      | PROGRESSING        |
| — | All conditions met                     | COHERENT           |

Conditions 2 and 3 are governance layer checks. Failing either means the
packet should not be in the execution loop at all — INCOHERENT is the correct
verdict. Conditions 4 and 5 reflect execution progress — a packet in good
standing that simply hasn't advanced yet should be PROGRESSING, not broken.

### 2. Page body call

```typescript
const loopCoherence = computeLoopCoherence({
  governingMotion,
  architectPresent: !!architectEvt,
  builderPresent: !!(builderEvt || p.githubPrUrl),
  verifierPresent: !!(verifierEvt || p.verificationUrl),
  operatorDecisionKind,
});
```

Added immediately before the `return (` statement, after all evidence
variables are computed.

### 3. Coherence row in Governing Motion section

Added at the bottom of the existing `{governingMotion ? ... }` JSX block.
Rendered only when `governingMotion` is non-null.

Fields:
- Verdict chip (emerald=COHERENT, sky=PROGRESSING, amber=INCOHERENT,
  slate=NOT_GOVERNED)
- Reasons text (compact, inline)

## Scope boundary

One file changed: `portal/src/app/operator/work/[id]/page.tsx`.

No enforcement. The gate computes and surfaces; it does not block actions.
