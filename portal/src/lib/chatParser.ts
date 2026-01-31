/**
 * Parse ChatGPT export format
 * 
 * Format:
 * - Filename: YYYY-MM-DD_<topic>.txt
 * - Alternates: "You said:" / "ChatGPT said:"
 * - May include: "Thought for Xs", citations, etc.
 */

export type ParsedChat = {
    title: string;
    date: Date;
    source: string;
    model?: string;
    nhId?: string;
    tags: string[];
    fullText: string;
};

export type ExtractedDecision = {
    text: string;
    context: string;
    lineNumber: number;
    category?: string;
};

/**
 * Extract date and topic from filename
 * Examples:
 *   "2026-01-30_audit-nexus.txt" → { date: 2026-01-30, topic: "audit-nexus" }
 *   "2025-06-14_Governance_RBAC_Proposal_Compare.txt" → { date: 2025-06-14, topic: "Governance RBAC Proposal Compare" }
 */
export function parseFilename(filename: string): { date: Date; topic: string } {
    const basename = filename.replace(/\.txt$/i, '');

    // Match YYYY-MM-DD_<topic>
    const match = basename.match(/^(\d{4}-\d{2}-\d{2})_(.+)$/);

    if (!match) {
        // Fallback: try to find any date
        const dateMatch = basename.match(/(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? new Date(dateMatch[1]) : new Date();
        const topic = basename.replace(/\d{4}-\d{2}-\d{2}[_-]?/g, '').trim() || 'Untitled';

        return { date, topic: formatTopic(topic) };
    }

    const date = new Date(match[1]);
    const topic = formatTopic(match[2]);

    return { date, topic };
}

function formatTopic(raw: string): string {
    return raw
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .trim();
}

/**
 * Detect model from content
 */
function detectModel(content: string): string | undefined {
    const lower = content.toLowerCase();

    if (lower.includes('chatgpt o1')) return 'o1';
    if (lower.includes('chatgpt 4o')) return 'gpt-4o';
    if (lower.includes('gpt-4')) return 'gpt-4';
    if (lower.includes('claude opus')) return 'claude-opus-4';
    if (lower.includes('claude sonnet')) return 'claude-sonnet-4';

    return undefined;
}

/**
 * Extract NH ID from content
 * Looks for patterns like "1.1.9", "nhId: 1.1.9", "NH: 1.1.9"
 */
function extractNhId(content: string): string | undefined {
    // Look for explicit NH markers
    const explicitMatch = content.match(/(?:nhId|NH|nh):\s*(\d+(?:\.\d+)+)/i);
    if (explicitMatch) return explicitMatch[1];

    // Look for repo ID patterns (1.1.X format)
    const repoMatch = content.match(/\b(1\.1\.\d+)\b/);
    if (repoMatch) return repoMatch[1];

    return undefined;
}

/**
 * Extract tags from filename and content
 */
function extractTags(filename: string, content: string): string[] {
    const tags: string[] = [];

    // From filename
    const basename = filename.toLowerCase().replace(/\.txt$/i, '');
    const parts = basename.split(/[_-]/);

    // Add topic parts as tags
    if (parts.length > 1) {
        const topicParts = parts.slice(1); // Skip date
        tags.push(...topicParts.filter(p => p.length > 2));
    }

    // Add quarter if detectable
    const dateMatch = basename.match(/(\d{4})-(\d{2})-\d{2}/);
    if (dateMatch) {
        const year = dateMatch[1];
        const month = parseInt(dateMatch[2], 10);
        const quarter = Math.ceil(month / 3);
        tags.push(`${year}-Q${quarter}`);
    }

    // Common repo names
    const repoPattern = /(audit|docs|sot|vscode|dev-jai|jai-format)-nexus/gi;
    const repoMatches = content.match(repoPattern);
    if (repoMatches) {
        const uniqueRepos = [...new Set(repoMatches.map(r => r.toLowerCase()))];
        tags.push(...uniqueRepos);
    }

    return [...new Set(tags)]; // dedupe
}

/**
 * Parse ChatGPT export
 */
export function parseChatGPTExport(
    filename: string,
    content: string
): ParsedChat {
    const { date, topic } = parseFilename(filename);
    const model = detectModel(content);
    const nhId = extractNhId(content);
    const tags = extractTags(filename, content);

    return {
        title: topic,
        date,
        source: 'chatgpt',
        model,
        nhId,
        tags,
        fullText: content,
    };
}

/**
 * Extract decisions from chat content
 * 
 * Decision markers:
 * - "we decided to"
 * - "Decision:", "Decisions:"
 * - "locked in"
 * - "What to do"
 * - "Definition of done"
 * - "deprecated:"
 * - "timeline anchor"
 */
export function extractDecisions(content: string): ExtractedDecision[] {
    const lines = content.split('\n');
    const decisions: ExtractedDecision[] = [];

    const decisionMarkers = [
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
        const line = lines[i];

        // Check if line matches any decision marker
        const matchesMarker = decisionMarkers.some(regex => regex.test(line));

        if (matchesMarker) {
            // Extract decision text (current line + next 2-3 lines for context)
            const decisionLines = [line];
            let j = i + 1;
            while (j < lines.length && j < i + 4 && lines[j].trim()) {
                decisionLines.push(lines[j]);
                j++;
            }

            const text = decisionLines.join(' ').trim();

            // Get surrounding context (2 lines before)
            const contextLines: string[] = [];
            for (let k = Math.max(0, i - 2); k < i; k++) {
                if (lines[k].trim()) contextLines.push(lines[k]);
            }
            const context = contextLines.join(' ').trim();

            // Categorize
            let category: string | undefined;
            if (/deprecated/i.test(text)) category = 'deprecated';
            else if (/definition of done|DoD/i.test(text)) category = 'milestone';
            else if (/timeline|anchor/i.test(text)) category = 'timeline';
            else if (/architecture|schema|model/i.test(text)) category = 'architecture';
            else category = 'decision';

            decisions.push({
                text,
                context,
                lineNumber: i + 1,
                category,
            });
        }
    }

    return decisions;
}
