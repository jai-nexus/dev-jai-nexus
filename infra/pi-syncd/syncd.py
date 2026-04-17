import json
import os
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path

SOURCE_ROOT = Path(os.environ.get("SOURCE_ROOT", "/repo"))
DATA_ROOT = Path(os.environ.get("DATA_ROOT", "/data"))
MIRROR_ROOT = DATA_ROOT / "mirror"
INTERVAL_SEC = int(os.environ.get("INTERVAL_SEC", "60"))

MATCH_FILES = {
    "motion.yaml",
    "execution.handoff.json",
    "grid-config.yaml",
    "grid-config.yml",
}
MATCH_DIRS = {
    ".nexus",
    "motions",
    "handoffs",
}

def should_copy(rel: Path) -> bool:
    parts = set(rel.parts)
    if any(part == ".git" for part in rel.parts):
        return False
    if rel.name in MATCH_FILES:
        return True
    if parts & MATCH_DIRS:
        return True
    return False

def safe_copy(src: Path, dst: Path):
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)

def run_once():
    MIRROR_ROOT.mkdir(parents=True, exist_ok=True)
    copied = []
    missing_source = not SOURCE_ROOT.exists()

    if not missing_source:
        for path in SOURCE_ROOT.rglob("*"):
            if path.is_file():
                rel = path.relative_to(SOURCE_ROOT)
                if should_copy(rel):
                    out = MIRROR_ROOT / rel
                    safe_copy(path, out)
                    copied.append(str(rel))

    manifest = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "source_root": str(SOURCE_ROOT),
        "source_exists": SOURCE_ROOT.exists(),
        "mirror_root": str(MIRROR_ROOT),
        "copied_count": len(copied),
        "copied_files": sorted(copied),
    }

    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    with open(DATA_ROOT / "latest_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(json.dumps({
        "event": "sync_complete",
        "source_exists": not missing_source,
        "copied_count": len(copied),
        "timestamp_utc": manifest["timestamp_utc"],
    }), flush=True)

def main():
    while True:
        try:
            run_once()
        except Exception as e:
            print(json.dumps({
                "event": "sync_error",
                "error": str(e),
                "timestamp_utc": datetime.now(timezone.utc).isoformat(),
            }), flush=True)
        time.sleep(INTERVAL_SEC)

if __name__ == "__main__":
    main()
