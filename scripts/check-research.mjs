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
assert.match(home, /atlas\/#external-discovery/);
const historicalRoot = path.join(root, 'research/atlas/mapa/history');
const manifest = JSON.parse(fs.readFileSync(path.join(historicalRoot, 'manifest.json'), 'utf8'));
assert.deepEqual(manifest.years.map(item => item.year), [1500, 1700, 1800, 1914, 1938, 1945, 1994]);
const geometries = new Set();
for (const item of manifest.years) {
  const data = JSON.parse(fs.readFileSync(path.join(historicalRoot, `world_${item.year}.geojson`), 'utf8'));
  assert.equal(data.type, 'FeatureCollection');
  assert.equal(data.features.length, item.featureCount);
  assert.ok(data.features.every(feature => ['Polygon', 'MultiPolygon'].includes(feature.geometry.type)));
  geometries.add(JSON.stringify(data.features.map(feature => feature.geometry)));
}
assert.equal(geometries.size, 7, 'Historical layers must contain seven distinct geometry sets');
assert.ok(fs.existsSync(path.join(historicalRoot, 'LICENSE-GPL-3.0.txt')));
console.log(`Research release checks passed: ${pages.length} pages, four task entry points, seven distinct historical layers, no missing local assets.`);
