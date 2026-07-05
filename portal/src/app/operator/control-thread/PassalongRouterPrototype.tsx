"use client";

import { useEffect, useMemo, useState } from "react";

import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import {
  buildJaiPaletteSandboxAgentDraft,
  buildJaiPaletteSandboxAgentDraftJson,
  buildJaiPaletteSandboxAgentDraftMarkdown,
  createDefaultJaiPaletteSandboxAgentDraftInput,
  JAI_PALETTE_AGENT_ACTIVATION_STATUSES,
  JAI_PALETTE_AGENT_REVIEW_STATUSES,
  JAI_SANDBOX_AGENT_CLASSES,
  type JaiPaletteAgentActivationStatus,
  type JaiPaletteAgentReviewStatus,
  type JaiSandboxAgentClass,
} from "@/lib/controlPlane/jaiPalette/sandboxAgentDraft";
import {
  buildSupervisedRoutePacket,
  buildSupervisedRoutePacketJson,
  buildSupervisedRoutePacketMarkdown,
  createDefaultSupervisedRoutePacketInput,
  SUPERVISED_ROUTE_PACKET_GUARDRAILS,
  SUPERVISED_ROUTE_PACKET_LIFECYCLE_STATUSES,
  SUPERVISED_ROUTE_PACKET_NON_AUTHORIZATIONS,
  type SupervisedRoutePacketLifecycleStatus,
} from "@/lib/controlPlane/routePackets/supervisedRoutePacket";
import {
  buildCopyablePassalongPacket,
  buildPersistedPassalongInput,
  buildRouteRecommendationText,
  PASSALONG_ARCHIVE_STATES,
  PASSALONG_REDACTION_STATES,
  PASSALONG_ROUTE_STATUSES,
  SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS,
  SANDBOX_IMPORT_ADOPTION_POSTURES,
  type PassalongArchiveState,
  type PassalongPersistenceStatus,
  type PassalongQueue,
  type PassalongRecord,
  type PassalongRedactionState,
  type PassalongRouteStatus,
  type PersistedPassalongRecord,
  type SandboxTargetOption,
  type ThreadMemoryRecord,
} from "@/lib/controlPlane/threadMemory";

function statusTone(status: PassalongRecord["status"]): OperatorSlateTone {
  if (status === "held" || status === "rejected") {
    return "blocked";
  }

  if (status === "recommended" || status === "queued") {
    return "advisory";
  }

  if (status === "archived") {
    return "readOnly";
  }

  return "neutral";
}

function MiniList({ items }: { items: string[] | readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1 text-xs text-slate-400">
      {items.map((item) => (
        <li key={item}>- {item}</li>
      ))}
    </ul>
  );
}

