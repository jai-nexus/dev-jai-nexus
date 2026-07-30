import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { encode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

import { createProgramActivationAuthorityHandler } from "./program-activation-authority-handler";

const SYNTHETIC_SECRET = "synthetic-c5-jwt-secret-with-no-production-authority";
const ADMIN_EMAIL = "admin@example.com";
const routeUrl =
  "http://local.test/api/operator/program-lifecycle/activation-authority";
const candidateProgramId = "synthetic-c5-program-candidate";
const otherProgramId = "synthetic-c5-program-other";

type SyntheticC4Input = {
  candidateProgramId: string;
  portfolio: Array<{ programId: string; lifecycleState: string }>;
  governingMotions: Array<{
    motionId: string;
    subjectProgramId: string;
    ratificationState: string;
    decisionState: string;
    mainAcceptanceState: string;
    freshnessState: string;
  }>;
  receipts: Array<{
    receiptType: string;
    receiptInstanceId: string;
    subjectProgramId: string;
    issuanceState: string;
    integrityState: string;
    authenticityState: string;
    issuerAuthorityState: string;
    freshnessState: string;
  }>;
};

type SyntheticAuthentication =
  | { authenticated: false }
  | { authenticated: true; role: unknown; email: unknown };

function eligibleInput(): SyntheticC4Input {
  return {
    candidateProgramId,
    portfolio: [
      {
        programId: candidateProgramId,
        lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
      },
      { programId: otherProgramId, lifecycleState: "CLOSED_ACCEPTED" },
    ],
    governingMotions: [
      {
        motionId: "synthetic-c5-governing-motion",
        subjectProgramId: candidateProgramId,
        ratificationState: "RATIFIED",
        decisionState: "PASS",
        mainAcceptanceState: "ACCEPTED_ON_MAIN",
        freshnessState: "CURRENT",
      },
    ],
    receipts: [
      {
        receiptType: "MAIN_STATE_RECEIPT",
        receiptInstanceId: "synthetic-c5-main-state-receipt",
        subjectProgramId: candidateProgramId,
        issuanceState: "ISSUED",
        integrityState: "VERIFIED",
        authenticityState: "VERIFIED",
        issuerAuthorityState: "ESTABLISHED",
        freshnessState: "CURRENT",
      },
      {
        receiptType: "PROGRAM_OPENING_RECEIPT",
        receiptInstanceId: "synthetic-c5-program-opening-receipt",
        subjectProgramId: candidateProgramId,
        issuanceState: "ISSUED",
        integrityState: "VERIFIED",
        authenticityState: "VERIFIED",
        issuerAuthorityState: "ESTABLISHED",
        freshnessState: "CURRENT",
      },
    ],
  };
}

function ineligibleInput(): SyntheticC4Input {
  const input = eligibleInput();
  input.portfolio[0].lifecycleState = "UNRESOLVED_HOLD";
  return input;
}

function trackedRequest(body: unknown, throws = false) {
  let readCount = 0;
  return {
    request: {
      async json() {
        readCount += 1;
        if (throws) {
          throw new Error("synthetic body parser failure");
        }
        return body;
      },
    } as Request,
    readCount: () => readCount,
  };
}

async function readResponse(response: Response) {
  return { status: response.status, body: await response.json() as unknown };
}

function errorBody(body: unknown) {
  assert.equal(typeof body, "object");
  assert.notEqual(body, null);
  return body as {
    ok: false;
    error: { code: string; message: string };
    activationAuthorized: false;
    activationPerformed: false;
  };
}

function successBody(body: unknown) {
  assert.equal(typeof body, "object");
  assert.notEqual(body, null);
  return body as {
    ok: true;
    kind: string;
    requestAuthorizationClassification: string;
    actor: string;
    role: string;
    eligibility: { kind: string; reasonCodes: string[] };
    activationAuthorized: false;
    activationPerformed: false;
  };
}

async function expectError(
  response: Response,
  status: number,
  code: string,
) {
  const parsed = await readResponse(response);
  assert.equal(parsed.status, status);
  const body = errorBody(parsed.body);
  assert.equal(body.ok, false);
  assert.equal(body.error.code, code);
  assert.equal(body.activationAuthorized, false);
  assert.equal(body.activationPerformed, false);
  return body;
}

function createHandler(
  options: {
    secret?: unknown;
    authentication?: SyntheticAuthentication;
    authenticate?: (request: Request, secret: string) => Promise<SyntheticAuthentication>;
  } = {},
) {
  return createProgramActivationAuthorityHandler({
    readSecret: () =>
      Object.hasOwn(options, "secret") ? options.secret : SYNTHETIC_SECRET,
    authenticate: options.authenticate ?? (async () =>
      options.authentication ?? {
        authenticated: true,
        role: "ADMIN",
        email: ADMIN_EMAIL,
      }),
  });
}

async function testSecretBoundaryAsync() {
  for (const secret of [undefined, 7, "", " \t\n"] as const) {
    let authenticateCalls = 0;
    const request = trackedRequest(eligibleInput());
    const handler = createHandler({
      secret,
      authenticate: async () => {
        authenticateCalls += 1;
        return { authenticated: true, role: "ADMIN", email: ADMIN_EMAIL };
      },
    });
    const body = await expectError(
      await handler(request.request),
      503,
      "SERVER_SECRET_UNAVAILABLE",
    );
    assert.equal(authenticateCalls, 0);
    assert.equal(request.readCount(), 0);
    assert.equal(body.error.message.includes("synthetic"), false);
  }
}

async function testAuthenticationBoundary() {
  for (const authentication of [
    { authenticated: false } as const,
    { authenticated: false } as const,
  ]) {
    const request = trackedRequest({ rejected: "synthetic-body-value" });
    const handler = createHandler({ authentication });
    const body = await expectError(
      await handler(request.request),
      401,
      "UNAUTHENTICATED",
    );
    assert.equal(request.readCount(), 0);
    assert.equal(JSON.stringify(body).includes("synthetic-body-value"), false);
  }

  const request = trackedRequest({ rejected: "synthetic-body-value" });
  const handler = createHandler({
    authenticate: async () => {
      throw new Error("synthetic authentication detail");
    },
  });
  const body = await expectError(
    await handler(request.request),
    401,
    "UNAUTHENTICATED",
  );
  assert.equal(request.readCount(), 0);
  assert.equal(JSON.stringify(body).includes("authentication detail"), false);
}

async function testRoleBoundary() {
  for (const role of ["AGENT", "admin", "", undefined, "UNKNOWN", 7] as const) {
    const request = trackedRequest({ role: "ADMIN" });
    const handler = createHandler({
      authentication: { authenticated: true, role, email: ADMIN_EMAIL },
    });
    await expectError(await handler(request.request), 403, "ADMIN_REQUIRED");
    assert.equal(request.readCount(), 0);
  }
}

async function testActorBoundary() {
  const tooLongActor = `${"a".repeat(309)}@example.com`;
  for (const email of [
    undefined,
    null,
    7,
    "",
    " \t\n",
    "not-an-email",
    "@example.com",
    "admin@",
    "admin@@example.com",
    "admin @example.com",
    "admin\t@example.com",
    "admin\r@example.com",
    "admin\n@example.com",
    "admin\u0000@example.com",
    tooLongActor,
  ] as const) {
    const request = trackedRequest(eligibleInput());
    const handler = createHandler({
      authentication: { authenticated: true, role: "ADMIN", email },
    });
    await expectError(await handler(request.request), 403, "ACTOR_EMAIL_REQUIRED");
    assert.equal(request.readCount(), 0);
  }

  const request = trackedRequest(eligibleInput());
  const response = await readResponse(
    await createHandler({
      authentication: {
        authenticated: true,
        role: "ADMIN",
        email: "  ADMIN@EXAMPLE.COM  ",
      },
    })(request.request),
  );
  assert.equal(response.status, 200);
  assert.equal(successBody(response.body).actor, ADMIN_EMAIL);
}

async function testRequestBoundaryAndSpoofResistance() {
  const handler = createHandler();
  const malformed = trackedRequest(undefined, true);
  const malformedBody = await expectError(
    await handler(malformed.request),
    400,
    "INVALID_JSON",
  );
  assert.equal(malformed.readCount(), 1);
  assert.equal(JSON.stringify(malformedBody).includes("parser failure"), false);

  for (const body of [
    7,
    [],
    {
      candidateProgramId,
      portfolio: eligibleInput().portfolio,
      governingMotions: eligibleInput().governingMotions,
    },
    { ...eligibleInput(), unexpected: true },
    { ...eligibleInput(), candidateProgramId: " \t" },
  ]) {
    await expectError(await handler(trackedRequest(body).request), 400, "INVALID_REQUEST");
  }

  let accessorRead = false;
  const accessorBody = Object.defineProperties({}, {
    candidateProgramId: {
      enumerable: true,
      get() {
        accessorRead = true;
        return candidateProgramId;
      },
    },
    portfolio: { enumerable: true, value: eligibleInput().portfolio },
    governingMotions: { enumerable: true, value: eligibleInput().governingMotions },
    receipts: { enumerable: true, value: eligibleInput().receipts },
  });
  await expectError(
    await handler(trackedRequest(accessorBody).request),
    400,
    "INVALID_REQUEST",
  );
  assert.equal(accessorRead, false);

  const symbolBody = Object.assign(eligibleInput(), {
    [Symbol("synthetic-c5-authority")]: true,
  });
  await expectError(
    await handler(trackedRequest(symbolBody).request),
    400,
    "INVALID_REQUEST",
  );

  for (const field of [
    "actor",
    "role",
    "authority",
    "authorization",
    "authenticated",
    "session",
    "token",
    "email",
    "user",
    "activationAuthorized",
    "activationPerformed",
    "transitionPerformed",
  ]) {
    const body = { ...eligibleInput(), [field]: "synthetic-client-authority" };
    const response = await readResponse(await handler(trackedRequest(body).request));
    assert.equal(response.status, 400);
    assert.equal(errorBody(response.body).error.code, "INVALID_REQUEST");
    assert.equal(JSON.stringify(response.body).includes("synthetic-client-authority"), false);
  }

  const nestedSpoof = eligibleInput();
  Object.assign(nestedSpoof.portfolio[0], { authority: "synthetic-client-authority" });
  await expectError(
    await handler(trackedRequest(nestedSpoof).request),
    400,
    "INVALID_REQUEST",
  );
}

async function testSuccessfulAdminResultsAndIsolation() {
  const input = eligibleInput();
  const before = structuredClone(input);
  const request = trackedRequest(input);
  const handler = createHandler();
  const first = await readResponse(await handler(request.request));
  assert.equal(first.status, 200);
  const firstBody = successBody(first.body);
  assert.deepEqual(firstBody, {
    ok: true,
    kind: "AUTHORIZED_ADMIN_REQUEST",
    requestAuthorizationClassification: "SERVER_DERIVED_ADMIN",
    actor: ADMIN_EMAIL,
    role: "ADMIN",
    eligibility: {
      kind: "ELIGIBLE",
      eligible: true,
      classificationOnly: true,
      reasonCodes: ["ALL_PREREQUISITES_SATISFIED"],
      transitionId: "B1-TR-027",
      activationAuthorized: false,
      activationPerformed: false,
    },
    activationAuthorized: false,
    activationPerformed: false,
  });
  assert.equal(request.readCount(), 1);
  assert.deepEqual(input, before);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(input.portfolio), false);
  assert.equal(Object.isFrozen(input.governingMotions), false);
  assert.equal(Object.isFrozen(input.receipts), false);

  const second = await readResponse(await handler(trackedRequest(eligibleInput()).request));
  assert.deepEqual(first, second);

  const ineligible = await readResponse(
    await handler(trackedRequest(ineligibleInput()).request),
  );
  assert.equal(ineligible.status, 200);
  assert.deepEqual(successBody(ineligible.body), {
    ok: true,
    kind: "AUTHORIZED_ADMIN_REQUEST",
    requestAuthorizationClassification: "SERVER_DERIVED_ADMIN",
    actor: ADMIN_EMAIL,
    role: "ADMIN",
    eligibility: {
      kind: "INELIGIBLE",
      eligible: false,
      classificationOnly: true,
      reasonCodes: ["CANDIDATE_TRANSITION_NOT_LISTED"],
      transitionId: null,
      activationAuthorized: false,
      activationPerformed: false,
    },
    activationAuthorized: false,
    activationPerformed: false,
  });
}

