import {readStudyHistory,studyExport,taskIds,studyRounds} from './study.js';
import {studyR3Copy,studyTaskLabels,studyR3FieldsHTML} from './study-copy-r3.js';
import {routeState} from './routing.js';

// Draft identity includes round and build: a retest never inherits a baseline answer.
const drafts=new Map();
let context,lastForm,lastActive,lastRequest;
const codeOf=value=>String(value||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);
const buildOf=value=>String(value||'').trim().slice(0,100);
const roundOf=value=>studyRounds.includes(value)?value:'';
const key=value=>JSON.stringify([value.code,value.task,value.round,value.prototypeVersion]);
const answers=['nickname','role','comfort','query','outcome','ease','comment','listeningNeed','examplesUse','helpUse','helpNote'];
const optionalPermissions=['reportSharingConsent','anonymousQuoteConsent'];
const requestedCode=()=>codeOf(routeState(globalThis.location||{}).params.get('participant'));
const activeOf=form=>({code:form.dataset.noteCode||'',task:form.dataset.noteTask,round:form.dataset.noteRound||'',prototypeVersion:form.dataset.noteBuild||''});
const valuesOf=form=>({code:codeOf(form.elements.code.value),task:form.elements.task.value,round:roundOf(form.elements.round.value),prototypeVersion:buildOf(form.elements.prototypeVersion.value)});
const matching=(r,value)=>r.code===value.code&&r.task===value.task&&r.round===value.round&&r.prototypeVersion===value.prototypeVersion;
const historyFor=(c,value)=>value.code?readStudyHistory(c.storage,value.code).filter(r=>matching(r,value)):[];
const copy={
 en:{round:'Observation round',choose:'Choose the round',baseline:'Baseline · first test',retest:'Retest · after a change',exploratory:'Exploratory test',unspecified:'Earlier note · round not recorded',build:'Prototype version / build',buildHint:'Use the version supplied by your moderator',history:'Each save adds an observation; it never replaces an earlier one. Editing a saved note adds a linked revision. Changing round or version opens a separate draft. Export all task notes to retain every round.',required:'Choose a round and enter the prototype version before saving. Earlier notes remain labelled as not recorded.',saved:'A new observation was added; earlier rounds and revisions are preserved.'},
 ru:{round:'Этап наблюдения',choose:'Выбери этап',baseline:'Исходный тест · до изменений',retest:'Повторный тест · после изменений',exploratory:'Пробный тест',unspecified:'Прежняя запись · этап не указан',build:'Версия прототипа / сборка',buildHint:'Используй версию, которую указал модератор',history:'Каждое сохранение добавляет наблюдение, не заменяя прежнее. Правка сохранённой записи создаёт связанную редакцию. Другой этап или версия открывает отдельный черновик. Экспорт всех заданий сохраняет все этапы.',required:'Перед сохранением выбери этап и укажи версию прототипа. В старых записях неизвестная версия остаётся неизвестной.',saved:'Добавлено новое наблюдение; прежние этапы и редакции сохранены.'},
 be:{round:'Этап назірання',choose:'Выберы этап',baseline:'Першапачатковы тэст · да змен',retest:'Паўторны тэст · пасля змен',exploratory:'Пробны тэст',unspecified:'Ранейшы запіс · этап не пазначаны',build:'Версія прататыпа / зборка',buildHint:'Выкарыстоўвай версію, якую пазначыў мадэратар',history:'Кожнае захаванне дадае назіранне, не замяняючы ранейшае. Праўка захаванага запісу стварае звязаную рэдакцыю. Іншы этап або версія адкрывае асобны чарнавік. Экспарт усіх заданняў захоўвае ўсе этапы.',required:'Перад захаваннем выберы этап і пазнач версію прататыпа. У старых запісах невядомая версія застаецца невядомай.',saved:'Дададзена новае назіранне; ранейшыя этапы і рэдакцыі захаваныя.'}
};
function remember(form){
 const active=activeOf(form);if(active.task)drafts.set(key(active),{...Object.fromEntries(new FormData(form)),...active});
}
function setActive(form,value){
 form.elements.code.value=value.code;form.elements.task.value=value.task;
 form.elements.round.value=value.round;form.elements.prototypeVersion.value=value.prototypeVersion;
 form.dataset.noteCode=value.code;form.dataset.noteTask=value.task;
 form.dataset.noteRound=value.round;form.dataset.noteBuild=value.prototypeVersion;
 lastActive={...value};
}
function savedFor(c,form){
 const value=valuesOf(form),rows=historyFor(c,value),id=form.elements.observationId.value;
 return rows.find(r=>r.observationId===id)||rows.at(-1);
}
function resetPermissions(form){for(const field of optionalPermissions)if(form.elements[field])form.elements[field].checked=false;}
function showSavedPermissions(c,form){
 if(!form.elements.sharingConsentVersion)return;
 const status=form.querySelector('#study-sharing-saved');if(!status)return;
 const t=studyR3Copy[c.lang]||studyR3Copy.en,saved=savedFor(c,form);
 const value=permission=>permission===true?t.granted:permission===false?t.notGranted:t.unknown;
 status.textContent=saved?`${t.previousChoices}: ${t.reportShort} — ${value(saved.reportSharingConsent)}; ${t.quoteShort} — ${value(saved.anonymousQuoteConsent)}.`:'';
}
export function enhanceStudy(c){
 context=c;const form=document.querySelector('#study-form');if(!form)return;
 const t=copy[c.lang]||copy.en;
 c.t.tasks=studyTaskLabels(c.lang,c.t.tasks);
 // Root opens feedback only after the first attempt. Keep all historical tasks
 // available here for later targeted tasks without changing their stored IDs.
 if(form.elements.task.options){
  for(const option of form.elements.task.options)option.textContent=c.t.tasks[taskIds.indexOf(option.value)]||option.textContent;
 }
 if(!form.elements.round){
  // Static translated text only. Actual build labels are assigned through .value.
  const options=[''].concat(studyRounds).map(r=>'<option value="'+r+'">'+(r?t[r]:t.choose)+'</option>').join('');
  form.querySelector('#study-task').insertAdjacentHTML('beforebegin','<label>'+t.round+'<select name="round" id="study-round" required>'+options+'</select></label><label>'+t.build+'<input name="prototypeVersion" id="study-build" maxlength="100" required placeholder="'+t.buildHint+'"></label><input type="hidden" name="observationId">');
 }
 // Replace the former overwrite claim without changing the app's form template.
 const oldHint=form.querySelector('.study-consent + .scope-note');if(oldHint)oldHint.textContent=t.history;
 if(!form.elements.sharingConsentVersion){
  const anchor=form.querySelector('#study-task');
  // Native forms supply insertAdjacentHTML; older synthetic adapters may not.
  anchor?.insertAdjacentHTML?.('afterend',studyR3FieldsHTML(c.lang));
 }
 if(lastForm&&lastForm!==form)remember(lastForm);
 const request=requestedCode(),sameRequest=lastActive&&lastRequest===request;
 const code=sameRequest?lastActive.code:codeOf(form.elements.code.value);
 const task=sameRequest?lastActive.task:form.elements.task.value;
 const notes=code?readStudyHistory(c.storage,code):[],recent=notes.filter(r=>r.task===task).at(-1);
 const active={code,task,
  round:sameRequest?lastActive.round:recent?.round||roundOf(form.elements.round.value),
  prototypeVersion:sameRequest?lastActive.prototypeVersion:recent?.prototypeVersion||buildOf(form.elements.prototypeVersion.value)||buildOf(c.prototypeVersion)};
 const draft=drafts.get(key(active)),saved=draft||historyFor(c,active).at(-1);
 const profile=notes.at(-1),defaults={nickname:profile?.nickname||'',role:profile?.role||'listener',comfort:profile?.comfort||'some',query:'',outcome:'not-tried',ease:'',comment:'',listeningNeed:'',examplesUse:'not-recorded',helpUse:'not-recorded',helpNote:''};
 setActive(form,active);
 for(const field of answers)if(form.elements[field])form.elements[field].value=saved?.[field]??defaults[field];
 form.elements.observationId.value=saved?.observationId||'';
 // Viewing a prior note is not consent to create a new observation.
 form.elements.consent.checked=false;
 resetPermissions(form);
 lastForm=form;lastRequest=request;
 const updateContext=()=>{
  const value=activeOf(form),heading=form.querySelector('h2');
  if(heading)heading.textContent=(c.t.studyWelcome||'Welcome')+(value.code?' · '+value.code:'');
  const description=form.querySelector('#study-task');
  if(description&&c.t.tasks)description.textContent=c.t.tasks[taskIds.indexOf(value.task)]||'';
 };
 const notice=origin=>{
  const value=activeOf(form),label=c.lang==='ru'?'Участник':c.lang==='be'?'Удзельнік':'Participant';
  const unnamed=c.lang==='ru'?'код не указан':c.lang==='be'?'код не пазначаны':'no code entered';
  const taskLabel=c.t.tasks?.[taskIds.indexOf(value.task)]||value.task;
  const messages=c.lang==='ru'?{
   saved:'Открыто сохранённое наблюдение именно для этого участника, задания, этапа и версии. Другие наблюдения не изменены.',
   restored:'Восстановлен рабочий черновик именно для этого участника, задания, этапа и версии. Сохранённые наблюдения не изменены.',
   new:'Открыто новое наблюдение: для этого участника, задания, этапа и версии ответов нет. Ответы из других этапов или заданий не перенесены.',
   edited:'В рабочем черновике есть несохранённые изменения.'
  }:c.lang==='be'?{
   saved:'Адкрыта захаванае назіранне менавіта для гэтага ўдзельніка, задання, этапа і версіі. Іншыя назіранні не змененыя.',
   restored:'Адноўлены працоўны чарнавік менавіта для гэтага ўдзельніка, задання, этапа і версіі. Захаваныя назіранні не змененыя.',
   new:'Адкрыта новае назіранне: для гэтага ўдзельніка, задання, этапа і версіі адказаў няма. Адказы з іншых этапаў або заданняў не перанесеныя.',
   edited:'У працоўным чарнавіку ёсць незахаваныя змены.'
  }:{
   saved:'A saved observation for this participant, task, round and build is open. Other observations are unchanged.',
   restored:'The working draft for this participant, task, round and build was restored. Saved observations are unchanged.',
   new:'This is a new observation: no answers are saved for this participant, task, round and build. Answers from other contexts were not copied.',
   edited:'The working draft has unsaved changes.'
  };
  const message=messages[origin];
  const limit=c.lang==='ru'?'Черновики сохраняются в памяти этой вкладки при переходах внутри приложения, но пропадут после перезагрузки или закрытия. Нажми «Сохранить локально», чтобы сохранить отзыв.':c.lang==='be'?'Чарнавікі застаюцца ў памяці гэтай укладкі пры пераходах у праграме, але знікнуць пасля перазагрузкі або закрыцця. Націсні «Захаваць лакальна», каб захаваць водгук.':'Drafts stay in this tab while navigating the app, but are lost on reload or close. Choose Save locally to retain a note.';
  const status=form.querySelector('#study-status'),messageText=label+': '+(value.code||unnamed)+' · '+taskLabel+' · '+(t[value.round]||t.choose)+' · '+(value.prototypeVersion||t.buildHint)+'. '+message+' '+limit;
  if(status.textContent!==messageText)status.textContent=messageText;
 };
 const syncExport=()=>{form.querySelector('[data-action="study-export"]').disabled=!savedFor(c,form);showSavedPermissions(c,form);};
 updateContext();syncExport();notice(draft?'restored':saved?'saved':'new');
 const contextChanged=()=>key(valuesOf(form))!==key(activeOf(form));
 const changeContext=()=>{
  if(!contextChanged())return;
  const old=activeOf(form);remember(form);
  const next=valuesOf(form),draft=drafts.get(key(next)),saved=draft||historyFor(c,next).at(-1);
  const profile=old.code===next.code?drafts.get(key(old)):(next.code?readStudyHistory(c.storage,next.code).at(-1):null);
  const defaults={nickname:profile?.nickname||'',role:profile?.role||'listener',comfort:profile?.comfort||'some',query:'',outcome:'not-tried',ease:'',comment:'',listeningNeed:'',examplesUse:'not-recorded',helpUse:'not-recorded',helpNote:''};
  for(const field of answers)if(form.elements[field])form.elements[field].value=saved?.[field]??defaults[field];
  form.elements.observationId.value=saved?.observationId||'';
  form.elements.consent.checked=false;resetPermissions(form);setActive(form,next);
  updateContext();notice(draft?'restored':saved?'saved':'new');syncExport();
 };
 const identityFields=['code','task','round','prototypeVersion'];
 form.addEventListener('input',event=>{
  if(identityFields.includes(event.target.name)){remember(form);return;}
  if(answers.includes(event.target.name)){remember(form);updateContext();notice('edited');}
 });
 form.addEventListener('change',event=>{
  if(identityFields.includes(event.target.name)){changeContext();return;}
  if(answers.includes(event.target.name)){remember(form);notice('edited');}
  if(optionalPermissions.includes(event.target.name))notice('edited');
 });
 form.addEventListener('focusout',event=>{if(identityFields.includes(event.target.name))changeContext();});
 form.addEventListener('submit',event=>{
  if(contextChanged()){changeContext();event.preventDefault();event.stopImmediatePropagation();return;}
  if(!form.elements.round.value||!buildOf(form.elements.prototypeVersion.value)){
   event.preventDefault();event.stopImmediatePropagation();form.querySelector('#study-status').textContent=t.required;return;
  }
  remember(form);
  const submittedKey=key(activeOf(form)),before=new Set(historyFor(c,activeOf(form)).map(r=>r.observationId));
  // A browser can flush microtasks between the form and document listeners.
  // A new task runs after bubbling reaches the app's persistence handler.
  setTimeout(()=>{
   if(document.querySelector('#study-form')!==form||key(activeOf(form))!==submittedKey)return;
   const added=historyFor(c,activeOf(form)).filter(r=>!before.has(r.observationId)).at(-1);
   const status=form.querySelector('#study-status'),code=form.dataset.noteCode;
   if(added){
    form.elements.observationId.value=added.observationId;form.elements.consent.checked=false;resetPermissions(form);
    remember(form);status.textContent=(code?code+' · ':'')+t.saved;
   }else if(code&&status.textContent&&!status.textContent.startsWith(code+' · '))status.textContent=code+' · '+status.textContent;
   syncExport();
  },0);
 });
}
// Export the saved observation represented by the active form, not stale app state.
document.addEventListener('click',event=>{
 if(!event.target.closest('[data-action="study-export"]'))return;
 event.preventDefault();event.stopImmediatePropagation();
 const c=context,form=document.querySelector('#study-form');if(!form)return;
 const saved=savedFor(c,form);
 if(!saved){c.toast(c.t.studyError);return;}
 c.download(studyExport(saved),'unmute-feedback-'+saved.code+'-'+saved.task+'-'+saved.round+'-'+saved.observationId+'.json','application/json');
},true);
