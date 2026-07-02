import type {
  PassalongRecord,
  SandboxImportAdoptionPosture,
  SandboxTargetOption,
  ThreadMemoryRecord,
} from "./types";

export const THREAD_MEMORY_AUTHORITY_FINDINGS = [
  "Thread memory is not source of truth.",
  "Passalong queue entry is not CONTROL_THREAD acceptance.",
  "Route recommendation is not route authority.",
  "Copyable passalong text is not automatic routing.",
  "sandbox-nexus target option is not sandbox activation.",
  "Future JAI Agent slot target is not JAI Agent activation.",
  "Import candidate status is not target-repo adoption.",
  "Manual approval is required before any routing action.",
  "CONTROL_THREAD remains authority.",
  "Linear remains temporary mirror only.",
] as const;

export const THREAD_MEMORY_NON_AUTHORIZATIONS = [
  "No autonomous execution.",
  "No JAI Agent activation.",
  "No Agent PR Factory activation.",
  "No sandbox runtime activation.",
  "No sandbox task execution.",
  "No target-repo import.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No deployment.",
  "No production gate opening.",
  "No production migration authorization.",
  "No runtime activation.",
  "No database mutation.",
  "No migration application.",
  "No deployment authorization.",
  "No production telemetry.",
  "No provider/model routing authority.",
  "No source-of-truth transfer.",
  "No hidden background execution.",
  "No automatic route execution.",
  "No work-packet execution.",
  "No auto-submit to agents.",
  "No auto-send to other chats.",
  "No auto-run deliberation.",
  "No auto-route work.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
  "No final CONTROL_THREAD approval by thread memory.",
  "No final CONTROL_THREAD approval by passalong queue entry.",
  "No final CONTROL_THREAD approval by route recommendation.",
  "No final CONTROL_THREAD approval by copyable passalong text.",
  "No route authority by thread memory.",
  "No route authority by passalong queue entry.",
  "No route authority by route recommendation.",
  "No route authority by copyable passalong text.",
  "No execution authority by sandbox-nexus target option.",
  "No execution authority by future JAI Agent slot.",
  "No target-repo adoption by import candidate status.",
] as const;

export const SANDBOX_POSTURE = [
  "sandbox-nexus is a disposable prototype playground candidate.",
  "sandbox-nexus is not source of truth.",
  "sandbox-nexus does not auto-export to canonical repos.",
  "sandbox-nexus outputs require closeout/evidence receipt.",
  "sandbox-nexus outputs require CONTROL_THREAD import/discard decision.",
  "target repos import or reimplement only through separate route.",
] as const;

export const SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS: Record<
  SandboxImportAdoptionPosture,
  string
> = {
  discard: "do not retain as a candidate",
  archive: "retain as reference only",
  iterate: "continue sandbox-only exploration",
  keep_as_example: "preserve as non-authoritative example",
  promote_to_import_candidate: "mark for future CONTROL_THREAD review only",
};

