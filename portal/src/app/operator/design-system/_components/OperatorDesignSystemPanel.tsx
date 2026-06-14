"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type IconProps = {
    className?: string;
    size?: number;
};

function Glyph({ children, className = "", size = 12 }: IconProps & { children: string }) {
    return <span className={className} style={{ fontSize: size }} aria-hidden="true">{children}</span>;
}

const Copy = (props: IconProps) => <Glyph {...props}>CP</Glyph>;
const Check = (props: IconProps) => <Glyph {...props}>OK</Glyph>;
const Lock = (props: IconProps) => <Glyph {...props}>X</Glyph>;
const AlertTriangle = (props: IconProps) => <Glyph {...props}>!</Glyph>;
const Ban = (props: IconProps) => <Glyph {...props}>NO</Glyph>;
const ExternalLink = (props: IconProps) => <Glyph {...props}>RO</Glyph>;

/* ============================================================================
   JAI NEXUS — OPERATOR DESIGN SYSTEM / STYLE PROTOTYPE v0
   "OPERATOR SLATE" — an authority-visible design language
   ADVISORY — NON-AUTHORIZING — REPRESENTATIONAL ONLY
   Local constants. SYN-* IDs only. No backend, storage, telemetry, or dispatch.
   One optional live verb: REAL-COMPOSE (clipboard copy), labeled where used.
   ============================================================================ */

/* ------------------------------- 2 · TOKENS ------------------------------- */

const TOKENS = [
    { name: "background", cls: "bg-slate-950", text: "text-slate-500", use: "Page base. Nothing sits directly on it except panels and rails." },
    { name: "panel", cls: "bg-slate-900 border border-slate-800", text: "text-slate-400", use: "Default working surface for cards and sections." },
    { name: "elevated panel", cls: "bg-slate-800 border border-slate-700", text: "text-slate-300", use: "Focus mode, composers, anything the operator is acting in right now." },
    { name: "border", cls: "bg-slate-800", text: "text-slate-500", use: "Hairline structure. Borders separate; they never decorate." },
    { name: "muted text", cls: "bg-slate-900", text: "text-slate-500", use: "Field labels, provenance strips, metadata." },
    { name: "primary text", cls: "bg-slate-900", text: "text-slate-100", use: "Questions, titles, operator-facing prose." },
    { name: "canonical / live", cls: "bg-emerald-950 border border-emerald-800", text: "text-emerald-300", use: "GREEN IS EARNED. Only accepted, receipted facts — and the copy verb. Nothing else is ever green." },
    { name: "fixture / synthetic", cls: "bg-slate-900 border border-slate-600", text: "text-slate-400", use: "Synthetic data is grey and says so. Quiet on purpose; it must never outshine real records." },
    { name: "advisory", cls: "bg-amber-950 border border-amber-800", text: "text-amber-300", use: "Model output, synthesis drafts, anything awaiting a decision. Amber = not yet." },
    { name: "warning", cls: "bg-amber-900 border border-amber-600", text: "text-amber-200", use: "Active operator attention needed (stale snapshot, unreconciled intake). Stronger amber presence." },
    { name: "blocked", cls: "bg-red-950 border border-red-800", text: "text-red-300", use: "Doctrine-blocked capability classes. Red = stop / conflict family." },
    { name: "gated", cls: "bg-slate-900 border border-amber-700 border-dashed", text: "text-amber-400", use: "Future capability behind a named gate. Dashed: the wall exists, the door is closed." },
    { name: "accepted", cls: "bg-emerald-950 border border-emerald-800", text: "text-emerald-300", use: "Operator-accepted records. Same family as canonical — both are operative reality." },
    { name: "pending", cls: "bg-sky-950 border border-sky-800", text: "text-sky-300", use: "Awaiting CONTROL_THREAD. Sky = informational / reference / in-flight." },
    { name: "contradiction", cls: "bg-red-950 border border-red-900", text: "text-red-300", use: "Conflict family. Distinguished from BLOCKED by glyph (⇄) and label, never by color alone." },
    { name: "dissent", cls: "bg-red-950 border-l-4 border-red-500", text: "text-red-200", use: "The loudest element on any page. Left-bar treatment; never collapsed by default." },
];

/* --------------------------- 3 · BADGE VOCABULARY -------------------------- */

