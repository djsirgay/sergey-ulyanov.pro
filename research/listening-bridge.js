// Public Research pages can be viewed inside GUCHNA without replacing its
// player document. No participant token, search query or audio is exchanged.
export const LISTENING_ORIGIN='https://unmute.sergey-ulyanov.pro';
const MAP_STAGES=new Set('principalities gdl-formation union-1385 gdl-1500 lublin-1569 commonwealth-1700 partition-1772 partition-1793 partition-1795 tilsit-1807 empire-1914 occupation-1915 bnr-1918 contested-1919 riga-1921 ussr-1922 bssr-1924 bssr-1926 division-1938 invasion-1939 occupation-1941 postwar-1945 sovereignty-1990 independence-1991 republic-1994 congress-1815 gdl-1492 commonwealth-1600'.split(' '));
export function isListeningReturn(input){try{const u=new URL(input);return !u.username&&!u.password&&u.origin===LISTENING_ORIGIN&&['/','/login/','/study/'].includes(u.pathname);}catch{return false;}}
export function publicResearchLocation(input,origin='https://research.sergey-ulyanov.pro'){
 try{
  if(typeof input!=='string'||input.length>2048)return null;
  const u=new URL(input,origin);if(u.origin!==origin||u.username||u.password||!/(?:\/|\/index\.html)$/.test(u.pathname))return null;
  const original=new URLSearchParams(u.search),requested=original.get('lang');
  const lang=requested==='be'?'be':requested==='ru'&&/\/playground\/dranik-meter\/(?:index\.html)?$/.test(u.pathname)?'ru':'en';
  u.search='';if(original.has('lang'))u.searchParams.set('lang',lang);
  if(/\/atlas\/mapa\/(?:index\.html)?$/.test(u.pathname)){
   const year=original.get('year'),scope=original.get('mapScope'),stage=original.get('stage');
   if(/^\d{3,4}$/.test(year)&&+year>=800&&+year<=2100)u.searchParams.set('year',year);
   if(['focus','region'].includes(scope))u.searchParams.set('mapScope',scope);
   if(MAP_STAGES.has(stage))u.searchParams.set('stage',stage);
  }
  if(!/^#[A-Za-z][A-Za-z0-9_-]{0,99}$/.test(u.hash))u.hash='';
  return u.href;
 }catch{return null;}
}
const mounted=new WeakSet();
export function mountListeningBridge({win=globalThis.window,doc=globalThis.document}={}){
 if(!win||!doc||win.parent===win||mounted.has(win))return;
 mounted.add(win);
 let generation=null;
 const publicURL=input=>publicResearchLocation(input,win.location.origin);
 const send=(type,fields={})=>win.parent.postMessage({type,...fields,generation},LISTENING_ORIGIN);
 const report=()=>{const url=publicURL(win.location.href);if(url)send('unmute:research-location',{url});};
 report();win.addEventListener('hashchange',report);win.addEventListener('popstate',report);
 win.addEventListener('message',event=>{
  if(event.source!==win.parent||event.origin!==LISTENING_ORIGIN||event.data?.type!=='unmute:research-context'||!Number.isSafeInteger(event.data.generation)||event.data.generation<0)return;
  generation=event.data.generation;report();
 });
 // The site's language and map controls use History API without hashchange.
 // Preserve their original behavior and report only the allowlisted location.
 for(const method of ['pushState','replaceState']){
  const original=win.history?.[method];if(typeof original!=='function')continue;
  win.history[method]=function(...args){const result=Reflect.apply(original,this,args);report();return result;};
 }
 doc.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
  const a=event.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
  if(isListeningReturn(a.href)){event.preventDefault();send('unmute:research-return');}
  else if(publicURL(a.href)){event.preventDefault();send('unmute:research-navigate',{url:publicURL(a.href),from:publicURL(win.location.href)});}
  else {try{const u=new URL(a.href);if(u.origin!==win.location.origin&&/^https?:$/.test(u.protocol)){a.target='_blank';a.rel='noopener noreferrer';}}catch{}}
 },true);
}
if(typeof document!=='undefined')mountListeningBridge();
