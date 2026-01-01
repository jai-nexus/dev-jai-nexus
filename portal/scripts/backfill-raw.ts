
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

if (process.env.DIRECT_URL) {
    process.env.DATABASE_URL = process.env.DIRECT_URL;
}
const prisma = new PrismaClient();

async function main() {
    console.log('Backfilling SotEvents (Raw Client)...');
    const events = await prisma.sotEvent.findMany({
        where: { eventId: null } as any // Cast to any to bypass strict null check if needed, or handle correctly
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
