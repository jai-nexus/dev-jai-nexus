import { parseMotionNumber } from "@/lib/motion/motionContenders";
import { loadMotionQueueIndex } from "@/lib/motion/motionSurface";

export interface ControlPlaneCanonicalPosture {
  source_kind: "CANONICAL LIVE" | "CANONICAL SNAPSHOT";
  source_label: string;
  motion_count: number;
  latest_motion_id: string | null;
  attention_count: number;
  ratified_count: number;
  status_mismatch_count: number;
  warning: string | null;
  read_only: true;
  non_authorizing: true;
}

export async function readControlPlaneCanonicalPosture(): Promise<ControlPlaneCanonicalPosture> {
  const queueIndex = await loadMotionQueueIndex();
  const latestMotion = queueIndex.items.reduce<(typeof queueIndex.items)[number] | null>(
    (latest, item) => {
      if (!latest) return item;
      return parseMotionNumber(item.motion_id) > parseMotionNumber(latest.motion_id)
        ? item
        : latest;
    },
    null,
  );

  return {
    source_kind: queueIndex.source_mode === "live" ? "CANONICAL LIVE" : "CANONICAL SNAPSHOT",
    source_label: queueIndex.source_label,
    motion_count: queueIndex.items.length,
    latest_motion_id: latestMotion?.motion_id ?? null,
    attention_count: queueIndex.items.filter((item) => item.queue_state === "attention").length,
    ratified_count: queueIndex.items.filter(
      (item) => item.decision_status?.toUpperCase() === "RATIFIED",
    ).length,
    status_mismatch_count: queueIndex.items.filter((item) =>
      item.attention_flags.some((flag) => flag.startsWith("status mismatch:")),
    ).length,
    warning: queueIndex.warning,
    read_only: true,
    non_authorizing: true,
  };
}
