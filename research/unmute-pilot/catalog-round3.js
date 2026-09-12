// Source-reviewed metadata, 12 September 2026. Private listener-test expansion.
// No audio, lyrics or artwork are reproduced. Official players remain opt-in.
const w = (en, ru, be) => ({en, ru, be});
const checked = '2026-09-12';
const languageEvidence = w(
  'The artist publishes Belarusian text for this recording. This is a text review, not an independent audit of every sung or spoken audio segment.',
  'Артист публикует белорусский текст этой записи. Проверен текст, а не язык каждого спетого или произнесённого аудиофрагмента.',
  'Артыст публікуе беларускі тэкст гэтага запісу. Правераны тэкст, а не мова кожнага праспяванага ці прамоўленага аўдыяфрагмента.'
);
const tagScope = w(
  'Styles come from the publisher’s release tags. Topics are limited readings of published text or explicit source descriptions; tempo and mood were not measured.',
  'Стили взяты из меток релиза. Темы — ограниченная интерпретация опубликованного текста или прямое описание источника; темп и настроение не измерялись.',
  'Стылі ўзятыя з пазнак рэлізу. Тэмы — абмежаваная інтэрпрэтацыя апублікаванага тэксту або непасрэднае апісанне крыніцы; тэмп і настрой не вымяраліся.'
);
const topicNames = {
  love:w('love','любовь','каханне'), home:w('home','дом','дом'), 'home-and-belonging':w('home and belonging','дом и принадлежность','дом і прыналежнасць'),
  exile:w('exile','эмиграция','эміграцыя'), solidarity:w('solidarity','солидарность','салідарнасць'), resistance:w('resistance','сопротивление','супраціў'),
  protest:w('protest','протест','пратэст'), 'anti-violence':w('opposition to violence','неприятие насилия','непрыманне гвалту'),
  war:w('war','война','вайна'), freedom:w('freedom','свобода','свабода'), censorship:w('censorship','цензура','цэнзура'),
  loneliness:w('loneliness','одиночество','адзінота'), identity:w('identity','самоопределение','самаідэнтыфікацыя'),
  hope:w('hope','надежда','надзея'), memory:w('memory','память','памяць'), nostalgia:w('nostalgia','ностальгия','настальгія'),
  nature:w('nature','природа','прырода'), spring:w('spring','весна','вясна'), night:w('night','ночь','ноч'),
  work:w('work','работа','праца'), 'urban-life':w('urban life','городская жизнь','гарадское жыццё'),
  'social-commentary':w('social commentary','социальная критика','сацыяльная крытыка'),
  'digital-culture':w('digital culture','цифровая культура','лічбавая культура'),
  humour:w('humour','юмор','гумар'), music:w('music','музыка','музыка'),
  'literary-adaptation':w('literary adaptation','литературная основа','літаратурная аснова'),
  'historical-memory':w('historical memory','историческая память','гістарычная памяць'),
  mythology:w('mythology','мифология','міфалогія'), fantasy:w('fantasy','фантастический сюжет','фантастычны сюжэт'),
  horror:w('horror','ужасы','жахі'), grief:w('grief','утрата','страта'),
  longing:w('longing','тоска по близкому','туга па блізкім'), wedding:w('marriage','брак','шлюб'),
  family:w('family','семья','сям’я'), travel:w('travel','путешествие','падарожжа'),
  ecology:w('ecology','экология','экалогія'), friendship:w('friendship','дружба','сяброўства'),
  time:w('time and change','время и перемены','час і перамены'),
};
const genericSummary = (meta, themes) => Object.fromEntries(['en','ru','be'].map(lang => {
  const topics = themes.filter(t => t !== 'home-and-belonging').map(t => topicNames[t]?.[lang] || t).join(', ');
  return [lang, lang === 'en' ? `${meta.album} (${meta.year}). ${topics ? `Text-review topics: ${topics}.` : 'An individually credited recording; follow its source for context.'}`
    : lang === 'ru' ? `${meta.album} (${meta.year}). ${topics ? `Темы по опубликованному тексту: ${topics}.` : 'Отдельно атрибутированная запись; контекст — в источнике.'}`
    : `${meta.album} (${meta.year}). ${topics ? `Тэмы паводле апублікаванага тэксту: ${topics}.` : 'Асобна атрыбутаваны запіс; кантэкст — у крыніцы.'}`];
}));

