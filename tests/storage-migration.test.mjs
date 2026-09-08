import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const code = readFileSync(new URL('../research/storage-migration.js', import.meta.url), 'utf8');
const migration = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const { STORAGE_KEYS: K, BACKUP_SCHEMA, createBackup, parseBackup, planImport, applyImport, readResearchStorage, readRawResearchStorage } = migration;
const fixed = '2026-09-08T12:00:00.000Z';
const audio = { filename: 'original.wav', mediaType: 'audio/wav', bytes: 2000, sha256: 'a'.repeat(64) };
const record = (id = 'one', changes = {}) => ({
  schema: 'unmute-archive/2.1', archiveId: id, status: 'fingerprinted', createdAt: fixed, updatedAt: fixed,
  collection: 'Research pilot', title: 'Test recording', creator: 'Example artist', language: 'Belarusian',
  place: 'Minsk', context: 'Test archival context', rightsBasis: 'Creator-owned', source: { ...audio },
  events: [{ type: 'documented', at: fixed, note: 'Documented by creator' }],
  derivatives: [{ derivativeId: `derived-${id}`, createdAt: fixed, label: 'Listening copy', purpose: 'A/B comparison',
    method: 'High-pass filter', changeLog: '20 Hz filter; source unchanged', source: { ...audio, sha256: 'b'.repeat(64) }, reviewerNote: 'No additional claims' }],
  ...changes
});
const backup = stores => ({ schema: BACKUP_SCHEMA, sourceOrigin: 'https://sergey-ulyanov.pro', exportedAt: fixed, stores });
function store(values = {}, fail = () => false) {
  const map = new Map(Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)]));
  const writes = [];
  return {
    map, writes, getItem: key => map.get(key) ?? null,
    setItem(key, value) { if (fail(key, value, writes)) throw new Error('quota'); map.set(key, value); writes.push({ key, value }); },
    removeItem(key) { map.delete(key); writes.push({ key, deleted: true }); }
  };
}
const error = expected => caught => caught.code === expected;

test('backup captures complete passport, derivative logs, annotations and preferences only', () => {
  const values = { [K.corpus]: [record()], [K.annotations]: { one: { kind: 'song', themes: ['archive'], dance: false } }, [K.language]: 'be', [K.atlasLanguage]: 'en', 'unrelated-token': 'secret' };
  const storage = store(values), actual = createBackup(storage, 'https://sergey-ulyanov.pro', new Date(fixed));
  assert.equal(actual.schema, BACKUP_SCHEMA);
  assert.deepEqual(actual.stores[K.corpus], values[K.corpus]);
  assert.deepEqual(actual.stores[K.annotations], values[K.annotations]);
  assert.deepEqual(Object.keys(actual.stores).sort(), Object.values(K).sort());
  assert.equal(JSON.stringify(actual).includes('secret'), false);
  assert.deepEqual(storage.writes, []);
});

test('empty browser export stays explicit, not an invented library', () => {
  assert.deepEqual(createBackup(store(), 'https://sergey-ulyanov.pro').stores, {});
});

test('recovery export preserves malformed raw data and never includes unrelated keys', () => {
  const storage = store({ [K.corpus]: '[broken', [K.annotations]: '{also-broken', private: 'no' });
  assert.throws(() => createBackup(storage, 'https://sergey-ulyanov.pro'), error('damaged'));
  assert.deepEqual(readRawResearchStorage(storage), { [K.corpus]: '[broken', [K.annotations]: '{also-broken' });
  assert.deepEqual(storage.writes, []);
});

test('storage-unavailable is not represented as an empty corpus', () => {
  const storage = { getItem() { throw new Error('SecurityError'); } };
  assert.throws(() => readResearchStorage(storage), error('unavailable'));
});

test('parse rejects reports, individual passports and unsupported schemas', () => {
  for (const data of [[record()], record(), { ...backup({}), schema: 'future/2.0' }, { results: [] }]) {
    assert.throws(() => parseBackup(JSON.stringify(data)), error('invalid'));
  }
});

test('parse rejects malformed JSON and oversized input', () => {
  assert.throws(() => parseBackup('{'), error('invalid'));
  assert.throws(() => parseBackup(' '.repeat(migration.MAX_BACKUP_BYTES + 1)), error('large'));
});

