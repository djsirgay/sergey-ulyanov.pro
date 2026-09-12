// Public-source recording metadata. Reviewed 12 September 2026; private prototype only.
// No audio, artwork or lyrics are copied. These IDs belong to official opt-in players.
// See data-research/round2-20260912.md for evidence, exclusions and limitations.
const w = (en, ru, be) => ({en, ru, be});
const checked = '2026-09-12';
const lyricEvidence = w(
  'Belarusian text is published by the artist or project. This is not an independent audio-language audit.',
  'Артист или проект публикует белорусский текст. Это не независимая проверка языка аудиозаписи.',
  'Артыст або праект публікуе беларускі тэкст. Гэта не незалежная праверка мовы аўдыязапісу.',
);
const traditionalEvidence = w(
  'The publisher identifies the material as Belarusian traditional songs. Dialects and every audio segment have not been independently audited.',
  'Издатель относит материал к белорусским традиционным песням. Диалекты и каждый фрагмент аудио независимо не проверялись.',
  'Выдавец адносіць матэрыял да беларускіх традыцыйных песень. Дыялекты і кожны фрагмент аўдыя незалежна не правяраліся.',
);
const styleEvidence = w(
  'Styles are publisher labels at release level; they are not measurements of tempo, energy or mood.',
  'Стили — метки издателя для релиза, а не измерения темпа, энергичности или настроения.',
  'Стылі — пазнакі выдаўца для рэлізу, а не вымярэнні тэмпу, энергічнасці ці настрою.',
);

function release(meta, rows) {
  return rows.map(([trackId, title, path, durationSeconds, extra = {}]) => {
    const sourceUrl = new URL(path, meta.url).href;
    const id = `bc-${trackId}`;
    const themes = extra.themes || [];
    const culturalFunctions = extra.functions || [];
    const themeMethod = extra.themeMethod || meta.themeMethod || 'editorial-text-reading';
    const themeScope = extra.themeScope || meta.themeScope || 'track';
    const themeSource = themeScope === 'track' ? sourceUrl : meta.url;
    const themeBasis = extra.themeBasis || meta.themeBasis || 'A limited editorial interpretation of this recording’s publisher-hosted text; not an audio analysis or artist-approved annotation.';
    const summary = extra.summary || w(
      `${meta.album} (${meta.year}): an individually linked recording with visible source and performer credit.`,
      `${meta.album} (${meta.year}): отдельная запись со ссылкой на источник и указанием исполнителя.`,
      `${meta.album} (${meta.year}): асобны запіс са спасылкай на крыніцу і пазначэннем выканаўцы.`,
    );
    const claims = [
      {field:'language', value:'be', source:meta.languageSource || sourceUrl,
        method:meta.languageStatus || 'publisher-lyrics-reviewed', scope:meta.languageScope || 'published-track-text',
        basis:meta.languageBasis || 'The source publishes Belarusian text for this recording. Audio/lyrics correspondence has not been independently tested.'},
      ...meta.tags.map(value => ({field:'style', value, source:meta.url, method:'publisher-tag', scope:'release',
        basis:'Style label on the official artist/project release page; spelling normalized for catalogue filters, not acoustically measured.'})),
      ...themes.map(value => ({field:'theme', value, source:themeSource, method:themeMethod, scope:themeScope,
        basis:themeBasis, ...(themeMethod.startsWith('editorial') ? {status:'interpretation'} : {})})),
      ...culturalFunctions.map(value => ({field:'cultural-function', value, source:meta.url,
        method:'publisher-recording-category', scope:'named-track-in-release-description',
        basis:extra.functionBasis || 'The publisher explicitly names this function for this recording; it is not inferred from sound.'})),
      ...(extra.claims || []),
    ];
    if (extra.versionRelation) claims.push({field:'version-relation', value:extra.versionRelation.type,
      source:extra.versionRelation.evidenceUrl, method:'publisher-version-label', scope:'named-recordings',
      basis:'The publisher explicitly labels these recordings as versions of the same named song. No acoustic fingerprint match has been performed.'});
    const {functions, functionBasis, themeMethod:tm, themeScope:ts, themeBasis:tb, claims:ec, ...recordExtra} = extra;
    return {
      id, title, artist:extra.artist || meta.artist, year:meta.year, language:'be', kind:'song',
      tags:[...meta.tags], themes, culturalFunctions, soundTags:[],
      listenUrl:sourceUrl, listenLabel:'Bandcamp', sourceUrl, sources:[sourceUrl, meta.url],
      sourceName:meta.sourceName || `${meta.artist} · artist/project Bandcamp`,
      album:meta.album, albumUrl:meta.url, summary, workId:id, checked, art:meta.art || 'waves',
      languageEvidence:meta.languageEvidence || lyricEvidence,
      languageStatus:meta.languageStatus || 'publisher-lyrics-reviewed', tagScope:styleEvidence,
      unknowns:[
        'Tempo, key, energy, acoustic similarity and lyrics-to-audio correspondence have not been measured.',
        'A public listening page and stream-enabled metadata do not prove end-user playback or redistribution permission.',
        ...(meta.unknowns || []), ...(extra.unknowns || []),
      ],
      rhythm:{bpm:null, method:'not measured'}, durationSeconds,
      durationBasis:'Public Bandcamp track metadata, rounded to seconds; a short recording is not represented as a full-length song.',
      dateBasis:meta.dateBasis || 'Release year displayed by the publisher, not the age of the traditional work or the date of events described.',
      sourcePublicationDate:meta.date || null, versionRelation:null,
      rightsStatus:'source-linked; redistribution not cleared',
      embed:{provider:'bandcamp',type:'track',id:String(trackId)},
      ...recordExtra,
      claims,
      aliases:[...(meta.aliases || []), ...(extra.aliases || [])],
    };
  });
}

