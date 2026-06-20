import Link from "next/link";

import {
  OperatorBadge,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";

type SourceLabel =
  | "READ-ONLY CANONICAL"
  | "DB READ-ONLY"
  | "YAML-BACKED CANONICAL"
  | "DERIVED"
  | "PARTIAL STREAM"
  | "FIXTURE"
  | "SYNTHETIC"
  | "UNKNOWN SOURCE";

type CanonicalSpineCard = {
  id: string;
  label: string;
  value: string | number;
  source: SourceLabel;
  freshness: string;
  detail: string;
  href?: string;
};

type CanonicalReadOnlySpineProps = {
  index?: string;
  title?: string;
  cards: CanonicalSpineCard[];
  compact?: boolean;
};

function sourceTone(source: SourceLabel): OperatorSlateTone {
  if (source === "READ-ONLY CANONICAL" || source === "YAML-BACKED CANONICAL") {
    return "canonical";
  }
  if (source === "DB READ-ONLY" || source === "DERIVED") return "readOnly";
  if (source === "PARTIAL STREAM" || source === "UNKNOWN SOURCE") return "warning";
  return "fixture";
}

export function CanonicalReadOnlySpine({
  index = "CANON",
  title = "Canonical Read-Only Spine",
  cards,
  compact = false,
}: CanonicalReadOnlySpineProps) {
  return (
    <section>
      <OperatorSectionHeader
        index={index}
        title={title}
        right={
          <>
            <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">DISPLAY IS NOT AUTHORITY</OperatorBadge>
            <OperatorBadge tone="blocked">NO MUTATION</OperatorBadge>
          </>
        }
      />
      <OperatorPanel className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / canonical read-only spine / Commit 2
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Current state is separated by source posture. Canonical display,
              DB reads, YAML-backed config, fixtures, derived counts, and partial
              streams are visible only; none creates acceptance, receipts, canon
              updates, route state, motion state, or execution authority.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            <OperatorBadge tone="blocked">READ-ONLY IS NOT AUTHORITY</OperatorBadge>
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>
          {cards.map((card) => {
            const content = (
              <article className="h-full rounded border border-slate-800 bg-slate-950/50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    {card.label}
                  </div>
                  <OperatorIdChip>{card.id}</OperatorIdChip>
                </div>
                <div className="mt-2 break-words font-mono text-2xl text-slate-100">
                  {card.value}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <OperatorBadge tone={sourceTone(card.source)}>{card.source}</OperatorBadge>
                  <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div>
                    <span className="font-mono uppercase text-slate-500">
                      freshness /{" "}
                    </span>
                    {card.freshness}
                  </div>
                  <div>
                    <span className="font-mono uppercase text-slate-500">
                      posture /{" "}
                    </span>
                    {card.detail}
                  </div>
                </div>
                <div className="mt-3">
                  <OperatorReadOnlyAction>
                    {card.href ? "Open source route" : "Display only"}
                  </OperatorReadOnlyAction>
                </div>
              </article>
            );

            return card.href ? (
              <Link key={card.id} href={card.href} className="group">
                {content}
              </Link>
            ) : (
              <div key={card.id}>{content}</div>
            );
          })}
        </div>

        <div className="rounded border border-red-900/70 bg-red-950/20 p-3 text-xs text-red-200">
          No source label in this spine authorizes mutation. Stored status is
          not live verification unless named as live verification; derived data
          is not source-of-truth; fixture and synthetic data are not canonical.
        </div>
      </OperatorPanel>
    </section>
  );
}
