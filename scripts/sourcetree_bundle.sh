#!/usr/bin/env bash
set -euo pipefail
out="data/sourcetree.bundle.json"
tmp="$(mktemp)"
# generate JSON (dirs-first, 2-space indent, trailing slashes), then merge
python -m jai_encode.sourcetree ../jai-nexus       --json --include-sha > .cache/sourcetree/jai-nexus.json || true
python -m jai_encode.sourcetree ../public-nexus    --json --include-sha > .cache/sourcetree/public-nexus.json || true
python -m jai_encode.sourcetree ../wiki-nexus      --json --include-sha > .cache/sourcetree/wiki-nexus.json || true

# Flatten into one bundle (preserves items arrays; tags root names)
python - <<'PY' > "$tmp"
import json,sys,glob
items=[]
for path in glob.glob(".cache/sourcetree/*.json"):
    with open(path) as f:
        data=json.load(f)
        root=data.get("root") or path
        for it in data.get("items",[]):
            it["repo"] = root.rsplit('/',1)[-1]
            items.append(it)
print(json.dumps({"items": items}, indent=2))
PY

mkdir -p data
mv "$tmp" "$out"
echo "[ok] wrote $out"
