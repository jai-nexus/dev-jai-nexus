#!/usr/bin/env bash
# Requires: gh auth login
set -euo pipefail
org="jai-nexus"
out="data/github_issues.json"
jq='[.[] | {title:.title, repo:(.repository_url|split("/")[-1]), ref:("#"+( .number|tostring )), state:.state, triage:null, href:.html_url}]'
gh api -X GET "search/issues?q=org:${org}+state:open" --paginate --jq "$jq" > "$out"
echo "[ok] wrote $out"