async function testOrderingAndHandlerExceptions() {
  const order: string[] = [];
  const request = {
    async json() {
      order.push("json");
      return eligibleInput();
    },
  } as Request;
  const handler = createHandler({
    authenticate: async () => {
      order.push("authentication");
      return { authenticated: true, role: "ADMIN", email: ADMIN_EMAIL };
    },
  });
  assert.equal((await handler(request)).status, 200);
  assert.deepEqual(order, ["authentication", "json"]);

  const secretFailure = createProgramActivationAuthorityHandler({
    readSecret: () => {
      throw new Error("synthetic secret detail");
    },
    authenticate: async () => ({
      authenticated: true,
      role: "ADMIN",
      email: ADMIN_EMAIL,
    }),
  });
  const body = await expectError(
    await secretFailure(trackedRequest(eligibleInput()).request),
    503,
    "SERVER_SECRET_UNAVAILABLE",
  );
  assert.equal(JSON.stringify(body).includes("secret detail"), false);
}

async function testSyntheticJwtIntegration() {
  const authenticate = async (request: Request, secret: string): Promise<SyntheticAuthentication> => {
    const token = await getToken({ req: request as NextRequest, secret });
    return token
      ? { authenticated: true, role: token.role, email: token.email }
      : { authenticated: false };
  };
  const handler = createHandler({ authenticate });

  const unauthenticated = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ malformed and intentionally unread ",
      }),
    ),
  );
  assert.equal(unauthenticated.status, 401);

  const agentJwt = await encode({
    secret: SYNTHETIC_SECRET,
    token: { email: "agent@example.com", role: "AGENT" },
    maxAge: 60,
  });
  const agent = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `next-auth.session-token=${agentJwt}`,
        },
        body: JSON.stringify({ ...eligibleInput(), role: "ADMIN" }),
      }),
    ),
  );
  assert.equal(agent.status, 403);
  assert.equal(errorBody(agent.body).error.code, "ADMIN_REQUIRED");

  const adminJwt = await encode({
    secret: SYNTHETIC_SECRET,
    token: { email: "  ADMIN@EXAMPLE.COM  ", role: "ADMIN" },
    maxAge: 60,
  });
  const admin = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `next-auth.session-token=${adminJwt}`,
        },
        body: JSON.stringify(eligibleInput()),
      }),
    ),
  );
  assert.equal(admin.status, 200);
  assert.equal(successBody(admin.body).actor, ADMIN_EMAIL);

  const malformedActorJwt = await encode({
    secret: SYNTHETIC_SECRET,
    token: { email: "not-an-email", role: "ADMIN" },
    maxAge: 60,
  });
  const malformedActor = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `next-auth.session-token=${malformedActorJwt}`,
        },
        body: "{ intentionally malformed and unread ",
      }),
    ),
  );
  assert.equal(malformedActor.status, 403);
  assert.equal(errorBody(malformedActor.body).error.code, "ACTOR_EMAIL_REQUIRED");

  const clientSpoof = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `next-auth.session-token=${adminJwt}`,
        },
        body: JSON.stringify({
          ...eligibleInput(),
          actor: "attacker@example.com",
          role: "AGENT",
        }),
      }),
    ),
  );
  assert.equal(clientSpoof.status, 400);
  assert.equal(errorBody(clientSpoof.body).error.code, "INVALID_REQUEST");
}

