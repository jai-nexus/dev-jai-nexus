.PHONY: sync serve clean
sync: ; @python3 scripts/sync_sections.py
serve: ; @python3 -m http.server 8080
clean: ; @rm -rf .cache/sources
