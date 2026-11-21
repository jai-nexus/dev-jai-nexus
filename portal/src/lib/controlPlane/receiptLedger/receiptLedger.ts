import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { canonicalJson, ledgerEventPath, receiptHash, validate } from "../../../../scripts/validate-package-format-2.mjs";

export { canonicalJson, receiptHash };

export interface AppendRequest {
  repository: string; // Local bare Git store with main and an existing proposal branch.
  branch: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  event: unknown;
}

function git(root: string, args: string[], input?: string): string {
  return execFileSync("git", ["--no-replace-objects", "-c", "core.hooksPath=/dev/null", "-c", "commit.gpgSign=false",
    "-c", "user.name=Receipt ledger", "-c", "user.email=receipt-ledger@localhost", ...args],
  { cwd: root, encoding: "utf8", input, stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, GIT_ALLOW_PROTOCOL: "file", GIT_NO_LAZY_FETCH: "1" } }).trimEnd();
}

export interface WriterContext {
  role: "builder" | "verifier" | "control-thread";
  principalId: string;
  actorId: string;
}

// Git verifies both observed refs under lock before the proposal branch can advance.
export async function appendReceipt(request: AppendRequest, writer: WriterContext) {
  const { branch, expectedBaseSha, expectedHeadSha } = request;
  const repository = path.resolve(request.repository);
  if (![expectedBaseSha, expectedHeadSha].every(sha => /^[a-f0-9]{40}$/.test(sha)))
    throw new Error("Expected exact base and head SHAs");
  const ref = "refs/heads/" + branch;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(branch) || branch.toLowerCase() === "main")
    throw new Error("Expected a proposal branch");
  git(repository, ["check-ref-format", ref]);
  if (git(repository, ["rev-parse", "--is-bare-repository"]) !== "true" ||
      git(repository, ["worktree", "list", "--porcelain"]).split("\n").includes("branch " + ref))
    throw new Error("Expected an isolated bare proposal repository");
  if (git(repository, ["rev-parse", "refs/heads/main"]) !== expectedBaseSha ||
      git(repository, ["rev-parse", ref]) !== expectedHeadSha) throw new Error("Stale base or proposal head");

  const bytes = canonicalJson(request.event);
  const event = JSON.parse(bytes);
  const file = ledgerEventPath(event);
  if (event.writer_role !== writer.role || event.principal_id !== writer.principalId || event.actor_id !== writer.actorId)
    throw new Error("Receipt does not match caller's writer context");
  const hash = receiptHash(event);
  const dir = mkdtempSync(path.join(tmpdir(), "jai-receipt-"));
  try {
    git(dir, ["clone", "--local", "--shared", "--no-checkout", repository, "."]);
    git(dir, ["config", "core.autocrlf", "false"]);
    git(dir, ["checkout", "--quiet", "--detach", expectedHeadSha]);
    let head = expectedHeadSha;
    const duplicate = Boolean(git(dir, ["ls-tree", "HEAD", "--", file]));
    if (duplicate) {
      if (canonicalJson(JSON.parse(git(dir, ["show", "HEAD:" + file]))) !== bytes)
        throw new Error("Conflicting receipt payload");
    } else {
      const blob = git(dir, ["hash-object", "-w", "--stdin"], bytes + "\n");
      git(dir, ["update-index", "--add", "--cacheinfo", "100644", blob, file]);
      const tree = git(dir, ["write-tree"]);
      head = git(dir, ["commit-tree", tree, "-p", expectedHeadSha, "-m", "Append receipt " + event.event_id]);
      git(dir, ["checkout", "--quiet", "--force", "--detach", head]);
    }
    // Replays all streams against frozen contracts, bound blobs and Git history.
    await validate(dir, expectedBaseSha);
    if (!duplicate) git(repository, ["fetch", "--no-tags", "--no-write-fetch-head", dir, head]);
    const change = duplicate ? `verify ${ref} ${head}` : `update ${ref} ${head} ${expectedHeadSha}`;
    git(repository, ["update-ref", "--stdin"], `verify refs/heads/main ${expectedBaseSha}\noption no-deref\n${change}\n`);
    return { head, path: file, hash, appended: !duplicate };
  } finally {
    rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
  }
}
