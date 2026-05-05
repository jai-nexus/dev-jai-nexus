# Repo Execution Prompt Template

## Purpose

Provide a reusable prompt frame for bounded repo-execution seams.

## When to use

Use when opening a repo-execution thread that already has governed boundaries
and needs a consistent task prompt.

## Required inputs

- current baseline
- active motion
- allowed paths
- blocked paths
- acceptance criteria
- required gates

## Expected outputs

- a bounded repo-execution prompt starter

## Template

```md
You are operating in {repo} on branch {branch}.

Use settled canon through {motion}.

Task:
{bounded task}

Allowed paths:
- {path}

Blocked paths:
- {path}

Acceptance:
- {criterion}

Run gates:
- {command}
```

## Hard boundaries

- do not widen scope silently
- do not omit blocked surfaces

## Related canon

- motion-0173
- `.nexus/canon/workflow-role-taxonomy.yaml`

## Non-authority statement

This prompt template is reusable operating material only.