const parusUrl = 'https://parusproject.bandcamp.com/album/zara';
const parus = release({artist:'Parus', album:'Zara', year:2024, date:'2024-08-08', url:parusUrl,
  tags:['ambient','experimental','electroacoustic'], art:'forest',
  languageEvidence:w('The release description explicitly identifies these named songs and their Belarusian regional dialects. Audio has not been independently language-audited.', 'Описание релиза прямо указывает эти песни и белорусские региональные диалекты. Язык аудио независимо не проверялся.', 'Апісанне рэлізу наўпрост пазначае гэтыя песні і беларускія рэгіянальныя дыялекты. Мова аўдыя незалежна не правяралася.'),
  languageStatus:'publisher-declared-belarusian-dialects', languageSource:parusUrl, languageScope:'named-tracks-in-release-description',
  languageBasis:'The artist’s release description names these traditional songs, their regional origins and performance in Belarusian dialects.',
  themeMethod:'publisher-track-description', themeScope:'named-track-in-release-description',
  themeBasis:'The release notes describe the subject of this named traditional song; these are not mood or audio measurements.'}, [
  [1938562571,'Zara','/track/zara',396,{workId:'parus-zara',themes:['love','longing'],aliases:['Зара'],
    summary:w('Love and parting in a Dnieper-region song, reworked with electronic and field-recorded material.', 'Любовь и разлука в песне Поднепровья, переосмысленной с электроникой и полевыми записями.', 'Каханне і расстанне ў песні Падняпроўя, пераасэнсаванай з электронікай і палявымі запісамі.')}],
  [704582768,'Soniejka','/track/soniejka',168,{themes:['love','summer'],functions:['harvest-and-work'],aliases:['Сонейка'],
    functionBasis:'The release notes identify Soniejka as a summer harvest song from the Dnieper region.',
    summary:w('A summer harvest song from the Dnieper region; the source connects it with acceptance and love.', 'Летняя жатвенная песня Поднепровья: источник связывает её с принятием и любовью.', 'Летняя жніўная песня Падняпроўя: крыніца звязвае яе з прыняццем і каханнем.')}],
  [1654432481,'Ružovyja ćviaty','/track/ru-ovyja-viaty',273,{themes:['love'],aliases:['Ружовыя цвяты'],
    summary:w('A Dzvina-region song about the beginning of love, identified in the artist’s notes.', 'Песня Подвинья о зарождении любви, описанная в пояснениях артиста.', 'Песня Падзвіння пра пачатак кахання, апісаная ў тлумачэннях артыста.')}],
  [473050417,'Oj łuhom idu','/track/oj-uhom-idu',315,{themes:['spring','wedding'],
    summary:w('A Podlasie spring song reflecting on married life; not a wedding-dance classification.', 'Подляшская весенняя песня о замужней жизни; это не метка свадебного танца.', 'Падляшская вясновая песня пра замужняе жыццё; гэта не пазнака вясельнага танца.')}],
  [1082238178,'Zara (Live version)','/track/zara-live-version',387,{workId:'parus-zara',themes:['love','longing'],
    versionRelation:{type:'live-version-of',sourceArtist:'Parus',sourceTitle:'Zara',evidenceUrl:parusUrl},
    summary:w('The publisher-labelled live version of Zara; linked to the studio recording as the same work.', 'Обозначенная издателем концертная версия Zara; связана со студийной записью как версия той же песни.', 'Пазначаная выдаўцом канцэртная версія Zara; звязана са студыйным запісам як версія той жа песні.')}],
]);

