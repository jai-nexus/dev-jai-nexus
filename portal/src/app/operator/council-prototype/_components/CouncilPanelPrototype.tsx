"use client";

import type { ReactNode } from "react";

import {
    OPERATOR_SAFETY_INVARIANTS,
    OperatorBadge,
    OperatorComposeButton,
    OperatorContradictionCard,
    OperatorDecisionComposer,
    OperatorDissentCard,
    OperatorSafetyRail,
    OperatorSectionHeader,
    type OperatorSlateTone,
} from "@/components/operator/slate";
import { JaiCouncilReadiness } from "@/components/operator/JaiCouncilReadiness";

type IconProps = {
    className?: string;
    size?: number;
};

function Glyph({ children, className = "", size = 12 }: IconProps & { children: string }) {
    return <span className={className} style={{ fontSize: size }} aria-hidden="true">{children}</span>;
}

const Lock = (props: IconProps) => <Glyph {...props}>X</Glyph>;
const AlertTriangle = (props: IconProps) => <Glyph {...props}>!</Glyph>;

/* ============================================================================
   JAI COUNCIL — SMALL PROTOTYPE v0
   ADVISORY — NON-AUTHORIZING — REPRESENTATIONAL ONLY
   - Local constants only. Synthetic SYN-* IDs only.
   - No backend, no API calls, no provider SDKs, no telemetry.
   - No localStorage/sessionStorage as system of record.
   - Allowed live verbs: REAL-COMPOSE (copy text to clipboard) only.
   ============================================================================ */

/* ----------------------------- FIXTURES (SYN-) ---------------------------- */

const SESSION = {
    id: "SYN-COUNCIL-0001",
    packetId: "SYN-CP-0001",
    primerSha: "sha256:9f3a17c2…SYNTHETIC",
    opened: "2026-06-11",
    question:
        "Should RECEIPT_SCHEMA_V0 precede COUNCIL_REPRESENTATION_PROFILE_V0 in the jai-format routing order?",
    status: "ADVISORY",
    authority: "NON-AUTHORIZING",
    gates: "ZERO GRANTED",
    decision: "PENDING",
};

const SLOTS = [
    {
        id: "SYN-SLOT-GPT",
        name: "ChatGPT",
        role: "General Reasoning / Builder",
        status: "RETURNED",
        primer: "sha256:9f3a…SYN",
        lastReturn: "SYN-RET-001 · RETURNED",
        reserved: false,
    },
    {
        id: "SYN-SLOT-FABLE",
        name: "Claude / Fable",
        role: "Challenger / Critic",
        status: "RETURNED",
        primer: "sha256:9f3a…SYN",
        lastReturn: "SYN-RET-002 · RETURNED (DISSENT)",
        reserved: false,
    },
    {
        id: "SYN-SLOT-RES",
        name: "Research Slot",
        role: "Evidence / External Context",
        status: "RETURNED",
        primer: "sha256:9f3a…SYN",
        lastReturn: "SYN-RET-003 · RETURNED",
        reserved: false,
    },
    {
        id: "SYN-SLOT-SPEC",
        name: "Specialist Reviewer",
        role: "Domain / Security",
        status: "AWAITING RETURN",
        primer: "sha256:9f3a…SYN",
        lastReturn: "—",
        reserved: false,
    },
    {
        id: "SYN-SLOT-JAI",
        name: "Future JAI Model",
        role: "Reserved",
        status: "RESERVED",
        primer: "—",
        lastReturn: "—",
        reserved: true,
    },
];

