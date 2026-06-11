import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const message = `feat: 🔖 Bump version to ${version}`;

execSync('git add .', { cwd: root, stdio: 'inherit' });
execSync(`git commit -m ${JSON.stringify(message)}`, { cwd: root, stdio: 'inherit' });
execSync('git push', { cwd: root, stdio: 'inherit' });
