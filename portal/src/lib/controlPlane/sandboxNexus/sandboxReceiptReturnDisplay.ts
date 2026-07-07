import {
  JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
} from "../jaiPalette/sandboxAgentDraft";

export interface SandboxReceiptReturnDisplay {
  sourceLane: "B34";
  reviewLane: "B35";
  selectedPacket: {
    packetId: string;
    packetPath: string;
    packetScope: string;
  };
  intakePosture: {
    intakeMode: readonly string[];
    intakeStatus: string;
    intakeFinding: string;
    sourcePosture: string;
  };
  fieldSummary: {
    acceptedFields: readonly string[];
    rejectedFields: readonly string[];
    blockedFields: readonly string[];
  };
  guardrailFindings: readonly string[];
  caveats: readonly string[];
  receiptPosture: {
    advisoryOnly: string;
    nonAuthoritative: string;
    nonExecuting: string;
    controlThreadReviewRequired: string;
  };
  controlThreadCopy: readonly string[];
  boundaryCopy: readonly string[];
}

export const SANDBOX_RECEIPT_RETURN_BOUNDARY_COPY = [
  "No receipt ingestion.",
  "No automatic import.",
  "No sandbox-nexus calls.",
  "No automatic sync.",
  "No API routes.",
  "No database migration.",
  "No runtime behavior.",
  "No packet execution.",
  "No sandbox task execution.",
  "No JAI Agent activation.",
  "No provider/model/API dispatch.",
  "No GitHub/API mutation.",
  "No target-repo mutation/import.",
  "No accepted-code import.",
  "No deployment.",
  "No production gates.",
  "No source-of-truth transfer.",
  "No hidden/background automation.",
  "No timers.",
  "No polling.",
  "No background jobs.",
  "No automatic route execution.",
  "No automatic delivery.",
  "No acceptance authority transfer.",
  "No execution authority transfer.",
] as const;

export const SANDBOX_RECEIPT_RETURN_DISPLAY: SandboxReceiptReturnDisplay = {
  sourceLane: "B34",
  reviewLane: "B35",
  selectedPacket: {
    packetId: "q3m7-b31-mock-sandbox-packet-local-001",
    packetPath: ".nexus/packet-intake/examples/mock-sandbox-packet-v0.yaml",
    packetScope:
      "Selected static mock packet from the accepted B34/B35 baseline.",
  },
  intakePosture: {
    intakeMode: [
      "manual",
      "fixture-bound",
      "test-data-only",
      "sandbox-local",
    ],
    intakeStatus: "accepted for advisory fixture review",
    intakeFinding:
      "All required field classes were present and accepted for advisory fixture review.",
    sourcePosture:
      "B34 dry run posture is manual, fixture-bound, test-data-only, sandbox-local, non-authoritative, non-executing, and advisory-only.",
  },
  fieldSummary: {
    acceptedFields: [
      "all required field classes",
      "selected packet id",
      "selected packet path",
      "manual intake posture",
      "advisory receipt posture",
    ],
    rejectedFields: ["none"],
    blockedFields: ["none"],
  },
  guardrailFindings: [
    "B34 remained manual.",
    "B34 remained fixture-bound.",
    "B34 remained test-data-only.",
    "B34 remained sandbox-local.",
    "B34 remained non-authoritative.",
    "B34 remained non-executing.",
    "B34 remained advisory-only.",
    "B34 produced advisory receipt output only.",
  ],
  caveats: [
    "Finding applies only to selected static mock packet.",
    "B35 evidence was passalong-grounded and not locally artifact-grounded in audit-nexus.",
    "This caveat does not create source-of-truth transfer.",
  ],
  receiptPosture: {
    advisoryOnly: "Receipt return display is advisory only.",
    nonAuthoritative: "Receipt return display is non-authoritative.",
    nonExecuting: "Receipt return display is non-executing.",
    controlThreadReviewRequired:
      "CONTROL_THREAD review/accept/hold remains required.",
  },
  controlThreadCopy: [
    JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
    "CONTROL_THREAD review/accept/hold remains required before any acceptance posture changes.",
    "B36 display does not transfer acceptance authority.",
    "B36 display does not transfer execution authority.",
  ],
  boundaryCopy: SANDBOX_RECEIPT_RETURN_BOUNDARY_COPY,
} as const;

export function buildSandboxReceiptReturnDisplayMarkdown(
  display: SandboxReceiptReturnDisplay = SANDBOX_RECEIPT_RETURN_DISPLAY,
): string {
  return [
    "# Sandbox Receipt Return Display",
    "",
    `- Source lane: ${display.sourceLane}`,
    `- Review lane: ${display.reviewLane}`,
    `- Selected packet id: ${display.selectedPacket.packetId}`,
    `- Selected packet path: ${display.selectedPacket.packetPath}`,
    "",
    "## Intake Posture",
    "",
    listMarkdown(display.intakePosture.intakeMode),
    "",
    display.intakePosture.intakeFinding,
    "",
    "## Field Summary",
    "",
    `- Accepted: ${display.fieldSummary.acceptedFields.join(", ")}`,
    `- Rejected: ${display.fieldSummary.rejectedFields.join(", ")}`,
    `- Blocked: ${display.fieldSummary.blockedFields.join(", ")}`,
    "",
    "## Caveats",
    "",
    listMarkdown(display.caveats),
    "",
    "## Receipt Posture",
    "",
    listMarkdown(Object.values(display.receiptPosture)),
    "",
    "## Boundary Copy",
    "",
    listMarkdown(display.boundaryCopy),
  ].join("\n");
}

function listMarkdown(values: readonly string[]): string {
  return values.map((value) => `- ${value}`).join("\n");
}
