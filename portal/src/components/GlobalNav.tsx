"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Sync Runs" },
  { href: "/repos", label: "Repos" },
  { href: "/domains", label: "Domains" },
  { href: "/events", label: "Events" },
  { href: "/operator/events", label: "Operator", matchPrefix: "/operator" },
];

function isActiveLink(
  pathname: string,
  link: { href: string; matchPrefix?: string },
) {
  if (link.matchPrefix) {
    return pathname === link.matchPrefix || pathname.startsWith(`${link.matchPrefix}/`);
  }

  if (link.href === "/") {
    return pathname === "/";
  }

  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export function GlobalNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-3 shadow-[0_1px_0_rgba(148,163,184,0.06)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
        <div className="font-mono text-sm font-semibold uppercase tracking-[0.24em] text-slate-100">
          JAI NEXUS
        </div>
        <nav
          aria-label="Global navigation"
          className="flex flex-wrap items-center gap-2 text-xs"
        >
          {links.map((link) => {
            const active = isActiveLink(pathname, link);
            const baseClasses =
              "rounded-md border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70";
            const activeClasses =
              "border-amber-700 bg-slate-900 text-amber-300 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.12)]";
            const inactiveClasses =
              "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600 hover:bg-slate-900 hover:text-slate-100";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseClasses} ${
                  active ? activeClasses : inactiveClasses
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