test('parse rejects invalid record, invalid fingerprint and unsafe source URL', () => {
  for (const changes of [{ creator: '' }, { source: { ...audio, sha256: 'bad' } }, { evidenceUrl: 'javascript:alert(1)' }, { events: [{}] }, { derivatives: [{}] }]) {
    assert.throws(() => parseBackup(JSON.stringify(backup({ [K.corpus]: [record('one', changes)] }))), error('invalid'));
  }
});

test('parse accepts complete metadata-only legacy 2.0 recovery record without audio', () => {
  const entry = record('missing', { schema: 'unmute-archive/2.0', status: 'source-missing', source: undefined, derivatives: undefined });
  assert.equal(parseBackup(JSON.stringify(backup({ [K.corpus]: [entry] }))).stores[K.corpus][0].status, 'source-missing');
});

test('parse rejects duplicate archive IDs and invalid annotation values', () => {
  assert.throws(() => parseBackup(JSON.stringify(backup({ [K.corpus]: [record(), record()] }))), error('invalid'));
  for (const annotation of [{ bpm: 0 }, { bpm: 301 }, { dance: 'yes' }, { genres: [1] }, { kind: 'invented' }, { confidence: 'certain' }, { title: 'overwrite' }]) {
    assert.throws(() => parseBackup(JSON.stringify(backup({ [K.annotations]: { one: annotation } }))), error('invalid'));
  }
});

test('prototype keys and unrelated storage imports are rejected', () => {
  const hostile = JSON.stringify(backup({ [K.annotations]: {} })).replace('"stores":', '"__proto__":{"polluted":true},"stores":');
  assert.throws(() => parseBackup(hostile), error('invalid'));
  assert.throws(() => parseBackup(JSON.stringify(backup({ token: 'bad' }))), error('invalid'));
  assert.equal({}.polluted, undefined);
});

test('malformed current annotations block import and are not silently discarded', () => {
  const storage = store({ [K.annotations]: { one: { extraField: 'preserve me' } } });
  assert.throws(() => readResearchStorage(storage), error('damaged'));
  assert.throws(() => applyImport(storage, backup({ [K.corpus]: [record()] }), {}), error('damaged'));
  assert.deepEqual(storage.writes, []);
});

test('plan merges new records and skips duplicates despite field ordering', () => {
  const existing = record(), reordered = Object.fromEntries(Object.entries(existing).reverse());
  const before = { [K.corpus]: [existing] }, incoming = { [K.corpus]: [reordered, record('two')] };
  const result = planImport(before, incoming);
  assert.equal(result.result.addedPassports, 1);
  assert.equal(result.result.identicalPassports, 1);
  assert.equal(result.result.conflicts.length, 0);
  assert.deepEqual(result.merged[K.corpus].map(item => item.archiveId), ['one', 'two']);
  assert.equal(before[K.corpus].length, 1);
});

test('conflicting passport never overwrites local data and related incoming annotations are skipped', () => {
  const existing = record(), other = record('one', { title: 'Conflicting title' });
  const before = { [K.corpus]: [existing] };
  const next = planImport(before, { [K.corpus]: [other, record('two')], [K.annotations]: { one: { dance: true }, 'derived-one': { themes: ['new'] }, two: { kind: 'recording' } } });
  assert.deepEqual(next.merged[K.corpus][0], existing);
  assert.equal(next.result.addedPassports, 1);
  assert.equal(next.result.conflicts.length, 3);
  assert.equal(next.merged[K.annotations].one, undefined);
  assert.equal(next.merged[K.annotations]['derived-one'], undefined);
  assert.deepEqual(next.merged[K.annotations].two, { kind: 'recording' });
});

test('annotation merge fills missing fields but preserves conflicting local fields', () => {
  const before = { [K.annotations]: { one: { dance: false, themes: ['old'] } } };
  const next = planImport(before, { [K.annotations]: { one: { dance: true, themes: ['old'], kind: 'song' }, two: { genres: ['pop'] } } });
  assert.deepEqual(next.merged[K.annotations].one, { dance: false, themes: ['old'], kind: 'song' });
  assert.equal(next.result.addedAnnotations, 1);
  assert.equal(next.result.annotationFields, 1);
  assert.deepEqual(next.result.conflicts[0].fields, ['dance']);
  assert.deepEqual(before[K.annotations].one, { dance: false, themes: ['old'] });
});

