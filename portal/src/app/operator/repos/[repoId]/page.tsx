import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type RepoFilesPageProps = {
  params: {
    repoId: string;
  };
  searchParams?: {
    ext?: string;
    prefix?: string;
    limit?: string;
  };
};

export const runtime = "nodejs";
export const revalidate = 0;

export default async function RepoFilesPage({
  params,
  searchParams,
}: RepoFilesPageProps) {
  const repoIdNum = Number(params.repoId);

  if (Number.isNaN(repoIdNum)) {
    notFound();
  }

  const repo = await prisma.repo.findUnique({
    where: { id: repoIdNum },
  });

  if (!repo) {
    notFound();
  }

  const extParam = searchParams?.ext?.trim() ?? "";
  const prefix = (searchParams?.prefix ?? "").trim();

  const limitParam = searchParams?.limit ?? "";
  const limitRaw = Number(limitParam || "1000");
  const limit = Number.isNaN(limitRaw)
    ? 1000
    : Math.min(Math.max(limitRaw, 1), 5000);

  const extList = extParam
    ? extParam
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  const files = await prisma.fileIndex.findMany({
    where: {
      repoId: repoIdNum,
      ...(extList.length ? { extension: { in: extList } } : {}),
      ...(prefix ? { path: { startsWith: prefix } } : {}),
    },
    orderBy: [{ dir: "asc" }, { filename: "asc" }],
    take: limit,
  });

  const displayExt = extParam || "all";
  const displayPrefix = prefix || "—";

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">
          Repo Files · {repo.name}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          repoId: {repoIdNum} · files: {files.length} · ext:{" "}
          <span className="font-mono">{displayExt}</span> · prefix:{" "}
          <span className="font-mono">{displayPrefix}</span> · limit:{" "}
          <span className="font-mono">{limit}</span>
        </p>
      </header>

      {/* Filters */}
      <section className="mb-4">
        <form className="flex flex-wrap items-end gap-3 text-xs" method="GET">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400">Extensions (comma-sep)</label>
            <input
              name="ext"
              defaultValue={extParam}
              placeholder="ts,tsx,py"
              className="rounded border border-gray-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400">Path prefix</label>
            <input
              name="prefix"
              defaultValue={prefix}
              placeholder="portal/src/app"
              className="rounded border border-gray-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400">Limit</label>
            <input
              name="limit"
              defaultValue={limit.toString()}
              className="w-20 rounded border border-gray-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="mt-1 rounded border border-sky-500 px-3 py-1 text-[11px] font-medium text-sky-300 hover:bg-sky-500/10"
          >
            Apply
          </button>

          <Link
            href={`/operator/repos/${repoIdNum}`}
            className="mt-1 text-[11px] text-gray-400 hover:text-gray-200 hover:underline"
          >
            Reset
          </Link>
        </form>
      </section>

      {/* File table */}
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
                  <Link
                    href={`/api/repos/${repoIdNum}/file?path=${encodeURIComponent(
                      f.path,
                    )}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {f.path}
                  </Link>
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
