import { Buffer } from "node:buffer";
import {
  buildMotionContenderPreview,
  buildDraftMotionBranchName,
  formatMotionId,
  MOTION_PROMOTION_DEFAULT_BASE_BRANCH,
  MOTION_PROMOTION_TARGET_DOMAIN,
  MOTION_PROMOTION_TARGET_REPO,
  normalizeMotionContenderInput,
  parseMotionNumber,
  type MotionContenderInput,
  type MotionContenderPreview,
} from "./motionContenders";
import { DRAFT_MOTION_FILE_NAMES } from "./motionDraftPackage";

export const MOTION_PROMOTION_ADMIN_EMAIL = "admin@jai.nexus";
export const MOTION_PROMOTION_FEATURE_FLAG = "JAI_ENABLE_MOTION_PROMOTION";
export const MOTION_PROMOTION_GITHUB_TOKEN_ENV = "JAI_MOTION_PROMOTION_GITHUB_TOKEN";
export const MOTION_PROMOTION_GITHUB_REPO_ENV = "JAI_MOTION_PROMOTION_GITHUB_REPO";
export const MOTION_PROMOTION_BASE_BRANCH_ENV = "JAI_MOTION_PROMOTION_BASE_BRANCH";

export type MotionPromotionAvailability = {
  enabled: boolean;
  is_authenticated: boolean;
  is_admin: boolean;
  feature_flag_enabled: boolean;
  github_env_ready: boolean;
  target_repo: string;
  base_branch: string;
  blocking_reasons: string[];
};

export type MotionPromotionRequestBody = {
  contender: MotionContenderInput;
  generated_at: string;
  provisional_motion_id: string;
  provisional_branch_name: string;
  confirmation_text: string;
};

export type MotionPromotionConflict = {
  ok: false;
  status: 409;
  error: "stale_provisional_motion_id";
  expected_motion_id: string;
  expected_branch_name: string;
  message: string;
};

export type MotionPromotionInvalid = {
  ok: false;
  status: 400 | 403 | 409 | 500;
  error: string;
  message: string;
};

export type MotionPromotionPrepared = {
  ok: true;
  preview: MotionContenderPreview;
};

export type MotionPromotionResolution =
  | MotionPromotionPrepared
  | MotionPromotionConflict
  | MotionPromotionInvalid;

export type MotionPromotionSuccess = {
  ok: true;
  motion_id: string;
  branch_name: string;
  commit_sha: string;
  written_paths: string[];
  compare_url: string;
  next_manual_action: string;
};

type MotionPromotionConfig = {
  token: string;
  repo_full_name: string;
  base_branch: string;
};

type GitHubRepoInfo = {
  default_branch: string;
};

type GitHubRefResponse = {
  object?: {
    sha?: string;
  };
};

type GitHubCommitResponse = {
  tree?: {
    sha?: string;
  };
};

type GitHubBlobResponse = {
  sha?: string;
};

type GitHubTreeResponse = {
  sha?: string;
};

type GitHubCreateCommitResponse = {
  sha?: string;
};

type GitHubContentsEntry = {
  name?: string;
  type?: string;
};

function trimEnv(name: string): string | null {
  const value = (process.env[name] ?? "").trim();
  return value.length > 0 ? value : null;
}

function parseRepoFullName(repoFullName: string) {
  const match = /^([^/]+)\/([^/]+)$/.exec(repoFullName.trim());
  if (!match) {
    throw new Error(`Invalid repo name: ${repoFullName}`);
  }

  return {
    owner: match[1],
    repo: match[2],
  };
}