test('existing language choice stays unchanged, missing preference is restored', () => {
  const next = planImport({ [K.language]: 'en' }, { [K.language]: 'be', [K.atlasLanguage]: 'be' });
  assert.equal(next.merged[K.language], 'en');
  assert.equal(next.merged[K.atlasLanguage], 'be');
  assert.equal(next.result.preferences, 1);
});

test('applying reviewed import writes additions and preserves unrelated data', () => {
  const storage = store({ [K.corpus]: [record()], unrelated: 'keep' });
  const result = applyImport(storage, backup({ [K.corpus]: [record('two')], [K.annotations]: { two: { dance: false } } }), readResearchStorage(storage));
  assert.equal(result.addedPassports, 1);
  assert.equal(result.addedAnnotations, 1);
  assert.equal(JSON.parse(storage.getItem(K.corpus)).length, 2);
  assert.equal(storage.getItem('unrelated'), 'keep');
});

test('import is idempotent and a second import performs no writes', () => {
  const storage = store(), file = backup({ [K.corpus]: [record()], [K.annotations]: { one: { kind: 'song' } } });
  applyImport(storage, file, {}); storage.writes.length = 0;
  const next = applyImport(storage, file, readResearchStorage(storage));
  assert.equal(next.addedPassports, 0);
  assert.equal(next.addedAnnotations, 0);
  assert.deepEqual(storage.writes, []);
});

test('state changed after review aborts import without writing', () => {
  const storage = store(), snapshot = readResearchStorage(storage);
  storage.setItem(K.corpus, JSON.stringify([record('from-another-tab')])); storage.writes.length = 0;
  assert.throws(() => applyImport(storage, backup({ [K.corpus]: [record()] }), snapshot), error('changed'));
  assert.deepEqual(storage.writes, []);
});

test('quota failure restores original corpus before reporting failure', () => {
  const original = [record('original')];
  const storage = store({ [K.corpus]: original }, key => key === K.annotations);
  assert.throws(() => applyImport(storage, backup({ [K.corpus]: [record()], [K.annotations]: { one: { kind: 'song' } } }), readResearchStorage(storage)), error('saveFailed'));
  assert.deepEqual(JSON.parse(storage.getItem(K.corpus)), original);
  assert.equal(storage.getItem(K.annotations), null);
});

test('quota failure in empty browser removes only the newly created migration key', () => {
  const storage = store({ unrelated: 'keep' }, key => key === K.annotations);
  assert.throws(() => applyImport(storage, backup({ [K.corpus]: [record()], [K.annotations]: { one: { kind: 'song' } } }), {}), error('saveFailed'));
  assert.equal(storage.getItem(K.corpus), null);
  assert.equal(storage.getItem('unrelated'), 'keep');
});

test('failed rollback is explicitly distinguished from successful rollback', () => {
  const original = [record('original')];
  const storage = store({ [K.corpus]: original }, (key, value, writes) => key === K.annotations || (key === K.corpus && writes.length > 0));
  assert.throws(() => applyImport(storage, backup({ [K.corpus]: [record()], [K.annotations]: { one: { kind: 'song' } } }), readResearchStorage(storage)), error('partial'));
});

