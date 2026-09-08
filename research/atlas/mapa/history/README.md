# Historical territory layers · MAPA independent edition

Prepared 2026-09-08. These are regional political-territory snapshots, not the original MAPA drawings or a continuous chronology of Belarusian national borders.

## Geometry and reuse

Source: André Ourednik and the historical-basemaps contributors, https://github.com/aourednik/historical-basemaps

Pinned source revision: `62d8f1a03a71f2d3ff17f2d166f7553f256bce68`.

The seven historical GeoJSON files are adapted under GNU GPL version 3. The complete license is supplied in `LICENSE-GPL-3.0.txt`. They remain openly available in editable GeoJSON form, with source URL, revision, modification date and original NAME/SUBJECTO/PARTOF/BORDERPRECISION fields. No warranty is provided. The attribution applies to the dataset, not an endorsement of this website.

Changes: clipped polygons to 12–40°E, 46–61°N; rounded coordinate storage to five decimal places; removed nonessential upstream fields. Rounding is a storage decision, NOT a claim of historical positional accuracy. `build-data.mjs` reproduces the adaptation from the pinned source and is itself offered under GPL-3.0-only. Reproduction requires Node 20+ and internet access. The source files are listed in `manifest.json`.

The contemporary Belarus reference is separate Natural Earth 1:50m public-domain data, https://www.naturalearthdata.com/about/terms-of-use/. It is only displayed when the reader enables the explicitly labeled modern overlay. It is never substituted for a historical map.

## Available snapshots

| Year | Highlight | Interpretation and limitations |
| --- | --- | --- |
| 1500 | Poland-Lithuania (upstream spelling) | Combined Poland / Grand Duchy of Lithuania region; NOT a separately resolved GDL polygon or the post-1569 Commonwealth. |
| 1700 | Polish–Lithuanian Commonwealth | Generalized regional extent, not Great Northern War front lines. |
| 1800 | Russian Empire | After the partitions; empire clipped to the regional window, not a Belarusian national territory. |
| 1914 | Russian Empire | Pre-WWI regional political extent; western geometry differs from 1800. |
| 1938 | USSR and Poland | Interwar external state boundaries; Belarusian SSR internal boundary is absent. |
| 1945 | USSR and Poland | Generalized postwar arrangement, not exact day-by-day treaty changes or internal SSR limits. |
| 1994 | Byelarus (upstream spelling) | Independent Belarus; this is a dataset snapshot, NOT its date of independence (1991). |

The source itself describes its boundaries as a work in progress, intended for continental/global mapping and requiring comparison with other sources before academic use. Our regional clipping does not improve original historical accuracy. The numeric BORDERPRECISION field is retained for traceability but not presented as our certification of a border.

## Screening and unresolved coverage

Basic source checks used Minsk, Brest, Viciebsk/Vitebsk, Vilnius, Homiel/Gomel and Smolensk as spot checks, alongside comparison with the historical chronology in Zsolt Bottlik, *Historical, cultural and ethnic roots*, in *Belarus in Maps*: https://hungarian-geography.hu/inmaps/pdf/Belarus-in-Maps_39.pdf . This is a screening exercise, not specialist cartographic validation of every vertex or neighboring territory.

Excluded candidates include:

- 1279/1300: the source assigns Minsk and Brest to a polygon named Ryazan. We did not silently redraw the medieval frontier.
- 1783: an observed Vitebsk assignment does not follow the first-partition chronology. No fabricated correction was inserted.
- 1930: the source White Russia polygon includes Smolensk; this was not relabeled as a reliable Belarusian SSR boundary.
- 1650: the source's Smolensk assignment does not match the pre-1654 chronology.
- 1530: the source assigns Smolensk to the Nogai Horde. The 1500 regional layer is used instead, with its combined Poland–Lithuania grouping explicitly explained.

Still missing: medieval principalities, the complete partition sequence, BNR territorial claims, and the internal BSSR changes of 1919–1946. Dates are discrete source snapshots. The player steps between them without morphing or interpolating hypothetical intermediate borders. No precise historical area measurements are claimed.

The highlighted polity can extend outside the map frame. It is not a claim that Poland, Lithuania, Russia, the USSR and Belarus are interchangeable names for one nation. The separate event-and-place explorer uses a modern orientation map and is labeled accordingly.

## Original MAPA

Original concept and design: Alexey Cherenkevich; front-end: Yauhen Shpileuski; texts/translations: Hanna Shyrayeva; management: Viktar Yakunin; advice: Pavel Kedzich. The creator documents 63 changing boundary states from 1240 onward: https://blog.cherenkevich.com/blog/mapa-process/ . This independent edition does not reproduce those protected drawings, code, full database or illustrations. The original creators have not endorsed it.
