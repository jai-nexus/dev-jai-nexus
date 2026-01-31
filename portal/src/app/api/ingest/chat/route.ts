import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recordSotEvent } from '@/lib/sotEvents';
import crypto from 'node:crypto';

type IngestChatRequest = {
    content: string;
    title?: string;
    source?: string;
    chatDate?: string;
    model?: string;
    nhId?: string;
    tags?: string[];
    filepath?: string;
};

function extractTitle(content: string): string {
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return 'Untitled Chat';
    const first = lines[0];
    if (first.startsWith('# ')) return first.slice(2).trim();
    if (first.toLowerCase().startsWith('title:')) return first.slice(6).trim();
    return first.length > 100 ? first.slice(0, 100) + '...' : first;
}

function detectSource(content: string): string {
    const lower = content.toLowerCase();
    if (lower.includes('chatgpt') || lower.includes('openai')) return 'chatgpt';
    if (lower.includes('claude') || lower.includes('anthropic')) return 'claude';
    return 'manual';
}

function generateChatId(title: string, date: Date): string {
    const dateStr = date.toISOString().split('T')[0];
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
    return `${dateStr}-${slug}`;
}

async function createChat(params: {
    chatId: string;
    title: string;
    source: string;
    chatDate: Date;
    content: string;
    contentHash: string;
    filepath?: string;
    model?: string;
    nhId?: string;
    tags?: string[];
}) {
    const chat = await prisma.chat.create({
        data: {
            chatId: params.chatId,
            title: params.title,
            source: params.source,
            chatDate: params.chatDate,
            fullText: params.content,
            contentHash: params.contentHash,
            filepath: params.filepath ?? null,
            model: params.model ?? null,
            nhId: params.nhId ?? '',
            tags: params.tags ?? [],
        },
    });

    await recordSotEvent({
        ts: new Date().toISOString(),
        source: 'chat-ingest',
        kind: 'chat.ingested',
        summary: `Ingested chat: ${params.title}`,
        nhId: params.nhId,
        payload: {
            chatId: chat.id,
            chatIdStr: chat.chatId,
            source: params.source,
            chatDate: params.chatDate.toISOString(),
        },
    });

    return chat;
}

export async function POST(request: NextRequest) {
    try {
        // Simple auth check: allow localhost or check internal token
        const host = request.headers.get('host');
        const isLocal = host?.includes('localhost') || host?.includes('127.0.0.1');

        if (!isLocal) {
            // Check for internal auth token
            const authHeader = request.headers.get('authorization');
            const internalToken = process.env.INTERNAL_INGEST_TOKEN;

            if (internalToken && authHeader !== `Bearer ${internalToken}`) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
        }

        const body: IngestChatRequest = await request.json();

        if (!body.content || typeof body.content !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid "content" field' },
                { status: 400 }
            );
        }

        const title = body.title || extractTitle(body.content);
        const source = body.source || detectSource(body.content);
        const chatDate = body.chatDate ? new Date(body.chatDate) : new Date();
        const chatId = generateChatId(title, chatDate);

        const contentHash = crypto.createHash('sha256').update(body.content).digest('hex');

        const existing = await prisma.chat.findUnique({ where: { chatId } });

        if (existing) {
            if (existing.contentHash === contentHash) {
                return NextResponse.json({
                    chat: existing,
                    created: false,
                    message: 'Chat already exists with same content',
                });
            }

            const newChatId = `${chatId}-v${Date.now()}`;
            const chat = await createChat({
                chatId: newChatId,
                title: `${title} (updated)`,
                source,
                chatDate,
                content: body.content,
                contentHash,
                filepath: body.filepath,
                model: body.model,
                nhId: body.nhId,
                tags: body.tags,
            });

            return NextResponse.json({ chat, created: true });
        }

        const chat = await createChat({
            chatId,
            title,
            source,
            chatDate,
            content: body.content,
            contentHash,
            filepath: body.filepath,
            model: body.model,
            nhId: body.nhId,
            tags: body.tags,
        });

        return NextResponse.json({ chat, created: true });

    } catch (error) {
        console.error('Chat ingest error:', error);
        return NextResponse.json(
            { error: 'Failed to ingest chat' },
            { status: 500 }
        );
    }
}
