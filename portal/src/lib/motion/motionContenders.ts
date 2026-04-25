import {
  buildDraftMotionPackage,
  type DraftMotionPackage,
} from "./motionDraftPackage";

export const MOTION_PROMOTION_TARGET_REPO = "jai-nexus/dev-jai-nexus";
export const MOTION_PROMOTION_TARGET_DOMAIN = "dev.jai.nexus";
export const MOTION_PROMOTION_DEFAULT_BASE_BRANCH = "main";

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

export type MotionContenderPreview = {
  contender_id: string;
  generated_at: string;
  target_repo: string;
  target_domain: string;
  base_branch: string;
  provisional_motion_id: string;
  provisional_branch_name: string;
  write_root: string;
  written_paths: string[];
  queue_state: "preview_only" | "ready_to_promote";
  blocking_reasons: string[];
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
  input: MotionContenderInput;
}): MotionContenderPreview {
  const normalizedInput = normalizeMotionContenderInput(args.input);
  const nextMotionNumber = Math.max(1, args.highestMotionNumber + 1);
  const provisionalMotionId = formatMotionId(nextMotionNumber);
  const targetRepo = normalizeSingleLine(args.targetRepo) ?? MOTION_PROMOTION_TARGET_REPO;
  const targetDomain =
    normalizeSingleLine(args.targetDomain) ?? MOTION_PROMOTION_TARGET_DOMAIN;
  const baseBranch =
    normalizeSingleLine(args.baseBranch) ?? MOTION_PROMOTION_DEFAULT_BASE_BRANCH;
  const provisionalBranchName = buildDraftMotionBranchName(
    provisionalMotionId,
    normalizedInput.title,
  );
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
    generated_at: args.generatedAt,
    target_repo: targetRepo,
    target_domain: targetDomain,
    base_branch: baseBranch,
    provisional_motion_id: provisionalMotionId,
    provisional_branch_name: provisionalBranchName,
    write_root: draftPackage.write_root,
    written_paths: draftPackage.files.map((file) => file.path),
    queue_state: "ready_to_promote",
    blocking_reasons: [],
    input: normalizedInput,
    draft_package: draftPackage,
  };
}
