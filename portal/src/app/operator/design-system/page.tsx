import type { Metadata } from "next";

import OperatorDesignSystemPanel from "./_components/OperatorDesignSystemPanel";

export const metadata: Metadata = {
  title: "Operator Design System Prototype | dev.jai.nexus",
  description: "Local static, non-authorizing Operator Slate style prototype.",
};

export default function OperatorDesignSystemPage() {
  return <OperatorDesignSystemPanel />;
}
