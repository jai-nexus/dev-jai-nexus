"use client";

// portal/src/app/operator/grid/GridView.tsx
//
// Client component for Grid Configuration Mode (motion-0129).
// Slice 2 additions: staged draft state, bounded drag/reposition, DraftBanner, Discard.
//
// Drag model: HTML5 drag-and-drop. Zone cards are drop targets.
//   - Dropping an agent onto a different zone stages a MOVE in GridDraftState.
//   - The "snap grid" is the zone layout itself — agents snap to zones.
//   - Same-zone drops are no-ops (no meaningless self-moves).
//   - Nothing is written to any file. Canonical config is never mutated.

import { useReducer, useState, useCallback } from "react";
import type { GridConfig, AgencyAgent, ExecutionRole } from "@/lib/grid/gridConfig";
import {
  draftReducer,
  EMPTY_DRAFT,
  applyDraftToLayout,
  type ZoneId,
  type EffectiveAgent,
  type EffectiveZone,
} from "@/lib/grid/gridDraft";

// ── V2 extended shape (same pattern as agents/page.tsx) ──────────────────────

type AgentV2Shape = {
  type?: string;
  capabilities?: string[];
  constraints?: {
    canEditCode?: boolean;
    canRunCommands?: boolean;
    canWriteDocs?: boolean;
    requiresEvidence?: boolean;
  };
  scopeMode?: string;
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
  const [dragSourceNhId, setDragSourceNhId] = useState<string | null>(null);
  const [dragTargetZone, setDragTargetZone] = useState<ZoneId | null>(null);

  const layout = applyDraftToLayout(config, draft);
  const hasDraft = draft.changes.length > 0;

  const handleSelectAgent = useCallback(
    (agent: AgencyAgent) => {
      setSelectedAgent((prev) =>
        prev?.nh_id === agent.nh_id ? null : agent,
      );
    },
    [],
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────

  function handleDragStart(
    e: React.DragEvent,
    agent: AgencyAgent,
    fromZone: ZoneId,
    fromRank: number,
  ) {
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

    // toRank: append to end of target zone.
    // If agent was already in the target zone, count excludes itself.
    const agentsInTarget = targetZone === fromZone ? currentAgentCount - 1 : currentAgentCount;
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

  // ── Zone grouping ──────────────────────────────────────────────────────────

  const executionLane = layout.zones.filter((z) =>
    (["ARCHITECT", "BUILDER", "VERIFIER"] as ExecutionRole[]).includes(z.role),
  );
  const supportRoles = layout.zones.filter((z) =>
    (["OPERATOR", "LIBRARIAN"] as ExecutionRole[]).includes(z.role),
  );

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8 pb-24">

      {/* ── Header ── */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-semibold">JAI NEXUS · Grid</h1>
          <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] uppercase tracking-wide text-gray-400">
            Configuration Mode
          </span>
          {hasDraft ? (
            <span className="inline-flex items-center rounded-full border border-amber-700/60 bg-amber-900/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-400">
              Draft · {draft.changes.length} pending
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-emerald-800/50 bg-emerald-900/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-400">
              Canonical · v0
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {hasDraft
            ? "Staged changes are client-only — nothing has been written."
            : "Canonical execution-role topology derived from agency config. Drag agents between zones to stage changes."}
        </p>
      </header>

      {/* ── Main: zones left, property panel right ── */}
      <div className="flex gap-6 items-start">

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
                  dragSourceNhId={dragSourceNhId}
                  isDragTarget={dragTargetZone === zone.role}
                  onSelectAgent={handleSelectAgent}
                  onDragStart={(e, agent, rank) =>
                    handleDragStart(e, agent, zone.role, rank)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverZone(e, zone.role)}
                  onDragLeave={handleDragLeaveZone}
                  onDrop={(e) => handleDropOnZone(e, zone.role, zone.agents.length)}
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
                  dragSourceNhId={dragSourceNhId}
                  isDragTarget={dragTargetZone === zone.role}
                  onSelectAgent={handleSelectAgent}
                  onDragStart={(e, agent, rank) =>
                    handleDragStart(e, agent, zone.role, rank)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverZone(e, zone.role)}
                  onDragLeave={handleDragLeaveZone}
                  onDrop={(e) => handleDropOnZone(e, zone.role, zone.agents.length)}
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
                        isSource={dragSourceNhId === ea.agent.nh_id}
                        isSelected={selectedAgent?.nh_id === ea.agent.nh_id}
                        onSelect={() => handleSelectAgent(ea.agent)}
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
        </div>

        {/* ── Property panel ── */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6">
            {selectedAgent ? (
              <PropertyPanel
                agent={selectedAgent}
                isDraft={Boolean(draft.overrides[selectedAgent.nh_id])}
                onClose={() => setSelectedAgent(null)}
              />
            ) : (
              <EmptyPanel isDragging={dragSourceNhId !== null} />
            )}
          </div>
        </div>

      </div>

      {/* ── Draft banner (sticky bottom, only when changes exist) ── */}
      {hasDraft && (
        <DraftBanner
          changeCount={draft.changes.length}
          onDiscard={() => {
            dispatchDraft({ type: "DISCARD" });
            setSelectedAgent(null);
          }}
        />
      )}
    </main>
  );
}

// ── ZoneCard ─────────────────────────────────────────────────────────────────

function ZoneCard({
  zone,
  selectedNhId,
  dragSourceNhId,
  isDragTarget,
  onSelectAgent,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  zone: EffectiveZone;
  selectedNhId: string | null;
  dragSourceNhId: string | null;
  isDragTarget: boolean;
  onSelectAgent: (agent: AgencyAgent) => void;
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
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Zone header */}
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

      {/* Agent list */}
      <div className="p-2 space-y-1 min-h-[3rem]">
        {zone.agents.length === 0 ? (
          <p className="text-[11px] text-gray-700 px-1 py-2 text-center">
            {isDragTarget ? "Drop here" : "No agents"}
          </p>
        ) : (
          zone.agents.map((ea, idx) => (
            <DraggableAgentRow
              key={ea.agent.nh_id}
              ea={ea}
              rank={idx}
              isSelected={selectedNhId === ea.agent.nh_id}
              isSource={dragSourceNhId === ea.agent.nh_id}
              onSelect={() => onSelectAgent(ea.agent)}
              onDragStart={(e) => onDragStart(e, ea.agent, ea.rank)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── DraggableAgentRow ────────────────────────────────────────────────────────

function DraggableAgentRow({
  ea,
  rank: _rank,
  isSelected,
  isSource,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  ea: EffectiveAgent;
  rank: number;
  isSelected: boolean;
  isSource: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const { agent, isDraft } = ea;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`w-full text-left rounded px-2 py-1.5 text-xs cursor-grab active:cursor-grabbing transition-opacity select-none ${
        isSource
          ? "opacity-30 border border-dashed border-gray-600"
          : isSelected
            ? "border border-sky-700/50 bg-sky-900/30 text-sky-100"
            : isDraft
              ? "border border-amber-800/60 bg-amber-950/30 text-amber-100"
              : "border border-transparent text-gray-300 hover:border-gray-700 hover:bg-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate">{agent.label}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
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
  isSource,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  ea: EffectiveAgent;
  rank: number;
  isSource: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const { agent, isDraft } = ea;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] cursor-grab active:cursor-grabbing select-none transition-opacity ${
        isSource
          ? "opacity-30 border-dashed border-gray-600"
          : isSelected
            ? "border-sky-600 bg-sky-900/30 text-sky-200"
            : isDraft
              ? "border-amber-700/60 bg-amber-950/30 text-amber-200"
              : "border-gray-700 bg-zinc-900 text-gray-300 hover:border-gray-600 hover:bg-zinc-800"
      }`}
    >
      <span className="font-mono text-[10px] text-gray-500">{agent.nh_id}</span>
      <span>{agent.label}</span>
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
  onClose,
}: {
  agent: AgencyAgent;
  isDraft: boolean;
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
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-100 truncate">
              {agent.label}
            </div>
            {isDraft && (
              <span className="inline-flex items-center rounded bg-amber-900/50 px-1.5 py-0.5 text-[9px] text-amber-300 flex-shrink-0">
                draft position
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
          : "Click to view properties. Drag to stage a zone reassignment."}
      </p>
    </div>
  );
}

// ── DraftBanner ──────────────────────────────────────────────────────────────

function DraftBanner({
  changeCount,
  onDiscard,
}: {
  changeCount: number;
  onDiscard: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-800/50 bg-amber-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-sm text-amber-200">
            {changeCount} staged change{changeCount !== 1 ? "s" : ""} · not written
          </span>
          <span className="text-[11px] text-amber-600">
            Propose Changes available in a later slice
          </span>
        </div>
        <button
          onClick={onDiscard}
          className="rounded-md border border-amber-700/60 bg-amber-900/40 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-900/70 transition-colors"
        >
          Discard Draft
        </button>
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
