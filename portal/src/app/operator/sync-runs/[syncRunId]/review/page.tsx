import { prisma } from "@/lib/prisma";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import ReviewButtons from "./ReviewActions";
import { getWorkspaceRoot } from "@/lib/agentEdits";

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

  const oldContent = existsSync(repoPath) ? safeReadText(repoPath) : "(new file)";
  const newContent = safeReadText(stagedPath);

  const oldExists = existsSync(repoPath);
  const newExists = existsSync(stagedPath);

  return { oldContent, newContent, oldExists, newExists };
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warn" | "ok" | "info";
}) {
  const cls =
    tone === "ok"
      ? "border-emerald-500/30 text-emerald-200 bg-emerald-500/10"
      : tone === "warn"
        ? "border-amber-500/30 text-amber-200 bg-amber-500/10"
        : tone === "info"
          ? "border-sky-500/30 text-sky-200 bg-sky-500/10"
          : "border-white/15 text-white/80 bg-white/5";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {children}
    </span>
  );
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
      <div className="p-8 text-sm text-red-300">
        Invalid ID (raw param = {JSON.stringify(syncRunId)})
      </div>
    );
  }

  const syncRun = await prisma.syncRun.findUnique({
    where: { id },
    include: { repo: true },
  });

  if (!syncRun) return <div className="p-8">SyncRun not found</div>;

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
        fileList = absFiles.map((f) => path.relative(stagingRoot, f)).slice(0, MAX_PREVIEW_FILES);
      }
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e);
  }

  // pick a file to show (query param could be added later; for now show first)
  const activeFile = fileList[0] ?? "";
  const diff =
    activeFile && repoRoot && stagingRoot ? getDiff(repoRoot, stagingRoot, activeFile) : null;

  const statusTone =
    syncRun.status === "PENDING_REVIEW"
      ? "info"
      : syncRun.status === "APPLIED"
        ? "ok"
        : syncRun.status === "REJECTED"
          ? "warn"
          : "neutral";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">Agent Edit Review</h1>
                <Badge tone={statusTone}>{syncRun.status}</Badge>
                <Badge>{`#${syncRun.id}`}</Badge>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
                <div className="truncate">
                  <span className="text-white/50">Repo:</span>{" "}
                  <span className="text-white/85">{syncRun.repo?.name ?? "(none)"}</span>
                </div>
                <div className="truncate">
                  <span className="text-white/50">Trigger:</span>{" "}
                  <span className="text-white/85">{syncRun.trigger ?? "(none)"}</span>
                </div>
                <div className="truncate sm:col-span-2">
                  <span className="text-white/50">Summary:</span>{" "}
                  <span className="text-white/85">{syncRun.summary ?? "(none)"}</span>
                </div>
                <div className="truncate sm:col-span-2">
                  <span className="text-white/50">Created:</span>{" "}
                  <span className="text-white/85">{syncRun.createdAt.toISOString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/operator/sync-runs"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                ← Back
              </a>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {syncRun.status !== "PENDING_REVIEW" && !error && (
            <div className="mt-5 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
              This run is <span className="font-semibold">{syncRun.status}</span>. Staged edits may no longer
              be available.
            </div>
          )}
        </div>

        {/* Main layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* File list */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-white/85">Files</div>
              <Badge>{fileList.length}</Badge>
            </div>

            {fileList.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
                No staged files found.
              </div>
            ) : (
              <div className="space-y-1">
                {fileList.map((f) => {
                  const isActive = f === activeFile;
                  return (
                    <div
                      key={f}
                      className={`rounded-xl px-3 py-2 text-sm font-mono transition ${isActive
                          ? "bg-white/10 text-white"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                        }`}
                      title={f}
                    >
                      {f}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 text-xs text-white/45">
              Showing up to {MAX_PREVIEW_FILES} files. (v0 uses first file as active)
            </div>
          </div>

          {/* Diff */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white/85">Diff Preview</div>
                <div className="truncate text-xs font-mono text-white/55">{activeFile || "(none)"}</div>
              </div>
              <div className="flex items-center gap-2">
                {diff?.oldExists ? <Badge>existing</Badge> : <Badge tone="info">new file</Badge>}
                <Badge tone="neutral">preview</Badge>
              </div>
            </div>

            {!diff ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-white/60">
                Nothing to preview yet.
              </div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <div className="border-b border-white/10 px-3 py-2 text-xs font-semibold text-white/70">
                    OLD
                  </div>
                  <pre className="max-h-[520px] overflow-auto p-3 text-xs leading-relaxed text-white/80 whitespace-pre-wrap font-mono">
                    {diff.oldContent}
                  </pre>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <div className="border-b border-white/10 px-3 py-2 text-xs font-semibold text-white/70">
                    NEW
                  </div>
                  <pre className="max-h-[520px] overflow-auto p-3 text-xs leading-relaxed text-white/80 whitespace-pre-wrap font-mono">
                    {diff.newContent}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="mt-6">
          {syncRun.status === "PENDING_REVIEW" && (
            <div className="sticky bottom-4 rounded-2xl border border-white/10 bg-black/70 backdrop-blur px-4 py-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/70">
                  Approve will apply staged files from{" "}
                  <span className="font-mono text-white/85">.jai-agent-edits/{syncRun.id}/</span>
                </div>
                <ReviewButtons syncRunId={id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
