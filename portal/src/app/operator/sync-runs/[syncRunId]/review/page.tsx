import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { getWorkspaceRoot } from "@/lib/agentEdits";
import { prisma } from "@/lib/prisma";
import ReviewButtons from "./ReviewActions";

export const dynamic = "force-dynamic";

const MAX_PREVIEW_FILES = 25;
const MAX_FILE_BYTES = 120_000;

function parseGithubUrl(url: string): { owner: string; name: string } {
  const cleaned = url.trim().replace(/\.git$/, "");

  if (cleaned.startsWith("git@github.com:")) {
    const rest = cleaned.slice("git@github.com:".length);
    const [owner, name] = rest.split("/");
    if (!owner || !name) throw new Error(`Bad githubUrl: ${url}`);
    return { owner, name };
  }

  const parts = cleaned.split("/").filter(Boolean);
  const name = parts[parts.length - 1];
  const owner = parts[parts.length - 2];
  if (!owner || !name) throw new Error(`Bad githubUrl: ${url}`);
  return { owner, name };
}

function safeReadText(filePath: string): string {
  try {
    const st = statSync(filePath);
    if (st.size > MAX_FILE_BYTES) return "(too large to preview)";
    return readFileSync(filePath, "utf8");
  } catch {
    return "(error reading file)";
  }
}

function getAllFiles(dir: string, out: string[] = []) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) getAllFiles(full, out);
      else if (st.isFile()) out.push(full);
    }
  } catch {
    // ignore
  }
  return out;
}

function getDiff(repoRoot: string, stagingRoot: string, fileRelPath: string) {
  const stagedPath = path.join(stagingRoot, fileRelPath);
  const repoPath = path.join(repoRoot, fileRelPath);

  const oldContent = existsSync(repoPath)
    ? safeReadText(repoPath)
    : "(new file)";
  const newContent = safeReadText(stagedPath);

  const oldExists = existsSync(repoPath);
  const newExists = existsSync(stagedPath);

  return { oldContent, newContent, oldExists, newExists };
}

