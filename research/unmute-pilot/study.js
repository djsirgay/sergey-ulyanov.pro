// Explicit local observations, never telemetry or inferred participant outcomes.
// V1 keys remain intact as migration sources; V2 history is append-only.
export const LEGACY_STUDY_KEY='unmute-listener-study/v1';
export const STUDY_KEY='unmute-listener-study/v2';
export const LEGACY_STUDY_HISTORY_KEY='unmute-listener-study-history/v1';
export const STUDY_HISTORY_KEY='unmute-listener-study-history/v2';
export const MAX_STUDY_OBSERVATIONS=1000;
// Append only: stored observations keep their original task IDs and positions.
export const OWN_STUDY_TASK='own-need';
export const taskIds=['lullaby','memory','missing','collection','description','versions','transfer','correction',OWN_STUDY_TASK];
export const studyRounds=['baseline','retest','exploratory','unspecified'];
export const STUDY_SHARING_CONSENT_VERSION='unmute.study-sharing/1';
export const studyExamplesUse=['not-recorded','not-used','used','unsure'];
export const studyHelpUse=['not-recorded','none','someone','unsure'];
const text=(v,max=600)=>String(v||'').trim().slice(0,max);
const identifier=(v,max=80)=>text(v,max).replace(/[^a-zA-Z0-9_-]/g,'');
const permission=(raw,field)=>raw.sharingConsentVersion===STUDY_SHARING_CONSENT_VERSION?(raw[field]===true||raw[field]==='on'):null;
const permissionsNotice='Exporting or saving locally does not grant permission to publish or use feedback. reportSharingConsent permits de-identified observations in Unmute research and design-competition reports; anonymousQuoteConsent separately permits short excerpts after identifying details are removed. Only explicit true grants that use; false and null do not. Null means the relevant notice/choice was not recorded. Respect a later revision that withholds permission rather than using an earlier permission to bypass it. These flags do not certify that text is anonymous; a human must review identifying details before use.';
export function cleanStudy(raw){
 if(!raw||typeof raw!=='object')return null;
 const code=identifier(raw.code,40);if(!code)return null;
 return {version:2,observationId:identifier(raw.observationId),supersedes:identifier(raw.supersedes),
 code,nickname:text(raw.nickname,60),role:['listener','musician','researcher','learner','other'].includes(raw.role)?raw.role:'listener',comfort:['fluent','some','learning','none'].includes(raw.comfort)?raw.comfort:'some',
 task:taskIds.includes(raw.task)?raw.task:'lullaby',round:studyRounds.includes(raw.round)?raw.round:'unspecified',prototypeVersion:text(raw.prototypeVersion,100)||'not-recorded',
 query:text(raw.query,180),listeningNeed:text(raw.listeningNeed,600),outcome:['done','partly','not-done','not-tried'].includes(raw.outcome)?raw.outcome:'not-tried',ease:[1,2,3,4,5].includes(Number(raw.ease))?Number(raw.ease):null,comment:text(raw.comment,1200),
 examplesUse:studyExamplesUse.includes(raw.examplesUse)?raw.examplesUse:'not-recorded',helpUse:studyHelpUse.includes(raw.helpUse)?raw.helpUse:'not-recorded',helpNote:text(raw.helpNote,400),
 sharingConsentVersion:raw.sharingConsentVersion===STUDY_SHARING_CONSENT_VERSION?STUDY_SHARING_CONSENT_VERSION:'not-recorded',reportSharingConsent:permission(raw,'reportSharingConsent'),anonymousQuoteConsent:permission(raw,'anonymousQuoteConsent'),
 consent:raw.consent===true||raw.consent==='on',savedAt:text(raw.savedAt,40)};
}
export function readStudy(storage){try{return cleanStudy(JSON.parse(storage.getItem(STUDY_KEY)||storage.getItem(LEGACY_STUDY_KEY)||'null'));}catch{return null;}}
const comparable=note=>JSON.stringify({...note,observationId:'',supersedes:''});
function loadHistory(storage,forAppend=false){
 const retained=rows=>{
  const notes=rows.map(cleanStudy);
  // Recovery reads may expose valid notes, but an append must never replace
  // damaged, unconsented or future-version rows with a filtered fallback.
  if(forAppend&&rows.some((raw,i)=>!notes[i]?.consent||(raw.version!==undefined&&![1,2].includes(raw.version))))throw Error('Study history requires recovery');
  return notes.filter(r=>r?.consent);
 };
 const current=storage.getItem(STUDY_HISTORY_KEY);
 if(current!==null&&current!==undefined){
  const rows=JSON.parse(current);if(!Array.isArray(rows))throw Error('Invalid study history');
  return retained(rows);
 }
 const legacy=storage.getItem(LEGACY_STUDY_HISTORY_KEY);
 let rows=legacy===null||legacy===undefined?[]:JSON.parse(legacy);
 if(!Array.isArray(rows))throw Error('Invalid legacy study history');
 rows=retained(rows);
 const last=readStudy(storage);
 // Preserve a legacy single-note cache if it was never included in history.
 if(last?.consent&&!rows.some(r=>comparable(r)===comparable(last)))rows.push(last);
 return rows.map((r,i)=>({...r,observationId:r.observationId||'legacy-v1-'+(i+1)}));
}
export function readStudyHistory(storage,code){try{return loadHistory(storage).filter(r=>code===undefined||r.code===code);}catch{return [];}}
const sameContext=(a,b)=>a.code===b.code&&a.task===b.task&&a.round===b.round&&a.prototypeVersion===b.prototypeVersion;
let sequence=0;
function newId(history){
 let id;do{id='obs-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+(++sequence)+'-'+Math.random().toString(36).slice(2));}while(history.some(r=>r.observationId===id));return id;
}
export function saveStudy(storage,raw){
 const clean=cleanStudy({...raw,savedAt:new Date().toISOString()});
 if(!clean?.consent)return {ok:false,value:null};
 try{
  const history=loadHistory(storage,true);if(history.length>=MAX_STUDY_OBSERVATIONS)return {ok:false,value:clean};
  const previous=history.find(r=>r.observationId===clean.observationId&&sameContext(r,clean));
  const saved={...clean,observationId:newId(history),supersedes:previous?.observationId||''};
  storage.setItem(STUDY_HISTORY_KEY,JSON.stringify([...history,saved]));
  // History is canonical; a failed convenience-cache update does not erase it.
  try{storage.setItem(STUDY_KEY,JSON.stringify(saved));}catch{}
  return {ok:true,value:saved};
 }catch{return {ok:false,value:clean};}
}
export function studyHistoryExport(storage,code){
 const safeCode=identifier(code,40);
 return JSON.stringify({schema:'unmute.local-study-session/2',code:safeCode,observations:safeCode?readStudyHistory(storage,safeCode):[],delivery:'Not submitted. Voluntary local notes only; savedAt is a save timestamp, not task timing or an inferred outcome.',history:'All saved observations are retained. A supersedes link identifies an explicit saved-note revision; earlier observations remain in this export.',permissions:permissionsNotice,assistance:'examplesUse and helpUse are optional participant self-reports, not captured events or inferred independent task completion.'},null,2);
}
export function studyExport(study){return JSON.stringify({schema:'unmute.local-study-feedback/2',...cleanStudy(study),delivery:'Not sent. Participant may choose to give this file to the moderator.',tracking:'No screen recording, automatic timing or background event collection.',permissions:permissionsNotice,assistance:'examplesUse and helpUse are optional participant self-reports, not captured events or inferred independent task completion.'},null,2);}
