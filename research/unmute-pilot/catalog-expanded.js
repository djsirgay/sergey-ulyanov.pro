// Curated public-source metadata reviewed 12 September 2026 (UTC).
// No audio, artwork or lyrics are copied. Public platform IDs enable opt-in official players.
// See data-research/expansion-20260912.md for sources, exclusions and verification boundaries.
const w = (en, ru, be) => ({en, ru, be});
const CHECKED = '2026-09-12';
// Existing seed recordings: IDs read from each exact public track page on CHECKED.
// All 18 pages returned HTTP 200, type=track and a stream-enabled metadata record.
// Page/metadata verification is not an end-user playback test.
export const existingEmbeds = Object.fromEntries([
  ['nurnberg-valasy','4062794301'],
  ['ana-znichka','3366339648'],
  ['nizkiz-pravily','1552025165'],
  ['ana-diamos','1002957154'],
  ['ana-marmi','1454620002'],
  ['trollwald-dva-troli','3880191872'],
  ['ana-kosmonavt','1214894773'],
  ['shuma-rano','1878445411'],
  ['mnimaya-os-kalykhanka-2023','560004098'],
  ['tochka-k-kalykhanka-2019','525979940'],
  ['koob-nie-chapai-2021','2243341578'],
  ['shuma-niuka-2025','3113886095'],
  ['irdorath-serca-raskolata-2020','1135343243'],
  ['shuma-zamova-2025','2835227215'],
  ['koob-swada-zubraniatka-2024','386550291'],
  ['tradycyja-pra-kosacku-2017','235831696'],
  ['tradycyja-kalychanka-2017','4090502327'],
  ['3mi-lullaby-2025','1235813752'],
].map(([recordId,trackId]) => [recordId,{provider:'bandcamp',type:'track',id:trackId}]));
const topicNames = {
  love:w('love','любовь','каханне'), longing:w('longing','тоска','туга'),
  city:w('city life','городская жизнь','гарадское жыццё'), loneliness:w('loneliness','одиночество','адзінота'),
  isolation:w('isolation','изоляция','ізаляцыя'), escape:w('escape','бегство','уцёкі'),
  relationships:w('relationships','отношения','стасункі'), water:w('water imagery','образ воды','вобраз вады'),
  fear:w('fear','страх','страх'), spring:w('spring','весна','вясна'),
  nature:w('nature','природа','прырода'), wedding:w('marriage','свадьба','вяселле'),
  family:w('family','семья','сям’я'), remembrance:w('remembrance','память','памяць'),
  history:w('historical memory','историческая память','гістарычная памяць'),
  protest:w('social protest','социальный протест','грамадскі пратэст'),
  resistance:w('resistance','сопротивление','супраціў'), migration:w('migration','миграция','міграцыя'),
  home:w('home','дом','дом'), friendship:w('friendship','дружба','сяброўства'),
  war:w('war','война','вайна'), 'anti-war':w('opposition to war','антивоенная тема','супрацьваенная тэма'),
  loss:w('loss','утрата','страта'), aging:w('aging','старение','старэнне'),
  anxiety:w('anxiety','тревога','трывога'), uncertainty:w('uncertainty','неопределённость','няпэўнасць'),
  winter:w('winter','зима','зіма'), christmas:w('winter carolling','колядование','каляды'),
  'shrovetide':w('Shrovetide','Масленица','Масленіца'),
  solidarity:w('solidarity','солидарность','салідарнасць'),
  chernobyl:w('Chernobyl','Чернобыль','Чарнобыль'),
  nightlife:w('nightlife','ночная жизнь','начное жыццё'), travel:w('travel','путешествия','падарожжы'),
  summer:w('summer','лето','лета'), autumn:w('autumn','осень','восень'),
  hope:w('hope','надежда','надзея'), prayer:w('prayer','молитва','малітва'),
  time:w('passing time','течение времени','плынь часу'), 'self-reflection':w('self-reflection','самоосмысление','самаасэнсаванне'),
};
const languageFromLyrics = w('Belarusian lyrics published for this recording. Not an independent audio-language audit.', 'Для этой записи опубликован белорусский текст. Аудиоязык независимо не проверялся.', 'Для гэтага запісу апублікаваны беларускі тэкст. Мова аўдыя незалежна не правяралася.');
const sourceTags = w('Styles are publisher labels, not measured audio features.', 'Стили — метки издателя, а не измеренные характеристики аудио.', 'Стылі — пазнакі выдаўца, а не вымераныя характарыстыкі аўдыя.');
const unknowns = [
  'Tempo, key, energy and acoustic similarity have not been measured.',
  'Listening-page availability is not verification of playback, lyrics-to-audio correspondence or redistribution permission.',
];
function bandcamp(meta, rows) {
  return rows.map(([trackId, title, path, duration, themes = [], extra = {}]) => {
    const url = new URL(path, meta.url).href;
    const id = `bc-${trackId}`;
    const topicText = lang => themes.map(t => topicNames[t]?.[lang] || t).join(', ');
    const summary = extra.summary || w(
      `From ${meta.album} (${meta.year}).${themes.length ? ` Published text: ${topicText('en')}.` : ' Open the artist’s recording and source notes.'}`,
      `Из ${meta.album} (${meta.year}).${themes.length ? ` Опубликованный текст: ${topicText('ru')}.` : ' Открой запись артиста и пояснения источника.'}`,
      `З ${meta.album} (${meta.year}).${themes.length ? ` Апублікаваны тэкст: ${topicText('be')}.` : ' Адкрый запіс артыста і тлумачэнні крыніцы.'}`,
    );
    return {
      id, title, artist:meta.artist, year:meta.year, language:'be', kind:'song',
      tags:[...meta.tags], themes, culturalFunctions:[], soundTags:[],
      listenUrl:url, listenLabel:'Bandcamp', sourceUrl:url,
      sources:[url, meta.url], sourceName:`${meta.artist} · artist/label Bandcamp`,
      album:meta.album, albumUrl:meta.url, summary,
      workId:id, checked:CHECKED, art:meta.art || 'waves',
      languageEvidence:meta.languageEvidence || languageFromLyrics,
      languageStatus:meta.languageStatus || 'publisher-lyrics-reviewed',
      tagScope:sourceTags,
      claims:[
        {field:'language', value:'be', method:meta.languageStatus || 'editorial-reading-of-publisher-lyrics', source:meta.languageSource || url},
        ...meta.tags.map(value => ({field:'style', value, method:'publisher-tag', scope:'release', source:meta.url})),
        ...themes.map(value => ({field:'theme', value, method:'editorial-text-reading', source:url, status:'interpretation'})),
      ],
      unknowns:[...unknowns, ...(meta.unknowns || [])],
      rhythm:{bpm:null, method:'not measured'}, durationSeconds:duration,
      durationBasis:'Public Bandcamp player metadata; rounded to seconds.',
      dateBasis:meta.dateBasis || 'Release year displayed on the artist/label release page; not the year of events described.',
      sourcePublicationDate:null, versionRelation:null,
      rightsStatus:'source-linked; redistribution not cleared',
      embed:{provider:'bandcamp', type:'track', id:String(trackId)},
      ...extra,
      aliases:[...(meta.aliases || []), ...(extra.aliases || [])],
    };
  });
}

