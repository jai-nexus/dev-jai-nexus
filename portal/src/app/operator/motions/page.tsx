import Link from "next/link";
import { getServerAuthSession } from "@/auth";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { CanonicalReadOnlySpine } from "@/components/operator/CanonicalReadOnlySpine";
import { PromoteContenderForm } from "./PromoteContenderForm";
import { parseMotionNumber } from "@/lib/motion/motionContenders";
import { readMotionPromotionAvailability } from "@/lib/motion/motionPromotion";
import {
  loadMotionQueueIndex,
  loadMotionDetail,
  type MotionArtifactKey,
  type MotionQueueItem,
  type MotionQueueState,
} from "@/lib/motion/motionSurface";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;

const ARTIFACT_KEYS: MotionArtifactKey[] = [
  "motion.yaml",
  "decision.yaml",
  "policy.yaml",
  "verify.json",
  "vote.json",
  "execution.md",
  "proposal.md",
  "challenge.md",
];

const slateFormFieldClass =
  "rounded border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600/50";
const slatePanelClass = "rounded border border-slate-800 bg-slate-900";
const slateInsetClass = "rounded border border-slate-800 bg-slate-950/60";
const slateMetaLabelClass =
  "font-mono text-[11px] uppercase tracking-wide text-slate-500";

function firstParam(value: SearchParamValue): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeQuery(input?: string): string | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  return raw.length > 120 ? raw.slice(0, 120) : raw;
}

function sanitizeMotionId(input?: string): string | undefined {
  const raw = (input ?? "").trim();
  if (!/^motion-\d+$/i.test(raw)) return undefined;
  return raw;
}

function sanitizeState(input?: string): MotionQueueState | undefined {
  const raw = (input ?? "").trim();
  if (
    raw === "attention" ||
    raw === "draft" ||
    raw === "ready_for_vote" ||
    raw === "ratified" ||
    raw === "settled" ||
    raw === "unknown"
  ) {
    return raw;
  }
  return undefined;
}

function sanitizeAttentionOnly(input?: string): boolean {
  const raw = (input ?? "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "y";
}

function sanitizeArtifact(input?: string): MotionArtifactKey | undefined {
  const raw = (input ?? "").trim();
  return ARTIFACT_KEYS.find((artifactKey) => artifactKey === raw);
}

function buildMotionsHref(filters: {
  q?: string;
  state?: MotionQueueState;
  attention?: boolean;
  motionId?: string;
  artifact?: MotionArtifactKey;
}) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.state) params.set("state", filters.state);
  if (filters.attention) params.set("attention", "1");
  if (filters.motionId) params.set("motionId", filters.motionId);
  if (filters.artifact) params.set("artifact", filters.artifact);

  const qs = params.toString();
  return qs ? `/operator/motions?${qs}` : "/operator/motions";
}

function matchesSearch(item: MotionQueueItem, query?: string) {
  if (!query) return true;
  const needle = query.toLowerCase();
  const haystacks = [
    item.motion_id,
    item.title,
    item.subtitle,
    item.program,
    item.kind,
    item.basis,
  ];

  return haystacks.some((value) => value?.toLowerCase().includes(needle));
}

function queueStateTone(queueState: MotionQueueState): OperatorSlateTone {
  switch (queueState) {
    case "attention":
      return "warning";
    case "settled":
      return "canonical";
    case "ratified":
      return "canonical";
    case "ready_for_vote":
      return "pending";
    case "draft":
      return "advisory";
    default:
      return "neutral";
  }
}

function boolDisplay(value: boolean | null) {
  if (value === true) return "true";
  if (value === false) return "false";
  return "null";
}

function shortTs(value: string | null) {
  if (!value) return "null";
  return value.length >= 19 ? value.slice(0, 19) : value;
}

function buildStatusMismatchCount(items: MotionQueueItem[]) {
  return items.filter((item) =>
    item.attention_flags.some((flag) => flag.startsWith("status mismatch:")),
  ).length;
}

