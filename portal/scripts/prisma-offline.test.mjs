import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildPrismaEnv, resolvePrismaPaths } from "./prisma-offline.mjs";

const wrapper = fileURLToPath(new URL("./prisma-offline.mjs", import.meta.url));
const repoRoot = path.resolve(path.dirname(wrapper), "../..");

function temporaryDirectory(t) {
  const dir = mkdtempSync(path.join(tmpdir(), "prisma offline "));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function copyWrapper(t) {
  const script = path.join(temporaryDirectory(t), "portal", "scripts", "prisma-offline.mjs");
  mkdirSync(path.dirname(script), { recursive: true });
  copyFileSync(wrapper, script);
  return script;
}

function invoke(script, args, options = {}) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: "utf8", ...options });
  assert.ifError(result.error);
  return result;
}

test("only a single validate or generate argument reaches CLI lookup", (t) => {
  const script = copyWrapper(t);
  for (const args of [[], ["validate", "--schema", "other"], ["generate", "validate"],
    ...["migrate", "db", "push", "seed", "studio", "--help", "--version"].map(arg => [arg])]) {
    const result = invoke(script, args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /exactly one argument/);
  }
  for (const command of ["validate", "generate"]) {
    const result = invoke(script, [command]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Local Prisma CLI missing/);
  }
});

test("invokes the local CLI in the portal directory and forwards its exit status", (t) => {
  const script = copyWrapper(t);
  const { portalDir, prismaCliPath } = resolvePrismaPaths(script);
  mkdirSync(path.dirname(prismaCliPath), { recursive: true });
  writeFileSync(prismaCliPath, 'console.log(JSON.stringify([process.cwd(), ...process.argv.slice(2)])); process.exitCode = 37;');
  const result = invoke(script, ["generate"], { cwd: tmpdir() });
  assert.equal(result.status, 37, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), [portalDir, "generate"]);
});

test("child environment supplies placeholders and a sentinel without modifying its parent", () => {
  const parent = Object.freeze({ DATABASE_URL: "", PRISMA_SCHEMA_ENGINE_BINARY: "original" });
  const env = buildPrismaEnv(parent);
  assert.deepEqual(parent, { DATABASE_URL: "", PRISMA_SCHEMA_ENGINE_BINARY: "original" });
  assert.equal(env.PRISMA_SCHEMA_ENGINE_BINARY, wrapper);
  assert.equal(new URL(env.DATABASE_URL).hostname, "127.0.0.1");
  assert.equal(env.DIRECT_URL, env.DATABASE_URL);
  const supplied = { DATABASE_URL: "postgresql://localhost/a", DIRECT_URL: "postgresql://localhost/b" };
  const preserved = buildPrismaEnv(supplied);
  assert.equal(preserved.DATABASE_URL, supplied.DATABASE_URL);
  assert.equal(preserved.DIRECT_URL, supplied.DIRECT_URL);
  const before = { ...process.env };
  buildPrismaEnv(process.env);
  assert.deepEqual({ ...process.env }, before);
});

test("resolves portal and local CLI paths from POSIX and Windows script paths", () => {
  for (const [paths, root] of [[path.posix, "/opt/dev-jai-nexus"], [path.win32, "C:\\work\\dev-jai-nexus"]]) {
    const portal = paths.join(root, "portal");
    assert.deepEqual(resolvePrismaPaths(paths.join(portal, "scripts", "prisma-offline.mjs"), paths), {
      portalDir: portal,
      prismaCliPath: paths.join(portal, "node_modules", "prisma", "build", "index.js"),
    });
  }
});

test("real Prisma validates and generates from either cwd with an empty cache and closed proxy", (t) => {
  const dir = temporaryDirectory(t);
  const attempts = path.join(dir, "tcp-attempts");
  const preload = path.join(dir, "reject-tcp.cjs");
  // Include Node descendants. Record even attempts that Prisma catches or retries.
  writeFileSync(preload, `
    const { Socket } = require("node:net");
    const { appendFileSync } = require("node:fs");
    const connect = Socket.prototype.connect;
    Socket.prototype.connect = function (...args) {
      const [target] = Array.isArray(args[0]) ? args[0] : args;
      if (target?.path || (typeof target === "string" && !/^\\d+$/.test(target))) {
        return connect.apply(this, args); // Local IPC, including Windows named pipes
      }
      appendFileSync(${JSON.stringify(attempts)}, "TCP connection attempted\\n");
      throw new Error("Network disabled for offline Prisma test");
    };
  `);
  for (const cwd of [repoRoot, dir]) {
    for (const command of ["validate", "generate"]) {
      const cache = mkdtempSync(path.join(dir, "cache-"));
      const env = {
        ...process.env, XDG_CACHE_HOME: cache,
        HTTP_PROXY: "http://127.0.0.1:9", HTTPS_PROXY: "http://127.0.0.1:9", NO_PROXY: "",
        NODE_OPTIONS: `--require "${preload.replaceAll("\\", "/")}"`,
      };
      delete env.DATABASE_URL;
      delete env.DIRECT_URL;
      const result = invoke(wrapper, [command], { cwd, env });
      assert.equal(existsSync(attempts), false, `${command} attempted TCP from ${cwd}`);
      assert.equal(result.status, 0, result.stderr + result.stdout);
      assert.match(result.stdout + result.stderr, command === "validate" ? /schema.*is valid/i : /Generated Prisma Client/i);
    }
  }
});
