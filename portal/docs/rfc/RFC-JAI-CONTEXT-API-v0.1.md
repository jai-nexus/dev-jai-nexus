# RFC-JAI-CONTEXT-API-v0.1

Status: draft  
Owner: JAI NEXUS · dev.jai.nexus  
Scope: Workspace context for JAI agents

## 1. Purpose

The JAI Context API exposes the poly-repo workspace used by JAI agents and operator tools.

Goals:

- Single, canonical source of truth for which repos exist and where they live.
- Fast listing of files per repo, with basic metadata.
- Safe way to read file content given a repo-relative path.
- Stable contract that can be wired into JAI agents (ChatGPT custom GPT, future Pilot, etc.).

This API is read-only in v0.1.

---

## 2. Base URL

Local dev:

- http://localhost:3000/api

Production (future):

- https://dev.jai.nexus/api  (TBD)

All endpoints below are relative to `/api`.

---

## 3. Endpoints

### 3.1 `GET /repos`

List repos known to dev.jai.nexus.

**Request**

- No query parameters.

**Response**

Returns an array of `RepoSummary` objects.

Type:

type RepoSummary = {
  id: number;
  nhId: string;
  name: string;
  domainPod: string | null;
  engineGroup: string | null;
  status: string | null;        // e.g. "ACTIVE", "SLEEPING"
  githubUrl: string | null;
  defaultBranch: string | null;
};

Notes:

- `id` is the primary key from the `Repo` table. This value is used as `:repoId` in other endpoints.
- `nhId` is the NH registry identifier (e.g. "2.1.2").
- This endpoint currently returns all repos in the table; consumers may filter by `status`.

---

### 3.2 `GET /repos/:repoId/files`

List indexed files for a given repo.

**Path parameters**

- `repoId` (required, number) — the `Repo.id` value.

**Query parameters**

All are optional:

- `ext` — comma-separated list of file extensions to include (no leading dots).
  - Examples:
    - `ext=ts`
    - `ext=ts,tsx`
    - `ext=ts,tsx,py`
- `prefix` — only include files whose `path` starts with this prefix.
  - Example: `prefix=portal/src/app`
- `limit` — maximum number of files to return.
  - Default: `1000`
  - Minimum: `1`
  - Maximum: `5000` (values above this are clamped to 5000)

If `repoId` is not a valid integer, the endpoint returns HTTP 400.  
If no repo exists with that id, the endpoint returns HTTP 404.

**Response**

Returns an array of `RepoFileRecord` objects.

Type:

type RepoFileRecord = {
  id: number;
  path: string;                 // full repo-relative path, e.g. "portal/src/app/operator/page.tsx"
  dir: string;                  // directory component, e.g. "portal/src/app/operator"
  filename: string;             // filename only, e.g. "page.tsx"
  extension: string | null;     // e.g. "ts", "tsx", "py"
  sizeBytes: number;
  sha256: string;               // content hash recorded at index time
  lastCommitSha: string | null; // optional VCS commit id, if available
};

Examples:

- `GET /api/repos/1/files`  
  Returns up to 1000 files for repo 1.

- `GET /api/repos/1/files?ext=ts,tsx&prefix=portal/src`  
  Returns TypeScript / TSX files under `portal/src` for repo 1.

---

### 3.3 `GET /repos/:repoId/file`

Fetch the raw text content for a single file in a repo.

This is a thin shim over the local workspace checkout; it uses the indexed
file table (`FileIndex`) only to validate that the path is known for that repo.

**Path parameters**

- `repoId` (required, number) — the `Repo.id` value.

**Query parameters**

- `path` (required, string) — full repo-relative path to the file.
  - Example: `path=portal/src/app/operator/page.tsx`

If `repoId` is not a valid integer, the endpoint returns HTTP 400.  
If the repo does not exist, the endpoint returns HTTP 404.  
If `path` is missing or empty, the endpoint returns HTTP 400.  
If the file does not exist on disk, the endpoint returns HTTP 404.

**Response**

On success, returns a JSON object:

type RepoFileContent = {
  repoId: number;
  path: string;
  content: string;   // UTF-8 text content of the file
};

Notes:

- This endpoint is intended for text files. Binary files are not currently handled in v0.1.
- `content` is returned as-is; consumers are expected to handle large files responsibly.

---

## 4. Error Handling

Common error patterns:

- `400 Bad Request`
  - Invalid `repoId` (not a number).
  - Missing or invalid `path` for `GET /repos/:repoId/file`.
- `404 Not Found`
  - `repoId` does not exist in the `Repo` table.
  - Requested file path is not found.
- `500 Internal Server Error`
  - Unexpected failures (database, filesystem, etc.).

Errors are returned as JSON objects of the form:

{
  error: string;
}

The exact message is intended for operator / agent debugging and is not guaranteed to be stable across versions.

---

## 5. Versioning

This is v0.1 of the JAI Context API.

Planned changes for future versions (non-exhaustive):

- Additional filters (e.g. by directory depth, file size ranges).
- Richer metadata (e.g. git blame snippets, last modified timestamps).
- Streaming interfaces for very large files or file sets.
- AuthN/AuthZ and multi-tenant workspaces once dev.jai.nexus is public-facing.
