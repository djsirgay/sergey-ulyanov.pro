import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {transformResearchText} from '../scripts/build-research-domain.mjs';
const root=new URL('../',import.meta.url),file=new URL('research/context-help.js',root);
const source=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
const api=source?await import(file):{};
const requireAPI=()=>assert.equal(typeof api.helpFor,'function','Contextual static help must exist');

test('every existing project gets three relevant EN/BE steps, not a chat or a ranking claim',()=>{
 requireAPI();
 const cases=[['','home'],['atlas/mapa/','mapa'],['tools/unmute-the-archive/','passport'],['tools/unmute-the-archive/restoration/','audio'],['tools/unmute-the-archive/atlas/','music'],['atlas/','culture'],['protocol/','protocol'],['playground/dranik-meter/','dranik']];
 for(const [path,id]of cases)for(const lang of ['en','be']){
  const help=api.helpFor('/research/'+path,lang);
  assert.equal(help.id,id);assert.equal(help.steps.length,3);assert.ok(help.steps.every(s=>typeof s==='string'&&s.length>20));
  assert.match(help.href,/^\/research\//);assert.ok(help.href.includes('lang='+lang));
  assert.doesNotMatch(JSON.stringify(help),/CHUTNA|Чутна|Paca|Паца|AI assistant|verified results|гарантаваны/i);
 }
 assert.match(api.helpFor('/research/','en').steps.join(' '),/GUCHNA/);
 assert.match(api.helpFor('/research/','be').steps.join(' '),/Гучна/);
 assert.match(api.helpFor('/research/playground/dranik-meter/','be').steps.join(' '),/не.*здароў/);
});

test('helper defaults to English and uses only route plus explicitly selected UI language',()=>{
 requireAPI();
 assert.deepEqual(api.helpFor('/research/','unsupported'),api.helpFor('/research/','en'));
 assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket|\.value\b|location\.search|location\.hash|prompt\(/);
 assert.doesNotMatch(source,/weight\b|pancake-grams|getElementById\('(?:weight|query)'\)/);
});

test('every context guide targets an existing local page and actual anchor',()=>{
 requireAPI();
 for(const route of ['','atlas/mapa/','tools/unmute-the-archive/','tools/unmute-the-archive/restoration/','tools/unmute-the-archive/atlas/','atlas/','protocol/','playground/dranik-meter/']){
  const help=api.helpFor('/research/'+route,'en'),url=new URL(help.href,'https://example.test');
  const target=new URL(url.pathname.slice(1)+(url.pathname.endsWith('/')?'index.html':''),root);
  assert.ok(fs.existsSync(target),help.href);
  if(url.hash)assert.ok(fs.readFileSync(target,'utf8').includes('id="'+url.hash.slice(1)+'"'),help.href);
 }
});

test('domain and palette transforms preserve the same help routes and local stylesheet',async()=>{
 requireAPI();
 for(const mount of ['/','/palette-preview/white-red/']){
  const code=transformResearchText(source,'research/context-help.js',mount);
  const transformed=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  assert.equal(transformed.helpFor(mount+'atlas/mapa/','be').id,'mapa');
  assert.equal(transformed.helpFor(mount+'atlas/mapa/','be').href,mount+'help/?lang=be#mapa');
  assert.match(code,/context-help\.css/);
 }
});

function dom(){
 const all=[];let focus=null;
 class Element{
  constructor(tag){this.tagName=tag;this.children=[];this.attrs={};this.dataset={};this.events={};this.open=false;all.push(this);}
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='id')this.id=v;}
  getAttribute(k){return this.attrs[k];}
  addEventListener(type,fn){(this.events[type]||=[]).push(fn);}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=[...nodes];}
  focus(){focus=this;}
  showModal(){this.open=true;}
  close(){this.open=false;this.emit('close');}
  emit(type,extra={}){const event={preventDefault(){this.prevented=true;},...extra};for(const fn of this.events[type]||[])fn(event);return event;}
 }
 const document={documentElement:{lang:'en'},createElement:tag=>new Element(tag),getElementById:id=>all.find(e=>e.id===id),head:new Element('head'),body:new Element('body')};
 const observers=[];class Observer{constructor(fn){this.fn=fn;observers.push(this);}observe(){}}
 const win={location:{pathname:'/research/atlas/mapa/'},MutationObserver:Observer};
 return {document,win,all,observers,get focus(){return focus;}};
}

test('help is closed on mount, opens explicitly, Escape closes it and restores button focus',()=>{
 requireAPI();const ui=dom(),control=api.mountResearchHelp({document:ui.document,window:ui.win});
 assert.equal(control.dialog.open,false);assert.equal(control.button.attrs['aria-expanded'],'false');
 assert.equal(control.button.attrs['aria-controls'],control.dialog.id);
 assert.equal(control.dialog.attrs['aria-labelledby'],'research-context-help-title');
 control.button.emit('click');assert.equal(control.dialog.open,true);assert.equal(control.button.attrs['aria-expanded'],'true');
 const cancel=control.dialog.emit('cancel');assert.equal(cancel.prevented,true);assert.equal(control.dialog.open,false);assert.equal(ui.focus,control.button);
 control.button.emit('click');control.closeButton.emit('click');assert.equal(control.dialog.open,false);assert.equal(ui.focus,control.button);
});

test('repeated mount is idempotent and language updates use no form inputs or stored data',()=>{
 requireAPI();const ui=dom();const one=api.mountResearchHelp({document:ui.document,window:ui.win});
 api.mountResearchHelp({document:ui.document,window:ui.win});
 assert.equal(ui.document.body.children.length,1);
 ui.document.documentElement.lang='be';ui.observers.forEach(o=>o.fn());
 assert.match(one.button.textContent,/Дапамога/);
 assert.match(ui.document.getElementById('research-context-help-title').textContent,/мап[ау]/i);
 assert.equal(one.dialog.open,false);
});

test('minimal shared loader and Dranik opt-in do not import the entire navigation into the miniapp',()=>{
 requireAPI();
 const nav=fs.readFileSync(new URL('research/navigation.js',root),'utf8');
 const meter=fs.readFileSync(new URL('research/playground/dranik-meter/meter.js',root),'utf8');
 assert.match(nav,/import\('\.\/context-help\.js'\)/);
 assert.match(meter,/from '\.\.\/\.\.\/context-help\.js'/);
 assert.doesNotMatch(meter,/import.*navigation\.js/);
 const css=fs.readFileSync(new URL('research/context-help.css',root),'utf8');
 assert.match(css,/max-height:.*dvh/);assert.match(css,/overflow-y:auto/);
 assert.match(css,/:focus-visible/);assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(css,/animation:/);
});
