"use client";

// portal/src/app/operator/grid/GridView.tsx
//
// Client component for Grid Configuration Mode (motion-0129).
// Slice 3 additions: connection drawing, connection validation, staged connections list.
//
// Connection drawing is a tool within Configuration Mode — no separate top-level mode.
// All connection changes are staged in client state only. No file writes.
//
// Flow:
//   1. Click "Draw Connection" → connMode = true
//   2. Choose type (Handoff | Governance)
//   3. Click source agent → connSource set, highlighted teal
//   4. Click target agent → validate → stage or show inline error
//   5. Source stays selected for chaining; click source again to deselect
//   6. "Exit" or ESC to leave connection mode

import { useReducer, useState, useCallback, useEffect } from "react";
import type { GridConfig, AgencyAgent, ExecutionRole } from "@/lib/grid/gridConfig";
import {
  draftReducer,
  EMPTY_DRAFT,
  applyDraftToLayout,
  type ZoneId,
  type EffectiveAgent,
  type EffectiveZone,
  type ConnectionChange,
  type ConnectionType,
} from "@/lib/grid/gridDraft";
import { validateConnection } from "@/lib/grid/connectionValidator";
import { diffGridDraft } from "@/lib/grid/gridDiff";
import {
  buildMotionDraftScaffold,
  type MotionDraftScaffold,
} from "@/lib/grid/gridMotionDraft";

// ── V2 extended shape ────────────────────────────────────────────────────────

type AgentV2Shape = {
  capabilities?: string[];
  constraints?: {
    canEditCode?: boolean;
    canRunCommands?: boolean;
    canWriteDocs?: boolean;
    requiresEvidence?: boolean;
  };
};
function asV2(agent: AgencyAgent): AgentV2Shape {
  return agent as unknown as AgentV2Shape;
}

// ── Zone color palette ───────────────────────────────────────────────────────

type ZoneColors = { header: string; border: string; badge: string; dragOver: string };

const ZONE_COLORS: Record<ExecutionRole, ZoneColors> = {
  ARCHITECT: {
    header: "text-purple-300",
    border: "border-purple-900/50",
    badge: "bg-purple-900/50 text-purple-200",
    dragOver: "border-purple-500/60 bg-purple-950/40",
  },
  BUILDER: {
    header: "text-amber-300",
    border: "border-amber-900/50",
    badge: "bg-amber-900/50 text-amber-200",
    dragOver: "border-amber-500/60 bg-amber-950/40",
  },
  VERIFIER: {
    header: "text-slate-300",
    border: "border-slate-700/40",
    badge: "bg-slate-800/60 text-slate-300",
    dragOver: "border-slate-500/60 bg-slate-900/40",
  },
  OPERATOR: {
    header: "text-sky-300",
    border: "border-sky-900/50",
    badge: "bg-sky-900/50 text-sky-200",
    dragOver: "border-sky-500/60 bg-sky-950/40",
  },
  LIBRARIAN: {
    header: "text-teal-300",
    border: "border-teal-900/40",
    badge: "bg-teal-900/40 text-teal-200",
    dragOver: "border-teal-500/60 bg-teal-950/40",
  },
};

const GOV_DRAG_OVER = "border-gray-500/60 bg-zinc-900/60";

// ── Drag data keys ───────────────────────────────────────────────────────────

const DT_NH_ID = "application/jai-nhid";
const DT_LABEL = "application/jai-label";
const DT_FROM_ZONE = "application/jai-fromzone";
const DT_FROM_RANK = "application/jai-fromrank";

// ── Root view ────────────────────────────────────────────────────────────────

