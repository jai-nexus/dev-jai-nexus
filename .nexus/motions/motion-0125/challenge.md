# Challenge: Corpus V2 governed activation gate v0 — cost category and durable escalation outcome wiring

**Motion:** motion-0125
**Date:** 2026-04-09

## C1. Does this relitigate motion-0124 instead of following it?

No. motion-0124 established the protocol layer. motion-0125 applies that layer
to a real governed execution path. The protocol remains where motion-0124 put
it; this motion changes repo behavior so the protocol governs activation and the
execution artifact chain.

## C2. Is it safe to extend legacy handoff/receipt artifacts with Corpus V2 metadata?

Yes. The change is additive. Existing handoff and receipt semantics remain:
- `decision.yaml` still carries governance authority
- `execution.handoff.json` still records ISSUED handoff state
- `execution.receipt.json` still records execution outcome

This motion only adds bounded metadata so Corpus V2 cost discipline and
activation outcome survive beyond activation time.

## C3. Should `ESCALATE` hard-block all activation?

No. The bounded behavior is:
- `BLOCK` => activation refused
- `ESCALATE` => dry-run allowed, durable outcome recorded, live `--create` refused
- `PROCEED` => live activation permitted

That preserves operator visibility and governed review without collapsing
escalation into the same semantics as block.

## C4. Is UI-only surfacing enough?

No. UI display is useful, but insufficient. The governed artifact chain must
preserve the semantics independently of the current operator surface. This is
why motion-0125 extends handoff and receipt artifacts instead of stopping at
tags and display chips.

## Resolution

No blocking challenge identified. Proceed with the bounded implementation.
