#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sync selected sections from multiple repos into dev.jai.nexus/data/*.json

- Clones/updates source repos into .cache/sources/<org>__<repo>
- Gathers files by glob patterns
- Parses markdown titles + optional "Triage: <Color>" hints
- Emits normalized JSON arrays to data/<section>.json
- Honors SoT v1.1 triage enum: Blue|Green|Yellow|Orange|Red (default Blue)
"""
import os, sys, json, re, shutil, subprocess, hashlib, glob, pathlib
from pathlib import Path
try:
    import yaml
except Exception:
    yaml = None

ALLOWED_TRIAGE = {"Blue","Green","Yellow","Orange","Red"}  # SoT v1.1
RE_GH = re.compile(r"^[\w\-]+/[\w.\-]+$")
RE_FRONT = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)

def sh(cmd, cwd=None, check=True):
    r = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)
    if check and r.returncode != 0:
        print(r.stdout); print(r.stderr, file=sys.stderr)
        raise SystemExit(f"Command failed: {' '.join(cmd)}")
    return r.stdout.strip()

def ensure_clone(repo:str, ref:str, dest:Path, depth:int=1, use_ssh=True):
    if not RE_GH.match(repo):
        raise SystemExit(f"Bad repo slug: {repo}")
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        url = f"git@github.com:{repo}.git" if use_ssh else f"https://github.com/{repo}.git"
        sh(["git","clone","--depth",str(depth), "--no-tags", url, dest.name], cwd=dest.parent)
    # fetch & checkout
    sh(["git","fetch","origin", ref, "--depth", str(depth)], cwd=dest)
    sh(["git","checkout","-qf", ref], cwd=dest)
    sha = sh(["git","rev-parse","HEAD"], cwd=dest)
    return sha

def read_text(p:Path, max_bytes=1<<20):
    with p.open("rb") as f:
        data = f.read(max_bytes)
    return data.decode("utf-8", errors="replace")

def parse_meta_md(text:str):
    meta = {"title":None, "summary":None, "triage":None}
    # YAML front-matter?
    if yaml is not None:
        m = RE_FRONT.match(text)
        if m:
            try:
                fm = yaml.safe_load(m.group(1)) or {}
                meta["title"] = fm.get("title") or meta["title"]
                tri = fm.get("triage")
                if isinstance(tri, str): meta["triage"] = tri.strip()
                meta["summary"] = fm.get("summary") or meta["summary"]
            except Exception:
                pass
            text_ = text[m.end():]
        else:
            text_ = text
    else:
        text_ = text
    # First H1
    m = re.search(r"(?m)^\s*#\s+(.+?)\s*$", text_)
    if m and not meta["title"]:
        meta["title"] = m.group(1).strip()
    # Triage: <Color>
    m = re.search(r"(?mi)^triage:\s*(Blue|Green|Yellow|Orange|Red)\s*$", text)
    if m and not meta["triage"]:
        meta["triage"] = m.group(1).strip()
    # Summary: first non-empty line that's not a heading
    for line in text_.splitlines():
        if line.strip() and not line.lstrip().startswith("#"):
            meta["summary"] = (line.strip()[:240] + ("…" if len(line.strip())>240 else ""))
            break
    return meta

def normalize_triage(value:str):
    if not value: return "Blue"
    v = value.strip().capitalize()
    return v if v in ALLOWED_TRIAGE else "Blue"

def make_item(repo:str, ref:str, root:Path, fp:Path, sha:str):
    text = read_text(fp)
    meta = parse_meta_md(text) if fp.suffix.lower() in (".md",".mdx") else {"title":fp.name, "summary":None, "triage":None}
    tri = normalize_triage(meta.get("triage"))
    rel = fp.relative_to(root).as_posix()
    href = f"https://github.com/{repo}/blob/{ref}/{rel}"
    return {
        "title": meta.get("title") or fp.stem,
        "summary": meta.get("summary"),
        "triage": tri,
        "repo": repo,
        "ref": ref,
        "sha": sha,
        "path": rel,
        "href": href
    }

def load_yaml(path:Path):
    if not path.exists():
        raise SystemExit(f"Missing config: {path}")
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) if yaml else json.loads(json.dumps({}))

def main():
    here = Path(__file__).resolve().parent.parent
    cfgp = here / "sections.yaml"
    cfg = load_yaml(cfgp)
    root = (here / cfg.get("root",".")).resolve()
    cache = (here / cfg.get("sources_root",".cache/sources")).resolve()
    depth = int(cfg.get("git",{}).get("depth",1))
    use_ssh = bool(cfg.get("git",{}).get("ssh",True)) and (os.environ.get("GIT_SSH","1") != "0")

    os.makedirs(root / "data", exist_ok=True)
    results = {}
    for sec in cfg.get("sections", []):
        sid, repo, ref = sec["id"], sec["repo"], sec.get("ref","main")
        include = sec.get("include", ["**/*"])
        dest = root / sec.get("dest", f"data/{sid}.json")
        # clone/update
        safe = repo.replace("/","__")
        repopath = cache / safe
        sha = ensure_clone(repo, ref, repopath, depth=depth, use_ssh=use_ssh)
        # collect
        items = []
        for pat in include:
            for path in repopath.glob(pat.replace("**/","**/")):
                if path.is_file():
                    items.append(make_item(repo, ref, repopath, path, sha))
        items.sort(key=lambda x: (x["triage"], x["title"].lower()))
        dest.parent.mkdir(parents=True, exist_ok=True)
        with dest.open("w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
        results[sid] = {"count": len(items), "dest": str(dest)}
        print(f"[ok] {sid}: {len(items)} → {dest}")

    # Optional nexus.json summary
    nx = {
        "generated_at": __import__("datetime").datetime.utcnow().isoformat()+"Z",
        "sections": results
    }
    with (root/"data"/"nexus.json").open("w", encoding="utf-8") as f:
        json.dump(nx, f, ensure_ascii=False, indent=2)
    print("[ok] wrote data/nexus.json")

if __name__ == "__main__":
    main()
