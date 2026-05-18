export interface EdgeRunnerAutomationSubstrateModel {
  posture: string;
  summary: string;
  fleet: string[];
  allowed: string[];
  denied: string[];
  source_refs: string[];
}

export function getEdgeRunnerAutomationSubstrateModel(): EdgeRunnerAutomationSubstrateModel {
  return {
    posture: "non-executing dry-run generation + validation only",
    summary:
      "orchestrator-nexus now provides a tested dry-run automation substrate for plan generation, schema validation, and fixture-harness review, but execution authority remains denied.",
    fleet: [
      "Work Desktop - primary operator workstation",
      "Work MacBook - portable operator / secondary validation workstation",
      "Raspberry Pi - always-on edge node / syncd / lightweight runtime lab",
    ],
    allowed: [
      "generate dry-run plans",
      "validate dry-run plans",
      "present dry-run plans for human review",
      "use fixture harness as validator evidence",
      "record substrate readiness in control-plane canon",
    ],
    denied: [
      "command execution",
      "runner execution",
      "scheduler authority",
      "automation execution",
      "provider/model calls",
      "branch-write / PR / merge authority",
      "production deployment",
      "customer workloads",
    ],
    source_refs: [
      ".nexus/canon/edge-runner-automation-substrate-intake-v0.md",
      "orchestrator-nexus PR #11",
    ],
  };
}
