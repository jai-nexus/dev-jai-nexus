#!/usr/bin/env bash
set -euo pipefail
mkdir -p .cache/sourcetree data
roots=( "../jai-nexus" "../public-nexus" "../wiki-nexus" )
for r in "${roots[@]}"; do
  name="$(basename "$r")"
  python - "$r" <<'PY' > ".cache/sourcetree/OUT.json"
import sys, json, os, hashlib
from pathlib import Path

root = Path(sys.argv[1]).resolve()
EXCL = {'.git','.venv','node_modules','.next','.cache','.DS_Store'}

def listdir_sorted(p):
    try: names=[n for n in os.listdir(p) if n not in EXCL]
    except FileNotFoundError: names=[]
    paths=[p/ n for n in names]
    dirs = sorted([x for x in paths if x.is_dir()], key=lambda z:z.name.casefold())
    files= sorted([x for x in paths if x.is_file()], key=lambda z:z.name.casefold())
    return dirs+files

def sha12(p):
    if p.is_dir(): return ""
    h=hashlib.sha1()
    with open(p,'rb') as f:
        for b in iter(lambda:f.read(8192), b''): h.update(b)
    return h.hexdigest()[:12]

items=[]
def walk(p, idx=()):
    kids=listdir_sorted(p)
    for i, ch in enumerate(kids, 1):
        nh = idx+(i,)
        items.append({
            "nh":".".join(map(str,nh)),
            "path": ch.relative_to(root).as_posix()+("/" if ch.is_dir() else ""),
            "type": "dir" if ch.is_dir() else "file",
            "sha12": "" if ch.is_dir() else sha12(ch)
        })
        if ch.is_dir(): walk(ch, nh)

walk(root)
print(json.dumps({"root": str(root), "items": items}, indent=2))
PY
  mv .cache/sourcetree/OUT.json ".cache/sourcetree/${name}.json" || true
done

python - <<'PY' > data/sourcetree.bundle.json
import json,glob
items=[]
for path in sorted(glob.glob(".cache/sourcetree/*.json")):
    with open(path) as f:
        data=json.load(f)
        repo = data.get("root","").split("/")[-1] or path
        for it in data.get("items",[]):
            it["repo"]=repo
            items.append(it)
print(json.dumps({"items":items}, indent=2))
PY

echo "[ok] wrote data/sourcetree.bundle.json"
