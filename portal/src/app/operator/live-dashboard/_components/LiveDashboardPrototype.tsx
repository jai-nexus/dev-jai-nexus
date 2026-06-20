"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import {
    OPERATOR_SAFETY_INVARIANTS,
    OperatorBadge,
    OperatorBlockedAction,
    OperatorComposeButton,
    OperatorDecisionComposer,
    OperatorGatedAction,
    OperatorIdChip,
    OperatorReadOnlyAction,
    OperatorSafetyRail,
    OperatorSectionHeader,
    type OperatorSlateTone,
} from "@/components/operator/slate";
import { RouteTopologyReadiness } from "@/components/operator/RouteTopologyReadiness";

type IconProps = {
    className?: string;
    size?: number;
};

function Glyph({ children, className = "", size = 12 }: IconProps & { children: string }) {
    return <span className={className} style={{ fontSize: size }} aria-hidden="true">{children}</span>;
}

const ShieldAlert = (props: IconProps) => <Glyph {...props}>!!</Glyph>;
const AlertTriangle = (props: IconProps) => <Glyph {...props}>!</Glyph>;
const RefreshCw = (props: IconProps) => <Glyph {...props}>ST</Glyph>;

/* ============================================================================
   dev.jai.nexus — LIVE DASHBOARD PROTOTYPE v0  ·  "OPERATOR SLATE"
   ADVISORY — NON-AUTHORIZING — NON-EXECUTING — INTERNAL / PRE-CUSTOMER
   - Looks live; is not live. Local constants only. No backend, APIs, SDKs,
     GitHub integration, telemetry, storage, scheduler, or auth changes.
   - SYN-* IDs are synthetic fixtures. Items marked EXAMPLE CANONICAL are
     read-only samples of real record shapes, not live data.
   - Live verbs: REAL-COMPOSE (clipboard copy) and READ-ONLY links. Nothing else.
   - Primitives duplicate the design-system panel pending the extraction route.
   ============================================================================ */

/* --------------------------------- FIXTURES -------------------------------- */

const HEADER = {
    mode: "MANUAL HANDOFF · ADVISORY",
    ctSession: "SYN-CT-SESSION-0014",
    latestMotion: "MOTION-0192 · Agenda Deliberation Routing",
    latestMotionNote: "EXAMPLE CANONICAL · READ-ONLY SAMPLE",
    batch: "BATCH 22",
    gates: "ZERO GATES GRANTED",
    stepUp: "NOT REQUESTED",
    environment: "INTERNAL / PRE-CUSTOMER",
    snapshot: "2026-06-11 09:40",
    snapshotState: "FRESH",
    risk: "ELEVATED — 2 closeouts unreconciled",
};

const QUEUE = [
    { id: "SYN-CI-0012", kind: "Closeout awaiting reconciliation", source: "jai-format · cascade profile", priority: "P1", status: "PENDING REVIEW", blocker: null, safe: { label: "Copy reconciliation draft", compose: true }, gated: null },
    { id: "SYN-RT-0031", kind: "Route prompt ready", source: "jai-format · RECEIPT_SCHEMA_V0", priority: "P1", status: "DRAFT", blocker: null, safe: { label: "Compose route prompt", compose: true }, gated: null },
    { id: "SYN-PR-0007", kind: "PR draft needed", source: "dev-jai-nexus · eval harness PR1", priority: "P2", status: "DRAFT", blocker: "branch milestone unconfirmed", safe: { label: "Draft PR description", compose: true }, gated: "Open PR" },
    { id: "MOTION-0192", kind: "Motion attention item", source: "EXAMPLE CANONICAL · READ-ONLY SAMPLE", priority: "P2", status: "PENDING REVIEW", blocker: null, safe: { label: "Open read-only source", compose: false }, gated: null },
    { id: "SYN-SG-0001", kind: "Security gate design pending", source: "doctrine · SEC_GATE_0", priority: "P3", status: "DRAFT", blocker: null, safe: { label: "Mark for manual review", compose: false, mock: true }, gated: "Change gate" },
    { id: "SYN-COUNCIL-0001", kind: "Council synthesis pending", source: "council · ordering question", priority: "P2", status: "ADVISORY", blocker: null, safe: { label: "Copy decision draft", compose: true }, gated: null },
    { id: "SYN-LANE-0005", kind: "Agent lane candidate staged", source: "lanes · Builder", priority: "P4", status: "GATE CLOSED", blocker: "GATES CLOSED — representational only", safe: { label: "Open read-only source", compose: false }, gated: "Dispatch Agent" },
];

