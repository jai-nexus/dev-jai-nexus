import type { Metadata } from "next";

import CouncilPanelPrototype from "./_components/CouncilPanelPrototype";

export const metadata: Metadata = {
  title: "Council Panel Prototype | dev.jai.nexus",
  description: "Local static, advisory, non-authorizing Council panel prototype.",
};

export default function OperatorCouncilPrototypePage() {
  return <CouncilPanelPrototype />;
}
