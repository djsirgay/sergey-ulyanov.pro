# Modern place coordinates for MAPA

This source note covers only `places.js`. These are modern orientation points, not historical boundaries or evidence of historical jurisdiction.

## Source and attribution

- Provider: [GeoNames](https://www.geonames.org/).
- Extract: [Belarus country data, BY.zip](https://download.geonames.org/export/dump/BY.zip), containing `BY.txt`; retrieved on 8 September 2026.
- Schema and licence declaration: [GeoNames gazetteer readme](https://download.geonames.org/export/dump/readme.txt).
- Licence: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).
- Attribution to display when using these points: **Modern place coordinates © GeoNames, CC BY 4.0; selected and labelled for MAPA.**

GeoNames supplies WGS84 latitude and longitude in fields 5 and 6 of its tab-delimited country file. `places.js` reverses their storage order to the map's `[longitude, latitude]` convention without rounding or otherwise moving the coordinates.

The country extract is a changing source, not a permanently versioned release. Each selected record preserves its stable `geonameId`, source label, per-record modification date, and individual source URL. `sourceUpdated` is the GeoNames record's last modification date; it is not the date on which MAPA verified a location.

## Selection

The 25 places are a deliberately bounded orientation set, not all Belarusian cities. Six places receive `major: true`: Minsk, Brest, Hrodna, Homiel, Viciebsk and Mahiliou. This flag controls visual prominence; it is not an assertion about historical status. Minsk is included as the national capital and regional-centre orientation point even though its present-day city administration is separate from Minsk Region.

Only populated-place records (`feature class P`) were selected. Homonyms were resolved using GeoNames feature codes, administrative-region fields and the populated-place identity, rather than taking the first name match:

- Homiel: `627907` (regional centre), not the smaller place `627906` in Viciebsk Region.
- Hrodna: `627904` (regional centre), not `8538405`.
- Baranavichy: `630429` (Brest Region administrative centre), not `630424` or `7930953`.
- Rechytsa: `622794` (Homiel Region administrative centre), not the other places named Rechytsa.
- Mir: `625128` (Hrodna Region), not `8145087` in Brest Region.
- Orsha: `624079` (administrative-centre populated place), not the additional `Horad Orsha` locality record `828890`.

## Names and limits

`name` contains `[English-facing display name, Belarusian display name]`. English-facing names are editorial Belarusian transliterations, not a claim to reproduce a single official English naming standard. `sourceName` keeps the exact GeoNames primary label for traceability and can also be used as a search alias. The additional Mensk/Менск label is an editorial alternate name, not a separate location.

The coordinates identify approximate modern places. They must not imply that a modern city already existed in an earlier selected year, identify a medieval settlement site, locate a person, or certify a historic frontier. Political affiliation, when shown, comes from separately documented historical data and must retain that data's uncertainty. Near-border locations such as Sapotskin and Adelsk especially require historical source checks rather than treating a modern point-in-polygon result as historical proof.

No population figures or personal information are included. The GeoNames dataset itself is supplied without a warranty of accuracy, timeliness or completeness.

## Module contract

- `window.MAPA_CITIES`: frozen array of 25 frozen records. Every `name` and `point` array is also frozen. Existing map consumers can continue using `id`, `name` and `point`; `major`, `geonameId`, `sourceName`, `sourceUpdated` and `sourceURL` provide display and provenance metadata.
- `window.MAPA_CITY_SOURCES`: frozen source/licence metadata, including a frozen `sourceURLs` list.
- This module does not attach itself to the page, fetch data, draw labels, assign political affiliation or publish anything. Load it before the consumer script when integrating it.
