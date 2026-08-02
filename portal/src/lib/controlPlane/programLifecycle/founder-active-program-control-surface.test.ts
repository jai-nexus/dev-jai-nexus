import assert from "node:assert/strict";

import {
  buildFounderActiveProgramControlSurface,
  FOUNDER_PROGRAM_SNAPSHOT,
} from "./founder-active-program-control-surface";
import { FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES } from "./frozen-program-protection-boundary";

const expectedRegistry = [
  { id: "jai-governance-intelligence-main-state-operating-loop-v0", title: "Main-State Reconciliation and Minimum Viable Operating Loop v0", coordinate: "Q3M7Y26-P1", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY", displayPosture: "ACTIVE — PLANNING ONLY", authority: "NONE" },
  { id: "jai-five-slot-compounded-reasoning-shadow-kernel-v0", title: "Five-Slot Compounded Reasoning Shadow Kernel v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" },
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
  assert.deepEqual(result.activeProgram, { programId: expectedRegistry[0].id, lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" });
  assert.deepEqual(Reflect.ownKeys(result.activeProgram ?? {}), ["programId", "lifecycleState"]);
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
assert.equal(model.portfolio.filter((row) => row.lifecycleState === "OPEN_FOR_BATCH_PLANNING_ONLY").length, 1);
assert.deepEqual(model.portfolio.slice(1).map((row) => row.displayPosture), ["FROZEN — NOT OPEN", "FROZEN — NOT OPEN", "FROZEN — NOT OPEN"]);
assert.equal(model.sourcePosture, "SUPPLIED_DOCUMENTARY_SNAPSHOT");
assert.equal(model.sourceArtifact, "A5 Active and Frozen Program Registry v0");
assert.equal(model.sourceRef, "c645be4d27cca2b2a0eb0f81d413f27df3493b00");
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
