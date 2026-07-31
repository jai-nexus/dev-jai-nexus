import assert from "node:assert/strict";

import {
  MAX_GOVERNING_MOTION_ID_LENGTH,
  PROGRAM_BINDING_ARTIFACT_CLASSES,
  PROGRAM_BINDING_CONTRACT_VERSION,
  PROGRAM_BINDING_ENVELOPE_VERSION,
  compareProgramBindingSnapshots,
  createCompleteProgramBindingEnvelopeSet,
  createProgramBindingEnvelope,
  parseProgramBindingSnapshot,
  serializeProgramBindingEnvelope,
  validateCompleteProgramBindingEnvelopeSet,
  type ProgramBindingArtifactClass,
} from "./program-binding-propagation-boundary";
import { MAX_PROGRAM_LIFECYCLE_VERSION } from "./program-lifecycle-persistence-boundary";

const binding = Object.freeze({
  programId: "program-binding-fixture",
  lifecycleVersion: 7,
  governingMotionId: "motion-binding-fixture-v1",
  contractVersion: PROGRAM_BINDING_CONTRACT_VERSION,
});

const FOUR_CLASS_GOLDENS: Readonly<Record<ProgramBindingArtifactClass, string>> =
  Object.freeze({
    CONTROL_PLANE_REQUEST:
      '{"envelopeVersion":"jai-program-binding-envelope.v1","artifactClass":"CONTROL_PLANE_REQUEST","binding":{"programId":"program-binding-fixture","lifecycleVersion":7,"governingMotionId":"motion-binding-fixture-v1","contractVersion":"jai-program-binding.v1"},"payload":{"artifact":"CONTROL_PLANE_REQUEST","ordered":["first","second"]},"sourcePosture":"SUPPLIED_EXPECTED_SNAPSHOT","authorityEffect":"NONE"}',
    DECISION:
      '{"envelopeVersion":"jai-program-binding-envelope.v1","artifactClass":"DECISION","binding":{"programId":"program-binding-fixture","lifecycleVersion":7,"governingMotionId":"motion-binding-fixture-v1","contractVersion":"jai-program-binding.v1"},"payload":{"artifact":"DECISION","ordered":["first","second"]},"sourcePosture":"SUPPLIED_EXPECTED_SNAPSHOT","authorityEffect":"NONE"}',
    WORK_PACKET:
      '{"envelopeVersion":"jai-program-binding-envelope.v1","artifactClass":"WORK_PACKET","binding":{"programId":"program-binding-fixture","lifecycleVersion":7,"governingMotionId":"motion-binding-fixture-v1","contractVersion":"jai-program-binding.v1"},"payload":{"artifact":"WORK_PACKET","ordered":["first","second"]},"sourcePosture":"SUPPLIED_EXPECTED_SNAPSHOT","authorityEffect":"NONE"}',
    RECEIPT:
      '{"envelopeVersion":"jai-program-binding-envelope.v1","artifactClass":"RECEIPT","binding":{"programId":"program-binding-fixture","lifecycleVersion":7,"governingMotionId":"motion-binding-fixture-v1","contractVersion":"jai-program-binding.v1"},"payload":{"artifact":"RECEIPT","ordered":["first","second"]},"sourcePosture":"SUPPLIED_EXPECTED_SNAPSHOT","authorityEffect":"NONE"}',
  });

function bindingWith(values: Readonly<Record<string, unknown>>): Record<string, unknown> {
  return {
    programId: binding.programId,
    lifecycleVersion: binding.lifecycleVersion,
    governingMotionId: binding.governingMotionId,
    contractVersion: binding.contractVersion,
    ...values,
  };
}

function payloadFor(artifactClass: ProgramBindingArtifactClass) {
  return { artifact: artifactClass, ordered: ["first", "second"] };
}

