# Challenge: Dry-Run Plan Visibility Boundary v0

## Challenge

Showing dry-run plan fields or evidence record language in the control plane
could be misread as live orchestration visibility or as proof that execution is
near authorization.

## Response

The boundary remains explicit:

- static/example metadata only
- no live ingestion
- no polling or watchers
- evidence proves generation/validation only
- execution remains denied
- scheduler and runner authority remain denied