const nurnberg = bandcamp({artist:'Nürnberg', aliases:['Нюрнберг','Nurnberg'], album:'Adkaz', year:2024,
  url:'https://nurnbergminsk.bandcamp.com/album/adkaz', tags:['rock','post-punk','coldwave'], art:'lines'}, [
  [1929267369,'Insomnia','/track/insomnia',190,['longing']],
  [2739398510,'Horad','/track/horad',187,['city','loneliness'],{aliases:['Горад','Город']}],
  [2913337126,'Adkaz','/track/adkaz',175,['isolation'],{aliases:['Адказ','Ответ']}],
  [2404778083,'Miesca','/track/miesca',209,['escape'],{aliases:['Месца','Место']}],
  [3956297895,'Adliha','/track/adliha',273,['relationships'],{aliases:['Адліга','Оттепель']}],
  [3135913542,'Vada','/track/vada',199,['water'],{aliases:['Вада','Вода']}],
  [514877096,'Strach','/track/strach',210,['fear'],{aliases:['Страх']}],
  [1597488723,'Pacalunak','/track/pacalunak',175,['relationships'],{aliases:['Пацалунак','Поцелуй']}],
]);

const navi = bandcamp({artist:'NAVIBAND', aliases:['Навибэнд','Навібэнд','Navi Band'], album:'Адной дарогай', year:2017,
  url:'https://naviband.bandcamp.com/album/-', tags:['folk','pop','rock','indie-folk','indie-pop'], art:'sun',
  languageStatus:'artist-declared-album-language', languageSource:'https://naviband.bandcamp.com/album/-',
  languageEvidence:w('The band explicitly says every song on this album is sung in Belarusian.','Группа прямо указывает: все песни этого альбома исполняются на белорусском.','Гурт наўпрост пазначае: усе песні гэтага альбома спяваюцца па-беларуску.'),
  dateBasis:'2017 release year. Bandcamp displays January 1 as a date placeholder; an exact day is not asserted.'}, [
  [4170861870,'Як я жыў без цябе','/track/--9',193],
  [1280086167,'А дзе жывеш ты?','/track/--10',222],
  [2233965950,'Уяўляй','/track/--11',209],
  [1686218633,'Навальніца','/track/--12',147],
  [195379354,'Восень','/track/--13',157],
  [3856409198,'Адной дарогай','/track/--14',214],
  [776364687,'Час прыйшоў','/track/--15',245],
  [1475122249,'Мы прачынаемся','/track/--16',308],
  [3051383185,'Далей','/track/--17',197],
]);

