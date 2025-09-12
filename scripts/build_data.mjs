// Build data/nexus.json and the split files (tasks/agents/contexts)
// In CI we will run this after aggregation.
// If data/nexus.json already exists, we normalize it; otherwise we bootstrap.

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

const ensure = async p => { if (!existsSync(p)) await mkdir(p, { recursive: true }); };

async function main() {
  await ensure("data");

  let nexus;
  if (existsSync("out/nexus.json")) {
    nexus = JSON.parse(await readFile("out/nexus.json", "utf8"));
  } else if (existsSync("data/nexus.json")) {
    nexus = JSON.parse(await readFile("data/nexus.json", "utf8"));
    nexus.meta = nexus.meta || {};
    nexus.meta.generatedAt = new Date().toISOString();
  } else {
    nexus = {
      meta: { generatedAt: new Date().toISOString(), version: "1.0.0" },
      totals: { open: 0, done: 0, xp: 0 },
      tasks: [], agents: [], contexts: []
    };
  }

  // Derive totals if missing
  if (!nexus.totals) {
    const open = (nexus.tasks || []).filter(t => (t.status||"open") !== "done").length;
    const done = (nexus.tasks || []).filter(t => (t.status||"") === "done").length;
    nexus.totals = { open, done, xp: (nexus.tasks||[]).reduce((s,t)=>s+(t.points||0),0) };
  }

  // Write unified
  await writeFile("data/nexus.json", JSON.stringify(nexus, null, 2));

  // Back-compat split files
  await writeFile("data/tasks.json", JSON.stringify({ generatedAt: nexus.meta.generatedAt, totals: nexus.totals, tasks: nexus.tasks }, null, 2));
  await writeFile("data/agents.json", JSON.stringify({ generatedAt: nexus.meta.generatedAt, agents: nexus.agents }, null, 2));
  await writeFile("data/contexts.json", JSON.stringify({ generatedAt: nexus.meta.generatedAt, contexts: nexus.contexts }, null, 2));

  console.log("✅ Wrote data/nexus.json + split files");
}
main().catch(e => { console.error(e); process.exit(1); });
