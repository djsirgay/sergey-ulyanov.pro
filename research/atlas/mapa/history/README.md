# Belarusian lands through time · independent MAPA edition

Reviewed 2026-09-08. Seven approximate mapped snapshots, a separately sourced political chronology, and a separate ten-event place explorer. This is a partial independent edition, not a recovery of the original 63-state MAPA. Map years, chronology stages, and location checks are different data types; adding cities does not create more dated boundaries.

## What the map answers

“Which states governed lands inside the borders of contemporary Belarus?” The same white modern Belarus outline remains visible. It is a **comparison window**, not a historic border, an ethnic homeland, or a claim that Belarus existed as a state in every era. Historical country polygons are intersected with this window; the Polish–Soviet division in 1938 is an actual geometric division. Wider-state geometry is optional context.

The default is 1938. Location controls test a present-day point against the displayed polygons and show a dated result. Modern place names are orientation labels, not a claim that each city existed under that name in that year. The source does not separately resolve the Grand Duchy within a Polish–Lithuanian grouping or the Belarusian SSR within the USSR. GDL/BSSR labels explain local political identity; they are not newly digitized internal boundaries.

## Data, methods and licenses

Historical source: [André Ourednik and contributors, Historical Basemaps](https://github.com/aourednik/historical-basemaps), revision `62d8f1a03a71f2d3ff17f2d166f7553f256bce68`. Source files were clipped to 12–40°E, 46–61°N by `build-data.mjs`. The collection's `manifest.json` distinguishes `displayedYears` from the larger stored input set; world files for 1500 and 1800 remain audit inputs, **not selectable maps**. `snapshot-audit.json` records the added 1492/1600 frames, historical context, three-language name guidance and screened alternatives.

Run `node build-data.mjs` to acquire missing source inputs. By default it preserves reviewed local data and the existing modern reference; a deliberate `--refresh` re-fetches them. It rejects cached historical data whose recorded revision differs from the pinned source. Run `node build-focus.mjs` to reproduce the seven `focus_YEAR.geojson` files from stored regional data and `belarus-reference.geojson`. It performs polygon intersection, not hand-drawn dividing lines. `unmatchedGeometry` records uncovered areas. `displayFraction` is a planar diagnostic ratio, **not a historical area measurement**, and is not displayed in the interface.

Run `node audit-snapshots.mjs` for repeatable checks of the two additions: 19 present-day location coordinates per frame, source provenance, containment within the comparison window, and no silently dropped coverage. Passing point checks does **not** certify every boundary segment. Existing site regression tests additionally check the 1938 Polish–Soviet division and context-only routing.

Historical adaptations and scripts: GPL-3.0-only, license in `LICENSE-GPL-3.0.txt`. Editable GeoJSON retains original names, affiliation and precision fields, source revision and modification date. This is not a guarantee of historical accuracy or an endorsement by contributors.

Build dependency: polygon-clipping 0.15.7, published distribution from https://unpkg.com/polygon-clipping@0.15.7/dist/polygon-clipping.umd.js with line endings normalized to LF; no functional changes. MIT license in `vendor/LICENSE-polygon-clipping.md`; build-only distribution in `vendor/polygon-clipping.cjs`. It is not executed by site visitors.

Modern reference: [Natural Earth 1:50m, public domain](https://www.naturalearthdata.com/about/terms-of-use/). Modern and historical datasets do not align perfectly. Unvetted fragments remain neutral and hatched rather than assigned to invented historical enclaves. Clipping does not improve original historical precision.

## Displayed snapshots

| Year | Affiliation shown | Limit |
| --- | --- | --- |
| 1492 | Grand Duchy of Lithuania; dynastic relations with Poland | Source combines Poland and Lithuania. It cannot show their internal dividing line. After Casimir IV's death, different Jagiellonian brothers ruled the two realms; do not label the entire year a personal union or the later Commonwealth. |
| 1600 | Grand Duchy within the Polish–Lithuanian Commonwealth | After the 1569 Union of Lublin. The source's `Poland-Llituania` typo is retained in data but normalized in UI. Unresolved eastern fragments remain neutral. |
| 1700 | Grand Duchy within the Commonwealth | Country-level polygon, not Great Northern War front lines or a separate GDL boundary. |
| 1914 | Russian imperial framework | Prewar snapshot; not occupation or front lines. |
| 1938 | Polish Republic / Soviet Union, with BSSR context | International division only; internal Soviet republic borders are absent. |
| 1945 | Soviet Union, with BSSR context | Generalized postwar settlement, not every local adjustment. |
| 1994 | Independent Republic of Belarus | Independence occurred in 1991; this is the available source map year. |

The added early frames follow the political sequence discussed in *Belarus in Maps* (Hungarian Academy of Sciences, 2017): [territorial history, pp. 20–23](https://hungarian-geography.hu/inmaps/pdf/Belarus-in-Maps_17.pdf) and [historical roots, pp. 40–43](https://hungarian-geography.hu/inmaps/pdf/Belarus-in-Maps_39.pdf). The [Polish Commissioner for Civil Rights Protection historical collection](https://bip.brpo.gov.pl/pliki/12289971420.pdf) explains the 1492 separation of rulers. Temushev's Homiel study below establishes the later 1500 transfer and sixteenth-century return. These scholarly references contextualize the licensed polygons; their maps/artwork were not copied into the app.

## Names are not unreviewed source strings

Original `NAME`, `PARTOF` and `SUBJECTO` fields remain unchanged for reproducibility. Display names must be interpreted by year, not copied mechanically. Examples:

- `Poland-Lithuania` in 1492 is a combined source grouping, not a polygon of the GDL alone and not the post-1569 Commonwealth.
- `Prussia` in 1600 is the Duchy of Prussia. In 1700, Brandenburg–Prussia is the appropriate composite label; the royal title dates to 1701. See [German Historical Institute](https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/growth-of-brandenburg-prussia-1600-1795).
- `Austrian Empire` in 1700 must not appear as that later state: use Habsburg Monarchy. The imperial title was created in [1804, as documented by the Schönbrunn Palace historical project](https://www.habsburger.net/en/events/foundation-empire-austria-1804).
- `Tsardom of Muscovy` is a scholarly term, not inherently an anachronism; `Tsardom of Russia` is another appropriate display name. Neither means the Russian Empire before 1721.
- A Crimean Khanate `SUBJECTO=Ottoman Empire` entry does not make the khanate an ordinary Ottoman province. Dependence, composite monarchy, sovereign union, constituent republic and military occupation must stay distinct.
- The 1914 regional `Finland` label is expanded to **Grand Duchy of Finland · Russian Empire**, rather than presenting Finland as an independent state. The source geometry is left intact. See [Finnish Government: history and buildings](https://valtioneuvosto.fi/en/history-and-buildings) and [thisisFINLAND: historical outline](https://finland.fi/life-society/main-outlines-of-finnish-history/).

## Interface checks in this revision

Country names are a persistent SVG layer, separate from the place markers. The seven map years and 28 historical stages share a selector. Each map has a plain-language affiliation answer, named clickable legend, 25 present-day place markers, a place selector and an affiliation table. Small labels yield to country names; every place remains accessible in the selector and table.

The interface preserves the selected year, language, place and region mode in shareable URLs. Integration tests cover Back navigation, context-only routes, failed fetches and retry, late responses, playback cancellation and restart, and stable keyboard focus in the place table. A text chronology is never presented as an implemented border map.

## Excluded geometry and corrections

- **1500**: Homiel passed to Moscow during that year. The undated annual source cannot establish which side of the transition its near-total GDL fill describes. Excluded and retained as a context-only chronology stage. Reference: [Viktor Temushev, Homiel Land, NAS Belarus Institute of History, 2009, pp. 5–6](https://gulevich.net/statiy.files/temushev_gomel.files/Temushev-Gomel.pdf).
- **1800**: the source assigns Sapoćkin to Russia although a small western part of modern Belarus was Prussian from 1795 to 1807. Excluded rather than hiding a known misassignment behind a general caveat.
- **1807** is not a uniform transfer of all that western area to Russia. Białystok/Adelsk and Sapoćkin followed different paths. See the 1807 and 1815 chronology stages and their State Archive / census / local historical sources.
- **1400**: the source's Poland–Lithuania grouping has the contradictory `PARTOF=Riazan`; not offered.
- **1920**: the source includes `USSR` before the Soviet Union's creation in 1922 and a White Russia outline that does not resolve dated military and republic changes; not offered.
- Other rejected candidates: 1279/1300 assigns Minsk and Brest to Ryazan; 1783 fails the first-partition Viciebsk check; 1930's White Russia polygon includes Smolensk; 1650 and 1530 have inappropriate Smolensk assignments. No correction was invented.
- **Continuity candidates not added merely to increase the count:** 1715 (Commonwealth), 1880/1900 (Russian Empire), 1960 (USSR), 2000/2010 (independent Belarus). Point checks do not establish an additional useful political division in these frames. The 1815 source also lacks the internal Congress Poland boundary needed to explain the western exception accurately.

These are screening findings, not certification of every vertex. The seven retained frames remain approximate regional data. Edge areas require more detailed cartography. Do not use polygons as legal, cadastral or fine-grained academic boundary evidence. Remaining partition, occupation and internal-republic stages need separately licensed, date-specific geometry; increasing the list by relabeling a nearby snapshot would not implement them.

## Chronology and routes

`../chronology.js` contains independently written EN/BE entries and sources. These distinguish state membership, union membership, internal-republic changes, declarations, invasions/occupation, and independence. A declaration is never colored as effective control of the entire country.

Context routes include `?stage=riga-1921#chronology`, `?stage=independence-1991#chronology` and `?year=1939#chronology`. Known context-only years open that exact context, without substitute polygons. An arbitrary unavailable year receives a visible notice and an explicitly dated 1938 default. Explicit map navigation canonicalizes the URL to the displayed year. Play steps only between available source maps; it never invents intermediate borders.

The chronology explains unmapped stages. It is **not equivalent to implementing their historical borders**. The medieval sequence, every partition line, dated occupation zones and internal BSSR changes remain unmapped.

## Original MAPA credit

Original idea/design: Alexey Cherenkevich; front-end: Yauhen Shpileuski; texts/translations: Hanna Shyrayeva; management: Viktar Yakunin; advice: Pavel Kedzich. The creator describes [63 boundary states from 1240](https://blog.cherenkevich.com/blog/mapa-process/). This edition uses independent code/context and separately licensed geometry. It does not reproduce the original protected drawings, code, full database or illustrations. No approval, partnership or endorsement by the original team is claimed.
