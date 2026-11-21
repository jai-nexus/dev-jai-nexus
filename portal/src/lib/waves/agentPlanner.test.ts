// Q4M11Y26-P2:A3-C regression tests for the wave planner USD 0.00 spend lock.
// The real route, internalAuth and planner are transpiled and run with fenced
// imports: any import not listed fails the test, and touching "openai" is
// counted and refused. Global fetch is trapped for the whole file.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { compileFunction } from "node:vm";
import ts from "typescript";

type Env = Record<string, string | undefined>;
type Imports = Record<string, unknown>;

const probes = { openaiImports: 0, fetchCalls: 0, plannerCalls: 0, bodyReads: 0 };
const realFetch = globalThis.fetch;
globalThis.fetch = (async () => {
  probes.fetchCalls++;
  throw new Error("network trapped by agentPlanner.test.ts");
}) as typeof fetch;
test.after(() => {
  globalThis.fetch = realFetch;
});

function load<T>(relative: string, imports: Imports, env: Env): T {
  const source = readFileSync(new URL(relative, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  compileFunction(outputText, ["exports", "require", "process"])(exports, (id: string) => {
    if (id === "openai") {
      probes.openaiImports++;
      throw new Error("OpenAI SDK import attempted");
    }
    assert.ok(Object.hasOwn(imports, id), `Unexpected import: ${id}`);
    return imports[id];
  }, { env });
  return exports as T;
}

type Planner = typeof import("./agentPlanner");
type Route = typeof import("../../app/api/internal/agents/plan-wave/route");

const nextServer = { NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) } };
const TOKEN = "test-internal-token";
const providerEnv: Env = {
  JAI_INTERNAL_API_TOKEN: TOKEN,
  OPENAI_API_KEY: "sk-test-fake-openai",
  JAI_PLANNER_MODEL: "gpt-test",
  JAI_LAYER2_AUTHORIZED_API_SPEND_USD: "500.00",
};
const input = { projectKey: "2.1", waveLabel: "W1.0", title: "Fixture wave", repoName: "jai-nexus/dev-jai-nexus" };

function loadPlanner(env: Env = providerEnv): Planner {
  return load<Planner>("./agentPlanner.ts", {}, env);
}

function loadRoute(env: Env, planner: Planner = loadPlanner(env)): Route {
  const internalAuth = load("../internalAuth.ts", {
    "next/server": nextServer,
    // internalAuth default-imports node:crypto; transpiled CJS reads .default.
    "node:crypto": { default: crypto },
  }, env);
  const spyPlanner = {
    ...planner,
    planWaveWithAgent: async (args: Parameters<Planner["planWaveWithAgent"]>[0]) => {
      probes.plannerCalls++;
      return planner.planWaveWithAgent(args);
    },
  };
  return load<Route>("../../app/api/internal/agents/plan-wave/route.ts", {
    "next/server": nextServer,
    "@/lib/internalAuth": internalAuth,
    "@/lib/waves/agentPlanner": spyPlanner,
  }, env);
}

async function post(route: Route, { headers = {}, body = input as unknown } = {}) {
  const request = new Request("http://local.test/api/internal/agents/plan-wave", { method: "POST", headers });
  request.json = async () => {
    probes.bodyReads++;
    return body;
  };
  const response = await route.POST(request as never);
  return { status: response.status, body: await response.json() };
}

function resetProbes() {
  for (const key of Object.keys(probes) as (keyof typeof probes)[]) probes[key] = 0;
}

test("(a) missing or invalid internal token fails closed before the body or planner is touched", async () => {
  resetProbes();
  const unconfigured = await post(loadRoute({ ...providerEnv, JAI_INTERNAL_API_TOKEN: undefined }), {
    headers: { authorization: `Bearer ${TOKEN}` },
  });
  assert.equal(unconfigured.status, 500);
  assert.equal(unconfigured.body.error, "Internal API token not configured");

  const route = loadRoute(providerEnv);
  for (const headers of [{}, { authorization: "Bearer wrong-token" }, { "x-jai-internal-token": "wrong-token" }, { authorization: "Basic abc" }]) {
    const denied = await post(route, { headers });
    assert.equal(denied.status, 401, JSON.stringify(headers));
    assert.equal(denied.body.error, "Unauthorized");
  }
  assert.deepEqual(probes, { openaiImports: 0, fetchCalls: 0, plannerCalls: 0, bodyReads: 0 });
});