const vushUrl = 'https://tradycyja.bandcamp.com/album/sung-by-mum-folk-songs-from-vushachchyna';
const vushachchyna = release({artist:'TRADYCYJA', album:'Песні матчыны з Вушаччыны / Sung by Mum',year:2017,date:'2017-02-24',url:vushUrl,
  tags:['folk','traditional','ethno'],art:'forest', sourceName:'TRADYCYJA · project Bandcamp',
  languageEvidence:traditionalEvidence,languageStatus:'publisher-traditional-belarusian-context',languageSource:vushUrl,languageScope:'release-description',
  languageBasis:'The project documents the traditional songs of Ryhor Baradulin’s mother from Vushachchyna and credits each performer. Regional dialect audio has not been independently audited.'}, [
  [2504472994,'Rada, Rada Šera Pierapiołka','/track/akulina-andreje-na-baradulina-rada-rada-era-pierapio-ka',84,
    {artist:'Akulina Andrejeŭna Baradulina',aliases:['Акуліна Андрэеўна Барадуліна','Рада, рада шэра перапёлка'],recordingYear:1969,
      dateBasis:'This edition was released in 2017. The publisher separately credits the source recording to Siarhei Paniznik in 1969.',
      claims:[{field:'recording-year',value:'1969',source:vushUrl,method:'publisher-recording-credit',scope:'track',basis:'The publisher explicitly dates this field recording to 1969 and names Siarhei Paniznik as recordist.'}],
      summary:w('An 84-second field recording from 1969, reissued in 2017; the two dates are kept distinct.', 'Полевой фрагмент 1969 года длительностью 84 секунды, переизданный в 2017-м; даты не смешиваются.', 'Палявы фрагмент 1969 года працягласцю 84 секунды, перавыдадзены ў 2017-м; даты не змешваюцца.')}],
  [1197563403,'Oj, Latała','/track/vuraj-oj-lata-a',303,{artist:'Vuraj',aliases:['Вурай','Ой, лятала']}],
  [527747000,'Hojknuŭ Baravik','/track/folk-band-varhan-hojknu-baravik-a-wedding-song',63,{artist:'Varhan',aliases:['Варган','Гойкнуў баравік'],functions:['wedding-song'],summary:w('A 63-second wedding song, explicitly identified by the project.', 'Свадебная песня длительностью 63 секунды; функция прямо указана проектом.', 'Вясельная песня працягласцю 63 секунды; функцыя наўпрост пазначана праектам.')}],
  [186924125,'Kum Nia Pjeć','/track/ryhor-baradulin-kum-nia-pje-a-christening-party-song',24,{artist:'Ryhor Baradulin',aliases:['Рыгор Барадулін','Кум ня п’ець'],functions:['christening-song'],summary:w('A short, 24-second christening-party song; its brief duration is shown rather than hidden.', 'Короткая крестильная песня — 24 секунды; длительность указана явно.', 'Кароткая хрэсьбінная песня — 24 секунды; працягласць пазначана выразна.')}],
  [1521233985,'Chreśbinnaja','/track/rmonic-style-project-chre-binnaja-a-christening-party-song',216,{artist:'Harmonic Style Project',aliases:['Хрэсьбінная'],functions:['christening-song']}],
  [1388192953,'Kupalskaja','/track/folk-band-varhan-kupalskaja-a-midsummer-s-day-song',155,{artist:'Varhan',aliases:['Варган','Купальская'],functions:['midsummer-ritual'],summary:w('A Midsummer/Kupalle song, explicitly classified by the source.', 'Купальская песня; обрядовая функция прямо указана источником.', 'Купальская песня; абрадавая функцыя наўпрост пазначана крыніцай.')}],
  [2034688005,'A ŭ Ciomnym Lesie','/track/viktar-siama-ka-maksim-i-kin-a-ciomnym-lesie',264,{artist:'Viktar Siamaška, Maksim Iŭkin',aliases:['Віктар Сямашка','Максім Іўкін','А ў цёмным лесе']}],
  [2999777117,'Siem Čarak','/track/rmonic-style-project-siem-arak-a-drinking-song',134,{artist:'Harmonic Style Project',aliases:['Сем чарак'],functions:['drinking-song'],summary:w('The source identifies a drinking song; it is not labelled suitable for children.', 'Источник относит запись к застольным песням; пригодность для детей не заявляется.', 'Крыніца адносіць запіс да застольных песень; прыдатнасць для дзяцей не заяўляецца.')}],
  [511177895,'Vałačobnaja','/track/folk-band-varhan-va-a-obnaja',111,{artist:'Varhan',aliases:['Варган','Валачобная']}],
  [2511386819,'Drobnienki Doždžyk','/track/re1ikt-drobnienki-do-d-yk',207,{artist:'Re1ikt',aliases:['Рэлікт','Дробненькі дожджык']}],
  [3887032303,'Oj, Latała','/track/choir-salutaris-oj-lata-a',304,{artist:'Choir Salutaris',aliases:['Хор Salutaris','Ой, лятала'],summary:w('A separately credited choral recording. A shared title alone does not prove identical versions.', 'Отдельно атрибутированная хоровая запись. Совпадение названия само по себе не доказывает тождество версий.', 'Асобна атрыбутаваны харавы запіс. Супадзенне назвы само па сабе не даказвае тоеснасць версій.')}],
  [1272203683,'Pierapiołka','/track/ryhor-baradulin-pierapio-ka',68,{artist:'Ryhor Baradulin',aliases:['Рыгор Барадулін','Перапёлка']}],
]);

