
import fs from 'fs';
import path from 'path';

const dtsPath = path.resolve('node_modules/@prisma/client/index.d.ts');
if (fs.existsSync(dtsPath)) {
    const content = fs.readFileSync(dtsPath, 'utf8');
    const clientClass = content.match(/export class PrismaClient<[^>]*> {[\s\S]*?constructor\(([^)]*)\)/);
    const optionsType = content.match(/export type PrismaClientOptions = {[\s\S]*?}/);

    console.log("Constructor:", clientClass ? clientClass[0] : "Not found");
    console.log("\nOptions Type:");
    console.log(optionsType ? optionsType[0] : "Not found");
} else {
    console.log("File not found:", dtsPath);
}