function envelope(
  artifactClass: ProgramBindingArtifactClass,
  payload: unknown = payloadFor(artifactClass),
) {
  const value = createProgramBindingEnvelope({ artifactClass, binding, payload });
  assert.ok(value);
  assert.equal(value.envelopeVersion, PROGRAM_BINDING_ENVELOPE_VERSION);
  assert.equal(value.sourcePosture, "SUPPLIED_EXPECTED_SNAPSHOT");
  assert.equal(value.authorityEffect, "NONE");
  return value;
}

function createOwnProtoPayload(value: unknown): Record<string, unknown> {
  const payload = Object.create(null) as Record<string, unknown>;
  Object.defineProperty(payload, "__proto__", {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(payload, "ordinary", {
    value: "preserved",
    enumerable: true,
    writable: true,
    configurable: true,
  });
  return payload;
}

function assertDeepFrozenJson(value: unknown): void {
  if (value === null || typeof value !== "object") {
    return;
  }
  assert.equal(Object.isFrozen(value), true);
  if (Array.isArray(value)) {
    for (const item of value) {
      assertDeepFrozenJson(item);
    }
    return;
  }
  for (const key of Object.keys(value)) {
    assertDeepFrozenJson((value as Record<string, unknown>)[key]);
  }
}

function assertDeepDetachedJson(returned: unknown, input: unknown): void {
  assert.deepEqual(returned, input);
  if (input === null || typeof input !== "object") {
    return;
  }

  assert.notEqual(returned, input);
  assert.ok(returned && typeof returned === "object");
  if (Array.isArray(input)) {
    assert.equal(Array.isArray(returned), true);
    const returnedArray = returned as readonly unknown[];
    assert.equal(returnedArray.length, input.length);
    for (let index = 0; index < input.length; index += 1) {
      assertDeepDetachedJson(returnedArray[index], input[index]);
    }
    return;
  }

  assert.equal(Array.isArray(returned), false);
  const returnedRecord = returned as Record<string, unknown>;
  const inputRecord = input as Record<string, unknown>;
  assert.deepEqual(Object.keys(returnedRecord), Object.keys(inputRecord));
  for (const key of Object.keys(inputRecord)) {
    assert.equal(Object.hasOwn(returnedRecord, key), true);
    assertDeepDetachedJson(returnedRecord[key], inputRecord[key]);
  }
}

function testExactSnapshotAcceptanceAndIsolation() {
  const caller = bindingWith({});
  const parsed = parseProgramBindingSnapshot(caller);
  assert.ok(parsed);
  assert.deepEqual(Object.keys(parsed), [
    "programId",
    "lifecycleVersion",
    "governingMotionId",
    "contractVersion",
  ]);
  assert.equal(Object.isFrozen(parsed), true);
  assert.notEqual(parsed, caller);
  caller.programId = "altered-program";
  assert.equal(parsed.programId, binding.programId);
  assert.equal(Object.isFrozen(caller), false);
}

function testMalformedSnapshotInputsFailClosed() {
  const accessor = {};
  Object.defineProperty(accessor, "programId", {
    enumerable: true,
    get: () => binding.programId,
  });
  Object.assign(accessor, {
    lifecycleVersion: binding.lifecycleVersion,
    governingMotionId: binding.governingMotionId,
    contractVersion: binding.contractVersion,
  });

  const proxy = new Proxy(bindingWith({}), {});
  const symbol = Symbol("unexpected");
  const withSymbol = bindingWith({});
  Object.defineProperty(withSymbol, symbol, { value: "no", enumerable: true });

  for (const input of [
    null,
    [],
    { ...bindingWith({}), extra: "no" },
    { programId: binding.programId },
    accessor,
    proxy,
    withSymbol,
    bindingWith({ programId: 7 }),
    bindingWith({ lifecycleVersion: "7" }),
    bindingWith({ governingMotionId: 7 }),
    bindingWith({ contractVersion: 7 }),
    bindingWith({ programId: "Program-Uppercase" }),
    bindingWith({ programId: "program binding" }),
    bindingWith({ lifecycleVersion: -1 }),
    bindingWith({ lifecycleVersion: Number.MAX_SAFE_INTEGER + 1 }),
    bindingWith({ lifecycleVersion: 1.5 }),
    bindingWith({ lifecycleVersion: Number.POSITIVE_INFINITY }),
    bindingWith({ lifecycleVersion: MAX_PROGRAM_LIFECYCLE_VERSION + 1 }),
    bindingWith({ governingMotionId: "" }),
    bindingWith({ governingMotionId: "motion\nnewline" }),
    bindingWith({ governingMotionId: "motion\u0000control" }),
    bindingWith({ governingMotionId: "motion\u007Fdelete" }),
    bindingWith({ governingMotionId: "motion\u0085next-line" }),
    bindingWith({ governingMotionId: "motion\u2028line-separator" }),
    bindingWith({ governingMotionId: "motion\u2029paragraph-separator" }),
    bindingWith({ governingMotionId: "Cafe\u0301-motion" }),
    bindingWith({ governingMotionId: "x".repeat(MAX_GOVERNING_MOTION_ID_LENGTH + 1) }),
    bindingWith({ contractVersion: "other-contract" }),
  ]) {
    assert.equal(parseProgramBindingSnapshot(input), null);
  }
  assert.ok(parseProgramBindingSnapshot(bindingWith({ lifecycleVersion: 0 })));
  assert.ok(
    parseProgramBindingSnapshot(
      bindingWith({ lifecycleVersion: MAX_PROGRAM_LIFECYCLE_VERSION }),
    ),
  );
}

function testComparisonPrecedenceAndNoAuthority() {
  const cases: readonly [unknown, unknown, string][] = [
    [{ programId: "bad" }, bindingWith({ programId: "other-program", lifecycleVersion: 0 }), "INVALID_EXPECTED_SNAPSHOT"],
    [binding, null, "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT"],
    [binding, bindingWith({ programId: "other-program", lifecycleVersion: 0, governingMotionId: "other-motion", contractVersion: "other" }), "CROSS_PROGRAM_SUBSTITUTION"],
    [binding, bindingWith({ lifecycleVersion: 6, governingMotionId: "other-motion", contractVersion: "other" }), "STALE_LIFECYCLE_VERSION"],
    [binding, bindingWith({ lifecycleVersion: 8, governingMotionId: "other-motion", contractVersion: "other" }), "LIFECYCLE_VERSION_MISMATCH"],
    [binding, bindingWith({ governingMotionId: "different-motion", contractVersion: "other" }), "GOVERNING_MOTION_MISMATCH"],
    [binding, bindingWith({ contractVersion: "other" }), "CONTRACT_VERSION_MISMATCH"],
    [binding, binding, "EXACT_MATCH"],
  ];
  for (const [expected, candidate, kind] of cases) {
    const result = compareProgramBindingSnapshots(expected, candidate);
    assert.equal(result.kind, kind);
    assert.equal(result.authorityEffect, "NONE");
    if (result.expectedBinding) {
      assert.equal(Object.isFrozen(result.expectedBinding), true);
    }
    if (result.candidateBinding) {
      assert.equal(Object.isFrozen(result.candidateBinding), true);
    }
  }
  assert.equal(parseProgramBindingSnapshot(bindingWith({ contractVersion: "other" })), null);
}

function testFourClassGoldenSerializationAndPayloadSensitivity() {
  for (const artifactClass of PROGRAM_BINDING_ARTIFACT_CLASSES) {
    const value = envelope(artifactClass);
    assert.equal(serializeProgramBindingEnvelope(value), FOUR_CLASS_GOLDENS[artifactClass]);
  }

  const first = envelope("DECISION", { value: "first", ordered: ["one", "two"] });
  const fieldChanged = envelope("DECISION", { value: "second", ordered: ["one", "two"] });
  const orderChanged = envelope("DECISION", { value: "first", ordered: ["two", "one"] });
  assert.notEqual(serializeProgramBindingEnvelope(first), serializeProgramBindingEnvelope(fieldChanged));
  assert.notEqual(serializeProgramBindingEnvelope(first), serializeProgramBindingEnvelope(orderChanged));
}

function testProtoKeyPreservationAndPayloadIsolation() {
  const stringPayload = createOwnProtoPayload("string-value");
  const callerNestedArray = ["value", "in-order"];
  const callerNestedObject = { nested: callerNestedArray };
  const objectPayload = createOwnProtoPayload(callerNestedObject);
  const stringEnvelope = envelope("CONTROL_PLANE_REQUEST", stringPayload);
  const objectEnvelope = envelope("DECISION", objectPayload);
  const stringClone = stringEnvelope.payload as Record<string, unknown>;
  const objectClone = objectEnvelope.payload as Record<string, unknown>;
  const objectCloneValue = objectClone["__proto__"] as Record<string, unknown>;
  const objectCloneArray = objectCloneValue.nested as readonly string[];

  assert.notEqual(stringClone, stringPayload);
  assert.notEqual(objectClone, objectPayload);
  assert.notEqual(objectCloneValue, callerNestedObject);
  assert.notEqual(objectCloneArray, callerNestedArray);
  assert.equal(Object.getPrototypeOf(stringClone), null);
  assert.equal(Object.getPrototypeOf(objectClone), null);
  assert.equal(Object.getPrototypeOf(objectCloneValue), null);
  assert.equal(Object.hasOwn(stringClone, "__proto__"), true);
  assert.equal(Object.hasOwn(objectClone, "__proto__"), true);
  assert.equal(Object.isFrozen(stringPayload), false);
  assert.equal(Object.isFrozen(objectPayload), false);
  assert.equal(Object.isFrozen(callerNestedObject), false);
  assert.equal(Object.isFrozen(callerNestedArray), false);
  assertDeepFrozenJson(stringClone);
  assertDeepFrozenJson(objectClone);

  stringPayload.ordinary = "caller-altered";
  stringPayload["__proto__"] = "string-altered";
  objectPayload.ordinary = "caller-altered";
  objectPayload["__proto__"] = { replacement: true };
  callerNestedObject.nested[0] = "caller-altered";
  callerNestedArray.push("caller-added");

  assert.equal(stringClone.ordinary, "preserved");
  assert.equal(stringClone["__proto__"], "string-value");
  assert.equal(objectClone.ordinary, "preserved");
  assert.deepEqual(objectCloneArray, ["value", "in-order"]);

  const parsedString = JSON.parse(serializeProgramBindingEnvelope(stringEnvelope) ?? "");
  const parsedObject = JSON.parse(serializeProgramBindingEnvelope(objectEnvelope) ?? "");
  assert.equal(Object.hasOwn(parsedString.payload, "__proto__"), true);
  assert.equal(parsedString.payload["__proto__"], "string-value");
  assert.equal(Object.hasOwn(parsedObject.payload, "__proto__"), true);
  assert.deepEqual(parsedObject.payload["__proto__"].nested, ["value", "in-order"]);
}

function testEnvelopeRejectsUnsafePayloadsAndArrayPrototypes() {
  const accessor = {};
  Object.defineProperty(accessor, "value", {
    enumerable: true,
    get: () => "no",
  });
  const cyclic: { self?: unknown } = {};
  cyclic.self = cyclic;
  const sparse = new Array(1);
  const proxy = new Proxy({ value: "no" }, {});
  const customArray = ["value"];
  Object.setPrototypeOf(customArray, { custom: true });
  const nullPrototypeArray = ["value"];
  Object.setPrototypeOf(nullPrototypeArray, null);
  class ArraySubclass extends Array<string> {}
  const subclassArray = new ArraySubclass("value");
  const proxiedArray = new Proxy(["value"], {});
  const accessorArray = ["value"];
  Object.defineProperty(accessorArray, "0", {
    enumerable: true,
    get: () => "value",
  });
  const symbolArray = ["value"];
  Object.defineProperty(symbolArray, Symbol("unexpected"), {
    enumerable: true,
    value: "no",
  });
  const extraPropertyArray = ["value"] as string[] & { extra?: string };
  extraPropertyArray.extra = "no";

  for (const payload of [
    undefined,
    () => undefined,
    BigInt(1),
    Number.NaN,
    Number.NEGATIVE_INFINITY,
    new Date(),
    accessor,
    cyclic,
    sparse,
    proxy,
    customArray,
    nullPrototypeArray,
    subclassArray,
    proxiedArray,
    accessorArray,
    symbolArray,
    extraPropertyArray,
    { value: Symbol("no") },
  ]) {
    assert.equal(
      createProgramBindingEnvelope({ artifactClass: "DECISION", binding, payload }),
      null,
    );
  }
}

function testCompleteSetConstructionRejectionAndDetachment() {
  const rawPayloads: {
    artifact: string;
    nested: {
      object: { value: string };
      array: ({ value: string } | string[])[];
    };
    ordered: string[];
  }[] = PROGRAM_BINDING_ARTIFACT_CLASSES.map((artifactClass) => ({
    artifact: artifactClass,
    nested: {
      object: { value: artifactClass },
      array: [{ value: artifactClass }, ["first", "second"]],
    },
    ordered: ["first", "second"],
  }));
  const values = PROGRAM_BINDING_ARTIFACT_CLASSES.map((artifactClass, index) =>
    envelope(artifactClass, rawPayloads[index]),
  );
  const callerArray = [...values].reverse();
  const set = createCompleteProgramBindingEnvelopeSet(callerArray);
  assert.ok(set);
  assert.deepEqual(
    set.envelopes.map((value) => value.artifactClass),
    PROGRAM_BINDING_ARTIFACT_CLASSES,
  );
  assert.equal(set.sourcePosture, "SUPPLIED_EXPECTED_SNAPSHOT");
  assert.equal(set.authorityEffect, "NONE");
  assert.equal(Object.isFrozen(set), true);
  assert.equal(Object.isFrozen(set.envelopes), true);
  assert.equal(Object.isFrozen(set.binding), true);
  assert.notEqual(set.envelopes, callerArray);
  for (const value of set.envelopes) {
    const input = values.find((candidate) => candidate.artifactClass === value.artifactClass);
    assert.ok(input);
    assert.notEqual(value, input);
    assert.notEqual(value.binding, input.binding);
    assert.notEqual(value.payload, input.payload);
    assert.equal(Object.isFrozen(value), true);
    assert.equal(Object.isFrozen(value.binding), true);
    assert.equal(Object.isFrozen(value.payload), true);
    assertDeepFrozenJson(value.payload);
    const returnedPayload = value.payload as Record<string, unknown>;
    const inputPayload = input.payload as Record<string, unknown>;
    assertDeepDetachedJson(returnedPayload, inputPayload);
    assert.notEqual(returnedPayload.nested, inputPayload.nested);
    assert.notEqual(returnedPayload.ordered, inputPayload.ordered);
    const returnedNested = returnedPayload.nested as Record<string, unknown>;
    const inputNested = inputPayload.nested as Record<string, unknown>;
    assert.notEqual(returnedNested.object, inputNested.object);
    assert.notEqual(returnedNested.array, inputNested.array);
  }
  rawPayloads[0].nested.object.value = "caller-altered";
  rawPayloads[0].nested.array[0] = { value: "caller-altered" };
  rawPayloads[0].ordered.reverse();
  callerArray[0] = values[0];
  callerArray.reverse();
  const retainedPayload = set.envelopes[0].payload as Record<string, unknown>;
  const retainedNested = retainedPayload.nested as Record<string, unknown>;
  const retainedArray = retainedNested.array as readonly unknown[];
  assert.equal(
    (retainedNested.object as Record<string, unknown>).value,
    "CONTROL_PLANE_REQUEST",
  );
  assert.equal(
    (retainedArray[0] as Record<string, unknown>).value,
    "CONTROL_PLANE_REQUEST",
  );
  assert.deepEqual(retainedArray[1], ["first", "second"]);
  assert.deepEqual(retainedPayload.ordered, ["first", "second"]);
  assert.deepEqual(
    set.envelopes.map((value) => value.artifactClass),
    PROGRAM_BINDING_ARTIFACT_CLASSES,
  );
  assert.ok(validateCompleteProgramBindingEnvelopeSet(set));

  assert.equal(createCompleteProgramBindingEnvelopeSet(values.slice(0, 3)), null);
  assert.equal(
    createCompleteProgramBindingEnvelopeSet([
      values[0],
      values[1],
      values[3],
      envelope("RECEIPT", { duplicate: true }),
    ]),
    null,
    "two RECEIPT envelopes and no WORK_PACKET must reject",
  );

  for (const replacementBinding of [
    bindingWith({ programId: "other-program" }),
    bindingWith({ lifecycleVersion: 8 }),
    bindingWith({ governingMotionId: "other-motion" }),
  ]) {
    const replacement = createProgramBindingEnvelope({
      artifactClass: "RECEIPT",
      binding: replacementBinding,
      payload: { replacement: true },
    });
    assert.ok(replacement);
    assert.equal(
      createCompleteProgramBindingEnvelopeSet([
        values[0],
        values[1],
        values[2],
        replacement,
      ]),
      null,
    );
  }

  assert.equal(
    createProgramBindingEnvelope({
      artifactClass: "RECEIPT",
      binding: bindingWith({ contractVersion: "other" }),
      payload: { malformed: true },
    }),
    null,
  );
  const malformedContractEnvelope = Object.freeze({
    ...values[3],
    binding: Object.freeze({ ...values[3].binding, contractVersion: "other" }),
  });
  assert.equal(
    createCompleteProgramBindingEnvelopeSet([
      values[0],
      values[1],
      values[2],
      malformedContractEnvelope,
    ]),
    null,
  );

  const mutableNestedArraySet = Object.freeze({
    ...set,
    envelopes: [...set.envelopes],
  });
  assert.equal(validateCompleteProgramBindingEnvelopeSet(mutableNestedArraySet), null);
  const mutableTopLevelBindingSet = Object.freeze({
    ...set,
    binding: { ...set.binding },
  });
  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(mutableTopLevelBindingSet),
    null,
  );

  const first = set.envelopes[0];
  const rest = set.envelopes.slice(1);
  const frozenSetWith = (replacement: unknown) =>
    Object.freeze({ ...set, envelopes: Object.freeze([replacement, ...rest]) });
  const payload = first.payload as Record<string, unknown>;
  const nested = payload.nested as Record<string, unknown>;

  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(
      frozenSetWith({ ...first }),
    ),
    null,
  );
  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(
      frozenSetWith(Object.freeze({ ...first, binding: { ...first.binding } })),
    ),
    null,
  );
  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(
      frozenSetWith(Object.freeze({ ...first, payload: { ...payload } })),
    ),
    null,
  );
  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(
      frozenSetWith(Object.freeze({
        ...first,
        payload: Object.freeze({ ...payload, ordered: [...(payload.ordered as readonly string[])] }),
      })),
    ),
    null,
  );
  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(
      frozenSetWith(Object.freeze({
        ...first,
        payload: Object.freeze({ ...payload, nested: { ...nested } }),
      })),
    ),
    null,
  );
  assert.equal(
    validateCompleteProgramBindingEnvelopeSet(
      frozenSetWith(Object.freeze({
        ...first,
        payload: Object.freeze({
          ...payload,
          nested: Object.freeze({ ...nested, array: [...(nested.array as readonly unknown[])] }),
        }),
      })),
    ),
    null,
  );
}

function run() {
  testExactSnapshotAcceptanceAndIsolation();
  testMalformedSnapshotInputsFailClosed();
  testComparisonPrecedenceAndNoAuthority();
  testFourClassGoldenSerializationAndPayloadSensitivity();
  testProtoKeyPreservationAndPayloadIsolation();
  testEnvelopeRejectsUnsafePayloadsAndArrayPrototypes();
  testCompleteSetConstructionRejectionAndDetachment();
}

run();