const nekrutUrl = 'https://3miii.bandcamp.com/album/nekrut';
const nekrut = release({artist:'3MI',album:'NEKRUT',year:2025,date:'2025-05-16',url:nekrutUrl,tags:['folk','folk-fusion'],art:'lines',
  languageEvidence:traditionalEvidence,languageStatus:'publisher-traditional-belarusian-context',languageSource:nekrutUrl,languageScope:'release-description',
  languageBasis:'The artist describes Belarusian traditional melodies and texts performed with Ivan Kirchuk. Individual audio segments and dialects have not been independently audited.',
  unknowns:['The album’s soldier narrative is not automatically assigned as a topic to every recording.']}, [
  [3008879629,'Chubaryki (Forelocks)','/track/chubaryki-forelocks',178,{aliases:['Чубарыкі']}],
  [3602998129,'Saddling The Horse','/track/saddling-the-horse',175,{aliases:['Хлопец коніка седлае']}],
  [578429968,'The Oak on The Hill','/track/the-oak-on-the-hill',132,{aliases:['Ой на гары дубіна']}],
  [4026610619,'Rain Calling Song','/track/rain-calling-song',252,{aliases:['Заклічка'],functions:['rain-calling'],
    functionBasis:'The publisher’s English title explicitly identifies the function as rain calling; this is not a relaxation or weather-sound classification.',
    summary:w('The artist names a rain-calling song; no rain ambience or calming sound is claimed.', 'Артист указывает функцию закликания дождя; шум дождя и успокаивающее звучание не заявляются.', 'Артыст пазначае функцыю заклікання дажджу; шум дажджу і супакойлівае гучанне не заяўляюцца.')}],
  [1460555545,'Village Fair','/track/village-fair',144,{aliases:['Кірмаш']}],
  [3108374745,'Harvest','/track/harvest',248,{aliases:['Жніво'],themes:['harvest'],themeMethod:'publisher-title',themeBasis:'The publisher supplies the English title Harvest and Belarusian title Жніво. This title-level subject is not proof of a particular ritual function.'}],
  [2144813428,'A Lost Friend','/track/a-lost-friend',120,{aliases:['Вы паля']}],
  [1489520720,'The Recruit’s Song (remix)','/track/the-recruit-s-song-remix',216,{aliases:['Рэкруцкая песня','рэмікс'],kind:'remix',workId:'3mi-recruit-song',
    themes:['war','home','home-and-belonging'],themeMethod:'publisher-track-description',themeScope:'named-work-in-release-description',themeBasis:'The release describes the recruit’s long military service away from home. It explicitly lists a remix and an a cappella recording of The Recruit’s Song.',
    versionRelation:{type:'remix-of',sourceArtist:'3MI / Ivan Kirchuk',sourceTitle:'The Recruit’s Song',evidenceUrl:nekrutUrl},
    summary:w('A publisher-labelled remix of the recruit’s song, linked to its a cappella version. Remix does not automatically mean dance music.', 'Обозначенный издателем ремикс рекрутской песни связан с версией а капелла. Ремикс не означает автоматически танцевальную музыку.', 'Пазначаны выдаўцом рэмікс рэкруцкай песні звязаны з версіяй а капэла. Рэмікс не азначае аўтаматычна танцавальную музыку.')}],
  [2604036953,'Three Horses','/track/three-horses',166,{aliases:['Тры коні']}],
  [329876719,'Dziady (Ancestors)','/track/dziady-ancestors',248,{aliases:['Дзяды'],themes:['remembrance'],themeMethod:'publisher-title',themeBasis:'The artist provides the title Dziady (Ancestors). This title-grounded subject does not establish suitability for a ritual or event.'}],
  [1813380656,'A Green Oak (a cappella)','/track/a-green-oak-a-cappella',107,{aliases:['Зялёны дубе','акапэла'],summary:w('An explicitly labelled a cappella recording; soft mood and energy are not inferred.', 'Запись прямо обозначена как а капелла; мягкость и энергичность не предполагаются автоматически.', 'Запіс наўпрост пазначаны як а капэла; мяккасць і энергічнасць не мяркуюцца аўтаматычна.')}],
  [1210794942,'Oh, The Geese Flew (a cappella)','/track/oh-the-geese-flew-a-cappella',98,{aliases:['Ой ляцелі гусачкі','акапэла']}],
  [255057540,'The Recruit’s Song (a cappella)','/track/the-recruit-s-song-a-cappella',98,{aliases:['Рэкруцкая песня','акапэла'],workId:'3mi-recruit-song',
    themes:['war','home','home-and-belonging'],themeMethod:'publisher-track-description',themeScope:'named-work-in-release-description',themeBasis:'The release describes the recruit’s long military service away from home and lists this named a cappella version.',
    versionRelation:{type:'a-cappella-version-of',sourceArtist:'3MI / Ivan Kirchuk',sourceTitle:'The Recruit’s Song',evidenceUrl:nekrutUrl}}],
]);

