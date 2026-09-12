import {taxonomyAliases,taxonomyValues,genreRelationBasis} from './taxonomy-r3.js';
export const STORAGE_KEY = 'unmute-listener-private/v1';
export const languages = ['en', 'be', 'ru'];
export const normalize = (s = '') => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ё/g,'е').replace(/ł/g,'l').replace(/[’‘ʼ]/g,"'");
export function safeUrl(raw) {
  try {
    const u=new URL(raw),h=u.hostname.toLowerCase().replace(/\.$/,'');
    const local=h==='localhost'||h.endsWith('.localhost')||h.endsWith('.local')||h.endsWith('.internal')||h.startsWith('[')||!h.includes('.')||/^(?:127|0|10)\./.test(h)||/^169\.254\./.test(h)||/^192\.168\./.test(h)||/^172\.(?:1[6-9]|2\d|3[01])\./.test(h);
    return u.protocol==='https:'&&!u.username&&!u.password&&!local?u.href:'';
  } catch { return ''; }
}
export const escapeHTML = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// This is an inspectable multilingual query parser, not an LLM or audio classifier.
// A synonym expands a query; it never creates a new claim about a recording.
const vocabulary = {
  electronic: ['electronic','electronics','electronica','электроника','электроники','электронику','электроніка','электронікі','электроніку'],
  folk: ['folk','traditional','tradition','фолк','фольк'],
  pop: ['pop','поп','поп-музыка'], rock: ['rock','рок'], metal:['metal','метал','металл'],
  'post-punk':['post-punk','postpunk','постпанк','пост-панк'], coldwave:['coldwave'],
  eurovision:['eurovision','евровидение','евровидения','еўрабачанне','еўрабачання'],
  dance: ['dance','dancing','club','танцы','танец','танца','танцаў','танцаваць','танцевать'],
  remix: ['remix','remixes','remixed','ремикс','ремиксы','ремиксов','ремикса','рэмікс','рэміксы','рэміксаў','рэміксу'],
  acoustic:['acoustic','акустика','акустыка'], jazz:['jazz','джаз'], techno:['techno','техно','тэхна'],
  trance:['trance','транс'], ambient:['ambient','эмбиент','эмбіент'], experimental:['experimental','экспериментальная','эксперыментальная'],
  'hip-hop':['hip-hop','hiphop','хип-хоп','хіп-хоп'], rap:['rap','рэп','реп'],
  ethno:['ethno','этно','этна'], folktronica:['folktronica','фолктроника','фальктроніка'],
  electroacoustic:['electroacoustic','электроакустика','электраакустыка'],
  'black-metal':['black-metal','блэк-метал'],'post-metal':['post-metal','постметал'],
  'dark-cabaret':['dark-cabaret','дарк-кабаре','дарк-кабарэ'],
};
const topicTerms={
  lullaby:['lullaby','lullabies','колыбельная','колыбельную','колыбельные','колыбельных','колыбельной','калыханка','калыханкі','калыханку','калыханак'],
  protest:['protest','protests','протест','протеста','протестов','пратэст','пратэсту','пратэстаў'],
  love:['love','любовь','любви','любоў','каханне','каханні','кахання'],
  sleep:['sleep','bedtime','сон','сна','сном','сну','заснуть','заснуць'],
  family:['family','семья','семье','семьи','сям’я','сямя','сям’і','сямьи'],
  'home-and-belonging':['home','homeland','belonging','родина','родине','родины','дом','доме','дому','радзіма','радзіме','радзімы'],
  'anti-violence':['nonviolence','антинасилие','гвалт','гвалту','насилие','насилия'],
  'nursery-rhyme':['nursery-rhyme','потешка','потешки','потешку','пацешка','пацешкі','пацешку'],
  'harvest-and-work':['harvest','жатва','жатву','жніво','жніва'],
  'ritual-chant-reworking':['ritual','rituals','обряд','обряды','абрад','абрады'],
  longing:['longing','тоска','тоску','тоске','туга','тугу'],
  city:['city','cities','город','города','городе','горад','горадзе','гарады'],
  loneliness:['loneliness','lonely','одиночество','одиночестве','адзінота','адзіноту','адзіноце'],
  isolation:['isolation','изоляция','изоляции','ізаляцыя','ізаляцыі'],
  escape:['escape','побег','побеге','уцёкі','уцёкаў'],
  relationships:['relationship','relationships','отношения','отношениях','отношений','стасункі','стасункаў','адносіны','адносінах'],
  water:['water','вода','воде','воду','вада','вадзе','ваду'],
  fear:['fear','страх','страха','страхе','страху'],
  spring:['spring','весна','весне','весну','вясна','вясне','вясну'],
  nature:['nature','природа','природе','природу','прырода','прыродзе','прыроду'],
  wedding:['wedding','weddings','свадьба','свадьбы','свадьбу','вяселле','вяселлі','вяселля'],
  remembrance:['remembrance','memory','memories','память','памяти','памяць','памяці'],
  history:['history','история','истории','историю','гісторыя','гісторыі','гісторыю'],
  resistance:['resistance','сопротивление','сопротивления','сопротивлении','супраціў','супраціву'],
  migration:['migration','immigration','emigration','diaspora','миграция','миграции','миграцию','иммиграция','иммиграции','иммиграцию','эмиграция','эмиграции','эмиграцию','міграцыя','міграцыі','міграцыю','эміграцыя','эміграцыі','эміграцыю','дыяспара','дыяспары','дыяспару','диаспора','диаспоры','диаспору'],
  friendship:['friendship','дружба','дружбе','дружбу','друзья','друзей','друзьях','сяброўства','сяброўстве','сяброў'],
  war:['war','война','войне','войны','войну','вайна','вайне','вайны','вайну'],
  'anti-war':['anti-war','antiwar','антивоенные','антивоенная','антываенныя','антываенная'],
  loss:['loss','утрата','утрате','утрату','страта','страце','страту'],
  aging:['aging','ageing','старение','старении','старость','старости','старэнне','старэння','старасць','старасці'],
  anxiety:['anxiety','тревога','тревоге','тревогу','трывога','трывогу','трывозе'],
  uncertainty:['uncertainty','неопределенность','неопределенности','няпэўнасць','няпэўнасці'],
  winter:['winter','зима','зиме','зиму','зіма','зіме','зіму'],
  christmas:['christmas','рождество','рождества','каляда','каляды','калядамі'],
  shrovetide:['shrovetide','масленица','масленицы','масленицу','масленіца','масленіцы','масленіцу'],
  solidarity:['solidarity','солидарность','солидарности','салідарнасць','салідарнасці'],
  chernobyl:['chernobyl','чэрнобыль','чарнобыль','чарнобыля','чернобыль','чернобыля'],
  nightlife:['nightlife','ночная-жизнь','начное-жыццё'],
  travel:['travel','travelling','traveling','journey','путешествие','путешествия','путешествий','вандроўкі','вандроўка','вандровак','падарожжа','падарожжы'],
  summer:['summer','лето','лета','летом'], autumn:['autumn','fall','осень','осени','восень','восені'],
  hope:['hope','надежда','надежды','надежду','надежде','надзея','надзеі','надзею'],
  prayer:['prayer','prayers','молитва','молитвы','молитву','малітва','малітвы','малітву'],
  time:['time','время','времени','час','часу'],
  'self-reflection':['self-reflection','рефлексия','рефлексии','рэфлексія','рэфлексіі'],
  'round-dance':['round-dance','хоровод','хороводы','карагод','карагоды','карагодныя'],
  'easter-ritual':['easter','пасха','пасхи','пасху','вялікдзень','вялікадня'],
  'winter-carol':['carol','carols','колядка','колядки','калядка','калядкі'],
  imprisonment:['imprisonment','prison','prisons','тюрьма','тюрьме','тюрьмы','заключение','заключении','зняволенне','зняволенні','турма','турме'],
  freedom:['freedom','свобода','свободе','свободу','свабода','свабодзе','свабоду'],
  literature:['literature','литература','литературе','литературы','літаратура','літаратуры'],
  folklore:['folklore','фольклор','фальклор'],
  addiction:['addiction','зависимость','зависимости','залежнасць','залежнасці'],
  'christening-song':['christening','крестины','крестин','хрэсьбіны','хрэсьбін'],
  'midsummer-ritual':['midsummer','купалье','купалле','купалля','купаллі'],
  'drinking-song':['drinking-song','застолье','застолья','застолле','застолля'],
  'rain-calling':['rain-calling','закликание-дождя','выкліканне-дажджу'],
};
const soundTerms={
  soft:['soft','gentle','quiet','calm','relaxing','soothing','спокойно','спакойна'],
  energetic:['energetic','energetic-sound'], slow:['slow','медленно','павольна'], fast:['fast','быстро','хутка'],
  dreamy:['dreamy','мечтательная','мечтательную','мечтательные','летуценная','летуценную','летуценныя'],
};
const typeTerms={cover:['cover','covers','кавер','каверы','кавера','каверов','каверы'],instrumental:['instrumental','instrumentals','инструментал','інструментал'],live:['live','concert','концерт','концертная','канцэрт'],demo:['demo','демо','дэма']};
const inflections=[
  [/^электронн[а-яіў]*$/u,'genres','electronic'], [/^электрон[а-яіў]*$/u,'genres','electronic'],
  [/^(?:народн|традиционн|традыцыин)[а-яіў]*$/u,'genres','folk'],
  [/^(?:танцевальн|танцавальн|клубн)[а-яіў]*$/u,'genres','dance'],
  [/^(?:акустическ|акустычн)[а-яіў]*$/u,'genres','acoustic'],
  [/^(?:протестн|пратэстн)[а-яіў]*$/u,'topics','protest'],
  [/^(?:мягк|мякк|тих|ціх|спокоин|спакоин|успокаивающ|заспакаяльн)[а-яіў]*$/u,'sound','soft'],
  [/^(?:энергичн|энергічн)[а-яіў]*$/u,'sound','energetic'],
  [/^(?:медленн|павольн)[а-яіў]*$/u,'sound','slow'], [/^(?:быстр|хутк)[а-яіў]*$/u,'sound','fast'],
  [/^(?:инструментальн|інструментальн)[а-яіў]*$/u,'types','instrumental'],
];
const stop = new Set(['find','me','some','music','songs','song','tracks','track','in','on','a','an','the','meets','with','from','of','please','i','want','to','listen','hear','give','show','looking','for','something','selection','playlist','all','about',
  'найди','найдите','покажи','покажите','подбери','давай','дай','дайте','мне','я','хочу','послушать','слушать','послушаю','музыку','музыка','музыки','песни','песню','песен','трек','треки','треков','на','с','из','за','подборку','подборка','плейлист','пожалуйста','все','всех','про','о','об','для','что-нибудь','хотел','хотелось','бы',
  'калі','знайдзі','знайдзіце','пакажы','падбяры','дай','мне','я','хачу','паслухаць','слухаць','музыку','музыка','музыкі','песні','песню','песень','на','з','ды','падборку','пра','аб','каліласка','усе','ўсе','года','год','годы','годзе','годов','лет','гадоў','гадоу','мове','мова','языке','язык','language'].map(normalize));
