export type DeliveryMode = "PLANE_BROADCAST" | "ROLE_ANYCAST" | "INSTANCE_UNICAST";
export type Packet = {
  protocol: "JAI::PING:1.1" | "JAI::PONG:1.1";
  packet_id: string;
  in_reply_to: string | null;
  from: string;
  to: string;
  expected_base_sha: string;
  delivery_mode: DeliveryMode;
  action_scope: readonly string[];
  repo_mutations_authorized: boolean;
  authority_from_address: false;
  layer_2_spend_usd: 0;
  verifier_authority: false;
  merge_authorized: false;
};

const seatSegment = /^[A-Z][A-Z0-9_]*$/;
const repositorySeats = new Set(["JAI::DEV::BUILDER", "JAI::DEV::VERIFIER", "JAI::DEV::OPERATOR",
  "JAI::DEV::ARCHITECT", "JAI::DEV::LIBRARIAN"]);
const idPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

export function parseAddress(id: string) {
  const parts = id.split("::");
  const [prefix, plane, role, model, effort, instance] = parts;
  const seat = parts.slice(0, 3).join("::");
  if (prefix !== "JAI" || !seatSegment.test(plane) || !seatSegment.test(role))
    throw new Error("Unknown seat");
  if (parts.length === 3) return { seat, session: false, declared: false };
  const token = /^[A-Z0-9]+(?:[._-][A-Z0-9]+)*$/;
  if (parts.length !== 6 || !token.test(model) || !token.test(effort) ||
      !/^\d{4}-\d{2}-\d{2}(?:\.\d{2})?$/.test(instance)) throw new Error("Invalid positional JAI session");
  const date = instance.slice(0, 10);
  const time = Date.parse(date + "T00:00:00Z");
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date)
    throw new Error("Invalid session date");
  return { seat, session: true, declared: !parts.includes("UNDECLARED") };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// The expected reply and independently identified recipient come from the caller's
// trusted context. Neither value is read from an attestation inside the envelope.
export function validatePacket(value: unknown, context: {
  currentBaseSha: string; replyTo?: string; attestedRecipient?: string;
}): asserts value is Packet {
  if (!isRecord(value) || (value.protocol !== "JAI::PING:1.1" && value.protocol !== "JAI::PONG:1.1"))
    throw new Error("Invalid packet protocol");
  const fields: (keyof Packet)[] = ["protocol", "packet_id", "in_reply_to", "from", "to", "expected_base_sha",
    "delivery_mode", "action_scope", "repo_mutations_authorized", "authority_from_address", "layer_2_spend_usd",
    "verifier_authority", "merge_authorized"];
  if (Object.keys(value).length !== fields.length || !fields.every(key => Object.hasOwn(value, key)))
    throw new Error("Unexpected packet fields");
  if (typeof value.packet_id !== "string" || !idPattern.test(value.packet_id)) throw new Error("Invalid packet ID");
  if (value.protocol === "JAI::PONG:1.1") {
    if (typeof value.in_reply_to !== "string" || !idPattern.test(value.in_reply_to) ||
        value.in_reply_to === value.packet_id || value.in_reply_to !== context.replyTo) throw new Error("Unbound reply");
  } else if (value.in_reply_to !== null) throw new Error("PING requires a null reply reference");

  if (typeof value.expected_base_sha !== "string" || !/^[0-9a-f]{40}$/.test(value.expected_base_sha) ||
      value.expected_base_sha !== context.currentBaseSha) throw new Error("Invalid or stale packet base");
  if (!Array.isArray(value.action_scope) || !value.action_scope.length ||
      !Array.from(value.action_scope).every(item => typeof item === "string" && item.trim().length > 0))
    throw new Error("Missing action scope");
  if (typeof value.repo_mutations_authorized !== "boolean" || value.authority_from_address !== false ||
      value.layer_2_spend_usd !== 0 || value.verifier_authority !== false || value.merge_authorized !== false)
    throw new Error("Missing or conflicting non-authorizations");
  if (typeof value.from !== "string" || typeof value.to !== "string") throw new Error("Missing addresses");
  parseAddress(value.from);
  if (value.repo_mutations_authorized && !repositorySeats.has(parseAddress(value.to).seat))
    throw new Error("Repository mutation requires a repository role");
  switch (value.delivery_mode) {
    case "PLANE_BROADCAST":
      if (!value.to.startsWith("JAI::") || !seatSegment.test(value.to.slice(5)) || value.repo_mutations_authorized)
        throw new Error("Broadcast requires a plane and read-only scope");
      break;
    case "ROLE_ANYCAST":
      if (parseAddress(value.to).session) throw new Error("Anycast requires a seat");
      break;
    case "INSTANCE_UNICAST": {
      const target = parseAddress(value.to);
      if (!target.session || !target.declared || value.to !== context.attestedRecipient)
        throw new Error("Unicast requires an independently attested instance");
      break;
    }
    default: throw new Error("Unknown delivery mode");
  }
}

export function importLegacyPing(value: unknown) {
  if (!isRecord(value) || value.protocol !== "JAI::PING/1.0" ||
      typeof value.envelope_id !== "string" || !idPattern.test(value.envelope_id))
    throw new Error("Invalid legacy PING");
  return Object.freeze({ source_id: value.envelope_id, protocol: "JAI::PING/1.0",
    read_only: true, repo_mutations_authorized: false, authority_granted: false } as const);
}