const RETURNS = [
    {
        id: "SYN-RET-001",
        slot: "SYN-SLOT-GPT",
        slotName: "ChatGPT · Builder",
        packetEcho: "SYN-CP-0001",
        echoOk: true,
        summary:
            "Council profile can ship first with receipt_expectation marked PROVISIONAL; ordering risk is low.",
        claims: [
            {
                id: "c1",
                text: "Provisional fields prevent premature schema fossilization.",
                evidence: ["SYN-EV-D6-FIXNOTE"],
            },
            {
                id: "c2",
                text: "Parallel drafting saves a milestone; ordering risk is low.",
                evidence: [],
            },
        ],
        concerns: ["Provisional fields historically outlive their intent."],
        contradictions: [],
        confidence: { level: "MEDIUM", basis: "Prior provisional-field pattern" },
        unresolved: ["Who owns promotion of PROVISIONAL fields to ratified?"],
    },
    {
        id: "SYN-RET-002",
        slot: "SYN-SLOT-FABLE",
        slotName: "Claude / Fable · Challenger",
        packetEcho: "SYN-CP-0001",
        echoOk: true,
        summary:
            "Receipts are already minted without a ratified shape; schema-first closes a live trust-layer gap.",
        claims: [
            {
                id: "c1",
                text: "Q2M6 + cascade receipts exist with no accepted general schema.",
                evidence: ["SYN-EV-RECON-D5"],
            },
            {
                id: "c2",
                text:
                    "Minting a second specialized form before the general schema fragments the trust layer.",
                evidence: ["SYN-EV-D5-ROUTE-CRIT"],
            },
        ],
        concerns: [
            "A Council profile with provisional receipt fields normalizes schema debt.",
        ],
        contradictions: ["Opposes SYN-RET-001 claim c2 (ordering risk low)."],
        confidence: { level: "HIGH", basis: "Reconciliation findings 2026-06-11" },
        unresolved: ["Can both routes land inside the same milestone?"],
    },
    {
        id: "SYN-RET-003",
        slot: "SYN-SLOT-RES",
        slotName: "Research Slot · Evidence",
        packetEcho: "SYN-CP-0001",
        echoOk: true,
        summary:
            "Precedent: schema-before-profile reduced rework in the VOC cascade lane.",
        claims: [
            {
                id: "c1",
                text:
                    "VOC profile followed accepted cascade semantics doctrine; zero rework recorded.",
                evidence: ["SYN-EV-Q2M6"],
            },
        ],
        concerns: [],
        contradictions: [],
        confidence: { level: "MEDIUM", basis: "Single precedent only" },
        unresolved: ["Sample size = 1."],
    },
];

const DISSENTS = [
    {
        id: "SYN-DIS-0001",
        by: "SYN-SLOT-FABLE (Challenger)",
        opposes: "SYN-RET-001 · claim c2 (“ordering risk is low”)",
        grounds:
            "Unratified receipts already exist in the record; provisional fields tend to fossilize into de facto schemas.",
        severity: "HIGH",
        status: "OPEN",
        preserved: "YES",
    },
];

const CONTRADICTIONS = [
    {
        id: "SYN-CON-0001",
        a: "SYN-RET-001 · c2",
        b: "SYN-RET-002 · c2",
        status: "OPEN",
    },
];

const SYNTHESIS = {
    id: "SYN-SYNTH-0001",
    coverage: "returns 3/3 · dissents preserved 1/1",
    agreed: [
        "Both artifacts are needed and remain docs/spec/examples only.",
        "Neither route grants any authority; gates remain closed.",
    ],
    contested: [
        {
            topic: "Routing order",
            sideA: "Profile-first (SYN-RET-001)",
            sideB: "Schema-first (SYN-RET-002; precedent SYN-RET-003)",
        },
    ],
    contradictions: ["SYN-CON-0001 — OPEN"],
    unresolved: [
        "Promotion ownership for PROVISIONAL fields.",
        "Same-milestone feasibility for both routes.",
    ],
    routeRec:
        "Sequence RECEIPT_SCHEMA_V0 → COUNCIL_REPRESENTATION_PROFILE_V0. (ADVISORY)",
    refusalRec: "None raised this session.",
};

const RAIL_LINES = [
    "Council does not accept canon.",
    "Council agreement is not authority.",
    "Model output is advisory.",
    "Dissent must remain visible.",
    "CONTROL_THREAD decides.",
    "All execution gates remain closed.",
];

const INVARIANTS = [
    ...OPERATOR_SAFETY_INVARIANTS,
    "Council output is advisory only.",
    "Council agreement is not acceptance.",
    "Claims are not facts.",
    "No model dispatch in v0.",
    "No Agent execution in v0.",
];

const DECISIONS = [
    "ACCEPT",
    "ACCEPT WITH CONDITIONS",
    "DEFER",
    "REJECT",
    "REQUIRES REVISION",
];

const DEPTHS = ["skim", "sampled", "full"];