function release(meta, rows) {
  return rows.map(([number,title,path,durationSeconds,themes=[],extra={}]) => {
    const id = `bc-${number}`, sourceUrl = new URL(path,meta.url).href;
    const method = extra.themeMethod || meta.themeMethod || 'editorial-text-reading';
    const basis = extra.themeBasis || 'A bounded editorial reading of the recording’s publisher-hosted text; not an artist-approved annotation, historical fact-check or audio analysis.';
    const claims = [
      {field:'language',value:'be',method:meta.languageStatus || 'publisher-lyrics-reviewed',source:meta.languageSource || sourceUrl,
        scope:meta.languageScope || 'published-track-text',basis:meta.languageBasis || 'Belarusian published text was inspected on this recording page; every audio segment has not been independently language-audited.'},
      ...meta.tags.map(value => ({field:'style',value,method:'publisher-tag',source:meta.url,scope:'release',basis:'A publisher release tag, normalized for filters; not an acoustic measurement.'})),
      ...themes.map(value => ({field:'theme',value,method,source:sourceUrl,scope:'track',basis,...(method.startsWith('editorial') ? {status:'interpretation'} : {})})),
      ...(extra.functions || []).map(value => ({field:'cultural-function',value,method:'publisher-recording-category',source:sourceUrl,scope:'named-recording',basis:extra.functionBasis})),
      ...(extra.recordingYear ? [{field:'recording-year',value:String(extra.recordingYear),method:'publisher-recording-credit',source:sourceUrl,scope:'track',basis:'The track description explicitly dates the source recording. The catalogue year remains the release year of this edition.'}] : []),
      ...(extra.versionRelation ? [{field:'version-relation',value:extra.versionRelation.type,method:'publisher-version-label',source:extra.versionRelation.evidenceUrl,scope:'named-recordings',basis:'The publisher explicitly calls this an alternative version of the named song; no audio fingerprint matching was performed.'}] : []),
    ];
    return {
      id,title,artist:extra.artist || meta.artist,year:meta.year,language:'be',kind:extra.kind || 'song',
      tags:[...meta.tags],themes,culturalFunctions:extra.functions || [],soundTags:[],
      listenUrl:sourceUrl,listenLabel:'Bandcamp',sourceUrl,sources:[sourceUrl,meta.url],
      sourceName:meta.sourceName || `${meta.artist} · artist/project Bandcamp`,album:meta.album,albumUrl:meta.url,
      summary:extra.summary || genericSummary(meta,themes),workId:extra.workId || id,checked,art:meta.art || 'waves',
      languageEvidence:meta.languageEvidence || languageEvidence,languageStatus:meta.languageStatus || 'publisher-lyrics-reviewed',tagScope,
      claims,unknowns:[
        'Tempo, key, energy, mood, audio-language correspondence and acoustic similarity have not been independently measured.',
        'Stream-enabled source metadata does not guarantee playback in every region, browser or account state. Redistribution permission is not established.',
        ...(meta.unknowns || []),...(extra.unknowns || []),
      ],
      rhythm:{bpm:null,method:'not measured'},durationSeconds,
      durationBasis:'Public Bandcamp recording metadata, rounded to seconds; not independently timed by listening.',
      dateBasis:extra.dateBasis || (extra.recordingYear ? `This edition was released in ${meta.year}; the publisher separately dates the source recording to ${extra.recordingYear}.` : 'Publisher release date of this edition, not the date of the story, poem, source material or historical events.'),
      sourcePublicationDate:meta.date, ...(extra.recordingYear ? {recordingYear:extra.recordingYear} : {}),
      versionRelation:extra.versionRelation || null,rightsStatus:'source-linked; redistribution not cleared',
      embed:{provider:'bandcamp',type:'track',id:String(number)},aliases:[...(meta.aliases || []),...(extra.aliases || [])],
      ...(extra.performerCredits ? {performerCredits:extra.performerCredits} : {}),
    };
  });
}

const leta = release({artist:'Leta',album:'Panoptykum',url:'https://hetaleta.bandcamp.com/album/panoptykum',year:2020,date:'2020-05-05',
  tags:['experimental','electropop'],aliases:['Лета'],themeMethod:'publisher-track-description'},[
  [2594948852,'Praletarskaja','/track/praletarskaja',90,['work','urban-life'],{themeBasis:'The artist describes a character from the industrial districts of Minsk and his fate.',aliases:['Пралетарская']}],
  [1317282769,'Lajk','/track/lajk',110,['digital-culture','social-commentary'],{themeBasis:'The artist explicitly describes a critical song about influencers, opinion leadership and passing fame.',aliases:['Лайк']}],
  [851427111,'Naduryli','/track/naduryli',104,['social-commentary'],{themeBasis:'The artist describes characters boasting about deceiving everyone around them.',aliases:['Надурылі']}],
  [2220619411,'Tannaja harelka','/track/tannaja-harelka',135,[],{aliases:['Танная гарэлка'],summary:w('The artist presents a warning about excessive drinking, not an endorsement or a children’s song.','Артист описывает вред чрезмерного употребления алкоголя; это не его одобрение и не детская песня.','Артыст апісвае шкоду празмернага ўжывання алкаголю; гэта не яго ўхваленне і не дзіцячая песня.')}],
  [3536443493,'Hit','/track/hit',130,['music'],{themeBasis:'The artist calls this a song about a pop star.',aliases:['Хіт']}],
  [3416457610,'Ideolah','/track/ideolah',113,['censorship','social-commentary'],{themeBasis:'The artist describes an ideology official who bans songs and bands.',aliases:['Ідэолаг'],summary:w('A satire of an official banning music, according to the artist’s own explanation.','Сатира на чиновника, запрещающего музыку, — по объяснению самого артиста.','Сатыра на чыноўніка, які забараняе музыку, — паводле тлумачэння самога артыста.')}],
  [2785124774,'Sekstet Seiferta','/track/sekstet-seiferta',98,['time'],{themeBasis:'The artist explicitly describes the song as being about space and the space-time continuum.',aliases:['Сэкстэт Сэйферта']}],
  [1346122203,'Vam pakiet','/track/vam-pakiet',98,['urban-life'],{themeBasis:'The artist describes the people encountered in daily life; the published text depicts grocery shopping.',aliases:['Вам пакет']}],
]);

const prorvaMeta = {artist:'Prorva',tags:['punk','post-punk','punk-rock'],aliases:['Прорва'],
  unknowns:['Some publisher pages also print an English translation. A translated text is not evidence that the recording is sung in English.']};
