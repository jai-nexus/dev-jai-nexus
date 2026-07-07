import {
  JAI_PALETTE_ADVISORY_STATEMENT,
  JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  JAI_SANDBOX_AGENT_CLASS_PROFILES,
  type JaiSandboxAgentClass,
} from "../jaiPalette/sandboxAgentDraft";
import {
  SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY,
} from "./sandboxNexusSurface";

export interface SandboxPacketMotionOption {
  motionId: string;
  motionName: string;
  motionCategory: string;
  motionPurpose: string;
  requiredFixtureClass: string;
  requiredSandboxRoleClass: JaiSandboxAgentClass;
  allowedInputCategories: string[];
  blockedAuthorityCategories: string[];
  draftExportEligibility: string;
  controlThreadReviewStatusPlaceholder: string;
  boundary: string;
}

export interface SandboxPacketFixtureOption {
  fixtureId: string;
  fixtureName: string;
  fixtureCategory: string;
  sourcePacketPosture: string;
  expectedInputFields: readonly string[];
  rejectedFieldCategories: readonly string[];
  blockedFieldCategories: readonly string[];
  guardrailStatus: string;
  compatibilityPosture: string;
  noAutomaticIntakePosture: string;
  noSandboxExecutionPosture: string;
  noRouteExecutionPosture: string;
  boundary: string;
}

export interface SandboxPacketRoleClassOption {
  roleClassId: JaiSandboxAgentClass;
  roleClassName: string;
  jaiRoleLabel: string;
  candidateResponsibility: string;
  allowedPacketFields: string[];
  blockedPacketFields: string[];
  authorityLimits: string[];
  jaiPaletteRelationship: string;
  candidateMetadataOnlyPosture: string;
  noJaiAgentActivationPosture: string;
  noAutonomousExecutionPosture: string;
}

export interface SandboxPacketDraft {
  packetIdPlaceholder: string;
  packetType: "sandbox_packet_candidate";
  selectedSandboxMotion: SandboxPacketMotionOption;
  selectedFixture: SandboxPacketFixtureOption;
  selectedSandboxRoleClass: SandboxPacketRoleClassOption;
  allowedInputsSummary: string[];
  blockedAuthoritiesSummary: string[];
  advisoryOutputRequest: string;
  receiptExpectation: string;
  controlThreadReviewHandoff: string;
  exportMetadata: {
    exportFormat: "json_and_markdown_preview";
    manualOperatorExportOnly: string;
    operatorReviewedLabel: string;
    advisoryOnlyLabel: string;
  };
  nonAuthorizationCopy: string[];
}

export const SANDBOX_PACKET_ALLOWED_INPUT_CATEGORIES = [
  "selected motion id",
  "selected fixture id",
  "selected role/class id",
  "operator note placeholder",
  "packet purpose",
  "advisory expected output",
  "review request",
  "receipt placeholder",
] as const;

export const SANDBOX_PACKET_ALLOWED_INPUT_BOUNDARY_COPY = [
  "Allowed inputs are non-secret planning metadata only.",
  "No secret collection occurs.",
  "No input persistence occurs.",
  "No input transmission occurs.",
  "No parser authority is created.",
  "No schema enforcement authority is created.",
  "No runtime execution authority is created.",
  "No source-of-truth authority is created.",
] as const;

export const SANDBOX_PACKET_BLOCKED_AUTHORITIES = [
  "automatic send",
  "sandbox runtime activation",
  "sandbox task execution",
  "fixture execution",
  "stress-test execution",
  "closeout generation",
  "provider/model/API dispatch",
  "GitHub API mutation",
  "target-repo mutation/import",
  "accepted-code import",
  "automatic intake",
  "automatic route execution",
  "external import",
  "sandbox-nexus calls",
  "API routes",
  "database migration",
  "deployment",
  "production gates",
  "source-of-truth transfer",
  "hidden/background automation",
  "timers",
  "polling",
  "background jobs",
] as const;

