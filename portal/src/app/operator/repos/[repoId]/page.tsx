// portal/src/app/operator/repos/[repoId]/page.tsx
import Link from "next/link";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  repoId: string;
};

type RepoFilesPageProps = {
  params: Promise<RouteParams>;
};

function ErrorView({
  title,
  detail,
}: {
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <OperatorPanel className="p-5">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            dev.jai.nexus / operator / repos / files
          </div>
          <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
            <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
            <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
            <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
          </div>
        </OperatorPanel>
        <OperatorGateCard>
          <OperatorBadge tone="blocked">READ ERROR</OperatorBadge>
          <p className="mt-2 text-sm text-red-200">{detail}</p>
          <Link
            href="/operator/repos"
            className="mt-4 inline-flex text-sm text-sky-300 underline hover:text-sky-200"
          >
            Back to repos
          </Link>
        </OperatorGateCard>
      </div>
    </main>
  );
}

export default async function RepoFilesPage({ params }: RepoFilesPageProps) {
  const resolved = await params;
  const rawRepoId = resolved?.repoId;
  const repoIdNum = Number(rawRepoId);

  if (!rawRepoId || Number.isNaN(repoIdNum)) {
    return (
      <ErrorView
        title="Repo Files / Error"
        detail={
          <>
            Invalid repoId:{" "}
            <code className="font-mono">{String(rawRepoId)}</code>
          </>
        }
      />
    );
  }

  const repo = await prisma.repo.findUnique({
    where: { id: repoIdNum },
  });

  if (!repo) {
    return (
      <ErrorView
        title="Repo Files / Error"
        detail={
          <>
            No repo found for id <code className="font-mono">{repoIdNum}</code>.
          </>
        }
      />
    );
  }

  const files = await prisma.fileIndex.findMany({
    where: { repoId: repoIdNum },
    orderBy: [{ dir: "asc" }, { filename: "asc" }],
    take: 2000,
  });

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / repos / files
            </div>
            <h1 className="mt-2 text-2xl font-semibold">
              Repo Files / {repo.name}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              repoId: {repoIdNum} / indexed files: {files.length}. File index
              display is DB-backed and read-only.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="advisory">INDEX DISPLAY</OperatorBadge>
              <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <Link
              href="/operator/repos"
              className="mt-4 inline-flex text-sm text-sky-300 underline hover:text-sky-200"
            >
              Back to repos
            </Link>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Repo File Index Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Write file</OperatorBlockedAction>
              <OperatorBlockedAction>Sync repo</OperatorBlockedAction>
              <OperatorBlockedAction>Open PR</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Read-only is not authority. Dashboard display does not authorize.
            </p>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel className="overflow-hidden p-0">
          <OperatorSectionHeader
            index="01"
            title="Indexed Files"
            className="m-3"
            right={
              <>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                <OperatorIdChip>{files.length} files</OperatorIdChip>
              </>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-slate-800 bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-2">Path</th>
                  <th className="px-4 py-2">Ext</th>
                  <th className="px-4 py-2 text-right">Size (bytes)</th>
                  <th className="px-4 py-2 text-slate-500">Last Commit</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="border-b border-slate-800/70 hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-1 font-mono text-[11px]">
                      <Link
                        href={`/operator/repos/${repoIdNum}/file?path=${encodeURIComponent(
                          file.path,
                        )}`}
                        className="text-sky-300 hover:underline"
                      >
                        {file.path}
                      </Link>
                    </td>
                    <td className="px-4 py-1 text-slate-300">
                      {file.extension || "-"}
                    </td>
                    <td className="px-4 py-1 text-right text-slate-300">
                      {file.sizeBytes}
                    </td>
                    <td className="px-4 py-1 font-mono text-[10px] text-slate-500">
                      {file.lastCommitSha ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </OperatorPanel>
      </div>
    </main>
  );
}
