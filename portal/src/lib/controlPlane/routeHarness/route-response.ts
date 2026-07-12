import assert from "node:assert/strict";

export interface RouteResponseSnapshot {
  status: number;
  body: unknown;
}

export const ROUTE_HARNESS_FORBIDDEN_AUTHORITY_CLAIMS = [
  "approval granted",
  "route authority granted",
  "execution authority granted",
  "acceptance authority transferred",
  "CONTROL_THREAD acceptance transferred",
  "source-of-truth transfer authorized",
  "deployment authorized",
  "production gate opened",
  "public launch authorized",
  "provider dispatch authorized",
  "GitHub mutation authorized",
  "Linear mutation authorized",
  "target-repo mutation authorized",
  "automatic route execution enabled",
  "automatic delivery enabled",
  "checklist execution authorized",
  "activation authorized",
] as const;

export async function readRouteResponse(
  response: Response,
): Promise<RouteResponseSnapshot> {
  return {
    status: response.status,
    body: await readJsonBody(response),
  };
}

export function jsonRouteResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export function assertRouteResponseStatus(
  snapshot: RouteResponseSnapshot,
  expectedStatus: number,
) {
  assert.equal(snapshot.status, expectedStatus);
}

export function assertRouteResponseHasNonAuthorizations(
  snapshot: RouteResponseSnapshot,
) {
  const nonAuthorizations = readStringArrayField(
    snapshot.body,
    "nonAuthorizations",
  );
  assert.ok(
    nonAuthorizations.length > 0,
    "Expected route response body to include nonAuthorizations.",
  );
  assertNoForbiddenAuthorityClaims(nonAuthorizations);
}

export function assertNoForbiddenAuthorityClaims(value: unknown) {
  const text = flattenValueText(value).join("\n");
  for (const claim of ROUTE_HARNESS_FORBIDDEN_AUTHORITY_CLAIMS) {
    assert.equal(
      text.includes(claim),
      false,
      `Expected route harness value to exclude forbidden authority claim: ${claim}`,
    );
  }
}

export function assertNoExternalMutationAuthority(snapshot: RouteResponseSnapshot) {
  assertNoForbiddenAuthorityClaims(snapshot.body);
}

export function readStringArrayField(
  value: unknown,
  fieldName: string,
): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }
  const candidate = (value as Record<string, unknown>)[fieldName];
  return Array.isArray(candidate)
    ? candidate.filter((item): item is string => typeof item === "string")
    : [];
}

async function readJsonBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function flattenValueText(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap(flattenValueText);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenValueText);
  }
  return [];
}
