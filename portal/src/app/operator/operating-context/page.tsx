export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { getVersionedOperatingContextFixture } from "@/lib/operatingContext/versionedOperatingContextFixture";
import type {
  OperatingContextAgentLaneDefault,
  OperatingContextCouncilDefault,
  OperatingContextDashboardModule,
  OperatingContextEvidenceStandard,
  OperatingContextKeyValue,
  OperatingContextProtectedSetting,
  OperatingContextSnapshotRef,
} from "@/lib/operatingContext/versionedOperatingContextTypes";

const FALLBACK_TEXT = "Not recorded in the checked-in fixture.";

function safeText(value: string | undefined, fallback = FALLBACK_TEXT) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function safeArray<T>(items: T[] | undefined) {
  return Array.isArray(items) ? items : [];
}

function Section({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index={index}
        title={title}
        right={<OperatorBadge tone="fixture">CHECKED-IN FIXTURE</OperatorBadge>}
      />
      <p className="text-sm text-slate-400">{description}</p>
      {children}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <OperatorGateCard className="text-sm text-slate-500">
      No {label} recorded in the checked-in fixture.
    </OperatorGateCard>
  );
}

function TextList({ items, label }: { items?: string[]; label: string }) {
  const safeItems = safeArray(items).filter((item) => item.trim().length > 0);

  if (safeItems.length === 0) {
    return <EmptyState label={label} />;
  }

  return (
    <ul className="space-y-1 text-sm text-slate-300">
      {safeItems.map((item, index) => (
        <li key={`${label}-${index}`}>- {item}</li>
      ))}
    </ul>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <OperatorPanel>
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorBadge tone="fixture">FIXTURE</OperatorBadge>
      </div>
      <div className="mt-2 break-words text-2xl font-semibold text-slate-100">
        {value}
      </div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

function KeyValueCard({ item }: { item: OperatingContextKeyValue }) {
  return (
    <OperatorGateCard>
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {safeText(item.label, "item")}
      </div>
      <div className="mt-2 break-words text-lg font-semibold text-slate-100">
        {safeText(item.value, "none")}
      </div>
      <p className="mt-2 text-xs text-slate-400">{safeText(item.detail)}</p>
    </OperatorGateCard>
  );
}

function DashboardModuleCard({ module }: { module: OperatingContextDashboardModule }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{safeText(module.label)}</h3>
        <OperatorStatusChip status={safeText(module.status, "unknown")} tone="fixture" />
        <OperatorBadge tone="fixture">CONFIGURATION ONLY</OperatorBadge>
      </div>
      <div className="mt-2">
        <OperatorIdChip>{safeText(module.module_id)}</OperatorIdChip>
      </div>
      <p className="mt-3 text-sm text-slate-300">{safeText(module.summary)}</p>
    </OperatorGateCard>
  );
}

function CouncilDefaultCard({ councilDefault }: { councilDefault: OperatingContextCouncilDefault }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-100">
          {safeText(councilDefault.label)}
        </h3>
        <OperatorStatusChip
          status={safeText(councilDefault.posture, "advisory")}
          tone="advisory"
        />
        <OperatorBadge tone="advisory">REPRESENTATIONAL ONLY</OperatorBadge>
      </div>
      <div className="mt-2">
        <OperatorIdChip>{safeText(councilDefault.council_id)}</OperatorIdChip>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {safeText(councilDefault.advisory_note)}
      </p>
    </OperatorGateCard>
  );
}

function AgentLaneDefaultCard({ lane }: { lane: OperatingContextAgentLaneDefault }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{safeText(lane.label)}</h3>
        <OperatorStatusChip
          status={safeText(lane.default_status, "representational")}
          tone="readOnly"
        />
        <OperatorBadge tone="blocked">NON-EXECUTABLE</OperatorBadge>
      </div>
      <div className="mt-2">
        <OperatorIdChip>{safeText(lane.lane_id)}</OperatorIdChip>
      </div>
      <p className="mt-3 text-sm text-slate-300">{safeText(lane.summary)}</p>
      <p className="mt-2 text-xs text-slate-400">{safeText(lane.non_executable_note)}</p>
    </OperatorGateCard>
  );
}

function EvidenceStandardCard({ standard }: { standard: OperatingContextEvidenceStandard }) {
  return (
    <OperatorGateCard>
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {safeText(standard.label, "evidence standard")}
      </div>
      <div className="mt-2">
        <OperatorIdChip>{safeText(standard.standard_id)}</OperatorIdChip>
      </div>
      <p className="mt-3 text-sm text-slate-300">{safeText(standard.requirement)}</p>
    </OperatorGateCard>
  );
}