test("(b) authorized calls with provider keys and a raised env ceiling return the offline stub with zero SDK or network use", async () => {
  resetProbes();
  const route = loadRoute(providerEnv);
  for (const headers of [{ authorization: `Bearer ${TOKEN}` }, { "x-jai-internal-token": TOKEN }]) {
    for (const body of [input, { ...input, providerMode: "offline_stub" }]) {
      const ok = await post(route, { headers, body });
      assert.equal(ok.status, 200, JSON.stringify(ok.body));
      assert.deepEqual(ok.body.generation, { source: "offline_stub", providerGenerated: false, layer2ApiSpendUsd: "0.00" });
      assert.match(ok.body.plan.notes, /not provider-generated/);
      assert.match(ok.body.plan.notes, /code-locked at USD 0\.00/);
      assert.deepEqual(ok.body.plan.tasks.map((task: { id: string }) => task.id), ["2.1.W1.0.1", "2.1.W1.0.2", "2.1.W1.0.3"]);
    }
  }
  assert.equal(probes.plannerCalls, 4);
  assert.equal(probes.openaiImports, 0);
  assert.equal(probes.fetchCalls, 0);
});

test("(b) a caller demanding live provider planning fails closed before the planner runs", async () => {
  resetProbes();
  const route = loadRoute(providerEnv);
  const live = await post(route, { headers: { authorization: `Bearer ${TOKEN}` }, body: { ...input, providerMode: "live_provider" } });
  assert.equal(live.status, 403);
  assert.equal(live.body.error, "provider_spend_not_authorized");
  assert.equal(live.body.layer2ApiSpendUsd, "0.00");
  for (const providerMode of ["openai", "", 1, null, { live: true }]) {
    const invalid = await post(route, { headers: { authorization: `Bearer ${TOKEN}` }, body: { ...input, providerMode } });
    assert.equal(invalid.status, providerMode === null ? 200 : 400, JSON.stringify(providerMode));
  }
  assert.equal(probes.plannerCalls, 1, "only the null providerMode (treated as default) reaches the planner");
  assert.equal(probes.openaiImports, 0);
  assert.equal(probes.fetchCalls, 0);
});

test("(c) planWaveWithAgent is independently protected and deterministic", async () => {
  resetProbes();
  const planner = loadPlanner(providerEnv);
  const first = await planner.planWaveWithAgent(input);
  const second = await planner.planWaveWithAgent({ ...input, providerMode: "offline_stub" });
  assert.deepEqual(first, second);
  assert.match(first.notes ?? "", /not provider-generated/);
  for (const providerMode of ["live_provider", "openai", ""] as never[]) {
    await assert.rejects(planner.planWaveWithAgent({ ...input, providerMode }), (error: Error & { code?: string }) => {
      assert.equal(error.name, "PlannerSpendLockError");
      assert.equal(error.code, "PROVIDER_SPEND_NOT_AUTHORIZED");
      return true;
    });
  }
  assert.equal(planner.PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD, "0.00");
  assert.deepEqual(probes, { openaiImports: 0, fetchCalls: 0, plannerCalls: 0, bodyReads: 0 });
});

test("the route maps a planner-level spend lock refusal to 403", async () => {
  resetProbes();
  const real = loadPlanner(providerEnv);
  const refusing = { ...real, planWaveWithAgent: async () => { throw new real.PlannerSpendLockError("offline_stub"); } };
  const refused = await post(loadRoute(providerEnv, refusing as Planner), { headers: { authorization: `Bearer ${TOKEN}` } });
  assert.equal(refused.status, 403);
  assert.equal(refused.body.error, "provider_spend_not_authorized");
});

test("planner source carries no provider SDK path; route order is token, body, spend lock, planner", () => {
  const planner = readFileSync(new URL("./agentPlanner.ts", import.meta.url), "utf8");
  for (const forbidden of [/from\s+["']openai["']/, /import\(\s*["']openai["']\s*\)/, /new\s+OpenAI\b/, /chat\.completions/, /\bfetch\(/, /process\.env/]) {
    assert.doesNotMatch(planner, forbidden);
  }
  const route = readFileSync(new URL("../../app/api/internal/agents/plan-wave/route.ts", import.meta.url), "utf8");
  const order = ["assertInternalToken(req)", "await req.json()", 'providerMode === "live_provider"', "await planWaveWithAgent("];
  for (let i = 1; i < order.length; i++) assert.ok(route.indexOf(order[i - 1]) < route.indexOf(order[i]), `${order[i - 1]} before ${order[i]}`);
  assert.doesNotMatch(route, /openai/i);
});
