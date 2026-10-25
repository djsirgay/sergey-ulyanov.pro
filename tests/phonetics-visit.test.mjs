import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const read = name => fs.readFileSync(new URL('../joyofphonetics/' + name, import.meta.url), 'utf8');
// A narrow DOM boundary for event-handler tests, not a rendered-browser substitute.
// It uses the real page's IDs and runs the production core/coach/research scripts.
function harness(saved = {}) {
  const elements = new Map([...read('index.html').matchAll(/\bid="([^"]+)"/g)].map(([, id]) => [id, {
    value: '', textContent: '', innerHTML: '', checked: false, hidden: false,
    insertAdjacentElement() {}, appendChild() {}, focus() {},
    querySelector() { return {onchange: null}; }
  }]));
  const storage = new Map(Object.entries(saved));
  const context = {
    window: {}, document: {
      addEventListener() {}, getElementById: id => elements.get(id) || null,
      querySelectorAll: () => [], querySelector: () => null, createElement: () => ({style: {}, querySelector: () => ({}), appendChild() {}})
    }, localStorage: {getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value)},
    URL, Blob, Map, Set, Date, setTimeout, clearTimeout, alert() {}, confirm: () => false,
    navigator: {}, location: {hash: '', origin: 'https://example.test', pathname: '/joyofphonetics/'}
  };
  vm.createContext(context);
  vm.runInContext(read('core.js'), context);
  context.window.scrollTo = () => {};
  const JP = context.window.JP;
  JP.all = [{id: 'test-voice', label: 'Example voice', source_kind: 'idea', area: 'California', region: 'USA', source_url: 'https://www.dialectsarchive.com/california-6'}];
  JP.byId = new Map(JP.all.map(r => [r.id, r]));
  JP.state.lab = ['test-voice'];
  const downloads = [];
  JP.download = (name, body) => downloads.push({name, body: JSON.parse(body)});
  vm.runInContext(read('coach.js'), context);
  const coach = context.window.JPCoach;
  coach.init();
  return {context, JP, coach, elements, storage, downloads};
}

function enter(h, id, value) {
  const el = h.elements.get(id);
  assert.ok(el, 'The real page must supply ' + id);
  el.value = value;
  el.oninput?.({target: el});
}

test('visit flow saves the task and separate observations, exports, and restores without inventing a self-rating', () => {
  const h = harness();
  enter(h, 'roleProject', 'Expert walkthrough — test fixture, not a real meeting');
  enter(h, 'targetOutcome', 'Find two voices for a rhoticity teaching comparison');
  enter(h, 'studentNotes', 'Needed help finding the source link. Next: clarify the button.');
  enter(h, 'coachNotes', 'Fixture feedback recorded with permission for this test only.');
  h.elements.get('coachSample').value = 'test-voice';
  h.elements.get('coachSample').onchange();
  h.elements.get('saveCoachSession').onclick();
  const session = h.JP.state.sessions[0];
  assert.equal(session.selfRating, '', 'Unrated must not silently become 3/5');
  assert.equal(session.targetOutcome, 'Find two voices for a rhoticity teaching comparison');
  assert.equal(session.studentNotes, 'Needed help finding the source link. Next: clarify the button.');
  h.elements.get('exportSession').onclick();
  assert.equal(h.downloads[0].body.session.coachNotes, 'Fixture feedback recorded with permission for this test only.');
  const restored = harness(Object.fromEntries(h.storage));
  assert.equal(restored.elements.get('targetOutcome').value, 'Find two voices for a rhoticity teaching comparison');
  assert.equal(restored.elements.get('selfRating').value, '');
  assert.equal(restored.JP.state.sessions.length, 1);
});

test('exported session carries the chosen source and labels its evidential limits', () => {
  const h = harness();
  h.elements.get('coachSample').value = 'test-voice';
  h.elements.get('coachSample').onchange();
  h.elements.get('exportSession').onclick();
  const bundle = h.downloads[0].body;
  assert.equal(bundle.source?.sourceURL, 'https://www.dialectsarchive.com/california-6');
  assert.equal(bundle.source?.sampleId, 'test-voice');
  assert.match(bundle.method_note || '', /not.*learning outcome/i);
  assert.match(bundle.prototypeVersion || '', /20261017/);
});

