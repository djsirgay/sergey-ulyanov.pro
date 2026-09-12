// Listener queries and participant codes live in the fragment, not HTTP URLs.
// Accept older local links, then migrate them without another navigation.
export function routeState(location) {
 const raw=String(location.hash||'').replace(/^#/,'');
 const split=raw.indexOf('?'),route=(split<0?raw:raw.slice(0,split))||'discover';
 const params=new URLSearchParams(location.search||'');
 if(split>=0)for(const [key,value] of new URLSearchParams(raw.slice(split+1)))params.set(key,value);
 return {route,params};
}
export function routeURL(location,route,changes={},base='/') {
 const {params}=routeState(location);
 for(const [key,value] of Object.entries(changes)){
  if(value===undefined||value===null||value==='')params.delete(key);else params.set(key,String(value));
 }
 const language=params.get('lang');params.delete('lang');
 const page=new URLSearchParams();if(['en','be','ru'].includes(language))page.set('lang',language);
 const safeRoute=/^(discover|collection|guide|study|participate|privacy|roadmap|data|reviews|track\/[a-zA-Z0-9_-]+)$/.test(route)?route:'discover';
 return base+(page.size?'?'+page:'')+'#'+safeRoute+(params.size?'?'+params:'');
}