const roundDance = {
  tags:['folk','traditional','acoustic','dance'], culturalFunctions:['round-dance'],
  classificationNotes:w('The ensemble identifies this exact piece as a traditional round dance. This is not a club remix.', 'Ансамбль называет именно это произведение традиционным хороводом. Это не клубный ремикс.', 'Ансамбль называе менавіта гэты твор традыцыйным карагодам. Гэта не клубны рэмікс.'),
};
const astrouna = bandcamp({artist:'ASTROŪNA', aliases:['Астроўна','Astrouna'], album:'Вясна-красна, цёпла лецечка', year:2020,
  url:'https://astrouna.bandcamp.com/album/-', tags:['folk','traditional','acoustic'], art:'forest',
  languageStatus:'ensemble-declared-traditional-belarusian; regional-dialects',
  languageEvidence:w('The ensemble identifies these as Belarusian traditional songs; regional and borderland dialects are retained.', 'Ансамбль представляет эти песни как белорусские традиционные; сохранены региональные и пограничные диалекты.', 'Ансамбль прадстаўляе гэтыя песні як беларускія традыцыйныя; захаваныя рэгіянальныя і памежныя дыялекты.'),
  unknowns:['Regional-dialect labels follow the ensemble, not a completed linguistic review. Modern recording date is not the age of the traditional song.']}, [
  [3198421315,'Прыйшла весна','/track/-',212,['spring']],
  [33663324,'Бяроза белая','/track/--2',288,['nature','wedding']],
  [2758031347,'А ў нядзельку','/track/--3',160,['wedding'],{culturalFunctions:['easter-ritual']}],
  [2728520730,'Гуско','/track/--4',166,['nature']],
  [216511723,'Вол бушуе','/track/--5',194,['spring']],
  [2270746025,'Лялея вада','/track/--7',190,['water','wedding'],roundDance],
  [1266674917,'Вербачка','/track/--8',146,['nature']],
  [1168950206,'Ой пад Кіявам','/track/--9',161,['family','loss']],
  [1631460825,'Рано-рано','/track/--10',79,['spring']],
  [649168110,'Стрылка','/track/--11',277,['spring'],roundDance],
  [573789204,'Благаславі','/track/--12',220,['spring','family']],
  [1153541506,"Юр'ява маці",'/track/--13',120,['spring','nature']],
  [437283791,'Русалочкі','/track/--15',118,['spring']],
  [2576492011,'Як пушчу стралу','/track/--16',80,['family','loss']],
]);
for (const r of astrouna) {
  for (const value of r.culturalFunctions) r.claims.push({field:'cultural-function',value,method:'ensemble-description',source:r.albumUrl});
  if(r.tags.includes('dance'))r.claims.push({field:'style',value:'dance',scope:'track',method:'ensemble-description-of-round-dance',source:r.albumUrl});
}

