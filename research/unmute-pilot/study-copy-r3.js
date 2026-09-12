import {OWN_STUDY_TASK,taskIds,STUDY_SHARING_CONSENT_VERSION,studyExamplesUse,studyHelpUse} from './study.js';

// Participant-feedback interface copy, not a claim that any study took place.
// The participant entry and model/hosting privacy notice are managed separately.
export const studyR3Copy={
 en:{
  ownTaskLabel:'My own listening need',listeningNeed:'What music did you actually want to find? (optional)',
  attemptLegend:'About this attempt · optional',examplesLabel:'Did you use a suggested example?',helpLabel:'Did another person help with this attempt?',helpNote:'What help did you receive? Do not include names. (optional)',
  examples:{'not-recorded':'Not answered','not-used':'No','used':'Yes','unsure':'Not sure'},
  help:{'not-recorded':'Not answered','none':'No','someone':'Yes','unsure':'Not sure'},
  selfReport:'These are your answers, not automatic tracking. You can leave them unanswered.',
  sharingLegend:'Optional use in reports',
  reportLabel:'I allow the observations in this note to be used without my name in Unmute research and design-competition reports.',
  quoteLabel:'I separately allow short excerpts from this note to be quoted in those reports after names and identifying details are removed.',
  sharingNotice:'Both choices are optional and independent of saving locally. They apply to the note saved now; nothing is submitted automatically. Leaving a choice unticked does not grant that permission. Review before exporting. If you later wish to withdraw feedback already shared, contact the moderator.',
  previousChoices:'Permissions recorded on the saved observation',reportShort:'Report use',quoteShort:'Anonymous excerpts',granted:'Allowed',notGranted:'Not allowed',unknown:'Not recorded · no permission',
  choiceReset:'The boxes below are deliberately unticked. Choose permissions again only if you save a new observation or revision.'
 },
 be:{
  ownTaskLabel:'Мая ўласная патрэба ў музыцы',listeningNeed:'Якую музыку ты насамрэч хацеў знайсці? (неабавязкова)',
  attemptLegend:'Пра гэтую спробу · неабавязкова',examplesLabel:'Ці карыстаўся ты прапанаваным прыкладам?',helpLabel:'Ці дапамагаў табе іншы чалавек у гэтай спробе?',helpNote:'Якую дапамогу ты атрымаў? Не пазначай імёнаў. (неабавязкова)',
  examples:{'not-recorded':'Без адказу','not-used':'Не','used':'Так','unsure':'Не ўпэўнены'},
  help:{'not-recorded':'Без адказу','none':'Не','someone':'Так','unsure':'Не ўпэўнены'},
  selfReport:'Гэта твае адказы, а не аўтаматычнае адсочванне. Можна не адказваць.',
  sharingLegend:'Неабавязковае выкарыстанне ў справаздачах',
  reportLabel:'Дазваляю выкарыстоўваць назіранні з гэтай нататкі без майго імя ў даследчых справаздачах Unmute і матэрыялах для конкурсаў дызайну.',
  quoteLabel:'Асобна дазваляю цытаваць кароткія ўрыўкі з гэтай нататкі ў гэтых справаздачах пасля выдалення імёнаў і звестак, па якіх можна пазнаць чалавека.',
  sharingNotice:'Абодва рашэнні добраахвотныя і не залежаць ад лакальнага захавання. Яны датычацца нататкі, якую ты захоўваеш цяпер; нічога не адпраўляецца аўтаматычна. Непазначанае поле не дае дазволу. Правер перад экспартам. Каб пазней адклікаць ужо перададзены водгук, звяжыся з мадэратарам.',
  previousChoices:'Дазволы, запісаныя ў захаваным назіранні',reportShort:'Для справаздач',quoteShort:'Ананімныя ўрыўкі',granted:'Дазволена',notGranted:'Не дазволена',unknown:'Не запісана · дазволу няма',
  choiceReset:'Палі ніжэй наўмысна не пазначаныя. Выберы дазволы наноў, толькі калі захоўваеш новае назіранне або рэдакцыю.'
 },
 ru:{
  ownTaskLabel:'Моя собственная потребность в музыке',listeningNeed:'Какую музыку ты на самом деле хотел найти? (необязательно)',
  attemptLegend:'Об этой попытке · необязательно',examplesLabel:'Ты использовал предложенный пример?',helpLabel:'Другой человек помогал тебе в этой попытке?',helpNote:'Какую помощь ты получил? Не указывай имён. (необязательно)',
  examples:{'not-recorded':'Без ответа','not-used':'Нет','used':'Да','unsure':'Не уверен'},
  help:{'not-recorded':'Без ответа','none':'Нет','someone':'Да','unsure':'Не уверен'},
  selfReport:'Это твои ответы, а не автоматическое отслеживание. Можно не отвечать.',
  sharingLegend:'Необязательное использование в отчётах',
  reportLabel:'Разрешаю использовать наблюдения из этой заметки без моего имени в исследовательских отчётах Unmute и материалах для конкурсов дизайна.',
  quoteLabel:'Отдельно разрешаю цитировать короткие отрывки из этой заметки в этих отчётах после удаления имён и сведений, по которым можно узнать человека.',
  sharingNotice:'Оба решения добровольные и не зависят от локального сохранения. Они относятся к заметке, которую ты сохраняешь сейчас; ничего не отправляется автоматически. Непоставленная галочка не даёт разрешения. Проверь перед экспортом. Чтобы позже отозвать уже переданный отзыв, свяжись с модератором.',
  previousChoices:'Разрешения, записанные в сохранённом наблюдении',reportShort:'Для отчётов',quoteShort:'Анонимные отрывки',granted:'Разрешено',notGranted:'Не разрешено',unknown:'Не записано · разрешения нет',
  choiceReset:'Поля ниже намеренно не отмечены. Выбери разрешения заново, только если сохраняешь новое наблюдение или редакцию.'
 }
};
export function studyTaskLabels(lang,existingTasks=[]){
 const t=studyR3Copy[lang]||studyR3Copy.en;
 return taskIds.map((id,index)=>id===OWN_STUDY_TASK?t.ownTaskLabel:existingTasks[index]||id);
}

