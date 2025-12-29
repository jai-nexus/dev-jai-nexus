import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// contracts/ -> lib/ -> src/ -> portal/
const portalRoot = path.resolve(__dirname, "..", "..", "..");
// portal/ -> dev-jai-nexus/
const repoRoot = path.resolve(portalRoot, "..");

const schemaPath = path.join(
  repoRoot,
  "vendor",
  "datacontracts",
  "surfaces",
  "sot-event",
  "v0.1",
  "sot-event.schema.json"
);

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const validate = ajv.compile(schema);

export function assertSotEventV01(evt: unknown): void {
  if (!validate(evt)) {
    throw new Error(`SotEvent v0.1 invalid: ${JSON.stringify(validate.errors)}`);
  }
}
