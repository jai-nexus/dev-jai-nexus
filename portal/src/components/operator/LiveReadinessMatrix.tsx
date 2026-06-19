import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorGatedAction,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";

type MatrixStatus =
  | "READ-ONLY READY"
  | "COMPOSE-ONLY READY"
  | "REPRESENTABLE"
  | "GATED"
  | "BLOCKED IN V0"
  | "DEFERRED"
  | "NEEDS DOCTRINE"
  | "NEEDS SECURITY GATE"
  | "NEEDS EXECUTION GATE"
  | "NEEDS RECEIPT MODEL"
  | "NEEDS .jai PROFILE"
  | "NEEDS ROUTE DECISION";

type MatrixRow = {
  id: string;
  capability: string;
  statuses: MatrixStatus[];
  allowed: string;
  blocked: string;
  doctrine: string;
  securityGate: string;
  executionGate: string;
  receipt: string;
  validation: string;
  rollback: string;
  operatorConfirmation: string;
  dataPrerequisites: string;
  unresolvedQuestions: string;
  nextRoute: string;
};

const statusLegend: { status: MatrixStatus; tone: OperatorSlateTone; meaning: string }[] = [
  {
    status: "READ-ONLY READY",
    tone: "readOnly",
    meaning: "Visible as a local/static or accepted read-only surface.",
  },
  {
    status: "COMPOSE-ONLY READY",
    tone: "composeOnly",
    meaning: "Local clipboard drafts may be prepared where already labeled.",
  },
  {
    status: "REPRESENTABLE",
    tone: "fixture",
    meaning: "Can be shown as synthetic readiness posture, not live state.",
  },
  {
    status: "GATED",
    tone: "gated",
    meaning: "Requires future gates before any active capability exists.",
  },
  {
    status: "BLOCKED IN V0",
    tone: "blocked",
    meaning: "Not authorized in this staging branch.",
  },
  {
    status: "DEFERRED",
    tone: "pending",
    meaning: "Reserved for later route, doctrine, or activation work.",
  },
  {
    status: "NEEDS DOCTRINE",
    tone: "advisory",
    meaning: "Requires explicit operating doctrine before activation review.",
  },
  {
    status: "NEEDS SECURITY GATE",
    tone: "gated",
    meaning: "Requires explicit security and step-up posture.",
  },
  {
    status: "NEEDS EXECUTION GATE",
    tone: "gated",
    meaning: "Requires a named execution gate that is not opened here.",
  },
  {
    status: "NEEDS RECEIPT MODEL",
    tone: "advisory",
    meaning: "Requires receipt shape before any accepted change path.",
  },
  {
    status: "NEEDS .jai PROFILE",
    tone: "pending",
    meaning: "Requires future .jai profile semantics; none are activated.",
  },
  {
    status: "NEEDS ROUTE DECISION",
    tone: "pending",
    meaning: "Requires CONTROL_THREAD topology decision before promotion.",
  },
];

const statusTone: Record<MatrixStatus, OperatorSlateTone> = Object.fromEntries(
  statusLegend.map((item) => [item.status, item.tone]),
) as Record<MatrixStatus, OperatorSlateTone>;