const dzieciuki = bandcamp({artist:'Dzieciuki', aliases:['Дзецюкі','Дзецюки'], album:'Haradzenski Harmidar', year:2014,
  url:'https://dzieciuki.bandcamp.com/album/haradzenski-harmidar', tags:['folk','punk','folk-punk'], art:'lines'}, [
  [2113086336,'Мужыцкая праўда','/track/-',133,['history','resistance','protest']],
  [117720768,'Хлопцы-балахоўцы','/track/--2',199,['history','war']],
  [1863502200,'Сумнае рэггі','/track/--3',269,['history','remembrance','war']],
  [2995854866,'Косю','/track/--4',180,['home','resistance']],
  [3640245107,'Лясныя браты','/track/--5',186,['history','resistance']],
  [1544661766,'Карчма','/track/--6',234,['friendship','nightlife']],
  [2500333337,'Частуханы','/track/--7',200,['self-reflection']],
  [2824986194,'Забытая магiла','/track/i',295,['war','remembrance']],
  [3739146155,'Песня пра гарадзенскага гастрабайтара','/track/--8',189,['migration','home']],
  [2202646917,'Нашыя танкі','/track/--9',140,['protest'],{contentNote:w('Explicit language and violent political imagery.','Ненормативная лексика и образы политического насилия.','Ненарматыўная лексіка і вобразы палітычнага гвалту.')}],
]);

const relikt = bandcamp({artist:'Relikt', aliases:['Re1ikt','Рэлікт','Реликт'], album:'Ramantyzm', year:2026,
  url:'https://relikt-belarus.bandcamp.com/album/ramantyzm', tags:['rock','folk','grunge','post-rock','progressive-rock'], art:'forest'}, [
  [546126279,'Kiparys','/track/kiparys',258,['relationships','loss'],{aliases:['Кіпарыс']}],
  [1050406220,'Scizoryk','/track/scizoryk-2',340,['city','isolation'],{aliases:['Сцізорык']}],
  [1983439804,'Chrustaĺ','/track/chrusta',288,['nature','prayer'],{aliases:['Хрусталь']}],
  [3950787447,'Niekrafon','/track/niekrafon',321,['home','loss'],{aliases:['Некрафон']}],
  [2849734238,'Sivyya valasy','/track/sivyya-valasy',297,['aging','loss'],{aliases:['Сівыя валасы']}],
  [3077763073,'Bursoniki','/track/bursoniki-2',437,['isolation'],{aliases:['Бурсонікі']}],
  [2991968932,'Losk','/track/losk-2',268,['friendship','hope'],{aliases:['Лоск']}],
  [320884769,'Anemoia','/track/anemoia',322,['time','loss'],{aliases:['Анемоя']}],
]);

