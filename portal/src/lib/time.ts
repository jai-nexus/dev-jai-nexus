// portal/src/lib/time.ts

const CENTRAL_TZ = 'America/Chicago';

/**
 * Parse a SoT timestamp (ISO string) into a Date.
 * Throws if the timestamp is invalid.
 */
export function parseSotTimestamp(ts: string): Date {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid SoT timestamp: ${ts}`);
  }
  return d;
}

/**
 * Format a Date or ISO string in Central time, compact form.
 * Example: "12/03/2025, 17:05:30"
 */
export function formatCentral(value: Date | string): string {
  const d = typeof value === 'string' ? parseSotTimestamp(value) : value;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: CENTRAL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);
}

/**
 * More verbose version for tooltips, includes TZ label.
 * Example: "Dec 03, 2025, 05:05:30 PM CST"
 */
export function formatCentralTooltip(value: Date | string): string {
  const d = typeof value === 'string' ? parseSotTimestamp(value) : value;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: CENTRAL_TZ,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(d);
}