const BADGES = [
    { label: "NON-AUTHORIZING", tone: "slate", meaning: "This artifact grants no authority.", allowed: "Any advisory artifact, panel footers.", forbidden: "On receipts or decision records — those do record authority." },
    { label: "ZERO GATES GRANTED", tone: "red", meaning: "System-wide gate fact, data-bound.", allowed: "Header posture row, gate panels — bound to gates fixture only.", forbidden: "Hardcoded copies that could drift from the fixture." },
    { label: "LOCAL STATIC SNAPSHOT", tone: "slate", meaning: "Data provenance: committed fixtures, not live state.", allowed: "Provenance strips, page footers.", forbidden: "Anywhere it would imply a live alternative exists in v0." },
    { label: "ALL EXECUTION GATES CLOSED", tone: "red", meaning: "Gate-family fact for gate/security cards.", allowed: "Gate and security cards.", forbidden: "Decorative reuse on unrelated cards." },
    { label: "MANUAL HANDOFF", tone: "amber", meaning: "Boundary crossings are a human with a clipboard.", allowed: "Slots, packets, lane briefs.", forbidden: "Implying automation exists elsewhere by contrast." },
    { label: "ADVISORY ONLY", tone: "amber", meaning: "Model-origin content; input to a decision.", allowed: "Returns, synthesis, recommendations.", forbidden: "Operator decision records." },
    { label: "REPRESENTATIONAL ONLY", tone: "amber", meaning: "Describes a shape; performs nothing.", allowed: "Agent lanes, pipelines, future-state views.", forbidden: "On the copy verb (it performs a copy)." },
    { label: "FIXTURE", tone: "slate", meaning: "Synthetic SYN-* data.", allowed: "All synthetic data, mandatory.", forbidden: "Absence on synthetic data is a defect, not an option." },
    { label: "CANONICAL", tone: "emerald", meaning: "Accepted and traceable to the canon index.", allowed: "Records with an acceptance trail only. Most restricted badge.", forbidden: "Anything not traceable to an acceptance record." },
    { label: "READ-ONLY", tone: "sky", meaning: "Navigation to source; no write path exists.", allowed: "Source links, repo links.", forbidden: "As reassurance on elements that look like they write." },
    { label: "REAL-COMPOSE", tone: "emerald", meaning: "Copies generated text to clipboard. The only live verb.", allowed: "Clipboard composers.", forbidden: "Any behavior beyond copy." },
    { label: "DERIVED-DISPLAY", tone: "sky", meaning: "Display arithmetic over fixtures (counts, means).", allowed: "Coverage meters, totals.", forbidden: "Anything resembling ranking or recommendation logic." },
    { label: "MOCK", tone: "slate", meaning: "Illustrative placeholder; no commitment.", allowed: "Visual sketches of undecided ideas.", forbidden: "Planned gated capabilities — those are GATED." },
    { label: "GATED", tone: "amber", meaning: "Future capability behind a named gate class.", allowed: "Ghost controls, with the gate class named.", forbidden: "Without naming the gate; any active-looking styling." },
    { label: "BLOCKED", tone: "red", meaning: "Doctrine-blocked capability class.", allowed: "Blocked-settings registry, refused actions.", forbidden: "Merely unbuilt features — that is GATED or MOCK." },
    { label: "CLAIMS, NOT FACTS", tone: "sky", meaning: "Provenance reminder on model-origin text.", allowed: "Return cards, quoted model content.", forbidden: "Operator records — those mint facts." },
    { label: "NOT CANON", tone: "red", meaning: "Explicit negative for content likely to be over-trusted.", allowed: "Synthesis, polished advisory output.", forbidden: "As a substitute for FIXTURE on synthetic data." },
    { label: "CONTROL_THREAD DECIDES", tone: "amber", meaning: "Names the decision locus.", allowed: "Synthesis banners, decision composers.", forbidden: "On every card — dilution kills it." },
    { label: "STEP-UP REQUIRED", tone: "amber", meaning: "Future posture: action will require elevated confirmation.", allowed: "Gated-action explainers, represented only.", forbidden: "Implying step-up exists in v0 — it does not." },
    { label: "RECEIPT REQUIRED", tone: "amber", meaning: "If ever performed, this act must mint a receipt.", allowed: "Decision composers, gate explainers.", forbidden: "Implying receipt automation exists." },
];