function statusTone(status: string) {
  if (status === "PENDING_REVIEW") return "gated";
  if (status === "APPLIED") return "advisory";
  if (status === "REJECTED") return "blocked";
  return "neutral";
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ syncRunId: string }>;
}) {
  const { syncRunId } = await params;
  const id = Number.parseInt(syncRunId, 10);

  if (!Number.isFinite(id)) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <OperatorGateCard>
          <OperatorBadge tone="blocked">INVALID ID</OperatorBadge>
          <p className="mt-2 text-sm text-red-200">
            Invalid ID (raw param = {JSON.stringify(syncRunId)})
          </p>
        </OperatorGateCard>
      </main>
    );
  }

  const syncRun = await prisma.syncRun.findUnique({
    where: { id },
    include: { repo: true },
  });

  if (!syncRun) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <OperatorGateCard>
          <OperatorBadge tone="blocked">NOT FOUND</OperatorBadge>
          <p className="mt-2 text-sm text-slate-400">SyncRun not found.</p>
        </OperatorGateCard>
      </main>
    );
  }

  let error = "";
  let fileList: string[] = [];
  let repoRoot = "";
  let stagingRoot = "";

  try {
    const repo = syncRun.repo;
    if (!repo?.githubUrl) {
      error = "Repo config invalid (missing githubUrl)";
    } else {
      const { owner, name } = parseGithubUrl(repo.githubUrl);
      const workspaceRoot = getWorkspaceRoot();
      repoRoot = path.join(workspaceRoot, owner, name);
      stagingRoot = path.join(repoRoot, ".jai-agent-edits", String(syncRun.id));

      if (!existsSync(stagingRoot)) {
        error = "Staging directory not found (maybe already applied/rejected?)";
      } else {
        const absFiles = getAllFiles(stagingRoot);
        fileList = absFiles
          .map((filePath) => path.relative(stagingRoot, filePath))
          .slice(0, MAX_PREVIEW_FILES);
      }
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e);
  }

  const activeFile = fileList[0] ?? "";
  const diff =
    activeFile && repoRoot && stagingRoot
      ? getDiff(repoRoot, stagingRoot, activeFile)
      : null;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / sync-runs / review
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Agent Edit Review
              </h1>
              <OperatorStatusChip
                status={syncRun.status}
                tone={statusTone(syncRun.status)}
              />
              <OperatorIdChip>#{syncRun.id}</OperatorIdChip>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Review staged agent-edit files. This surface contains pre-existing
              mutation controls; Slate containment does not grant new authority.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="gated">PRE-EXISTING MUTATION</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY PREVIEW</OperatorBadge>
              <OperatorBadge tone="blocked">NO NEW MUTATION PATHS</OperatorBadge>
              <OperatorBadge tone="blocked">NO MODEL DISPATCH</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="text-slate-500">Surface:</span>{" "}
                <span className="text-slate-200">
                  agent-edit review only, not a generic control-plane sync
                  detail
                </span>
              </div>
              <div>
                <span className="text-slate-500">Repo:</span>{" "}
                <span className="text-slate-200">
                  {syncRun.repo?.name ?? "(none)"}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Trigger:</span>{" "}
                <span className="text-slate-200">
                  {syncRun.trigger ?? "(none)"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Summary:</span>{" "}
                <span className="text-slate-200">
                  {syncRun.summary ?? "(none)"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Created:</span>{" "}
                <span className="text-slate-200">
                  {syncRun.createdAt.toISOString()}
                </span>
              </div>
            </div>
            <a
              href="/operator/sync-runs"
              className="mt-4 inline-flex text-sm text-sky-300 underline hover:text-sky-200"
            >
              Back
            </a>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Mutation Surface Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>New authority grant</OperatorBlockedAction>
              <OperatorBlockedAction>Model dispatch</OperatorBlockedAction>
              <OperatorBlockedAction>Open execution gate</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Existing mutation controls are not new Slate authority.
              Authentication is not authorization. Verified session does not
              open execution gates.
            </p>
          </OperatorSafetyRail>
        </header>

        {error ? (
          <OperatorGateCard className="border-red-900 bg-red-950/40">
            <OperatorBadge tone="blocked">PREVIEW UNAVAILABLE</OperatorBadge>
            <p className="mt-2 text-sm text-red-200">{error}</p>
          </OperatorGateCard>
        ) : null}

        {syncRun.status !== "PENDING_REVIEW" && !error ? (
          <OperatorGateCard>
            <OperatorBadge tone="readOnly">READ-ONLY STATUS</OperatorBadge>
            <p className="mt-2 text-sm text-sky-200">
              This run is <span className="font-semibold">{syncRun.status}</span>.
              Staged edits may no longer be available.
            </p>
          </OperatorGateCard>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <OperatorPanel className="p-4">
            <OperatorSectionHeader
              index="01"
              title="Staged Files"
              right={<OperatorIdChip>{fileList.length}</OperatorIdChip>}
            />
            {fileList.length === 0 ? (
              <OperatorGateCard>
                <OperatorBadge tone="readOnly">READ-ONLY / EMPTY</OperatorBadge>
                <p className="mt-2 text-sm text-slate-500">
                  No staged files found.
                </p>
              </OperatorGateCard>
            ) : (
              <div className="space-y-1">
                {fileList.map((filePath) => {
                  const isActive = filePath === activeFile;
                  return (
                    <div
                      key={filePath}
                      className={`rounded px-3 py-2 font-mono text-sm transition ${
                        isActive
                          ? "border border-sky-800 bg-sky-950/30 text-sky-100"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                      }`}
                      title={filePath}
                    >
                      {filePath}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 text-xs text-slate-500">
              Showing up to {MAX_PREVIEW_FILES} files. v0 uses first file as
              active.
            </div>
          </OperatorPanel>

          <OperatorPanel className="p-4">
            <OperatorSectionHeader
              index="02"
              title="Diff Preview"
              right={
                <>
                  {diff?.oldExists ? (
                    <OperatorBadge tone="readOnly">EXISTING FILE</OperatorBadge>
                  ) : (
                    <OperatorBadge tone="advisory">NEW FILE</OperatorBadge>
                  )}
                  <OperatorBadge tone="readOnly">PREVIEW</OperatorBadge>
                </>
              }
            />
            <div className="truncate font-mono text-xs text-slate-500">
              {activeFile || "(none)"}
            </div>

            {!diff ? (
              <OperatorGateCard className="mt-3">
                <OperatorBadge tone="readOnly">READ-ONLY / EMPTY</OperatorBadge>
                <p className="mt-2 text-sm text-slate-500">
                  Nothing to preview yet.
                </p>
              </OperatorGateCard>
            ) : (
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="overflow-hidden rounded border border-slate-800 bg-slate-950/60">
                  <div className="border-b border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400">
                    OLD
                  </div>
                  <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed text-slate-300">
                    {diff.oldContent}
                  </pre>
                </div>

                <div className="overflow-hidden rounded border border-slate-800 bg-slate-950/60">
                  <div className="border-b border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400">
                    NEW
                  </div>
                  <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed text-slate-300">
                    {diff.newContent}
                  </pre>
                </div>
              </div>
            )}
          </OperatorPanel>
        </div>

        {syncRun.status === "PENDING_REVIEW" ? (
          <OperatorPanel className="sticky bottom-4 border-amber-800 bg-amber-950/20 p-4 shadow-lg">
            <OperatorSectionHeader
              index="03"
              title="Pre-existing Mutation Controls"
              right={
                <>
                  <OperatorBadge tone="gated">PRE-EXISTING MUTATION</OperatorBadge>
                  <OperatorBadge tone="blocked">NO NEW AUTHORITY</OperatorBadge>
                </>
              }
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-amber-100">
                Apply/reject calls the existing operator API for staged files
                from{" "}
                <span className="font-mono">
                  .jai-agent-edits/{syncRun.id}/
                </span>
                . CONTROL_THREAD decides; validation is not acceptance.
              </div>
              <ReviewButtons syncRunId={id} />
            </div>
          </OperatorPanel>
        ) : null}
      </div>
    </main>
  );
}
