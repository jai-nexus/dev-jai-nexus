export const runtime = "nodejs";
export const revalidate = 0;

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { getSeededWavePlans } from "@/lib/continuity/waves";
import type { WaveNode, WavePlan } from "@/lib/continuity/types";

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
        right={<OperatorBadge tone="fixture">SEEDED FIXTURE</OperatorBadge>}
      />
      <p className="text-sm text-slate-400">{description}</p>
      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <OperatorPanel>
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorBadge tone="fixture">FIXTURE-DERIVED</OperatorBadge>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

function statusTone(
  status: WaveNode["status"] | WavePlan["status"],
): OperatorSlateTone {
  if (status === "done") return "readOnly";
  if (status === "active") return "advisory";
  if (status === "planned") return "pending";
  if (status === "blocked") return "blocked";
  return "gated";
}

function WaveNodeTree({ node, depth = 0 }: { node: WaveNode; depth?: number }) {
  return (
    <div className="space-y-3">
      <OperatorGateCard className={depth > 0 ? "ml-5" : ""}>
        <div className="flex flex-wrap items-center gap-2">
          <OperatorIdChip>{node.nh_id}</OperatorIdChip>
          <OperatorStatusChip status={node.status} tone={statusTone(node.status)} />
          <OperatorBadge tone="fixture">FIXTURE NODE</OperatorBadge>
          <h4 className="text-sm font-semibold text-slate-100">{node.title}</h4>
        </div>
        <p className="mt-3 text-sm text-slate-300">{node.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {node.linked_motion_ids.map((motionId) => (
            <OperatorIdChip key={`${node.nh_id}-${motionId}`}>
              {motionId}
            </OperatorIdChip>
          ))}
          {node.linked_chat_ids.map((chatId) => (
            <OperatorIdChip key={`${node.nh_id}-${chatId}`}>{chatId}</OperatorIdChip>
          ))}
          {node.linked_work_packet_ids.map((packetId) => (
            <OperatorIdChip key={`${node.nh_id}-${packetId}`}>
              {packetId}
            </OperatorIdChip>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-xs text-slate-400">
          {node.acceptance_notes.map((note) => (
            <li key={`${node.nh_id}-${note}`}>- {note}</li>
          ))}
        </ul>
      </OperatorGateCard>

      {node.children.map((child) => (
        <WaveNodeTree key={child.nh_id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function WaveCard({ wave }: { wave: WavePlan }) {
  const waveYamlPath = path.join(process.cwd(), wave.artifact_path_preview.wave_yaml);
  const planMdPath = path.join(process.cwd(), wave.artifact_path_preview.plan_md);
  const waveYamlExists = fs.existsSync(waveYamlPath);
  const planMdExists = fs.existsSync(planMdPath);

  return (
    <OperatorPanel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">{wave.title}</h3>
            <OperatorStatusChip status={wave.status} tone={statusTone(wave.status)} />
            <OperatorBadge tone="advisory">PLANNING SPINE</OperatorBadge>
            <OperatorBadge
              tone={waveYamlExists && planMdExists ? "readOnly" : "pending"}
            >
              {waveYamlExists && planMdExists ? "committed artifacts present" : "artifact preview only"}
            </OperatorBadge>
            <OperatorBadge tone="fixture">SEEDED FIXTURE</OperatorBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            <OperatorIdChip>{wave.repo_full_name}</OperatorIdChip>
            <OperatorBadge tone="neutral">{wave.surface_label}</OperatorBadge>
            {wave.project_label ? (
              <OperatorBadge tone="fixture">{wave.project_label}</OperatorBadge>
            ) : (
              <OperatorBadge tone="pending">project:none</OperatorBadge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorIdChip>{wave.wave_id}</OperatorIdChip>
          <OperatorBadge tone="readOnly">CAPTURE / INDEX ONLY</OperatorBadge>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">
              Wave artifact convention
            </h4>
            <ul className="mt-3 space-y-1 text-sm text-slate-300">
              <li>- wave id: {wave.wave_id}</li>
              <li>- wave.yaml: {wave.artifact_path_preview.wave_yaml}</li>
              <li>- plan.md: {wave.artifact_path_preview.plan_md}</li>
              <li>- wave.yaml present: {waveYamlExists ? "yes" : "no"}</li>
              <li>- plan.md present: {planMdExists ? "yes" : "no"}</li>
            </ul>
          </OperatorGateCard>

          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">Linked continuity</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {wave.related_motion_ids.map((motionId) => (
                <OperatorIdChip key={`${wave.wave_id}-${motionId}`}>
                  {motionId}
                </OperatorIdChip>
              ))}
              {wave.related_chat_ids.map((chatId) => (
                <OperatorIdChip key={`${wave.wave_id}-${chatId}`}>{chatId}</OperatorIdChip>
              ))}
              {wave.related_work_packet_ids.map((packetId) => (
                <OperatorIdChip key={`${wave.wave_id}-${packetId}`}>
                  {packetId}
                </OperatorIdChip>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
              <Link href={wave.deliberation_route} className="text-sky-300 underline">
                {wave.deliberation_route}
              </Link>
              <Link href="/operator/chats" className="text-sky-300 underline">
                /operator/chats
              </Link>
              <Link href="/operator/work" className="text-sky-300 underline">
                /operator/work
              </Link>
            </div>
          </OperatorGateCard>

          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Next prompt / handoff
              </h4>
              <OperatorBadge tone="composeOnly">COPY-ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
            </div>
            <textarea
              readOnly
              value={wave.next_prompt_preview}
              rows={20}
              className="mt-3 w-full rounded border border-slate-800 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-200"
            />
          </OperatorGateCard>
        </div>

        <div className="space-y-4">
          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">nh_id wave plan</h4>
            <p className="mt-2 text-xs text-slate-400">
              v0 waves are repo-native planning artifacts only. They do not run
              automatically and do not authorize execution.
            </p>
            <div className="mt-4 space-y-3">
              {wave.nodes.map((node) => (
                <WaveNodeTree key={node.nh_id} node={node} />
              ))}
            </div>
          </OperatorGateCard>
        </div>
      </div>
    </OperatorPanel>
  );
}

export default function WavesPage() {
  const waves = getSeededWavePlans();
  const nodeCount = waves.flatMap((wave) => wave.nodes).length;

  return (
    <main className="min-h-screen bg-slate-950 px-8 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">JAI NEXUS - Waves</h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="fixture">SEEDED FIXTURE</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="advisory">PLANNING SPINE</OperatorBadge>
              <OperatorBadge tone="composeOnly">COPY-ONLY OUTPUT</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Seeded local wave sessions connect captured conversations,
              deliberation transcripts, motions, work packets, and next prompts
              into a reviewable planning hierarchy. Fixture-backed planning
              completion is not acceptance, execution authority, or live state.
            </p>
            <OperatorGateCard className="mt-4 text-sm text-slate-300">
              This v0 surface is capture, index, and planning only. Prompt text is
              not dispatch. Copy-only output does not submit, persist, create a
              receipt, update canon, mutate a route, or authorize execution.
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Run wave</OperatorBlockedAction>
              <OperatorBlockedAction>Dispatch prompt</OperatorBlockedAction>
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Waves organize seeded planning context. They neither decide nor
              execute the work they describe.
            </p>
          </OperatorSafetyRail>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Wave sessions"
            value={String(waves.length)}
            detail="Seeded wave plans derived from current deliberation direction."
          />
          <SummaryCard
            label="Root nh_id nodes"
            value={String(nodeCount)}
            detail="Wave sessions expose a durable nh_id planning hierarchy."
          />
          <SummaryCard
            label="Related motions"
            value={String(
              new Set(waves.flatMap((wave) => wave.related_motion_ids)).size,
            )}
            detail="Waves link back to the continuity and deliberation motions."
          />
          <SummaryCard
            label="Execution posture"
            value="blocked"
            detail="Waves remain a planning spine only and do not authorize action."
          />
        </section>

        <Section
          index="01"
          title="Seeded wave sessions"
          description="At least one wave plan is seeded from the current next-action recommendation and linked back to motions, chats, work packets, and prompts."
        >
          <div className="space-y-4">
            {waves.map((wave) => (
              <WaveCard key={wave.wave_id} wave={wave} />
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