test('implementation has no network transport or automatic import path', () => {
  assert.doesNotMatch(code, /\bfetch\s*\(|XMLHttpRequest|postMessage\s*\(/);
  assert.match(code, /confirm\.addEventListener\('click'/);
  assert.match(code, /file\.addEventListener\('change'/);
  assert.match(code, /role', 'status'/);
  assert.match(code, /\?stay=1#browser-data/);
});

function mountUI(storage, language = 'en', origin = 'https://research.sergey-ulyanov.pro') {
  const events = [], observers = [];
  let document;
  class Element {
    constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.dataset = {}; this.attributes = {}; this.handlers = {}; this.ownerDocument = document; this.hidden = false; this.value = ''; }
    append(...children) { this.children.push(...children); children.forEach(child => child.parent = this); }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(event, handler) { this.handlers[event] = handler; }
    remove() { this.parent.children = this.parent.children.filter(child => child !== this); }
  }
  const window = { localStorage: storage, location: { origin, hash: '#browser-data', reload() { events.push('reload'); } }, dispatchEvent(event) { events.push(event); }, addEventListener() {} };
  document = { documentElement: { lang: language }, defaultView: window, createElement: tag => new Element(tag) };
  document.body = new Element('body');
  const host = new Element('section'); document.body.append(host);
  const previous = globalThis.MutationObserver;
  globalThis.MutationObserver = class { constructor(handler) { observers.push(handler); } observe() {} };
  try { migration.mountStorageMigration(host); } finally { previous === undefined ? delete globalThis.MutationObserver : globalThis.MutationObserver = previous; }
  const nodes = [];
  const walk = element => { nodes.push(element); element.children.forEach(walk); }; walk(host);
  const find = label => nodes.find(node => node.textContent?.includes(label));
  const input = nodes.find(node => node.tagName === 'INPUT');
  const status = nodes.find(node => node.attributes.role === 'status');
  const upload = async file => { input.files = [{ size: file.length, text: async () => file }]; input.value = 'test.json'; await input.handlers.change(); };
  return { host, nodes, document, find, input, status, upload, events, observers };
}

test('UI starts read-only and requires file preview plus a separate confirmation', async () => {
  const storage = store(), ui = mountUI(storage);
  assert.deepEqual(storage.writes, []);
  assert.equal(ui.host.children[0].open, true);
  assert.equal(ui.find('Import the reviewed').hidden, true);
  assert.equal(ui.find('Open the old').href, 'https://sergey-ulyanov.pro/research/help/?stay=1#browser-data');
  await ui.upload(JSON.stringify(backup({ [K.corpus]: [record()], [K.annotations]: { one: { kind: 'song' } } })));
  assert.deepEqual(storage.writes, []);
  assert.match(ui.status.textContent, /Review: 1 new passports, 1 new annotation records/);
  assert.equal(ui.find('Import the reviewed').hidden, false);
  ui.find('Import the reviewed').handlers.click();
  assert.equal(JSON.parse(storage.getItem(K.corpus)).length, 1);
  assert.match(ui.status.textContent, /Saved: 1 new passports/);
  assert.equal(ui.find('Reload to show').hidden, false);
  assert.equal(ui.input.value, '');
  assert.equal(ui.events.at(-1).type, 'research-storage-imported');
});

test('UI cancellation writes nothing and invalid backup cannot enable confirm', async () => {
  const storage = store(), ui = mountUI(storage);
  await ui.upload(JSON.stringify(backup({ [K.corpus]: [record()] })));
  ui.find('Cancel import').handlers.click();
  assert.equal(ui.find('Import the reviewed').hidden, true);
  assert.match(ui.status.textContent, /cancelled/);
  await ui.upload(JSON.stringify(record()));
  assert.equal(ui.find('Import the reviewed').hidden, true);
  assert.match(ui.status.textContent, /not a valid complete/);
  assert.deepEqual(storage.writes, []);
});

test('UI shows recovery for damaged local storage and updates EN/BE copy', () => {
  const storage = store({ [K.corpus]: 'broken' }), ui = mountUI(storage);
  assert.equal(ui.find('Download original stored').hidden, false);
  assert.match(ui.status.textContent, /needs recovery/);
  ui.document.documentElement.lang = 'be'; ui.observers[0]();
  assert.ok(ui.find('Спампаваць зыходныя даныя'));
  assert.match(ui.status.textContent, /аднаўленне/);
  assert.deepEqual(storage.writes, []);
});

test('UI rejects oversized files before reading their contents', async () => {
  const storage = store(), ui = mountUI(storage);
  let read = false;
  ui.input.files = [{ size: migration.MAX_BACKUP_BYTES + 1, text() { read = true; return ''; } }];
  await ui.input.handlers.change();
  assert.equal(read, false);
  assert.match(ui.status.textContent, /10 MB/);
  assert.deepEqual(storage.writes, []);
});

test('old-origin UI offers usable backup/import but no inactive research-domain link', () => {
  const storage = store(), ui = mountUI(storage, 'en', 'https://sergey-ulyanov.pro');
  assert.ok(ui.find('new research address is not enabled yet'));
  assert.equal(ui.nodes.some(node => node.tagName === 'A' && node.href?.startsWith('https://research.sergey-ulyanov.pro')), false);
  assert.ok(ui.find('Download browser backup'));
  assert.ok(ui.find('Choose browser backup JSON'));
  assert.deepEqual(storage.writes, []);
});

test('pending-address notice is localized without creating a clickable dead link', () => {
  const ui = mountUI(store(), 'be', 'https://sergey-ulyanov.pro');
  assert.ok(ui.find('Новы адрас даследавання пакуль не ўключаны'));
  assert.equal(ui.nodes.some(node => node.tagName === 'A' && node.href?.startsWith('https://research.sergey-ulyanov.pro')), false);
});
