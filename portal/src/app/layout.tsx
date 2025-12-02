import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'JAI NEXUS · dev.jai.nexus',
  description: 'Control plane for JAI NEXUS repos, domains, and sync runs.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-gray-100 min-h-screen">
        <header className="border-b border-zinc-800 px-6 py-3 flex items-center gap-6">
          <div className="font-semibold tracking-wide">
            JAI NEXUS
          </div>
          <nav className="text-sm flex gap-4 text-gray-400">
            <Link href="/" className="hover:text-gray-100">
              Runs
            </Link>
            <Link href="/repos" className="hover:text-gray-100">
              Repos
            </Link>
            <Link href="/domains" className="hover:text-gray-100">
              Domains
            </Link>
            <Link href="/events" className="hover:text-gray-100">
              Events
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