const readinessRows: MatrixRow[] = [
  {
    id: "SYN-MATRIX-JAI-0001",
    capability: "JAI",
    statuses: ["READ-ONLY READY", "GATED", "NEEDS DOCTRINE", "NEEDS EXECUTION GATE"],
    allowed: "Read-only readiness posture and local compose handoff references from existing surfaces.",
    blocked: "Live JAI runtime, provider dispatch, model calls, persistence, canon update, and execution.",
    doctrine: "Define JAI runtime role, claim boundaries, acceptance boundaries, and CONTROL_THREAD decision rules.",
    securityGate: "Operator step-up plus explicit runtime authorization gate; authentication alone is insufficient.",
    executionGate: "Named JAI runtime execution gate remains closed.",
    receipt: "Receipt model required for any accepted JAI-assisted decision.",
    validation: "Validation evidence required; validation is not acceptance.",
    rollback: "Rollback and deactivation path required before live runtime review.",
    operatorConfirmation: "CONTROL_THREAD must explicitly authorize any activation review.",
    dataPrerequisites: "Local/static and read-only canonical sources only; unknown-source context remains conservative.",
    unresolvedQuestions: "What .jai profile and source doctrine are required before JAI can become active?",
    nextRoute: "/operator/jai",
  },
  {
    id: "SYN-MATRIX-COUNCIL-0002",
    capability: "JAI Council",
    statuses: ["REPRESENTABLE", "GATED", "NEEDS RECEIPT MODEL", "NEEDS EXECUTION GATE"],
    allowed: "Advisory Council readiness, dissent, contradiction, and claim boundary display.",
    blocked: "Council dispatch, automatic synthesis, agreement-as-authority, canon merge, and receipt creation.",
    doctrine: "Council output produces claims, not facts; Council agreement is not authority.",
    securityGate: "Operator confirmation and Council session gate required before any live session.",
    executionGate: "Council runtime and dispatch gate remains closed.",
    receipt: "Decision receipt required after CONTROL_THREAD acceptance, not before.",
    validation: "Evidence, dissent, and contradiction review required.",
    rollback: "Session closeout and output retraction path required.",
    operatorConfirmation: "CONTROL_THREAD decides whether advisory output advances.",
    dataPrerequisites: "Synthetic model-slot records only; no live provider state.",
    unresolvedQuestions: "What Council route and session lifecycle become canonical?",
    nextRoute: "/operator/council-prototype",
  },
  {
    id: "SYN-MATRIX-MODEL-0003",
    capability: "model slots",
    statuses: ["REPRESENTABLE", "BLOCKED IN V0", "NEEDS SECURITY GATE", "NEEDS .jai PROFILE"],
    allowed: "Static role labels for expected review slots.",
    blocked: "Provider SDKs, model credentials, live calls, best-model selection, and automatic dispatch.",
    doctrine: "Define model-slot roles, evidence requirements, and provider boundary labels.",
    securityGate: "Provider credential and dispatch security gate required.",
    executionGate: "Model dispatch gate remains closed.",
    receipt: "Provider call and output receipt model required before activation.",
    validation: "Output validation and source checking required.",
    rollback: "Provider disable and output quarantine path required.",
    operatorConfirmation: "CONTROL_THREAD must approve model-slot activation.",
    dataPrerequisites: "No live provider/model state; fixture records only.",
    unresolvedQuestions: "Which slots map to which provider policy and .jai profile?",
    nextRoute: "/operator/jai",
  },
  {
    id: "SYN-MATRIX-AGENTS-0004",
    capability: "JAI Agents",
    statuses: ["REPRESENTABLE", "BLOCKED IN V0", "NEEDS SECURITY GATE", "NEEDS EXECUTION GATE"],
    allowed: "Read-only Agent readiness and expected artifact display.",
    blocked: "Agent execution, tool invocation, runners, schedulers, terminal control, browser/desktop control, and repo mutation.",
    doctrine: "Agents are staged, not executing; define Agent authority classes before review.",
    securityGate: "Tool, repo, terminal, browser, and operator step-up gates required.",
    executionGate: "Agent execution gate remains closed.",
    receipt: "Agent action receipt model required before any future execution.",
    validation: "Artifact validation, security review, and operator review required.",
    rollback: "Rollback and stop-the-run requirements required.",
    operatorConfirmation: "CONTROL_THREAD must authorize any Agent lane activation.",
    dataPrerequisites: "Synthetic lane posture only; no runnable queue state.",
    unresolvedQuestions: "What Agent runner and tool boundary doctrine is acceptable?",
    nextRoute: "/operator/agents",
  },
  {
    id: "SYN-MATRIX-LANES-0005",
    capability: "Agent lane candidates",
    statuses: ["COMPOSE-ONLY READY", "REPRESENTABLE", "GATED"],
    allowed: "Lane prompts and handoff drafts may be composed locally on existing surfaces.",
    blocked: "Dispatch, scheduler placement, autonomous loop, repo write, receipt creation, and canon update.",
    doctrine: "Lane candidate does not execute and does not select itself.",
    securityGate: "Lane-to-tool authorization and operator presence gate required.",
    executionGate: "Lane execution gate remains closed.",
    receipt: "Lane assignment and output receipt model required.",
    validation: "Expected artifact and validation checklist required.",
    rollback: "Lane rollback and cancellation posture required.",
    operatorConfirmation: "CONTROL_THREAD selects and authorizes any future lane.",
    dataPrerequisites: "Static SYN-* candidates only.",
    unresolvedQuestions: "Which lanes are allowed for first activation review?",
    nextRoute: "/operator/work",
  },
  {
    id: "SYN-MATRIX-PALETTE-0006",
    capability: "JAI Palette",
    statuses: ["READ-ONLY READY", "COMPOSE-ONLY READY", "GATED", "NEEDS .jai PROFILE"],
    allowed: "Context assembly cards and local context packet drafts.",
    blocked: "Retrieval engine, automatic context injection, live memory writes, hidden persistence, and customer-data handling.",
    doctrine: "Palette assembles context; it does not authorize.",
    securityGate: "Source, privacy, and customer-data gates required.",
    executionGate: "Context retrieval/injection gate remains closed.",
    receipt: "Context packet receipt model required before accepted use.",
    validation: "Source, freshness, privacy, and provenance review required.",
    rollback: "Context withdrawal and memory purge path required before memory use.",
    operatorConfirmation: "CONTROL_THREAD must authorize context use beyond local handoff.",
    dataPrerequisites: "Local/static, derived, or accepted read-only canonical sources only.",
    unresolvedQuestions: "What .jai context profile and privacy posture are required?",
    nextRoute: "/operator/jai",
  },
  {
    id: "SYN-MATRIX-GRID-0007",
    capability: "JAI Grid",
    statuses: ["READ-ONLY READY", "REPRESENTABLE", "GATED"],
    allowed: "Operational-state map and capability relationship display.",
    blocked: "Execution, route-state mutation, motion-state mutation, scheduling, dispatch, and hidden persistence.",
    doctrine: "Grid displays operational state; it does not execute.",
    securityGate: "Operational-state source and display gate required.",
    executionGate: "Grid action/execution gate remains closed.",
    receipt: "State-change receipt model required before any active Grid behavior.",
    validation: "Source posture and freshness validation required.",
    rollback: "State correction and display rollback requirements required.",
    operatorConfirmation: "CONTROL_THREAD must approve any active Grid transition.",
    dataPrerequisites: "Fixture, derived, or accepted read-only canonical source labels.",
    unresolvedQuestions: "Which operational state source becomes authoritative?",
    nextRoute: "/operator/grid",
  },
  {
    id: "SYN-MATRIX-BRANCH-0008",
    capability: "branch planning",
    statuses: ["COMPOSE-ONLY READY", "REPRESENTABLE", "GATED"],
    allowed: "Branch name planning and local handoff drafts.",
    blocked: "Branch creation, code push, repo write, GitHub API use, and commit automation.",
    doctrine: "Branch planning may be represented; branch creation is not authorized.",
    securityGate: "Repo authorization and GitHub integration gate required.",
    executionGate: "Branch creation gate remains closed.",
    receipt: "Branch creation receipt model required before activation.",
    validation: "Branch intent and scope validation required.",
    rollback: "Branch deletion or revert plan required.",
    operatorConfirmation: "CONTROL_THREAD must authorize any branch action.",
    dataPrerequisites: "No live GitHub state implied; static readiness records only.",
    unresolvedQuestions: "What branch naming and repo authority doctrine is required?",
    nextRoute: "/operator/work",
  },
  {
    id: "SYN-MATRIX-PR-0009",
    capability: "PR planning",
    statuses: ["COMPOSE-ONLY READY", "REPRESENTABLE", "GATED"],
    allowed: "PR body drafts and validation checklist composition.",
    blocked: "PR creation, branch/PR automation, push, merge, GitHub API use, and repo mutation.",
    doctrine: "PR descriptions may be composed; PR creation is not authorized.",
    securityGate: "GitHub integration and repo write gates required.",
    executionGate: "PR creation and merge gates remain closed.",
    receipt: "PR creation and closeout receipt models required.",
    validation: "Required validation checklist and review evidence required.",
    rollback: "Revert/rollback plan required before merge authority review.",
    operatorConfirmation: "CONTROL_THREAD must approve any PR action.",
    dataPrerequisites: "No live GitHub state implied; fixture planning only.",
    unresolvedQuestions: "What PR review and closeout doctrine is required?",
    nextRoute: "/operator/repos",
  },
  {
    id: "SYN-MATRIX-GITHUB-0010",
    capability: "GitHub integration",
    statuses: ["BLOCKED IN V0", "NEEDS SECURITY GATE", "NEEDS RECEIPT MODEL"],
    allowed: "Readiness blockers and future prerequisite display only.",
    blocked: "GitHub API calls, branch creation, PR creation, push, merge, webhook use, and repo writes.",
    doctrine: "Define integration authority, audit trail, token scope, and operator decision rules.",
    securityGate: "Credential, token-scope, repo-scope, and operator step-up gates required.",
    executionGate: "GitHub action gate remains closed.",
    receipt: "GitHub action receipt model required.",
    validation: "API result, diff, and permission validation required.",
    rollback: "Revert, branch cleanup, and integration disable plan required.",
    operatorConfirmation: "CONTROL_THREAD must explicitly authorize integration.",
    dataPrerequisites: "No GitHub API data introduced in Commit 6.",
    unresolvedQuestions: "Which repos and token scopes are acceptable?",
    nextRoute: "/operator/repos",
  },
  {
    id: "SYN-MATRIX-REPO-0011",
    capability: "repo mutation",
    statuses: ["BLOCKED IN V0", "NEEDS SECURITY GATE", "NEEDS EXECUTION GATE"],
    allowed: "Read-only repo posture and compose-only planning on existing surfaces.",
    blocked: "File mutation, repo write, push, merge, commit automation, and code-generation execution.",
    doctrine: "Define repo write authority, review requirements, and rollback requirements.",
    securityGate: "Repo write and step-up gates required.",
    executionGate: "Repo mutation gate remains closed.",
    receipt: "Repo mutation receipt required after any accepted future write.",
    validation: "Diff, test, lint, typecheck, and security validation required.",
    rollback: "Revert plan and recovery owner required.",
    operatorConfirmation: "CONTROL_THREAD must approve any repo mutation.",
    dataPrerequisites: "Existing read-only repo displays only; no new mutation path.",
    unresolvedQuestions: "What repos are eligible for any future write gate?",
    nextRoute: "/operator/repos",
  },
  {
    id: "SYN-MATRIX-RECEIPT-0012",
    capability: "receipt creation",
    statuses: ["BLOCKED IN V0", "NEEDS RECEIPT MODEL", "NEEDS DOCTRINE"],
    allowed: "Receipt expectations may be displayed.",
    blocked: "Receipt creation, automatic receipt synthesis, canon update, and acceptance decisions.",
    doctrine: "Receipts record; they do not decide.",
    securityGate: "Receipt author and source verification gate required.",
    executionGate: "Receipt write gate remains closed.",
    receipt: "Receipt schema and storage path are prerequisites, not active here.",
    validation: "Receipt evidence and decision provenance validation required.",
    rollback: "Receipt correction and supersession policy required.",
    operatorConfirmation: "CONTROL_THREAD decides whether a receipt is valid.",
    dataPrerequisites: "No new receipt storage or write path.",
    unresolvedQuestions: "What receipt shape and canonical location are acceptable?",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-MATRIX-CANON-0013",
    capability: "canon update",
    statuses: ["BLOCKED IN V0", "NEEDS DOCTRINE", "NEEDS EXECUTION GATE"],
    allowed: "Read-only canonical posture where already accepted by existing routes.",
    blocked: "Canon write, automatic synthesis merge, receipt-driven auto-acceptance, and state mutation.",
    doctrine: "Define canon acceptance, supersession, and audit requirements.",
    securityGate: "Canon write and operator step-up gates required.",
    executionGate: "Canon update gate remains closed.",
    receipt: "Accepted canon update receipt required.",
    validation: "Source, contradiction, and acceptance validation required.",
    rollback: "Canon rollback and supersession path required.",
    operatorConfirmation: "CONTROL_THREAD must explicitly accept any canon update.",
    dataPrerequisites: "Read-only canonical reads only; no write path added.",
    unresolvedQuestions: "What canon update path is allowed, if any?",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-MATRIX-ROUTE-0014",
    capability: "route-state update",
    statuses: ["BLOCKED IN V0", "NEEDS ROUTE DECISION", "NEEDS RECEIPT MODEL"],
    allowed: "Route topology and pending decision display.",
    blocked: "Route promotion, redirects, route-state mutation, navigation redesign, and route automation.",
    doctrine: "Routes recommend; they do not execute.",
    securityGate: "Route-state authority and operator confirmation gate required.",
    executionGate: "Route-state update gate remains closed.",
    receipt: "Route decision receipt required before any future route mutation.",
    validation: "Route impact and regression validation required.",
    rollback: "Redirect and route rollback plan required.",
    operatorConfirmation: "CONTROL_THREAD route topology decision required.",
    dataPrerequisites: "Static route relationship records only.",
    unresolvedQuestions: "Should live dashboard, Council, DCT, or design-system routes change?",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-MATRIX-MOTION-0015",
    capability: "motion-state update",
    statuses: ["BLOCKED IN V0", "NEEDS RECEIPT MODEL", "NEEDS EXECUTION GATE"],
    allowed: "Read-only motion posture display where already present.",
    blocked: "Motion-state mutation, automatic acceptance, gate evaluation, and canon update.",
    doctrine: "Motion queues record posture; they do not accept.",
    securityGate: "Motion-state write and operator confirmation gates required.",
    executionGate: "Motion-state update gate remains closed.",
    receipt: "Motion decision receipt required.",
    validation: "Motion evidence and validation review required.",
    rollback: "Motion correction and reversal policy required.",
    operatorConfirmation: "CONTROL_THREAD must decide any motion-state change.",
    dataPrerequisites: "Existing accepted read-only sources only.",
    unresolvedQuestions: "What motion-state write model is acceptable?",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-MATRIX-CUSTOMER-0016",
    capability: "customer-data access",
    statuses: ["BLOCKED IN V0", "NEEDS SECURITY GATE", "NEEDS DOCTRINE"],
    allowed: "Boundary display only.",
    blocked: "Customer-data handling, retrieval, context injection, persistence, memory writes, model dispatch, and Agent dispatch.",
    doctrine: "Define privacy, consent, source, retention, and redaction requirements.",
    securityGate: "Privacy review, customer-data, retention, and operator step-up gates required.",
    executionGate: "Customer-data access gate remains closed.",
    receipt: "Access and use receipt model required.",
    validation: "Privacy, provenance, and minimization validation required.",
    rollback: "Data purge and incident response path required.",
    operatorConfirmation: "CONTROL_THREAD must authorize any customer-data review.",
    dataPrerequisites: "No customer data introduced; unknown-source context remains non-canonical.",
    unresolvedQuestions: "What customer-data classes are permitted, if any?",
    nextRoute: "/operator/jai",
  },
  {
    id: "SYN-MATRIX-PROD-0017",
    capability: "production deployment",
    statuses: ["DEFERRED", "BLOCKED IN V0", "NEEDS DOCTRINE", "NEEDS SECURITY GATE"],
    allowed: "Activation blockers and future deployment prerequisite display only.",
    blocked: "Production behavior, live runtime activation, deployment automation, gate opening, and customer-impacting behavior.",
    doctrine: "Define production readiness, ownership, rollback, incident, and acceptance doctrine.",
    securityGate: "Production, security, incident, and operator approval gates required.",
    executionGate: "Production deployment gate remains closed.",
    receipt: "Deployment and acceptance receipt models required.",
    validation: "Full validation, audit, incident readiness, and rollback validation required.",
    rollback: "Production rollback and disablement plan required.",
    operatorConfirmation: "CONTROL_THREAD must explicitly approve any production review.",
    dataPrerequisites: "No production data or behavior in v0.",
    unresolvedQuestions: "What production authority chain and deployment route are acceptable?",
    nextRoute: "/operator/live-dashboard",
  },
];

