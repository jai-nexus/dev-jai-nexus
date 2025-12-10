// portal/src/app/operator/repos/[repoId]/page.tsx
import { prisma } from "@/lib/prisma";

type RouteParams = {
  repoId: string;
};

type RepoFilesPageProps = {
  params: Promise<RouteParams>;
};

export default async function RepoFilesPage({ params }: RepoFilesPageProps) {
  const resolved = await params;
  const rawRepoId = resolved?.repoId;
  const repoIdNum = Number(rawRepoId);

  if (!rawRepoId || Number.isNaN(repoIdNum)) {
    return (
      <main className="min-h-screen bg-black text-gray-100 p-8">
        <h1 className="text-2xl font-semibold">Repo Files · Error</h1>
        <p className="mt-2 text-sm text-red-400">
          Invalid repoId:{" "}
          <code className="font-mono">{String(rawRepoId)}</code>
        </p>
      </main>
    );
  }

  const repo = await prisma.repo.findUnique({
    where: { id: repoIdNum },
  });

  if (!repo) {
    return (
      <main className="min-h-screen bg-black text-gray-100 p-8">
        <h1 className="text-2xl font-semibold">Repo Files · Error</h1>
        <p className="mt-2 text-sm text-red-400">
          No repo found for id{" "}
          <code className="font-mono">{repoIdNum}</code>.
        </p>
      </main>
    );
  }

  const files = await prisma.fileIndex.findMany({
    where: { repoId: repoIdNum },
    orderBy: [{ dir: "asc" }, { filename: "asc" }],
    take: 2000,
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          Repo Files · {repo.name}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          repoId: {repoIdNum} · files: {files.length}
        </p>
      </header>

      <div className="rounded-lg border border-gray-800 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-zinc-900 text-gray-400">
            <tr>
              <th className="px-4 py-2">Path</th>
              <th className="px-4 py-2">Ext</th>
              <th className="px-4 py-2 text-right">Size (bytes)</th>
              <th className="px-4 py-2 text-gray-500">Last Commit</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr
                key={f.id}
                className="border-b border-gray-900/60 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-1 font-mono text-[11px]">
                  <a
                    href={`/api/repos/${repoIdNum}/file?path=${encodeURIComponent(
                      f.path,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {f.path}
                  </a>
                </td>
                <td className="px-4 py-1 text-gray-300">
                  {f.extension || "—"}
                </td>
                <td className="px-4 py-1 text-right text-gray-300">
                  {f.sizeBytes}
                </td>
                <td className="px-4 py-1 font-mono text-[10px] text-gray-500">
                  {f.lastCommitSha ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
