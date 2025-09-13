#!/usr/bin/env bash
set -euo pipefail
org="jai-nexus"
out="data/github_issues.json"
# Collate all pages into one JSON array
gh api -H 'Accept: application/vnd.github+json' \
  --paginate "/search/issues?q=org:${org}+state:open&per_page=100" \
  --jq '.items[] | {title:.title, repo:(.repository_url|split("/")[-1]), ref:("#"+(.number|tostring)), state:.state, triage:null, href:.html_url}' \
| jq -s '.' > "$out"
echo "[ok] wrote $out"
