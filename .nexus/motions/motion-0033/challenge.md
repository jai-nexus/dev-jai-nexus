# Challenge — motion-0033

## Main concern
A context generator can become noisy or misleading if it copies too much, omits the wrong things, or changes output shape unpredictably between runs.

The goal is not "more text." The goal is compact, stable, reusable context.

## Risks
1. **Raw dump risk**
   - The generator may produce giant low-signal files that are too expensive to upload and too noisy to be useful.

2. **Drift risk**
   - The snapshot may disagree with canonical motion artifacts if the compilation logic is loose or incomplete.

3. **Instability risk**
   - File ordering, timestamps, or path enumeration may vary between runs, making the output hard to diff and hard to trust.

4. **Over-scope risk**
   - The motion could drift into retrieval, embeddings, or full indexing work instead of shipping a simple deterministic artifact generator.

5. **Junk-path contamination**
   - Build artifacts, caches, generated noise, or vendor folders may pollute the bundle.

## Required safeguards
- deterministic output ordering,
- bounded tree export,
- explicit ignore rules,
- compact summaries where possible,
- manifest sidecar for generation metadata,
- direct linkage back to canonical motion artifacts rather than replacing them.

## Challenger standard for approval
I approve this motion only if:
- the generated files are clearly useful in real chat bootstrapping,
- the output is compact enough to upload,
- the snapshot reflects real repo/motion state,
- reruns are stable,
- the motion stays text-first and scoped.

## Risk score
risk_score: 0.10
