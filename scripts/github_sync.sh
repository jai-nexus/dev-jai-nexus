#!/usr/bin/env bash
set -euo pipefail
org="jai-nexus"
out="data/github_issues.json"
gh api -X GET "search/issues" \
  -f q="org:${org} state:open" -f per_page=100 --paginate \
  --jq '.items[] | {title:.title, repo:(.repository_url|split("/")[-1]), ref:("#"+( .number|tostring )), state:.state, triage:null, href:.html_url}' \
  | jq -s '.' > "$out"
echo "[ok] wrote $out"