const prorva = [
  ...release({...prorvaMeta,album:'Recha',url:'https://prorva.bandcamp.com/album/recha',year:2024,date:'2024-06-06'},[
    [2675028084,'Mury','/track/mury',163,['exile','loneliness','urban-life'],{aliases:['Муры'],summary:w('A narrator feels lost in an unfamiliar Warsaw. This is Prorva’s own recording, not automatically the well-known protest song with the same title.','Рассказчик теряется в чужой Варшаве. Это запись Prorva, а не автоматически известная протестная песня с таким же названием.','Апавядальнік губляецца ў чужой Варшаве. Гэта запіс Prorva, а не аўтаматычна вядомая пратэсная песня з такой самай назвай.')}],
    [3472089515,'Turma','/track/turma',187,['loneliness'],{aliases:['Турма'],summary:w('The text uses imprisonment as a metaphor for isolation at home; it is not classified as a documentary prison testimony.','Текст описывает домашнюю изоляцию через метафору тюрьмы; это не документальное свидетельство заключённого.','Тэкст апісвае хатнюю ізаляцыю праз метафару турмы; гэта не дакументальнае сведчанне зняволенага.')}],
    [4102929650,'Nieba','/track/nieba',150,['war','anti-violence','hope'],{aliases:['Неба']}],
    [1621030002,'Rostań','/track/rosta',138,['war','identity'],{aliases:['Ростань']}],
    [264013297,'U pustečy','/track/u-puste-y',165,['loneliness'],{aliases:['У пустэчы']}],
    [4175271848,'Žyć nasupor [bonus track]','/track/y-nasupor-bonus-track',126,['resistance','hope','literary-adaptation'],{aliases:['Жыць насупор','Уладзімір Караткевіч'],summary:w('The recording explicitly credits Uladzimir Karatkevich’s words; the text affirms dignity and persistence.','Источник прямо указывает текст Уладзіміра Караткевіча; тема — достоинство и стойкость.','Крыніца наўпрост пазначае тэкст Уладзіміра Караткевіча; тэма — годнасць і стойкасць.')}],
  ]),
  ...release({...prorvaMeta,album:'U cieni impieryj',url:'https://prorva.bandcamp.com/album/u-cieni-impieryj',year:2025,date:'2025-06-20'},[
    [2925559163,'Smuha','/track/smuha',143,['exile','home','home-and-belonging'],{aliases:['Смуга']}],
    [3736671927,'Dryhva','/track/dryhva',142,['urban-life','loneliness'],{aliases:['Дрыгва']}],
    [512324351,'U cieni impieryj','/track/u-cieni-impieryj',140,['historical-memory','home','home-and-belonging','hope'],{aliases:['У цені імперый']}],
  ]),
];

const syndromMeta = {artist:'Syndrom Samazvanca',tags:['rock','art-rock','krautrock','psychedelic-rock'],aliases:['Сындром Самазванца'],art:'lines'};
const syndrom = [
  ...release({...syndromMeta,album:'Mahajba',url:'https://syndromsamazvanca.bandcamp.com/album/mahajba',year:2025,date:'2025-07-01',tags:[...syndromMeta.tags,'folk']},[
    [1014416643,'Kosmische Walatschobniken','/track/kosmische-walatschobniken',977,[],{summary:w('A 16-minute folk/psychedelic reworking with a published Easter-round text. Duration is explicit; it is not a short lullaby.','Почти 16-минутное фолк-психоделическое переосмысление с опубликованным валачобным текстом. Это не короткая колыбельная.','Амаль 16-хвіліннае фолк-псіхадэлічнае пераасэнсаванне з апублікаваным валачобным тэкстам. Гэта не кароткая калыханка.')}],
    [1677788206,'Pa-za hajem','/track/pa-za-hajem',352,['war','family'],{kind:'reworking',aliases:['Па-за гаем'],summary:w('The artist identifies a traditional song recorded in Asarevichy in 2004; this new treatment was released in 2025.','Артист указывает народную песню, записанную в Асарэвічах в 2004 году; новая обработка вышла в 2025-м.','Артыст пазначае народную песню, запісаную ў Асарэвічах у 2004 годзе; новая апрацоўка выйшла ў 2025-м.'),unknowns:['2004 dates the cited field source, not this 2025 recording.'] }],
    [3517737969,'Masty','/track/masty',250,['family','grief'],{kind:'reworking',aliases:['Масты'],summary:w('A traditional family tragedy; the artist names Yeva Smarchkova and a 2019 field recording as the source. This edition is from 2025.','Народная семейная трагедия; артист называет Еву Смарчкову и полевую запись 2019 года источником. Этот релиз — 2025 года.','Народная сямейная трагедыя; артыст называе Еву Смарчкову і палявы запіс 2019 года крыніцай. Гэты рэліз — 2025 года.'),unknowns:['2019 dates the referenced field source, not this new recording; the subject is not a child-suitability endorsement.']}],
    [405291580,'Dudka','/track/dudka',210,['censorship','social-commentary'],{aliases:['Дудка']}],
    [977754909,'Maslienica Bop','/track/maslienica-bop',857,['humour'],{summary:w('A long-form folk/psychedelic setting of a published traditional text. Its title alone is not a verified ritual-use or danceability label.','Развёрнутая фолк-психоделическая обработка опубликованного народного текста. Название не доказывает обрядовую функцию или танцевальность.','Разгорнутая фолк-псіхадэлічная апрацоўка апублікаванага народнага тэксту. Назва не даказвае абрадавую функцыю або танцавальнасць.')}],
    [971481883,'Biaskoncy Talačyn','/track/biaskoncy-tala-yn',555,['home','home-and-belonging','hope'],{aliases:['Бясконцы Талачын']}],
  ]),
  ...release({...syndromMeta,album:'Sonk',url:'https://syndromsamazvanca.bandcamp.com/album/sonk',year:2022,date:'2022-01-14'},[
    [1948226814,'Novy kosmas','/track/novy-kosmas',249,['censorship','social-commentary'],{aliases:['Новы космас']}],
    [423350096,'Mliavaść','/track/mliava',340,['loneliness'],{aliases:['Млявасць']}],
    [3376537947,'Karahod','/track/karahod',540,['resistance'],{aliases:['Карагод'],summary:w('A text about control and an escape through movement. The mention of dancing is not an acoustic dance-track classification.','Текст о контроле и освобождении через движение. Упоминание танца не означает измеренную танцевальность записи.','Тэкст пра кантроль і вызваленне праз рух. Згадка танца не азначае вымераную танцавальнасць запісу.')}],
    [4203592985,'Alimpijada-20','/track/alimpijada-20',448,[],{aliases:['Алімпіяда-20']}],
    [1898729632,'Darmajed','/track/darmajed',488,['work','social-commentary'],{aliases:['Дармаед']}],
  ]),
  ...release({...syndromMeta,album:'Vostraŭ skarhaŭ',url:'https://syndromsamazvanca.bandcamp.com/album/vostra-skarha',year:2023,date:'2023-01-12'},[
    [1668394091,'Kvietki zla','/track/kvietki-zla',324,['censorship','loneliness'],{aliases:['Кветкі зла']}],
    [830230361,'Promni','/track/promni',464,['loneliness'],{aliases:['Промні']}],
    [1463187380,'Na dno!','/track/na-dno',178,['hope'],{aliases:['На дно'],unknowns:['Published text contains profanity; no child-suitability claim is made.']}],
    [1868493956,'Halijaf','/track/halijaf',464,['censorship','resistance'],{aliases:['Галіяф']}],
    [3224914933,'Aliena K.','/track/aliena-k',339,['nature','fantasy'],{aliases:['Алена К.'],summary:w('The text imagines entering a painted carpet landscape. The catalogue does not assert the identity of the named artist without further evidence.','Текст воображает жизнь внутри нарисованного ковра. Личность упомянутой художницы без дополнительного источника не утверждается.','Тэкст уяўляе жыццё ўнутры намаляванага дывана. Асоба згаданай мастачкі без дадатковай крыніцы не сцвярджаецца.')}],
    [2824721335,'I h.d.','/track/i-h-d',369,['social-commentary'],{aliases:['І г.д.']}],
    [1177160760,'Liod / Kryhalom','/track/liod-kryhalom',766,['love','hope'],{aliases:['Лёд','Крыгалом']}],
  ]),
];

