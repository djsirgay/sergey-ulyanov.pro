import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {transformResearchText} from '../scripts/build-research-domain.mjs';

const read = file => readFileSync(new URL(`../research/${file}`, import.meta.url), 'utf8');
const html = read('index.html'), copy = read('i18n.js');
const section = (source, id) => source.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1] || '';
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const cards = source => [...source.matchAll(/<a class="research-start-card"([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, body]) => ({href: decode(attrs.match(/href="([^"]+)"/)?.[1] || ''), body}));

test('the first decision is listening pilot or MAPA, before optional archive tools', () => {
  const featured = cards(section(html, 'research-system'));
  assert.equal(featured.length, 2, 'Only the two primary experiences are featured');
  assert.equal(featured[0].href, 'https://unmute.sergey-ulyanov.pro/login/?lang=en');
  assert.match(featured[0].body, /<h3>GUCHNA · Belarusian Music Search<\/h3>/);
  assert.match(featured[0].body, /TEST PILOT/);
  assert.equal(featured[1].href, '/research/atlas/mapa/');
  assert.match(featured[1].body, /MAPA/);
  assert.ok(html.indexOf('id="research-system"') < html.indexOf('id="research-supporting-tools"'));
  assert.ok(html.indexOf('id="research-supporting-tools"') < html.indexOf('id="public-protocol"'));
});

test('supporting tools retain distinct purposes and every old destination', () => {
  const supporting = section(html, 'research-supporting-tools');
  assert.deepEqual(cards(supporting).map(card => card.href), [
    '/research/tools/unmute-the-archive/#create',
    '/research/tools/unmute-the-archive/restoration/',
    '/research/tools/unmute-the-archive/atlas/#external-discovery',
    '/research/atlas/'
  ]);
  assert.match(supporting, /not a required sequence/);
  assert.match(supporting, /separate from the listening pilot/);
  assert.match(supporting, /do not automatically sync/);
  assert.match(html, /The AI-system audit is a separate study/);
});

test('section menu has real destinations, with projects and supporting tools first', () => {
  const jump = html.match(/<nav class="section-jump"[\s\S]*?<\/nav>/)?.[0] || '';
  const targets = [...jump.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(targets.slice(0, 3), ['research-system', 'research-supporting-tools', 'public-protocol']);
  for (const target of targets) assert.ok(html.includes(`id="${target}"`), target);
  assert.doesNotMatch(section(html, 'research-system'), /Napieu|Hukashuk|[?&](?:reviewer|token|participant|password)=|sign up|no account/i);
});

// Execute the real translator against a small synthetic DOM; no browser or build writes.
function translate({lang = 'en', mount = '/research/'} = {}) {
  const transformed = source => mount === '/research/' ? source : transformResearchText(source, 'research/index.html', mount);
  const markup = transformed(html), address = new URL(`https://research.sergey-ulyanov.pro${mount}?lang=${lang}`);
  const group = section(markup, 'research-system') + section(markup, 'research-supporting-tools');
  const nodes = [...group.matchAll(/>([^<>]+)</g)].map(([, value]) => ({nodeValue: decode(value)}));
  const links = [...group.matchAll(/<a\b([^>]+)>/g)].map(([, attrs]) => {
    const attributes = new Map([...attrs.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, decode(value || '')]));
    return {href: attributes.get('href'), hasAttribute: key => attributes.has(key), getAttribute: key => key === 'href' ? attributes.get(key) : attributes.get(key), closest: () => null};
  });
  const foreign = {href:'https://example.org/login/?lang=en', hasAttribute: key => key === 'data-listening-pilot', getAttribute: () => 'https://example.org/login/?lang=en', closest: () => null};
  links.push(foreign);
  const listeners = new Map();
  const document = {
    body:{}, documentElement:{lang:'en'},
    createTreeWalker() {let at=-1; return {nextNode(){return ++at < nodes.length;},get currentNode(){return nodes[at];}};},
    querySelectorAll(selector){return selector === 'a[href]' ? links : [];},
    querySelector(){return null;}, addEventListener:(type, fn)=>listeners.set(type, fn)
  };
  const context = {document, location:address, URL, URLSearchParams, NodeFilter:{SHOW_TEXT:4}, localStorage:{setItem(){}}, history:{state:{},pushState(){}},window:{addEventListener(){}}};
  vm.runInNewContext(transformed(copy), context);
  return {nodes, links, foreign, document, change:lang=>listeners.get('research:language')({detail:{lang}})};
}

for (const mount of ['/research/', '/', '/palette-preview/white-red/']) {
  test(`${mount}: the external participant login retains EN/BE across language changes`, () => {
    const ui = translate({lang:'be',mount});
    const pilot = () => ui.links.find(link => link.href.startsWith('https://unmute.sergey-ulyanov.pro/'));
    assert.equal(pilot()?.href, 'https://unmute.sergey-ulyanov.pro/login/?lang=be');
    assert.ok(ui.nodes.some(node => node.nodeValue === 'Гучна · Пошук беларускай музыкі'));
    assert.ok(ui.nodes.some(node => node.nodeValue === 'Дапаможныя інструменты'));
    const mapa = ui.links.find(link => link.href.includes('atlas/mapa/'));
    assert.equal(new URL(mapa.href, 'https://research.sergey-ulyanov.pro').searchParams.get('lang'), 'be');
    ui.change('en');
    assert.equal(ui.document.documentElement.lang, 'en');
    assert.equal(pilot()?.href, 'https://unmute.sergey-ulyanov.pro/login/?lang=en');
    assert.ok(ui.nodes.some(node => node.nodeValue === 'GUCHNA · Belarusian Music Search'));
    assert.equal(ui.foreign.href, 'https://example.org/login/?lang=en', 'Unrelated external destinations are not rewritten');
  });
}

test('all featured and supporting copy is translated without inferred study outcomes', () => {
  const english = translate(), belarusian = translate({lang:'be'});
  english.nodes.forEach((node, index) => {
    const original = node.nodeValue.trim();
    if (original && /[A-Za-z]/.test(original)) assert.notEqual(belarusian.nodes[index].nodeValue.trim(), original, `Untranslated: ${original}`);
  });
  assert.doesNotMatch(section(html, 'research-system'), /validated|representative|participants completed|proven better/i);
});

test('the playful miniapp is a footer experiment, not a research project or finding', () => {
  const supporting = section(html, 'research-supporting-tools');
  const footer = supporting.match(/<div class="research-start-footer">([\s\S]*)/)?.[1] || '';
  assert.match(footer, /href="\/research\/playground\/dranik-meter\/">Playground · Dranik meter ↗<\/a>/);
  assert.doesNotMatch(section(html, 'research-system'), /dranik|Playground/i);
  assert.ok(cards(supporting).every(card => !card.href.includes('playground')));
});
