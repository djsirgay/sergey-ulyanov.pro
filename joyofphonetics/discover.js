(()=>{"use strict";
const JP=window.JP;
const CURATED={
"idea-california-6":"Source commentary: Northern California working-class speech; strong rhoticity, an open LOT/THOUGHT-area vowel, occasional shortened TH, and relatively light vocal fry.",
"idea-brazil-5":"Source commentary: Portuguese influence includes strong rhoticity, tense/retroflex R, variable TH substitutions, consonant substitutions, nasalization, and several vowel shifts.",
"idea-illinois-29":"Source commentary: relaxed General American tendencies, including fronted GOOSE and L-conditioned vowel shaping.",
"idea-florida-17":"Source commentary: this Orlando speaker is described as closer to General American than to a strongly marked Southern or Old Florida variety."
};
let visible=60,showFavs=false;
function fillFilters(){
 const regions=[...new Set(JP.idea.map(x=>x.region).filter(Boolean))].sort();
 document.getElementById("regionFilter").innerHTML='<option value="">All regions</option>'+regions.map(x=>`<option>${JP.esc(x)}</option>`).join("");
 const langs=[...new Set(JP.gmu.map(x=>x.native_language).filter(Boolean))].sort();
 document.getElementById("languageFilter").innerHTML='<option value="">All GMU languages</option>'+langs.map(x=>`<option>${JP.esc(x)}</option>`).join("");
}
function score(r,q){if(!q)return 0;const t=q.toLowerCase(),label=(r.label||"").toLowerCase(),area=(r.area||"").toLowerCase(),lang=(r.native_language||"").toLowerCase();if(label===t||area===t||lang===t)return 100;if(label.startsWith(t)||area.startsWith(t)||lang.startsWith(t))return 50;if(r.search_blob.includes(t))return 10;return 0}
function filtered(){
 const q=document.getElementById("searchInput").value.trim().toLowerCase(),src=document.getElementById("sourceFilter").value,reg=document.getElementById("regionFilter").value,lang=document.getElementById("languageFilter").value;
 let rows=JP.all.filter(r=>{
  if(showFavs&&!JP.state.favorites.includes(r.id))return false;
  if(src!=="all"&&r.source_kind!==src)return false;
  if(reg&&r.region!==reg)return false;
  if(lang&&r.native_language!==lang)return false;
  if(q&&!r.search_blob.includes(q))return false;
  return true;
 });
 if(q)rows.sort((a,b)=>score(b,q)-score(a,q)||a.label.localeCompare(b.label));else rows.sort((a,b)=>a.label.localeCompare(b.label,undefined,{numeric:true}));
 return rows;
}
function playInline(id,host){
 const r=JP.record(id);if(!r||r.source_kind!=="gmu")return;
 host.innerHTML=`<audio controls autoplay preload="metadata" src="${JP.esc(r.audio_url)}" style="width:100%"></audio><div class="rate">Speed <input type="range" min=".55" max="1.25" value="1" step=".05"></div>`;
 const a=host.querySelector("audio"),range=host.querySelector("input");range.addEventListener("input",()=>a.playbackRate=Number(range.value));JP.log("audio:play",id);
}
function card(r){
 const fav=JP.state.favorites.includes(r.id),cur=CURATED[r.id],desc=cur||r.description|| (r.source_kind==="gmu"?"Standardized GMU sample. Add to Audio Lab for direct A/B comparison.":"Archive-wide IDEA index record. Open the source for audio, speaker biography, transcription, and any commentary.");
 const meta=r.source_kind==="gmu"?`${r.native_language} · sample ${r.sample_number}`:`${r.area||r.country} · ${r.region}`;
 return `<article class="resultcard" data-id="${JP.esc(r.id)}"><div class="resulttop"><span class="sourcepill ${r.source_kind}">${r.source_kind==="gmu"?"GMU · PLAYABLE":"IDEA"}</span><button class="starbtn ${fav?"active":""}" data-star="${JP.esc(r.id)}">${fav?"★":"☆"}</button></div><h3 class="resulttitle">${JP.esc(r.label)}</h3><p class="resultmeta">${JP.esc(meta)}</p><p class="resultdesc">${JP.esc(desc)}</p><div class="inlineplayer" id="player-${JP.esc(r.id)}"></div><div class="resultactions">${r.source_kind==="gmu"?`<button class="btn small" data-play="${JP.esc(r.id)}">▶ Play</button>`:""}<button class="btn small" data-lab="${JP.esc(r.id)}">+ Lab</button><button class="btn small" data-coach="${JP.esc(r.id)}">Coach</button><button class="btn small" data-research="${JP.esc(r.id)}">Research</button><a class="btn small" href="${JP.esc(r.source_url)}" target="_blank" rel="noreferrer">Source ↗</a></div></article>`;
}
function render(){
 const rows=filtered(),slice=rows.slice(0,visible);
 document.getElementById("resultCount").textContent=`${rows.length.toLocaleString()} matching samples`;
 document.getElementById("resultHint").textContent=showFavs?"Favorites only":`${JP.idea.length.toLocaleString()} IDEA + ${JP.gmu.length.toLocaleString()} GMU indexed`;
 document.getElementById("results").innerHTML=slice.map(card).join("")||'<div class="panel">No samples match these filters.</div>';
 const more=document.getElementById("loadMore");more.hidden=visible>=rows.length;more.textContent=`Load more (${Math.min(60,rows.length-visible)})`;
 document.querySelectorAll("[data-star]").forEach(b=>b.onclick=()=>{const id=b.dataset.star;JP.favorite(id,!JP.state.favorites.includes(id));render();window.JPCoach?.refreshSamples()});
 document.querySelectorAll("[data-lab]").forEach(b=>b.onclick=()=>{if(JP.addLab(b.dataset.lab))b.textContent="✓ In Lab"});
 document.querySelectorAll("[data-coach]").forEach(b=>b.onclick=()=>{JP.state.coachDraft={...JP.state.coachDraft,sampleId:b.dataset.coach};JP.save();JP.go("coach");window.JPCoach?.render()});document.querySelectorAll("[data-research]").forEach(b=>b.onclick=()=>{JP.state.researchSample=b.dataset.research;JP.save();JP.go("research");window.JPResearch?.render()});
 document.querySelectorAll("[data-play]").forEach(b=>b.onclick=()=>playInline(b.dataset.play,document.getElementById(`player-${b.dataset.play}`)));
}
function clear(){document.getElementById("searchInput").value="";document.getElementById("sourceFilter").value="all";document.getElementById("regionFilter").value="";document.getElementById("languageFilter").value="";showFavs=false;visible=60;render()}
function init(){
 fillFilters();render();
 ["searchInput","sourceFilter","regionFilter","languageFilter"].forEach(id=>document.getElementById(id).addEventListener(id==="searchInput"?"input":"change",()=>{visible=60;render()}));
 document.getElementById("loadMore").onclick=()=>{visible+=60;render()};
 document.getElementById("clearFilters").onclick=clear;
 document.getElementById("showFavorites").onclick=()=>{showFavs=!showFavs;visible=60;document.getElementById("showFavorites").classList.toggle("active",showFavs);render()};
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{document.getElementById("searchInput").value=b.dataset.q;showFavs=false;visible=60;render();document.getElementById("catalog").scrollIntoView({behavior:"smooth"})});
 document.getElementById("jumpAllSamples").onclick=()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"});
}
window.JPDiscover={init,render};
})();