function importSpecifiers(source: string): string[] {
  return [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
}

function testStaticProductionBoundary() {
  const handlerSource = readFileSync(
    new URL("./program-activation-authority-handler.ts", import.meta.url),
    "utf8",
  );
  const routeSource = readFileSync(
    new URL(
      "../../../app/api/operator/program-lifecycle/activation-authority/route.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.deepEqual(importSpecifiers(handlerSource), [
    "./program-activation-eligibility-gate",
  ]);
  assert.deepEqual(importSpecifiers(routeSource), [
    "next/server",
    "next-auth/jwt",
    "@/lib/controlPlane/programLifecycle/program-activation-authority-handler",
  ]);
  assert.match(routeSource, /getToken/);
  assert.doesNotMatch(routeSource, /@\/auth|prisma|bcrypt|sotIngestAuth|internalAuth/i);
  assert.doesNotMatch(
    handlerSource,
    /node:|readFile|process\.env|fetch\(|database|filesystem|network|persistence|provider|github|linear|agent|council|deployment|C6|C7|Math\.random|Date\s*[.(]|new\s+Date/i,
  );
  assert.doesNotMatch(
    routeSource,
    /node:|readFile|fetch\(|database|filesystem|network|persistence|provider|github|linear|agent|council|deployment|C6|C7|Math\.random|Date\s*[.(]|new\s+Date/i,
  );
  assert.doesNotMatch(
    handlerSource,
    /NOT_ROUTED|OPEN_FOR_BATCH_PLANNING|UNRESOLVED_HOLD|CLOSED_ACCEPTED|CLOSED_NO_GO|CANCELLED|FAILED|B1-TR-|MAIN_STATE_RECEIPT|PROGRAM_OPENING_RECEIPT|PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES/,
  );
  assert.doesNotMatch(
    `${handlerSource}\n${routeSource}`,
    /activationAuthorized:\s*true|activationPerformed:\s*true|transitionPerformed:\s*true/,
  );
}

async function run() {
  await testSecretBoundaryAsync();
  await testAuthenticationBoundary();
  await testRoleBoundary();
  await testActorBoundary();
  await testRequestBoundaryAndSpoofResistance();
  await testSuccessfulAdminResultsAndIsolation();
  await testOrderingAndHandlerExceptions();
  await testSyntheticJwtIntegration();
  testStaticProductionBoundary();
}

void run();
