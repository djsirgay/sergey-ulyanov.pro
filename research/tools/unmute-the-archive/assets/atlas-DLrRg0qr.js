import"./corpus-Bzua_H7b.js";import{s as j,a as L,i as A,d as w,e as n,c as m,b as E,f as x,m as M}from"./suite-shell-C-7RZjV9.js";const T=document.querySelector("#app");T.innerHTML=`${j("atlas")}
<main class="suite-main">
  <section class="suite-hero shell atlas-hero">
    <p class="suite-eyebrow">02 · Searchable cultural context</p>
    <h1>Find the music.<br><em>Keep the evidence visible.</em></h1>
    <p>Music Atlas turns archival passports and carefully labeled research leads into a searchable corpus. Ask a concrete question, inspect why each result matched, correct the metadata, and export the evidence behind your conclusion.</p>
    <div class="suite-actions"><a class="suite-button primary" href="#explore">Explore the pilot corpus</a><button class="suite-button" id="quick-query">Try: dance remixes in Belarusian</button></div>
    <div class="suite-boundary"><strong>What you are seeing:</strong> five transparent reviewer records drawn from the researcher’s documented work, plus any passports stored in this browser. This is a functional pilot—not a claim that the wider Belarusian archive has already been ingested.</div>
  </section>

  <section class="atlas-workspace shell" id="explore">
    <aside class="atlas-filters suite-panel">
      <div><span class="suite-kicker">Research question</span><h2>Search &amp; filter</h2></div>
      <label class="atlas-field">Search all fields<input id="search" type="search" placeholder="artist, dance, exile, remix…"></label>
      <button class="atlas-suggest" data-query="dance Belarusian remix">↳ Dance works and remixes in Belarusian</button>
      <div class="filter-grid">
        <label class="atlas-field">Language<select id="language"><option value="">All languages</option></select></label>
        <label class="atlas-field">Year<select id="year"><option value="">All years</option></select></label>
        <label class="atlas-field">Record type<select id="kind"><option value="">All types</option></select></label>
        <label class="atlas-field">Evidence<select id="confidence"><option value="">All confidence levels</option><option value="high">High evidence</option><option value="medium">Developing evidence</option><option value="recovery">Recovery lead</option></select></label>
      </div>
      <label class="atlas-check"><input type="checkbox" id="dance"><span>Dance-oriented only</span></label>
      <label class="atlas-check"><input type="checkbox" id="reviewer" checked><span>Include reviewer pilot records</span></label>
      <button class="suite-button" id="reset">Reset filters</button>
      <hr>
      <div><span class="suite-kicker">Bring your own records</span><p class="atlas-note">Import Archive Passport JSON. Records remain in this browser until you export or clear them.</p><label class="suite-button import-button">Import passport JSON<input id="passport-import" type="file" accept="application/json,.json" hidden></label></div>
    </aside>

    <div class="atlas-results">
      <header class="atlas-results-head"><div><span class="suite-kicker">Query result</span><h2 id="result-title">Pilot corpus</h2></div><div class="suite-actions compact"><button class="suite-button" id="export-json">JSON</button><button class="suite-button" id="export-csv">CSV</button></div></header>
      <div class="atlas-stats" id="stats"></div>
      <div class="result-list" id="results" aria-live="polite"></div>
    </div>
  </section>

  <section class="atlas-analytics shell" id="analytics">
    <div class="section-intro"><span class="suite-kicker">DATA · Derived from the current result</span><h2>See the shape of the evidence.</h2><p>Every bar updates with the filters above. Counts describe only the visible pilot and local records—not Belarusian music as a whole.</p></div>
    <div class="analytics-grid" id="analytics-grid"></div>
  </section>

  <section class="atlas-method shell">
    <div><span class="suite-kicker">A reproducible path</span><h2>Question → records → evidence → correction → export</h2></div>
    <ol><li><b>01</b><span>Ask</span><p>Search natural terms or use structured filters.</p></li><li><b>02</b><span>Inspect</span><p>Open a dossier and read the evidence status.</p></li><li><b>03</b><span>Correct</span><p>Add a local annotation without rewriting the source.</p></li><li><b>04</b><span>Export</span><p>Save the exact result set behind the interpretation.</p></li></ol>
  </section>
</main>
<dialog class="record-dialog" id="record-dialog"><button class="dialog-close" id="dialog-close" aria-label="Close">×</button><div id="record-detail"></div></dialog>
${L()}`;const i=a=>document.querySelector(`#${a}`),c=i("search"),p=i("language"),u=i("year"),v=i("kind"),g=i("confidence"),h=i("dance"),k=i("reviewer"),d=i("record-dialog");let l=[];const f=a=>a.replace("dj-set","DJ set").replace("derivative","documented derivative"),b=a=>[...new Set(a)],S=()=>{const a=x(!0);p.innerHTML=`<option value="">All languages</option>${b(a.map(e=>e.language)).sort().map(e=>`<option>${n(e)}</option>`).join("")}`,u.innerHTML=`<option value="">All years</option>${b(a.map(e=>e.year).filter(e=>!!e)).sort((e,s)=>s-e).map(e=>`<option>${e}</option>`).join("")}`,v.innerHTML=`<option value="">All types</option>${b(a.map(e=>e.kind)).sort().map(e=>`<option value="${e}">${f(e)}</option>`).join("")}`},q=()=>x(k.checked).filter(a=>M(a,c.value)&&(!p.value||a.language===p.value)&&(!u.value||a.year===Number(u.value))&&(!v.value||a.kind===v.value)&&(!g.value||a.confidence===g.value)&&(!h.checked||a.dance)),y=(a,e)=>{const s=new Map;return a.forEach(t=>s.set(e(t),(s.get(e(t))??0)+1)),[...s].sort((t,o)=>o[1]-t[1])},$=(a,e,s)=>`<article class="chart suite-panel"><span class="suite-kicker">${a}</span>${e.length?e.map(([t,o])=>`<div class="bar-row"><div><span>${n(t)}</span><b>${o}</b></div><i><span style="width:${Math.max(5,o/s*100)}%"></span></i></div>`).join(""):'<p class="atlas-note">No visible records.</p>'}</article>`,r=()=>{l=q();const a=l.map(e=>e.year).filter(e=>!!e);i("result-title").textContent=c.value?`Results for “${c.value}”`:"Pilot corpus",i("stats").innerHTML=[[l.length,"visible records"],[b(l.map(e=>e.language)).length,"language labels"],[a.length?`${Math.min(...a)}–${Math.max(...a)}`:"—","dated span"],[l.filter(e=>e.sourceStatus==="fingerprinted").length,"fingerprinted"]].map(([e,s])=>`<div><strong>${e}</strong><span>${s}</span></div>`).join(""),i("results").innerHTML=l.length?l.map((e,s)=>`
    <button class="record-card" data-id="${n(e.id)}">
      <span class="record-index">${String(s+1).padStart(2,"0")}</span>
      <div><div class="record-tags"><span class="suite-chip ${e.confidence}">${m(e.confidence)}</span><span>${n(f(e.kind))}</span>${e.dance?"<span>dance</span>":""}</div><h3>${n(e.title)}</h3><p>${n(e.creator)} · ${e.year??"date unknown"} · ${n(e.language)}</p></div>
      <div class="record-source"><span>${n(e.sourceStatus.replaceAll("-"," "))}</span><b>Open dossier →</b></div>
    </button>`).join(""):'<div class="suite-empty suite-panel"><h3>No honest match yet.</h3><p>Remove a filter, import a passport, or annotate a record. The pilot will not invent an answer.</p></div>',i("analytics-grid").innerHTML=[$("Languages",y(l,e=>e.language),Math.max(l.length,1)),$("Record types",y(l,e=>f(e.kind)),Math.max(l.length,1)),$("Evidence confidence",y(l,e=>m(e.confidence)),Math.max(l.length,1))].join("")},R=a=>{i("record-detail").innerHTML=`
    <span class="suite-kicker">Source-visible dossier</span><h2>${n(a.title)}</h2><p class="dialog-lede">${n(a.summary)}</p>
    <div class="dossier-grid"><dl>
      <div><dt>Creator</dt><dd>${n(a.creator)}</dd></div><div><dt>Date / place</dt><dd>${a.year??"Unknown"} · ${n(a.place)}</dd></div>
      <div><dt>Language</dt><dd>${n(a.language)}</dd></div><div><dt>Format</dt><dd>${n(a.format)}</dd></div>
      <div><dt>Relationship</dt><dd>${n(a.relationship)}</dd></div><div><dt>Collection</dt><dd>${n(a.collection)}</dd></div>
    </dl><aside><span class="suite-chip ${a.confidence}">${m(a.confidence)}</span><h3>${n(a.sourceStatus.replaceAll("-"," "))}</h3><p>${n(a.rightsStatus)}</p>${a.evidenceUrl?`<a class="suite-button primary" href="${n(a.evidenceUrl)}" target="_blank" rel="noopener">${n(a.evidenceLabel??"Open evidence")} ↗</a>`:""}</aside></div>
    <div class="dossier-tags">${[...a.genres,...a.themes].map(e=>`<span>${n(e)}</span>`).join("")}</div>
    <form id="annotation-form" class="annotation-form"><span class="suite-kicker">Community-correctable local annotation</span><p>This layer stays in this browser and does not silently rewrite the source record.</p>
      <div class="filter-grid"><label class="atlas-field">Type<select name="kind">${["song","album","dj-set","mix","recording","derivative"].map(e=>`<option value="${e}" ${a.kind===e?"selected":""}>${f(e)}</option>`).join("")}</select></label><label class="atlas-field">Confidence<select name="confidence">${["high","medium","recovery"].map(e=>`<option value="${e}" ${a.confidence===e?"selected":""}>${m(e)}</option>`).join("")}</select></label><label class="atlas-field">Genres<input name="genres" value="${n(a.genres.join(", "))}"></label><label class="atlas-field">Themes<input name="themes" value="${n(a.themes.join(", "))}"></label><label class="atlas-field">BPM<input name="bpm" type="number" min="1" max="300" value="${a.bpm??""}"></label><label class="atlas-check"><input name="dance" type="checkbox" ${a.dance?"checked":""}><span>Dance-oriented</span></label></div><button class="suite-button primary" type="submit">Save local annotation</button><output id="annotation-status"></output></form>`,d.showModal(),i("annotation-form").addEventListener("submit",e=>{e.preventDefault();const s=new FormData(e.currentTarget),t=Number(s.get("bpm"));E(a.id,{kind:s.get("kind"),confidence:s.get("confidence"),genres:String(s.get("genres")??"").split(",").map(o=>o.trim()).filter(Boolean),themes:String(s.get("themes")??"").split(",").map(o=>o.trim()).filter(Boolean),bpm:Number.isFinite(t)&&t>0?t:void 0,dance:s.get("dance")==="on"}),i("annotation-status").textContent="Saved locally. Filters and analytics updated.",r()})};document.addEventListener("click",a=>{const e=a.target.closest("[data-id]");if(!e)return;const s=l.find(t=>t.id===e.dataset.id);s&&R(s)});[c,p,u,v,g,h,k].forEach(a=>a.addEventListener("input",r));document.querySelectorAll("[data-query]").forEach(a=>a.addEventListener("click",()=>{c.value=a.dataset.query??"",h.checked=!0,r(),i("explore").scrollIntoView({behavior:"smooth"})}));i("quick-query").addEventListener("click",()=>{c.value="Belarusian dance remix",h.checked=!0,r(),i("explore").scrollIntoView({behavior:"smooth"})});i("reset").addEventListener("click",()=>{c.value="",p.value="",u.value="",v.value="",g.value="",h.checked=!1,k.checked=!0,r()});i("dialog-close").addEventListener("click",()=>d.close());d.addEventListener("click",a=>{a.target===d&&d.close()});i("passport-import").addEventListener("change",async a=>{const e=a.currentTarget,s=e.files?.[0];if(s){try{const t=A(await s.text());S(),r(),window.alert(`${t} passport record${t===1?"":"s"} imported into this browser.`)}catch{window.alert("That file is not a valid Archive Passport JSON export.")}e.value=""}});const B=()=>l.map(a=>({...a,exportScope:"visible Music Atlas result",exportedAt:new Date().toISOString()}));i("export-json").addEventListener("click",()=>w(JSON.stringify(B(),null,2),"application/json","unmute-belarus-atlas-result.json"));i("export-csv").addEventListener("click",()=>{const a=t=>`"${String(t??"").replaceAll('"','""')}"`,e=["id","title","creator","year","language","kind","relationship","genres","themes","dance","confidence","source_status","evidence_url"],s=l.map(t=>[t.id,t.title,t.creator,t.year,t.language,t.kind,t.relationship,t.genres.join("; "),t.themes.join("; "),t.dance,t.confidence,t.sourceStatus,t.evidenceUrl]);w([e,...s].map(t=>t.map(a).join(",")).join(`
`),"text/csv;charset=utf-8","unmute-belarus-atlas-result.csv")});S();r();
