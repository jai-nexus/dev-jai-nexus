import Link from "next/link";
import {
  listMotionQueue,
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

function queueStateTone(queueState: MotionQueueState) {
  switch (queueState) {
    case "attention":
      return "border-amber-800/60 bg-amber-900/10 text-amber-200";
    case "settled":
      return "border-emerald-800/60 bg-emerald-900/10 text-emerald-200";
    case "ratified":
      return "border-sky-800/60 bg-sky-900/20 text-sky-200";
    case "ready_for_vote":
      return "border-violet-800/60 bg-violet-900/20 text-violet-200";
    case "draft":
      return "border-zinc-700 bg-zinc-900/60 text-zinc-200";
    default:
      return "border-zinc-800 bg-zinc-950 text-gray-300";
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
    <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm text-gray-100">
        {value ?? "null"}
      </div>
    </div>
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

  const allItems = await listMotionQueue();
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

  return (
    <main className="min-h-screen bg-black px-8 py-8 text-gray-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-sky-400">
              Operator Surface
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-gray-50">
              JAI NEXUS Motions
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-400">
              Read-only motion operations surface derived directly from
              <span className="mx-1 font-mono text-gray-300">.nexus/motions</span>
              for this repo only. It surfaces queue state, package evidence, and
              chat-ready review prompts without dispatch, voting, ratification, or file
              mutation.
            </p>
          </div>

          <div className="rounded border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-gray-400">
            Source: <span className="font-mono text-gray-200">.nexus/motions</span>
            <div className="mt-1">
              Repo: <span className="font-mono text-gray-200">dev-jai-nexus</span>
            </div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">
              Total motions
            </div>
            <div className="mt-1 font-mono text-2xl text-gray-100">{totalCount}</div>
          </div>
          <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">
              Attention
            </div>
            <div className="mt-1 font-mono text-2xl text-amber-300">{attentionCount}</div>
          </div>
          <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">
              Ratified
            </div>
            <div className="mt-1 font-mono text-2xl text-emerald-300">{ratifiedCount}</div>
          </div>
          <div className="rounded border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">
              Status mismatches
            </div>
            <div className="mt-1 font-mono text-2xl text-amber-300">{mismatchCount}</div>
          </div>
        </section>

        <form
          method="GET"
          className="flex flex-wrap items-end gap-3 rounded border border-zinc-800 bg-zinc-950/50 p-4"
        >
          <div>
            <div className="mb-1 text-[11px] text-gray-500">search</div>
            <input
              name="q"
              defaultValue={query ?? ""}
              placeholder="motion id, title, program, basis"
              className="w-[280px] rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600"
            />
          </div>

          <div>
            <div className="mb-1 text-[11px] text-gray-500">queue state</div>
            <select
              name="state"
              defaultValue={queueState ?? ""}
              className="rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-gray-100"
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

          <label className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-gray-300">
            <input
              type="checkbox"
              name="attention"
              value="1"
              defaultChecked={attentionOnly}
              className="rounded border-zinc-700 bg-black"
            />
            attention only
          </label>

          <button
            type="submit"
            className="rounded border border-zinc-800 bg-sky-900/40 px-3 py-2 text-xs text-sky-100 hover:bg-sky-900/60"
          >
            Apply
          </button>

          <Link
            href="/operator/motions"
            className="rounded border border-zinc-800 px-3 py-2 text-xs text-gray-400 hover:bg-zinc-900 hover:text-gray-200"
          >
            Clear
          </Link>

          <div className="ml-auto text-xs text-gray-500">
            Showing <span className="font-mono text-gray-200">{filteredItems.length}</span>{" "}
            of <span className="font-mono text-gray-200">{totalCount}</span>
          </div>
        </form>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded border border-zinc-800 bg-zinc-950/40">
            <div className="border-b border-zinc-800 px-4 py-3">
              <div className="text-sm font-semibold text-gray-200">Motion queue</div>
              <div className="mt-1 text-xs text-gray-500">
                Attention-first view over read-only motion packages.
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="px-4 py-5 text-sm text-gray-400">
                No motions matched the current filters.
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
                          ? "border-sky-700 bg-sky-950/20"
                          : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-sm text-sky-300">
                            {item.motion_id}
                          </div>
                          <div className="mt-1 text-sm font-medium text-gray-100">
                            {item.title}
                          </div>
                          {item.subtitle ? (
                            <div className="mt-1 text-xs text-gray-500">
                              {item.subtitle}
                            </div>
                          ) : null}
                        </div>

                        <span
                          className={`inline-flex rounded border px-2 py-1 text-[11px] font-mono ${queueStateTone(
                            item.queue_state,
                          )}`}
                        >
                          {item.queue_state}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                        <div>
                          <div className="text-gray-500">motion.yaml</div>
                          <div className="font-mono text-gray-300">
                            {item.motion_status ?? "null"}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">decision.yaml</div>
                          <div className="font-mono text-gray-300">
                            {item.decision_status ?? "null"}
                          </div>
                        </div>
                      </div>

                      {item.attention_flags.length > 0 ? (
                        <div className="mt-3 rounded border border-amber-900/50 bg-amber-950/20 px-2 py-2 text-[11px] text-amber-200">
                          {item.attention_flags[0]}
                        </div>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded border border-zinc-800 bg-zinc-950/40">
            {!detail ? (
              <div className="px-6 py-8 text-sm text-gray-400">
                Select a motion from the queue to inspect its current package state.
              </div>
            ) : (
              <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="font-mono text-sm text-sky-300">
                      {detail.item.motion_id}
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-50">
                      {detail.item.title}
                    </h2>
                    {detail.item.subtitle ? (
                      <div className="mt-2 max-w-3xl text-sm text-gray-400">
                        {detail.item.subtitle}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-gray-400">
                    Chat search:
                    <div className="mt-1">
                      <Link
                        href={detail.chat_search_href}
                        className="font-mono text-sky-300 hover:text-sky-200"
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
                    <div className="rounded border border-zinc-800 bg-zinc-950/60 p-4">
                      <div className="text-sm font-semibold text-gray-200">
                        Attention and package inventory
                      </div>

                      {detail.item.attention_flags.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-amber-200">
                          {detail.item.attention_flags.map((flag) => (
                            <li
                              key={flag}
                              className="rounded border border-amber-900/50 bg-amber-950/20 px-3 py-2"
                            >
                              {flag}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-3 rounded border border-emerald-900/50 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-200">
                          No attention flags on the selected motion package.
                        </div>
                      )}

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-gray-500">
                            Core files
                          </div>
                          <div className="mt-2 space-y-2 text-xs">
                            {detail.core_artifacts.map((artifact) => (
                              <div
                                key={artifact.key}
                                className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2"
                              >
                                <div className="font-mono text-gray-200">
                                  {artifact.key}
                                </div>
                                <div className="font-mono text-gray-400">
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
                          <div className="text-xs uppercase tracking-wide text-gray-500">
                            Secondary artifacts
                          </div>
                          <div className="mt-2 space-y-2 text-xs">
                            {detail.secondary_artifacts.map((artifact) => (
                              <div
                                key={artifact.path}
                                className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2"
                              >
                                <div className="font-mono text-gray-200">
                                  {artifact.label}
                                </div>
                                <div className="mt-1 text-gray-400">{artifact.path}</div>
                                <div className="mt-1 font-mono text-gray-500">
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

                    <div className="rounded border border-zinc-800 bg-zinc-950/60 p-4">
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
                                  ? "border-sky-700 bg-sky-950/30 text-sky-100"
                                  : "border-zinc-800 bg-zinc-900/50 text-gray-400 hover:bg-zinc-900 hover:text-gray-100"
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
                              <div className="text-sm font-semibold text-gray-200">
                                {selectedArtifact.key}
                              </div>
                              <div className="mt-1 font-mono text-xs text-gray-500">
                                {selectedArtifact.path}
                              </div>
                            </div>
                            <div className="font-mono text-xs text-gray-400">
                              {selectedArtifact.present
                                ? selectedArtifact.parse_ok === false
                                  ? "parse-error"
                                  : "present"
                                : "missing"}
                            </div>
                          </div>

                          <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded border border-zinc-800 bg-black/50 p-4 text-xs leading-6 text-gray-200">
                            {selectedArtifact.preview ??
                              "Artifact not present in this motion package."}
                          </pre>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded border border-zinc-800 bg-zinc-950/60 p-4">
                      <div className="text-sm font-semibold text-gray-200">
                        Execution evidence
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Excerpted from <span className="font-mono">execution.md</span>{" "}
                        when present.
                      </div>
                      <pre className="mt-4 max-h-[18rem] overflow-auto whitespace-pre-wrap rounded border border-zinc-800 bg-black/50 p-4 text-xs leading-6 text-gray-200">
                        {detail.execution_excerpt ?? "No execution.md excerpt available."}
                      </pre>
                    </div>

                    <div className="rounded border border-zinc-800 bg-zinc-950/60 p-4">
                      <div className="text-sm font-semibold text-gray-200">Chat pack</div>
                      <div className="mt-2 text-xs text-gray-500">
                        Read-only prompt and handoff text for manual operator chat flow.
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">
                          Operator review prompt
                        </div>
                        <textarea
                          readOnly
                          value={detail.prompt_pack}
                          className="h-56 w-full resize-y rounded border border-zinc-800 bg-black/50 p-3 font-mono text-xs leading-6 text-gray-200"
                        />
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">
                          Artifact handoff pack
                        </div>
                        <textarea
                          readOnly
                          value={detail.handoff_pack}
                          className="h-48 w-full resize-y rounded border border-zinc-800 bg-black/50 p-3 font-mono text-xs leading-6 text-gray-200"
                        />
                      </div>

                      <div className="mt-4 rounded border border-zinc-800 bg-zinc-900/40 px-3 py-3 text-xs text-gray-400">
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
                            className="font-mono text-sky-300 hover:text-sky-200"
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
      </div>
    </main>
  );
}
