export type CorpusReadinessGateStatus =
  | "satisfied_by_canon"
  | "partially_satisfied"
  | "unmet_future"
  | "blocked_by_authority"
  | "deferred_until_v2_opening";

export type CorpusReadinessGateCheckability =
  | "canon-checkable"
  | "snapshot-checkable"
  | "schema-checkable"
  | "UI-visible-only"
  | "human-gated"
  | "authority-blocked";

export interface CorpusReadinessGate {
  gate_id: string;
  gate_label: string;
  status: CorpusReadinessGateStatus;
  checkability: CorpusReadinessGateCheckability;
  current_evidence: string;
  missing_before_v2: string;
  authority_note: string;
  source_artifact: string;
}

export const corpusReadinessGates: CorpusReadinessGate[] = [
  {
    gate_id: "drafting",
    gate_label: "Live agent motion drafting",
    status: "unmet_future",
    checkability: "authority-blocked",
    current_evidence:
      "Corpus V1 remains human-operated and manual, and the drafting design remains future-state only.",
    missing_before_v2:
      "Internal JAI Agent drafting flow into dev.jai.nexus with deterministic, schema-valid draft outputs.",
    authority_note: "No provider, model, or runtime authority is granted.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
  },
  {
    gate_id: "canonical_voting",
    gate_label: "Canonical governance voting",
    status: "partially_satisfied",
    checkability: "canon-checkable",
    current_evidence:
      "PR #151 corrected recent voter identity drift and settled recent motions use canonical governance voter identities.",
    missing_before_v2:
      "Live JAI Agent voting process using the canonical governance voter identities.",
    authority_note: "Canonical identity shape exists; live voting is not active.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
  },
  {
    gate_id: "visible_ratification",
    gate_label: "Governed visible ratification",
    status: "partially_satisfied",
    checkability: "human-gated",
    current_evidence:
      "Corpus V1 has visible motion packages, decisions, and manual ratification records.",
    missing_before_v2:
      "Governed, visible, agent-operable ratification workflow.",
    authority_note: "No live agent ratification or autonomous ratification authority is granted.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
  },
  {
    gate_id: "workflow_outputs",
    gate_label: "Workflow-ready outputs",
    status: "partially_satisfied",
    checkability: "UI-visible-only",
    current_evidence:
      "Passalongs, PR descriptions, validation lists, and motion packages exist as structured outputs.",
    missing_before_v2:
      "Deterministic workflow-output generation by operable agents.",
    authority_note: "No branch-write, PR, or execution authority is granted.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
  },
  {
    gate_id: "human_override",
    gate_label: "Human override / approval boundary",
    status: "satisfied_by_canon",
    checkability: "human-gated",
    current_evidence:
      "Corpus model and readiness gate preserve human override and approval boundary where required.",
    missing_before_v2:
      "Implementation specifics for where approval gates live.",
    authority_note: "Human final boundary remains required where applicable.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
  },
  {
    gate_id: "identity_distinction",
    gate_label: "Voter/lens/human distinction",
    status: "satisfied_by_canon",
    checkability: "canon-checkable",
    current_evidence:
      "Motion 0199 documents role/lens versus voter identity and human intervention distinction.",
    missing_before_v2:
      "Future Corpus V2 schema or tooling enforcement.",
    authority_note: "Canon exists; live enforcement does not.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-machine-checkable-gates.md",
  },
  {
    gate_id: "schema_generation",
    gate_label: "Deterministic schema-valid motion package generation",
    status: "partially_satisfied",
    checkability: "schema-checkable",
    current_evidence:
      "validate-motion and settled package conventions exist, and the current snapshot gate checks package completeness.",
    missing_before_v2:
      "Deterministic agent-operable generation path.",
    authority_note: "No live generation automation is granted.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-machine-checkable-gates.md",
  },
  {
    gate_id: "snapshot_gate",
    gate_label: "Snapshot generation gate",
    status: "partially_satisfied",
    checkability: "snapshot-checkable",
    current_evidence:
      "build-motion-snapshot --write and --check exist and are required in current motion validation practice.",
    missing_before_v2:
      "Final Corpus V2 policy for automatic versus required snapshot gate.",
    authority_note: "No scheduler or automation is granted.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-machine-checkable-gates.md",
  },
  {
    gate_id: "numbering_reset",
    gate_label: "Safe motion numbering reset without overwriting Corpus V1",
    status: "satisfied_by_canon",
    checkability: "canon-checkable",
    current_evidence:
      "Corpus model states a new Corpus may restart at motion-0001 without overwriting Corpus V1.",
    missing_before_v2:
      "Actual opening procedure and corpus-aware storage/path strategy.",
    authority_note: "Numbering has not reset.",
    source_artifact: ".nexus/canon/corpus/corpus-model-v0.md",
  },
  {
    gate_id: "v1_immutability",
    gate_label: "Corpus V1 immutability",
    status: "satisfied_by_canon",
    checkability: "canon-checkable",
    current_evidence:
      "Corpus V1 archive/index and schema-hygiene canon preserve historical immutability except explicit hygiene fixes.",
    missing_before_v2:
      "Optional future archive protection or tooling if desired.",
    authority_note: "No historical rewrite is authorized.",
    source_artifact: ".nexus/canon/corpus/corpus-v1-archive-index.md",
  },
  {
    gate_id: "authority_boundary",
    gate_label: "No write/merge/execution authority without separate authorization",
    status: "satisfied_by_canon",
    checkability: "authority-blocked",
    current_evidence:
      "Repeated settled motions preserve no authority expansion across write, merge, and execution boundaries.",
    missing_before_v2:
      "Separate future authority motions if any capability becomes necessary.",
    authority_note: "Branch-write, PR creation, merge, and execution remain disabled.",
    source_artifact: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
  },
];

export function getCorpusReadinessGateCounts(): Record<CorpusReadinessGateStatus, number> {
  return corpusReadinessGates.reduce<Record<CorpusReadinessGateStatus, number>>(
    (counts, gate) => {
      counts[gate.status] += 1;
      return counts;
    },
    {
      satisfied_by_canon: 0,
      partially_satisfied: 0,
      unmet_future: 0,
      blocked_by_authority: 0,
      deferred_until_v2_opening: 0,
    },
  );
}

export function getCorpusReadinessTopBlockers(): string[] {
  return corpusReadinessGates
    .filter((gate) => gate.status === "unmet_future" || gate.status === "partially_satisfied")
    .slice(0, 6)
    .map((gate) => gate.gate_label.toLowerCase());
}
