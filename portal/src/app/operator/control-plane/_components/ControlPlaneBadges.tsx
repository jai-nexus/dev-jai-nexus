import type { ReactNode } from "react";

import {
  OperatorBadge,
  OperatorGatedAction,
  type OperatorSlateTone,
} from "@/components/operator/slate";

const badgeTones = {
  slate: "fixture",
  sky: "readOnly",
  amber: "advisory",
  rose: "blocked",
  emerald: "canonical",
} as const;

export function ControlPlaneBadge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <OperatorBadge
      tone={badgeTones[tone] satisfies OperatorSlateTone}
      className="text-[10px]"
    >
      {children}
    </OperatorBadge>
  );
}

export function InertControl({ children }: { children: ReactNode }) {
  return (
    <span title="MOCK / DISABLED. Manual paste/import only. Not authorized in v0.">
      <OperatorGatedAction>{children} / MOCK</OperatorGatedAction>
    </span>
  );
}

export function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("accepted") || normalized.includes("returned")) return "slate";
  if (normalized.includes("blocked") || normalized.includes("closed")) return "rose";
  if (normalized.includes("review") || normalized.includes("draft")) return "amber";
  if (normalized.includes("ready") || normalized.includes("received")) return "sky";
  return "slate";
}