const purpleMeta = {artist:'Purple Sunset',tags:['rock','electronic-rock','hard-rock','alternative-rock','art-rock','progressive-rock'],art:'sun'};
const purple2024 = 'https://purplesunsetband.bandcamp.com/album/novy-dzie';
const purple = [
  ...release({...purpleMeta,album:'Novy dzień',url:purple2024,year:2024,date:'2024-06-05'},[
    [3046238116,'Skarb','/track/skarb',240,['nature','travel'],{workId:'purple-sunset-skarb',aliases:['Скарб']}],
    [229924503,'Idealny čałaviek','/track/idealny-a-aviek',335,['censorship','resistance'],{aliases:['Ідэальны чалавек']}],
    [2046678827,'Horad-zdań','/track/horad-zda',305,['exile','urban-life'],{aliases:['Горад-здань'],summary:w('The published text depicts abandoned streets and people leaving for a different life. It does not identify a specific real city.','Опубликованный текст описывает опустевшие улицы и отъезд людей за другой жизнью. Конкретный реальный город не установлен.','Апублікаваны тэкст апісвае апусцелыя вуліцы і ад’езд людзей па іншае жыццё. Канкрэтны рэальны горад не вызначаны.')}],
    [4197998306,'Palaŭničy ci achviara','/track/pala-ni-y-ci-achviara',309,['identity'],{aliases:['Паляўнічы ці ахвяра']}],
    [34899693,'Kožnamu svajo','/track/ko-namu-svajo',264,['home','home-and-belonging','hope'],{aliases:['Кожнаму сваё']}],
    [1158228510,'Dziakuj, što ty jość','/track/dziakuj-to-ty-jo',257,['music','home','home-and-belonging'],{aliases:['Дзякуй, што ты ёсць'],summary:w('A listener finds a refuge in music at home. This text-level reading is not a therapeutic or calming-effect claim.','Слушатель находит убежище в музыке дома. Это прочтение текста, а не обещание лечебного или успокаивающего эффекта.','Слухач знаходзіць прытулак у музыцы дома. Гэта прачытанне тэксту, а не абяцанне лячэбнага ці заспакаяльнага эфекту.')}],
    [106998399,'Ciahnik u vyraj','/track/ciahnik-u-vyraj',362,['travel','time','hope'],{aliases:['Цягнік у вырай']}],
    [932237776,'Skarb (alternative version)','/track/skarb-alternative-version',270,['nature','travel'],{workId:'purple-sunset-skarb',aliases:['Скарб'],versionRelation:{type:'alternative-version-of',sourceArtist:'Purple Sunset',sourceTitle:'Skarb',evidenceUrl:purple2024},summary:w('An explicitly named alternative version of Skarb; linked to the same work without claiming an acoustic fingerprint match.','Прямо обозначенная альтернативная версия Skarb; связана с той же песней без утверждения о совпадении аудиоотпечатков.','Непасрэдна пазначаная альтэрнатыўная версія Skarb; звязана з той самай песняй без сцвярджэння пра супадзенне аўдыяадбіткаў.')}],
  ]),
  ...release({...purpleMeta,album:'Фіялетавы закат',url:'https://purplesunsetband.bandcamp.com/album/--2',year:2026,date:'2026-01-10'},[
    [617389935,'Калі мы сустрэнемся ізноў','/track/-',239,['friendship','hope']],
    [2835388969,'Не спяшайся жыць','/track/--2',262,['spring','time','hope']],
    [3036829622,'Фіялетавы закат','/track/--3',282,['night','urban-life'],{summary:w('A city at sunset and at night, as described in the lyrics. Night-time subject matter is not evidence of sleep-friendly sound.','Город на закате и ночью — по тексту песни. Ночная тема не доказывает, что звучание подходит для сна.','Горад на захадзе сонца і ўначы — паводле тэксту песні. Начная тэма не даказвае, што гучанне пасуе для сну.')}],
    [2705888892,'Штучныя людзі','/track/--4',276,['digital-culture','social-commentary']],
    [2967674573,'Ружовыя акуляры','/track/--5',254,['social-commentary','urban-life'],{summary:w('A critical portrait of status, credit and nightlife. Mentions of a dance floor are not a verified danceability tag.','Критический портрет статуса, кредита и ночной жизни. Упоминание танцпола не является проверенной меткой танцевальности.','Крытычны партрэт статусу, крэдыту і начнога жыцця. Згадка танцпола не з’яўляецца праверанай пазнакай танцавальнасці.')}],
    [1526118790,'Без душы','/track/--6',219,['loneliness','identity']],
    [440551917,'Кіруй стыхіяй','/track/--7',233,['nature','ecology']],
    [3912578282,'Адзін з тых','/track/--8',291,['identity','solidarity']],
    [1293602219,'Пачвары','/track/--9',334,['war','anti-violence']],
    [2536151638,'Ластаўка','/track/--10',232,['travel','humour'],{summary:w('Despite its bird-like title, the published text is about getting a car running; not a nature-song classification.','Несмотря на «птичье» название, текст — о попытке завести автомобиль; это не метка песни о природе.','Нягледзячы на «птушыную» назву, тэкст — пра спробу завесці аўтамабіль; гэта не пазнака песні пра прыроду.')}],
    [4080814864,'Зорка ў небе','/track/--12',294,['time','hope']],
    [3367695236,'Вясна','/track/--13',197,['spring','hope']],
  ]),
];

