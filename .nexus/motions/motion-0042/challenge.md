# Challenge - motion-0042

## Main concern
A task-local code pack can fail in two opposite ways: it can be too small to help, or too large to stay useful. If the file-selection and excerpt logic are not carefully bounded, the output may become noisy and defeat the purpose of targeted code-session setup.

## Risks
1. **Over-inclusion risk**
   - The pack may include too many files and become another repo dump.

2. **Under-inclusion risk**
   - The pack may omit the most important touched files and fail to help implementation work.

3. **Excerpt distortion risk**
   - Truncated excerpts may hide the relevant context or make files misleading.

4. **Path-noise risk**
   - Build files, generated files, or unrelated modified files may pollute the pack.

5. **Canonical-truth confusion**
   - Operators may start relying on the generated code pack instead of the actual source files.

## Required safeguards
- stable ordering,
- explicit path references,
- bounded excerpts,
- clear ignore rules,
- manifest sidecar,
- clear statement that generated packs are secondary to source truth.

## Challenger standard for approval
I approve this motion only if:
- the generated pack is clearly useful for real code-heavy Claude sessions,
- the output remains compact,
- selected files are understandable and relevant,
- reruns are stable,
- canonical source truth remains clear,
- the motion stays path-oriented and bounded.

## Risk score
risk_score: 0.07
