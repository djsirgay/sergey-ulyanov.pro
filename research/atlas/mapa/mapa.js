(() => {
  'use strict';
  const events = window.MAPA_EVENTS || [];
  const places = window.MAPA_PLACES || {};
  const $ = selector => document.querySelector(selector);
  const text = {
    en: {
      title:'Belarusian lands. Changing states.', intro:'Which states governed these lands — and when were they divided? Keep Belarus in view, compare the political map, and follow the historical transitions behind it.',
      research:'Research', directory:'Culture directory', guide:'How to use', credits:'Original creators', skip:'Skip to the map',
      search:'Search events or places', placeholder:'Try Skaryna, language, Riga, or 1918', topic:'Topic', period:'Period', reset:'Clear filters',
      all:'All topics', places:'Places & origins', language:'Language & print', politics:'Statehood & borders', heritage:'Built heritage', digital:'Digital culture',
      anytime:'All periods', early:'Before 1900', twentieth:'1900–1999', recent:'2000 onward',
      map:'Map', table:'Table', timeline:'Choose an event', region:'Regional map', modern:'Modern geographic context · event locations, not historical borders',
      scope:'5 mapped years · 26 chronology stages · EN / БЕЛ', scopeNote:'An independent edition inspired by MAPA, with new code and source-linked notes.',
      results:'events', of:'of', locations:'places', source:'Read the source', context:'A question to explore', sourceLanguage:'Source language',
      sourceType:'Source type', checked:'Source checked September 8, 2026', document:'Historical document / official record', institution:'Institutional reference', creator:'Creator’s own account',
      date:'Date', event:'Event', place:'Place', sourceColumn:'Source', inspect:'Explore event',
      previous:'Previous event', next:'Next event', share:'Copy event link', copied:'Link copied.', copyFallback:'Copy this event link:', export:'Download filtered data',
      noResults:'No events match these filters.', noResultsNote:'Try a place, name, or year, or clear the filters to see the full selection.',
      noSelection:'Select an event to read its context and source.', selected:'Selected event', mapUnavailable:'The map image could not load. The timeline and table still contain every event and source.',
      mapHelp:'Select a place marker. A number means several events share that place; select it again to move through them.',
      coordinateNote:'Markers show approximate city or site locations, not exact historical venues.',
      english:'English', belarusian:'Belarusian', russian:'Russian', polish:'Polish',
      guideTitle:'Start with one connection.',
      guide1:'Start with 1938: Brest and Minsk belonged to different states. Choose their buttons to inspect the division. Change the map year or press Play; the white modern Belarus reference stays fixed.',
      guide2:'Open Political chronology for the intermediate partitions, declarations, occupation, internal republic changes and independence. Context-only stages have sources, but no invented borders. The separate event collection links places and documents.',
      guide3:'Switch to the table for a full list. Copy an event link for a reader, or download the filtered records and source URLs as JSON.',
      keyboard:'Keyboard: Tab reaches every control; ↑/↓ move between event buttons; Home/End select the first/last visible event. Enter or Space opens a place marker.',
      editionTitle:'A new map, with its origins visible.',
      editionText:'The original Interactive Map of Belarusian History (MAPA) was created by Alexey Cherenkevich and his collaborators. This edition by Sergéy Ulyanov independently implements a map-and-timeline idea, adding accessible navigation, bilingual annotations, direct event links, and exports.',
      editionLimit:'Five approximate mapped snapshots, 26 chronology stages and ten source-linked events form an independent partial edition, not the original’s complete 63-state history. Context-only stages have no invented border maps. Geometry comes from a separately licensed dataset; the original drawings, illustrations and code are not reproduced. The original creators have not endorsed this edition.',
      credited:'Original MAPA credits, as documented by its creator',
      creditIdea:'Idea and design',creditFront:'Front-end',creditText:'Texts and translations',creditManager:'Management',creditAdvice:'Advice',
      author:'Alexey Cherenkevich',front:'Yauhen Shpileuski',translations:'Hanna Shyrayeva',manager:'Viktar Yakunin',advisor:'Pavel Kedzich',
      process:'Original process article',resultsArticle:'Original results and credits',capture:'Archived original',portfolio:'Creator’s portfolio',
      geographicSource:'Basemap: Natural Earth 1:50m, public domain. Simplified contemporary boundaries are geographic orientation only.',
      correction:'Suggest a source or correction', footer:'Independent research edition · Sergéy Ulyanov · September 2026',
      dataNotice:'Export includes the visible records, both languages, approximate coordinates, source URLs, and date of this source review. It contains no original MAPA assets.',
      countryBelarus:'BELARUS',countryLithuania:'LITHUANIA',countryLatvia:'LATVIA',countryPoland:'POLAND',countryUkraine:'UKRAINE',countryGermany:'GERMANY',countryCzechia:'CZECHIA',countryRussia:'RUSSIA'
    },
    be: {
      title:'Беларускія землі. Розныя дзяржавы.',intro:'Якія дзяржавы кіравалі гэтымі землямі — і калі яны былі падзеленыя? Трымайце Беларусь у полі зроку, параўноўвайце палітычную мапу і вывучайце пераходы паміж этапамі.',
      research:'Даследаванне',directory:'Каталог культуры',guide:'Як карыстацца',credits:'Аўтары арыгінала',skip:'Перайсці да мапы',
      search:'Пошук падзей або месцаў',placeholder:'Напрыклад: Скарына, мова, Рыга або 1918',topic:'Тэма',period:'Перыяд',reset:'Скінуць фільтры',
      all:'Усе тэмы',places:'Месцы і вытокі',language:'Мова і друк',politics:'Дзяржаўнасць і межы',heritage:'Архітэктурная спадчына',digital:'Лічбавая культура',
      anytime:'Усе перыяды',early:'Да 1900 года',twentieth:'1900–1999',recent:'Ад 2000 года',
      map:'Мапа',table:'Табліца',timeline:'Абярыце падзею',region:'Мапа рэгіёна',modern:'Сучасная геаграфія · месцы падзей, а не гістарычныя межы',
      scope:'5 гадоў на мапе · 26 этапаў храналогіі · EN / БЕЛ',scopeNote:'Незалежная версія, натхнёная MAPA: новы код і анатацыі са спасылкамі на крыніцы.',
      results:'падзей',of:'з',locations:'месцаў',source:'Прачытаць крыніцу',context:'Пытанне для разважання',sourceLanguage:'Мова крыніцы',
      sourceType:'Тып крыніцы',checked:'Крыніца праверана 8 верасня 2026 года',document:'Гістарычны дакумент / афіцыйны запіс',institution:'Даведка ўстановы',creator:'Аповед аўтара праекта',
      date:'Дата',event:'Падзея',place:'Месца',sourceColumn:'Крыніца',inspect:'Вывучыць падзею',
      previous:'Папярэдняя падзея',next:'Наступная падзея',share:'Скапіяваць спасылку на падзею',copied:'Спасылка скапіяваная.',copyFallback:'Скапіюйце спасылку на падзею:',export:'Спампаваць адабраныя даныя',
      noResults:'Няма падзей з такімі фільтрамі.',noResultsNote:'Паспрабуйце месца, імя або год. Альбо скіньце фільтры, каб пабачыць усю падборку.',
      noSelection:'Абярыце падзею, каб прачытаць кантэкст і крыніцу.',selected:'Абраная падзея',mapUnavailable:'Выява мапы не загрузілася. У храналогіі і табліцы даступныя ўсе падзеі і крыніцы.',
      mapHelp:'Абярыце маркер месца. Лічба азначае некалькі падзей у гэтым месцы; паўторны націск пераключае іх.',
      coordinateNote:'Маркеры паказваюць прыблізнае месцазнаходжанне гарадоў або помнікаў, а не дакладныя гістарычныя пляцоўкі.',
      english:'Англійская',belarusian:'Беларуская',russian:'Руская',polish:'Польская',
      guideTitle:'Пачніце з адной сувязі.',
      guide1:'Пачніце з 1938 года: Брэст і Мінск належалі розным дзяржавам. Націсніце іх кнопкі, каб праверыць падзел. Змяняйце год або запусціце прайграванне; белы сучасны контур Беларусі застаецца сталым.',
      guide2:'Адкрыйце палітычную храналогію: падзелы, дэкларацыі, акупацыя, унутраныя змены рэспублік і незалежнасць. Кантэкстныя этапы маюць крыніцы, але не выдуманыя межы. Асобная падборка падзей звязвае месцы і дакументы.',
      guide3:'Пераключыцеся на табліцу для поўнага спіса. Скапіюйце спасылку для чытача або спампуйце адабраныя запісы і крыніцы ў JSON.',
      keyboard:'Клавіятура: Tab пераходзіць паміж элементамі; ↑/↓ — паміж кнопкамі падзей; Home/End выбіраюць першую/апошнюю бачную падзею. Enter або прабел адкрываюць маркер месца.',
      editionTitle:'Новая мапа з бачнымі вытокамі.',
      editionText:'Арыгінальную Інтэрактыўную мапу беларускай гісторыі (MAPA) стварылі Аляксей Чаранкевіч і яго калегі. Гэтая версія Сяргея Ульянава незалежна ўвасабляе ідэю мапы з храналогіяй, дадаючы даступную навігацыю, двухмоўныя анатацыі, прамыя спасылкі і экспарт.',
      editionLimit:'Пяць прыблізных геаметрычных зрэзаў, 26 этапаў храналогіі і дзесяць падзей з крыніцамі — незалежная частковая версія, а не ўсе 63 станы арыгінала. Для кантэкстных этапаў межы не выдумляюцца. Геаметрыя ўзятая з асобнага ліцэнзаванага набору; арыгінальныя выявы, ілюстрацыі і код не ўзнаўляюцца. Аўтары арыгінала не ўхвалялі гэтую версію.',
      credited:'Каманда арыгінальнай MAPA паводле дакументацыі аўтара',
      creditIdea:'Ідэя і дызайн',creditFront:'Front-end',creditText:'Тэксты і пераклады',creditManager:'Менеджмент',creditAdvice:'Парады',
      author:'Аляксей Чаранкевіч',front:'Яўген Шпілеўскі',translations:'Ганна Шыраева',manager:'Віктар Якунін',advisor:'Павел Кедзіч',
      process:'Артыкул пра працэс',resultsArticle:'Вынікі і аўтарскія згадкі',capture:'Арыгінал у архіве',portfolio:'Партфоліа аўтара',
      geographicSource:'Геаграфічная аснова: Natural Earth 1:50m, грамадскі набытак. Спрошчаныя сучасныя межы дапамагаюць толькі арыентавацца ў прасторы.',
      correction:'Прапанаваць крыніцу або выпраўленне',footer:'Незалежная даследчая версія · Сяргей Ульянаў · верасень 2026',
      dataNotice:'Экспарт змяшчае бачныя запісы, абедзве мовы, прыблізныя каардынаты, спасылкі і дату праверкі крыніц. Матэрыялаў арыгінальнай MAPA ў ім няма.',
      countryBelarus:'БЕЛАРУСЬ',countryLithuania:'ЛІТВА',countryLatvia:'ЛАТВІЯ',countryPoland:'ПОЛЬШЧА',countryUkraine:'УКРАІНА',countryGermany:'ГЕРМАНІЯ',countryCzechia:'ЧЭХІЯ',countryRussia:'РАСІЯ'
    }
  };
  const state = {lang:'en', query:'', topic:'all', period:'all', view:'map', event:events[1]?.id || events[0]?.id};
  const categories=['places','language','politics','heritage','digital'];
  let visible=[];
  const t=key=>text[state.lang][key]||key;
  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’'`]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const aliases={language:['language','мова','друк','print'],мова:['language','мова','друк','print'],skaryna:['skaryna','скарына'],скарына:['skaryna','скарына'],heritage:['heritage','спадчына'],спадчына:['heritage','спадчына'],riga:['riga','рыга','рыжскі'],рыга:['riga','рыга','рыжскі']};
  const tokens=query=>norm(query).split(' ').filter(word=>word&&!['find','show','me','the','about','пра','знайдзі','найди','мне','пакажы','о'].includes(word));
  const dateLabel=event=>event.date?new Intl.DateTimeFormat(state.lang==='be'?'be-BY':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(event.date+'T12:00:00Z')):String(event.year);
  const project=place=>({x:(place.lon-12)/22.5*100,y:(58-place.lat)/9.5*100});
  const sourceLang=code=>t({en:'english',be:'belarusian',ru:'russian',pl:'polish'}[code]);
  const create=(tag,className,content)=>{const el=document.createElement(tag);if(className)el.className=className;if(content!==undefined)el.textContent=content;return el};
  function eventURL() {
    const url=new URL(location.href);
    for(const key of ['q','topic','period','view','event','lang'])url.searchParams.delete(key);
    url.searchParams.set('lang',state.lang);
    if(state.query)url.searchParams.set('q',state.query);
    if(state.topic!=='all')url.searchParams.set('topic',state.topic);
    if(state.period!=='all')url.searchParams.set('period',state.period);
    if(state.view!=='map')url.searchParams.set('view',state.view);
    if(state.event)url.searchParams.set('event',state.event);
    url.hash='explore';
    return url;
  }
  function syncURL(push=false) {const url=eventURL();if(url.href!==location.href)history[push?'pushState':'replaceState']({},'',url)}
  function readURL() {
    const params=new URLSearchParams(location.search);
    let saved='en';try{saved=localStorage.getItem('research-lang')||localStorage.getItem('living-belarus-atlas-lang')||'en'}catch{}
    state.lang=['en','be'].includes(params.get('lang'))?params.get('lang'):saved==='be'?'be':'en';
    state.query=params.get('q')||'';
    state.topic=categories.includes(params.get('topic'))?params.get('topic'):'all';
    state.period=['early','twentieth','recent'].includes(params.get('period'))?params.get('period'):'all';
    state.view=params.get('view')==='table'?'table':'map';
    state.event=events.some(event=>event.id===params.get('event'))?params.get('event'):'skaryna-1517';
  }
  function matches(event) {
    if(state.topic!=='all'&&event.category!==state.topic)return false;
    if(state.period==='early'&&event.year>=1900)return false;
    if(state.period==='twentieth'&&(event.year<1900||event.year>1999))return false;
    if(state.period==='recent'&&event.year<2000)return false;
    const haystack=norm([event.year,event.title.en,event.title.be,event.text.en,event.text.be,event.keywords,places[event.place].en,places[event.place].be,text.en[event.category],text.be[event.category]].join(' '));
    return tokens(state.query).every(word=>(aliases[word]||[word]).some(variant=>haystack.includes(norm(variant))));
  }
  function sourceLink(event,className) {
    const link=create('a',className,t('source')+' ↗');link.href=event.source.url;link.target='_blank';link.rel='noopener noreferrer';return link;
  }
  function buildList() {
    const list=$('#mapa-events');
    list.replaceChildren(...visible.map(event=>{
      const button=create('button','mapa-event-button');button.type='button';button.dataset.event=event.id;
      button.append(create('span','mapa-event-year',String(event.year)),create('span','mapa-event-name',event.title[state.lang]),create('span','mapa-event-place',places[event.place][state.lang]));
      button.setAttribute('aria-current',event.id===state.event?'true':'false');return button;
    }));
  }
  function buildMap() {
    const markerLayer=$('#mapa-markers');
    markerLayer.replaceChildren(...[...new Set(visible.map(event=>event.place))].map(key=>{
      const place=places[key],point=project(place),related=visible.filter(event=>event.place===key);
      const button=create('button','mapa-marker');button.type='button';button.dataset.place=key;button.style.left=point.x+'%';button.style.top=point.y+'%';
      button.setAttribute('aria-label',`${place[state.lang]}: ${related.length} ${t('results')}`);
      button.append(create('span','mapa-marker-dot',related.length>1?String(related.length):''),create('span','mapa-marker-name',place[state.lang]));
      if(key==='mir')button.classList.add('marker-label-left');
      if(key==='niasvizh')button.classList.add('marker-label-below');
      return button;
    }));
    const countryPositions=[['Belarus',29.0,55.15],['Lithuania',23.1,55.8],['Latvia',27.2,57.25],['Poland',18.5,52.6],['Ukraine',30.3,49.5],['Germany',12.7,53.5],['Czechia',15.7,49.1],['Russia',32.5,57]];
    $('#mapa-countries').replaceChildren(...countryPositions.map(([name,lon,lat])=>{const point=project({lon,lat}),label=create('span',name==='Belarus'?'mapa-country home':'mapa-country',t('country'+name));label.style.left=point.x+'%';label.style.top=point.y+'%';return label}));
  }
  function buildTable() {
    $('#mapa-table-body').replaceChildren(...visible.map(event=>{
      const row=create('tr');const date=create('td','',dateLabel(event)),title=create('td'),place=create('td','',places[event.place][state.lang]),source=create('td');
      const button=create('button','mapa-table-event',event.title[state.lang]);button.type='button';button.dataset.event=event.id;title.append(button);
      const link=sourceLink(event,'mapa-text-link');link.textContent=event.source.label+' ↗';source.append(link);
      row.append(date,title,place,source);return row;
    }));
  }
  function showSelection() {
    const event=visible.find(item=>item.id===state.event);
    document.querySelectorAll('[data-event]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.event===state.event)));
    document.querySelectorAll('[data-place]').forEach(button=>button.setAttribute('aria-pressed',String(!!event&&event.place===button.dataset.place)));
    $('#mapa-detail').hidden=!event;$('#mapa-no-selection').hidden=!!event;
    $('#mapa-share').disabled=!event;
    if(!event){$('#mapa-previous').disabled=true;$('#mapa-next').disabled=true;return}
    const index=visible.findIndex(item=>item.id===event.id);
    $('#mapa-previous').disabled=index===0;$('#mapa-next').disabled=index===visible.length-1;
    $('#mapa-date').textContent=dateLabel(event);
    $('#mapa-place').textContent=places[event.place][state.lang];
    $('#mapa-event-title').textContent=event.title[state.lang];
    $('#mapa-event-text').textContent=event.text[state.lang];
    $('#mapa-event-question').textContent=event.question[state.lang];
    $('#mapa-source-label').textContent=event.source.label;
    $('#mapa-source-link').href=event.source.url;
    $('#mapa-source-language').textContent=sourceLang(event.source.language);
    $('#mapa-source-kind').textContent=t(event.source.kind);
    $('#mapa-location-note').textContent=event.locationNote?.[state.lang]||t('coordinateNote');
    $('#mapa-selection-status').textContent=`${event.year}: ${event.title[state.lang]} · ${places[event.place][state.lang]}`;
    $('#mapa-copy-status').textContent='';$('#mapa-copy-fallback').hidden=true;
  }
  function select(id,push=true) {
    if(!visible.some(event=>event.id===id))return;
    state.event=id;showSelection();syncURL(push);
  }
  function render() {
    visible=events.filter(matches);
    if(!visible.some(event=>event.id===state.event))state.event=visible[0]?.id||'';
    $('#mapa-count').textContent=`${visible.length} ${t('of')} ${events.length} ${t('results')} · ${new Set(visible.map(event=>event.place)).size} ${t('locations')}`;
    $('#mapa-empty').hidden=visible.length>0;
    $('#mapa-workspace').hidden=!visible.length;
    $('#mapa-map-view').hidden=state.view!=='map';$('#mapa-table-view').hidden=state.view!=='table';
    document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===state.view)));
    $('#mapa-export').disabled=!visible.length;
    buildList();buildMap();buildTable();showSelection();
  }
  function applyLanguage() {
    document.documentElement.lang=state.lang;document.title=(state.lang==='be'?'MAPA · Гісторыя і месцы':'MAPA · History & places')+' — Sergéy Ulyanov';
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===state.lang)));
    $('#mapa-query').placeholder=t('placeholder');
    $('#mapa-query').value=state.query;$('#mapa-topic').value=state.topic;$('#mapa-period').value=state.period;
    document.querySelectorAll('a[href^="/research/"]').forEach(link=>{const url=new URL(link.href,location.href);url.searchParams.set('lang',state.lang);link.href=url.pathname+url.search+url.hash});
    $('#mapa-region-image').alt=state.lang==='be'?'Контуры Беларусі і суседніх краін':'Outlines of Belarus and neighboring countries';
    $('#mapa-region').setAttribute('aria-label',t('region'));
    try{localStorage.setItem('research-lang',state.lang);localStorage.setItem('living-belarus-atlas-lang',state.lang)}catch{}
    render();
  }
  function updateFilters(){state.query=$('#mapa-query').value;state.topic=$('#mapa-topic').value;state.period=$('#mapa-period').value;render();syncURL()}
  function reset(){state.query='';state.topic='all';state.period='all';$('#mapa-query').value='';$('#mapa-topic').value='all';$('#mapa-period').value='all';render();syncURL();$('#mapa-query').focus()}
  $('#mapa-query').addEventListener('input',updateFilters);
  $('#mapa-topic').addEventListener('change',updateFilters);$('#mapa-period').addEventListener('change',updateFilters);
  $('#mapa-search').addEventListener('submit',event=>{event.preventDefault();updateFilters()});
  document.querySelectorAll('[data-reset]').forEach(button=>button.addEventListener('click',reset));
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{state.lang=button.dataset.lang;applyLanguage();const url=new URL(location.href);url.searchParams.set('lang',state.lang);history.replaceState({},'',url)}));
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{state.view=button.dataset.view;render();syncURL(true)}));
  $('#mapa-events').addEventListener('click',event=>{const button=event.target.closest('[data-event]');if(button)select(button.dataset.event)});
  $('#mapa-events').addEventListener('keydown',event=>{
    const button=event.target.closest('[data-event]');if(!button||!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
    event.preventDefault();const index=visible.findIndex(item=>item.id===button.dataset.event);
    const next=event.key==='Home'?0:event.key==='End'?visible.length-1:Math.max(0,Math.min(visible.length-1,index+(event.key==='ArrowDown'?1:-1)));
    select(visible[next].id);$('#mapa-events').querySelector(`[data-event="${visible[next].id}"]`).focus();
  });
  $('#mapa-markers').addEventListener('click',event=>{
    const button=event.target.closest('[data-place]');if(!button)return;
    const group=visible.filter(item=>item.place===button.dataset.place),index=group.findIndex(item=>item.id===state.event);
    select(group[(index+1)%group.length].id);
  });
  $('#mapa-table-body').addEventListener('click',event=>{const button=event.target.closest('[data-event]');if(!button)return;state.view='map';state.event=button.dataset.event;render();syncURL(true);$('#mapa-event-title').focus()});
  $('#mapa-previous').addEventListener('click',()=>{const index=visible.findIndex(event=>event.id===state.event);if(index>0)select(visible[index-1].id)});
  $('#mapa-next').addEventListener('click',()=>{const index=visible.findIndex(event=>event.id===state.event);if(index<visible.length-1)select(visible[index+1].id)});
  $('#mapa-share').addEventListener('click',async()=>{
    const url=eventURL().href;
    // Keep a usable link visible even while the browser waits for clipboard permission.
    $('#mapa-copy-fallback').hidden=false;$('#mapa-copy-url').value=url;
    try{await navigator.clipboard.writeText(url);$('#mapa-copy-status').textContent=t('copied');$('#mapa-copy-fallback').hidden=true}
    catch{$('#mapa-copy-url').focus();$('#mapa-copy-url').select()}
  });
  $('#mapa-export').addEventListener('click',()=>{
    const exported={project:'MAPA — independent research edition',version:'2026-09-08',sourceReviewDate:'2026-09-08',scope:'Selected independent annotations; not the original MAPA database.',coordinates:'Approximate locations; contemporary geographic context.',query:state.query,topic:state.topic,period:state.period,records:visible.map(event=>({...event,location:places[event.place]}))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(exported,null,2)],{type:'application/json'}));
    const link=create('a');link.href=url;link.download='mapa-selection-2026-09-08.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('#mapa-region-image').addEventListener('error',()=>{$('#mapa-map-error').hidden=false});
  window.addEventListener('popstate',()=>{readURL();applyLanguage()});
  readURL();applyLanguage();
})();
