// Editorial routing vocabulary. Never treat these labels as recording evidence.
const labels={
 lullaby:['Lullabies','Колыбельные','Калыханкі'],
 home:['Home, belonging & migration','Дом, разлука и миграция','Дом, расстанне і міграцыя'],
 protest:['Protest & freedom','Протест и свобода','Пратэст і свабода'],
 peace:['Peace & nonviolence','Мир и ненасилие','Мір і негвалтоўнасць'],
 loss:['Loss & remembrance','Утрата и память','Страта і памяць'],
 love:['Love & relationships','Любовь и отношения','Каханне і адносіны'],
 lonely:['Loneliness','Одиночество','Адзінота'],
 age:['Time, aging & reflection','Время, взросление и размышления','Час, сталенне і разважанні'],
 friendship:['Friendship & solidarity','Дружба и солидарность','Сяброўства і салідарнасць'],
 spring:['Spring','Весна','Вясна'],summer:['Summer','Лето','Лета'],travel:['Travel','Путешествия','Падарожжы'],autumn:['Autumn','Осень','Восень'],winter:['Winter & Christmas','Зима и Рождество','Зіма і Каляды'],
 nature:['Nature & water','Природа и вода','Прырода і вада'],city:['City life','Городская жизнь','Гарадское жыццё'],fear:['Fear & anxiety','Страх и тревога','Страх і трывога'],hope:['Hope','Надежда','Надзея'],
 history:['History, literature & folklore','История, литература и фольклор','Гісторыя, літаратура і фальклор'],family:['Family','Семья','Сям’я'],dance:['Dance music','Танцевальная музыка','Танцавальная музыка'],
 dreamy:['Dreamy sound · publisher description','Мечтательное звучание · описание издателя','Летуценнае гучанне · апісанне выдаўца'],
 'round-dance':['Round-dance songs','Хороводные песни','Карагодныя песні'],wedding:['Wedding ritual songs','Свадебные обрядовые песни','Вясельныя абрадавыя песні'],harvest:['Harvest & work songs','Песни жатвы и труда','Песні жніва і працы'],rain:['Rain-calling songs','Песни закликания дождя','Песні заклікання дажджу'],midsummer:['Kupala songs','Купальские песни','Купальскія песні'],carol:['Winter carols','Зимние колядки','Зімовыя калядкі'],easter:['Easter ritual songs','Пасхальные обрядовые песни','Велікодныя абрадавыя песні']
};
export function intentLabel(id,lang='en'){return Object.hasOwn(labels,id)?labels[id][{en:0,ru:1,be:2}[lang]??0]:'';}
export function semanticMessageKind(reason){
 if(reason==='lyrics-not-indexed')return 'lyrics';
 if(['use-structured-boolean-search','use-exact-title-search'].includes(reason))return 'blocked';
 return 'empty'; // Heuristic abstention is not an unsupported-lyrics verdict.
}
export const interpretationCopy={
 en:{label:'Suggested interpretation',note:'This is the model’s reading of your request, not a confirmed match. If it missed your meaning, change the description or use exact filters.',source:'Existing catalogue label · inspect its source',lyrics:'Finding a song from remembered words is not connected yet. No song has been identified. You can search by an artist, title or documented theme.',empty:'No well-supported suggestion for this description. Try a theme such as home or protest, or choose an exact genre filter. An empty result does not mean the music does not exist.'},
 ru:{label:'Предполагаемый смысл запроса',note:'Так модель поняла запрос — это не подтверждённое совпадение. Если смысл другой, измени описание или выбери точные фильтры.',source:'Существующая метка каталога · проверь её источник',lyrics:'Поиск песни по запомнившимся словам пока не подключён. Песня не опознана. Можно искать по исполнителю, названию или документированной теме.',empty:'Нет достаточно обоснованной подсказки для этого описания. Попробуй тему — например, дом или протест — либо выбери точный жанр в фильтре. Пустой результат не означает, что такой музыки нет.'},
 be:{label:'Меркаваны сэнс запыту',note:'Так мадэль зразумела запыт — гэта не пацверджанае супадзенне. Калі сэнс іншы, змяні апісанне або выберы дакладныя фільтры.',source:'Існая метка каталога · правер яе крыніцу',lyrics:'Пошук песні паводле запомненых слоў пакуль не падключаны. Песня не апазнаная. Можна шукаць паводле выканаўцы, назвы або дакументаванай тэмы.',empty:'Няма дастаткова абгрунтаванай падказкі для гэтага апісання. Паспрабуй тэму — напрыклад, дом ці пратэст — або выберы дакладны жанр у фільтры. Пусты вынік не азначае, што такой музыкі няма.'}
};
