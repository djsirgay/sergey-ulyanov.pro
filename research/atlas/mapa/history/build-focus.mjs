// SPDX-License-Identifier: GPL-3.0-only
// 2026-09-08: exact polygon intersections with a fixed modern reference area.
// These are derived display areas, NOT historical borders of a Belarusian state.
import {readFile,writeFile} from 'node:fs/promises';
import polygonClipping from './vendor/polygon-clipping.cjs';
const dir=new URL('./',import.meta.url),years=[1700,1914,1938,1945,1994];
const modern=JSON.parse(await readFile(new URL('belarus-reference.geojson',dir),'utf8'));
const reference=modern.features[0].geometry.coordinates;
const coordinateArea=multi=>multi.reduce((sum,poly)=>sum+poly.reduce((sub,ring,i)=>sub+(i?-1:1)*Math.abs(ring.slice(1).reduce((area,p,n)=>area+ring[n][0]*p[1]-p[0]*ring[n][1],0))/2,0),0);
for(const year of years){
 const source=JSON.parse(await readFile(new URL(`world_${year}.geojson`,dir),'utf8'));
 const features=[];
 for(const feature of source.features){
  const intersection=polygonClipping.intersection(reference,feature.geometry.coordinates);
  if(!intersection.length)continue;
  const ratio=coordinateArea(intersection)/coordinateArea(reference);
  features.push({type:'Feature',properties:{...feature.properties,displayFraction:ratio,comparisonScope:'Intersection with the contemporary Belarus reference; not the original polity extent.'},geometry:{type:'MultiPolygon',coordinates:intersection}});
 }
 const coverage=polygonClipping.union(...features.map(f=>f.geometry.coordinates));
 const unmatched=polygonClipping.difference(reference,coverage);
 const data={type:'FeatureCollection',name:`Political territories within contemporary Belarus reference, ${year}`,license:'GPL-3.0-only',attribution:source.attribution,upstream:source.upstream,revision:source.revision,modified:'2026-09-08',method:'Boolean polygon intersection; polygon-clipping 0.15.7 (MIT). No invented historical dividing lines. The modern reference is only a constant comparison window.',reference:'belarus-reference.geojson',accuracy:'Original source precision is unchanged. Small edge slivers may result from dataset alignment, not historical territorial claims. Display fractions are planar diagnostic ratios, NOT historical area estimates.',unmatchedGeometry:{type:'MultiPolygon',coordinates:unmatched},features};
 await writeFile(new URL(`focus_${year}.geojson`,dir),JSON.stringify(data));
 console.log(year,features.map(f=>`${f.properties.NAME}: ${(100*f.properties.displayFraction).toFixed(4)}%`).join(' | '));
}