/* ---------------------------- 6 · STATUS LANGUAGE -------------------------- */

const STATUSES = [
    { label: "DRAFT", tone: "slate", meaning: "Composed, uncarried, uncommitted." },
    { label: "ADVISORY", tone: "amber", meaning: "Model-origin; awaiting operator judgment." },
    { label: "PENDING REVIEW", tone: "sky", meaning: "In the CONTROL_THREAD queue." },
    { label: "ACCEPTED", tone: "emerald", meaning: "Operator decision recorded." },
    { label: "ACCEPTED W/ CONDITIONS", tone: "emerald", meaning: "Accepted; conditions enumerated and tracked." },
    { label: "DEFERRED", tone: "slate", meaning: "Parked deliberately, with a revisit trigger." },
    { label: "REJECTED", tone: "red", meaning: "Operator declined; grounds recorded." },
    { label: "REQUIRES REVISION", tone: "amber", meaning: "Returned to lane with named defects." },
    { label: "CONTRADICTION OPEN", tone: "red", meaning: "Incompatible claims on record; unresolved." },
    { label: "UNRESOLVED", tone: "sky", meaning: "Carried question; visible until answered." },
    { label: "GATE CLOSED", tone: "red", meaning: "Capability defined; zero grants exist." },
    { label: "STEP-UP REQUIRED", tone: "amber", meaning: "Future elevated-confirmation posture (represented)." },
    { label: "RECEIPT REQUIRED", tone: "amber", meaning: "Performing this act must produce a receipt." },
    { label: "BLOCKED IN V0", tone: "red", meaning: "Doctrine-blocked at this version; not configurable away." },
];

/* ----------------------- 9 · UNSAFE STYLE PATTERNS ------------------------- */

const UNSAFE = [
    "Green “execute” buttons before gates exist — green is earned, never aspirational.",
    "Ambiguous “approve” buttons on advisory content — approval belongs to the decision composer only.",
    "Playful SaaS marketing cards — this is a control room, not a landing page.",
    "Hidden dissent — dissent is the loudest element or the design has failed.",
    "Risks collapsed by default — risk sections never start collapsed.",
    "Unlabeled synthetic data — FIXTURE is mandatory, absence is a defect.",
    "Model output styled like system state — claims must never wear the visual clothing of facts.",
    "Action buttons implying backend behavior that does not exist.",
    "“Winner” badges or medal styling for best-agent comparison — preference is a decision, not a trophy.",
    "Decorative warning labels too small or repetitive to register — fewer, larger, data-bound.",
    "Progress bars or spinners implying autonomous background work — nothing runs unattended in v0.",
    "Urgency styling (countdowns, pulsing CTAs) — speed pressure is how authority leaks.",
];

/* ------------------------------- PRIMITIVES -------------------------------- */

const TONE = {
    slate: "bg-slate-800 text-slate-300 border-slate-600",
    amber: "bg-amber-950 text-amber-300 border-amber-700",
    red: "bg-red-950 text-red-300 border-red-800",
    emerald: "bg-emerald-950 text-emerald-300 border-emerald-700",
    sky: "bg-sky-950 text-sky-300 border-sky-800",
};

type Tone = keyof typeof TONE;

function B({ label, tone = "slate" }: { label: string; tone?: Tone }) {
    return (
        <span className={`inline-block whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide ${TONE[tone]}`}>
            {label}
        </span>
    );
}

function Id({ children }: { children: ReactNode }) {
    return (
        <span className="rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-slate-300">
            {children}
        </span>
    );
}

function Hash({ value }: { value: string }) {
    return (
        <span title={value} className="font-mono text-xs text-slate-500">
            {value.slice(0, 14)}…{value.slice(-4)}
        </span>
    );
}

function H({ n, title }: { n: string; title: string }) {
    return (
        <div className="mb-3 flex items-baseline gap-3 border-b border-slate-800 pb-2">
            <span className="font-mono text-xs text-slate-600">{n}</span>
            <h2 className="font-mono text-sm uppercase tracking-widest text-slate-200">{title}</h2>
        </div>
    );
}

function copyText(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(() => true, () => fallback(text));
    }
    return Promise.resolve(fallback(text));
}
function fallback(text: string) {
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
    } catch {
        return false;
    }
}

