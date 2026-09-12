// Editorial query taxonomy, not an audio classifier or additional source claim.
// The directed edges below broaden a request to documented subgenre labels.
// They do not write parent tags into recordings, infer danceability or rank music.
export const genreParents = {
  'alternative-rock':['rock'], 'art-rock':['rock'], 'hard-rock':['rock'],
  krautrock:['rock'], 'psychedelic-rock':['rock'], 'progressive-rock':['rock'],
  'post-rock':['rock'], 'indie-rock':['rock'], grunge:['rock'],
  'punk-rock':['punk','rock'], 'pop-punk':['punk-rock'], 'folk-punk':['punk','folk'],
  'post-punk':['rock'], 'pop-rock':['pop','rock'], 'electronic-rock':['electronic','rock'],
  'black-metal':['metal'], 'post-metal':['metal'], 'folk-metal':['folk','metal'],
  'melodic-folk-metal':['folk-metal'],
  traditional:['folk'], 'indie-folk':['folk'], 'folk-pop':['folk','pop'],
  'folk-fusion':['folk'], 'medieval-folk':['folk'], neofolk:['folk'], 'pagan-folk':['folk'],
  'acoustic-folk':['folk','acoustic'], folktronica:['folk','electronic'],
  'indie-pop':['pop'], 'avant-pop':['pop'], electropop:['electronic','pop'],
  synthpop:['electronic','pop'], techno:['electronic'], 'hypnotic-techno':['techno'],
  trance:['electronic'], electroacoustic:['electronic'],
};

// Related topics are intentionally NOT synonyms or matching expansions.
export const relatedTopics = {
  memory:['remembrance','historical-memory'], remembrance:['memory','grief'],
  grief:['loss','remembrance'], loss:['grief'], exile:['migration'], migration:['exile'],
  'urban-life':['city'], night:['nightlife'], 'literary-adaptation':['literature'],
};

