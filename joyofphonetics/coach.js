(()=>{"use strict";
const JP=window.JP;
const FEATURES={
"Rhoticity":"Mark parked the car near the harbor before dark.",
"TH sounds":"Thirty thoughtful actors thanked them for the smooth rehearsal.",
"T realization":"Betty wrote a little note about the city after rehearsal.",
"L quality":"Lily held the small blue bell while Leo called.",
"GOOSE /uː/":"Two new students moved through the cool room.",
"GOAT /oʊ/":"Joan drove home slowly over the old road.",
"TRAP–BATH":"Sam laughed after class and packed the black bag.",
"LOT–THOUGHT":"Tom bought a small coffee and walked across the hall.",
"PRICE /aɪ/":"I might try the bright white light tonight.",
"MOUTH /aʊ/":"Brown cows wandered around the old town.",
"Rhythm":"Keep the strong words clear while the smaller words move quickly.",
"Intonation":"Are you really going? I thought you said tomorrow."
};
const SETS=["KIT","DRESS","TRAP","LOT","STRUT","FOOT","BATH","CLOTH","NURSE","FLEECE","FACE","PALM","THOUGHT","GOAT","GOOSE","PRICE","CHOICE","MOUTH","NEAR","SQUARE","START","NORTH","FORCE","CURE"];
const SET_WORDS={KIT:"kit, sit, fish, milk, city, women",DRESS:"dress, bed, head, many, friend, says",TRAP:"trap, cat, hand, bad, carry, family",LOT:"lot, stop, job, watch, honest, coffee",STRUT:"strut, cup, love, money, enough, come",FOOT:"foot, good, put, could, woman, sugar",BATH:"bath, ask, dance, laugh, after, example",CLOTH:"cloth, off, lost, dog, long, often",NURSE:"nurse, word, bird, learn, work, journey",FLEECE:"fleece, see, people, machine, police, key",FACE:"face, day, name, rain, eight, break",PALM:"palm, father, calm, spa, bra, Chicago",THOUGHT:"thought, law, talk, caught, water, broad",GOAT:"goat, home, road, show, boat, soul",GOOSE:"goose, blue, food, move, group, shoe",PRICE:"price, time, night, eye, buy, height",CHOICE:"choice, boy, noise, point, voice, join",MOUTH:"mouth, now, house, town, cloud, doubt",NEAR:"near, here, beer, serious, idea, career",SQUARE:"square, care, hair, bear, parent, various",START:"start, car, heart, father, park, large",NORTH:"north, war, short, morning, four, court",FORCE:"force, more, door, board, course, story",CURE:"cure, pure, tourist, secure, jury, Europe"};
const IPA="i ɪ e ɛ æ a ɑ ɒ ɔ o ʊ u ʌ ə ɜ ɚ ɝ p b t d k ɡ f v θ ð s z ʃ ʒ h tʃ dʒ m n ŋ l ɹ r ɾ j w ˈ ˌ ː ̃".split(" ");
function D(){return JP.state.coachDraft||{}}
function set(k,v){JP.state.coachDraft={...D(),[k]:v};JP.save()}
function toggleArray(k,v){const s=new Set(D()[k]||[]);s.has(v)?s.delete(v):s.add(v);set(k,[...s]);renderTargets()}
function refreshSamples(){
 const ids=[...new Set([...JP.state.lab,...JP.state.favorites,D().sampleId].filter(Boolean))],rows=ids.map(JP.record).filter(Boolean);
 const sel=document.getElementById("coachSample"),cur=D().sampleId||"";
 sel.innerHTML='<option value="">Choose sample</option>'+rows.map(JP.sampleOption).join("");sel.value=rows.some(x=>x.id===cur)?cur:"";
 updateSource()
}
function renderTargets(){
 document.getElementById("featureChips").innerHTML=Object.keys(FEATURES).map(x=>`<button type="button" class="${(D().features||[]).includes(x)?"on":""}" data-feature="${JP.esc(x)}">${JP.esc(x)}</button>`).join("");
 document.querySelectorAll("[data-feature]").forEach(b=>b.onclick=()=>toggleArray("features",b.dataset.feature));
 document.getElementById("lexicalSets").innerHTML=SETS.map(x=>`<button type="button" class="${(D().sets||[]).includes(x)?"on":""}" data-set="${x}">${x}</button>`).join("");
 document.querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>toggleArray("sets",b.dataset.set))
}
async function updateSource(){const r=JP.record(document.getElementById("coachSample").value||D().sampleId);const h=document.getElementById("coachSourceCard");h.innerHTML=JP.sourceCard(r);if(r?.source_kind==="gmu"){const m=await JP.fetchGmuMeta(r);h.innerHTML+=`<br><small>${JP.esc(JP.metaSummary(m))}</small>`}}
function readForm(){
 ["roleProject","targetOutcome","customTarget","drillText","coachNotes","studentNotes","coachConfidence"].forEach(id=>set(id,document.getElementById(id).value));
 set("selfRating",document.getElementById("selfRating").value);set("sampleId",document.getElementById("coachSample").value)
}
function writeForm(){
 const d=D();["roleProject","targetOutcome","customTarget","drillText","coachNotes","studentNotes","coachConfidence"].forEach(id=>document.getElementById(id).value=d[id]||"");
 document.getElementById("selfRating").value=d.selfRating||3;document.getElementById("selfRatingValue").textContent=`${d.selfRating||3} / 5`;
 refreshSamples();renderTargets();renderHistory()
}
function buildDrill(){
 readForm();const d=D(),parts=[];(d.features||[]).forEach(f=>{if(FEATURES[f])parts.push(FEATURES[f])});
 if((d.sets||[]).length){parts.push("LEXICAL SET WORD BANK");(d.sets||[]).forEach(x=>parts.push(`${x}: ${SET_WORDS[x]||"add your own examples"}`));parts.push("Mark the target vowel in each word, then move from isolated words → phrases → full sentences.")}
 if(d.customTarget)parts.push(`Coach target: ${d.customTarget}`);
 document.getElementById("drillText").value=parts.join("\n\n")||"Choose one or more phonetic targets first.";set("drillText",document.getElementById("drillText").value);JP.log("coach:build-drill",(d.features||[]).join(", "))
}
function saveSession(){
 readForm();const d={...D(),id:`session-${Date.now()}`,savedAt:new Date().toISOString(),coder:JP.state.coder};JP.state.sessions.unshift(d);JP.state.sessions=JP.state.sessions.slice(0,100);JP.save();JP.log("coach:save-session",d.sampleId||"no sample");renderHistory()
}
function loadSession(id){const s=JP.state.sessions.find(x=>x.id===id);if(!s)return;JP.state.coachDraft={...s};JP.save();writeForm();JP.log("coach:load-session",id)}
function renderHistory(){
 const h=document.getElementById("sessionHistory"),rows=JP.state.sessions||[];h.innerHTML=rows.length?rows.map(s=>{const r=JP.record(s.sampleId);return `<div class="historyitem"><button class="btn small" data-load-session="${JP.esc(s.id)}">Open</button><strong>${JP.esc(s.roleProject||r?.label||"Practice session")}</strong><br><span>${new Date(s.savedAt).toLocaleString()} · ${JP.esc(r?.label||"No sample")} · ${(s.features||[]).map(JP.esc).join(", ")}</span></div>`}).join(""):'<p class="muted">No saved sessions yet.</p>';document.querySelectorAll("[data-load-session]").forEach(b=>b.onclick=()=>loadSession(b.dataset.loadSession))
}
async function share(){
 readForm();const d={sampleId:D().sampleId,roleProject:D().roleProject,targetOutcome:D().targetOutcome,features:D().features||[],sets:D().sets||[],customTarget:D().customTarget,drillText:D().drillText,coachNotes:D().coachNotes};const url=`${location.origin}${location.pathname}#session=${JP.sharePayload(d)}`;const ok=await JP.copyText(url);alert(ok?"Share link copied. Audio is not included.":"Could not copy the link.");JP.log("coach:share",d.sampleId||"")
}
function exportSession(){readForm();JP.download(`joy-of-phonetics-session-${Date.now()}.json`,JSON.stringify({session:D(),exportedAt:new Date().toISOString()},null,2))}
function clearDraft(){JP.state.coachDraft={features:[],sets:[],selfRating:3};JP.save();writeForm()}
function init(){
 const sel=document.getElementById("coachSample");sel.onchange=()=>{set("sampleId",sel.value);updateSource()};
 ["roleProject","targetOutcome","customTarget","drillText","coachNotes","studentNotes","coachConfidence"].forEach(id=>document.getElementById(id).oninput=e=>set(id,e.target.value));
 document.getElementById("selfRating").oninput=e=>{set("selfRating",e.target.value);document.getElementById("selfRatingValue").textContent=`${e.target.value} / 5`};
 document.getElementById("buildDrill").onclick=buildDrill;const saveBtn=document.getElementById("saveCoachSession");saveBtn.onclick=saveSession;if(!document.getElementById("copyDrill")){const cp=document.createElement("button");cp.className="btn";cp.id="copyDrill";cp.textContent="Copy drill";cp.onclick=async()=>{const txt=document.getElementById("drillText").value;if(!txt){alert("Build or write a drill first.");return}const ok=await JP.copyText(txt);if(ok)JP.log("coach:copy-drill",D().sampleId||"")};saveBtn.insertAdjacentElement("afterend",cp)};document.getElementById("shareSession").onclick=share;document.getElementById("exportSession").onclick=exportSession;document.getElementById("newSession").onclick=clearDraft;
 document.getElementById("clearSessions").onclick=()=>{if(confirm("Clear saved coaching sessions?")){JP.state.sessions=[];JP.save();renderHistory()}};
 document.getElementById("ipaKeyboard").innerHTML=IPA.map(x=>`<button type="button" data-ipa="${x}">${x}</button>`).join("");document.querySelectorAll("[data-ipa]").forEach(b=>b.onclick=()=>{const ta=document.getElementById("drillText"),start=ta.selectionStart,end=ta.selectionEnd;ta.value=ta.value.slice(0,start)+b.dataset.ipa+ta.value.slice(end);ta.focus();ta.selectionStart=ta.selectionEnd=start+b.dataset.ipa.length;set("drillText",ta.value)});
 writeForm()
}
function render(){writeForm()}
window.JPCoach={init,render,refreshSamples};
})();