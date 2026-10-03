(()=>{"use strict";
const JP=window.JP;
let mediaRecorder=null,chunks=[],recordUrl=null,startTs=0,timer=null,blindRevealed=false;
function rateControl(audio,host){const wrap=document.createElement("div");wrap.className="rate";wrap.innerHTML='Speed <input type="range" min=".55" max="1.25" value="1" step=".05"><span>1.00×</span>';const r=wrap.querySelector("input"),s=wrap.querySelector("span");r.oninput=()=>{audio.playbackRate=Number(r.value);s.textContent=Number(r.value).toFixed(2)+"×"};host.appendChild(wrap)}
function slot(r,i){
 const blind=JP.state.blind&&!blindRevealed;
 const title=blind?`Reference ${String.fromCharCode(65+i)}`:r.label;
 const meta=blind?"Identity hidden for ear training":r.source_kind==="gmu"?`${r.native_language} · GMU standardized sample`:`${r.area||r.country} · IDEA`;
 return `<article class="labslot"><span class="sourcepill ${r.source_kind}">${r.source_kind==="gmu"?"GMU":"IDEA"}</span><h3>${JP.esc(title)}</h3><p class="resultmeta">${JP.esc(meta)}</p><p class="muted" data-labmeta="${JP.esc(r.id)}"></p>${r.source_kind==="gmu"?`<audio controls preload="metadata" src="${JP.esc(r.audio_url)}"></audio><div class="slotrate" data-rate-for="${JP.esc(r.id)}"></div>`:`<p class="muted">IDEA audio remains on the source page.</p>`}<div class="resultactions"><a class="btn small" href="${JP.esc(r.source_url)}" target="_blank" rel="noreferrer">Source ↗</a><button class="btn small" data-remove-lab="${JP.esc(r.id)}">Remove</button></div></article>`;
}
function render(){
 const rows=JP.state.lab.map(JP.record).filter(Boolean);
 document.getElementById("labSlots").innerHTML=rows.length?rows.map(slot).join(""):'<div class="panel">Add references from Discover. GMU samples can play directly here; IDEA samples open at the source.</div>';
 document.querySelectorAll("[data-remove-lab]").forEach(b=>b.onclick=()=>JP.removeLab(b.dataset.removeLab));
 document.querySelectorAll(".labslot audio").forEach(a=>rateControl(a,a.closest(".labslot").querySelector(".slotrate")));rows.forEach(async r=>{if(r.source_kind!=="gmu")return;const m=await JP.fetchGmuMeta(r),el=document.querySelector(`[data-labmeta="${r.id}"]`);if(el)el.textContent=JP.metaSummary(m)});
 document.getElementById("blindPanel").hidden=!JP.state.blind;
 document.getElementById("blindToggle").textContent=JP.state.blind?"Exit blind mode":"Blind ear-test mode";
 if(!JP.state.blind)blindRevealed=false;
}
async function startRecording(){
 if(!navigator.mediaDevices?.getUserMedia){alert("Microphone recording is not supported in this browser.");return}
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  mediaRecorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:mediaRecorder.mimeType||"audio/webm"});if(recordUrl)URL.revokeObjectURL(recordUrl);recordUrl=URL.createObjectURL(blob);const p=document.getElementById("takePlayer");p.src=recordUrl;p.hidden=false;document.getElementById("takeActions").hidden=false;document.getElementById("downloadTake").onclick=()=>{const a=document.createElement("a");a.href=recordUrl;a.download=`joy-of-phonetics-take-${new Date().toISOString().replace(/[:.]/g,"-")}.webm`;a.click()};JP.log("practice:record",Math.round(blob.size/1024)+"KB")};
  mediaRecorder.start();startTs=Date.now();document.getElementById("recordBtn").disabled=true;document.getElementById("stopBtn").disabled=false;timer=setInterval(()=>{const sec=Math.floor((Date.now()-startTs)/1000);document.getElementById("recordTimer").textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`},250)
 }catch(e){alert("Microphone permission was not granted.")}
}
function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=="inactive")mediaRecorder.stop();clearInterval(timer);document.getElementById("recordBtn").disabled=false;document.getElementById("stopBtn").disabled=true}
function init(){
 document.getElementById("blindToggle").onclick=()=>{JP.state.blind=!JP.state.blind;blindRevealed=false;JP.save();render()};
 document.getElementById("revealBlind").onclick=()=>{blindRevealed=true;render();JP.log("ear-test:reveal",document.getElementById("blindGuess").value)};
 document.getElementById("recordBtn").onclick=startRecording;document.getElementById("stopBtn").onclick=stopRecording;
 document.getElementById("takeRate").oninput=e=>document.getElementById("takePlayer").playbackRate=Number(e.target.value);
 document.getElementById("localReference").onchange=e=>{const f=e.target.files?.[0];if(!f)return;const p=document.getElementById("localReferencePlayer");p.src=URL.createObjectURL(f);p.hidden=false;JP.log("practice:local-reference",f.name)};
 render()
}
window.JPLab={init,render};
})();