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
import { listPersistedPassalongRecords } from "@/lib/controlPlane/threadMemory/passalong-persistence";

import { PassalongRouterPrototype } from "./PassalongRouterPrototype";

export const metadata: Metadata = {
  title: "Control Thread Memory | dev.jai.nexus",
  description:
    "Local static JAI_Control_Thread memory and passalong-router prototype.",
};

export const dynamic = "force-dynamic";

export default async function OperatorControlThreadPage() {
  const passalongs = getPassalongRecords();
  const selectedPassalong = passalongs[0];
  const persistedPassalongResult = await listPersistedPassalongRecords(50);

  return (
    <PassalongRouterPrototype
      threadMemoryRecords={getThreadMemoryRecords()}
      passalongRecords={passalongs}
      inboxQueues={buildAllInboxQueues()}
      outboxQueues={buildAllOutboxQueues()}
      sandboxTargetOptions={getSandboxTargetOptions()}
      authorityFindings={[...getAuthorityFindings()]}
      nonAuthorizations={[...getThreadMemoryNonAuthorizations()]}
      persistedPassalongRecords={persistedPassalongResult.records}
      persistenceStatus={{
        available: persistedPassalongResult.available,
        safeMessage: persistedPassalongResult.safeMessage,
        nonAuthorizations: persistedPassalongResult.nonAuthorizations,
      }}
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
