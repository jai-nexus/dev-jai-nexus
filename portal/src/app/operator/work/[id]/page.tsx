export const runtime = "nodejs";
export const revalidate = 0;

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { diffWorkPacket, emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import { WorkPacketStatus, type Prisma } from "@prisma/client";
import {
  getAgentByNhId,
  isAgentEligibleForExecutionRole,
  type ExecutionRole,
} from "@/lib/agencyConfig";
import {
  getActivationOutcomeFromTags,
  coerceStringArray,
  getCostCategoryFromTags,
  deriveRequestedRoleFromAgentKey,
  getAssigneeFromTags,
  getMotionFromTags,
} from "@/lib/work/workPacketContract";
import { computeWorkPacketControlState } from "@/lib/work/workPacketLifecycle";
import { computeExecutionLaneState } from "@/lib/work/executionLane";
import { applyPacketRouteAction, type PacketRouteAction } from "@/lib/work/workPacketActions";
import {
  DEBUG_LOOP_EVENT_KINDS,
  HANDOFF_EVENT_KINDS,
  RUNTIME_EVENT_KINDS,
  toHandoffEntry,
  toRunLedgerEntry,
} from "@/lib/work/agentRunContract";

type Props = {
  params: Promise<{ id: string }>;
};

const ALLOWED_STATUSES = new Set(Object.values(WorkPacketStatus));
const DEBUG_KIND_SET = new Set<string>([...DEBUG_LOOP_EVENT_KINDS]);
const RUNTIME_KIND_SET = new Set<string>([...RUNTIME_EVENT_KINDS]);
const HANDOFF_KIND_SET = new Set<string>([
  ...HANDOFF_EVENT_KINDS,
  "WORK_ROUTED",
  "WORK_REVIEW_REQUESTED",
  "WORK_APPROVED",
]);

type JsonValue = Prisma.JsonValue;
type JsonObject = Record<string, JsonValue>;

type SliceStageState = "MISSING" | "READY" | "IN_PROGRESS" | "COMPLETE";

function parseStatus(value: unknown): WorkPacketStatus {
  const s = String(value ?? WorkPacketStatus.DRAFT).trim();
  return ALLOWED_STATUSES.has(s as WorkPacketStatus)
    ? (s as WorkPacketStatus)
    : WorkPacketStatus.DRAFT;
}

function isJsonObject(v: JsonValue | null | undefined): v is JsonObject {
  return v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v);
}

function getJsonProp(v: JsonValue | null | undefined, key: string): JsonValue | undefined {
  if (!isJsonObject(v)) return undefined;
  return v[key];
}

function getNestedPayloadData(payload: JsonValue | null | undefined): JsonValue | undefined {
  const directData = getJsonProp(payload, "data");
  if (directData !== undefined) return directData;

  const nestedPayload = getJsonProp(payload, "payload");
  return getJsonProp(nestedPayload, "data");
}

