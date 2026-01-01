
import { PrismaClient } from '../prisma/generated/prisma';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL,
        },
    },
});

async function main() {
    console.log('Backfilling SotEvents (Raw Client)...');
    const events = await prisma.sotEvent.findMany({
        where: { eventId: null }
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
