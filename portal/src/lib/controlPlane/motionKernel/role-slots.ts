import type { JaiRoleSlot } from "./types";

export const JAI_ROLE_SLOTS: JaiRoleSlot[] = [
  {
    id: "JAI_CONTROL_THREAD",
    displayName: "JAI Control Thread",
    roleFamily: "routing_authority_context",
    purpose: "Frame CONTROL_THREAD routing and human approval separation.",
    requiredLens: "Authority, sequencing, acceptance, and non-execution boundary.",
    authorityDisclaimer:
      "Role-slot output is advisory display only and does not become CONTROL_THREAD approval.",
  },
  {
    id: "JAI_ORCHESTRATOR_NEXUS",
    displayName: "JAI Orchestrator Nexus",
    roleFamily: "coordination",
    purpose: "Review cross-repo orchestration and route draft implications.",
    requiredLens: "Program, batch, wave, lane, dependency, and handoff coherence.",
    authorityDisclaimer:
      "Role-slot output does not route work or mutate source-of-truth state.",
  },
  {
    id: "JAI_DEV_JAI_NEXUS",
    displayName: "JAI Dev Jai Nexus",
    roleFamily: "implementation_context",
    purpose: "Review dev-jai-nexus implementation and operator-surface fit.",
    requiredLens: "Repo conventions, app surface boundaries, and validation posture.",
    authorityDisclaimer:
      "Role-slot output does not execute code, create branches, or mutate GitHub.",
  },
  {
    id: "JAI_AUDIT_NEXUS",
    displayName: "JAI Audit Nexus",
    roleFamily: "audit",
    purpose: "Critique authority boundaries, risk posture, and evidence sufficiency.",
    requiredLens: "Safety, non-authorizations, traceability, and blockers.",
    authorityDisclaimer:
      "Role-slot output does not approve readiness, acceptance, or production gates.",
  },
  {
    id: "JAI_FORMAT",
    displayName: "JAI Format",
    roleFamily: "format_profile",
    purpose: "Review schema, vocabulary, and draft packet consistency.",
    requiredLens: "Stable enum values, shared vocabulary, and draft-only formatting.",
    authorityDisclaimer:
      "Role-slot output does not create accepted schemas or source-of-truth transfer.",
  },
  {
    id: "JAI_REPO_GENERIC",
    displayName: "JAI Repo Generic",
    roleFamily: "repo_generalist",
    purpose: "Provide generic repo-thread critique and operational caution.",
    requiredLens: "Repo hygiene, evidence pointers, validation, and human review.",
    authorityDisclaimer:
      "Role-slot output is provider-agnostic and never provider authority.",
  },
];

export function getJaiRoleSlot(id: JaiRoleSlot["id"]): JaiRoleSlot {
  const slot = JAI_ROLE_SLOTS.find((candidate) => candidate.id === id);
  if (!slot) {
    throw new Error(`Unknown JAI role slot: ${id}`);
  }
  return slot;
}
