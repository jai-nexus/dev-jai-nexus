
import { prisma } from '@/lib/prisma';

async function main() {
    console.log('Deleting all SotEvents...');
    const { count } = await prisma.sotEvent.deleteMany({});
    console.log(`Deleted ${count} events.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