function QueuePanel({
  title,
  queues,
  selectedPassalongId,
  onSelect,
}: {
  title: string;
  queues: PassalongQueue[];
  selectedPassalongId: string;
  onSelect: (passalongId: string) => void;
}) {
  return (
    <OperatorPanel className="space-y-3">
      <OperatorSectionHeader
        index={title === "Inbox" ? "IN" : "OUT"}
        title={title}
        right={<OperatorBadge tone="blocked">manual selection only</OperatorBadge>}
      />
      <div className="space-y-3">
        {queues.map((queue) => (
          <div key={`${title}-${queue.threadId}`} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorIdChip>{queue.threadLabel}</OperatorIdChip>
              <OperatorBadge tone="readOnly">
                {queue.records.length} entries
              </OperatorBadge>
            </div>
            {queue.records.length === 0 ? (
              <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-500">
                No static sample passalongs.
              </div>
            ) : (
              <div className="grid gap-2">
                {queue.records.map((record) => (
                  <button
                    key={`${title}-${record.passalongId}`}
                    type="button"
                    onClick={() => onSelect(record.passalongId)}
                    className={`rounded border p-3 text-left text-sm ${
                      selectedPassalongId === record.passalongId
                        ? "border-sky-500 bg-sky-950/40 text-sky-100"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <OperatorBadge tone={statusTone(record.status)}>
                        {record.status}
                      </OperatorBadge>
                      <span className="font-mono text-xs text-slate-500">
                        {record.passalongId}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold">{record.scope}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {record.summary}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </OperatorPanel>
  );
}

function ThreadMemoryCard({ record }: { record: ThreadMemoryRecord }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <OperatorIdChip>{record.threadId}</OperatorIdChip>
          <h3 className="mt-2 text-base font-semibold text-slate-100">
            {record.threadLabel}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorBadge tone="readOnly">{record.threadKind}</OperatorBadge>
          <OperatorBadge tone="blocked">not source of truth</OperatorBadge>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300">{record.summary}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <div className="font-mono text-xs uppercase text-slate-500">
            current role
          </div>
          <p className="mt-1 text-sm text-slate-300">{record.currentRole}</p>
        </div>
        <div>
          <div className="font-mono text-xs uppercase text-slate-500">
            posture
          </div>
          <p className="mt-1 text-sm text-slate-300">{record.posture}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <div className="font-mono text-xs uppercase text-slate-500">
            active scope
          </div>
          <MiniList items={record.activeScope} />
        </div>
        <div>
          <div className="font-mono text-xs uppercase text-slate-500">
            blocked routes
          </div>
          <MiniList items={record.blockedRoutes} />
        </div>
      </div>
      <div className="mt-3 rounded border border-amber-900 bg-amber-950/30 p-2 text-xs text-amber-200">
        {record.authorityBoundary}
      </div>
    </OperatorGateCard>
  );
}

function SandboxTargetCard({ target }: { target: SandboxTargetOption }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center gap-2">
        <OperatorIdChip>{target.id}</OperatorIdChip>
        <OperatorBadge tone="advisory">{target.posture}</OperatorBadge>
        <OperatorBadge tone="blocked">not activation</OperatorBadge>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <div className="font-mono text-xs uppercase text-slate-500">
            allowed uses
          </div>
          <MiniList items={target.allowedUses} />
        </div>
        <div>
          <div className="font-mono text-xs uppercase text-slate-500">
            disallowed uses
          </div>
          <MiniList items={target.disallowedUses} />
        </div>
      </div>
      <p className="mt-3 rounded border border-red-900/70 bg-red-950/30 p-2 text-xs text-red-200">
        {target.authorityBoundary}
      </p>
    </OperatorGateCard>
  );
}

function PersistedRecordList({
  records,
  selectedPassalongId,
  onSelect,
}: {
  records: PersistedPassalongRecord[];
  selectedPassalongId: string;
  onSelect: (passalongId: string) => void;
}) {
  if (records.length === 0) {
    return (
      <div className="rounded border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-500">
        No app-local persisted passalong records are currently available.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {records.map((record) => (
        <button
          key={record.id}
          type="button"
          onClick={() => onSelect(record.passalongId)}
          className={`rounded border p-3 text-left text-sm ${
            selectedPassalongId === record.passalongId
              ? "border-emerald-500 bg-emerald-950/30 text-emerald-100"
              : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-600"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <OperatorBadge tone={statusTone(record.routeStatus)}>
              {record.routeStatus}
            </OperatorBadge>
            <OperatorBadge
              tone={record.archiveState === "active" ? "readOnly" : "blocked"}
            >
              {record.archiveState}
            </OperatorBadge>
            <span className="font-mono text-xs text-slate-500">
              {record.passalongId}
            </span>
          </div>
          <div className="mt-2 font-semibold">{record.scope}</div>
          <div className="mt-1 text-xs text-slate-400">
            {record.sourceThreadLabel} -&gt; {record.targetThreadLabel}
          </div>
        </button>
      ))}
    </div>
  );
}

function RoutePacketComposerPanel({
  selectedPassalong,
}: {
  selectedPassalong: PassalongRecord | undefined;
}) {
  const [draftCreatedAt] = useState(() => new Date().toISOString());
  const defaultInput = useMemo(
    () => createDefaultSupervisedRoutePacketInput(draftCreatedAt),
    [draftCreatedAt],
  );
  const [packetId, setPacketId] = useState(defaultInput.packetId);
  const [lane, setLane] = useState(defaultInput.lane);
  const [targetMode, setTargetMode] = useState(defaultInput.targetMode);
  const [scope, setScope] = useState(defaultInput.scope);
  const [purpose, setPurpose] = useState(defaultInput.purpose);
  const [requestedAction, setRequestedAction] = useState(
    defaultInput.requestedAction,
  );
  const [expectedOutputShape, setExpectedOutputShape] = useState(
    defaultInput.expectedOutputShape,
  );
  const [lifecycleStatus, setLifecycleStatus] =
    useState<SupervisedRoutePacketLifecycleStatus>("draft");
  const [copyMessage, setCopyMessage] = useState(
    "Exports are local text only; select or copy manually.",
  );

  function seedFromSelectedPassalong() {
    if (!selectedPassalong) {
      return;
    }
    setPacketId(`${selectedPassalong.passalongId}-route-packet`);
    setScope(selectedPassalong.scope);
    setPurpose(selectedPassalong.summary);
    setRequestedAction(selectedPassalong.requestedDecision);
    setExpectedOutputShape(
      "Structured sandbox-nexus intake acknowledgement and supervised closeout fixture.",
    );
  }

  const packet = useMemo(
    () =>
      buildSupervisedRoutePacket({
        ...defaultInput,
        packetId,
        lane,
        targetMode,
        scope,
        purpose,
        requestedAction,
        expectedOutputShape,
        lifecycleStatus,
        evidenceReferences: [
          ...defaultInput.evidenceReferences,
          ...(selectedPassalong
            ? selectedPassalong.evidencePointers.map((reference, index) => ({
                id: `${selectedPassalong.passalongId}-evidence-${index + 1}`,
                label: "Selected passalong evidence reference",
                reference,
              }))
            : []),
        ],
        guardrails: [...SUPERVISED_ROUTE_PACKET_GUARDRAILS],
        nonAuthorizations: [...SUPERVISED_ROUTE_PACKET_NON_AUTHORIZATIONS],
      }),
    [
      defaultInput,
      expectedOutputShape,
      lane,
      lifecycleStatus,
      packetId,
      purpose,
      requestedAction,
      scope,
      selectedPassalong,
      targetMode,
    ],
  );
  const jsonExport = useMemo(
    () => buildSupervisedRoutePacketJson(packet),
    [packet],
  );
  const markdownExport = useMemo(
    () => buildSupervisedRoutePacketMarkdown(packet),
    [packet],
  );

  async function copyText(label: string, text: string) {
    if (!navigator.clipboard?.writeText) {
      setCopyMessage(
        `${label} copy unavailable in this browser; use the selectable export text.`,
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} copied by manual operator action.`);
    } catch {
      setCopyMessage(
        `${label} copy failed; use the selectable export text fallback.`,
      );
    }
  }

  return (
    <OperatorPanel className="space-y-4">
      <OperatorSectionHeader
        index="B5"
        title="Supervised route-packet composer"
        right={<OperatorBadge tone="blocked">manual handoff only</OperatorBadge>}
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded border border-amber-900/70 bg-amber-950/20 p-3 text-xs text-amber-100">
          This route packet is app-local and non-authoritative.
          CONTROL_THREAD remains the acceptance authority.
        </div>
        <div className="rounded border border-sky-900/70 bg-sky-950/20 p-3 text-xs text-sky-100">
          Export/copy is manual handoff only. No automatic send or dispatch
          occurs.
        </div>
        <div className="rounded border border-red-900/70 bg-red-950/20 p-3 text-xs text-red-100">
          No provider/model/API call, sandbox runtime activation, JAI Agent
          activation, target-repo mutation, accepted-code import, deployment, or
          production gate occurs.
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-slate-400">
              Packet id
              <input
                value={packetId}
                onChange={(event) => setPacketId(event.target.value)}
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              />
            </label>
            <label className="block text-xs text-slate-400">
              Lane
              <input
                value={lane}
                onChange={(event) => setLane(event.target.value)}
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              />
            </label>
          </div>

          <label className="block text-xs text-slate-400">
            Target mode
            <input
              value={targetMode}
              onChange={(event) => setTargetMode(event.target.value)}
              className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <label className="block text-xs text-slate-400">
            Lifecycle status
            <select
              value={lifecycleStatus}
              onChange={(event) =>
                setLifecycleStatus(
                  event.target.value as SupervisedRoutePacketLifecycleStatus,
                )
              }
              className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            >
              {SUPERVISED_ROUTE_PACKET_LIFECYCLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs text-slate-400">
            Scope
            <textarea
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              className="mt-1 min-h-20 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <label className="block text-xs text-slate-400">
            Purpose
            <textarea
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className="mt-1 min-h-20 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <label className="block text-xs text-slate-400">
            Requested action
            <textarea
              value={requestedAction}
              onChange={(event) => setRequestedAction(event.target.value)}
              className="mt-1 min-h-24 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <label className="block text-xs text-slate-400">
            Expected output shape
            <textarea
              value={expectedOutputShape}
              onChange={(event) => setExpectedOutputShape(event.target.value)}
              className="mt-1 min-h-20 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <button
            type="button"
            onClick={seedFromSelectedPassalong}
            disabled={!selectedPassalong}
            className="w-full rounded border border-sky-700 bg-sky-950/40 px-3 py-2 text-sm font-semibold text-sky-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950 disabled:text-slate-600"
          >
            Seed from selected passalong
          </button>
        </div>

        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <OperatorIdChip>{packet.packetId}</OperatorIdChip>
              <OperatorBadge tone="advisory">{packet.lifecycleStatus}</OperatorBadge>
              <OperatorBadge tone="blocked">not delivery proof</OperatorBadge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <div className="font-mono text-xs uppercase text-slate-500">
                  target
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {packet.targetRepo} / {packet.targetSurface}
                </p>
              </div>
              <div>
                <div className="font-mono text-xs uppercase text-slate-500">
                  mode
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {packet.targetMode}
                </p>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-300">{packet.scope}</div>
            <div className="mt-3 rounded border border-amber-900/70 bg-amber-950/20 p-2 text-xs text-amber-100">
              {packet.controlThreadAuthority}
            </div>
            <div className="mt-2 rounded border border-slate-800 bg-slate-950/40 p-2 text-xs text-slate-300">
              {packet.advisoryNonAuthoritative}
            </div>
          </OperatorGateCard>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-xs uppercase text-slate-500">
                  JSON export
                </div>
                <button
                  type="button"
                  onClick={() => void copyText("JSON packet", jsonExport)}
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
                >
                  Copy JSON
                </button>
              </div>
              <textarea
                readOnly
                value={jsonExport}
                className="min-h-[24rem] w-full resize-y rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-200 outline-none"
                aria-label="Supervised route packet JSON export"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-xs uppercase text-slate-500">
                  Markdown export
                </div>
                <button
                  type="button"
                  onClick={() =>
                    void copyText("Markdown packet", markdownExport)
                  }
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
                >
                  Copy Markdown
                </button>
              </div>
              <textarea
                readOnly
                value={markdownExport}
                className="min-h-[24rem] w-full resize-y rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-200 outline-none"
                aria-label="Supervised route packet Markdown export"
              />
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
            {copyMessage} The textareas remain selectable fallback exports.
          </div>
        </div>
      </div>
    </OperatorPanel>
  );
}

function JaiPaletteSandboxAgentDraftComposerPanel() {
  const [agentClass, setAgentClass] = useState<JaiSandboxAgentClass>(
    "JAI::SANDBOX::INTAKE_AGENT",
  );
  const defaultInput = useMemo(
    () => createDefaultJaiPaletteSandboxAgentDraftInput(agentClass),
    [agentClass],
  );
  const [agentId, setAgentId] = useState(defaultInput.agentId);
  const [agentName, setAgentName] = useState(defaultInput.agentName);
  const [sandboxDomain, setSandboxDomain] = useState(
    defaultInput.sandboxDomain,
  );
  const [purpose, setPurpose] = useState(defaultInput.purpose);
  const [coverageResponsibility, setCoverageResponsibility] = useState(
    defaultInput.coverageResponsibility,
  );
  const [activationStatus, setActivationStatus] =
    useState<JaiPaletteAgentActivationStatus>("draft");
  const [reviewStatus, setReviewStatus] =
    useState<JaiPaletteAgentReviewStatus>("pending");
  const [copyMessage, setCopyMessage] = useState(
    "Draft exports are local text only; select or copy manually.",
  );

  function loadClassDefaults(nextClass: JaiSandboxAgentClass) {
    const nextInput = createDefaultJaiPaletteSandboxAgentDraftInput(nextClass);
    setAgentClass(nextClass);
    setAgentId(nextInput.agentId);
    setAgentName(nextInput.agentName);
    setSandboxDomain(nextInput.sandboxDomain);
    setPurpose(nextInput.purpose);
    setCoverageResponsibility(nextInput.coverageResponsibility);
    setActivationStatus("draft");
    setReviewStatus("pending");
  }

  const draft = useMemo(
    () =>
      buildJaiPaletteSandboxAgentDraft({
        ...defaultInput,
        agentId,
        agentName,
        sandboxDomain,
        purpose,
        coverageResponsibility,
        activationStatus,
        reviewStatus,
      }),
    [
      activationStatus,
      agentId,
      agentName,
      coverageResponsibility,
      defaultInput,
      purpose,
      reviewStatus,
      sandboxDomain,
    ],
  );
  const jsonExport = useMemo(
    () => buildJaiPaletteSandboxAgentDraftJson(draft),
    [draft],
  );
  const markdownExport = useMemo(
    () => buildJaiPaletteSandboxAgentDraftMarkdown(draft),
    [draft],
  );

  async function copyText(label: string, text: string) {
    if (!navigator.clipboard?.writeText) {
      setCopyMessage(
        `${label} copy unavailable in this browser; use the selectable export text.`,
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} copied by manual operator action.`);
    } catch {
      setCopyMessage(
        `${label} copy failed; use the selectable export text fallback.`,
      );
    }
  }

  return (
    <OperatorPanel className="space-y-4">
      <OperatorSectionHeader
        index="B11"
        title="JAI Palette sandbox agent draft composer"
        right={<OperatorBadge tone="blocked">candidate metadata only</OperatorBadge>}
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded border border-amber-900/70 bg-amber-950/20 p-3 text-xs text-amber-100">
          JAI Palette drafts are app-local and non-authoritative. Drafted
          sandbox agents are candidates only.
        </div>
        <div className="rounded border border-sky-900/70 bg-sky-950/20 p-3 text-xs text-sky-100">
          Activation status is limited to draft or candidate. CONTROL_THREAD
          remains the review/accept/hold authority.
        </div>
        <div className="rounded border border-red-900/70 bg-red-950/20 p-3 text-xs text-red-100">
          No executable agent runtime, autonomous execution,
          provider/model/API dispatch, sandbox runtime activation, sandbox task
          execution, target-repo mutation/import, accepted-code import,
          deployment, or production gate occurs.
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-3">
          <label className="block text-xs text-slate-400">
            Coverage class
            <select
              value={agentClass}
              onChange={(event) =>
                loadClassDefaults(event.target.value as JaiSandboxAgentClass)
              }
              className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            >
              {JAI_SANDBOX_AGENT_CLASSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-slate-400">
              Agent id
              <input
                value={agentId}
                onChange={(event) => setAgentId(event.target.value)}
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              />
            </label>
            <label className="block text-xs text-slate-400">
              Agent name
              <input
                value={agentName}
                onChange={(event) => setAgentName(event.target.value)}
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              />
            </label>
          </div>

          <label className="block text-xs text-slate-400">
            Sandbox domain
            <input
              value={sandboxDomain}
              onChange={(event) => setSandboxDomain(event.target.value)}
              className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-slate-400">
              Activation status
              <select
                value={activationStatus}
                onChange={(event) =>
                  setActivationStatus(
                    event.target.value as JaiPaletteAgentActivationStatus,
                  )
                }
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              >
                {JAI_PALETTE_AGENT_ACTIVATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-400">
              Review status
              <select
                value={reviewStatus}
                onChange={(event) =>
                  setReviewStatus(
                    event.target.value as JaiPaletteAgentReviewStatus,
                  )
                }
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
              >
                {JAI_PALETTE_AGENT_REVIEW_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-xs text-slate-400">
            Purpose
            <textarea
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className="mt-1 min-h-24 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>

          <label className="block text-xs text-slate-400">
            Coverage responsibility
            <textarea
              value={coverageResponsibility}
              onChange={(event) =>
                setCoverageResponsibility(event.target.value)
              }
              className="mt-1 min-h-24 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
            />
          </label>
        </div>

        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <OperatorIdChip>{draft.agentId}</OperatorIdChip>
              <OperatorBadge tone="fixture">{draft.agentClass}</OperatorBadge>
              <OperatorBadge tone="advisory">
                {draft.activationStatus}
              </OperatorBadge>
              <OperatorBadge tone="blocked">not executable</OperatorBadge>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-slate-100">
              {draft.agentName}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{draft.purpose}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <div className="font-mono text-xs uppercase text-slate-500">
                  route-packet compatibility
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {draft.routePacketCompatibility.compatiblePacketPosture}
                </p>
              </div>
              <div>
                <div className="font-mono text-xs uppercase text-slate-500">
                  fixture compatibility
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {
                    draft.sandboxNexusFixtureCompatibility
                      .fixtureIntakeCompatibility
                  }
                </p>
              </div>
            </div>
            <div className="mt-3 rounded border border-amber-900/70 bg-amber-950/20 p-2 text-xs text-amber-100">
              {draft.controlThreadAuthority}
            </div>
            <div className="mt-2 rounded border border-slate-800 bg-slate-950/40 p-2 text-xs text-slate-300">
              {draft.advisoryNonAuthoritative}
            </div>
          </OperatorGateCard>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-xs uppercase text-slate-500">
                  JSON draft export
                </div>
                <button
                  type="button"
                  onClick={() => void copyText("JSON draft", jsonExport)}
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
                >
                  Copy JSON
                </button>
              </div>
              <textarea
                readOnly
                value={jsonExport}
                className="min-h-[24rem] w-full resize-y rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-200 outline-none"
                aria-label="JAI Palette sandbox agent draft JSON export"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-xs uppercase text-slate-500">
                  Markdown draft export
                </div>
                <button
                  type="button"
                  onClick={() =>
                    void copyText("Markdown draft", markdownExport)
                  }
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
                >
                  Copy Markdown
                </button>
              </div>
              <textarea
                readOnly
                value={markdownExport}
                className="min-h-[24rem] w-full resize-y rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-200 outline-none"
                aria-label="JAI Palette sandbox agent draft Markdown export"
              />
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
            {copyMessage} The textareas remain selectable fallback exports.
          </div>
        </div>
      </div>
    </OperatorPanel>
  );
}

export function PassalongRouterPrototype({
  threadMemoryRecords,
  passalongRecords,
  inboxQueues,
  outboxQueues,
  sandboxTargetOptions,
  authorityFindings,
  nonAuthorizations,
  persistedPassalongRecords,
  persistenceStatus,
  initialPassalongId,
  initialRouteRecommendation,
  initialCopyablePacket,
}: {
  threadMemoryRecords: ThreadMemoryRecord[];
  passalongRecords: PassalongRecord[];
  inboxQueues: PassalongQueue[];
  outboxQueues: PassalongQueue[];
  sandboxTargetOptions: SandboxTargetOption[];
  authorityFindings: string[];
  nonAuthorizations: string[];
  persistedPassalongRecords: PersistedPassalongRecord[];
  persistenceStatus: PassalongPersistenceStatus;
  initialPassalongId: string;
  initialRouteRecommendation: string;
  initialCopyablePacket: string;
}) {
  const [selectedPassalongId, setSelectedPassalongId] =
    useState(initialPassalongId);
  const [persistedRecords, setPersistedRecords] = useState(
    persistedPassalongRecords,
  );
  const [selectedPersistedPassalongId, setSelectedPersistedPassalongId] =
    useState(persistedPassalongRecords[0]?.passalongId ?? "");
  const [routeStatusDraft, setRouteStatusDraft] =
    useState<PassalongRouteStatus>("draft");
  const [archiveStateDraft, setArchiveStateDraft] =
    useState<PassalongArchiveState>("active");
  const [redactionStateDraft, setRedactionStateDraft] =
    useState<PassalongRedactionState>("not_required");
  const [manualOperatorNoteDraft, setManualOperatorNoteDraft] = useState("");
  const [persistenceMessage, setPersistenceMessage] = useState(
    persistenceStatus.safeMessage,
  );
  const [persistenceErrors, setPersistenceErrors] = useState<string[]>([]);
  const [isPersistenceBusy, setIsPersistenceBusy] = useState(false);

  const selectedPassalong = useMemo(
    () =>
      passalongRecords.find(
        (record) => record.passalongId === selectedPassalongId,
      ) ?? passalongRecords[0],
    [passalongRecords, selectedPassalongId],
  );

  const selectedPersistedPassalong = useMemo(
    () =>
      persistedRecords.find(
        (record) => record.passalongId === selectedPersistedPassalongId,
      ) ?? persistedRecords[0],
    [persistedRecords, selectedPersistedPassalongId],
  );

  useEffect(() => {
    if (!selectedPersistedPassalong) {
      return;
    }
    setRouteStatusDraft(selectedPersistedPassalong.routeStatus);
    setArchiveStateDraft(selectedPersistedPassalong.archiveState);
    setRedactionStateDraft(selectedPersistedPassalong.redactionState);
    setManualOperatorNoteDraft(
      selectedPersistedPassalong.manualOperatorNote ?? "",
    );
  }, [selectedPersistedPassalong]);

  const routeRecommendationText = selectedPassalong
    ? buildRouteRecommendationText(selectedPassalong)
    : initialRouteRecommendation;
  const copyablePacketText = selectedPassalong
    ? buildCopyablePassalongPacket(selectedPassalong)
    : initialCopyablePacket;

  async function saveSelectedPassalong() {
    if (!selectedPassalong) {
      return;
    }

    const candidate = buildPersistedPassalongInput(selectedPassalong);
    if (!candidate.ok || !candidate.value) {
      setPersistenceErrors(candidate.errors);
      setPersistenceMessage(
        "Field-boundary validation blocked persistence; no record was saved.",
      );
      return;
    }

    setIsPersistenceBusy(true);
    setPersistenceErrors([]);
    try {
      const response = await fetch("/operator/control-thread/passalongs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: candidate.value }),
      });
      const payload = (await response.json()) as {
        record?: PersistedPassalongRecord | null;
        errors?: string[];
        persistence?: { safeMessage?: string };
      };
      applyPersistencePayload(payload);
    } catch {
      setPersistenceMessage(
        "App-local persistence request failed; no automatic route or send occurred.",
      );
      setPersistenceErrors(["Persistence request failed."]);
    } finally {
      setIsPersistenceBusy(false);
    }
  }

  async function updateSelectedPersistedPassalong(
    patch: Partial<PersistedPassalongRecord>,
  ) {
    if (!selectedPersistedPassalong) {
      return;
    }

    setIsPersistenceBusy(true);
    setPersistenceErrors([]);
    try {
      const response = await fetch(
        `/operator/control-thread/passalongs/${encodeURIComponent(
          selectedPersistedPassalong.passalongId,
        )}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      const payload = (await response.json()) as {
        record?: PersistedPassalongRecord | null;
        errors?: string[];
        persistence?: { safeMessage?: string };
      };
      applyPersistencePayload(payload);
    } catch {
      setPersistenceMessage(
        "App-local persistence update failed; no automatic route or send occurred.",
      );
      setPersistenceErrors(["Persistence update failed."]);
    } finally {
      setIsPersistenceBusy(false);
    }
  }

  function applyPersistencePayload(payload: {
    record?: PersistedPassalongRecord | null;
    errors?: string[];
    persistence?: { safeMessage?: string };
  }) {
    setPersistenceMessage(
      payload.persistence?.safeMessage ??
        "Persistence response received; persisted records remain non-authoritative.",
    );
    setPersistenceErrors(payload.errors ?? []);
    if (!payload.record) {
      return;
    }
    const savedRecord = payload.record;
    setPersistedRecords((records) => {
      const existingIndex = records.findIndex(
        (record) => record.passalongId === savedRecord.passalongId,
      );
      if (existingIndex === -1) {
        return [savedRecord, ...records];
      }
      return records.map((record, index) =>
        index === existingIndex ? savedRecord : record,
      );
    });
    setSelectedPersistedPassalongId(savedRecord.passalongId);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-300 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs uppercase text-slate-500">
                  dev-jai-nexus / operator / control-thread
                </div>
                <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                  JAI_Control_Thread memory and passalong router prototype
                </h1>
                <p className="mt-3 max-w-4xl text-sm text-slate-400">
                  Local static prototype for viewing thread memory, passalong
                  inbox/outbox queues, deterministic advisory route
                  recommendations, copyable passalong text, sandbox-nexus
                  posture, and future import/adoption posture.
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <OperatorBadge tone="fixture">static sample records</OperatorBadge>
                <OperatorBadge tone="blocked">no auto-send</OperatorBadge>
                <OperatorBadge tone="blocked">no auto-route</OperatorBadge>
                <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
              </div>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Control Thread Authority"
            invariants={authorityFindings}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">advisory only</OperatorBadge>
              <OperatorBadge tone="blocked">CONTROL_THREAD authority</OperatorBadge>
              <OperatorBadge tone="readOnly">Linear mirror only</OperatorBadge>
            </div>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel>
          <OperatorSectionHeader
            index="MEM"
            title="Thread memory posture"
            right={<OperatorBadge tone="blocked">not source of truth</OperatorBadge>}
          />
          <div className="mt-3 grid gap-3 xl:grid-cols-2">
            {threadMemoryRecords.map((record) => (
              <ThreadMemoryCard key={record.threadId} record={record} />
            ))}
          </div>
        </OperatorPanel>

        <section className="grid gap-4 xl:grid-cols-2">
          <QueuePanel
            title="Inbox"
            queues={inboxQueues}
            selectedPassalongId={selectedPassalong?.passalongId ?? ""}
            onSelect={setSelectedPassalongId}
          />
          <QueuePanel
            title="Outbox"
            queues={outboxQueues}
            selectedPassalongId={selectedPassalong?.passalongId ?? ""}
            onSelect={setSelectedPassalongId}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_460px]">
          <OperatorPanel className="space-y-4">
            <OperatorSectionHeader
              index="PERSIST"
              title="App-local persisted records"
              right={
                <OperatorBadge
                  tone={persistenceStatus.available ? "advisory" : "blocked"}
                >
                  {persistenceStatus.available ? "available" : "unavailable"}
                </OperatorBadge>
              }
            />
            <div className="rounded border border-emerald-900/60 bg-emerald-950/20 p-3 text-xs text-emerald-100">
              Persisted records are app-local and non-authoritative. Route
              status is descriptive metadata only. Archive/delete lifecycle is
              app-local only. CONTROL_THREAD remains authority. Linear remains
              temporary mirror only.
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
              {persistenceMessage}
            </div>
            {persistenceErrors.length > 0 ? (
              <div className="rounded border border-red-900/70 bg-red-950/30 p-3 text-xs text-red-200">
                <div className="font-semibold">Persistence blocked</div>
                <MiniList items={persistenceErrors} />
              </div>
            ) : null}
            <PersistedRecordList
              records={persistedRecords}
              selectedPassalongId={
                selectedPersistedPassalong?.passalongId ?? ""
              }
              onSelect={setSelectedPersistedPassalongId}
            />
          </OperatorPanel>

          <OperatorPanel className="space-y-4">
            <OperatorSectionHeader
              index="MANUAL"
              title="Manual persistence controls"
              right={<OperatorBadge tone="blocked">operator click only</OperatorBadge>}
            />
            <button
              type="button"
              disabled={!selectedPassalong || isPersistenceBusy}
              onClick={saveSelectedPassalong}
              className="w-full rounded border border-emerald-700 bg-emerald-950/40 px-3 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950 disabled:text-slate-600"
            >
              Save selected static passalong as app-local record
            </button>
            <p className="text-xs text-slate-500">
              Saving requires this operator action and does not send, route,
              approve, execute, mutate GitHub, activate sandbox runtime, activate
              JAI Agents, import target-repo code, deploy, or open gates.
            </p>

            {selectedPersistedPassalong ? (
              <div className="space-y-3 rounded border border-slate-800 bg-slate-950/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <OperatorIdChip>
                    {selectedPersistedPassalong.passalongId}
                  </OperatorIdChip>
                  <OperatorBadge tone="blocked">not acceptance</OperatorBadge>
                </div>

                <label className="block text-xs text-slate-400">
                  Route status
                  <select
                    value={routeStatusDraft}
                    onChange={(event) =>
                      setRouteStatusDraft(
                        event.target.value as PassalongRouteStatus,
                      )
                    }
                    className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                  >
                    {PASSALONG_ROUTE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs text-slate-400">
                  Archive/delete lifecycle
                  <select
                    value={archiveStateDraft}
                    onChange={(event) =>
                      setArchiveStateDraft(
                        event.target.value as PassalongArchiveState,
                      )
                    }
                    className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                  >
                    {PASSALONG_ARCHIVE_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs text-slate-400">
                  Redaction state
                  <select
                    value={redactionStateDraft}
                    onChange={(event) =>
                      setRedactionStateDraft(
                        event.target.value as PassalongRedactionState,
                      )
                    }
                    className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                  >
                    {PASSALONG_REDACTION_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs text-slate-400">
                  Manual operator note
                  <textarea
                    value={manualOperatorNoteDraft}
                    onChange={(event) =>
                      setManualOperatorNoteDraft(event.target.value)
                    }
                    className="mt-1 min-h-24 w-full resize-y rounded border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                    placeholder="Optional, minimized, non-secret note only."
                  />
                </label>

                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    disabled={isPersistenceBusy}
                    onClick={() =>
                      updateSelectedPersistedPassalong({
                        routeStatus: routeStatusDraft,
                        archiveState: archiveStateDraft,
                        redactionState: redactionStateDraft,
                        manualOperatorNote:
                          manualOperatorNoteDraft.trim() || null,
                      })
                    }
                    className="rounded border border-sky-700 bg-sky-950/40 px-3 py-2 text-xs font-semibold text-sky-100 disabled:opacity-50"
                  >
                    Save metadata
                  </button>
                  <button
                    type="button"
                    disabled={isPersistenceBusy}
                    onClick={() =>
                      updateSelectedPersistedPassalong({
                        archiveState: "archived",
                      })
                    }
                    className="rounded border border-amber-700 bg-amber-950/40 px-3 py-2 text-xs font-semibold text-amber-100 disabled:opacity-50"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    disabled={isPersistenceBusy}
                    onClick={() =>
                      updateSelectedPersistedPassalong({
                        archiveState: "marked_for_delete",
                      })
                    }
                    className="rounded border border-red-800 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-100 disabled:opacity-50"
                  >
                    Mark for delete
                  </button>
                </div>

                <div className="rounded border border-red-900/70 bg-red-950/20 p-2 text-xs text-red-200">
                  Archive and marked-for-delete are app-local markers only.
                  `archivedAt` is not source-of-truth archive. `deletedAt` is
                  not source-of-truth deletion. No hard delete, background
                  cleanup, automatic deletion, auto-send, or auto-route is
                  added.
                </div>
              </div>
            ) : (
              <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-500">
                Select or save a persisted record to edit app-local metadata.
              </div>
            )}
          </OperatorPanel>
        </section>

        <RoutePacketComposerPanel selectedPassalong={selectedPassalong} />
        <JaiPaletteSandboxAgentDraftComposerPanel />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <OperatorPanel className="space-y-4">
            <OperatorSectionHeader
              index="SEL"
              title="Selected passalong detail"
              right={<OperatorBadge tone="blocked">not acceptance</OperatorBadge>}
            />
            {selectedPassalong ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <OperatorIdChip>{selectedPassalong.passalongId}</OperatorIdChip>
                  <OperatorBadge tone={statusTone(selectedPassalong.status)}>
                    {selectedPassalong.status}
                  </OperatorBadge>
                  <OperatorBadge tone="readOnly">{selectedPassalong.mode}</OperatorBadge>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">
                  {selectedPassalong.scope}
                </h2>
                <p className="text-sm text-slate-300">
                  {selectedPassalong.summary}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <OperatorGateCard>
                    <div className="font-mono text-xs uppercase text-slate-500">
                      requested decision
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      {selectedPassalong.requestedDecision}
                    </p>
                  </OperatorGateCard>
                  <OperatorGateCard>
                    <div className="font-mono text-xs uppercase text-slate-500">
                      authority boundary
                    </div>
                    <p className="mt-2 text-sm text-amber-200">
                      {selectedPassalong.authorityBoundary}
                    </p>
                  </OperatorGateCard>
                </div>
                <OperatorGateCard>
                  <div className="font-mono text-xs uppercase text-slate-500">
                    evidence pointers
                  </div>
                  <MiniList items={selectedPassalong.evidencePointers} />
                </OperatorGateCard>
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                No static passalong selected.
              </div>
            )}
          </OperatorPanel>

          <OperatorPanel className="space-y-4">
            <OperatorSectionHeader
              index="REC"
              title="Route recommendation text"
              right={<OperatorBadge tone="blocked">not route authority</OperatorBadge>}
            />
            <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-950 p-3 text-xs leading-6 text-slate-200">
              {routeRecommendationText}
            </pre>
          </OperatorPanel>
        </section>

        <OperatorPanel>
          <OperatorSectionHeader
            index="COPY"
            title="Copyable passalong packet text"
            right={<OperatorBadge tone="blocked">not automatic routing</OperatorBadge>}
          />
          <textarea
            readOnly
            value={copyablePacketText}
            className="min-h-[28rem] w-full resize-y rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-200 outline-none"
            aria-label="Copyable passalong packet text"
          />
        </OperatorPanel>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <OperatorPanel>
            <OperatorSectionHeader
              index="SBOX"
              title="sandbox-nexus target posture"
              right={<OperatorBadge tone="blocked">not sandbox activation</OperatorBadge>}
            />
            <div className="mt-3 grid gap-3">
              {sandboxTargetOptions.map((target) => (
                <SandboxTargetCard key={target.id} target={target} />
              ))}
            </div>
          </OperatorPanel>

          <OperatorPanel>
            <OperatorSectionHeader
              index="IMPORT"
              title="Import/adoption posture"
              right={<OperatorBadge tone="blocked">not target-repo adoption</OperatorBadge>}
            />
            <div className="mt-3 grid gap-2">
              {SANDBOX_IMPORT_ADOPTION_POSTURES.map((posture) => (
                <div
                  key={posture}
                  className="rounded border border-slate-800 bg-slate-950/40 p-3"
                >
                  <OperatorBadge
                    tone={
                      posture === "promote_to_import_candidate"
                        ? "advisory"
                        : "readOnly"
                    }
                  >
                    {posture}
                  </OperatorBadge>
                  <p className="mt-2 text-sm text-slate-300">
                    {SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS[posture]}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded border border-red-900/70 bg-red-950/30 p-3 text-xs text-red-200">
              promote_to_import_candidate is not target-repo adoption. No
              posture value imports code into canonical repos, creates branches,
              creates PRs, merges, commits, deploys, or opens gates.
            </p>
          </OperatorPanel>
        </section>

        <OperatorPanel>
          <OperatorSectionHeader
            index="AUTH"
            title="Authority findings"
            right={<OperatorBadge tone="blocked">manual approval required</OperatorBadge>}
          />
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {authorityFindings.map((finding) => (
              <div
                key={finding}
                className="rounded border border-amber-900/70 bg-amber-950/20 p-3 text-xs text-amber-200"
              >
                {finding}
              </div>
            ))}
          </div>
        </OperatorPanel>

        <OperatorPanel>
          <OperatorSectionHeader
            index="BOUNDARY"
            title="Non-authorizations"
            right={<OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>}
          />
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {nonAuthorizations.map((item) => (
              <div
                key={item}
                className="rounded border border-red-900/70 bg-red-950/20 p-3 text-xs text-red-200"
              >
                {item}
              </div>
            ))}
          </div>
        </OperatorPanel>

        <footer className="flex flex-wrap items-center justify-center gap-2 text-center font-mono text-[10px] uppercase text-slate-500">
          <OperatorBadge tone="fixture">static prototype</OperatorBadge>
          <span>
            thread memory is not source of truth / passalong routing is manual
            only / ZERO GATES GRANTED
          </span>
        </footer>
      </div>
    </main>
  );
}
