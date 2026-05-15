export interface AgentGovernanceSandboxFixtureSummary {
  fixture_id: string;
  fixture_type: string;
  fixture_status: string;
  labels: string[];
  summary: string;
  source_path: string;
}

export interface AgentGovernanceSandboxModel {
  posture: string;
  note: string;
  canon_ref: string;
  validator: {
    posture: string;
    command: string;
    source_paths: string[];
    checked_categories: string[];
    note: string;
    evidence_ref: string;
    playbook_ref: string;
  };
  guardrails: {
    posture: string;
    source_path: string;
    categories: string[];
    required_fields: string[];
    required_labels: string[];
    note: string;
  };
  fixtures: {
    motion_draft: AgentGovernanceSandboxFixtureSummary;
    vote_ratification: AgentGovernanceSandboxFixtureSummary;
    failure_traces: AgentGovernanceSandboxFixtureSummary;
    gate_evidence: AgentGovernanceSandboxFixtureSummary;
  };
  failure_trace_examples: string[];
  gate_evidence_summary: string[];
  validation_summary: string[];
  human_boundary_note: string;
}

export function getAgentGovernanceSandboxModel(): AgentGovernanceSandboxModel {
  return {
    posture: "fixture-only / simulated / review-only",
    note:
      "Sandbox traces are static local fixtures for review. They are not canon by default, not executable, and do not imply live agents are active.",
    canon_ref: ".nexus/canon/corpus/agent-governance-sandbox-prototype-v0.md",
    validator: {
      posture: "static/manual validation / review-only / not runtime enforcement",
      command: "node portal/scripts/validate-sandbox-fixtures.mjs",
      source_paths: [
        ".nexus/fixtures/corpus-v2/agent-governance-sandbox/motion-draft.v0.json",
        ".nexus/fixtures/corpus-v2/agent-governance-sandbox/vote-ratification-trace.v0.json",
        ".nexus/fixtures/corpus-v2/agent-governance-sandbox/failure-traces.v0.json",
        ".nexus/fixtures/corpus-v2/agent-governance-sandbox/gate-evidence.v0.json",
      ],
      checked_categories: [
        "required fixture fields",
        "allowed fixture types",
        "canonical voter identities in vote traces",
        "authority and review labels",
        "human review and intervention fields",
      ],
      note:
        "A passing run means fixture shape matches static expectations only. It does not open Corpus V2, activate agents, or grant authority.",
      evidence_ref: ".nexus/canon/corpus/sandbox-validator-evidence-record-v0.md",
      playbook_ref: ".nexus/canon/corpus/fixture-drift-response-playbook-v0.md",
    },
    guardrails: {
      posture: "guardrails only / fixture schema guidance / not runtime enforcement",
      source_path: ".nexus/canon/corpus/sandbox-fixture-schema-guards-v0.md",
      categories: [
        "motion draft fixture",
        "vote/ratification fixture",
        "failure trace fixture",
        "gate evidence fixture",
      ],
      required_fields: [
        "fixture_id",
        "fixture_type",
        "fixture_status",
        "authority boundary labels",
        "human review or intervention fields",
      ],
      required_labels: [
        "Fixture-only",
        "Simulated",
        "Non-authoritative",
        "Review-only",
        "No authority",
        "Not runtime enforcement",
      ],
      note:
        "These guards document durable fixture shape expectations. They are review aids only and do not reject or enforce runtime behavior.",
    },
    fixtures: {
      motion_draft: {
        fixture_id: "corpus-v2-motion-draft-fixture-v0",
        fixture_type: "motion_draft_trace",
        fixture_status: "simulated_review_only",
        labels: [
          "Fixture-only",
          "Simulated",
          "Not canon",
          "Review-only",
          "No authority",
        ],
        summary:
          "Demonstrates future draft shape, proposer identity, role/lens contributors, required files, and human review requirements.",
        source_path:
          ".nexus/fixtures/corpus-v2/agent-governance-sandbox/motion-draft.v0.json",
      },
      vote_ratification: {
        fixture_id: "corpus-v2-vote-ratification-fixture-v0",
        fixture_type: "vote_ratification_trace",
        fixture_status: "simulated_review_only",
        labels: [
          "Fixture-only",
          "Simulated",
          "Not canon",
          "Review-only",
          "No authority",
        ],
        summary:
          "Demonstrates canonical voter identities, evidence references, simulated ratification conditions, blocked example, and explicit human intervention.",
        source_path:
          ".nexus/fixtures/corpus-v2/agent-governance-sandbox/vote-ratification-trace.v0.json",
      },
      failure_traces: {
        fixture_id: "corpus-v2-failure-traces-fixture-v0",
        fixture_type: "failure_trace_collection",
        fixture_status: "simulated_review_only",
        labels: [
          "Fixture-only",
          "Simulated",
          "Non-authoritative",
          "Review-only",
          "No authority",
          "Not runtime enforcement",
        ],
        summary:
          "Demonstrates blocked authority, validation failure, human-review hold, noncanonical voter rejection, and provider-dispatch blocked examples.",
        source_path:
          ".nexus/fixtures/corpus-v2/agent-governance-sandbox/failure-traces.v0.json",
      },
      gate_evidence: {
        fixture_id: "corpus-v2-gate-evidence-fixture-v0",
        fixture_type: "gate_evidence_collection",
        fixture_status: "simulated_review_only",
        labels: [
          "Fixture-only",
          "Simulated",
          "Non-authoritative",
          "Review-only",
          "No authority",
          "Not runtime enforcement",
        ],
        summary:
          "Maps illustrative evidence records to settled readiness gate ids without claiming machine enforcement or new authority.",
        source_path:
          ".nexus/fixtures/corpus-v2/agent-governance-sandbox/gate-evidence.v0.json",
      },
    },
    failure_trace_examples: [
      "blocked_by_authority",
      "validation_failed",
      "human_review_required",
      "noncanonical_voter_rejected",
      "provider_dispatch_blocked",
    ],
    gate_evidence_summary: [
      "fixture existence supports review-only drafting and voting shape inspection",
      "canonical voter identity examples remain limited to jai-proposer, jai-challenger, and jai-arbiter",
      "human boundary evidence remains explicit and required",
      "snapshot and validation posture remain illustrative, not automated",
      "authority-blocked examples stay non-authoritative and non-executable",
    ],
    validation_summary: [
      "schema-valid fixture shape only",
      "canonical governance voter identities only",
      "static/manual validator command documented",
      "guardrails only, not runtime enforcement",
      "explicit human review and intervention required",
      "no live voting, drafting, or ratification",
    ],
    human_boundary_note:
      "Human operator review remains required. Fixture traces do not create canon, runtime authority, or opening semantics.",
  };
}
