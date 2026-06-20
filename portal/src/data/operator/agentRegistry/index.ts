export { agentRoleTemplates } from "./roleTemplates";
export type {
  AgentAllowedAction,
  AgentBlockedAction,
  AgentDomainEngineNamespace,
  AgentPostureLabel,
  AgentQuorumStatus,
  AgentRegistryStatus,
  AgentRoleTemplate,
  AgentTemplateNamespace,
  AgentVoteClass,
  PaletteRecommendationStatus,
  ProjectAgentCandidateStatus,
  RepoRiskTreatment,
  TierAgentClass,
} from "./roleTemplates";

export { agentDomainEngines } from "./domainEngines";
export type { AgentDomainEngine } from "./domainEngines";

export { agentRepoDomainScope, agentServiceDomainScope } from "./repoDomainScope";
export type { RepoRegistryRecord, ServiceDomainRecord } from "./repoDomainScope";

export { projectAgentCandidates, tierAgentModel } from "./projectAgentCandidates";
export type { ProjectAgentCandidate, TierAgentModelRecord } from "./projectAgentCandidates";

export { paletteAgentRecommendations } from "./paletteRecommendations";
export type { PaletteAgentRecommendation } from "./paletteRecommendations";

export { agentVoteBundles } from "./agentVotes";
export type { AgentVote, AgentVoteBundle } from "./agentVotes";

import { agentVoteBundles } from "./agentVotes";
import { agentDomainEngines } from "./domainEngines";
import { paletteAgentRecommendations } from "./paletteRecommendations";
import { projectAgentCandidates, tierAgentModel } from "./projectAgentCandidates";
import { agentRepoDomainScope, agentServiceDomainScope } from "./repoDomainScope";
import { agentRoleTemplates } from "./roleTemplates";

export const agentRegistryStaticData = {
  posture: {
    source: "STATIC / READ-ONLY",
    runtime: "NO-RUNTIME",
    execution: "NO-EXECUTION",
    gates: "ZERO GATES GRANTED",
    boundary: "Static data does not activate Agents, dispatch Agents, invoke tools, create receipts, update canon, or open gates.",
  },
  roleTemplates: agentRoleTemplates,
  domainEngines: agentDomainEngines,
  serviceDomains: agentServiceDomainScope,
  repoDomainScope: agentRepoDomainScope,
  tierAgentModel,
  projectAgentCandidates,
  paletteRecommendations: paletteAgentRecommendations,
  voteBundles: agentVoteBundles,
} as const;
