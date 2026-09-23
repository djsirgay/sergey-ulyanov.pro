import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformResearchText } from '../scripts/build-research-domain.mjs';

const code = readFileSync(new URL('../research/wayfinding-pages.js', import.meta.url), 'utf8');
const pages = Object.fromEntries(['tools', 'help'].map(name => [name, readFileSync(new URL(`../research/${name}/index.html`, import.meta.url), 'utf8')]));
function mount({ page = 'help', url = 'https://sergey-ulyanov.pro/research/help/', saved = null, markup = 'en', blocked = false, preview = false } = {}) {
  const transform = source => preview ? transformResearchText(source, '', '/palette-preview/white-red/') : source;
  const main = transform(pages[page]).split('<main')[1].split('</main>')[0];
  const nodes = [...main.matchAll(/data-wayfinding="([^"]+)"[^>]*>([^<]*)/g)].map(match => ({ dataset: { wayfinding: match[1] }, textContent: match[2] }));
  const links = [...main.matchAll(/<a[^>]+href="([^"]+)"/g)].map(match => ({ href: match[1], getAttribute() { return this.href; } }));
  const aria = [...main.matchAll(/aria-label="([^"]+)" data-wayfinding-aria="([^"]+)"/g)].map(match => ({ dataset: { wayfindingAria: match[2] }, value: match[1], getAttribute() { return this.value; }, setAttribute(_key, value) { this.value = value; } }));
  const observers = [], documentListeners = new Map(), windowListeners = new Map();
  const document = {
    body: { dataset: { wayfindingPage: page } }, title: `${page} — Unmute Belarus`, documentElement: { lang: markup },
    querySelectorAll(selector) { return selector === '[data-wayfinding]' ? nodes : selector === 'main a[href]' ? links : selector === '[data-wayfinding-aria]' ? aria : []; },
    addEventListener(type, callback) { documentListeners.set(type, callback); }
  };
  const address = new URL(url), location = { href: address.href, hostname: address.hostname, origin: address.origin };
  const context = {
    document, location, URL, WeakMap, queueMicrotask,
    localStorage: { getItem(key) { assert.equal(key, 'research-lang'); if (blocked) throw new Error('Storage blocked'); return saved; } },
    window: { addEventListener(type, callback) { windowListeners.set(type, callback); } },
    MutationObserver: class { constructor(callback) { observers.push(callback); } observe() {} }
  };
  const translations = vm.runInNewContext(`${transform(code)}\n;be`, context);
  return { document, location, nodes, links, aria, observers, documentListeners, windowListeners, translations, get: key => nodes.find(node => node.dataset.wayfinding === key)?.textContent };
}

for (const page of ['help', 'tools']) {
  test(`${page}: explicit lang=be initializes both content and root language, retaining the fragment`, () => {
    const url = `https://sergey-ulyanov.pro/research/${page}/?year=1938&lang=be#music`;
    const ui = mount({ page, url, saved: 'en' });
    assert.equal(ui.document.documentElement.lang, 'be');
    assert.equal(ui.get('audioTitle'), 'Апрацоўка гуку');
    assert.equal(ui.get('mapaTitle'), 'Гістарычная мапа · MAPA');
    assert.equal(ui.location.href, url);
    assert.match(ui.document.title, page === 'help' ? /Дапамога/ : /Даследчыя/);
  });

  test(`${page}: explicit English URL overrides a saved Belarusian preference`, () => {
    const ui = mount({ page, url: `https://sergey-ulyanov.pro/research/${page}/?lang=en#music`, saved: 'be' });
    assert.equal(ui.document.documentElement.lang, 'en');
    assert.equal(ui.get('cultureTitle'), 'Culture directory');
  });

  test(`${page}: unqualified and unsupported language URLs open in English despite saved Belarusian`, () => {
    for (const query of ['', '?lang=ru']) {
      const ui = mount({ page, url: `https://sergey-ulyanov.pro/research/${page}/${query}#music`, saved: 'be' });
      assert.equal(ui.document.documentElement.lang, 'en');
      assert.equal(ui.get('audioTitle'), 'Audio lab');
      assert.ok(ui.location.href.endsWith('#music'));
    }
  });

  test(`${page}: unavailable storage and stale markup do not override the English default`, () => {
    const ui = mount({ page, markup: 'be-BY', blocked: true });
    assert.equal(ui.document.documentElement.lang, 'en');
    assert.equal(ui.get('audioTitle'), 'Audio lab');
    assert.equal(mount({ page, markup: 'en', blocked: true }).get('audioTitle'), 'Audio lab');
  });

  test(`${page}: shell event before root language update reads the new language after the update`, async () => {
    const ui = mount({ page });
    ui.documentListeners.get('research:language')({ detail: { lang: 'be' } });
    ui.document.documentElement.lang = 'be';
    await Promise.resolve();
    assert.equal(ui.get('audioTitle'), 'Апрацоўка гуку');
    ui.documentListeners.get('research:language')({ detail: { lang: 'en' } });
    ui.document.documentElement.lang = 'en';
    await Promise.resolve();
    assert.equal(ui.get('audioTitle'), 'Audio lab');
    assert.equal(ui.get('cultureTitle'), 'Culture directory');
  });

  test(`${page}: language retains MAPA year/hash and supports isolated-domain paths`, () => {
    const ui = mount({ page, url: `https://research.sergey-ulyanov.pro/${page}/?lang=be#music` });
    assert.ok(ui.links.some(link => link.href.includes('year=1938') && link.href.includes('lang=be') && link.href.endsWith('#borders')));
    assert.ok(ui.links.every(link => !link.href.startsWith('/research/')));
    assert.ok(ui.links.filter(link => !link.href.startsWith('#')).every(link => link.href.includes('lang=be')));
  });

  test(`${page}: all copy keys have translations and in-page links have real targets`, () => {
    const ui = mount({ page });
    for (const match of pages[page].matchAll(/data-wayfinding(?:-aria)?="([^"]+)"/g)) assert.ok(ui.translations[match[1]], match[1]);
    const ids = new Set([...pages[page].matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    for (const match of pages[page].matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), match[1]);
    assert.doesNotMatch(code, /\bІІ\b/);
  });

  test(`${page}: preview body links retain the selected language and mounted path`, () => {
    for (const lang of ['en', 'be']) {
      const ui = mount({ page, url: `https://research.sergey-ulyanov.pro/palette-preview/white-red/${page}/?lang=${lang}`, preview: true });
      const internal = ui.links.filter(link => link.href.startsWith('/palette-preview/white-red/'));
      assert.ok(internal.length > 0);
      for (const link of internal) assert.equal(new URL(link.href, ui.location.origin).searchParams.get('lang'), lang, link.href);
      assert.ok(internal.some(link => link.href.includes('year=1938') && link.href.endsWith('#borders')));
    }
  });

  test(`${page}: source-page canonical remains on the live old origin until the isolated build rewrites it`, () => {
    assert.ok(pages[page].includes(`<link rel="canonical" href="https://sergey-ulyanov.pro/research/${page}/">`));
    assert.ok(!pages[page].includes(`<link rel="canonical" href="https://research.sergey-ulyanov.pro/${page}/">`));
    for (const font of ['family=Manrope', 'family=Newsreader', 'family=Space+Mono']) assert.ok(pages[page].includes(font), font);
    assert.ok(pages[page].includes('href="/favicon.svg"'));
  });
}
