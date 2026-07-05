export const SUPERVISED_ROUTE_PACKET_SCHEMA_VERSION = "b5.v0" as const;

export const SUPERVISED_ROUTE_PACKET_LIFECYCLE_STATUSES = [
  "draft",
  "exported",
  "held",
] as const;

export type SupervisedRoutePacketLifecycleStatus =
  (typeof SUPERVISED_ROUTE_PACKET_LIFECYCLE_STATUSES)[number];

export interface SupervisedRoutePacketEvidenceReference {
  id: string;
  label: string;
  reference: string;
}

export interface SupervisedRoutePacketInput {
  packetId: string;
  program: string;
  batch: string;
  wave: string;
  lane: string;
  sourceThread: string;
  sourceRepoOrSurface: string;
  targetRepo: string;
  targetSurface: string;
  targetMode: string;
  scope: string;
  purpose: string;
  requestedAction: string;
  expectedOutputShape: string;
  evidenceReferences: SupervisedRoutePacketEvidenceReference[];
  guardrails: string[];
  nonAuthorizations: string[];
  manualHandoffInstructions: string;
  createdAt: string;
  lifecycleStatus: SupervisedRoutePacketLifecycleStatus;
  controlThreadAuthority: string;
  advisoryNonAuthoritative: string;
}

export interface SupervisedRoutePacket
  extends SupervisedRoutePacketInput {
  schemaVersion: typeof SUPERVISED_ROUTE_PACKET_SCHEMA_VERSION;
  outputPosture: "manual_handoff_only";
  sandboxNexusCompatibility: {
    fixtureCompatible: true;
    intakePosture: "future_fixture_planning_only";
    runtimeActivation: "not_authorized";
  };
}

export const SUPERVISED_ROUTE_PACKET_AUTHORITY_STATEMENT =
  "CONTROL_THREAD remains the acceptance authority; this packet is advisory until CONTROL_THREAD acceptance.";

export const SUPERVISED_ROUTE_PACKET_ADVISORY_STATEMENT =
  "This route packet is app-local, non-authoritative, and not source of truth.";

export const SUPERVISED_ROUTE_PACKET_MANUAL_HANDOFF =
  "Export or copy this packet manually for future sandbox-nexus fixture intake planning; no automatic send or dispatch occurs.";

export const SUPERVISED_ROUTE_PACKET_GUARDRAILS = [
  "Manual export / handoff only.",
  "No provider/model/API dispatch.",
  "No sandbox runtime activation.",
  "No sandbox task execution.",
  "No autonomous JAI Agent activation.",
  "No GitHub automation.",
  "No target-repo mutation.",
  "No target-repo import.",
  "No accepted-code import.",
  "No deployment or production gate opening.",
] as const;

export const SUPERVISED_ROUTE_PACKET_NON_AUTHORIZATIONS = [
  "No automatic send.",
  "No automatic route execution.",
  "No provider/model/API call.",
  "No sandbox-nexus runtime activation.",
  "No sandbox task execution.",
  "No JAI Agent activation.",
  "No target-repo mutation.",
  "No target-repo import.",
  "No accepted-code import.",
  "No GitHub automation.",
  "No PR automation.",
  "No deployed database migration.",
  "No migration application.",
  "No deployed database mutation.",
  "No deployment.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden/background automation.",
] as const;

export function buildSupervisedRoutePacket(
  input: SupervisedRoutePacketInput,
): SupervisedRoutePacket {
  return {
    ...input,
    evidenceReferences: input.evidenceReferences.map((reference) => ({
      id: reference.id.trim(),
      label: reference.label.trim(),
      reference: reference.reference.trim(),
    })),
    guardrails: input.guardrails.map((guardrail) => guardrail.trim()).filter(Boolean),
    nonAuthorizations: input.nonAuthorizations
      .map((nonAuthorization) => nonAuthorization.trim())
      .filter(Boolean),
    schemaVersion: SUPERVISED_ROUTE_PACKET_SCHEMA_VERSION,
    outputPosture: "manual_handoff_only",
    sandboxNexusCompatibility: {
      fixtureCompatible: true,
      intakePosture: "future_fixture_planning_only",
      runtimeActivation: "not_authorized",
    },
  };
}

