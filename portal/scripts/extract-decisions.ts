import { prisma } from '@/lib/prisma';
import { extractDecisions } from '@/lib/chatParser';

async function main() {
    console.log('JAI NEXUS - Decision Extraction');
    console.log('================================\n');

    // Get all chats
    const chats = await prisma.chat.findMany({
        orderBy: { chatDate: 'asc' },
        include: {
            _count: { select: { decisions: true } },
        },
    });

    console.log(`Found ${chats.length} chats\n`);

    let totalCreated = 0;

    for (const chat of chats) {
        // Skip chats that already have decisions extracted
        if (chat._count.decisions > 0) {
            console.log(`  ⏭️  ${chat.title} — already has ${chat._count.decisions} decisions, skipping`);
            continue;
        }

        console.log(`  🔍 ${chat.title} (${chat.fullText.length} chars)...`);

        const decisions = extractDecisions(chat.fullText);

        if (decisions.length === 0) {
            console.log(`      → 0 decisions found`);
            continue;
        }

        // Batch create decisions
        const created = await prisma.decision.createMany({
            data: decisions.map((d) => ({
                chatId: chat.id,
                text: d.text,
                context: d.context || null,
                lineNumber: d.lineNumber,
                category: d.category || null,
                status: 'active',
                nhId: chat.nhId || '',
            })),
        });

        console.log(`      → ${created.count} decisions extracted`);
        totalCreated += created.count;
    }

    console.log(`\n================================`);
    console.log(`Done. ${totalCreated} decisions created across ${chats.length} chats.`);
}

main()
    .catch((err) => {
        console.error('Decision extraction failed:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
