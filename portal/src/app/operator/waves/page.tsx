export const runtime = "nodejs";
export const revalidate = 0;

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import { getSeededWavePlans } from "@/lib/continuity/waves";
import type { WaveNode, WavePlan } from "@/lib/continuity/types";

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
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
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

function statusTone(status: WaveNode["status"] | WavePlan["status"]) {
  if (status === "done") return "emerald";
  if (status === "active") return "sky";
  if (status === "planned") return "amber";
  if (status === "blocked") return "rose";
  return "slate";
}

function WaveNodeTree({ node, depth = 0 }: { node: WaveNode; depth?: number }) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-lg border border-gray-800 bg-zinc-950/60 p-4"
        style={{ marginLeft: depth * 20 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <ToneBadge tone="slate">{node.nh_id}</ToneBadge>
          <ToneBadge tone={statusTone(node.status)}>{node.status}</ToneBadge>
          <h4 className="text-sm font-semibold text-gray-100">{node.title}</h4>
        </div>
        <p className="mt-3 text-sm text-gray-300">{node.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {node.linked_motion_ids.map((motionId) => (
            <ToneBadge key={`${node.nh_id}-${motionId}`} tone="amber">
              {motionId}
            </ToneBadge>
          ))}
          {node.linked_chat_ids.map((chatId) => (
            <ToneBadge key={`${node.nh_id}-${chatId}`} tone="sky">
              {chatId}
            </ToneBadge>
          ))}
          {node.linked_work_packet_ids.map((packetId) => (
            <ToneBadge key={`${node.nh_id}-${packetId}`} tone="emerald">
              {packetId}
            </ToneBadge>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-xs text-gray-400">
          {node.acceptance_notes.map((note) => (
            <li key={`${node.nh_id}-${note}`}>- {note}</li>
          ))}
        </ul>
      </div>

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
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">{wave.title}</h3>
            <ToneBadge tone={statusTone(wave.status)}>{wave.status}</ToneBadge>
            <ToneBadge tone="amber">planning spine</ToneBadge>
            <ToneBadge tone={waveYamlExists && planMdExists ? "emerald" : "amber"}>
              {waveYamlExists && planMdExists ? "committed artifacts present" : "artifact preview only"}
            </ToneBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            <ToneBadge tone="sky">{wave.repo_full_name}</ToneBadge>
            <ToneBadge tone="slate">{wave.surface_label}</ToneBadge>
            {wave.project_label ? (
              <ToneBadge tone="emerald">{wave.project_label}</ToneBadge>
            ) : (
              <ToneBadge tone="amber">project:none</ToneBadge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToneBadge tone="emerald">{wave.wave_id}</ToneBadge>
          <ToneBadge tone="rose">capture/index only</ToneBadge>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Wave artifact convention
            </h4>
            <ul className="mt-3 space-y-1 text-sm text-gray-300">
              <li>- wave id: {wave.wave_id}</li>
              <li>- wave.yaml: {wave.artifact_path_preview.wave_yaml}</li>
              <li>- plan.md: {wave.artifact_path_preview.plan_md}</li>
              <li>- wave.yaml present: {waveYamlExists ? "yes" : "no"}</li>
              <li>- plan.md present: {planMdExists ? "yes" : "no"}</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Linked continuity</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {wave.related_motion_ids.map((motionId) => (
                <ToneBadge key={`${wave.wave_id}-${motionId}`} tone="amber">
                  {motionId}
                </ToneBadge>
              ))}
              {wave.related_chat_ids.map((chatId) => (
                <ToneBadge key={`${wave.wave_id}-${chatId}`} tone="sky">
                  {chatId}
                </ToneBadge>
              ))}
              {wave.related_work_packet_ids.map((packetId) => (
                <ToneBadge key={`${wave.wave_id}-${packetId}`} tone="emerald">
                  {packetId}
                </ToneBadge>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
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
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-100">
                Next prompt / handoff
              </h4>
              <ToneBadge tone="amber">copy only</ToneBadge>
            </div>
            <textarea
              readOnly
              value={wave.next_prompt_preview}
              rows={20}
              className="mt-3 w-full rounded-lg border border-gray-800 bg-black px-3 py-3 font-mono text-xs text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">nh_id wave plan</h4>
            <p className="mt-2 text-xs text-gray-400">
              v0 waves are repo-native planning artifacts only. They do not run
              automatically and do not authorize execution.
            </p>
            <div className="mt-4 space-y-3">
              {wave.nodes.map((node) => (
                <WaveNodeTree key={node.nh_id} node={node} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WavesPage() {
  const waves = getSeededWavePlans();
  const nodeCount = waves.flatMap((wave) => wave.nodes).length;

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - Waves</h1>
            <ToneBadge tone="amber">planning spine</ToneBadge>
            <ToneBadge tone="rose">no automatic live capture</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Bundled/static wave sessions connect captured conversations,
            deliberation transcripts, motions, work packets, and next prompts
            into a durable planning hierarchy using nh_id nodes such as 0.0,
            1.0, 1.1, and 1.1.1.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              This v0 seam is capture, index, and planning only. It does not
              add automatic live capture, execution, branch writes, PR creation,
              dispatch, scheduler behavior, DB mutation, API mutation, or hidden
              persistence.
            </p>
          </div>
        </header>

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