const REPOS = [
    { name: "dev-jai-nexus", status: "READ-ONLY", tone: "sky", focus: "control plane shell + eval harness", lastCloseout: "SYN-CI-0009 · 1d", nextRoute: "CONTROL_PLANE_PROTOTYPE_V0 PR1", risk: "LOW", authority: "operator-routed lanes only", gatesOpen: 0 },
    { name: "jai-format", status: "READ-ONLY", tone: "sky", focus: "RECEIPT_SCHEMA_V0 (queued)", lastCloseout: "cascade profile · 0d", nextRoute: "RECEIPT_SCHEMA_V0", risk: "MED — receipts precede schema", authority: "schema authority · docs only", gatesOpen: 0 },
    { name: "orchestrator-nexus", status: "READ-ONLY", tone: "sky", focus: "none routed", lastCloseout: "—", nextRoute: "none", risk: "LOW", authority: "EXCLUDED from work-packet authority", gatesOpen: 0 },
    { name: "api-nexus", status: "READ-ONLY", tone: "sky", focus: "read-model contracts (queued)", lastCloseout: "—", nextRoute: "VOC effective-config read model", risk: "LOW", authority: "contracts + fixtures only", gatesOpen: 0 },
    { name: "audit-nexus", status: "READ-ONLY", tone: "sky", focus: "divergence verifier scope (spec)", lastCloseout: "—", nextRoute: "AUDIT_SCOPE_EXTENSION_V0", risk: "LOW", authority: "read-only reports", gatesOpen: 0 },
    { name: "jai-edge", status: "FROZEN", tone: "slate", focus: "tier-3 freeze", lastCloseout: "—", nextRoute: "none until contracts stable", risk: "—", authority: "none", gatesOpen: 0 },
    { name: "jai-vscode", status: "FROZEN", tone: "slate", focus: "tier-3 freeze", lastCloseout: "—", nextRoute: "none until contracts stable", risk: "—", authority: "none", gatesOpen: 0 },
    { name: "jai-pilot", status: "FROZEN", tone: "slate", focus: "tier-3 freeze", lastCloseout: "—", nextRoute: "none until contracts stable", risk: "—", authority: "none", gatesOpen: 0 },
    { name: "JAI / future core", status: "RESERVED", tone: "amber", focus: "reserved placeholder", lastCloseout: "—", nextRoute: "none", risk: "—", authority: "none", gatesOpen: 0 },
];

const SPINE = [
    { stage: "Motion", count: 3, status: "open", note: "intent on record" },
    { stage: "Route", count: 2, status: "queued", note: "recommends — does not execute" },
    { stage: "Repo Lane", count: 1, status: "routed", note: "operator-carried only" },
    { stage: "Diff / PR Draft", count: 1, status: "draft", note: "text only — human opens PRs" },
    { stage: "Validation", count: 2, status: "shape-only", note: "checks shape — not acceptance" },
    { stage: "Closeout", count: 2, status: "awaiting", note: "records work — not a receipt" },
    { stage: "CT Decision", count: 2, status: "pending", note: "CONTROL_THREAD decides" },
    { stage: "Receipt", count: 0, status: "schema pending", note: "records — does not decide" },
];

const SLOTS = [
    { id: "SYN-SLOT-GPT", name: "ChatGPT", role: "Builder", ret: "RETURNED" },
    { id: "SYN-SLOT-FABLE", name: "Claude / Fable", role: "Challenger", ret: "RETURNED · DISSENT" },
    { id: "SYN-SLOT-RES", name: "Research", role: "Evidence", ret: "RETURNED" },
    { id: "SYN-SLOT-SPEC", name: "Specialist", role: "Security", ret: "AWAITING" },
    { id: "SYN-SLOT-JAI", name: "Future JAI", role: "Reserved", ret: "RESERVED" },
];

