import type { AgentDomainEngineNamespace, AgentQuorumStatus, AgentVoteClass } from "./roleTemplates";

export type AgentVote = {
  agentNamespace: string;
  voteClass: AgentVoteClass;
  evidence: string;
  advisoryOnly: true;
};

export type AgentVoteBundle = {
  voteBundleId: string;
  routeType: "development" | "docs/canon" | "security/gate" | "no-consensus";
  domainEngine: AgentDomainEngineNamespace;
  participatingAgents: string[];
  votes: AgentVote[];
  quorum: {
    requiredRoles: string[];
    optionalRoles: string[];
    status: AgentQuorumStatus;
    automaticApproval: false;
  };
  dissent: string[];
  blockers: string[];
  readinessEffect: string;
  controlThreadReviewRequired: true;
  boundary: string;
};

const voteBoundary =
  "Agent votes are evidence, not authority. Agent votes do not decide. Quorum is readiness evidence, not approval.";

export const agentVoteBundles = [
  {
    voteBundleId: "VOTE-BUNDLE-DEV-0001",
    routeType: "development",
    domainEngine: "JAI::DEV",
    participatingAgents: [
      "JAI::PROJECT::JAI_NEXUS::DEV::BUILDER",
      "JAI::PROJECT::JAI_NEXUS::DEV::VERIFIER",
      "JAI::PROJECT::JAI_NEXUS::DEV::CHALLENGER",
    ],
    votes: [
      {
        agentNamespace: "JAI::PROJECT::JAI_NEXUS::DEV::BUILDER",
        voteClass: "APPROVE_RECOMMENDATION",
        evidence: "Plan draft is bounded and compose-only.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::PROJECT::JAI_NEXUS::DEV::VERIFIER",
        voteClass: "NEEDS_MORE_EVIDENCE",
        evidence: "Validation transcript is not yet attached.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::PROJECT::JAI_NEXUS::DEV::CHALLENGER",
        voteClass: "RISK_FLAG",
        evidence: "Repo mutation and branch creation remain blocked.",
        advisoryOnly: true,
      },
    ],
    quorum: {
      requiredRoles: ["BUILDER", "VERIFIER", "CHALLENGER"],
      optionalRoles: ["ROLLBACK_PLANNER"],
      status: "QUORUM_COMPLETE_NOT_APPROVAL",
      automaticApproval: false,
    },
    dissent: ["Verifier requires validation evidence before readiness claims."],
    blockers: ["No execution gate", "No repo gate", "No receipt design"],
    readinessEffect: "Readiness evidence collected; CONTROL_THREAD review still required.",
    controlThreadReviewRequired: true,
    boundary: voteBoundary,
  },
  {
    voteBundleId: "VOTE-BUNDLE-DOCS-0002",
    routeType: "docs/canon",
    domainEngine: "JAI::DOCS",
    participatingAgents: [
      "JAI::DOCS::SYNTHESIZER",
      "JAI::DOCS::ARCHIVIST",
      "JAI::DOCS::CANON_BOUNDARY_REVIEWER",
    ],
    votes: [
      {
        agentNamespace: "JAI::DOCS::SYNTHESIZER",
        voteClass: "SAFE_ALTERNATIVE_PROPOSED",
        evidence: "Keep artifact as docs/reference until receipt classes exist.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::DOCS::ARCHIVIST",
        voteClass: "REQUEST_REVISION",
        evidence: "Lineage note should cite accepted doctrine dependency.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::DOCS::CANON_BOUNDARY_REVIEWER",
        voteClass: "OUT_OF_SCOPE",
        evidence: "Canon update is not authorized by static data branch.",
        advisoryOnly: true,
      },
    ],
    quorum: {
      requiredRoles: ["SYNTHESIZER", "ARCHIVIST", "CANON_BOUNDARY_REVIEWER"],
      optionalRoles: ["CHALLENGER"],
      status: "QUORUM_COMPLETE_NOT_APPROVAL",
      automaticApproval: false,
    },
    dissent: ["Canon boundary reviewer rejects any canon-update implication."],
    blockers: ["No receipt authority", "No canon update authority"],
    readinessEffect: "Docs readiness can improve after lineage revision; no canon progression.",
    controlThreadReviewRequired: true,
    boundary: voteBoundary,
  },
  {
    voteBundleId: "VOTE-BUNDLE-SECURITY-0003",
    routeType: "security/gate",
    domainEngine: "JAI::SECURITY",
    participatingAgents: [
      "JAI::SECURITY::GATE_REVIEWER",
      "JAI::SECURITY::ABUSE_CASE_REVIEWER",
      "JAI::SECURITY::PRIVACY_BOUNDARY_REVIEWER",
      "JAI::AUDIT::RISK_REVIEWER",
    ],
    votes: [
      {
        agentNamespace: "JAI::SECURITY::GATE_REVIEWER",
        voteClass: "BLOCKER_RAISED",
        evidence: "Execution gate is undefined.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::SECURITY::ABUSE_CASE_REVIEWER",
        voteClass: "CONTRADICTION_FOUND",
        evidence: "Executor-candidate wording could be mistaken for runner authority.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::SECURITY::PRIVACY_BOUNDARY_REVIEWER",
        voteClass: "REJECT_RECOMMENDATION",
        evidence: "Customer-data boundary evidence is missing.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::AUDIT::RISK_REVIEWER",
        voteClass: "DEFER",
        evidence: "Audit receipt class is not accepted.",
        advisoryOnly: true,
      },
    ],
    quorum: {
      requiredRoles: ["GATE_REVIEWER", "ABUSE_CASE_REVIEWER", "PRIVACY_BOUNDARY_REVIEWER", "AUDITOR"],
      optionalRoles: ["ROLLBACK_PLANNER"],
      status: "BLOCKED_BY_DISSENT",
      automaticApproval: false,
    },
    dissent: ["Privacy reviewer rejects customer-data readiness."],
    blockers: ["No security gate", "No execution gate", "No privacy boundary receipt"],
    readinessEffect: "Gate route is blocked in v0.",
    controlThreadReviewRequired: true,
    boundary: voteBoundary,
  },
  {
    voteBundleId: "VOTE-BUNDLE-NO-CONSENSUS-0004",
    routeType: "no-consensus",
    domainEngine: "JAI::COUNCIL",
    participatingAgents: [
      "JAI::COUNCIL::DELIBERATOR",
      "JAI::COUNCIL::DISSENT_PRESERVER",
      "JAI::COUNCIL::CONTRADICTION_FINDER",
    ],
    votes: [
      {
        agentNamespace: "JAI::COUNCIL::DELIBERATOR",
        voteClass: "ABSTAIN",
        evidence: "Insufficient evidence for route readiness.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::COUNCIL::DISSENT_PRESERVER",
        voteClass: "DISSENT",
        evidence: "Consensus would hide unresolved execution-gate risk.",
        advisoryOnly: true,
      },
      {
        agentNamespace: "JAI::COUNCIL::CONTRADICTION_FINDER",
        voteClass: "CONTRADICTION_FOUND",
        evidence: "Palette recommendation text conflicts with no-creation boundary if worded as assignment.",
        advisoryOnly: true,
      },
    ],
    quorum: {
      requiredRoles: ["DELIBERATOR", "DISSENT_PRESERVER", "CONTRADICTION_FINDER"],
      optionalRoles: ["SYNTHESIS_REVIEWER"],
      status: "NO_CONSENSUS",
      automaticApproval: false,
    },
    dissent: ["Dissent must remain visible and no synthesis override is allowed."],
    blockers: ["No consensus", "Contradiction present", "CONTROL_THREAD review required"],
    readinessEffect: "No automatic progression; records readiness deficit.",
    controlThreadReviewRequired: true,
    boundary: voteBoundary,
  },
] as const satisfies AgentVoteBundle[];
