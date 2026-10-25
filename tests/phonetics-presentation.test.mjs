import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = name => fs.readFileSync(new URL('../joyofphonetics/' + name, import.meta.url), 'utf8');

// Event-handler boundary only. Layout and the full course → lab flow are checked in Chrome.
function presentation({saved = {}, search = '', blocked = false} = {}) {
  const storage = new Map(Object.entries(saved));
  const attributes = new Map();
  const meta = {content: ''};
  const buttons = ['poster', 'book'].map(theme => ({
    dataset: {themeChoice: theme}, attributes: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(event, fn) { this[event] = fn; }
  }));
  const lessonButtons = ['listen', 'compare', 'reflect'].map(lesson => ({
    dataset: {lesson}, attributes: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(event, fn) { this[event] = fn; }
  }));
  const lessons = lessonButtons.map(b => ({
    dataset: {lessonPanel: b.dataset.lesson}, hidden: false,
    querySelector: () => ({focus() {}})
  }));
  const ready = [];
  const images = [0, 1].map(() => ({
    src: './assets/joy-logo-cream.webp',
    dataset: {artCream: './assets/joy-logo-cream.webp', artBook: './assets/joy-logo-lavender.webp'}
  }));
  const context = {URLSearchParams, location: {search}, localStorage: {
    getItem(key) { if (blocked) throw new Error('Storage blocked'); return storage.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('Storage blocked'); storage.set(key, value); }
  }, document: {
    documentElement: {setAttribute: (key, value) => attributes.set(key, value)},
    querySelector: selector => selector === 'meta[name="theme-color"]' ? meta : null,
    querySelectorAll: selector => selector === '[data-theme-art]' ? images : selector === '[data-theme-choice]' ? buttons : selector === '[data-lesson]' ? lessonButtons : selector === '[data-lesson-panel]' ? lessons : [],
    addEventListener: (event, fn) => ready.push(fn)
  }};
  vm.runInNewContext(read('presentation.js'), context);
  ready.forEach(fn => fn());
  return {attributes, buttons, lessonButtons, lessons, storage, meta, images};
}

test('poster is the default and a book-theme click changes presentation without touching lab data', () => {
  const original = JSON.stringify({lab: ['fixture'], coachDraft: {studentNotes: 'Keep this'}});
  const h = presentation({saved: {'joyofphonetics-v4': original}});
  assert.equal(h.attributes.get('data-theme'), 'poster');
  h.buttons[1].click();
  assert.equal(h.attributes.get('data-theme'), 'book');
  assert.equal(h.buttons[1].attributes['aria-pressed'], 'true');
  assert.equal(h.buttons[0].attributes['aria-pressed'], 'false');
  assert.equal(h.storage.get('joyofphonetics-theme-v1'), 'book');
  assert.equal(h.storage.get('joyofphonetics-v4'), original);
  assert.equal(h.meta.content, '#8e94cc');
});

test('a selected theme survives reload and an explicit preview URL overrides it without overwriting storage', () => {
  const h = presentation({saved: {'joyofphonetics-theme-v1': 'book'}});
  assert.equal(h.attributes.get('data-theme'), 'book');
  const preview = presentation({saved: Object.fromEntries(h.storage), search: '?theme=poster'});
  assert.equal(preview.attributes.get('data-theme'), 'poster');
  assert.equal(preview.storage.get('joyofphonetics-theme-v1'), 'book');
});

test('invalid theme values fall back to poster and unavailable storage does not break the switch', () => {
  assert.equal(presentation({saved: {'joyofphonetics-theme-v1': '<invalid>'}, search: '?theme=bad'}).attributes.get('data-theme'), 'poster');
  const h = presentation({blocked: true});
  assert.doesNotThrow(() => h.buttons[1].click());
  assert.equal(h.attributes.get('data-theme'), 'book');
});

test('palette changes replace both the digital logo and hero artwork without resetting the active lesson', () => {
  const h = presentation();
  h.lessonButtons[1].click();
  h.buttons[1].click();
  assert.deepEqual(h.images.map(image => image.src), [
    './assets/joy-logo-lavender.webp', './assets/joy-logo-lavender.webp'
  ]);
  assert.deepEqual(h.lessons.map(panel => panel.hidden), [true, false, true]);
  h.buttons[0].click();
  assert.deepEqual(h.images.map(image => image.src), [
    './assets/joy-logo-cream.webp', './assets/joy-logo-cream.webp'
  ]);
});

test('a persisted lavender choice loads its artwork on initialization, not the cream illustration', () => {
  const h = presentation({saved: {'joyofphonetics-theme-v1': 'book'}});
  assert.deepEqual(h.images.map(image => image.src), [
    './assets/joy-logo-lavender.webp', './assets/joy-logo-lavender.webp'
  ]);
});

test('course steps show only the selected real text lesson and expose its selection', () => {
  const h = presentation();
  assert.deepEqual(h.lessons.map(p => p.hidden), [false, true, true]);
  h.lessonButtons[1].click();
  assert.deepEqual(h.lessons.map(p => p.hidden), [true, false, true]);
  assert.equal(h.lessonButtons[1].attributes['aria-pressed'], 'true');
  h.lessonButtons[2].click();
  assert.deepEqual(h.lessons.map(p => p.hidden), [true, true, false]);
  assert.equal(h.lessonButtons[1].attributes['aria-pressed'], 'false');
});

test('the offline shell includes small page dependencies without downloading or intercepting tutorial video streams', async () => {
  const handlers = {};
  let assets;
  vm.runInNewContext(read('sw.js'), {
    URL, Set,
    self: {
      registration: {scope: 'https://example.test/joyofphonetics/'},
      location: {origin: 'https://example.test'},
      addEventListener: (name, fn) => { handlers[name] = fn; },
      skipWaiting() {}, clients: {claim() {}}
    },
    caches: {open: async () => ({addAll: async paths => {assets = [...paths];}})}
  });
  let installed;
  handlers.install({waitUntil: promise => {installed = promise;}});
  await installed;
  for (const asset of assets) {
    const path = asset === './' ? 'index.html' : asset;
    assert.ok(fs.existsSync(new URL('../joyofphonetics/' + path, import.meta.url)), 'Missing precache asset: ' + asset);
  }
  const dependencies = [...read('index.html').matchAll(/(?:src|href)="(\.\/[^"#?]+)(?:\?[^"#]*)?"/g)].map(([, path]) => path);
  for (const dependency of dependencies) {
    if (dependency.endsWith('.mp4')) {
      assert.ok(!assets.includes(dependency), 'Video must load only when requested, not during installation');
      let intercepted = false;
      handlers.fetch({request: {method: 'GET', url: new URL(dependency, 'https://example.test/joyofphonetics/').href}, respondWith() { intercepted = true; }});
      assert.equal(intercepted, false, 'Leave media range requests to the network');
    } else {
      assert.ok(assets.includes(dependency), 'Page dependency missing from offline shell: ' + dependency);
    }
  }
});