export const THREAD_MEMORY_RECORDS: ThreadMemoryRecord[] = [
  {
    threadId: "thread-control-thread",
    threadLabel: "CONTROL_THREAD",
    threadKind: "CONTROL_THREAD",
    currentRole: "human authority and final routing owner",
    posture: "manual approval required before any routing action",
    summary:
      "Maintains the final authority boundary for motion-control, passalong review, and future sandbox decisions.",
    acceptedBaseline: [
      "A1-A15 boundaries remain preserved.",
      "Motion intake persistence remains non-authoritative.",
      "A15 evidence package requirements are planning-only.",
    ],
    activeScope: [
      "Review static passalong examples.",
      "Decide whether future evidence packages warrant separate routing.",
    ],
    openQuestions: [
      "Which sandbox/staging environment, if any, will be named in a later route?",
      "What future import/discard criteria should CONTROL_THREAD apply?",
    ],
    blockedRoutes: [
      "Migration application.",
      "Sandbox runtime activation.",
      "Future JAI Agent activation.",
      "Target-repo import.",
    ],
    evidencePointers: [
      "docs/reference/q3m7-motion-intake-sandbox-evidence-package-v0.md",
      "portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts",
    ],
    authorityBoundary: "Thread memory is not source of truth.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    updatedTimestamp: "2026-07-02T14:00:00.000Z",
  },
  {
    threadId: "thread-exploration",
    threadLabel: "EXPLORATION",
    threadKind: "EXPLORATION",
    currentRole: "app-readiness observation and hypothesis source",
    posture: "advisory notes only",
    summary:
      "Captures exploratory app-readiness notes for later human review without creating route authority.",
    acceptedBaseline: [
      "Exploration can propose questions.",
      "Exploration cannot approve work.",
    ],
    activeScope: [
      "Identify operator surface readiness gaps.",
      "Prepare manual notes for CONTROL_THREAD review.",
    ],
    openQuestions: [
      "Which operator surfaces need passalong visibility next?",
      "Which notes are useful enough for manual carry-forward?",
    ],
    blockedRoutes: [
      "Autonomous route creation.",
      "Provider/model dispatch.",
      "External app integration.",
    ],
    evidencePointers: ["portal/src/app/operator/control-plane/page.tsx"],
    authorityBoundary: "Thread memory is not source of truth.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    updatedTimestamp: "2026-07-02T14:05:00.000Z",
  },
  {
    threadId: "thread-dev-jai-nexus",
    threadLabel: "dev-jai-nexus",
    threadKind: "REPO_THREAD",
    currentRole: "internal control-plane implementation repo",
    posture: "repo-local prototype surface only",
    summary:
      "Hosts static internal control-plane prototypes and non-authorizing review artifacts.",
    acceptedBaseline: [
      "A8 durable motion intake exists in source.",
      "A9-A15 target-environment and sandbox evidence routes remain non-authorizing.",
    ],
    activeScope: [
      "Local passalong router prototype.",
      "Static helper modules and operator UI.",
    ],
    openQuestions: [
      "Should a future route add read-only navigation from the operator index?",
    ],
    blockedRoutes: [
      "Target repo import.",
      "GitHub mutation.",
      "Production deployment.",
    ],
    evidencePointers: [
      "portal/src/app/operator/motion-control/page.tsx",
      "docs/reference/q3m7-motion-intake-environment-definition-plan-v0.md",
    ],
    authorityBoundary: "Thread memory is not source of truth.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    updatedTimestamp: "2026-07-02T14:10:00.000Z",
  },
  {
    threadId: "thread-sandbox-nexus",
    threadLabel: "sandbox-nexus",
    threadKind: "SANDBOX_PLAYGROUND",
    currentRole: "future disposable prototype playground candidate",
    posture: "not activated; controlled playground option only",
    summary:
      "Represents the first sandbox target option for future prototype experiments, subject to separate approval.",
    acceptedBaseline: [...SANDBOX_POSTURE],
    activeScope: [
      "Future sandbox-only prototypes.",
      "Example generation.",
      "Evidence/closeout production for later CONTROL_THREAD review.",
    ],
    openQuestions: [
      "What evidence package defines a concrete sandbox target?",
      "What closeout format is required before import/discard decisions?",
    ],
    blockedRoutes: [
      "Sandbox runtime activation.",
      "Automatic export to canonical repos.",
      "Agent PR Factory activation.",
    ],
    evidencePointers: [
      "docs/reference/q3m7-motion-intake-sandbox-target-definition-v0.md",
      "docs/reference/q3m7-motion-intake-sandbox-evidence-package-v0.md",
    ],
    authorityBoundary: "sandbox-nexus target option is not sandbox activation.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    updatedTimestamp: "2026-07-02T14:15:00.000Z",
  },
  {
    threadId: "thread-repo-generic",
    threadLabel: "generic repo thread",
    threadKind: "GENERIC_REPO_THREAD",
    currentRole: "placeholder for future repo-specific manual passalong",
    posture: "non-authorizing placeholder",
    summary:
      "Represents a future repo thread without creating import, branch, PR, merge, or deployment authority.",
    acceptedBaseline: [
      "Target repos import or reimplement only through separate route.",
      "Import candidate status is not target-repo adoption.",
    ],
    activeScope: [
      "Hold future repo-specific passalong examples.",
      "Keep adoption posture advisory.",
    ],
    openQuestions: [
      "Which repo, if any, needs a separate route?",
      "What evidence would distinguish import from reimplementation?",
    ],
    blockedRoutes: [
      "Target-repo import.",
      "Branch mutation.",
      "PR creation.",
      "Merge action.",
    ],
    evidencePointers: [
      "docs/reference/q3m7-motion-intake-sandbox-evidence-package-v0.md",
    ],
    authorityBoundary: "Thread memory is not source of truth.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    updatedTimestamp: "2026-07-02T14:20:00.000Z",
  },
  {
    threadId: "thread-future-jai-agent-slot",
    threadLabel: "future JAI Agent slot",
    threadKind: "FUTURE_JAI_AGENT_SLOT",
    currentRole: "reserved future target label",
    posture: "held; no JAI Agent activation",
    summary:
      "Represents a future JAI Agent slot target label for visibility only; it does not activate agents.",
    acceptedBaseline: [
      "Future JAI Agent slot target is not JAI Agent activation.",
      "No Agent PR Factory activation.",
    ],
    activeScope: [
      "Hold blocked passalong examples.",
      "Make non-activation boundary visible.",
    ],
    openQuestions: [
      "What future governance would be required before any agent target exists?",
    ],
    blockedRoutes: [
      "JAI Agent activation.",
      "Agent PR Factory activation.",
      "Auto-submit to agents.",
    ],
    evidencePointers: ["docs/reference/q3m7-agent-assignment-supervision-surface-plan-v0.md"],
    authorityBoundary: "Future JAI Agent slot target is not JAI Agent activation.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    updatedTimestamp: "2026-07-02T14:25:00.000Z",
  },
];

