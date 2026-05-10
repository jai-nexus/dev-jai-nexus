import type { AgentRegistryAgent } from "@/lib/agents/types";
import type {
  DeliberationAdvisoryVote,
  DeliberationCandidate,
  DeliberationConfidence,
  DeliberationRecommendationPosture,
} from "@/lib/agents/deliberationTypes";

export interface DeterministicDeliberationLens {
  role_lens: string;
  evidence_basis: string[];
  confidence: DeliberationConfidence;
  recommendation_posture: DeliberationRecommendationPosture;
  dissent_or_caution: string | null;
  reasoning: string[];
}

type DeliberationContext = {
  in_scope: boolean;
  broad_agent: boolean;
  has_disabled_action: boolean;
  has_preview_only_action: boolean;
};

function baseEvidenceBasis(
  agent: AgentRegistryAgent,
  candidate: Omit<DeliberationCandidate, "advisory" | "consensus" | "next_step_prompt">,
  context: DeliberationContext,
): string[] {
  const basis = ["authority posture"];

  if (candidate.source_kind === "motion") basis.push("motion package");
  if (candidate.source_kind === "work_packet") basis.push("operator route inspection");
  if (candidate.verification_commands.length > 0) basis.push("validation gates");
  if (candidate.planned_toolchain_target) basis.push("control-thread passalong");
  if (agent.key === "jai-verifier") basis.push("validation gates");
  if (agent.key === "jai-operator") basis.push("control-thread passalong");
  if (context.has_preview_only_action || context.has_disabled_action) {
    basis.push("authority posture");
  }

  return Array.from(new Set(basis));
}

function confidenceForContext(
  context: DeliberationContext,
  candidate: Omit<DeliberationCandidate, "advisory" | "consensus" | "next_step_prompt">,
): DeliberationConfidence {
  if (context.has_disabled_action) return "low";
  if (candidate.planned_toolchain_target || candidate.source_kind === "project") return "medium";
  if (context.has_preview_only_action || !context.in_scope) return "medium";
  return "high";
}

function postureFromVote(vote: DeliberationAdvisoryVote): DeliberationRecommendationPosture {
  if (vote === "support") return "support";
  if (vote === "support_with_caution") return "support_with_caution";
  if (vote === "defer") return "defer";
  return "hold";
}