// [English, Belarusian, Russian]. Root UI can merge these without overwriting
// existing unrelated interface text. Raw catalogue descriptions remain unchanged.
export const taxonomyLabels = {
  folk:['Folk','Фолк','Фолк'], rock:['Rock','Рок','Рок'], metal:['Metal','Метал','Метал'],
  pop:['Pop','Поп','Поп'], electronic:['Electronic','Электроніка','Электроника'],
  acoustic:['Acoustic','Акустычная музыка','Акустическая музыка'], techno:['Techno','Тэхна','Техно'],
  'alternative-rock':['Alternative rock','Альтэрнатыўны рок','Альтернативный рок'],
  'art-rock':['Art rock','Арт-рок','Арт-рок'], 'hard-rock':['Hard rock','Хард-рок','Хард-рок'],
  krautrock:['Krautrock','Краўт-рок','Краут-рок'],
  'psychedelic-rock':['Psychedelic rock','Псіхадэлічны рок','Психоделический рок'],
  'progressive-rock':['Progressive rock','Прагрэсіўны рок','Прогрессивный рок'],
  'post-rock':['Post-rock','Пост-рок','Пост-рок'], 'indie-rock':['Indie rock','Індзі-рок','Инди-рок'],
  grunge:['Grunge','Гранж','Гранж'], punk:['Punk','Панк','Панк'], indie:['Indie','Індзі','Инди'],
  'punk-rock':['Punk rock','Панк-рок','Панк-рок'], 'pop-punk':['Pop punk','Поп-панк','Поп-панк'],
  'folk-punk':['Folk punk','Фолк-панк','Фолк-панк'], 'pop-rock':['Pop rock','Поп-рок','Поп-рок'],
  'electronic-rock':['Electronic rock','Электронны рок','Электронный рок'],
  'folk-metal':['Folk metal','Фолк-метал','Фолк-метал'],
  'melodic-folk-metal':['Melodic folk metal','Меладычны фолк-метал','Мелодичный фолк-метал'],
  'black-metal':['Black metal','Блэк-метал','Блэк-метал'], 'post-metal':['Post-metal','Пост-метал','Пост-метал'],
  'indie-folk':['Indie folk','Індзі-фолк','Инди-фолк'], 'folk-pop':['Folk pop','Фолк-поп','Фолк-поп'],
  'folk-fusion':['Folk fusion','Фолк-ф’южн','Фолк-фьюжн'], 'medieval-folk':['Medieval folk','Сярэднявечны фолк','Средневековый фолк'],
  neofolk:['Neofolk','Неафолк','Неофолк'], 'pagan-folk':['Pagan folk','Паганскі фолк','Языческий фолк'],
  'acoustic-folk':['Acoustic folk','Акустычны фолк','Акустический фолк'],
  'indie-pop':['Indie pop','Індзі-поп','Инди-поп'], 'avant-pop':['Avant-pop','Авангардны поп','Авангардный поп'],
  electropop:['Electropop','Электрапоп','Электропоп'], synthpop:['Synthpop','Сінт-поп','Синти-поп'],
  'hypnotic-techno':['Hypnotic techno','Гіпнатычнае тэхна','Гипнотическое техно'],
  'singer-songwriter':['Singer-songwriter','Аўтар-выканаўца','Автор-исполнитель'],
  samba:['Samba','Самба','Самба'], coldwave:['Coldwave','Колдвэйв','Колдвейв'],
  club:['Club (source genre label)','Клубная музыка (пазнака крыніцы)','Клубная музыка (метка источника)'],
  traditional:['Traditional','Традыцыйная музыка','Традиционная музыка'],
  memory:['Memory / recollection','Успаміны','Воспоминания'],
  remembrance:['Remembrance / commemoration','Ушанаванне памяці','Поминовение / увековечение памяти'],
  grief:['Grief / mourning','Гора / жалоба','Горе / скорбь'], loss:['Loss','Страта','Утрата'],
  exile:['Exile','Выгнанне','Изгнание'], migration:['Migration / emigration','Міграцыя / эміграцыя','Миграция / эмиграция'],
  censorship:['Censorship','Цэнзура','Цензура'], 'digital-culture':['Digital culture','Лічбавая культура','Цифровая культура'],
  ecology:['Ecology','Экалогія','Экология'], fantasy:['Fantasy','Фэнтэзі','Фэнтези'],
  'historical-memory':['Historical memory','Гістарычная памяць','Историческая память'],
  horror:['Horror','Жахі','Ужасы'], humour:['Humour','Гумар','Юмор'],
  identity:['Identity','Ідэнтычнасць','Идентичность'],
  'literary-adaptation':['Literary adaptation','Літаратурная адаптацыя','Литературная адаптация'],
  music:['Music as a subject','Музыка як тэма','Музыка как тема'], mythology:['Mythology','Міфалогія','Мифология'],
  night:['Night','Ноч','Ночь'], nostalgia:['Nostalgia','Настальгія','Ностальгия'],
  'social-commentary':['Social commentary','Сацыяльны каментар','Социальный комментарий'],
  'urban-life':['Urban life','Гарадское жыццё','Городская жизнь'], work:['Work / labour','Праца','Труд / работа'],
  'recruit-song':['Recruit song','Рэкруцкая песня','Рекрутская песня'],
  'easter-round':['Valačobny / Easter-round song','Валачобная песня','Волочебная песня'],
  'protest-2020':['2020 protests','Пратэсты 2020 года','Протесты 2020 года'],
  'protecting-family':['Protecting family','Абарона сям’і','Защита семьи'],
  'bedtime-and-care':['Bedtime and care','Догляд перад сном','Забота перед сном'],
  insomnia:['Insomnia','Бяссонніца','Бессонница'],
  'comfort-and-hope':['Comfort and hope','Суцяшэнне і надзея','Утешение и надежда'],
  'weather-and-protection':['Weather and protection','Надвор’е і абарона','Погода и защита'],
  'dancing-and-desire':['Dancing and desire','Танцы і жаданне','Танцы и желание'],
  death:['Death','Смерць','Смерть'], violence:['Violence','Гвалт','Насилие'],
  'lullaby-derived':['Derived from a lullaby','Паходзіць ад калыханкі','Производная от колыбельной'],
  'wedding-song':['Wedding song','Вясельная песня','Свадебная песня'],
};

