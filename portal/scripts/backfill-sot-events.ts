
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid'; // need to check if uuid is installed, if not use crypto

// Check package.json for uuid?
// user package.json has "bcryptjs", "openai", etc. but doesn't explicitly list "uuid".
// I'll use crypto.randomUUID() which is node standard.

import { randomUUID } from 'node:crypto';

async function main() {
    console.log('Backfilling SotEvents...');
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
