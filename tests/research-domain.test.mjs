import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildResearchDomain, isPublicResearchFile, transformResearchText, validateResearchArtifact } from '../scripts/build-research-domain.mjs';

const sourceRoot = path.resolve(import.meta.dirname, '..');
function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'research-domain-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}
function fixture(root, filename, contents = '') {
  const target = path.join(root, filename);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

test('research paths flatten without changing query, anchor, or external evidence URL', () => {
  const source = `<a href="/research/">Home</a><a href='/research/atlas/mapa/?lang=be&year=1938#borders'>Map</a>
    <link rel="canonical" href="https://sergey-ulyanov.pro/research/atlas/mapa/">
    const path='/research/tools/unmute-the-archive/'; const inResearch=url.pathname.startsWith('/research/');
    const credit='https://github.com/djsirgay/sergey-ulyanov.pro/blob/main/research/atlas/mapa/history/README.md';`;
  const built = transformResearchText(source);
  assert.match(built, /href="\/"/);
  assert.match(built, /href='\/atlas\/mapa\/\?lang=be&year=1938#borders'/);
  assert.match(built, /https:\/\/research\.sergey-ulyanov\.pro\/atlas\/mapa\//);
  assert.match(built, /path='\/tools\/unmute-the-archive\/'/);
  assert.match(built, /startsWith\('\/'\)/);
  assert.match(built, /github\.com\/djsirgay\/sergey-ulyanov\.pro\/blob\/main\/research\/atlas/);
});

test('portfolio pages and portfolio root links remain on the original website', () => {
  const built = transformResearchText(`<a href="/">Portfolio</a><a href="/#contact">Contact</a>
    <a href="/work/?source=research#selected">Work</a><a href='/case-studies/example/'>Case</a>
    <a href="/privacy/">Privacy</a><a href="/research/">Research</a>`);
  assert.match(built, /href="https:\/\/sergey-ulyanov\.pro\/"/);
  assert.match(built, /href="https:\/\/sergey-ulyanov\.pro\/#contact"/);
  assert.match(built, /https:\/\/sergey-ulyanov\.pro\/work\/\?source=research#selected/);
  assert.match(built, /https:\/\/sergey-ulyanov\.pro\/case-studies\/example\//);
  assert.match(built, /https:\/\/sergey-ulyanov\.pro\/privacy\//);
  assert.match(built, /href="\/">Research/);
});

test('migration deliberately retains old origin and points destination to new help route', () => {
  const source = `const legacy = options.legacyURL || 'https://sergey-ulyanov.pro/research/system/?stay=1#browser-data';
    const destination = options.destinationURL || 'https://research.sergey-ulyanov.pro/research/system/#browser-data';`;
  const built = transformResearchText(source, 'research/storage-migration.js');
  assert.match(built, /https:\/\/sergey-ulyanov\.pro\/research\/system\/\?stay=1#browser-data/);
  assert.match(built, /https:\/\/research\.sergey-ulyanov\.pro\/help\/#browser-data/);
  assert.doesNotMatch(built, /__RESEARCH_LEGACY/);
});

test('historical build-source links use canonical repository and preserve fragments', () => {
  const built = transformResearchText('<a href="./history/build-focus.mjs#L12">Reproduce map</a>', 'research/atlas/mapa/index.html');
  assert.equal(built, '<a href="https://github.com/djsirgay/sergey-ulyanov.pro/blob/main/research/atlas/mapa/history/build-focus.mjs#L12">Reproduce map</a>');
});

test('public allowlist excludes notes, tests, source maps, build scripts, and secrets', () => {
  for (const filename of ['notes.txt', 'notes/plan.html', '.env', 'draft.html', 'drafts/index.html', 'tests/test.js', 'app.test.js', 'app.js.map', 'history/build-focus.mjs', 'history/README.md']) {
    assert.equal(isPublicResearchFile(filename), false, filename);
  }
  for (const filename of ['index.html', 'atlas/mapa/mapa.js', 'history/world_1938.geojson', 'history/LICENSE-GPL-3.0.txt', 'history/vendor/LICENSE-polygon-clipping.md']) {
    assert.equal(isPublicResearchFile(filename), true, filename);
  }
});

test('isolated fixture copies only referenced public dependencies and creates clean domain metadata', t => {
  const temp = temporary(t), root = path.join(temp, 'source'), output = path.join(temp, 'output');
  fixture(root, 'CNAME', 'sergey-ulyanov.pro');
  fixture(root, 'index.html', 'Private-to-this-build portfolio home');
  fixture(root, 'research/index.html', `<link href="/styles-1.css" rel="stylesheet"><link href="/favicon.svg" rel="icon"><a href="/research/atlas/">Directory</a><a href="/work/">Work</a><img src="/assets/hero.svg"><script src="/research/app.js"></script>`);
  fixture(root, 'research/atlas/index.html', '<a href="/research/?lang=be#overview">Home</a>');
  fixture(root, 'research/app.js', `const url='/research/atlas/?lang=be#item';`);
  fixture(root, 'research/notes.txt', 'Do not publish');
  fixture(root, 'research/history/README.md', 'Internal notes');
  fixture(root, 'research/history/LICENSE.md', 'Public license');
  fixture(root, 'styles-1.css', `body { background:url('/assets/texture.svg') }`);
  fixture(root, 'styles-unused.css', 'Do not copy unrelated styles');
  fixture(root, 'favicon.svg', '<svg/>');
  fixture(root, 'assets/hero.svg', '<svg/>');
  fixture(root, 'assets/texture.svg', '<svg/>');
  fixture(root, 'assets/unreferenced.svg', '<svg/>');
  const result = buildResearchDomain({ sourceRoot: root, outputDirectory: output });
  assert.equal(result.pages, 2);
  assert.equal(fs.readFileSync(path.join(root, 'CNAME'), 'utf8'), 'sergey-ulyanov.pro');
  assert.equal(fs.readFileSync(path.join(output, 'CNAME'), 'utf8'), 'research.sergey-ulyanov.pro\n');
  for (const filename of ['index.html', 'atlas/index.html', 'app.js', 'assets/hero.svg', 'assets/texture.svg', 'history/LICENSE.md', 'favicon.svg', '.nojekyll', 'sitemap.xml']) {
    assert.ok(fs.existsSync(path.join(output, filename)), filename);
  }
  for (const filename of ['research', 'notes.txt', 'history/README.md', 'styles-unused.css', 'assets/unreferenced.svg', '.github', 'scripts', 'work']) {
    assert.equal(fs.existsSync(path.join(output, filename)), false, filename);
  }
  assert.match(fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8'), /<loc>https:\/\/research\.sergey-ulyanov\.pro\/<\/loc>/);
  assert.match(fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8'), /<loc>https:\/\/research\.sergey-ulyanov\.pro\/atlas\/<\/loc>/);
  assert.match(fs.readFileSync(path.join(output, 'atlas/index.html'), 'utf8'), /href="\/\?lang=be#overview"/);
});

test('pilot ships only scoped inference binaries and remains outside the sitemap', t => {
  const temp=temporary(t),root=path.join(temp,'source'),output=path.join(temp,'output');
  for(const extension of ['bin','wasm','mjs']){
    assert.equal(isPublicResearchFile('unmute-pilot/semantic/model.'+extension),true);
    assert.equal(isPublicResearchFile('private/model.'+extension),false);
    fixture(root,'research/unmute-pilot/semantic/model.'+extension,'public model fixture');
  }
  fixture(root,'research/index.html','<h1>Research</h1>');
  fixture(root,'research/unmute-pilot/index.html','<meta name="robots" content="noindex,nofollow"><h1>Pilot</h1>');
  buildResearchDomain({sourceRoot:root,outputDirectory:output});
  for(const extension of ['bin','wasm','mjs'])assert.ok(fs.existsSync(path.join(output,'unmute-pilot/semantic/model.'+extension)));
  assert.doesNotMatch(fs.readFileSync(path.join(output,'sitemap.xml'),'utf8'),/unmute-pilot/);
});

test('refuses occupied output and source overwrite without deleting anything', t => {
  const temp = temporary(t), root = path.join(temp, 'source'), output = path.join(temp, 'output');
  fixture(root, 'research/index.html', '<p>Research</p>');
  fixture(output, 'keep.txt', 'Keep me');
  assert.throws(() => buildResearchDomain({ sourceRoot: root, outputDirectory: output }), /must be empty/);
  assert.equal(fs.readFileSync(path.join(output, 'keep.txt'), 'utf8'), 'Keep me');
  assert.throws(() => buildResearchDomain({ sourceRoot: root, outputDirectory: root }), /must not overwrite/);
  assert.throws(() => buildResearchDomain({ sourceRoot: root, outputDirectory: path.join(root, 'research', 'output') }), /must not overwrite/);
});

test('validation rejects missing local assets while allowing external portfolio links', t => {
  const temp = temporary(t);
  fixture(temp, 'index.html', '<a href="https://sergey-ulyanov.pro/work/">Work</a><img src="/missing.svg">');
  assert.throws(() => validateResearchArtifact(temp), /missing\.svg/);
});

test('real research export has valid flattened routes and no portfolio/notes leakage', t => {
  const output = path.join(temporary(t), 'public');
  const result = buildResearchDomain({ sourceRoot, outputDirectory: output });
  assert.ok(result.pages >= 8);
  for (const filename of ['index.html', 'system/index.html', 'protocol/index.html', 'atlas/index.html', 'atlas/mapa/index.html', 'tools/unmute-the-archive/index.html', 'tools/unmute-the-archive/atlas/index.html', 'tools/unmute-the-archive/restoration/index.html']) {
    assert.ok(fs.existsSync(path.join(output, filename)), filename);
  }
  for (const filename of ['research', '.git', '.github', 'scripts', 'tests', 'work', 'hire', 'case-studies', 'atlas/mapa/history/README.md', 'atlas/mapa/history/build-data.mjs']) {
    assert.equal(fs.existsSync(path.join(output, filename)), false, filename);
  }
  assert.ok(fs.existsSync(path.join(output, 'atlas/mapa/history/LICENSE-GPL-3.0.txt')));
  const migration = fs.readFileSync(path.join(output, 'storage-migration.js'), 'utf8');
  assert.match(migration, /https:\/\/sergey-ulyanov\.pro\/research\//);
  assert.match(migration, /https:\/\/research\.sergey-ulyanov\.pro\/help\/#browser-data/);
  const language = fs.readFileSync(path.join(output, 'shared-language.js'), 'utf8');
  assert.doesNotMatch(language, /startsWith\('\/research\/'\)/);
  assert.equal(fs.readFileSync(path.join(sourceRoot, 'CNAME'), 'utf8').trim(), 'sergey-ulyanov.pro');
});