const adarMeta = {artist:'Adarvirog',tags:['metal','folk-metal','melodic-folk-metal'],aliases:['Адарвірог'],art:'forest',
  unknowns:['The songs contain imagined, literary or mythological narratives. Their plots are not verified accounts of real historical events; several include violence or adult language.']};
const adarvirog = [
  ...release({...adarMeta,album:'Kraj Padanniaŭ',url:'https://adarvirog.bandcamp.com/album/kraj-padannia',year:2017,date:'2017-07-01'},[
    [4131660173,'Adarvirog','/track/adarvirog',232,['mythology','home','home-and-belonging']],
    [4268604465,'Pieravaracień (Werewolf)','/track/pieravaracie-werewolf',216,['mythology','horror'],{aliases:['Пярэварацень']}],
    [3456167371,'Balada pra Paŭstanca Vaŭkalaku (Ballad of Rebel Vaukalaka)','/track/balada-pra-pa-stanca-va-kalaku-ballad-of-rebel-vaukalaka',310,['mythology','home','home-and-belonging','grief'],{aliases:['Балада пра паўстанца Ваўкалаку'],summary:w('A wounded rebel’s longing for home and loved ones in a werewolf ballad; the narrative is literary, not a verified event record.','Тоска раненого повстанца по дому и близким в балладе о волколаке; это литературный сюжет, а не проверенная хроника.','Туга параненага паўстанца па доме і блізкіх у баладзе пра ваўкалака; гэта літаратурны сюжэт, а не правераная хроніка.')}],
    [355627873,'Zabi Vyratavaĺnika (Kill the Savior)','/track/zabi-vyratava-nika-kill-the-savior',271,['resistance','mythology'],{aliases:['Забі выратавальніка']}],
    [2320484358,'Piesnia Bielaruskich Žaŭnieraŭ (Song of Belarusian Soldiers)','/track/piesnia-bielaruskich-a-niera-song-of-belarusian-soldiers',273,['historical-memory','war','freedom'],{aliases:['Песня беларускіх жаўнераў'],summary:w('The published words invoke Kościuszko and armed resistance. The recording was released in 2017; no historical recording date is invented.','Текст обращается к Касцюшке и вооружённому сопротивлению. Запись вышла в 2017 году; историческая дата записи не выдумывается.','Тэкст звяртаецца да Касцюшкі і ўзброенага супраціву. Запіс выйшаў у 2017 годзе; гістарычная дата запісу не выдумляецца.')}],
    [807165950,'Skroź Piekla (Through Hell)','/track/skro-piekla-through-hell',361,['war','love','grief'],{aliases:['Скрозь пекла']}],
    [2678317615,'Lisoŭčyki','/track/liso-yki',260,['historical-memory','war'],{aliases:['Лісоўчыкі']}],
    [2736209685,'Chareja (Chorea)','/track/chareja-chorea',306,['mythology','horror'],{aliases:['Харэя'],summary:w('A fictional dance-of-death narrative. The text’s reference to dancing does not establish DJ suitability or measured rhythm.','Фантастический сюжет о танце смерти. Упоминание танца в тексте не устанавливает пригодность для DJ-сета или измеренный ритм.','Фантастычны сюжэт пра танец смерці. Згадка танца ў тэксце не вызначае прыдатнасць для DJ-сэта ці вымераны рытм.')}],
    [2812428491,'Adarvirog II (From Hell with Love)','/track/adarvirog-ii-from-hell-with-love',266,['mythology','humour'],{summary:w('A further story featuring the Adarvirog character, not a second recording version of track Adarvirog.','Продолжение истории персонажа Адарвірог, а не вторая версия записи Adarvirog.','Працяг гісторыі персанажа Адарвірог, а не другая версія запісу Adarvirog.')}],
    [2694064202,'1863','/track/1863',292,['historical-memory','resistance','freedom'],{summary:w('A 2017 recording with an uprising-themed narrative and a historical year in its title. “1863” is not its release year.','Запись 2017 года с повстанческой темой и исторической датой в названии. «1863» — не год её выпуска.','Запіс 2017 года з паўстанцкай тэмай і гістарычнай датай у назве. «1863» — не год яго выпуску.')}],
  ]),
  ...release({...adarMeta,album:'Čornaje Sonca',url:'https://adarvirog.bandcamp.com/album/ornaje-sonca',year:2023,date:'2023-08-04'},[
    [3777375850,'Žach','/track/ach',211,['mythology','horror'],{aliases:['Жах']}],
    [3344737348,'Abadonna','/track/abadonna',198,['war','mythology'],{aliases:['Абадонна']}],
    [323744568,'Jurate','/track/jurate',246,['mythology','love','grief'],{aliases:['Юратэ'],summary:w('A Belarusian-language telling involving the sea figure Jūratė; a Baltic subject does not imply a Lithuanian-language recording.','Белорусский текст с образом морской Юратэ; балтийский сюжет не означает литовский язык записи.','Беларускі тэкст з вобразам марской Юратэ; балтыйскі сюжэт не азначае літоўскую мову запісу.')}],
    [2453755603,'Pieramiežža','/track/pieramie-a',202,['home','home-and-belonging','war'],{aliases:['Перамежжа']}],
    [3536839156,'Kali Zdradziŭ Sviet','/track/kali-zdradzi-sviet',275,['mythology','resistance'],{aliases:['Калі здрадзіў свет']}],
    [2829714022,'Karol','/track/karol',207,['mythology','horror'],{aliases:['Кароль']}],
    [3375971421,'Ciomnyja Vody','/track/ciomnyja-vody',251,['grief','home','home-and-belonging'],{aliases:['Цёмныя воды']}],
    [3123717916,'Abudžeńnie','/track/abud-e-nie',197,['resistance','solidarity','home','home-and-belonging'],{aliases:['Абуджэнне']}],
    [1517273481,'Pra Tych, Chto Nie Viartajecca','/track/pra-tych-chto-nie-viartajecca',223,['war','grief','longing'],{aliases:['Пра тых, хто не вяртаецца']}],
    [435608018,'Nia Varty','/track/nia-varty',260,['mythology'],{aliases:['Ня варты']}],
  ]),
];

