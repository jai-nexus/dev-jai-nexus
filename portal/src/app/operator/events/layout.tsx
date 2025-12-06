// portal/src/app/operator/events/layout.tsx
import type { ReactNode } from "react";

export const runtime = "nodejs";
export const revalidate = 0;

// This MUST be a React component – that’s what Next is complaining about
export default function OperatorEventsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // No extra chrome for now – just render the children.
  // /operator/layout.tsx will handle the main Operator shell + nav.
  return <>{children}</>;
}