/* ------------------------------ SMALL HELPERS ----------------------------- */

type TagKind =
    | "REAL-COMPOSE"
    | "DERIVED-DISPLAY"
    | "FIXTURE"
    | "GATED"
    | "MOCK"
    | "BLOCKED";
type Tone = "slate" | "amber" | "red" | "emerald" | "sky";

const toneMap: Record<Tone, OperatorSlateTone> = {
    slate: "neutral",
    amber: "advisory",
    red: "danger",
    emerald: "canonical",
    sky: "pending",
};

const tagToneMap: Record<TagKind, OperatorSlateTone> = {
    "REAL-COMPOSE": "composeOnly",
    "DERIVED-DISPLAY": "pending",
    FIXTURE: "fixture",
    GATED: "gated",
    MOCK: "neutral",
    BLOCKED: "blocked",
};

function Tag({ kind }: { kind: TagKind }) {
    return <OperatorBadge label={kind} tone={tagToneMap[kind]} />;
}

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
    return <OperatorBadge tone={toneMap[tone]}>{children}</OperatorBadge>;
}

function SectionHeader({
    index,
    title,
    right,
}: {
    index: string;
    title: string;
    right?: ReactNode;
}) {
    return <OperatorSectionHeader index={index} title={title} right={right} />;
}

function CopyButton({
    buildText,
    children,
    disabled = false,
}: {
    buildText: () => string;
    children: ReactNode;
    disabled?: boolean;
}) {
    return (
        <OperatorComposeButton text={buildText} disabled={disabled}>
            {children}
        </OperatorComposeButton>
    );
}

/* ----------------------------- TEXT COMPOSERS ----------------------------- */

function buildHandoffPacket(slot: (typeof SLOTS)[number]) {
    return [
        "COUNCIL HANDOFF PACKET — MANUAL CARRY ONLY",
        `packet_id: ${SESSION.packetId}   session: ${SESSION.id}`,
        `slot: ${slot.name}   role: ${slot.role}`,
        `primer: ${SESSION.primerSha}  (primer_sha MUST echo in return)`,
        `question: ${SESSION.question}`,
        "required_return: COUNCIL_RETURN_V0 fields (summary, claims+evidence_refs,",
        "  concerns, refusals, contradictions, confidence{level,basis,defeaters},",
        "  unresolved_questions, non_authorizations_acknowledged)",
        "non_authorizations: ADVISORY ONLY · GATES GRANTED: 0 · NO DISPATCH ·",
        "  ECHO packet_id · CLAIMS ARE NOT FACTS · CONTROL_THREAD DECIDES",
    ].join("\n");
}

function buildDecisionRecord(decision: string, depth: string) {
    return [
        "CONTROL_THREAD DECISION RECORD (DRAFT — MANUAL REVIEW REQUIRED)",
        `session: ${SESSION.id}   date: ${SESSION.opened}`,
        `target: ${SYNTHESIS.id} route recommendation`,
        `decision: ${decision || "[SELECT]"}   review_depth: ${depth || "[SELECT]"}`,
        "conditions: [OPERATOR FILLS]",
        `dissent_acknowledged: ${DISSENTS[0].id} (${DISSENTS[0].status})`,
        `contradictions_open: ${CONTRADICTIONS[0].id}`,
        "NON-AUTHORIZING UNTIL COMMITTED BY OPERATOR. GATES GRANTED: 0.",
    ].join("\n");
}

/* --------------------------------- CARDS ---------------------------------- */

