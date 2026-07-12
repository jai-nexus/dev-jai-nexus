export interface SyntheticPassalongPayload {
  passalongRecord: {
    passalongId: string;
    sourceThread: string;
    targetThread: string;
    scope: string;
    mode: string;
    summary: string;
    evidencePointers: string[];
    requestedDecision: string;
    status: string;
    authorityBoundary: string;
    nonAuthorizations: string[];
  };
}

export interface SyntheticMotionIntakePayload {
  draft: {
    title: string;
    proposer: string;
    targetThread: string;
    repoTarget: string;
    purpose: string;
    scope: string;
    requestedOutcome: string;
    risks: string;
    constraints: string;
    evidencePointers: string;
    nonAuthorizations: string;
  };
}

export interface SyntheticManualInferencePayload {
  motionId?: string;
  mode?: "mock" | "env_gated_provider";
  roleSlotIds?: string[];
  modelSlotId?: string;
  motionBasis?: {
    id: string;
    title: string;
    summary: string;
    lifecycleStatus: string;
    roleSlotIds: string[];
    evidencePointers: Array<{ id: string; ref: string; summary: string }>;
    controlThread: {
      id: string;
      label: string;
      scope: string;
      authorityNote: string;
    };
    repoThread: {
      id: string;
      repo: string;
      scope: string;
      authorityNote: string;
    };
  };
}

export const ROUTE_HARNESS_NON_AUTHORIZATIONS = [
  "CONTROL_THREAD remains authority.",
  "Human / CONTROL_THREAD approval remains required.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No Linear mutation.",
  "No target-repo import.",
  "No deployment.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No automatic route execution.",
  "No automatic delivery.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
] as const;

export const syntheticPassalongPayload: SyntheticPassalongPayload = {
  passalongRecord: {
    passalongId: "a35-local-passalong-fixture",
    sourceThread: "thread-control-thread",
    targetThread: "thread-dev-jai-nexus",
    scope: "A35 local route-handler seam fixture only.",
    mode: "LOCAL_ONLY_ROUTE_BOUNDARY_TEST",
    summary:
      "Synthetic passalong payload for local route-boundary seam validation.",
    evidencePointers: [
      "docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md",
    ],
    requestedDecision:
      "CONTROL_THREAD review required; fixture does not route work.",
    status: "draft",
    authorityBoundary:
      "Synthetic passalong fixture is not CONTROL_THREAD acceptance.",
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  },
};

export const invalidPassalongPayload = {
  input: {
    passalongId: "",
    summary: "Invalid local fixture should not be persisted.",
  },
};

export const syntheticMotionIntakePayload: SyntheticMotionIntakePayload = {
  draft: {
    title: "A35 local route harness motion fixture",
    proposer: "manual_operator",
    targetThread: "JAI_CONTROL_THREAD",
    repoTarget: "dev-jai-nexus",
    purpose: "Exercise local route-boundary response posture.",
    scope: "Synthetic fixture only; no routed work.",
    requestedOutcome:
      "Produce local-only evidence without activation or external mutation.",
    risks:
      "Fixture output could be misread as routed work unless non-authorizations are asserted.",
    constraints:
      "No provider dispatch, no deployed database, no GitHub or Linear mutation.",
    evidencePointers:
      "A35 local route-handler seam implementation fixture.",
    nonAuthorizations: ROUTE_HARNESS_NON_AUTHORIZATIONS.join("\n"),
  },
};

export const missingMotionDraftPayload = {};

export const mockDefaultManualInferencePayload: SyntheticManualInferencePayload = {
  motionId: "motion-kernel-a35-local-fixture",
  roleSlotIds: ["jai-counsel"],
  modelSlotId: "model-slot-mock-deliberator",
};

export const providerDisabledManualInferencePayload:
  SyntheticManualInferencePayload = {
    ...mockDefaultManualInferencePayload,
    mode: "env_gated_provider",
  };

export const providerConfigMissingManualInferencePayload:
  SyntheticManualInferencePayload = {
    ...providerDisabledManualInferencePayload,
    motionBasis: {
      id: "motion-kernel-a35-config-missing-fixture",
      title: "A35 provider config missing fixture",
      summary:
        "Synthetic motion basis for provider-config-missing seam validation.",
      lifecycleStatus: "draft",
      roleSlotIds: ["jai-counsel"],
      evidencePointers: [
        {
          id: "a35-local-fixture",
          ref: "local://a35-provider-config-missing",
          summary: "Synthetic local-only evidence pointer.",
        },
      ],
      controlThread: {
        id: "control-thread-a35-fixture",
        label: "A35 CONTROL_THREAD fixture",
        scope: "Local-only provider seam validation.",
        authorityNote:
          "Synthetic motion basis is not CONTROL_THREAD acceptance.",
      },
      repoThread: {
        id: "repo-thread-a35-fixture",
        repo: "dev-jai-nexus",
        scope: "Local-only route-handler seam validation.",
        authorityNote: "Repo-thread fixture is not repo execution authority.",
      },
    },
  };

export function createJsonRequest(path: string, body: unknown): Request {
  return new Request(`http://local.test${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function assertFixturesAreSecretFree() {
  const serialized = JSON.stringify([
    syntheticPassalongPayload,
    invalidPassalongPayload,
    syntheticMotionIntakePayload,
    missingMotionDraftPayload,
    mockDefaultManualInferencePayload,
    providerDisabledManualInferencePayload,
    providerConfigMissingManualInferencePayload,
  ]);
  const forbidden = [
    "api_key",
    "apikey",
    "secret:",
    "token:",
    "password:",
    "DATABASE_URL",
    "postgres://",
    "sk-",
    "raw .env",
    "private reasoning",
    "target repo source",
    "production telemetry",
  ];

  for (const value of forbidden) {
    if (serialized.includes(value)) {
      throw new Error(`Fixture contains forbidden secret marker: ${value}`);
    }
  }
}
