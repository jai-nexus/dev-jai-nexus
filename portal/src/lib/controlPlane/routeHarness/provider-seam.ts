import { ROUTE_HARNESS_NON_AUTHORIZATIONS } from "./fixtures";

export type ProviderSeamMode =
  | "provider_disabled"
  | "provider_config_missing";

export interface ProviderSeamStatus {
  liveInferenceEnabled: boolean;
  providerConfigured: false;
  providerKeyPresent: false;
  providerName: string | null;
  modelName: string | null;
  mode: ProviderSeamMode;
  advisoryMessage: string;
}

export interface ProviderSeamResult {
  status: ProviderSeamStatus;
  nonAuthorityDisclaimer: string;
  providerDispatchAttempted: false;
  networkAccessRequired: false;
  nonAuthorizations: string[];
}

export function createProviderDisabledSeam(): ProviderSeamResult {
  return {
    status: {
      liveInferenceEnabled: false,
      providerConfigured: false,
      providerKeyPresent: false,
      providerName: null,
      modelName: null,
      mode: "provider_disabled",
      advisoryMessage:
        "Live provider inference is disabled; mock mode remains default.",
    },
    nonAuthorityDisclaimer:
      "Provider-disabled seam returned safe mock fallback; no live provider call was made.",
    providerDispatchAttempted: false,
    networkAccessRequired: false,
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  };
}

export function createProviderConfigMissingSeam(): ProviderSeamResult {
  return {
    status: {
      liveInferenceEnabled: true,
      providerConfigured: false,
      providerKeyPresent: false,
      providerName: "openai",
      modelName: null,
      mode: "provider_config_missing",
      advisoryMessage:
        "Live provider inference is enabled but required provider config is missing.",
    },
    nonAuthorityDisclaimer:
      "Provider-config-missing seam did not run a provider connector.",
    providerDispatchAttempted: false,
    networkAccessRequired: false,
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  };
}

export function assertNoLiveProviderDispatch(result: ProviderSeamResult) {
  if (result.providerDispatchAttempted || result.networkAccessRequired) {
    throw new Error("Provider seam attempted live provider dispatch.");
  }
  if (result.status.providerConfigured || result.status.providerKeyPresent) {
    throw new Error("Provider seam unexpectedly contains provider config.");
  }
}
