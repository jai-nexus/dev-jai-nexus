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
      latest_motion_id: "motion-0198",
    },
    future_corpus: {
      corpus_id: "corpus-v2",
      label: "Corpus V2",
      governance_posture: "agent-operable governance",
      status: "gated / not open",
    },
    blockers: [
      "live agent motion drafting",
      "live canonical voting",
      "ratification workflow",
      "deterministic motion package generation",
      "workflow-ready outputs",
      "authority boundaries",
    ],
    notes: [
      "No Corpus V2 opening is active.",
      "No motion numbering reset is active.",
      "No runtime corpus switching exists on this surface.",
    ],
    canon_refs: [
      ".nexus/canon/corpus/corpus-model-v0.md",
      ".nexus/canon/corpus/corpus-v1-closeout.md",
      ".nexus/canon/corpus/corpus-v2-readiness-gate.md",
    ],
  };
}
