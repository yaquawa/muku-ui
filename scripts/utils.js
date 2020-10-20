import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const argv = minimist(process.argv.slice(2));
export const packageName = argv._[0];
export const packagePath = path.resolve(__dirname + '/../packages/', packageName);

export function assertPackageSpecified() {
  if (!packageName) {
    throw new Error('No package specified.');
  }

  if (!fs.existsSync(packagePath)) {
    throw new Error(`Incorrect package name '${packageName}'.`);
  }
}
