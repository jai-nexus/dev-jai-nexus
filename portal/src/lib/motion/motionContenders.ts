import {
  buildDraftMotionPackage,
  type DraftMotionPackage,
} from "./motionDraftPackage";

export const MOTION_PROMOTION_TARGET_REPO = "jai-nexus/dev-jai-nexus";
export const MOTION_PROMOTION_TARGET_DOMAIN = "dev.jai.nexus";
export const MOTION_PROMOTION_DEFAULT_BASE_BRANCH = "main";

export type ContenderQueueState =
  | "preview_only"
  | "ready_to_promote"
  | "promotion_blocked"
  | "stale_preview"
  | "promoted";

export type MotionContenderIdStrategy =
  | "derive_from_canonical_live_state"
  | "assign_at_promotion"
  | "server_confirmed";

export type MotionContenderIdResolution =
  | "provisional_live"
  | "assigned_at_promotion"
  | "server_confirmed";

export type MotionContenderInput = {
  title: string;
  subtitle: string | null;
  program: string | null;
  kind: string | null;
  basisMotionId: string | null;
  boundedScope: string;
  touchedPaths: string[];
  nonGoals: string[];
  rationale: string;
  risks: string[];
  generatedFromMotionId: string | null;
};

export type MotionContenderPromotionResult = {
  motion_id: string;
  branch_name: string;
  commit_sha: string;
  compare_url: string | null;
};

export type MotionContenderPreview = {
  contender_id: string;
  title: string;
  subtitle: string | null;
  generated_at: string;
  generated_from_motion_id: string | null;
  basis_motion_id: string | null;
  target_repo: string;
  target_domain: string;
  base_branch: string;
  motion_id_resolution: MotionContenderIdResolution;
  motion_id_notice: string;
  requires_server_id_confirmation: boolean;
  provisional_motion_id_preview: string;
  provisional_branch_name_preview: string;
  write_root_preview: string;
  written_paths_preview: string[];
  provisional_motion_id: string;
  provisional_branch_name: string;
  write_root: string;
  written_paths: string[];
  queue_state: ContenderQueueState;
  blocking_reasons: string[];
  promotion_result: MotionContenderPromotionResult | null;
  input: MotionContenderInput;
  draft_package: DraftMotionPackage;
};

function normalizeSingleLine(value: string | null | undefined): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  return raw.replace(/\s+/g, " ");
}

