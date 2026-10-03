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
function kappaFor(field){
 const A=coderMap("Sergey"),B=coderMap("Louis"),pairs=commonSamples().map(id=>[A[id]?.[field],B[id]?.[field]]).filter(([a,b])=>a&&b);
 const n=pairs.length;if(!n)return {n:0,po:null,kappa:null};
 const match=pairs.filter(([a,b])=>a===b).length,po=match/n,ca={},cb={};
 pairs.forEach(([a,b])=>{ca[a]=(ca[a]||0)+1;cb[b]=(cb[b]||0)+1});
 const cats=new Set([...Object.keys(ca),...Object.keys(cb)]);let pe=0;cats.forEach(c=>pe+=(ca[c]||0)/n*(cb[c]||0)/n);
 const k=(1-pe)===0?1:(po-pe)/(1-pe);return {n,po,kappa:k}
}
function agreement(){
 const ids=commonSamples(),r=kappaFor("rhoticity"),t=kappaFor("rhythm");
 const fmt=x=>x===null?"—":(Math.round(x*100)/100).toFixed(2);
 document.getElementById("agreementBox").innerHTML=`<strong>${ids.length}</strong> dual-coded samples.<br><small>Rhoticity: n=${r.n}, observed agreement ${r.po===null?"—":Math.round(r.po*100)+"%"}, Cohen’s κ ${fmt(r.kappa)}.<br>Rhythm: n=${t.n}, observed agreement ${t.po===null?"—":Math.round(t.po*100)+"%"}, Cohen’s κ ${fmt(t.kappa)}.</small><details style="margin-top:9px"><summary>Codebook discipline</summary><small>Code only what the audio/source supports; keep source commentary separate from your own observation; use “Uncertain” rather than forcing a category; flag disagreements for reconciliation.</small></details>`;
}
function annotationsCSV(){
 const rows=[["coder","sample_id","source","label","rhoticity","rhythm","th","r_quality","vowels","consonants","prosody","socio","confidence","needs_review","updated_at"]];
 for(const [coder,map] of Object.entries(JP.state.annotations||{})){
  if(!map||typeof map!=="object")continue;
  for(const [id,a] of Object.entries(map)){const r=JP.record(id);if(!r||!a||typeof a!=="object")continue;rows.push([coder,id,r.source_kind,r.label,a.rhoticity||"",a.rhythm||"",a.th||"",a.rQuality||"",a.vowels||"",a.consonants||"",a.prosody||"",a.socio||"",a.confidence||"",a.review?"true":"false",a.updatedAt||""])}
 }
 const q=v=>{v=String(v??"");return /[",\n]/.test(v)?`"${v.replaceAll('"','""')}"`:v};return rows.map(row=>row.map(q).join(",")).join("\n")
}
function exportCSV(){JP.download(`joy-of-phonetics-annotations-${Date.now()}.csv`,annotationsCSV(),"text/csv");JP.log("research:export","csv")}
async function importBundle(file){
 try{const obj=JSON.parse(await file.text());if(!obj||!obj.annotations)throw new Error("No annotations object found");
  for(const [coder,map] of Object.entries(obj.annotations)){JP.state.annotations[coder]={...(JP.state.annotations[coder]||{}),...(map||{})}}
  if(Array.isArray(obj.sessions))JP.state.sessions=[...obj.sessions,...JP.state.sessions].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i).slice(0,200);
  JP.save();JP.log("research:import",file.name);render();alert("Research bundle merged locally.");
 }catch(e){alert("Could not import this research bundle: "+e.message)}
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
 refreshSelect();document.getElementById("researchSample").onchange=loadAnnotation;document.getElementById("saveAnnotation").onclick=saveAnnotation;document.getElementById("exportResearch").onclick=exportResearch;document.getElementById("clearActivity").onclick=()=>{if(confirm("Clear the local activity log?")){JP.state.activity=[];JP.save();renderActivity()}};
 const primary=document.getElementById("exportResearch"),wrap=primary.parentElement;
 const csv=document.createElement("button");csv.className="btn";csv.textContent="Export annotations CSV";csv.onclick=exportCSV;wrap.appendChild(csv);
 const lab=document.createElement("label");lab.className="btn";lab.style.cursor="pointer";lab.innerHTML='Import bundle <input type="file" accept=".json,application/json" hidden>';lab.querySelector("input").onchange=e=>{const f=e.target.files?.[0];if(f)importBundle(f)};wrap.appendChild(lab);
 render()
}
window.JPResearch={init,render,renderActivity};
})();