test('a saved subjective rating stays selected rather than being reset during reload', () => {
  const h = harness();
  enter(h, 'selfRating', '2');
  h.elements.get('saveCoachSession').onclick();
  const restored = harness(Object.fromEntries(h.storage));
  assert.equal(restored.elements.get('selfRating').value, '2');
});

test('a permitted local recording can become the Coach reference without an archive sample or audio export', () => {
  const h = harness();
  h.JP.state.lab = [];
  h.context.URL = class extends URL { static createObjectURL() { return 'blob:test-local-only'; } };
  h.context.CSS = {escape: value => value};
  vm.runInContext(read('lab.js'), h.context);
  h.context.window.JPLab.init();
  const next = h.elements.get('useLocalReference');
  assert.ok(next, 'The local recording needs a handoff to Coach');
  assert.equal(next.disabled, true);
  h.elements.get('localReference').onchange({target: {files: [{name: 'Teacher reference.wav'}]}});
  assert.equal(next.disabled, false);
  next.onclick();
  assert.equal(h.elements.get('sourceReference').value, 'Teacher reference.wav');
  enter(h, 'practicePhrase', 'Where are we going?');
  enter(h, 'soundTarget1', 'Explore the final rise');
  h.elements.get('exportSession').onclick();
  const bundle = h.downloads[0].body;
  assert.equal(bundle.source.reference, 'Teacher reference.wav');
  assert.equal(bundle.audioIncluded, false);
  assert.doesNotMatch(JSON.stringify(bundle), /blob:test-local-only/);
});

test('three task-specific sound targets and a scene phrase survive saving, export, and reload', () => {
  const h = harness();
  enter(h, 'sourceReference', 'Permitted rehearsal reference, opening line');
  enter(h, 'practicePhrase', 'Where are we going?');
  enter(h, 'soundTarget1', 'Explore the final rise');
  enter(h, 'soundTarget2', 'Notice the /r/ in where');
  enter(h, 'soundTarget3', 'Try a longer first syllable in going');
  h.elements.get('buildDrill').onclick();
  const drill = h.elements.get('drillText').value;
  assert.ok(drill.includes('Where are we going?'));
  assert.ok(drill.includes('1. Explore the final rise'));
  assert.ok(drill.includes('2. Notice the /r/ in where'));
  assert.ok(drill.includes('3. Try a longer first syllable in going'));
  h.elements.get('saveCoachSession').onclick();
  h.elements.get('exportSession').onclick();
  assert.equal(h.downloads[0].body.session.soundTarget3, 'Try a longer first syllable in going');
  const restored = harness(Object.fromEntries(h.storage));
  assert.equal(restored.elements.get('practicePhrase').value, 'Where are we going?');
  assert.equal(restored.elements.get('soundTarget2').value, 'Notice the /r/ in where');
  assert.equal(restored.elements.get('sourceReference').value, 'Permitted rehearsal reference, opening line');
});

test('a shared practice link carries the source, phrase and three targets as text, without student observations', async () => {
  const h = harness();
  h.context.btoa = text => Buffer.from(text, 'binary').toString('base64');
  h.context.atob = text => Buffer.from(text, 'base64').toString('binary');
  h.context.unescape = unescape;
  h.context.escape = escape;
  let copied;
  h.JP.copyText = async text => {copied = text; return true;};
  enter(h, 'sourceReference', 'Teacher-approved reference');
  enter(h, 'practicePhrase', 'Where are we going?');
  enter(h, 'soundTarget1', 'Final rise');
  enter(h, 'soundTarget2', '/r/ in where');
  enter(h, 'soundTarget3', 'First syllable duration');
  enter(h, 'studentNotes', 'Private learner observation');
  await h.elements.get('shareSession').onclick();
  const session = h.JP.parseShare(new URL(copied).hash.slice('#session='.length));
  assert.equal(session.sourceReference, 'Teacher-approved reference');
  assert.equal(session.practicePhrase, 'Where are we going?');
  assert.equal(session.soundTarget3, 'First syllable duration');
  assert.equal(session.studentNotes, undefined);
});