export function buildSupervisedRoutePacketJson(
  packet: SupervisedRoutePacket,
): string {
  return JSON.stringify(packet, null, 2);
}

export function buildSupervisedRoutePacketMarkdown(
  packet: SupervisedRoutePacket,
): string {
  const evidence = packet.evidenceReferences
    .map(
      (reference) =>
        `- ${reference.id}: ${reference.label} (${reference.reference})`,
    )
    .join("\n");
  const guardrails = packet.guardrails
    .map((guardrail) => `- ${guardrail}`)
    .join("\n");
  const nonAuthorizations = packet.nonAuthorizations
    .map((nonAuthorization) => `- ${nonAuthorization}`)
    .join("\n");

  return [
    `# ${packet.packetId}`,
    "",
    "## Route",
    "",
    `- Program: ${packet.program}`,
    `- Batch: ${packet.batch}`,
    `- Wave: ${packet.wave}`,
    `- Lane: ${packet.lane}`,
    `- Source thread: ${packet.sourceThread}`,
    `- Source repo/surface: ${packet.sourceRepoOrSurface}`,
    `- Target repo: ${packet.targetRepo}`,
    `- Target surface: ${packet.targetSurface}`,
    `- Target mode: ${packet.targetMode}`,
    `- Lifecycle status: ${packet.lifecycleStatus}`,
    "",
    "## Scope",
    "",
    packet.scope,
    "",
    "## Purpose",
    "",
    packet.purpose,
    "",
    "## Requested Action",
    "",
    packet.requestedAction,
    "",
    "## Expected Output Shape",
    "",
    packet.expectedOutputShape,
    "",
    "## Evidence References",
    "",
    evidence || "- None",
    "",
    "## Manual Handoff Instructions",
    "",
    packet.manualHandoffInstructions,
    "",
    "## Authority",
    "",
    packet.controlThreadAuthority,
    "",
    "## Advisory / Non-Authoritative Posture",
    "",
    packet.advisoryNonAuthoritative,
    "",
    "## Guardrails",
    "",
    guardrails || "- None",
    "",
    "## Non-Authorizations",
    "",
    nonAuthorizations || "- None",
    "",
    "## Sandbox-Nexus Compatibility",
    "",
    "- Fixture-compatible for future intake planning only.",
    "- Runtime activation is not authorized.",
  ].join("\n");
}

export function createDefaultSupervisedRoutePacketInput(
  createdAt = "static-generated-marker",
): SupervisedRoutePacketInput {
  return {
    packetId: "b5-supervised-route-packet-draft-v0",
    program: "Q3M7Y26 JAI Motion Control Plane Activation v0",
    batch: "B",
    wave: "B-A",
    lane: "B5",
    sourceThread: "JAI_Control_Thread",
    sourceRepoOrSurface: "dev-jai-nexus / operator / control-thread",
    targetRepo: "sandbox-nexus",
    targetSurface: "supervised fixture intake",
    targetMode: "manual_handoff_fixture_planning_only",
    scope: "Supervised route-packet composer/export proof for sandbox-nexus fixture planning.",
    purpose:
      "Create a structured packet that can be previewed, exported, copied, and manually handed off for a future sandbox-nexus intake contract.",
    requestedAction:
      "Review the packet as a manual fixture candidate; do not execute, dispatch, import, mutate, deploy, or open gates.",
    expectedOutputShape:
      "Structured sandbox-nexus intake acknowledgement or closeout fixture in a future separately routed lane.",
    evidenceReferences: [
      {
        id: "B4",
        label: "Control Plane Sandbox Stress-Test Pivot Decision v0",
        reference:
          "docs/reference/q3m7-control-plane-sandbox-stress-test-pivot-decision-v0.md",
      },
    ],
    guardrails: [...SUPERVISED_ROUTE_PACKET_GUARDRAILS],
    nonAuthorizations: [...SUPERVISED_ROUTE_PACKET_NON_AUTHORIZATIONS],
    manualHandoffInstructions: SUPERVISED_ROUTE_PACKET_MANUAL_HANDOFF,
    createdAt,
    lifecycleStatus: "draft",
    controlThreadAuthority: SUPERVISED_ROUTE_PACKET_AUTHORITY_STATEMENT,
    advisoryNonAuthoritative: SUPERVISED_ROUTE_PACKET_ADVISORY_STATEMENT,
  };
}
