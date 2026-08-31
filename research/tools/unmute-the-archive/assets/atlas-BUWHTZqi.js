import"./corpus-Bzua_H7b.js";import{r as L,p as j,s as A,a as E,i as M,d as x,e as i,c as m,b as T,f as w,m as R}from"./suite-shell-D2L70m2x.js";const q=document.querySelector("#app");q.innerHTML=`${A("atlas")}
<main class="suite-main">
  <section class="suite-hero shell atlas-hero">
    <p class="suite-eyebrow">02 · Searchable cultural context</p>
    <h1>Find the music.<br><em>Keep the evidence visible.</em></h1>
    <p>Music Atlas turns archival passports and carefully labeled research leads into a searchable corpus. Ask a concrete question, inspect why each result matched, correct the metadata, and export the evidence behind your conclusion.</p>
    <div class="suite-actions"><a class="suite-button primary" href="#explore">Explore the pilot corpus</a><button class="suite-button" id="quick-query">Show Belarusian dance works &amp; remixes</button></div>
    <div class="suite-boundary"><strong>What you are seeing:</strong> ${L.length} transparent seed records: five creator-documented works and ${j.length} source-cited remix leads, plus any passports stored in this browser. This is a functional pilot—not a claim that Tuzin.fm or the wider Belarusian archive has already been ingested.</div>
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
      <label class="atlas-check"><input type="checkbox" id="reviewer" checked><span>Include curated seed records</span></label>
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
${E()}`;const n=e=>document.querySelector(`#${e}`),o=n("search"),p=n("language"),u=n("year"),v=n("kind"),g=n("confidence"),h=n("dance"),k=n("reviewer"),d=n("record-dialog");let l=[];const f=e=>e.replace("dj-set","DJ set").replace("derivative","documented derivative"),b=e=>[...new Set(e)],S=()=>{const e=w(!0);p.innerHTML=`<option value="">All languages</option>${b(e.map(t=>t.language)).sort().map(t=>`<option>${i(t)}</option>`).join("")}`,u.innerHTML=`<option value="">All years</option>${b(e.map(t=>t.year).filter(t=>!!t)).sort((t,a)=>a-t).map(t=>`<option>${t}</option>`).join("")}`,v.innerHTML=`<option value="">All types</option>${b(e.map(t=>t.kind)).sort().map(t=>`<option value="${t}">${f(t)}</option>`).join("")}`},B=()=>w(k.checked).filter(e=>R(e,o.value)&&(!p.value||e.language===p.value)&&(!u.value||e.year===Number(u.value))&&(!v.value||e.kind===v.value)&&(!g.value||e.confidence===g.value)&&(!h.checked||e.dance)),y=(e,t)=>{const a=new Map;return e.forEach(s=>a.set(t(s),(a.get(t(s))??0)+1)),[...a].sort((s,c)=>c[1]-s[1])},$=(e,t,a)=>`<article class="chart suite-panel"><span class="suite-kicker">${e}</span>${t.length?t.map(([s,c])=>`<div class="bar-row"><div><span>${i(s)}</span><b>${c}</b></div><i><span style="width:${Math.max(5,c/a*100)}%"></span></i></div>`).join(""):'<p class="atlas-note">No visible records.</p>'}</article>`,r=()=>{l=B();const e=l.map(a=>a.year).filter(a=>!!a),t=o.value.toLowerCase().includes("dance")&&o.value.toLowerCase().includes("remix");n("result-title").textContent=t?"Belarusian dance works & remixes — pilot results":o.value?`Results for “${o.value}”`:"Pilot corpus",n("stats").innerHTML=[[l.length,"visible records"],[b(l.map(a=>a.language)).length,"language labels"],[e.length?`${Math.min(...e)}–${Math.max(...e)}`:"—","dated span"],[l.filter(a=>a.sourceStatus==="fingerprinted").length,"fingerprinted"]].map(([a,s])=>`<div><strong>${a}</strong><span>${s}</span></div>`).join(""),n("results").innerHTML=l.length?l.map((a,s)=>`
    <button class="record-card" data-id="${i(a.id)}">
      <span class="record-index">${String(s+1).padStart(2,"0")}</span>
      <div><div class="record-tags"><span class="suite-chip ${a.confidence}">${m(a.confidence)}</span><span>${i(f(a.kind))}</span>${a.relationship.toLowerCase().includes("remix")?"<span>remix</span>":""}${a.dance?"<span>dance-oriented</span>":""}</div><h3>${i(a.title)}</h3><p>${i(a.creator)} · ${a.year??"date unknown"} · ${i(a.language)}</p></div>
      <div class="record-source"><span>${i(a.sourceStatus.replaceAll("-"," "))}</span><b>Open dossier →</b></div>
    </button>`).join(""):'<div class="suite-empty suite-panel"><h3>No honest match yet.</h3><p>Remove a filter, import a passport, or annotate a record. The pilot will not invent an answer.</p></div>',n("analytics-grid").innerHTML=[$("Languages",y(l,a=>a.language),Math.max(l.length,1)),$("Record types",y(l,a=>f(a.kind)),Math.max(l.length,1)),$("Evidence confidence",y(l,a=>m(a.confidence)),Math.max(l.length,1))].join("")},C=e=>{n("record-detail").innerHTML=`
    <span class="suite-kicker">Source-visible dossier</span><h2>${i(e.title)}</h2><p class="dialog-lede">${i(e.summary)}</p>
    <div class="dossier-grid"><dl>
      <div><dt>Creator</dt><dd>${i(e.creator)}</dd></div><div><dt>Date / place</dt><dd>${e.year??"Unknown"} · ${i(e.place)}</dd></div>
      <div><dt>Language</dt><dd>${i(e.language)}</dd></div><div><dt>Format</dt><dd>${i(e.format)}</dd></div>
      <div><dt>Relationship</dt><dd>${i(e.relationship)}</dd></div><div><dt>Collection</dt><dd>${i(e.collection)}</dd></div>
    </dl><aside><span class="suite-chip ${e.confidence}">${m(e.confidence)}</span><h3>${i(e.sourceStatus.replaceAll("-"," "))}</h3><p>${i(e.rightsStatus)}</p>${e.evidenceUrl?`<a class="suite-button primary" href="${i(e.evidenceUrl)}" target="_blank" rel="noopener">${i(e.evidenceLabel??"Open evidence")} ↗</a>`:""}</aside></div>
    <div class="dossier-tags">${[...e.genres,...e.themes].map(t=>`<span>${i(t)}</span>`).join("")}</div>
    <form id="annotation-form" class="annotation-form"><span class="suite-kicker">Community-correctable local annotation</span><p>This layer stays in this browser and does not silently rewrite the source record.</p>
      <div class="filter-grid"><label class="atlas-field">Type<select name="kind">${["song","album","dj-set","mix","recording","derivative"].map(t=>`<option value="${t}" ${e.kind===t?"selected":""}>${f(t)}</option>`).join("")}</select></label><label class="atlas-field">Confidence<select name="confidence">${["high","medium","recovery"].map(t=>`<option value="${t}" ${e.confidence===t?"selected":""}>${m(t)}</option>`).join("")}</select></label><label class="atlas-field">Genres<input name="genres" value="${i(e.genres.join(", "))}"></label><label class="atlas-field">Themes<input name="themes" value="${i(e.themes.join(", "))}"></label><label class="atlas-field">BPM<input name="bpm" type="number" min="1" max="300" value="${e.bpm??""}"></label><label class="atlas-check"><input name="dance" type="checkbox" ${e.dance?"checked":""}><span>Dance-oriented</span></label></div><button class="suite-button primary" type="submit">Save local annotation</button><output id="annotation-status"></output></form>`,d.showModal(),n("annotation-form").addEventListener("submit",t=>{t.preventDefault();const a=new FormData(t.currentTarget),s=Number(a.get("bpm"));T(e.id,{kind:a.get("kind"),confidence:a.get("confidence"),genres:String(a.get("genres")??"").split(",").map(c=>c.trim()).filter(Boolean),themes:String(a.get("themes")??"").split(",").map(c=>c.trim()).filter(Boolean),bpm:Number.isFinite(s)&&s>0?s:void 0,dance:a.get("dance")==="on"}),n("annotation-status").textContent="Saved locally. Filters and analytics updated.",r()})};document.addEventListener("click",e=>{const t=e.target.closest("[data-id]");if(!t)return;const a=l.find(s=>s.id===t.dataset.id);a&&C(a)});[o,p,u,v,g,h,k].forEach(e=>e.addEventListener("input",r));document.querySelectorAll("[data-query]").forEach(e=>e.addEventListener("click",()=>{o.value=e.dataset.query??"",h.checked=!1,r(),n("explore").scrollIntoView({behavior:"smooth"})}));n("quick-query").addEventListener("click",()=>{o.value="Belarusian dance remix",h.checked=!1,r(),n("explore").scrollIntoView({behavior:"smooth"})});n("reset").addEventListener("click",()=>{o.value="",p.value="",u.value="",v.value="",g.value="",h.checked=!1,k.checked=!0,r()});n("dialog-close").addEventListener("click",()=>d.close());d.addEventListener("click",e=>{e.target===d&&d.close()});n("passport-import").addEventListener("change",async e=>{const t=e.currentTarget,a=t.files?.[0];if(a){try{const s=M(await a.text());S(),r(),window.alert(`${s} passport record${s===1?"":"s"} imported into this browser.`)}catch{window.alert("That file is not a valid Archive Passport JSON export.")}t.value=""}});const D=()=>l.map(e=>({...e,exportScope:"visible Music Atlas result",exportedAt:new Date().toISOString()}));n("export-json").addEventListener("click",()=>x(JSON.stringify(D(),null,2),"application/json","unmute-belarus-atlas-result.json"));n("export-csv").addEventListener("click",()=>{const e=s=>`"${String(s??"").replaceAll('"','""')}"`,t=["id","title","creator","year","language","kind","relationship","genres","themes","dance","confidence","source_status","evidence_url"],a=l.map(s=>[s.id,s.title,s.creator,s.year,s.language,s.kind,s.relationship,s.genres.join("; "),s.themes.join("; "),s.dance,s.confidence,s.sourceStatus,s.evidenceUrl]);x([t,...a].map(s=>s.map(e).join(",")).join(`
`),"text/csv;charset=utf-8","unmute-belarus-atlas-result.csv")});S();r();
