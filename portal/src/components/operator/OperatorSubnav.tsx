"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";

const links = [
  { href: "/operator/events", label: "Events" },
  { href: "/operator/agents", label: "Agents" },
  { href: "/operator/grid", label: "Grid" },
  { href: "/operator/projects", label: "Projects" },
  { href: "/operator/work", label: "Work" },
  { href: "/operator/portfolio-status", label: "Portfolio" },
  { href: "/operator/deliberation", label: "Deliberation" },
  { href: "/operator/waves", label: "Waves" },
  { href: "/operator/chats", label: "Chats" },
  { href: "/operator/jai", label: "JAI" },
  { href: "/operator/control-plane", label: "Control Plane" },
  { href: "/operator/design-system", label: "Design System" },
  { href: "/operator/live-dashboard", label: "Live Dashboard" },
  { href: "/operator/council-prototype", label: "Council Prototype" },
  { href: "/operator/motions", label: "Motions" },
  { href: "/operator/decisions", label: "Decisions" },
  { href: "/operator/dct", label: "DCT" },
];

export function OperatorSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-800 bg-slate-950/95 shadow-[0_1px_0_rgba(148,163,184,0.06)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-8 py-2.5 text-xs">
        <nav
          aria-label="Operator views"
          className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
        >
          <div className="mr-2 flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Operator views
            </span>
            <span className="text-[10px] text-slate-600">
              Navigation is not authority.
            </span>
          </div>

          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            const baseClasses =
              "rounded-md border px-2 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70";
            const inactiveClasses =
              "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600 hover:bg-slate-900 hover:text-slate-100";
            const slateActiveClasses =
              "border-amber-700 bg-slate-900 text-amber-300 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.12)]";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseClasses} ${
                  active ? slateActiveClasses : inactiveClasses
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <LogoutButton />
      </div>
    </div>
  );
}
