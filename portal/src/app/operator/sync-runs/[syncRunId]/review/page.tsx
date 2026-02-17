
import { prisma } from "@/lib/prisma";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import ReviewButtons from "./ReviewActions";
import { getWorkspaceRoot } from "@/lib/agentEdits";

export const dynamic = "force-dynamic";

// Helper to get simple diff
function getDiff(repoRoot: string, stagingRoot: string, fileRelPath: string) {
  const stagedPath = path.join(stagingRoot, fileRelPath);
  const repoPath = path.join(repoRoot, fileRelPath);

  let oldContent = "(new file)";
  let newContent = "";

  try {
    if (existsSync(repoPath)) {
      if (statSync(repoPath).size > 100000) {
        oldContent = "(too large)";
      } else {
        oldContent = readFileSync(repoPath, "utf8");
      }
    }

    if (statSync(stagedPath).size > 100000) {
      newContent = "(too large)";
    } else {
      newContent = readFileSync(stagedPath, "utf8");
    }
  } catch {
    newContent = "(error reading file)";
  }

  return { oldContent, newContent };
}

function getAllFiles(dir: string, fileList: string[] = []) {
  try {
    const files = readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    });
  } catch {
    // ignore
  }
  return fileList;
}

export default async function ReviewPage({ params }: { params: { syncRunId: string } }) {


  const id = parseInt(params.syncRunId, 10);
  if (isNaN(id)) return <div>Invalid ID</div>;

  // We need to fetch data
  // Since this is a server component, we can query DB directly.
  const syncRun = await prisma.syncRun.findUnique({
    where: { id },
    include: { repo: true }
  });

  if (!syncRun) return <div>SyncRun not found</div>;

  // Compute paths
  let error = "";
  let fileList: string[] = [];
  const filesData: Array<{ path: string, old: string, new: string }> = [];

  try {
    if (syncRun.repo && syncRun.repo.githubUrl) {
      const owner = syncRun.repo.githubUrl.replace(/\.git$/, "").split("/").slice(-2, -1)[0];
      const name = syncRun.repo.githubUrl.replace(/\.git$/, "").split("/").slice(-1)[0];
      const workspaceRoot = getWorkspaceRoot();
      const repoRoot = path.join(workspaceRoot, owner, name);
      const stagingRoot = path.join(repoRoot, ".jai-agent-edits", String(syncRun.id));

      if (existsSync(stagingRoot)) {
        const absFiles = getAllFiles(stagingRoot);
        fileList = absFiles.map(f => path.relative(stagingRoot, f));

        // Limit to first 5 files for preview to prevent massive page size
        for (const f of fileList.slice(0, 5)) {
          const diff = getDiff(repoRoot, stagingRoot, f);
          filesData.push({ path: f, old: diff.oldContent, new: diff.newContent });
        }
      } else {
        error = "Staging directory not found (maybe already applied/rejected?)";
      }
    } else {
      error = "Repo config invalid";
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Review Agent Edit</h1>
        <div className="mt-2 text-gray-600">
          <span className="mr-4"><strong>ID:</strong> {syncRun.id}</span>
          <span className="mr-4"><strong>Status:</strong> {syncRun.status}</span>
          <span className="mr-4"><strong>Repo:</strong> {syncRun.repo?.name}</span>
        </div>
        <p className="mt-2"><strong>Summary:</strong> {syncRun.summary}</p>
        <div className="mt-1 text-sm text-gray-500">
          Trigger: {syncRun.trigger} | {syncRun.createdAt.toISOString()}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {syncRun.status !== "PENDING_REVIEW" && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          This run is {syncRun.status}. Edits may no longer be available.
        </div>
      )}

      <div className="space-y-8">
        {filesData.map((f) => (
          <div key={f.path} className="border rounded shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-mono text-sm border-b font-bold">
              {f.path}
            </div>
            <div className="grid grid-cols-2 text-xs font-mono">
              <div className="border-r">
                <div className="bg-red-50 text-center py-1 text-red-800 border-b">OLD</div>
                <pre className="p-2 overflow-x-auto whitespace-pre-wrap">{f.old}</pre>
              </div>
              <div>
                <div className="bg-green-50 text-center py-1 text-green-800 border-b">NEW</div>
                <pre className="p-2 overflow-x-auto whitespace-pre-wrap">{f.new}</pre>
              </div>
            </div>
          </div>
        ))}
        {fileList.length > 5 && (
          <div className="text-center text-gray-500 italic p-4">
            ... and {fileList.length - 5} more files.
          </div>
        )}
        {fileList.length === 0 && !error && (
          <div className="text-center text-gray-500 italic p-4 border rounded">
            No files found in staging.
          </div>
        )}
      </div>

      {syncRun.status === "PENDING_REVIEW" && (
        <ReviewButtons syncRunId={id} />
      )}

      <div className="mt-8 text-sm text-gray-400">
        <a href="/operator/sync-runs" className="underline hover:text-gray-600">&larr; Back to Sync Runs</a>
      </div>
    </div>
  );
}
