# Challenge: Corpus V2 governed activation proof v0 — proceed path

**Motion:** motion-0126
**Date:** 2026-04-09

## C1. Is it legitimate for the proof motion to activate itself?

Yes. The proof target is the governed activation path itself. Using motion-0126
as the proof subject is the smallest honest scope: one motion package, one
governed handoff, one activation outcome, one work packet, one receipt.

## C2. Should the proof force a full execution/approval loop?

No. That would widen the slice. The bounded proof target is the new Corpus V2
activation gate and its durable artifact propagation. `ACKNOWLEDGED` receipt is
enough to prove the receipt path preserves Corpus V2 metadata without claiming a
completed execution path that was not exercised.

## C3. Should the proof use `ESCALATE` instead?

No. motion-0126 is the first proof of the `PROCEED` path. The next proof motion
should exercise `ESCALATE` refusal separately so each outcome class has a clean
evidence base.

## Resolution

No blocking challenge identified. Proceed with the bounded proof.
