import assert from "node:assert/strict";

import {
  buildFounderActiveProgramControlSurface,
  FOUNDER_PROGRAM_SNAPSHOT,
} from "./founder-active-program-control-surface";
import { FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES } from "./frozen-program-protection-boundary";

const expectedRegistry = [
  { id: "jai-governance-intelligence-main-state-operating-loop-v0", title: "Main-State Reconciliation and Minimum Viable Operating Loop v0", coordinate: "Q3M7Y26-P1", lifecycleState: "CLOSED_ACCEPTED", displayPosture: "Closed after ACTIVE — PLANNING ONLY", closeoutMainSha: "2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8", authority: "NONE" },
  { id: "jai-five-slot-compounded-reasoning-shadow-kernel-v0", title: "Five-Slot Compounded Reasoning Shadow Kernel v0", coordinate: "Q4M11Y26-P2", governing_motion_id: "motion-0248", activeExecutionLanes: 0, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "OPENING_CANDIDATE / RESERVED_PENDING_OPENING_MERGE", authority: "NONE" },
  { id: "jai-founder-developer-workflow-pilot-v0", title: "Founder Developer Workflow Pilot v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" },
  { id: "jai-agent-council-bounded-activation-pilot-v0", title: "Bounded JAI Agent and Council Activation Pilot v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" },
] as const;
const modelKeys = ["sourcePosture", "sourceArtifact", "sourceRef", "bindingAvailability", "portfolio", "bindingClassification", "actionClassifications", "eligibilityClassification", "classificationOnly", "authorityEffect", "mutationCredit", "mutationAuthorized", "mutationPerformed", "activationAuthorized", "activationPerformed"];
const c10Keys = ["kind", "classificationOnly", "sourcePosture", "authorityEffect", "mutationAuthorized", "mutationPerformed", "guardSatisfied", "activeProgram", "bindingComparison"];
const comparisonKeys = ["kind", "structurallyEqual", "expectedBinding", "candidateBinding", "authorityEffect"];
const c11Keys = ["kind", "classificationOnly", "sourcePosture", "authorityEffect", "mutationCredit", "mutationAuthorized", "mutationPerformed", "attemptedAction", "guardResult"];

function assertFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const key of Reflect.ownKeys(value)) assertFrozen((value as Record<PropertyKey, unknown>)[key]);
}

function assertC10(result: ReturnType<typeof buildFounderActiveProgramControlSurface>["bindingClassification"]): void {
  assert.equal(result.kind, "INVALID_EXPECTED_SNAPSHOT");
  assert.deepEqual(Reflect.ownKeys(result), c10Keys);
  assert.equal(result.classificationOnly, true);
  assert.equal(result.sourcePosture, "SUPPLIED_EXPECTED_SNAPSHOT");
  assert.equal(result.authorityEffect, "NONE");
  assert.equal(result.mutationAuthorized, false);
  assert.equal(result.mutationPerformed, false);
  assert.equal(result.guardSatisfied, false);
  assert.equal(result.activeProgram, null);
  assert.deepEqual(Reflect.ownKeys(result.bindingComparison ?? {}), comparisonKeys);
  assert.equal(result.bindingComparison?.kind, "INVALID_EXPECTED_SNAPSHOT");
  assert.equal(result.bindingComparison?.structurallyEqual, false);
  assert.equal(result.bindingComparison?.expectedBinding, null);
  assert.equal(result.bindingComparison?.candidateBinding, null);
  assert.equal(result.bindingComparison?.authorityEffect, "NONE");
}

assert.deepEqual(FOUNDER_PROGRAM_SNAPSHOT, expectedRegistry);
assert.deepEqual(FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES, ["LIFECYCLE_MUTATION", "DOWNSTREAM_MUTATION"]);
assert.equal(FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES.length, 2);
const model = buildFounderActiveProgramControlSurface();
const later = buildFounderActiveProgramControlSurface();
assert.deepEqual(Reflect.ownKeys(model), modelKeys);
assert.deepEqual(model.portfolio, expectedRegistry);
assert.equal(model.portfolio.filter((row) => row.authority !== "NONE").length, 0);
assert.deepEqual(model.portfolio.slice(1).map((row) => row.displayPosture), ["OPENING_CANDIDATE / RESERVED_PENDING_OPENING_MERGE", "FROZEN — NOT OPEN", "FROZEN — NOT OPEN"]);
assert.equal(model.sourcePosture, "SUPPLIED_DOCUMENTARY_SNAPSHOT");
assert.equal(model.sourceArtifact, "P1 closeout and P2 opening candidate (main baseline)");
assert.equal(model.sourceRef, "3ac8e9b0974a85ac953c6cf6a9a86aef0e99c467");
assert.equal(model.bindingAvailability, "UNAVAILABLE");
assert.equal(model.eligibilityClassification, "INELIGIBLE");
assert.equal(model.classificationOnly, true);
assert.equal(model.authorityEffect, "NONE");
assert.equal(model.mutationCredit, "NONE");
assert.equal(model.mutationAuthorized, false);
assert.equal(model.mutationPerformed, false);
assert.equal(model.activationAuthorized, false);
assert.equal(model.activationPerformed, false);
assertC10(model.bindingClassification);
assert.equal(model.actionClassifications.length, FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES.length);
for (const [index, action] of model.actionClassifications.entries()) {
  assert.equal(FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES[index], ["LIFECYCLE_MUTATION", "DOWNSTREAM_MUTATION"][index]);
  assert.equal(action.kind, "INVALID_EXPECTED_SNAPSHOT");
  assert.deepEqual(Reflect.ownKeys(action), c11Keys);
  assert.equal(action.classificationOnly, true);
  assert.equal(action.sourcePosture, "SUPPLIED_EXPECTED_SNAPSHOT");
  assert.equal(action.authorityEffect, "NONE");
  assert.equal(action.mutationCredit, "NONE");
  assert.equal(action.mutationAuthorized, false);
  assert.equal(action.mutationPerformed, false);
  assert.equal(action.attemptedAction, null);
  assert.ok(action.guardResult);
  assertC10(action.guardResult);
}
assertFrozen(model);
assert.deepEqual(later, model);
