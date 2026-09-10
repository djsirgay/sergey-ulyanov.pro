// These VM tests execute the actual initialization segments, not copied selectors.
// They cover language choice and MAPA URL state, not full DOM rendering, script
// loading order, translated copy, or browser behavior. Those require integration QA.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = file => readFileSync(new URL(`../research/${file}`, import.meta.url), 'utf8');
const source = {
  home: read('i18n.js'),
  shared: read('shared-language.js'),
  wayfinding: read('wayfinding-pages.js'),
  atlas: read('atlas/atlas.js'),
  mapa: read('atlas/mapa/mapa.js')
};

function segment(code, start, end) {
  const from = code.indexOf(start);
  assert.notEqual(from, -1, `Initialization start marker is present: ${start}`);
  const to = code.indexOf(end, from + start.length);
  assert.notEqual(to, -1, `Initialization end marker is present: ${end}`);
  return code.slice(from, to);
}

const mapaReadURL = segment(source.mapa, '  function readURL() {', '  function matches(event) {');
const selectors = {
  home: segment(source.home, '  const selectedLanguage = () => {', '\n  capture();') + '\nselectedLanguage();',
  shared: segment(source.shared, "const query=new URLSearchParams(location.search).get('lang');", 'let pending=false;') + '\nselected;',
  wayfinding: segment(source.wayfinding, 'function initialLanguage() {', '\nfunction translate() {') + '\ndocument.documentElement.lang;',
  atlas: segment(source.atlas, '  const params=new URLSearchParams(location.search);', '\n})();') + '\nselected;',
  mapa: mapaReadURL + '\nreadURL(); state.lang;'
};
const eventContext = { window: {} };
vm.runInNewContext(read('atlas/mapa/events.js'), eventContext);
const events = eventContext.window.MAPA_EVENTS;
const categoryLine = source.mapa.match(/const categories=\[[^\n]+;/)?.[0];
assert.ok(categoryLine, 'MAPA category declaration is present');
const categories = vm.runInNewContext(`${categoryLine}\ncategories;`);

function initialize(name, query = '', { saved = 'be', markup = 'be-BY', blocked = false } = {}) {
  const location = new URL(`https://research.sergey-ulyanov.pro/atlas/mapa/${query}`);
  const document = { documentElement: { lang: markup } };
  const state = { lang: 'be' };
  let storageReads = 0;
  const context = {
    location, document, state, events, categories, URL, URLSearchParams,
    localStorage: {
      getItem(key) {
        storageReads++;
        if (blocked) throw new Error('Storage unavailable');
        return ['research-lang', 'living-belarus-atlas-lang'].includes(key) ? saved : null;
      }
    },
    language: () => document.documentElement.lang.toLowerCase().startsWith('be') ? 'be' : 'en',
    selected: null,
    apply(next) { context.selected = next; },
    setLanguage(next) { context.selected = next; }
  };
  const before = location.href;
  const lang = vm.runInNewContext(selectors[name], context, { filename: `${name}-language-initialization.js` });
  return { lang, state, document, location, before, storageReads };
}

for (const name of Object.keys(selectors)) {
  for (const query of ['', '?lang=', '?lang=ru', '?lang=BE']) {
    test(`${name}: ${query || 'unqualified URL'} defaults to English despite stale Belarusian storage and markup`, () => {
      const result = initialize(name, query);
      assert.equal(result.lang, 'en');
      assert.equal(result.storageReads, 0, 'Default language must not depend on stored preferences');
    });
  }

  for (const lang of ['en', 'be']) {
    test(`${name}: explicit ${lang} is honored despite conflicting saved language`, () => {
      const result = initialize(name, `?lang=${lang}`, { saved: lang === 'be' ? 'en' : 'be' });
      assert.equal(result.lang, lang);
      assert.equal(result.storageReads, 0);
    });
  }

  test(`${name}: blocked storage does not alter the English default or explicit Belarusian choice`, () => {
    assert.equal(initialize(name, '', { blocked: true }).lang, 'en');
    assert.equal(initialize(name, '?lang=be', { blocked: true }).lang, 'be');
  });
}

test('MAPA: default-English initialization retains event filters and historical-map query/hash state', () => {
  const event = events.find(item => item.id !== 'skaryna-1517');
  assert.ok(event, 'A nondefault real MAPA event is available');
  const query = `?q=Riga&topic=politics&period=twentieth&view=table&event=${event.id}&year=1938&city=brest&mapScope=region&stage=division-1938#borders`;
  const result = initialize('mapa', query);
  assert.deepEqual(result.state, {
    lang: 'en', query: 'Riga', topic: 'politics', period: 'twentieth', view: 'table', event: event.id
  });
  assert.equal(result.location.href, result.before, 'Language initialization leaves all URL state untouched');
});

test('MAPA: explicit Belarusian initialization retains event filters and historical-map query/hash state', () => {
  const result = initialize('mapa', '?lang=be&q=Skaryna&topic=language&period=early&view=table&event=skaryna-1517&year=1938&city=brest#borders');
  assert.deepEqual(result.state, {
    lang: 'be', query: 'Skaryna', topic: 'language', period: 'early', view: 'table', event: 'skaryna-1517'
  });
  assert.equal(result.location.href, result.before);
});

test('MAPA: switching language preserves every non-language query parameter, fragment and history state', () => {
  const setLanguage = segment(source.mapa, '  function setLanguage(lang){', "  document.querySelectorAll('[data-lang]')");
  const state = { lang: 'en' }, document = { documentElement: { lang: 'en' } };
  let address = new URL('https://research.sergey-ulyanov.pro/atlas/mapa/?year=1938&city=brest&mapScope=region&stage=division-1938&q=Riga&topic=politics&view=table&lang=en#borders');
  const original = new URL(address), historyState = { userState: 'retain' }, replacements = [];
  const context = {
    state, document, URL,
    location: { get href() { return address.href; } },
    applyLanguage() { document.documentElement.lang = state.lang; },
    history: {
      state: historyState,
      replaceState(nextState, _title, nextURL) {
        assert.equal(nextState, historyState);
        address = new URL(nextURL);
        replacements.push(address.href);
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(setLanguage, context);
  for (const lang of ['be', 'en']) {
    vm.runInContext(`setLanguage('${lang}');`, context);
    assert.equal(state.lang, lang);
    assert.equal(document.documentElement.lang, lang);
    assert.equal(address.searchParams.get('lang'), lang);
    assert.equal(address.pathname, original.pathname);
    assert.equal(address.hash, original.hash);
    for (const [key, value] of original.searchParams) {
      if (key !== 'lang') assert.equal(address.searchParams.get(key), value, `${key} is retained`);
    }
  }
  assert.equal(replacements.length, 2);
});
