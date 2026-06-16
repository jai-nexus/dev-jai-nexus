import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GlobalNav } from '@/components/GlobalNav';
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
      <body className="min-h-screen bg-slate-950 text-gray-100">
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