const vapna = bandcamp({artist:'Vapna', aliases:['Вапна'], album:'Amal', year:2025,
  url:'https://radioplato.bandcamp.com/album/amal', tags:['electronic','indie','post-punk'], art:'waves'}, [
  [2895991220,'La Mora','/track/la-mora',180,['water','nature'],{aliases:['Ля мора']}],
  [3573038616,'1000 Krain','/track/1000-krain-2',243,['travel','anxiety'],{aliases:['1000 краін'],soundTags:['dreamy']}],
  [2238042935,'Voziera Sloz','/track/voziera-sloz',265,['water','loss'],{aliases:['Возера слёз']}],
  [2740609283,'Try Kancy','/track/try-kancy',245,['uncertainty'],{aliases:['Тры канцы']}],
  [1539953314,'Mama Kazala','/track/mama-kazala',266,['family','uncertainty'],{aliases:['Мама казала'],soundTags:['dreamy']}],
  [2497107544,'Amal','/track/amal',246,['anxiety','solidarity'],{aliases:['Амаль'],soundTags:['dreamy']}],
  [2696061877,'Skul','/track/skul',245,['relationships','loss'],{aliases:['Скуль']}],
  [520423310,'Redki Vid','/track/redki-vid-2',245,['nature','loss'],{aliases:['Рэдкі від']}],
  [3203739073,'Čorny Smoŭž','/track/orny-smo',248,['nature'],{aliases:['Чорны смоўж']}],
  [1639874323,'Palohka','/track/palohka',274,['self-reflection'],{aliases:['Палёгка']}],
]);
for(const r of vapna.filter(r=>r.soundTags.includes('dreamy'))) {
  r.claims.push({field:'sound',value:'dreamy',method:'publisher-description',source:r.albumUrl,scope:'named-track-in-release-description',status:'subjective-description-not-measurement'});
}

const shuma = bandcamp({artist:'Shuma', aliases:['Šuma','Шума'], album:'Bahna', year:2025,
  url:'https://shumaduo.bandcamp.com/album/bahna', tags:['electronic','folk','hypnotic-techno','dance'], art:'waves'}, [
  [718277530,'Maslenica','/track/maslenica',331,['shrovetide','spring'],{aliases:['Масленіца','Масленица']}],
  [624787804,'Koleda','/track/koleda',308,['christmas','family'],{aliases:['Каляда','Коляда'],culturalFunctions:['winter-carol']}],
]);
for(const r of shuma) {
  const dance=r.claims.find(c=>c.field==='style'&&c.value==='dance');
  dance.method='artist-described-dance-purpose';
  r.unknowns.push('Dance is the artist-described purpose of this release, not a measured danceability score.');
  for(const value of r.culturalFunctions)r.claims.push({field:'cultural-function',value,method:'artist-description-and-published-text',source:r.albumUrl});
}

const amaroka = bandcamp({artist:'AMAROKA', aliases:['Амарока'], album:'PASTKA', year:2013,
  url:'https://amaroka.bandcamp.com/album/pastka', tags:['punk','rock','pop-punk','punk-rock'], art:'lines'}, [
  [1743370286,'Štučny śviet','/track/tu-ny-viet',221,['protest'],{aliases:['Штучны свет']}],
  [4209921681,'Pank-rok nazaŭždy','/track/pank-rok-naza-dy',233,['love','solidarity'],{aliases:['Панк-рок назаўжды']}],
  [648558747,'Hubliaju kachańnie','/track/hubliaju-kacha-nie',331,['love','loss'],{aliases:['Губляю каханне']}],
  [2738540625,'Pradajem','/track/pradajem',260,['protest'],{aliases:['Прадаем']}],
  [2756182932,'Zamiataje zima','/track/zamiataje-zima',279,['winter','love'],{aliases:['Замятае зіма']}],
  [337211923,'Fliuhier','/track/fliuhier',288,['hope','self-reflection'],{aliases:['Флюгер']}],
  [3676617314,'Razryvaješ','/track/razryvaje',278,['relationships','loss'],{aliases:['Разрываеш']}],
  [1068797573,'Liudzi','/track/liudzi',296,['chernobyl','protest'],{aliases:['Людзі']}],
  [1147792916,'Tvoj aŭtamat','/track/tvoj-a-tamat',240,['war','anti-war','protest'],{aliases:['Твой аўтамат']}],
]);

