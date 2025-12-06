// portal/src/app/operator/layout.tsx
import type { ReactNode } from "react";
import { OperatorSubnav } from "@/components/operator/OperatorSubnav";

export const runtime = "nodejs";

export default function OperatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Global app layout already renders the top brand/nav.
  // This layout just adds the Operator-specific sub-nav
  // above whatever page is being rendered.
  return (
    <>
      <OperatorSubnav />
      {children}
    </>
  );
}