// All markup here is static translated copy and bounded enum values, never user input.
export function studyR3FieldsHTML(lang='en'){
 const t=studyR3Copy[lang]||studyR3Copy.en;
 const options=(values,labels)=>values.map(value=>`<option value="${value}">${labels[value]}</option>`).join('');
 return `<fieldset class="study-r3-attempt"><legend>${t.attemptLegend}</legend>
 <label>${t.listeningNeed}<textarea name="listeningNeed" maxlength="600" rows="2"></textarea></label>
 <label>${t.examplesLabel}<select name="examplesUse">${options(studyExamplesUse,t.examples)}</select></label>
 <label>${t.helpLabel}<select name="helpUse">${options(studyHelpUse,t.help)}</select></label>
 <label>${t.helpNote}<textarea name="helpNote" maxlength="400" rows="2"></textarea></label>
 <p class="scope-note">${t.selfReport}</p></fieldset>
 <fieldset class="study-r3-sharing"><legend>${t.sharingLegend}</legend>
 <p class="scope-note">${t.sharingNotice}</p><p class="scope-note" id="study-sharing-saved"></p>
 <input type="hidden" name="sharingConsentVersion" value="${STUDY_SHARING_CONSENT_VERSION}">
 <label class="study-consent"><input type="checkbox" name="reportSharingConsent"><span>${t.reportLabel}</span></label>
 <label class="study-consent"><input type="checkbox" name="anonymousQuoteConsent"><span>${t.quoteLabel}</span></label>
 <p class="scope-note">${t.choiceReset}</p></fieldset>`;
}