function ComposeButton({
    build,
    children,
    disabled = false,
}: {
    build: () => string;
    children: ReactNode;
    disabled?: boolean;
}) {
    const [done, setDone] = useState(false);
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() =>
                !disabled &&
                copyText(build()).then((ok) => {
                    if (ok) {
                        setDone(true);
                        setTimeout(() => setDone(false), 1500);
                    }
                })
            }
            className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-xs uppercase tracking-wide ${disabled
                    ? "cursor-not-allowed border-slate-800 text-slate-600"
                    : "border-emerald-700 text-emerald-300 hover:bg-emerald-950"
                }`}
        >
            {done ? <Check size={12} /> : <Copy size={12} />}
            {done ? "Copied" : children}
        </button>
    );
}

/* ----------------------------- CARD ARCHETYPES ----------------------------- */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`rounded border border-slate-800 bg-slate-900 p-3 ${className}`}>{children}</div>;
}

function CardHead({
    title,
    id,
    badges,
}: {
    title: string;
    id: string;
    badges: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">{title}</span>
                <Id>{id}</Id>
            </div>
            <div className="flex flex-wrap gap-1.5">{badges}</div>
        </div>
    );
}

function Field({
    k,
    v,
    vClass = "text-slate-300",
}: {
    k: string;
    v: string;
    vClass?: string;
}) {
    return (
        <div className="text-xs">
            <span className="font-mono uppercase text-slate-500">{k} · </span>
            <span className={vClass}>{v}</span>
        </div>
    );
}

const DOCTRINE_SUMMARY = [
    "OPERATOR SLATE v0 — authority-visible design language",
    "1. Provenance drives color. Color declares what kind of truth is shown; it never decorates.",
    "2. Green is earned: only accepted/receipted facts and the copy verb. Never aspirational.",
    "3. Nothing is encoded by color alone — glyph + label always carry the meaning.",
    "4. Dissent is the loudest element; risks never collapse by default.",
    "5. Inert must look inert: gated/blocked controls are visibly disconnected.",
    "6. Claims never wear the clothing of facts; synthetic data is grey and labeled.",
    "7. The interface feels active because the operator moves fast — never because the system pretends to.",
    "NON-AUTHORIZING — ZERO GATES GRANTED",
].join("\n");

const EXACT_PRINCIPLES = [
    "Green is earned.",
    "Provenance drives color.",
    "Claims are not facts.",
    "Dissent is the loudest element.",
    "Inert must look inert.",
    "Synthetic data is grey and labeled.",
    "Speed comes from the operator, not hidden automation.",
];

/* ------------------------------ MAIN COMPONENT ----------------------------- */

export default function OperatorDesignSystemPanel() {
    return (
        <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-300 md:p-6">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-wrap gap-2 rounded border border-slate-800 bg-slate-900 p-3">
                    <B label="LOCAL / STATIC" />
                    <B label="PROTOTYPE" />
                    <B label="NON-AUTHORIZING" tone="amber" />
                    <B label="NO EXECUTION" tone="red" />
                    <B label="NO PROVIDER / MODEL DISPATCH" tone="red" />
                    <B label="NO AGENT EXECUTION" tone="red" />
                    <B label="ZERO EXECUTION GATES GRANTED" tone="red" />
                </div>
                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                            dev.jai.nexus · operator design system · v0
                        </div>
                        <div className="font-mono text-lg font-semibold tracking-wide text-slate-100">
                            OPERATOR SLATE
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <B label="NON-AUTHORIZING" tone="slate" />
                        <B label="ZERO GATES GRANTED" tone="red" />
                        <B label="LOCAL STATIC SNAPSHOT" tone="slate" />
                        <B label="FIXTURE" tone="slate" />
                    </div>
                </div>

                {/* 1 · IDENTITY / STYLE THESIS */}
                <section>
                    <H n="01" title="Identity / style thesis" />
                    <Card className="space-y-2 text-sm leading-relaxed text-slate-300">
                        <p className="text-slate-100">
                            OPERATOR SLATE is the authority-visible design language of dev.jai.nexus. Every
                            pixel answers one question: <span className="text-amber-300">what kind of truth am I
                                looking at, and what is it allowed to do?</span>
                        </p>
                        <p>
                            Provenance drives color. Green is earned — it marks only what is operatively real:
                            accepted facts and the copy verb. Claims read as claims. Synthetic data is grey and
                            says so. Dissent is the loudest element on any page. Inert capabilities look inert.
                        </p>
                        <p className="text-slate-400">
                            The interface should feel like a governed intelligence cockpit: a research-grade
                            operator surface, active but gated. It feels alive because the operator moves fast —
                            never because the system pretends to. Claims are not facts. Execution requires gates.
                        </p>
                    </Card>
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                        {EXACT_PRINCIPLES.map((principle) => (
                            <div
                                key={principle}
                                className="rounded border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300"
                            >
                                {principle}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2 · COLOR / TONE TOKENS */}
                <section>
                    <H n="02" title="Color / tone tokens — semantic, not decorative" />
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {TOKENS.map((t) => (
                            <div key={t.name} className={`rounded p-3 ${t.cls}`}>
                                <div className={`font-mono text-xs uppercase tracking-wider ${t.text}`}>{t.name}</div>
                                <div className="mt-1 text-xs text-slate-400">{t.use}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 font-mono text-xs uppercase tracking-wide text-slate-500">
                        Rule: color families carry category; glyph + label carry the specific meaning. Nothing
                        is encoded by color alone.
                    </div>
                </section>

                {/* 3 · BADGE VOCABULARY */}
                <section>
                    <H n="03" title="Badge vocabulary" />
                    <div className="grid gap-2 md:grid-cols-2">
                        {BADGES.map((b) => (
                            <Card key={b.label} className="space-y-1">
                                <B label={b.label} tone={b.tone as Tone} />
                                <div className="text-xs text-slate-300">{b.meaning}</div>
                                <div className="text-xs text-slate-500">
                                    <span className="text-emerald-400">allowed · </span>
                                    {b.allowed}
                                </div>
                                <div className="text-xs text-slate-500">
                                    <span className="text-red-400">forbidden · </span>
                                    {b.forbidden}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 4 · CARD ARCHETYPES */}
                <section>
                    <H n="04" title="Card archetypes" />
                    <div className="grid gap-3 lg:grid-cols-2">
                        {/* example canonical shape */}
                        <Card className="border-emerald-900">
                            <CardHead
                                title="Example canonical shape"
                                id="SYN-CANON-0001"
                                badges={<><B label="EXAMPLE CANONICAL" tone="sky" /><B label="READ-ONLY SAMPLE" tone="sky" /><B label="FIXTURE" tone="slate" /></>}
                            />
                            <div className="mt-2 space-y-1">
                                <Field k="doctrine" v="VOC_CASCADE_SEMANTICS_V0" />
                                <Field k="acceptance" v="SYN-REC-0007 · receipted" vClass="text-emerald-300" />
                            </div>
                            <div className="mt-2"><span className="inline-flex items-center gap-1 font-mono text-xs uppercase text-sky-400"><ExternalLink size={11} /> Open source — READ-ONLY</span></div>
                        </Card>

                        {/* fixture record */}
                        <Card className="border-slate-700">
                            <CardHead title="Fixture record" id="SYN-FIX-0042" badges={<B label="FIXTURE" tone="slate" />} />
                            <div className="mt-2 space-y-1">
                                <Field k="purpose" v="Synthetic demo data — quiet on purpose." vClass="text-slate-400" />
                                <Field k="namespace" v="SYN-* mandatory; collision with live registries forbidden." vClass="text-slate-400" />
                            </div>
                        </Card>

                        {/* council return */}
                        <Card>
                            <CardHead
                                title="Council return"
                                id="SYN-RET-0002"
                                badges={<><B label="ADVISORY ONLY" tone="amber" /><B label="CLAIMS, NOT FACTS" tone="sky" /><B label="NOT CANON" tone="red" /></>}
                            />
                            <div className="mt-2 space-y-1">
                                <Field k="claim c1" v="Receipts exist without a ratified schema." />
                                <Field k="evidence" v="SYN-EV-RECON-D5" vClass="text-sky-300" />
                            </div>
                        </Card>

                        {/* dissent card */}
                        <div className="rounded border border-red-900 border-l-4 border-l-red-500 bg-red-950 p-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <AlertTriangle size={14} className="text-red-400" />
                                <span className="font-mono text-sm font-semibold uppercase tracking-wider text-red-200">Dissent</span>
                                <Id>SYN-DIS-0001</Id>
                                <B label="SEVERITY: HIGH" tone="red" />
                                <B label="PRESERVED: YES" tone="emerald" />
                            </div>
                            <div className="mt-2 text-xs text-red-100">
                                Loudest element on the page. Never collapsed, never paraphrased, never quietly resolved.
                            </div>
                        </div>

                        {/* contradiction card */}
                        <Card className="border-red-900">
                            <CardHead title="Contradiction" id="SYN-CON-0001" badges={<B label="CONTRADICTION OPEN" tone="red" />} />
                            <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-300">
                                <span>SYN-RET-001·c2</span>
                                <span className="text-red-400">⇄</span>
                                <span>SYN-RET-002·c2</span>
                                <B label="DERIVED-DISPLAY" tone="sky" />
                            </div>
                        </Card>

                        {/* route recommendation */}
                        <Card>
                            <CardHead title="Route recommendation" id="SYN-RR-0003" badges={<><B label="ADVISORY ONLY" tone="amber" /><B label="CONTROL_THREAD DECIDES" tone="amber" /></>}
                            />
                            <div className="mt-2 space-y-1">
                                <Field k="target" v="jai-format · RECEIPT_SCHEMA_V0" />
                                <Field k="grounding" v="2 refs · queue-eligible" vClass="text-sky-300" />
                            </div>
                        </Card>

                        {/* agent lane candidate */}
                        <Card className="border-dashed border-amber-800">
                            <CardHead title="Agent lane candidate" id="SYN-LANE-0005" badges={<><B label="REPRESENTATIONAL ONLY" tone="amber" /><B label="GATED" tone="amber" /></>} />
                            <div className="mt-2 space-y-1">
                                <Field k="pipeline" v="staged → BLOCKED AT GATES" vClass="text-amber-300" />
                                <Field k="would do" v="apply reviewed diff to docs/ (post-gate, post-confirmation)" vClass="text-slate-400" />
                            </div>
                        </Card>

                        {/* execution gate */}
                        <Card className="border-red-900">
                            <CardHead title="Execution gate" id="GATE_CLASS_1" badges={<><B label="GATE CLOSED" tone="red" /><B label="RECEIPT REQUIRED" tone="amber" /></>} />
                            <div className="mt-2 text-center font-mono text-base font-semibold uppercase tracking-widest text-red-300">
                                Gates granted: 0
                            </div>
                            <div className="text-center font-mono text-xs text-slate-500">data-bound to gates fixture · never hardcoded</div>
                        </Card>

                        {/* security gate */}
                        <Card className="border-red-900">
                            <CardHead title="Security gate" id="SEC_GATE_0" badges={<><B label="GATE CLOSED" tone="red" /><B label="STEP-UP REQUIRED" tone="amber" /></>} />
                            <div className="mt-2">
                                <Field k="posture" v="future elevated-confirmation; represented only in v0" vClass="text-amber-300" />
                            </div>
                        </Card>

                        {/* closeout intake */}
                        <Card>
                            <CardHead title="Closeout intake" id="SYN-CI-0009" badges={<><B label="PENDING REVIEW" tone="sky" /><B label="MANUAL HANDOFF" tone="amber" /></>} />
                            <div className="mt-2 space-y-1">
                                <Field k="lane" v="jai-format · cascade profile" />
                                <Field k="validation" v="validator identity required before acceptance" vClass="text-amber-300" />
                            </div>
                        </Card>

                        {/* CONTROL_THREAD decision — the only fact-minting card */}
                        <Card className="border-emerald-800 bg-slate-900">
                            <CardHead
                                title="Control_Thread decision"
                                id="SYN-DEC-0011"
                                badges={<><B label="ACCEPTED W/ CONDITIONS" tone="emerald" /><B label="RECEIPT REQUIRED" tone="amber" /></>}
                            />
                            <div className="mt-2 space-y-1">
                                <Field k="review depth" v="sampled" />
                                <Field k="minted by" v="operator commit — the only fact-minting act besides receipts" vClass="text-emerald-300" />
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 5 · ACTION VOCABULARY */}
                <section>
                    <H n="05" title="Action vocabulary — inert must look inert" />
                    <Card className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <ComposeButton build={() => "COUNCIL HANDOFF PACKET — MANUAL CARRY ONLY\npacket_id: SYN-CP-0001\nNON-AUTHORIZING · GATES GRANTED: 0"}>
                                Compose handoff packet
                            </ComposeButton>
                            <B label="REAL-COMPOSE" tone="emerald" />
                            <span className="text-xs text-slate-500">copies text; nothing else</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded border border-sky-800 px-2 py-1 font-mono text-xs uppercase tracking-wide text-sky-300">
                                <ExternalLink size={12} /> Open read-only source
                            </span>
                            <B label="READ-ONLY" tone="sky" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded border border-dashed border-slate-600 px-2 py-1 font-mono text-xs uppercase tracking-wide text-slate-500">
                                Mark for review
                            </span>
                            <B label="MOCK" tone="slate" />
                            <span className="text-xs text-slate-500">illustrative; the real act is a committed snippet</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded border border-amber-800 bg-slate-900 px-2 py-1 font-mono text-xs uppercase tracking-wide text-amber-600">
                                <Lock size={12} /> Model dispatch — GATED / DISABLED
                            </span>
                            <B label="GATED" tone="amber" />
                            <span className="text-xs text-slate-500">gate class named on click; teaches doctrine, never acts</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded border border-red-900 bg-slate-900 px-2 py-1 font-mono text-xs uppercase tracking-wide text-red-700">
                                <Ban size={12} /> Modify blocked settings
                            </span>
                            <B label="BLOCKED" tone="red" />
                        </div>
                        <div className="border-t border-slate-800 pt-3">
                            <div className="font-mono text-xs uppercase tracking-wider text-slate-500">
                                Forbidden / gated set (rendered inert only):
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {["Model dispatch", "Agent dispatch", "Push branch", "Open PR", "Merge", "Deploy", "Change gate", "Modify blocked settings"].map((a) => (
                                    <span key={a} className="inline-flex cursor-not-allowed items-center gap-1 rounded border border-slate-800 px-2 py-0.5 font-mono text-xs uppercase text-slate-600">
                                        <Lock size={10} /> {a} — GATED / DISABLED
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                </section>

                {/* 6 · STATUS LANGUAGE */}
                <section>
                    <H n="06" title="Status language" />
                    <Card>
                        <div className="grid gap-x-6 gap-y-2 md:grid-cols-2">
                            {STATUSES.map((s) => (
                                <div key={s.label} className="flex items-start gap-2">
                                    <B label={s.label} tone={s.tone as Tone} />
                                    <span className="pt-0.5 text-xs text-slate-400">{s.meaning}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* 7 · LAYOUT PATTERN */}
                <section>
                    <H n="07" title="Layout pattern — typical operator page" />
                    <Card className="space-y-2">
                        <div className="rounded border border-dashed border-slate-700 p-2 font-mono text-xs text-slate-500">
                            HEADER RAIL — surface name · session/scope id · snapshot provenance
                        </div>
                        <div className="rounded border border-dashed border-amber-800 p-2 font-mono text-xs text-amber-400">
                            AUTHORITY POSTURE ROW — NON-AUTHORIZING · ZERO GATES GRANTED · ADVISORY ONLY
                        </div>
                        <div className="grid gap-2 md:grid-cols-4">
                            <div className="space-y-2 md:col-span-3">
                                <div className="flex h-24 items-center justify-center rounded border border-dashed border-slate-700 font-mono text-xs text-slate-500">
                                    MAIN WORK PANEL — cards, returns, ledger (dissent loudest)
                                </div>
                                <div className="flex h-12 items-center justify-center rounded border border-dashed border-slate-700 font-mono text-xs text-slate-500">
                                    QUEUE / LIST REGION — intake, routes, sessions
                                </div>
                                <div className="flex h-12 items-center justify-center rounded border border-dashed border-emerald-900 font-mono text-xs text-emerald-500">
                                    DECISION COMPOSER — REAL-COMPOSE · receipt required
                                </div>
                            </div>
                            <div className="flex min-h-full items-center justify-center rounded border border-dashed border-amber-900 p-2 text-center font-mono text-xs text-amber-500">
                                RIGHT SAFETY RAIL — invariants, doctrine lines, sticky
                            </div>
                        </div>
                        <div className="rounded border border-dashed border-red-900 p-2 text-center font-mono text-xs text-red-500">
                            BLOCKED CAPABILITY FOOTER — pinned · cannot be hidden
                        </div>
                    </Card>
                </section>

                {/* 8 · TYPOGRAPHY / DENSITY */}
                <section>
                    <H n="08" title="Typography / information density" />
                    <Card className="space-y-2 text-xs text-slate-300">
                        <div><span className="font-mono uppercase text-slate-500">monospace · </span>IDs, hashes, statuses, paths, badge text, route prompts, packet text — anything machine-shaped.</div>
                        <div><span className="font-mono uppercase text-slate-500">prose · </span>questions, summaries, grounds, doctrine — anything the operator reasons about.</div>
                        <div><span className="font-mono uppercase text-slate-500">ids · </span>chip treatment: <Id>SYN-COUNCIL-0001</Id> — bordered mono, copy-friendly, never inline-styled as prose.</div>
                        <div><span className="font-mono uppercase text-slate-500">hashes · </span>middle-truncated with full value on hover/title: <Hash value="sha256:9f3a17c2e8b14d6a90ffeec2271aa4521b" /></div>
                        <div><span className="font-mono uppercase text-slate-500">long text · </span>collapse after ~3 lines with explicit expanders — <span className="text-red-300">except dissent, risk, and contradictions, which never start collapsed.</span></div>
                        <div><span className="font-mono uppercase text-slate-500">evidence refs · </span>sky chips inline with claims; UNGROUNDED amber chip when absent — absence is information.</div>
                        <div><span className="font-mono uppercase text-slate-500">open questions · </span>always-visible sky list; an empty list renders “none recorded,” never nothing.</div>
                        <div><span className="font-mono uppercase text-slate-500">route prompts · </span>full-width mono pre blocks with a REAL-COMPOSE copy — drafts look like drafts.</div>
                        <div><span className="font-mono uppercase text-slate-500">overload control · </span>max three type sizes per surface; one accent family per card; density from tight consistent spacing, not smaller text; focus mode for one-card work.</div>
                    </Card>
                </section>

                {/* 9 · UNSAFE STYLE PATTERNS */}
                <section>
                    <H n="09" title="Unsafe style patterns — do not use" />
                    <Card>
                        <ul className="space-y-1.5">
                            {UNSAFE.map((u) => (
                                <li key={u} className="flex items-start gap-2 text-xs text-slate-300">
                                    <Ban size={12} className="mt-0.5 shrink-0 text-red-400" />
                                    {u}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </section>

                {/* 10 · FINAL RECOMMENDATION */}
                <section>
                    <H n="10" title="Final recommendation" />
                    <Card className="space-y-3 text-xs text-slate-300">
                        <div><span className="font-mono uppercase text-slate-500">style name · </span><span className="font-mono text-slate-100">OPERATOR SLATE v0</span> — authority-visible design language.</div>
                        <div><span className="font-mono uppercase text-slate-500">core principles · </span>provenance drives color; green is earned; nothing by color alone; dissent loudest, risk never collapses; inert looks inert; claims never dress as facts; speed comes from the operator, not the system.</div>
                        <div><span className="font-mono uppercase text-slate-500">component hierarchy · </span>tokens → primitives (Badge, Tag, IdChip, Hash, StatusRow, ComposeButton) → card archetypes (§04) → panels → page layout (§07).</div>
                        <div><span className="font-mono uppercase text-slate-500">badge taxonomy · </span>§03, twenty entries, allowed/forbidden usage each.</div>
                        <div><span className="font-mono uppercase text-slate-500">card taxonomy · </span>§04, eleven archetypes; CONTROL_THREAD decision is the only fact-minting card and reads differently on purpose.</div>
                        <div><span className="font-mono uppercase text-slate-500">action taxonomy · </span>§05 — REAL-COMPOSE and READ-ONLY are the only live styles; everything else is visibly disconnected.</div>
                        <div><span className="font-mono uppercase text-slate-500">do-not-use · </span>§09 in full.</div>
                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
                            <ComposeButton build={() => DOCTRINE_SUMMARY}>Copy style doctrine</ComposeButton>
                            <B label="REAL-COMPOSE" tone="emerald" />
                            <span className="text-slate-500">advisory text; doctrine status pending CONTROL_THREAD</span>
                        </div>
                    </Card>
                </section>

                <footer className="border-t border-slate-800 pt-3 text-center font-mono text-xs uppercase tracking-widest text-slate-600">
                    Operator Slate v0 · non-authorizing · representational only · zero gates granted
                </footer>
            </div>
        </div>
    );
}
