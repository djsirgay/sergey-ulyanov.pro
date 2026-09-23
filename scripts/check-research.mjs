import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';

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
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) continue;
    const location = decodeURIComponent(raw.split(/[?#]/)[0]);
    if (!location) continue;
    let target = location.startsWith('/') ? path.resolve(root, location.slice(1)) : path.resolve(path.dirname(file), location);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) failures.push(`${path.relative(root, file)} → ${raw}`);
    if (target.endsWith('.md') && !/^LICENSE.*\.md$/.test(path.basename(target))) failures.push(`${path.relative(root, file)} → ${raw} (excluded from the public Pages artifact)`);
  }
}
assert.deepEqual(failures, [], `Broken local research links:\n${failures.join('\n')}`);
const home = fs.readFileSync(path.join(root, 'research/index.html'), 'utf8');
assert.equal([...home.matchAll(/class="research-start-card"/g)].length, 5, 'Keep the five task-first entry points including a direct MAPA entry');
assert.match(home, /AI systems planned for comparison/);
assert.match(home, /stored in this browser only/);
assert.match(home, /research\/atlas\/mapa\//);
assert.match(home, /atlas\/#external-discovery/);
const historicalRoot = path.join(root, 'research/atlas/mapa/history');
const manifest = JSON.parse(fs.readFileSync(path.join(historicalRoot, 'manifest.json'), 'utf8'));
const sourceYears = [1492, 1500, 1600, 1700, 1800, 1914, 1938, 1945, 1994];
assert.deepEqual(manifest.years.map(item => item.year), sourceYears);
const geometries = new Set();
for (const item of manifest.years) {
  const data = JSON.parse(fs.readFileSync(path.join(historicalRoot, `world_${item.year}.geojson`), 'utf8'));
  assert.equal(data.type, 'FeatureCollection');
  assert.equal(data.features.length, item.featureCount);
  assert.ok(data.features.every(feature => ['Polygon', 'MultiPolygon'].includes(feature.geometry.type)));
  geometries.add(JSON.stringify(data.features.map(feature => feature.geometry)));
}
assert.equal(geometries.size, sourceYears.length, 'Retained historical sources must have distinct geometry sets');
// Rejected source candidates remain available for traceability, not in the
// map controls: 1500 misses the Homiel transition and 1800 the Prussian west.
const displayedYears = [1492, 1600, 1700, 1914, 1938, 1945, 1994];
assert.deepEqual(manifest.displayedYears, displayedYears);
assert.deepEqual(manifest.excludedStoredYears, [1500, 1800]);
for (const year of displayedYears) {
  const focus = JSON.parse(fs.readFileSync(path.join(historicalRoot, `focus_${year}.geojson`), 'utf8'));
  assert.equal(focus.type, 'FeatureCollection');
  assert.equal(focus.license, 'GPL-3.0-only');
  assert.equal(focus.reference, 'belarus-reference.geojson');
  assert.equal(focus.unmatchedGeometry.type, 'MultiPolygon');
  assert.ok(focus.features.length > 0);
  assert.ok(focus.features.every(feature => feature.geometry.type === 'MultiPolygon'));
}
assert.ok(fs.existsSync(path.join(historicalRoot, 'LICENSE-GPL-3.0.txt')));
const chronology = fs.readFileSync(path.join(historicalRoot, '../chronology.js'), 'utf8');
const chronologyContext = {};
const dataStart = chronology.indexOf('  const sources='), dataEnd = chronology.indexOf('  const words=');
assert.ok(dataStart >= 0 && dataEnd > dataStart, 'Chronology data section must remain inspectable');
vm.runInNewContext(chronology.slice(dataStart, dataEnd) + '\nglobalThis.stages=records', chronologyContext);
const stages = JSON.parse(JSON.stringify(chronologyContext.stages));
assert.equal(stages.length, 28, 'Chronology must expose all 28 reviewed stages');
assert.deepEqual(stages.filter(stage => stage.map).map(stage => stage.map), displayedYears);
console.log(`Research release checks passed: ${pages.length} pages, five task entry points, ${displayedYears.length} Belarus-focused map layers, ${stages.length} chronology stages, ${sourceYears.length} retained source snapshots, no missing local assets.`);
