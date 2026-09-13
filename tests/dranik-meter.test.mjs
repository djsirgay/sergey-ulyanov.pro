import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';

const base = new URL('../research/playground/dranik-meter/', import.meta.url);
// Missing implementation is reported as an absent public capability, not an import error.
const api = existsSync(new URL('calculator.js', base)) ? await import(new URL('calculator.js', base)) : {};
const calculate = input => {
  assert.equal(typeof api.calculateDraniki, 'function', 'The local calculator must expose calculateDraniki');
  return api.calculateDraniki(input);
};

test('the playful equivalence uses an explicit 50 g assumption, not a real average', () => {
  const r = calculate({weight: '70', unit: 'kg', pancakeGrams: '50'});
  assert.equal(r.ok, true);
  assert.equal(r.pancakes, 1400);
  assert.equal(r.kilograms, 70);
  assert.equal(r.pancakeGrams, 50);
});

test('pounds use the exact international conversion and the fixed 50 g assumption', () => {
  const r = calculate({weight: '100', unit: 'lb', pancakeGrams: '25'});
  assert.equal(r.ok, true);
  assert.equal(r.kilograms, 45.359237);
  assert.ok(Math.abs(r.pancakes - 907.18474) < 1e-9);
  assert.equal(r.pancakeGrams, 50, 'Caller-supplied pancake mass cannot change the game');
});

test('a decimal comma is accepted without treating grouping or expressions as numbers', () => {
  assert.equal(calculate({weight: ' 70,5 ', unit: 'kg', pancakeGrams: '50'}).pancakes, 1410);
  for (const weight of ['1,000.5', '1 000', '1e2', '0x50', '5+5', 'Infinity', 'NaN']) {
    assert.equal(calculate({weight, unit: 'kg', pancakeGrams: '50'}).ok, false, weight);
  }
});

test('empty, nonpositive, nonfinite and excessive values produce safe field errors', () => {
  for (const weight of ['', ' ', '0', '-1', '1001', Infinity, null, {}, true]) {
    const r = calculate({weight, unit: 'kg', pancakeGrams: '50'});
    assert.equal(r.ok, false, String(weight));
    assert.equal(r.field, 'weight');
    assert.equal('pancakes' in r, false);
  }
  assert.equal(calculate({weight: '70', unit: 'stone', pancakeGrams: '50'}).field, 'unit');
});

test('weight bounds apply after unit conversion, and small positive weights remain valid', () => {
  assert.equal(calculate({weight: '1000', unit: 'kg', pancakeGrams: '1'}).pancakes, 20000);
  assert.equal(calculate({weight: '2205', unit: 'lb', pancakeGrams: '50'}).ok, false);
  assert.equal(calculate({weight: '0.1', unit: 'kg', pancakeGrams: '500'}).pancakes, 2);
});

test('the calculator is a pure operation and does not mutate its input', () => {
  const input = Object.freeze({weight: '70', unit: 'kg', pancakeGrams: '50'});
  assert.deepEqual(calculate(input), calculate(input));
});

const uiApi = existsSync(new URL('meter.js', base)) ? await import(new URL('meter.js', base)) : {};
const read = file => existsSync(new URL(file, base)) ? readFileSync(new URL(file, base), 'utf8') : '';

test('the page starts empty and contains accessible controls rather than a submittable weight form', () => {
  const html = read('index.html');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /id="weight"[^>]*inputmode="decimal"/);
  assert.doesNotMatch(html.match(/<input[^>]+id="weight"[^>]*>/)?.[0] || '', /value="[^\"]+"/);
  for (const id of ['weight', 'unit']) assert.ok(html.includes(`for="${id}"`));
  assert.doesNotMatch(html, /<input[^>]+id="pancake-grams"/, 'A pancake has one fixed assumed weight');
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /autocomplete="off"/);
  assert.doesNotMatch(html, /<form\b|type="submit"|https:\/\/fonts|analytics/i);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /name="robots" content="noindex,nofollow,noarchive"/);
});

test('all three languages explain the assumption, privacy and non-research boundary', () => {
  assert.equal(typeof uiApi.languageFor, 'function', 'Explicit URL language with English default is supported');
  assert.equal(uiApi.languageFor('?lang=be'), 'be');
  assert.equal(uiApi.languageFor('?lang=ru'), 'ru');
  assert.equal(uiApi.languageFor(''), 'en');
  assert.equal(uiApi.languageFor('?lang=zz'), 'en');
  assert.deepEqual(Object.keys(uiApi.messages), ['en', 'be', 'ru']);
  const keys = Object.keys(uiApi.messages.en);
  for (const lang of ['en', 'be', 'ru']) {
    assert.deepEqual(Object.keys(uiApi.messages[lang]), keys);
    for (const key of keys) assert.ok(uiApi.messages[lang][key].length > 0, lang + key);
  }
  assert.match(uiApi.messages.en.assumption, /assum|not.*average/i);
  assert.match(uiApi.messages.en.boundary, /not research or health advice/i);
  assert.match(uiApi.messages.be.boundary, /не даследаванне/i);
  assert.match(uiApi.messages.ru.boundary, /не исследование/i);
});

