"use client";

// portal/src/app/operator/grid/GridView.tsx
//
// Client component for Grid Configuration Mode (motion-0129).
// Renders canonical topology read from the server and manages agent selection state.
// No file writes. No canonical mutation. Draft/connection features deferred to later slices.

import { useState } from "react";
import type { GridConfig, GridZone, AgencyAgent, ExecutionRole } from "@/lib/grid/gridConfig";

// Extended v2 shape — same pattern as /operator/agents/page.tsx.
// Fields are optional; UI falls back safely if absent.
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

// ─── Zone color palette (mirrors agent type tones from agents/page.tsx) ─────

type ZoneColors = { header: string; border: string; badge: string };

const ZONE_COLORS: Record<ExecutionRole, ZoneColors> = {
  ARCHITECT: {
    header: "text-purple-300",
    border: "border-purple-900/50",
    badge: "bg-purple-900/50 text-purple-200",
  },
  BUILDER: {
    header: "text-amber-300",
    border: "border-amber-900/50",
    badge: "bg-amber-900/50 text-amber-200",
  },
  VERIFIER: {
    header: "text-slate-300",
    border: "border-slate-700/40",
    badge: "bg-slate-800/60 text-slate-300",
  },
  OPERATOR: {
    header: "text-sky-300",
    border: "border-sky-900/50",
    badge: "bg-sky-900/50 text-sky-200",
  },
  LIBRARIAN: {
    header: "text-teal-300",
    border: "border-teal-900/40",
    badge: "bg-teal-900/40 text-teal-200",
  },
};

// ─── Root view ────────────────────────────────────────────────────────────────

export function GridView({ config }: { config: GridConfig }) {
  const [selectedAgent, setSelectedAgent] = useState<AgencyAgent | null>(null);

  function handleSelectAgent(agent: AgencyAgent) {
    setSelectedAgent((prev) =>
      prev?.nh_id === agent.nh_id ? null : agent,
    );
  }

  const executionLane = config.zones.filter((z) =>
    (["ARCHITECT", "BUILDER", "VERIFIER"] as ExecutionRole[]).includes(z.role),
  );
  const supportRoles = config.zones.filter((z) =>
    (["OPERATOR", "LIBRARIAN"] as ExecutionRole[]).includes(z.role),
  );

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      {/* ── Header ── */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-semibold">JAI NEXUS · Grid</h1>
          <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] uppercase tracking-wide text-gray-400">
            Configuration Mode
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-800/50 bg-emerald-900/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-400">
            Read Only · v0
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Canonical execution-role topology derived from agency config. No edits are written in this view.
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
                  onSelectAgent={handleSelectAgent}
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
                  onSelectAgent={handleSelectAgent}
                />
              ))}
            </div>
          </div>

          {/* Governance-only agents */}
          {config.governanceAgents.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
                Governance only
              </p>
              <div className="rounded-lg border border-gray-800 bg-zinc-950 p-3">
                <div className="flex flex-wrap gap-2">
                  {config.governanceAgents.map((agent) => (
                    <button
                      key={agent.nh_id}
                      onClick={() => handleSelectAgent(agent)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition-colors ${
                        selectedAgent?.nh_id === agent.nh_id
                          ? "border-sky-600 bg-sky-900/30 text-sky-200"
                          : "border-gray-700 bg-zinc-900 text-gray-300 hover:border-gray-600 hover:bg-zinc-800"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-gray-500">
                        {agent.nh_id}
                      </span>
                      <span>{agent.label}</span>
                    </button>
                  ))}
                </div>
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
                onClose={() => setSelectedAgent(null)}
              />
            ) : (
              <EmptyPanel />
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

// ─── ZoneCard ────────────────────────────────────────────────────────────────

function ZoneCard({
  zone,
  selectedNhId,
  onSelectAgent,
}: {
  zone: GridZone;
  selectedNhId: string | null;
  onSelectAgent: (agent: AgencyAgent) => void;
}) {
  const colors = ZONE_COLORS[zone.role];

  return (
    <div className={`rounded-lg border bg-zinc-950 ${colors.border}`}>
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
            No agents
          </p>
        ) : (
          zone.agents.map((agent) => (
            <AgentRow
              key={agent.nh_id}
              agent={agent}
              selected={selectedNhId === agent.nh_id}
              onSelect={() => onSelectAgent(agent)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── AgentRow ────────────────────────────────────────────────────────────────

function AgentRow({
  agent,
  selected,
  onSelect,
}: {
  agent: AgencyAgent;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded px-2 py-1.5 text-xs transition-colors ${
        selected
          ? "border border-sky-700/50 bg-sky-900/30 text-sky-100"
          : "border border-transparent text-gray-300 hover:border-gray-700 hover:bg-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate">{agent.label}</span>
        <span className="font-mono text-[10px] text-gray-500 flex-shrink-0">
          {agent.nh_id}
        </span>
      </div>
      <div className="mt-0.5 text-[10px] text-gray-600">Tier {agent.tier}</div>
    </button>
  );
}

// ─── PropertyPanel ───────────────────────────────────────────────────────────

function PropertyPanel({
  agent,
  onClose,
}: {
  agent: AgencyAgent;
  onClose: () => void;
}) {
  const v2 = asV2(agent);
  const caps = Array.isArray(v2.capabilities) ? v2.capabilities : [];
  const constraints = v2.constraints ?? null;

  return (
    <div className="rounded-lg border border-gray-800 bg-zinc-950">
      {/* Panel header */}
      <div className="flex items-start justify-between gap-2 px-4 py-3 border-b border-gray-800">
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-100 truncate">
            {agent.label}
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

      {/* Properties */}
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

// ─── EmptyPanel ──────────────────────────────────────────────────────────────

function EmptyPanel() {
  return (
    <div className="rounded-lg border border-gray-800 bg-zinc-950 p-6 text-center">
      <p className="text-xs text-gray-600 mb-1">No agent selected</p>
      <p className="text-[11px] text-gray-700">
        Click any agent to view its canonical properties.
      </p>
    </div>
  );
}

// ─── PropRow helper ──────────────────────────────────────────────────────────

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
