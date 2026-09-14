import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const base=new URL('../research/playground/dranik-meter/',import.meta.url);
const api=existsSync(new URL('share-card.js',base))?await import(new URL('share-card.js',base)):{};
function model(input={}){
 assert.equal(typeof api.createShareCardModel,'function','The calculator exposes a local share-card model');
 return api.createShareCardModel({pancakes:1400,lang:'en',format:'post',...input});
}
test('post and story exports have exact high-resolution dimensions',()=>{
 assert.deepEqual([model().width,model().height],[1080,1350]);
 assert.deepEqual([model({format:'story'}).width,model({format:'story'}).height],[1080,1920]);
});
test('the export contains count and a fixed public link, never entered weight or a personalized URL',()=>{
 const m=model({weight:70,unit:'kg'});
 assert.equal(m.count,'1,400');
 assert.equal(m.url,'https://research.sergey-ulyanov.pro/dranik/');
 assert.equal('weight' in m,false);assert.equal('unit' in m,false);
 assert.equal(new URL(m.url).search,'');assert.equal(new URL(m.url).hash,'');
 assert.match(m.assumption,/50/);
});
test('all three export languages have nonjudgmental copy and invalid results cannot be exported',()=>{
 for(const lang of ['en','be','ru']){const m=model({lang});assert.ok(m.headline&&m.noun&&m.joke&&m.makeYours);}
 for(const pancakes of [0,-1,NaN,Infinity,20001])assert.throws(()=>model({pancakes}),/invalid-result/);
 assert.throws(()=>model({format:'banner'}),/invalid-format/);
});
test('a share cancellation never triggers a surprise download; unsupported sharing uses the download fallback',async()=>{
 assert.equal(typeof api.sharePreparedCard,'function','Prepared PNGs can be explicitly shared without waiting for rendering');
 const file=new File(['fixture'],'dranik-meter-post.png',{type:'image/png'});let downloads=0;
 const fallback=()=>downloads++;
 assert.equal(await api.sharePreparedCard(file,{navigator:{},download:fallback}),'downloaded');assert.equal(downloads,1);
 assert.equal(await api.sharePreparedCard(file,{navigator:{canShare:()=>true,share:async()=>{throw Object.assign(new Error(),{name:'AbortError'});}},download:fallback}),'cancelled');
 assert.equal(downloads,1);
 let data;
 assert.equal(await api.sharePreparedCard(file,{navigator:{canShare:()=>true,share:async value=>{data=value;}},download:fallback}),'shared');
 assert.deepEqual(data,{files:[file]});assert.equal(downloads,1);
});
test('drawing sets the actual canvas size; PNG export requests PNG and rejects a missing encoder result',async()=>{
 assert.equal(typeof api.drawShareCard,'function','Share composition draws to a local canvas');
 assert.equal(typeof api.cardToPng,'function','Canvas export is available');
 const calls=[];const ctx=new Proxy({measureText:text=>({width:text.length*15})},{get:(o,k)=>k in o?o[k]:(...args)=>calls.push([k,...args]),set:(o,k,v)=>(o[k]=v,true)});
 const canvas={getContext:()=>ctx,toBlob(callback,type){assert.equal(type,'image/png');callback(new Blob(['png-fixture'],{type}));}};
 api.drawShareCard(canvas,model({format:'story'}));
 assert.deepEqual([canvas.width,canvas.height],[1080,1920]);
 assert.ok(calls.some(([method,text])=>method==='fillText'&&String(text).includes('1,400')));
 const linkRows=calls.filter(([method,text])=>method==='fillText'&&/research\.sergey|\/dranik\//.test(text));
 assert.equal(linkRows.length,2);
 assert.ok(linkRows.every(([,text,x,y])=>y+24<=1920-240),'The Story link stays above the bottom app-control area');
 assert.equal((await api.cardToPng(canvas)).type,'image/png');
 await assert.rejects(api.cardToPng({toBlob:fn=>fn(null)}),/png-export-failed/);
});
test('share controls disclose manual Instagram publishing and deriving weight from the count',()=>{
 const html=readFileSync(new URL('index.html',base),'utf8');
 for(const id of ['share-preview','share-post','share-story','download-card','share-card','copy-link'])assert.ok(html.includes(`id="${id}"`),id);
 const source=['share-card.js','share-interface.js','meter.js'].map(file=>existsSync(new URL(file,base))?readFileSync(new URL(file,base),'utf8'):'').join('\n');
 assert.doesNotMatch(source,/localStorage|sessionStorage|indexedDB|sendBeacon|\bfetch\s*\(|XMLHttpRequest|WebSocket/);
 assert.match(source,/link sticker/i);assert.match(source,/approximate weight/i);
});
test('the approved illustration and weight icon remain real raster layers without aspect-ratio distortion',()=>{
 const images=[],ctx=new Proxy({measureText:text=>({width:text.length*12}),drawImage:(...args)=>images.push(args)},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 const illustration={width:413,height:253},weightIcon={width:30,height:33};
 api.drawShareCard({getContext:()=>ctx},model(),{image:illustration,weightIcon});
 assert.equal(images.length,2);assert.equal(images[1][0],weightIcon);
 for(const [image,x,y,width,height] of images)assert.ok(Math.abs(width/height-image.width/image.height)<1e-8);
});

const ui=existsSync(new URL('share-interface.js',base))?await import(new URL('share-interface.js',base)):{};
test('the share interface has complete EN/BE/RU copy, including Belarusian format names',()=>{
 assert.deepEqual(Object.keys(ui.shareMessages),['en','be','ru']);
 for(const lang of ['be','ru'])assert.deepEqual(Object.keys(ui.shareMessages[lang]),Object.keys(ui.shareMessages.en));
 assert.match(ui.shareMessages.be.post,/Допіс/);
});
function sharePage(){
 const nodes=Object.fromEntries(['share-tools','share-preview','share-status','share-post','share-story','download-card','share-card','copy-link','make-link'].map(id=>[id,{id,events:{},attrs:{},hidden:false,disabled:false,textContent:'',width:0,height:0,addEventListener(n,fn){this.events[n]=fn;},setAttribute(k,v){this.attrs[k]=v;}}]));
 const doc={getElementById:id=>nodes[id],querySelectorAll:()=>[]};
 const win={navigator:{},File};
 return {nodes,doc,win};
}
test('clearing or changing results invalidates pending previews so the wrong personal result cannot be shared',async()=>{
 assert.equal(typeof ui.mountShareTools,'function','The share preview responds to the current in-memory result');
 const p=sharePage(),pending=[];
 const sharing=ui.mountShareTools(p.doc,p.win,{render:(_canvas,m)=>new Promise(resolve=>pending.push({m,resolve}))});
 sharing.update({ok:true,pancakes:1400},'en');assert.equal(p.nodes['download-card'].disabled,true);
 sharing.update(null,'en');pending[0].resolve(new Blob(['old'],{type:'image/png'}));
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(p.nodes['share-tools'].hidden,true);assert.equal(p.nodes['download-card'].disabled,true);
 sharing.update({ok:true,pancakes:1600},'be');pending[1].resolve(new Blob(['new'],{type:'image/png'}));
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(p.nodes['download-card'].disabled,false);assert.equal(p.nodes['share-tools'].hidden,false);
 p.nodes['share-story'].events.click();assert.equal(pending[2].m.format,'story');
 assert.equal(p.nodes['download-card'].disabled,true);
});