const luty = bandcamp({artist:'luty sakavik', aliases:['Люты сакавік','Лютый сакавик'], album:'Bol Jon Moj', year:2020,
  url:'https://lutysakavik.bandcamp.com/album/bol-jon-moj', tags:['electronic','pop','post-punk','coldwave','synthpop'], art:'lines'}, [
  [3025087496,'Strach','/track/strach',239,['fear','relationships'],{aliases:['Страх']}],
  [3157405711,'Niuansy','/track/niuansy',212,['nightlife'],{aliases:['Нюансы']}],
  [3516134324,'Melancholija','/track/melancholija',225,['travel','anxiety'],{aliases:['Меланхолія']}],
  [473561943,'Nienavidžu Paryž','/track/nienavid-u-pary',156,['travel','city'],{aliases:['Ненавіджу Парыж']}],
  [2521337951,'Bieź Ciabie (pavodle Krambambuli)','/track/bie-ciabie-pavodle-krambambuli',241,['love','longing'],{
    aliases:['Без цябе','Krambambula','Крамбамбуля'],kind:'cover',workId:'krambambula-biez-ciabie',
    versionRelation:{type:'cover-of',sourceArtist:'Krambambula',sourceTitle:'Без цябе',evidenceUrl:'https://lutysakavik.bandcamp.com/track/bie-ciabie-pavodle-krambambuli'},
  }],
  [1566677189,'Herbary','/track/herbary',232,['relationships','fear'],{aliases:['Гербарый']}],
  [724277537,'Paasobku','/track/paasobku',245,['relationships','isolation'],{aliases:['Паасобку']}],
  [1014551209,'Hoły','/track/ho-y',265,['relationships'],{aliases:['Голы']}],
]);
luty.find(r=>r.kind==='cover').claims.push({field:'version-relation',value:'cover-of Krambambula: Без цябе',method:'artist-title-credit',source:'https://lutysakavik.bandcamp.com/track/bie-ciabie-pavodle-krambambuli'});

const mnimaya = bandcamp({artist:'Мнімая Ось', aliases:['Mnimaya Os','Mnimaja Vos','Мнимая Ось'], album:'Тутака-Тамака', year:2023,
  url:'https://mnimayaos.bandcamp.com/album/--2', tags:['acoustic','folk','indie-folk','singer-songwriter'], art:'forest'}, [
  [4224259127,'Зіма','/track/--19',83,['winter','relationships']],
  [3176166484,'Птушка','/track/--20',277,['spring','love']],
  [2154820749,'Лета','/track/--21',157,['summer','hope']],
  [3205421724,'Восень','/track/--22',181,['autumn']],
  [2625202357,'Малітва','/track/--23',202,['prayer','nature']],
  [2257521560,'Настане дзень','/track/--24',116,['hope','home']],
  [3973421665,'Сэрца','/track/--25',217,['longing']],
  [2310055373,'Так марна','/track/--26',279,['time','self-reflection']],
  // Калыханка /track/--27 already exists in catalog-extra.js; do not duplicate that recording.
  [3414991576,'Дзе мой дом / А па морачку','/track/--28',319,['home','travel']],
]);

const soyuz = bandcamp({artist:'СОЮЗ / SOYUZ', aliases:['SOYUZ','СОЮЗ'], album:'KROK', year:2025,
  url:'https://gruppasoyuz.bandcamp.com/album/krok', tags:['jazz','avant-pop','folk'], art:'sun',
  languageStatus:'artist-label-recording-statement',languageSource:'https://gruppasoyuz.bandcamp.com/track/krok',
  languageEvidence:w('The artist/label identifies this exact song as Chumak’s first adult song written in Belarusian.', 'Артист/лейбл называет именно эту песню первой написанной Чумаком по-белорусски во взрослом возрасте.', 'Артыст/лэйбл называе менавіта гэтую песню першай напісанай Чумаком па-беларуску ў дарослым узросце.')}, [
  [2529283070,'Крок / Krok','/track/krok',186,['migration','uncertainty'],{
    summary:w('A Belarusian-language song about migration and stepping into the unknown; the label describes its unusual samba arrangement.', 'Белорусскоязычная песня о миграции и шаге в неизвестность; лейбл отмечает необычную аранжировку самбы.', 'Беларускамоўная песня пра міграцыю і крок у невядомасць; лэйбл адзначае незвычайную аранжыроўку самбы.'),
    tags:['jazz','avant-pop','folk','samba'],
  }],
]);
soyuz[0].claims = [
  {field:'language',value:'be',method:'artist-label-recording-statement',source:soyuz[0].sourceUrl},
  {field:'theme',value:'migration',method:'artist-label-description',source:soyuz[0].sourceUrl},
  {field:'theme',value:'uncertainty',method:'artist-label-description',source:soyuz[0].sourceUrl},
  {field:'style',value:'samba',method:'artist-label-description',source:soyuz[0].sourceUrl},
  ...['jazz','avant-pop','folk'].map(value=>({field:'style',value,method:'publisher-tag',scope:'release',source:soyuz[0].albumUrl})),
];

