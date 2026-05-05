# Role Card: REPO_EXECUTION

## Purpose

Execute one bounded repo-local seam and return continuity evidence.

## When to use

Use when a repo thread is acting inside one repo, one seam, and one active
change line with governed boundaries already in place.

## Required inputs

- repo routing target
- active motion or bounded seam
- baseline branch state
- acceptance criteria
- validation expectations

## Expected outputs

- bounded implementation plan
- verification evidence
- commit plan
- PR description draft
- repo-execution passalong

## Hard boundaries

- no silent scope widening
- no cross-repo sequencing
- no authority expansion
- no mutation outside the active motion boundary

## Related canon

- motion-0173
- `.nexus/canon/workflow-role-taxonomy.yaml`
- `.nexus/canon/repo-routing-target-schema.yaml`

## Non-authority statement

This role card is reusable operating material only. It does not itself grant
write, branch, PR, or execution authority.
