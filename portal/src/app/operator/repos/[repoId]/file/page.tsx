// portal/src/app/operator/repos/[repoId]/file/page.tsx
import Link from "next/link";
import { cookies, headers } from "next/headers";

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

type RouteParams = {
  repoId: string;
};

type SearchParams = {
  path?: string;
};

type RepoFileViewPageProps = {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
};

export const runtime = "nodejs";
export const revalidate = 0;

function getBaseUrl(h: Headers) {
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";

  return `${proto}://${host}`;
}

function ErrorView({
  repoId,
  title,
  detail,
}: {
  repoId: number | string;
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <OperatorPanel className="p-5">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            dev.jai.nexus / operator / repos / file
          </div>
          <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
            <OperatorBadge tone="readOnly">READ-ONLY FILE PREVIEW</OperatorBadge>
            <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
            <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
          </div>
        </OperatorPanel>
        <OperatorGateCard>
          <OperatorBadge tone="blocked">READ ERROR</OperatorBadge>
          <p className="mt-2 text-sm text-red-200">{detail}</p>
          <BackLink repoId={repoId} />
        </OperatorGateCard>
      </div>
    </main>
  );
}

export default async function RepoFileViewPage({
  params,
  searchParams,
}: RepoFileViewPageProps) {
  const [{ repoId }, { path }] = await Promise.all([params, searchParams]);

  const repoIdNum = Number(repoId);

  if (!repoId || Number.isNaN(repoIdNum)) {
    return (
      <ErrorView
        repoId={repoId ?? "?"}
        title="Repo File / Error"
        detail={
          <>
            Invalid repoId: <code className="font-mono">{String(repoId)}</code>
          </>
        }
      />
    );
  }

  if (!path) {
    return (
      <ErrorView
        repoId={repoIdNum}
        title="Repo File / Error"
        detail={
          <>
            Missing <code className="font-mono">path</code> query param.
          </>
        }
      />
    );
  }

  const cookieHeader = (await cookies())
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const h = await headers();
  const baseUrl = getBaseUrl(h);

  const apiUrl = new URL(
    `/api/repos/${repoIdNum}/file?path=${encodeURIComponent(path)}`,
    baseUrl,
  );

  let data:
    | {
        repoId: number;
        path: string;
        content: string;
      }
    | null = null;

  let errorMessage: string | null = null;

  try {
    const res = await fetch(apiUrl.toString(), {
      cache: "no-store",
      credentials: "include",
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body?.error) msg = body.error;
      } catch {
        // ignore JSON parse errors
      }
      errorMessage = msg;
    } else {
      data = (await res.json()) as {
        repoId: number;
        path: string;
        content: string;
      };
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Unknown fetch error";
  }

  if (!data) {
    return (
      <ErrorView
        repoId={repoIdNum}
        title="Repo File / Error"
        detail={
          <>
            Failed to load file <code className="font-mono">{path}</code>
            {errorMessage ? `: ${errorMessage}` : null}
          </>
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / repos / file
            </div>
            <h1 className="mt-2 text-2xl font-semibold">Repo File Preview</h1>
            <p className="mt-2 text-sm text-slate-400">
              repoId: {data.repoId} / path:{" "}
              <code className="font-mono">{data.path}</code>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY FILE PREVIEW</OperatorBadge>
              <OperatorBadge tone="readOnly">INTERNAL API READ</OperatorBadge>
              <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <BackLink repoId={repoIdNum} />
          </OperatorPanel>

          <OperatorSafetyRail
            title="Repo File Preview Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Edit file</OperatorBlockedAction>
              <OperatorBlockedAction>Commit change</OperatorBlockedAction>
              <OperatorBlockedAction>Open PR</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              DB-backed display is read-only unless explicitly routed
              otherwise. Prompt text is not dispatch.
            </p>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="01"
            title="File Content"
            right={
              <>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                <OperatorIdChip>{data.path}</OperatorIdChip>
              </>
            }
          />
          <pre className="max-h-[75vh] overflow-auto whitespace-pre-wrap break-words rounded border border-slate-800 bg-slate-950/60 p-4 font-mono text-[11px] text-slate-100">
            {data.content}
          </pre>
        </OperatorPanel>
      </div>
    </main>
  );
}

function BackLink({ repoId }: { repoId: number | string }) {
  return (
    <Link
      href={`/operator/repos/${repoId}`}
      className="mt-4 inline-flex text-xs text-sky-300 underline hover:text-sky-200"
    >
      Back to file list
    </Link>
  );
}