export const SANDBOX_PACKET_MOTION_OPTIONS: SandboxPacketMotionOption[] = [
  {
    motionId: "sandbox-motion-fixture-closeout-review-b29",
    motionName: "Fixture Closeout Packet Review",
    motionCategory: "fixture review / closeout review",
    motionPurpose:
      "Draft a non-authoritative packet for future sandbox-local fixture and closeout inspection.",
    requiredFixtureClass: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureCategory,
    requiredSandboxRoleClass: "JAI::SANDBOX::CLOSEOUT_AGENT",
    allowedInputCategories: [...SANDBOX_PACKET_ALLOWED_INPUT_CATEGORIES],
    blockedAuthorityCategories: [...SANDBOX_PACKET_BLOCKED_AUTHORITIES],
    draftExportEligibility:
      "eligible for manual operator export preview only",
    controlThreadReviewStatusPlaceholder:
      "pending CONTROL_THREAD review / accept / hold decision",
    boundary:
      "Motion selection is advisory display only; no motion execution, route execution, sandbox runtime activation, or send to sandbox-nexus.",
  },
  {
    motionId: "sandbox-motion-stress-guardrail-review-b29",
    motionName: "Stress Guardrail Packet Review",
    motionCategory: "stress planning / guardrail review",
    motionPurpose:
      "Draft a non-authoritative packet for future supervised stress and guardrail review.",
    requiredFixtureClass: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureCategory,
    requiredSandboxRoleClass: "JAI::SANDBOX::STRESS_AGENT",
    allowedInputCategories: [...SANDBOX_PACKET_ALLOWED_INPUT_CATEGORIES],
    blockedAuthorityCategories: [...SANDBOX_PACKET_BLOCKED_AUTHORITIES],
    draftExportEligibility:
      "eligible for manual operator export preview only",
    controlThreadReviewStatusPlaceholder:
      "pending CONTROL_THREAD review / accept / hold decision",
    boundary:
      "Motion selection is advisory display only; no stress-test execution, route execution, sandbox runtime activation, or send to sandbox-nexus.",
  },
] as const satisfies SandboxPacketMotionOption[];

export const SANDBOX_PACKET_FIXTURE_OPTIONS: SandboxPacketFixtureOption[] = [
  {
    fixtureId: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureId,
    fixtureName: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureName,
    fixtureCategory: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureCategory,
    sourcePacketPosture:
      SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.sourcePacketPosture,
    expectedInputFields:
      SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.expectedInputFields,
    rejectedFieldCategories: [
      "secrets or credentials",
      "provider keys",
      "GitHub tokens",
      "deployment data",
      "DNS records",
    ],
    blockedFieldCategories:
      SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.blockedFieldCategories,
    guardrailStatus: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.guardrailStatus,
    compatibilityPosture:
      "fixture/manual compatibility only; not source-of-truth validation",
    noAutomaticIntakePosture:
      SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.noAutomaticIntake,
    noSandboxExecutionPosture:
      SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.noSandboxExecution,
    noRouteExecutionPosture:
      SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.noRouteExecution,
    boundary:
      "Fixture selection does not ingest fixtures, execute fixtures, validate source of truth, or route anything automatically.",
  },
] as const satisfies SandboxPacketFixtureOption[];

const SANDBOX_PACKET_ROLE_CLASS_IDS: JaiSandboxAgentClass[] = [
  "JAI::SANDBOX::INTAKE_AGENT",
  "JAI::SANDBOX::FIXTURE_AGENT",
  "JAI::SANDBOX::CLOSEOUT_AGENT",
  "JAI::SANDBOX::STRESS_AGENT",
  "JAI::SANDBOX::GUARDRAIL_AGENT",
];

export const SANDBOX_PACKET_ROLE_CLASS_OPTIONS: SandboxPacketRoleClassOption[] =
  SANDBOX_PACKET_ROLE_CLASS_IDS.map((roleClassId) => {
    const profile = JAI_SANDBOX_AGENT_CLASS_PROFILES[roleClassId];

    return {
      roleClassId,
      roleClassName: profile.defaultName,
      jaiRoleLabel: roleClassId,
      candidateResponsibility: profile.coverageResponsibility,
      allowedPacketFields: [
        "packet id placeholder",
        "packet purpose",
        "selected motion id",
        "selected fixture id",
        "selected role/class id",
        "advisory expected output",
        "review request",
        "receipt placeholder",
      ],
      blockedPacketFields: [
        "secret-bearing fields",
        "credential fields",
        "runtime activation fields",
        "sandbox task fields",
        "provider/model/API dispatch fields",
        "GitHub API mutation fields",
        "target-repo mutation/import fields",
        "accepted-code import fields",
        "deployment fields",
        "production gate fields",
      ],
      authorityLimits: [
        "No acceptance authority.",
        "No route authority.",
        "No activation authority.",
        "No executable authority.",
        "No source-of-truth authority.",
        "No closeout generation authority.",
        "No production authority.",
      ],
      jaiPaletteRelationship:
        "Local JAI Palette sandbox class/profile relationship only.",
      candidateMetadataOnlyPosture:
        "Role/class selection is candidate metadata only; not active, live, executing, accepted, or authoritative.",
      noJaiAgentActivationPosture:
        "Role/class selection does not activate a JAI Agent.",
      noAutonomousExecutionPosture:
        "Role/class selection does not create autonomous execution.",
    };
  });