function renderStateField(label: string, value: string | null) {
  return (
    <OperatorGateCard>
      <div className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm text-slate-100">
        {value ?? "null"}
      </div>
    </OperatorGateCard>
  );
}

export default async function MotionsPage(props: {
  searchParams?:
    | Promise<Record<string, SearchParamValue>>
    | Record<string, SearchParamValue>;
}) {
  const sp = (await Promise.resolve(props.searchParams ?? {})) as Record<
    string,
    SearchParamValue
  >;

  const query = sanitizeQuery(firstParam(sp.q));
  const queueState = sanitizeState(firstParam(sp.state));
  const attentionOnly = sanitizeAttentionOnly(firstParam(sp.attention));
  const requestedMotionId = sanitizeMotionId(firstParam(sp.motionId));
  const selectedArtifactKey =
    sanitizeArtifact(firstParam(sp.artifact)) ?? "motion.yaml";

  const queueIndex = await loadMotionQueueIndex();
  const session = await getServerAuthSession();
  const allItems = queueIndex.items;
  const filteredItems = allItems.filter((item) => {
    if (!matchesSearch(item, query)) return false;
    if (queueState && item.queue_state !== queueState) return false;
    if (attentionOnly && item.queue_state !== "attention") return false;
    return true;
  });

  const selectedMotionId =
    requestedMotionId && filteredItems.some((item) => item.motion_id === requestedMotionId)
      ? requestedMotionId
      : filteredItems[0]?.motion_id;

  const detail = selectedMotionId ? await loadMotionDetail(selectedMotionId) : null;
  const selectedArtifact =
    detail?.core_artifacts.find((artifact) => artifact.key === selectedArtifactKey) ??
    detail?.core_artifacts[0] ??
    null;

  const totalCount = allItems.length;
  const attentionCount = allItems.filter((item) => item.queue_state === "attention").length;
  const ratifiedCount = allItems.filter(
    (item) => item.decision_status?.toUpperCase() === "RATIFIED",
  ).length;
  const mismatchCount = buildStatusMismatchCount(allItems);
  const sourceLabel = queueIndex.source_label;
  const highestMotionNumber = allItems.reduce((currentMax, item) => {
    return Math.max(currentMax, parseMotionNumber(item.motion_id));
  }, 0);
  const promotionAvailability = readMotionPromotionAvailability(session?.user?.email ?? null);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-300 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / motions
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">
              JAI NEXUS Motions
            </h1>
            <p className="mt-2 max-w-4xl text-sm text-slate-400">
              Contender previews and the guarded promotion workflow remain
              separate from the read-only canonical motion browser. Existing
              motion packages are derived from{" "}
              <span className="font-mono text-slate-300">.nexus/motions</span>.
              Display, validation, and receipt artifacts do not authorize action.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY CANONICAL</OperatorBadge>
              <OperatorBadge tone="advisory">GUARDED PROMOTION SEPARATE</OperatorBadge>
              <OperatorBadge tone="blocked">NO AUTOMATIC EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorIdChip>dev-jai-nexus</OperatorIdChip>
              <OperatorBadge tone="fixture">SESSION-LOCAL PREVIEW QUEUE</OperatorBadge>
              <OperatorBadge tone="readOnly">{queueIndex.source_mode.toUpperCase()} SOURCE</OperatorBadge>
            </div>
          </OperatorPanel>
          <OperatorSafetyRail
            title="Motion Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <p className="text-xs text-slate-400">
              Motion state is displayed, not mutated by the canonical browser.
              Promotion remains behind its existing explicit guards.
            </p>
          </OperatorSafetyRail>
        </header>

        <CanonicalReadOnlySpine
          index="CANON"
          cards={[
            {
              id: "MOTION-SRC",
              label: "Motion source",
              value: queueIndex.source_mode,
              source: "READ-ONLY CANONICAL",
              freshness: sourceLabel,
              detail:
                "Motion packages are displayed as stored read-only reference state.",
            },
            {
              id: "MOTION-LATEST",
              label: "Latest motion",
              value: highestMotionNumber > 0 ? `motion-${String(highestMotionNumber).padStart(4, "0")}` : "none",
              source: "DERIVED",
              freshness: "Derived from motion IDs in the current queue index.",
              detail:
                "Highest motion ID is a browser summary, not a promotion or acceptance.",
            },
            {
              id: "MOTION-ATTN",
              label: "Attention",
              value: attentionCount,
              source: "DERIVED",
              freshness: "Derived from stored attention flags.",
              detail:
                "Attention flags surface stored package issues; they do not evaluate gates.",
            },
            {
              id: "MOTION-RATIFIED",
              label: "Ratified",
              value: ratifiedCount,
              source: "READ-ONLY CANONICAL",
              freshness: "Stored decision status in motion package snapshot.",
              detail:
                "Ratified status display is not new acceptance, receipt creation, or execution.",
            },
          ]}
        />

        <section>
          <OperatorSectionHeader
            index="01"
            title="Contender Preview And Guarded Promotion"
            right={
              <>
                <OperatorBadge tone="fixture">SESSION-LOCAL PREVIEW</OperatorBadge>
                <OperatorBadge tone="gated">EXPLICIT GUARDS REQUIRED</OperatorBadge>
              </>
            }
          />
          <p className="mb-3 text-xs text-slate-400">
            Existing interactive behavior is preserved. Preview generation is
            not a motion, and promotion is not acceptance or CONTROL_THREAD
            approval.
            <span className="mt-1 block">
              Preview generation is not a motion. Promotion is not acceptance.
              Artifact display is not receipt creation. Execution evidence display
              is not execution authority. Chat pack display is not dispatch.
            </span>
          </p>
          <PromoteContenderForm
            highestMotionNumber={highestMotionNumber}
            motionIdStrategy={
              queueIndex.source_mode === "live"
                ? "derive_from_canonical_live_state"
                : "assign_at_promotion"
            }
            selectedMotionId={detail?.item.motion_id ?? selectedMotionId ?? null}
            selectedMotionTitle={detail?.item.title ?? null}
            selectedMotionProgram={detail?.item.program ?? null}
            promotion={promotionAvailability}
          />
        </section>

        <OperatorPanel className="space-y-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <OperatorSectionHeader
                index="02"
                title="Canonical Motion Reference"
                right={
                  <>
                    <OperatorBadge tone="canonical">CANONICAL SOURCE</OperatorBadge>
                    <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                  </>
                }
              />
              <div className="mt-1 max-w-3xl text-xs text-slate-400">
                Existing motion packages under
                <span className="mx-1 font-mono text-slate-300">.nexus/motions/**</span>
                remain read-only here. This browser is reference state only, not the
                primary contender queue and not a scheduler or governance authority.
              </div>
            </div>

            <OperatorGateCard className="text-xs text-slate-400">
              Source: <span className="font-mono text-slate-200">{sourceLabel}</span>
              <div className="mt-1">
                Mode:{" "}
                <span className="font-mono text-slate-200">{queueIndex.source_mode}</span>
              </div>
            </OperatorGateCard>
          </div>

          {queueIndex.warning ? (
            <div className="rounded border border-amber-900/60 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
              {queueIndex.warning}
            </div>
          ) : null}

          <section className="grid gap-3 md:grid-cols-4">
            <OperatorPanel>
              <div className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Total canonical motions
              </div>
              <div className="mt-1 font-mono text-2xl text-slate-100">{totalCount}</div>
            </OperatorPanel>
            <OperatorPanel>
              <div className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Attention
              </div>
              <div className="mt-1 font-mono text-2xl text-amber-300">{attentionCount}</div>
            </OperatorPanel>
            <OperatorPanel>
              <div className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Ratified
              </div>
              <div className="mt-1 font-mono text-2xl text-emerald-300">{ratifiedCount}</div>
              <div className="mt-2">
                <OperatorBadge tone="canonical">RATIFIED</OperatorBadge>
              </div>
            </OperatorPanel>
            <OperatorPanel>
              <div className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Status mismatches
              </div>
              <div className="mt-1 font-mono text-2xl text-amber-300">{mismatchCount}</div>
              <div className="mt-2">
                <OperatorBadge tone="neutral">DERIVED</OperatorBadge>
              </div>
            </OperatorPanel>
          </section>

          <form
            method="GET"
            className="flex flex-wrap items-end gap-3 rounded border border-slate-800 bg-slate-950/50 p-4"
          >
            <div>
              <div className={slateMetaLabelClass}>search</div>
              <input
                name="q"
                defaultValue={query ?? ""}
                placeholder="motion id, title, program, basis"
                className={`mt-1 w-[280px] ${slateFormFieldClass}`}
              />
            </div>

            <div>
              <div className={slateMetaLabelClass}>queue state</div>
              <select
                name="state"
                defaultValue={queueState ?? ""}
                className={`mt-1 ${slateFormFieldClass}`}
              >
                <option value="">ANY</option>
                <option value="attention">attention</option>
                <option value="draft">draft</option>
                <option value="ready_for_vote">ready_for_vote</option>
                <option value="ratified">ratified</option>
                <option value="settled">settled</option>
                <option value="unknown">unknown</option>
              </select>
            </div>

            <label className="flex items-center gap-2 rounded border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-300">
              <input
                type="checkbox"
                name="attention"
                value="1"
                defaultChecked={attentionOnly}
                className="rounded border-slate-700 bg-slate-950 text-amber-500"
              />
              attention only
            </label>

            <button
              type="submit"
              className="rounded border border-amber-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-amber-300 hover:bg-amber-950/30"
            >
              Apply
            </button>

            <Link
              href="/operator/motions"
              className="rounded border border-slate-800 px-3 py-2 font-mono text-xs uppercase tracking-wide text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100"
            >
              Clear
            </Link>

            <div className="ml-auto text-xs text-slate-500">
              Showing <span className="font-mono text-slate-200">{filteredItems.length}</span>{" "}
              of <span className="font-mono text-slate-200">{totalCount}</span>{" "}
              canonical motions
            </div>
          </form>

          <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className={slatePanelClass}>
            <div className="border-b border-slate-800 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-slate-200">
                  Canonical motion browser
                </div>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                <OperatorBadge tone="canonical">CANONICAL</OperatorBadge>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Read-only reference view over existing motion packages.
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-400">
                No canonical motions matched the current filters.
              </div>
            ) : (
              <div className="max-h-[70vh] space-y-3 overflow-y-auto p-3">
                {filteredItems.map((item) => {
                  const active = item.motion_id === selectedMotionId;
                  const href = buildMotionsHref({
                    q: query,
                    state: queueState,
                    attention: attentionOnly,
                    motionId: item.motion_id,
                    artifact: selectedArtifactKey,
                  });

                  return (
                    <Link
                      key={item.motion_id}
                      href={href}
                      className={`block rounded border p-3 transition-colors ${
                        active
                          ? "border-amber-700 bg-slate-950/80 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.12)]"
                          : "border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-sm text-amber-300">
                            {item.motion_id}
                          </div>
                          <div className="mt-1 text-sm font-medium text-slate-100">
                            {item.title}
                          </div>
                          {item.subtitle ? (
                            <div className="mt-1 text-xs text-slate-500">
                              {item.subtitle}
                            </div>
                          ) : null}
                        </div>

                        <OperatorStatusChip
                          status={item.queue_state}
                          tone={queueStateTone(item.queue_state)}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <div className="text-slate-500">motion.yaml</div>
                          <div className="font-mono text-slate-300">
                            {item.motion_status ?? "null"}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">decision.yaml</div>
                          <div className="font-mono text-slate-300">
                            {item.decision_status ?? "null"}
                          </div>
                        </div>
                      </div>

                      {item.attention_flags.length > 0 ? (
                        <OperatorContradictionCard className="mt-3 px-2 py-2 text-[11px] text-red-200">
                          {item.attention_flags[0]}
                        </OperatorContradictionCard>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className={slatePanelClass}>
            {!detail ? (
              <div className="px-6 py-8 text-sm text-slate-400">
                Select a canonical motion to inspect its current read-only package state.
              </div>
            ) : (
              <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <OperatorIdChip>{detail.item.motion_id}</OperatorIdChip>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-50">
                      {detail.item.title}
                    </h2>
                    {detail.item.subtitle ? (
                      <div className="mt-2 max-w-3xl text-sm text-slate-400">
                        {detail.item.subtitle}
                      </div>
                    ) : null}
                  </div>

                  <div className={`${slateInsetClass} px-3 py-2 text-xs text-slate-400`}>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span>Chat search</span>
                      <OperatorBadge tone="readOnly">CHAT PACK</OperatorBadge>
                    </div>
                    <div className="mt-1">
                      <Link
                        href={detail.chat_search_href}
                        className="font-mono text-amber-300 hover:text-amber-200"
                      >
                        {detail.chat_search_href}
                      </Link>
                    </div>
                  </div>
                </div>

                <section className="grid gap-3 md:grid-cols-3">
                  {renderStateField("program", detail.item.program)}
                  {renderStateField("kind", detail.item.kind)}
                  {renderStateField("basis", detail.item.basis)}
                  {renderStateField("motion status", detail.item.motion_status)}
                  {renderStateField("decision status", detail.item.decision_status)}
                  {renderStateField("vote result", detail.item.vote_result)}
                  {renderStateField("required_ok", boolDisplay(detail.item.required_ok))}
                  {renderStateField(
                    "eligible_to_vote",
                    boolDisplay(detail.item.eligible_to_vote),
                  )}
                  {renderStateField("queue state", detail.item.queue_state)}
                  {renderStateField("created_at", shortTs(detail.item.created_at))}
                  {renderStateField("decided_at", shortTs(detail.item.decided_at))}
                  {renderStateField("updated_at", shortTs(detail.item.updated_at))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="space-y-6">
                    <div className={`${slateInsetClass} p-4`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-slate-200">
                          Attention and package inventory
                        </div>
                        <OperatorBadge tone="readOnly">ARTIFACT</OperatorBadge>
                        <OperatorBadge tone="blocked">NOT A RECEIPT</OperatorBadge>
                      </div>

                      {detail.item.attention_flags.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-red-200">
                          {detail.item.attention_flags.map((flag) => (
                            <li key={flag}>
                              <OperatorContradictionCard>{flag}</OperatorContradictionCard>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-3 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
                          No attention flags on the selected motion package.
                        </div>
                      )}

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                          <div className={slateMetaLabelClass}>
                            Core files
                          </div>
                          <div className="mt-2 space-y-2 text-xs">
                            {detail.core_artifacts.map((artifact) => (
                              <div
                                key={artifact.key}
                                className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 px-3 py-2"
                              >
                                <div className="font-mono text-slate-200">
                                  {artifact.key}
                                </div>
                                <div className="font-mono text-slate-400">
                                  {artifact.present
                                    ? artifact.parse_ok === false
                                      ? "parse-error"
                                      : "present"
                                    : "missing"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className={slateMetaLabelClass}>
                            Secondary artifacts
                          </div>
                          <div className="mt-2 space-y-2 text-xs">
                            {detail.secondary_artifacts.map((artifact) => (
                              <div
                                key={artifact.path}
                                className="rounded border border-slate-800 bg-slate-900 px-3 py-2"
                              >
                                <div className="font-mono text-slate-200">
                                  {artifact.label}
                                </div>
                                <div className="mt-1 text-slate-400">{artifact.path}</div>
                                <div className="mt-1 font-mono text-slate-500">
                                  {artifact.present
                                    ? artifact.detail ?? "present"
                                    : "not present"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${slateInsetClass} p-4`}>
                      <div className="flex flex-wrap gap-2">
                        {detail.core_artifacts.map((artifact) => {
                          const href = buildMotionsHref({
                            q: query,
                            state: queueState,
                            attention: attentionOnly,
                            motionId: detail.item.motion_id,
                            artifact: artifact.key,
                          });

                          const active = artifact.key === selectedArtifact?.key;
                          return (
                            <Link
                              key={artifact.key}
                              href={href}
                              className={`rounded border px-2 py-1 text-xs font-mono transition-colors ${
                                active
                                  ? "border-amber-700 bg-slate-900 text-amber-300"
                                  : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100"
                              }`}
                            >
                              {artifact.key}
                            </Link>
                          );
                        })}
                      </div>

                      {selectedArtifact ? (
                        <div className="mt-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-sm font-semibold text-slate-200">
                                {selectedArtifact.key}
                                </div>
                                <OperatorBadge tone="readOnly">ARTIFACT</OperatorBadge>
                              </div>
                              <div className="mt-1 font-mono text-xs text-slate-500">
                                {selectedArtifact.path}
                              </div>
                            </div>
                            <div className="font-mono text-xs text-slate-400">
                              {selectedArtifact.present
                                ? selectedArtifact.parse_ok === false
                                  ? "parse-error"
                                  : "present"
                                : "missing"}
                            </div>
                          </div>

                          <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950/70 p-4 text-xs leading-6 text-slate-200">
                            {selectedArtifact.preview ??
                              "Artifact not present in this motion package."}
                          </pre>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={`${slateInsetClass} p-4`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-slate-200">
                          Execution evidence
                        </div>
                        <OperatorBadge tone="readOnly">EXECUTION EVIDENCE</OperatorBadge>
                        <OperatorBadge tone="blocked">NO EXECUTION AUTHORITY</OperatorBadge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Excerpted from <span className="font-mono">execution.md</span>{" "}
                        when present. Execution evidence display is not execution authority.
                      </div>
                      <pre className="mt-4 max-h-[18rem] overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950/70 p-4 text-xs leading-6 text-slate-200">
                        {detail.execution_excerpt ?? "No execution.md excerpt available."}
                      </pre>
                    </div>

                    <div className={`${slateInsetClass} p-4`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-slate-200">Chat pack</div>
                        <OperatorBadge tone="readOnly">CHAT PACK</OperatorBadge>
                        <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Read-only prompt and handoff text for manual operator chat flow.
                        Chat pack display is not dispatch.
                      </div>

                      <div className="mt-4">
                        <div className={slateMetaLabelClass}>
                          Operator review prompt
                        </div>
                        <textarea
                          readOnly
                          value={detail.prompt_pack}
                          className="mt-2 h-56 w-full resize-y rounded border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs leading-6 text-slate-200"
                        />
                      </div>

                      <div className="mt-4">
                        <div className={slateMetaLabelClass}>
                          Artifact handoff pack
                        </div>
                        <textarea
                          readOnly
                          value={detail.handoff_pack}
                          className="mt-2 h-48 w-full resize-y rounded border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs leading-6 text-slate-200"
                        />
                      </div>

                      <div className="mt-4 rounded border border-slate-800 bg-slate-900 px-3 py-3 text-xs text-slate-400">
                        Read-only boundary:
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          <li>no dispatch or scheduler behavior</li>
                          <li>no automatic voting or ratification</li>
                          <li>
                            no mutation of motion packages, proof artifacts, or runtime state
                          </li>
                        </ul>
                        <div className="mt-3">
                          <Link
                            href={detail.chat_search_href}
                            className="font-mono text-amber-300 hover:text-amber-200"
                          >
                            {detail.chat_search_href}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
          </section>
        </OperatorPanel>
      </div>
    </main>
  );
}