// The performer credits matter: this is not nineteen records attributed to an anonymous playlist.
const lullabyRows = [
  [1810683328,'Лю-лі, лю-лі, лю-лі, пайшоў коцік у гулі','Сяржук Доўгушаў',61],
  [1810683329,'А-аа, коткі два','VOLYA',49],
  [1810683330,'Ай, люлі-люлі-люлі, да ўсе дзеткі малыя паснулі','Яўгенія Чачура',62],
  [1810683331,'Бегла мушка па капусці','Таццяна Чорная',20],
  [1810683332,'Да люлі-люлі, да ты ж, мое дзіцятко','Таццяна Юнчыц',116],
  [1810683333,'А ты, каток шэры','VOLYA',43],
  [1810683334,'Ах, вы коцікі-каты','Еўфрасіння Цішкова',39],
  [1810683335,'Лю-лі, лю-лі, лю-лі спаць, а я буду колыхаць','VOLYA',110],
  [1810683336,'Пайшоў коцік па плату','Алена Герасімава',28],
  [1810683337,'Спі, мой сынку, спі, сынок','VOLYA',78],
  [1810683338,'Баю, баю, Несцерка','VOLYA',58],
  [1810683339,'Лю-лі, лю-лі, лю-лі, прыляцелі гулі','Рыгор Барадулін',42],
  [1810683340,'А-а-ай, люлі','Ганна Сакалоўская',73],
  [1810683341,'Лю-лі, лю-лі, лю-лі, прылэцілі гулі','Ніна Міневіч і Надзея Супрун',74],
  [1810683342,'Лю-лі, лю-лі, лю-лі, прыляцелі куры','VOLYA',45],
  [1810683343,'Пайшоў коцік у лясок','VOLYA',19],
  [1810683344,'А-а, дзетка, спаць','Наталля Марковіч',21],
  [1810683345,'Ай, лю-лю, мой маленькі каралю','VOLYA',82],
  [1810683346,'Лю-лі, лю-лі, лю-лі спаць','Ядвіга Альфер',24],
];
const lullabies = lullabyRows.map(([trackId,title,performer,durationSeconds]) => {
  const url=`https://music.apple.com/us/album/${encodeURIComponent(title)}/1810683327?i=${trackId}`;
  const albumUrl='https://music.apple.com/us/album/'+encodeURIComponent('беларускія-калыханкі')+'/1810683327';
  return {
    id:`apple-${trackId}`,title,artist:`${performer} · Tradycyja`,performer,publisher:'Tradycyja',
    aliases:['Беларускія калыханкі','Belarusian lullabies','Белорусские колыбельные',performer],
    year:2025,language:'be',kind:'song',tags:['folk','traditional'],themes:['sleep','family'],culturalFunctions:['lullaby'],soundTags:[],
    listenUrl:url,listenLabel:'Apple Music',sourceUrl:url,sources:[url,albumUrl,'https://soundcloud.com/tradycyja/sets/kalychanki','https://open.spotify.com/album/6u3QpJlZ9BSsPRcsRGThg2'],
    sourceName:'Tradycyja · authorized Apple Music release',album:'Беларускія Калыханкі',albumUrl,
    summary:w(`A short traditional lullaby performed by ${performer}. The publisher’s lullaby classification is confirmed; a sleep benefit is not claimed.`, `Короткая традиционная колыбельная: ${performer}. Функцию подтверждает классификация издателя; эффект на сон не заявляется.`, `Кароткая традыцыйная калыханка: ${performer}. Функцыю пацвярджае класіфікацыя выдаўца; эфект для сну не заяўляецца.`),
    workId:`apple-${trackId}`,checked:CHECKED,art:'dawn',
    languageEvidence:w('Publisher’s Belarusian-lullabies release; regional dialects retained. Audio-language review is still separate.', 'Релиз издателя «Беларускія Калыханкі», с региональными диалектами. Проверка языка аудио остаётся отдельным этапом.', 'Рэліз выдаўца «Беларускія Калыханкі», з рэгіянальнымі дыялектамі. Праверка мовы аўдыя застаецца асобным этапам.'),
    languageStatus:'publisher-declared-belarusian-traditional',
    tagScope:w('Publisher’s Lullabies category, not an inferred function from an individual song title.', 'Категория издателя Lullabies, а не функция, выведенная из названия отдельной песни.', 'Катэгорыя выдаўца Lullabies, а не функцыя, выведзеная з назвы асобнай песні.'),
    claims:[
      {field:'language',value:'be',method:'publisher-album-identity',source:albumUrl},
      {field:'cultural-function',value:'lullaby',method:'publisher-recording-category',source:url},
      {field:'theme',value:'sleep',method:'lullaby-function-context',source:url},
      {field:'theme',value:'family',method:'traditional-lullaby-context',source:url},
      {field:'style',value:'folk',method:'publisher-traditional-music-collection',source:'https://soundcloud.com/tradycyja/sets/kalychanki'},
      {field:'style',value:'traditional',method:'publisher-traditional-music-collection',source:'https://soundcloud.com/tradycyja/sets/kalychanki'},
    ],
    unknowns:[...unknowns,'Some tracks are very short. No sleep, child-safety or therapeutic efficacy claim. Similar traditional titles are not automatically merged into one work.'],
    rhythm:{bpm:null,method:'not measured'},durationSeconds,durationBasis:'Apple public catalog recording duration, rounded to seconds.',
    dateBasis:'April 25, 2025 digital release, not the dates of field recordings or the age of the songs.',
    sourcePublicationDate:null,versionRelation:null,rightsStatus:'source-linked; redistribution not cleared',
  };
});

