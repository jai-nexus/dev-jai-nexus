// portal/src/app/operator/repos/[repoId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type RepoFilesPageProps = {
  params: Promise<{
    repoId: string;
  }>;
};

export default async function RepoFilesPage({ params }: RepoFilesPageProps) {
  // ⬅️ key fix: await params
  const { repoId } = await params;
  const repoIdNum = Number(repoId);

  if (Number.isNaN(repoIdNum)) {
    notFound();
  }

  const repo = await prisma.repo.findUnique({
    where: { id: repoIdNum },
  });
  if (!repo) {
    notFound();
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
                  {f.path}
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