const leibonikMeta = {artist:'Leibonik',tags:['rock'],aliases:['Лейбонік'],art:'dawn',
  unknowns:['The artist uses colloquial language, occasional short quotations and adult humour. This collection is not certified child-safe or wholly free of loanwords.']};
const leibonik = [
  ...release({...leibonikMeta,album:'Žaki',url:'https://leibonik.bandcamp.com/album/aki',year:2021,date:'2021-01-01'},[
    [69151418,'Oŭ Dža','/track/o-d-a',241,['music','humour'],{aliases:['Оў Джа'],summary:w('A satire about wanting to play reggae in an unwelcoming climate. Genre names in the text do not become measured genre tags.','Сатира о желании играть регги в неподходящем климате. Жанры из текста не превращаются в измеренные характеристики записи.','Сатыра пра жаданне граць рэгі ў непрыдатным клімаце. Жанры з тэксту не ператвараюцца ў вымераныя характарыстыкі запісу.')}],
    [772941727,'Barada Horrar (Beards I)','/track/barada-horrar-beards-i',214,['humour','horror'],{aliases:['Барада хорар'],summary:w('Adult absurdist humour about beards. The words “Beards I” do not establish a remix relationship to Beards II.','Взрослый абсурдистский юмор о бородах. Обозначение Beards I не доказывает ремикс-связь с Beards II.','Дарослы абсурдысцкі гумар пра бароды. Пазнака Beards I не даказвае рэмікс-сувязь з Beards II.')}],
    [3757243525,'Mars','/track/mars',324,['home','home-and-belonging','travel','love'],{aliases:['Марс'],summary:w('Love for Belarus meets an imagined journey to Mars. Space travel is a lyric narrative, not biographical data.','Любовь к Беларуси соединяется с воображаемым полётом на Марс. Космическое путешествие — сюжет, а не биографические данные.','Любоў да Беларусі спалучаецца з уяўным палётам на Марс. Касмічнае падарожжа — сюжэт, а не біяграфічныя звесткі.')}],
    [1082273466,'Zialonaja Višnia','/track/zialonaja-vi-nia',286,['wedding','longing','home','home-and-belonging'],{aliases:['Зялёная вішня'],summary:w('A bride’s distress and leaving home in the published text; not automatically a cheerful wedding playlist recommendation.','Переживания невесты и уход из родного дома — по тексту; не автоматическая рекомендация для весёлой свадебной подборки.','Перажыванні нявесты і сыход з роднага дома — паводле тэксту; не аўтаматычная парада для вясёлай вясельнай падборкі.')}],
    [1102600238,'Smačna i Hutka','/track/sma-na-i-hutka',348,['love','urban-life'],{aliases:['Смачна і хутка']}],
    [2582045319,'SZBM (Beards II)','/track/szbm-beards-ii',187,['love','humour'],{summary:w('Adult romantic and sexual humour; not marked suitable for children and not merged with Beards I.','Взрослый романтический и сексуальный юмор; пригодность для детей не заявляется, с Beards I не объединяется.','Дарослы рамантычны і сексуальны гумар; прыдатнасць для дзяцей не заяўляецца, з Beards I не аб’ядноўваецца.')}],
    [1215653364,'Žaki','/track/aki',184,['humour','memory'],{aliases:['Жакі'],summary:w('A recollection of Easter visiting becomes adult satire. A childhood reference does not make this a children’s song.','Воспоминание о пасхальных обходах переходит во взрослую сатиру. Упоминание детства не делает песню детской.','Успамін пра велікодныя абыходы пераходзіць у дарослую сатыру. Згадка дзяцінства не робіць песню дзіцячай.')}],
    [1878870790,'Cycy','/track/cycy',267,['love','humour'],{aliases:['Цыцы']}],
  ]),
  ...release({...leibonikMeta,album:'TAM',url:'https://leibonik.bandcamp.com/album/tam',year:2023,date:'2023-09-01'},[
    [2463927880,'Emigrant Song','/track/emigrant-song',155,['exile','home','home-and-belonging','longing'],{summary:w('People scattered across countries miss the places and relationships they left behind; the text directly addresses emigration.','Разъехавшиеся по разным странам люди скучают по оставленным местам и близким; текст прямо говорит об эмиграции.','Людзі, што раз’ехаліся па розных краінах, сумуюць па пакінутых мясцінах і блізкіх; тэкст наўпрост гаворыць пра эміграцыю.')}],
    [3372098592,'Hastroli','/track/hastroli',87,['travel','music','humour'],{aliases:['Гастролі']}],
    [90417827,'Slimak','/track/slimak',184,['travel','home','home-and-belonging'],{aliases:['Слімак']}],
    [3482372188,'Hramadzianin','/track/hramadzianin',113,['identity','protest','war'],{aliases:['Грамадзянін'],summary:w('An editorially identified political song about citizenship, repression and war; the classification is grounded in published words, not nationality.','Политическая тема гражданства, репрессий и войны определена редакционно по опубликованному тексту, а не национальности артиста.','Палітычная тэма грамадзянства, рэпрэсій і вайны вызначана рэдакцыйна паводле апублікаванага тэксту, а не нацыянальнасці артыста.')}],
    [2073519414,'Naviny','/track/naviny',144,['digital-culture','social-commentary','war'],{aliases:['Навіны']}],
    [2718421861,'Satyāgraha (feat Recha)','/track/saty-graha-feat-recha',180,['exile','protest','solidarity'],{artist:'Leibonik feat. Recha',aliases:['Сацьяграха','Рэха'],summary:w('A credited collaboration confronting endurance, prison and emigration. It is political reflection, not medical or coping advice.','Атрибутированная совместная запись о стойкости, тюрьме и эмиграции. Это политическое размышление, а не совет о здоровье.','Атрыбутаваны сумесны запіс пра стойкасць, турму і эміграцыю. Гэта палітычнае разважанне, а не парада пра здароўе.')}],
    [2043985404,'Oj Zakuj','/track/oj-zakuj',269,['exile','longing','home','home-and-belonging'],{aliases:['Ой, закуй']}],
    [3637937051,'Biełarusami','/track/bie-arusami',84,['identity','solidarity','protest'],{aliases:['Беларусамі'],summary:w('The text argues for mutual support and against passivity in the face of repression. A brief English phrase is present in the published Belarusian text.','Текст призывает к взаимной поддержке вместо покорности репрессиям. В белорусском тексте есть краткая английская вставка.','Тэкст заклікае да ўзаемнай падтрымкі замест пакорлівасці рэпрэсіям. У беларускім тэксце ёсць кароткая англійская ўстаўка.')}],
  ]),
];

