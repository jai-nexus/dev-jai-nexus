
import fs from 'node:fs';

const path = '.env.local';
const content = fs.readFileSync(path, 'utf8');

if (!content.includes('SOT_INGEST_TOKEN')) {
    console.log('Appending Token...');
    fs.appendFileSync(path, '\nSOT_INGEST_TOKEN="dev-token-123"\n');
} else {
    console.log('Token already present (check formatting manually if it fails).');
}
