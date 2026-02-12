/**
 * Parse ChatGPT/Claude plain-text exports into a normalized shape for ingest.
 *
 * Supported:
 * - Filename: YYYY-MM-DD_<topic>.txt
 * - Date-only: YYYY-MM-DD.txt
 * - Topic parts separated by "_" or "-"
 * - Content may include: "You said:" / "ChatGPT said:", citations, etc.
 *
 * Key behavior:
 * - Uses filename for date/title when available.
 * - Infers repo "touches" from text content (multi-repo supported).
 * - Stores primary repo as `source` and all repos as `tags`.
 */

export type ParsedChat = {
    title: string;
    date: Date;
    source: string; // primary repo or fallback bucket
    model?: string;
    nhId?: string;
    tags: string[]; // includes all inferred repos + quarter + filename tokens (deduped)
    fullText: string;

    // Useful for debugging/tuning (optional; ingest can store in notes)
    inferredRepos?: string[];
};

export type ExtractedDecision = {
    text: string;
    context: string;
    lineNumber: number;
    category?: string;
};

export type ParseFilenameResult = {
    date: Date;
    topic: string;
    rawTopic: string;
    // tokens from filename (minus date) that can be used as tag hints
    filenameTokens: string[];
};

/**
 * Extract date and topic from filename.
 *
 * Examples:
 * - "2026-01-30_audit-nexus.txt" -> date=2026-01-30, topic="audit nexus"
 * - "2025-06-14_Governance_RBAC_Proposal_Compare.txt" -> topic="Governance RBAC Proposal Compare"
 * - "2026-01-06.txt" -> topic="ChatLog 2026-01-06"
 */
export function parseFilename(filename: string): ParseFilenameResult {
    const basename = filename.replace(/\.txt$/i, "").trim();

    // Prefer leading YYYY-MM-DD
    const dateMatch = basename.match(/^(\d{4}-\d{2}-\d{2})(?:[_-](.+))?$/);
    if (dateMatch) {
        const dateStr = dateMatch[1];
        const rawTopic = (dateMatch[2] ?? "").trim();

        const date = safeParseDate(dateStr) ?? new Date();
        const filenameTokens = rawTopic ? splitTokens(rawTopic) : [];

        const topic = rawTopic ? formatTopic(rawTopic) : `ChatLog ${dateStr}`;
        return { date, topic, rawTopic, filenameTokens };
    }

    // Fallback: find any date inside the filename
    const anyDateMatch = basename.match(/(\d{4}-\d{2}-\d{2})/);
    const date = anyDateMatch ? safeParseDate(anyDateMatch[1]) ?? new Date() : new Date();

    const rawTopic = basename.replace(/\d{4}-\d{2}-\d{2}[_-]?/g, "").trim();
    const filenameTokens = rawTopic ? splitTokens(rawTopic) : [];

    const topic = rawTopic ? formatTopic(rawTopic) : `ChatLog ${toIsoDate(date)}`;
    return { date, topic, rawTopic, filenameTokens };
}

function safeParseDate(dateStr: string): Date | undefined {
    // "YYYY-MM-DD" parses as UTC in JS engines; still safe enough for day-level ordering.
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? undefined : d;
}

function toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatTopic(raw: string): string {
    // Keep words readable; don't try to preserve repo punctuation in titles.
    return raw.replace(/_/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function splitTokens(raw: string): string[] {
    return raw
        .toLowerCase()
        .replace(/\.txt$/i, "")
        .split(/[_-]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

/**
 * Detect model from content.
 * Keep this conservative; only return when fairly certain.
 */
function detectModel(content: string): string | undefined {
    const lower = content.toLowerCase();

    if (lower.includes("chatgpt o1")) return "o1";
    if (lower.includes("chatgpt 4o")) return "gpt-4o";
    if (lower.includes("gpt-4")) return "gpt-4";

    // Claude variants (adjust as your logs evolve)
    if (lower.includes("claude opus")) return "claude-opus-4";
    if (lower.includes("claude sonnet")) return "claude-sonnet-4";
    if (lower.includes("claude")) return "claude";

    return undefined;
}

/**
 * Extract NH ID from content.
 * Looks for patterns like "1.1.9", "nhId: 1.1.9", "NH: 1.1.9"
 */
function extractNhId(content: string): string | undefined {
    const explicitMatch = content.match(/(?:nhId|NH|nh):\s*(\d+(?:\.\d+)+)/i);
    if (explicitMatch) return explicitMatch[1];

    const repoMatch = content.match(/\b(1\.1\.\d+)\b/);
    if (repoMatch) return repoMatch[1];

    return undefined;
}

/**
 * Normalize a token for comparisons across "-" vs "_" vs punctuation.
 */
function normalizeToken(s: string): string {
    return s
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Infer which repos are touched by this chat based on content.
 * - Supports multiple repo touches.
 * - Returns repos sorted by confidence (highest first).
 *
 * Strategy:
 * - Strong signals: "github.com/jai-nexus/<repo>", exact repo token mentions
 * - Medium signals: normalized mentions (underscore/hyphen variants)
 * - Weak signals: loose phrase matches ("docs nexus")
 */
export function inferReposFromText(fullText: string, repoCandidates: string[]): string[] {
    const text = fullText.toLowerCase();
    const normText = normalizeToken(fullText);

    const candidates = Array.from(new Set(repoCandidates.map((r) => r.trim()).filter(Boolean)));
    const scored: Array<{ repo: string; score: number }> = [];

    for (const repo of candidates) {
        const repoLower = repo.toLowerCase();
        const repoNorm = normalizeToken(repo);

        let score = 0;

        // Strong: GitHub URL
        if (text.includes(`github.com/jai-nexus/${repoLower}`)) score += 10;
        if (text.includes(`github.com/jai-nexus/${repoNorm}`)) score += 9;

        // Strong: exact-ish token in raw text
        const rawRe = new RegExp(`(^|[^a-z0-9])${escapeRegExp(repoLower)}([^a-z0-9]|$)`, "g");
        if (rawRe.test(text)) score += 6;

        // Medium: token in normalized text (catches "_" variants)
        const normRe = new RegExp(`(^|[^a-z0-9])${escapeRegExp(repoNorm)}([^a-z0-9]|$)`, "g");
        if (normRe.test(normText)) score += 5;

        // Weak: loose phrase match (docs nexus)
        const loose = repoLower.replace(/-/g, " ");
        if (loose.length >= 6 && text.includes(loose)) score += 2;

        // Small heuristic examples (tune as needed)
        if (repoLower === "dev-jai-nexus" && (text.includes("portal/") || text.includes("portal\\"))) score += 2;

        if (score > 0) scored.push({ repo, score });
    }

    scored.sort((a, b) => (b.score - a.score) || a.repo.localeCompare(b.repo));
    return scored.map((s) => s.repo);
}

/**
 * Extract tags from filename + content.
 *
 * Tags are intended to be:
 * - stable filters (repos, quarters, key labels)
 * - deduped, lower-case, hyphenated
 */
function extractTags(
    filenameTokens: string[],
    content: string,
    inferredRepos: string[]
): string[] {
    const tags: string[] = [];

    // Include inferred repos as tags (highest value)
    tags.push(...inferredRepos);

    // Filename tokens can add useful hints, but keep them conservative
    // Skip tiny tokens and common noise
    const noise = new Set(["chatlogs", "chatlog", "log", "notes", "new", "folder"]);
    for (const t of filenameTokens) {
        const norm = normalizeToken(t);
        if (norm.length < 3) continue;
        if (noise.has(norm)) continue;
        tags.push(norm);
    }

    // Add quarter tag based on any YYYY-MM-DD we can find in content or filename tokens (prefer content for safety)
    const dateMatch = content.match(/\b(\d{4})-(\d{2})-\d{2}\b/) ?? null;
    if (dateMatch) {
        const year = dateMatch[1];
        const month = parseInt(dateMatch[2], 10);
        const quarter = Math.ceil(month / 3);
        tags.push(`${year}-q${quarter}`);
    }

    return dedupe(tags);
}

function dedupe(values: string[]): string[] {
    return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

/**
 * Parse a ChatGPT/Claude text export into a normalized ParsedChat.
 *
 * repoCandidates:
 * - pass in known repo names (from DB Repo.name) + any extra constants
 * - used to infer primary source + multi-repo tags
 *
 * defaultSource:
 * - used when no repo inference succeeds (e.g., generic logs)
 */
export function parseChatExport(
    filename: string,
    content: string,
    repoCandidates: string[],
    defaultSource = "jai-nexus"
): ParsedChat {
    const { date, topic, filenameTokens } = parseFilename(filename);

    const model = detectModel(content);
    const nhId = extractNhId(content);

    const inferredRepos = inferReposFromText(content, repoCandidates);

    // Primary source selection:
    // 1) best inferred repo (content wins)
    // 2) if filename has a repo-looking token, allow it as a fallback
    // 3) default
    const filenameRepoHint = inferReposFromText(filenameTokens.join(" "), repoCandidates)[0];
    const source = inferredRepos[0] ?? filenameRepoHint ?? defaultSource;

    const tags = extractTags(filenameTokens, content, inferredRepos);

    return {
        title: topic,
        date,
        source,
        model,
        nhId,
        tags,
        fullText: content,
        inferredRepos,
    };
}

/**
 * Backward compatible wrapper (if you already call parseChatGPTExport elsewhere).
 * Keeps "ChatGPT export" naming but uses the new inference pipeline.
 */
export function parseChatGPTExport(
    filename: string,
    content: string,
    repoCandidates: string[] = [],
    defaultSource = "jai-nexus"
): ParsedChat {
    return parseChatExport(filename, content, repoCandidates, defaultSource);
}

/**
 * Extract decisions from chat content.
 *
 * Markers:
 * - "Decision:" / "Decisions:"
 * - "we decided to"
 * - "locked in"
 * - "hard rule"
 * - "definition of done"
 * - "deprecated:"
 * - "timeline anchor"
 *
 * Notes:
 * - This is intentionally heuristic. Prefer recall over precision; you can tune later.
 */
export function extractDecisions(content: string): ExtractedDecision[] {
    const lines = content.split("\n");
    const decisions: ExtractedDecision[] = [];

    const decisionMarkers: RegExp[] = [
        /\bwe decided to\b/i,
        /\bdecision[s]?:\s*/i,
        /\blocked in\b/i,
        /\bwhat to do\b/i,
        /\bdefinition of done\b/i,
        /\bdeprecated:/i,
        /\btimeline anchor\b/i,
        /\bkey decision\b/i,
        /\bhard rule\b/i,
        /\bcore decision\b/i,
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        const matchesMarker = decisionMarkers.some((re) => re.test(line));

        if (!matchesMarker) continue;

        // Decision text: current line + up to 3 non-empty subsequent lines
        const decisionLines: string[] = [line];
        for (let j = i + 1; j < lines.length && j < i + 4; j++) {
            const nxt = lines[j] ?? "";
            if (!nxt.trim()) break;
            decisionLines.push(nxt);
        }

        const text = decisionLines.join(" ").trim();

        // Context: up to 2 previous non-empty lines
        const contextLines: string[] = [];
        for (let k = Math.max(0, i - 2); k < i; k++) {
            const prev = lines[k] ?? "";
            if (prev.trim()) contextLines.push(prev);
        }
        const context = contextLines.join(" ").trim();

        // Category heuristic
        let category: string | undefined;
        if (/deprecated/i.test(text)) category = "deprecated";
        else if (/definition of done|\bdod\b/i.test(text)) category = "milestone";
        else if (/timeline|anchor/i.test(text)) category = "timeline";
        else if (/architecture|schema|model/i.test(text)) category = "architecture";
        else category = "decision";

        decisions.push({
            text,
            context,
            lineNumber: i + 1,
            category,
        });
    }

    return decisions;
}
