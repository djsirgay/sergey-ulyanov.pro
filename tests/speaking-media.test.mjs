import {readFileSync, existsSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('press/index.html', root), 'utf8');
const code = readFileSync(new URL('press/media-filters.js', root), 'utf8');
const css = readFileSync(new URL('styles-speaking.css', root), 'utf8');
const attr = (text, name) => text.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || '';
const tokens = value => value.split(/\s+/).filter(Boolean);
const textContent = markup => markup.replace(/<[^>]*>/g, ' ').replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|nbsp|lt|gt);/gi, (whole, entity) => {
  if (entity.startsWith('#')) return String.fromCodePoint(entity[1].toLowerCase()==='x' ? parseInt(entity.slice(2),16) : parseInt(entity.slice(1),10));
  return {amp:'&',quot:'"',apos:"'",nbsp:' ',lt:'<',gt:'>'}[entity.toLowerCase()] || whole;
}).replace(/\s+/g,' ').trim();
const entries = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)].filter(([,attrs])=>attr(attrs,'data-media-language')).map(([markup,attrs,body])=>({
  markup,body,textContent:textContent(body),dataset:{mediaLanguage:attr(attrs,'data-media-language'),mediaTopics:attr(attrs,'data-media-topics'),mediaFormat:attr(attrs,'data-media-format')}
}));
const sections = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)].filter(([,attrs])=>tokens(attr(attrs,'class')).includes('speaking-media-group')).map(([,attrs,body])=>({id:attr(attrs,'id'),body}));
const declarations = selector => Object.fromEntries([...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([,selectors])=>selectors.split(',').map(s=>s.trim()).includes(selector)).flatMap(([, ,body])=>body.split(';').filter(s=>s.includes(':')).map(s=>{const colon=s.indexOf(':');return [s.slice(0,colon).trim(),s.slice(colon+1).trim()];})));

function app() {
  const fields = ['language', 'topic', 'format'].map(() => ({value: 'all'}));
  const search = {value:''};
  const cards = entries.map(entry => ({dataset:{...entry.dataset},textContent:entry.textContent,hidden:false}));
  const groups = sections.map(section => {const children=cards.filter((_,index)=>section.body.includes(entries[index].markup));return {id:section.id,children,hidden:false,contains:card=>children.includes(card)};});
  const handlers = {}, form = {hidden:true,addEventListener:(type,callback)=>{handlers[type]=callback;}}, result = {}, empty = {hidden:true};
  const nodes = {'media-filters':form,'media-results':result,'media-empty':empty,'media-search':search};
  fields.forEach((field,index)=>{nodes['media-'+['language','topic','format'][index]]=field;});
  const document = {getElementById:id=>nodes[id],querySelectorAll:selector=>selector==='[data-media-language]'?cards:groups};
  vm.runInNewContext(code, {document});
  return {fields,search,cards,groups,handlers,form,result,empty};
}

