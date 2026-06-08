import type { JaiProjectRegistryFixture } from "./jaiProjectTypes";

const jaiProjectRegistryFixture: JaiProjectRegistryFixture = {
  generated_label: "Q2M6 static JAI Project Registry fixture v0",
  status_note:
    "Static local fixture only. Non-live, non-canonical until accepted by CONTROL_THREAD. No API/DB reads, passalong ingestion, telemetry, customer data, provider/model calls, or runtime execution.",
  authority_boundary_label:
    "Operator project registry display is local fixture-backed and representational only.",
  projects: [
    {
      project_id: "jai-nexus-operating-model",
      nhid: "NH-JAI-NEXUS-OPERATING-MODEL",
      name: "JAI NEXUS Operating Model",
      state: "active",
      objective:
        "Make JAI NEXUS visible as an operator-governed control plane for portfolio status, project objects, authority boundaries, and next-route planning without live automation.",
      status_summary:
        "Active Q2M6 static operating loop work. Portfolio status surfaces and test-only client boundaries are available as local checked-in fixture-backed views.",
      custom_metrics: [
        {
          label: "Static surfaces",
          value: "2",
          detail: "Portfolio status plus project registry planning surface.",
        },
        {
          label: "Live integrations",
          value: "0",
          detail: "No API, DB, provider, telemetry, or remote fetch is authorized.",
        },
        {
          label: "Acceptance posture",
          value: "manual",
          detail: "CONTROL_THREAD acceptance remains required before treating fixture content as planning canon.",
        },
      ],
      canon_summary:
        "Grounded in CONTROL_THREAD portfolio routing protocol, operating model migration planning, static portfolio status fixture maintenance, and local client boundary stubs.",
      open_questions: [
        "Which JAI Project fields should become canonical reference vocabulary?",
        "Whether project registry fixture maintenance should get its own checklist artifact.",
        "When, if ever, a read-only API contract should be routed separately.",
      ],
      deferred_ideas: [
        "Live project state",
        "API/DB-backed project records",
        "Agent-driven project updates",
        "Automatic passalong intake",
      ],
      linked_repos: ["dev-jai-nexus", "orchestrator-nexus", "api-nexus", "jai-format"],
      council_posture: {
        label: "representational council posture",
        summary:
          "Council posture is shown as planning context only for critique, missing-gate review, and authority-boundary awareness.",
        representational_note:
          "This surface does not convene, score, approve, or route Council decisions.",
      },
      agent_lanes: [
        {
          lane_id: "operator-control-plane-lane",
          label: "Operator Control Plane lane",
          status: "representational",
          summary:
            "Tracks local static surfaces, fixture-backed visibility, and manual review posture.",
          authority_boundary:
            "No runtime execution, branch writes, PR automation, or autonomous approval.",
        },
        {
          lane_id: "static-read-model-lane",
          label: "Static read model lane",
          status: "representational",
          summary:
            "Tracks compatibility with copied static response fixtures and read-model-oriented fields.",
          authority_boundary:
            "No live API connection, remote fetch, DB persistence, or telemetry.",
        },
      ],
      authority_boundary:
        "Project state is static fixture text only and does not represent live repo, customer, production, or agent state.",
      next_prompts: [
        "CONTROL_THREAD review/acceptance of JAI Project Registry Surface v0.",
        "Consider a docs-only maintenance checklist for project registry fixture updates.",
      ],
    },
    {
      project_id: "jai-workbench-inception",
      nhid: "NH-JAI-WORKBENCH-INCEPTION",
      name: "JAI Workbench Inception Boundary",
      state: "frozen",
      objective:
        "Preserve JAI Workbench as a future product concept until CONTROL_THREAD accepts a concrete repo creation and implementation boundary.",
      status_summary:
        "Frozen/deferred. Standalone repo creation, local app shell, provider calls, terminal execution, browser control, API/DB behavior, telemetry, and production usage remain unauthorized.",
      custom_metrics: [
        {
          label: "Implementation authority",
          value: "0",
          detail: "No repo creation or app implementation is authorized here.",
        },
        {
          label: "Boundary state",
          value: "frozen",
          detail: "Held as product-boundary planning context only.",
        },
      ],
      canon_summary:
        "Grounded in the JAI Workbench product boundary and inception planning posture.",
      open_questions: [
        "Whether JAI Workbench should become a standalone repo after CONTROL_THREAD acceptance.",
        "Which project registry fields should reference Workbench without implying ownership transfer.",
      ],
      deferred_ideas: [
        "Standalone jai-workbench repo",
        "Workbench local app shell",
        "Provider/model interaction surface",
        "Desktop/browser control surface",
      ],
      linked_repos: ["dev-jai-nexus", "jai-vscode", "jai-pilot"],
      council_posture: {
        label: "frozen representational posture",
        summary:
          "Council posture is visible only as a reminder that Workbench expansion requires separate governance.",
        representational_note:
          "This registry does not approve repo creation, implementation, provider calls, or runtime authority.",
      },
      agent_lanes: [
        {
          lane_id: "workbench-boundary-lane",
          label: "Workbench boundary lane",
          status: "frozen",
          summary:
            "Represents deferred product-boundary planning without creating a repo or app surface.",
          authority_boundary:
            "No repo creation, app implementation, runtime execution, or provider/model dispatch.",
        },
      ],
      authority_boundary:
        "Frozen project entry is planning context only and must not be treated as implementation approval.",
      next_prompts: [
        "Keep JAI Workbench deferred unless CONTROL_THREAD routes a new docs/reference boundary.",
      ],
    },
  ],
  non_authorizations: [
    "no API/DB-backed project state",
    "no api-nexus fetch",
    "no remote artifact fetch",
    "no passalong ingestion",
    "no provider/model dispatch",
    "no telemetry",
    "no customer data handling",
    "no runtime execution",
    "no branch/PR automation",
    "not canonical unless accepted by CONTROL_THREAD",
  ],
};

export function getJaiProjectRegistryFixture(): JaiProjectRegistryFixture {
  return {
    ...jaiProjectRegistryFixture,
    projects: jaiProjectRegistryFixture.projects.map((project) => ({
      ...project,
      custom_metrics: project.custom_metrics.map((metric) => ({ ...metric })),
      open_questions: [...project.open_questions],
      deferred_ideas: [...project.deferred_ideas],
      linked_repos: [...project.linked_repos],
      council_posture: { ...project.council_posture },
      agent_lanes: project.agent_lanes.map((lane) => ({ ...lane })),
      next_prompts: [...project.next_prompts],
    })),
    non_authorizations: [...jaiProjectRegistryFixture.non_authorizations],
  };
}
