"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { OperatorBadge } from "./OperatorSlatePrimitives";

async function copyTextLocally(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the local selection-based copy.
    }
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.className = "absolute -left-full";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}

export function OperatorComposeButton({
  text,
  children,
  disabled = false,
  compact = false,
}: {
  text: string | (() => string);
  children: ReactNode;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (disabled) return;
    const value = typeof text === "function" ? text() : text;
    const succeeded = await copyTextLocally(value);
    if (succeeded) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded border font-mono uppercase tracking-wide ${
        compact ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs"
      } ${
        disabled
          ? "cursor-not-allowed border-slate-800 text-slate-600"
          : "border-emerald-700 text-emerald-300 hover:bg-emerald-950"
      }`}
    >
      <span aria-hidden="true">{copied ? "OK" : "CP"}</span>
      {copied ? "Copied" : children}
      <OperatorBadge
        tone={disabled ? "gated" : "composeOnly"}
        label={disabled ? "GATED / DISABLED" : "REAL-COMPOSE"}
      />
    </button>
  );
}

export function OperatorReadOnlyAction({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-sky-800 px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide text-sky-300">
      <span aria-hidden="true">RO</span>
      {children}
      <OperatorBadge tone="readOnly" label="READ-ONLY" />
    </span>
  );
}

export function OperatorGatedAction({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded border border-amber-800 px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide text-amber-500">
      <span aria-hidden="true">X</span>
      {children}
      <OperatorBadge tone="gated" label="GATED / DISABLED" />
    </span>
  );
}

export function OperatorBlockedAction({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded border border-red-900 px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide text-red-500">
      <span aria-hidden="true">NO</span>
      {children}
      <OperatorBadge tone="blocked" label="BLOCKED" />
    </span>
  );
}