export function readMotionPromotionAvailability(
  sessionEmail: string | null | undefined,
): MotionPromotionAvailability {
  const isAuthenticated = typeof sessionEmail === "string" && sessionEmail.trim().length > 0;
  const isAdmin = sessionEmail === MOTION_PROMOTION_ADMIN_EMAIL;
  const featureFlagEnabled = trimEnv(MOTION_PROMOTION_FEATURE_FLAG) === "1";
  const token = trimEnv(MOTION_PROMOTION_GITHUB_TOKEN_ENV);
  const configuredRepo =
    trimEnv(MOTION_PROMOTION_GITHUB_REPO_ENV) ?? MOTION_PROMOTION_TARGET_REPO;
  const baseBranch =
    trimEnv(MOTION_PROMOTION_BASE_BRANCH_ENV) ?? MOTION_PROMOTION_DEFAULT_BASE_BRANCH;
  const githubEnvReady = !!token && configuredRepo === MOTION_PROMOTION_TARGET_REPO;

  const blockingReasons: string[] = [];

  if (!isAuthenticated) {
    blockingReasons.push("Promotion requires an authenticated operator session.");
  }
  if (!isAdmin) {
    blockingReasons.push(
      "Promotion requires the current v0 admin guard: session.user.email === \"admin@jai.nexus\".",
    );
  }
  if (!featureFlagEnabled) {
    blockingReasons.push(
      `Promotion disabled: set ${MOTION_PROMOTION_FEATURE_FLAG}=1 to enable branch promotion.`,
    );
  }
  if (!token) {
    blockingReasons.push(
      `Promotion disabled: missing ${MOTION_PROMOTION_GITHUB_TOKEN_ENV}. Preview-only mode remains available.`,
    );
  }
  if (configuredRepo !== MOTION_PROMOTION_TARGET_REPO) {
    blockingReasons.push(
      `Promotion disabled: ${MOTION_PROMOTION_GITHUB_REPO_ENV} must resolve to ${MOTION_PROMOTION_TARGET_REPO}.`,
    );
  }

  return {
    enabled:
      isAuthenticated &&
      isAdmin &&
      featureFlagEnabled &&
      githubEnvReady &&
      blockingReasons.length === 0,
    is_authenticated: isAuthenticated,
    is_admin: isAdmin,
    feature_flag_enabled: featureFlagEnabled,
    github_env_ready: githubEnvReady,
    target_repo: configuredRepo,
    base_branch: baseBranch,
    blocking_reasons: blockingReasons,
  };
}

function readMotionPromotionConfig(): MotionPromotionConfig {
  const token = trimEnv(MOTION_PROMOTION_GITHUB_TOKEN_ENV);
  if (!token) {
    throw new Error(`Missing ${MOTION_PROMOTION_GITHUB_TOKEN_ENV}.`);
  }

  const repoFullName =
    trimEnv(MOTION_PROMOTION_GITHUB_REPO_ENV) ?? MOTION_PROMOTION_TARGET_REPO;
  if (repoFullName !== MOTION_PROMOTION_TARGET_REPO) {
    throw new Error(
      `${MOTION_PROMOTION_GITHUB_REPO_ENV} must be ${MOTION_PROMOTION_TARGET_REPO}.`,
    );
  }

  return {
    token,
    repo_full_name: repoFullName,
    base_branch: trimEnv(MOTION_PROMOTION_BASE_BRANCH_ENV) ?? MOTION_PROMOTION_DEFAULT_BASE_BRANCH,
  };
}

export function ensurePromotionPaths(preview: MotionContenderPreview): string[] {
  const root = `${preview.write_root}/`;
  const uniquePaths = Array.from(new Set(preview.written_paths));

  if (uniquePaths.length !== DRAFT_MOTION_FILE_NAMES.length) {
    throw new Error(
      `Expected ${DRAFT_MOTION_FILE_NAMES.length} written paths, found ${uniquePaths.length}.`,
    );
  }

  for (const expectedName of DRAFT_MOTION_FILE_NAMES) {
    const expectedPath = `${preview.write_root}/${expectedName}`;
    if (!uniquePaths.includes(expectedPath)) {
      throw new Error(`Missing required path in promotion plan: ${expectedPath}`);
    }
  }

  for (const targetPath of uniquePaths) {
    if (!targetPath.startsWith(root)) {
      throw new Error(`Promotion path escaped write root: ${targetPath}`);
    }
  }

  return uniquePaths;
}

