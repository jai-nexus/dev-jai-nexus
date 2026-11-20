import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SOURCE_SCRIPT = fileURLToPath(new URL("./build-motion-snapshot.mjs", import.meta.url));
const PORTAL_DIR = path.resolve(path.dirname(SOURCE_SCRIPT), "..");

test("snapshot generation is checkout-mtime-independent and source-content-bound", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jai-motion-snapshot-"));
  const scriptsDir = path.join(root, "portal/scripts");
  const motionDir = path.join(root, ".nexus/motions/motion-0001");
  const snapshotPath = path.join(root, "portal/src/lib/motion/motionSnapshot.json");

  const run = (mode) =>
    spawnSync(process.execPath, [path.join(scriptsDir, "build-motion-snapshot.mjs"), mode], {
      cwd: root,
      encoding: "utf8",
    });

  try {
    await fs.mkdir(scriptsDir, { recursive: true });
    await fs.mkdir(motionDir, { recursive: true });
    await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
    await fs.copyFile(SOURCE_SCRIPT, path.join(scriptsDir, "build-motion-snapshot.mjs"));
    await fs.symlink(path.join(PORTAL_DIR, "node_modules"), path.join(root, "portal/node_modules"), "dir");

    await fs.writeFile(
      path.join(motionDir, "motion.yaml"),
      'motion_id: motion-0001\ntitle: "Original title"\nstatus: open\ncreated_at: "2026-11-19T01:00:00.000Z"\n',
    );
    await fs.writeFile(path.join(motionDir, "decision.yaml"), "status: DRAFT\n");
    await fs.writeFile(path.join(motionDir, "policy.yaml"), "eligible_to_vote: false\n");
    await fs.writeFile(path.join(motionDir, "verify.json"), '{"summary":{"required_ok":false}}\n');
    await fs.writeFile(path.join(motionDir, "vote.json"), '{"outcome":{"result":"NONE"}}\n');
    for (const name of ["execution.md", "proposal.md", "challenge.md"]) {
      await fs.writeFile(path.join(motionDir, name), `${name}\n`);
    }

    assert.equal(run("--write").status, 0);
    assert.equal(run("--check").status, 0);
    // Migrating a legacy snapshot must retain its historical entry timestamp.
    const legacy = JSON.parse(await fs.readFile(snapshotPath, "utf8"));
    legacy.entries[0].item.updated_at = "2026-07-16T01:15:44.102Z";
    delete legacy.source_hashes_sha256;
    await fs.writeFile(snapshotPath, `${JSON.stringify(legacy, null, 2)}\n`);
    assert.equal(run("--write").status, 0);
    const originalText = await fs.readFile(snapshotPath, "utf8");
    const original = JSON.parse(originalText);
    assert.equal(original.motion_count, 1);
    assert.equal(original.entries[0].item.updated_at, "2026-07-16T01:15:44.102Z");
    assert.match(original.source_hashes_sha256["motion-0001"], /^[a-f0-9]{64}$/);

    // Changing checkout metadata without changing bytes must never alter the snapshot.
    const historicFile = path.join(motionDir, "motion.yaml");
    await fs.utimes(historicFile, new Date("1990-01-01"), new Date("2030-01-01"));
    assert.equal(run("--check").status, 0);
    assert.equal(run("--write").status, 0);
    assert.equal(await fs.readFile(snapshotPath, "utf8"), originalText);

    // A content change, even if it occurs beyond the stored preview, fails closed.
    const longExecution = `${"A".repeat(7000)}\n`;
    await fs.writeFile(path.join(motionDir, "execution.md"), longExecution);
    assert.equal(run("--check").status, 1);
    assert.equal(run("--write").status, 0);
    assert.equal(run("--check").status, 0);
    await fs.writeFile(path.join(motionDir, "execution.md"), `${"A".repeat(7000)}B\n`);
    assert.equal(run("--check").status, 1);

    await fs.writeFile(path.join(motionDir, "motion.yaml"), 'motion_id: motion-0001\ntitle: "Changed title"\nstatus: open\ncreated_at: "2026-11-19T01:00:00.000Z"\n');
    assert.equal(run("--check").status, 1);

    // Missing and added motion directories are also an inventory drift.
    await fs.mkdir(path.join(root, ".nexus/motions/motion-0002"));
    assert.equal(run("--check").status, 1);
    await fs.rmdir(path.join(root, ".nexus/motions/motion-0002"));
    await fs.rm(motionDir, { recursive: true });
    assert.equal(run("--check").status, 1);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
