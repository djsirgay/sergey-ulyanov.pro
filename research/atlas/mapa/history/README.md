# Belarusian lands through time · independent MAPA edition

Reviewed 2026-09-08. Five approximate mapped snapshots, 26 political chronology stages, and a separate ten-event place explorer. This is a partial independent edition, not a recovery of the original 63-state MAPA.

## What the map answers

“Which states governed lands inside the borders of contemporary Belarus?” The same white modern Belarus outline remains visible. It is a **comparison window**, not a historic border, an ethnic homeland, or a claim that Belarus existed as a state in every era. Historical country polygons are intersected with this window; the Polish–Soviet division in 1938 is an actual geometric division. Wider-state geometry is optional context.

The default is 1938. City buttons test a present-day point against the displayed polygons and show a dated result. Modern place names are orientation labels, not a claim that each city existed under that name in that year. The source resolves international country boundaries, not internal Belarusian SSR borders. BSSR appears as political context, not a separately digitized polygon.

## Data, methods and licenses

Historical source: [André Ourednik and contributors, Historical Basemaps](https://github.com/aourednik/historical-basemaps), revision `62d8f1a03a71f2d3ff17f2d166f7553f256bce68`. Source files were clipped to 12–40°E, 46–61°N by `build-data.mjs`. The first-stage collection's `manifest.json` includes subsequently excluded years; world files for 1500 and 1800 remain audit inputs, **not selectable maps**.

Run `node build-focus.mjs` to reproduce the five `focus_YEAR.geojson` files from stored regional data and `belarus-reference.geojson`. It performs polygon intersection, not hand-drawn dividing lines. `unmatchedGeometry` records uncovered areas. `displayFraction` is a planar diagnostic ratio, **not a historical area measurement**, and is not displayed in the interface.

Historical adaptations and scripts: GPL-3.0-only, license in `LICENSE-GPL-3.0.txt`. Editable GeoJSON retains original names, affiliation and precision fields, source revision and modification date. This is not a guarantee of historical accuracy or an endorsement by contributors.

Build dependency: polygon-clipping 0.15.7, published distribution from https://unpkg.com/polygon-clipping@0.15.7/dist/polygon-clipping.umd.js with line endings normalized to LF; no functional changes. MIT license in `vendor/LICENSE-polygon-clipping.md`; build-only distribution in `vendor/polygon-clipping.cjs`. It is not executed by site visitors.

Modern reference: [Natural Earth 1:50m, public domain](https://www.naturalearthdata.com/about/terms-of-use/). Modern and historical datasets do not align perfectly. Unvetted fragments remain neutral and hatched rather than assigned to invented historical enclaves. Clipping does not improve original historical precision.

## Displayed snapshots

| Year | Affiliation shown | Limit |
| --- | --- | --- |
| 1700 | Grand Duchy within the Commonwealth | Country-level polygon, not Great Northern War front lines or a separate GDL boundary. |
| 1914 | Russian imperial framework | Prewar snapshot; not occupation or front lines. |
| 1938 | Polish Republic / Soviet Union, with BSSR context | International division only; internal Soviet republic borders are absent. |
| 1945 | Soviet Union, with BSSR context | Generalized postwar settlement, not every local adjustment. |
| 1994 | Independent Republic of Belarus | Independence occurred in 1991; this is the available source map year. |

## Excluded geometry and corrections

- **1500**: Homiel passed to Moscow during that year. The undated annual source cannot establish which side of the transition its near-total GDL fill describes. Excluded and retained as a context-only chronology stage. Reference: [Viktor Temushev, Homiel Land, NAS Belarus Institute of History, 2009, pp. 5–6](https://gulevich.net/statiy.files/temushev_gomel.files/Temushev-Gomel.pdf).
- **1800**: the source assigns Sapoćkin to Russia although a small western part of modern Belarus was Prussian from 1795 to 1807. Excluded rather than hiding a known misassignment behind a general caveat.
- **1807** is not a uniform transfer of all that western area to Russia. Białystok/Adelsk and Sapoćkin followed different paths. See the 1807 and 1815 chronology stages and their State Archive / census / local historical sources.
- Other rejected candidates: 1279/1300 assigns Minsk and Brest to Ryazan; 1783 fails the first-partition Viciebsk check; 1930's White Russia polygon includes Smolensk; 1650 and 1530 have inappropriate Smolensk assignments. No correction was invented.

These are screening findings, not certification of every vertex. The five retained frames remain approximate regional data. Edge areas require more detailed cartography. Do not use polygons as legal, cadastral or fine-grained academic boundary evidence.

## Chronology and routes

`../chronology.js` contains independently written EN/BE entries and sources. These distinguish state membership, union membership, internal-republic changes, declarations, invasions/occupation, and independence. A declaration is never colored as effective control of the entire country.

Context routes include `?stage=riga-1921#chronology`, `?stage=independence-1991#chronology` and `?year=1939#chronology`. Known context-only years open that exact context, without substitute polygons. An arbitrary unavailable year receives a visible notice and an explicitly dated 1938 default. Explicit map navigation canonicalizes the URL to the displayed year. Play steps only between available source maps; it never invents intermediate borders.

The chronology explains unmapped stages. It is **not equivalent to implementing their historical borders**. The medieval sequence, every partition line, dated occupation zones and internal BSSR changes remain unmapped.

## Original MAPA credit

Original idea/design: Alexey Cherenkevich; front-end: Yauhen Shpileuski; texts/translations: Hanna Shyrayeva; management: Viktar Yakunin; advice: Pavel Kedzich. The creator describes [63 boundary states from 1240](https://blog.cherenkevich.com/blog/mapa-process/). This edition uses independent code/context and separately licensed geometry. It does not reproduce the original protected drawings, code, full database or illustrations. No approval, partnership or endorsement by the original team is claimed.