const vihilijaUrl = 'https://vihilija.bandcamp.com/album/amor-fati';
const vihilija = release({artist:'Vihilija',album:'Amor Fati',year:2024,date:'2024-11-28',url:vihilijaUrl,
  tags:['metal','black-metal','post-metal','post-punk'],art:'lines',
  themeMethod:'publisher-track-description',themeScope:'named-track-in-release-description',
  themeBasis:'The artist’s release notes explain this named track’s subject. A title such as Tale or Water is not treated as proof of children’s or relaxing music.'}, [
  [2892144943,'Meta','/track/meta-2',338,{themes:['addiction','loss'],summary:w('The artist describes destructive addiction and loss of meaning.', 'Артист описывает разрушительную зависимость и утрату смысла.', 'Артыст апісвае разбуральную залежнасць і страту сэнсу.'),contentNotes:['addiction']}],
  [1688688200,'Kazka','/track/kazka-2',224,{aliases:['Казка'],themes:['fear'],summary:w('Childhood fears persisting into adulthood, according to the artist. Not a children’s-song recommendation.', 'По описанию артиста — детские страхи, сохраняющиеся во взрослой жизни. Не рекомендация детской песни.', 'Паводле апісання артыста — дзіцячыя страхі, што захоўваюцца ў дарослым жыцці. Не рэкамендацыя дзіцячай песні.'),contentNotes:['fear']}],
  [1274905782,'Dzikaje Palavannie','/track/dzikaje-palavannie-2',209,{aliases:['Дзікае паляванне'],themes:['literature','folklore'],
    summary:w('Inspired by Uladzimir Karatkievič’s Wild Hunt of King Stakh, as stated by the artist.', 'По словам артиста, вдохновлено «Дикой охотой короля Стаха» Владимира Короткевича.', 'Паводле артыста, натхнёнае «Дзікім паляваннем караля Стаха» Уладзіміра Караткевіча.')}],
  [2383106803,'Treciaja Varta','/track/treciaja-varta-2',263,{aliases:['Трэцяя варта'],themes:['history'],summary:w('An allegory drawing on the Roman third night watch, explained in the release notes.', 'Аллегория римской третьей ночной стражи, объяснённая в описании релиза.', 'Алегорыя рымскай трэцяй начной варты, растлумачаная ў апісанні рэлізу.')}],
  [3011389831,'Vada','/track/vada-2',309,{aliases:['Вада'],themes:['death','uncertainty'],summary:w('Water as a metaphor for death and transition, not a promise of relaxing water sounds.', 'Вода как метафора смерти и перехода, а не обещание расслабляющих водных звуков.', 'Вада як метафара смерці і пераходу, а не абяцанне расслабляльных водных гукаў.'),contentNotes:['death']}],
  [927931107,'Adzinocz','/track/adzinocz-2',319,{aliases:['Адзіноч'],themes:['loneliness','isolation'],summary:w('Loneliness, misunderstanding and finding one’s place, as described by the artist.', 'Одиночество, непонимание и поиск своего места — темы, указанные артистом.', 'Адзінота, непаразуменне і пошук свайго месца — тэмы, пазначаныя артыстам.')}],
  [3876150951,'Stary Zapaviet','/track/stary-zapaviet',292,{aliases:['Стары Запавет'],themes:['violence'],summary:w('The artist describes social decay, vengeance and violence.', 'Артист описывает общественный упадок, месть и насилие.', 'Артыст апісвае грамадскі заняпад, помсту і гвалт.'),contentNotes:['violence']}],
]);