export const SANDBOX_PACKET_CONTROL_THREAD_HANDOFF_COPY = [
  "Operator selects motion, fixture, and role/class.",
  "Operator inspects allowed inputs and blocked authorities.",
  "Operator previews the sandbox packet draft.",
  "Operator manually exports the packet preview.",
  "Downstream sandbox-local handling requires a separate route.",
  "Receipt display remains advisory until CONTROL_THREAD review.",
  "CONTROL_THREAD may accept, reject, or hold.",
  "No automatic route execution or hidden automation is allowed.",
] as const;

export const SANDBOX_PACKET_EXPORT_LABELS = [
  "Advisory-only manual export preview.",
  "No automatic send.",
  "No sandbox-nexus call.",
  "No GitHub API mutation.",
  "No target-repo mutation.",
  "No accepted-code import.",
] as const;

export const SANDBOX_PACKET_RECEIPT_POSTURE = {
  receiptIdPlaceholder: "sandbox-packet-receipt-placeholder-b29",
  packetIdRelationship: "relates to the manual packet id placeholder only",
  receiptSourcePosture: "advisory display source; no receipt ingestion",
  receivedStatus: "candidate / held / rejected display placeholder",
  acceptedFields: [
    "packet id placeholder",
    "receipt id placeholder",
    "review status placeholder",
    "non-secret evidence reference",
  ],
  rejectedFields: [
    "secrets",
    "credentials",
    "runtime activation fields",
    "repo mutation fields",
    "deployment fields",
  ],
  heldFields: [
    "CONTROL_THREAD review decision",
    "receipt recommendation",
    "blocker disposition",
  ],
  blockers: [
    "No receipt ingestion.",
    "No closeout generation.",
    "No packet acceptance.",
    "No route authority.",
    "No runtime authority.",
    "No source-of-truth transfer.",
  ],
  nonAuthorizationsPreserved: [...SANDBOX_PACKET_BLOCKED_AUTHORITIES],
  recommendation:
    "Hold as advisory display until CONTROL_THREAD separately reviews packet and receipt posture.",
  controlThreadReviewStatusPlaceholder:
    "pending CONTROL_THREAD review / accept / hold decision",
  posture:
    "Receipt posture is advisory display only; not receipt ingestion, delivery proof, acceptance, route authority, runtime authority, closeout generation, or source-of-truth transfer.",
} as const;

export const SANDBOX_PACKET_CONTROL_SURFACE_POSTURE = {
  surfaceName: "sandbox packet control surface",
  posture:
    "app-local / local-static display-export draft metadata / manual operator export only / non-authoritative",
  authority: JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  advisory: JAI_PALETTE_ADVISORY_STATEMENT,
  sandboxNexusRelationship:
    "sandbox-nexus remains future sandbox-local target posture only; no calls, imports, sync, runtime activation, or sandbox task execution.",
} as const;

export function createDefaultSandboxPacketDraft(): SandboxPacketDraft {
  return buildSandboxPacketDraft({
    motion: SANDBOX_PACKET_MOTION_OPTIONS[0],
    fixture: SANDBOX_PACKET_FIXTURE_OPTIONS[0],
    roleClass: SANDBOX_PACKET_ROLE_CLASS_OPTIONS[2],
  });
}

