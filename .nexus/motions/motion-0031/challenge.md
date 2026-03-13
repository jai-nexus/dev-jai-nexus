# Challenge — motion-0031

## Main concern
The architect proof succeeded because the live runtime, queue row, and packet routing all aligned. The builder motion must preserve that same determinism and not blur governance with execution.

## Risks
1. **Builder runtime may claim the wrong packet**
   - If role filtering depends only on tags or only on inferred role, builder claim logic could accidentally pick up non-builder work.

2. **Patch evidence may be too fake or too vague**
   - `debug.patch` should be clearly patch-shaped evidence, not just a generic note.

3. **Queue and inbox state may drift**
   - The packet could show builder-ready in the UI while the queue is still stale or assigned inconsistently.

4. **Routing could skip verifier semantics**
   - Builder completion must explicitly hand off to verifier, not just mark generic completion.

5. **Auto-handoff temptation**
   - It would be easy to couple builder routing with auto-assignment of a verifier agent. That should stay out of this motion.

## Required safeguards
- Builder runner only claims builder-routed work.
- Builder proof emits all expected packet-linked SoT events.
- Patch evidence is explicit and readable in the packet detail view.
- Routing to verifier is explicit and visible.
- Manual operator assignment remains the control point.

## Challenger standard for approval
I approve this motion only if:
- the live builder claim works end-to-end,
- the emitted evidence is unmistakably builder-shaped,
- the packet becomes verifier-ready,
- no hidden auto-handoff behavior is added.
