import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('both current sites are present in the canonical source branch',()=>{
  assert.ok(fs.existsSync(path.join(root,'actor-final/index.html')),'Latest actor source must not exist only on gh-pages');
  const actor=read('actor-final/index.html');
  for(const text of ['Snapchat','Intuit TurboTax · The Tax Breakup','Wife Wife','Sara Werner','xgd7Q4ECHSE'])assert.ok(actor.includes(text),'Actor regression: '+text);
  assert.equal((actor.match(/class="project-card"/g)||[]).length,8);
  assert.ok(read('index.html').includes('Four views. One body of work.'));
  assert.ok(read('index.html').includes('Ideas into'));
  assert.ok(!read('index.html').includes('document.write'));
});

test('actor build is self-contained and does not mutate professional or actor sources',()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'actor-build-'));
  const output=path.join(temp,'site');
  const sourceFiles=['index.html','site.js','styles-1.css','press/index.html','actor-final/index.html'];
  const before=sourceFiles.map(read);
  try{
    const result=spawnSync(process.execPath,[path.join(root,'actor-final/build.mjs'),'--out',output],{cwd:root,encoding:'utf8',env:{...process.env,VERCEL_ENV:'preview'}});
    assert.equal(result.status,0,result.stderr||result.stdout);
    assert.deepEqual(sourceFiles.map(read),before);
    const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
    assert.ok(html.includes('Snapchat'));
    assert.ok(html.includes('Intuit TurboTax · The Tax Breakup'));
    assert.ok(html.includes('href="https://heyitissergey.com/"'));
    assert.ok(!html.includes('https://sergey-ulyanov.pro/actor-final/'));
    assert.ok(!html.includes('Ideas into'));
    for(const forbidden of ['research','hire','work','press','site-fragments','build.mjs','.github'])assert.ok(!fs.existsSync(path.join(output,forbidden)),forbidden+' leaked into actor artifact');
    assert.ok(fs.existsSync(path.join(output,'styles-v15.css')));
    assert.ok(fs.existsSync(path.join(output,'site.webmanifest')));
    const manifest=JSON.parse(fs.readFileSync(path.join(output,'deployment.json'),'utf8'));
    assert.equal(manifest.site,'heyitissergey.com');
    assert.match(manifest.homepageSha256,/^[a-f0-9]{64}$/);
    assert.ok(!fs.readFileSync(path.join(output,'robots.txt'),'utf8').includes('Disallow: /\n'));
    fs.writeFileSync(path.join(output,'sentinel.txt'),'keep');
    const again=spawnSync(process.execPath,[path.join(root,'actor-final/build.mjs'),'--out',output],{encoding:'utf8',env:{...process.env,VERCEL_ENV:'preview'}});
    assert.notEqual(again.status,0,'Must refuse an occupied output');
    assert.equal(fs.readFileSync(path.join(output,'sentinel.txt'),'utf8'),'keep');
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
});

test('actor production build rejects an obsolete Git branch',()=>{
  const result=spawnSync(process.execPath,[path.join(root,'actor-final/build.mjs')],{encoding:'utf8',env:{...process.env,VERCEL_ENV:'production',VERCEL_GIT_COMMIT_REF:'gh-pages'}});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/production.*main/i);
});

test('actor hosting has a local build and isolated output',()=>{
  const config=JSON.parse(read('actor-final/vercel.json'));
  assert.equal(config.buildCommand,'node build.mjs');
  assert.equal(config.outputDirectory,'dist');
  assert.equal(config.framework,null);
});
