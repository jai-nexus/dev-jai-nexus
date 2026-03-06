import type { PanelMeta, SelectionRecord } from "./panelStore";

export function computeSlotTotal(
    breakdown: Record<string, number>,
    rubric: Array<{ id: string; weight: number; description?: string }>
): number;

export function normalizeBreakdown(
    breakdown: Record<string, number>,
    rubric: Array<{ id: string; weight: number; description?: string }>
): Record<string, number>;

export function computeSelection(
    panel: PanelMeta,
    selection: SelectionRecord,
    opts?: { forceWinner?: boolean }
): { next: SelectionRecord; meta: { slots: number; anyNonZero: boolean; best: { slot: string; total: number } | null } };