function ProtectedSettingCard({ setting }: { setting: OperatingContextProtectedSetting }) {
  return (
    <OperatorContradictionCard>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-red-100">{safeText(setting.label)}</h3>
        <OperatorBadge tone="blocked">PROTECTED GOVERNANCE CONSTRAINT</OperatorBadge>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <OperatorIdChip>{safeText(setting.setting_id)}</OperatorIdChip>
        <OperatorStatusChip status={safeText(setting.value, "blocked")} tone="blocked" />
      </div>
      <p className="mt-3 text-sm text-red-100">{safeText(setting.reason)}</p>
    </OperatorContradictionCard>
  );
}

function SnapshotCard({
  title,
  snapshot,
}: {
  title: string;
  snapshot: OperatingContextSnapshotRef;
}) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <OperatorBadge tone="fixture">REPRESENTATIONAL ONLY</OperatorBadge>
      </div>
      <div className="mt-2">
        <OperatorIdChip>{safeText(snapshot.ref_id)}</OperatorIdChip>
      </div>
      <div className="mt-2 text-sm font-medium text-slate-200">
        {safeText(snapshot.label)}
      </div>
      <p className="mt-2 text-sm text-slate-400">{safeText(snapshot.summary)}</p>
    </OperatorGateCard>
  );
}

