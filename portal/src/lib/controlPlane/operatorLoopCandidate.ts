import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type { DraftWorkPacket } from "@/lib/agents/workPacketTypes";

export const FIRST_OFFICIAL_LOOP_PACKET_ID = "wp-agent-registry-follow-up";

export interface OperatorLoopCandidate {
  packet_id: string;
  deliberation_candidate_id: string;
  label: string;
}

export function getFirstOfficialLoopPacket(): DraftWorkPacket {
  const packet = getDraftWorkPackets().find(
    (entry) => entry.packet_id === FIRST_OFFICIAL_LOOP_PACKET_ID,
  );

  if (!packet) {
    throw new Error(
      `First official operator loop packet not found: ${FIRST_OFFICIAL_LOOP_PACKET_ID}`,
    );
  }

  return packet;
}

export function getOperatorLoopCandidate(): OperatorLoopCandidate {
  const packet = getFirstOfficialLoopPacket();

  return {
    packet_id: packet.packet_id,
    deliberation_candidate_id: `candidate-${packet.packet_id}`,
    label: packet.title,
  };
}
