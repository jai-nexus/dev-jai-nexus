// portal/src/components/operator/OperatorSubnav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/operator/events", label: "Events" },
  { href: "/operator/agents", label: "Agents" },
  { href: "/operator/projects", label: "Projects" },
];

export function OperatorSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-8 py-2 text-xs">
        <span className="mr-3 text-[11px] uppercase tracking-wide text-gray-500">
          Operator views
        </span>
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          const baseClasses =
            "rounded-md px-2 py-1 transition-colors";
          const activeClasses =
            "bg-sky-900/60 text-sky-100";
          const inactiveClasses =
            "text-gray-400 hover:bg-zinc-900 hover:text-gray-100";

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${baseClasses} ${
                active ? activeClasses : inactiveClasses
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
