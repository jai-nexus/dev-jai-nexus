// portal/src/app/operator/grid/page.tsx
//
// Server component — loads canonical grid config and passes to client GridView.
// No database access. No writes. Derives topology from agency config + execution roles.
// Part of motion-0129: JAI Grid Configuration Mode v0.

export const runtime = "nodejs";
export const revalidate = 0;

import { loadGridConfig } from "@/lib/grid/gridConfig";
import { GridView } from "./GridView";

export default function GridPage() {
  const config = loadGridConfig();
  return <GridView config={config} />;
}
