export interface DraftReviewPrototypeModel {
  fixture_id: string;
  draft_motion_id: string;
  draft_state: string;
  corpus_id: string;
  proposer: string;
  role_lens_contributors: string[];
  target_repo: string;
  target_domain: string;
  problem_statement: string;
  proposed_scope: string[];
  non_goals: string[];
  required_files: string[];
  validation_expectations: string[];
  human_review_required: boolean;
  authority_boundary_labels: string[];
  source_fixture_path: string;
  source_canon_paths: string[];
  draft_review_labels: string[];
  draft_review_summary: string;
  validation_checklist_summary: string[];
  no_authority_note: string;
}

export function getDraftReviewPrototypeModel(): DraftReviewPrototypeModel {
  return {
    fixture_id: "corpus-v2-motion-draft-fixture-v0",
    draft_motion_id: "motion-0001-placeholder",
    draft_state: "ready_for_review",
    corpus_id: "corpus-v2-placeholder",
    proposer: "jai-proposer",
    role_lens_contributors: ["jai-architect", "jai-verifier", "jai-operator"],
    target_repo: "dev-jai-nexus",
    target_domain: "Operator Control Plane",
    problem_statement:
      "Demonstrate how a future Corpus V2 draft package could be reviewed for shape, scope, contributor boundaries, and validation expectations without activating live agent drafting.",
    proposed_scope: [
      "show a simulated draft identity and placeholder corpus path",
      "show role/lens contributors separately from governance voter identities",
      "show required files and validation expectations",
      "show human review and no-authority posture explicitly",
    ],
    non_goals: [
      "generate content from a provider/model",
      "open Corpus V2",
      "promote fixture output to canon",
      "grant branch, PR, merge, or runtime authority",
    ],
    required_files: [
      "motion.yaml",
      "proposal.md",
      "challenge.md",
      "execution.md or plan.md",
      "vote.json placeholder",
    ],
    validation_expectations: [
      "fixture shape remains static and review-only",
      "scope and non-goals remain explicit",
      "human review required remains true",
      "authority boundary remains explicit",
      "no live/provider/runtime claims are introduced",
    ],
    human_review_required: true,
    authority_boundary_labels: [
      "Static fixture",
      "Simulated draft",
      "Not canon",
      "Review-only",
      "No authority",
      "Corpus V2 not open",
      "Human review required",
      "No provider/model calls",
    ],
    source_fixture_path:
      ".nexus/fixtures/corpus-v2/agent-governance-sandbox/motion-draft.v0.json",
    source_canon_paths: [
      ".nexus/canon/corpus/no-provider-draft-review-prototype-boundary-v0.md",
      ".nexus/canon/corpus/draft-review-validation-checklist-v0.md",
      ".nexus/canon/corpus/agent-governance-sandbox-boundary-v0.md",
      ".nexus/canon/corpus/agent-governance-sandbox-prototype-v0.md",
    ],
    draft_review_labels: [
      "Static fixture",
      "Simulated draft",
      "Not canon",
      "Review-only",
      "No authority",
      "Corpus V2 not open",
    ],
    draft_review_summary:
      "This prototype exposes one simulated draft package for inspection only. It demonstrates future draft-review shape without generating content from a provider/model or granting any authority.",
    validation_checklist_summary: [
      "draft identity present",
      "target repo and domain clear",
      "scope bounded and non-goals explicit",
      "role/lens contributors separated from governance voter path",
      "validation expectations present",
      "human review and no-authority posture explicit",
    ],
    no_authority_note:
      "The draft-review prototype is static and human-gated. It does not create canon, activate agents, or enable any write, execution, or provider/model authority.",
  };
}
