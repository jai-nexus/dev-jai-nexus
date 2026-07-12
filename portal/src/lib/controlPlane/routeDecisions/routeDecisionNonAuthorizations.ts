import type { RouteDecisionNonAuthorizations } from "./routeDecisionTypes";

export const ROUTE_DECISION_NON_AUTHORIZATIONS = [
  "CONTROL_THREAD remains authority.",
  "Human / CONTROL_THREAD approval remains required.",
  "No autonomous execution.",
  "No route authority is granted.",
  "No execution authority is granted.",
  "No acceptance authority is transferred.",
  "No automatic route execution.",
  "No automatic delivery.",
  "Provider output remains advisory only.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
] as const satisfies RouteDecisionNonAuthorizations;

export function routeDecisionNonAuthorizations(
  value: RouteDecisionNonAuthorizations = ROUTE_DECISION_NON_AUTHORIZATIONS,
): string[] {
  return [...value];
}
