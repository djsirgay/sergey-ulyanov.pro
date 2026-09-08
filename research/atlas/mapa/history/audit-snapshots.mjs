// SPDX-License-Identifier: GPL-3.0-only
// Repeatable geometry checks for the two 2026-09-08 additions.
// These tests verify data consistency, not every historical boundary vertex.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import polygonClipping from './vendor/polygon-clipping.cjs';
const directory=new URL('./',import.meta.url);
const read=name=>readFile(new URL(name,directory),'utf8').then(JSON.parse);
const locations={
  Minsk:[27.5615,53.9023], Brest:[23.6877,52.0976], Hrodna:[23.8258,53.6694],
  Homiel:[30.9878,52.4345], Viciebsk:[30.2049,55.1904], Mahiliou:[30.3364,53.8981],
  Polatsk:[28.775,55.485], Orsha:[30.421,54.508], Pinsk:[26.096,52.121],
  Mazyr:[29.245,52.046], Lida:[25.302,53.892], Navahrudak:[25.824,53.596],
  Slutsk:[27.56,53.025], Sapockin:[23.6592,53.8297], Adelsk:[23.792,53.545],
  Braslau:[27.033,55.641], Pastavy:[26.83,55.116], Maladzechna:[26.838,54.309],
  Zhlobin:[30.023,52.893]
};
function inRing([x,y],ring){
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const [xi,yi]=ring[i],[xj,yj]=ring[j];
    if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
  }
  return inside;
}
const contains=(point,multi)=>multi.some(poly=>inRing(point,poly[0])&&!poly.slice(1).some(hole=>inRing(point,hole)));
const area=multi=>multi.reduce((sum,poly)=>sum+poly.reduce((part,ring,i)=>part+(i?-1:1)*Math.abs(ring.slice(1).reduce((a,p,n)=>a+ring[n][0]*p[1]-p[0]*ring[n][1],0))/2,0),0);
const reference=(await read('belarus-reference.geojson')).features[0].geometry.coordinates;
const audit=await read('snapshot-audit.json'),manifest=await read('manifest.json');
assert.deepEqual(manifest.displayedYears,audit.displayedYears);
let assertions=1;
for(const [year,name] of [[1492,'Poland-Lithuania'],[1600,'Poland-Llituania']]){
  const focus=await read(`focus_${year}.geojson`),regional=await read(`world_${year}.geojson`);
  assert.equal(focus.revision,audit.sourceRevision); assertions++;
  assert.match(focus.upstream,new RegExp(`world_${year}\\.geojson$`)); assertions++;
  const reviewed=focus.features.filter(f=>f.properties.NAME===name);
  assert.equal(reviewed.length,1); assertions++;
  for(const [location,point] of Object.entries(locations)){
    assert.ok(contains(point,reviewed[0].geometry.coordinates),`${year}: ${location} expected ${name}`); assertions++;
  }
  for(const feature of focus.features){
    assert.ok(area(polygonClipping.difference(feature.geometry.coordinates,reference))<1e-8,`${year}: fragment outside reference`); assertions++;
  }
  const coverage=polygonClipping.union(...focus.features.map(f=>f.geometry.coordinates),focus.unmatchedGeometry.coordinates);
  assert.ok(area(polygonClipping.difference(reference,coverage))<1e-8,`${year}: area dropped silently`); assertions++;
  assert.ok(area(polygonClipping.difference(coverage,reference))<1e-8,`${year}: coverage outside reference`); assertions++;
  assert.equal(regional.features.find(f=>f.properties.NAME===name).properties.NAME,name); assertions++;
  console.log(`${year}: ${Object.keys(locations).length} present-day location checks passed; original source name preserved; no dropped or invented comparison area.`);
}
console.log(`${assertions} assertions passed. Historical precision remains approximate; unreviewed edge fragments are not approved affiliations.`);
