export const COMPANY_ASSET_DOMAIN_REGISTRY_POSTURE = {
  mode: "APP_LOCAL / LOCAL_STATIC_DISPLAY_METADATA / NON_AUTHORITATIVE",
  sourcePosture:
    "Corrected registry display model is local-static candidate metadata only; current dev.jai.nexus registry is not final company canon unless CONTROL_THREAD accepts it.",
  controlThreadStatus: "CONTROL_THREAD_REVIEW_REQUIRED",
} as const;

export const RENEWAL_EXPIRATION_RISK_POSTURES = [
  "expiration_unknown",
  "no_known_risk",
  "watch",
  "renewal_due_soon",
  "urgent_renewal_risk",
  "expired_or_unconfirmed",
  "registrar_account_unknown",
  "evidence_required",
] as const;

export const PUBLIC_READINESS_POSTURES = [
  "not_assessed",
  "internal_only",
  "parked_or_reserved",
  "DNS_planned",
  "DNS_ready",
  "app_planned",
  "app_staged",
  "internal_preview",
  "public_candidate",
  "public_ready_pending_CONTROL_THREAD",
  "public_live_confirmed",
] as const;

export const COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY = [
  "Registry display is not company canon unless CONTROL_THREAD accepts it.",
  "Registry display is not DNS authority.",
  "Registry display is not registrar authority.",
  "Registry display is not renewal authority.",
  "Registry display is not deployment authority.",
  "Registry display is not production authority.",
  "Registry display is not source-of-truth transfer.",
  "Renewal-risk display is not renewal action.",
  "Public-readiness display is not public launch.",
  "Repo binding display is not repo mutation or import.",
  "Domain asset is not automatically a repo.",
  "Domain concept is not automatically a deployed app.",
  "Engine group is not automatically a repository.",
  "Repo binding can be many-to-many.",
] as const;

export interface RegistryEvidenceRef {
  id: string;
  label: string;
  ref: string;
  source_posture: "repo-local" | "route-context-grounded" | "current-registry" | "unknown";
}

export interface OwnedDomainAssetDisplay {
  domain_asset_id: string;
  domain_name: string;
  ownership_status: "candidate_review_required" | "unknown" | "current_registry_reference";
  registrar: string;
  registration_account_label: string;
  expiration_date: string;
  renewal_status: string;
  renewal_risk_level: (typeof RENEWAL_EXPIRATION_RISK_POSTURES)[number];
  dns_provider: string;
  nameserver_posture: string;
  dns_change_authority: string;
  public_readiness_posture: (typeof PUBLIC_READINESS_POSTURES)[number];
  linked_domain_concepts: readonly string[];
  linked_engine_groups: readonly string[];
  linked_environments: readonly string[];
  linked_repo_bindings: readonly string[];
  evidence_refs: readonly RegistryEvidenceRef[];
  control_thread_status: string;
  authority_boundary_summary: string;
}

export interface DomainConceptDisplay {
  domain_concept_id: string;
  concept_name: string;
  product_or_surface_label: string;
  intended_user_surface: string;
  public_or_internal_posture: string;
  related_domain_assets: readonly string[];
  related_engine_groups: readonly string[];
  related_repos: readonly string[];
  related_environments: readonly string[];
  readiness_status: string;
  evidence_refs: readonly RegistryEvidenceRef[];
  authority_boundary_summary: string;
}

export interface DomainEngineGroupDisplay {
  engine_group_id: string;
  engine_group_name: string;
  engine_group_type: string;
  responsibility: string;
  related_domain_concepts: readonly string[];
  related_domain_assets: readonly string[];
  candidate_repos: readonly string[];
  required_services: readonly string[];
  public_readiness_posture: (typeof PUBLIC_READINESS_POSTURES)[number];
  control_thread_status: string;
  evidence_refs: readonly RegistryEvidenceRef[];
  authority_boundary_summary: string;
}

export interface RepositoryBindingDisplay {
  binding_id: string;
  repo: string;
  binding_type: string;
  linked_domain_asset_ids: readonly string[];
  linked_domain_concept_ids: readonly string[];
  linked_engine_group_ids: readonly string[];
  linked_environment_ids: readonly string[];
  binding_status: string;
  evidence_refs: readonly RegistryEvidenceRef[];
  limitations: readonly string[];
  authority_boundary_summary: string;
}