test('media library preserves selected coverage and adds eleven distinct archive groups', () => {
  assert.equal(entries.length,24);
  const a=app();assert.deepEqual(a.groups.map(g=>g.children.length),[7,6,11]);
  assert.equal(new Set(a.groups.flatMap(g=>g.children)).size,entries.length,'Every card belongs to a real library section');
  for (const url of ['nashaniva.com/346625','nashaniva.com/327900','youtu','bTn2yMBUBG0','8n55Zgr8SaI','news.zerkalo.io/life/64426.html','charter97.org/ru/news/2016/10/19/228176/','gay-refugee-belarus-hollywood/']) assert.ok(html.includes(url), url);
  assert.match(html, /paid audience work for Rockin’ Eve with Ryan Seacrest/);
  assert.doesNotMatch(html,/A Belarusian creator in an American series/);
  assert.doesNotMatch(html,/TeachBK|Laskatukhi/i);
  assert.ok(entries.some(e=>/Nasha Niva/i.test(e.textContent)&&/2015/.test(e.textContent)),'The Nasha Niva 2015 archive is included');
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
  const a=app();assert.equal(a.form.hidden,false);assert.equal(a.cards.filter(c=>!c.hidden).length,entries.length);assert.equal(a.empty.hidden,true);assert.equal(a.result.textContent,`${entries.length} of ${entries.length} media entries.`);
  assert.match(html, /id="media-filters" hidden/);
});
test('language, topic and format combine as AND filters', () => {
  const a=app();a.fields[0].value='en';a.fields[1].value='lgbtq';a.fields[2].value='video';a.handlers.change();
  const visible=a.cards.filter(c=>!c.hidden);assert.equal(visible.length,2);
  for(const card of visible){assert.ok(tokens(card.dataset.mediaLanguage).includes('en'));assert.ok(tokens(card.dataset.mediaTopics).includes('lgbtq'));assert.ok(tokens(card.dataset.mediaFormat).includes('video'));}
  assert.equal(a.groups[1].hidden,true);
});
test('zero results are explicit; reset clears search and restores all actual groups', () => {
  const a=app();a.fields[0].value='ru';a.search.value='__not-a-real-source_404__';a.handlers.input();assert.equal(a.cards.filter(c=>!c.hidden).length,0);assert.equal(a.empty.hidden,false);assert.ok(a.groups.every(g=>g.hidden));
  a.handlers.reset();assert.equal(a.cards.filter(c=>!c.hidden).length,entries.length);assert.equal(a.empty.hidden,true);assert.ok(a.groups.every(g=>!g.hidden));assert.deepEqual(a.fields.map(f=>f.value),['all','all','all']);assert.equal(a.search.value,'');
});
test('related Russian video conversations remain discoverable with video filter', () => {
  const a=app();a.fields[0].value='ru';a.fields[2].value='video';a.handlers.change();
  const visible=a.cards.filter(c=>!c.hidden);assert.ok(visible.length>=4);
  assert.ok(visible.every(c=>tokens(c.dataset.mediaFormat).includes('video')&&tokens(c.dataset.mediaLanguage).includes('ru')));
  for(const id of ['S8V_GCyhZRQ','LORfxNFFtfE','LGBxk5ojf9I']) assert.ok(html.includes(id));
  const gpress2025=entries.find(e=>e.body.includes('gpress.info/2025/02/04/'));
  assert.ok(gpress2025);
  assert.doesNotMatch(gpress2025.body,/S8V_GCyhZRQ|LORfxNFFtfE|LGBxk5ojf9I/,'The 2023 conversations are not falsely grouped as 2025 content');
});
test('Belarusian audio is discoverable and native details provide working themes', () => {
  const a=app();a.fields[0].value='be';a.fields[2].value='audio';a.handlers.change();assert.equal(a.cards.filter(c=>!c.hidden).length,1);
  const themes=html.match(/<div class="speaking-theme-list">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(themes);assert.equal((themes.match(/<details\b/g)||[]).length,5);
  assert.match(html,/Marketing &amp; creative strategy/);
  assert.ok(html.includes('aria-label="On this page"'));
});
test('multilingual articles appear under each supplied language without duplicate cards',()=>{
  const a=app(), bilingual=a.cards.find(c=>tokens(c.dataset.mediaLanguage).includes('en')&&tokens(c.dataset.mediaLanguage).includes('ru'));
  assert.ok(bilingual,'The bilingual SlavicSac profile has both language labels');
  for(const language of ['en','ru']){a.fields[0].value=language;a.handlers.change();assert.equal(bilingual.hidden,false);}
  a.fields[0].value='be';a.handlers.change();assert.equal(bilingual.hidden,true);
});
test('search matches all words, Unicode normalization, case and visible card text',()=>{
  const a=app();assert.equal(typeof a.handlers.input,'function');
  a.search.value='  SLAVICSAC   ＲＡＹ  ';a.handlers.input();
  const visible=a.cards.filter(c=>!c.hidden);assert.ok(visible.length>0);
  assert.ok(visible.every(c=>/slavicsac/i.test(c.textContent)&&/ray/i.test(c.textContent)));
  assert.equal(a.result.textContent,`${visible.length} of ${entries.length} media entries.`);
  a.search.value+=' __no_such_interview__';a.handlers.input();assert.equal(a.cards.filter(c=>!c.hidden).length,0);
});
test('search and dropdowns intersect; submit is handled without navigation',()=>{
  const a=app();a.fields[0].value='ru';a.fields[1].value='culture';a.fields[2].value='article';a.search.value='ray';
  let prevented=false;a.handlers.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);
  const visible=a.cards.filter(c=>!c.hidden);assert.ok(visible.length>0);
  assert.ok(visible.every(c=>tokens(c.dataset.mediaLanguage).includes('ru')&&tokens(c.dataset.mediaTopics).includes('culture')&&tokens(c.dataset.mediaFormat).includes('article')&&/ray/i.test(c.textContent)));
  for(const group of a.groups)assert.equal(group.hidden,!group.children.some(c=>!c.hidden));
});
test('plain Sergey search also finds the accented public spelling Sergéy',()=>{
  const a=app();a.search.value='Sergey';a.handlers.input();
  const visible=a.cards.filter(c=>!c.hidden);assert.ok(visible.length>0);
  assert.ok(visible.some(c=>c.textContent.includes('Sergéy')));
  assert.ok(visible.every(c=>(c.textContent+' '+c.dataset.mediaTopics).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().includes('sergey')));
});
test('brand typography and the specific Ocean Grey cover are preserved', () => {
  const css = readFileSync(new URL('styles-speaking.css', root), 'utf8');
  const home = readFileSync(new URL('site-fragments/00-head.html', root), 'utf8');
  const fontStylesheet = text => text.match(/<link href="(https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+)" rel="stylesheet">/)?.[1];
  assert.equal(fontStylesheet(html),fontStylesheet(home),'Speaking must load the same chosen brand fonts as the main site');
  assert.doesNotMatch(html, /family=Inter/);
  assert.doesNotMatch(css, /font-inter/);
  assert.match(css, /font-family:var\(--brand-display\)/);
  assert.match(html, /src="\/assets\/press\/ray-ocean-grey\.jpg" width="2048" height="2048"/);
  assert.doesNotMatch(html, /folio-02-vinyl\.webp/);
});
test('square sleeve is responsive without stretching its HTML intrinsic height', () => {
  const css = readFileSync(new URL('styles-speaking.css', root), 'utf8');
  const imageRules=[...css.matchAll(/\.speaking-release-artwork>img\{([^}]+)\}/g)].map(match=>match[1]);
  assert.ok(imageRules.length);
  const base=imageRules[0];
  for(const declaration of ['width:100%','max-width:100%','height:auto','aspect-ratio:1 / 1','object-fit:contain']) assert.ok(base.includes(declaration),declaration);
  for(const rule of imageRules) assert.doesNotMatch(rule,/(?:^|;)height:(?!auto(?:;|$))[^;]+/,'No breakpoint may restore a fixed intrinsic height');
  assert.match(css,/grid-template-columns:minmax\(0,\.8fr\) minmax\(0,1\.2fr\)/);
  assert.match(html,/styles-speaking\.css\?v=[^"\s]+/,'The stylesheet remains cache-versioned');
});
test('homepage typography and reachable mobile navigation remain deliberate',()=>{
  assert.equal(declarations('.press-page h1')['font-weight'],'700');
  assert.ok(parseFloat(declarations('.press-page .speaking-intro h1')['line-height'])<=1,'Display leading stays compact like the homepage');
  assert.equal(declarations('.speaking-eyebrow')['font-weight'],'400');
  assert.ok(parseFloat(declarations('.speaking-theme-list summary')['min-height'])>=44);
  assert.ok(parseFloat(declarations('.press-page .detail-nav-links>a')['min-height'])>=44);
  assert.ok(html.indexOf('class="speaking-jumps"')<html.indexOf('class="speaking-hero"'),'Section navigation appears before the long hero');
  const mobileContact=html.match(/<a\b[^>]*class="[^"]*speaking-mobile-contact[^>]*>/)?.[0];
  assert.ok(mobileContact);assert.equal(attr(mobileContact,'href'),'#contact');
  for(const [,hash] of html.matchAll(/<a href="(#[^"]+)">/g))assert.ok(html.includes(`id="${hash.slice(1)}"`),hash);
  assert.match(css,/prefers-reduced-motion\s*:\s*reduce/);
});
test('vinyl sleeve is a real store link, with correct album title and accessible motion', () => {
  const css = readFileSync(new URL('styles-speaking.css', root), 'utf8');
  const sleeve = html.match(/<a class="speaking-release-art"([\s\S]*?)<\/a>/)?.[1];
  assert.ok(sleeve);
  assert.match(sleeve,/href="https:\/\/www\.nostalgairecordz\.com\/releases\/ray-ocean-grey"/);
  assert.match(sleeve,/aria-label="Explore Sergéy — Ray \(10th Anniversary Edition\)/);
  assert.match(sleeve,/class="speaking-vinyl" aria-hidden="true"/);
  assert.match(sleeve,/src="\/assets\/press\/ray-ocean-grey.jpg"/);
  assert.match(html,/<h2>Ray <span class="speaking-album-subtitle">\(10th Anniversary Edition\)<\/span><\/h2>/);
  assert.match(html,/Ocean Grey · Original Edition · Vinyl LP/);
  assert.doesNotMatch(html,/<h2>RAY — Ocean Grey<\/h2>/);
  assert.match(css,/@media\(hover:none\)\{\.speaking-vinyl/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.speaking-vinyl\{transition:none/);
  assert.match(css,/\.speaking-release-art:focus-visible \.speaking-vinyl/);
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
