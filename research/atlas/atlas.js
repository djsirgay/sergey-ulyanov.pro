(() => {
  const copy = {
    en: {
      'nav-directory':'Directory','nav-heritage':'Lost heritage','nav-method':'Method','nav-unmute':'Unmute Belarus ↗',
      'hero-title':'What disappeared from the web — <em>and who is speaking now?</em>',
      'hero-deck':'A provenance-first map of endangered Belarusian digital heritage and contemporary Belarusian-language voices: archives, podcasts, video, music commentary, short-form creators, and learning resources.',
      'search-label':'Search the living archive','search-button':'Search','example-podcasts':'Podcasts about music','example-language':'Short video about language','example-lost':'Lost digital heritage',
      'metric-records':'verified seed records','metric-types':'media and archive types','metric-modules':'connected research modules','metric-boundary':'explicit rights boundary',
      'boundary-label':'Honest pilot','boundary-text':'This is a curated seed index and functional search interface — not yet a comprehensive archive or an autonomous AI researcher.','boundary-link':'See the method ↓',
      'directory-label':'BELARUSIAN VOICES DIRECTORY','directory-title':'One door into a scattered cultural web.','directory-deck':'Search across formats and topics without erasing the original source. Every result opens the creator, publisher, museum, or directory that made it available.',
      'filter-query':'Keywords','filter-type':'Format','filter-topic':'Topic','filter-language':'Language','filter-reset':'Reset','results-found':'records found','results-note':'Descriptions are concise research annotations. Ownership remains with the linked sources.',
      'empty-title':'No record matches all filters.','empty-text':'Try a broader topic or remove one filter. The index will grow through verified community suggestions.',
      'submit-title':'Know a Belarusian-language creator or endangered project?','submit-text':'Suggest the original source. Nothing is copied into the index without a visible link, status, and research note.','submit-button':'Suggest a source ↗',
      'modules-label':'SYSTEM ARCHITECTURE','modules-title':'Two modules. One evidence trail.','module-one-title':'Lost Digital Heritage','module-one-text':'Find dead, blocked, or at-risk Belarusian projects; document archived captures, authorship, functionality, sources, and permission status before any reconstruction is published.','module-one-a':'Archived captures','module-one-b':'Creator credits','module-one-c':'Rights and access status','module-one-link':'Open the first preservation dossier ↓',
      'module-two-title':'Belarusian Voices Directory','module-two-text':'A source-visible route to podcasts, video, short-form language creators, cultural commentary, museums, and learning resources across platforms.','module-two-a':'Multi-format search','module-two-b':'Belarusian and English interface','module-two-c':'Direct links to original publishers','module-two-link':'Search the seed directory ↑',
      'connection-context':'cultural context + sources','connection-output':'archival passports + research corpus',
      'mapa-label':'FIRST PRESERVATION DOSSIER','mapa-title':'The Interactive Map of Belarusian History deserves to remain findable.','mapa-deck':'The original MAPA interface is currently unavailable at its former address. Archived captures and the project authors’ own documentation make a careful digital reconstruction technically possible. This public page documents that work without republishing the original site before permission.',
      'status-attributed':'Attributed preservation record','status-pending':'Permissions pending','mapa-original':'Original','mapa-recovered':'Recovered evidence','mapa-recovered-value':'Belarusian archived interface and embedded timeline data; navigation also documents English, Russian, and Polish editions.','mapa-scope':'Documented scope','mapa-scope-value':'63 historical border states and approximately 170 dated events in the recovered Belarusian build.','mapa-public':'Public boundary','mapa-public-value':'No original mirror, interface, illustrations, or dataset is republished here until written permission is received.',
      'credits-title':'Original project credits','credit-idea':'idea and design','credit-texts':'texts and translations','credit-management':'management','credit-advice':'advice','source-process':'Original process article','source-results':'Original results article','source-archive':'Public archived capture','source-author':'Creator’s current portfolio',
      'method-label':'METHOD & PROVENANCE','method-title':'Preservation is not permission. Discovery is not ownership.','method-deck':'The atlas separates public facts, archived evidence, independent research annotations, and material that requires a creator’s consent. Attribution is mandatory but does not replace permission.',
      'workflow-one-title':'Find','workflow-one-text':'Locate the original source, live page, archive capture, or creator documentation.','workflow-two-title':'Verify','workflow-two-text':'Separate what the source proves from what remains an inference or research lead.','workflow-three-title':'Credit','workflow-three-text':'Name the original creators and link to their surviving pages before adding interpretation.','workflow-four-title':'Ask','workflow-four-text':'Request written permission before mirroring or adapting protected content.','workflow-five-title':'Connect','workflow-five-text':'Turn approved material into searchable context and provenance-aware research records.',
      'legend-title':'Status language used across the atlas','legend-original':'Original work','legend-original-text':'Linked directly to its creator or publisher.','legend-record':'Attributed record','legend-record-text':'Our annotation about a source; the source is not copied.','legend-reconstruction':'Independent reconstruction','legend-reconstruction-text':'New research work based on verifiable facts, clearly separated from the original.','legend-pending':'Permissions pending','legend-pending-text':'Identified for preservation, but protected material is not publicly mirrored.',
      'next-label':'NEXT RESEARCH PASS','next-title':'Ask the people who built the culture where the gaps are.','next-text':'The next review will invite cultural practitioners — including Siarhei Budkin, Volia Broman, and other domain experts who choose to participate — to identify missing archives, creators, genres, regions, and ethical risks. Their participation is not presumed.','next-research':'Return to the research agenda ↗','next-unmute':'Explore Unmute Belarus ↗','footer-text':'A public research pilot by Sergéy Ulyanov · updated August 31, 2026',
      'all-types':'All formats','all-topics':'All topics','all-languages':'All languages','open-source':'Open original source','original':'Original source','attributed':'Attributed record','archived':'Archived source','pending':'Permissions pending'
    },
    be: {
      'nav-directory':'Каталог','nav-heritage':'Страчаная спадчына','nav-method':'Метад','nav-unmute':'Unmute Belarus ↗',
      'hero-title':'Што знікла з сеціва — <em>і хто гаворыць цяпер?</em>',
      'hero-deck':'Мапа з празрыстым паходжаннем даных: беларуская лічбавая спадчына пад пагрозай і сучасныя беларускамоўныя галасы — архівы, падкасты, відэа, музыка, кароткія фарматы і рэсурсы для вывучэння мовы.',
      'search-label':'Шукаць у жывым архіве','search-button':'Знайсці','example-podcasts':'Падкасты пра музыку','example-language':'Кароткія відэа пра мову','example-lost':'Страчаная лічбавая спадчына',
      'metric-records':'правераных стартавых запісаў','metric-types':'тыпаў медыя і архіваў','metric-modules':'звязаныя даследчыя модулі','metric-boundary':'выразная мяжа аўтарскіх правоў',
      'boundary-label':'Сумленны пілот','boundary-text':'Гэта адабраны пачатковы індэкс і працоўны пошук — пакуль не поўны архіў і не аўтаномны AI-даследчык.','boundary-link':'Паглядзець метад ↓',
      'directory-label':'КАТАЛОГ БЕЛАРУСКАМОЎНЫХ ГАЛАСОЎ','directory-title':'Адзін уваход у раскіданае культурнае сеціва.','directory-deck':'Шукайце па фарматах і тэмах, не сціраючы першакрыніцу. Кожны вынік вядзе да аўтара, выдаўца, музея або каталога, які апублікаваў матэрыял.',
      'filter-query':'Ключавыя словы','filter-type':'Фармат','filter-topic':'Тэма','filter-language':'Мова','filter-reset':'Скінуць','results-found':'запісаў знойдзена','results-note':'Апісанні — кароткія даследчыя анатацыі. Правы застаюцца ў пазначаных крыніц.',
      'empty-title':'Няма запісаў, якія адпавядаюць усім фільтрам.','empty-text':'Паспрабуйце шырэйшую тэму або прыбярыце адзін фільтр. Індэкс будзе расці праз правераныя прапановы супольнасці.',
      'submit-title':'Ведаеце беларускамоўнага аўтара або праект пад пагрозай?','submit-text':'Дашліце першакрыніцу. Нічога не дадаецца без бачнай спасылкі, статусу і даследчай нататкі.','submit-button':'Прапанаваць крыніцу ↗',
      'modules-label':'АРХІТЭКТУРА СІСТЭМЫ','modules-title':'Два модулі. Адзін ланцужок доказаў.','module-one-title':'Страчаная лічбавая спадчына','module-one-text':'Знаходзіць закрытыя, заблакаваныя або ўразлівыя беларускія праекты; дакументуе архіўныя копіі, аўтарства, функцыі, крыніцы і дазволы да публікацыі рэканструкцыі.','module-one-a':'Архіўныя копіі','module-one-b':'Крэдыты аўтараў','module-one-c':'Статус правоў і доступу','module-one-link':'Адкрыць першае дасье ↓',
      'module-two-title':'Каталог беларускіх галасоў','module-two-text':'Бачны маршрут да падкастаў, відэа, кароткіх моўных фарматаў, культурнай крытыкі, музеяў і адукацыйных рэсурсаў на розных платформах.','module-two-a':'Пошук па розных фарматах','module-two-b':'Беларуская і англійская версіі','module-two-c':'Прамыя спасылкі на першакрыніцы','module-two-link':'Шукаць у каталогу ↑',
      'connection-context':'культурны кантэкст + крыніцы','connection-output':'архіўныя пашпарты + даследчы корпус',
      'mapa-label':'ПЕРШАЕ ДАСЬЕ ЗАХАВАННЯ','mapa-title':'Інтэрактыўная мапа беларускай гісторыі вартая застацца даступнай.','mapa-deck':'Арыгінальны інтэрфейс MAPA цяпер недаступны па ранейшым адрасе. Архіўныя копіі і дакументацыя аўтараў робяць акуратную лічбавую рэканструкцыю тэхнічна магчымай. Гэтая старонка дакументуе працу, але не перавыдае арыгінальны сайт да атрымання дазволу.',
      'status-attributed':'Атрыбутаваны запіс захавання','status-pending':'Чакаем дазволу','mapa-original':'Арыгінал','mapa-recovered':'Адноўленыя сведчанні','mapa-recovered-value':'Архіўны беларускі інтэрфейс і ўбудаваныя даныя таймлайна; навігацыя таксама пацвярджае англійскую, рускую і польскую версіі.','mapa-scope':'Зафіксаваны аб’ём','mapa-scope-value':'63 гістарычныя памежныя дзяржавы і каля 170 датаваных падзей у адноўленай беларускай зборцы.','mapa-public':'Публічная мяжа','mapa-public-value':'Арыгінальны інтэрфейс, ілюстрацыі і набор даных не публікуюцца тут да атрымання пісьмовага дазволу.',
      'credits-title':'Крэдыты арыгінальнага праекта','credit-idea':'ідэя і дызайн','credit-texts':'тэксты і пераклады','credit-management':'менеджмент','credit-advice':'кансультацыі','source-process':'Артыкул пра працэс','source-results':'Артыкул пра вынікі','source-archive':'Публічная архіўная копія','source-author':'Актуальны партфоліа аўтара',
      'method-label':'МЕТАД І ПАХОДЖАННЕ','method-title':'Захаванне — не дазвол. Знаходка — не ўласнасць.','method-deck':'Атлас аддзяляе публічныя факты, архіўныя сведчанні, незалежныя даследчыя анатацыі і матэрыялы, для якіх патрэбная згода аўтара. Атрыбуцыя абавязковая, але яна не замяняе дазвол.',
      'workflow-one-title':'Знайсці','workflow-one-text':'Знайсці арыгінальную крыніцу, жывую старонку, архіўную копію або дакументацыю аўтара.','workflow-two-title':'Праверыць','workflow-two-text':'Аддзяліць тое, што крыніца даказвае, ад гіпотэзы або даследчага следу.','workflow-three-title':'Пазначыць','workflow-three-text':'Назваць арыгінальных аўтараў і даць спасылку перад даданнем інтэрпрэтацыі.','workflow-four-title':'Спытаць','workflow-four-text':'Атрымаць пісьмовы дазвол перад люстраваннем або адаптацыяй абароненага кантэнту.','workflow-five-title':'Звязаць','workflow-five-text':'Ператварыць ухвалены матэрыял у пошукавы кантэкст і запісы з бачным паходжаннем.',
      'legend-title':'Статусы, якія выкарыстоўвае атлас','legend-original':'Арыгінальная праца','legend-original-text':'Прамая спасылка на аўтара або выдаўца.','legend-record':'Атрыбутаваны запіс','legend-record-text':'Наша анатацыя пра крыніцу; сама крыніца не капіюецца.','legend-reconstruction':'Незалежная рэканструкцыя','legend-reconstruction-text':'Новая праца на правераных фактах, выразна аддзеленая ад арыгінала.','legend-pending':'Чакаем дазволу','legend-pending-text':'Матэрыял знойдзены для захавання, але абаронены кантэнт не публікуецца.',
      'next-label':'НАСТУПНЫ ЭТАП','next-title':'Спытаць у людзей, якія стваралі культуру, чаго не хапае.','next-text':'Наступны агляд прапануе культурным практыкам — у тым ліку Сяргею Будкіну, Волі Броман і іншым экспертам, якія самі пагодзяцца ўдзельнічаць, — пазначыць прапушчаныя архівы, галасы, жанры, рэгіёны і этычныя рызыкі. Іх удзел не прэзюмуецца.','next-research':'Вярнуцца да даследавання ↗','next-unmute':'Адкрыць Unmute Belarus ↗','footer-text':'Публічны даследчы пілот Сержэя Ульянава · абноўлена 31 жніўня 2026',
      'all-types':'Усе фарматы','all-topics':'Усе тэмы','all-languages':'Усе мовы','open-source':'Адкрыць першакрыніцу','original':'Арыгінальная крыніца','attributed':'Атрыбутаваны запіс','archived':'Архіўная крыніца','pending':'Чакаем дазволу'
    }
  };

  const typeLabels = {
    map:{en:'Interactive map',be:'Інтэрактыўная мапа'},
    archive:{en:'Digital archive',be:'Лічбавы архіў'},
    museum:{en:'Digital museum',be:'Лічбавы музей'},
    research:{en:'Research resource',be:'Даследчы рэсурс'},
    podcast:{en:'Podcast directory',be:'Каталог падкастаў'},
    audio:{en:'Audio platform',be:'Аўдыяплатформа'},
    radio:{en:'Radio & podcast',be:'Радыё і падкасты'},
    guide:{en:'Curated guide',be:'Адабраны гайд'},
    music:{en:'Music archive',be:'Музычны архіў'}
  };
  const topicLabels = {
    history:{en:'History',be:'Гісторыя'},culture:{en:'Culture',be:'Культура'},music:{en:'Music',be:'Музыка'},language:{en:'Language',be:'Мова'},education:{en:'Education',be:'Адукацыя'},identity:{en:'Identity',be:'Ідэнтычнасць'},video:{en:'Video',be:'Відэа'},podcasts:{en:'Podcasts',be:'Падкасты'},heritage:{en:'Heritage',be:'Спадчына'},short:{en:'Short video',be:'Кароткія відэа'},jewish:{en:'Jewish heritage',be:'Габрэйская спадчына'}
  };
  const languageLabels = {be:{en:'Belarusian',be:'Беларуская'},en:{en:'English',be:'Англійская'},ru:{en:'Russian',be:'Руская'},pl:{en:'Polish',be:'Польская'}};

  const records = [
    {id:'mapa',name:'The Interactive Map of Belarusian History',nameBe:'Інтэрактыўная мапа беларускай гісторыі',type:'map',topics:['history','heritage'],languages:['be','en','ru','pl'],status:'pending',url:'https://arquivo.pt/wayback/20190923020214/http://map.letapis.by/by/',description:'A landmark interactive historical map formerly published at map.letapis.by. Its archived Belarusian build is documented here; the original interface is not mirrored while permission is pending.',descriptionBe:'Знакавая інтэрактыўная мапа, раней даступная на map.letapis.by. Архіўная беларуская зборка задакументаваная; арыгінальны інтэрфейс не публікуецца без дазволу.',keywords:'lost digital heritage reconstruction borders timeline мапа гісторыя страчаная лічбавая спадчына'},
    {id:'tuzin',name:'TuzinFM archive',nameBe:'Архіў TuzinFM',type:'music',topics:['music','culture','heritage'],languages:['be','ru'],status:'archived',url:'https://old.tuzinfm.by/',description:'A major surviving archive of contemporary Belarusian-language music, reviews, charts, interviews, and cultural reporting. The original project is no longer regularly updated.',descriptionBe:'Адзін з найбуйнейшых захаваных архіваў сучаснай беларускамоўнай музыкі: рэцэнзіі, чарты, інтэрв’ю і культурная журналістыка. Праект больш рэгулярна не абнаўляецца.',keywords:'dance remix belarusian music contemporary archive reviews танцавальная музыка рэміксы беларуская музыка'},
    {id:'kultmapka',name:'Kultmapka',nameBe:'Культмапка',type:'map',topics:['culture','heritage','identity'],languages:['be','en'],status:'original',url:'https://kultmapka.me/',description:'An interactive map of Belarusian cultural places, institutions, initiatives, and artifacts around the world.',descriptionBe:'Інтэрактыўная мапа беларускіх культурных месцаў, устаноў, ініцыятыў і артэфактаў па ўсім свеце.',keywords:'diaspora exile cultural map places worldwide дыяспара культурная мапа'},
    {id:'fbm',name:'Free Belarus Museum',nameBe:'Музей Вольнай Беларусі',type:'museum',topics:['history','culture','heritage','identity'],languages:['be','en','pl'],status:'original',url:'https://freebelarus.museum/en/',description:'A Warsaw-based museum preserving and digitizing material evidence of contemporary Belarusian history and civic resistance.',descriptionBe:'Музей у Варшаве, які захоўвае і лічбавізуе матэрыяльныя сведчанні сучаснай беларускай гісторыі і грамадзянскага супраціву.',keywords:'museum digitization protest history objects варшава музей лічбавізацыя пратэсты'},
    {id:'philology',name:'Philology.BY projects',nameBe:'Праекты Philology.BY',type:'research',topics:['language','education','heritage'],languages:['be','ru'],status:'original',url:'https://philology.by/projects',description:'Digital humanities and language projects including Belarusian dialectology and digitized manuscript resources.',descriptionBe:'Лічбавыя гуманітарныя і моўныя праекты, у тым ліку беларуская дыялекталогія і алічбаваныя рукапісы.',keywords:'language dialectology manuscripts academic research мова дыялекталогія рукапісы даследаванне'},
    {id:'podhub',name:'Belarus Podcast Hub',nameBe:'Belarus Podcast Hub',type:'podcast',topics:['podcasts','culture','music','identity'],languages:['be'],status:'original',url:'https://belaruspodcasthub.com/',description:'A searchable catalog and editorial hub for Belarusian podcasts across culture, music, society, history, and more.',descriptionBe:'Пошукавы каталог і рэдакцыйны хаб беларускіх падкастаў пра культуру, музыку, грамадства, гісторыю і іншае.',keywords:'podcasts about music audio shows падкасты пра музыку аўдыя'},
    {id:'belarusfm',name:'Belarus FM',nameBe:'Belarus FM',type:'audio',topics:['podcasts','culture','language','education'],languages:['be'],status:'original',url:'https://belarus.fm/',description:'A Belarusian-language listening platform for podcasts and audiobooks.',descriptionBe:'Беларускамоўная платформа для праслухоўвання падкастаў і аўдыякніг.',keywords:'podcast audiobook listening language падкасты аўдыякнігі мова'},
    {id:'radio375',name:'375 Radio',nameBe:'375 Radio',type:'radio',topics:['music','podcasts','culture'],languages:['be','en'],status:'original',url:'https://375radio.com/en',description:'An independent Belarusian music and culture radio platform with programs, mixes, and conversations.',descriptionBe:'Незалежная беларуская радыёплатформа пра музыку і культуру з праграмамі, міксамі і размовамі.',keywords:'radio music podcast mix interviews радыё музыка падкасты міксы'},
    {id:'budzma-language',name:'Budzma language-learning guide',nameBe:'Моўны гайд «Будзьма»',type:'guide',topics:['language','education','short','video'],languages:['be'],status:'attributed',url:'https://budzma.org/news/dze-vuchyts-movu.html',description:'A source guide to Belarusian-language learning resources across websites, YouTube, Instagram, and TikTok.',descriptionBe:'Гайд па рэсурсах для вывучэння беларускай мовы на сайтах, YouTube, Instagram і TikTok.',keywords:'tiktok short video language instagram youtube learning цікток кароткія відэа мова вучыць'},
    {id:'nn-video',name:'Nasha Niva Belarusian YouTube guide',nameBe:'Гайд «Нашай Нівы» па беларускамоўным YouTube',type:'guide',topics:['video','culture','language','education'],languages:['be'],status:'attributed',url:'https://nashaniva.com/299239',description:'A curated entry point to Belarusian-language YouTube creators and channels.',descriptionBe:'Адабраны ўваход да беларускамоўных аўтараў і каналаў на YouTube.',keywords:'youtube bloggers creators video блогеры аўтары відэа'},
    {id:'sojka-podcast',name:'Sojka podcast guide',nameBe:'Падкаст-гайд Sojka',type:'guide',topics:['podcasts','culture','music'],languages:['be'],status:'attributed',url:'https://sojka.io/by/guides/podcast',description:'An editorial guide to Belarusian podcasts and listening culture.',descriptionBe:'Рэдакцыйны гайд па беларускіх падкастах і культуры слухання.',keywords:'podcasts music culture guide падкасты музыка культура гайд'},
    {id:'jewish-museum',name:'Belarusian Jewish Cultural Heritage Center',nameBe:'Цэнтр беларуска-яўрэйскай культурнай спадчыны',type:'museum',topics:['history','heritage','jewish','culture'],languages:['en','ru'],status:'original',url:'https://belarusianjewish.com/',description:'A digital museum and research resource focused on Belarusian Jewish cultural heritage.',descriptionBe:'Лічбавы музей і даследчы рэсурс пра беларуска-яўрэйскую культурную спадчыну.',keywords:'jewish belarus heritage museum archive габрэйская спадчына музей архіў'}
  ];

  const state = {lang:'en',query:'',type:'all',topic:'all',language:'all'};
  const els = {
    results:document.querySelector('#atlas-results'),empty:document.querySelector('#atlas-empty'),count:document.querySelector('#result-count'),
    query:document.querySelector('#filter-query'),heroQuery:document.querySelector('#atlas-query'),type:document.querySelector('#filter-type'),topic:document.querySelector('#filter-topic'),language:document.querySelector('#filter-language')
  };

  const normalize = value => String(value || '').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zа-яёіўґ0-9]+/gi,' ').trim();
  const aliases = {
    podcasts:'podcast podcasts падкаст падкасты аудио audio',podcast:'podcast podcasts падкаст падкасты audio аудио',падкасты:'podcast podcasts падкаст падкасты audio аўдыя',
    music:'music музыка музыке музыку музыкі remix mix radio',музыка:'music музыка музыке музыку музыкі remix mix radio',музыку:'music музыка музыке музыку музыкі remix mix radio',
    language:'language мова мовы мове язык языке learning',мова:'language мова мовы мове язык языке learning',мову:'language мова мовы мове язык языке learning',
    tiktok:'tiktok цікток short video instagram',ціктокі:'tiktok цікток short video instagram',short:'short tiktok цікток кароткія',
    lost:'lost endangered closed unavailable страчаная знікла heritage archive',heritage:'heritage спадчына archive архіў history',digital:'digital лічбавая website web site archive'
  };
  function searchTokens(query){
    return normalize(query).split(' ').filter(Boolean).map(token => aliases[token] || token);
  }
  function searchable(record){
    return normalize([record.name,record.nameBe,record.description,record.descriptionBe,record.keywords,typeLabels[record.type].en,typeLabels[record.type].be,...record.topics.map(t=>`${topicLabels[t].en} ${topicLabels[t].be}`),...record.languages.map(l=>`${languageLabels[l].en} ${languageLabels[l].be}`)].join(' '));
  }
  function matchQuery(record,query){
    const haystack = searchable(record);
    return searchTokens(query).every(group => group.split(' ').some(token => haystack.includes(normalize(token))));
  }
  function option(value,label){const node=document.createElement('option');node.value=value;node.textContent=label;return node}
  function populateFilters(){
    const current={type:state.type,topic:state.topic,language:state.language};
    els.type.replaceChildren(option('all',copy[state.lang]['all-types']),...Object.keys(typeLabels).map(key=>option(key,typeLabels[key][state.lang])));
    els.topic.replaceChildren(option('all',copy[state.lang]['all-topics']),...Object.keys(topicLabels).map(key=>option(key,topicLabels[key][state.lang])));
    els.language.replaceChildren(option('all',copy[state.lang]['all-languages']),...Object.keys(languageLabels).map(key=>option(key,languageLabels[key][state.lang])));
    els.type.value=current.type;els.topic.value=current.topic;els.language.value=current.language;
  }
  function render(){
    const filtered=records.filter(record => matchQuery(record,state.query) && (state.type==='all'||record.type===state.type) && (state.topic==='all'||record.topics.includes(state.topic)) && (state.language==='all'||record.languages.includes(state.language)));
    els.count.textContent=filtered.length;
    els.results.replaceChildren(...filtered.map(record => {
      const article=document.createElement('article');article.className='atlas-card';
      const status=record.status==='original'?'original':record.status==='archived'?'archived':record.status==='pending'?'pending':'attributed';
      article.innerHTML=`<div class="atlas-card-top"><span class="atlas-card-type">${typeLabels[record.type][state.lang]}</span><span class="atlas-card-status">${copy[state.lang][status]}</span></div><h3>${state.lang==='be'?record.nameBe:record.name}</h3><p>${state.lang==='be'?record.descriptionBe:record.description}</p><div class="atlas-card-tags">${record.topics.map(t=>`<span>${topicLabels[t][state.lang]}</span>`).join('')}${record.languages.map(l=>`<span>${languageLabels[l][state.lang]}</span>`).join('')}</div><a href="${record.url}" target="_blank" rel="noopener noreferrer"><span>${copy[state.lang]['open-source']}</span><span>↗</span></a>`;
      return article;
    }));
    els.empty.hidden=filtered.length!==0;
  }
  function setLanguage(lang){
    state.lang=lang;document.documentElement.lang=lang;
    document.querySelectorAll('[data-copy]').forEach(node=>{const value=copy[lang][node.dataset.copy];if(value!==undefined)node.innerHTML=value});
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
    document.querySelectorAll('[data-placeholder-en]').forEach(node=>node.placeholder=node.dataset[`placeholder${lang==='be'?'Be':'En'}`]);
    populateFilters();render();
    const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState({},'',url);
    try{localStorage.setItem('living-belarus-atlas-lang',lang)}catch(e){}
  }
  function sync(){state.query=els.query.value;state.type=els.type.value;state.topic=els.topic.value;state.language=els.language.value;render()}
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
  [els.query,els.type,els.topic,els.language].forEach(node=>node.addEventListener(node.tagName==='SELECT'?'change':'input',sync));
  document.querySelector('#filter-reset').addEventListener('click',()=>{els.query.value='';els.type.value='all';els.topic.value='all';els.language.value='all';state.query='';state.type='all';state.topic='all';state.language='all';render()});
  document.querySelector('#atlas-search-form').addEventListener('submit',event=>{event.preventDefault();els.query.value=els.heroQuery.value;state.query=els.query.value;render();document.querySelector('#directory').scrollIntoView({behavior:'smooth'})});
  document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{els.heroQuery.value=button.dataset.query;els.query.value=button.dataset.query;state.query=button.dataset.query;render();document.querySelector('#directory').scrollIntoView({behavior:'smooth'})}));
  document.querySelector('#metric-records').textContent=records.length;
  document.querySelector('#metric-types').textContent=new Set(records.map(record=>record.type)).size;
  const params=new URLSearchParams(location.search);let initial=params.get('lang');if(!['en','be'].includes(initial)){try{initial=localStorage.getItem('living-belarus-atlas-lang')}catch(e){}}setLanguage(['en','be'].includes(initial)?initial:'en');
})();
