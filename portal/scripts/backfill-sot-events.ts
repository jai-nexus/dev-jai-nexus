import { prisma } from '@/lib/prisma';
import { randomUUID } from 'node:crypto';

async function main() {
    console.log('Backfilling SotEvents...');
    const events = await prisma.sotEvent.findMany({
        where: { eventId: null } as any
    });

    console.log(`Found ${events.length} events to backfill.`);

    for (const evt of events) {
        await prisma.sotEvent.update({
            where: { id: evt.id },
            data: { eventId: randomUUID() }
        });
    }
    console.log('Done.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
