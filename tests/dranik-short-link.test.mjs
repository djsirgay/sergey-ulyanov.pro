import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {transformResearchText} from '../scripts/build-research-domain.mjs';
import {CANONICAL_METER_URL} from '../research/playground/dranik-meter/share-card.js';
const root=new URL('../',import.meta.url);
test('share cards use the short address, without body mass or personal parameters',()=>assert.equal(CANONICAL_METER_URL,'https://research.sergey-ulyanov.pro/dranik/'));
test('short entry preserves only language and an ordinary section in both palettes',()=>{
 const html=fs.readFileSync(new URL('research/dranik/index.html',root),'utf8');
 assert.match(html,/noindex/);assert.match(html,/href="\/research\/playground\/dranik-meter\/"/);
 const original=fs.readFileSync(new URL('research/dranik/redirect.js',root),'utf8');
 for(const mount of ['/','/palette-preview/white-red/']){
  const source=transformResearchText(original,'research/dranik/redirect.js',mount);
  let destination;
  vm.runInNewContext(source,{URL,location:{href:'https://research.sergey-ulyanov.pro'+mount+'dranik/?lang=be&weight=99#main',replace:value=>destination=value}});
  assert.equal(destination,mount+'playground/dranik-meter/?lang=be#main');
 }
});
