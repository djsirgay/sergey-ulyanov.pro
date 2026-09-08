/*
 * Modern orientation points, not historical city locations or state affiliations.
 * Coordinates: GeoNames Belarus country extract, CC BY 4.0.
 * See city-source.md for selection, attribution and limitations.
 */
(() => {
  'use strict';

  const records = [
    {id:'minsk', name:['Minsk / Mensk','Мінск / Менск'], point:[27.56653,53.90019], major:true, geonameId:625144, sourceName:'Minsk', sourceUpdated:'2025-11-01'},
    {id:'brest', name:['Brest','Брэст'], point:[23.71749,52.10894], major:true, geonameId:629634, sourceName:'Brest', sourceUpdated:'2026-07-09'},
    {id:'hrodna', name:['Hrodna','Гродна'], point:[23.82887,53.6758], major:true, geonameId:627904, sourceName:'Hrodna', sourceUpdated:'2026-07-09'},
    {id:'homiel', name:['Homiel','Гомель'], point:[30.9754,52.4345], major:true, geonameId:627907, sourceName:"Homyel'", sourceUpdated:'2026-07-09'},
    {id:'viciebsk', name:['Viciebsk','Віцебск'], point:[30.2049,55.1904], major:true, geonameId:620127, sourceName:'Vitebsk', sourceUpdated:'2026-07-09'},
    {id:'mahiliou', name:['Mahiliou','Магілёў'], point:[30.34044,53.90876], major:true, geonameId:625665, sourceName:'Mahilyow', sourceUpdated:'2026-07-09'},
    {id:'polatsk', name:['Polatsk','Полацк'], point:[28.7856,55.4879], major:false, geonameId:623317, sourceName:'Polotsk', sourceUpdated:'2026-07-10'},
    {id:'turau', name:['Turau','Тураў'], point:[27.735,52.0683], major:false, geonameId:620676, sourceName:'Turaŭ', sourceUpdated:'2023-11-29'},
    {id:'pinsk', name:['Pinsk','Пінск'], point:[26.06726,52.12153], major:false, geonameId:623549, sourceName:'Pinsk', sourceUpdated:'2026-07-10'},
    {id:'baranavichy', name:['Baranavichy','Баранавічы'], point:[26.00775,53.13255], major:false, geonameId:630429, sourceName:'Baranovichi', sourceUpdated:'2026-07-10'},
    {id:'lida', name:['Lida','Ліда'], point:[25.29972,53.88333], major:false, geonameId:626081, sourceName:'Lida', sourceUpdated:'2026-07-10'},
    {id:'navahrudak', name:['Navahrudak','Навагрудак'], point:[25.8191,53.5942], major:false, geonameId:624785, sourceName:'Novogrudok', sourceUpdated:'2026-07-10'},
    {id:'slutsk', name:['Slutsk','Слуцк'], point:[27.54159,53.01522], major:false, geonameId:621741, sourceName:'Slutsk', sourceUpdated:'2026-07-10'},
    {id:'niasvizh', name:['Niasvizh','Нясвіж'], point:[26.67679,53.22186], major:false, geonameId:624700, sourceName:'Nesvizh', sourceUpdated:'2026-07-13'},
    {id:'mir', name:['Mir','Мір'], point:[26.467,53.4544], major:false, geonameId:625128, sourceName:'Mir', sourceUpdated:'2026-07-13'},
    {id:'barysau', name:['Barysau','Барысаў'], point:[28.505,54.2279], major:false, geonameId:630376, sourceName:'Barysaw', sourceUpdated:'2026-07-10'},
    {id:'orsha', name:['Orsha','Орша'], point:[30.40365,54.51362], major:false, geonameId:624079, sourceName:'Orsha', sourceUpdated:'2026-07-10'},
    {id:'mazyr', name:['Mazyr','Мазыр'], point:[29.21631,52.04162], major:false, geonameId:625324, sourceName:'Mazyr', sourceUpdated:'2026-07-10'},
    {id:'rechytsa', name:['Rechytsa','Рэчыца'], point:[30.3916,52.3617], major:false, geonameId:622794, sourceName:'Rechytsa', sourceUpdated:'2026-07-10'},
    {id:'pastavy', name:['Pastavy','Паставы'], point:[26.83263,55.11676], major:false, geonameId:623760, sourceName:'Pastavy', sourceUpdated:'2026-07-13'},
    {id:'braslau', name:['Braslau','Браслаў'], point:[27.05715,55.64387], major:false, geonameId:629640, sourceName:'Braslav', sourceUpdated:'2026-07-13'},
    {id:'maladzyechna', name:['Maladzyechna','Маладзечна'], point:[26.854,54.3167], major:false, geonameId:625625, sourceName:'Maladziečna', sourceUpdated:'2026-07-10'},
    {id:'smarhon', name:['Smarhon','Смаргонь'], point:[26.3957,54.4798], major:false, geonameId:621713, sourceName:'Smarhoń', sourceUpdated:'2026-07-10'},
    {id:'sapotskin', name:['Sapotskin','Сапоцкін'], point:[23.65657,53.83138], major:false, geonameId:621634, sourceName:'Sopotskin', sourceUpdated:'2026-07-13'},
    {id:'adelsk', name:['Adelsk','Адэльск'], point:[23.761,53.406], major:false, geonameId:624259, sourceName:'Adel’sk', sourceUpdated:'2012-01-18'}
  ];

  window.MAPA_CITIES = Object.freeze(records.map(record => Object.freeze({
    ...record,
    name: Object.freeze(record.name),
    point: Object.freeze(record.point),
    sourceURL: `https://www.geonames.org/${record.geonameId}/`
  })));

  window.MAPA_CITY_SOURCES = Object.freeze({
    provider: 'GeoNames',
    dataset: 'Belarus country extract (BY.zip / BY.txt)',
    retrievedOn: '2026-09-08',
    sourceURLs: Object.freeze([
      'https://download.geonames.org/export/dump/BY.zip',
      'https://download.geonames.org/export/dump/readme.txt',
      'https://www.geonames.org/'
    ]),
    license: 'CC BY 4.0',
    licenseURL: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: 'Modern place coordinates © GeoNames, CC BY 4.0; selected and labelled for MAPA.',
    coordinates: 'WGS84 decimal degrees; point is [longitude, latitude].',
    selection: '25 present-day places, including six regional-centre orientation points. Not a complete gazetteer.',
    labelPolicy: 'English-facing Belarusian transliterations and Belarusian display labels are editorial; sourceName preserves the source label.',
    limitation: 'Approximate modern orientation points only. They do not establish historical settlement positions, founding dates, state affiliation or the location of any person.'
  });
})();