export default function OperatingContextPage() {
  const fixture = getVersionedOperatingContextFixture();
  const context = fixture.context;

  return (
    <main className="min-h-screen bg-slate-950 px-8 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">
                {safeText(context.display_name)}
              </h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="fixture">LOCAL STATIC FIXTURE</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NON-LIVE</OperatorBadge>
              <OperatorBadge tone="blocked">NON-MUTATING</OperatorBadge>
              <OperatorBadge tone="advisory">
                NON-CANONICAL UNLESS ACCEPTED
              </OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-5xl text-sm text-slate-400">
              Static Operator Control Plane viewer for Versioned Operating Context.
              The context is displayed from checked-in fixture data and cannot
              edit settings, execute routes, or persist changes.
            </p>
            <OperatorGateCard className="mt-4 text-sm text-slate-200">
              {safeText(fixture.authority_boundary_label)}
            </OperatorGateCard>
            <OperatorGateCard className="mt-3 border-amber-800 text-sm text-amber-100">
              {safeText(fixture.status_note)}
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Edit context</OperatorBlockedAction>
              <OperatorBlockedAction>Run route</OperatorBlockedAction>
              <OperatorBlockedAction>Execute rollback</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Context display is not live settings state. Protected constraints
              cannot be removed from this viewer.
            </p>
          </OperatorSafetyRail>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Context id"
            value={safeText(context.current_context_id, "unknown")}
            detail={safeText(fixture.generated_label)}
          />
          <SummaryCard
            label="Object id"
            value={safeText(context.object_id, "unknown")}
            detail="Versioned Operating Context object shown as local fixture data."
          />
          <SummaryCard
            label="Scope"
            value={safeText(context.scope, "unknown")}
            detail="Allowed scope vocabulary: account, workspace, project."
          />
          <SummaryCard
            label="Version"
            value={safeText(context.version, "unknown")}
            detail="Static fixture version; not live configuration state."
          />
          <SummaryCard
            label="Status"
            value={safeText(context.status, "unknown")}
            detail="Display status only; not a runtime lifecycle."
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Objective
            </div>
            <p className="mt-3 text-sm text-slate-300">{safeText(context.objective)}</p>
          </OperatorPanel>
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Identity
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <OperatorIdChip>{safeText(context.nhid)}</OperatorIdChip>
              <OperatorIdChip>{safeText(context.current_context_id)}</OperatorIdChip>
              <OperatorIdChip>{safeText(context.object_id)}</OperatorIdChip>
            </div>
          </OperatorPanel>
        </section>

        <Section
          index="01"
          title="Active Configuration"
          description="Configuration fields are displayed as checked-in fixture data only; no live settings storage exists."
        >
          {safeArray(context.active_configuration).length === 0 ? (
            <EmptyState label="active configuration" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {safeArray(context.active_configuration).map((item) => (
                <KeyValueCard key={item.label} item={item} />
              ))}
            </div>
          )}
        </Section>

        <Section
          index="02"
          title="Dashboard Modules"
          description="Modules are fixture-backed configuration only, not custom dashboard generation, route execution, or live module activation."
        >
          {safeArray(context.dashboard_modules).length === 0 ? (
            <EmptyState label="dashboard modules" />
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {safeArray(context.dashboard_modules).map((module) => (
                <DashboardModuleCard key={module.module_id} module={module} />
              ))}
            </div>
          )}
        </Section>

        <Section
          index="03"
          title="Custom Metrics"
          description="Metrics are static display fields and do not read telemetry, billing, customer, or production data."
        >
          {safeArray(context.custom_metrics).length === 0 ? (
            <EmptyState label="custom metrics" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {safeArray(context.custom_metrics).map((metric) => (
                <KeyValueCard key={metric.label} item={metric} />
              ))}
            </div>
          )}
        </Section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Section
            index="04A"
            title="Council Defaults"
            description="Council defaults are advisory and representational only; they cannot approve or route work."
          >
            {safeArray(context.council_defaults).length === 0 ? (
              <EmptyState label="Council defaults" />
            ) : (
              <div className="space-y-3">
                {safeArray(context.council_defaults).map((councilDefault) => (
                  <CouncilDefaultCard
                    key={councilDefault.council_id}
                    councilDefault={councilDefault}
                  />
                ))}
              </div>
            )}
          </Section>

          <Section
            index="04B"
            title="Agent Lane Defaults"
            description="Agent lane defaults are representational and non-executable; no Agent runtime is available here."
          >
            {safeArray(context.agent_lane_defaults).length === 0 ? (
              <EmptyState label="Agent lane defaults" />
            ) : (
              <div className="space-y-3">
                {safeArray(context.agent_lane_defaults).map((lane) => (
                  <AgentLaneDefaultCard key={lane.lane_id} lane={lane} />
                ))}
              </div>
            )}
          </Section>
        </section>

        <Section
          index="05"
          title="Evidence Standards"
          description="Evidence standards describe review expectations only; this viewer does not execute validation."
        >
          {safeArray(context.evidence_standards).length === 0 ? (
            <EmptyState label="evidence standards" />
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {safeArray(context.evidence_standards).map((standard) => (
                <EvidenceStandardCard key={standard.standard_id} standard={standard} />
              ))}
            </div>
          )}
        </Section>

        <Section
          index="06"
          title="Blocked Settings"
          description="Blocked settings are protected governance constraints, not editable user preferences."
        >
          {safeArray(context.blocked_settings).length === 0 ? (
            <EmptyState label="blocked settings" />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {safeArray(context.blocked_settings).map((setting) => (
                <ProtectedSettingCard key={setting.setting_id} setting={setting} />
              ))}
            </div>
          )}
        </Section>

        <Section
          index="07"
          title="Confirmation Requirements"
          description="Confirmation requirements are manual gates for future expansion; no controls are provided."
        >
          <TextList items={context.confirmation_requirements} label="confirmation requirements" />
        </Section>

        <section className="grid gap-4 xl:grid-cols-3">
          <SnapshotCard title="Last Snapshot" snapshot={context.last_snapshot} />
          <SnapshotCard title="Last Diff" snapshot={context.last_diff} />
          <SnapshotCard title="Last Receipt" snapshot={context.last_receipt} />
        </section>

        <OperatorContradictionCard>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-red-100">Authority Boundary</h2>
            <OperatorBadge tone="blocked">DISPLAY ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NON-MUTATING</OperatorBadge>
          </div>
          <p className="mt-3 text-sm text-red-100">
            {safeText(context.authority_boundary)}
          </p>
        </OperatorContradictionCard>

        <OperatorGateCard className="border-amber-900">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-amber-100">Rollback Posture</h2>
            <OperatorBadge tone="advisory">REPRESENTATIONAL ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NO ROLLBACK EXECUTION</OperatorBadge>
          </div>
          <p className="mt-3 text-sm text-amber-100">{safeText(context.rollback_posture)}</p>
        </OperatorGateCard>

        <OperatorPanel>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-slate-100">
              Explicit Non-Authorizations
            </h2>
            <OperatorBadge tone="blocked">NO LIVE BEHAVIOR</OperatorBadge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {safeArray(fixture.non_authorizations).length === 0 ? (
              <EmptyState label="non-authorizations" />
            ) : (
              safeArray(fixture.non_authorizations).map((item, index) => (
                <OperatorGateCard
                  key={`non-authorization-${index}`}
                  className="text-sm text-slate-300"
                >
                  {item}
                </OperatorGateCard>
              ))
            )}
          </div>
        </OperatorPanel>
      </div>
    </main>
  );
}