const AGENT_LANES = [
    { name: "Builder Agent", task: "draft harness fixture files as text diffs" },
    { name: "Verifier Agent", task: "shape-check motion/receipt examples" },
    { name: "Auditor Agent", task: "divergence report draft (read-only)" },
    { name: "Refactor Agent", task: "primitive extraction plan (text)" },
    { name: "Docs Agent", task: "doctrine doc drafts" },
    { name: "Security Agent", task: "SEC_GATE_0 design notes" },
];

const SEC_GATES = [
    { name: "Code-push gate", state: "CLOSED" },
    { name: "PR creation gate", state: "CLOSED" },
    { name: "Model dispatch gate", state: "CLOSED" },
    { name: "Agent execution gate", state: "CLOSED" },
    { name: "Deployment gate", state: "CLOSED" },
    { name: "Blocked settings gate", state: "BLOCKED — not gateable" },
    { name: "Customer data gate", state: "BLOCKED — not gateable" },
];

const SEC_STRINGS = [
    "Authentication is not authorization.",
    "Step-up verification confirms operator presence only.",
    "Verified session does not open execution gates.",
    "No code push authority in v0.",
    "No Agent execution authority in v0.",
];

const SIGNALS = [
    { source: "Control-plane snapshot fixtures", provenance: "fixtures/control-plane@SYN-sha", updated: "0h", state: "FRESH", labels: ["FIXTURE"] },
    { source: "Canon index sample", provenance: "docs/canon (sample)", updated: "1d", state: "FRESH", labels: ["EXAMPLE CANONICAL", "READ-ONLY SAMPLE"] },
    { source: "Eval harness runs/", provenance: "docs/eval/.../runs", updated: "—", state: "EMPTY", labels: ["AWAITING FIRST RUN"] },
    { source: "Council returns", provenance: "council/returns (fixtures)", updated: "3h", state: "FRESH", labels: ["FIXTURE", "CLAIMS, NOT FACTS"] },
    { source: "Polyrepo activity map", provenance: "fixtures/repos.json", updated: "4d", state: "STALE", labels: ["NEEDS REFRESH", "FIXTURE"] },
    { source: "Spine counts", provenance: "computed from snapshot", updated: "0h", state: "FRESH", labels: ["DERIVED-DISPLAY"] },
    { source: "Blocked-settings registry", provenance: "doctrine sample", updated: "2d", state: "FRESH", labels: ["READ-ONLY SAMPLE", "BLOCKED CLASSES"] },
];

const RAIL_STRINGS = OPERATOR_SAFETY_INVARIANTS;

const SAFE_COMMANDS = [
    { label: "Compose next route", compose: true, text: "ROUTE DRAFT — RECEIPT_SCHEMA_V0\nTARGET: jai-format · DOCS ONLY\nNON-AUTHORIZING · GATES GRANTED: 0" },
    { label: "Copy closeout review", compose: true, text: "CLOSEOUT ACCEPTANCE DRAFT — SYN-CI-0012\nDECISION: [OPERATOR]\nNON-AUTHORIZING UNTIL COMMITTED" },
    { label: "Open motion source", compose: false, readonly: true },
    { label: "Draft PR description", compose: true, text: "PR DESCRIPTION DRAFT — eval harness PR1\nHUMAN-OPENED PR ONLY · NO AUTOMATION" },
    { label: "Prepare Council packet", compose: true, text: "COUNCIL HANDOFF PACKET — MANUAL CARRY ONLY\npacket_id: SYN-CP-0002\nGATES GRANTED: 0" },
    { label: "Stage Agent lane candidate", compose: true, text: "AGENT LANE CANDIDATE — REPRESENTATIONAL ONLY\nlane: Builder · staged, not executing\nREQUIRED: SEC_GATE_0 + GATE_CLASS_1 + STEP-UP + RECEIPT" },
];

const GATED_COMMANDS = ["Push branch", "Open PR", "Dispatch Agent", "Call model", "Merge", "Deploy", "Change gate"];

