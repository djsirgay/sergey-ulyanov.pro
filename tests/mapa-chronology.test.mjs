// Run: node --test tests/mapa-chronology.test.mjs
// Data/URL/controller regressions with a minimal view adapter, not browser UI QA.
import {readFileSync, existsSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const mapDir = new URL('../research/atlas/mapa/', import.meta.url);
const source = readFileSync(new URL('chronology.js', mapDir), 'utf8');
const historySource = readFileSync(new URL('history.js', mapDir), 'utf8');
const html = readFileSync(new URL('index.html', mapDir), 'utf8');

class ViewNode {
  constructor() { this.children = []; this.dataset = {}; this.attributes = {}; this.handlers = {}; this.textContent = ''; }
  replaceChildren(...nodes) { this.children = nodes; }
  append(...nodes) { this.children.push(...nodes); }
  before(...nodes) { this.beforeNodes = nodes; }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  addEventListener(name, handler) { this.handlers[name] = handler; }
}

function controller(query = '', language = 'en') {
  let url = new URL(`https://example.test/research/atlas/mapa/${query}`);
  const nodes = new Map();
  const get = id => { if (!nodes.has(id)) nodes.set(id, new ViewNode()); return nodes.get(id); };
  const panels = ['borders', 'chronology'].map(panel => { const node = new ViewNode(); node.dataset.historyPanel = panel; return node; });
  const listeners = {};
  const location = { get href() { return url.href; }, get search() { return url.search; }, get hash() { return url.hash; } };
  const window = { addEventListener: (name, handler) => { listeners[name] = handler; }, dispatchEvent: event => listeners[event.type]?.(event) };
  const context = {
    URL, URLSearchParams, location, window,
    history: {replaceState: (_state, _title, value) => { url = new URL(value, url); }},
    document: {documentElement: {lang: language}, getElementById: get, createElement: () => new ViewNode(),
      querySelector: selector => get(selector),
      querySelectorAll: selector => selector === '[data-history-panel]' ? panels : []},
    Event: class { constructor(type) { this.type = type; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    MutationObserver: class { observe() {} },
  };
  // The history controller owns the rendered map. Supply its visible snapshot year.
  get('history-map-year').textContent = '1938';
  vm.runInNewContext(source, context, {filename: 'chronology.js'});
  return {get, panels, location, context, records: JSON.parse(JSON.stringify(window.MAPA_CHRONOLOGY))};
}

const {records} = controller();
const getRecord = id => records.find(record => record.id === id);

test('every chronology stage has unique ID, bilingual content, typed affiliation and sources', () => {
  const ids = records.map(record => record.id);
  assert.equal(ids.length, new Set(ids).size);
  const dataContext = {};
  vm.runInNewContext(source.slice(source.indexOf('  const sources='), source.indexOf('  const words=')) +
    'globalThis.sourceRegistry=sources', dataContext);
  for (const record of records) {
    for (const key of ['date', 'title', 'body']) {
      assert.equal(record[key].length, 2, `${record.id}: ${key}`);
      assert.ok(record[key].every(value => typeof value === 'string' && value.trim()));
    }
    assert.ok(record.areas.length);
    for (const pair of record.areas) for (const label of pair) {
      assert.equal(label.length, 2, record.id);
      assert.ok(label.every(value => typeof value === 'string' && value.trim()));
    }
    assert.ok(record.sources.length);
    for (const id of record.sources) {
      const url = new URL(dataContext.sourceRegistry[id].url);
      // This public university PDF has a verified HTTP route but a broken TLS endpoint.
      // It receives no user data; this is an explicit exception, not arbitrary HTTP support.
      const verifiedPublicPDF = url.href === 'http://bg.uwb.edu.pl/pcr/BKWP/files/BKWP_2008_14_009.pdf';
      assert.ok(url.protocol === 'https:' || verifiedPublicPDF, `${record.id}: unexpected source protocol`);
    }
  }
});

test('only five independently available snapshots are offered as dated maps', () => {
  assert.deepEqual(records.filter(record => record.map).map(record => record.map), [1700, 1914, 1938, 1945, 1994]);
  for (const record of records.filter(item => item.map)) {
    assert.equal(record.year, record.map, `${record.id}: no nearest-year substitution`);
    assert.ok(existsSync(new URL(`history/focus_${record.map}.geojson`, mapDir)));
  }
});

test('known incorrect 1800 geography is contextual, not an offered map', () => {
  const record = records.find(item => item.aliases?.includes(1800));
  assert.ok(record);
  assert.equal(record.map, undefined);
  assert.match(record.geometryNote[0], /exclud|unverified|mismatch/i);
  assert.match(record.body[0], /Pruss/i);
  const eraContext = {window: {}};
  vm.runInNewContext(historySource.slice(historySource.indexOf('  const eras='), historySource.indexOf('  const words=')) +
    'globalThis.years=eras.map(era=>era.year)', eraContext);
  assert.ok(!eraContext.years.includes(1800));
  assert.ok(!eraContext.years.includes(1500));
});

test('medieval principalities are not represented as one invented modern-Belarus polygon', () => {
  const record = getRecord('principalities');
  assert.equal(record.map, undefined);
  assert.match(record.body[0], /distinct political centers/);
  assert.match(record.body[0], /cannot be equated/);
});

test('independence belongs to 1991; 1994 is explicitly a later geometry snapshot', () => {
  const independence = getRecord('independence-1991');
  assert.equal(independence.year, 1991);
  assert.equal(independence.map, undefined);
  assert.match(independence.body[0], /25 August/);
  assert.match(getRecord('republic-1994').body[0], /1991/);
});

test('1807 distinguishes the Sapoćkin/Warsaw path from Białystok/Russia', () => {
  const record = getRecord('tilsit-1807');
  assert.equal(record.map, undefined);
  assert.match(record.body[0], /Sapoćkin/);
  const jurisdictions = record.areas.map(([_area, polity]) => polity[0]);
  assert.ok(jurisdictions.includes('Duchy of Warsaw'));
  assert.ok(jurisdictions.includes('Russian Empire'));
  assert.ok(record.sources.length >= 2);
});

for (const [year, expectedId] of [[1500, 'gdl-1500'], [1800, 'partition-1795'], [1939, 'invasion-1939'], [1991, 'independence-1991']]) {
  for (const language of ['en', 'be']) {
    test(`${language}: year=${year} opens explicit context-only stage, not a substitute map`, () => {
      const app = controller(`?year=${year}&lang=${language}#borders`, language);
      assert.equal(app.get('borders').hidden, true);
      assert.equal(app.get('chronology').hidden, false);
      assert.equal(app.get('chronology-stage').value, expectedId);
      assert.equal(app.get('chronology-geometry').dataset.geometry, 'context-only');
      assert.equal(app.get('chronology-open-map').hidden, true);
      assert.ok(app.get('chronology-geometry').textContent.includes(language === 'be' ? 'Межы іншага года не падстаўляюцца' : 'No other year’s borders are substituted'));
    });
  }
}

test('direct stage link takes precedence over a stale year parameter', () => {
  const app = controller('?year=1938&stage=independence-1991#chronology');
  assert.equal(app.get('chronology-stage').value, 'independence-1991');
  assert.equal(app.get('borders').hidden, true);
});

test('dated 1938 link remains a territory view', () => {
  const app = controller('?year=1938#borders');
  assert.equal(app.get('borders').hidden, false);
  assert.equal(app.get('chronology').hidden, true);
});

test('chronology controls reference existing page elements and ship the controller', () => {
  const ids = [...source.matchAll(/\$\('([^']+)'\)/g)].map(match => match[1]);
  for (const id of new Set(ids)) assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
  assert.match(html, /src="\.\/chronology\.js\?/);
});
