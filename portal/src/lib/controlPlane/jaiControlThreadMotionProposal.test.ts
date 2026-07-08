import assert from "node:assert/strict";

import {
  ADVISORY_REVIEW_CANDIDATE_POSTURES,
  buildJaiControlThreadMotionProposalJson,
  buildJaiControlThreadMotionProposalMarkdown,
  COUNCIL_ADVISORY_REVIEW_HANDOFF_PREVIEW,
  JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT,
  JAI_CONTROL_THREAD_MOTION_PROPOSAL_SURFACE,
  MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY,
  MOTION_TO_PROGRAM_PLANNING_SEED_PREVIEW,
  OPERATOR_MOTION_PROPOSAL_INTAKE_DISPLAY,
} from "./jaiControlThreadMotionProposal";

function assertIncludesAll(source: readonly string[], expected: readonly string[]) {
  for (const item of expected) {
    assert.ok(source.includes(item), `Expected ${item}`);
  }
}

function testMotionProposalModelCoverage() {
  const draft = JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT;

  assert.ok(draft.motion_id, "motion id exists");
  assert.ok(draft.motion_title, "motion title exists");
  assert.ok(draft.initiating_thread, "initiating thread exists");
  assert.ok(draft.operator_request_summary, "operator request summary exists");
  assert.ok(draft.proposed_purpose, "proposed purpose exists");
  assert.ok(draft.scope, "scope exists");
  assert.ok(draft.intended_program || draft.intended_domain);
  assert.ok(draft.affected_domain_assets.length > 0, "affected assets exist");
  assert.ok(draft.affected_repos.length > 0, "affected repos exist");
  assert.ok(draft.proposed_council_reviewers.length > 0, "Council reviewers exist");
  assert.ok(draft.proposed_advisory_agent_roles.length > 0, "advisory roles exist");
  assert.ok(draft.required_evidence.length > 0, "required evidence exists");
  assert.ok(draft.risks.length > 0, "risks exist");
  assert.ok(draft.blockers.length > 0, "blockers exist");
  assert.ok(draft.non_authorizations.length > 0, "non-authorizations exist");
  assert.ok(draft.requested_control_thread_decision, "requested decision exists");
  assert.ok(draft.recommended_next_planning_seed, "next planning seed exists");
}

function testOperatorIntakePosture() {
  const intake = OPERATOR_MOTION_PROPOSAL_INTAKE_DISPLAY;
  const copy = intake.boundary_copy.join("\n");

  assert.ok(intake.operator_prompt_text_placeholder, "operator prompt exists");
  assert.ok(intake.draft_only_status.includes("draft-only"));
  assert.ok(copy.includes("Operator intake is not parser authority."));
  assert.ok(copy.includes("Operator intake is not route authority."));
  assert.ok(copy.includes("Operator intake is not execution authority."));
  assert.ok(copy.includes("Operator intake is not provider dispatch authority."));
  assert.ok(copy.includes("Operator intake is not GitHub mutation authority."));
  assert.ok(copy.includes("Operator intake is not source-of-truth authority."));
}

function testCouncilAdvisoryHandoffPosture() {
  const handoff = COUNCIL_ADVISORY_REVIEW_HANDOFF_PREVIEW;
  const copy = handoff.boundary_copy.join("\n");

  assert.ok(handoff.proposal_id, "handoff proposal id exists");
  assert.ok(handoff.proposed_council_reviewers.length > 0);
  assert.ok(handoff.proposed_advisory_agent_roles.length > 0);
  assert.ok(handoff.review_questions.length > 0);
  assert.ok(handoff.expected_review_output_shape.length > 0);
  assert.ok(handoff.control_thread_decision_dependency.includes("CONTROL_THREAD"));
  assert.ok(copy.includes("No Council runtime activation."));
  assert.ok(copy.includes("No JAI Agent activation."));
  assert.ok(copy.includes("No provider/model/API dispatch."));
  assert.ok(copy.includes("No binding votes."));
}

function testAdvisoryVoteReviewCandidatePosture() {
  assertIncludesAll(ADVISORY_REVIEW_CANDIDATE_POSTURES, [
    "advisory review requested",
    "advisory vote candidate",
    "review pending",
    "review received",
    "disagreement / blocker",
    "consensus candidate",
    "CONTROL_THREAD decision required",
  ]);

  const copy = MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY.join("\n");
  assert.ok(copy.includes("Advisory review is not acceptance."));
  assert.ok(copy.includes("Council/advisory vote is not binding."));
  assert.ok(copy.includes("Planning seed is not route execution."));
  assert.ok(copy.includes("No source-of-truth transfer."));
}

function testMotionToProgramPlanningSeedPosture() {
  const seed = MOTION_TO_PROGRAM_PLANNING_SEED_PREVIEW;
  const copy = seed.boundary_copy.join("\n");

  assert.ok(seed.proposed_program_id, "program candidate exists");
  assert.ok(seed.batch_candidate, "batch candidate exists");
  assert.ok(seed.wave_candidate, "wave candidate exists");
  assert.ok(seed.lane_candidates.length > 0, "lane candidates exist");
  assert.ok(seed.lane_candidates.every((lane) => lane.thread_target));
  assert.ok(seed.lane_candidates.every((lane) => lane.repo_target));
  assert.ok(seed.lane_candidates.every((lane) => lane.scope && lane.mode && lane.role));
  assert.ok(seed.evidence_requirements.length > 0);
  assert.ok(seed.expected_closeout_artifacts.length > 0);
  assert.ok(copy.includes("Planning seed is not routed work."));
  assert.ok(copy.includes("Planning seed is not implementation authorization."));
}

function testForbiddenActiveCapabilityMetadataAbsent() {
  const serialized = JSON.stringify(JAI_CONTROL_THREAD_MOTION_PROPOSAL_SURFACE, null, 2);

  for (const forbidden of [
    "jaiControlThreadRuntimeActivation",
    "jaiCouncilActivation",
    "jaiAgentActivation",
    "providerDispatch",
    "modelDispatch",
    "apiDispatch",
    "githubMutation",
    "targetRepoMutation",
    "targetRepoImport",
    "acceptedCodeImport",
    "deployment",
    "productionGate",
    "sourceOfTruthTransfer",
    "hiddenAutomation",
    "backgroundJob",
    "polling",
    "timer",
    "automaticRouteExecution",
    "automaticDelivery",
    "acceptanceAuthorityTransfer",
    "executionAuthorityTransfer",
    "registryMutation",
    "dnsChange",
    "registrarAction",
    "renewalAction",
    "publicLaunch",
  ]) {
    assert.ok(!serialized.includes(`"${forbidden}"`), `Forbidden metadata key ${forbidden}`);
  }
}

function testExports() {
  const json = buildJaiControlThreadMotionProposalJson();
  const markdown = buildJaiControlThreadMotionProposalMarkdown();

  assert.ok(json.includes("motion-proposal-a7-static-draft-v0"));
  assert.ok(markdown.includes("Motion-To-Program Planning Seed"));
  assert.ok(markdown.includes("CONTROL_THREAD remains routing/acceptance/hold authority."));
}

function run() {
  testMotionProposalModelCoverage();
  testOperatorIntakePosture();
  testCouncilAdvisoryHandoffPosture();
  testAdvisoryVoteReviewCandidatePosture();
  testMotionToProgramPlanningSeedPosture();
  testForbiddenActiveCapabilityMetadataAbsent();
  testExports();
}

run();