function agreement(a, b, coder = 'Sergey') {
  const h = harness();
  h.JP.state.annotations = {Sergey: a, Louis: b};
  h.JP.state.coder = coder;
  vm.runInContext(read('research.js'), h.context);
  h.context.window.JPResearch.render();
  return h;
}

test('no category variation produces undefined kappa, not a false perfect-reliability claim', () => {
  const h = agreement({a: {rhoticity: 'Rhotic'}, b: {rhoticity: 'Rhotic'}}, {a: {rhoticity: 'Rhotic'}, b: {rhoticity: 'Rhotic'}});
  const output = h.elements.get('agreementBox').innerHTML;
  assert.match(output, /Rhoticity: n=2, observed agreement 100%/);
  assert.match(output, /κ —/);
  assert.doesNotMatch(output, /κ 1\.00/);
});

test('balanced disagreements retain zero kappa and local profile keys retain their data', () => {
  const h = agreement({a: {rhoticity: 'Rhotic'}, b: {rhoticity: 'Non-rhotic'}}, {a: {rhoticity: 'Rhotic'}, b: {rhoticity: 'Rhotic'}}, 'Louis');
  assert.match(h.elements.get('agreementBox').innerHTML, /Rhoticity: n=2, observed agreement 50%, Cohen’s κ 0\.00/);
  assert.equal(h.elements.get('activeCoderLabel').textContent, 'Coder B');
  assert.equal(h.JP.state.annotations.Louis.b.rhoticity, 'Rhotic');
});

test('annotation CSV identifies historical profile keys as unverified rather than named expert identities', () => {
  const h = agreement({},{'test-voice': {rhoticity: 'Rhotic', confidence: 'Low'}}, 'Louis');
  const controls = [];
  h.elements.get('exportResearch').parentElement = {appendChild: el => controls.push(el)};
  let csv;
  h.JP.download = (name, body) => {csv = body;};
  h.context.window.JPResearch.init();
  controls.find(el => el.textContent === 'Export annotations CSV').onclick();
  assert.ok(csv.startsWith('local_profile_key_not_verified_identity,local_profile_label,sample_id,'));
  assert.match(csv, /\nLouis,Coder B,test-voice,idea,/);
  assert.equal(h.JP.state.annotations.Louis['test-voice'].rhoticity, 'Rhotic');
});

function worker() {
  const handlers = {}, deleted = [];
  const context = {URL, self: {
    registration: {scope: 'https://example.test/joyofphonetics/'}, location: {origin: 'https://example.test'},
    addEventListener: (name, fn) => { handlers[name] = fn; }, clients: {claim: async () => {}}, skipWaiting: async () => {}
  }, fetch: async () => ({ok: false, clone() {return this;}}), caches: {
    match: async () => undefined,
    open: async () => ({put: async () => {}}),
    keys: async () => ['joyofphonetics-v4-20261002', 'unrelated-tool-cache'], delete: async key => deleted.push(key)
  }};
  vm.runInNewContext(read('sw.js'), context);
  return {handlers, deleted, context};
}

test('upgrading offline support removes only this project’s obsolete caches', async () => {
  const h = worker(); let done;
  h.handlers.activate({waitUntil: promise => {done = promise;}});
  await done;
  assert.deepEqual(h.deleted, ['joyofphonetics-v4-20261002']);
});

test('offline support leaves archive audio and other tools’ requests on their normal network path', () => {
  const h = worker();
  for (const url of ['https://archive.test/voice.mp3', 'https://example.test/joyofphonetics/voice.wav', 'https://example.test/research/private.json']) {
    let intercepted = false;
    h.handlers.fetch({request: {method: 'GET', url}, respondWith: () => {intercepted = true;}});
    assert.equal(intercepted, false, url);
  }
});

test('offline shell resolves versioned script requests from its own precache', async () => {
  const h = worker();
  h.context.caches.open = async () => ({
    match: async (request, options) => options?.ignoreSearch ? 'cached-shell-script' : undefined,
    put: async () => {}
  });
  h.context.fetch = async () => {throw Error('offline');};
  let response;
  h.handlers.fetch({request: {method: 'GET', url: 'https://example.test/joyofphonetics/core.js?v=20261017-visit'}, respondWith: promise => {response = promise;}});
  assert.equal(await response.catch(() => 'network error'), 'cached-shell-script');
});
