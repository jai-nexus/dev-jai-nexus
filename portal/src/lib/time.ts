// portal/src/lib/time.ts
export const CENTRAL_TZ = 'America/Chicago';

const centralFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: CENTRAL_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function formatCentral(dt: Date): string {
  return centralFormatter.format(dt);
}

export function formatCentralTooltip(dt: Date): string {
  return `${centralFormatter.format(dt)} ${CENTRAL_TZ} · ${dt.toISOString()} (UTC)`;
}