export function GridView({ config }: { config: GridConfig }) {
  const [draft, dispatchDraft] = useReducer(draftReducer, EMPTY_DRAFT);
  const [selectedAgent, setSelectedAgent] = useState<AgencyAgent | null>(null);

  // Drag state
  const [dragSourceNhId, setDragSourceNhId] = useState<string | null>(null);
  const [dragTargetZone, setDragTargetZone] = useState<ZoneId | null>(null);

  // Connection mode state
  const [connMode, setConnMode] = useState(false);
  const [connType, setConnType] = useState<ConnectionType | null>(null);
  const [connSource, setConnSource] = useState<AgencyAgent | null>(null);
  const [connError, setConnError] = useState<string | null>(null);

  // Motion draft modal state
  const [showDiff, setShowDiff] = useState(false);
  const [scaffold, setScaffold] = useState<MotionDraftScaffold | null>(null);

  // Auto-clear connection errors after 3 s
  useEffect(() => {
    if (!connError) return;
    const t = setTimeout(() => setConnError(null), 3000);
    return () => clearTimeout(t);
  }, [connError]);

  // ESC exits connection mode
  useEffect(() => {
    if (!connMode) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") exitConnMode();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connMode]);

  const layout = applyDraftToLayout(config, draft);
  const hasDraft =
    draft.changes.length > 0 || draft.connections.length > 0;
  const totalChanges = draft.changes.length + draft.connections.length;

  // ── Selection ────────────────────────────────────────────────────────────

  const handleSelectAgent = useCallback((agent: AgencyAgent) => {
    setSelectedAgent((prev) =>
      prev?.nh_id === agent.nh_id ? null : agent,
    );
  }, []);

  // ── Connection drawing ───────────────────────────────────────────────────

  function exitConnMode() {
    setConnMode(false);
    setConnType(null);
    setConnSource(null);
    setConnError(null);
  }

  function handleConnectClick(agent: AgencyAgent) {
    if (!connType) {
      setConnError("Choose a connection type (Handoff or Governance) first.");
      return;
    }

    // No source yet → set source
    if (!connSource) {
      setConnSource(agent);
      return;
    }

    // Click source again → deselect source
    if (connSource.nh_id === agent.nh_id) {
      setConnSource(null);
      return;
    }

    // Duplicate check
    const isDuplicate = draft.connections.some(
      (c) =>
        c.sourceNhId === connSource.nh_id &&
        c.targetNhId === agent.nh_id &&
        c.type === connType,
    );
    if (isDuplicate) {
      setConnError(
        `A ${connType} connection from ${connSource.label} to ${agent.label} is already staged.`,
      );
      return;
    }

    // Structural validation
    const result = validateConnection(connSource, agent, connType);
    if (!result.ok) {
      setConnError(result.reason ?? "Invalid connection.");
      return;
    }

    // Stage connection
    const id = `conn-${draft.connections.length + 1}`;
    dispatchDraft({
      type: "CONNECT",
      connection: {
        id,
        sourceNhId: connSource.nh_id,
        sourceLabel: connSource.label,
        targetNhId: agent.nh_id,
        targetLabel: agent.label,
        type: connType,
      },
    });
    setConnError(null);
    // Keep source for chaining — operator can draw multiple connections from same source
  }

  // Routes agent click through connection mode or normal selection
  function handleAgentClick(agent: AgencyAgent) {
    if (connMode) {
      handleConnectClick(agent);
    } else {
      handleSelectAgent(agent);
    }
  }

  // ── Propose changes ──────────────────────────────────────────────────────

  function handlePropose() {
    const diff = diffGridDraft(config, draft);
    setScaffold(buildMotionDraftScaffold(diff));
    setShowDiff(true);
  }

  // ── Drag handlers ────────────────────────────────────────────────────────

  function handleDragStart(
    e: React.DragEvent,
    agent: AgencyAgent,
    fromZone: ZoneId,
    fromRank: number,
  ) {
    if (connMode) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(DT_NH_ID, agent.nh_id);
    e.dataTransfer.setData(DT_LABEL, agent.label);
    e.dataTransfer.setData(DT_FROM_ZONE, fromZone);
    e.dataTransfer.setData(DT_FROM_RANK, String(fromRank));
    setDragSourceNhId(agent.nh_id);
  }

  function handleDragEnd() {
    setDragSourceNhId(null);
    setDragTargetZone(null);
  }

  function handleDragOverZone(e: React.DragEvent, zone: ZoneId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragTargetZone(zone);
  }

  function handleDragLeaveZone() {
    setDragTargetZone(null);
  }

  function handleDropOnZone(
    e: React.DragEvent,
    targetZone: ZoneId,
    currentAgentCount: number,
  ) {
    e.preventDefault();
    setDragTargetZone(null);
    setDragSourceNhId(null);

    const nhId = e.dataTransfer.getData(DT_NH_ID);
    const agentLabel = e.dataTransfer.getData(DT_LABEL);
    const fromZone = e.dataTransfer.getData(DT_FROM_ZONE) as ZoneId;
    const fromRank = parseInt(e.dataTransfer.getData(DT_FROM_RANK), 10);

    if (!nhId) return;

    const agentsInTarget =
      targetZone === fromZone ? currentAgentCount - 1 : currentAgentCount;
    const toRank = Math.max(0, agentsInTarget);

    dispatchDraft({
      type: "MOVE",
      nhId,
      agentLabel,
      fromZone,
      fromRank,
      toZone: targetZone,
      toRank,
    });
  }

  // ── Zone grouping ────────────────────────────────────────────────────────

  const executionLane = layout.zones.filter((z) =>
    (["ARCHITECT", "BUILDER", "VERIFIER"] as ExecutionRole[]).includes(z.role),
  );
  const supportRoles = layout.zones.filter((z) =>
    (["OPERATOR", "LIBRARIAN"] as ExecutionRole[]).includes(z.role),
  );

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8 pb-28">

      {/* ── Header ── */}
      <header className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS · Grid</h1>
            <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] uppercase tracking-wide text-gray-400">
              Configuration Mode
            </span>
            {hasDraft ? (
              <span className="inline-flex items-center rounded-full border border-amber-700/60 bg-amber-900/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-400">
                Draft · {totalChanges} pending
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-emerald-800/50 bg-emerald-900/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-400">
                Canonical · v0
              </span>
            )}
          </div>

          {/* Connect mode toggle */}
          <button
            onClick={() => {
              if (connMode) {
                exitConnMode();
              } else {
                setConnMode(true);
                setSelectedAgent(null);
              }
            }}
            className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
              connMode
                ? "border-teal-600 bg-teal-900/40 text-teal-200"
                : "border-gray-700 bg-zinc-900 text-gray-300 hover:border-gray-600 hover:bg-zinc-800"
            }`}
          >
            {connMode ? "● Connect Mode" : "Draw Connection"}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {connMode
            ? "Connection mode active. Choose type, select source, then click a target."
            : hasDraft
              ? "Staged changes are client-only — nothing has been written."
              : "Canonical topology. Drag agents between zones or draw connections to stage changes."}
        </p>
      </header>

      {/* ── Connection mode toolbar ── */}
      {connMode && (
        <ConnectModeBar
          connType={connType}
          connSource={connSource}
          connError={connError}
          onSelectType={setConnType}
          onClearSource={() => setConnSource(null)}
          onExit={exitConnMode}
        />
      )}

      {/* ── Main: zones left, panel right ── */}
      <div className="flex gap-6 items-start mt-4">

        {/* ── Zones column ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Execution lane */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
              Execution lane — ARCHITECT → BUILDER → VERIFIER
            </p>
            <div className="grid grid-cols-3 gap-3">
              {executionLane.map((zone) => (
                <ZoneCard
                  key={zone.role}
                  zone={zone}
                  selectedNhId={selectedAgent?.nh_id ?? null}
                  connSource={connSource}
                  connMode={connMode}
                  dragSourceNhId={dragSourceNhId}
                  isDragTarget={dragTargetZone === zone.role}
                  onAgentClick={handleAgentClick}
                  onDragStart={(e, agent, rank) =>
                    handleDragStart(e, agent, zone.role, rank)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverZone(e, zone.role)}
                  onDragLeave={handleDragLeaveZone}
                  onDrop={(e) =>
                    handleDropOnZone(e, zone.role, zone.agents.length)
                  }
                />
              ))}
            </div>
          </div>

          {/* Support roles */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
              Support roles
            </p>
            <div className="grid grid-cols-2 gap-3">
              {supportRoles.map((zone) => (
                <ZoneCard
                  key={zone.role}
                  zone={zone}
                  selectedNhId={selectedAgent?.nh_id ?? null}
                  connSource={connSource}
                  connMode={connMode}
                  dragSourceNhId={dragSourceNhId}
                  isDragTarget={dragTargetZone === zone.role}
                  onAgentClick={handleAgentClick}
                  onDragStart={(e, agent, rank) =>
                    handleDragStart(e, agent, zone.role, rank)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverZone(e, zone.role)}
                  onDragLeave={handleDragLeaveZone}
                  onDrop={(e) =>
                    handleDropOnZone(e, zone.role, zone.agents.length)
                  }
                />
              ))}
            </div>
          </div>

          {/* Governance-only agents */}
          {(config.governanceAgents.length > 0 ||
            layout.governanceAgents.length > 0) && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
                Governance only
              </p>
              <div
                className={`rounded-lg border bg-zinc-950 p-3 transition-colors ${
                  dragTargetZone === "governance"
                    ? GOV_DRAG_OVER
                    : "border-gray-800"
                }`}
                onDragOver={(e) => handleDragOverZone(e, "governance")}
                onDragLeave={handleDragLeaveZone}
                onDrop={(e) =>
                  handleDropOnZone(
                    e,
                    "governance",
                    layout.governanceAgents.length,
                  )
                }
              >
                {layout.governanceAgents.length === 0 ? (
                  <p className="text-[11px] text-gray-700 text-center py-1">
                    No agents
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {layout.governanceAgents.map((ea, idx) => (
                      <DraggableGovernanceChip
                        key={ea.agent.nh_id}
                        ea={ea}
                        rank={idx}
                        connMode={connMode}
                        connSource={connSource}
                        isSelected={selectedAgent?.nh_id === ea.agent.nh_id}
                        isSource={dragSourceNhId === ea.agent.nh_id}
                        onClick={() => handleAgentClick(ea.agent)}
                        onDragStart={(e) =>
                          handleDragStart(e, ea.agent, "governance", ea.rank)
                        }
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Staged connections list */}
          {draft.connections.length > 0 && (
            <StagedConnectionsList
              connections={draft.connections}
              onRemove={(id) => dispatchDraft({ type: "REMOVE_CONNECTION", id })}
            />
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6">
            {connMode ? (
              <ConnectHint
                connType={connType}
                connSource={connSource}
                stagedCount={draft.connections.length}
              />
            ) : selectedAgent ? (
              <PropertyPanel
                agent={selectedAgent}
                isDraft={Boolean(draft.overrides[selectedAgent.nh_id])}
                connectionCount={
                  draft.connections.filter(
                    (c) =>
                      c.sourceNhId === selectedAgent.nh_id ||
                      c.targetNhId === selectedAgent.nh_id,
                  ).length
                }
                onClose={() => setSelectedAgent(null)}
              />
            ) : (
              <EmptyPanel isDragging={dragSourceNhId !== null} />
            )}
          </div>
        </div>
      </div>

      {/* ── Draft banner ── */}
      {hasDraft && (
        <DraftBanner
          positionChanges={draft.changes.length}
          connectionChanges={draft.connections.length}
          onPropose={handlePropose}
          onDiscard={() => {
            dispatchDraft({ type: "DISCARD" });
            setSelectedAgent(null);
            setConnSource(null);
          }}
        />
      )}

      {showDiff && scaffold !== null && (
        <MotionDraftModal
          scaffold={scaffold}
          onClose={() => setShowDiff(false)}
        />
      )}
    </main>
  );
}

// ── ConnectModeBar ────────────────────────────────────────────────────────────

function ConnectModeBar({
  connType,
  connSource,
  connError,
  onSelectType,
  onClearSource,
  onExit,
}: {
  connType: ConnectionType | null;
  connSource: AgencyAgent | null;
  connError: string | null;
  onSelectType: (t: ConnectionType) => void;
  onClearSource: () => void;
  onExit: () => void;
}) {
  return (
    <div className="rounded-lg border border-teal-800/50 bg-teal-950/30 px-4 py-3 mb-2">
      <div className="flex flex-wrap items-center gap-4 text-xs">

        {/* Type selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            Type
          </span>
          {(["handoff", "governance"] as ConnectionType[]).map((t) => (
            <button
              key={t}
              onClick={() => onSelectType(t)}
              className={`rounded-md border px-2.5 py-1 text-[11px] capitalize transition-colors ${
                connType === t
                  ? "border-teal-600 bg-teal-900/60 text-teal-100"
                  : "border-gray-700 bg-zinc-900 text-gray-400 hover:border-gray-600 hover:text-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Source indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            Source
          </span>
          {connSource ? (
            <div className="flex items-center gap-1.5 rounded border border-teal-700/60 bg-teal-900/30 px-2 py-0.5">
              <span className="text-teal-200">{connSource.label}</span>
              <span className="font-mono text-[10px] text-teal-500">
                {connSource.nh_id}
              </span>
              <button
                onClick={onClearSource}
                className="text-teal-600 hover:text-teal-300 leading-none ml-1"
                aria-label="Clear source"
              >
                ×
              </button>
            </div>
          ) : (
            <span className="text-gray-600 italic">
              {connType ? "click an agent" : "choose type first"}
            </span>
          )}
        </div>

        {/* Exit */}
        <button
          onClick={onExit}
          className="ml-auto rounded-md border border-gray-700 px-2.5 py-1 text-[11px] text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors"
        >
          Exit ×
        </button>
      </div>

      {/* Inline error */}
      {connError && (
        <div className="mt-2 rounded border border-red-800/60 bg-red-950/40 px-3 py-1.5 text-[11px] text-red-300">
          {connError}
        </div>
      )}
    </div>
  );
}

