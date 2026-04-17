# Pi Syncd Operations

## Purpose

`jai-nexus-syncd` is a mirror-only Pi service for JAI NEXUS.

It reads governance/state files from the repo checkout at:

- `/home/jerryingram/dev/jai-nexus`

and mirrors matching files into persistent Pi-local storage inside the container volume at:

- `/data`
- `/data/mirror`

It must remain separate from the preserved legacy `edge` runtime.

## Source of truth

Repo source:

- `/home/jerryingram/dev/jai-nexus/infra/pi-syncd`

Live runtime path:

- `/home/jerryingram/jai-nexus-runtime/syncd`

Before rebuilding or redeploying, sync runtime files from repo source into the runtime path.

## Watched inputs

The daemon currently mirrors these repo paths/files:

- `.nexus/`
- `motions/`
- `handoffs/`
- `motion.yaml`
- `execution.handoff.json`
- `grid-config.yaml`
- `grid-config.yml`

## Current verified state

- container name: `jai-nexus-syncd`
- image: `syncd-syncd`
- restart policy: `unless-stopped`
- published ports: none

## Deploy / update

```bash
ssh jerryingram@jai-nexus-pi4 '
rsync -a --delete /home/jerryingram/dev/jai-nexus/infra/pi-syncd/ /home/jerryingram/jai-nexus-runtime/syncd/ &&
cd /home/jerryingram/jai-nexus-runtime/syncd &&
docker compose up -d --build
'
