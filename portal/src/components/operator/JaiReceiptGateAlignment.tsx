"use client";

import Link from "next/link";

import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
} from "@/components/operator/slate";

const dependencyRows = [
  {
    id: "SYN-ALIGN-DEP-0001",
    name: "JAI_CORE_OBJECT_MODEL_V0",
    posture: "Object model dependency, not landed authority.",
    needs: ["NEEDS .jai PROFILE", "NEEDS ROUTE DECISION"],
    blocked: "No active object-model semantics, parser/runtime behavior, or profile validation.",
    nextRoute: "/operator/jai",
  },
  {
    id: "SYN-ALIGN-DEP-0002",
    name: "receipt/v0",
    posture: "Receipt model prerequisite.",
    needs: ["NEEDS RECEIPT/V0", "NEEDS SECURITY GATE"],
    blocked: "No receipt creation, receipt synthesis, receipt storage, or canon update.",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-ALIGN-DEP-0003",
    name: "project-state/v0",
    posture: "Project state source dependency.",
    needs: ["NEEDS .jai PROFILE", "NEEDS RECEIPT/V0"],
    blocked: "No project-state mutation or live project verification.",
    nextRoute: "/operator/portfolio-status",
  },
  {
    id: "SYN-ALIGN-DEP-0004",
    name: "repo-lane/v0",
    posture: "Repo lane authority dependency.",
    needs: ["NEEDS SECURITY GATE", "NEEDS RECEIPT/V0"],
    blocked: "No repo write, file mutation, GitHub API, branch creation, or PR creation.",
    nextRoute: "/operator/work",
  },
  {
    id: "SYN-ALIGN-DEP-0005",
    name: "route/v0",
    posture: "Route topology decision dependency.",
    needs: ["NEEDS ROUTE DECISION", "NEEDS RECEIPT/V0"],
    blocked: "No route promotion, destructive redirect, route-state mutation, or navigation redesign.",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-ALIGN-DEP-0006",
    name: "council-return/v0",
    posture: "Council advisory return dependency.",
    needs: ["NEEDS .jai PROFILE", "NEEDS RECEIPT/V0"],
    blocked: "No Council dispatch, automatic synthesis, output-to-canon, or acceptance.",
    nextRoute: "/operator/jai",
  },
  {
    id: "SYN-ALIGN-DEP-0007",
    name: "agent-lane-candidate/v0",
    posture: "Agent lane candidate dependency.",
    needs: ["NEEDS .jai PROFILE", "NEEDS EXECUTION GATE"],
    blocked: "No Agent execution, runner, tool invocation, scheduler, autonomous loop, or dispatch.",
    nextRoute: "/operator/agents",
  },
  {
    id: "SYN-ALIGN-DEP-0008",
    name: "dashboard-state-index/v0",
    posture: "Dashboard state index dependency.",
    needs: ["NEEDS ROUTE DECISION", "NEEDS SECURITY GATE"],
    blocked: "No dashboard-state mutation, gate evaluation, live verification, or activation.",
    nextRoute: "/operator/grid",
  },
  {
    id: "SYN-ALIGN-DEP-0009",
    name: "security gate dependency",
    posture: "Step-up and authority model prerequisite.",
    needs: ["NEEDS SECURITY GATE", "NEEDS RECEIPT/V0"],
    blocked: "Authentication and step-up do not open execution gates.",
    nextRoute: "/operator/control-plane",
  },
  {
    id: "SYN-ALIGN-DEP-0010",
    name: "execution gate dependency",
    posture: "Execution authority prerequisite.",
    needs: ["NEEDS EXECUTION GATE", "NEEDS RECEIPT/V0"],
    blocked: "No execution gates opened; no provider, model, Agent, repo, route, or motion execution.",
    nextRoute: "/operator/live-dashboard",
  },
];

const blockerCards = [
  {
    id: "SYN-ALIGN-BLOCK-0001",
    label: ".jai parser/runtime",
    detail: "Dependency labels do not implement profiles, parsers, runtimes, or .jai execution behavior.",
  },
  {
    id: "SYN-ALIGN-BLOCK-0002",
    label: "Receipts and canon",
    detail: "Receipt/v0 is a prerequisite label only; no receipt creation or canon update occurs.",
  },
  {
    id: "SYN-ALIGN-BLOCK-0003",
    label: "Gates",
    detail: "Security and execution gate labels are prerequisites only; no gate evaluation or gate opening occurs.",
  },
  {
    id: "SYN-ALIGN-BLOCK-0004",
    label: "Route / motion / dashboard state",
    detail: "State dependencies are read-only planning records and do not mutate route, motion, or dashboard state.",
  },
];

