import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script=path.join(root,'scripts/finalize-seo.py');
function run(dir){return spawnSync('python3',[script,'--artifact',dir],{encoding:'utf8'});}
function fixture(fn){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-seo-'));
 const put=(p,s)=>{fs.mkdirSync(path.dirname(path.join(dir,p)),{recursive:true});fs.writeFileSync(path.join(dir,p),s);};
 const page=url=>`<!doctype html><head><link rel="canonical" href="${url}"></head><body>KEEP</body>`;
 const base='https://sergey-ulyanov.pro';
 put('index.html',page(base+'/'));put('hire/index.html',page(base+'/hire/'));
 put('research/index.html',page('https://research.sergey-ulyanov.pro/'));
 put('private/index.html',page(base+'/private/')+'<meta name="robots" content="noindex,follow">');
 put('redirect/index.html',page(base+'/redirect/')+'<meta http-equiv="refresh" content="0;url=/">');
 for(const route of ['actor-final','actor-final-preview','actor-preview','actor-preview-v2']){
  put(route+'/index.html','<h1>ARCHIVED ACTOR</h1>');put(route+'/part-2.html','OLD WORK');put(route+'/styles.css','keep css');
 }
 put('sitemap.xml','<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/','/hire/','/research/','/actor-final/','/private/','/redirect/','/missing/'].map(p=>`<url><loc>${base+p}</loc><lastmod>2026-09-10</lastmod></url>`).join('')+'</urlset>');
 try{fn(dir);}finally{fs.rmSync(dir,{recursive:true,force:true});}
}
test('published legacy actor HTML redirects without altering professional pages or assets',()=>fixture(dir=>{
 assert.ok(fs.existsSync(script),'Missing SEO artifact finalizer');
 const before=fs.readFileSync(path.join(dir,'index.html'),'utf8');const r=run(dir);assert.equal(r.status,0,r.stderr);
 assert.equal(fs.readFileSync(path.join(dir,'index.html'),'utf8'),before);
 for(const route of ['actor-final','actor-final-preview','actor-preview','actor-preview-v2']){
  const html=fs.readFileSync(path.join(dir,route,'index.html'),'utf8');
  assert.match(html,/<link rel="canonical" href="https:\/\/heyitissergey.com\/">/);
  assert.match(html,/<meta http-equiv="refresh" content="0;url=https:\/\/heyitissergey.com\/">/);
  assert.ok(!html.includes('ARCHIVED ACTOR'));assert.ok(!html.includes('noindex'));
  assert.equal(fs.readFileSync(path.join(dir,route,'styles.css'),'utf8'),'keep css');
  let target;
  const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(js,{URL,location:{search:'?utm_source=test&next=https://evil.example',hash:'#credits',replace:v=>target=v}});
  assert.equal(new URL(target).origin,'https://heyitissergey.com');assert.equal(new URL(target).hash,'#work');
  assert.equal(new URL(target).searchParams.get('utm_source'),'test');
  const fragment=fs.readFileSync(path.join(dir,route,'part-2.html'),'utf8');assert.ok(fragment.includes('https://heyitissergey.com/#work'));
 }
}));
test('published sitemap retains only existing canonical indexable professional URLs',()=>fixture(dir=>{
 assert.ok(fs.existsSync(script),'Missing SEO artifact finalizer');
 const r=run(dir);assert.equal(r.status,0,r.stderr);
 const xml=fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8');
 assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),['https://sergey-ulyanov.pro/','https://sergey-ulyanov.pro/hire/']);
 assert.match(xml,/<lastmod>2026-09-10<\/lastmod>/);
 const again=run(dir);assert.equal(again.status,0,again.stderr);assert.equal(fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8'),xml);
}));
test('finalizer refuses to operate on source repository',()=>{
 assert.ok(fs.existsSync(script),'Missing SEO artifact finalizer');
 const r=run(root);assert.notEqual(r.status,0);assert.match(r.stderr,/source repository/);
});
