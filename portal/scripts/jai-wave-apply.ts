#!/usr/bin/env tsx

// Placeholder CLI – will eventually fetch the planned tasks for a wave
// and apply them as code changes / PRs.

async function main() {
  const [waveNhId] = process.argv.slice(2);

  if (!waveNhId) {
    console.error("Usage: npm run jai:wave:apply -- <waveNhId>");
    process.exit(1);
  }

  console.log(
    `jai-wave-apply is not wired yet. Intended to apply plan for wave ${waveNhId}.`,
  );

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
