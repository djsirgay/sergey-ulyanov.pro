import {safeUrl,cleanPersonal} from './core.js';

export const LIBRARY_KEY='unmute-listener-collections/v1';
const MAX_COLLECTIONS=30;
const cleanIds=ids=>[...new Set(Array.isArray(ids)?ids.filter(x=>typeof x==='string'&&x.length<180):[])].slice(0,100);
export function readLibrary(storage,current){
  const initial={version:1,active:'first',collections:[{id:'first',title:current.title||'',ids:cleanIds(current.ids)}],ok:true};
  try{
    const value=JSON.parse(storage.getItem(LIBRARY_KEY)||'null');
    if(!value)return initial;
    if(value.version!==1||!Array.isArray(value.collections)||!value.collections.length)throw Error('Invalid library');
    const seen=new Set();let complete=value.collections.length<=MAX_COLLECTIONS;
    const collections=value.collections.slice(0,MAX_COLLECTIONS).flatMap(c=>{
      if(!c||typeof c.id!=='string'||!/^[\w-]{1,80}$/.test(c.id)||seen.has(c.id)){complete=false;return [];}
      const ids=cleanIds(c.ids),title=String(c.title||'').slice(0,120);
      // A readable subset is useful for recovery, but must not become a silent
      // lossy rewrite of the original stored library on the next save.
      if(typeof c.title!=='string'||title!==c.title||!Array.isArray(c.ids)||ids.length!==c.ids.length||ids.some((id,i)=>id!==c.ids[i]))complete=false;
      seen.add(c.id);return [{id:c.id,title,ids}];
    });
    if(!collections.length)throw Error('Invalid collections');
    const activeKnown=collections.some(c=>c.id===value.active);
    return {version:1,active:activeKnown?value.active:collections[0].id,collections,ok:complete&&activeKnown};
  }catch{return {...initial,ok:false};}
}
export function saveLibrary(storage,library,current){
  // No implicit reset: preserve unreadable/partially recovered raw data until
  // the owner chooses an explicit recovery operation. A new empty library has
  // ok:true and remains writable.
  if(library.ok===false)return false;
  const active=library.collections.find(c=>c.id===library.active);
  if(active){active.title=current.title;active.ids=cleanIds(current.ids);}
  try{storage.setItem(LIBRARY_KEY,JSON.stringify({version:1,active:library.active,collections:library.collections}));return true;}catch{return false;}
}
export function addCollection(library,title='',ids=[]){
  if(library.ok===false||library.collections.length>=MAX_COLLECTIONS)return null;
  const collection={id:crypto.randomUUID(),title:String(title).slice(0,120),ids:cleanIds(ids)};
  library.collections.push(collection);library.active=collection.id;return collection;
}
export function exportCollection(title,records){
  return JSON.stringify({schema:'unmute.collection/1',title:String(title).slice(0,120),records:records.slice(0,100).map(r=>({
    id:r.id,title:r.title,artist:r.artist,language:r.language,listenUrl:safeUrl(r.listenUrl),sourceUrl:safeUrl(r.sourceUrl),
    kind:r.kind,workId:r.workId||null,sourceName:r.sourceName||'',summary:r.summary||{},year:r.year||null
  })),limits:'Links and metadata, not audio or rights clearance. Imported external entries are unverified.'},null,2);
}
// Import only minimal public-link fields. Never trust imported verification, HTML, embed URLs or rights claims.
export function parseCollection(text,catalog){
  if(typeof text!=='string'||text.length>1_000_000)throw Error('size');
  let value;try{value=JSON.parse(text);}catch{throw Error('format');}
  if(value?.schema!=='unmute.collection/1'||!Array.isArray(value.records)||!value.records.length||value.records.length>100)throw Error('format');
  const records=[],personal=[],seen=new Set();
  for(const item of value.records){
    if(!item||typeof item!=='object')throw Error('record');
    // A known ID is accepted only with the same listening/source link, not from a claimed identity alone.
    const known=catalog.find(r=>r.id===item.id&&(r.listenUrl?safeUrl(item.listenUrl)===safeUrl(r.listenUrl):safeUrl(item.sourceUrl)===safeUrl(r.sourceUrl)));
    let record=known;
    if(!record){record=cleanPersonal(item);if(!record)throw Error('record');record.language='unknown';}
    const key=record.listenUrl||record.id;if(seen.has(key))continue;seen.add(key);records.push(record);if(!known)personal.push(record);
  }
  return {title:String(value.title||'').slice(0,120),records,personal};
}

export function playerFor(record){
  if(record.personal)return null;
  let u;try{u=new URL(safeUrl(record.listenUrl));}catch{return null;}
  const host=u.hostname.toLowerCase();
  let id;if(['youtube.com','www.youtube.com','m.youtube.com'].includes(host)&&u.pathname==='/watch')id=u.searchParams.get('v');
  if(host==='youtu.be')id=u.pathname.slice(1);
  if(id&&/^[A-Za-z0-9_-]{11}$/.test(id))return {provider:'YouTube',url:'https://www.youtube-nocookie.com/embed/'+id+'?rel=0',shape:'video'};
  // Apple documents a 150px song preview through its official embed host.
  // Verified against https://js-cdn.music.apple.com/musickit/v1/generate.js
  // and https://artists.apple.com/support/1117-apple-music-marketing-tools.
  // Generate URLs locally; never load Apple JS, fetch metadata, or forward tracking parameters here.
  if(host==='music.apple.com'&&!u.port){
    const path=u.pathname.match(/^\/([a-z]{2})\/(song|album)\/(?:[^/]+\/)?([1-9]\d{0,13})\/?$/i);
    if(!path)return null;
    const trackIds=u.searchParams.getAll('i');
    if(path[2].toLowerCase()==='album'){
      // A recording-level album link must retain exactly one selected song.
      if(trackIds.length!==1||!/^[1-9]\d{0,13}$/.test(trackIds[0]))return null;
    }else if(trackIds.length&&(trackIds.length!==1||trackIds[0]!==path[3]))return null;
    const url=new URL('https://embed.music.apple.com'+u.pathname);
    if(path[2].toLowerCase()==='album')url.searchParams.set('i',trackIds[0]);
    return {provider:'Apple Music',url:url.href,shape:'audio',preview:true};
  }
  const embed=record.embed;
  if(embed?.provider==='bandcamp'&&['track','album'].includes(embed.type)&&/^\d{1,14}$/.test(String(embed.id))&&host.endsWith('.bandcamp.com'))return {provider:'Bandcamp',url:`https://bandcamp.com/EmbeddedPlayer/${embed.type}=${embed.id}/size=large/bgcol=10271b/linkcol=c0f45b/artwork=small/transparent=true/`,shape:'audio'};
  return null;
}