// ── ConnectHint (right panel in connect mode) ────────────────────────────────

function ConnectHint({
  connType,
  connSource,
  stagedCount,
}: {
  connType: ConnectionType | null;
  connSource: AgencyAgent | null;
  stagedCount: number;
}) {
  const step = !connType ? 1 : !connSource ? 2 : 3;

  return (
    <div className="rounded-lg border border-teal-800/40 bg-zinc-950 p-4">
      <div className="mb-3 text-xs font-medium text-teal-300">
        Connect Mode
      </div>
      <ol className="space-y-2 text-[11px]">
        <li className={step === 1 ? "text-teal-200" : "text-gray-600"}>
          <span className="font-mono mr-1">{step === 1 ? "→" : "✓"}</span>
          Choose type: Handoff or Governance
        </li>
        <li className={step === 2 ? "text-teal-200" : step > 2 ? "text-gray-600" : "text-gray-700"}>
          <span className="font-mono mr-1">{step === 2 ? "→" : step > 2 ? "✓" : " "}</span>
          Click source agent
        </li>
        <li className={step === 3 ? "text-teal-200" : "text-gray-700"}>
          <span className="font-mono mr-1">{step === 3 ? "→" : " "}</span>
          Click target agent
        </li>
      </ol>
      {stagedCount > 0 && (
        <div className="mt-3 border-t border-gray-800 pt-3 text-[11px] text-gray-500">
          {stagedCount} connection{stagedCount !== 1 ? "s" : ""} staged
        </div>
      )}
      <div className="mt-3 text-[10px] text-gray-700">
        ESC or Exit to leave connection mode
      </div>
    </div>
  );
}

