import assert from "node:assert/strict";
import test from "node:test";
import rolemap from "../../../../../roles/rolemap.json";
import { importLegacyPing, parseAddress, validatePacket } from "./packetContract";

const sha = "a".repeat(40);
const seat = "JAI::DEV::BUILDER";
const instance = seat + "::GPT-6.2-ASTRA::EXTRA-HIGH::2026-11-20.02";
const ping = { protocol: "JAI::PING:1.1", packet_id: "PING-B1", in_reply_to: null,
  from: "JAI::COUNCIL::ARCHITECT", to: seat, delivery_mode: "ROLE_ANYCAST", expected_base_sha: sha,
  repo_mutations_authorized: true, action_scope: ["inspect receipt"], authority_from_address: false,
  layer_2_spend_usd: 0, verifier_authority: false, merge_authorized: false };
const context = { currentBaseSha: sha };

test("positional seats retain every known dev role and validate dated sessions", () => {
  for (const role of rolemap.knownRoles) assert.equal(parseAddress(role).seat, role);
  assert.deepEqual(parseAddress(instance), { seat, session: true, declared: true });
  for (const id of [seat + "::GPT", instance + "::EXTRA", instance.replace("11-20", "02-30"),
    instance.replace(".02", ".2"), instance.replace("BUILDER", "MADE_UP"), instance.replace("EXTRA-HIGH", "")])
    assert.throws(() => parseAddress(id));
});

test("address scope and unicast attestation are independent checks", () => {
  validatePacket(ping, context);
  const broadcast = { ...ping, delivery_mode: "PLANE_BROADCAST", to: "JAI::DEV", repo_mutations_authorized: false };
  validatePacket(broadcast, context);
  assert.throws(() => validatePacket({ ...broadcast, repo_mutations_authorized: true }, context));
  assert.throws(() => validatePacket({ ...ping, to: instance }, context));
  const unicast = { ...ping, delivery_mode: "INSTANCE_UNICAST", to: instance };
  validatePacket(unicast, { ...context, attestedRecipient: instance });
  assert.throws(() => validatePacket(unicast, context));
  const undeclared = instance.replace("EXTRA-HIGH", "UNDECLARED");
  assert.equal(parseAddress(undeclared).declared, false);
  assert.throws(() => validatePacket({ ...unicast, to: undeclared }, { ...context, attestedRecipient: undeclared }));
});

test("reply correlation, exact base and explicit limits fail closed", () => {
  const pong = { ...ping, protocol: "JAI::PONG:1.1", packet_id: "PONG-B1", in_reply_to: ping.packet_id };
  validatePacket(pong, { ...context, replyTo: ping.packet_id });
  assert.throws(() => validatePacket(pong, { ...context, replyTo: "different" }));
  for (const change of [{ protocol: "JAI::PING/1.0" }, { packet_id: "" }, { delivery_mode: "ALL" },
    { expected_base_sha: "b".repeat(40) }, { expected_base_sha: "abc" }, { action_scope: [] },
    { authority_from_address: true }, { repo_mutations_authorized: undefined }, { layer_2_spend_usd: 1 },
    { verifier_authority: true }, { merge_authorized: true }]) {
    assert.throws(() => validatePacket({ ...ping, ...change }, context));
  }
});

test("legacy import projects a read-only provenance record", () => {
  const legacy = importLegacyPing({ protocol: "JAI::PING/1.0", envelope_id: "legacy-1", repo_mutations_authorized: true });
  assert.equal(legacy.repo_mutations_authorized, false);
  assert.equal(legacy.authority_granted, false);
  assert.ok(Object.isFrozen(legacy));
  assert.throws(() => validatePacket(legacy, context));
  assert.throws(() => importLegacyPing(ping));
});
