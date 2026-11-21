#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { require as loadTypeScript } from "tsx/cjs/api";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { buildCanonicalFleetSnapshot, inputPaths, snapshotPath } =
  loadTypeScript("../src/lib/controlPlane/fleetSnapshot/canonicalFleetSnapshot.ts", import.meta.url);

async function main(args) {
  if (args.length !== 1 || !["--write", "--check"].includes(args[0])) {
    throw new Error("Usage: node portal/scripts/export-canonical-fleet-snapshot.mjs --write | --check");
  }
  const git = (...args) => execFileSync("git", ["--no-replace-objects", ...args], { cwd: root });
  // Checkout line endings can differ across hosts. Check for edits, then hash the raw Git blobs.
  const head = git("rev-parse", "HEAD").toString().trim();
  git("diff", "--exit-code", "--quiet", head, "--", ...inputPaths);
  const inputs = Object.fromEntries(inputPaths.map(p => [p, git("cat-file", "blob", head + ":" + p)]));
  const snapshot = await buildCanonicalFleetSnapshot(inputs);
  const bytes = Buffer.from(JSON.stringify(snapshot, null, 2) + "\n");
  const target = path.join(root, snapshotPath);
  if (args[0] === "--write") {
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, bytes);
  } else {
    const tracked = git("ls-tree", "--name-only", head, "--", snapshotPath).length > 0;
    if (tracked && !git("cat-file", "blob", head + ":" + snapshotPath).equals(bytes))
      throw new Error("Committed snapshot bytes differ from the canonical export");
    const checkout = readFileSync(target);
    if (!checkout.equals(bytes) && !(tracked && checkout.equals(git("cat-file", "--filters", head + ":" + snapshotPath))))
      throw new Error("Snapshot checkout bytes differ from the canonical export");
  }
  console.log(args[0], snapshot.snapshot_digest, snapshotPath);
}
main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
