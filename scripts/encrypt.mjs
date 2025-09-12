// usage: node scripts/encrypt.mjs path/to/file.txt "passphrase" > data/private/file.txt.enc
import { readFile } from 'fs/promises';
import crypto from 'crypto';

const [,, inPath, pass] = process.argv;
if(!inPath || !pass){ console.error("usage: node scripts/encrypt.mjs <file> <passphrase>"); process.exit(1); }

const salt = crypto.randomBytes(16);
const iv   = crypto.randomBytes(12);
const key  = crypto.pbkdf2Sync(pass, salt, 250000, 32, 'sha256'); // ~AES-256
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const buf = await readFile(inPath);
const enc = Buffer.concat([cipher.update(buf), cipher.final()]);
const tag = cipher.getAuthTag();

const header = Buffer.concat([Buffer.from("JAIENC1\0"), salt, iv, tag]);
const out = Buffer.concat([header, enc]);
process.stdout.write(out);