export function buildSandboxPacketDraft({
  motion,
  fixture,
  roleClass,
}: {
  motion: SandboxPacketMotionOption;
  fixture: SandboxPacketFixtureOption;
  roleClass: SandboxPacketRoleClassOption;
}): SandboxPacketDraft {
  return {
    packetIdPlaceholder: "sandbox-packet-draft-placeholder-b29",
    packetType: "sandbox_packet_candidate",
    selectedSandboxMotion: motion,
    selectedFixture: fixture,
    selectedSandboxRoleClass: roleClass,
    allowedInputsSummary: [...SANDBOX_PACKET_ALLOWED_INPUT_CATEGORIES],
    blockedAuthoritiesSummary: [...SANDBOX_PACKET_BLOCKED_AUTHORITIES],
    advisoryOutputRequest:
      "Return advisory packet review findings for CONTROL_THREAD inspection only.",
    receiptExpectation:
      "Future receipt, if separately routed, remains advisory until CONTROL_THREAD review.",
    controlThreadReviewHandoff:
      "Manual handoff only; CONTROL_THREAD remains review/accept/hold authority.",
    exportMetadata: {
      exportFormat: "json_and_markdown_preview",
      manualOperatorExportOnly:
        "Manual operator export preview only; no automatic send or external submission.",
      operatorReviewedLabel:
        "Operator must inspect the draft before any separate manual handoff.",
      advisoryOnlyLabel:
        "Advisory display/export draft only; non-authoritative and not delivery proof.",
    },
    nonAuthorizationCopy: [
      ...SANDBOX_PACKET_EXPORT_LABELS,
      "Draft preview is not executable packet authority.",
      "Draft preview is not runtime state.",
      "Draft preview is not source-of-truth state.",
      "Draft preview is not accepted source.",
      "Draft preview is not delivery proof.",
      "Draft preview does not mutate a repo.",
      "Draft preview does not trigger provider/model/API dispatch.",
    ],
  };
}

export function buildSandboxPacketDraftJson(draft: SandboxPacketDraft): string {
  return JSON.stringify(draft, null, 2);
}

export function buildSandboxPacketDraftMarkdown(
  draft: SandboxPacketDraft,
): string {
  return [
    "# Sandbox Packet Draft Preview",
    "",
    "## Packet",
    "",
    `- Packet id: ${draft.packetIdPlaceholder}`,
    `- Packet type: ${draft.packetType}`,
    "",
    "## Selected Sandbox Motion",
    "",
    `- Motion id: ${draft.selectedSandboxMotion.motionId}`,
    `- Motion name: ${draft.selectedSandboxMotion.motionName}`,
    `- Motion category: ${draft.selectedSandboxMotion.motionCategory}`,
    `- Purpose: ${draft.selectedSandboxMotion.motionPurpose}`,
    "",
    "## Selected Fixture",
    "",
    `- Fixture id: ${draft.selectedFixture.fixtureId}`,
    `- Fixture name: ${draft.selectedFixture.fixtureName}`,
    `- Fixture category: ${draft.selectedFixture.fixtureCategory}`,
    `- Source posture: ${draft.selectedFixture.sourcePacketPosture}`,
    "",
    "## Selected Sandbox Role / Class",
    "",
    `- Role/class id: ${draft.selectedSandboxRoleClass.roleClassId}`,
    `- Role/class name: ${draft.selectedSandboxRoleClass.roleClassName}`,
    `- JAI role label: ${draft.selectedSandboxRoleClass.jaiRoleLabel}`,
    "",
    "## Allowed Inputs",
    "",
    listMarkdown(draft.allowedInputsSummary),
    "",
    "## Blocked Authorities",
    "",
    listMarkdown(draft.blockedAuthoritiesSummary),
    "",
    "## Advisory Output Request",
    "",
    draft.advisoryOutputRequest,
    "",
    "## Receipt Expectation",
    "",
    draft.receiptExpectation,
    "",
    "## CONTROL_THREAD Handoff",
    "",
    draft.controlThreadReviewHandoff,
    "",
    "## Export Metadata",
    "",
    `- Format: ${draft.exportMetadata.exportFormat}`,
    `- Manual export: ${draft.exportMetadata.manualOperatorExportOnly}`,
    `- Operator reviewed: ${draft.exportMetadata.operatorReviewedLabel}`,
    `- Advisory: ${draft.exportMetadata.advisoryOnlyLabel}`,
    "",
    "## Non-Authorization Copy",
    "",
    listMarkdown(draft.nonAuthorizationCopy),
  ].join("\n");
}

function listMarkdown(values: readonly string[]): string {
  return values.map((value) => `- ${value}`).join("\n");
}