const chyrvonyUrl = 'https://misschambertale.bandcamp.com/album/yrvony-kraj';
const missChambertale = release({artist:'Miss Chambertale',album:'Čyrvony kraj',year:2020,date:'2020-12-22',url:chyrvonyUrl,
  tags:['jazz','dark-cabaret','folk'],art:'sun',languageEvidence:w('The artist identifies this as her first song in Belarusian.', 'Артистка называет эту песню своей первой на белорусском языке.', 'Артыстка называе гэтую песню сваёй першай на беларускай мове.'),
  languageStatus:'publisher-declared-language',languageSource:chyrvonyUrl,languageScope:'release-description',
  languageBasis:'The artist explicitly states that she chose Belarusian for this song for the first time.',
  themeMethod:'publisher-track-description',themeScope:'single-release-description',
  themeBasis:'The artist connects the completed song to injustice and violence surrounding the 2020 election; the tag is not inferred merely from the release year.'}, [
  [2883711195,'Čyrvony kraj','/track/yrvony-kraj',234,{aliases:['Чырвоны край'],themes:['protest','anti-violence','solidarity'],
    summary:w('A 2020 song whose meaning changed amid election violence, explicitly explained by its author.', 'Песня 2020 года, смысл которой изменился на фоне насилия после выборов; это прямо объясняет автор.', 'Песня 2020 года, сэнс якой змяніўся на фоне гвалту пасля выбараў; гэта наўпрост тлумачыць аўтарка.')}],
]);

const jmorsTags = ['rock','pop-rock'];
const zecameronUrl = 'https://jmors.bandcamp.com/album/--11';
const zecameron = release({artist:'J:МОРС, Volnyja Kupalaŭcy',aliases:['J:MORS','Вольныя купалаўцы'],
  album:'Зэкамерон. Песні да спектакля',year:2026,date:'2026-05-21',url:zecameronUrl,tags:jmorsTags,art:'lines'}, [
  [2925051591,'Аканіцы','/track/--117',209,{themes:['imprisonment','freedom'],summary:w('A theatre-song text with confinement and freedom imagery; an editorial reading, not an artist-approved tag.', 'Текст театральной песни с образами несвободы и свободы; редакторское прочтение, не утверждённая артистом метка.', 'Тэкст тэатральнай песні з вобразамі няволі і свабоды; рэдактарскае прачытанне, не зацверджаная артыстам пазнака.')}],
  [3905571451,'Калыханка','/track/--118',127,{themes:['sleep','hope'],summary:w('The published text invites sleep and imagines a better tomorrow. No claim of child suitability or soft audio.', 'Опубликованный текст зовёт ко сну и рисует лучшее завтра. Пригодность для детей и мягкое звучание не заявляются.', 'Апублікаваны тэкст кліча да сну і малюе лепшае заўтра. Прыдатнасць для дзяцей і мяккае гучанне не заяўляюцца.')}],
  [574063311,'Унутры','/track/--121',176,{themes:['imprisonment','isolation'],summary:w('A theatre song whose published text describes isolation and endurance in confinement.', 'Театральная песня: в опубликованном тексте — изоляция и стойкость в неволе.', 'Тэатральная песня: у апублікаваным тэксце — ізаляцыя і трываласць у няволі.')}],
  [2612295126,'Лёсамі','/track/--122',227,{themes:['love','hope']}],
]);

