export interface EdgeRunnerAutomationSubstrateModel {
  posture: string;
  summary: string;
  fleet: string[];
  visibility_boundary_note: string;
  evidence_record_note: string;
  evidence_validation_note: string;
  surfaceable_metadata_fields: string[];
  unsurfaced_live_behaviors: string[];
  readiness_rows: Array<{
    label: string;
    state: string;
    execution_authorized: "no";
  }>;
  valid_fixture_coverage: string[];
  invalid_fixture_coverage: string[];
  allowed: string[];
  denied: string[];
  next_gates: string[];
  source_refs: string[];
}

export function getEdgeRunnerAutomationSubstrateModel(): EdgeRunnerAutomationSubstrateModel {
  return {
    posture: "non-executing dry-run generation + validation only",
    summary:
      "orchestrator-nexus now provides a tested dry-run automation substrate for plan generation, schema validation, fixture-harness review, expanded fixture coverage, and evidence record modeling, but execution authority remains denied.",
    fleet: [
      "Work Desktop - primary operator workstation",
      "Work MacBook - portable operator / secondary validation workstation",
      "Raspberry Pi - always-on edge node / syncd / lightweight runtime lab",
    ],
    visibility_boundary_note:
      "dev-jai-nexus may show static/example dry-run metadata and evidence posture only. It does not ingest live orchestrator artifacts and does not poll orchestrator-nexus.",
    evidence_record_note:
      "Evidence records prove dry-run plan generation and validation posture only. They do not prove execution, runtime mutation, deployment, customer workloads, customer data handling, payment handling, provider/model output, scheduler action, runner action, branch write, PR creation, PR merge, or cross-repo mutation.",
    evidence_validation_note:
      "Evidence validation: source-side validator plus valid/invalid fixtures and repeatable harness are available; execution proof is not claimed.",
    surfaceable_metadata_fields: [
      "dry-run plan id",
      "evidence record id",
      "target device",
      "target repo",
      "target lane",
      "command class",
      "validation status",
      "confirmation required",
      "human approval required",
      "no-execution guarantee",
      "evidence status",
      "source canon / source repo reference",
    ],
    unsurfaced_live_behaviors: [
      "live dry-run plan ingestion",
      "live orchestrator polling",
      "file watchers",
      "command execution controls",
      "runner controls",
      "scheduler controls",
      "branch/PR automation controls",
      "provider/model controls",
      "customer workload controls",
    ],
    readiness_rows: [
      {
        label: "device roles and fleet posture",
        state: "defined",
        execution_authorized: "no",
      },
      {
        label: "capability records",
        state: "defined",
        execution_authorized: "no",
      },
      {
        label: "dry-run plan generator",
        state: "available",
        execution_authorized: "no",
      },
      {
        label: "structured plan schema",
        state: "available",
        execution_authorized: "no",
      },
      {
        label: "validator and fixture harness",
        state: "available",
        execution_authorized: "no",
      },
      {
        label: "expanded fixture coverage",
        state: "available",
        execution_authorized: "no",
      },
    ],
    valid_fixture_coverage: [
      "Work Desktop / validation-bundle",
      "Work Desktop / repo-sync-check",
      "Work MacBook / validation-bundle",
      "Work MacBook / lane-targeted repo-sync-check",
      "Raspberry Pi / syncd-state-mirror-check",
      "Raspberry Pi / docker-context-check",
      "lane-targeted validation-bundle requiring confirmation",
    ],
    invalid_fixture_coverage: [
      "missing target device",
      "unknown target device",
      "missing target repo and target lane",
      "missing command class",
      "missing capability record",
      "capability record mismatch",
      "lane target with confirmation_required false",
      "confirmation required but missing evidence output path",
      "missing proposed commands",
      "proposed command text that implies execution",
      "missing no_execution_guarantee",
      "no_execution_guarantee false",
      "denied command class",
      "confirmation required with empty confirmation reasons",
      "missing human_approval_required",
      "unsupported status",
      "unsupported schema_version",
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
    next_gates: [
      "additional orchestrator-nexus fixture expansion",
      "dev-jai-nexus read-only dry-run plan visibility",
      "human review workflow shape",
      "dry-run evidence record model",
      "execution authority review, explicitly deferred and not authorized",
    ],
    source_refs: [
      ".nexus/canon/edge-runner-automation-substrate-intake-v0.md",
      ".nexus/canon/edge-runner-readiness-matrix-v0.md",
      ".nexus/canon/dry-run-plan-visibility-boundary-v0.md",
      ".nexus/canon/edge-runner-evidence-validation-intake-v0.md",
      "orchestrator-nexus PR #14",
    ],
  };
}