function SlotCard({ slot }: { slot: (typeof SLOTS)[number] }) {
    return (
        <div className="flex flex-col gap-2 rounded border border-slate-800 bg-slate-900 p-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="text-sm font-semibold text-slate-200">{slot.name}</div>
                    <div className="font-mono text-xs text-slate-500">{slot.id}</div>
                </div>
                <Badge tone={slot.status === "RETURNED" ? "emerald" : slot.reserved ? "amber" : "slate"}>
                    {slot.status}
                </Badge>
            </div>
            <div className="space-y-1 text-xs text-slate-400">
                <div>
                    <span className="text-slate-500">role · </span>
                    {slot.role}
                </div>
                <div className="font-mono">
                    <span className="text-slate-500">primer · </span>
                    {slot.primer}
                </div>
                <div className="font-mono">
                    <span className="text-slate-500">last return · </span>
                    {slot.lastReturn}
                </div>
                <div>
                    <span className="text-slate-500">authority · </span>
                    advisory only
                </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
                {slot.reserved ? (
                    <>
                        <CopyButton disabled buildText={() => ""}>
                            Compose handoff packet
                        </CopyButton>
                        <Tag kind="GATED" />
                    </>
                ) : (
                    <>
                        <CopyButton buildText={() => buildHandoffPacket(slot)}>
                            Compose handoff packet
                        </CopyButton>
                        <Tag kind="REAL-COMPOSE" />
                    </>
                )}
            </div>
            <div className="font-mono text-xs uppercase tracking-wide text-amber-500">
                Manual paste/import only — no send, no dispatch
            </div>
        </div>
    );
}