const activationBlockers = [
  "CONTROL_THREAD decides.",
  "Validation is not acceptance.",
  "Receipts record; they do not decide.",
  "Routes recommend; they do not execute.",
  "Council agreement is not authority.",
  "Agents are staged, not executing.",
  "Authentication is not authorization.",
  "Step-up verification confirms operator presence only.",
  "Verified session does not open execution gates.",
  "Dashboard display does not authorize.",
  "Read-only is not authority.",
  "ZERO GATES GRANTED.",
  "No code push authority in v0.",
  "No Agent execution authority in v0.",
  "No model dispatch in v0.",
  "No execution gates opened.",
];

const gateSummaries = [
  {
    title: "Doctrine",
    value: "Capability role, authority, source, acceptance, receipt, and rollback doctrine required before activation review.",
  },
  {
    title: "Security gates",
    value: "Step-up, credential, repo, provider, privacy, customer-data, and production gates remain prerequisites only.",
  },
  {
    title: "Execution gates",
    value: "Runtime, model dispatch, Agent execution, GitHub, repo mutation, route-state, motion-state, and deployment gates remain closed.",
  },
  {
    title: "Receipts",
    value: "Receipt models are required future artifacts; Commit 6 creates no receipts and no receipt storage path.",
  },
  {
    title: "Validation",
    value: "Validation requirements are review evidence only and do not grant acceptance.",
  },
  {
    title: "Rollback",
    value: "Rollback requirements must exist before any write-capable or runtime-capable gate can be considered.",
  },
];

