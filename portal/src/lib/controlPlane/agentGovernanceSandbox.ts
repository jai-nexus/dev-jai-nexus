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
  fixtures: {
    motion_draft: AgentGovernanceSandboxFixtureSummary;
    vote_ratification: AgentGovernanceSandboxFixtureSummary;
  };
  validation_summary: string[];
  human_boundary_note: string;
}

export function getAgentGovernanceSandboxModel(): AgentGovernanceSandboxModel {
  return {
    posture: "fixture-only / simulated / review-only",
    note:
      "Sandbox traces are static local fixtures for review. They are not canon by default, not executable, and do not imply live agents are active.",
    canon_ref: ".nexus/canon/corpus/agent-governance-sandbox-prototype-v0.md",
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
    },
    validation_summary: [
      "schema-valid fixture shape only",
      "canonical governance voter identities only",
      "explicit human review and intervention required",
      "no live voting, drafting, or ratification",
    ],
    human_boundary_note:
      "Human operator review remains required. Fixture traces do not create canon, runtime authority, or opening semantics.",
  };
}