const singles = [
  {id:2044640998,title:'Зброя (single)',path:'/track/single',seconds:204,year:2024,date:'2024-04-18',themes:['hope','home','home-and-belonging'],
    summary:w('Endurance, roots and an unsettled home, read from the published Belarusian text.', 'Стойкость, корни и утраченный домашний уклад — редакторское прочтение белорусского текста.', 'Трываласць, карані і страчаны хатні лад — рэдактарскае прачытанне беларускага тэксту.')},
  {id:1441737447,title:'Святло (single)',path:'/track/single-2',seconds:175,year:2023,date:'2023-10-13',themes:['hope','solidarity']},
  {id:1435109540,title:'Вікторыя (single)',path:'/track/single-3',seconds:206,year:2022,date:'2022-11-04',themes:['hope','migration'],
    summary:w('The published text considers staying or leaving under pressure; migration is an editorial subject tag.', 'Опубликованный текст обращается к выбору остаться или уехать под давлением; миграция — редакторская тематическая метка.', 'Апублікаваны тэкст звяртаецца да выбару застацца ці з’ехаць пад ціскам; міграцыя — рэдактарская тэматычная пазнака.')},
  {id:3290874117,title:'Бывай (single)',path:'/track/single-5',seconds:197,year:2021,date:'2021-12-17',themes:['loss','family','uncertainty']},
].flatMap(s => release({artist:'J:МОРС',aliases:['J:MORS'],album:s.title,year:s.year,date:s.date,url:`https://jmors.bandcamp.com${s.path}`,tags:jmorsTags,art:'sun'},
  [[s.id,s.title,s.path,s.seconds,{themes:s.themes,...(s.summary ? {summary:s.summary} : {})}]]));

const blizkaUrl = 'https://jmors.bandcamp.com/album/ep-2';
const blizka = release({artist:'J:МОРС',aliases:['J:MORS'],album:'Блізка EP',year:2017,date:'2017-08-28',url:blizkaUrl,tags:jmorsTags,art:'sun',
  languageSource:blizkaUrl,languageScope:'published-work-text',
  dateBasis:'The linked EP was released in August 2017. The publisher dates the song’s first release to December 2016; this is not backdated onto later versions.'}, [
  [1719915277,'Блізка','/track/--115',266,{workId:'jmors-blizka',themes:['home','home-and-belonging','family','city'],
    summary:w('Home, roots and Minsk in the published text. The song’s first release was in 2016; this linked EP is from 2017.', 'Дом, корни и Минск в опубликованном тексте. Песня впервые вышла в 2016-м; связанный EP — 2017 года.', 'Дом, карані і Мінск у апублікаваным тэксце. Песня ўпершыню выйшла ў 2016-м; звязаны EP — 2017 года.')}],
  [3574457402,'Блізка (feat. FolkRada)','/track/feat-folkrada',289,{artist:'J:МОРС feat. FolkRada',workId:'jmors-blizka',themes:['home','home-and-belonging','family'],
    versionRelation:{type:'alternate-version-of',sourceArtist:'J:МОРС',sourceTitle:'Блізка',evidenceUrl:blizkaUrl}}],
  [487268639,'Блізка (summer version)','/track/summer-version',262,{workId:'jmors-blizka',themes:['home','home-and-belonging','family'],
    versionRelation:{type:'alternate-version-of',sourceArtist:'J:МОРС',sourceTitle:'Блізка',evidenceUrl:blizkaUrl},
    summary:w('A publisher-labelled summer version of the same song. The version name does not establish dance energy or BPM.', 'Обозначенная издателем летняя версия той же песни. Название версии не доказывает танцевальность или BPM.', 'Пазначаная выдаўцом летняя версія той жа песні. Назва версіі не даказвае танцавальнасць або BPM.')}],
]);

