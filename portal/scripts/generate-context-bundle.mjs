#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");

function todayStamp() {
    return new Date().toISOString().slice(0, 10);
}

function utcNow() {
    return new Date().toISOString();
}

function getArgValue(flag) {
    const idx = process.argv.indexOf(flag);
    if (idx === -1) return null;
    return process.argv[idx + 1] ?? null;
}

function git(args) {
    try {
        return execFileSync("git", args, {
            cwd: REPO_ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
    } catch {
        return "";
    }
}

function runNodeScript(scriptName, extraArgs = []) {
    execFileSync("node", [path.join(REPO_ROOT, "portal", "scripts", scriptName), ...extraArgs], {
        cwd: REPO_ROOT,
        stdio: "inherit",
    });
}

async function replaceFile(fromPath, toPath) {
    if (fromPath === toPath) return;
    await fs.rm(toPath, { force: true });
    await fs.rename(fromPath, toPath);
}

async function readIfExists(filePath) {
    try {
        return await fs.readFile(filePath);
    } catch (err) {
        if (err && err.code === "ENOENT") return null;
        throw err;
    }
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const motionId = getArgValue("--motion");
    const args = motionId ? ["--motion", motionId] : [];

    runNodeScript("generate-motion-snapshot.mjs");
    runNodeScript("generate-repo-capsule.mjs");
    runNodeScript("generate-active-path-pack.mjs", args);

    const date = todayStamp();
    const motionScoped = motionId !== null;
    const prefix = motionScoped ? `${date}_${motionId}` : date;
    const defaultFiles = [
        `${date}_motion-snapshots.txt`,
        `${date}_repo-capsule.txt`,
        `${date}_active-path-pack.txt`,
    ];
    const preservedDefaults = motionScoped
        ? await Promise.all(
            defaultFiles.map((name) => readIfExists(path.join(OUTPUT_DIR, name))),
        )
        : [];
    const files = motionScoped
        ? defaultFiles.map((name) => name.replace(`${date}_`, `${prefix}_`))
        : defaultFiles;

    if (motionScoped) {
        for (let i = 0; i < defaultFiles.length; i += 1) {
            await replaceFile(
                path.join(OUTPUT_DIR, defaultFiles[i]),
                path.join(OUTPUT_DIR, files[i]),
            );
            if (preservedDefaults[i] !== null) {
                await fs.writeFile(
                    path.join(OUTPUT_DIR, defaultFiles[i]),
                    preservedDefaults[i],
                );
            }
        }
    }

    const manifest = {
        schema: "context-bundle-0.2",
        generated_at: utcNow(),
        repo: "dev-jai-nexus",
        branch: git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)",
        head_commit: git(["rev-parse", "--short", "HEAD"]) || "(unknown)",
        motion: motionId,
        motion_scoped: motionScoped,
        output_dir: path.relative(REPO_ROOT, OUTPUT_DIR).replaceAll("\\", "/"),
        files,
    };

    const manifestPath = path.join(
        OUTPUT_DIR,
        `${prefix}_context-bundle_manifest.json`,
    );

    await fs.writeFile(
        manifestPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "utf8",
    );

    console.log(manifestPath);
}

main().catch((err) => {
    console.error("[generate-context-bundle] FAILED");
    console.error(err);
    process.exit(1);
});