export function resolveMotionPromotion(args: {
  remote_highest_motion_number: number;
  base_branch: string;
  contender: MotionContenderInput;
  generated_at: string;
  provisional_motion_id: string;
  provisional_branch_name: string;
  confirmation_text: string;
}): MotionPromotionResolution {
  const preview = buildMotionContenderPreview({
    highestMotionNumber: args.remote_highest_motion_number,
    generatedAt: args.generated_at,
    baseBranch: args.base_branch,
    targetRepo: MOTION_PROMOTION_TARGET_REPO,
    targetDomain: MOTION_PROMOTION_TARGET_DOMAIN,
    input: normalizeMotionContenderInput(args.contender),
  });

  if (args.confirmation_text.trim() !== args.provisional_motion_id.trim()) {
    return {
      ok: false,
      status: 400,
      error: "confirmation_mismatch",
      message: "Typed confirmation must exactly match the provisional motion id.",
    };
  }

  if (
    preview.provisional_motion_id !== args.provisional_motion_id ||
    preview.provisional_branch_name !== args.provisional_branch_name
  ) {
    return {
      ok: false,
      status: 409,
      error: "stale_provisional_motion_id",
      expected_motion_id: preview.provisional_motion_id,
      expected_branch_name: preview.provisional_branch_name,
      message:
        "The provisional motion id is stale. Review the updated preview and confirm again.",
    };
  }

  try {
    ensurePromotionPaths(preview);
  } catch (error) {
    return {
      ok: false,
      status: 400,
      error: "invalid_written_paths",
      message: error instanceof Error ? error.message : "Invalid promotion paths.",
    };
  }

  return {
    ok: true,
    preview,
  };
}

async function githubJson<T>(
  config: MotionPromotionConfig,
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    throw new Error(`GitHub API ${response.status} for ${endpoint}: ${payload || response.statusText}`);
  }

  return (await response.json()) as T;
}

async function githubMaybe<T>(
  config: MotionPromotionConfig,
  endpoint: string,
): Promise<{ status: number; data: T | null }> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return { status: 404, data: null };
  }

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    throw new Error(`GitHub API ${response.status} for ${endpoint}: ${payload || response.statusText}`);
  }

  return {
    status: response.status,
    data: (await response.json()) as T,
  };
}

async function loadRemoteMotionIds(
  config: MotionPromotionConfig,
): Promise<{ motionIds: string[]; baseBranch: string }> {
  const { owner, repo } = parseRepoFullName(config.repo_full_name);
  const repoInfo = await githubJson<GitHubRepoInfo>(
    config,
    `/repos/${owner}/${repo}`,
  );
  const baseBranch = (config.base_branch || repoInfo.default_branch || "").trim();
  if (!baseBranch) {
    throw new Error("Unable to resolve a base branch for motion promotion.");
  }

  const contents = await githubJson<GitHubContentsEntry[]>(
    config,
    `/repos/${owner}/${repo}/contents/.nexus/motions?ref=${encodeURIComponent(baseBranch)}`,
  );

  const motionIds = contents
    .filter((entry) => entry.type === "dir" && typeof entry.name === "string")
    .map((entry) => entry.name as string)
    .filter((name) => /^motion-\d+$/i.test(name));

  return { motionIds, baseBranch };
}

async function buildRemotePromotionPlan(args: {
  config: MotionPromotionConfig;
  body: MotionPromotionRequestBody;
}): Promise<MotionPromotionResolution> {
  const remote = await loadRemoteMotionIds(args.config);
  const highestMotionNumber = remote.motionIds.reduce(
    (currentMax, motionId) => Math.max(currentMax, parseMotionNumber(motionId)),
    0,
  );

  return resolveMotionPromotion({
    remote_highest_motion_number: highestMotionNumber,
    base_branch: remote.baseBranch,
    contender: args.body.contender,
    generated_at: args.body.generated_at,
    provisional_motion_id: args.body.provisional_motion_id,
    provisional_branch_name: args.body.provisional_branch_name,
    confirmation_text: args.body.confirmation_text,
  });
}