export interface EnvironmentBindingDisplay {
  environment_id: string;
  environment_name: string;
  environment_type: string;
  related_domain_assets: readonly string[];
  related_domain_concepts: readonly string[];
  related_repos: readonly string[];
  deployment_status: string;
  public_access_status: string;
  dns_status: string;
  evidence_refs: readonly RegistryEvidenceRef[];
  authority_boundary_summary: string;
}

const a1Evidence: RegistryEvidenceRef = {
  id: "A1",
  label: "Company Asset and Domain Registry Reconciliation Planning v0",
  ref: "docs/reference/q3m7-company-asset-domain-registry-reconciliation-planning-v0.md",
  source_posture: "repo-local",
};

const currentRegistryEvidence: RegistryEvidenceRef = {
  id: "current-domain-registry",
  label: "Current dev.jai.nexus domain registry surfaces",
  ref: "portal/src/app/domains/page.tsx; portal/src/app/operator/registry/domains/page.tsx",
  source_posture: "current-registry",
};

export const OWNED_DOMAIN_ASSET_DISPLAY: readonly OwnedDomainAssetDisplay[] = [
  {
    domain_asset_id: "domain-asset-dev-jai-nexus-candidate",
    domain_name: "dev.jai.nexus",
    ownership_status: "candidate_review_required",
    registrar: "unknown",
    registration_account_label: "unknown",
    expiration_date: "unknown",
    renewal_status: "evidence_required",
    renewal_risk_level: "registrar_account_unknown",
    dns_provider: "unknown",
    nameserver_posture: "unknown",
    dns_change_authority: "CONTROL_THREAD review required; no DNS action in A6.",
    public_readiness_posture: "internal_preview",
    linked_domain_concepts: ["domain-concept-dev-jai-nexus-operator"],
    linked_engine_groups: ["engine-group-frontend-nexus", "engine-group-helper-nexus"],
    linked_environments: ["environment-dev-jai-nexus-app-local"],
    linked_repo_bindings: ["binding-dev-jai-nexus-operator-surface"],
    evidence_refs: [a1Evidence, currentRegistryEvidence],
    control_thread_status: "review_required",
    authority_boundary_summary:
      "Candidate domain asset display only; not DNS, registrar, renewal, deployment, production, or source-of-truth authority.",
  },
  {
    domain_asset_id: "domain-asset-jai-nexus-candidate",
    domain_name: "jai.nexus",
    ownership_status: "candidate_review_required",
    registrar: "unknown",
    registration_account_label: "unknown",
    expiration_date: "unknown",
    renewal_status: "evidence_required",
    renewal_risk_level: "evidence_required",
    dns_provider: "unknown",
    nameserver_posture: "unknown",
    dns_change_authority: "CONTROL_THREAD review required; no DNS action in A6.",
    public_readiness_posture: "not_assessed",
    linked_domain_concepts: ["domain-concept-jai-nexus-product-family"],
    linked_engine_groups: ["engine-group-frontend-nexus", "engine-group-backend-nexus"],
    linked_environments: ["environment-public-candidate-review"],
    linked_repo_bindings: ["binding-jai-nexus-product-family"],
    evidence_refs: [a1Evidence, currentRegistryEvidence],
    control_thread_status: "review_required",
    authority_boundary_summary:
      "Candidate domain asset display only; current registry visibility is not final company canon.",
  },
] as const;

