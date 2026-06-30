import { MOTION_KERNEL_NON_AUTHORIZATIONS } from "./lifecycle";
import { getMotionKernelModelSlot } from "./model-slots";
import { getJaiRoleSlot } from "./role-slots";
import {
  RATIFICATION_VALUES,
  VOTE_VALUES,
  type DeliberationParticipantOutput,
  type ModelSlotDeliberationRequest,
  type RatificationValue,
  type VoteValue,
} from "./types";

export function normalizeProviderParticipantOutput({
  request,
  rawOutput,
}: {
  request: ModelSlotDeliberationRequest;
  rawOutput: unknown;
}): DeliberationParticipantOutput {
  const roleSlot = getJaiRoleSlot(request.roleSlotId);
  const modelSlot = getMotionKernelModelSlot(request.modelSlotId);

  if (!isRecord(rawOutput)) {
    return createMalformedProviderOutput(
      request,
      "Provider output was missing or not an object.",
    );
  }

  const critiqueSummary = readString(rawOutput.critiqueSummary);
  const voteValue = readVoteValue(rawOutput.voteValue);
  const ratificationRecommendation = readRatificationValue(
    rawOutput.ratificationRecommendation,
  );
  const requiredRevisions = readStringArray(rawOutput.requiredRevisions);
  const blockers = readStringArray(rawOutput.blockers);
  const confidenceReadinessNote = readString(rawOutput.confidenceReadinessNote);

  const missingRequired =
    !critiqueSummary || !voteValue || !ratificationRecommendation;

  if (missingRequired) {
    return createMalformedProviderOutput(
      request,
      "Provider output could not be normalized into the required participant contract.",
    );
  }

  return {
    roleSlotId: roleSlot.id,
    modelSlotId: modelSlot.id,
    critiqueSummary,
    voteValue,
    ratificationRecommendation,
    requiredRevisions,
    blockers,
    confidenceReadinessNote:
      confidenceReadinessNote ||
      "Provider output normalized; human review remains required.",
    nonAuthorizations: [
      ...MOTION_KERNEL_NON_AUTHORIZATIONS,
      "Provider output is advisory only.",
      "Provider connector is server-side only.",
      "Provider mode is disabled by default.",
      "Mock mode remains default.",
    ],
    advisoryOnly: true,
  };
}

export function createMalformedProviderOutput(
  request: ModelSlotDeliberationRequest,
  reason: string,
): DeliberationParticipantOutput {
  const roleSlot = getJaiRoleSlot(request.roleSlotId);
  const modelSlot = getMotionKernelModelSlot(request.modelSlotId);

  return {
    roleSlotId: roleSlot.id,
    modelSlotId: modelSlot.id,
    critiqueSummary:
      "Provider output could not be safely normalized; advisory fallback requires revision.",
    voteValue: "blocked",
    ratificationRecommendation: "needs_revision",
    requiredRevisions: [
      reason,
      "Return critiqueSummary, voteValue, ratificationRecommendation, requiredRevisions, blockers, confidenceReadinessNote, and nonAuthorizations.",
    ],
    blockers: ["Malformed provider output cannot imply approval or execution."],
    confidenceReadinessNote:
      "Not ready for ratification; provider output normalization failed safely.",
    nonAuthorizations: [
      ...MOTION_KERNEL_NON_AUTHORIZATIONS,
      "Provider output is advisory only.",
      "Provider connector is server-side only.",
      "Provider mode is disabled by default.",
      "Mock mode remains default.",
    ],
    advisoryOnly: true,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readVoteValue(value: unknown): VoteValue | null {
  if (typeof value !== "string") {
    return null;
  }
  return VOTE_VALUES.includes(value as VoteValue) ? (value as VoteValue) : null;
}

function readRatificationValue(value: unknown): RatificationValue | null {
  if (typeof value !== "string") {
    return null;
  }
  return RATIFICATION_VALUES.includes(value as RatificationValue)
    ? (value as RatificationValue)
    : null;
}
