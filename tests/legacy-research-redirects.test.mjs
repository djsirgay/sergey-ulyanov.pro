import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const script = new URL('../scripts/build-legacy-research-redirects.mjs', import.meta.url);
const api = fs.existsSync(script) ? await import(script) : {};
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-research-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'source'), artifact = path.join(root, 'artifact');
  fs.mkdirSync(source); fs.mkdirSync(artifact);
  return {source, artifact};
}
function write(root, filename, value) {
  const file = path.join(root, filename); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, value);
}
function run(html, href) {
  const redirects = [], links = {};
  const context = {URL, URLSearchParams, location: {...new URL(href), href, search: new URL(href).search, hash: new URL(href).hash, replace: value => redirects.push(value)}, document: {getElementById: id => links[id] ||= {href: ''}}};
  const inline = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).filter(Boolean);
  for (const code of inline) vm.runInNewContext(code, context);
  return {redirects, links};
}

test('legacy research pages redirect to corresponding canonical paths with query and fragment intact', t => {
  assert.equal(typeof api.buildLegacyResearchRedirects, 'function', 'An artifact-only legacy research redirect builder is required');
  const {source, artifact} = fixture(t);
  write(source, 'research/atlas/mapa/index.html', '<h1>Unchanged source</h1>');
  write(artifact, 'research/atlas/mapa/index.html', '<html><head><script src="old-app.js"></script></head><body>old</body></html>');
  api.buildLegacyResearchRedirects({sourceRoot: source, artifactDirectory: artifact});
  const html = fs.readFileSync(path.join(artifact, 'research/atlas/mapa/index.html'), 'utf8');
  assert.deepEqual(run(html, 'https://sergey-ulyanov.pro/research/atlas/mapa/?lang=be&year=1938#borders').redirects, ['https://research.sergey-ulyanov.pro/atlas/mapa/?lang=be&year=1938#borders']);
  assert.doesNotMatch(html, /old-app/);
  assert.equal(fs.readFileSync(path.join(source, 'research/atlas/mapa/index.html'), 'utf8'), '<h1>Unchanged source</h1>');
});

test('explicit old-origin help and system data recovery remains available without redirect', t => {
  const {source, artifact} = fixture(t);
  for (const route of ['help','system']) write(artifact, `research/${route}/index.html`, '<html><head></head><body><main id="browser-data">Saved-data recovery</main><script src="/research/storage-migration.js"></script></body></html>');
  api.buildLegacyResearchRedirects({sourceRoot: source, artifactDirectory: artifact});
  for (const route of ['help','system']) {
    const html=fs.readFileSync(path.join(artifact,`research/${route}/index.html`),'utf8');
    assert.deepEqual(run(html,`https://sergey-ulyanov.pro/research/${route}/?stay=1#browser-data`).redirects, []);
    assert.match(html,/Saved-data recovery/);
    assert.match(html,/storage-migration\.js/);
    assert.deepEqual(run(html,`https://sergey-ulyanov.pro/research/${route}/?lang=be#navigation-help`).redirects,[`https://research.sergey-ulyanov.pro/${route}/?lang=be#navigation-help`]);
    assert.equal(run(html,`https://sergey-ulyanov.pro/research/${route}/?stay=1`).redirects.length,1);
  }
});

test('old listening entry goes to the current login without forwarding old query or participant data',t=>{
  const {source,artifact}=fixture(t);
  write(artifact,'research/unmute-pilot/index.html','<html><head><script src="./app.js"></script></head><body>OLD MODEL</body></html>');
  write(artifact,'research/unmute-pilot/legacy.html','<html><head></head><body>EXPLICIT SAVED COLLECTION RECOVERY</body></html>');
  api.buildLegacyResearchRedirects({sourceRoot:source,artifactDirectory:artifact});
  const html=fs.readFileSync(path.join(artifact,'research/unmute-pilot/index.html'),'utf8');
  assert.deepEqual(run(html,'https://sergey-ulyanov.pro/research/unmute-pilot/?lang=be&q=private&participant=SECRET#discover?q=secret').redirects,['https://unmute.sergey-ulyanov.pro/login/?lang=be']);
  assert.doesNotMatch(html,/app\.js|OLD MODEL/);
  assert.match(fs.readFileSync(path.join(artifact,'research/unmute-pilot/legacy.html'),'utf8'),/EXPLICIT SAVED COLLECTION RECOVERY/);
});

test('canonical research build also retires the old listening entry without changing its source',async t=>{
  const {buildResearchDomain}=await import('../scripts/build-research-domain.mjs');
  const {source,artifact}=fixture(t);
  write(source,'research/index.html','<html><head></head><body>Research</body></html>');
  write(source,'research/unmute-pilot/index.html','<html><head></head><body>OLD MODEL<script src="./app.js"></script></body></html>');
  write(source,'research/unmute-pilot/app.js','/* old app */');
  buildResearchDomain({sourceRoot:source,outputDirectory:artifact});
  const html=fs.readFileSync(path.join(artifact,'unmute-pilot/index.html'),'utf8');
  assert.deepEqual(run(html,'https://research.sergey-ulyanov.pro/unmute-pilot/?lang=ru#study').redirects,['https://unmute.sergey-ulyanov.pro/login/?lang=ru']);
  assert.doesNotMatch(html,/OLD MODEL|app\.js/);
  assert.match(fs.readFileSync(path.join(source,'research/unmute-pilot/index.html'),'utf8'),/OLD MODEL/);
});

test('redirect builder refuses the actual source tree and its research subtree',t=>{
  const {source}=fixture(t);write(source,'research/index.html','KEEP SOURCE');
  assert.throws(()=>api.buildLegacyResearchRedirects({sourceRoot:source,artifactDirectory:source}),/source|artifact/);
  assert.throws(()=>api.buildLegacyResearchRedirects({sourceRoot:source,artifactDirectory:path.join(source,'research')}),/source|artifact/);
  assert.equal(fs.readFileSync(path.join(source,'research/index.html'),'utf8'),'KEEP SOURCE');
});

test('redirect builder rejects symlinked trees before modifying any artifact',t=>{
  const {source,artifact}=fixture(t);
  write(source,'research/index.html','KEEP SOURCE');
  fs.symlinkSync(path.join(source,'research'),path.join(artifact,'research'));
  assert.throws(()=>api.buildLegacyResearchRedirects({sourceRoot:source,artifactDirectory:artifact}),/symlink|source|artifact/);
  assert.equal(fs.readFileSync(path.join(source,'research/index.html'),'utf8'),'KEEP SOURCE');
});

test('portfolio deployment prepares redirects after copying public files',()=>{
  const workflow=fs.readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
  assert.match(workflow,/node scripts\/build-legacy-research-redirects\.mjs --artifact _site/);
});