const conjunctions=new Set(['and','и','і','&&']);
const disjunctions=new Set(['or','или','або','альбо','||']);
const negations=new Set(['not','не','без','кроме','акрамя','except','without']);
Object.assign(vocabulary,taxonomyAliases.genres);
Object.assign(topicTerms,taxonomyAliases.topics);
const dictionaries=[['genres',vocabulary],['topics',topicTerms],['sound',soundTerms],['types',typeTerms]];
const terms=new Map(dictionaries.flatMap(([field,values])=>Object.entries(values).flatMap(([value,aliases])=>[value,...aliases].map(alias=>[normalize(alias),{field,value}]))));
const taxonomyPhrases=[...terms].filter(([alias])=>alias.includes(' ')).sort((a,b)=>b[0].length-a[0].length).map(([alias,atom],i)=>{
  const token=`__taxonomy_${i}`;
  terms.set(token,atom);
  const pattern=alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+');
  return {token,pattern:new RegExp(`(?<![\\p{L}\\p{N}_'-])${pattern}(?![\\p{L}\\p{N}_'-])`,'gu')};
});
function expandTaxonomyPhrases(value){
  // Explicit phrase aliases only, longest first. Quoted titles and unknown
  // residual descriptions stay intact; no bag-of-words or semantic guessing.
  return value.split(/(["«“][^"»”]+["»”])/gu).map(part=>/^["«“]/u.test(part)?part:taxonomyPhrases.reduce((text,{token,pattern})=>text.replace(pattern,token),part)).join('');
}
const emptyIntent=(raw='')=>({raw,genres:[],topics:[],sound:[],types:[],language:'',years:undefined,text:[],excluded:[],unsupportedOperators:[],diagnostics:[]});
const identity=s=>normalize(s).replace(/[—–−-]/g,' ').replace(/[^\p{L}\p{N}'@]+/gu,' ').replace(/\s+/g,' ').trim();
const identityWords=s=>identity(s).split(' ').filter(Boolean);
function atomFor(word) {
  if(/^belarusian(?:-language)?$|^(?:белорусск|беларуск)[а-яіў]*$/u.test(word))return {field:'language',value:'be'};
  if(/^russian(?:-language)?$|^(?:русск|руск)[а-яіў]*$/u.test(word))return {field:'language',value:'ru'};
  if(/^english(?:-language)?$|^(?:англииск|англіиск)[а-яіў]*$/u.test(word))return {field:'language',value:'en'};
  if(terms.has(word))return terms.get(word);
  for(const [pattern,field,value] of inflections)if(pattern.test(word))return {field,value};
  const range=word.match(/^((?:19|20)\d{2})[-–—]((?:19|20)\d{2})$/);
  if(range)return {field:'years',value:[Math.min(+range[1],+range[2]),Math.max(+range[1],+range[2])]};
  const decade=word.match(/^((?:19|20)\d0)(?:s|s'|-х|-я|-е)$|^(90|80|00|10|20)(?:s|-х|-я|-е)$/);
  if(decade){const d=+(decade[1]||(+decade[2]>=80?'19':'20')+decade[2]);return {field:'years',value:[d,d+9]};}
  if(/^(?:19|20)\d{2}$/.test(word))return {field:'years',value:[+word,+word]};
  return {field:'text',value:word};
}
function addAtom(intent,atom) {
  const {field,value}=atom;
  if(field==='language'){
    if(intent.language&&intent.language!==value)intent.diagnostics.push('conflicting-languages');
    intent.language=value;
  }else if(field==='years'){
    intent.years=intent.years?[Math.max(intent.years[0],value[0]),Math.min(intent.years[1],value[1])]:value;
    if(intent.years[0]>intent.years[1])intent.diagnostics.push('conflicting-years');
  }else if(field==='literalTitle'){
    if(intent.literalTitle&&intent.literalTitle!==value)intent.diagnostics.push('conflicting-titles');
    intent.literalTitle=value;
  }
  else if(!intent[field].includes(value))intent[field].push(value);
}
export function parseQuery(raw = '') {
  raw=String(raw).slice(0,180);
  const intent=emptyIntent(raw),quoted=raw.trim().match(/^["«“]([^"»”]+)["»”]$/);
  if(quoted)return {...intent,literalTitle:identity(quoted[1]),mode:'exact-title'};
  let value=normalize(raw)
    .replace(/\b(?:before sleep|before bed)\b|перед сном|перад сном|для сна/gu,' soft ')
    .replace(/разных лет|розных гадоу|across the years|across years|калі ласка/gu,' ')
    .replace(/\bpost punk\b|пост панк/gu,'post-punk')
    .replace(/\bhip hop\b|хип хоп|хіп хоп/gu,'hip-hop')
    .replace(/\bnursery rhymes?\b/gu,'nursery-rhyme')
    .replace(/\bround dances?\b/gu,'round-dance')
    .replace(/\b(?:against (?:the )?war|anti war)\b|против воины|супраць ваины/gu,'anti-war')
    .replace(/ночная жизнь|ночную жизнь/gu,'ночная-жизнь').replace(/начное жыцце/gu,'начное-жыццё')
    .replace(/\bwithout (?:vocals|words)\b|без (?:слов|вокала)|без (?:слоу|вакалу)/gu,' instrumental ')
    .replace(/(?:\bfrom|\bbetween|(?:^|\s)с|(?:^|\s)з|(?:^|\s)ад)\s+((?:19|20)\d{2})\s+(?:to|through|and|по|да|и|і)\s+((?:19|20)\d{2})/gu,' $1-$2 ')
    .replace(/(?:\bbefore|(?:^|\s)до|раней за)\s+((?:19|20)\d{2})/gu,(_,y)=>` 1900-${+y-1} `)
    .replace(/(?:\bafter|(?:^|\s)после|(?:^|\s)пасля)\s+((?:19|20)\d{2})/gu,(_,y)=>` ${+y+1}-2099 `)
    .replace(/((?:19|20)\d{2})\s*[-–—]\s*((?:19|20)\d{2})/g,'$1-$2');
  // Remembered lyrics cannot be searched honestly until a permissioned lyric index exists.
  if(/\b(?:lyrics?|remember.*(?:line|phrase|words)|my (?:mother|mom|mum) (?:sang|used to sing))\b|(?:помню|памятаю).*(?:строк|фраз|слов|радок)|мама (?:пела|спявала)/u.test(value))intent.diagnostics.push('lyrics-not-indexed');
  value=expandTaxonomyPhrases(value);
  const words=value.match(/["«“][^"»”]+["»”]|&&|\|\||[^\s.,!?;:]+/gu)||[];
  const branches=[],current=()=>branches.at(-1);
  branches.push(emptyIntent(raw));
  let pendingNot=false,expectTerm=false,hasAtom=false;
  for(const word of words){
    if(disjunctions.has(word)){
      if(!hasAtom||pendingNot||expectTerm){intent.unsupportedOperators.push('incomplete-or');break;}
      branches.push(emptyIntent(raw));hasAtom=false;expectTerm=true;continue;
    }
    if(conjunctions.has(word)){
      if(!hasAtom||pendingNot||expectTerm){intent.unsupportedOperators.push('incomplete-and');break;}
      expectTerm=true;continue;
    }
    if(negations.has(word)){
      if(pendingNot){intent.unsupportedOperators.push('double-negation');break;}
      pendingNot=true;continue;
    }
    if(stop.has(word))continue;
    const quotedPart=word.match(/^["«“]([^"»”]+)["»”]$/);
    if(!quotedPart&&/[()]/u.test(word)){intent.unsupportedOperators.push('parentheses');continue;}
    const atom=quotedPart?{field:'literalTitle',value:identity(quotedPart[1])}:atomFor(word);
    if(pendingNot){current().excluded.push(atom);pendingNot=false;}else addAtom(current(),atom);
    hasAtom=true;expectTerm=false;
  }
  if(pendingNot||expectTerm)intent.unsupportedOperators.push('missing-condition');
  if(branches.length===1)return {...branches[0],unsupportedOperators:intent.unsupportedOperators,diagnostics:[...intent.diagnostics,...branches[0].diagnostics]};
  // OR joins complete clauses; sidebar filters are applied to every alternative.
  // Keeping only common facets at the top level prevents a false all-facets readout.
  for(const field of ['genres','topics','sound','types','text'])intent[field]=branches[0][field].filter(v=>branches.every(b=>b[field].includes(v)));
  if(branches.every(b=>b.language===branches[0].language))intent.language=branches[0].language;
  if(branches.every(b=>JSON.stringify(b.years)===JSON.stringify(branches[0].years)))intent.years=branches[0].years;
  return {...intent,alternatives:branches,logic:'or',diagnostics:[...intent.diagnostics,...branches.flatMap(b=>b.diagnostics)]};
}
function recordValues(record,field){
  if(field==='genres')return [...(record.tags||[]),...(record.themes||[]).filter(v=>v==='eurovision'),...(record.kind==='remix'?['remix']:[])];
  if(field==='sound')return record.soundTags||[];
  if(field==='types')return [record.kind,...(record.language==='instrumental'?['instrumental']:[])];
  if(field==='topics')return [...(record.culturalFunctions||[]),...(record.themes||[]).filter(v=>v!=='lullaby'&&v!=='nursery-rhyme')];
  return [];
}
const topicSubtypes={'home-and-belonging':['home'],wedding:['wedding-song'],'harvest-and-work':['harvest']};
const facetValues=(field,value)=>field==='genres'?taxonomyValues(field,value):[value,...(field==='topics'?topicSubtypes[value]||[]:[])];
function hasValue(record,field,value){
  const values=recordValues(record,field);
  // Exact, documented subtype relations; never infer danceability from electronic/folk.
  return facetValues(field,value).some(v=>values.includes(v));
}
function titleMatch(record,value){
  return [record.title,...String(record.title).split(/\s+\/\s+/),...(record.aliases||[])].some(v=>identity(v)===value);
}
function textMatch(record,word){
  const wanted=identityWords(word);
  const tokens=new Set([record.title,record.artist,...(record.aliases||[])].flatMap(identityWords));
  return wanted.length>0&&wanted.every(w=>tokens.has(w));
}
function atomMatches(record,atom){
  if(atom.field==='language')return record.language===atom.value;
  if(atom.field==='years')return Number.isFinite(record.year)&&record.year>=atom.value[0]&&record.year<=atom.value[1];
  if(atom.field==='literalTitle')return titleMatch(record,atom.value);
  if(atom.field==='text')return textMatch(record,atom.value);
  return hasValue(record,atom.field,atom.value);
}
export function matchRecord(record, intent, filters = {}) {
  if(intent.unsupportedOperators?.length||intent.diagnostics?.includes('lyrics-not-indexed'))return false;
  if(intent.alternatives)return intent.alternatives.some(branch=>matchRecord(record,branch,filters));
  if(intent.diagnostics?.some(v=>v==='conflicting-languages'||v==='conflicting-years'||v==='conflicting-titles'))return false;
  const filterLanguage=filters.language==='all'?'':filters.language,language=filterLanguage||intent.language;
  if(filterLanguage&&intent.language&&filterLanguage!==intent.language)return false;
  if(language&&record.language!==language)return false;
  if(intent.exactIds&&!intent.exactIds.includes(record.id))return false;
  if(intent.literalTitle&&!titleMatch(record,intent.literalTitle))return false;
  for(const [field,values] of [['genres',[...(intent.genres||[]),...(filters.genre?[filters.genre]:[])]],['topics',[...(intent.topics||[]),...(filters.topic?[filters.topic]:[])]],['sound',intent.sound||[]],['types',[...(intent.types||[]),...(filters.type?[filters.type]:[])]]]){
    if(!values.every(value=>hasValue(record,field,value)))return false;
  }
  if(intent.years&&!atomMatches(record,{field:'years',value:intent.years}))return false;
  if(filters.decade&&(!record.year||Math.floor(record.year/10)*10!==+filters.decade))return false;
  if(!(intent.text||[]).every(word=>textMatch(record,word)))return false;
  // An exclusion means absence of a matching catalogue label, not proof of audio properties.
  if((intent.excluded||[]).some(atom=>(atom.field==='language'&&(!record.language||record.language==='unknown'))||(atom.field==='years'&&!Number.isFinite(record.year))||atomMatches(record,atom)))return false;
  return true;
}

export function explainMatch(record,intent,filters={}){
  if(!matchRecord(record,intent,filters))return [];
  const branch=intent.alternatives?.find(b=>matchRecord(record,b,filters))||intent;
  const sourceUrl=record.sourceUrl||'',reasons=[];
  const add=(field,value,basis,extra={})=>reasons.push({field,value,basis,sourceUrl,...extra});
  const language=(filters.language&&filters.language!=='all'?filters.language:branch.language);
  if(language)add('language',language,record.languageEvidence||'Recording-language label in this catalogue.');
  const facets=[['genres',[...branch.genres,...(filters.genre?[filters.genre]:[])]],['topics',[...branch.topics,...(filters.topic?[filters.topic]:[])]],['sound',branch.sound],['types',[...(branch.types||[]),...(filters.type?[filters.type]:[])]]];
  for(const [field,values] of facets)for(const value of new Set(values)){
    const actual=facetValues(field,value).find(v=>recordValues(record,field).includes(v));
    const actualField=field==='topics'?(record.culturalFunctions?.includes(actual)?'culturalFunction':'theme'):field==='genres'?'genre':field==='types'?'version':'sound';
    const claim=record.claims?.find(c=>c.value===actual&&(!c.field||({genre:['genre','style'],theme:['theme'],culturalFunction:['culturalFunction','cultural-function','function'],version:['version','kind'],sound:['sound','soundTag']}[actualField]||[]).includes(c.field)));
    const sourceBasis=claim?.basis||(field==='genres'?record.tagScope:null)||'Explicit catalogue classification; not inferred from title, popularity or audio.';
    const relation=field==='genres'&&actual!==value;
    add(actualField,value,relation?genreRelationBasis(value,actual,sourceBasis):sourceBasis,{matchedValue:actual,...(relation?{taxonomyRelation:{kind:'editorial-subgenre',requested:value,documented:actual}}:{}),...(claim?.scope?{scope:claim.scope}:{}),sourceUrl:safeUrl(claim?.source||claim?.sourceUrl)||sourceUrl});
  }
  if(branch.years||filters.decade)add('year',String(record.year),record.dateBasis||'Recording/release year in the source record; not the date of the underlying composition.');
  if(branch.exactIds||branch.literalTitle)add('identity',`${record.artist} — ${record.title}`,'An exact title, artist/title combination or documented identity alias matched.');
  else if(branch.text.length)add('identity',branch.text.join(' '),'Words matched the artist, title or documented aliases; not a lyric transcript.');
  for(const atom of branch.excluded||[])add('exclusion',Array.isArray(atom.value)?atom.value.join('–'):atom.value,'No matching label or identity in this catalogue. Missing metadata is not proof that an audible property or topic is absent.',{negative:true});
  if(!reasons.length)add('browse','catalogue','Browsing the selected catalogue scope; no relevance, popularity or audio score was invented.');
  return reasons;
}
// A metadata passport is not a file fingerprint, proof of rights or proof of authenticity.
export function metadataPassport(record,records){
 return {
  schema:'unmute.metadata-passport/1',recordingId:record.id,workId:record.workId||null,
  title:record.title,artist:record.artist,recordingLanguage:record.language,versionType:record.kind,
  releaseYear:record.year||null,recordingYear:record.recordingYear||null,dateBasis:record.dateBasis||null,
  durationSeconds:record.durationSeconds||null,durationBasis:record.durationBasis||null,
  culturalFunctions:record.culturalFunctions||[],themes:record.themes||[],soundTags:record.soundTags||[],
  rhythm:record.rhythm||{bpm:null,method:'not measured'},
  sources:[...new Set([...(record.sources||[]),record.sourceUrl,record.listenUrl].filter(Boolean))],
  claims:record.claims||[],languageEvidence:record.languageEvidence||null,
  relatedVersions:record.workId?records.filter(r=>r.workId===record.workId&&r.id!==record.id).map(r=>({id:r.id,title:r.title,versionType:r.kind})):[],
  fileFingerprint:null,
  limits:'Metadata/source record only. No audio was fingerprinted; work relationships are editorial assertions, not automatic identity or copyright checks.'
 };
}
export function search(records, raw, filters = {}) {
  raw=String(raw).slice(0,180);
  let intent=parseQuery(raw);
  const exact=records.filter(r=>[r.title,...(r.aliases||[])].some(title=>[`${r.artist} ${title}`,`${title} ${r.artist}`].some(candidate=>identity(candidate)===identity(raw))));
  // A bare taxonomy word such as "lullaby" remains a function query. An exact
  // title containing other words (e.g. "Не чапай") is not a NOT instruction.
  const allKnown=identityWords(raw).every(w=>atomFor(w).field!=='text'||stop.has(w));
  const needsLiteral=intent.genres.length||intent.topics.length||intent.sound.length||intent.types.length||intent.language||intent.years||intent.excluded.length||intent.alternatives||intent.unsupportedOperators.length||intent.diagnostics.length;
  const titleExact=needsLiteral&&!allKnown&&identity(raw)?records.filter(r=>[r.title,...(r.aliases||[])].some(title=>identity(title)===identity(raw))):[];
  const exactRecords=exact.length?exact:titleExact;
  if(exactRecords.length&&!intent.literalTitle)intent={...emptyIntent(raw),exactIds:exactRecords.map(r=>r.id),mode:'exact-title'};
  const matches=records.filter(r => matchRecord(r,intent,filters));
  // Stable editorial order; no invented relevance scores, popularity or mood claims.
  if (filters.sort === 'newest') matches.sort((a,b)=>(b.year||0)-(a.year||0));
  if (filters.sort === 'artist') matches.sort((a,b)=>a.artist.localeCompare(b.artist));
  const explanations=Object.fromEntries(matches.map(r=>[r.id,explainMatch(r,intent,filters)]));
  const suggestions=matches.length?[]:spellingSuggestions(records,raw,intent,filters);
  return {intent,matches,explanations,suggestions};
}

function editDistance(a,b,max){
  if(Math.abs(a.length-b.length)>max)return max+1;
  let previous=Array.from({length:b.length+1},(_,i)=>i),beforePrevious;
  for(let i=1;i<=a.length;i++){
    const next=[i];
    for(let j=1;j<=b.length;j++){
      next[j]=Math.min(next[j-1]+1,previous[j]+1,previous[j-1]+(a[i-1]===b[j-1]?0:1));
      if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])next[j]=Math.min(next[j],beforePrevious[j-2]+1);
    }
    if(Math.min(...next)>max)return max+1;
    beforePrevious=previous;previous=next;
  }
  return previous[b.length];
}
function spellingSuggestions(records,raw,intent,filters){
  // Never silently broaden a result set. Suggestions need an explicit next click,
  // retain all filters and use only known artist/title/alias words (not copied lyrics).
  if(intent.mode||intent.literalTitle||intent.alternatives||intent.unsupportedOperators.length||intent.diagnostics.length||intent.excluded.length||!intent.text.length)return [];
  const suggestions=[];
  for(const word of intent.text){
    if(identityWords(word).length!==1||word.length<5)continue;
    const limit=word.length>=9?2:1,candidates=new Map();
    for(const record of records)for(const token of [record.artist,record.title,...(record.aliases||[])].flatMap(identityWords)){
      if(token===word||token.length<5||/\d/u.test(token))continue;
      const distance=editDistance(word,token,limit);
      if(distance<=limit)candidates.set(token,distance);
    }
    for(const [token,distance] of candidates){
      const corrected={...intent,text:intent.text.map(w=>w===word?token:w)};
      const matching=records.filter(r=>matchRecord(r,corrected,filters));
      if(!matching.length)continue;
      const rawTokens=raw.match(/\S+/gu)||[];
      const query=rawTokens.map(w=>identity(w)===word?token:w).join(' ');
      if(query===raw)continue;
      suggestions.push({query,label:query,recordIds:matching.map(r=>r.id),reason:'spelling',distance});
    }
  }
  return suggestions.sort((a,b)=>a.distance-b.distance||a.label.localeCompare(b.label)).filter((s,i,all)=>all.findIndex(x=>x.query===s.query)===i).slice(0,3).map(({distance,...suggestion})=>suggestion);
}
export function cleanPersonal(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const title=String(raw.title||'').trim().slice(0,160),artist=String(raw.artist||'').trim().slice(0,160),listenUrl=safeUrl(raw.listenUrl);
  if(!title || !artist || !listenUrl) return null;
  return {id:'personal-'+crypto.randomUUID(),title,artist,listenUrl,listenLabel:new URL(listenUrl).hostname.replace(/^www\./,''),
    language:['be','ru','en','instrumental'].includes(raw.language)?raw.language:'unknown',kind:'unknown',tags:[],aliases:[],
    summary:{en:'A link added by you. The recording, language and rights have not been independently checked.',ru:'Ссылка, добавленная тобой. Запись, язык и права независимо не проверялись.',be:'Спасылка, дададзеная табой. Запіс, мова і правы незалежна не правяраліся.'},
    personal:true,sourceUrl:'',sourceName:'',year:null};
}
export function readState(storage, catalogIds) {
  const empty={ids:[],personal:[],title:'',storageOK:true};
  try {
    const saved=JSON.parse(storage.getItem(STORAGE_KEY)||'null');
    if (!saved) return empty;
    if(saved.version!==1 || !Array.isArray(saved.ids) || !Array.isArray(saved.personal)) throw Error('Invalid local data');
    const seen=new Set();
    const personal=saved.personal.slice(0,100).flatMap(p=>{if(!p || typeof p.id!=='string'||!/^personal-[\w-]{1,80}$/.test(p.id)||seen.has(p.id))return [];const clean=cleanPersonal(p);if(!clean)return [];seen.add(p.id);return [{...clean,id:p.id}];});
    const valid=new Set([...catalogIds,...personal.map(p=>p.id)]);
    return {ids:[...new Set(saved.ids)].filter(id=>valid.has(id)).slice(0,100),personal,title:typeof saved.title==='string'?saved.title.slice(0,120):'',storageOK:true};
  } catch { return {...empty,storageOK:false}; }
}
export function saveState(storage,state) { try { storage.setItem(STORAGE_KEY,JSON.stringify({version:1,ids:state.ids,personal:state.personal,title:state.title})); return true; } catch { return false; } }
export function selectionText(title,records,lang='en') {
  const labels={en:['Listen','Source','Source lead — listening link not confirmed','Personal link; not independently checked','Unknown'],ru:['Слушать','Источник','Архивная находка — ссылка прослушивания не подтверждена','Личная ссылка; независимо не проверена','Неизвестно'],be:['Слухаць','Крыніца','Архіўная знаходка — спасылка праслухоўвання не пацверджана','Асабістая спасылка; незалежна не праверана','Невядома']}[lang];
  return [title || 'Unmute — music selection','',...records.flatMap((r,i)=>[`${i+1}. ${r.artist} — ${r.title}${r.year?' ('+r.year+')':''}`,r.summary?.[lang] || r.summary?.en || '',r.listenUrl?`${labels[0]}: ${r.listenUrl}`:labels[2],r.sourceUrl?`${labels[1]}: ${r.sourceUrl}`:labels[3],''])].join('\n');
}
export function selectionHTML(title,records,lang='en') {
  const lines=selectionText(title,records,lang).split('\n');
  return '<!doctype html><html lang="'+lang+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="referrer" content="no-referrer"><title>'+escapeHTML(title||'Unmute')+'</title><style>body{max-width:760px;margin:40px auto;padding:24px;font:17px/1.65 system-ui;background:#f6f5ed;color:#14261b}h1{font:42px Georgia}article{border-top:1px solid #bac5b9;padding:24px 0}a{color:#244d28;overflow-wrap:anywhere}p{white-space:pre-wrap}</style><h1>'+escapeHTML(lines[0])+'</h1>'+records.map((r,i)=>'<article><h2>'+escapeHTML(`${i+1}. ${r.artist} — ${r.title}`)+'</h2><p>'+escapeHTML(r.summary?.[lang]||r.summary?.en||'')+'</p>'+(r.listenUrl?'<p><a rel="noopener noreferrer" href="'+escapeHTML(safeUrl(r.listenUrl))+'">↗ '+escapeHTML(r.listenLabel||'Listen')+'</a></p>':'<p>'+escapeHTML(lang==='en'?'Listening link not confirmed':lang==='be'?'Спасылка праслухоўвання не пацверджана':'Ссылка прослушивания не подтверждена')+'</p>')+(r.sourceUrl?'<p><a rel="noopener noreferrer" href="'+escapeHTML(safeUrl(r.sourceUrl))+'">'+escapeHTML(r.sourceName||'Source')+'</a></p>':'')+'</article>').join('')+'</html>';
}
