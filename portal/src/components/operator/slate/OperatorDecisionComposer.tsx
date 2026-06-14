"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { OperatorComposeButton } from "./OperatorSlateActions";
import { OperatorBadge } from "./OperatorSlatePrimitives";

export interface OperatorDecisionDraftContext {
  decision: string;
  depth: string;
}

export function OperatorDecisionComposer({
  decisions,
  depths,
  buildDraft,
  metadata,
  copyLabel = "Copy decision draft",
  className = "",
}: {
  decisions: readonly string[];
  depths: readonly string[];
  buildDraft: (context: OperatorDecisionDraftContext) => string;
  metadata?: ReactNode;
  copyLabel?: string;
  className?: string;
}) {
  const [decision, setDecision] = useState("");
  const [depth, setDepth] = useState("");
  const draft = buildDraft({ decision, depth });

  return (
    <div
      className={`rounded border border-slate-800 bg-slate-900 p-3 ${className}`}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <OperatorBadge tone="composeOnly" label="REAL-COMPOSE" />
        <OperatorBadge tone="advisory" label="DOES NOT CREATE RECEIPT" />
        <OperatorBadge tone="neutral" label="LOCAL STATE ONLY" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-wider text-slate-500">
            Decision
          </span>
          <select
            value={decision}
            onChange={(event) => setDecision(event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-1.5 font-mono text-xs text-slate-200"
          >
            <option value="">- select -</option>
            {decisions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div className="text-xs">
          <span className="font-mono uppercase tracking-wider text-slate-500">
            Review depth
          </span>
          <div className="mt-2 flex flex-wrap gap-3">
            {depths.map((item) => (
              <label key={item} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="operator-slate-review-depth"
                  checked={depth === item}
                  onChange={() => setDepth(item)}
                  className="accent-amber-500"
                />
                <span className="font-mono text-xs uppercase">{item}</span>
              </label>
            ))}
          </div>
        </div>
        {metadata ? <div className="text-xs text-slate-400">{metadata}</div> : null}
      </div>
      <pre className="mt-3 overflow-x-auto rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-400">
        {draft}
      </pre>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <OperatorComposeButton text={draft}>{copyLabel}</OperatorComposeButton>
        <span className="font-mono text-xs uppercase tracking-wide text-amber-400">
          Manual review required - copy-only output
        </span>
      </div>
    </div>
  );
}
