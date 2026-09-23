import{o as b,a as U,t as J,u as ue,v as ve,w as he,x as re,y as k,z as me,e as ge,A as fe,i as ye,m as be,M as B,B as we,C as Q,D as xe,E as Ce,F as Se}from"./storage-warning-CVLXd_Jq.js";import{m as se}from"./demo-audio-wTWr1Ape.js";const ke=[{year:"2016",title:"Belarusian-language single and music video",note:"Creator-owned work with public video and press evidence; original master recovery is pending.",evidence:"https://youtu.be/6jQ43vYcTwE",evidenceLabel:"Watch public evidence"},{year:"2020",title:"Track connected to Belarus's democratic protest movement",note:"Co-authored work preserved through public audio and video evidence; source-file status remains explicit.",evidence:"https://youtu.be/g9d6szYbquo",evidenceLabel:"Watch public evidence"},{year:"2026",title:"Tenth-anniversary vinyl reissue",note:"Belarusian-language works re-enter circulation through a U.S. label and U.K. manufacturing workflow.",evidence:"https://sergey-ulyanov.pro/research/",evidenceLabel:"See research context"}];new URL("./",window.location.href).toString().split("?")[0];const i=e=>e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);document.querySelector("#app").innerHTML=`
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
      <a href="./atlas/"><b>02</b> Music Atlas <small>live pilot</small></a>
      <a href="./restoration/"><b>03</b> Restoration Lab <small>live pilot</small></a>
      <a href="./atlas/#analytics">Data &amp; analytics</a>
    </div>
  </nav>

  <main>
    <section class="hero shell">
      <div class="hero-copy">
        <p class="eyebrow">Live module · Unmute Belarus research system</p>
        <h1>Document a recording’s story. Preserve its future.</h1>
        <p class="lede">Create a human-readable archival passport, document edited copies without replacing the master, verify exact files, and export a structured research corpus. The core workflow stays on this device.</p>
        <div class="hero-actions">
          <a class="button primary" href="#create">Start a passport</a>
          <button class="button outline" id="quick-demo" type="button">Try a complete safe demo</button>
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
              <small id="file-meta">WAV, MP3, M4A, FLAC, or another audio format · browser pilot limit ${b(B)}</small>
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
          <button class="button quiet" id="import-corpus-button" type="button">Import JSON backup</button>
          <input id="import-corpus" type="file" accept="application/json,.json" hidden />
        </div>
      </div>
      <div class="stats-grid" id="corpus-stats"></div>
      <p id="import-corpus-status" class="form-message" role="status"></p>
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
    <a href="./atlas/"><small>Next module →</small><strong>02 · Music Atlas</strong></a>
  </nav>

  <footer class="footer shell">
    <p>Designed and built by Sergéy Ulyanov · <a href="/research/system/">Unmute Belarus research system</a></p>
    <p>Live research prototype · local-first · no blockchain claims</p>
  </footer>
`;document.querySelectorAll("option:not([value])").forEach(e=>{e.value=e.textContent??""});const q=document.querySelector("#passport-form"),W=[...document.querySelectorAll('input[name="source-mode"]')],V=document.querySelector("#audio-file"),X=document.querySelector("#file-label"),Z=document.querySelector("#file-meta"),E=document.querySelector("#audio-preview"),N=document.querySelector("#rights-check"),qe=document.querySelector("#source-file-fields"),f=document.querySelector("#form-message"),M=document.querySelector("#create-button"),T=document.querySelector("#live-receipt"),ee=document.querySelector("#auth-button"),$e=document.querySelector("#auth-copy"),ne=document.querySelector("#project"),Y=document.querySelector("#transfer-button"),g=document.querySelector("#verify-passport"),te=document.querySelector("#receipt-file"),oe=document.querySelector("#verify-file"),le=document.querySelector("#verify-file-label"),$=document.querySelector("#verify-target"),v=document.querySelector("#verify-button"),u=document.querySelector("#verify-result"),ae=document.querySelector("#derivative-form"),A=document.querySelector("#derivative-passport"),H=document.querySelector("#derivative-file"),Le=document.querySelector("#derivative-file-label"),I=document.querySelector("#derivative-button"),S=document.querySelector("#derivative-message"),w=document.querySelector("#language"),D=document.querySelector("#language-other"),x=document.querySelector("#collection"),F=document.querySelector("#collection-other"),R=document.querySelector("#rights-basis");let m=null,c=null,p=null,d=null,y=null,n=U(),Ee=null;const O=()=>W.find(e=>e.checked)?.value==="missing"?"missing":"present",s=e=>document.querySelector(e),h=e=>document.querySelector(e),Ie=(e=new Date)=>{const t=e.getTimezoneOffset()*6e4;return new Date(e.getTime()-t).toISOString().slice(0,10)},ie=(e,t)=>e.value==="other"?t.value.trim():e.value.trim(),Te=()=>{const e=h("#rights").value.trim();return R.value==="other"?e:`${R.value}${e?` ${e}`:""}`},G=e=>e.size>0&&e.size<=B,_=e=>e.size===0?`${e.name} is empty. Choose an audio file that contains data.`:`${e.name} is ${b(e.size)}. This browser pilot accepts files up to ${b(B)} to avoid freezing or losing work; preserve the original and use a smaller access copy here.`,P=(e,t)=>{const o=e.value==="other";t.hidden=!o,t.required=o,o||(t.value="")},ce=()=>{q.querySelectorAll(".is-invalid").forEach(e=>e.classList.remove("is-invalid")),q.querySelectorAll("[aria-invalid='true']").forEach(e=>e.removeAttribute("aria-invalid"))},Ae=()=>{ce();const e=[],t=[],o=(a,L)=>{a.value.trim()||(e.push(L),t.push(a))};o(s("#title"),"title"),o(s("#creator"),"creator or contributor"),o(w,"language"),w.value==="other"&&o(D,"other language"),o(s("#place"),"place"),o(x,"collection"),x.value==="other"&&o(F,"other collection"),o(h("#context"),"why the recording matters"),o(R,"rights or consent basis"),R.value==="other"&&o(h("#rights"),"rights explanation");const l=s("#evidence-url");if(l.value&&!we(l.value)&&(e.push("a complete evidence URL beginning with http:// or https://"),t.push(l)),O()==="present"&&!m&&(e.push("audio file"),t.push(V)),O()==="present"&&!N.checked&&(e.push("permission confirmation"),t.push(N)),t.forEach(a=>{a.setAttribute("aria-invalid","true"),(a.closest("label, .field-control, .dropzone")??a).classList.add("is-invalid")}),!e.length)return!0;f.innerHTML=`<strong>The passport was not created yet.</strong><span>Please complete: ${i(e.join(", "))}.</span>`;const r=t[0];return(r.closest("label, .field-control, .dropzone")??r).scrollIntoView({behavior:"smooth",block:"center"}),window.setTimeout(()=>r.focus({preventScroll:!0}),350),!1},j=e=>{const t=e.source?`${i(e.source.filename)} · ${b(e.source.bytes)}`:"Original source missing · recovery record only",o=e.status==="fingerprinted"?"Fingerprint created":"Recovery lead",l=(e.derivatives??[]).map(r=>`
    <li>
      <details>
        <summary><strong>${i(r.label)}</strong><span>${i(r.purpose)} · ${i(r.source.filename)}</span></summary>
        <dl>
          <div><dt>Method</dt><dd>${i(r.method)}</dd></div>
          <div><dt>Intervention log</dt><dd>${i(r.changeLog)}</dd></div>
          ${r.reviewerNote?`<div><dt>Human review</dt><dd>${i(r.reviewerNote)}</dd></div>`:""}
          <div><dt>Derivative fingerprint</dt><dd class="mono">${i(`${r.source.sha256.slice(0,12)}…${r.source.sha256.slice(-12)}`)}</dd></div>
        </dl>
      </details>
    </li>
  `).join("");T.innerHTML=`
    <div class="receipt-head"><span>Archival Passport</span><strong>${o}</strong></div>
    <h3>${i(e.title)}</h3>
    <p class="receipt-id">No. ${i(e.archiveId)}</p>
    <dl class="receipt-data">
      <div><dt>Creator</dt><dd>${i(e.creator)}</dd></div>
      <div><dt>Language / place</dt><dd>${i(e.language)} · ${i(e.place)}</dd></div>
      <div><dt>Recorded / released</dt><dd>${i(e.recordedOn||"Not yet established")}</dd></div>
      <div><dt>Source</dt><dd>${t}</dd></div>
      <div class="full-row"><dt>Integrity fingerprint</dt><dd class="mono">${i(k(e))}</dd></div>
    </dl>
    <div class="citation-box"><span>Research citation</span><p>${i(Q(e))}</p></div>
    ${l?`<div class="derivative-receipts"><span>Documented derivatives</span><ul>${l}</ul></div>`:""}
    <div class="receipt-actions">
      <button class="button quiet" id="download-passport" type="button">Download JSON</button>
      <button class="button quiet" id="copy-citation" type="button">Copy citation</button>
    </div>
    <div class="receipt-actions module-next-actions"><a class="button quiet" href="./atlas/">Find it in Music Atlas →</a>${e.source?`<a class="button quiet" href="./restoration/?passport=${encodeURIComponent(e.archiveId)}#lab">Create an access copy →</a>`:""}</div>
    <button class="text-button delete-local" id="delete-passport" type="button">Delete this local record</button>
    <p class="receipt-foot">Saved only in this browser. Export it to create a real backup.</p>
  `,document.querySelector("#download-passport").addEventListener("click",()=>xe(e)),document.querySelector("#copy-citation").addEventListener("click",async r=>{const a=r.currentTarget;try{await navigator.clipboard.writeText(Q(e)),a.textContent="Citation copied"}catch{a.textContent="Select and copy the citation above"}}),document.querySelector("#delete-passport").addEventListener("click",()=>{window.confirm(`Delete “${e.title}” from this browser? Export the JSON first if you need a backup.`)&&(n=Ce(e.archiveId),y=null,T.innerHTML=`
      <div class="empty-receipt">
        <p class="eyebrow">Local record deleted</p>
        <h3>The passport was removed from this browser.</h3>
        <p>The audio file was never stored here. You can create or import another passport at any time.</p>
      </div>
    `,C())})},C=()=>{const e=Se(n);document.querySelector("#corpus-stats").innerHTML=`
    <article><strong>${e.recordings}</strong><span>local records</span></article>
    <article><strong>${e.fingerprinted}</strong><span>fingerprinted sources</span></article>
    <article><strong>${e.recoveryLeads}</strong><span>recovery leads</span></article>
    <article><strong>${e.languages}</strong><span>languages</span></article>
    <article><strong>${e.dateSpan}</strong><span>date span</span></article>
  `;const t=document.querySelector("#corpus-list");t.innerHTML=n.length?`<div class="corpus-table" role="table">
        <div class="corpus-row corpus-header" role="row"><span>Recording</span><span>Language</span><span>Source status</span><span>Passport</span></div>
        ${n.map(a=>`
          <div class="corpus-row" role="row">
            <span><strong>${i(a.title)}</strong><small>${i(a.creator)} · ${i(a.recordedOn||"date unknown")}${a.derivatives?.length?` · ${a.derivatives.length} derivative${a.derivatives.length===1?"":"s"}`:""}</small></span>
            <span>${i(a.language)}</span>
            <span class="status-chip ${a.status}">${a.status==="fingerprinted"?"Fingerprint recorded":"Recovery lead"}</span>
            <span><button class="text-button view-passport" data-id="${i(a.archiveId)}" type="button">View receipt</button></span>
          </div>
        `).join("")}
      </div>`:'<div class="empty-corpus"><strong>No local passports yet.</strong><p>Load the safe demo above to create and verify the first real record—without uploading anything.</p><a href="#create">Create the first passport →</a></div>',t.querySelectorAll(".view-passport").forEach(a=>{a.addEventListener("click",()=>{const L=n.find(pe=>pe.archiveId===a.dataset.id);L&&(y=L,j(L),document.querySelector("#create")?.scrollIntoView({behavior:"smooth"}))})});const o=n.filter(a=>a.source),l=g.value,r=A.value;g.innerHTML=o.length?`<option value="">Choose a local passport</option>${o.map(a=>`<option value="${i(a.archiveId)}">${i(a.title)} — ${i(k(a))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',A.innerHTML=o.length?`<option value="">Choose a fingerprinted source master</option>${o.map(a=>`<option value="${i(a.archiveId)}">${i(a.title)} — ${i(k(a))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',g.value=l,A.value=r,s("#export-json").disabled=n.length===0,s("#export-csv").disabled=n.length===0},de=e=>G(e)?(m=e,X.textContent=e.name,Z.textContent=`${b(e.size)} · ${e.type||"audio"}`,E.src&&URL.revokeObjectURL(E.src),E.src=URL.createObjectURL(e),E.hidden=!1,!0):(m=null,X.textContent="Choose an audio file",Z.textContent=`Browser pilot limit ${b(B)}`,E.hidden=!0,f.textContent=_(e),!1),K=()=>{const e=O()==="present";qe.hidden=!e,N.required=e,f.textContent=e?"A source file will be fingerprinted locally before the passport is saved.":"This will be clearly marked as a metadata-only recovery record. No fingerprint will be invented."};W.forEach(e=>e.addEventListener("change",K));w.addEventListener("change",()=>P(w,D));x.addEventListener("change",()=>P(x,F));q.addEventListener("input",e=>{const t=e.target;t.removeAttribute("aria-invalid"),t.closest("label, .field-control, .dropzone")?.classList.remove("is-invalid")});V.addEventListener("change",()=>{const e=V.files?.[0];e&&de(e)});document.querySelector("#load-demo").addEventListener("click",()=>{W[0].checked=!0,K(),de(se()),s("#title").value="Safe synthetic archive demo",s("#creator").value="Unmute the Archive",w.value="Instrumental / no linguistic content",P(w,D),x.value="Unassigned research record",P(x,F),s("#evidence-url").value="",s("#place").value="Generated locally in the browser",s("#recorded-on").value=Ie(),h("#context").value="A four-second rights-clear synthetic clip that demonstrates passport creation, fingerprinting, corpus storage, export, and later verification.",R.value="I created or performed this recording and control this source file.",h("#rights").value="Generated locally by this application. No third-party recording or performance is included.",N.checked=!0,ce(),f.textContent="Safe demo loaded. Select “Create passport → see result” to generate it now.",q.scrollIntoView({behavior:"smooth",block:"start"})});document.querySelector("#quick-demo").addEventListener("click",()=>{document.querySelector("#load-demo").click(),q.requestSubmit()});q.addEventListener("submit",async e=>{e.preventDefault();const t=O();if(Ae()){M.disabled=!0,M.textContent=t==="present"?"Fingerprinting every byte…":"Documenting recovery record…",f.textContent="Building the archival passport locally…";try{const o=m&&t==="present"?{filename:m.name,mediaType:m.type||"application/octet-stream",bytes:m.size,sha256:await J(m)}:void 0;y=ue({status:o?"fingerprinted":"source-missing",collection:ie(x,F),title:s("#title").value.trim(),creator:s("#creator").value.trim(),language:ie(w,D),place:s("#place").value.trim(),recordedOn:s("#recorded-on").value||void 0,context:h("#context").value.trim(),rightsBasis:Te(),evidenceUrl:s("#evidence-url").value.trim()||void 0,source:o}),n=ve(y),j(y),C(),f.textContent=o?"Passport saved. You can now verify this file, export the record, or optionally transfer it to Audiotool.":"Recovery record saved. It remains explicitly unverified until a source file is recovered.",T.classList.remove("result-ready"),window.requestAnimationFrame(()=>T.classList.add("result-ready")),window.matchMedia("(max-width: 900px)").matches&&T.scrollIntoView({behavior:"smooth",block:"start"}),Y.disabled=!(Ee&&o&&ne.value)}catch(o){f.textContent=o instanceof Error?o.message:"The passport could not be created."}finally{M.disabled=!1,M.textContent="Create passport → see result"}}});H.addEventListener("change",()=>{d=H.files?.[0]??null,d&&!G(d)&&(S.textContent=_(d),d=null),Le.textContent=d?`${d.name} · ${b(d.size)}`:"Choose the derived audio file"});ae.addEventListener("submit",async e=>{if(e.preventDefault(),!ae.reportValidity())return;const t=n.find(o=>o.archiveId===A.value);if(!t?.source){S.textContent="Choose a fingerprinted source master.",A.focus();return}if(!d){S.textContent="Choose the derived audio file.",H.focus();return}I.disabled=!0,I.textContent="Fingerprinting derivative…",S.textContent="Linking the derivative to its preserved master locally…";try{const o=he(t,{label:s("#derivative-label").value.trim(),purpose:s("#derivative-purpose").value.trim(),method:h("#derivative-method").value.trim(),changeLog:h("#derivative-changes").value.trim(),reviewerNote:h("#derivative-review").value.trim()||void 0,source:{filename:d.name,mediaType:d.type||"application/octet-stream",bytes:d.size,sha256:await J(d)}});n=re(o),y=o,j(o),C(),S.textContent="Derivative registered. Export the updated passport JSON to preserve the intervention record.",I.textContent="Derivative registered"}catch(o){S.textContent=o instanceof Error?o.message:"The derivative could not be registered.",I.textContent="Register documented derivative"}finally{I.disabled=!1}});g.addEventListener("change",()=>{p=n.find(e=>e.archiveId===g.value)??null,$.textContent=p?`Comparing against “${p.title}” · ${k(p)}`:"No passport selected.",v.disabled=!(p?.source&&c),u.hidden=!0});te.addEventListener("change",async()=>{const e=te.files?.[0];if(e)try{const t=JSON.parse(await e.text());if(!me(t)||!t.source?.sha256)throw new Error("This is not a complete, compatible fingerprinted Archive Passport receipt.");p=t,g.value="",$.textContent=`Imported “${t.title}” · ${k(t)}`,v.disabled=!c,u.hidden=!0}catch(t){p=null,v.disabled=!0,u.hidden=!0,$.textContent=t instanceof Error?t.message:"Receipt could not be read."}});oe.addEventListener("change",()=>{c=oe.files?.[0]??null,c&&!G(c)&&($.textContent=_(c),c=null),le.textContent=c?c.name:"Choose the audio file to check",v.disabled=!(p?.source&&c),u.hidden=!0});document.querySelector("#verify-demo").addEventListener("click",()=>{c=se(),le.textContent=c.name;const e=n.find(t=>t.title==="Safe synthetic archive demo"&&t.source);e?(p=e,g.value=e.archiveId,$.textContent=`Comparing against “${e.title}” · ${k(e)}`):(p=null,g.value="",$.textContent="Create the safe demo passport in Step 01 first; then this file can prove the match."),v.disabled=!(p?.source&&c),u.hidden=!0});v.addEventListener("click",async()=>{if(!p?.source||!c)return;const e=structuredClone(p),t=c;v.disabled=!0,v.textContent="Comparing every byte…";try{const o=await J(t),l=o===e.source.sha256;u.hidden=!1,u.className=`verify-result ${l?"match":"mismatch"}`,u.innerHTML=l?`<strong>Exact match.</strong><p>This file is byte-for-byte identical to the source in the passport.</p><code>${i(o)}</code>`:`<strong>Not the same file.</strong><p>The bytes differ. This may be an edit, re-export, transcoding, or another recording.</p><code>Expected ${i(e.source.sha256)}<br />Found ${i(o)}</code>`;const r=U().find(a=>a.archiveId===e.archiveId&&a.source?.sha256===e.source.sha256);l&&r&&(r.events.push({type:"verified",at:new Date().toISOString(),note:`Matched ${t.name}`}),n=re(r),C())}catch{u.hidden=!1,u.className="verify-result mismatch",u.innerHTML="<strong>Comparison could not finish.</strong><p>The browser did not change or upload the file. Try a smaller local copy or reload the tool.</p>"}finally{v.disabled=!1,v.textContent="Compare every byte"}});document.querySelector("#export-json").addEventListener("click",()=>ge(n));document.querySelector("#export-csv").addEventListener("click",()=>fe(n));s("#import-corpus-button").addEventListener("click",()=>s("#import-corpus").click());s("#import-corpus").addEventListener("change",async e=>{const t=e.currentTarget,o=t.files?.[0];if(!o)return;const l=document.querySelector("#import-corpus-status");try{const r=ye(await o.text());n=U(),C(),l.textContent=r?`${r} passport(s) imported. Choose a receipt below to inspect it.`:"These passports are already saved. No duplicates were added."}catch(r){l.textContent=r instanceof Error?r.message:"The backup could not be imported."}t.value=""});const Re=async()=>{{$e.textContent="Audiotool developer registration is not connected in this build. Passport, verification, and corpus features are fully functional.",ee.textContent="Integration pending",ee.disabled=!0;return}};ne.addEventListener("change",()=>{Y.disabled=!0});Y.addEventListener("click",async()=>{});K();be();C();window.addEventListener("storage",()=>{n=U(),C()});const Me=new URLSearchParams(window.location.search).get("passport"),z=n.find(e=>e.archiveId===Me);z&&(y=z,j(z));Re();
