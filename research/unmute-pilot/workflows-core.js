import {safeUrl} from './core.js';

export const REVIEW_KEY='unmute-listener-review-queue/v1';
export const reviewKinds=['language','identity','link','theme','version','missing'];
const clip=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
const code=v=>clip(v,40).replace(/[^a-zA-Z0-9_-]/g,'');
export function cleanReview(value,catalog){
 if(!value||typeof value!=='object'||!reviewKinds.includes(value.kind))return null;
 const record=catalog.find(r=>r.id===value.recordId);
 const sourceUrl=safeUrl(value.sourceUrl),note=clip(value.note,1600),reviewer=code(value.reviewer);
 if(!reviewer||note.length<8||(!record&&value.kind!=='missing'))return null;
 if(value.kind!=='link'&&!sourceUrl)return null;
 return {recordId:record?.id||null,recordTitle:record?record.artist+' — '+record.title:null,
  kind:value.kind,sourceUrl,note,proposal:clip(value.proposal,600),reviewer,
  status:'pending-human-review',rights:'No permission or factual verification is granted by this note.'};
}
function storedReview(value,catalog){
 const note=cleanReview(value,catalog);
 if(!note||!/^[-a-zA-Z0-9_]{1,80}$/.test(value.id||'')||!Number.isFinite(Date.parse(value.createdAt)))return null;
 return {...note,id:value.id,createdAt:new Date(value.createdAt).toISOString()};
}
export function readReviews(storage,catalog){
 try{
  const raw=storage.getItem(REVIEW_KEY);if(!raw)return {notes:[],ok:true};
  if(raw.length>1_000_000)throw Error('size');
  const saved=JSON.parse(raw);if(saved?.schema!=='unmute.review-queue/1'||!Array.isArray(saved.notes)||saved.notes.length>200)throw Error('schema');
  const notes=saved.notes.map(x=>storedReview(x,catalog));if(notes.some(n=>!n))throw Error('record');
  return {notes:[...new Map(notes.map(n=>[n.id,n])).values()],ok:true};
 }catch{return {notes:[],ok:false};}
}
export function saveReview(storage,value,catalog){
 const note=cleanReview(value,catalog),queue=readReviews(storage,catalog);
 // Never overwrite an unreadable queue or silently drop older contributions.
 if(!note||!queue.ok||queue.notes.length>=200)return {ok:false};
 const entry={...note,id:crypto.randomUUID(),createdAt:new Date().toISOString()};
 try{storage.setItem(REVIEW_KEY,JSON.stringify({schema:'unmute.review-queue/1',notes:[...queue.notes,entry]}));return {ok:true,entry};}catch{return {ok:false};}
}
export function exportReviews(storage,catalog){
 const queue=readReviews(storage,catalog);if(!queue.ok)throw Error('unreadable');
 return JSON.stringify({schema:'unmute.review-queue/1',notes:queue.notes,
  notice:'Private local contributions. Not published, independently verified or participant-study results. Review notes and sources before sharing.'},null,2);
}
export function importReviews(storage,text,catalog){
 if(typeof text!=='string'||text.length>1_000_000)throw Error('size');
 const incoming=JSON.parse(text),current=readReviews(storage,catalog);
 if(!current.ok||incoming?.schema!=='unmute.review-queue/1'||!Array.isArray(incoming.notes)||incoming.notes.length>200)throw Error('schema');
 const entries=incoming.notes.map(v=>storedReview(v,catalog));if(entries.some(v=>!v))throw Error('record');
 const ids=new Set(current.notes.map(n=>n.id));const additions=entries.filter(n=>{if(ids.has(n.id))return false;ids.add(n.id);return true;});
 if(current.notes.length+additions.length>200)throw Error('full');
 storage.setItem(REVIEW_KEY,JSON.stringify({schema:'unmute.review-queue/1',notes:[...current.notes,...additions]}));
 return additions.length;
}
export function versionFamily(record,catalog){
 if(!record?.workId||record.personal)return [];
 return catalog.filter(r=>!r.personal&&r.workId===record.workId);
}
export function queueFor(record,selected,results,catalog){
 const valid=rows=>[...new Map(rows.filter(r=>r&&safeUrl(r.listenUrl)).map(r=>[r.id,r])).values()];
 const saved=valid(selected);if(saved.some(r=>r.id===record.id))return {origin:'collection',records:saved};
 const found=valid(results);if(found.some(r=>r.id===record.id))return {origin:'results',records:found};
 const family=valid(versionFamily(record,catalog));if(family.length>1)return {origin:'versions',records:family};
 return {origin:'single',records:valid([record])};
}
export function catalogueCoverage(catalog){
 const listen=catalog.filter(r=>safeUrl(r.listenUrl));
 return {records:catalog.length,listening:listen.length,leads:catalog.length-listen.length,
  belarusian:listen.filter(r=>r.language==='be').length,
  works:new Set(catalog.map(r=>r.workId||r.id)).size,
  languageUnknown:listen.filter(r=>r.language==='unknown').length,
  versionGroups:new Set(catalog.filter(r=>catalog.some(s=>s.id!==r.id&&s.workId&&s.workId===r.workId)).map(r=>r.workId)).size};
}