export const taxonomyAliases = {
  genres: {
    'alternative-rock':['alternative rock','альтернативный рок','альтэрнатыўны рок','альтернативный-рок','альтэрнатыўны-рок'],
    'art-rock':['art rock','арт рок','арт-рок'], 'hard-rock':['hard rock','хард рок','хард-рок'],
    krautrock:['kraut rock','краутрок','краут-рок','краўтрок','краўт-рок'],
    'psychedelic-rock':['psychedelic rock','психоделический рок','псіхадэлічны рок'],
    'progressive-rock':['progressive rock','prog rock','прогрессивный рок','прагрэсіўны рок','прог-рок'],
    'post-rock':['post rock','пост-рок','пост рок'], 'indie-rock':['indie rock','инди-рок','індзі-рок'],
    grunge:['гранж'], punk:['панк'], indie:['инди','індзі'],
    'punk-rock':['панк-рок'], 'pop-punk':['поп-панк'], 'folk-punk':['фолк-панк','фольк-панк'],
    'pop-rock':['поп-рок'], 'electronic-rock':['электронный-рок','электронны-рок'],
    'folk-metal':['фолк-метал','фолк-металл','фольк-метал'],
    'melodic-folk-metal':['melodic folk metal','melodic folk-metal','мелодичный фолк-метал','мелодический фолк-метал','меладычны фолк-метал'],
    'black-metal':['black metal','блэк-метал','блэк-металл','блэк метал'],
    'post-metal':['post metal','постметал','пост-метал'],
    'indie-folk':['indie folk','инди-фолк','індзі-фолк'], 'folk-pop':['фолк-поп'],
    'folk-fusion':['folk fusion','фолк-фьюжн','фолк-ф’южн','фолк-фюжн'],
    'medieval-folk':['medieval folk','средневековый фолк','сярэднявечны фолк'],
    neofolk:['neo-folk','неофолк','неафолк'], 'pagan-folk':['pagan folk','языческий фолк','паганскі фолк'],
    'acoustic-folk':['акустик-фолк'], 'indie-pop':['indie pop','инди-поп','індзі-поп'],
    'avant-pop':['avant pop','авангардный поп','авангардны поп','авант-поп'],
    electropop:['electro-pop','electro pop','электропоп','электра-поп','электрапоп'],
    synthpop:['synth-pop','synth pop','синт-поп','синти-поп','сінт-поп'],
    'hypnotic-techno':['hypnotic techno','гипнотическое техно','гіпнатычнае тэхна'],
    'singer-songwriter':['singer songwriter','автор-исполнитель','аўтар-выканаўца'],
    samba:['самба'], coldwave:['cold wave','колдвейв','колдвэйв'],
    club:['club-music','клубная музыка','клубную музыку','клубная-музыка'],
    traditional:['традишнл'],
  },
  topics: {
    memory:['memories','recollection','recollections','память','памяти','воспоминания','воспоминаний','памяць','памяці','успаміны','успамінаў'],
    remembrance:['commemoration','поминовение','поминовении','увековечение памяти','ушанаванне памяці','ушанавання памяці'],
    grief:['mourning','горе','горя','скорбь','скорби','траур','гора','смутак','жалоба','жалобы'],
    exile:['exiled','изгнание','изгнании','изгнания','выгнанне','выгнанні','выгнання'],
    censorship:['цензура','цензуры','цензуре','цэнзура','цэнзуры'],
    'digital-culture':['digital culture','цифровая культура','цифровой культуре','лічбавая культура','лічбавую культуру'],
    ecology:['экология','экологии','экологию','экалогія','экалогіі','экалогію'],
    fantasy:['фэнтези','фэнтэзі'],
    'historical-memory':['historical memory','историческая память','исторической памяти','гістарычная памяць','гістарычнай памяці'],
    horror:['ужасы','ужасов','хоррор','жахі','жахаў','жах'],
    humour:['humor','юмор','юмора','юморе','гумар','гумару','гумары'],
    identity:['идентичность','идентичности','ідэнтычнасць','ідэнтычнасці'],
    'literary-adaptation':['literary adaptation','literary adaptations','литературная адаптация','литературные адаптации','літаратурная адаптацыя','літаратурныя адаптацыі'],
    music:['about music','про музыку','о музыке','пра музыку','аб музыцы'],
    mythology:['myth','myths','мифология','мифологии','мифологию','мифы','міфалогія','міфалогіі','міфы'],
    night:['ночь','ночи','ночью','ноч','ночы','ноччу'],
    nostalgia:['ностальгия','ностальгии','ностальгию','настальгія','настальгіі','настальгію'],
    'social-commentary':['social commentary','социальный комментарий','социальные комментарии','сацыяльны каментар','сацыяльныя каментары'],
    'urban-life':['urban life','городская жизнь','городскую жизнь','городской жизни','гарадское жыццё','гарадскога жыцця','гарадскім жыцці'],
    work:['labour','labor','работа','работе','работу','труд','труда','труде','праца','працы','працу'],
    'recruit-song':['recruit song','recruit songs','рекрутская песня','рекрутские песни','рэкруцкая песня','рэкруцкія песні'],
    'easter-round':['easter round','easter-round song','valačobny','volochebnaya','волочебная','волочебные','валачобная','валачобныя'],
    'protest-2020':[],
    'protecting-family':['protecting family','защита семьи','абарона сям’і'],
    'bedtime-and-care':['bedtime and care','забота перед сном','догляд перад сном'],
    insomnia:['бессонница','бессонницы','бессонницу','бяссонніца','бяссонніцы','бяссонніцу'],
    'comfort-and-hope':['comfort and hope','утешение и надежда','суцяшэнне і надзея'],
    'weather-and-protection':['weather and protection','погода и защита','надвор’е і абарона'],
    'dancing-and-desire':['dancing and desire','танцы и желание','танцы і жаданне'],
    death:['смерть','смерти','смерць','смерці'],
    violence:['насилие','насилия','насилии','гвалт','гвалту','гвалце'],
    'anti-violence':['nonviolence','non-violence','anti violence','anti-violence','антинасилие','ненасилие','ненасильственные','негвалтоўнасць'],
    'lullaby-derived':['lullaby derived','derived from a lullaby','производная от колыбельной','паходзіць ад калыханкі'],
    'wedding-song':['wedding song','wedding songs','свадебная песня','свадебные песни','вясельная песня','вясельныя песні'],
  },
};

