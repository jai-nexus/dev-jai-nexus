import type { Metadata } from "next";

import {
  buildAllInboxQueues,
  buildAllOutboxQueues,
  buildCopyablePassalongPacket,
  buildRouteRecommendationText,
  getAuthorityFindings,
  getPassalongRecords,
  getSandboxTargetOptions,
  getThreadMemoryNonAuthorizations,
  getThreadMemoryRecords,
} from "@/lib/controlPlane/threadMemory";

import { PassalongRouterPrototype } from "./PassalongRouterPrototype";

export const metadata: Metadata = {
  title: "Control Thread Memory | dev.jai.nexus",
  description:
    "Local static JAI_Control_Thread memory and passalong-router prototype.",
};

export default function OperatorControlThreadPage() {
  const passalongs = getPassalongRecords();
  const selectedPassalong = passalongs[0];

  return (
    <PassalongRouterPrototype
      threadMemoryRecords={getThreadMemoryRecords()}
      passalongRecords={passalongs}
      inboxQueues={buildAllInboxQueues()}
      outboxQueues={buildAllOutboxQueues()}
      sandboxTargetOptions={getSandboxTargetOptions()}
      authorityFindings={[...getAuthorityFindings()]}
      nonAuthorizations={[...getThreadMemoryNonAuthorizations()]}
      initialPassalongId={selectedPassalong?.passalongId ?? ""}
      initialRouteRecommendation={
        selectedPassalong ? buildRouteRecommendationText(selectedPassalong) : ""
      }
      initialCopyablePacket={
        selectedPassalong ? buildCopyablePassalongPacket(selectedPassalong) : ""
      }
    />
  );
}