export const DOMAIN_CONCEPT_DISPLAY: readonly DomainConceptDisplay[] = [
  {
    domain_concept_id: "domain-concept-dev-jai-nexus-operator",
    concept_name: "dev.jai.nexus operator cockpit",
    product_or_surface_label: "Operator and governance surface",
    intended_user_surface: "internal operator",
    public_or_internal_posture: "internal_only",
    related_domain_assets: ["domain-asset-dev-jai-nexus-candidate"],
    related_engine_groups: ["engine-group-frontend-nexus", "engine-group-helper-nexus"],
    related_repos: ["dev-jai-nexus"],
    related_environments: ["environment-dev-jai-nexus-app-local"],
    readiness_status: "display_model_candidate",
    evidence_refs: [a1Evidence],
    authority_boundary_summary:
      "Domain concept is not automatically an owned domain, repository, deployed app, or public launch authority.",
  },
  {
    domain_concept_id: "domain-concept-jai-nexus-product-family",
    concept_name: "JAI NEXUS product/control family",
    product_or_surface_label: "Product and control-plane family concept",
    intended_user_surface: "public candidate pending governance",
    public_or_internal_posture: "public_candidate",
    related_domain_assets: ["domain-asset-jai-nexus-candidate"],
    related_engine_groups: ["engine-group-frontend-nexus", "engine-group-backend-nexus"],
    related_repos: ["jai-nexus", "dev-jai-nexus"],
    related_environments: ["environment-public-candidate-review"],
    readiness_status: "not_assessed",
    evidence_refs: [a1Evidence],
    authority_boundary_summary:
      "Public candidate concept does not authorize public launch, deployment, DNS change, or production gates.",
  },
] as const;

export const DOMAIN_ENGINE_GROUP_DISPLAY: readonly DomainEngineGroupDisplay[] = [
  {
    engine_group_id: "engine-group-frontend-nexus",
    engine_group_name: "frontend-nexus",
    engine_group_type: "frontend concept group",
    responsibility: "Candidate UI and public/internal surface responsibility grouping.",
    related_domain_concepts: [
      "domain-concept-dev-jai-nexus-operator",
      "domain-concept-jai-nexus-product-family",
    ],
    related_domain_assets: [
      "domain-asset-dev-jai-nexus-candidate",
      "domain-asset-jai-nexus-candidate",
    ],
    candidate_repos: ["dev-jai-nexus", "jai-nexus"],
    required_services: ["operator display", "governance copy", "readiness display"],
    public_readiness_posture: "public_candidate",
    control_thread_status: "review_required",
    evidence_refs: [a1Evidence],
    authority_boundary_summary:
      "Engine group is a domain-engine concept, not automatically a repository or runtime engine.",
  },
  {
    engine_group_id: "engine-group-backend-nexus",
    engine_group_name: "backend-nexus",
    engine_group_type: "backend concept group",
    responsibility: "Candidate backend/service responsibility grouping.",
    related_domain_concepts: ["domain-concept-jai-nexus-product-family"],
    related_domain_assets: ["domain-asset-jai-nexus-candidate"],
    candidate_repos: ["api-nexus", "orchestrator-nexus", "jai-nexus"],
    required_services: ["service contract planning", "registry evidence", "authority review"],
    public_readiness_posture: "not_assessed",
    control_thread_status: "review_required",
    evidence_refs: [a1Evidence],
    authority_boundary_summary:
      "Backend engine concept does not create API behavior, provider dispatch, deployment, or production gates.",
  },
  {
    engine_group_id: "engine-group-helper-nexus",
    engine_group_name: "helper-nexus",
    engine_group_type: "helper concept group",
    responsibility: "Candidate helper/tooling responsibility grouping.",
    related_domain_concepts: ["domain-concept-dev-jai-nexus-operator"],
    related_domain_assets: ["domain-asset-dev-jai-nexus-candidate"],
    candidate_repos: ["dev-jai-nexus", "jai-format", "audit-nexus"],
    required_services: ["format review", "audit evidence", "operator support"],
    public_readiness_posture: "internal_only",
    control_thread_status: "review_required",
    evidence_refs: [a1Evidence],
    authority_boundary_summary:
      "Helper engine concept is not a repo and does not activate agents, tools, or runtime behavior.",
  },
] as const;

