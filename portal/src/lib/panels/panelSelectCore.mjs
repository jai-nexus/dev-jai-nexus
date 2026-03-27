/**
 * Shared deterministic panel selection core.
 * Used by:
 * - CLI: portal/scripts/panel-select.mjs
 * - UI: operator panels viewer server actions
 *
 * Assumptions:
 * - breakdown scores are 0..10
 * - weights sum to 1.0 (not strictly required, but expected)
 * - total is 0..100 via: total = sum(score * weight) * 10
 */

function clampScore(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    if (n < 0) return 0;
    if (n > 10) return 10;
    return n;
}

function round2(n) {
    return Math.round(n * 100) / 100;
}

export function computeSlotTotal(breakdown, rubric) {
    let sum = 0;
    for (const r of rubric || []) {
        const id = String(r?.id ?? "").trim();
        const w = Number(r?.weight ?? 0);
        if (!id || !Number.isFinite(w)) continue;
        const s = clampScore(breakdown?.[id] ?? 0);
        sum += s * w;
    }
    return round2(sum * 10); // 0..100
}

export function normalizeBreakdown(breakdown, rubric) {
    const out = { ...(breakdown || {}) };
    for (const r of rubric || []) {
        const id = String(r?.id ?? "").trim();
        if (!id) continue;
        out[id] = clampScore(out[id] ?? 0);
    }
    return out;
}

export function computeSelection(panel, selection, opts = {}) {
    const rubric = Array.isArray(panel?.rubric) ? panel.rubric : [];
    const scores = { ...(selection?.scores || {}) };

    const slots = Object.keys(scores).sort((a, b) => a.localeCompare(b));
    if (slots.length === 0) {
        return { next: selection, meta: { slots: 0, anyNonZero: false, best: null } };
    }

    let anyNonZero = false;
    const totals = [];

    for (const slot of slots) {
        const entry = scores[slot] || {};
        const breakdown = normalizeBreakdown(entry.breakdown || {}, rubric);
        const total = computeSlotTotal(breakdown, rubric);
        if (total > 0) anyNonZero = true;

        scores[slot] = { total, breakdown };
        totals.push({ slot, total });
    }

    totals.sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return a.slot.localeCompare(b.slot);
    });

    const best = totals[0] || null;
    const forceWinner = opts.forceWinner === true;
    const winner = (anyNonZero || forceWinner) && best ? best.slot : "UNKNOWN";

    const next = {
        ...selection,
        scores,
        winner,
    };

    return { next, meta: { slots: slots.length, anyNonZero, best } };
}