function ReturnCard({ ret }: { ret: (typeof RETURNS)[number] }) {
    return (
        <div className="rounded border border-slate-800 bg-slate-900 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="font-mono text-xs text-slate-400">
                    <span className="text-slate-200">{ret.id}</span>
                    {"  ·  "}
                    {ret.slotName}
                    {"  ·  echo "}
                    <span className={ret.echoOk ? "text-emerald-400" : "text-red-400"}>
                        {ret.packetEcho} {ret.echoOk ? "✓" : "✗"}
                    </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    <Badge tone="amber">Advisory return</Badge>
                    <Badge tone="red">Not canon</Badge>
                    <Badge tone="sky">Claims, not facts</Badge>
                    <Tag kind="FIXTURE" />
                </div>
            </div>

            <p className="mt-2 text-sm text-slate-300">{ret.summary}</p>

            <div className="mt-2 grid gap-2 md:grid-cols-2">
                <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-slate-500">
                        Claims
                    </div>
                    <ul className="mt-1 space-y-1">
                        {ret.claims.map((c) => (
                            <li key={c.id} className="text-xs text-slate-300">
                                <span className="font-mono text-slate-500">{c.id} · </span>
                                {c.text}{" "}
                                {c.evidence.length > 0 ? (
                                    c.evidence.map((e) => (
                                        <span
                                            key={e}
                                            className="ml-1 rounded border border-sky-800 bg-sky-950 px-1 font-mono text-xs text-sky-300"
                                        >
                                            {e}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ml-1 rounded border border-amber-800 bg-amber-950 px-1 font-mono text-xs text-amber-300">
                                        UNGROUNDED
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-2">
                    <div>
                        <div className="font-mono text-xs uppercase tracking-wider text-slate-500">
                            Concerns
                        </div>
                        <div className="mt-1 text-xs text-slate-300">
                            {ret.concerns.length ? ret.concerns.join(" ") : "None recorded."}
                        </div>
                    </div>
                    <div>
                        <div className="font-mono text-xs uppercase tracking-wider text-slate-500">
                            Contradictions
                        </div>
                        <div
                            className={`mt-1 text-xs ${ret.contradictions.length ? "text-red-300" : "text-slate-500"
                                }`}
                        >
                            {ret.contradictions.length
                                ? ret.contradictions.join(" ")
                                : "None declared."}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800 pt-2 text-xs">
                <span className="text-slate-400">
                    <span className="font-mono uppercase text-slate-500">confidence · </span>
                    <span
                        className={
                            ret.confidence.level === "HIGH" ? "text-emerald-300" : "text-amber-300"
                        }
                    >
                        {ret.confidence.level}
                    </span>
                    <span className="text-slate-500"> — {ret.confidence.basis}</span>
                </span>
                <span className="text-slate-400">
                    <span className="font-mono uppercase text-slate-500">unresolved · </span>
                    {ret.unresolved.join(" · ")}
                </span>
            </div>
        </div>
    );
}

/* ------------------------------ MAIN COMPONENT ---------------------------- */

export default function CouncilPanelPrototype() {
    return (
        <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-300 md:p-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row">
                {/* ------------------------------ MAIN COLUMN ----------------------- */}
                <div className="min-w-0 flex-1 space-y-5">
                    <div className="flex flex-wrap gap-2 rounded border border-slate-800 bg-slate-900 p-3">
                        <Badge>LOCAL / STATIC</Badge>
                        <Badge>PROTOTYPE</Badge>
                        <Badge>FIXTURE DATA</Badge>
                        <Badge tone="amber">NON-AUTHORIZING</Badge>
                        <Badge tone="red">NO EXECUTION</Badge>
                        <Badge tone="red">NO PROVIDER / MODEL DISPATCH</Badge>
                        <Badge tone="red">NO AGENT EXECUTION</Badge>
                        <Badge tone="red">ZERO EXECUTION GATES GRANTED</Badge>
                    </div>
                    <JaiCouncilReadiness index="00" compact />

                    {/* 1 · SESSION HEADER */}
                    <section className="rounded border border-slate-800 bg-slate-900 p-4">
                        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                            Council Session Header
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-mono text-xs text-slate-500">
                                JAI COUNCIL · <span className="text-slate-300">{SESSION.id}</span> ·
                                opened {SESSION.opened}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <Badge tone="amber">{SESSION.status}</Badge>
                                <Badge tone="slate">{SESSION.authority}</Badge>
                                <Badge tone="red">GATES: {SESSION.gates}</Badge>
                                <Badge tone="sky">CT DECISION: {SESSION.decision}</Badge>
                            </div>
                        </div>
                        <h1 className="mt-3 text-base font-semibold text-slate-100 md:text-lg">
                            {SESSION.question}
                        </h1>
                        <div className="mt-2 font-mono text-xs text-slate-500">
                            packet {SESSION.packetId} · primer {SESSION.primerSha} · <Tag kind="FIXTURE" />
                        </div>
                    </section>

                    {/* 2 · MODEL SLOTS */}
                    <section>
                        <SectionHeader index="02" title="Council model slots" right={<Tag kind="FIXTURE" />} />
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {SLOTS.map((s) => (
                                <SlotCard key={s.id} slot={s} />
                            ))}
                        </div>
                    </section>

                    {/* 3 · RETURN INTAKE */}
                    <section>
                        <SectionHeader
                            index="03"
                            title="Return intake"
                            right={
                                <span className="font-mono text-xs text-slate-500">
                                    manual paste/import only
                                </span>
                            }
                        />
                        <div className="space-y-3">
                            {RETURNS.map((r) => (
                                <ReturnCard key={r.id} ret={r} />
                            ))}
                        </div>
                    </section>

                    {/* 4 · DISSENT / CONTRADICTION LEDGER — deliberately loud */}
                    <section>
                        <SectionHeader
                            index="04"
                            title="Dissent / contradiction ledger"
                            right={<Badge tone="red">append-only</Badge>}
                        />
                        {DISSENTS.map((d) => (
                            <OperatorDissentCard
                                key={d.id}
                                className="p-4"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <AlertTriangle size={16} className="text-red-400" />
                                    <span className="font-mono text-sm font-semibold uppercase tracking-wider text-red-300">
                                        Dissent {d.id}
                                    </span>
                                    <Badge tone="red">severity: {d.severity}</Badge>
                                    <Badge tone="amber">status: {d.status}</Badge>
                                    <Badge tone="emerald">preserved in synthesis: {d.preserved}</Badge>
                                </div>
                                <div className="mt-2 space-y-1 text-sm text-red-100">
                                    <div>
                                        <span className="font-mono text-xs uppercase text-red-400">by · </span>
                                        {d.by}
                                    </div>
                                    <div>
                                        <span className="font-mono text-xs uppercase text-red-400">opposes · </span>
                                        {d.opposes}
                                    </div>
                                    <div>
                                        <span className="font-mono text-xs uppercase text-red-400">grounds · </span>
                                        {d.grounds}
                                    </div>
                                </div>
                            </OperatorDissentCard>
                        ))}
                        <OperatorContradictionCard className="mt-2 font-mono text-xs text-slate-400">
                            {CONTRADICTIONS.map((c) => (
                                <div key={c.id} className="flex flex-wrap items-center gap-2">
                                    <span className="text-slate-200">{c.id}</span>
                                    <span>{c.a}</span>
                                    <span className="text-red-400">⇄</span>
                                    <span>{c.b}</span>
                                    <Badge tone="amber">{c.status}</Badge>
                                    <Tag kind="DERIVED-DISPLAY" />
                                </div>
                            ))}
                        </OperatorContradictionCard>
                    </section>

                    {/* 5 · SYNTHESIS DRAFT — must not look accepted */}
                    <section>
                        <SectionHeader
                            index="05"
                            title="Synthesis draft"
                            right={
                                <div className="flex items-center gap-1.5">
                                    <Badge tone="amber">DRAFT — ADVISORY</Badge>
                                    <Tag kind="DERIVED-DISPLAY" />
                                </div>
                            }
                        />
                        <div className="rounded border border-dashed border-amber-800 bg-slate-900 p-4">
                            <div className="font-mono text-xs text-slate-500">
                                {SYNTHESIS.id} · coverage: {SYNTHESIS.coverage}
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div>
                                    <div className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                                        Agreed claims
                                    </div>
                                    <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-slate-300">
                                        {SYNTHESIS.agreed.map((a) => (
                                            <li key={a}>{a}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="font-mono text-xs uppercase tracking-wider text-amber-400">
                                        Contested claims
                                    </div>
                                    {SYNTHESIS.contested.map((c) => (
                                        <div key={c.topic} className="mt-1 text-xs text-slate-300">
                                            <span className="text-slate-100">{c.topic}: </span>
                                            <span className="text-slate-400">A — {c.sideA} · B — {c.sideB}</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="font-mono text-xs uppercase tracking-wider text-red-400">
                                        Contradictions
                                    </div>
                                    <div className="mt-1 text-xs text-red-300">
                                        {SYNTHESIS.contradictions.join(" · ")}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-xs uppercase tracking-wider text-sky-400">
                                        Unresolved questions
                                    </div>
                                    <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-slate-300">
                                        {SYNTHESIS.unresolved.map((u) => (
                                            <li key={u}>{u}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 border-t border-slate-800 pt-3 text-xs">
                                <div className="text-slate-300">
                                    <span className="font-mono uppercase text-slate-500">route recommendation · </span>
                                    {SYNTHESIS.routeRec}
                                </div>
                                <div className="text-slate-400">
                                    <span className="font-mono uppercase text-slate-500">refusal recommendation · </span>
                                    {SYNTHESIS.refusalRec}
                                </div>
                            </div>
                            <div className="mt-3 rounded border border-amber-700 bg-amber-950 px-3 py-2 text-center font-mono text-xs uppercase tracking-widest text-amber-300">
                                CONTROL_THREAD decision required — synthesis is not a decision
                            </div>
                        </div>
                    </section>

                    {/* 6 · CONTROL_THREAD DECISION COMPOSER */}
                    <section>
                        <SectionHeader
                            index="06"
                            title="CONTROL_THREAD decision composer"
                            right={<Tag kind="REAL-COMPOSE" />}
                        />
                        <OperatorDecisionComposer
                            decisions={DECISIONS}
                            depths={DEPTHS}
                            buildDraft={({ decision, depth }) =>
                                buildDecisionRecord(decision, depth)
                            }
                            copyLabel="Copy decision record"
                            className="p-4"
                        />
                    </section>
                </div>

                {/* ----------------------- 7 · SAFETY / AUTHORITY RAIL ---------------- */}
                <aside className="w-full shrink-0 lg:w-72">
                    <OperatorSafetyRail
                        title="Safety / authority rail"
                        invariants={INVARIANTS}
                        className="p-4 lg:sticky lg:top-4"
                    >
                        <ul className="space-y-2">
                            {RAIL_LINES.map((l) => (
                                <li key={l} className="flex items-start gap-2 text-xs text-slate-300">
                                    <Lock size={12} className="mt-0.5 shrink-0 text-slate-500" />
                                    {l}
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-slate-800 pt-3 font-mono text-xs text-slate-500">
                            snapshot: local constants · SYN-* data only · <Tag kind="FIXTURE" />
                        </div>
                    </OperatorSafetyRail>
                </aside>
            </div>

            <footer className="mx-auto mt-6 max-w-6xl border-t border-slate-800 pt-3 text-center font-mono text-xs uppercase tracking-widest text-slate-600">
                Non-authorizing · representational only · zero gates granted · manual handoff
            </footer>
        </div>
    );
}