function normalizeTextBlock(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function normalizeList(items: string[]): string[] {
  return items.map((item) => item.trim()).filter(Boolean);
}

function normalizeUniqueList(items: string[]): string[] {
  return Array.from(new Set(normalizeList(items)));
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? normalized.slice(0, 48) : "untitled";
}

export function parseMotionNumber(motionId: string | null | undefined): number {
  const match = /^motion-(\d+)$/i.exec((motionId ?? "").trim());
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function formatMotionId(motionNumber: number): string {
  return `motion-${String(motionNumber).padStart(4, "0")}`;
}

export function buildDraftMotionBranchName(motionId: string, title: string): string {
  return `operator/motion-draft/${motionId}-${slugify(title)}`;
}

const ASSIGNED_AT_PROMOTION_LABEL = "assigned at promotion";
const ASSIGNED_AT_PROMOTION_TOKEN = "<assigned-at-promotion>";

export function normalizeMotionContenderInput(
  input: MotionContenderInput,
): MotionContenderInput {
  return {
    title: normalizeSingleLine(input.title) ?? "Untitled motion contender",
    subtitle: normalizeSingleLine(input.subtitle),
    program:
      normalizeSingleLine(input.program) ?? "q2-motion-contender-draft-promotion-v0",
    kind: normalizeSingleLine(input.kind) ?? "builder-proof",
    basisMotionId: normalizeSingleLine(input.basisMotionId),
    boundedScope: normalizeTextBlock(input.boundedScope),
    touchedPaths: normalizeList(input.touchedPaths),
    nonGoals: normalizeList(input.nonGoals),
    rationale: normalizeTextBlock(input.rationale),
    risks: normalizeList(input.risks),
    generatedFromMotionId: normalizeSingleLine(input.generatedFromMotionId),
  };
}

export function syncMotionContenderAvailability(
  contender: MotionContenderPreview,
  args: {
    promotionEnabled: boolean;
    blockingReasons?: string[];
  },
): MotionContenderPreview {
  if (
    contender.queue_state === "promoted" ||
    contender.queue_state === "stale_preview"
  ) {
    return contender;
  }

  const previewBlockingReasons = contender.requires_server_id_confirmation
    ? [contender.motion_id_notice]
    : [];
  const blockingReasons = normalizeUniqueList([
    ...previewBlockingReasons,
    ...(args.blockingReasons ?? contender.blocking_reasons),
  ]);
  const canPromote = args.promotionEnabled && !contender.requires_server_id_confirmation;

  return {
    ...contender,
    queue_state: canPromote ? "ready_to_promote" : "promotion_blocked",
    blocking_reasons: canPromote ? [] : blockingReasons,
  };
}

export function markMotionContenderStale(
  contender: MotionContenderPreview,
  reason: string,
): MotionContenderPreview {
  return {
    ...contender,
    queue_state: "stale_preview",
    blocking_reasons: normalizeUniqueList([reason]),
  };
}

export function markMotionContenderPromoted(
  contender: MotionContenderPreview,
  result: MotionContenderPromotionResult,
): MotionContenderPreview {
  return {
    ...contender,
    queue_state: "promoted",
    blocking_reasons: [],
    promotion_result: result,
  };
}

function buildContenderId(generatedAt: string, title: string): string {
  return `contender-${generatedAt.replace(/[^0-9A-Za-z]/g, "").slice(0, 18)}-${slugify(
    title,
  )}`;
}

export function buildMotionContenderPreview(args: {
  highestMotionNumber: number;
  generatedAt: string;
  baseBranch?: string | null;
  targetRepo?: string | null;
  targetDomain?: string | null;
  motionIdStrategy?: MotionContenderIdStrategy | null;
  confirmedMotionId?: string | null;
  confirmedBranchName?: string | null;
  input: MotionContenderInput;
}): MotionContenderPreview {
  const normalizedInput = normalizeMotionContenderInput(args.input);
  const targetRepo = normalizeSingleLine(args.targetRepo) ?? MOTION_PROMOTION_TARGET_REPO;
  const targetDomain =
    normalizeSingleLine(args.targetDomain) ?? MOTION_PROMOTION_TARGET_DOMAIN;
  const baseBranch =
    normalizeSingleLine(args.baseBranch) ?? MOTION_PROMOTION_DEFAULT_BASE_BRANCH;
  const motionIdStrategy = args.motionIdStrategy ?? "derive_from_canonical_live_state";
  const nextMotionNumber = Math.max(1, args.highestMotionNumber + 1);
  const nextMotionId = formatMotionId(nextMotionNumber);

  let motionIdResolution: MotionContenderIdResolution = "provisional_live";
  let provisionalMotionId = nextMotionId;
  let provisionalMotionIdPreview = nextMotionId;
  let provisionalBranchName = buildDraftMotionBranchName(
    provisionalMotionId,
    normalizedInput.title,
  );
  let provisionalBranchNamePreview = provisionalBranchName;
  let motionIdNotice =
    "Forecast from live canonical motion state. The promotion route still recomputes the latest motion id server-side.";
  let requiresServerIdConfirmation = false;

  if (motionIdStrategy === "assign_at_promotion") {
    motionIdResolution = "assigned_at_promotion";
    provisionalMotionId = ASSIGNED_AT_PROMOTION_TOKEN;
    provisionalMotionIdPreview = ASSIGNED_AT_PROMOTION_LABEL;
    provisionalBranchName = buildDraftMotionBranchName(
      ASSIGNED_AT_PROMOTION_TOKEN,
      normalizedInput.title,
    );
    provisionalBranchNamePreview = provisionalBranchName;
    motionIdNotice =
      "Snapshot-backed canonical data may be stale. The real motion id is assigned only after server confirmation at promotion.";
    requiresServerIdConfirmation = true;
  } else if (motionIdStrategy === "server_confirmed") {
    const confirmedMotionId = normalizeSingleLine(args.confirmedMotionId) ?? nextMotionId;
    const confirmedBranchName =
      normalizeSingleLine(args.confirmedBranchName) ??
      buildDraftMotionBranchName(confirmedMotionId, normalizedInput.title);
    motionIdResolution = "server_confirmed";
    provisionalMotionId = confirmedMotionId;
    provisionalMotionIdPreview = confirmedMotionId;
    provisionalBranchName = confirmedBranchName;
    provisionalBranchNamePreview = confirmedBranchName;
    motionIdNotice =
      "Server-confirmed from the latest canonical state. The promotion route still recomputes the latest motion id and rejects stale previews with HTTP 409.";
  }

  const draftPackage = buildDraftMotionPackage({
    motionId: provisionalMotionId,
    title: normalizedInput.title,
    subtitle: normalizedInput.subtitle,
    program: normalizedInput.program,
    kind: normalizedInput.kind,
    basisMotionId: normalizedInput.basisMotionId,
    scope: normalizedInput.boundedScope,
    touchedPaths: normalizedInput.touchedPaths,
    nonGoals: normalizedInput.nonGoals,
    rationale: normalizedInput.rationale,
    risks: normalizedInput.risks,
    createdAt: args.generatedAt,
    targetRepo: MOTION_PROMOTION_TARGET_DOMAIN === targetDomain ? "dev-jai-nexus" : targetRepo,
    targetDomain,
  });

  return {
    contender_id: buildContenderId(args.generatedAt, normalizedInput.title),
    title: normalizedInput.title,
    subtitle: normalizedInput.subtitle,
    generated_at: args.generatedAt,
    generated_from_motion_id: normalizedInput.generatedFromMotionId,
    basis_motion_id: normalizedInput.basisMotionId,
    target_repo: targetRepo,
    target_domain: targetDomain,
    base_branch: baseBranch,
    motion_id_resolution: motionIdResolution,
    motion_id_notice: motionIdNotice,
    requires_server_id_confirmation: requiresServerIdConfirmation,
    provisional_motion_id_preview: provisionalMotionIdPreview,
    provisional_branch_name_preview: provisionalBranchNamePreview,
    write_root_preview: draftPackage.write_root,
    written_paths_preview: draftPackage.files.map((file) => file.path),
    provisional_motion_id: provisionalMotionId,
    provisional_branch_name: provisionalBranchName,
    write_root: draftPackage.write_root,
    written_paths: draftPackage.files.map((file) => file.path),
    queue_state: "preview_only",
    blocking_reasons: [],
    promotion_result: null,
    input: normalizedInput,
    draft_package: draftPackage,
  };
}