// ── StagedConnectionsList ────────────────────────────────────────────────────

function StagedConnectionsList({
  connections,
  onRemove,
}: {
  connections: ConnectionChange[];
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
        Staged connections ({connections.length})
      </p>
      <div className="rounded-lg border border-gray-800 bg-zinc-950 overflow-hidden">
        {connections.map((conn, idx) => (
          <div
            key={conn.id}
            className={`flex items-center justify-between gap-3 px-3 py-2 text-xs ${
              idx < connections.length - 1
                ? "border-b border-gray-900"
                : ""
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-300 truncate">{conn.sourceLabel}</span>
              <span className="text-gray-600 flex-shrink-0">→</span>
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] flex-shrink-0 ${
                  conn.type === "handoff"
                    ? "bg-amber-900/40 text-amber-300"
                    : "bg-sky-900/40 text-sky-300"
                }`}
              >
                {conn.type}
              </span>
              <span className="text-gray-600 flex-shrink-0">→</span>
              <span className="text-gray-300 truncate">{conn.targetLabel}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-mono text-[10px] text-gray-700">
                {conn.id}
              </span>
              <button
                onClick={() => onRemove(conn.id)}
                className="text-gray-700 hover:text-red-400 transition-colors text-sm leading-none"
                aria-label={`Remove connection ${conn.id}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ZoneCard ─────────────────────────────────────────────────────────────────

function ZoneCard({
  zone,
  selectedNhId,
  connSource,
  connMode,
  dragSourceNhId,
  isDragTarget,
  onAgentClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  zone: EffectiveZone;
  selectedNhId: string | null;
  connSource: AgencyAgent | null;
  connMode: boolean;
  dragSourceNhId: string | null;
  isDragTarget: boolean;
  onAgentClick: (agent: AgencyAgent) => void;
  onDragStart: (e: React.DragEvent, agent: AgencyAgent, rank: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const colors = ZONE_COLORS[zone.role];

  return (
    <div
      className={`rounded-lg border bg-zinc-950 transition-colors ${
        isDragTarget ? colors.dragOver : colors.border
      }`}
      onDragOver={connMode ? undefined : onDragOver}
      onDragLeave={connMode ? undefined : onDragLeave}
      onDrop={connMode ? undefined : onDrop}
    >
      <div className="px-3 py-2 border-b border-gray-800/80">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${colors.header}`}>
            {zone.label}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${colors.badge}`}
          >
            {zone.agents.length}
          </span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">{zone.description}</p>
      </div>

      <div className="p-2 space-y-1 min-h-[3rem]">
        {zone.agents.length === 0 ? (
          <p className="text-[11px] text-gray-700 px-1 py-2 text-center">
            {isDragTarget && !connMode ? "Drop here" : "No agents"}
          </p>
        ) : (
          zone.agents.map((ea, idx) => (
            <AgentRow
              key={ea.agent.nh_id}
              ea={ea}
              rank={idx}
              isSelected={selectedNhId === ea.agent.nh_id}
              isConnSource={connSource?.nh_id === ea.agent.nh_id}
              isDragSource={dragSourceNhId === ea.agent.nh_id}
              connMode={connMode}
              onClick={() => onAgentClick(ea.agent)}
              onDragStart={(e) => onDragStart(e, ea.agent, ea.rank)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── AgentRow ─────────────────────────────────────────────────────────────────

function AgentRow({
  ea,
  rank: _rank,
  isSelected,
  isConnSource,
  isDragSource,
  connMode,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  ea: EffectiveAgent;
  rank: number;
  isSelected: boolean;
  isConnSource: boolean;
  isDragSource: boolean;
  connMode: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const { agent, isDraft, connectionCount } = ea;

  let rowClass =
    "w-full text-left rounded px-2 py-1.5 text-xs select-none transition-colors ";

  if (connMode) {
    rowClass += "cursor-crosshair ";
  } else {
    rowClass += "cursor-grab active:cursor-grabbing ";
  }

  if (isDragSource) {
    rowClass += "opacity-30 border border-dashed border-gray-600";
  } else if (isConnSource) {
    rowClass += "border border-teal-600 bg-teal-900/30 text-teal-100";
  } else if (isSelected) {
    rowClass += "border border-sky-700/50 bg-sky-900/30 text-sky-100";
  } else if (isDraft) {
    rowClass += "border border-amber-800/60 bg-amber-950/30 text-amber-100";
  } else {
    rowClass +=
      "border border-transparent text-gray-300 hover:border-gray-700 hover:bg-zinc-800";
  }

  return (
    <div
      draggable={!connMode}
      onDragStart={connMode ? undefined : onDragStart}
      onDragEnd={connMode ? undefined : onDragEnd}
      onClick={onClick}
      className={rowClass}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate">{agent.label}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {connectionCount > 0 && (
            <span className="inline-flex items-center rounded bg-teal-900/50 px-1 py-0.5 text-[9px] text-teal-300">
              {connectionCount}⟷
            </span>
          )}
          {isDraft && (
            <span className="inline-flex items-center rounded bg-amber-900/50 px-1 py-0.5 text-[9px] text-amber-300">
              draft
            </span>
          )}
          <span className="font-mono text-[10px] text-gray-500">
            {agent.nh_id}
          </span>
        </div>
      </div>
      <div className="mt-0.5 text-[10px] text-gray-600">Tier {agent.tier}</div>
    </div>
  );
}

// ── DraggableGovernanceChip ──────────────────────────────────────────────────

function DraggableGovernanceChip({
  ea,
  rank: _rank,
  connMode,
  connSource,
  isSelected,
  isSource,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  ea: EffectiveAgent;
  rank: number;
  connMode: boolean;
  connSource: AgencyAgent | null;
  isSelected: boolean;
  isSource: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const { agent, isDraft, connectionCount } = ea;
  const isConnSource = connSource?.nh_id === agent.nh_id;

  return (
    <div
      draggable={!connMode}
      onDragStart={connMode ? undefined : onDragStart}
      onDragEnd={connMode ? undefined : onDragEnd}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] select-none transition-colors ${
        connMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
      } ${
        isSource
          ? "opacity-30 border-dashed border-gray-600"
          : isConnSource
            ? "border-teal-600 bg-teal-900/30 text-teal-200"
            : isSelected
              ? "border-sky-600 bg-sky-900/30 text-sky-200"
              : isDraft
                ? "border-amber-700/60 bg-amber-950/30 text-amber-200"
                : "border-gray-700 bg-zinc-900 text-gray-300 hover:border-gray-600 hover:bg-zinc-800"
      }`}
    >
      <span className="font-mono text-[10px] text-gray-500">{agent.nh_id}</span>
      <span>{agent.label}</span>
      {connectionCount > 0 && (
        <span className="inline-flex items-center rounded bg-teal-900/50 px-1 py-0.5 text-[9px] text-teal-300">
          {connectionCount}⟷
        </span>
      )}
      {isDraft && (
        <span className="inline-flex items-center rounded bg-amber-900/50 px-1 py-0.5 text-[9px] text-amber-300">
          draft
        </span>
      )}
    </div>
  );
}

// ── PropertyPanel ────────────────────────────────────────────────────────────

function PropertyPanel({
  agent,
  isDraft,
  connectionCount,
  onClose,
}: {
  agent: AgencyAgent;
  isDraft: boolean;
  connectionCount: number;
  onClose: () => void;
}) {
  const v2 = asV2(agent);
  const caps = Array.isArray(v2.capabilities) ? v2.capabilities : [];
  const constraints = v2.constraints ?? null;

  return (
    <div
      className={`rounded-lg border bg-zinc-950 ${
        isDraft ? "border-amber-800/60" : "border-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2 px-4 py-3 border-b border-gray-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-sm font-medium text-gray-100 truncate">
              {agent.label}
            </div>
            {isDraft && (
              <span className="inline-flex items-center rounded bg-amber-900/50 px-1.5 py-0.5 text-[9px] text-amber-300 flex-shrink-0">
                draft position
              </span>
            )}
            {connectionCount > 0 && (
              <span className="inline-flex items-center rounded bg-teal-900/50 px-1.5 py-0.5 text-[9px] text-teal-300 flex-shrink-0">
                {connectionCount} connection{connectionCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="text-[11px] font-mono text-gray-500">{agent.nh_id}</div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 mt-0.5 text-gray-600 hover:text-gray-300 text-lg leading-none"
          aria-label="Close property panel"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs">
        <PropRow label="Tier">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
              agent.tier === 0
                ? "bg-emerald-900/60 text-emerald-200"
                : agent.tier === 1
                  ? "bg-sky-900/60 text-sky-200"
                  : "bg-purple-900/60 text-purple-200"
            }`}
          >
            Tier {agent.tier}
          </span>
        </PropRow>

        <PropRow label="Role">
          <span className="text-gray-300 leading-snug">{agent.role || "—"}</span>
        </PropRow>

        <PropRow label="Execution roles">
          {agent.execution_roles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {agent.execution_roles.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center rounded border border-gray-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-gray-300"
                >
                  {r}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </PropRow>

        <PropRow label="Capabilities">
          {caps.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {caps.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded border border-gray-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-gray-300"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </PropRow>

        {constraints && (
          <PropRow label="Constraints">
            <div className="space-y-0.5 font-mono text-[10px] text-gray-400">
              {typeof constraints.canEditCode === "boolean" && (
                <div>edit: {constraints.canEditCode ? "✓" : "—"}</div>
              )}
              {typeof constraints.canRunCommands === "boolean" && (
                <div>run: {constraints.canRunCommands ? "✓" : "—"}</div>
              )}
              {typeof constraints.canWriteDocs === "boolean" && (
                <div>docs: {constraints.canWriteDocs ? "✓" : "—"}</div>
              )}
              {typeof constraints.requiresEvidence === "boolean" && (
                <div>evidence: {constraints.requiresEvidence ? "✓" : "—"}</div>
              )}
            </div>
          </PropRow>
        )}

        <PropRow label="Scope">
          {agent.scope.length > 0 ? (
            <div className="space-y-0.5">
              {agent.scope.map((s) => (
                <div key={s} className="text-gray-400">
                  {s}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </PropRow>

        {agent.delegates_to.length > 0 && (
          <PropRow label="Delegates to">
            <div className="space-y-0.5">
              {agent.delegates_to.map((d) => (
                <div key={d} className="font-mono text-[10px] text-gray-400">
                  {d}
                </div>
              ))}
            </div>
          </PropRow>
        )}

        {agent.governance_only && (
          <div className="rounded border border-gray-700 bg-zinc-800 px-2 py-1 text-[10px] text-gray-400">
            governance only — not execution-capable
          </div>
        )}
      </div>
    </div>
  );
}

// ── EmptyPanel ───────────────────────────────────────────────────────────────

function EmptyPanel({ isDragging }: { isDragging: boolean }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-zinc-950 p-6 text-center">
      <p className="text-xs text-gray-600 mb-1">
        {isDragging ? "Drop to reassign zone" : "No agent selected"}
      </p>
      <p className="text-[11px] text-gray-700">
        {isDragging
          ? "Release over any zone to stage the move."
          : "Click to view properties. Drag to stage a zone reassignment. Use Draw Connection to stage connections."}
      </p>
    </div>
  );
}

// ── DraftBanner ──────────────────────────────────────────────────────────────

function DraftBanner({
  positionChanges,
  connectionChanges,
  onPropose,
  onDiscard,
}: {
  positionChanges: number;
  connectionChanges: number;
  onPropose: () => void;
  onDiscard: () => void;
}) {
  const parts: string[] = [];
  if (positionChanges > 0)
    parts.push(
      `${positionChanges} position${positionChanges !== 1 ? "s" : ""}`,
    );
  if (connectionChanges > 0)
    parts.push(
      `${connectionChanges} connection${connectionChanges !== 1 ? "s" : ""}`,
    );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-800/50 bg-amber-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-sm text-amber-200">
            {parts.join(" · ")} staged · not written
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPropose}
            className="rounded-md border border-amber-600/70 bg-amber-900/60 px-3 py-1.5 text-xs text-amber-100 hover:bg-amber-800/80 transition-colors"
          >
            Propose Changes
          </button>
          <button
            onClick={onDiscard}
            className="rounded-md border border-amber-700/60 bg-transparent px-3 py-1.5 text-xs text-amber-400 hover:text-amber-200 hover:border-amber-600 transition-colors"
          >
            Discard Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MotionDraftModal ──────────────────────────────────────────────────────────
//
// Displays the full motion-draft scaffold as four named, copyable sections.
// No file writes — all output is copy-only. Closing does not clear draft state.
//
// Sections: motion.yaml · proposal.md · execution.md · challenge.md
// Each section has a filename label, scrollable pre block, and per-section copy button.

const SCAFFOLD_TABS = [
  { key: "motionYaml",  label: "motion.yaml"  },
  { key: "proposalMd",  label: "proposal.md"  },
  { key: "executionMd", label: "execution.md" },
  { key: "challengeMd", label: "challenge.md" },
] as const;

type ScaffoldTabKey = typeof SCAFFOLD_TABS[number]["key"];

function MotionDraftModal({
  scaffold,
  onClose,
}: {
  scaffold: MotionDraftScaffold;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ScaffoldTabKey>("motionYaml");
  const [copiedTab, setCopiedTab] = useState<ScaffoldTabKey | null>(null);

  const activeContent = scaffold[activeTab];

  function handleCopy() {
    navigator.clipboard.writeText(activeContent).then(() => {
      setCopiedTab(activeTab);
      setTimeout(() => setCopiedTab(null), 2000);
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl rounded-xl border border-amber-800/50 bg-zinc-950 flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-800">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-amber-200">
                Motion Draft Package
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                {scaffold.changesSummary.derivedTitle}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-600 hover:text-gray-300 text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Placeholder warning */}
          <div className="mt-2 rounded border border-amber-700/50 bg-amber-950/40 px-3 py-1.5 text-[11px] text-amber-300">
            Replace <span className="font-mono">motion-XXXX</span> with the next
            available motion ID before committing. No files have been written.
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {SCAFFOLD_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-md px-3 py-1 text-[11px] font-mono transition-colors ${
                  activeTab === tab.key
                    ? "bg-amber-900/50 text-amber-200 border border-amber-700/60"
                    : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1 p-4">
          <pre className="text-[11px] font-mono text-gray-300 whitespace-pre leading-relaxed">
            {activeContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 flex-shrink-0">
          <span className="text-[11px] text-gray-600 font-mono">
            .nexus/motions/motion-XXXX/{SCAFFOLD_TABS.find((t) => t.key === activeTab)?.label}
          </span>
          <button
            onClick={handleCopy}
            className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
              copiedTab === activeTab
                ? "border-emerald-700 bg-emerald-900/40 text-emerald-200"
                : "border-gray-700 bg-zinc-800 text-gray-300 hover:border-gray-600 hover:bg-zinc-700"
            }`}
          >
            {copiedTab === activeTab
              ? "Copied ✓"
              : `Copy ${SCAFFOLD_TABS.find((t) => t.key === activeTab)?.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PropRow helper ───────────────────────────────────────────────────────────

function PropRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-gray-600">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
