(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const f of o.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&r(f)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();const k=(e,t,a)=>{for(let r=0;r<a.length;r+=1)e.setUint8(t+r,a.charCodeAt(r))},G=()=>{const i=new ArrayBuffer(352844),o=new DataView(i);k(o,0,"RIFF"),o.setUint32(4,352836,!0),k(o,8,"WAVE"),k(o,12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,44100,!0),o.setUint32(28,44100*2,!0),o.setUint16(32,2,!0),o.setUint16(34,16,!0),k(o,36,"data"),o.setUint32(40,352800,!0);const f=[220,277.18,329.63,440];for(let L=0;L<176400;L+=1){const A=L/44100,ie=f[Math.min(f.length-1,Math.floor(A))],V=A%1,oe=Math.min(1,V*12,(1-V)*10),se=Math.sin(2*Math.PI*ie*A)*.22*oe;o.setInt16(44+L*2,se*32767,!0)}return new File([i],"synthetic-archive-demo.wav",{type:"audio/wav"})},ne=e=>{const t=new Date().toISOString(),a=[{type:"documented",at:t,note:e.status==="source-missing"?"Metadata and a recovery lead were documented; no source file was available to fingerprint.":"Provenance metadata was documented in a local archival passport."}];return e.source&&a.push({type:"fingerprinted",at:t,note:`SHA-256 ${e.source.sha256}`}),{schema:"unmute-archive/2.1",archiveId:crypto.randomUUID(),createdAt:t,updatedAt:t,events:a,...e}},le=(e,t)=>{if(!e.source)throw new Error("A derivative must be linked to a fingerprinted source master.");if(t.source.sha256===e.source.sha256)throw new Error("This file is byte-for-byte identical to the master. Verify it instead of registering a derivative.");if(e.derivatives?.some(i=>i.source.sha256===t.source.sha256))throw new Error("This exact derivative is already registered in the passport.");const a=new Date().toISOString(),r={derivativeId:crypto.randomUUID(),createdAt:a,...t};return{...e,schema:"unmute-archive/2.1",updatedAt:a,derivatives:[...e.derivatives??[],r],events:[...e.events,{type:"derived",at:a,note:`Registered derivative ${r.label}; SHA-256 ${r.source.sha256}`}]}},T=async e=>{const t=await e.arrayBuffer(),a=await crypto.subtle.digest("SHA-256",t);return[...new Uint8Array(a)].map(r=>r.toString(16).padStart(2,"0")).join("")},E=e=>{const t=e.recordedOn?.slice(0,4)||"n.d.",a=e.status==="source-missing"?"Metadata-only recovery record":"Fingerprint-verified local source";return`${e.creator}. (${t}). ${e.title} [${e.language} audio]. ${e.place}: ${e.collection}. ${a}. Archival Passport ${e.archiveId}.`},y=e=>{const t=e.source?.sha256;return t?`${t.slice(0,12)}…${t.slice(-12)}`:"No source file fingerprint"},ce=e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"archive-item",de=(e,t)=>{const a=document.createElement("a");a.href=URL.createObjectURL(e),a.download=t,a.click(),URL.revokeObjectURL(a.href)},pe=e=>{de(new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),`${ce(e.title)}-archival-passport.json`)},M=e=>e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(1)} KB`:`${(e/1048576).toFixed(2)} MB`,F="unmute-the-archive/corpus/v2",P=()=>{try{const e=JSON.parse(localStorage.getItem(F)??"[]");return Array.isArray(e)?e.filter(t=>typeof t=="object"&&t!==null&&"archiveId"in t&&"schema"in t):[]}catch{return[]}},K=e=>{const t=P(),a=[e,...t.filter(r=>r.archiveId!==e.archiveId)];return localStorage.setItem(F,JSON.stringify(a)),a},Q=e=>(e.updatedAt=new Date().toISOString(),K(e)),ue=e=>{const t=P().filter(a=>a.archiveId!==e);return localStorage.setItem(F,JSON.stringify(t)),t},ve=e=>{const t=new Set(e.map(i=>i.language.trim()).filter(Boolean)),a=e.map(i=>Number(i.recordedOn?.slice(0,4))).filter(i=>Number.isFinite(i)&&i>0),r=e.reduce((i,o)=>i+(o.source?.bytes??0),0);return{recordings:e.length,languages:t.size,dateSpan:a.length?`${Math.min(...a)}–${Math.max(...a)}`:"—",totalBytes:r,fingerprinted:e.filter(i=>i.status==="fingerprinted").length,recoveryLeads:e.filter(i=>i.status==="source-missing").length}},he=e=>`"${String(e).replaceAll('"','""')}"`,ge=e=>{const t=["archive_id","title","creator","language","place","recorded_on","status","collection","context","rights_basis","source_filename","sha256","evidence_url","derivative_count","citation"],a=e.map(r=>[r.archiveId,r.title,r.creator,r.language,r.place,r.recordedOn??"",r.status,r.collection,r.context,r.rightsBasis,r.source?.filename??"",r.source?.sha256??"",r.evidenceUrl??"",r.derivatives?.length??0,E(r)]);return[t,...a].map(r=>r.map(he).join(",")).join(`
`)},X=(e,t,a)=>{const r=document.createElement("a");r.href=URL.createObjectURL(new Blob([e],{type:t})),r.download=a,r.click(),URL.revokeObjectURL(r.href)},fe=e=>{X(JSON.stringify(e,null,2),"application/json","unmute-the-archive-corpus.json")},me=e=>{X(ge(e),"text/csv;charset=utf-8","unmute-the-archive-corpus.csv")},ye=[{year:"2016",title:"Belarusian-language single and music video",note:"Creator-owned work with public video and press evidence; original master recovery is pending.",evidence:"https://youtu.be/6jQ43vYcTwE",evidenceLabel:"Watch public evidence"},{year:"2020",title:"Track connected to Belarus's democratic protest movement",note:"Co-authored work preserved through public audio and video evidence; source-file status remains explicit.",evidence:"https://youtu.be/g9d6szYbquo",evidenceLabel:"Watch public evidence"},{year:"2026",title:"Tenth-anniversary vinyl reissue",note:"Belarusian-language works re-enter circulation through a U.S. label and U.K. manufacturing workflow.",evidence:"https://sergey-ulyanov.pro/research/",evidenceLabel:"See research context"}];new URL("./",window.location.href).toString().split("?")[0];const s=e=>e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);document.querySelector("#app").innerHTML=`
  <header class="site-header" id="top">
    <nav class="nav shell" aria-label="Primary navigation">
      <a class="brand" href="#top">
        <span class="brand-mark" aria-hidden="true">U/A</span>
        <span>Unmute the Archive</span>
      </a>
      <div class="nav-links">
        <a href="#guide">Guide</a>
        <a href="#create">Passport</a>
        <a href="#verify">Verify</a>
        <a href="#derivative">Derivative</a>
        <a href="#corpus">Corpus</a>
        <a href="#pilot">Pilot</a>
      </div>
      <a class="system-link" href="/research/system/">Unmute Belarus system ↗</a>
    </nav>
  </header>

  <main>
    <section class="hero shell">
      <div class="hero-copy">
        <p class="eyebrow">Live module · Unmute Belarus research system</p>
        <h1>Prove a recording’s story. Preserve its future.</h1>
        <p class="lede">Create a human-readable archival passport, document edited copies without replacing the master, verify exact files, and export a structured research corpus. The core workflow stays on this device.</p>
        <div class="hero-actions">
          <a class="button primary" href="#create">Start a passport</a>
          <a class="button outline" href="#guide">Read the 3-minute guide</a>
        </div>
        <p class="privacy-note"><span aria-hidden="true">⌾</span> Audio stays on this device unless you explicitly transfer it.</p>
      </div>

      <div class="hero-steps" aria-label="Four-step workflow">
        <p class="eyebrow">Four clear steps</p>
        <ol>
          <li><span>1</span><div><strong>Passport</strong><p>Add a file and describe its origin, context, and rights.</p></div></li>
          <li><span>2</span><div><strong>Derivative <em>optional</em></strong><p>Record an edit or restoration without replacing the master.</p></div></li>
          <li><span>3</span><div><strong>Verify</strong><p>Re-select a file later to prove it matches, byte for byte.</p></div></li>
          <li><span>4</span><div><strong>Export</strong><p>Download JSON for preservation or CSV for analysis.</p></div></li>
        </ol>
      </div>

      <article class="passport-preview" aria-label="Example archival passport">
        <div class="passport-top"><span>Example receipt</span><strong>No. UTA-DEMO</strong></div>
        <p class="passport-kicker">Archival Passport</p>
        <div class="preview-recording">
          <div><small>Recording</small><strong>Safe synthetic demo</strong></div>
          <div class="mini-wave" aria-hidden="true">${Array.from({length:32},(e,t)=>`<i style="--h:${22+t*31%72}%"></i>`).join("")}</div>
        </div>
        <dl>
          <div><dt>Provenance</dt><dd>Browser-generated · rights-clear</dd></div>
          <div><dt>Integrity fingerprint</dt><dd>Calculated from every byte of the file</dd></div>
          <div><dt>Research use</dt><dd>Citation + JSON/CSV corpus record</dd></div>
        </dl>
        <p class="stamp">VERIFIABLE<br />NOT BLOCKCHAIN</p>
      </article>
    </section>

    <section class="value-strip shell" aria-label="What the tool produces">
      <article><span>01</span><div><strong>Readable passport</strong><p>One record for origin, rights, context, file identity, and reuse history.</p></div></article>
      <article><span>02</span><div><strong>Integrity check</strong><p>The same bytes produce the same SHA-256 fingerprint. A changed file does not.</p></div></article>
      <article><span>03</span><div><strong>Research-ready corpus</strong><p>Local records export as JSON for preservation and CSV for analysis.</p></div></article>
    </section>

    <section class="guide-section shell" id="guide">
      <div class="section-heading row-heading">
        <div><p class="eyebrow">How to use Archive Passport</p><h2>Test it safely in three minutes. Then document a real recording.</h2></div>
        <p>No account is required. The app stores passport metadata and fingerprints in this browser; it does not store the audio itself. Exporting JSON is what creates a portable backup.</p>
      </div>
      <div class="guide-grid">
        <article class="guide-card demo-path">
          <div class="guide-card-head"><span>Recommended first visit</span><b>Safe demo path</b></div>
          <ol>
            <li><span>1</span><p>Go to <a href="#create">Create a passport</a> and choose <strong>Load safe demo</strong>.</p></li>
            <li><span>2</span><p>Select <strong>Create archival passport</strong>. The synthetic clip is fingerprinted locally.</p></li>
            <li><span>3</span><p>Go to <a href="#verify">Verify</a>, choose <strong>Use the safe synthetic demo file</strong>, then compare.</p></li>
            <li><span>4</span><p>Confirm the exact match, then delete the demo record or export it to inspect the format.</p></li>
          </ol>
          <a class="button primary" href="#create">Run the safe demo ↓</a>
        </article>
        <article class="guide-card real-path">
          <div class="guide-card-head"><span>For archival work</span><b>Real recording path</b></div>
          <ol>
            <li><span>1</span><p>Choose a rights-clear audio file—or mark the source missing and document only a recovery lead.</p></li>
            <li><span>2</span><p>Describe provenance, context, and permission. Use <strong>Unknown</strong> instead of guessing.</p></li>
            <li><span>3</span><p>If you create a restoration or edit, register it as a separate <a href="#derivative">documented derivative</a>.</p></li>
            <li><span>4</span><p>Export the passport JSON and corpus. Keep copies in at least two trusted locations.</p></li>
          </ol>
          <p class="guide-warning"><strong>Important:</strong> a fingerprint proves exact file identity—not authorship, ownership, or historical truth.</p>
        </article>
      </div>
    </section>

    <section class="tool-section shell" id="create">
      <div class="section-heading">
        <p class="eyebrow">01 · Create a passport</p>
        <h2>Document what is known. Never invent what is missing.</h2>
        <p>A source file creates a fingerprinted passport. If the master is lost, create a recovery record with public evidence instead—without pretending the audio was verified.</p>
      </div>

      <div class="create-grid">
        <form class="archive-form panel" id="passport-form">
          <fieldset class="mode-picker">
            <legend>What do you have?</legend>
            <label><input type="radio" name="source-mode" value="present" checked /><span><strong>I have the audio file</strong><small>Create an integrity fingerprint.</small></span></label>
            <label><input type="radio" name="source-mode" value="missing" /><span><strong>The source is missing</strong><small>Document a recovery lead.</small></span></label>
          </fieldset>

          <div class="field-grid">
            <label>Title<input id="title" required placeholder="Recording title" /></label>
            <label>Creator / contributor <span class="optional">use “Unknown” if not established</span><input id="creator" required placeholder="Person or community" /></label>
            <label>Language <span class="optional">do not guess</span><input id="language" required placeholder="Belarusian" /></label>
            <label>Place <span class="optional">do not guess</span><input id="place" required placeholder="Minsk / Los Angeles" /></label>
            <label>Date recorded or released<input id="recorded-on" type="date" /></label>
            <label>Collection<input id="collection" required value="Belarusian Music in Exile — Pilot Corpus" /></label>
          </div>

          <label>Why this recording matters<textarea id="context" required rows="4" placeholder="Cultural context, circumstances, people, and what a future researcher should know."></textarea></label>
          <label>Rights / consent basis<textarea id="rights" required rows="3" placeholder="I created this recording and control the source file, or I have explicit permission…"></textarea></label>
          <label>Public evidence or recovery lead <span class="optional">optional</span><input id="evidence-url" type="url" placeholder="https://…" /></label>

          <div id="source-file-fields">
            <label class="dropzone" for="audio-file">
              <input id="audio-file" type="file" accept="audio/*" />
              <span class="drop-icon" aria-hidden="true">↗</span>
              <strong id="file-label">Choose an audio file</strong>
              <small id="file-meta">WAV, MP3, M4A, FLAC, or another audio format</small>
            </label>
            <audio id="audio-preview" controls hidden></audio>
            <label class="check-row"><input id="rights-check" type="checkbox" /><span>I control this file or have explicit permission to preserve it.</span></label>
          </div>

          <div class="form-actions">
            <button class="button primary" id="create-button" type="submit">Create archival passport</button>
            <button class="button quiet" id="load-demo" type="button">Load safe demo</button>
          </div>
          <p class="form-message" id="form-message" role="status"></p>
        </form>

        <aside class="receipt-panel panel" id="live-receipt" aria-live="polite">
          <div class="empty-receipt">
            <p class="eyebrow">Your result</p>
            <h3>A passport appears here.</h3>
            <p>It will be useful without Audiotool: saved locally, independently verifiable, citable, and exportable.</p>
          </div>
        </aside>
      </div>

    </section>

    <section class="tool-section derivative-section" id="derivative">
      <div class="shell derivative-grid">
        <div class="section-heading compact">
          <p class="eyebrow">02 · Optional · Document a derivative</p>
          <h2>Preserve the master. Register every intervention.</h2>
          <p>This tool does not restore audio automatically. It links an edited or restored copy to an untouched fingerprinted master and records what changed, why, and who reviewed it.</p>
          <ul class="derivative-rules">
            <li><strong>Master stays untouched.</strong><span>The derivative receives its own fingerprint.</span></li>
            <li><strong>Methods stay visible.</strong><span>Noise removal, EQ, repair, separation, or AI processing must be named.</span></li>
            <li><strong>Listening judgment stays human.</strong><span>A cleaner waveform is not automatically a more authentic record.</span></li>
          </ul>
        </div>
        <form class="derivative-form panel" id="derivative-form">
          <label>Source master passport<select id="derivative-passport" required><option value="">No fingerprinted passports yet</option></select></label>
          <label class="dropzone" for="derivative-file">
            <input id="derivative-file" type="file" accept="audio/*" />
            <span class="drop-icon" aria-hidden="true">↗</span>
            <strong id="derivative-file-label">Choose the derived audio file</strong>
            <small>The original master is never replaced.</small>
          </label>
          <div class="field-grid">
            <label>Derivative label<input id="derivative-label" required placeholder="Restoration test A" /></label>
            <label>Purpose<input id="derivative-purpose" required placeholder="Listening access / research comparison" /></label>
          </div>
          <label>Method and tools<textarea id="derivative-method" required rows="3" placeholder="Software, model, version, and settings if known."></textarea></label>
          <label>Intervention log<textarea id="derivative-changes" required rows="3" placeholder="What was removed, repaired, separated, equalized, or otherwise changed?"></textarea></label>
          <label>Human review note <span class="optional">optional</span><textarea id="derivative-review" rows="2" placeholder="What was preserved, and what artifacts or uncertainty remain?"></textarea></label>
          <label class="check-row"><input id="derivative-master-check" type="checkbox" required /><span>I confirm that this file is a derivative and does not replace the preserved master.</span></label>
          <button class="button primary full" id="derivative-button" type="submit">Register documented derivative</button>
          <p class="form-message" id="derivative-message" role="status"></p>
        </form>
      </div>
    </section>

    <section class="tool-section inverse" id="verify">
      <div class="shell verify-grid">
        <div class="section-heading compact">
          <p class="eyebrow">03 · Verify a recording</p>
          <h2>Is this exactly the file in the passport?</h2>
          <p>A fingerprint is not a token and does not establish authorship. It is a repeatable identity check: every byte must match the earlier receipt.</p>
        </div>
        <div class="verify-card panel-dark">
          <label>Choose a passport from this device<select id="verify-passport"><option value="">No fingerprinted passports yet</option></select></label>
          <div class="or-divider"><span>or</span></div>
          <label class="compact-upload" for="receipt-file"><input id="receipt-file" type="file" accept="application/json,.json" /><span>Import a portable passport JSON</span></label>
          <button class="text-button demo-verify" id="verify-demo" type="button">Use the safe synthetic demo file</button>
          <p class="target-note" id="verify-target">No passport selected.</p>
          <label class="dropzone dark-drop" for="verify-file">
            <input id="verify-file" type="file" accept="audio/*" />
            <span class="drop-icon" aria-hidden="true">⌾</span>
            <strong id="verify-file-label">Choose the audio file to check</strong>
            <small>Nothing uploads. Comparison happens on this device.</small>
          </label>
          <button class="button primary full" id="verify-button" type="button" disabled>Compare every byte</button>
          <div class="verify-result" id="verify-result" hidden></div>
        </div>
      </div>
    </section>

    <section class="tool-section shell" id="corpus">
      <div class="section-heading row-heading">
        <div>
          <p class="eyebrow">04 · Your local corpus</p>
          <h2>Structured evidence, not a folder of mystery files.</h2>
        </div>
        <div class="export-actions">
          <button class="button quiet" id="export-json" type="button">Export JSON</button>
          <button class="button quiet" id="export-csv" type="button">Export CSV</button>
        </div>
      </div>
      <div class="stats-grid" id="corpus-stats"></div>
      <div class="corpus-list panel" id="corpus-list"></div>
    </section>

    <section class="optional-transfer tool-section shell" id="audiotool-transfer">
      <div class="audiotool-panel panel">
        <div>
          <p class="eyebrow">Optional creative handoff · outside the core archive workflow</p>
          <h3>Place a fingerprinted source in an Audiotool session.</h3>
          <p id="auth-copy">The archival passport works independently. Audiotool transfer is only an additional traceable reuse event.</p>
        </div>
        <div class="transfer-controls">
          <button class="button outline" id="auth-button" type="button">Connect Audiotool</button>
          <select id="project" disabled aria-label="Audiotool project"><option value="">Choose a destination project</option></select>
          <button class="button secondary" id="transfer-button" type="button" disabled>Insert unlisted sample</button>
        </div>
      </div>
    </section>

    <section class="pilot-section" id="pilot">
      <div class="shell pilot-grid">
        <div class="pilot-intro">
          <p class="eyebrow">First-party pilot corpus</p>
          <h2>Belarusian Music in Exile</h2>
          <p>Sergéy Ulyanov’s own Belarusian-language works form the bounded starting collection. Authorship, rights, and cultural context are known. Public evidence is recorded as a recovery lead; only an available source file receives a fingerprint.</p>
          <div class="pilot-badges"><span>Creator-known</span><span>Rights-known</span><span>Source status explicit</span></div>
        </div>
        <div class="pilot-timeline">
          ${ye.map(e=>`
            <article>
              <span>${e.year}</span>
              <div><h3>${e.title}</h3><p>${e.note}</p><a href="${e.evidence}" target="_blank" rel="noreferrer">${e.evidenceLabel} ↗</a></div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="limitations shell" id="limitations">
      <div><p class="eyebrow">Honest limitations</p><h2>What this tool proves—and what it does not.</h2></div>
      <ul>
        <li><strong>It proves file identity.</strong><span>A matching fingerprint shows that two files contain the same bytes.</span></li>
        <li><strong>It documents derivatives.</strong><span>A registered restoration stays linked to the untouched master with a separate fingerprint and intervention log.</span></li>
        <li><strong>It does not prove authorship.</strong><span>Rights, dates, people, and context still require evidence and human judgment.</span></li>
        <li><strong>It does not yet identify the same recording across formats.</strong><span>Perceptual fingerprinting and work/recording/release relationships belong to the planned Music Atlas layer.</span></li>
        <li><strong>Local storage is not a backup.</strong><span>Export the corpus and keep copies in more than one trusted place.</span></li>
        <li><strong>Missing sources stay marked missing.</strong><span>A public link can guide recovery, but it cannot replace a fingerprinted master.</span></li>
      </ul>
    </section>
  </main>

  <footer class="footer shell">
    <p>Designed and built by Sergéy Ulyanov · <a href="/research/system/">Unmute Belarus research system</a></p>
    <p>Live research prototype · local-first · no blockchain claims</p>
  </footer>
`;const R=document.querySelector("#passport-form"),j=[...document.querySelectorAll('input[name="source-mode"]')],N=document.querySelector("#audio-file"),be=document.querySelector("#file-label"),we=document.querySelector("#file-meta"),I=document.querySelector("#audio-preview"),Z=document.querySelector("#rights-check"),Se=document.querySelector("#source-file-fields"),S=document.querySelector("#form-message"),q=document.querySelector("#create-button"),J=document.querySelector("#live-receipt"),z=document.querySelector("#auth-button"),xe=document.querySelector("#auth-copy"),ee=document.querySelector("#project"),B=document.querySelector("#transfer-button"),x=document.querySelector("#verify-passport"),W=document.querySelector("#receipt-file"),_=document.querySelector("#verify-file"),te=document.querySelector("#verify-file-label"),C=document.querySelector("#verify-target"),p=document.querySelector("#verify-button"),h=document.querySelector("#verify-result"),Y=document.querySelector("#derivative-form"),O=document.querySelector("#derivative-passport"),U=document.querySelector("#derivative-file"),Ce=document.querySelector("#derivative-file-label"),b=document.querySelector("#derivative-button"),w=document.querySelector("#derivative-message");let v=null,d=null,n=null,u=null,m=null,l=P(),$e=null;const re=()=>j.find(e=>e.checked)?.value==="missing"?"missing":"present",c=e=>document.querySelector(e),g=e=>document.querySelector(e),D=e=>{const t=e.source?`${s(e.source.filename)} · ${M(e.source.bytes)}`:"Original source missing · recovery record only",a=e.status==="fingerprinted"?"Fingerprint created":"Recovery lead",r=(e.derivatives??[]).map(i=>`
    <li>
      <details>
        <summary><strong>${s(i.label)}</strong><span>${s(i.purpose)} · ${s(i.source.filename)}</span></summary>
        <dl>
          <div><dt>Method</dt><dd>${s(i.method)}</dd></div>
          <div><dt>Intervention log</dt><dd>${s(i.changeLog)}</dd></div>
          ${i.reviewerNote?`<div><dt>Human review</dt><dd>${s(i.reviewerNote)}</dd></div>`:""}
          <div><dt>Derivative fingerprint</dt><dd class="mono">${s(`${i.source.sha256.slice(0,12)}…${i.source.sha256.slice(-12)}`)}</dd></div>
        </dl>
      </details>
    </li>
  `).join("");J.innerHTML=`
    <div class="receipt-head"><span>Archival Passport</span><strong>${a}</strong></div>
    <h3>${s(e.title)}</h3>
    <p class="receipt-id">No. ${s(e.archiveId)}</p>
    <dl class="receipt-data">
      <div><dt>Creator</dt><dd>${s(e.creator)}</dd></div>
      <div><dt>Language / place</dt><dd>${s(e.language)} · ${s(e.place)}</dd></div>
      <div><dt>Recorded / released</dt><dd>${s(e.recordedOn||"Not yet established")}</dd></div>
      <div><dt>Source</dt><dd>${t}</dd></div>
      <div class="full-row"><dt>Integrity fingerprint</dt><dd class="mono">${s(y(e))}</dd></div>
    </dl>
    <div class="citation-box"><span>Research citation</span><p>${s(E(e))}</p></div>
    ${r?`<div class="derivative-receipts"><span>Documented derivatives</span><ul>${r}</ul></div>`:""}
    <div class="receipt-actions">
      <button class="button quiet" id="download-passport" type="button">Download JSON</button>
      <button class="button quiet" id="copy-citation" type="button">Copy citation</button>
    </div>
    <button class="text-button delete-local" id="delete-passport" type="button">Delete this local record</button>
    <p class="receipt-foot">Saved only in this browser. Export it to create a real backup.</p>
  `,document.querySelector("#download-passport").addEventListener("click",()=>pe(e)),document.querySelector("#copy-citation").addEventListener("click",async i=>{await navigator.clipboard.writeText(E(e)),i.currentTarget.textContent="Citation copied"}),document.querySelector("#delete-passport").addEventListener("click",()=>{window.confirm(`Delete “${e.title}” from this browser? Export the JSON first if you need a backup.`)&&(l=ue(e.archiveId),m=null,J.innerHTML=`
      <div class="empty-receipt">
        <p class="eyebrow">Local record deleted</p>
        <h3>The passport was removed from this browser.</h3>
        <p>The audio file was never stored here. You can create or import another passport at any time.</p>
      </div>
    `,$())})},$=()=>{const e=ve(l);document.querySelector("#corpus-stats").innerHTML=`
    <article><strong>${e.recordings}</strong><span>local records</span></article>
    <article><strong>${e.fingerprinted}</strong><span>fingerprinted sources</span></article>
    <article><strong>${e.recoveryLeads}</strong><span>recovery leads</span></article>
    <article><strong>${e.languages}</strong><span>languages</span></article>
    <article><strong>${e.dateSpan}</strong><span>date span</span></article>
  `;const t=document.querySelector("#corpus-list");t.innerHTML=l.length?`<div class="corpus-table" role="table">
        <div class="corpus-row corpus-header" role="row"><span>Recording</span><span>Language</span><span>Source status</span><span>Passport</span></div>
        ${l.map(r=>`
          <div class="corpus-row" role="row">
            <span><strong>${s(r.title)}</strong><small>${s(r.creator)} · ${s(r.recordedOn||"date unknown")}${r.derivatives?.length?` · ${r.derivatives.length} derivative${r.derivatives.length===1?"":"s"}`:""}</small></span>
            <span>${s(r.language)}</span>
            <span class="status-chip ${r.status}">${r.status==="fingerprinted"?"Fingerprint recorded":"Recovery lead"}</span>
            <span><button class="text-button view-passport" data-id="${s(r.archiveId)}" type="button">View receipt</button></span>
          </div>
        `).join("")}
      </div>`:'<div class="empty-corpus"><strong>No local passports yet.</strong><p>Load the safe demo above to create and verify the first real record—without uploading anything.</p><a href="#create">Create the first passport →</a></div>',t.querySelectorAll(".view-passport").forEach(r=>{r.addEventListener("click",()=>{const i=l.find(o=>o.archiveId===r.dataset.id);i&&(m=i,D(i),document.querySelector("#create")?.scrollIntoView({behavior:"smooth"}))})});const a=l.filter(r=>r.source);x.innerHTML=a.length?`<option value="">Choose a local passport</option>${a.map(r=>`<option value="${s(r.archiveId)}">${s(r.title)} — ${s(y(r))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',O.innerHTML=a.length?`<option value="">Choose a fingerprinted source master</option>${a.map(r=>`<option value="${s(r.archiveId)}">${s(r.title)} — ${s(y(r))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>'},ae=e=>{v=e,be.textContent=e.name,we.textContent=`${M(e.size)} · ${e.type||"audio"}`,I.src&&URL.revokeObjectURL(I.src),I.src=URL.createObjectURL(e),I.hidden=!1},H=()=>{const e=re()==="present";Se.hidden=!e,Z.required=e,S.textContent=e?"A source file will be fingerprinted locally before the passport is saved.":"This will be clearly marked as a metadata-only recovery record. No fingerprint will be invented."};j.forEach(e=>e.addEventListener("change",H));N.addEventListener("change",()=>{const e=N.files?.[0];e&&ae(e)});document.querySelector("#load-demo").addEventListener("click",()=>{j[0].checked=!0,H(),ae(G()),c("#title").value="Safe synthetic archive demo",c("#creator").value="Unmute the Archive",c("#language").value="Instrumental",c("#place").value="Generated locally in the browser",c("#recorded-on").value=new Date().toISOString().slice(0,10),g("#context").value="A four-second rights-clear synthetic clip that demonstrates passport creation, fingerprinting, corpus storage, export, and later verification.",g("#rights").value="Generated locally by this application. No third-party recording or performance is included.",Z.checked=!0,R.scrollIntoView({behavior:"smooth",block:"start"})});R.addEventListener("submit",async e=>{e.preventDefault();const t=re();if(R.reportValidity()){if(t==="present"&&!v){S.textContent="Choose an audio file before creating a fingerprinted passport.",N.focus();return}q.disabled=!0,q.textContent=t==="present"?"Fingerprinting every byte…":"Documenting recovery record…",S.textContent="Building the archival passport locally…";try{const a=v&&t==="present"?{filename:v.name,mediaType:v.type||"application/octet-stream",bytes:v.size,sha256:await T(v)}:void 0;m=ne({status:a?"fingerprinted":"source-missing",collection:c("#collection").value.trim(),title:c("#title").value.trim(),creator:c("#creator").value.trim(),language:c("#language").value.trim(),place:c("#place").value.trim(),recordedOn:c("#recorded-on").value||void 0,context:g("#context").value.trim(),rightsBasis:g("#rights").value.trim(),evidenceUrl:c("#evidence-url").value.trim()||void 0,source:a}),l=K(m),D(m),$(),S.textContent=a?"Passport saved. You can now verify this file, export the record, or optionally transfer it to Audiotool.":"Recovery record saved. It remains explicitly unverified until a source file is recovered.",B.disabled=!($e&&a&&ee.value)}catch(a){S.textContent=a instanceof Error?a.message:"The passport could not be created."}finally{q.disabled=!1,q.textContent="Create archival passport"}}});U.addEventListener("change",()=>{u=U.files?.[0]??null,Ce.textContent=u?`${u.name} · ${M(u.size)}`:"Choose the derived audio file"});Y.addEventListener("submit",async e=>{if(e.preventDefault(),!Y.reportValidity())return;const t=l.find(a=>a.archiveId===O.value);if(!t?.source){w.textContent="Choose a fingerprinted source master.",O.focus();return}if(!u){w.textContent="Choose the derived audio file.",U.focus();return}b.disabled=!0,b.textContent="Fingerprinting derivative…",w.textContent="Linking the derivative to its preserved master locally…";try{const a=le(t,{label:c("#derivative-label").value.trim(),purpose:c("#derivative-purpose").value.trim(),method:g("#derivative-method").value.trim(),changeLog:g("#derivative-changes").value.trim(),reviewerNote:g("#derivative-review").value.trim()||void 0,source:{filename:u.name,mediaType:u.type||"application/octet-stream",bytes:u.size,sha256:await T(u)}});l=Q(a),m=a,D(a),$(),w.textContent="Derivative registered. Export the updated passport JSON to preserve the intervention record.",b.textContent="Derivative registered"}catch(a){w.textContent=a instanceof Error?a.message:"The derivative could not be registered.",b.textContent="Register documented derivative"}finally{b.disabled=!1}});x.addEventListener("change",()=>{n=l.find(e=>e.archiveId===x.value)??null,C.textContent=n?`Comparing against “${n.title}” · ${y(n)}`:"No passport selected.",p.disabled=!(n?.source&&d),h.hidden=!0});W.addEventListener("change",async()=>{const e=W.files?.[0];if(e)try{const t=JSON.parse(await e.text());if(!["unmute-archive/2.0","unmute-archive/2.1"].includes(t.schema)||!t.source?.sha256)throw new Error("This receipt has no compatible fingerprint.");n=t,x.value="",C.textContent=`Imported “${t.title}” · ${y(t)}`,p.disabled=!d,h.hidden=!0}catch(t){C.textContent=t instanceof Error?t.message:"Receipt could not be read."}});_.addEventListener("change",()=>{d=_.files?.[0]??null,te.textContent=d?d.name:"Choose the audio file to check",p.disabled=!(n?.source&&d),h.hidden=!0});document.querySelector("#verify-demo").addEventListener("click",()=>{d=G(),te.textContent=d.name;const e=l.find(t=>t.title==="Safe synthetic archive demo"&&t.source);e?(n=e,x.value=e.archiveId,C.textContent=`Comparing against “${e.title}” · ${y(e)}`):C.textContent="Create the safe demo passport in Step 01 first; then this file can prove the match.",p.disabled=!(n?.source&&d),h.hidden=!0});p.addEventListener("click",async()=>{if(!n?.source||!d)return;p.disabled=!0,p.textContent="Comparing every byte…";const e=await T(d),t=e===n.source.sha256;h.hidden=!1,h.className=`verify-result ${t?"match":"mismatch"}`,h.innerHTML=t?`<strong>Exact match.</strong><p>This file is byte-for-byte identical to the source in the passport.</p><code>${s(e)}</code>`:`<strong>Not the same file.</strong><p>The bytes differ. This may be an edit, re-export, transcoding, or another recording.</p><code>Expected ${s(n.source.sha256)}<br />Found ${s(e)}</code>`,t&&l.some(a=>a.archiveId===n.archiveId)&&(n.events.push({type:"verified",at:new Date().toISOString(),note:`Matched ${d.name}`}),l=Q(n),$()),p.disabled=!1,p.textContent="Compare every byte"});document.querySelector("#export-json").addEventListener("click",()=>fe(l));document.querySelector("#export-csv").addEventListener("click",()=>me(l));const Le=async()=>{{xe.textContent="Audiotool developer registration is not connected in this build. Passport, verification, and corpus features are fully functional.",z.textContent="Integration pending",z.disabled=!0;return}};ee.addEventListener("change",()=>{B.disabled=!0});B.addEventListener("click",async()=>{});H();$();Le();
