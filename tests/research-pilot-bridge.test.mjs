import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {buildResearchDomain} from '../scripts/build-research-domain.mjs';
import {buildPalettePreview,PREVIEW_PATH} from '../scripts/build-research-palette-preview.mjs';

const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.existsSync(path.join(root,'research/unmute-pilot',name))?fs.readFileSync(path.join(root,'research/unmute-pilot',name),'utf8'):'';

test('old pilot entry explains the move with an explicit invitation-only link and same-origin recovery',()=>{
 const html=read('index.html');
 assert.match(html,/<h1[^>]*>GUCHNA/);
 assert.match(html,/href="https:\/\/unmute\.sergey-ulyanov\.pro\/login\/\?lang=en"/);
 assert.match(html,/invitation/);
 assert.match(html,/href="\.\/legacy\.html\?lang=en#collection"/);
 assert.match(html,/href="\.\/legacy\.html\?lang=en#study"/);
 assert.match(html,/same browser/);
 assert.match(html,/not transferred automatically/);
 assert.match(html,/Гучна/);
});

test('entry is noindex and starts no old app, media, model, redirect or remote request',()=>{
 const html=read('index.html'),script=read('bridge.js');
 assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive">/);
 assert.match(html,/connect-src 'none'/);
 assert.match(html,/frame-src 'none'/);
 assert.match(html,/referrer[^>]+no-referrer/);
 assert.deepEqual([...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(x=>x[1]),['./bridge.js']);
 assert.doesNotMatch(html,/unmute-runtime|wasm|app\.js|iframe|http-equiv="refresh"/i);
 assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|WebSocket|Worker\(|import\(|localStorage|sessionStorage|\.assign\(|\.replace\(/);
});

function runBridge(href){
 const content={dataset:{bridgeText:'title'},textContent:'GUCHNA · Belarusian Music Search'};
 const links=['login','collection','study','back','home'].map(type=>({dataset:{bridgeLink:type},href:''}));
 const languages=['en','be'].map(lang=>({dataset:{bridgeLang:lang},attrs:{},setAttribute(k,v){this.attrs[k]=v;}}));
 const document={documentElement:{lang:'en'},querySelectorAll(selector){return selector==='[data-bridge-text]'?[content]:selector==='[data-bridge-link]'?links:selector==='[data-bridge-lang]'?languages:[];}};
 const source=read('bridge.js');assert.ok(source,'bridge language controller exists');
 vm.runInNewContext(source,{document,location:new URL(href),URL,URLSearchParams});
 return {document,content,links,languages};
}

for(const [given,wanted] of [['','en'],['?lang=be','be'],['?lang=en','en'],['?lang=ru','en'],['?lang=XX','en']]){
 test('bridge language is bounded; '+(given||'no parameter')+' opens '+wanted,()=>{
  const state=runBridge('https://research.sergey-ulyanov.pro/unmute-pilot/'+given+'#study?participant=OLD&q=private');
  assert.equal(state.document.documentElement.lang,wanted);
  assert.equal(state.links[0].href,'https://unmute.sergey-ulyanov.pro/login/?lang='+wanted);
  assert.equal(state.links[1].href,'./legacy.html?lang='+wanted+'#collection');
  assert.equal(state.links[2].href,'./legacy.html?lang='+wanted+'#study');
  assert.equal(state.languages.find(x=>x.dataset.bridgeLang===wanted).attrs['aria-current'],'true');
  if(wanted==='be')assert.match(state.content.textContent,/Гучна/);
 });
}

test('no incoming query or fragment is carried to the new service',()=>{
 const {links}=runBridge('https://sergey-ulyanov.pro/research/unmute-pilot/?lang=be&q=private&participant=OLD&token=DO-NOT-FORWARD#collection?secret=hidden');
 for(const link of links)assert.doesNotMatch(link.href,/private|OLD|token|DO-NOT|secret|hidden/);
 assert.equal(links[0].href,'https://unmute.sergey-ulyanov.pro/login/?lang=be');
});

test('legacy recovery retains the app shell and a clear non-testing back banner',()=>{
 const html=read('legacy.html'),app=read('app.js');
 assert.match(html,/content="noindex,nofollow,noarchive"/);
 assert.match(html,/src="\.\/app\.js"/);
 assert.match(html,/id="app"/);
 assert.match(html,/id="listening-dock"/);
 assert.match(html,/id="toast"/);
 assert.match(html,/not the current test/);
 assert.match(html,/не для цяперашняга тэставання/);
 assert.match(html,/href="\.\/\?lang=en"/);
 assert.match(app,/const APP_BASE=location\.pathname\.endsWith\('\/legacy\.html'\)\?location\.pathname:new URL\('\.\/',import\.meta\.url\)\.pathname;/);
});

test('legacy reading and feedback export do not alter stored old records',async()=>{
 assert.ok(read('legacy.html'),'the recovery entry must exist before data access');
 const {LIBRARY_KEY,readLibrary}=await import('../research/unmute-pilot/library.js');
 const {STUDY_HISTORY_KEY,studyHistoryExport}=await import('../research/unmute-pilot/study.js');
 const entries=new Map([[LIBRARY_KEY,JSON.stringify({version:1,active:'old',collections:[{id:'old',title:'Prior collection',ids:['first','second']}]})],[STUDY_HISTORY_KEY,JSON.stringify([{version:2,code:'P01',task:'own-need',round:'baseline',prototypeVersion:'old-build',query:'old query',comment:'Keep this note',consent:true}])]]);
 const before=JSON.stringify([...entries]);
 const storage={getItem:key=>entries.get(key)??null,setItem(){assert.fail('recovery must not write')},removeItem(){assert.fail('recovery must not erase')}};
 assert.equal(readLibrary(storage,{ids:[],title:''}).collections[0].title,'Prior collection');
 assert.equal(JSON.parse(studyHistoryExport(storage,'P01')).observations[0].comment,'Keep this note');
 assert.equal(JSON.stringify([...entries]),before);
});

test('real domain and both palettes keep bridge, legacy assets and noindex boundaries',t=>{
 assert.ok(read('legacy.html'),'the recovery entry must exist before export');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'research-bridge-test-'));
 t.after(()=>fs.rmSync(temp,{recursive:true,force:true}));
 const output=path.join(temp,'site');
 buildResearchDomain({sourceRoot:root,outputDirectory:output});
 buildPalettePreview({sourceRoot:root,siteDirectory:output});
 for(const prefix of ['',PREVIEW_PATH.slice(1)]){
  const directory=path.join(output,prefix,'unmute-pilot');
  for(const name of ['index.html','bridge.js','bridge.css','legacy.html','app.js','library.js','study.js'])assert.ok(fs.existsSync(path.join(directory,name)),prefix+name);
  assert.match(fs.readFileSync(path.join(directory,'index.html'),'utf8'),/https:\/\/unmute\.sergey-ulyanov\.pro\/login\/\?lang=en/);
  assert.doesNotMatch(fs.readFileSync(path.join(directory,'index.html'),'utf8'),/src="\.\/app\.js"/);
  for(const file of ['index.html','legacy.html'])assert.match(fs.readFileSync(path.join(directory,file),'utf8'),/content="noindex,nofollow,noarchive"/);
  assert.doesNotMatch(fs.readFileSync(path.join(output,prefix,'sitemap.xml'),'utf8'),/unmute-pilot/);
 }
});
