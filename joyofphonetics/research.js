(()=>{"use strict";
const JP=window.JP;
function coderMap(name=JP.state.coder){JP.state.annotations[name]=JP.state.annotations[name]||{};return JP.state.annotations[name]}
function getAnn(id,name=JP.state.coder){return coderMap(name)[id]||{}}
function setAnn(id,obj,name=JP.state.coder){coderMap(name)[id]=obj;JP.save()}
function sampleList(){
 const ids=[...new Set([...JP.state.lab,...JP.state.favorites,...Object.keys(coderMap("Sergey")),...Object.keys(coderMap("Louis"))])];
 const priority=ids.map(JP.record).filter(Boolean);const seen=new Set(priority.map(x=>x.id));const rest=JP.all.filter(x=>!seen.has(x.id));
 return [...priority,...rest]
}
function refreshSelect(){
 const s=document.getElementById("researchSample"),cur=JP.state.researchSample||s.value;
 const rows=sampleList();s.innerHTML='<option value="">Choose sample</option>'+rows.map(JP.sampleOption).join("");if(rows.some(x=>x.id===cur))s.value=cur
}
function loadAnnotation(){
 const id=document.getElementById("researchSample").value;JP.state.researchSample=id;JP.save();const r=JP.record(id),a=getAnn(id);
 document.getElementById("researchSourceCard").innerHTML=JP.sourceCard(r);
 document.getElementById("annRhoticity").value=a.rhoticity||"";document.getElementById("annRhythm").value=a.rhythm||"";document.getElementById("annTh").value=a.th||"";document.getElementById("annR").value=a.rQuality||"";document.getElementById("annVowels").value=a.vowels||"";document.getElementById("annConsonants").value=a.consonants||"";document.getElementById("annProsody").value=a.prosody||"";document.getElementById("annSocio").value=a.socio||"";document.getElementById("annConfidence").value=a.confidence||"";document.getElementById("annReview").checked=!!a.review
}
function saveAnnotation(){
 const id=document.getElementById("researchSample").value;if(!id){alert("Choose a sample first.");return}
 const a={rhoticity:document.getElementById("annRhoticity").value,rhythm:document.getElementById("annRhythm").value,th:document.getElementById("annTh").value,rQuality:document.getElementById("annR").value,vowels:document.getElementById("annVowels").value,consonants:document.getElementById("annConsonants").value,prosody:document.getElementById("annProsody").value,socio:document.getElementById("annSocio").value,confidence:document.getElementById("annConfidence").value,review:document.getElementById("annReview").checked,updatedAt:new Date().toISOString(),coder:JP.state.coder};
 setAnn(id,a);JP.log("research:annotation",`${JP.state.coder} · ${id}`);render()
}
function metrics(){
 const a=Object.values(coderMap()),review=a.filter(x=>x.review).length,common=commonSamples().length;
 document.getElementById("researchMetrics").innerHTML=[[JP.idea.length,"IDEA indexed"],[JP.gmu.length,"GMU playable"],[a.length,`${JP.state.coder} coded`],[review,"Needs review"],[common,"Dual-coded"]].map(([n,l])=>`<div class="metric"><strong>${Number(n).toLocaleString()}</strong><span>${JP.esc(l)}</span></div>`).join("")
}
function commonSamples(){const A=coderMap("Sergey"),B=coderMap("Louis");return Object.keys(A).filter(id=>B[id])}
function agreement(){
 const A=coderMap("Sergey"),B=coderMap("Louis"),ids=commonSamples();let comps=0,matches=0;const disagreements=[];
 ids.forEach(id=>{["rhoticity","rhythm"].forEach(k=>{if(A[id][k]&&B[id][k]){comps++;if(A[id][k]===B[id][k])matches++;else disagreements.push({id,k,a:A[id][k],b:B[id][k]})}})});
 const pct=comps?Math.round(matches/comps*100):null;
 document.getElementById("agreementBox").innerHTML=`<strong>${pct===null?"—":pct+"%"}</strong> exact agreement across ${comps} comparable categorical fields on ${ids.length} dual-coded samples.${disagreements.length?`<br><small>${disagreements.length} disagreements need reconciliation.</small>`:""}`;
}
function reviewQueue(){
 const rows=Object.entries(coderMap()).filter(([,a])=>a.review).map(([id,a])=>({r:JP.record(id),a})).filter(x=>x.r);
 const h=document.getElementById("reviewQueue");h.innerHTML=rows.length?rows.map(x=>`<div class="queueitem"><button class="btn small" data-review-open="${JP.esc(x.r.id)}">Open</button><strong>${JP.esc(x.r.label)}</strong><br><span>${JP.esc(x.a.confidence||"Unrated")} confidence · ${JP.esc(JP.state.coder)}</span></div>`).join(""):'<p class="muted">No review flags for this coder.</p>';
 document.querySelectorAll("[data-review-open]").forEach(b=>b.onclick=()=>{document.getElementById("researchSample").value=b.dataset.reviewOpen;loadAnnotation()})
}
function renderActivity(){
 const h=document.getElementById("activityLog"),rows=JP.state.activity||[];h.innerHTML=rows.length?rows.slice(0,150).map(x=>`<div class="activityitem"><time>${new Date(x.t).toLocaleString()}</time><strong>${JP.esc(x.action)}</strong> ${JP.esc(x.detail)}</div>`).join(""):'<p class="muted">No activity yet.</p>'
}
function exportResearch(){
 const bundle={exportedAt:new Date().toISOString(),sources:{ideaIndexed:JP.idea.length,gmuIndexed:JP.gmu.length},annotations:JP.state.annotations,sessions:JP.state.sessions,favorites:JP.state.favorites,lab:JP.state.lab,activity:JP.state.activity,method_note:"Speaker-level exemplars. Categorical agreement is exact observed agreement, not a reliability coefficient."};JP.download(`joy-of-phonetics-research-${Date.now()}.json`,JSON.stringify(bundle,null,2));JP.log("research:export","bundle")
}
function render(){document.getElementById("activeCoderLabel").textContent=JP.state.coder;refreshSelect();metrics();agreement();reviewQueue();renderActivity();loadAnnotation()}
function init(){
 refreshSelect();document.getElementById("researchSample").onchange=loadAnnotation;document.getElementById("saveAnnotation").onclick=saveAnnotation;document.getElementById("exportResearch").onclick=exportResearch;document.getElementById("clearActivity").onclick=()=>{if(confirm("Clear the local activity log?")){JP.state.activity=[];JP.save();renderActivity()}};render()
}
window.JPResearch={init,render,renderActivity};
})();