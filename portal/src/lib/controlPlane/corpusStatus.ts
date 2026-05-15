export interface CorpusStatusModel {
  current_corpus: {
    corpus_id: "corpus-v1";
    label: "Corpus V1";
    governance_posture: "manual governance";
    status: "active / closing posture";
    latest_motion_id: string;
  };
  future_corpus: {
    corpus_id: "corpus-v2";
    label: "Corpus V2";
    governance_posture: "agent-operable governance";
    status: "gated / not open";
  };
  readiness: {
    source_of_truth: string;
    gate_counts: {
      satisfied_by_canon: number;
      partially_satisfied: number;
      unmet_future: number;
      blocked_by_authority: number;
      deferred_until_v2_opening: number;
    };
    top_blockers: string[];
    surface_note: string;
  };
  blockers: string[];
  notes: string[];
  canon_refs: string[];
}

export function getCorpusStatusModel(): CorpusStatusModel {
  return {
    current_corpus: {
      corpus_id: "corpus-v1",
      label: "Corpus V1",
      governance_posture: "manual governance",
      status: "active / closing posture",
      latest_motion_id: "motion-0206",
    },
    future_corpus: {
      corpus_id: "corpus-v2",
      label: "Corpus V2",
      governance_posture: "agent-operable governance",
      status: "gated / not open",
    },
    readiness: {
      source_of_truth: ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
      gate_counts: {
        satisfied_by_canon: 5,
        partially_satisfied: 5,
        unmet_future: 1,
        blocked_by_authority: 0,
        deferred_until_v2_opening: 0,
      },
      top_blockers: [
        "live agent motion drafting",
        "live agent voting",
        "governed visible ratification",
        "deterministic agent-operable package generation",
        "workflow-ready outputs",
        "authority boundaries",
      ],
      surface_note:
        "Readiness summary is visibility-only. Checklist canon remains the source of truth and no gate is machine-enforced on this surface.",
    },
    blockers: [
      "live agent motion drafting",
      "live agent voting",
      "governed visible ratification",
      "deterministic agent-operable package generation",
      "workflow-ready outputs",
      "authority boundaries",
    ],
    notes: [
      "No Corpus V2 opening is active.",
      "No motion numbering reset is active.",
      "No runtime corpus switching exists on this surface.",
      "No live drafting, voting, or ratification is enabled on this surface.",
    ],
    canon_refs: [
      ".nexus/canon/corpus/corpus-model-v0.md",
      ".nexus/canon/corpus/corpus-v1-closeout.md",
      ".nexus/canon/corpus/corpus-v2-readiness-gate.md",
      ".nexus/canon/corpus/corpus-v2-readiness-checklist.md",
      ".nexus/canon/corpus/corpus-v2-readiness-surface.md",
    ],
  };
}
