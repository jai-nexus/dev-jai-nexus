// portal/src/lib/time.ts

/**
 * Goal: deterministic, hydration-safe formatting across server + client.
 *
 * Why this revision:
 * - `Intl.DateTimeFormat` can differ subtly across runtimes (Node vs browser) unless you pin:
 *   - locale
 *   - numbering system
 *   - hour cycle (12/24)
 *   - and always format the same "instant" (Date object)
 * - `new Date("YYYY-MM-DD")` is a common footgun (UTC parsing vs local). Here we only accept
 *   full ISO timestamps or Date objects, and we validate strictly.
 *
 * Notes:
 * - We still use Intl for timezone conversion (America/Chicago). This requires ICU tzdata;
 *   Node builds usually have it, but if you ever deploy on a minimal-ICU environment,
 *   formatting can fall back. (Your Next build logs suggest a standard environment.)
 * - For maximum determinism, we also force `hour12: true` and `formatToParts` in the tooltip.
 */

const CENTRAL_TZ = "America/Chicago";

// Pin locale + numbering system for consistency
const LOCALE = "en-US-u-nu-latn";

/**
 * Strict ISO check:
 * Accepts:
 * - 2026-02-01T12:34:56Z
 * - 2026-02-01T12:34:56.789Z
 * - 2026-02-01T12:34:56-06:00
 * - 2026-02-01T12:34:56.789-06:00
 *
 * Rejects:
 * - "2026-02-01" (ambiguous in JS and often causes off-by-one day issues)
 * - non-ISO strings
 */
const ISO_INSTANT_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * Parse an ISO timestamp into a Date.
 * Throws if invalid or ambiguous.
 */
export function parseSotTimestamp(ts: string): Date {
  const s = ts.trim();

  if (!ISO_INSTANT_RE.test(s)) {
    throw new Error(
      `Invalid/ambiguous SoT timestamp (expected full ISO instant with timezone, e.g. 2026-02-01T12:34:56Z): ${ts}`
    );
  }

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid SoT timestamp (Date parse failed): ${ts}`);
  }
  return d;
}

function coerceDate(value: Date | string): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid Date object: ${String(value)}`);
    }
    return value;
  }
  return parseSotTimestamp(value);
}

/**
 * Deterministic Central-time formatter (compact).
 * Example: "12/03/2025, 05:05:30 PM"
 *
 * Pin `hour12` to avoid runtime differences.
 */
const centralCompact = new Intl.DateTimeFormat(LOCALE, {
  timeZone: CENTRAL_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

/**
 * Deterministic Central-time formatter (verbose w/ TZ name).
 * We use formatToParts so we can guarantee spacing/punctuation
 * and avoid minor output differences between runtimes.
 */
const centralVerboseParts = new Intl.DateTimeFormat(LOCALE, {
  timeZone: CENTRAL_TZ,
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

/**
 * Format a Date or ISO timestamp in Central time, compact form.
 */
export function formatCentral(value: Date | string): string {
  const d = coerceDate(value);
  return centralCompact.format(d);
}

/**
 * More verbose version for tooltips, includes TZ label.
 * Example: "Dec 03, 2025, 05:05:30 PM CST"
 *
 * We rebuild the string from parts to minimize cross-runtime differences.
 */
export function formatCentralTooltip(value: Date | string): string {
  const d = coerceDate(value);
  const parts = centralVerboseParts.formatToParts(d);

  // Pull the parts we care about
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const month = get("month");
  const day = get("day");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");
  const dayPeriod = get("dayPeriod"); // AM/PM
  const tz = get("timeZoneName");

  // Construct a stable tooltip string
  // "Dec 03, 2025, 05:05:30 PM CST"
  return `${month} ${day}, ${year}, ${hour}:${minute}:${second} ${dayPeriod} ${tz}`.trim();
}

/**
 * Optional helpers (handy for debugging and hydration issues).
 * - formatCentralISO: always returns a stable ISO-like string in Central wall time.
 *   This is useful if you ever want to avoid locale formatting entirely.
 */
export function formatCentralISO(value: Date | string): string {
  const d = coerceDate(value);
  const parts = new Intl.DateTimeFormat(LOCALE, {
    timeZone: CENTRAL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  // "YYYY-MM-DD HH:MM:SS" in Central wall time (not an instant)
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}