export const PASSALONG_RECORDS: PassalongRecord[] = [
  {
    passalongId: "passalong-a15-control-thread",
    sourceThread: "thread-dev-jai-nexus",
    targetThread: "thread-control-thread",
    scope: "A15 sandbox evidence package closeout",
    mode: "manual closeout passalong draft",
    summary:
      "Static example passalong for the A15 sandbox evidence package requirements artifact and remaining blockers.",
    evidencePointers: [
      "docs/reference/q3m7-motion-intake-sandbox-evidence-package-v0.md",
      "commit: 7064a90 docs(reference): define motion intake sandbox evidence package",
    ],
    requestedDecision:
      "Review whether the A15 evidence package requirements should be accepted as planning baseline.",
    status: "queued",
    createdTimestamp: "2026-07-02T15:00:00.000Z",
    authorityBoundary: "Passalong queue entry is not CONTROL_THREAD acceptance.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
  },
  {
    passalongId: "passalong-exploration-app-readiness",
    sourceThread: "thread-exploration",
    targetThread: "thread-control-thread",
    scope: "operator app-readiness note",
    mode: "advisory observation",
    summary:
      "Static example note that operator control-plane surfaces can carry local passalong context without external dispatch.",
    evidencePointers: [
      "portal/src/app/operator/control-plane/page.tsx",
      "portal/src/components/operator/slate/OperatorSlatePrimitives.tsx",
    ],
    requestedDecision:
      "Decide whether a future route should add broader operator navigation for passalong review.",
    status: "needs_review",
    createdTimestamp: "2026-07-02T15:05:00.000Z",
    authorityBoundary: "Route recommendation is not route authority.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
  },
  {
    passalongId: "passalong-control-to-sandbox-planning",
    sourceThread: "thread-control-thread",
    targetThread: "thread-sandbox-nexus",
    scope: "future playground planning note",
    mode: "sandbox target planning",
    summary:
      "Static example recommendation to treat sandbox-nexus as a disposable prototype playground candidate only.",
    evidencePointers: [
      "docs/reference/q3m7-motion-intake-sandbox-target-definition-v0.md",
      "docs/reference/q3m7-motion-intake-sandbox-evidence-package-v0.md",
    ],
    requestedDecision:
      "Hold sandbox-nexus as a future candidate until separate target evidence and approval exist.",
    status: "recommended",
    createdTimestamp: "2026-07-02T15:10:00.000Z",
    authorityBoundary: "sandbox-nexus target option is not sandbox activation.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    sandboxTargetId: "sandbox-nexus",
    sandboxImportAdoptionPosture: "iterate",
    sandboxOutputInvolved: false,
  },
  {
    passalongId: "passalong-sandbox-closeout-placeholder",
    sourceThread: "thread-sandbox-nexus",
    targetThread: "thread-control-thread",
    scope: "future sandbox closeout placeholder",
    mode: "static placeholder",
    summary:
      "Static example of a future sandbox closeout returning to CONTROL_THREAD for import/discard review.",
    evidencePointers: [
      "future sandbox closeout/evidence receipt placeholder",
      "docs/reference/q3m7-motion-intake-sandbox-evidence-package-v0.md",
    ],
    requestedDecision:
      "If a future sandbox output exists, decide whether to discard, archive, iterate, keep as example, or promote to import candidate.",
    status: "archived",
    createdTimestamp: "2026-07-02T15:15:00.000Z",
    authorityBoundary: "Import candidate status is not target-repo adoption.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
    sandboxTargetId: "sandbox-nexus",
    sandboxImportAdoptionPosture: "promote_to_import_candidate",
    sandboxOutputInvolved: true,
  },
  {
    passalongId: "passalong-control-to-future-agent-held",
    sourceThread: "thread-control-thread",
    targetThread: "thread-future-jai-agent-slot",
    scope: "future JAI Agent slot blocked note",
    mode: "held non-activation note",
    summary:
      "Static example of a held passalong to the future JAI Agent slot label, preserving non-activation.",
    evidencePointers: [
      "docs/reference/q3m7-agent-assignment-supervision-surface-plan-v0.md",
    ],
    requestedDecision:
      "Keep future JAI Agent slot held until separate governance and activation routes exist.",
    status: "held",
    createdTimestamp: "2026-07-02T15:20:00.000Z",
    authorityBoundary:
      "Future JAI Agent slot target is not JAI Agent activation.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
  },
];

export const SANDBOX_TARGET_OPTIONS: SandboxTargetOption[] = [
  {
    id: "sandbox-nexus",
    label: "sandbox-nexus",
    posture: "disposable prototype playground candidate",
    allowedUses: [
      "sandbox-only prototypes",
      "example generation",
      "controlled exploration",
      "evidence/closeout production for later CONTROL_THREAD review",
    ],
    disallowedUses: [
      "source of truth",
      "canonical repo export",
      "runtime activation",
      "Agent PR Factory activation",
      "GitHub mutation",
      "production gate opening",
      "automatic import into dev-jai-nexus or target repos",
    ],
    authorityBoundary: "sandbox-nexus target option is not sandbox activation.",
    nonAuthorizations: [...THREAD_MEMORY_NON_AUTHORIZATIONS],
  },
];
