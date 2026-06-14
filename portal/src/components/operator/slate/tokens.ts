export const operatorSlateToneClasses = {
  neutral: "border-slate-600 bg-slate-800 text-slate-300",
  fixture: "border-slate-600 bg-slate-900 text-slate-400",
  canonical: "border-emerald-700 bg-emerald-950 text-emerald-300",
  advisory: "border-amber-700 bg-amber-950 text-amber-300",
  warning: "border-amber-600 bg-amber-900 text-amber-200",
  danger: "border-red-800 bg-red-950 text-red-300",
  gated: "border-amber-700 bg-slate-900 text-amber-400",
  blocked: "border-red-800 bg-red-950 text-red-300",
  pending: "border-sky-800 bg-sky-950 text-sky-300",
  readOnly: "border-sky-800 bg-sky-950 text-sky-300",
  composeOnly: "border-emerald-700 bg-emerald-950 text-emerald-300",
  contradiction: "border-red-900 bg-red-950 text-red-300",
  dissent: "border-red-900 bg-red-950 text-red-200",
} as const;

export type OperatorSlateTone = keyof typeof operatorSlateToneClasses;

export const operatorSlateSurfaces = {
  page: "bg-slate-950 text-slate-300",
  panel: "border-slate-800 bg-slate-900",
  elevatedPanel: "border-slate-700 bg-slate-800",
  border: "border-slate-800",
  mutedText: "text-slate-500",
  primaryText: "text-slate-100",
} as const;
