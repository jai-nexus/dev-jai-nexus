"use client";

import { useMemo, useState } from "react";

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
  buildCopyablePassalongPacket,
  buildRouteRecommendationText,
  SANDBOX_IMPORT_ADOPTION_POSTURE_DESCRIPTIONS,
  SANDBOX_IMPORT_ADOPTION_POSTURES,
  type PassalongQueue,
  type PassalongRecord,
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

export function PassalongRouterPrototype({
  threadMemoryRecords,
  passalongRecords,
  inboxQueues,
  outboxQueues,
  sandboxTargetOptions,
  authorityFindings,
  nonAuthorizations,
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
  initialPassalongId: string;
  initialRouteRecommendation: string;
  initialCopyablePacket: string;
}) {
  const [selectedPassalongId, setSelectedPassalongId] =
    useState(initialPassalongId);

  const selectedPassalong = useMemo(
    () =>
      passalongRecords.find(
        (record) => record.passalongId === selectedPassalongId,
      ) ?? passalongRecords[0],
    [passalongRecords, selectedPassalongId],
  );

  const routeRecommendationText = selectedPassalong
    ? buildRouteRecommendationText(selectedPassalong)
    : initialRouteRecommendation;
  const copyablePacketText = selectedPassalong
    ? buildCopyablePassalongPacket(selectedPassalong)
    : initialCopyablePacket;

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
