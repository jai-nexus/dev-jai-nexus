.PHONY: sync sync-sections sync-sourcetree sync-github sync-notion sync-sot serve clean
sync: sync-sections
sync-sections: ; @python3 scripts/sync_sections.py
sync-sourcetree: ; @bash scripts/sourcetree_bundle.sh
sync-github: ; @bash scripts/github_sync.sh
sync-notion: ; @node scripts/notion_sync.mjs
sync-sot: ; @python3 scripts/sot_export.py
serve: ; @python3 -m http.server 8080
clean: ; @rm -rf .cache/sources .cache/sourcetree