const traditionalUrl = 'https://tradycyja.bandcamp.com/album/male-singing-tradition';
const traditionalEvidence = w(
  'The ethnographic publisher documents this collection as Belarusian male traditional singing, including Polesian dialects. Independent language review of every regional audio segment is still needed.',
  'Этнографический издатель документирует собрание как белорусское мужское традиционное пение, включая полесские говоры. Нужна независимая языковая проверка каждого регионального аудиофрагмента.',
  'Этнаграфічны выдавец дакументуе збор як беларускія мужчынскія традыцыйныя спевы, у тым ліку на палескіх гаворках. Патрэбная незалежная моўная праверка кожнага рэгіянальнага аўдыяфрагмента.'
);
const archival = (artist,aliases,recordingYear,extra={}) => ({artist,aliases,...(recordingYear ? {recordingYear} : {}),
  summary:w(
    `${artist}: a documented traditional vocal recording${recordingYear ? ` from ${recordingYear}` : ''}, released in this 2018 edition. Regional dialect and performance context remain visible at the source.`,
    `${aliases[0]}: документальная запись традиционного пения${recordingYear ? ` ${recordingYear} года` : ''} в издании 2018 года. Говор и контекст исполнения указаны в источнике.`,
    `${aliases[0]}: дакументальны запіс традыцыйных спеваў${recordingYear ? ` ${recordingYear} года` : ''} ў выданні 2018 года. Гаворка і кантэкст выканання пазначаныя ў крыніцы.`
  ), ...extra});