export async function promoteMotionDraft(
  body: MotionPromotionRequestBody,
): Promise<MotionPromotionSuccess> {
  const config = readMotionPromotionConfig();
  const plan = await buildRemotePromotionPlan({ config, body });

  if (!plan.ok) {
    const error = new Error(plan.message);
    (error as Error & { status?: number; payload?: MotionPromotionResolution }).status =
      plan.status;
    (error as Error & { status?: number; payload?: MotionPromotionResolution }).payload = plan;
    throw error;
  }

  const preview = plan.preview;
  const { owner, repo } = parseRepoFullName(config.repo_full_name);
  const branchName = preview.provisional_branch_name;
  const branchRef = await githubMaybe<GitHubRefResponse>(
    config,
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branchName)}`,
  );

  if (branchRef.status !== 404) {
    throw new Error(`Target branch already exists: ${branchName}`);
  }

  const baseRef = await githubJson<GitHubRefResponse>(
    config,
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(preview.base_branch)}`,
  );
  const baseCommitSha = baseRef.object?.sha ?? null;
  if (!baseCommitSha) {
    throw new Error(`Unable to resolve base commit for ${preview.base_branch}.`);
  }

  const baseCommit = await githubJson<GitHubCommitResponse>(
    config,
    `/repos/${owner}/${repo}/git/commits/${baseCommitSha}`,
  );
  const baseTreeSha = baseCommit.tree?.sha ?? null;
  if (!baseTreeSha) {
    throw new Error(`Unable to resolve base tree for ${preview.base_branch}.`);
  }

  const treeEntries = [];
  for (const file of preview.draft_package.files) {
    const blob = await githubJson<GitHubBlobResponse>(
      config,
      `/repos/${owner}/${repo}/git/blobs`,
      {
        method: "POST",
        body: JSON.stringify({
          content: Buffer.from(file.content, "utf8").toString("base64"),
          encoding: "base64",
        }),
      },
    );

    if (!blob.sha) {
      throw new Error(`Failed to create blob for ${file.path}.`);
    }

    treeEntries.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  const createdTree = await githubJson<GitHubTreeResponse>(
    config,
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    },
  );

  if (!createdTree.sha) {
    throw new Error("Failed to create draft motion tree.");
  }

  const createdCommit = await githubJson<GitHubCreateCommitResponse>(
    config,
    `/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message: `chore(motions): create draft ${preview.provisional_motion_id}`,
        tree: createdTree.sha,
        parents: [baseCommitSha],
      }),
    },
  );

  if (!createdCommit.sha) {
    throw new Error("Failed to create draft motion commit.");
  }

  await githubJson(
    config,
    `/repos/${owner}/${repo}/git/refs`,
    {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: createdCommit.sha,
      }),
    },
  );

  return {
    ok: true,
    motion_id: preview.provisional_motion_id,
    branch_name: branchName,
    commit_sha: createdCommit.sha,
    written_paths: preview.written_paths,
    compare_url: `https://github.com/${config.repo_full_name}/compare/${encodeURIComponent(
      preview.base_branch,
    )}...${encodeURIComponent(branchName)}`,
    next_manual_action:
      "Review the new branch on GitHub, inspect the draft package, and open a PR manually if promotion is acceptable.",
  };
}

export function buildMotionPromotionPreview(args: {
  highestMotionNumber: number;
  baseBranch: string;
  generatedAt: string;
  contender: MotionContenderInput;
}): MotionContenderPreview {
  return buildMotionContenderPreview({
    highestMotionNumber: args.highestMotionNumber,
    generatedAt: args.generatedAt,
    baseBranch: args.baseBranch,
    targetRepo: MOTION_PROMOTION_TARGET_REPO,
    targetDomain: MOTION_PROMOTION_TARGET_DOMAIN,
    input: args.contender,
  });
}

export function getExpectedNextMotionId(currentHighestMotionNumber: number): string {
  return formatMotionId(currentHighestMotionNumber + 1);
}

export function buildExpectedBranchName(motionId: string, title: string): string {
  return buildDraftMotionBranchName(motionId, title);
}
