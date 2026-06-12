import type { ReactNode } from "react";

const badgeStyles = {
  slate: "border-gray-700 bg-zinc-900 text-gray-200",
  sky: "border-sky-800 bg-sky-950 text-sky-200",
  amber: "border-amber-800 bg-amber-950 text-amber-200",
  rose: "border-rose-800 bg-rose-950 text-rose-200",
  emerald: "border-emerald-800 bg-emerald-950 text-emerald-200",
} as const;

export function ControlPlaneBadge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeStyles;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${badgeStyles[tone]}`}
    >
      {children}
    </span>
  );
}

export function InertControl({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="MOCK / DISABLED. Manual paste/import only. Not authorized in v0."
      className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-gray-700 bg-zinc-900 px-3 py-1.5 text-xs text-gray-400 opacity-80"
    >
      {children}
      <ControlPlaneBadge tone="rose">MOCK / DISABLED</ControlPlaneBadge>
    </button>
  );
}

export function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("accepted") || normalized.includes("returned")) return "emerald";
  if (normalized.includes("blocked") || normalized.includes("closed")) return "rose";
  if (normalized.includes("review") || normalized.includes("draft")) return "amber";
  if (normalized.includes("ready") || normalized.includes("received")) return "sky";
  return "slate";
}
