// SPDX-License-Identifier: GPL-3.0-only
// Regional adaptation of André Ourednik and contributors' historical-basemaps.
// Modified 2026-09-08: clip to the display window, retain provenance and source fields.
// Run with Node 20+: node research/atlas/mapa/history/build-data.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const revision='62d8f1a03a71f2d3ff17f2d166f7553f256bce68';
const years=[1492,1500,1600,1700,1800,1914,1938,1945,1994];
const displayedYears=[1492,1600,1700,1914,1938,1945,1994];
// Preserve reviewed local inputs by default. --refresh deliberately re-fetches them.
const refresh=process.argv.includes('--refresh');
const bounds=[12,46,40,61];
const directory=new URL('./',import.meta.url);
await mkdir(directory,{recursive:true});
function clipRing(input){
  let ring=input.slice();
  for(const [axis,value,greater] of [[0,bounds[0],true],[0,bounds[2],false],[1,bounds[1],true],[1,bounds[3],false]]){
    const result=[];if(!ring.length)return [];
    const inside=p=>greater?p[axis]>=value:p[axis]<=value;
    for(let i=0;i<ring.length;i++){
      const a=ring[(i+ring.length-1)%ring.length],b=ring[i],ain=inside(a),bin=inside(b);
      if(ain!==bin){const ratio=(value-a[axis])/(b[axis]-a[axis]);result.push([a[0]+ratio*(b[0]-a[0]),a[1]+ratio*(b[1]-a[1])])}
      if(bin)result.push(b);
    }ring=result;
  }
  const cleaned=ring.map(p=>p.map(n=>Math.round(n*1e5)/1e5)).filter((p,i,a)=>i===0||p[0]!==a[i-1][0]||p[1]!==a[i-1][1]);
  if(cleaned.length<3)return [];
  if(cleaned[0].some((v,i)=>v!==cleaned.at(-1)[i]))cleaned.push(cleaned[0]);
  const area=Math.abs(cleaned.slice(1).reduce((sum,p,i)=>sum+cleaned[i][0]*p[1]-p[0]*cleaned[i][1],0));
  return area>0.00001?cleaned:[];
}
function clipped(geometry){
  const polys=(geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates).map(poly=>{
    const outer=clipRing(poly[0]);if(!outer.length)return null;
    return [outer,...poly.slice(1).map(clipRing).filter(r=>r.length)];
  }).filter(Boolean);
  return polys.length?{type:'MultiPolygon',coordinates:polys}:null;
}
const states=[];
for(const year of years){
  const source=`https://raw.githubusercontent.com/aourednik/historical-basemaps/${revision}/geojson/world_${year}.geojson`;
  if(!refresh){
    const stored=await readFile(new URL(`world_${year}.geojson`,directory),'utf8').then(JSON.parse).catch(error=>{if(error.code==='ENOENT')return null;throw error});
    if(stored){
      if(stored.revision!==revision||stored.upstream!==source)throw Error(`${year}: cached provenance differs; inspect before replacing`);
      states.push({year,source,featureCount:stored.features.length});
      continue;
    }
  }
  const response=await fetch(source);if(!response.ok)throw Error(`${year}: ${response.status}`);
  const original=await response.json();
  const features=original.features.map(f=>{
    const geometry=clipped(f.geometry);if(!geometry)return null;
    const properties=Object.fromEntries(['NAME','SUBJECTO','PARTOF','BORDERPRECISION'].filter(k=>k in f.properties).map(k=>[k,f.properties[k]]));
    return {type:'Feature',properties,geometry};
  }).filter(Boolean);
  const data={type:'FeatureCollection',name:`Regional historical snapshot ${year}`,license:'GPL-3.0-only',attribution:'André Ourednik and historical-basemaps contributors',upstream:source,revision,modification:'Clipped to 12–40°E / 46–61°N; coordinates rounded to five decimal places. Display precision remains approximate, not five-decimal historical accuracy.',modified:'2026-09-08',features};
  await writeFile(new URL(`world_${year}.geojson`,directory),JSON.stringify(data));
  states.push({year,source,featureCount:features.length});
}
const existingReference=await readFile(new URL('belarus-reference.geojson',directory),'utf8').catch(error=>{if(error.code==='ENOENT')return null;throw error});
if(refresh||!existingReference){
  const response=await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson');
  if(!response.ok)throw Error(`Modern reference: ${response.status}`);
  const modern=await response.json();
  const belarus=modern.features.find(f=>f.properties.ADMIN==='Belarus');
  await writeFile(new URL('belarus-reference.geojson',directory),JSON.stringify({type:'FeatureCollection',license:'public domain',source:'https://www.naturalearthdata.com/about/terms-of-use/',purpose:'Explicitly contemporary orientation overlay, not historical territory.',features:[{type:'Feature',properties:{NAME:'Belarus — contemporary reference'},geometry:clipped(belarus.geometry)}]}));
}
const existingLicense=await readFile(new URL('LICENSE-GPL-3.0.txt',directory),'utf8').catch(error=>{if(error.code==='ENOENT')return null;throw error});
if(refresh||!existingLicense){
  const response=await fetch(`https://raw.githubusercontent.com/aourednik/historical-basemaps/${revision}/LICENSE`);
  if(!response.ok)throw Error(`License: ${response.status}`);
  await writeFile(new URL('LICENSE-GPL-3.0.txt',directory),await response.text());
}
await writeFile(new URL('manifest.json',directory),JSON.stringify({revision,bounds,years:states,displayedYears,excludedStoredYears:[1500,1800],audit:'snapshot-audit.json',license:'GPL-3.0-only',source:'https://github.com/aourednik/historical-basemaps',limitations:'Selected regional state snapshots, not continuous annual data, internal GDL/SSR boundaries, or historical national/ethnic territories.'},null,2));
console.log(JSON.stringify({snapshots:states,bounds}));
