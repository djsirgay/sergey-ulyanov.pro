import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {transformResearchText} from '../scripts/build-research-domain.mjs';
const base=new URL('../',import.meta.url),read=file=>readFileSync(new URL(file,base),'utf8');
const html=read('research/index.html'),css=read('research/start.css');
const source='../design-runs/research-card-graphics-r8-20260913/target/winner.layerdoc.json.assets/';
const expected=['upscaled-region-45-a72616b9c24e.png','upscaled-region-50-6b84e0336ab1.png','upscaled-region-55-d1a3229d6f45.png','upscaled-region-60-734b9739e8c8.png','upscaled-region-65-26ab291ac3b3.png','upscaled-region-70-ba15352bf090.png'];
const cards=[...html.matchAll(/<a class="research-start-card"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>m[1]);

test('Six existing fully clickable cards receive their own approved raster, without flattening the two plus four hierarchy',()=>{
 assert.equal(cards.length,6);
 const groups=[...html.matchAll(/<div class="research-start-grid">([\s\S]*?)<\/div>/g)].map(m=>(m[1].match(/class="research-start-card"/g)||[]).length);
 assert.deepEqual(groups,[2,4]);
 const sources=cards.map((body,i)=>{const image=body.match(/<img\b[^>]*class="research-card-art"[^>]*>/)?.[0];assert.ok(image,`Card ${i+1} requires its own real image`);assert.match(image,/alt=""/);assert.match(image,/aria-hidden="true"/);assert.match(image,/loading="lazy"/);assert.match(image,/decoding="async"/);assert.match(image,/width="\d+" height="\d+"/);assert.ok(body.includes('<h3>'));assert.doesNotMatch(body,/<a\b|<button\b/);return image.match(/src="([^"]+)"/)[1];});
 assert.equal(new Set(sources).size,6);
 sources.forEach((url,i)=>{assert.equal(url,`/research/assets/card-art/${expected[i]}`);const file=new URL(url.slice(1),base);assert.ok(existsSync(file));const hash=x=>createHash('sha256').update(readFileSync(x)).digest('hex');assert.equal(hash(file),hash(new URL(source+expected[i],base)),'Ship the exact extracted raster, not a CSS reconstruction or an unrelated replacement');});
});

test('Card artwork is contained without overlays or animation, and both research palettes resolve the same assets',()=>{
 assert.match(css,/\.research-card-art\s*\{[^}]*object-fit:contain/);
 for(const mount of ['/','/palette-preview/white-red/']){
  const built=transformResearchText(html,'research/index.html',mount);
  for(const name of expected)assert.ok(built.includes(`src="${mount}assets/card-art/${name}"`));
 }
 assert.doesNotMatch(css,/\.research-card-art\s*\{[^}]*(?:opacity:\s*0\.[0-6]|mix-blend-mode)/);
});