const viasnaUrl = 'https://viasna.bandcamp.com/album/-';
const viasna = release({artist:'VIASNA',album:'ПАЗНАЧАНЫЯ ЖОЎТЫМ',year:2024,date:'2024-11-19',url:viasnaUrl,tags:['hip-hop','rap'],art:'lines',
  sourceName:'VIASNA · creator-published documentary music project',
  languageEvidence:w('The project publishes Belarusian lyrics. Documentary spoken samples may include other languages; their complete audio language has not been audited.', 'Проект публикует белорусские тексты. Документальные речевые вставки могут содержать другие языки; полный аудиоязык не проверен.', 'Праект публікуе беларускія тэксты. Дакументальныя маўленчыя ўстаўкі могуць змяшчаць іншыя мовы; поўная мова аўдыя не праверана.'),
  languageBasis:'Belarusian published lyrics were reviewed. This is the primary lyric-language label, not a claim that every documentary speech sample is Belarusian.',
  themeMethod:'publisher-track-description',themeScope:'named-track-in-release-description',
  themeBasis:'The creator describes this six-part documentary project about Belarusian political prisoners and identifies the stage represented by this track.',
  unknowns:['Documentary speech recordings may include languages other than the published Belarusian lyrics.','Themes include detention, prison conditions and family separation; no child-suitability assessment has been performed.']}, [
  [1286258235,'затрыманне','/track/-',216,{artist:'Angst',themes:['protest','imprisonment'],contentNotes:['detention','violence'],
    summary:w('The detention chapter of VIASNA’s documentary music project about political imprisonment.', 'Глава о задержании из документального музыкального проекта VIASNA о политическом заключении.', 'Раздзел пра затрыманне з дакументальнага музычнага праекта VIASNA пра палітычнае зняволенне.')}],
  [1350202714,'умовы','/track/--2',225,{artist:'Andrej Novik, ZHEUZHIK',aliases:['Андрэй Новік'],themes:['protest','imprisonment'],contentNotes:['prison conditions'],
    summary:w('The prison-conditions chapter; performer credits and the project’s source remain visible.', 'Глава об условиях в заключении; исполнители и источник проекта указаны открыто.', 'Раздзел пра ўмовы ў зняволенні; выканаўцы і крыніца праекта пазначаны адкрыта.')}],
  [1638501910,'суд','/track/--3',164,{artist:'Andrej Novik, Alana Hebremaryjam, Krystsina Drobysh',aliases:['Андрэй Новік','Алана Гебрэмарыям','Крысціна Дробыш'],themes:['protest','imprisonment'],
    summary:w('The trial chapter of the six-part documentary project; not a general news or legal source.', 'Глава о суде из документального проекта в шести частях; не универсальный новостной или юридический источник.', 'Раздзел пра суд з дакументальнага праекта ў шасці частках; не ўніверсальная навінавая ці юрыдычная крыніца.')}],
  [1685567117,'лісты','/track/--4',224,{artist:'Ksenija Halubovich, Andrej Novik, Krystsina Drobysh',aliases:['Ксенія Галубовіч','Андрэй Новік','Крысціна Дробыш'],themes:['protest','imprisonment','family','solidarity'],
    summary:w('Letters between imprisoned people and their families, placed in the project’s documented context.', 'Письма между заключёнными и их семьями в документальном контексте проекта.', 'Лісты паміж зняволенымі і іх сем’ямі ў дакументальным кантэксце праекта.')}],
  [2268022060,'пасля вызвалення','/track/--5',199,{artist:'Ales Papkovich, ZHEUZHIK',aliases:['Алесь Папковіч'],themes:['protest','imprisonment','solidarity'],
    summary:w('Life after release and responsibility toward those still imprisoned.', 'Жизнь после освобождения и ответственность перед оставшимися в заключении.', 'Жыццё пасля вызвалення і адказнасць перад тымі, хто застаецца ў зняволенні.')}],
  [3139801025,'дзеці','/track/--6',185,{artist:'Uhead',themes:['protest','family','imprisonment'],contentNotes:['family separation','violence'],
    summary:w('Children affected by political imprisonment. This is a subject label, not a children’s-music recommendation.', 'Дети, затронутые политическим заключением. Это тема, а не рекомендация детской музыки.', 'Дзеці, закранутыя палітычным зняволеннем. Гэта тэма, а не рэкамендацыя дзіцячай музыкі.')}],
]);

// Interleave reviewed sources instead of placing whole albums ahead of other artists.
const groups = [parus,vushachchyna,nekrut,vihilija,missChambertale,zecameron,singles,blizka,viasna];
export const round2Catalog = Array.from({length:Math.max(...groups.map(g => g.length))}, (_,i) => groups.flatMap(g => g[i] ? [g[i]] : [])).flat();
export const round2CatalogEvidence = {
  checked, recordCount:round2Catalog.length,
  bandcampEmbedCount:round2Catalog.filter(r => r.embed?.provider === 'bandcamp').length,
  creditedPerformerStrings:new Set(round2Catalog.map(r => r.artist)).size,
  primarySourceAccounts:new Set(round2Catalog.map(r => new URL(r.sourceUrl).hostname)).size,
  exactTrackPagesChecked:true,
  exactTrackPageCount:55,
  exactTrackCheckMethod:'Each public track page returned HTTP 200; its observed track ID, type=track, stream-enabled flag and rounded duration matched the record. No audio file was fetched.',
  publicPlaybackAudited:false, audioLanguageAudited:false, audioFeaturesMeasured:false,
  rightsClearedForRedistribution:false, publishedExternally:false,
};
