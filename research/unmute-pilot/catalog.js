// Metadata and our short editorial explanations only. No copied audio, lyrics or cover art.
// Separate works, versions, recording-language evidence and source-only recovery leads.
import {additionalCatalog} from './catalog-extra.js';
import {expandedCatalog,existingEmbeds} from './catalog-expanded.js';
import {round2Catalog} from './catalog-round2.js';
import {round3Catalog} from './catalog-round3.js';
const words=(en,ru,be)=>({en,ru,be});
const record=(id,title,artist,year,language,tags,listenUrl,sourceUrl,sourceName,summary,extra={})=>({id,title,artist,year,language,tags,listenUrl,listenLabel:listenUrl.includes('youtube')?'YouTube':'Bandcamp',sourceUrl,sourceName,summary,kind:'song',aliases:[],workId:id,checked:'2026-09-11',...extra});
export const catalog = [
  record('navi-historyja','Гісторыя майго жыцця','NAVIBAND',2017,'be',[],
    'https://www.youtube.com/watch?v=DMsJ2U6Nj4k','https://www.eurovision.com/eurovision-song-contest/kyiv-2017/participants/naviband-1/','Eurovision · artist’s official video',
    words('Belarusian on an international stage. NAVIBAND’s 2017 Eurovision entry is a starting point for hearing the language; this link opens the artist’s final-version lyric video, not a live performance.','Белорусский язык на международной сцене. Песня NAVIBAND для Eurovision 2017 — точка входа в звучание языка. Здесь финальная версия lyric video артиста, не концертная запись.','Беларуская мова на міжнароднай сцэне. Песня NAVIBAND для Eurovision 2017 — пункт уваходу ў гучанне мовы. Тут фінальная версія lyric video артыста, не канцэртны запіс.'),
    {aliases:['Historyja majho zyccia','Historyja majho žyccia','Гісторыя майго жыцця','история моей жизни','Еўрабачанне','Евровидение','Eurovision','нави','Навибэнд'],themes:['eurovision'],languageEvidence:'Artist-published Belarusian lyrics; official Eurovision entry page.',art:'sun'}),
  record('nizkiz-pravily','Правілы','NIZKIZ',2020,'be',[],
    'https://nizkiz.bandcamp.com/track/--32','https://nizkiz.bandcamp.com/track/--32','NIZKIZ · official Bandcamp',
    words('An original song released on 26 June 2020. The band’s page preserves the Belarusian lyrics alongside the recording. Its publication date is evidence; a specific genre or political meaning is not inferred here.','Оригинальная песня вышла 26 июня 2020. На странице группы белорусский текст сохранён вместе с записью. Мы указываем дату источника, не приписывая песне неподтверждённый жанр или политический смысл.','Арыгінальная песня выйшла 26 чэрвеня 2020. На старонцы гурта беларускі тэкст захаваны разам з запісам. Мы пазначаем дату, не прыпісваючы песні непацверджаны жанр ці палітычны сэнс.'),
    {aliases:['Pravily','Pravily','правила','нізкіз','низкиз'],languageEvidence:'Belarusian lyrics published by the band on this track page.',art:'lines'}),
  record('nurnberg-valasy','Valasy / Валасы','Nürnberg',2018,'be',['rock','post-punk','coldwave'],
    'https://nurnbergminsk.bandcamp.com/track/valasy','https://nurnbergminsk.bandcamp.com/track/valasy','Nürnberg · official Bandcamp',
    words('A song from Skryvaj, released on 5 November 2018. The artist pairs the Belarusian lyrics with English and Spanish translations — a helpful bridge for a new listener. This is the release track, not the separate demo versions.','Песня из Skryvaj, релиз 5 ноября 2018. Артист публикует белорусский текст вместе с английским и испанским переводами — удобный мост для нового слушателя. Это релизная запись, не отдельные демоверсии.','Песня са Skryvaj, рэліз 5 лістапада 2018. Артыст публікуе беларускі тэкст разам з англійскім і іспанскім перакладамі — зручны мост для новага слухача. Гэта рэлізны запіс, не асобныя дэмаверсіі.'),
    {aliases:['Nurnberg','Нюрнберг','валасы','волосы'],languageEvidence:'Belarusian lyrics with artist-provided EN/ES translations.',tagScope:'Track page tags: rock, coldwave, indie, post-punk.',art:'waves'}),
  record('ana-znichka','Znichka / Знічка','Ana Zhdanova',2018,'be',['electronic','folk'],
    'https://ezhevika.bandcamp.com/track/znichka','https://ezhevika.bandcamp.com/album/znichka','Ezhevika · official label release',
    words('“Znichka” refers to a shooting star. The label introduces this as Ana Zhdanova’s Belarusian-language single. Start with the original, then compare three named reinterpretations from the same release.','«Знічка» — падающая звезда. Лейбл представляет релиз как белорусскоязычный сингл Ana Zhdanova. Начни с оригинала, затем сравни три подписанные переработки из того же релиза.','«Знічка» — зорка, што падае. Лэйбл прадстаўляе рэліз як беларускамоўны сінгл Ana Zhdanova. Пачні з арыгінала, а потым параўнай тры падпісаныя перапрацоўкі з таго ж рэлізу.'),
    {aliases:['Анна Жданова','Ана Жданава','Знічка','Зничка','Znicka','Znička'],languageEvidence:'The label explicitly describes a Belarusian-language single.',tagScope:'Publisher’s track-page tags, not independent audio analysis.',art:'star'}),
  record('val-da-vidna','Да відна / Da Vidna','VAL',2020,'be',[],
    'https://www.youtube.com/watch?v=F0wfxz5zq04','https://www.eurovision.com/eurovision-song-contest/rotterdam-2020/participants/val-1/','Eurovision · official entry and video',
    words('Selected to represent Belarus in 2020, with Belarusian lyrics and an English translation on the official entry page. Eurovision 2020 was cancelled: this is the official preview video, not a performance at that contest.','Песня, выбранная представлять Беларусь в 2020: на официальной странице есть белорусский текст и английский перевод. Eurovision 2020 отменили — здесь официальное превью, не выступление на конкурсе.','Песня, абраная прадстаўляць Беларусь у 2020: на афіцыйнай старонцы ёсць беларускі тэкст і англійскі пераклад. Eurovision 2020 скасавалі — тут афіцыйнае прэв’ю, не выступ на конкурсе.'),
    {aliases:['да видна','до рассвета','Еўрабачанне','Евровидение','Eurovision'],themes:['eurovision'],languageEvidence:'Original Belarusian lyrics and English translation on the official entry page.',art:'dawn'}),
  record('trollwald-dva-troli','Dva troli / Два тролі','TROLLWALD',2023,'be',['folk','metal'],
    'https://trollwald.bandcamp.com/track/dva-troli','https://trollwald.bandcamp.com/track/dva-troli','TROLLWALD · official Bandcamp',
    words('A contemporary folk-metal song with a fantasy story, released on 2 June 2023. The artist publishes Belarusian lyrics in Latin script. Folk instrumentation does not make it an anonymous historical folk recording.','Современная фолк-метал-песня с фантастическим сюжетом, вышедшая 2 июня 2023. Артист публикует белорусский текст латиницей. Фольклорные инструменты не делают её анонимной исторической записью.','Сучасная фолк-метал-песня з фантастычным сюжэтам, якая выйшла 2 чэрвеня 2023. Артыст публікуе беларускі тэкст лацінкай. Фальклорныя інструменты не робяць яе ананімным гістарычным запісам.'),
    {aliases:['Трольвальд','Тролльвальд','два тролля','bagpipes','дуда','волынка'],languageEvidence:'Belarusian lyrics in Latin script on the artist’s track page.',tagScope:'The track page explicitly identifies folk metal and bagpipes.',art:'forest'}),
  ...[
    ['diamos','Diamos Roll Vision','znichka-diamos-roll-vision'],['marmi','Marmi Remix','znichka-marmi-remix'],['kosmonavt','Kosmonavt Remix','znichka-kosmonavt-remix']
  ].map(([id,version,slug])=>record('ana-'+id,`Znichka (${version})`,'Ana Zhdanova',2018,'be',['electronic','remix'],
    'https://ezhevika.bandcamp.com/track/'+slug,'https://ezhevika.bandcamp.com/album/znichka','Ezhevika · official label release',
    words(`A named reinterpretation of Znichka on the same 2018 label release: ${version}. Keep the original beside it in your collection to compare what changes. This is another version of one work, not an unrelated song.`,`Подписанная переработка «Знічкі» из того же релиза лейбла 2018 года: ${version}. Сохрани рядом оригинал и сравни изменения. Это версия одного произведения, не другая песня.`,`Падпісаная перапрацоўка «Знічкі» з таго ж рэлізу лэйбла 2018 года: ${version}. Захавай побач арыгінал і параўнай змены. Гэта версія аднаго твора, не іншая песня.`),
    {kind:'remix',workId:'ana-znichka',aliases:['Знічка','Зничка','Znicka','Znička','Анна Жданова','Ана Жданава',version],languageEvidence:'Belarusian single identified by the label; version listed on the same release.',tagScope:'Electronic reinterpretation documented in the release, not an automated mood assessment.',art:'star',linkNote:id==='diamos'?'Linked on the official release; direct page request timed out during verification.':''})),
  record('shuma-rano','Rano Rano','Šuma',2016,'unknown',[],
    'https://ezhevika.bandcamp.com/track/rano-rano','https://ezhevika.bandcamp.com/album/sonca','Ezhevika · Sonca release',
    words('A track from Sonca, released on 20 May 2016. The label describes the album’s encounter between old songs and electronic production. The vocal language of this individual track still needs confirmation; it is not inferred from the group’s origins.','Трек из Sonca, релиз 20 мая 2016. Лейбл описывает встречу старых песен и электронной музыки на уровне альбома. Язык вокала конкретного трека ещё требует подтверждения и не выводится из происхождения группы.','Трэк з Sonca, рэліз 20 мая 2016. Лэйбл апісвае сустрэчу старых песень і электронікі на ўзроўні альбома. Мова вакалу канкрэтнага трэка яшчэ патрабуе пацверджання і не вызначаецца з паходжання гурта.'),
    {aliases:['Shuma','Suma','Шума','рано рано'],languageEvidence:'Not established for this individual recording.',art:'waves'})
];
const lead=(id,title,artist,year,language,tags,sourceUrl,sourceName,summary,aliases=[])=>record(id,title,artist,year,language,tags,'',sourceUrl,sourceName,summary,{kind:'remix',aliases,art:'archive'});
catalog.push(
 ...[
  ['vutka','Na mory vutka kupałasia — Nick Cherny remix',['утка','вутка','Nick Cherny']],
  ['pcholka','Dy huła pčołka — Dee Flack remix',['пчолка','пчёлка','Dee Flack']],
  ['pierapiolka','Pierapiołka — Alex Goof remix',['перапёлка','перепёлка','Alex Goof']],
  ['oj-jedu','Oj jedu ja darohaju — drum-and-bass remix',['ой еду я дарогаю','drum and bass']]
 ].map(([id,title,aliases])=>lead('lead-shuma-'+id,title,'Šuma',2013,'be',['folk','electronic','remix',...(id==='oj-jedu'?['dance']:[])],
   'https://budzma.org/news/yer-z-remiksami-ad-prayekta-suma.html','Budzma · November 2013 remix EP',
   words('A source-documented electronic reinterpretation of traditional Belarusian material. A direct listening link for this exact remix has not been confirmed. It must not be confused with the different April Zolak EP.','Источник описывает электронную переработку традиционного белорусского материала. Прямая ссылка на именно этот ремикс не подтверждена. Его нельзя смешивать с другим апрельским Zolak EP.','Крыніца апісвае электронную перапрацоўку традыцыйнага беларускага матэрыялу. Прамая спасылка на менавіта гэты рэмікс не пацверджана. Яго нельга блытаць з іншым красавіцкім Zolak EP.'),['Shuma','Suma','Шума',...aliases])),
 ...[
   ['kuli','Kuli — (((O))) remix',2014,'https://budzma.org/news/o-zrabiw-remiks-na-pyesnyu-akute-kuli.html',['кулі','кули','(((O)))']],
   ['iholki-deech','Iholki — Deech remix',2012,'https://budzma.org/news/akute-neshta-serca-zakalola-mr3-prem%25e2%2580%2599era.html',['іголкі','иголки','Deech']],
   ['iholki-pryzma','Iholki — Pryzma remix',2012,'https://budzma.org/news/akute-neshta-serca-zakalola-mr3-prem%25e2%2580%2599era.html',['іголкі','иголки','Pryzma']],
   ['adzinotstva','Adzinotstva — DJ Boston remix',2012,'https://budzma.org/news/akute-neshta-serca-zakalola-mr3-prem%25e2%2580%2599era.html',['адзіноцтва','адинотство','DJ Boston']]
 ].map(([id,title,year,url,aliases])=>lead('lead-akute-'+id,title,'Akute',year,'be',['electronic','remix',...(id==='adzinotstva'?['dance']:[])],url,'Budzma · release report',
   words('An electronic reinterpretation documented by Budzma. The source records the release, but its old embedded player is not treated here as a verified listening link.','Электронная переработка, описанная Budzma. Источник документирует релиз, но старый встроенный проигрыватель не считается здесь подтверждённой ссылкой для прослушивания.','Электронная перапрацоўка, апісаная Budzma. Крыніца дакументуе рэліз, але стары ўбудаваны прайгравальнік тут не лічыцца пацверджанай спасылкай для слухання.'),['Акутэ','Акуте',...aliases])),
 lead('lead-kriwi','HEJ — LOLO (Schmoltz RMX)','Kriwi',null,'unknown',['electronic','remix'],'https://belarusout.site/liner-en','Belarus Outside · official liner notes',
   words('A compilation lead connecting Kriwi and a Schmoltz remix. The official liner notes supply this title; the individual recording’s release date and vocal language remain unconfirmed.','Архивная находка из сборника: Kriwi и ремикс Schmoltz. Название взято из официальных заметок к релизу; дата отдельной записи и язык вокала ещё не подтверждены.','Архіўная знаходка са зборніка: Kriwi і рэмікс Schmoltz. Назва ўзятая з афіцыйных нататак да рэлізу; дата асобнага запісу і мова вакалу яшчэ не пацверджаныя.'),['Крыві','Криви','Hej Loli','Schmoltz']),
 lead('lead-palina','Я пойму (Belyaev Remix)','Palina',2017,'unknown',['electronic','remix'],'https://musicbrainz.org/release/4bd6d2af-fb13-4009-85e1-6ecc2e49a642','MusicBrainz · release metadata',
   words('A catalogued remix release. A release-metadata language label is not proof of the language sung. Keep this as a lead until the recording and its language can be checked.','Ремикс, представленный в каталоге релизов. Языковая метка метаданных релиза не доказывает язык вокала. Пока это находка для проверки записи и её языка.','Рэмікс у каталогу рэлізаў. Моўная пазнака метаданых рэлізу не даказвае мову вакалу. Пакуль гэта знаходка для праверкі запісу і яго мовы.'),['Паліна','Полина','я пойму','Belyaev'])
);
export const listeningPaths = [
  {ids:['navi-historyja','nizkiz-pravily','nurnberg-valasy','ana-znichka']},
  {ids:['ana-znichka','ana-diamos','ana-marmi','ana-kosmonavt']},
  {ids:['ana-znichka','shuma-zamova-2025','shuma-niuka-2025','trollwald-dva-troli']}
];
// Evidence is visible on demand, rather than mixed into the listening controls.
const evidenceById={
 'navi-historyja':words('Belarusian lyrics published by the artist; corroborating official Eurovision entry.','Белорусский текст опубликован артистом; есть официальная карточка Eurovision.','Беларускі тэкст апублікаваны артыстам; ёсць афіцыйная картка Eurovision.'),
 'nizkiz-pravily':words('Belarusian lyrics on this exact track’s official artist page.','Белорусский текст на официальной странице именно этой записи.','Беларускі тэкст на афіцыйнай старонцы менавіта гэтага запісу.'),
 'nurnberg-valasy':words('The artist publishes Belarusian lyrics and English/Spanish translations.','Артист публикует белорусский текст и переводы на английский и испанский.','Артыст публікуе беларускі тэкст і пераклады на англійскую і іспанскую.'),
 'ana-znichka':words('The label explicitly identifies a Belarusian-language single.','Лейбл прямо указывает, что сингл — на белорусском языке.','Лэйбл наўпрост пазначае, што сінгл — на беларускай мове.'),
 'val-da-vidna':words('Original Belarusian lyrics and an English translation on the official entry page.','Белорусский оригинал текста и английский перевод на официальной странице участника.','Беларускі арыгінал тэксту і англійскі пераклад на афіцыйнай старонцы ўдзельніка.'),
 'trollwald-dva-troli':words('The artist’s track page publishes Belarusian lyrics in Latin script.','На странице записи артист публикует белорусский текст латиницей.','На старонцы запісу артыст публікуе беларускі тэкст лацінкай.'),
 'shuma-rano':words('The album context does not establish the vocal language of this individual recording.','Контекст альбома не подтверждает язык вокала именно этой записи.','Кантэкст альбома не пацвярджае мову вакалу менавіта гэтага запісу.')
};
const remixBasis=words('The label identifies the Belarusian single and lists this version on the same release; audio has not been independently audited.','Лейбл описывает белорусскоязычный сингл и перечисляет эту версию в том же релизе; независимая проверка аудио не проводилась.','Лэйбл апісвае беларускамоўны сінгл і пералічвае гэтую версію ў тым жа рэлізе; незалежная праверка аўдыя не праводзілася.');
const genreBasis=words('Style labels come from the publisher’s description of this track/release, not automated analysis of its mood or sound.','Стилевые метки взяты из описания записи/релиза издателем, а не из автоматического анализа настроения или звучания.','Стылёвыя пазнакі ўзятыя з апісання запісу/рэлізу выдаўцом, а не з аўтаматычнага аналізу настрою ці гучання.');
for(const r of catalog){if(r.listenUrl){r.languageEvidence=evidenceById[r.id]||(r.workId==='ana-znichka'?remixBasis:null);if(r.tagScope)r.tagScope=genreBasis;}}
catalog.push(...additionalCatalog);
catalog.push(...expandedCatalog);
catalog.push(...round2Catalog);
catalog.push(...round3Catalog);
for(const record of catalog)if(existingEmbeds[record.id])record.embed=existingEmbeds[record.id];
