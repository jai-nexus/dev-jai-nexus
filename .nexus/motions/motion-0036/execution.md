# Execution Plan - motion-0036

## Goal
Create the first governed Claude-facing operating layer for dev-jai-nexus so Claude project work can begin from repo-centric, substrate-backed context instead of repeated ad hoc briefing.

## Plan
1. Add repo-root CLAUDE.md
   - define repo purpose,
   - define core commands,
   - define motion-oriented workflow expectations,
   - define sensitive or high-governance surfaces,
   - define editing expectations and constraints.

2. Add Claude project context pack
   - create a compact artifact that summarizes:
     - project identity,
     - repo purpose,
     - current governance model,
     - core workflow assumptions,
     - references to canonical substrate artifacts.

3. Add bootstrap-set artifact
   - define the minimal recommended file set for setting up a Claude project or chat.
   - keep the set small and reusable.

4. Add Claude operating workflow artifact
   - define how Claude is expected to be used in dev-jai-nexus:
     - strategic chat vs implementation chat,
     - when to use context bundles,
     - how motion work should remain canonical,
     - how to avoid repeated recontextualization.

5. Validate coherence
   - confirm the Claude-facing artifacts align with:
     - motion-0033 context generation,
     - motion-0035 substrate artifacts,
     - current dev-jai-nexus motion workflow.

6. Create proof pack
   - read the Claude pack together as a compact onboarding bundle,
   - confirm it is practical for immediate manual setup.

## Suggested governed artifact set
- `CLAUDE.md`
- `.nexus/claude/project-context-pack.md`
- `.nexus/claude/bootstrap-set.yaml`
- `.nexus/claude/operating-workflow.md`

## Suggested proof
- all Claude-facing artifacts exist,
- they reference the correct substrate artifacts,
- they are compact enough to use in a real Claude project setup,
- they provide a clear repo-centric starting point.

## Suggested acceptance criteria
- repo-root CLAUDE.md exists
- Claude project context pack exists
- bootstrap-set artifact exists
- operating workflow artifact exists
- all Claude-facing artifacts are consistent with motion-0035
- the bootstrap set is compact and practical
- local validation passes if code surfaces are touched

## Done means
- dev-jai-nexus has a governed Claude-facing operating layer,
- Claude project setup can begin from durable repo context,
- motion-0036 is ratified.