const planningLabels = [
  "NEEDS .jai PROFILE",
  "NEEDS RECEIPT/V0",
  "NEEDS SECURITY GATE",
  "NEEDS EXECUTION GATE",
  "NEEDS ROUTE DECISION",
  "PLANNING ONLY",
  "NO ACTIVATION",
];

const invariantLabels = [
  "CONTROL_THREAD decides.",
  "Validation is not acceptance.",
  "Receipts record; they do not decide.",
  "Routes recommend; they do not execute.",
  "Council agreement is not authority.",
  "Agents are staged, not executing.",
  "Dashboard display does not authorize.",
  "Read-only is not authority.",
  "No execution gates opened.",
  "ZERO GATES GRANTED.",
];

export function JaiReceiptGateAlignment({
  index = "ALIGN",
  compact = false,
}: {
  index?: string;
  compact?: boolean;
}) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title=".jai / Receipt / Gate Alignment Planning"
        right={
          <>
            <OperatorBadge tone="fixture">SYN-* FIXTURE</OperatorBadge>
            <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NO ACTIVATION</OperatorBadge>
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / alignment planning / Commit 7
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Alignment planning shows unresolved `.jai`, receipt, gate, and
              object-model dependencies. These labels are planning records only:
              no parser/runtime, profile validation, receipt creation, canon
              update, gate evaluation, route-state mutation, motion-state
              mutation, or execution is added here.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {planningLabels.map((label) => (
                <OperatorBadge
                  key={label}
                  tone={label === "PLANNING ONLY" ? "advisory" : "blocked"}
                >
                  {label}
                </OperatorBadge>
              ))}
            </div>
          </div>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Read-only dependency rail
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Dependency labels are prerequisites for later doctrine work. They
              do not validate profiles, open gates, write receipts, update canon,
              or mutate route, motion, dashboard, repo, or Agent state.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorReadOnlyAction>Dependency matrix</OperatorReadOnlyAction>
              <OperatorBlockedAction>Evaluate gate</OperatorBlockedAction>
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {dependencyRows.map((row) => (
            <OperatorGateCard key={row.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">
                    {row.name}
                  </div>
                  <div className="mt-1">
                    <OperatorIdChip>{row.id}</OperatorIdChip>
                  </div>
                </div>
                <OperatorBadge tone="gated">PLANNING ONLY</OperatorBadge>
              </div>
              <p className="mt-3 text-xs text-slate-400">{row.posture}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {row.needs.map((need) => (
                  <OperatorBadge key={`${row.id}-${need}`} tone="blocked">
                    {need}
                  </OperatorBadge>
                ))}
              </div>
              <p className="mt-3 text-xs text-red-200">{row.blocked}</p>
              <Link
                href={row.nextRoute}
                className="mt-3 inline-flex text-xs text-sky-300 underline"
              >
                Read-only next route
              </Link>
            </OperatorGateCard>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {blockerCards.map((card) => (
            <OperatorGateCard key={card.id}>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorIdChip>{card.id}</OperatorIdChip>
                <OperatorBadge tone="blocked">BLOCKED</OperatorBadge>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-100">
                {card.label}
              </div>
              <p className="mt-2 text-xs text-slate-400">{card.detail}</p>
            </OperatorGateCard>
          ))}
        </div>

        <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className="rounded border border-red-900 bg-red-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-red-300">
              Blocked alignment behavior
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Parser/runtime",
                ".jai execution",
                "Automatic profile validation",
                "Receipt creation",
                "Canon update",
                "Gate evaluation",
                "Policy enforcement",
                "Route-state mutation",
                "Motion-state mutation",
              ].map((blocked) => (
                <OperatorBadge key={blocked} tone="blocked">
                  {blocked}
                </OperatorBadge>
              ))}
            </div>
          </div>

          <div className="rounded border border-amber-900 bg-amber-950/20 p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-300">
              Required boundaries
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {invariantLabels.map((label) => (
                <OperatorBadge key={label} tone="blocked">
                  {label}
                </OperatorBadge>
              ))}
            </div>
          </div>
        </div>
      </OperatorPanel>
    </section>
  );
}
