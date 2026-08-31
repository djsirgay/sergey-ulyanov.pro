(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const h of a.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&o(h)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();const E=(e,t,r)=>{for(let o=0;o<r.length;o+=1)e.setUint8(t+o,r.charCodeAt(o))},oe=()=>{const i=new ArrayBuffer(352844),a=new DataView(i);E(a,0,"RIFF"),a.setUint32(4,352836,!0),E(a,8,"WAVE"),E(a,12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,1,!0),a.setUint32(24,44100,!0),a.setUint32(28,44100*2,!0),a.setUint16(32,2,!0),a.setUint16(34,16,!0),E(a,36,"data"),a.setUint32(40,352800,!0);const h=[220,277.18,329.63,440];for(let A=0;A<176400;A+=1){const M=A/44100,ue=h[Math.min(h.length-1,Math.floor(M))],Q=M%1,ve=Math.min(1,Q*12,(1-Q)*10),he=Math.sin(2*Math.PI*ue*M)*.22*ve;a.setInt16(44+A*2,he*32767,!0)}return new File([i],"synthetic-archive-demo.wav",{type:"audio/wav"})},ge=e=>{const t=new Date().toISOString(),r=[{type:"documented",at:t,note:e.status==="source-missing"?"Metadata and a recovery lead were documented; no source file was available to fingerprint.":"Provenance metadata was documented in a local archival passport."}];return e.source&&r.push({type:"fingerprinted",at:t,note:`SHA-256 ${e.source.sha256}`}),{schema:"unmute-archive/2.1",archiveId:crypto.randomUUID(),createdAt:t,updatedAt:t,events:r,...e}},fe=(e,t)=>{if(!e.source)throw new Error("A derivative must be linked to a fingerprinted source master.");if(t.source.sha256===e.source.sha256)throw new Error("This file is byte-for-byte identical to the master. Verify it instead of registering a derivative.");if(e.derivatives?.some(i=>i.source.sha256===t.source.sha256))throw new Error("This exact derivative is already registered in the passport.");const r=new Date().toISOString(),o={derivativeId:crypto.randomUUID(),createdAt:r,...t};return{...e,schema:"unmute-archive/2.1",updatedAt:r,derivatives:[...e.derivatives??[],o],events:[...e.events,{type:"derived",at:r,note:`Registered derivative ${o.label}; SHA-256 ${o.source.sha256}`}]}},j=async e=>{const t=await e.arrayBuffer(),r=await crypto.subtle.digest("SHA-256",t);return[...new Uint8Array(r)].map(o=>o.toString(16).padStart(2,"0")).join("")},P=e=>{const t=e.recordedOn?.slice(0,4)||"n.d.",r=e.status==="source-missing"?"Metadata-only recovery record":"Fingerprint-verified local source";return`${e.creator}. (${t}). ${e.title} [${e.language} audio]. ${e.place}: ${e.collection}. ${r}. Archival Passport ${e.archiveId}.`},b=e=>{const t=e.source?.sha256;return t?`${t.slice(0,12)}…${t.slice(-12)}`:"No source file fingerprint"},me=e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"archive-item",ye=(e,t)=>{const r=document.createElement("a");r.href=URL.createObjectURL(e),r.download=t,r.click(),URL.revokeObjectURL(r.href)},be=e=>{ye(new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),`${me(e.title)}-archival-passport.json`)},V=e=>e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(1)} KB`:`${(e/1048576).toFixed(2)} MB`,z="unmute-the-archive/corpus/v2",H=()=>{try{const e=JSON.parse(localStorage.getItem(z)??"[]");return Array.isArray(e)?e.filter(t=>typeof t=="object"&&t!==null&&"archiveId"in t&&"schema"in t):[]}catch{return[]}},ie=e=>{const t=H(),r=[e,...t.filter(o=>o.archiveId!==e.archiveId)];return localStorage.setItem(z,JSON.stringify(r)),r},ae=e=>(e.updatedAt=new Date().toISOString(),ie(e)),we=e=>{const t=H().filter(r=>r.archiveId!==e);return localStorage.setItem(z,JSON.stringify(t)),t},Se=e=>{const t=new Set(e.map(i=>i.language.trim()).filter(Boolean)),r=e.map(i=>Number(i.recordedOn?.slice(0,4))).filter(i=>Number.isFinite(i)&&i>0),o=e.reduce((i,a)=>i+(a.source?.bytes??0),0);return{recordings:e.length,languages:t.size,dateSpan:r.length?`${Math.min(...r)}–${Math.max(...r)}`:"—",totalBytes:o,fingerprinted:e.filter(i=>i.status==="fingerprinted").length,recoveryLeads:e.filter(i=>i.status==="source-missing").length}},xe=e=>`"${String(e).replaceAll('"','""')}"`,Ce=e=>{const t=["archive_id","title","creator","language","place","recorded_on","status","collection","context","rights_basis","source_filename","sha256","evidence_url","derivative_count","citation"],r=e.map(o=>[o.archiveId,o.title,o.creator,o.language,o.place,o.recordedOn??"",o.status,o.collection,o.context,o.rightsBasis,o.source?.filename??"",o.source?.sha256??"",o.evidenceUrl??"",o.derivatives?.length??0,P(o)]);return[t,...r].map(o=>o.map(xe).join(",")).join(`
`)},se=(e,t,r)=>{const o=document.createElement("a");o.href=URL.createObjectURL(new Blob([e],{type:t})),o.download=r,o.click(),URL.revokeObjectURL(o.href)},$e=e=>{se(JSON.stringify(e,null,2),"application/json","unmute-the-archive-corpus.json")},Le=e=>{se(Ce(e),"text/csv;charset=utf-8","unmute-the-archive-corpus.csv")},ke=[{year:"2016",title:"Belarusian-language single and music video",note:"Creator-owned work with public video and press evidence; original master recovery is pending.",evidence:"https://youtu.be/6jQ43vYcTwE",evidenceLabel:"Watch public evidence"},{year:"2020",title:"Track connected to Belarus's democratic protest movement",note:"Co-authored work preserved through public audio and video evidence; source-file status remains explicit.",evidence:"https://youtu.be/g9d6szYbquo",evidenceLabel:"Watch public evidence"},{year:"2026",title:"Tenth-anniversary vinyl reissue",note:"Belarusian-language works re-enter circulation through a U.S. label and U.K. manufacturing workflow.",evidence:"https://sergey-ulyanov.pro/research/",evidenceLabel:"See research context"}];new URL("./",window.location.href).toString().split("?")[0];const s=e=>e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);document.querySelector("#app").innerHTML=`
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

  <nav class="module-rail" aria-label="Unmute Belarus module navigation">
    <div class="shell">
      <a href="/research/">Research home</a>
      <a href="/research/system/">System map</a>
      <a class="current" href="#top"><b>01</b> Archive Passport <small>live</small></a>
      <a href="/research/system/#atlas"><b>02</b> Music Atlas <small>next</small></a>
      <a href="/research/system/#restoration"><b>03</b> Restoration Lab <small>next</small></a>
      <a href="#corpus">Data &amp; exports</a>
    </div>
  </nav>

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
        <form class="archive-form panel" id="passport-form" novalidate>
          <fieldset class="mode-picker">
            <legend>What do you have?</legend>
            <label><input type="radio" name="source-mode" value="present" checked /><span><strong>I have the audio file</strong><small>Create an integrity fingerprint.</small></span></label>
            <label><input type="radio" name="source-mode" value="missing" /><span><strong>The source is missing</strong><small>Document a recovery lead.</small></span></label>
          </fieldset>

          <div class="field-grid">
            <label class="field-control">Title<input id="title" required placeholder="Recording title" /></label>
            <label class="field-control">Creator / contributor <span class="optional">use “Unknown” if not established</span><input id="creator" required placeholder="Person or community" /></label>
            <div class="field-control">
              <label for="language">Language <span class="optional">choose “Unknown” instead of guessing</span></label>
              <select id="language" required>
                <option value="">Choose a language</option>
                <option>Belarusian</option>
                <option>Russian</option>
                <option>English</option>
                <option>Ukrainian</option>
                <option>Polish</option>
                <option>Multilingual</option>
                <option>Instrumental / no linguistic content</option>
                <option>Unknown / not established</option>
                <option value="other">Other / not listed</option>
              </select>
              <input id="language-other" class="conditional-input" hidden placeholder="Enter the language" aria-label="Other language" />
            </div>
            <label class="field-control">Place <span class="optional">type or choose a common location</span><input id="place" required list="place-options" placeholder="Choose or enter a place" /></label>
            <datalist id="place-options">
              <option value="Minsk, Belarus"></option>
              <option value="Los Angeles, United States"></option>
              <option value="New York, United States"></option>
              <option value="Warsaw, Poland"></option>
              <option value="Vilnius, Lithuania"></option>
              <option value="Berlin, Germany"></option>
              <option value="Unknown / not established"></option>
            </datalist>
            <label>Date recorded or released<input id="recorded-on" type="date" /></label>
            <div class="field-control">
              <label for="collection">Collection</label>
              <select id="collection" required>
                <option>Belarusian Music in Exile — Pilot Corpus</option>
                <option>Nostalgai Recordz archive</option>
                <option>Personal archive</option>
                <option>Community-contributed archive</option>
                <option>Unassigned research record</option>
                <option value="other">Other / not listed</option>
              </select>
              <input id="collection-other" class="conditional-input" hidden placeholder="Enter the collection name" aria-label="Other collection" />
            </div>
          </div>

          <label>Why this recording matters<textarea id="context" required rows="4" placeholder="Cultural context, circumstances, people, and what a future researcher should know."></textarea></label>
          <div class="field-control rights-field">
            <label for="rights-basis">Rights / consent basis</label>
            <select id="rights-basis" required>
              <option value="">Choose the closest verified basis</option>
              <option>I created or performed this recording and control this source file.</option>
              <option>I have explicit permission from the rights holder to preserve this source file.</option>
              <option>This recording is in the public domain.</option>
              <option>This is a recovery lead; rights have not yet been established.</option>
              <option value="other">Other / requires explanation</option>
            </select>
            <textarea id="rights" rows="3" placeholder="Optional details: who gave permission, scope, date, or what still needs review."></textarea>
          </div>
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
            <button class="button primary" id="create-button" type="submit">Create passport → see result</button>
            <button class="button quiet" id="load-demo" type="button">Load safe demo</button>
          </div>
          <p class="next-step-note">No additional step: after creation, the finished passport appears in the result panel on the right (or directly below on mobile).</p>
          <div class="form-message" id="form-message" role="alert" aria-live="assertive"></div>
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
          ${ke.map(e=>`
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

  <nav class="module-sequence shell" aria-label="Previous and next research modules">
    <a href="/research/system/"><small>← Back</small><strong>Unmute Belarus system map</strong></a>
    <a href="/research/system/#atlas"><small>Next module →</small><strong>02 · Music Atlas</strong></a>
  </nav>

  <footer class="footer shell">
    <p>Designed and built by Sergéy Ulyanov · <a href="/research/system/">Unmute Belarus research system</a></p>
    <p>Live research prototype · local-first · no blockchain claims</p>
  </footer>
`;const $=document.querySelector("#passport-form"),J=[...document.querySelectorAll('input[name="source-mode"]')],B=document.querySelector("#audio-file"),qe=document.querySelector("#file-label"),Ie=document.querySelector("#file-meta"),O=document.querySelector("#audio-preview"),R=document.querySelector("#rights-check"),Ae=document.querySelector("#source-file-fields"),m=document.querySelector("#form-message"),U=document.querySelector("#create-button"),C=document.querySelector("#live-receipt"),X=document.querySelector("#auth-button"),Ee=document.querySelector("#auth-copy"),ne=document.querySelector("#project"),W=document.querySelector("#transfer-button"),L=document.querySelector("#verify-passport"),Z=document.querySelector("#receipt-file"),ee=document.querySelector("#verify-file"),le=document.querySelector("#verify-file-label"),k=document.querySelector("#verify-target"),u=document.querySelector("#verify-button"),f=document.querySelector("#verify-result"),te=document.querySelector("#derivative-form"),F=document.querySelector("#derivative-passport"),D=document.querySelector("#derivative-file"),Oe=document.querySelector("#derivative-file-label"),S=document.querySelector("#derivative-button"),x=document.querySelector("#derivative-message"),w=document.querySelector("#language"),_=document.querySelector("#language-other"),q=document.querySelector("#collection"),Y=document.querySelector("#collection-other"),T=document.querySelector("#rights-basis");let g=null,d=null,n=null,v=null,y=null,l=H(),Ue=null;const N=()=>J.find(e=>e.checked)?.value==="missing"?"missing":"present",c=e=>document.querySelector(e),p=e=>document.querySelector(e),Re=(e=new Date)=>{const t=e.getTimezoneOffset()*6e4;return new Date(e.getTime()-t).toISOString().slice(0,10)},re=(e,t)=>e.value==="other"?t.value.trim():e.value.trim(),ce=(e,t)=>{const r=e.value==="other";t.hidden=!r,t.required=r,r||(t.value="")},de=()=>{$.querySelectorAll(".is-invalid").forEach(e=>e.classList.remove("is-invalid")),$.querySelectorAll("[aria-invalid='true']").forEach(e=>e.removeAttribute("aria-invalid"))},Te=()=>{de();const e=[],t=[],r=(a,h)=>{a.value.trim()||(e.push(h),t.push(a))};r(c("#title"),"title"),r(c("#creator"),"creator or contributor"),r(w,"language"),w.value==="other"&&r(_,"other language"),r(c("#place"),"place"),r(q,"collection"),q.value==="other"&&r(Y,"other collection"),r(p("#context"),"why the recording matters"),r(T,"rights or consent basis"),T.value==="other"&&r(p("#rights"),"rights explanation");const o=c("#evidence-url");if(o.value&&!o.validity.valid&&(e.push("a complete evidence URL beginning with http:// or https://"),t.push(o)),N()==="present"&&!g&&(e.push("audio file"),t.push(B)),N()==="present"&&!R.checked&&(e.push("permission confirmation"),t.push(R)),t.forEach(a=>{a.setAttribute("aria-invalid","true"),(a.closest("label, .field-control, .dropzone")??a).classList.add("is-invalid")}),!e.length)return!0;m.innerHTML=`<strong>The passport was not created yet.</strong><span>Please complete: ${s(e.join(", "))}.</span>`;const i=t[0];return(i.closest("label, .field-control, .dropzone")??i).scrollIntoView({behavior:"smooth",block:"center"}),window.setTimeout(()=>i.focus({preventScroll:!0}),350),!1},G=e=>{const t=e.source?`${s(e.source.filename)} · ${V(e.source.bytes)}`:"Original source missing · recovery record only",r=e.status==="fingerprinted"?"Fingerprint created":"Recovery lead",o=(e.derivatives??[]).map(i=>`
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
  `).join("");C.innerHTML=`
    <div class="receipt-head"><span>Archival Passport</span><strong>${r}</strong></div>
    <h3>${s(e.title)}</h3>
    <p class="receipt-id">No. ${s(e.archiveId)}</p>
    <dl class="receipt-data">
      <div><dt>Creator</dt><dd>${s(e.creator)}</dd></div>
      <div><dt>Language / place</dt><dd>${s(e.language)} · ${s(e.place)}</dd></div>
      <div><dt>Recorded / released</dt><dd>${s(e.recordedOn||"Not yet established")}</dd></div>
      <div><dt>Source</dt><dd>${t}</dd></div>
      <div class="full-row"><dt>Integrity fingerprint</dt><dd class="mono">${s(b(e))}</dd></div>
    </dl>
    <div class="citation-box"><span>Research citation</span><p>${s(P(e))}</p></div>
    ${o?`<div class="derivative-receipts"><span>Documented derivatives</span><ul>${o}</ul></div>`:""}
    <div class="receipt-actions">
      <button class="button quiet" id="download-passport" type="button">Download JSON</button>
      <button class="button quiet" id="copy-citation" type="button">Copy citation</button>
    </div>
    <button class="text-button delete-local" id="delete-passport" type="button">Delete this local record</button>
    <p class="receipt-foot">Saved only in this browser. Export it to create a real backup.</p>
  `,document.querySelector("#download-passport").addEventListener("click",()=>be(e)),document.querySelector("#copy-citation").addEventListener("click",async i=>{await navigator.clipboard.writeText(P(e)),i.currentTarget.textContent="Citation copied"}),document.querySelector("#delete-passport").addEventListener("click",()=>{window.confirm(`Delete “${e.title}” from this browser? Export the JSON first if you need a backup.`)&&(l=we(e.archiveId),y=null,C.innerHTML=`
      <div class="empty-receipt">
        <p class="eyebrow">Local record deleted</p>
        <h3>The passport was removed from this browser.</h3>
        <p>The audio file was never stored here. You can create or import another passport at any time.</p>
      </div>
    `,I())})},I=()=>{const e=Se(l);document.querySelector("#corpus-stats").innerHTML=`
    <article><strong>${e.recordings}</strong><span>local records</span></article>
    <article><strong>${e.fingerprinted}</strong><span>fingerprinted sources</span></article>
    <article><strong>${e.recoveryLeads}</strong><span>recovery leads</span></article>
    <article><strong>${e.languages}</strong><span>languages</span></article>
    <article><strong>${e.dateSpan}</strong><span>date span</span></article>
  `;const t=document.querySelector("#corpus-list");t.innerHTML=l.length?`<div class="corpus-table" role="table">
        <div class="corpus-row corpus-header" role="row"><span>Recording</span><span>Language</span><span>Source status</span><span>Passport</span></div>
        ${l.map(o=>`
          <div class="corpus-row" role="row">
            <span><strong>${s(o.title)}</strong><small>${s(o.creator)} · ${s(o.recordedOn||"date unknown")}${o.derivatives?.length?` · ${o.derivatives.length} derivative${o.derivatives.length===1?"":"s"}`:""}</small></span>
            <span>${s(o.language)}</span>
            <span class="status-chip ${o.status}">${o.status==="fingerprinted"?"Fingerprint recorded":"Recovery lead"}</span>
            <span><button class="text-button view-passport" data-id="${s(o.archiveId)}" type="button">View receipt</button></span>
          </div>
        `).join("")}
      </div>`:'<div class="empty-corpus"><strong>No local passports yet.</strong><p>Load the safe demo above to create and verify the first real record—without uploading anything.</p><a href="#create">Create the first passport →</a></div>',t.querySelectorAll(".view-passport").forEach(o=>{o.addEventListener("click",()=>{const i=l.find(a=>a.archiveId===o.dataset.id);i&&(y=i,G(i),document.querySelector("#create")?.scrollIntoView({behavior:"smooth"}))})});const r=l.filter(o=>o.source);L.innerHTML=r.length?`<option value="">Choose a local passport</option>${r.map(o=>`<option value="${s(o.archiveId)}">${s(o.title)} — ${s(b(o))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',F.innerHTML=r.length?`<option value="">Choose a fingerprinted source master</option>${r.map(o=>`<option value="${s(o.archiveId)}">${s(o.title)} — ${s(b(o))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>'},pe=e=>{g=e,qe.textContent=e.name,Ie.textContent=`${V(e.size)} · ${e.type||"audio"}`,O.src&&URL.revokeObjectURL(O.src),O.src=URL.createObjectURL(e),O.hidden=!1},K=()=>{const e=N()==="present";Ae.hidden=!e,R.required=e,m.textContent=e?"A source file will be fingerprinted locally before the passport is saved.":"This will be clearly marked as a metadata-only recovery record. No fingerprint will be invented."};J.forEach(e=>e.addEventListener("change",K));w.addEventListener("change",()=>ce(w,_));q.addEventListener("change",()=>ce(q,Y));$.addEventListener("input",e=>{const t=e.target;t.removeAttribute("aria-invalid"),t.closest("label, .field-control, .dropzone")?.classList.remove("is-invalid")});B.addEventListener("change",()=>{const e=B.files?.[0];e&&pe(e)});document.querySelector("#load-demo").addEventListener("click",()=>{J[0].checked=!0,K(),pe(oe()),c("#title").value="Safe synthetic archive demo",c("#creator").value="Unmute the Archive",w.value="Instrumental / no linguistic content",c("#place").value="Generated locally in the browser",c("#recorded-on").value=Re(),p("#context").value="A four-second rights-clear synthetic clip that demonstrates passport creation, fingerprinting, corpus storage, export, and later verification.",T.value="I created or performed this recording and control this source file.",p("#rights").value="Generated locally by this application. No third-party recording or performance is included.",R.checked=!0,de(),m.textContent="Safe demo loaded. Select “Create passport → see result” to generate it now.",$.scrollIntoView({behavior:"smooth",block:"start"})});$.addEventListener("submit",async e=>{e.preventDefault();const t=N();if(Te()){U.disabled=!0,U.textContent=t==="present"?"Fingerprinting every byte…":"Documenting recovery record…",m.textContent="Building the archival passport locally…";try{const r=g&&t==="present"?{filename:g.name,mediaType:g.type||"application/octet-stream",bytes:g.size,sha256:await j(g)}:void 0;y=ge({status:r?"fingerprinted":"source-missing",collection:re(q,Y),title:c("#title").value.trim(),creator:c("#creator").value.trim(),language:re(w,_),place:c("#place").value.trim(),recordedOn:c("#recorded-on").value||void 0,context:p("#context").value.trim(),rightsBasis:`${T.value}${p("#rights").value.trim()?` ${p("#rights").value.trim()}`:""}`,evidenceUrl:c("#evidence-url").value.trim()||void 0,source:r}),l=ie(y),G(y),I(),m.textContent=r?"Passport saved. You can now verify this file, export the record, or optionally transfer it to Audiotool.":"Recovery record saved. It remains explicitly unverified until a source file is recovered.",C.classList.remove("result-ready"),window.requestAnimationFrame(()=>C.classList.add("result-ready")),window.matchMedia("(max-width: 900px)").matches&&C.scrollIntoView({behavior:"smooth",block:"start"}),W.disabled=!(Ue&&r&&ne.value)}catch(r){m.textContent=r instanceof Error?r.message:"The passport could not be created."}finally{U.disabled=!1,U.textContent="Create passport → see result"}}});D.addEventListener("change",()=>{v=D.files?.[0]??null,Oe.textContent=v?`${v.name} · ${V(v.size)}`:"Choose the derived audio file"});te.addEventListener("submit",async e=>{if(e.preventDefault(),!te.reportValidity())return;const t=l.find(r=>r.archiveId===F.value);if(!t?.source){x.textContent="Choose a fingerprinted source master.",F.focus();return}if(!v){x.textContent="Choose the derived audio file.",D.focus();return}S.disabled=!0,S.textContent="Fingerprinting derivative…",x.textContent="Linking the derivative to its preserved master locally…";try{const r=fe(t,{label:c("#derivative-label").value.trim(),purpose:c("#derivative-purpose").value.trim(),method:p("#derivative-method").value.trim(),changeLog:p("#derivative-changes").value.trim(),reviewerNote:p("#derivative-review").value.trim()||void 0,source:{filename:v.name,mediaType:v.type||"application/octet-stream",bytes:v.size,sha256:await j(v)}});l=ae(r),y=r,G(r),I(),x.textContent="Derivative registered. Export the updated passport JSON to preserve the intervention record.",S.textContent="Derivative registered"}catch(r){x.textContent=r instanceof Error?r.message:"The derivative could not be registered.",S.textContent="Register documented derivative"}finally{S.disabled=!1}});L.addEventListener("change",()=>{n=l.find(e=>e.archiveId===L.value)??null,k.textContent=n?`Comparing against “${n.title}” · ${b(n)}`:"No passport selected.",u.disabled=!(n?.source&&d),f.hidden=!0});Z.addEventListener("change",async()=>{const e=Z.files?.[0];if(e)try{const t=JSON.parse(await e.text());if(!["unmute-archive/2.0","unmute-archive/2.1"].includes(t.schema)||!t.source?.sha256)throw new Error("This receipt has no compatible fingerprint.");n=t,L.value="",k.textContent=`Imported “${t.title}” · ${b(t)}`,u.disabled=!d,f.hidden=!0}catch(t){k.textContent=t instanceof Error?t.message:"Receipt could not be read."}});ee.addEventListener("change",()=>{d=ee.files?.[0]??null,le.textContent=d?d.name:"Choose the audio file to check",u.disabled=!(n?.source&&d),f.hidden=!0});document.querySelector("#verify-demo").addEventListener("click",()=>{d=oe(),le.textContent=d.name;const e=l.find(t=>t.title==="Safe synthetic archive demo"&&t.source);e?(n=e,L.value=e.archiveId,k.textContent=`Comparing against “${e.title}” · ${b(e)}`):k.textContent="Create the safe demo passport in Step 01 first; then this file can prove the match.",u.disabled=!(n?.source&&d),f.hidden=!0});u.addEventListener("click",async()=>{if(!n?.source||!d)return;u.disabled=!0,u.textContent="Comparing every byte…";const e=await j(d),t=e===n.source.sha256;f.hidden=!1,f.className=`verify-result ${t?"match":"mismatch"}`,f.innerHTML=t?`<strong>Exact match.</strong><p>This file is byte-for-byte identical to the source in the passport.</p><code>${s(e)}</code>`:`<strong>Not the same file.</strong><p>The bytes differ. This may be an edit, re-export, transcoding, or another recording.</p><code>Expected ${s(n.source.sha256)}<br />Found ${s(e)}</code>`,t&&l.some(r=>r.archiveId===n.archiveId)&&(n.events.push({type:"verified",at:new Date().toISOString(),note:`Matched ${d.name}`}),l=ae(n),I()),u.disabled=!1,u.textContent="Compare every byte"});document.querySelector("#export-json").addEventListener("click",()=>$e(l));document.querySelector("#export-csv").addEventListener("click",()=>Le(l));const Ne=async()=>{{Ee.textContent="Audiotool developer registration is not connected in this build. Passport, verification, and corpus features are fully functional.",X.textContent="Integration pending",X.disabled=!0;return}};ne.addEventListener("change",()=>{W.disabled=!0});W.addEventListener("click",async()=>{});K();I();Ne();
