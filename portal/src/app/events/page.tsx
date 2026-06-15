export const dynamic = "force-dynamic";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";
import { formatCentral, formatCentralTooltip } from "@/lib/time";

const tz = "America/Chicago";

export default async function EventsPage() {
  const events = await prisma.sotEvent.findMany({
    orderBy: { ts: "desc" }, // Event time order, not ingestion order.
    take: 50,
    include: {
      repo: true,
      domain: true,
    },
  });

  type SotEventRow = (typeof events)[number];

  const sourceCount = new Set(events.map((event) => event.source)).size;
  const kindCount = new Set(events.map((event) => event.kind)).size;
  const linkedRepoCount = events.filter((event) => event.repo !== null).length;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-[1480px] space-y-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">
                JAI NEXUS - Events
              </h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="warning">
                PARTIAL EVENT STREAM
              </OperatorBadge>
              <OperatorBadge tone="neutral">
                MIXED INGEST SOURCES
              </OperatorBadge>
              <OperatorBadge tone="blocked">NO EVENT MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO TELEMETRY EMISSION</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Read-only stream-of-record rows stored from manual, script, and
              runtime-fed sources. Event presence is evidence display only; it
              is not acceptance, canon update, receipt creation, telemetry
              verification, or execution authority.
            </p>
            <OperatorGateCard className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <OperatorBadge tone="warning">PARTIAL / LATEST 50</OperatorBadge>
                <OperatorBadge tone="readOnly">{tz}</OperatorBadge>
              </div>
              <p className="mt-3 text-sm text-amber-200">
                Motion ratification does not automatically emit into Events in
                v0. This page displays stored rows only and does not verify a
                complete or live event stream.
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Event Stream Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Emit event</OperatorBlockedAction>
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
              <OperatorBlockedAction>Accept evidence</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              This route reads existing database rows. Dashboard display does
              not authorize action.
            </p>
          </OperatorSafetyRail>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Displayed rows
            </div>
            <div className="mt-2 font-mono text-2xl text-slate-200">
              {events.length}
            </div>
            <OperatorBadge tone="readOnly">DERIVED / READ-ONLY</OperatorBadge>
          </OperatorPanel>
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Sources represented
            </div>
            <div className="mt-2 font-mono text-2xl text-slate-200">
              {sourceCount}
            </div>
            <OperatorBadge tone="neutral">DERIVED / MIXED</OperatorBadge>
          </OperatorPanel>
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Kinds represented
            </div>
            <div className="mt-2 font-mono text-2xl text-slate-200">
              {kindCount}
            </div>
            <OperatorBadge tone="readOnly">DERIVED / READ-ONLY</OperatorBadge>
          </OperatorPanel>
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Repo-linked rows
            </div>
            <div className="mt-2 font-mono text-2xl text-slate-200">
              {linkedRepoCount}
            </div>
            <OperatorBadge tone="readOnly">DERIVED / READ-ONLY</OperatorBadge>
          </OperatorPanel>
        </section>

        {events.length === 0 ? (
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="readOnly">DB READ-ONLY / EMPTY</OperatorBadge>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Stored event rows
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              No event records are currently available from the configured
              database source.
            </p>
          </OperatorGateCard>
        ) : (
          <OperatorPanel>
            <OperatorSectionHeader
              index="01"
              title="Read-Only Event Records"
              right={
                <>
                  <OperatorReadOnlyAction>DATABASE DISPLAY</OperatorReadOnlyAction>
                  <OperatorBadge tone="warning">LATEST 50 / PARTIAL</OperatorBadge>
                </>
              }
            />
            <p className="mb-4 text-sm text-slate-400">
              Ordered by stored event time descending. Ingested time is shown
              separately; neither timestamp verifies acceptance or current
              system state.
            </p>

            <div className="overflow-x-auto rounded border border-slate-800">
              <table className="w-full border-collapse text-sm">
                <thead className="border-b border-slate-800 bg-slate-950 text-left">
                  <tr>
                    <th className="px-3 py-2 text-xs text-slate-400">
                      Event time
                    </th>
                    <th className="px-3 py-2 text-xs text-slate-400">
                      Ingested
                    </th>
                    <th className="px-3 py-2 text-xs text-slate-400">Source</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Kind</th>
                    <th className="px-3 py-2 text-xs text-slate-400">NH_ID</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Repo</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Domain</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Summary</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Payload</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Posture</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: SotEventRow) => {
                    const eventTime = formatCentral(event.ts);
                    const ingestedTime = formatCentral(event.createdAt);
                    const payloadString =
                      event.payload != null ? JSON.stringify(event.payload) : "";
                    const payloadPreview =
                      payloadString === ""
                        ? "-"
                        : payloadString.slice(0, 60) +
                          (payloadString.length > 60 ? "..." : "");

                    return (
                      <tr
                        key={event.id}
                        className="border-b border-slate-900 align-top hover:bg-slate-800/60"
                      >
                        <td
                          className="whitespace-nowrap px-3 py-2 text-xs text-slate-200"
                          title={formatCentralTooltip(event.ts)}
                        >
                          {eventTime}
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-2 text-xs text-slate-400"
                          title={formatCentralTooltip(event.createdAt)}
                        >
                          {ingestedTime}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs uppercase text-slate-300">
                          {event.source}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs">
                          <OperatorBadge tone="neutral">{event.kind}</OperatorBadge>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs">
                          {event.nhId ? (
                            <OperatorIdChip>{event.nhId}</OperatorIdChip>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-300">
                          {event.repo?.name ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-300">
                          {event.domain?.domain ?? "-"}
                        </td>
                        <td className="max-w-xs truncate px-3 py-2 text-slate-300">
                          {event.summary ?? "-"}
                        </td>
                        <td
                          className="max-w-xs truncate px-3 py-2 text-xs text-slate-500"
                          title={payloadString || undefined}
                        >
                          {payloadPreview}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs">
                          <OperatorBadge tone="readOnly">
                            EVENT / READ-ONLY
                          </OperatorBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </OperatorPanel>
        )}
      </div>
    </main>
  );
}
