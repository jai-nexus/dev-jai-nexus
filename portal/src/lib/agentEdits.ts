import path from "node:path";
import { existsSync } from "node:fs";

// Prefer repo-root/workspace if present; otherwise portal/workspace
export function getWorkspaceRoot() {
    const cwd = process.cwd(); // usually portal/
    const candidates = [
        path.resolve(cwd, "..", "workspace"),
        path.resolve(cwd, "workspace"),
    ];
    for (const p of candidates) {
        if (existsSync(p)) return p;
    }
    // create-on-demand fallback (local/dev)
    return candidates[0];
}


// Sanitize a relative path to ensure it is safe and normalized
export function sanitizeRelPath(input: string): string {
    const s = input.replace(/\\/g, "/").trim();

    if (!s || s.startsWith("/") || s.includes("\0")) {
        throw new Error("Invalid path");
    }

    // prevent traversal
    const parts = s.split("/").filter(Boolean);
    if (parts.some((p) => p === "." || p === "..")) {
        throw new Error("Invalid path (traversal)");
    }

    return parts.join("/");
}

// Check if a path is safe to write to (must be within root)
export function isSafePath(root: string, target: string): boolean {
    const rel = path.relative(root, target);
    return !rel.startsWith("..") && !path.isAbsolute(rel);
}
