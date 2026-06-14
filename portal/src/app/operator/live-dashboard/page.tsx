import type { Metadata } from "next";

import LiveDashboardPrototype from "./_components/LiveDashboardPrototype";

export const metadata: Metadata = {
  title: "Live Dashboard Prototype | dev.jai.nexus",
  description: "Local static, non-authorizing operator dashboard prototype.",
};

export default function OperatorLiveDashboardPage() {
  return <LiveDashboardPrototype />;
}