const DECISIONS = ["ACCEPT", "ACCEPT WITH CONDITIONS", "DEFER", "REJECT", "REQUIRES REVISION"];
const DEPTHS = ["skim", "sampled", "full"];

/* -------------------------------- PRIMITIVES ------------------------------- */

type Tone = "slate" | "amber" | "red" | "emerald" | "sky";

const toneMap: Record<Tone, OperatorSlateTone> = {
    slate: "neutral",
    amber: "advisory",
    red: "danger",
    emerald: "canonical",
    sky: "pending",
};

function B({ label, tone = "slate" }: { label: string; tone?: Tone }) {
    return <OperatorBadge label={label} tone={toneMap[tone]} />;
}

function Id({ children }: { children: ReactNode }) {
    return <OperatorIdChip>{children}</OperatorIdChip>;
}

function H({
    n,
    title,
    right,
}: {
    n: string;
    title: string;
    right?: ReactNode;
}) {
    return <OperatorSectionHeader index={n} title={title} right={right} />;
}

function ComposeBtn({
    text,
    children,
    small = false,
}: {
    text: string | (() => string);
    children: ReactNode;
    small?: boolean;
}) {
    return (
        <OperatorComposeButton text={text} compact={small}>
            {children}
        </OperatorComposeButton>
    );
}

function ReadOnlyLink({ children }: { children: ReactNode }) {
    return <OperatorReadOnlyAction>{children}</OperatorReadOnlyAction>;
}

function GatedChip({
    children,
    blocked = false,
}: {
    children: ReactNode;
    blocked?: boolean;
}) {
    return blocked ? (
        <OperatorBlockedAction>{children}</OperatorBlockedAction>
    ) : (
        <OperatorGatedAction>{children}</OperatorGatedAction>
    );
}

/* ------------------------------ MAIN COMPONENT ----------------------------- */