function fakePage(search = '') {
  const ids = ['weight', 'unit', 'pancake-grams', 'calculate', 'clear', 'result-count', 'result-detail', 'error', 'result-note'];
  const node = id => ({id, value: id === 'unit' ? 'kg' : id === 'pancake-grams' ? '50' : '', textContent:'', hidden:false, attrs:{}, events:{}, dataset:{},
    addEventListener(name, fn){this.events[name]=fn;}, setAttribute(key,value){this.attrs[key]=String(value);}, removeAttribute(key){delete this.attrs[key];}, focus(){this.focused=true;}});
  const nodes = Object.fromEntries(ids.map(id => [id,node(id)]));
  const languages = ['en','be','ru'].map(lang => Object.assign(node(lang),{dataset:{language:lang}}));
  const text = Object.keys(uiApi.messages || {}).length ? Object.keys(uiApi.messages.en).map(key => Object.assign(node(key),{dataset:{copy:key}})) : [];
  const links = [Object.assign(node('home'),{dataset:{home:''},set href(value){this.url=value;}})];
  const doc = {documentElement:{lang:'en'}, title:'', getElementById:id=>nodes[id], querySelectorAll:s=>s==='[data-language]'?languages:s==='[data-copy]'?text:s==='[data-home]'?links:[]};
  const urls=[], events={};
  const win = {location:{search,pathname:'/playground/dranik-meter/'},history:{replaceState:(_state,_title,url)=>urls.push(url)},addEventListener:(name,fn)=>events[name]=fn};
  assert.equal(typeof uiApi.mountMeter, 'function', 'The page binds real local calculator interactions');
  uiApi.mountMeter(doc,win);
  return {nodes,languages,doc,urls,events,links};
}

test('calculate, keyboard entry, stale-result reset and clear work without transmitting values', () => {
  const p = fakePage();
  p.nodes.weight.value = '70'; p.nodes.calculate.events.click();
  assert.match(p.nodes['result-count'].textContent, /1[,.\s]?400/);
  assert.equal(p.urls.length, 0);
  p.nodes.weight.value = '80'; p.nodes.weight.events.input();
  assert.equal(p.nodes['result-count'].textContent, '—');
  p.nodes.weight.events.keydown({key:'Enter',preventDefault(){}});
  assert.match(p.nodes['result-count'].textContent, /1[,.\s]?600/);
  p.nodes.clear.events.click();
  assert.equal(p.nodes.weight.value, '');
  assert.equal(p.nodes['result-count'].textContent, '—');
});

test('errors identify the field; language changes preserve in-memory input, not history values', () => {
  const p = fakePage('?lang=be');
  assert.equal(p.doc.documentElement.lang, 'be');
  p.nodes.calculate.events.click();
  assert.equal(p.nodes.weight.attrs['aria-invalid'], 'true');
  assert.ok(p.nodes.error.textContent.length);
  p.nodes.weight.value = '72.25'; p.nodes.calculate.events.click();
  p.languages[2].events.click();
  assert.equal(p.doc.documentElement.lang, 'ru');
  assert.equal(p.nodes.weight.value, '72.25');
  assert.deepEqual(p.urls, ['/playground/dranik-meter/?lang=ru']);
  assert.ok(p.links[0].href.endsWith('?lang=en'), 'Research has EN/BE only; Russian returns to English');
  p.events.pagehide();
  assert.equal(p.nodes.weight.value, '');
});

test('no calculator source invokes storage, telemetry or an outbound data API', () => {
  const source = read('calculator.js') + read('meter.js') + read('index.html');
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|document\.cookie|sendBeacon|\bfetch\s*\(|XMLHttpRequest|WebSocket|<form\b/);
  assert.match(read('meter.css'), /min-height:\s*44px/);
  assert.match(read('meter.css'), /prefers-reduced-motion/);
});
test('the meter includes the shared navigation-only Research bridge when embedded in GUCHNA',()=>{
  assert.match(read('meter.js'),/import ['"]\.\.\/\.\.\/listening-bridge\.js['"]/);
});