export function buildDeterministicDeliberationLens(
  agent: AgentRegistryAgent,
  candidate: Omit<DeliberationCandidate, "advisory" | "consensus" | "next_step_prompt">,
  vote: DeliberationAdvisoryVote,
  context: DeliberationContext,
): DeterministicDeliberationLens {
  const evidence_basis = baseEvidenceBasis(agent, candidate, context);
  const confidence = confidenceForContext(context, candidate);
  const recommendation_posture = postureFromVote(vote);

  if (agent.key === "jai-architect") {
    return {
      role_lens: "architecture fit, system coherence, repo/domain alignment",
      evidence_basis,
      confidence,
      recommendation_posture,
      dissent_or_caution:
        !context.in_scope || candidate.planned_toolchain_target
          ? "Architecture fit stays advisory until the target is aligned to an active control-plane seam."
          : null,
      reasoning: [
        `This candidate lands on ${candidate.target.repo_full_name} / ${candidate.target.surface.label}, so the main architecture question is whether it reinforces the current control-plane structure without opening a new subsystem.`,
        context.in_scope
          ? "Repo and surface targeting fit the visible control-plane map, so the structure is coherent for deterministic planning."
          : "Repo or surface targeting sits outside the configured scope map, so the structure is only loosely aligned and should not be advanced as an active seam.",
        "The architecture bar here is coherence with the control-plane domain, not feature expansion or runtime activation.",
      ],
    };
  }

  if (agent.key === "jai-builder") {
    return {
      role_lens: "implementation path, file/path feasibility, scoped build plan",
      evidence_basis,
      confidence,
      recommendation_posture,
      dissent_or_caution:
        context.has_preview_only_action
          ? "Implementation remains preview-only; file planning is credible, but no repo mutation path is authorized."
          : context.has_disabled_action
            ? "Requested actions outrun the current build posture, so implementation should hold until scope is narrowed."
            : null,
      reasoning: [
        `The likely implementation seam is bounded to ${candidate.target.repo_full_name} and the ${candidate.target.surface.label} surface, so the build question is whether the path stays narrow and inspectable.`,
        context.has_disabled_action
          ? "At least one requested action is outside the currently allowed build posture, so this is not execution-ready even if the target is understandable."
          : "The requested actions stay inside planning or preview posture, so the implementation path is feasible as a scoped build plan only.",
        "A credible next step names touched files and verification commands without implying branch creation or execution.",
      ],
    };
  }

  if (agent.key === "jai-verifier") {
    return {
      role_lens: "evidence quality, validation gates, failure modes",
      evidence_basis: Array.from(new Set([...evidence_basis, "validation gates"])),
      confidence,
      recommendation_posture,
      dissent_or_caution:
        candidate.verification_commands.length === 0
          ? "Validation evidence is thin until explicit gates are named."
          : context.has_disabled_action
            ? "Failure mode remains authority mismatch rather than test failure."
            : null,
      reasoning: [
        `The evidence question is whether ${candidate.title} has enough visible gates and failure checks to justify a non-binding recommendation.`,
        candidate.verification_commands.length > 0
          ? `Verification is grounded by ${candidate.verification_commands.length} listed command or gate entries, which is enough for read-only evidence review.`
          : "Verification commands are missing, so the recommendation should stay weak and documentation-only.",
        "The most likely failure mode is not runtime breakage here; it is over-reading advisory planning as if it were execution authorization.",
      ],
    };
  }

  if (agent.key === "jai-librarian") {
    return {
      role_lens: "canon/docs/index impact, source-of-truth handling",
      evidence_basis: Array.from(new Set([...evidence_basis, "motion package"])),
      confidence,
      recommendation_posture,
      dissent_or_caution:
        candidate.source_kind === "manual"
          ? "Manual candidates should stay reference-only until tied to a clearer canon surface."
          : null,
      reasoning: [
        `The canon question is whether ${candidate.title} should become settled operator guidance, stay as reference material, or remain deferred.`,
        candidate.source_kind === "motion"
          ? "Because this already points back to a motion seam, the safe path is to preserve source-of-truth continuity and avoid inventing new canon from the transcript alone."
          : "This candidate should only harden into canon if a later motion or settled operator route explicitly carries it forward.",
        "Deliberation output itself is not source-of-truth; it is an index and framing aid for later governed work.",
      ],
    };
  }

  if (agent.key === "jai-operator") {
    return {
      role_lens: "routing, authority boundaries, next-step sequencing",
      evidence_basis: Array.from(new Set([...evidence_basis, "control-thread passalong"])),
      confidence,
      recommendation_posture,
      dissent_or_caution:
        candidate.planned_toolchain_target
          ? "Planned toolchain targets can only be passed along as copy-only routing material."
          : context.has_disabled_action
            ? "Routing should pause until the request fits a bounded authority-disabled seam."
            : null,
      reasoning: [
        `The operator question is not "can this run" but "what is the next bounded lane for ${candidate.title} without expanding authority."`,
        context.has_disabled_action
          ? "Current requested actions do not fit the active posture, so sequencing should hold or narrow scope before any next lane is opened."
          : "This candidate can move only as passalong, planning, or review output routed through existing CONTROL_THREAD / REPO_EXECUTION boundaries.",
        "Sequencing stays credible when the next step is explicit and non-authorizing.",
      ],
    };
  }

  if (agent.key === "jai-proposer") {
    return {
      role_lens: "motion framing and acceptance clarity",
      evidence_basis,
      confidence,
      recommendation_posture,
      dissent_or_caution:
        candidate.source_kind === "manual"
          ? "Manual candidates need extra framing discipline so they do not read like implicit motions."
          : null,
      reasoning: [
        `The framing question is whether ${candidate.title} states a clear bounded problem, clear scope, and clear acceptance without smuggling in execution authority.`,
        candidate.source_kind === "motion"
          ? "Because the candidate already has motion lineage, the proposal quality hinges on whether the follow-up seam stays smaller than the parent motion."
          : "The proposal posture is credible when acceptance can be expressed as display-only, planning-only, or evidence-only outcomes.",
        "A good deliberation recommendation should make the next motion easier to write, not broader.",
      ],
    };
  }

  if (agent.key === "jai-challenger") {
    return {
      role_lens: "risks, dissent, overreach detection",
      evidence_basis,
      confidence,
      recommendation_posture,
      dissent_or_caution:
        context.has_disabled_action
          ? "This candidate is currently overreaching the allowed posture."
          : candidate.planned_toolchain_target
            ? "Toolchain visibility could be misread as integration if the caution is not explicit."
            : "Keep the dissent lens visible so planning does not get mistaken for permission.",
      reasoning: [
        `The challenge lens asks what part of ${candidate.title} could be over-read, under-validated, or routed too early.`,
        context.has_disabled_action
          ? "The strongest dissent is scope overreach: the requested action set goes past the currently allowed posture."
          : "The main risk is rhetorical overreach, where deterministic copy starts sounding like a live agent decision system.",
        "A credible challenge turn should leave a caution trail even when the candidate is otherwise supportable.",
      ],
    };
  }

  if (agent.key === "jai-arbiter") {
    return {
      role_lens: "synthesis, decision posture, tie-break framing",
      evidence_basis,
      confidence,
      recommendation_posture,
      dissent_or_caution:
        recommendation_posture === "defer" || recommendation_posture === "hold"
          ? "Decision posture should hold until the scope and evidence basis stop competing with the authority boundary."
          : null,
      reasoning: [
        `The arbiter lens synthesizes whether ${candidate.title} is the most defensible next step once architecture, build, evidence, canon, and routing concerns are compared together.`,
        recommendation_posture === "support" || recommendation_posture === "support_with_caution"
          ? "The synthesis supports continuing only as deterministic, non-binding operator guidance."
          : "The synthesis does not justify advancing this candidate beyond defer/hold posture in the current seam.",
        "Tie-break framing favors the option that is clearest to route and hardest to misread as authority.",
      ],
    };
  }

  return {
    role_lens: "deterministic role review",
    evidence_basis,
    confidence,
    recommendation_posture,
    dissent_or_caution: null,
    reasoning: [
      `${candidate.title} is being reviewed under a generic deterministic posture because no specific role lens was defined for ${agent.label}.`,
    ],
  };
}
