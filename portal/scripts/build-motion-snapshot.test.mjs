import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "./build-motion-snapshot.mjs";

const source = fileURLToPath(new URL("../../", import.meta.url));
const baseline = "2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8";

test("historical snapshot from a fresh depth-one checkout", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jai-motion-snapshot-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  function git(...args) {
    return execFileSync("git", ["-c", "core.autocrlf=false", ...args], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  }
  git("init", "--quiet");
  git("fetch", "--quiet", "--depth=1", source, baseline);
  git("checkout", "--quiet", "--detach", "FETCH_HEAD");
  assert.equal(git("rev-parse", "--is-shallow-repository"), "true");
  const snapshot = path.join(root, "portal/src/lib/motion/motionSnapshot.json");
  const initial = fs.readFileSync(snapshot);
  const motions = path.join(root, ".nexus/motions");
  const motion = path.join(motions, "motion-0248");
  const check = () => run(root, ["--check"]);

  await t.test("all 247 recorded entries and normal check", async () => {
    assert.equal(JSON.parse(initial).entries.length, 247);
    await check();
  });
  await t.test("checkout timestamps are immaterial", async () => {
    fs.utimesSync(path.join(motion, "motion.yaml"), 900000000, 900000000);
    await check();
  });
  await t.test("fresh-checkout-like timestamp variation and external scope", async () => {
    let seconds = 1700000000;
    for (const entry of fs.readdirSync(motions, { recursive: true, withFileTypes: true })) {
      fs.utimesSync(path.join(entry.parentPath, entry.name), seconds, seconds++);
    }
    fs.mkdirSync(path.join(root, ".nexus/amendments/corpus-v1/motion-0248"), { recursive: true });
    fs.writeFileSync(path.join(root, ".nexus/amendments/corpus-v1/motion-0248/fixture.yaml"), "fixture: true\n");
    await check();
  });
  await t.test("payload changes beyond the preview fail closed", async () => {
    const file = path.join(motion, "proposal.md");
    const previous = fs.readFileSync(file);
    try {
      fs.appendFileSync(file, "\nchanged beyond snapshot preview\n");
      await assert.rejects(check, /Historical Motion content drift/);
    } finally { fs.writeFileSync(file, previous); }
  });
  await t.test("missing historical Motion", async () => {
    const parked = path.join(root, "fixture-motion");
    fs.renameSync(motion, parked);
    try { await assert.rejects(check, /ENOENT|missing/i); }
    finally { fs.renameSync(parked, motion); }
  });
  await t.test("unexpected Motion", async () => {
    const extra = path.join(motions, "motion-9999");
    fs.mkdirSync(extra);
    try { await assert.rejects(check, /snapshot differs/); }
    finally { fs.rmdirSync(extra); }
  });
  await t.test("forged recorded timestamp fails, even below the newest timestamp", async () => {
    const forged = JSON.parse(initial);
    forged.entries.at(-1).item.updated_at = "1970-01-01T00:00:00.000Z";
    fs.writeFileSync(snapshot, JSON.stringify(forged, null, 2) + "\n");
    try { await assert.rejects(check, /snapshot differs/); }
    finally { fs.writeFileSync(snapshot, initial); }
  });
  await t.test("repeat generation preserves historical bytes", async () => {
    await check();
    await run(root, ["--write"]);
    assert.deepEqual(fs.readFileSync(snapshot), initial);
    await check();
  });
});
