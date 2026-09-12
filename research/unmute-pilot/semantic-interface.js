import {escapeHTML as e,safeUrl} from './core.js';
import {isSourceGenreRequest,sourceGenreCopy} from './search-planner.js';
import {playerFor} from './library.js';
import {intentLabel,semanticMessageKind,interpretationCopy} from './semantic-presentation.js';
import {isBrowserRuntime,browserAIWords,requestBrowserConsent,queryBrowserAI,stopBrowserAI} from './browser-ai-ui.js';

const copy={
 en:{button:'Find by meaning · AI',heading:'Possible matches by meaning',intro:'Experimental · compares your description with catalogue text, not audio. Runs on this computer only when you click. No cloud, account or server-side query log. Like ordinary search, the query stays in the tab URL and may appear in browser history.',busy:'Comparing catalogue descriptions… The first start may take a little longer.',empty:'No sufficiently close description found. Try different words or the exact filters; this is a gap, not proof that the music does not exist.',blocked:'Use the regular search for quoted titles and AND / OR / NOT. Remembered lyrics are not indexed yet. No AI result has been substituted.',error:'Local AI is unavailable right now. The regular search and your collections still work. You can retry.',why:'The model matched this catalogue text',review:'Suggestion, not a verified match. Listen and check the source before including it.',scope:'Belarusian-language listening catalogue only. Dropdown filters and recognised dates stay in effect. Genre or mood words in your description are suggestions; use filters for exact requirements.',model:'Local model: multilingual E5-small · no new facts or lyrics generated.',cancel:'Cancel',need:'Write a description in the search field first.',clear:'Close suggestions',results:'Suggestions (separate from exact results)',reason:'This wording or the selected filters cannot produce a safe candidate. Try a simpler description.'},
 ru:{button:'Найти по смыслу · ИИ',heading:'Возможные совпадения по смыслу',intro:'Эксперимент · сравнивает твой запрос с описаниями в каталоге, не с аудио. Запускается на этом компьютере только по кнопке. Без облака, аккаунта и серверного журнала запросов. Как и при обычном поиске, запрос остаётся в адресе вкладки и может попасть в историю браузера.',busy:'Сравниваем описания в каталоге… Первый запуск может занять немного больше времени.',empty:'Достаточно близкого описания не найдено. Попробуй другие слова или точные фильтры. Это пробел в поиске, а не доказательство, что такой музыки нет.',blocked:'Для названий в кавычках и И / ИЛИ / НЕ используй обычный поиск. Поиск по запомнившейся строке песни пока не подключён. Мы не подменяем его ответом ИИ.',error:'Локальный ИИ сейчас недоступен. Обычный поиск и подборки работают. Можно повторить попытку.',why:'Модель сопоставила запрос с этим текстом каталога',review:'Предположение, не подтверждённое совпадение. Послушай и проверь источник перед добавлением.',scope:'Только белорусскоязычные записи со ссылкой на прослушивание. Выпадающие фильтры и распознанные даты сохраняются. Слова о жанре или настроении в запросе — пожелания; для точных требований используй фильтры.',model:'Локальная модель: multilingual E5-small · новые факты и тексты песен не генерируются.',cancel:'Отменить',need:'Сначала напиши описание в строке поиска.',clear:'Закрыть подсказки',results:'Подсказки (отдельно от точных результатов)',reason:'Этот запрос или выбранные фильтры не позволяют предложить надёжного кандидата. Попробуй более простое описание.'},
 be:{button:'Знайсці паводле сэнсу · ІІ',heading:'Магчымыя супадзенні паводле сэнсу',intro:'Эксперымент · параўноўвае твой запыт з апісаннямі ў каталогу, не з аўдыя. Запускаецца на гэтым камп’ютары толькі па кнопцы. Без воблака, акаўнта і сервернага журнала запытаў. Як і пры звычайным пошуку, запыт застаецца ў адрасе ўкладкі і можа трапіць у гісторыю браўзера.',busy:'Параўноўваем апісанні ў каталогу… Першы запуск можа заняць крыху больш часу.',empty:'Дастаткова блізкага апісання не знойдзена. Паспрабуй іншыя словы або дакладныя фільтры. Гэта прабел у пошуку, а не доказ, што такой музыкі няма.',blocked:'Для назваў у двукоссі і І / АБО / НЕ выкарыстоўвай звычайны пошук. Пошук па запомненым радку песні пакуль не падключаны. Мы не падмяняем яго адказам ІІ.',error:'Лакальны ІІ зараз недаступны. Звычайны пошук і падборкі працуюць. Можна паспрабаваць яшчэ раз.',why:'Мадэль супаставіла запыт з гэтым тэкстам каталога',review:'Меркаванне, не пацверджанае супадзенне. Паслухай і правер крыніцу перад даданнем.',scope:'Толькі беларускамоўныя запісы са спасылкай на праслухоўванне. Выпадныя фільтры і распазнаныя даты захоўваюцца. Словы пра жанр ці настрой у запыце — пажаданні; для дакладных патрабаванняў выкарыстоўвай фільтры.',model:'Лакальная мадэль: multilingual E5-small · новыя факты і тэксты песень не генеруюцца.',cancel:'Адмяніць',need:'Спачатку напішы апісанне ў радку пошуку.',clear:'Закрыць падказкі',results:'Падказкі (асобна ад дакладных вынікаў)',reason:'Гэты запыт або выбраныя фільтры не дазваляюць прапанаваць надзейнага кандыдата. Паспрабуй больш простае апісанне.'}
};
const exactCountLabels={en:'Exact matches',ru:'Точные совпадения',be:'Дакладныя супадзенні'};
const originalCounters=new WeakMap();
let context,key='',request=null,result=null,error=false,progress='',structured=false;
export function semanticKey(view){return JSON.stringify([view.q,view.language,view.genre,view.topic,view.type,view.decade,view.scope,view.path]);}
export function candidateRecords(payload,catalog){
 if(payload?.candidateOnly!==true||payload.blocked||!Array.isArray(payload.candidates)||!Array.isArray(catalog))return [];
 const seen=new Set();return payload.candidates.slice(0,12).flatMap(candidate=>{
  if(!candidate||typeof candidate!=='object'||typeof candidate.id!=='string'||typeof candidate.matchedMetadata!=='string')return [];
  const record=catalog.find(r=>r?.id===candidate.id&&r.language==='be'&&safeUrl(r.listenUrl)&&safeUrl(r.sourceUrl)&&!r.personal);
  if(!record||seen.has(record.id)||candidate.status!=='semantic-candidate')return [];
  seen.add(record.id);return [{record,excerpt:String(candidate.matchedMetadata||'').slice(0,1400),language:['en','be','ru'].includes(candidate.metadataLanguage)?candidate.metadataLanguage:'en'}];
 });
}
function discard(){request?.abort();request=null;result=null;error=false;progress='';structured=false;if(context)context.semanticMatches=[];}
function panel(){
 const c=context,t=copy[c.lang]||copy.en,explain=interpretationCopy[c.lang]||interpretationCopy.en,el=document.querySelector('#semantic-results');if(!el)return;
 const run=document.querySelector('[data-semantic="run"]');if(run)run.disabled=!!request;
 const candidates=candidateRecords(result,c.catalog),blocked=result?.blocked;
 // Keep candidate playback order separate from deterministic search results.
 // This never changes the exact result counter or "save exact results" action.
 c.semanticMatches=request||error?[]:candidates.map(candidate=>candidate.record);
 const exactCounter=document.querySelector('.results-meta > strong');
 if(exactCounter){
  if(!originalCounters.has(exactCounter))originalCounters.set(exactCounter,exactCounter.textContent);
  const original=originalCounters.get(exactCounter),count=original.match(/^(\d+)(?:\s|$)/)?.[1];
  // Suggestions have their own count. Clarify the deterministic count without
  // adding candidates to it, and restore its normal label when suggestions close.
  exactCounter.textContent=!request&&!error&&candidates.length&&count!==undefined?`${exactCountLabels[c.lang]||exactCountLabels.en}: ${count}`:original;
 }
 if(!request&&!result&&!error&&!structured){el.hidden=true;return;}
 el.hidden=false;el.setAttribute('aria-busy',String(!!request));
 const kind=semanticMessageKind(blocked),message=structured?(sourceGenreCopy[c.lang]||sourceGenreCopy.en).message:request?(progress||t.busy):error?t.error:candidates.length?`${t.results}: ${candidates.length}`:kind==='blocked'?t.blocked:explain[kind];
 const grounded=result?.rankingStrategy==='source-grounded-editorial-intent-v1';
 const interpretation=grounded&&candidates.length?intentLabel(result?.queryDiagnostics?.intentRouting?.editorialIntent,c.lang):'';
 el.innerHTML=`<div class="semantic-heading"><div><p class="eyebrow">${e(structured?'Unmute · source labels':t.model)}</p><h2 tabindex="-1">${e(structured?(sourceGenreCopy[c.lang]||sourceGenreCopy.en).heading:t.heading)}</h2></div><button type="button" class="button subtle" data-semantic="clear">${e(request?t.cancel:t.clear)}</button></div><p role="status">${e(message)}</p>${candidates.length?`${interpretation?`<div class="semantic-interpretation"><p><strong>${e(explain.label)}:</strong> ${e(interpretation)}</p><p class="scope-note">${e(explain.note)}</p></div>`:''}<p class="scope-note">${e(t.review)}</p><div class="music-grid">${candidates.map(({record,excerpt,language})=>`<div class="semantic-candidate">${c.card(record)}<details class="match-evidence"><summary>${e(grounded?explain.source:t.why)}</summary><p lang="${language}">${e(excerpt)}</p></details>${playerFor(record)?`<button type="button" class="button secondary" data-experience="player" data-queue="semantic" data-id="${e(record.id)}">▷ ${e(c.t.playHere)}</button>`:''}</div>`).join('')}</div>`:''}`;
}
export function enhanceSemantic(c){
 context=c;const next=semanticKey(c.view);if(c.view.route!=='discover'||next!==key){discard();key=next;}
 if(c.view.route!=='discover'||c.view.scope!=='listen'||c.view.path!==null||!['be','all'].includes(c.view.language))return;
 const t=copy[c.lang]||copy.en;
 document.querySelector('.search-form').insertAdjacentHTML('afterend',`<div class="semantic-launch"><button type="button" class="button secondary" data-semantic="run" aria-describedby="semantic-help">${e(t.button)} ↗</button><details id="semantic-help"><summary>${e(c.lang==='ru'?'Как работает локальный ИИ':c.lang==='be'?'Як працуе лакальны ІІ':'How local AI works')}</summary><p>${e(isBrowserRuntime()?browserAIWords(c.lang).intro:t.intro)}</p><p>${e(t.scope)}</p></details></div>`);
 document.querySelector('.results-meta').insertAdjacentHTML('beforebegin','<section id="semantic-results" class="semantic-results" aria-label="'+e(t.heading)+'" hidden></section>');
 if(isBrowserRuntime())document.querySelector('.semantic-launch')?.insertAdjacentHTML('beforeend',`<button type="button" class="text-button" data-semantic="stop">${e(browserAIWords(c.lang).stop)}</button>`);
 panel();
}
if(typeof document!=='undefined'){
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-semantic]');if(!button||!context)return;
  if(button.dataset.semantic==='stop'){discard();stopBrowserAI();panel();return;}
  if(button.dataset.semantic==='clear'){discard();panel();document.querySelector('[data-semantic="run"]')?.focus();return;}
  if(button.dataset.semantic!=='run'||request)return;
  const c=context,q=String(document.querySelector('#query')?.value||'').trim();
  if(!q){c.toast((copy[c.lang]||copy.en).need);document.querySelector('#query')?.focus();return;}
  if(q!==c.view.q)c.go('discover',{q,path:''},false);
  if(isSourceGenreRequest(q)){discard();structured=true;panel();document.querySelector('#semantic-results')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(isBrowserRuntime()&&!await requestBrowserConsent(c.lang)){const selector=document.querySelector('#search-mode');if(selector){selector.value='exact';selector.dispatchEvent(new Event('change',{bubbles:true}));}c.toast(browserAIWords(c.lang).cancelled);return;}
  if(context.view.route!=='discover'||String(document.querySelector('#query')?.value||'').trim()!==q)return;
  discard();const controller=new AbortController();request=controller;const activeKey=key;panel();
  document.querySelector('#semantic-results')?.scrollIntoView({behavior:'smooth',block:'start'});document.querySelector('#semantic-results h2')?.focus({preventScroll:true});
  const timeout=setTimeout(()=>controller.abort(),isBrowserRuntime()?300000:145000);
  try{
   const v=context.view,input={query:q,filters:{language:v.language,genre:v.genre,topic:v.topic,type:v.type,decade:v.decade}};let payload;
   if(isBrowserRuntime())payload=await queryBrowserAI(input,{signal:controller.signal,onProgress:event=>{if(request!==controller)return;const t=browserAIWords(context.lang);const phase=event?.phase||event?.status;progress=phase==='comparing'||phase==='inference'?t.infer:phase==='ready'||phase==='initializing'?t.prepare:t.download;const loaded=Number(event?.overallLoaded??event?.loaded),total=Number(event?.totalDownloadBytes??event?.total);if(Number.isFinite(loaded)&&total>0)progress+=' · '+Math.min(100,Math.round(loaded/total*100))+'%';const status=document.querySelector('#semantic-results [role="status"]');if(status&&status.textContent!==progress)status.textContent=progress;}});
   else{const response=await fetch('/api/semantic',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:controller.signal,credentials:'omit',cache:'no-store'});if(!response.ok)throw Error('unavailable');payload=await response.json();}
   if(payload?.candidateOnly!==true||!Array.isArray(payload.candidates))throw Error('invalid-response');
   if(request!==controller||key!==activeKey)return;result=payload;error=false;
  }catch{if(request!==controller||key!==activeKey)return;error=true;}
  finally{clearTimeout(timeout);if(request===controller){request=null;panel();}}
 });
 document.addEventListener('input',event=>{if(event.target.id==='query'&&(result||request||error||structured)){discard();panel();}});
}
