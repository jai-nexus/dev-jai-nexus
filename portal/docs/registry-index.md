# Agent Registry Indexing & Coverage

The Agent Registry is the source of truth for all repos, domains, and agents in the JAI NEXUS org. This portal integration provides a consolidated view of that registry and its health.

## Registry Source
The registry indexes are generated in the `nexus-core` repository.
Location: `workspace/jai-nexus/nexus-core/registry/*.index.json`

## Setup & Maintenance
1. **Regenerate Indexes**: If the registry in `nexus-core` changes, you must regenerate the indexes:
   ```bash
   cd workspace/jai-nexus/nexus-core
   pnpm registry:generate
   ```
2. **Health Snapshots**: The portal reads health status from `portal/data/runs/health.snapshots.jsonl`. This file is updated by the health monitoring scripts.

## Portal Integration
- **Internal API**: `/api/internal/registry/index` (Machine token auth)
- **Operator API**: `/api/operator/registry/index` (Session auth)
- **Operator Page**: `/operator/registry/coverage`

## Troubleshooting
- **503 Registry Unavailable**: Ensure the index files exist in the `nexus-core/registry` folder. 
- **Missing Agents**: Verify that `agents.index.json` correctly maps agents to the repo.
