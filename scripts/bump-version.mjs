import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2).map((arg) => JSON.stringify(arg)).join(' ');

execSync(`npx react-native bump-version ${args}`, { cwd: root, stdio: 'inherit' });
execSync('node scripts/sync-app-json-version.mjs', { cwd: root, stdio: 'inherit' });
