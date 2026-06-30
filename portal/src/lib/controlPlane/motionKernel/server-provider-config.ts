import "server-only";

import type { ProviderConnectorSafeStatus } from "./types";

const PROVIDER_ENV = {
  enabled: "JAI_MODEL_SLOT_LIVE_INFERENCE_ENABLED",
  provider: "JAI_MODEL_SLOT_PROVIDER",
  model: "JAI_MODEL_SLOT_MODEL",
  credential: "JAI_MODEL_SLOT_API_KEY",
} as const;

interface ServerProviderConfig {
  enabled: boolean;
  provider: string | null;
  model: string | null;
  credential: string | null;
}

export function getServerProviderConfig(): ServerProviderConfig {
  return {
    enabled: process.env[PROVIDER_ENV.enabled] === "true",
    provider: normalizeEnv(process.env[PROVIDER_ENV.provider]),
    model: normalizeEnv(process.env[PROVIDER_ENV.model]),
    credential: normalizeEnv(process.env[PROVIDER_ENV.credential]),
  };
}

export function getSafeProviderStatus(): ProviderConnectorSafeStatus {
  const config = getServerProviderConfig();
  const providerConfigured = Boolean(
    config.enabled && config.provider && config.model && config.credential,
  );

  if (!config.enabled) {
    return {
      liveInferenceEnabled: false,
      providerConfigured: false,
      providerKeyPresent: Boolean(config.credential),
      providerName: config.provider,
      modelName: config.model,
      mode: "provider_disabled",
      advisoryMessage:
        "Live provider inference is disabled; mock mode remains default.",
    };
  }

  if (!config.provider || !config.model || !config.credential) {
    return {
      liveInferenceEnabled: true,
      providerConfigured: false,
      providerKeyPresent: Boolean(config.credential),
      providerName: config.provider,
      modelName: config.model,
      mode: "provider_config_missing",
      advisoryMessage:
        "Live provider inference is enabled but required provider config is missing.",
    };
  }

  return {
    liveInferenceEnabled: true,
    providerConfigured,
    providerKeyPresent: true,
    providerName: config.provider,
    modelName: config.model,
    mode: "provider_configured",
    advisoryMessage:
      "Live provider inference is configured for manual server-side invocation.",
  };
}

export function getServerProviderCredentialForConnector(): string | null {
  return getServerProviderConfig().credential;
}

function normalizeEnv(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