const hlushka = year => archival('Hlushkavichy male singing group',['Мужчынскі гурт вёскі Глушкавічы'],year,{performerCredits:['Іван Прыбора','Ілля Зенькавец','Еўдакім Маркевіч','Васіль Швед']});
const dubieika = () => archival('Stsiapan Dubieika',['Сцяпан Дубейка','Тонеж']);
const plytahony = extra => archival('Plytahony',['Плытагоны','Гаўрыльчыцы'],null,{performerCredits:['Сцяпан Адамавіч Бойка','Сцяпан Сцяпанавіч Лятчэня','Адам Адамавіч Бойка','Сцяпан Адамавіч Рыжко'],...extra});
const mokhau = () => archival('Mokhau male singing group',['Мужчынскі гурт вёскі Мохаў'],null,{performerCredits:['Арцём Міхайлавіч Анікеенка','Касцей Трахімавіч Дзегцярэнка','Лярывон Міхайлавіч Анікеенка','Адам Ігнатавіч Панцеляймонаў']});
const traditional = release({artist:'TRADYCYJA',album:'Мужчынская традыцыя спеву / Male singing tradition',url:traditionalUrl,year:2018,date:'2018-03-23',
  tags:['folk','traditional','ethno'],art:'forest',sourceName:'TRADYCYJA · ethnographic publisher',languageEvidence:traditionalEvidence,
  languageStatus:'publisher-traditional-belarusian-context',languageSource:traditionalUrl,languageScope:'ethnographic-release-description',
  languageBasis:'The ethnographic publisher identifies the collection as Belarusian male traditional singing and describes its Polesian villages and performers; dialect audio remains to be independently reviewed.',
  unknowns:['Do not infer the age of a song from the 2018 edition date, or a recording date from a performer’s birth year. Traditional texts can cross modern language and national boundaries.']},[
  [3430133731,'Косары косяць, а вецёр повевае','/track/mowers-are-mowing-the-wind-is-blowing',130,[],hlushka(1977)],
  [1845303247,'Не ходзі, козачэ по-над берэгамі','/track/dont-walk-by-the-river-bank-cossack',109,[],hlushka(1977)],
  [674752580,'Ой выйду я, ох, на ту гору, дзе збіралася любов','/track/i-will-go-up-the-hill-where-my-love-began',204,[],hlushka(1977)],
  [687217648,'За Сібіром да сонцэ всходіт','/track/the-sun-arises-over-siberia',295,[],hlushka(1977)],
  [1051204598,'Ох мой бацько цвет, зав’язаў мне свет','/track/5-my-dad-will-not-let-me-go',196,[],hlushka(1978)],
  [1677576914,'Ох у лузі на ставочку, на водзе','/track/in-the-meadow-on-the-pond-on-the-water',211,[],hlushka(1977)],
  [404206721,'Ох у лузі, в лузі на дубочку','/track/in-the-meadow-in-the-meadow-in-an-oak-tree',179,[],hlushka(1977)],
  [2876364464,'Ох, ты мамко ж вішня','/track/hey-mommy-cherry',61,[],dubieika()],
  [2735617307,'Чужы девкі як ягодкі, як ружовы кв’ят','/track/other-girls-are-like-berries-like-roses-in-bloom',106,[],dubieika()],
  [3778600087,'На турецкіх полях там нішчо, ох, не росцёт','/track/nothing-blossoms-in-the-fields-of-turkey',219,[],dubieika()],
  [294468836,'Ох, пойду я да цёмным лесом','/track/i-will-but-go-through-the-dark-woods',137,[],dubieika()],
  [1004977820,'Ох, ты жы, туман, да туманочок','/track/hey-fog-good-old-fog',103,[],dubieika()],
  [106544161,'Да вуступала, ох, да цёмна хмара','/track/when-a-dark-cloud-was-coming-out',165,[],dubieika()],
  [848276350,'Вой, журба ж ты, журбінка','/track/hey-you-sorrow-little-sorrow',153,[],plytahony()],
  [4145080774,'Ішлі хлопцы дарогаю (рэкруцкая)','/track/along-the-road-young-boys-were-going-song-of-recruits',169,[],plytahony({functions:['recruit-song'],functionBasis:'The publisher explicitly labels this named recording a recruit song.'})],
  [2063099038,'Два голубы гудзе, галубка варкоча','/track/two-pigeons-hum-the-dove-coos',148,[],mokhau()],
  [3776769155,'Валы сівы, валы палавыя','/track/grey-bulls-yellow-bulls',206,[],mokhau()],
  [1957025266,'А с-пад лесу, лесу цемныва (валачобная)','/track/18-and-out-of-the-woods-dark-woods-easter-song',228,[],archival('Ryhor Maretski',['Рыгор Марэцкі','Пірагі'],1989,{functions:['easter-round'],functionBasis:'The track title and album description explicitly identify a Valačobny/Easter-round song.'})],
  [2424286391,'Ой у ныдылю поранэнько (купальская балада)','/track/early-sunday-morning-midsummer-night-s-ballad',240,[],archival('Fiodar Klimchuk',['Фёдар Клімчук','Сіманавічы'],null,{functions:['midsummer-ritual'],functionBasis:'The publisher labels this recording a Kupalle/Midsummer ballad in the track title.'})],
]);

export const round3Catalog = [...leta,...prorva,...syndrom,...purple,...adarvirog,...leibonik,...traditional];
export const round3CatalogEvidence = {
  checked,recordCount:round3Catalog.length,workCount:new Set(round3Catalog.map(r=>r.workId)).size,
  primarySourceAccounts:new Set(round3Catalog.map(r=>new URL(r.sourceUrl).hostname)).size,
  creditedPerformerStrings:new Set(round3Catalog.map(r=>r.artist)).size,
  releasePages:new Set(round3Catalog.map(r=>r.albumUrl)).size,
  exactTrackPagesChecked:true,exactTrackPageCount:110,
  publicPlaybackAudited:false,audioLanguageAudited:false,audioFeaturesMeasured:false,publishedExternally:false,
  notes:'All 110 exact recording URLs returned HTTP 200 with matching numeric track ID, stream-enabled metadata and duration on 12 September 2026. 91 publisher texts and 19 ethnographic records were reviewed. This is not end-user playback, audio-language validation or participant evaluation. No audio, lyrics or artwork are copied.',
};
