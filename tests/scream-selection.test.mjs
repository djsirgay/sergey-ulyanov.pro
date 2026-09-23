import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');

test('SCREAM case distinguishes the five works created from one selected gallery work',()=>{
 const html=read('case-studies/scream-7-complex/index.html');
 assert.match(html,/Five-piece campaign-art series · one work selected/);
 assert.match(html,/Official competition winner: “IN PROGRESS\.”/);
 assert.match(html,/One work, “IN PROGRESS,” was selected for the official Los Angeles gallery exhibition from the five-piece series I created/);
 assert.match(html,/<b>5<\/b>\s*<span>distinct but connected visual directions/);
 assert.match(html,/<b>1 selected<\/b>\s*<span>“IN PROGRESS” chosen for the gallery/);
 assert.doesNotMatch(html,/The five works were presented|A coherent series selected for exhibition/);
});

test('case metadata and work/hire summaries do not claim that all five pieces were selected',()=>{
 const html=read('case-studies/scream-7-complex/index.html');
 for(const name of ['description','og:description','twitter:description']){
  const meta=html.match(new RegExp('<meta (?:name|property)="'+name+'" content="([^"]+)"'))?.[1];
  assert.ok(meta?.includes('IN PROGRESS'));
  assert.match(meta,/five-work/);
 }
 for(const path of ['work/index.html','hire/index.html']){
  const page=read(path);
  assert.match(page,/“IN PROGRESS” selected for the official Los Angeles gallery exhibition from a five-work series/);
  assert.doesNotMatch(page,/Five suspense-driven (?:visual )?directions selected/);
 }
 const evidence=read('evidence/index.html');
 assert.match(evidence,/“IN PROGRESS” was selected from the original five-work series/);
 assert.doesNotMatch(evidence,/Exhibited visual series/);
});