// Interleave sources so opening the collection does not resemble one artist’s full discography.
const groups=[lullabies,nurnberg,navi,astrouna,dzieciuki,relikt,vapna,shuma,amaroka,luty,mnimaya,soyuz];
export const expandedCatalog=Array.from({length:Math.max(...groups.map(g=>g.length))},(_,i)=>groups.flatMap(g=>g[i]?[g[i]]:[])).flat();
for(const r of expandedCatalog) {
  if(r.themes.includes('home'))r.themes.push('home-and-belonging');
  for(const claim of r.claims) {
    claim.scope ||= claim.field==='language'&&r.languageStatus.includes('album')?'release':'track';
    claim.basis ||= claim.field==='language' ? r.languageEvidence.en
      : claim.method==='editorial-text-reading' ? 'Editorial theme reading of the publisher’s text; not an artist-verified classification.'
      : claim.field==='cultural-function'&&claim.value==='lullaby' ? 'The authorized recording is categorized as Lullabies by the publisher.'
      : claim.method==='publisher-description' ? 'The release description explicitly names this recording as dreamy indie pop; this is subjective source language, not audio analysis.'
      : claim.method==='artist-described-dance-purpose' ? 'The artist describes the release as a remembrance ritual intended for dancing.'
      : 'Publisher/artist metadata or description at the linked source; no audio measurement.';
  }
  if(r.themes.includes('home-and-belonging'))r.claims.push({...r.claims.find(c=>c.field==='theme'&&c.value==='home'),value:'home-and-belonging'});
}
export const expandedCatalogEvidence={
  reviewed:CHECKED,recordCount:expandedCatalog.length,
  directLinkCount:expandedCatalog.filter(r=>r.listenUrl).length,
  bandcampEmbedCount:expandedCatalog.filter(r=>r.embed?.provider==='bandcamp').length,
  lullabyCount:lullabies.length,
  sourceGroups:groups.length,
  limits:'A source-reviewed seed collection, not a comprehensive Belarusian archive, automated music analysis, verified playback audit or representative-user research.',
};