export default function LiveDashboardPrototype() {
    const [pFilter, setPFilter] = useState("ALL");

    const queue = QUEUE.filter((q) => pFilter === "ALL" || q.priority === pFilter);

    return (
        <div className="min-h-screen bg-slate-950 p-3 font-sans text-slate-300 md:p-5">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row">
                <div className="min-w-0 flex-1 space-y-5">
                    <div className="flex flex-wrap gap-2 rounded border border-slate-800 bg-slate-900 p-3">
                        <B label="LOCAL / STATIC" />
                        <B label="SECONDARY" tone="sky" />
                        <B label="PROTOTYPE" />
                        <B label="PENDING ROUTE DECISION" tone="amber" />
                        <B label="FIXTURE DATA" />
                        <B label="NON-AUTHORIZING" tone="amber" />
                        <B label="NO EXECUTION" tone="red" />
                        <B label="NO PROVIDER / MODEL DISPATCH" tone="red" />
                        <B label="NO AGENT EXECUTION" tone="red" />
                        <B label="ZERO EXECUTION GATES GRANTED" tone="red" />
                    </div>

                    <RouteTopologyReadiness index="00" compact />

                    {/* 1 · LIVE OPERATOR HEADER */}
                    <section className="rounded border border-slate-800 bg-slate-900 p-4">
                        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                            Live Operator Header
                        </div>
                        <div className="mb-3 rounded border border-amber-900 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
                            Route posture: `/operator/live-dashboard` is a
                            live-readiness prototype and future cockpit
                            candidate. It is not promoted to `/operator` in
                            Commit 1.
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-mono text-sm font-semibold tracking-wide text-slate-100">
                                dev.jai.nexus · operator dashboard
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <B label="INTERNAL OPERATOR" tone="sky" />
                                <B label="PRE-CUSTOMER" tone="slate" />
                                <B label="READ-ONLY SAMPLE" tone="slate" />
                                <B label="ZERO GATES GRANTED" tone="red" />
                            </div>
                        </div>
                        <div className="mt-3 grid gap-x-6 gap-y-1.5 text-xs md:grid-cols-2 lg:grid-cols-3">
                            <div><span className="font-mono uppercase text-slate-500">mode · </span>{HEADER.mode}</div>
                            <div><span className="font-mono uppercase text-slate-500">ct session · </span><Id>{HEADER.ctSession}</Id></div>
                            <div><span className="font-mono uppercase text-slate-500">batch · </span>{HEADER.batch}</div>
                            <div className="lg:col-span-2"><span className="font-mono uppercase text-slate-500">latest motion · </span>{HEADER.latestMotion} <B label={HEADER.latestMotionNote} tone="sky" /></div>
                            <div><span className="font-mono uppercase text-slate-500">environment · </span>{HEADER.environment}</div>
                            <div><span className="font-mono uppercase text-slate-500">snapshot · </span>{HEADER.snapshot} <B label={HEADER.snapshotState} tone="emerald" /></div>
                            <div><span className="font-mono uppercase text-slate-500">step-up · </span>{HEADER.stepUp}</div>
                            <div><span className="font-mono uppercase text-slate-500">risk posture · </span><span className="text-amber-300">{HEADER.risk}</span></div>
                        </div>
                        <div className="mt-3 rounded border border-amber-800 bg-amber-950 px-2 py-1 text-center font-mono text-xs uppercase tracking-widest text-amber-300">
                            Step-up required for privileged actions — and step-up alone opens nothing
                        </div>
                    </section>

                    {/* 2 · TODAY'S WORK QUEUE */}
                    <section>
                        <H
                            n="02"
                            title="Today's work queue"
                            right={
                                <div className="flex gap-1">
                                    {["ALL", "P1", "P2"].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setPFilter(f)}
                                            className={`rounded border px-1.5 py-0.5 font-mono text-xs ${pFilter === f ? "border-slate-500 text-slate-200" : "border-slate-800 text-slate-500"
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                    <B label="FIXTURE" tone="slate" />
                                </div>
                            }
                        />
                        <div className="space-y-2">
                            {queue.map((q) => (
                                <div key={q.id} className="rounded border border-slate-800 bg-slate-900 p-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <B label={q.priority} tone={q.priority === "P1" ? "amber" : "slate"} />
                                            <span className="text-sm text-slate-200">{q.kind}</span>
                                            <Id>{q.id}</Id>
                                            {q.id.startsWith("SYN-") ? (
                                                <B label="FIXTURE" tone="slate" />
                                            ) : (
                                                <>
                                                    <B label="EXAMPLE CANONICAL" tone="sky" />
                                                    <B label="READ-ONLY SAMPLE" tone="sky" />
                                                </>
                                            )}
                                        </div>
                                        <B label={q.status} tone={q.status === "GATE CLOSED" ? "red" : q.status === "ADVISORY" ? "amber" : "sky"} />
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                        <span><span className="font-mono uppercase text-slate-500">source · </span>{q.source}</span>
                                        {q.blocker && (
                                            <span className="text-amber-300"><span className="font-mono uppercase text-amber-500">blocker · </span>{q.blocker}</span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        {q.safe.compose ? (
                                            <>
                                                <ComposeBtn small text={`${q.safe.label.toUpperCase()} — ${q.id}\nNON-AUTHORIZING · GATES GRANTED: 0`}>{q.safe.label}</ComposeBtn>
                                                <B label="REAL-COMPOSE" tone="emerald" />
                                            </>
                                        ) : q.safe.mock ? (
                                            <>
                                                <span className="rounded border border-dashed border-slate-600 px-1.5 py-0.5 font-mono text-xs uppercase text-slate-500">{q.safe.label}</span>
                                                <B label="MOCK" tone="slate" />
                                            </>
                                        ) : (
                                            <ReadOnlyLink>{q.safe.label}</ReadOnlyLink>
                                        )}
                                        {q.gated && (
                                            <GatedChip>
                                                {q.gated} — GATED / DISABLED
                                            </GatedChip>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3 · POLYREPO ACTIVITY MAP */}
                    <section>
                        <H n="03" title="Polyrepo activity map" right={<><B label="READ-ONLY" tone="sky" /><B label="FIXTURE" tone="slate" /></>} />
                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                            {REPOS.map((r) => (
                                <div key={r.name} className="rounded border border-slate-800 bg-slate-900 p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-sm text-slate-200">{r.name}</span>
                                        <B label={r.status} tone={r.tone as Tone} />
                                    </div>
                                    <div className="mt-1.5 space-y-0.5 text-xs text-slate-400">
                                        <div><span className="font-mono uppercase text-slate-500">focus · </span>{r.focus}</div>
                                        <div><span className="font-mono uppercase text-slate-500">last closeout · </span>{r.lastCloseout}</div>
                                        <div><span className="font-mono uppercase text-slate-500">next route · </span>{r.nextRoute}</div>
                                        <div><span className="font-mono uppercase text-slate-500">risk · </span><span className={r.risk.startsWith("MED") ? "text-amber-300" : ""}>{r.risk}</span></div>
                                        <div><span className="font-mono uppercase text-slate-500">authority · </span>{r.authority}</div>
                                        <div><span className="font-mono uppercase text-slate-500">open gates · </span><span className="text-red-300">{r.gatesOpen}</span></div>
                                    </div>
                                    <div className="mt-2"><ReadOnlyLink>Open repo</ReadOnlyLink></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-1.5 font-mono text-xs uppercase tracking-wide text-slate-600">
                            Map displays state only — the dashboard cannot mutate repositories.
                        </div>
                    </section>

                    {/* 4 · MOTION / ROUTE / RECEIPT SPINE */}
                    <section>
                        <H n="04" title="Motion → route → receipt spine" right={<B label="DERIVED-DISPLAY" tone="sky" />} />
                        <div className="flex flex-wrap items-stretch gap-1.5">
                            {SPINE.map((s, i) => (
                                <div key={s.stage} className="flex items-center gap-1.5">
                                    <div className="min-w-28 rounded border border-slate-800 bg-slate-900 p-2 text-center">
                                        <div className="font-mono text-xs uppercase tracking-wide text-slate-300">{s.stage}</div>
                                        <div className="font-mono text-lg text-slate-100">{s.count}</div>
                                        <div className="font-mono text-xs text-slate-500">{s.status}</div>
                                        <div className="mt-1 text-xs text-amber-400">{s.note}</div>
                                    </div>
                                    {i < SPINE.length - 1 && <span className="font-mono text-slate-600">→</span>}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 rounded border border-slate-800 bg-slate-900 px-2 py-1.5 font-mono text-xs uppercase tracking-wide text-slate-400">
                            Route recommendation is not execution · validation is not acceptance · receipts
                            record but do not decide · <span className="text-amber-300">CONTROL_THREAD decides</span>
                        </div>
                    </section>

                    {/* 5 · COUNCIL / MODEL SLOT STATUS */}
                    <section>
                        <H n="05" title="Council / model slots" right={<><B label="ADVISORY ONLY" tone="amber" /><B label="NO DISPATCH" tone="red" /></>} />
                        <div className="rounded border border-slate-800 bg-slate-900 p-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-mono uppercase text-slate-500">advisory fixture session · </span>
                                <Id>SYN-COUNCIL-0001</Id>
                                <B label="SYNTHESIS: DRAFT" tone="amber" />
                                <span className="text-red-300 font-mono">dissent: 1</span>
                                <span className="text-red-300 font-mono">contradictions: 1</span>
                                <B label="CT DECISION REQUIRED" tone="amber" />
                            </div>
                            <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                                {SLOTS.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs">
                                        <span className="text-slate-300">{s.name} <span className="text-slate-500">· {s.role}</span></span>
                                        <B label={s.ret} tone={s.ret.includes("DISSENT") ? "red" : s.ret === "RETURNED" ? "sky" : s.ret === "RESERVED" ? "amber" : "slate"} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-xs text-slate-400">
                                <span className="font-mono uppercase text-slate-500">recommended reviewer · </span>
                                Challenger (Fable) — operator preference 2026-06-10 · <B label="ADVISORY" tone="amber" />{" "}
                                <span className="text-slate-500">no winner state · no automatic selection · output remains advisory</span>
                            </div>
                        </div>
                    </section>

                    {/* 6 · AGENT LANE STAGING */}
                    <section>
                        <H n="06" title="Agent lane staging" right={<B label="REPRESENTATIONAL ONLY" tone="amber" />} />
                        <div className="rounded border border-amber-800 bg-amber-950 px-2 py-1.5 text-center font-mono text-xs uppercase tracking-widest text-amber-300">
                            Agent lane is staged, not executing.
                        </div>
                        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                            {AGENT_LANES.map((a) => (
                                <div key={a.name} className="rounded border border-dashed border-amber-900 bg-slate-900 p-3 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm text-slate-200">{a.name}</span>
                                        <B label="STAGED" tone="amber" />
                                    </div>
                                    <div className="mt-1.5 space-y-0.5 text-slate-400">
                                        <div><span className="font-mono uppercase text-slate-500">staged task · </span>{a.task}</div>
                                        <div><span className="font-mono uppercase text-slate-500">pre-gate · </span>compose briefs and text drafts only</div>
                                        <div><span className="font-mono uppercase text-slate-500">blocked · </span><span className="text-red-300">execute, commit, push, dispatch</span></div>
                                        <div><span className="font-mono uppercase text-slate-500">required · </span>SEC_GATE_0 + GATE_CLASS_1 + step-up + receipt</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 7 · SECURITY / AUTHORITY CENTER */}
                    <section>
                        <H n="07" title="Security / authority center" right={<ShieldAlert size={14} className="text-amber-400" />} />
                        <div className="grid gap-2 lg:grid-cols-2">
                            <div className="rounded border border-slate-800 bg-slate-900 p-3 text-xs">
                                <div className="font-mono uppercase tracking-wider text-slate-500">Identity (sample)</div>
                                <div className="mt-1.5 space-y-1">
                                    <div><span className="font-mono uppercase text-slate-500">authentication · </span><B label="SESSION AUTHENTICATED" tone="sky" /></div>
                                    <div><span className="font-mono uppercase text-slate-500">step-up · </span><B label="NOT VERIFIED" tone="amber" /></div>
                                    <div><span className="font-mono uppercase text-slate-500">privileged policy · </span>step-up + named gate + receipt, every time</div>
                                </div>
                            </div>
                            <div className="rounded border border-red-900 bg-slate-900 p-3 text-xs">
                                <div className="font-mono uppercase tracking-wider text-slate-500">Authorization (fact)</div>
                                <div className="mt-1.5 space-y-1">
                                    {SEC_GATES.map((g) => (
                                        <div key={g.name} className="flex items-center justify-between">
                                            <span className="text-slate-300">{g.name}</span>
                                            <B label={g.state} tone={g.state === "CLOSED" ? "red" : "red"} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 grid gap-1 md:grid-cols-2">
                            {SEC_STRINGS.map((s) => (
                                <div key={s} className="rounded border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-xs text-amber-300">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 8 · LIVE SIGNALS / STALENESS */}
                    <section>
                        <H n="08" title="Live signals / staleness" right={<RefreshCw size={13} className="text-slate-500" />} />
                        <div className="overflow-x-auto rounded border border-slate-800 bg-slate-900">
                            {SIGNALS.map((s) => (
                                <div key={s.source} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-3 py-2 text-xs last:border-b-0">
                                    <div className="min-w-48 text-slate-200">{s.source}</div>
                                    <div className="font-mono text-slate-500">{s.provenance}</div>
                                    <div className="font-mono text-slate-500">updated {s.updated}</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <B label={s.state} tone={s.state === "FRESH" ? "emerald" : s.state === "STALE" ? "amber" : "slate"} />
                                        {s.labels.map((l) => (
                                            <B key={l} label={l} tone={l === "NEEDS REFRESH" ? "amber" : l.includes("CANONICAL") ? "sky" : "slate"} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 9 · OPERATOR COMMAND STRIP */}
                    <section>
                        <H n="09" title="Operator command strip" />
                        <div className="rounded border border-slate-800 bg-slate-900 p-3">
                            <div className="flex flex-wrap gap-2">
                                {SAFE_COMMANDS.map((c) =>
                                    c.compose ? (
                                        <ComposeBtn key={c.label} small text={c.text ?? ""}>{c.label}</ComposeBtn>
                                    ) : (
                                        <ReadOnlyLink key={c.label}>{c.label}</ReadOnlyLink>
                                    )
                                )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-800 pt-2">
                                {GATED_COMMANDS.map((c) => (
                                    <GatedChip key={c} blocked={c === "Change gate"}>
                                        {c}
                                    </GatedChip>
                                ))}
                            </div>
                            <div className="mt-1.5 font-mono text-xs uppercase tracking-wide text-slate-600">
                                Safe verbs copy text or open sources. Gated verbs are inert until a named gate,
                                step-up, and receipt path exist.
                            </div>
                        </div>
                    </section>

                    {/* 10 · DECISION / RECEIPT COMPOSER */}
                    <section>
                        <H n="10" title="Decision / receipt composer" right={<><B label="REAL-COMPOSE" tone="emerald" /><B label="DOES NOT CREATE RECEIPT" tone="amber" /></>} />
                        <OperatorDecisionComposer
                            decisions={DECISIONS}
                            depths={DEPTHS}
                            metadata={
                                <div className="text-xs text-slate-400">
                                    <div><span className="font-mono uppercase text-slate-500">validation · </span>shape-only · validator must be named</div>
                                    <div><span className="font-mono uppercase text-slate-500">receipt · </span>expected on commit · schema pending</div>
                                    <div><span className="font-mono uppercase text-slate-500">next route · </span>RECEIPT_SCHEMA_V0</div>
                                </div>
                            }
                            buildDraft={({ decision, depth }) => `CONTROL_THREAD DECISION DRAFT — MANUAL REVIEW REQUIRED
target: SYN-CI-0012   decision: ${decision || "[SELECT]"}   depth: ${depth || "[SELECT]"}
conditions: [OPERATOR]   risks: receipts precede schema (open)
DOES NOT CREATE RECEIPT. NON-AUTHORIZING UNTIL COMMITTED. GATES GRANTED: 0.`}
                        />
                    </section>
                </div>

                {/* 11 · RIGHT SAFETY RAIL */}
                <aside className="w-full shrink-0 xl:w-72">
                    <OperatorSafetyRail
                        invariants={RAIL_STRINGS}
                        className="xl:sticky xl:top-4"
                    >
                        <div className="space-y-1 text-xs">
                            <div><span className="font-mono uppercase text-slate-500">posture · </span>NON-AUTHORIZING</div>
                            <div><span className="font-mono uppercase text-slate-500">gates granted · </span><span className="font-mono text-red-300">0</span></div>
                            <div><span className="font-mono uppercase text-slate-500">security · </span>step-up NOT VERIFIED</div>
                            <div><span className="font-mono uppercase text-slate-500">customer access · </span>NONE</div>
                            <div><span className="font-mono uppercase text-slate-500">production · </span>NOT PRODUCTION</div>
                        </div>
                        <div className="border-t border-slate-800 pt-2 text-xs">
                            <div className="font-mono uppercase tracking-wider text-red-400">Open contradictions · 1</div>
                            <div className="mt-1 flex items-center gap-1.5 text-red-300">
                                <AlertTriangle size={11} /> SYN-CON-0001 — routing order
                            </div>
                        </div>
                        <div className="border-t border-slate-800 pt-2 text-xs">
                            <div className="font-mono uppercase tracking-wider text-sky-400">Unresolved · 2</div>
                            <div className="mt-1 text-slate-400">provisional-field promotion · same-milestone feasibility</div>
                        </div>
                        <div className="border-t border-slate-800 pt-2 text-xs">
                            <div className="font-mono uppercase tracking-wider text-red-400">Blocked capabilities</div>
                            <div className="mt-1 text-slate-400">dispatch · repo mutation · branch/PR automation · live settings · telemetry · customer data · parser/runtime · production behavior</div>
                        </div>
                    </OperatorSafetyRail>
                </aside>
            </div>

            <footer className="mx-auto mt-5 max-w-7xl border-t border-slate-800 pt-2.5 text-center font-mono text-xs uppercase tracking-widest text-slate-600">
                Internal · pre-customer · non-authorizing · looks live, is not live · zero gates granted
            </footer>
        </div>
    );
}