export const REPOSITORY_BINDING_DISPLAY: readonly RepositoryBindingDisplay[] = [
  {
    binding_id: "binding-dev-jai-nexus-operator-surface",
    repo: "dev-jai-nexus",
    binding_type: "serves / displays / governs",
    linked_domain_asset_ids: [
      "domain-asset-dev-jai-nexus-candidate",
      "domain-asset-jai-nexus-candidate",
    ],
    linked_domain_concept_ids: [
      "domain-concept-dev-jai-nexus-operator",
      "domain-concept-jai-nexus-product-family",
    ],
    linked_engine_group_ids: ["engine-group-frontend-nexus", "engine-group-helper-nexus"],
    linked_environment_ids: [
      "environment-dev-jai-nexus-app-local",
      "environment-public-candidate-review",
    ],
    binding_status: "candidate_many_to_many_display",
    evidence_refs: [a1Evidence, currentRegistryEvidence],
    limitations: [
      "Current Prisma Domain model has one optional repo relation.",
      "This display binding models corrected many-to-many posture only.",
    ],
    authority_boundary_summary:
      "Repo binding display does not mutate repos, import target repos, or transfer source-of-truth authority.",
  },
  {
    binding_id: "binding-jai-nexus-product-family",
    repo: "jai-nexus",
    binding_type: "product family candidate",
    linked_domain_asset_ids: ["domain-asset-jai-nexus-candidate"],
    linked_domain_concept_ids: ["domain-concept-jai-nexus-product-family"],
    linked_engine_group_ids: ["engine-group-frontend-nexus", "engine-group-backend-nexus"],
    linked_environment_ids: ["environment-public-candidate-review"],
    binding_status: "candidate_many_to_many_display",
    evidence_refs: [a1Evidence],
    limitations: ["Binding is candidate display metadata only."],
    authority_boundary_summary:
      "Candidate binding is not GitHub mutation, target-repo mutation, target-repo import, or deployment authority.",
  },
] as const;

export const ENVIRONMENT_BINDING_DISPLAY: readonly EnvironmentBindingDisplay[] = [
  {
    environment_id: "environment-dev-jai-nexus-app-local",
    environment_name: "dev.jai.nexus app-local operator surface",
    environment_type: "app-local",
    related_domain_assets: ["domain-asset-dev-jai-nexus-candidate"],
    related_domain_concepts: ["domain-concept-dev-jai-nexus-operator"],
    related_repos: ["dev-jai-nexus"],
    deployment_status: "current display surface; deployment authority not granted",
    public_access_status: "internal_preview",
    dns_status: "not verified by A6",
    evidence_refs: [a1Evidence, currentRegistryEvidence],
    authority_boundary_summary:
      "Environment display is not deployment, DNS, runtime, production, or source-of-truth authority.",
  },
  {
    environment_id: "environment-public-candidate-review",
    environment_name: "public candidate review posture",
    environment_type: "review posture",
    related_domain_assets: ["domain-asset-jai-nexus-candidate"],
    related_domain_concepts: ["domain-concept-jai-nexus-product-family"],
    related_repos: ["jai-nexus", "dev-jai-nexus"],
    deployment_status: "not authorized",
    public_access_status: "public_candidate",
    dns_status: "evidence_required",
    evidence_refs: [a1Evidence],
    authority_boundary_summary:
      "Public candidate environment posture is not public launch, deployment, DNS change, or production gate authority.",
  },
] as const;

export const COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL = {
  posture: COMPANY_ASSET_DOMAIN_REGISTRY_POSTURE,
  ownedDomainAssets: OWNED_DOMAIN_ASSET_DISPLAY,
  domainConcepts: DOMAIN_CONCEPT_DISPLAY,
  domainEngineGroups: DOMAIN_ENGINE_GROUP_DISPLAY,
  repositoryBindings: REPOSITORY_BINDING_DISPLAY,
  environments: ENVIRONMENT_BINDING_DISPLAY,
  renewalExpirationRiskPostures: RENEWAL_EXPIRATION_RISK_POSTURES,
  publicReadinessPostures: PUBLIC_READINESS_POSTURES,
  authorityBoundaryCopy: COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY,
} as const;

export function summarizeCompanyAssetDomainRegistryDisplayModel(): string {
  return [
    `${OWNED_DOMAIN_ASSET_DISPLAY.length} domain asset candidates`,
    `${DOMAIN_CONCEPT_DISPLAY.length} domain concepts`,
    `${DOMAIN_ENGINE_GROUP_DISPLAY.length} domain-engine groups`,
    `${REPOSITORY_BINDING_DISPLAY.length} many-to-many repo bindings`,
    `${ENVIRONMENT_BINDING_DISPLAY.length} environment postures`,
    "non-authoritative display model only",
  ].join("; ");
}
