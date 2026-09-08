import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Static release gate: public research routes must not ship broken local assets.
const root = path.resolve(import.meta.dirname, '..');
const pages = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) pages.push(file);
  }
}
walk(path.join(root, 'research'));
const failures = [];
for (const file of pages) {
  const source = fs.readFileSync(file, 'utf8');
  for (const [, raw] of source.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const location = decodeURIComponent(raw.split(/[?#]/)[0]).slice(1);
    let target = path.resolve(root, location);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) failures.push(`${path.relative(root, file)} → ${raw}`);
  }
}
assert.deepEqual(failures, [], `Broken local research links:\n${failures.join('\n')}`);
const home = fs.readFileSync(path.join(root, 'research/index.html'), 'utf8');
assert.equal([...home.matchAll(/class="research-start-card"/g)].length, 4, 'Keep the four task-first entry points');
assert.match(home, /AI systems planned for comparison/);
assert.match(home, /stored in this browser only/);
assert.match(home, /research\/atlas\/mapa\//);
console.log(`Research release checks passed: ${pages.length} pages, four task entry points, no missing local assets.`);
