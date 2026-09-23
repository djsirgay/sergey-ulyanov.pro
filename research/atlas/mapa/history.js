/* MAPA: dated territorial affiliation. Geometry is evidence, not animation filler. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ns = 'http://www.w3.org/2000/svg';
  const eras=[
    {year:1492,match:['Poland-Lithuania'],title:['Grand Duchy of Lithuania','Вялікае Княства Літоўскае'],answer:['These lands were in the Grand Duchy of Lithuania, linked to Poland by the Jagiellonian dynasty.','Гэтыя землі ўваходзілі ў Вялікае Княства Літоўскае, звязанае з Польшчай дынастыяй Ягелонаў.'],body:['The Grand Duchy was a distinct polity. The regional source combines Poland and Lithuania into one outer shape; it does not resolve their internal boundary. After Casimir IV’s death in 1492, different Jagiellonian rulers held the two thrones.','ВКЛ было асобнай дзяржавай. Рэгіянальная крыніца аб’ядноўвае Польшчу і Літву адным знешнім контурам, не вызначаючы мяжы паміж імі. Пасля смерці Казіміра IV у 1492 годзе два троны занялі розныя Ягелоны.'],warning:['This is before the Commonwealth of 1569. The combined regional polygon is not the Grand Duchy’s own boundary.','Гэта час да стварэння Рэчы Паспалітай у 1569 годзе. Агульны рэгіянальны палігон не з’яўляецца асобнай мяжой ВКЛ.'],change:['The earliest mapped snapshot in this edition. Earlier principalities and the formation of the Grand Duchy are explained in the historical chronology.','Найранейшы картографічны зрэз гэтай версіі. Ранейшыя княствы і станаўленне ВКЛ разгледжаныя ў гістарычнай храналогіі.']},
    {year:1600,match:['Poland-Llituania'],title:['Grand Duchy within the Commonwealth','ВКЛ у складзе Рэчы Паспалітай'],answer:['The Grand Duchy of Lithuania was a constituent part of the Polish–Lithuanian Commonwealth.','Вялікае Княства Літоўскае было складовай дзяржавай Рэчы Паспалітай.'],body:['The Union of Lublin in 1569 created the Commonwealth. The Grand Duchy retained distinct institutions. This map is the source’s 1600 snapshot, not a claim that the union began in 1600.','Люблінская унія 1569 года стварыла Рэч Паспалітую. ВКЛ захавала асобныя ўстановы. Тут паказаны зрэз крыніцы за 1600 год, а не сцвярджэнне, што унія пачалася тады.'],warning:['The country-level source does not draw the internal boundary between the Grand Duchy and the Polish Crown.','Крыніца дзяржаўнага ўзроўню не паказвае ўнутранай мяжы паміж ВКЛ і Польскай Каронай.'],change:['Compared with 1492, the political framework changes from a dynastic relationship to the Commonwealth. A new constitutional arrangement does not mean these lands became simply “Poland.”','У параўнанні з 1492 годам дынастычную сувязь замяняе сістэма Рэчы Паспалітай. Новы дзяржаўны лад не азначае, што гэтыя землі сталі проста «Польшчай».']},
    {year:1700,match:['Polish–Lithuanian Commonwealth'],title:['The Commonwealth continues','Рэч Паспалітая захоўваецца'],answer:['These lands remained in the Grand Duchy of Lithuania, within the Polish–Lithuanian Commonwealth.','Гэтыя землі заставаліся ў Вялікім Княстве Літоўскім, у складзе Рэчы Паспалітай.'],body:['The state framework remains the Commonwealth. The regional map shows a later source snapshot; it should not be read as a changing Great Northern War battlefront.','Дзяржаўная сістэма застаецца Рэччу Паспалітай. Рэгіянальная мапа дае пазнейшы зрэз крыніцы, а не зменлівы фронт Паўночнай вайны.'],warning:['Political affiliation is distinguished from temporary military occupation.','Дзяржаўная прыналежнасць адрозніваецца ад часовай ваеннай акупацыі.'],change:['The same affiliation continues. No change of state is invented simply because the selected year changes. The following partitions are explained individually in the chronology.','Прыналежнасць захоўваецца. Змена года сама па сабе не азначае змены дзяржавы. Наступныя падзелы асобна растлумачаныя ў храналогіі.']},
    {year:1914,match:['Russian Empire'],title:['Russian Empire','Расійская імперыя'],answer:['Before the First World War, the lands of present-day Belarus were within the Russian Empire.','Перад Першай сусветнай вайной землі сучаснай Беларусі ўваходзілі ў Расійскую імперыю.'],body:['This is a prewar snapshot, after the partitions of the Commonwealth and nineteenth-century changes. It is not a map of the occupation or moving front lines that followed.','Гэта перадваенны зрэз, пасля падзелаў Рэчы Паспалітай і зменаў XIX стагоддзя. Ён не паказвае пазнейшай акупацыі або рухомых франтоў.'],warning:['The partitions took place in 1772, 1793 and 1795, not in 1914. The chronology explains the intermediate divisions and western exceptions.','Падзелы адбыліся ў 1772, 1793 і 1795 гадах, а не ў 1914-м. Храналогія тлумачыць прамежкавыя падзелы і заходнія выключэнні.'],change:['Compared with 1700, the Commonwealth-era framework has been replaced by Russian imperial rule. The map sequence skips intermediate dates; the chronology does not.','У параўнанні з 1700 годам сістэму Рэчы Паспалітай замяніла ўлада Расійскай імперыі. Паслядоўнасць мапаў прапускае прамежкавыя даты; храналогія іх тлумачыць.']},
    {year:1938,match:['Poland','USSR'],title:['Poland in the west. Soviet Union in the east.','Польшча на захадзе. Савецкі Саюз на ўсходзе.'],answer:['Western lands — Polish Republic. Eastern lands — Belarusian SSR within the Soviet Union.','Заходнія землі — Польская Рэспубліка. Усходнія — Беларуская ССР у складзе Савецкага Саюза.'],body:['The interwar division is visible inside the same modern Belarus outline. Brest, Hrodna and Pinsk were on the Polish side; Minsk, Mahilioŭ and Homiel on the Soviet side. Select a colored territory or a present-day place to inspect it.','Міжваенны падзел бачны ў тым самым сучасным контуры Беларусі. Брэст, Гродна і Пінск былі з польскага боку; Мінск, Магілёў і Гомель — з савецкага. Абярыце каляровую тэрыторыю або сучаснае месца для праверкі.'],warning:['The source maps the international Polish–Soviet boundary, not internal Soviet republic boundaries. Belarusian SSR is historical context, not a separately digitized polygon.','Крыніца паказвае міждзяржаўную польска-савецкую мяжу, а не ўнутраныя межы савецкіх рэспублік. БССР — гістарычны кантэкст, а не асобна алічбаваны палігон.'],change:['Compared with 1914, these lands no longer share one imperial affiliation. Two colors identify two states. Compare Brest with Minsk to inspect the division.','У параўнанні з 1914 годам гэтыя землі больш не маюць адзінай імперскай прыналежнасці. Два колеры абазначаюць дзве дзяржавы. Параўнайце Брэст з Мінскам.']},
    {year:1945,match:['USSR'],title:['Belarusian SSR within the Soviet Union','Беларуская ССР у складзе Савецкага Саюза'],answer:['The western and eastern lands now shared a Soviet affiliation, within the Belarusian SSR.','Заходнія і ўсходнія землі цяпер мелі агульную савецкую прыналежнасць — у складзе Беларускай ССР.'],body:['This generalized postwar snapshot shows Soviet affiliation across the modern reference area. The Belarusian SSR was the constituent republic; its separate internal boundary is not reconstructed by this country-level source.','Гэты абагульнены пасляваенны зрэз паказвае савецкую прыналежнасць у сучасным контуры. Саюзнай рэспублікай была БССР; яе асобную ўнутраную мяжу гэтая крыніца дзяржаўнага ўзроўню не рэканструюе.'],warning:['A generalized postwar settlement, not every treaty date or subsequent local boundary adjustment.','Абагульненае пасляваеннае ўрэгуляванне, а не кожная дата дамовы або пазнейшая мясцовая карэкціроўка мяжы.'],change:['Compared with 1938, the Polish–Soviet division inside the modern Belarus outline disappears. The previous-border overlay shows where that older division ran.','У параўнанні з 1938 годам польска-савецкі падзел у сучасным контуры Беларусі знікае. Пласт папярэдніх межаў паказвае ранейшую лінію падзелу.']},
    {year:1994,match:['Byelarus'],title:['Independent Republic of Belarus','Незалежная Рэспубліка Беларусь'],answer:['Republic of Belarus — an independent state since 1991. This source map is dated 1994.','Рэспубліка Беларусь — незалежная дзяржава з 1991 года. Гэта мапа крыніцы за 1994 год.'],body:['Belarus is itself the state of affiliation, alongside independent neighboring states. The fixed modern outline lets you compare this with the earlier imperial and Soviet frameworks.','Беларусь сама з’яўляецца дзяржавай прыналежнасці, побач з незалежнымі суседнімі дзяржавамі. Сталы сучасны контур дазваляе параўнаць яе з ранейшай імперскай і савецкай сістэмамі.'],warning:['Independence dates to 1991, not 1994. Small differences between the two modern source outlines remain marked as source mismatch.','Незалежнасць адносіцца да 1991 года, а не 1994-га. Дробныя адрозненні паміж двума сучаснымі контурамі застаюцца пазначанымі як неўзгодненасць крыніц.'],change:['The Soviet Union is replaced by independent states. Belarus is highlighted; switch to the wider region to see the neighboring countries and their names.','Савецкі Саюз замяняюць незалежныя дзяржавы. Беларусь вылучаная; пераключыцеся на рэгіён, каб убачыць суседнія краіны і іх назвы.']}
  ];
  window.MAPA_MAPPED_YEARS=Object.freeze(eras.map(era=>era.year));
  const words={
    en:{eyebrow:'01 · Territory and affiliation',title:'Who governed these lands?',intro:'Choose an era above. On the map, read the country names and follow the colors. Cities are orientation points — not the limit of the map’s coverage.',jumpEvents:'Related places & documents ↓',snapshot:'source map year',loading:'Loading the selected map…',play:'Play maps',pause:'Pause',replay:'Replay maps',previous:'Previous',next:'Next',slider:'Dated map snapshots',previousOverlay:'Compare previous borders',accuracy:'Approximate historical boundaries. Hatched edge fragments are dataset mismatches, not additional countries.',whatChanged:'What changed since the previous map?',download:'Download this map’s GeoJSON',datasetSource:'Original geometry and revision ↗',methodLink:'Map accuracy and data ↓',methodTitle:'For researchers: sources, accuracy and missing periods',method1:'Historical state polygons are intersected with a fixed present-day Belarus outline. No dividing lines were drawn by eye. The focused GeoJSON, source revision and reproducible build script are public. The wider region uses the same dated source.',method2:'The white outline is today’s Belarus, used only to compare the same land through time. It is not a historical state boundary or an ethnic homeland. State membership, constituent republics, military occupation and declarations are distinct categories.',method3:'Seven approximate map snapshots accompany a longer political chronology. The original MAPA had 63 boundary states; this is an independent partial edition, not their complete recovery. Unreliable candidate years, including 1500 and 1800, were excluded. Medieval, partition, wartime and internal BSSR geometry is still incomplete.',rebuild:'Reproducible clipping script',review:'Review notes and provenance',originalBehavior:'How the original MAPA worked',license:'Modified historical geometry: GPL-3.0, with editable source data. Modern outline: Natural Earth, public domain. Place coordinates: GeoNames, CC BY 4.0. No warranty of survey-level precision.',eventEyebrow:'03 · Supporting places and documents',eventHeading:'Explore an event and its evidence.',backBorders:'Back to the historical map ↑',failed:'This map could not load. Choose another year or retry. No other year’s borders are being substituted.',mapDescription:'Historical country names and colors within a fixed present-day Belarus reference. A text explanation and named legend are also provided.',notBefore:'No earlier mapped snapshot in this edition.',focusMode:'Belarusian lands',regionMode:'Neighboring states',fixedScope:'White outline = present-day Belarus, kept fixed to compare the same land. Colors = historical states.',cityPrompt:'Find a present-day place',cityHint:'25 places for orientation. A marker does not imply that today’s town or name existed in the selected year.',citySelect:'Choose a city or town',cityUnresolved:'This coarse source does not reliably assign this point. No affiliation is inferred.',unresolved:'Unresolved source alignment',legend:'States shown on this map',selectedCountry:'Selected territory',countryHint:'Select a colored territory or a country in the legend.',allStates:'All states',mapHelp:'Click a colored territory to identify it. Use the city selector to locate a place.',share:'Copy map link',copied:'Map link copied.',copyFallback:'Copy this map link:',retry:'Retry this map',sources:'Historical context & sources →',data:'Map data and methods',fullPlaces:'All places and their affiliations',place:'Present-day place',affiliation:'State in this map',placeSource:'Place coordinates and attribution',compare:'Compare',with:'with',none:'No previous mapped snapshot',countries:'Countries & polities',north:'N',zoomIn:'Zoom in',zoomOut:'Zoom out',resetView:'Reset map view',zoomStatus:'Map zoom',labels:'Country names remain visible at every zoom level.'},
    be:{eyebrow:'01 · Тэрыторыя і прыналежнасць',title:'Хто кіраваў гэтымі землямі?',intro:'Абярыце эпоху вышэй. На мапе чытайце назвы дзяржаў і сачыце за колерамі. Гарады — арыенціры, а не мяжа ахопу мапы.',jumpEvents:'Звязаныя месцы і дакументы ↓',snapshot:'год мапы крыніцы',loading:'Загрузка абранай мапы…',play:'Прайграць мапы',pause:'Паўза',replay:'Паўтарыць мапы',previous:'Назад',next:'Далей',slider:'Датаваныя зрэзы мапы',previousOverlay:'Параўнаць папярэднія межы',accuracy:'Прыблізныя гістарычныя межы. Заштрыхаваныя краявыя ўчасткі — неўзгодненасць набораў даных, а не дадатковыя дзяржавы.',whatChanged:'Што змянілася пасля папярэдняй мапы?',download:'Спампаваць GeoJSON гэтай мапы',datasetSource:'Зыходная геаметрыя і версія ↗',methodLink:'Дакладнасць мапы і даныя ↓',methodTitle:'Для даследчыкаў: крыніцы, дакладнасць і адсутныя перыяды',method1:'Гістарычныя дзяржаўныя палігоны перасякаюцца са сталым сучасным контурам Беларусі. Лініі падзелу не маляваліся на вока. Выніковыя GeoJSON, версія крыніцы і скрыпт адкрытыя. Рэгіянальная мапа выкарыстоўвае тую самую датаваную крыніцу.',method2:'Белы контур — сучасная Беларусь, толькі каб параўноўваць тую самую зямлю ў часе. Гэта не гістарычная дзяржаўная мяжа і не этнічны арэал. Прыналежнасць дзяржаве, саюзныя рэспублікі, ваенная акупацыя і дэкларацыі — розныя катэгорыі.',method3:'Сем прыблізных картографічных зрэзаў дапаўняюць даўжэйшую палітычную храналогію. Арыгінальная MAPA мела 63 станы межаў; гэта незалежная частковая версія, а не іх поўнае аднаўленне. Ненадзейныя мапы, у тым ліку за 1500 і 1800 гады, выключаныя. Сярэднявечныя, ваенныя межы, падзелы і ўнутраныя межы БССР яшчэ адлюстраваныя не цалкам.',rebuild:'Скрыпт паўторнага стварэння',review:'Праверка і паходжанне даных',originalBehavior:'Як працавала арыгінальная MAPA',license:'Змененая гістарычная геаметрыя: GPL-3.0, з рэдагуемымі данымі. Сучасны контур: Natural Earth, грамадскі набытак. Каардынаты месцаў: GeoNames, CC BY 4.0. Без гарантый геадэзічнай дакладнасці.',eventEyebrow:'03 · Звязаныя месцы і дакументы',eventHeading:'Вывучыце падзею і яе крыніцу.',backBorders:'Да гістарычнай мапы ↑',failed:'Гэтая мапа не загрузілася. Абярыце іншы год або паўтарыце спробу. Межы іншага года не падстаўляюцца.',mapDescription:'Назвы і колеры гістарычных дзяржаў у сталым сучасным контуры Беларусі. Побач — тэкставае тлумачэнне і легенда з назвамі.',notBefore:'У гэтай версіі няма ранейшага картографічнага зрэзу.',focusMode:'Беларускія землі',regionMode:'Суседнія дзяржавы',fixedScope:'Белы контур = сучасная Беларусь, сталае акно параўнання. Колеры = гістарычныя дзяржавы.',cityPrompt:'Знайдзіце сучаснае месца',cityHint:'25 месцаў для арыентацыі. Маркер не азначае, што сучасны горад або яго назва існавалі ў абраны год.',citySelect:'Абярыце горад або мястэчка',cityUnresolved:'Гэтая грубая крыніца не дазваляе надзейна вызначыць прыналежнасць пункта. Здагадка не падстаўляецца.',unresolved:'Неўзгодненасць крыніц',legend:'Дзяржавы на гэтай мапе',selectedCountry:'Абраная тэрыторыя',countryHint:'Абярыце каляровую тэрыторыю або дзяржаву ў легендзе.',allStates:'Усе дзяржавы',mapHelp:'Націсніце каляровую тэрыторыю, каб вызначыць яе. Абярыце горад у спісе, каб знайсці месца.',share:'Скапіяваць спасылку на мапу',copied:'Спасылка на мапу скапіяваная.',copyFallback:'Скапіюйце спасылку:',retry:'Паўтарыць загрузку',sources:'Гістарычны кантэкст і крыніцы →',data:'Даныя і метад',fullPlaces:'Усе месцы і іх прыналежнасць',place:'Сучаснае месца',affiliation:'Дзяржава на гэтай мапе',placeSource:'Каардынаты месцаў і крыніца',compare:'Параўнаць',with:'і',none:'Няма папярэдняй мапы',countries:'Краіны і дзяржавы',north:'Пн',zoomIn:'Павялічыць',zoomOut:'Паменшыць',resetView:'Скінуць маштаб',zoomStatus:'Маштаб мапы',labels:'Назвы дзяржаў застаюцца бачнымі пры змене маштабу.'}
  };
  for (const vocabulary of Object.values(words)) {
    for (const [alias,key] of Object.entries({chooseCity:'citySelect',allCities:'fullPlaces',cityColumn:'place',affiliationColumn:'affiliation',copyLink:'share',readContext:'sources'})) vocabulary[alias]=vocabulary[key];
  }
  const polities={
    'Poland-Lithuania':{name:['Grand Duchy of Lithuania','Вялікае Княства Літоўскае'],region:['Poland and Lithuania','Польшча і Літва'],lines:[['GRAND DUCHY','OF LITHUANIA'],['ВЯЛІКАЕ КНЯСТВА','ЛІТОЎСКАЕ']],color:['#2b6257','#8cdfb6']},
    'Poland-Llituania':{name:['Polish–Lithuanian Commonwealth · Grand Duchy of Lithuania','Рэч Паспалітая · Вялікае Княства Літоўскае'],region:['Polish–Lithuanian Commonwealth','Рэч Паспалітая'],lines:[['POLISH–LITHUANIAN','COMMONWEALTH'],['РЭЧ','ПАСПАЛІТАЯ']],sub:['Grand Duchy of Lithuania','Вялікае Княства Літоўскае'],color:['#2b6257','#8cdfb6']},
    'Polish–Lithuanian Commonwealth':{name:['Polish–Lithuanian Commonwealth · Grand Duchy of Lithuania','Рэч Паспалітая · Вялікае Княства Літоўскае'],region:['Polish–Lithuanian Commonwealth','Рэч Паспалітая'],lines:[['POLISH–LITHUANIAN','COMMONWEALTH'],['РЭЧ','ПАСПАЛІТАЯ']],sub:['Grand Duchy of Lithuania','Вялікае Княства Літоўскае'],color:['#2b6257','#8cdfb6']},
    'Russian Empire':{name:['Russian Empire','Расійская імперыя'],lines:[['RUSSIAN','EMPIRE'],['РАСІЙСКАЯ','ІМПЕРЫЯ']],color:['#735934','#f3cc85']},
    USSR:{name:['Soviet Union','Савецкі Саюз'],lines:[['SOVIET','UNION'],['САВЕЦКІ','САЮЗ']],sub:['Belarusian SSR context','Кантэкст Беларускай ССР'],color:['#704653','#ecb1c0']},
    Poland:{name:['Polish Republic','Польская Рэспубліка'],lines:[['POLISH','REPUBLIC'],['ПОЛЬСКАЯ','РЭСПУБЛІКА']],color:['#3a6178','#add6ee']},
    Byelarus:{name:['Republic of Belarus','Рэспубліка Беларусь'],lines:[['REPUBLIC OF','BELARUS'],['РЭСПУБЛІКА','БЕЛАРУСЬ']],color:['#516533','#d5f792']}
  };
  const regionNames={
    'Austrian Empire':['Habsburg Monarchy','Манархія Габсбургаў'],'Holy Roman Empire':['Holy Roman Empire','Свяшчэнная Рымская імперыя'],'Tsardom of Muscovy':['Tsardom of Russia','Рускае царства'],'Austro-Hungarian Empire':['Austria-Hungary','Аўстра-Венгрыя'],'German Empire':['German Empire','Германская імперыя'],'Denmark-Norway':['Denmark–Norway','Данія–Нарвегія'],'Imperial Hungary':['Kingdom of Hungary','Венгерскае каралеўства'],
    'Ottoman Empire':['Ottoman Empire','Асманская імперыя'],'Crimean Khanate':['Crimean Khanate','Крымскае ханства'],'German States':['German states','Германскія дзяржавы'],'Grand Duchy of Moscow':['Grand Duchy of Moscow','Вялікае Княства Маскоўскае'],'Muscovy':['Grand Duchy of Moscow','Вялікае Княства Маскоўскае'],'Teutonic Order':['Teutonic Order','Тэўтонскі ордэн'],
    'Germany (Soviet)':['Germany · Soviet occupation','Германія · савецкая акупацыя'],'Germany (USA)':['Germany · US occupation','Германія · амерыканская акупацыя'],'Kingfom of Italy':['Kingdom of Italy','Каралеўства Італія'],
    'Teutonic Knights':['Teutonic Order','Тэўтонскі ордэн'],Ryazan:['Principality of Ryazan','Разанскае княства'],Pskov:['Pskov Republic','Пскоўская рэспубліка'],'Golden Horde':['Golden Horde · source label','Залатая Арда · назва крыніцы'],
    Estonia:['Estonia','Эстонія'],Latvia:['Latvia','Латвія'],Lithuania:['Lithuania','Літва'],Norway:['Norway','Нарвегія'],Romania:['Romania','Румынія'],Czechoslovakia:['Czechoslovakia','Чэхаславакія'],Hungary:['Hungary','Венгрыя'],Germany:['Germany','Германія'],Sweden:['Sweden','Швецыя'],Finland:['Finland','Фінляндыя'],Denmark:['Denmark','Данія'],Yugoslavia:['Yugoslavia','Югаславія'],Italy:['Italy','Італія'],Austria:['Austria','Аўстрыя'],Ukraine:['Ukraine','Украіна'],Slovakia:['Slovakia','Славакія'],Moldova:['Moldova','Малдова'],Slovenia:['Slovenia','Славенія'],Croatia:['Croatia','Харватыя'],Serbia:['Serbia','Сербія'],'Czech Republic':['Czech Republic','Чэшская Рэспубліка'],Russia:['Russia','Расія'],Venice:['Republic of Venice','Венецыянская Рэспубліка']
  };
  const cities=window.MAPA_CITIES || [{id:'minsk',name:['Minsk','Мінск'],point:[27.5615,53.9023],major:true}];
  let index=4, lang='en', mode='focus', cityId='minsk', selectedPolity='', timer=null, renderToken=0, overlayToken=0, loading=false, currentFeatures=[], regionFeatures=[], zoom=1, baseView=[0,0,960,700];
  const cache=new Map();
  let playbackGeneration=0,startingPlayback=false;
  const local=value=>value[lang==='be'?1:0];
  const t=key=>words[lang][key] || key;
  const create=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const node=(tag,attrs={})=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));return el;};
  const projection=([lon,lat])=>[(lon-12)/28*960,(61-lat)/15*700];
  const polygons=geometry=>geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;
  const path=geometry=>polygons(geometry).map(poly=>poly.map(ring=>ring.map((point,i)=>(i?'L':'M')+projection(point).map(n=>n.toFixed(2)).join(',')).join('')+'Z').join('')).join('');
  function inRing(point,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
  const contains=(point,geometry)=>polygons(geometry).some(poly=>inRing(point,poly[0])&&!poly.slice(1).some(hole=>inRing(point,hole)));
  const affiliation=point=>currentFeatures.find(f=>contains(point,f.geometry))?.properties.NAME;
  function polityName(name,regional=false){
    if(name==='Prussia')return local(eras[index].year<1618?['Duchy of Prussia','Прускае герцагства']:['Brandenburg–Prussia','Брандэнбург-Прусія']);
    if(name==='Finland'&&eras[index].year===1914)return local(['Grand Duchy of Finland · Russian Empire','Вялікае Княства Фінляндскае · Расійская імперыя']);
    if(name==='Poland'&&eras[index].year===1994)return local(['Republic of Poland','Рэспубліка Польшча']);
    const info=polities[name];return info?local(regional&&info.region?info.region:info.name):local(regionNames[name]||[name||'Unassigned',name||'Не вызначана']);
  }
  const color=name=>polities[name]?.color || ['#263c35','#91a99a'];
  async function load(year,kind='focus'){
    const key=`${kind}_${year}`;
    if(!cache.has(key))cache.set(key,fetch(`./history/${key}.geojson`).then(response=>{if(!response.ok)throw Error(response.status);return response.json();}).catch(error=>{cache.delete(key);throw error;}));
    return cache.get(key);
  }
  async function reference(){if(!cache.has('reference'))cache.set('reference',fetch('./history/belarus-reference.geojson').then(response=>{if(!response.ok)throw Error(response.status);return response.json();}).catch(error=>{cache.delete('reference');throw error;}));return cache.get('reference');}
  function mapURL(){const url=new URL(location.href);url.searchParams.set('lang',lang);url.searchParams.set('year',eras[index].year);url.searchParams.delete('stage');if(mode==='region')url.searchParams.set('mapScope','region');else url.searchParams.delete('mapScope');if(cityId!=='minsk')url.searchParams.set('city',cityId);else url.searchParams.delete('city');if(selectedPolity)url.searchParams.set('polity',selectedPolity);else url.searchParams.delete('polity');url.hash='borders';return url;}
  function sync(push=false){const url=mapURL();if(url.href!==location.href)history[push?'pushState':'replaceState']({},'',url);}
  function stop(){playbackGeneration++;startingPlayback=false;if(timer)clearTimeout(timer);timer=null;$('history-play').setAttribute('aria-pressed','false');$('history-play').textContent=t(index===eras.length-1?'replay':'play');}
  function announceYear(){window.dispatchEvent(new CustomEvent('mapa-year-changed',{detail:eras[index].year}));}
  function select(next,manual=true){if(manual)stop();const changed=index!==next;index=Math.max(0,Math.min(eras.length-1,next));selectedPolity='';zoom=1;sync(manual);if(changed)announceYear();return render();}
  function setView(){const [x,y,w,h]=baseView,cx=x+w/2,cy=y+h/2;$('history-map').setAttribute('viewBox',`${cx-w/zoom/2} ${cy-h/zoom/2} ${w/zoom} ${h/zoom}`);$('history-zoom-out').disabled=zoom<=1;$('history-zoom-in').disabled=zoom>=2;$('history-zoom-reset').textContent=`${Math.round(zoom*100)}%`;if(currentFeatures.length){drawCountryLabels();drawCities(false);}}
  function screenScale(){const rect=$('history-map').getBoundingClientRect();return Math.min(rect.width/(baseView[2]/zoom),rect.height/(baseView[3]/zoom))||1;}
  function textUI(){
    lang=document.documentElement.lang==='be'?'be':'en';
    document.querySelectorAll('[data-history]').forEach(el=>el.textContent=t(el.dataset.history));
    $('history-years').setAttribute('aria-label',t('slider'));
    $('history-play').textContent=t(timer||startingPlayback?'pause':index===eras.length-1?'replay':'play');
    $('history-place-select').setAttribute('aria-label',t('citySelect'));
    $('history-legend').setAttribute('aria-label',t('legend'));
    $('history-cities').setAttribute('aria-label',t('citySelect'));
    $('history-city-hint').textContent=t('cityHint').replace('25',cities.length);
    ['in','out','reset'].forEach(action=>$(`history-zoom-${action}`).setAttribute('aria-label',t(action==='reset'?'resetView':action==='in'?'zoomIn':'zoomOut')));
    document.querySelectorAll('[data-history-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.historyMode===mode)));
    const last=index>0?`${t('compare')} ${eras[index-1].year} ${t('with')} ${eras[index].year} · ${lang==='be'?'пункцір':'dashed'}`:t('none');
    document.querySelector('[data-history="previousOverlay"]').textContent=last;
    for(const option of $('history-place-select').options){const city=cities.find(c=>c.id===option.value);if(city)option.textContent=local(city.name);}
    for(const button of $('history-cities').children){const city=cities.find(c=>c.id===button.dataset.city);if(city)button.textContent=local(city.name);}
  }
  function drawGroup(group,features,className){group.replaceChildren();for(const f of features)group.append(node('path',{d:path(f.geometry),class:className,'fill-rule':'evenodd'}));}
  // Interior labels are chosen from real polygons, never a guessed country center.
  function interior(geometry){
    let best=null,bestArea=-1;
    for(const poly of polygons(geometry)){const ring=poly[0],area=Math.abs(ring.reduce((sum,p,i)=>{const q=ring[(i+1)%ring.length];return sum+p[0]*q[1]-q[0]*p[1];},0));if(area>bestArea){best=poly;bestArea=area;}}
    if(!best)return null;
    const projected=best[0].map(projection),xs=projected.map(p=>p[0]),ys=projected.map(p=>p[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    let chosen=null,score=-1;
    for(let ix=1;ix<22;ix++)for(let iy=1;iy<22;iy++){
      const x=minX+(maxX-minX)*ix/22,y=minY+(maxY-minY)*iy/22,point=[x/960*28+12,61-y/700*15];
      if(!inRing(point,best[0])||best.slice(1).some(h=>inRing(point,h)))continue;
      let distance=Infinity;
      for(let i=0;i<projected.length;i++){const a=projected[i],b=projected[(i+1)%projected.length],dx=b[0]-a[0],dy=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));distance=Math.min(distance,(x-a[0]-u*dx)**2+(y-a[1]-u*dy)**2);}
      if(distance>score){score=distance;chosen={x,y,width:maxX-minX,height:maxY-minY,clearance:Math.sqrt(distance)};}
    }
    return chosen;
  }
  const wrap=(value,max)=>{const lines=[''];for(const word of value.split(' ')){const i=lines.length-1;if(lines[i]&&lines[i].length+word.length+1>max)lines.push(word);else lines[i]+=(lines[i]?' ':'')+word;}return lines;};
  function drawCountryLabels(){
    const layer=$('history-polity-labels');layer.replaceChildren();
    const features=mode==='region'?regionFeatures:currentFeatures,anchors=new Map();
    for(const feature of features){const name=feature.properties.NAME;if(!name)continue;const anchor=interior(feature.geometry);if(anchor&&(!anchors.has(name)||anchor.clearance>anchors.get(name).clearance))anchors.set(name,anchor);}
    for(const [name,anchor] of anchors){
      const main=eras[index].match.includes(name),info=polities[name],regional=mode==='region';
      if(regional&&!main&&(anchor.width<34||anchor.height<25))continue;
      const scale=screenScale(),fontsize=Math.max(regional?(main?24:15):13,(regional?(main?14:11):18)/scale);
      const maxCharacters=Math.max(9,Math.min(main?21:16,Math.floor(anchor.width/(fontsize*.56))));
      const labelName=name==='Finland'&&eras[index].year===1914?local(['Finland (Russian Empire)','Фінляндыя (Расійская імперыя)']):polityName(name,true);
      const lines=regional?wrap(labelName,maxCharacters):local(info.lines);
      const group=node('g',{class:`history-polity-label${main?' is-main':''}`,'data-country-label':name,'pointer-events':'none'});
      const text=node('text',{x:anchor.x,y:anchor.y-(lines.length-1)*fontsize*.57,'text-anchor':'middle','font-size':fontsize});
      lines.forEach((line,i)=>{const span=node('tspan',{x:anchor.x,dy:i?fontsize*1.15:0});span.textContent=line;text.append(span);});
      group.append(text);
      if(!regional&&info.sub&&$('history-map').getBoundingClientRect().width>=600){const sub=node('text',{x:anchor.x,y:anchor.y+(lines.length-1)*fontsize*.57+fontsize*1.4,'text-anchor':'middle',class:'history-polity-subtitle','font-size':Math.max(7.5,10/scale)});sub.textContent=local(info.sub);group.append(sub);}
      layer.append(group);
      // Keep text inside the visible frame; only labels move, never boundaries.
      if(typeof group.getBBox==='function'){
        const box=group.getBBox(),[bx,by,bw,bh]=baseView,vx=bx+bw/2-bw/zoom/2,vy=by+bh/2-bh/zoom/2,vw=bw/zoom,vh=bh/zoom,margin=6/scale;
        if(anchor.x<vx||anchor.x>vx+vw||anchor.y<vy||anchor.y>vy+vh){group.remove();continue;}
        const dx=box.x<vx+margin?vx+margin-box.x:box.x+box.width>vx+vw-margin?vx+vw-margin-box.x-box.width:0;
        const dy=box.y<vy+margin?vy+margin-box.y:box.y+box.height>vy+vh-margin?vy+vh-margin-box.y-box.height:0;
        if(dx||dy)group.setAttribute('transform',`translate(${dx} ${dy})`);
      }
    }
  }
  function choosePolity(name,push=true){stop();selectedPolity=name;sync(push);showPolity();}
  function showPolity(){
    document.querySelectorAll('[data-polity]').forEach(el=>el.classList.toggle('is-selected',el.dataset.polity===selectedPolity));
    document.querySelectorAll('[data-legend-polity]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.legendPolity===selectedPolity)));
    $('history-country-result').textContent=selectedPolity?`${eras[index].year} → ${polityName(selectedPolity,mode==='region')}`:t('countryHint');
  }
  function drawLegend(){
    const layer=$('history-legend');layer.replaceChildren();
    const names=eras[index].match.slice();if(mode==='region')for(const f of regionFeatures){const name=f.properties.NAME;if(name&&!names.includes(name)&&interior(f.geometry)?.width>=34)names.push(name);}
    const mainGroup=create('div','history-legend-main');layer.append(mainGroup);
    let rest=null;
    names.forEach((name,i)=>{if(i===eras[index].match.length){rest=create('details','history-neighbor-list');rest.append(create('summary','',t('countries')));layer.append(rest);}const button=create('button','history-legend-item',polityName(name,mode==='region'));button.type='button';button.dataset.legendPolity=name;button.style.setProperty('--polity-fill',color(name)[0]);button.style.setProperty('--polity-stroke',color(name)[1]);button.addEventListener('click',()=>choosePolity(name));(rest||mainGroup).append(button);});
    showPolity();
  }
  function buildCities(){
    const selector=$('history-place-select');selector.replaceChildren();
    cities.forEach(city=>{const option=create('option','',local(city.name));option.value=city.id;selector.append(option);});
    $('history-cities').replaceChildren();cities.filter(city=>city.major).forEach(city=>{const button=create('button','',local(city.name));button.type='button';button.dataset.city=city.id;button.addEventListener('click',()=>chooseCity(city.id));$('history-cities').append(button);});
  }
  function chooseCity(id){stop();cityId=id;selectedPolity=affiliation(cities.find(c=>c.id===id).point)||'';sync(true);drawCities(false);showPolity();}
  function drawCities(rebuildTable=true){
    $('history-labels').replaceChildren();
    const occupied=[...$('history-polity-labels').children].map(el=>typeof el.getBBox==='function'?el.getBBox():null).filter(Boolean);
    const scale=screenScale(),fontSize=Math.max(mode==='region'?16:9,11/scale),padding=4/scale;
    const overlaps=(a,b)=>a.x<b.x+b.width+padding&&a.x+a.width+padding>b.x&&a.y<b.y+b.height+padding&&a.y+a.height+padding>b.y;
    for(const city of cities){
      const active=city.id===cityId,[x,y]=projection(city.point),group=node('g',{class:`history-city-mark${active?' active':''}${city.major?' is-major':''}`,'data-map-city':city.id});
      group.append(node('circle',{cx:x,cy:y,r:Math.max(active?2.8:city.major?1.9:1.2,(active?3:city.major?2:1.2)/scale)}));
      const title=node('title');title.textContent=local(city.name);group.append(title);$('history-labels').append(group);
      if(active||(city.major&&mode!=='region')){
        const label=node('text',{class:'history-city-label'});label.style.fontSize=`${fontSize}px`;label.textContent=local(city.name);group.append(label);
        const choices=[[padding,-padding,'start'],[padding,fontSize+padding,'start'],[-padding,-padding,'end'],[-padding,fontSize+padding,'end']];
        let placed=false;
        for(const [dx,dy,align] of choices){label.setAttribute('x',x+dx);label.setAttribute('y',y+dy);label.setAttribute('text-anchor',align);const box=typeof label.getBBox==='function'?label.getBBox():null;if(!box||!occupied.some(other=>overlaps(box,other))){if(box)occupied.push(box);placed=true;break;}}
        if(!placed&&!active)label.remove();
      }
      group.addEventListener('click',()=>chooseCity(city.id));
    }
    $('history-place-select').value=cityId;
    for(const button of $('history-cities').children)button.setAttribute('aria-pressed',String(button.dataset.city===cityId));
    const city=cities.find(c=>c.id===cityId),owner=affiliation(city.point);
    $('history-city-result').textContent=`${eras[index].year} · ${local(city.name)} → ${owner?polityName(owner):t('cityUnresolved')}`;
    if(rebuildTable){$('history-places-body').replaceChildren();
      cities.forEach(place=>{const row=create('tr'),cell=create('td'),button=create('button','history-table-place',local(place.name));button.type='button';button.dataset.tableCity=place.id;button.addEventListener('click',()=>{chooseCity(place.id);$('history-city-result').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});cell.append(button);const owner=affiliation(place.point);row.append(cell,create('td','',owner?polityName(owner):t('cityUnresolved')));$('history-places-body').append(row);});
    }
    $('history-places-body').querySelectorAll('[data-table-city]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tableCity===cityId)));
  }
  async function overlays(){
    const ownToken=++overlayToken,year=eras[index].year;
    $('history-prior').replaceChildren();$('history-prior').toggleAttribute('hidden',!$('history-show-prior').checked||index===0);
    if(!$('history-show-prior').checked||index===0)return;
    try{const previous=eras[index-1],data=await load(previous.year,mode==='region'?'world':'focus');if(ownToken!==overlayToken||year!==eras[index].year||!$('history-show-prior').checked)return;drawGroup($('history-prior'),data.features.filter(f=>previous.match.includes(f.properties.NAME)),'history-prior-outline');}
    catch{if(ownToken!==overlayToken)return;$('history-show-prior').checked=false;$('history-prior').setAttribute('hidden','');}
  }
  async function render(){
    const token=++renderToken,era=eras[index];loading=true;textUI();
    $('history-era-year').textContent=`${era.year} · ${index+1} / ${eras.length}`;$('history-map-year').textContent=era.year;
    $('history-era-title').textContent=local(era.title);$('history-era-text').textContent=local(era.body);$('history-era-warning').textContent=local(era.warning);$('history-change').textContent=local(era.change);$('history-answer').textContent=local(era.answer);
    $('history-range').max=eras.length-1;$('history-range').value=index;$('history-range').setAttribute('aria-valuetext',String(era.year));$('history-prev').disabled=index===0;$('history-next').disabled=index===eras.length-1;
    $('history-show-prior').disabled=index===0;
    document.querySelectorAll('[data-era]').forEach(button=>button.setAttribute('aria-pressed',String(+button.dataset.era===index)));
    $('history-data-link').href=`./history/${mode==='region'?'world':'focus'}_${era.year}.geojson`;$('history-source-link').href=`https://github.com/aourednik/historical-basemaps/blob/62d8f1a03a71f2d3ff17f2d166f7553f256bce68/geojson/world_${era.year}.geojson`;
    $('history-map-title').textContent=`${era.year} · ${local(era.title)}`;$('history-map-desc').textContent=local(era.answer)+' '+t('mapDescription');
    $('history-load-status').hidden=false;$('history-load-status').textContent=t('loading');$('history-retry').hidden=true;
    for(const id of ['history-shapes','history-surrounding','history-prior','history-polity-labels','history-labels','history-legend','history-reference','history-reference-fill'])$(id).replaceChildren();
    currentFeatures=[];regionFeatures=[];$('history-city-result').textContent=t('loading');$('history-country-result').textContent='';$('history-places-body').replaceChildren();
    $('history-place-select').disabled=true;$('history-cities').querySelectorAll('button').forEach(button=>button.disabled=true);
    try{
      const [data,ref,world]=await Promise.all([load(era.year),reference(),mode==='region'?load(era.year,'world'):Promise.resolve(null)]);
      if(token!==renderToken)return;
      currentFeatures=data.features.filter(f=>era.match.includes(f.properties.NAME));regionFeatures=world?.features||[];
      if(!currentFeatures.length)throw Error('No matching source geometry');
      drawGroup($('history-reference-fill'),ref.features,'history-reference-ground');drawGroup($('history-reference'),ref.features,'history-fixed-outline');
      const points=polygons(ref.features[0].geometry).flat(2).map(projection),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
      baseView=mode==='region'?[0,0,960,700]:[x-w*.11,y-h*.12,w*1.22,h*1.24];setView();$('history-map').classList.toggle('is-region',mode==='region');
      $('history-surrounding').toggleAttribute('hidden',mode!=='region');
      for(const feature of regionFeatures){const name=feature.properties.NAME,shape=node('path',{d:path(feature.geometry),'fill-rule':'evenodd',class:'history-context-country',fill:color(name)[0],stroke:color(name)[1]});if(name){shape.dataset.polity=name;const title=node('title');title.textContent=polityName(name,true);shape.append(title);shape.addEventListener('click',()=>choosePolity(name));}$('history-surrounding').append(shape);}
      for(const feature of currentFeatures){const name=feature.properties.NAME,shape=node('path',{d:path(feature.geometry),'fill-rule':'evenodd',class:'history-focus','data-polity':name,fill:color(name)[0],stroke:color(name)[1]});const title=node('title');title.textContent=polityName(name);shape.append(title);shape.addEventListener('click',()=>choosePolity(name));$('history-shapes').append(shape);}
      if(selectedPolity&&!currentFeatures.concat(regionFeatures).some(f=>f.properties.NAME===selectedPolity))selectedPolity='';
      drawCountryLabels();drawLegend();drawCities();$('history-place-select').disabled=false;$('history-cities').querySelectorAll('button').forEach(button=>button.disabled=false);$('history-load-status').hidden=true;loading=false;await overlays();return token===renderToken;
    }catch{if(token!==renderToken)return false;loading=false;stop();$('history-load-status').textContent=t('failed');$('history-map-desc').textContent=t('failed');$('history-city-result').textContent=t('failed');$('history-retry').hidden=false;return false;}
  }
  function readURL(){const params=new URLSearchParams(location.search),found=eras.findIndex(era=>era.year===+params.get('year'));index=found>=0?found:eras.findIndex(e=>e.year===1938);mode=params.get('mapScope')==='region'?'region':'focus';cityId=cities.some(c=>c.id===params.get('city'))?params.get('city'):'minsk';selectedPolity=params.get('polity')||'';zoom=1;}
  eras.forEach((era,i)=>{const button=create('button','',era.year);button.type='button';button.dataset.era=i;button.addEventListener('click',()=>select(i));$('history-years').append(button);});
  $('history-range').addEventListener('input',event=>select(+event.target.value));$('history-prev').addEventListener('click',()=>select(index-1));$('history-next').addEventListener('click',()=>select(index+1));
  async function tick(){if(document.hidden||$('borders').hidden){stop();return;}if(loading){timer=setTimeout(tick,500);return;}if(index===eras.length-1){stop();return;}const generation=playbackGeneration;await select(index+1,false);if(!timer||generation!==playbackGeneration)return;if(index===eras.length-1){stop();return;}timer=setTimeout(tick,4500);}
  $('history-play').addEventListener('click',async()=>{
    if(timer||startingPlayback){stop();return;}
    const generation=++playbackGeneration;startingPlayback=true;
    $('history-play').setAttribute('aria-pressed','true');$('history-play').textContent=t('pause');
    const ready=index===eras.length-1?await select(0,false):true;
    if(generation!==playbackGeneration)return;
    if(!ready||document.hidden||$('borders').hidden){stop();return;}
    startingPlayback=false;timer=setTimeout(tick,4500);
  });
  $('history-show-prior').addEventListener('change',()=>{stop();overlays();});$('history-place-select').addEventListener('change',event=>chooseCity(event.target.value));
  document.querySelectorAll('[data-history-mode]').forEach(button=>button.addEventListener('click',()=>{stop();mode=button.dataset.historyMode;zoom=1;sync(true);render();}));
  $('history-zoom-in').addEventListener('click',()=>{stop();zoom=Math.min(2,zoom+.25);setView();});$('history-zoom-out').addEventListener('click',()=>{stop();zoom=Math.max(1,zoom-.25);setView();});$('history-zoom-reset').addEventListener('click',()=>{zoom=1;setView();});
  $('history-retry').addEventListener('click',()=>render());
  $('history-copy-url').addEventListener('click',async()=>{stop();const url=mapURL().href;const input=$('history-copy-fallback');input.value=url;try{await navigator.clipboard.writeText(url);$('history-copy-status').textContent=t('copied');input.hidden=true;}catch{input.hidden=false;$('history-copy-status').textContent=t('copyFallback');input.focus();input.select();}});
  $('history-read-context').addEventListener('click',()=>{stop();window.dispatchEvent(new CustomEvent('mapa-read-context',{detail:eras[index].year}));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  new MutationObserver(()=>{stop();render();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('mapa-select-year',event=>{const found=eras.findIndex(era=>era.year===+event.detail);if(found>=0){select(found);$('borders').scrollIntoView({behavior:'smooth'});}});
  window.addEventListener('mapa-canonical-map',()=>sync());window.addEventListener('mapa-pause-history',stop);
  window.addEventListener('popstate',()=>{stop();readURL();render();});
  let resizeFrame;
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(currentFeatures.length&&!loading){drawCountryLabels();drawCities(false);}});});
  readURL();lang=document.documentElement.lang==='be'?'be':'en';buildCities();render();
})();
