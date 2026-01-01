
import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('NODE_ENV="production"')) {
        console.log('Found NODE_ENV="production". Removing it...');
        content = content.replace(/NODE_ENV="production"/g, '# NODE_ENV="production" (Removed by Agent)');
        fs.writeFileSync(envPath, content);
        console.log('Updated .env.local');
    } else if (content.includes('NODE_ENV=production')) {
        console.log('Found NODE_ENV=production. Removing it...');
        content = content.replace(/NODE_ENV=production/g, '# NODE_ENV=production (Removed by Agent)');
        fs.writeFileSync(envPath, content);
        console.log('Updated .env.local');
    } else {
        console.log('NODE_ENV="production" not found in .env.local');
    }
} else {
    console.log('.env.local not found');
}
