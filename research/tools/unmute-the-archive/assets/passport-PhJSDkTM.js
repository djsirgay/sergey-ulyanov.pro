import{f,r as ce,s as B,b as de,a as pe,c as ue,u as te,d as w,i as ve,e as he,g as ge,M as N,h as Y,j as me,k as fe,l as ye}from"./corpus-CPurpQqz.js";import{m as ie}from"./demo-audio-wTWr1Ape.js";const be=[{year:"2016",title:"Belarusian-language single and music video",note:"Creator-owned work with public video and press evidence; original master recovery is pending.",evidence:"https://youtu.be/6jQ43vYcTwE",evidenceLabel:"Watch public evidence"},{year:"2020",title:"Track connected to Belarus's democratic protest movement",note:"Co-authored work preserved through public audio and video evidence; source-file status remains explicit.",evidence:"https://youtu.be/g9d6szYbquo",evidenceLabel:"Watch public evidence"},{year:"2026",title:"Tenth-anniversary vinyl reissue",note:"Belarusian-language works re-enter circulation through a U.S. label and U.K. manufacturing workflow.",evidence:"https://sergey-ulyanov.pro/research/",evidenceLabel:"See research context"}];new URL("./",window.location.href).toString().split("?")[0];const o=e=>e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);document.querySelector("#app").innerHTML=`
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
              <small id="file-meta">WAV, MP3, M4A, FLAC, or another audio format · browser pilot limit ${f(N)}</small>
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
          ${be.map(e=>`
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
`;const q=document.querySelector("#passport-form"),D=[...document.querySelectorAll('input[name="source-mode"]')],O=document.querySelector("#audio-file"),G=document.querySelector("#file-label"),_=document.querySelector("#file-meta"),C=document.querySelector("#audio-preview"),R=document.querySelector("#rights-check"),we=document.querySelector("#source-file-fields"),m=document.querySelector("#form-message"),T=document.querySelector("#create-button"),$=document.querySelector("#live-receipt"),K=document.querySelector("#auth-button"),xe=document.querySelector("#auth-copy"),oe=document.querySelector("#project"),F=document.querySelector("#transfer-button"),L=document.querySelector("#verify-passport"),Q=document.querySelector("#receipt-file"),X=document.querySelector("#verify-file"),ae=document.querySelector("#verify-file-label"),x=document.querySelector("#verify-target"),u=document.querySelector("#verify-button"),p=document.querySelector("#verify-result"),Z=document.querySelector("#derivative-form"),P=document.querySelector("#derivative-passport"),U=document.querySelector("#derivative-file"),Se=document.querySelector("#derivative-file-label"),k=document.querySelector("#derivative-button"),y=document.querySelector("#derivative-message"),S=document.querySelector("#language"),j=document.querySelector("#language-other"),I=document.querySelector("#collection"),V=document.querySelector("#collection-other"),E=document.querySelector("#rights-basis");let g=null,s=null,n=null,d=null,b=null,l=ce(),Ce=null;const M=()=>D.find(e=>e.checked)?.value==="missing"?"missing":"present",c=e=>document.querySelector(e),v=e=>document.querySelector(e),ke=(e=new Date)=>{const t=e.getTimezoneOffset()*6e4;return new Date(e.getTime()-t).toISOString().slice(0,10)},ee=(e,t)=>e.value==="other"?t.value.trim():e.value.trim(),$e=()=>{const e=v("#rights").value.trim();return E.value==="other"?e:`${E.value}${e?` ${e}`:""}`},z=e=>e.size<=N,H=e=>`${e.name} is ${f(e.size)}. This browser pilot accepts files up to ${f(N)} to avoid freezing or losing work; preserve the original and use a smaller access copy here.`,re=(e,t)=>{const i=e.value==="other";t.hidden=!i,t.required=i,i||(t.value="")},se=()=>{q.querySelectorAll(".is-invalid").forEach(e=>e.classList.remove("is-invalid")),q.querySelectorAll("[aria-invalid='true']").forEach(e=>e.removeAttribute("aria-invalid"))},qe=()=>{se();const e=[],t=[],i=(h,le)=>{h.value.trim()||(e.push(le),t.push(h))};i(c("#title"),"title"),i(c("#creator"),"creator or contributor"),i(S,"language"),S.value==="other"&&i(j,"other language"),i(c("#place"),"place"),i(I,"collection"),I.value==="other"&&i(V,"other collection"),i(v("#context"),"why the recording matters"),i(E,"rights or consent basis"),E.value==="other"&&i(v("#rights"),"rights explanation");const a=c("#evidence-url");if(a.value&&!a.validity.valid&&(e.push("a complete evidence URL beginning with http:// or https://"),t.push(a)),M()==="present"&&!g&&(e.push("audio file"),t.push(O)),M()==="present"&&!R.checked&&(e.push("permission confirmation"),t.push(R)),t.forEach(h=>{h.setAttribute("aria-invalid","true"),(h.closest("label, .field-control, .dropzone")??h).classList.add("is-invalid")}),!e.length)return!0;m.innerHTML=`<strong>The passport was not created yet.</strong><span>Please complete: ${o(e.join(", "))}.</span>`;const r=t[0];return(r.closest("label, .field-control, .dropzone")??r).scrollIntoView({behavior:"smooth",block:"center"}),window.setTimeout(()=>r.focus({preventScroll:!0}),350),!1},J=e=>{const t=e.source?`${o(e.source.filename)} · ${f(e.source.bytes)}`:"Original source missing · recovery record only",i=e.status==="fingerprinted"?"Fingerprint created":"Recovery lead",a=(e.derivatives??[]).map(r=>`
    <li>
      <details>
        <summary><strong>${o(r.label)}</strong><span>${o(r.purpose)} · ${o(r.source.filename)}</span></summary>
        <dl>
          <div><dt>Method</dt><dd>${o(r.method)}</dd></div>
          <div><dt>Intervention log</dt><dd>${o(r.changeLog)}</dd></div>
          ${r.reviewerNote?`<div><dt>Human review</dt><dd>${o(r.reviewerNote)}</dd></div>`:""}
          <div><dt>Derivative fingerprint</dt><dd class="mono">${o(`${r.source.sha256.slice(0,12)}…${r.source.sha256.slice(-12)}`)}</dd></div>
        </dl>
      </details>
    </li>
  `).join("");$.innerHTML=`
    <div class="receipt-head"><span>Archival Passport</span><strong>${i}</strong></div>
    <h3>${o(e.title)}</h3>
    <p class="receipt-id">No. ${o(e.archiveId)}</p>
    <dl class="receipt-data">
      <div><dt>Creator</dt><dd>${o(e.creator)}</dd></div>
      <div><dt>Language / place</dt><dd>${o(e.language)} · ${o(e.place)}</dd></div>
      <div><dt>Recorded / released</dt><dd>${o(e.recordedOn||"Not yet established")}</dd></div>
      <div><dt>Source</dt><dd>${t}</dd></div>
      <div class="full-row"><dt>Integrity fingerprint</dt><dd class="mono">${o(w(e))}</dd></div>
    </dl>
    <div class="citation-box"><span>Research citation</span><p>${o(Y(e))}</p></div>
    ${a?`<div class="derivative-receipts"><span>Documented derivatives</span><ul>${a}</ul></div>`:""}
    <div class="receipt-actions">
      <button class="button quiet" id="download-passport" type="button">Download JSON</button>
      <button class="button quiet" id="copy-citation" type="button">Copy citation</button>
    </div>
    <button class="text-button delete-local" id="delete-passport" type="button">Delete this local record</button>
    <p class="receipt-foot">Saved only in this browser. Export it to create a real backup.</p>
  `,document.querySelector("#download-passport").addEventListener("click",()=>me(e)),document.querySelector("#copy-citation").addEventListener("click",async r=>{await navigator.clipboard.writeText(Y(e)),r.currentTarget.textContent="Citation copied"}),document.querySelector("#delete-passport").addEventListener("click",()=>{window.confirm(`Delete “${e.title}” from this browser? Export the JSON first if you need a backup.`)&&(l=fe(e.archiveId),b=null,$.innerHTML=`
      <div class="empty-receipt">
        <p class="eyebrow">Local record deleted</p>
        <h3>The passport was removed from this browser.</h3>
        <p>The audio file was never stored here. You can create or import another passport at any time.</p>
      </div>
    `,A())})},A=()=>{const e=ye(l);document.querySelector("#corpus-stats").innerHTML=`
    <article><strong>${e.recordings}</strong><span>local records</span></article>
    <article><strong>${e.fingerprinted}</strong><span>fingerprinted sources</span></article>
    <article><strong>${e.recoveryLeads}</strong><span>recovery leads</span></article>
    <article><strong>${e.languages}</strong><span>languages</span></article>
    <article><strong>${e.dateSpan}</strong><span>date span</span></article>
  `;const t=document.querySelector("#corpus-list");t.innerHTML=l.length?`<div class="corpus-table" role="table">
        <div class="corpus-row corpus-header" role="row"><span>Recording</span><span>Language</span><span>Source status</span><span>Passport</span></div>
        ${l.map(a=>`
          <div class="corpus-row" role="row">
            <span><strong>${o(a.title)}</strong><small>${o(a.creator)} · ${o(a.recordedOn||"date unknown")}${a.derivatives?.length?` · ${a.derivatives.length} derivative${a.derivatives.length===1?"":"s"}`:""}</small></span>
            <span>${o(a.language)}</span>
            <span class="status-chip ${a.status}">${a.status==="fingerprinted"?"Fingerprint recorded":"Recovery lead"}</span>
            <span><button class="text-button view-passport" data-id="${o(a.archiveId)}" type="button">View receipt</button></span>
          </div>
        `).join("")}
      </div>`:'<div class="empty-corpus"><strong>No local passports yet.</strong><p>Load the safe demo above to create and verify the first real record—without uploading anything.</p><a href="#create">Create the first passport →</a></div>',t.querySelectorAll(".view-passport").forEach(a=>{a.addEventListener("click",()=>{const r=l.find(h=>h.archiveId===a.dataset.id);r&&(b=r,J(r),document.querySelector("#create")?.scrollIntoView({behavior:"smooth"}))})});const i=l.filter(a=>a.source);L.innerHTML=i.length?`<option value="">Choose a local passport</option>${i.map(a=>`<option value="${o(a.archiveId)}">${o(a.title)} — ${o(w(a))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',P.innerHTML=i.length?`<option value="">Choose a fingerprinted source master</option>${i.map(a=>`<option value="${o(a.archiveId)}">${o(a.title)} — ${o(w(a))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>'},ne=e=>z(e)?(g=e,G.textContent=e.name,_.textContent=`${f(e.size)} · ${e.type||"audio"}`,C.src&&URL.revokeObjectURL(C.src),C.src=URL.createObjectURL(e),C.hidden=!1,!0):(g=null,G.textContent="Choose an audio file",_.textContent=`Browser pilot limit ${f(N)}`,C.hidden=!0,m.textContent=H(e),!1),W=()=>{const e=M()==="present";we.hidden=!e,R.required=e,m.textContent=e?"A source file will be fingerprinted locally before the passport is saved.":"This will be clearly marked as a metadata-only recovery record. No fingerprint will be invented."};D.forEach(e=>e.addEventListener("change",W));S.addEventListener("change",()=>re(S,j));I.addEventListener("change",()=>re(I,V));q.addEventListener("input",e=>{const t=e.target;t.removeAttribute("aria-invalid"),t.closest("label, .field-control, .dropzone")?.classList.remove("is-invalid")});O.addEventListener("change",()=>{const e=O.files?.[0];e&&ne(e)});document.querySelector("#load-demo").addEventListener("click",()=>{D[0].checked=!0,W(),ne(ie()),c("#title").value="Safe synthetic archive demo",c("#creator").value="Unmute the Archive",S.value="Instrumental / no linguistic content",c("#place").value="Generated locally in the browser",c("#recorded-on").value=ke(),v("#context").value="A four-second rights-clear synthetic clip that demonstrates passport creation, fingerprinting, corpus storage, export, and later verification.",E.value="I created or performed this recording and control this source file.",v("#rights").value="Generated locally by this application. No third-party recording or performance is included.",R.checked=!0,se(),m.textContent="Safe demo loaded. Select “Create passport → see result” to generate it now.",q.scrollIntoView({behavior:"smooth",block:"start"})});q.addEventListener("submit",async e=>{e.preventDefault();const t=M();if(qe()){T.disabled=!0,T.textContent=t==="present"?"Fingerprinting every byte…":"Documenting recovery record…",m.textContent="Building the archival passport locally…";try{const i=g&&t==="present"?{filename:g.name,mediaType:g.type||"application/octet-stream",bytes:g.size,sha256:await B(g)}:void 0;b=de({status:i?"fingerprinted":"source-missing",collection:ee(I,V),title:c("#title").value.trim(),creator:c("#creator").value.trim(),language:ee(S,j),place:c("#place").value.trim(),recordedOn:c("#recorded-on").value||void 0,context:v("#context").value.trim(),rightsBasis:$e(),evidenceUrl:c("#evidence-url").value.trim()||void 0,source:i}),l=pe(b),J(b),A(),m.textContent=i?"Passport saved. You can now verify this file, export the record, or optionally transfer it to Audiotool.":"Recovery record saved. It remains explicitly unverified until a source file is recovered.",$.classList.remove("result-ready"),window.requestAnimationFrame(()=>$.classList.add("result-ready")),window.matchMedia("(max-width: 900px)").matches&&$.scrollIntoView({behavior:"smooth",block:"start"}),F.disabled=!(Ce&&i&&oe.value)}catch(i){m.textContent=i instanceof Error?i.message:"The passport could not be created."}finally{T.disabled=!1,T.textContent="Create passport → see result"}}});U.addEventListener("change",()=>{d=U.files?.[0]??null,d&&!z(d)&&(y.textContent=H(d),d=null),Se.textContent=d?`${d.name} · ${f(d.size)}`:"Choose the derived audio file"});Z.addEventListener("submit",async e=>{if(e.preventDefault(),!Z.reportValidity())return;const t=l.find(i=>i.archiveId===P.value);if(!t?.source){y.textContent="Choose a fingerprinted source master.",P.focus();return}if(!d){y.textContent="Choose the derived audio file.",U.focus();return}k.disabled=!0,k.textContent="Fingerprinting derivative…",y.textContent="Linking the derivative to its preserved master locally…";try{const i=ue(t,{label:c("#derivative-label").value.trim(),purpose:c("#derivative-purpose").value.trim(),method:v("#derivative-method").value.trim(),changeLog:v("#derivative-changes").value.trim(),reviewerNote:v("#derivative-review").value.trim()||void 0,source:{filename:d.name,mediaType:d.type||"application/octet-stream",bytes:d.size,sha256:await B(d)}});l=te(i),b=i,J(i),A(),y.textContent="Derivative registered. Export the updated passport JSON to preserve the intervention record.",k.textContent="Derivative registered"}catch(i){y.textContent=i instanceof Error?i.message:"The derivative could not be registered.",k.textContent="Register documented derivative"}finally{k.disabled=!1}});L.addEventListener("change",()=>{n=l.find(e=>e.archiveId===L.value)??null,x.textContent=n?`Comparing against “${n.title}” · ${w(n)}`:"No passport selected.",u.disabled=!(n?.source&&s),p.hidden=!0});Q.addEventListener("change",async()=>{const e=Q.files?.[0];if(e)try{const t=JSON.parse(await e.text());if(!ve(t)||!t.source?.sha256)throw new Error("This is not a complete, compatible fingerprinted Archive Passport receipt.");n=t,L.value="",x.textContent=`Imported “${t.title}” · ${w(t)}`,u.disabled=!s,p.hidden=!0}catch(t){x.textContent=t instanceof Error?t.message:"Receipt could not be read."}});X.addEventListener("change",()=>{s=X.files?.[0]??null,s&&!z(s)&&(x.textContent=H(s),s=null),ae.textContent=s?s.name:"Choose the audio file to check",u.disabled=!(n?.source&&s),p.hidden=!0});document.querySelector("#verify-demo").addEventListener("click",()=>{s=ie(),ae.textContent=s.name;const e=l.find(t=>t.title==="Safe synthetic archive demo"&&t.source);e?(n=e,L.value=e.archiveId,x.textContent=`Comparing against “${e.title}” · ${w(e)}`):x.textContent="Create the safe demo passport in Step 01 first; then this file can prove the match.",u.disabled=!(n?.source&&s),p.hidden=!0});u.addEventListener("click",async()=>{if(!(!n?.source||!s)){u.disabled=!0,u.textContent="Comparing every byte…";try{const e=await B(s),t=e===n.source.sha256;p.hidden=!1,p.className=`verify-result ${t?"match":"mismatch"}`,p.innerHTML=t?`<strong>Exact match.</strong><p>This file is byte-for-byte identical to the source in the passport.</p><code>${o(e)}</code>`:`<strong>Not the same file.</strong><p>The bytes differ. This may be an edit, re-export, transcoding, or another recording.</p><code>Expected ${o(n.source.sha256)}<br />Found ${o(e)}</code>`,t&&l.some(i=>i.archiveId===n.archiveId)&&(n.events.push({type:"verified",at:new Date().toISOString(),note:`Matched ${s.name}`}),l=te(n),A())}catch{p.hidden=!1,p.className="verify-result mismatch",p.innerHTML="<strong>Comparison could not finish.</strong><p>The browser did not change or upload the file. Try a smaller local copy or reload the tool.</p>"}finally{u.disabled=!1,u.textContent="Compare every byte"}}});document.querySelector("#export-json").addEventListener("click",()=>he(l));document.querySelector("#export-csv").addEventListener("click",()=>ge(l));const Le=async()=>{{xe.textContent="Audiotool developer registration is not connected in this build. Passport, verification, and corpus features are fully functional.",K.textContent="Integration pending",K.disabled=!0;return}};oe.addEventListener("change",()=>{F.disabled=!0});F.addEventListener("click",async()=>{});W();A();Le();
