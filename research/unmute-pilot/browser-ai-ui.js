import {escapeHTML as e} from './core.js';
import {RELEASE} from './release.js';
export const isBrowserRuntime=()=>{try{return typeof document!=='undefined'&&document.querySelector('meta[name="unmute-runtime"]')?.content==='browser';}catch{return false;}};
let provider=null,consented=false,pendingConsent=null;
const words={
 en:{title:'Run meaning search on this device?',body:'The first use downloads about 153 MB of public model and runtime files from this website. Use Wi-Fi if mobile data is limited. Startup may be slow, and low-memory devices may not support it. The catalogue and exact search work without AI.',privacy:'Your query is processed in this browser, not sent to an AI service. Only public model and catalogue assets may be cached. The website host still receives normal file requests. Closing suggestions stops a pending request; the stop button also unloads the model.',yes:'Download model & search',no:'Use exact search instead',stop:'Stop AI & release memory',start:'Loading the on-device search…',download:'Loading model assets',prepare:'Preparing the on-device model…',infer:'Comparing your description…',cancelled:'AI was not started. You can use exact search.',intro:'Optional on-device AI compares catalogue descriptions, not audio. A model download requires confirmation. Queries stay after # in the tab address; they are not sent to the host but may remain in browser history or a shared link.'},
 ru:{title:'Запустить поиск по смыслу на этом устройстве?',body:'Первый запуск загружает около 153 МБ открытой модели и её компонентов с этого сайта. Лучше использовать Wi-Fi, если трафик ограничен. Запуск может быть медленным, а устройству с малым объёмом памяти модель может не подойти. Каталог и точный поиск работают без ИИ.',privacy:'Запрос обрабатывается в этом браузере, не отправляется ИИ-сервису. В кэш могут сохраняться только открытые файлы модели и каталога. Хостинг получает обычные запросы на файлы. Закрытие подсказок отменяет текущий запрос; кнопка остановки также выгружает модель.',yes:'Загрузить модель и найти',no:'Перейти к точному поиску',stop:'Остановить ИИ и освободить память',start:'Загружаем поиск на устройстве…',download:'Загрузка файлов модели',prepare:'Подготовка локальной модели…',infer:'Сопоставляем описание…',cancelled:'ИИ не запущен. Можно использовать точный поиск.',intro:'Необязательный локальный ИИ сравнивает описания каталога, не аудио. Загрузка модели требует подтверждения. Запрос остаётся после # в адресе вкладки: он не отправляется хостингу, но может остаться в истории браузера или в переданной ссылке.'},
 be:{title:'Запусціць пошук паводле сэнсу на гэтай прыладзе?',body:'Першы запуск загружае каля 153 МБ адкрытай мадэлі і яе кампанентаў з гэтага сайта. Лепш выкарыстоўваць Wi-Fi, калі трафік абмежаваны. Запуск можа быць павольным, а прыладзе з малым аб’ёмам памяці мадэль можа не падысці. Каталог і дакладны пошук працуюць без ІІ.',privacy:'Запыт апрацоўваецца ў гэтым браўзеры, не адпраўляецца ІІ-сэрвісу. У кэш могуць захоўвацца толькі адкрытыя файлы мадэлі і каталога. Хостынг атрымлівае звычайныя запыты на файлы. Закрыццё падказак адмяняе бягучы запыт; кнопка спынення таксама выгружае мадэль.',yes:'Загрузіць мадэль і знайсці',no:'Перайсці да дакладнага пошуку',stop:'Спыніць ІІ і вызваліць памяць',start:'Загружаем пошук на прыладзе…',download:'Загрузка файлаў мадэлі',prepare:'Падрыхтоўка лакальнай мадэлі…',infer:'Супастаўляем апісанне…',cancelled:'ІІ не запушчаны. Можна выкарыстоўваць дакладны пошук.',intro:'Неабавязковы лакальны ІІ параўноўвае апісанні каталога, не аўдыя. Загрузка мадэлі патрабуе пацверджання. Запыт застаецца пасля # у адрасе ўкладкі: ён не адпраўляецца хостынгу, але можа застацца ў гісторыі браўзера або ў перададзенай спасылцы.'}
};
export const browserAIWords=lang=>words[lang]||words.en;
export function requestBrowserConsent(lang){
 if(consented)return Promise.resolve(true);if(pendingConsent)return pendingConsent;
 const t=browserAIWords(lang),previous=document.activeElement,d=document.createElement('dialog');
 d.className='add-dialog workflow-dialog ai-consent';d.setAttribute('aria-labelledby','ai-consent-heading');
 d.innerHTML=`<h2 id="ai-consent-heading">${e(t.title)}</h2><p>${e(t.body)}</p><p>${e(t.privacy)}</p><div class="detail-actions"><button type="button" class="button primary" data-ai-consent="yes">${e(t.yes)}</button><button type="button" class="button secondary" data-ai-consent="no">${e(t.no)}</button></div>`;
 pendingConsent=new Promise(resolve=>{
  let answer=false;
  d.addEventListener('click',ev=>{const b=ev.target.closest('[data-ai-consent]');if(!b)return;answer=b.dataset.aiConsent==='yes';d.close();});
  d.addEventListener('close',()=>{d.remove();consented=answer;pendingConsent=null;previous?.focus();resolve(answer);},{once:true});
 });document.body.append(d);d.showModal();d.querySelector('[data-ai-consent="no"]').focus();return pendingConsent;
}
export async function queryBrowserAI(input,options){
 if(!consented)throw Error('Model consent required.');
 if(!provider){const {createBrowserSemanticProvider}=await import('./semantic/provider.js?build='+encodeURIComponent(RELEASE));provider=createBrowserSemanticProvider();}
 return provider.query(input,{...options,consent:true});
}
export function stopBrowserAI(){provider?.close();provider=null;consented=false;}
