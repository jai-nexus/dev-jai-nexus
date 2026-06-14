import type { ReactNode } from "react";

import {
  operatorSlateToneClasses,
  type OperatorSlateTone,
} from "./tokens";

export function OperatorBadge({
  children,
  label,
  tone = "neutral",
  className = "",
}: {
  children?: ReactNode;
  label?: string;
  tone?: OperatorSlateTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide ${operatorSlateToneClasses[tone]} ${className}`}
    >
      {label ?? children}
    </span>
  );
}

export function OperatorStatusChip({
  status,
  tone = "neutral",
}: {
  status: string;
  tone?: OperatorSlateTone;
}) {
  return <OperatorBadge label={status} tone={tone} />;
}

export function OperatorIdChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-slate-300">
      {children}
    </span>
  );
}

export function OperatorPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded border border-slate-800 bg-slate-900 p-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function OperatorSectionHeader({
  index,
  title,
  right,
  className = "",
}: {
  index: string;
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-1.5 ${className}`}
    >
      <h2 className="font-mono text-xs uppercase tracking-widest text-slate-300">
        <span className="text-slate-600">{index} / </span>
        {title}
      </h2>
      {right ? (
        <div className="flex flex-wrap items-center gap-1.5">{right}</div>
      ) : null}
    </div>
  );
}

export function OperatorSafetyRail({
  title = "Right Safety Rail",
  invariants,
  children,
  className = "",
}: {
  title?: string;
  invariants: readonly string[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`space-y-3 rounded border border-slate-800 bg-slate-900 p-3 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <span className="text-amber-400" aria-hidden="true">
          !!
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-slate-300">
          {title}
        </span>
      </div>
      {children}
      <div className="border-t border-slate-800 pt-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          Invariants
        </div>
        <ul className="mt-1.5 space-y-1">
          {invariants.map((invariant) => (
            <li
              key={invariant}
              className="rounded border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-xs text-amber-300"
            >
              {invariant}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OperatorDissentCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded border border-red-900 border-l-4 border-l-red-500 bg-red-950 p-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function OperatorContradictionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded border border-red-900 bg-slate-900 p-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function OperatorGateCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-lg border border-slate-800 bg-slate-950/40 p-3 ${className}`}
    >
      {children}
    </article>
  );
}
