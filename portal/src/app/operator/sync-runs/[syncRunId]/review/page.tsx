// portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReviewAgentEditPage() {
  const { syncRunId } = useParams();
   interface SyncRunData {
   id: number;
   repo?: { name: string; githubUrl?: string };
   summary?: string;
   status?: string;
   trigger?: string;
 }
 const [data, setData] = useState<SyncRunData | null>(null);
  const [diff, setDiff] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/sync-runs/${syncRunId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        const repoUrl = json.repo?.githubUrl ?? "";
        const workspaceRoot = `/workspace/${repoUrl.split("/").slice(-2).join("/")}`;
        const stagedPath = `${workspaceRoot}/.jai-agent-edits/${json.summary
          ?.match(/to (.+)$/)?.[1]
          ?.replace(/\//g, "__")}`;
        setDiff(`Proposed edit at ${stagedPath}`);
      }
    })();
  }, [syncRunId]);

  async function handleAction(action: "merge" | "reject") {
    const url =
      action === "merge"
        ? "/api/operator/merge-agent-edit"
        : "/api/operator/reject-agent-edit";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syncRunId }),
    });
    alert(res.ok ? `✅ ${action}ed` : `❌ Failed to ${action}`);
  }

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Review Agent Edit (SyncRun #{syncRunId})
      </h1>

      <div className="border p-4 rounded bg-gray-50 mb-4">
        <p><strong>Repo:</strong> {data.repo?.name}</p>
        <p><strong>File:</strong> {data.summary?.match(/to (.+)$/)?.[1]}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Trigger:</strong> {data.trigger}</p>
        <p><strong>Summary:</strong> {data.summary}</p>
      </div>

      <pre className="border p-3 bg-white overflow-auto whitespace-pre-wrap text-sm">
        {diff || "Diff view not yet implemented"}
      </pre>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handleAction("merge")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ✅ Approve & Merge
        </button>
        <button
          onClick={() => handleAction("reject")}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  );
}