function MatrixField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/50 p-2">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xs leading-5 text-slate-300">{value}</div>
    </div>
  );
}

export function LiveReadinessMatrix({ index = "MATRIX" }: { index?: string }) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title="Gate / Readiness Matrix"
        right={
          <>
            <OperatorBadge tone="fixture">SYN-* STATIC MATRIX</OperatorBadge>
            <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NO ACTIVATION</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / live-readiness staging v0 / Commit 6
            </div>
            <p className="mt-2 text-sm text-slate-300">
              This consolidated matrix records readiness posture, required
              gates, required receipts, validation, rollback, source
              prerequisites, unresolved activation questions, and next routes.
              It is representational only and does not evaluate gates, grant
              authority, dispatch runtimes, mutate state, or create receipts.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorReadOnlyAction>Matrix display</OperatorReadOnlyAction>
              <OperatorGatedAction>Future gate review</OperatorGatedAction>
              <OperatorBlockedAction>Open execution gates</OperatorBlockedAction>
            </div>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              No-activation rail
            </div>
            <p className="mt-2 text-xs leading-5 text-red-100">
              Required gates and receipts are prerequisites, not granted
              authority. No status in this matrix implies active runtime,
              provider/model dispatch, Agent dispatch, GitHub integration, repo
              mutation, route-state mutation, motion-state mutation, customer
              data handling, production behavior, gate evaluation, or execution.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NOT AUTHORIZED IN V0</OperatorBadge>
              <OperatorBadge tone="blocked">NO LIVE RUNTIME ACTIVATION</OperatorBadge>
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {statusLegend.map((item) => (
            <div
              key={item.status}
              className="rounded border border-slate-800 bg-slate-950/40 p-2"
            >
              <OperatorBadge tone={item.tone}>{item.status}</OperatorBadge>
              <div className="mt-2 text-xs leading-5 text-slate-400">
                {item.meaning}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          {readinessRows.map((row) => (
            <OperatorGateCard key={row.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-100">
                    {row.capability}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{row.id}</OperatorIdChip>
                  </div>
                </div>
                <div className="flex max-w-3xl flex-wrap justify-end gap-1.5">
                  {row.statuses.map((status) => (
                    <OperatorBadge key={status} tone={statusTone[status]}>
                      {status}
                    </OperatorBadge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <MatrixField label="current allowed behavior" value={row.allowed} />
                <MatrixField label="blocked behavior" value={row.blocked} />
                <MatrixField label="required doctrine" value={row.doctrine} />
                <MatrixField label="required security gate" value={row.securityGate} />
                <MatrixField label="required execution gate" value={row.executionGate} />
                <MatrixField label="required receipt" value={row.receipt} />
                <MatrixField label="required validation" value={row.validation} />
                <MatrixField label="required rollback" value={row.rollback} />
                <MatrixField
                  label="required operator confirmation"
                  value={row.operatorConfirmation}
                />
                <MatrixField
                  label="data/source prerequisites"
                  value={row.dataPrerequisites}
                />
                <MatrixField
                  label="unresolved questions"
                  value={row.unresolvedQuestions}
                />
                <MatrixField label="next route" value={row.nextRoute} />
              </div>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Activation blockers
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {activationBlockers.map((blocker) => (
                <OperatorBadge key={blocker} tone="blocked">
                  {blocker}
                </OperatorBadge>
              ))}
            </div>
          </div>

          <div className="rounded border border-amber-900 bg-amber-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Required future gates / receipts / rollback
            </div>
            <div className="mt-2 space-y-2">
              {gateSummaries.map((summary) => (
                <div key={summary.title} className="text-xs leading-5 text-amber-100">
                  <span className="font-mono uppercase tracking-wide text-amber-400">
                    {summary.title} /{" "}
                  </span>
                  {summary.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </OperatorPanel>
    </section>
  );
}