function normalizeRoleLike(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

function parseRequestedRole(value: unknown): ExecutionRole | null {
  const raw = normalizeRoleLike(value);

  if (raw === "ARCHITECT") return "ARCHITECT";
  if (raw === "BUILDER") return "BUILDER";
  if (raw === "VERIFIER") return "VERIFIER";
  if (raw === "LIBRARIAN") return "LIBRARIAN";
  if (raw === "OPERATOR" || raw === "OPERATOR_REVIEW") return "OPERATOR";

  return null;
}

function getRequestedRoleFromTags(tags: string[]): ExecutionRole | null {
  const hit = tags.find((t) => typeof t === "string" && t.startsWith("route:"));
  if (!hit) return null;
  return parseRequestedRole(hit.slice("route:".length));
}

function getRequestedRoleFromPayload(payload: JsonValue | null | undefined): ExecutionRole | null {
  const data = getNestedPayloadData(payload);

  const explicitRole = parseRequestedRole(getJsonProp(data, "requestedRole"));
  if (explicitRole) return explicitRole;

  const targetLaneRole = parseRequestedRole(getJsonProp(data, "targetLane"));
  if (targetLaneRole) return targetLaneRole;

  return null;
}

function getPayloadChanges(payload: JsonValue | null | undefined): JsonValue | undefined {
  const data = getNestedPayloadData(payload);
  return getJsonProp(data, "changes");
}

function toneForControl(tone: string) {
  if (tone === "emerald") return "bg-emerald-900/50 text-emerald-200 border-emerald-800";
  if (tone === "sky") return "bg-sky-900/50 text-sky-200 border-sky-800";
  if (tone === "amber") return "bg-amber-900/40 text-amber-200 border-amber-800";
  if (tone === "purple") return "bg-purple-900/50 text-purple-200 border-purple-800";
  if (tone === "red") return "bg-red-900/40 text-red-200 border-red-800";
  return "bg-zinc-900 text-gray-200 border-gray-800";
}

function toneForLane(lane: string) {
  if (lane === "COMPLETE") return "bg-emerald-900/50 text-emerald-200 border-emerald-800";
  if (lane === "ATTENTION") return "bg-red-900/40 text-red-200 border-red-800";
  if (lane === "VERIFIER") return "bg-purple-900/50 text-purple-200 border-purple-800";
  if (lane === "BUILDER") return "bg-sky-900/50 text-sky-200 border-sky-800";
  if (lane === "ARCHITECT") return "bg-amber-900/40 text-amber-200 border-amber-800";
  if (lane === "OPERATOR_REVIEW") return "bg-emerald-900/50 text-emerald-200 border-emerald-800";
  return "bg-zinc-900 text-gray-200 border-gray-800";
}

function toneForSliceState(state: SliceStageState) {
  if (state === "COMPLETE") return "bg-emerald-900/50 text-emerald-200 border-emerald-800";
  if (state === "IN_PROGRESS") return "bg-sky-900/50 text-sky-200 border-sky-800";
  if (state === "READY") return "bg-amber-900/40 text-amber-200 border-amber-800";
  return "bg-zinc-900 text-gray-200 border-gray-800";
}

function stageStateLabel(state: SliceStageState) {
  if (state === "IN_PROGRESS") return "IN PROGRESS";
  return state;
}

function toneForEligibility(valid: boolean | null) {
  if (valid === true) return "bg-emerald-900/50 text-emerald-200 border-emerald-800";
  if (valid === false) return "bg-red-900/40 text-red-200 border-red-800";
  return "bg-zinc-900 text-gray-200 border-gray-800";
}

function labelForEligibility(valid: boolean | null) {
  if (valid === true) return "VALID";
  if (valid === false) return "INVALID";
  return "N/A";
}

function findRepoRoot(startDir: string): string | null {
  let dir = startDir;
  for (let i = 0; i < 20; i++) {
    if (fs.existsSync(path.join(dir, ".nexus"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}

type GoverningMotionState = {
  motionId: string;
  title: string | null;
  decisionStatus: string | null;
  handoffStatus: string | null;
  receiptStatus: string | null;
  costCategory: string | null;
  activationOutcome: string | null;
  activationRecordedAt: string | null;
};

function loadGoverningMotionState(inboxTags: string[]): GoverningMotionState | null {
  const motionId = getMotionFromTags(inboxTags);
  if (!motionId) return null;
  const repoRoot = findRepoRoot(process.cwd());
  const taggedCostCategory = getCostCategoryFromTags(inboxTags);
  const taggedActivationOutcome = getActivationOutcomeFromTags(inboxTags);
  if (!repoRoot) {
    return {
      motionId,
      title: null,
      decisionStatus: null,
      handoffStatus: null,
      receiptStatus: null,
      costCategory: taggedCostCategory,
      activationOutcome: taggedActivationOutcome,
      activationRecordedAt: null,
    };
  }
  const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
  let title: string | null = null;
  try {
    const yaml = fs.readFileSync(path.join(motionDir, "motion.yaml"), "utf-8");
    const m = yaml.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (m) title = m[1].trim();
  } catch { }
  let decisionStatus: string | null = null;
  try {
    const yaml = fs.readFileSync(path.join(motionDir, "decision.yaml"), "utf-8");
    const m = yaml.match(/^status:\s*(\S+)/m);
    if (m) decisionStatus = m[1].trim();
  } catch { }
  let handoffStatus: string | null = null;
  let handoffCorpusCostCategory: string | null = null;
  let handoffCorpusOutcome: string | null = null;
  let handoffRecordedAt: string | null = null;
  try {
    const raw = fs.readFileSync(path.join(motionDir, "execution.handoff.json"), "utf-8");
    const obj = JSON.parse(raw) as Record<string, unknown>;
    if (typeof obj.status === "string") handoffStatus = obj.status;
    const corpusV2 = isJsonObject(obj.corpus_v2 as JsonValue | null | undefined)
      ? (obj.corpus_v2 as JsonObject)
      : null;
    if (typeof corpusV2?.cost_category === "string") handoffCorpusCostCategory = corpusV2.cost_category;
    if (typeof corpusV2?.activation_outcome === "string") handoffCorpusOutcome = corpusV2.activation_outcome;
    if (typeof corpusV2?.activation_recorded_at === "string") handoffRecordedAt = corpusV2.activation_recorded_at;
  } catch { }
  let receiptStatus: string | null = null;
  let receiptCorpusCostCategory: string | null = null;
  let receiptCorpusOutcome: string | null = null;
  let receiptRecordedAt: string | null = null;
  try {
    const raw = fs.readFileSync(path.join(motionDir, "execution.receipt.json"), "utf-8");
    const obj = JSON.parse(raw) as Record<string, unknown>;
    if (typeof obj.status === "string") receiptStatus = obj.status;
    const corpusV2 = isJsonObject(obj.corpus_v2 as JsonValue | null | undefined)
      ? (obj.corpus_v2 as JsonObject)
      : null;
    if (typeof corpusV2?.cost_category === "string") receiptCorpusCostCategory = corpusV2.cost_category;
    if (typeof corpusV2?.activation_outcome === "string") receiptCorpusOutcome = corpusV2.activation_outcome;
    if (typeof corpusV2?.activation_recorded_at === "string") receiptRecordedAt = corpusV2.activation_recorded_at;
  } catch { }
  let artifactCostCategory: string | null = null;
  let artifactActivationOutcome: string | null = null;
  let activationRecordedAt: string | null = null;
  try {
    const raw = fs.readFileSync(path.join(motionDir, "execution.activation.json"), "utf-8");
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const corpusV2 = isJsonObject(obj.corpus_v2 as JsonValue | null | undefined)
      ? (obj.corpus_v2 as JsonObject)
      : null;
    if (typeof corpusV2?.cost_category === "string") artifactCostCategory = corpusV2.cost_category;
    if (typeof corpusV2?.outcome === "string") artifactActivationOutcome = corpusV2.outcome;
    if (typeof obj.recorded_at === "string") activationRecordedAt = obj.recorded_at;
  } catch { }
  return {
    motionId,
    title,
    decisionStatus,
    handoffStatus,
    receiptStatus,
    costCategory:
      receiptCorpusCostCategory ??
      handoffCorpusCostCategory ??
      artifactCostCategory ??
      taggedCostCategory,
    activationOutcome:
      receiptCorpusOutcome ??
      handoffCorpusOutcome ??
      artifactActivationOutcome ??
      taggedActivationOutcome,
    activationRecordedAt: receiptRecordedAt ?? handoffRecordedAt ?? activationRecordedAt,
  };
}

type LoopCoherenceVerdict = "COHERENT" | "PROGRESSING" | "INCOHERENT" | "NOT_GOVERNED";

type LoopCoherenceState = {
  verdict: LoopCoherenceVerdict;
  reasons: string[];
};

function computeLoopCoherence(args: {
  governingMotion: GoverningMotionState | null;
  architectPresent: boolean;
  builderPresent: boolean;
  verifierPresent: boolean;
  operatorDecisionKind: string | null;
}): LoopCoherenceState {
  if (!args.governingMotion) {
    return { verdict: "NOT_GOVERNED", reasons: ["No motion tag — packet is not motion-linked."] };
  }
  const { decisionStatus, handoffStatus, receiptStatus } = args.governingMotion;
  const reasons: string[] = [];

  if (decisionStatus !== "RATIFIED") {
    reasons.push(`Council decision is not RATIFIED (found: ${decisionStatus ?? "absent"}).`);
  }
  if (handoffStatus !== "ISSUED") {
    reasons.push(`Execution handoff is not ISSUED (found: ${handoffStatus ?? "absent"}).`);
  }
  if (reasons.length > 0) {
    return { verdict: "INCOHERENT", reasons };
  }

  if (!args.architectPresent) reasons.push("Architect evidence (debug.plan) is absent.");
  if (!args.builderPresent) reasons.push("Builder evidence (debug.patch) is absent.");
  if (!args.verifierPresent) reasons.push("Verifier evidence (debug.verify) is absent.");
  if (args.operatorDecisionKind !== "WORK_APPROVED") {
    reasons.push("Operator approval (WORK_APPROVED) not yet recorded.");
  }
  if (receiptStatus !== "COMPLETED") {
    reasons.push(`Receipt is not COMPLETED (found: ${receiptStatus ?? "pending"}).`);
  }
  if (reasons.length > 0) {
    return { verdict: "PROGRESSING", reasons };
  }

  return {
    verdict: "COHERENT",
    reasons: ["All governed conditions met: RATIFIED → ISSUED → executed → approved → COMPLETED."],
  };
}

function writeReceiptArtifact(
  motionId: string,
  packetNhId: string,
  action: "APPROVE" | "REQUEST_CHANGES" | "REQUEUE",
  actor: { email: string | null; name: string | null },
): void {
  const repoRoot = findRepoRoot(process.cwd());
  if (!repoRoot) {
    console.warn("[receipt] repo root not found; skipping receipt write");
    return;
  }
  const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
  try {
    if (!fs.existsSync(motionDir)) {
      console.warn(`[receipt] motion dir not found: ${motionDir}; skipping`);
      return;
    }
    const outcome =
      action === "APPROVE" ? "COMPLETED" :
      action === "REQUEST_CHANGES" ? "CHANGES_REQUESTED" : "REQUEUED";
    const closedBy = actor.email ? `operator:${actor.email}` : "operator:unknown";
    let handoffCorpus: Record<string, unknown> | null = null;
    try {
      const raw = fs.readFileSync(path.join(motionDir, "execution.handoff.json"), "utf-8");
      const handoff = JSON.parse(raw) as Record<string, unknown>;
      if (isJsonObject(handoff.corpus_v2 as JsonValue | null | undefined)) {
        handoffCorpus = handoff.corpus_v2 as JsonObject;
      }
    } catch { }
    let activationArtifact: Record<string, unknown> | null = null;
    try {
      const raw = fs.readFileSync(path.join(motionDir, "execution.activation.json"), "utf-8");
      activationArtifact = JSON.parse(raw) as Record<string, unknown>;
    } catch { }
    const activationCorpus =
      isJsonObject(activationArtifact?.corpus_v2 as JsonValue | null | undefined)
        ? (activationArtifact?.corpus_v2 as JsonObject)
        : null;
    const receipt = {
      version: "0.1",
      motion_id: motionId,
      packet_nh_id: packetNhId,
      receipt_id: `${motionId}-receipt-001`,
      closed_at: new Date().toISOString(),
      closed_by: closedBy,
      outcome,
      status: outcome,
      operator_action: action,
      notes: "Operator decision recorded via dev-jai-nexus operator surface.",
      corpus_v2: {
        cost_category: handoffCorpus?.cost_category ?? activationCorpus?.cost_category ?? null,
        cost_basis: handoffCorpus?.cost_basis ?? activationCorpus?.cost_basis ?? null,
        tier_hint: handoffCorpus?.tier_hint ?? activationCorpus?.tier_hint ?? null,
        requires_operator_escalation:
          handoffCorpus?.requires_operator_escalation ??
          activationCorpus?.requires_operator_escalation ??
          false,
        activation_outcome: handoffCorpus?.activation_outcome ?? activationCorpus?.outcome ?? null,
        activation_recorded_at:
          handoffCorpus?.activation_recorded_at ??
          activationArtifact?.recorded_at ??
          null,
        activation_reasons:
          handoffCorpus?.activation_reasons ?? activationCorpus?.reasons ?? [],
      },
    };
    fs.writeFileSync(
      path.join(motionDir, "execution.receipt.json"),
      JSON.stringify(receipt, null, 2) + "\n",
      "utf-8",
    );
  } catch (err) {
    console.warn("[receipt] failed to write execution.receipt.json:", err);
  }
}

async function runDecisionAction(
  packetId: number,
  action: "APPROVE" | "REQUEST_CHANGES" | "REQUEUE",
) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  const actor = { email: user.email ?? null, name: user.name ?? null };

  const latestInboxForDecision = await prisma.agentInboxItem.findFirst({
    where: { workPacketId: packetId },
    orderBy: { id: "desc" },
    select: { tags: true },
  });
  const decisionInboxTags = coerceStringArray(latestInboxForDecision?.tags);
  const decisionMotionId = getMotionFromTags(decisionInboxTags);

  const packetForReceipt = decisionMotionId
    ? await prisma.workPacket.findUnique({
        where: { id: packetId },
        select: { nhId: true },
      })
    : null;

  await applyPacketRouteAction({ packetId, action, actor });

  if (decisionMotionId && packetForReceipt) {
    writeReceiptArtifact(decisionMotionId, packetForReceipt.nhId, action, actor);
  }

  redirect(`/operator/work/${packetId}`);
}

async function updatePacket(id: number, formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const status = parseStatus(formData.get("status"));
  const ac = String(formData.get("ac") ?? "");
  const plan = String(formData.get("plan") ?? "");

  const githubIssueUrl = String(formData.get("githubIssueUrl") ?? "").trim() || null;
  const githubPrUrl = String(formData.get("githubPrUrl") ?? "").trim() || null;
  const verificationUrl = String(formData.get("verificationUrl") ?? "").trim() || null;

  if (!nhId || !title) redirect(`/operator/work/${id}`);

  const mutationId = crypto.randomUUID();

  const result = await prisma.$transaction(async (tx) => {
    const before = await tx.workPacket.findUnique({ where: { id } });
    if (!before) return { type: "missing" as const };

    const after = await tx.workPacket.update({
      where: { id },
      data: {
        title,
        nhId,
        status,
        ac,
        plan,
        githubIssueUrl,
        githubPrUrl,
        verificationUrl,
      },
    });

    const { changes, statusChanged } = diffWorkPacket(before, after);

    if (!statusChanged && Object.keys(changes).length === 0) {
      return { type: "noop" as const };
    }

    const kind = statusChanged ? "WORK_PACKET_STATUS_CHANGED" : "WORK_PACKET_UPDATED";

    const summary = statusChanged
      ? `WorkPacket status: ${after.nhId} ${String(statusChanged.from)} -> ${String(statusChanged.to)}`
      : `WorkPacket updated: ${after.nhId} · ${after.title}`;

    const data: Prisma.InputJsonValue = {
      contract_version: "work-packet-0.1",
      workPacketId: after.id,
      changes,
      ...(statusChanged ? { statusChanged } : {}),
    };

    await emitWorkPacketSotEvent({
      db: tx,
      kind,
      nhId: after.nhId,
      repoId: after.repoId ?? null,
      summary,
      mutationId,
      workPacket: { id: after.id, nhId: after.nhId },
      actor: { email: user.email ?? null, name: user.name ?? null },
      data,
    });

    return { type: "ok" as const };
  });

  if (result.type === "missing") redirect("/operator/work");
  redirect(`/operator/work/${id}`);
}

async function runRouteAction(packetId: number, action: PacketRouteAction) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  await applyPacketRouteAction({
    packetId,
    action,
    actor: {
      email: user.email ?? null,
      name: user.name ?? null,
    },
  });

  redirect(`/operator/work/${packetId}`);
}

export default async function WorkPacketDetailPage({ params }: Props) {
  const { id: idParam } = await params;

  const id = Number(idParam);
  if (!Number.isFinite(id)) redirect("/operator/work");

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const p = await prisma.workPacket.findUnique({
    where: { id },
    include: { repo: true },
  });
  if (!p) redirect("/operator/work");

  const latestInbox = await prisma.agentInboxItem.findFirst({
    where: { workPacketId: p.id },
    orderBy: { id: "desc" },
    select: {
      id: true,
      status: true,
      priority: true,
      tags: true,
    },
  });

  const inboxTags = coerceStringArray(latestInbox?.tags);
  const governingMotion = loadGoverningMotionState(inboxTags);
  const assigneeNhId = getAssigneeFromTags(inboxTags);
  const assignedAgent = assigneeNhId ? getAgentByNhId(assigneeNhId) : null;

  const WORK_PACKET_KINDS = [
    "WORK_PACKET_CREATED",
    "WORK_PACKET_UPDATED",
    "WORK_PACKET_STATUS_CHANGED",
    "WORK_DELEGATED",
    "WORK_ROUTED",
    "WORK_REVIEW_REQUESTED",
    "WORK_APPROVED",
  ] as const;

  const ALL_PACKET_KINDS = [
    ...WORK_PACKET_KINDS,
    ...RUNTIME_EVENT_KINDS,
    ...DEBUG_LOOP_EVENT_KINDS,
  ] as const;

  const packetEvents = await prisma.sotEvent.findMany({
    where: {
      kind: { in: [...ALL_PACKET_KINDS] },
      OR: [{ workPacketId: p.id }, { workPacketId: null, nhId: p.nhId }],
    },
    orderBy: { ts: "desc" },
    take: 200,
  });

  const mutationEvents = packetEvents.filter((evt) =>
    [
      "WORK_PACKET_CREATED",
      "WORK_PACKET_UPDATED",
      "WORK_PACKET_STATUS_CHANGED",
      "WORK_DELEGATED",
      "WORK_ROUTED",
      "WORK_REVIEW_REQUESTED",
      "WORK_APPROVED",
    ].includes(evt.kind),
  );

  const runtimeAndDebugEvents = packetEvents.filter(
    (evt) => RUNTIME_KIND_SET.has(evt.kind) || DEBUG_KIND_SET.has(evt.kind),
  );

  const handoffEvents = packetEvents.filter((evt) => HANDOFF_KIND_SET.has(evt.kind));

  const requestedRoleFromTags = getRequestedRoleFromTags(inboxTags);
  const requestedRoleFromEvents =
    packetEvents
      .map((evt) => getRequestedRoleFromPayload(evt.payload as JsonValue | null))
      .find((role): role is ExecutionRole => role != null) ?? null;
  const inferredRole = parseRequestedRole(
    deriveRequestedRoleFromAgentKey(assignedAgent?.agent_key ?? null),
  );

  const requestedRole = requestedRoleFromTags ?? requestedRoleFromEvents ?? inferredRole;

  const assigneeExecutionCapable = assignedAgent ? assignedAgent.execution_capable : null;
  const assigneeEligibleForRole =
    assignedAgent && requestedRole
      ? isAgentEligibleForExecutionRole(assignedAgent, requestedRole)
      : assigneeNhId
        ? false
        : null;

  const latestRuntimeEvent =
    runtimeAndDebugEvents.find((evt) => RUNTIME_KIND_SET.has(evt.kind)) ?? null;
  const latestDebugEvent =
    runtimeAndDebugEvents.find((evt) => DEBUG_KIND_SET.has(evt.kind)) ?? null;

  const latestByKind = new Map<string, (typeof packetEvents)[number]>();
  for (const evt of packetEvents) {
    if (!latestByKind.has(evt.kind)) latestByKind.set(evt.kind, evt);
  }

  const operatorDecisionEvent =
    mutationEvents.find(
      (evt) => evt.kind === "WORK_APPROVED" || evt.kind === "WORK_REVIEW_REQUESTED",
    ) ?? null;

  const operatorDecisionKind = operatorDecisionEvent?.kind ?? null;

  const baseControl = computeWorkPacketControlState({
    packetStatus: String(p.status),
    assigneeNhId,
    requestedRole,
    githubPrUrl: p.githubPrUrl ?? null,
    verificationUrl: p.verificationUrl ?? null,
    latestRuntimeKind: latestRuntimeEvent?.kind ?? null,
    latestDebugKind: latestDebugEvent?.kind ?? null,
  });

  const baseLane = computeExecutionLaneState({
    packetStatus: String(p.status),
    assigneeNhId,
    requestedRole,
    githubPrUrl: p.githubPrUrl ?? null,
    verificationUrl: p.verificationUrl ?? null,
    latestRuntimeKind: latestRuntimeEvent?.kind ?? null,
    latestDebugKind: latestDebugEvent?.kind ?? null,
  });

  const control =
    operatorDecisionKind === "WORK_APPROVED"
      ? {
        phase: "APPROVED",
        tone: "emerald",
        reason: "Operator approval is recorded for this packet.",
        nextAction: "No further execution action is required unless follow-up work is opened.",
      }
      : operatorDecisionKind === "WORK_REVIEW_REQUESTED"
        ? {
          phase: "CHANGES_REQUESTED",
          tone: "red",
          reason: "Operator requested changes on this packet.",
          nextAction: "Review the feedback and explicitly re-route the packet when rework is ready.",
        }
        : baseControl;

  const lane =
    operatorDecisionKind === "WORK_APPROVED"
      ? {
        currentLane: "COMPLETE",
        nextLane: null,
        reason: "Operator approval recorded; the governed slice is complete.",
      }
      : operatorDecisionKind === "WORK_REVIEW_REQUESTED"
        ? {
          currentLane: "ATTENTION",
          nextLane: null,
          reason: "Operator requested changes; the packet now awaits explicit re-routing or revision.",
        }
        : baseLane;

  const checklist = DEBUG_LOOP_EVENT_KINDS.map((k) => ({
    kind: k,
    evt: latestByKind.get(k) ?? null,
  }));

  const completedCount = checklist.filter((x) => !!x.evt).length;

  const architectEvt = latestByKind.get("debug.plan") ?? null;
  const builderEvt = latestByKind.get("debug.patch") ?? null;
  const verifierEvt = latestByKind.get("debug.verify") ?? null;
  const operatorEvt =
    operatorDecisionEvent ??
    latestByKind.get("debug.approve") ??
    null;

  const architectState: SliceStageState = architectEvt
    ? "COMPLETE"
    : lane.currentLane === "ARCHITECT"
      ? "IN_PROGRESS"
      : "READY";

  const builderState: SliceStageState = builderEvt || !!p.githubPrUrl
    ? "COMPLETE"
    : lane.currentLane === "BUILDER"
      ? "IN_PROGRESS"
      : architectEvt
        ? "READY"
        : "MISSING";

  const verifierState: SliceStageState = verifierEvt || !!p.verificationUrl
    ? "COMPLETE"
    : lane.currentLane === "VERIFIER"
      ? "IN_PROGRESS"
      : builderEvt || !!p.githubPrUrl
        ? "READY"
        : "MISSING";

  const operatorState: SliceStageState = operatorEvt || lane.currentLane === "COMPLETE"
    ? "COMPLETE"
    : lane.currentLane === "OPERATOR_REVIEW"
      ? "IN_PROGRESS"
      : verifierEvt || !!p.verificationUrl
        ? "READY"
        : "MISSING";

  const sliceStages = [
    {
      key: "architect",
      label: "Architect",
      state: architectState,
      evidence: architectEvt
        ? architectEvt.kind
        : lane.currentLane === "ARCHITECT"
          ? "lane active"
          : "waiting for plan",
      note: architectEvt
        ? "Planning evidence exists."
        : "Produces planning/approach evidence.",
    },
    {
      key: "builder",
      label: "Builder",
      state: builderState,
      evidence: builderEvt
        ? builderEvt.kind
        : p.githubPrUrl
          ? "GitHub PR URL"
          : lane.currentLane === "BUILDER"
            ? "lane active"
            : "waiting for patch",
      note: builderEvt || p.githubPrUrl
        ? "Patch evidence exists."
        : "Produces patch/PR evidence.",
    },
    {
      key: "verifier",
      label: "Verifier",
      state: verifierState,
      evidence: verifierEvt
        ? verifierEvt.kind
        : p.verificationUrl
          ? "Verification URL"
          : lane.currentLane === "VERIFIER"
            ? "lane active"
            : "waiting for verification",
      note: verifierEvt || p.verificationUrl
        ? "Verification evidence exists."
        : "Produces verification evidence.",
    },
    {
      key: "operator",
      label: "Operator",
      state: operatorState,
      evidence: operatorEvt
        ? operatorEvt.kind
        : lane.currentLane === "OPERATOR_REVIEW"
          ? "review lane active"
          : "waiting for review",
      note: operatorEvt
        ? "Operator decision is recorded."
        : "Approves or requests changes.",
    },
  ] as const;

  const sliceCompleteCount = sliceStages.filter((s) => s.state === "COMPLETE").length;

  const runLedger = runtimeAndDebugEvents.map((evt) =>
    toRunLedgerEntry({
      id: evt.id,
      kind: evt.kind,
      summary: evt.summary,
      ts: evt.ts,
      payload: evt.payload,
    }),
  );

  const handoffHistory = handoffEvents.map((evt) =>
    toHandoffEntry({
      id: evt.id,
      kind: evt.kind,
      summary: evt.summary,
      ts: evt.ts,
      payload: evt.payload,
    }),
  );

  const canResolveOperatorDecision =
    operatorDecisionKind == null &&
    (baseLane.currentLane === "OPERATOR_REVIEW" || !!verifierEvt || !!p.verificationUrl);

  const loopCoherence = computeLoopCoherence({
    governingMotion,
    architectPresent: !!architectEvt,
    builderPresent: !!(builderEvt || p.githubPrUrl),
    verifierPresent: !!(verifierEvt || p.verificationUrl),
    operatorDecisionKind,
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {p.nhId} · {p.title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Contract summary, execution loop, run ledger, handoff history, and packet mutation stream.
        </p>
      </header>

      {governingMotion ? (
        <section className="mb-6 max-w-6xl rounded-md border border-gray-700 bg-zinc-950/50 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Governing Motion
          </h2>
          <div className="flex flex-wrap items-start gap-6 text-sm">
            <div>
              <div className="text-[11px] text-gray-500">motion</div>
              <div className="mt-0.5 font-mono text-sky-300">{governingMotion.motionId}</div>
            </div>
            <div className="flex-1 min-w-[180px]">
              <div className="text-[11px] text-gray-500">title</div>
              <div className="mt-0.5 text-gray-200">{governingMotion.title ?? "—"}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">council decision</div>
              <div className={`mt-0.5 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                governingMotion.decisionStatus === "RATIFIED"
                  ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
                  : governingMotion.decisionStatus
                    ? "bg-amber-900/40 text-amber-200 border-amber-800"
                    : "bg-zinc-900 text-gray-400 border-gray-700"
              }`}>
                {governingMotion.decisionStatus ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">handoff</div>
              <div className={`mt-0.5 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                governingMotion.handoffStatus === "ISSUED"
                  ? "bg-sky-900/50 text-sky-200 border-sky-800"
                  : governingMotion.handoffStatus
                    ? "bg-amber-900/40 text-amber-200 border-amber-800"
                    : "bg-zinc-900 text-gray-400 border-gray-700"
              }`}>
                {governingMotion.handoffStatus ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">receipt</div>
              <div className={`mt-0.5 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                governingMotion.receiptStatus === "COMPLETED"
                  ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
                  : governingMotion.receiptStatus
                    ? "bg-amber-900/40 text-amber-200 border-amber-800"
                    : "bg-zinc-900 text-gray-400 border-gray-700"
              }`}>
                {governingMotion.receiptStatus ?? "pending"}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">cost category</div>
              <div className="mt-0.5 font-mono text-gray-200">{governingMotion.costCategory ?? "—"}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">activation outcome</div>
              <div className={`mt-0.5 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                governingMotion.activationOutcome === "PROCEED"
                  ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
                  : governingMotion.activationOutcome === "ESCALATE"
                    ? "bg-amber-900/40 text-amber-200 border-amber-800"
                    : governingMotion.activationOutcome === "BLOCK"
                      ? "bg-red-900/40 text-red-200 border-red-800"
                      : "bg-zinc-900 text-gray-400 border-gray-700"
              }`}>
                {governingMotion.activationOutcome ?? "—"}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-800 pt-3">
            <div className="text-[11px] text-gray-500">loop coherence</div>
            <div className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
              loopCoherence.verdict === "COHERENT"
                ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
                : loopCoherence.verdict === "PROGRESSING"
                  ? "bg-sky-900/50 text-sky-200 border-sky-800"
                  : loopCoherence.verdict === "INCOHERENT"
                    ? "bg-amber-900/40 text-amber-200 border-amber-800"
                    : "bg-zinc-900 text-gray-400 border-gray-700"
            }`}>
              {loopCoherence.verdict}
            </div>
            <div className="text-xs text-gray-400">{loopCoherence.reasons.join(" · ")}</div>
          </div>
        </section>
      ) : null}

      {assigneeNhId && assigneeEligibleForRole === false ? (
        <section className="mb-6 max-w-6xl rounded-md border border-red-800 bg-red-950/30 p-4">
          <h2 className="text-sm font-semibold text-red-200">Execution Eligibility Mismatch</h2>
          <p className="mt-2 text-sm text-red-100">
            The assigned agent does not match the packet’s canonical execution role.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-red-100 md:grid-cols-3">
            <div>
              <span className="text-red-300">assignee:</span>{" "}
              <span className="font-mono">{assigneeNhId}</span>
            </div>
            <div>
              <span className="text-red-300">execution role:</span>{" "}
              <span className="font-mono">{requestedRole ?? "—"}</span>
            </div>
            <div>
              <span className="text-red-300">allowed roles:</span>{" "}
              <span className="font-mono">
                {assignedAgent?.execution_roles.join(", ") || "—"}
              </span>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mb-8 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Contract Summary</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <div>
              <span className="text-gray-500">status:</span>{" "}
              <span className="font-mono">{p.status}</span>
            </div>
            <div>
              <span className="text-gray-500">repo:</span>{" "}
              <span className="font-mono">{p.repo?.name ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">assignee:</span>{" "}
              <span className="font-mono">{assigneeNhId ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">execution role:</span>{" "}
              <span className="font-mono">{requestedRole ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">explicit route role:</span>{" "}
              <span className="font-mono">
                {requestedRoleFromTags ?? requestedRoleFromEvents ?? "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">agent inferred role:</span>{" "}
              <span className="font-mono">{inferredRole ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">execution capable:</span>{" "}
              <span className="font-mono">
                {assigneeExecutionCapable == null
                  ? "—"
                  : assigneeExecutionCapable
                    ? "true"
                    : "false"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">role eligibility:</span>{" "}
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${toneForEligibility(
                  assigneeEligibleForRole,
                )}`}
              >
                {labelForEligibility(assigneeEligibleForRole)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">allowed execution roles:</span>{" "}
              <span className="font-mono">
                {assignedAgent?.execution_roles.join(", ") || "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">governance only:</span>{" "}
              <span className="font-mono">
                {assignedAgent
                  ? assignedAgent.governance_only
                    ? "true"
                    : "false"
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">inbox:</span>{" "}
              <span className="font-mono">
                {latestInbox ? `${String(latestInbox.status)} · p${String(latestInbox.priority)}` : "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">tags:</span>{" "}
              <span className="font-mono">{inboxTags.join(", ") || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">operator decision:</span>{" "}
              <span className="font-mono">{operatorDecisionKind ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">corpus cost:</span>{" "}
              <span className="font-mono">{governingMotion?.costCategory ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">activation outcome:</span>{" "}
              <span className="font-mono">{governingMotion?.activationOutcome ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">activation recorded:</span>{" "}
              <span className="font-mono">{governingMotion?.activationRecordedAt ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Control State</h2>
          <div className="mt-3">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${toneForControl(control.tone)}`}>
              {control.phase}
            </span>
          </div>
          <div className="mt-3 text-sm text-gray-300">{control.reason}</div>
          <div className="mt-2 text-sm text-sky-300">{control.nextAction}</div>
          <div className="mt-4 text-xs text-gray-500">
            latest runtime: <span className="font-mono text-gray-300">{latestRuntimeEvent?.kind ?? "—"}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            latest debug: <span className="font-mono text-gray-300">{latestDebugEvent?.kind ?? "—"}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            latest operator decision: <span className="font-mono text-gray-300">{operatorDecisionKind ?? "—"}</span>
          </div>
        </div>

        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Execution Lane</h2>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${toneForLane(lane.currentLane)}`}>
              {lane.currentLane}
            </span>
            {lane.nextLane ? (
              <>
                <span className="text-gray-500">→</span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${toneForLane(lane.nextLane)}`}>
                  {lane.nextLane}
                </span>
              </>
            ) : null}
          </div>
          <div className="mt-3 text-sm text-gray-300">{lane.reason}</div>
        </div>

        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Debug Loop Coverage</h2>
          <div className="mt-3 text-sm text-gray-300">
            {completedCount}/{checklist.length} artifacts present
          </div>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            {checklist.map(({ kind, evt }) => (
              <div key={kind} className="flex items-center justify-between gap-4">
                <span className="font-mono">{kind}</span>
                <span className={evt ? "text-emerald-300" : "text-amber-300"}>
                  {evt ? "present" : "missing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8 max-w-6xl rounded-md border border-gray-800 bg-zinc-950 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-200">Vertical Slice Progress</h2>
            <p className="mt-1 text-sm text-gray-400">
              Proof strip for the first governed path: architect → builder → verifier → operator.
            </p>
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-mono">{sliceCompleteCount}/4</span> stages complete
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sliceStages.map((stage) => (
            <div key={stage.key} className="rounded-md border border-gray-800 bg-black p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-gray-200">{stage.label}</div>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${toneForSliceState(stage.state)}`}
                >
                  {stageStateLabel(stage.state)}
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-500">Evidence</div>
              <div className="mt-1 font-mono text-xs text-gray-200">{stage.evidence}</div>

              <div className="mt-3 text-xs text-gray-400">{stage.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 max-w-6xl rounded-md border border-gray-800 bg-zinc-950 p-4">
        <h2 className="text-sm font-semibold text-gray-200">Execution Loop Actions</h2>
        <p className="mt-2 text-sm text-gray-400">
          These actions include both governed routing actions and final operator decision actions. They emit packet-linked SoT events and update packet/inbox state.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <form action={runRouteAction.bind(null, p.id, "ROUTE_ARCHITECT")}>
            <button
              type="submit"
              className="rounded-md border border-amber-800 bg-amber-900/30 px-3 py-2 text-sm text-amber-200 hover:bg-amber-900/40"
            >
              Route to architect
            </button>
          </form>

          <form action={runRouteAction.bind(null, p.id, "ROUTE_BUILDER")}>
            <button
              type="submit"
              className="rounded-md border border-sky-800 bg-sky-900/30 px-3 py-2 text-sm text-sky-200 hover:bg-sky-900/40"
            >
              Route to builder
            </button>
          </form>

          <form action={runRouteAction.bind(null, p.id, "ROUTE_VERIFIER")}>
            <button
              type="submit"
              className="rounded-md border border-purple-800 bg-purple-900/30 px-3 py-2 text-sm text-purple-200 hover:bg-purple-900/40"
            >
              Route to verifier
            </button>
          </form>

          <form action={runDecisionAction.bind(null, p.id, "REQUEST_CHANGES")}>
            <button
              type="submit"
              disabled={!canResolveOperatorDecision}
              className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-200 hover:bg-red-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request changes
            </button>
          </form>

          <form action={runDecisionAction.bind(null, p.id, "REQUEUE")}>
            <button
              type="submit"
              className="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-gray-200 hover:bg-zinc-900"
            >
              Requeue
            </button>
          </form>

          <form action={runDecisionAction.bind(null, p.id, "APPROVE")}>
            <button
              type="submit"
              disabled={!canResolveOperatorDecision}
              className="rounded-md border border-emerald-800 bg-emerald-900/30 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Approve
            </button>
          </form>
        </div>
      </section>

      <form action={updatePacket.bind(null, p.id)} className="max-w-4xl space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs text-gray-300">NH</label>
            <input
              name="nhId"
              defaultValue={p.nhId}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs text-gray-300">Title</label>
            <input
              name="title"
              defaultValue={p.title}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Status</label>
            <select
              name="status"
              defaultValue={p.status}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              {Object.values(WorkPacketStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Acceptance Criteria (AC)</label>
          <textarea
            name="ac"
            rows={8}
            defaultValue={p.ac}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Plan</label>
          <textarea
            name="plan"
            rows={8}
            defaultValue={p.plan}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs text-gray-300">GitHub Issue URL</label>
            <input
              name="githubIssueUrl"
              defaultValue={p.githubIssueUrl ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">GitHub PR URL</label>
            <input
              name="githubPrUrl"
              defaultValue={p.githubPrUrl ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Verification URL</label>
            <input
              name="verificationUrl"
              defaultValue={p.verificationUrl ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Save
        </button>
      </form>

      <section className="mt-10 max-w-6xl">
        <h2 className="text-lg font-semibold">Run Ledger</h2>
        <p className="mt-1 text-sm text-gray-400">
          Derived from runtime and debug SoT events linked to this packet.
        </p>

        <div className="mt-4 space-y-3">
          {runLedger.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No runtime or debug events yet.
            </div>
          ) : (
            runLedger.map((entry) => (
              <details key={entry.id} className="rounded-md border border-gray-800 bg-zinc-950 p-3">
                <summary className="cursor-pointer select-none">
                  <span className="font-mono text-xs text-gray-400">{entry.ts.toISOString()}</span>
                  <span className="ml-3 text-xs font-semibold text-gray-200">{entry.kind}</span>
                  <span className="ml-3 text-xs text-sky-300">{entry.role}</span>
                  <span className="ml-3 text-xs text-gray-400">{entry.status}</span>
                  {entry.agentNhId ? (
                    <span className="ml-3 font-mono text-xs text-purple-300">{entry.agentNhId}</span>
                  ) : null}
                  <span className="ml-3 text-sm text-gray-200">{entry.summary}</span>
                </summary>

                <div className="mt-3 text-xs text-gray-400">{entry.detail}</div>

                <pre className="mt-3 overflow-x-auto text-xs text-gray-200">
                  {JSON.stringify(entry.payload, null, 2)}
                </pre>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 max-w-6xl">
        <h2 className="text-lg font-semibold">Handoff History</h2>
        <p className="mt-1 text-sm text-gray-400">
          Delegation and execution-lane handoff signals for this packet.
        </p>

        <div className="mt-4 space-y-3">
          {handoffHistory.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No handoff events yet.
            </div>
          ) : (
            handoffHistory.map((entry) => (
              <details key={entry.id} className="rounded-md border border-gray-800 bg-zinc-950 p-3">
                <summary className="cursor-pointer select-none">
                  <span className="font-mono text-xs text-gray-400">{entry.ts.toISOString()}</span>
                  <span className="ml-3 text-xs font-semibold text-gray-200">{entry.kind}</span>
                  <span className="ml-3 text-xs text-sky-300">{entry.role}</span>
                  <span className="ml-3 text-sm text-gray-200">{entry.summary}</span>
                </summary>

                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-400 md:grid-cols-3">
                  <div>
                    <span className="text-gray-500">from:</span>{" "}
                    <span className="font-mono text-gray-200">{entry.fromAgentNhId ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">to:</span>{" "}
                    <span className="font-mono text-gray-200">{entry.toAgentNhId ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">role:</span>{" "}
                    <span className="font-mono text-gray-200">{entry.role}</span>
                  </div>
                </div>

                <pre className="mt-3 overflow-x-auto text-xs text-gray-200">
                  {JSON.stringify(entry.payload, null, 2)}
                </pre>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 max-w-6xl">
        <h2 className="text-lg font-semibold">SoT Event Stream</h2>
        <p className="mt-1 text-sm text-gray-400">
          Latest {mutationEvents.length} packet-linked events for WorkPacket <span className="font-mono">#{p.id}</span>.
        </p>

        <div className="mt-4 space-y-3">
          {mutationEvents.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No events yet.
            </div>
          ) : (
            mutationEvents.map((evt) => {
              const payload = evt.payload as JsonValue | null;
              const changes = getPayloadChanges(payload);

              return (
                <details key={evt.id} className="rounded-md border border-gray-800 bg-zinc-950 p-3">
                  <summary className="cursor-pointer select-none">
                    <span className="font-mono text-xs text-gray-400">
                      {evt.ts.toISOString()}
                    </span>
                    <span className="ml-3 text-xs font-semibold text-gray-200">{evt.kind}</span>
                    {evt.summary ? (
                      <span className="ml-3 text-sm text-gray-200">{evt.summary}</span>
                    ) : null}
                  </summary>

                  <pre className="mt-3 overflow-x-auto text-xs text-gray-200">
                    {JSON.stringify(changes ?? payload, null, 2)}
                  </pre>
                </details>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
