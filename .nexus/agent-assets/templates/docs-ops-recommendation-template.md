# Docs Ops Recommendation Template

## Purpose

Provide a reusable recommendation-only template for Level 0 and Level 1 docs-ops
work.

## When to use

Use when docs-ops output must remain read/recommend only and cannot drift into
patch plans or repo mutation.

## Required inputs

- curated docs context
- relevant motions
- curation posture
- provenance references

## Expected outputs

- recommendation text
- curation notes
- relevance observations
- non-mutating docs update proposals

## Template

```md
## Context summary

## Curation notes

## Relevance observations

## Recommendations

## Recommendations-only docs update proposals

## Guardrails
```

## Hard boundaries

- no patch plans
- no PR drafts
- no docs-nexus mutation

## Related canon

- motions 0174 and 0175
- `.nexus/canon/docs-ops-level-0-1-dry-run.yaml`

## Non-authority statement

This template does not authorize Level 2 or higher behavior.
