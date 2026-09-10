import {readFileSync, existsSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('press/index.html', root), 'utf8');
const code = readFileSync(new URL('press/media-filters.js', root), 'utf8');
const entries = [...html.matchAll(/<article class="detail-card press-card" data-media-language="([^"]+)" data-media-topics="([^"]+)" data-media-format="([^"]+)">([\s\S]*?)<\/article>/g)];

function app() {
  const fields = ['language', 'topic', 'format'].map(() => ({value: 'all'}));
  const cards = entries.map(([,mediaLanguage,mediaTopics,mediaFormat]) => ({dataset:{mediaLanguage,mediaTopics,mediaFormat},hidden:false}));
  const groups = [cards.slice(0,7), cards.slice(7)].map(children => ({children,hidden:false,contains:card=>children.includes(card)}));
  const handlers = {}, form = {hidden:true,addEventListener:(type,callback)=>{handlers[type]=callback;}}, result = {}, empty = {hidden:true};
  const nodes = {'media-filters':form,'media-results':result,'media-empty':empty};
  fields.forEach((field,index)=>{nodes['media-'+['language','topic','format'][index]]=field;});
  const document = {getElementById:id=>nodes[id],querySelectorAll:selector=>selector==='[data-media-language]'?cards:groups};
  vm.runInNewContext(code, {document});
  return {fields,cards,groups,handlers,form,result,empty};
}

test('media library contains all 12 legacy entries and one verified English profile', () => {
  assert.equal(entries.length,13);
  for (const url of ['nashaniva.com/346625','nashaniva.com/327900','youtu','bTn2yMBUBG0','8n55Zgr8SaI','news.zerkalo.io/life/64426.html','charter97.org/ru/news/2016/10/19/228176/','gay-refugee-belarus-hollywood/']) assert.ok(html.includes(url), url);
  assert.match(html, /paid audience work for Rockin’ Eve with Ryan Seacrest/);
  assert.doesNotMatch(html,/A Belarusian creator in an American series/);
});
test('legacy URLs, jump anchors, genuine images and boundaries remain explicit', () => {
  for (const id of ['main','public-work','creative-cultural-work','bio','themes','interviews','articles','music','contact']) assert.ok(html.includes(`id="${id}"`));
  for(const [,url] of html.matchAll(/src="(\/[^"?]+)(?:\?[^" ]*)?"/g)) assert.ok(existsSync(new URL(url.slice(1),root)),url);
  assert.match(html,/7\.5 years of LGBTQ\+ communications and community outreach/);
  assert.match(html,/Welcomed into the Refugee Storytellers Collective community in September 2026/);
  assert.match(html,/English written profile/);
  assert.match(html,/pre-order/);
  assert.doesNotMatch(html,/winner\.png|cutout-1|crop-20|keynotes|Stanford researcher|professional speaker for 7\.5/);
});
test('all entries visible initially; controls enabled only after successful setup', () => {
  const a=app();assert.equal(a.form.hidden,false);assert.equal(a.cards.filter(c=>!c.hidden).length,13);assert.equal(a.empty.hidden,true);assert.equal(a.result.textContent,'13 of 13 original-source entries.');
  assert.match(html, /id="media-filters" hidden/);
});
test('language, topic and format combine as AND filters', () => {
  const a=app();a.fields[0].value='en';a.fields[1].value='lgbtq';a.fields[2].value='video';a.handlers.change();
  const visible=a.cards.filter(c=>!c.hidden);assert.equal(visible.length,1);assert.equal(visible[0].dataset.mediaLanguage,'en');assert.equal(visible[0].dataset.mediaFormat,'video');assert.equal(a.groups[1].hidden,true);
});
test('zero results are explicit; reset restores all cards and both groups', () => {
  const a=app();a.fields[0].value='ru';a.fields[2].value='audio';a.handlers.change();assert.equal(a.cards.filter(c=>!c.hidden).length,0);assert.equal(a.empty.hidden,false);assert.ok(a.groups.every(g=>g.hidden));
  a.handlers.reset();assert.equal(a.cards.filter(c=>!c.hidden).length,13);assert.equal(a.empty.hidden,true);assert.ok(a.groups.every(g=>!g.hidden));assert.deepEqual(a.fields.map(f=>f.value),['all','all','all']);
});
test('Belarusian audio is discoverable and native details provide working themes', () => {
  const a=app();a.fields[0].value='be';a.fields[2].value='audio';a.handlers.change();assert.equal(a.cards.filter(c=>!c.hidden).length,1);
  assert.equal((html.match(/<details>/g)||[]).length,5);
  assert.match(html,/Marketing &amp; creative strategy/);
  assert.ok(html.includes('aria-label="On this page"'));
});
test('brand typography and the specific Ocean Grey cover are preserved', () => {
  const css = readFileSync(new URL('styles-speaking.css', root), 'utf8');
  assert.doesNotMatch(html, /family=Inter/);
  assert.doesNotMatch(css, /font-inter/);
  assert.match(css, /font-family:var\(--brand-display\)/);
  assert.match(html, /src="\/assets\/press\/ray-ocean-grey\.jpg" width="2048" height="2048"/);
  assert.doesNotMatch(html, /folio-02-vinyl\.webp/);
});
test('the sourced longer story is collapsed and separate from the short bio', () => {
  const story = html.match(/<details class="speaking-longer-story">([\s\S]*?)<\/details>/)?.[1];
  assert.ok(story);
  assert.match(story, /The longer story: displacement, support, and rebuilding/);
  assert.match(story, /via Mexico, spent nearly a month in detention, and was granted asylum in 2024/);
  assert.match(story, /Human Rights First helped connect him with pro bono counsel at Cooley LLP/);
  assert.match(story, /https:\/\/nashaniva\.com\/ru\/339284/);
  assert.match(story, /https:\/\/www\.humanrightsfirst\.org\/library\/never-lose-yourself-how-music-helped-sergey-reclaim-his-future/);
  assert.doesNotMatch(story, /released him|release from detention|legal advice/);
  assert.doesNotMatch(html, /<details class="speaking-longer-story" open/);
});
