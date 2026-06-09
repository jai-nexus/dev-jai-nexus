export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";

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

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-800 bg-sky-950 text-sky-200"
      : tone === "amber"
        ? "border-amber-800 bg-amber-950 text-amber-200"
        : tone === "emerald"
          ? "border-emerald-800 bg-emerald-950 text-emerald-200"
          : tone === "rose"
            ? "border-rose-800 bg-rose-950 text-rose-200"
            : "border-gray-800 bg-zinc-900 text-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-black/30 p-3 text-sm text-gray-500">
      No {label} recorded in the checked-in fixture.
    </div>
  );
}

function TextList({ items, label }: { items?: string[]; label: string }) {
  const safeItems = safeArray(items).filter((item) => item.trim().length > 0);

  if (safeItems.length === 0) {
    return <EmptyState label={label} />;
  }

  return (
    <ul className="space-y-1 text-sm text-gray-300">
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
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 break-words text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function KeyValueCard({ item }: { item: OperatingContextKeyValue }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-black/30 p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">
        {safeText(item.label, "item")}
      </div>
      <div className="mt-2 break-words text-lg font-semibold text-gray-100">
        {safeText(item.value, "none")}
      </div>
      <p className="mt-2 text-xs text-gray-400">{safeText(item.detail)}</p>
    </div>
  );
}

function DashboardModuleCard({ module }: { module: OperatingContextDashboardModule }) {
  return (
    <article className="rounded-lg border border-gray-800 bg-black/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-100">{safeText(module.label)}</h3>
        <ToneBadge tone="slate">{safeText(module.status, "unknown")}</ToneBadge>
      </div>
      <div className="mt-2 font-mono text-xs text-gray-500">{safeText(module.module_id)}</div>
      <p className="mt-3 text-sm text-gray-300">{safeText(module.summary)}</p>
    </article>
  );
}

function CouncilDefaultCard({ councilDefault }: { councilDefault: OperatingContextCouncilDefault }) {
  return (
    <article className="rounded-lg border border-amber-900 bg-amber-950/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-amber-100">{safeText(councilDefault.label)}</h3>
        <ToneBadge tone="amber">{safeText(councilDefault.posture, "advisory")}</ToneBadge>
        <ToneBadge tone="amber">representational only</ToneBadge>
      </div>
      <div className="mt-2 font-mono text-xs text-amber-200/70">
        {safeText(councilDefault.council_id)}
      </div>
      <p className="mt-3 text-sm text-amber-100">{safeText(councilDefault.advisory_note)}</p>
    </article>
  );
}

function AgentLaneDefaultCard({ lane }: { lane: OperatingContextAgentLaneDefault }) {
  return (
    <article className="rounded-lg border border-sky-900 bg-sky-950/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-sky-100">{safeText(lane.label)}</h3>
        <ToneBadge tone="sky">{safeText(lane.default_status, "representational")}</ToneBadge>
        <ToneBadge tone="rose">non-executable</ToneBadge>
      </div>
      <div className="mt-2 font-mono text-xs text-sky-200/70">{safeText(lane.lane_id)}</div>
      <p className="mt-3 text-sm text-sky-100">{safeText(lane.summary)}</p>
      <p className="mt-2 text-xs text-gray-400">{safeText(lane.non_executable_note)}</p>
    </article>
  );
}

function EvidenceStandardCard({ standard }: { standard: OperatingContextEvidenceStandard }) {
  return (
    <article className="rounded-lg border border-gray-800 bg-black/30 p-4">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">
        {safeText(standard.label, "evidence standard")}
      </div>
      <div className="mt-2 font-mono text-xs text-gray-500">{safeText(standard.standard_id)}</div>
      <p className="mt-3 text-sm text-gray-300">{safeText(standard.requirement)}</p>
    </article>
  );
}

function ProtectedSettingCard({ setting }: { setting: OperatingContextProtectedSetting }) {
  return (
    <article className="rounded-lg border border-rose-900 bg-rose-950/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-rose-100">{safeText(setting.label)}</h3>
        <ToneBadge tone="rose">protected governance constraint</ToneBadge>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <ToneBadge tone="slate">{safeText(setting.setting_id)}</ToneBadge>
        <ToneBadge tone="rose">{safeText(setting.value, "blocked")}</ToneBadge>
      </div>
      <p className="mt-3 text-sm text-rose-100">{safeText(setting.reason)}</p>
    </article>
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
    <article className="rounded-lg border border-gray-800 bg-black/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
        <ToneBadge tone="slate">representational only</ToneBadge>
      </div>
      <div className="mt-2 font-mono text-xs text-gray-500">{safeText(snapshot.ref_id)}</div>
      <div className="mt-2 text-sm font-medium text-gray-200">{safeText(snapshot.label)}</div>
      <p className="mt-2 text-sm text-gray-400">{safeText(snapshot.summary)}</p>
    </article>
  );
}

export default function OperatingContextPage() {
  const fixture = getVersionedOperatingContextFixture();
  const context = fixture.context;

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">{safeText(context.display_name)}</h1>
            <ToneBadge tone="amber">static</ToneBadge>
            <ToneBadge tone="sky">local</ToneBadge>
            <ToneBadge tone="slate">fixture-backed</ToneBadge>
            <ToneBadge tone="rose">non-live</ToneBadge>
            <ToneBadge tone="rose">non-mutating</ToneBadge>
            <ToneBadge tone="amber">non-canonical unless accepted</ToneBadge>
          </div>
          <p className="max-w-5xl text-sm text-gray-400">
            Static Operator Control Plane viewer for Versioned Operating Context.
            The context is displayed from checked-in fixture data and cannot
            edit settings, execute routes, or persist changes.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-200">
            {safeText(fixture.authority_boundary_label)}
          </div>
          <div className="rounded-xl border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-100">
            {safeText(fixture.status_note)}
          </div>
        </header>

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
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Objective</div>
            <p className="mt-3 text-sm text-gray-300">{safeText(context.objective)}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Identity</div>
            <div className="mt-3 space-y-2 font-mono text-xs text-gray-300">
              <div>nhID: {safeText(context.nhid)}</div>
              <div>context: {safeText(context.current_context_id)}</div>
              <div>object: {safeText(context.object_id)}</div>
            </div>
          </div>
        </section>

        <Section
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
          title="Dashboard Modules"
          description="Modules are representational dashboard defaults, not route execution or live module activation."
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

        <section className="rounded-xl border border-rose-900 bg-rose-950/30 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-rose-100">Authority Boundary</h2>
            <ToneBadge tone="rose">display only</ToneBadge>
            <ToneBadge tone="rose">non-mutating</ToneBadge>
          </div>
          <p className="mt-3 text-sm text-rose-100">{safeText(context.authority_boundary)}</p>
        </section>

        <section className="rounded-xl border border-amber-900 bg-amber-950/30 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-amber-100">Rollback Posture</h2>
            <ToneBadge tone="amber">representational only</ToneBadge>
          </div>
          <p className="mt-3 text-sm text-amber-100">{safeText(context.rollback_posture)}</p>
        </section>

        <section className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-gray-100">Explicit Non-Authorizations</h2>
            <ToneBadge tone="rose">no live behavior</ToneBadge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {safeArray(fixture.non_authorizations).length === 0 ? (
              <EmptyState label="non-authorizations" />
            ) : (
              safeArray(fixture.non_authorizations).map((item, index) => (
                <div
                  key={`non-authorization-${index}`}
                  className="rounded-lg border border-gray-800 bg-black/30 p-3 text-sm text-gray-300"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
