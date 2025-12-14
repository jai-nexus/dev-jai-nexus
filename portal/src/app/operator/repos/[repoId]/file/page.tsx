// portal/src/app/operator/repos/[repoId]/file/page.tsx
import Link from "next/link";
import { cookies, headers } from "next/headers";

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
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    "localhost:3000";

  return `${proto}://${host}`;
}

export default async function RepoFileViewPage({
  params,
  searchParams,
}: RepoFileViewPageProps) {
  const [{ repoId }, { path }] = await Promise.all([params, searchParams]);

  const repoIdNum = Number(repoId);

  if (!repoId || Number.isNaN(repoIdNum)) {
    return (
      <main className="min-h-screen bg-black text-gray-100 p-8">
        <h1 className="text-2xl font-semibold">Repo File · Error</h1>
        <p className="mt-2 text-sm text-red-400">
          Invalid repoId: <code className="font-mono">{String(repoId)}</code>
        </p>
        <BackLink repoId={repoId ?? "?"} />
      </main>
    );
  }

  if (!path) {
    return (
      <main className="min-h-screen bg-black text-gray-100 p-8">
        <h1 className="text-2xl font-semibold">Repo File · Error</h1>
        <p className="mt-2 text-sm text-red-400">
          Missing <code className="font-mono">path</code> query param.
        </p>
        <BackLink repoId={repoIdNum} />
      </main>
    );
  }

  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const h = await headers();
  const baseUrl = getBaseUrl(h);

  // Absolute URL (required for server-side fetch in Node)
  const apiUrl = new URL(
    `/api/repos/${repoIdNum}/file?path=${encodeURIComponent(path)}`,
    baseUrl
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
      <main className="min-h-screen bg-black text-gray-100 p-8">
        <h1 className="text-2xl font-semibold">Repo File · Error</h1>
        <p className="mt-2 text-sm text-red-400">
          Failed to load file <code className="font-mono">{path}</code>
          {errorMessage ? `: ${errorMessage}` : null}
        </p>
        <BackLink repoId={repoIdNum} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Repo File</h1>
        <p className="text-sm text-gray-400 mt-1">
          repoId: {data.repoId} · path:{" "}
          <code className="font-mono">{data.path}</code>
        </p>
        <div className="mt-2">
          <BackLink repoId={repoIdNum} />
        </div>
      </header>

      <div className="rounded-lg border border-gray-800 bg-zinc-950 p-4">
        <pre className="whitespace-pre-wrap break-words text-[11px] font-mono text-gray-100">
          {data.content}
        </pre>
      </div>
    </main>
  );
}

function BackLink({ repoId }: { repoId: number | string }) {
  return (
    <Link
      href={`/operator/repos/${repoId}`}
      className="text-xs text-sky-400 hover:underline"
    >
      ← Back to file list
    </Link>
  );
}