const genreValueCache=new Map();
export function taxonomyValues(field, value) {
  if (field !== 'genres') return [value];
  if (genreValueCache.has(value)) return genreValueCache.get(value);
  const descendants = new Set([value]);
  let previous;
  do {
    previous = descendants.size;
    for (const [child, parents] of Object.entries(genreParents))
      if (parents.some(parent => descendants.has(parent))) descendants.add(child);
  } while (previous !== descendants.size);
  const result=Object.freeze([...descendants]);
  if(genreValueCache.size<128)genreValueCache.set(value,result);
  return result;
}

export function genreRelationBasis(requested, actual, sourceBasis='') {
  const label=(id,i)=>taxonomyLabels[id]?.[i]||id;
  const original=lang=>typeof sourceBasis==='string'?sourceBasis:sourceBasis?.[lang]||sourceBasis?.en||'';
  return {
    en:`Catalogue tag “${label(actual,0)}” is included under “${label(requested,0)}” by the explicit editorial genre hierarchy. This is not an audio measurement or an additional publisher tag. ${original('en')}`.trim(),
    be:`Каталожная пазнака «${label(actual,1)}» уваходзіць у «${label(requested,1)}» паводле яўнай рэдакцыйнай іерархіі жанраў. Гэта не вымярэнне аўдыя і не дадатковая пазнака выдаўца. ${original('be')}`.trim(),
    ru:`Метка каталога «${label(actual,2)}» входит в «${label(requested,2)}» по явной редакционной иерархии жанров. Это не измерение аудио и не дополнительная метка издателя. ${original('ru')}`.trim(),
  };
}
