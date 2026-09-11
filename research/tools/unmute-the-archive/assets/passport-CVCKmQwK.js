import{t as oe,M as O,u as Ee,v as Ae,w as Ne,x as Re,y as L,a as C,z as re,A as Pe,B as Ce,C as I,D as ve,e as Ue,E as Me,i as Oe,m as De,c as Fe,F as ke,G as he,H as Be,I as je,J as ze}from"./initial-fragment-CrsPryvk.js";import{m as $e}from"./demo-audio-wTWr1Ape.js";const He=[{year:"2016",title:"Belarusian-language single and music video",note:"Creator-owned work with public video and press evidence; original master recovery is pending.",evidence:"https://youtu.be/6jQ43vYcTwE",evidenceLabel:"Watch public evidence"},{year:"2020",title:"Track connected to Belarus's democratic protest movement",note:"Co-authored work preserved through public audio and video evidence; source-file status remains explicit.",evidence:"https://youtu.be/g9d6szYbquo",evidenceLabel:"Watch public evidence"},{year:"2026",title:"Tenth-anniversary vinyl reissue",note:"Belarusian-language works re-enter circulation through a U.S. label and U.K. manufacturing workflow.",evidence:"https://sergey-ulyanov.pro/research/",evidenceLabel:"See research context"}];class v extends Error{constructor(t,i){super(t),this.fieldId=i,this.name="InterventionFormError"}fieldId}const q=(e,t,i)=>{const o=e.trim();if(!o)throw new v(`Please complete ${i}.`,t);return o},B=(e,t,i)=>{if(e.status==="provided")return{status:"provided",value:q(e.value,t,i)};if(["unknown","not-disclosed","not-applicable"].includes(e.status))return{status:e.status};throw new v(`Choose a disclosure status for ${i}.`,t==="derivative-method"?"intervention-instruction-status":`${t}-status`)},$=e=>e.status==="provided"?e.value:{unknown:"Unknown","not-disclosed":"Not disclosed","not-applicable":"Not applicable"}[e.status],Ve=(e,t)=>{if(!["ai","non-ai","unknown"].includes(e.processingType))throw new v("Choose the processing type, or explicitly choose Unknown.","intervention-processing");const i=B(e.toolName,"intervention-tool","tool name"),o=B(e.model,"intervention-model","model name");if(o.status==="not-applicable"&&e.processingType!=="non-ai")throw new v("Model is not applicable only when processing is explicitly non-AI. Choose Unknown if you do not know.","intervention-model-status");if(i.status==="not-applicable"&&e.processingType==="ai")throw new v("An AI tool cannot be marked not applicable. Choose Unknown or Not disclosed if needed.","intervention-tool-status");const n=B(e.toolVersion,"intervention-version","tool version"),r=B(e.instruction,"derivative-method","processing instruction or method"),s=B(e.settings,"intervention-settings","processing settings"),p=q(e.changes,"derivative-changes","change log");if(!["creator-owned","permission","public-domain","unknown","no-permission"].includes(e.authorityBasis))throw new v("Choose the permission basis, including Unknown or No permission when appropriate.","intervention-authority");const b=q(e.authorityScope,"intervention-scope","permission scope (or what is unknown)");if(!["pending","reviewed","rejected"].includes(e.reviewStatus))throw new v("Choose the review status.","intervention-review-status");const F=e.reviewStatus!=="pending",de=F?q(e.reviewer,"intervention-reviewer","reviewer name or pseudonym"):e.reviewer.trim(),pe=F?q(e.reviewNote,"derivative-review","review note"):e.reviewNote.trim();if(!e.originalUnchanged)throw new v("Confirm that the original master is preserved and this is a separate derivative.","derivative-master-check");const ue={schema:"unmute-intervention/1.0",sourceMasterSha256:t,processingType:e.processingType,tool:{name:i,version:n,model:o},instruction:r,settings:s,authority:{basis:e.authorityBasis,scope:b,...e.authorityEvidence.trim()?{evidence:e.authorityEvidence.trim()}:{}},changes:p,preservedFeatures:e.preservedFeatures.trim()||"Not assessed.",uncertainty:e.uncertainty.trim()||"Not assessed.",review:{status:e.reviewStatus,...de?{reviewer:de}:{},...pe?{note:pe}:{}},originalUnchanged:!0};if(!Ae(ue))throw new v("The intervention record is incomplete or its source fingerprint is invalid.","derivative-passport");return ue},Je=(e,t,i)=>{if(!oe(e)||!e.source)throw new v("Choose a complete fingerprinted source passport.","derivative-passport");if(!t.size||t.size>O)throw new v("Choose a nonempty derivative file within the browser size limit.","derivative-file");const o=q(i.label,"derivative-label","derivative label"),n=q(i.purpose,"derivative-purpose","derivative purpose"),r=Ve(i,e.source.sha256);return{master:structuredClone(e),file:t,values:{label:o,purpose:n,method:`Declared processing: ${r.processingType}. Tool: ${$(r.tool.name)}. Instruction: ${$(r.instruction)}.`,changeLog:r.changes,...r.review.note?{reviewerNote:r.review.note}:{},intervention:r}}},We=(e,t,i)=>{if(!t||JSON.stringify(t)!==JSON.stringify(e.master))throw new v("The source passport changed while fingerprinting. Your form is still here; reopen the current passport and register again.","derivative-passport");return Ee(t,{...e.values,source:{filename:e.file.name,mediaType:e.file.type||"application/octet-stream",bytes:e.file.size,sha256:i}})},me=e=>e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),j=(e,t)=>`<div><dt>${me(e)}</dt><dd>${me(t)}</dd></div>`,Ye=e=>{const t=e.intervention;return t?`<div class="intervention-receipt"><p class="intervention-notice">This journal records declarations, not an authenticity certificate or a permission grant. A review is not automatically an approval.</p><dl>${[["Journal schema",t.schema],["Declared source master SHA-256",t.sourceMasterSha256],["Derivative SHA-256",e.source.sha256],["Processing type",t.processingType],["Tool",$(t.tool.name)],["Tool version",$(t.tool.version)],["Model",$(t.tool.model)],["Instruction / method",$(t.instruction)],["Settings",$(t.settings)],["Declared authority basis",t.authority.basis],["Permission scope",t.authority.scope],["Permission evidence / reference",t.authority.evidence||"Not recorded"],["Changes",t.changes],["Preserved features",t.preservedFeatures],["Uncertainty / limitations",t.uncertainty],["Declared human review status",t.review.status],["Reviewer / pseudonym",t.review.reviewer||"Not recorded"],["Review note",t.review.note||"Not recorded"],["Original master preserved","Confirmed by the declarant; not independently verified"]].map(([o,n])=>j(o,n)).join("")}</dl></div>`:`<div class="intervention-receipt intervention-legacy"><p><strong>Structured review not recorded.</strong> This legacy derivative has no structured intervention journal. Its processing disclosures, permission scope, and review decision are not established by a fingerprint.</p><dl>${j("Method (legacy)",e.method)}${j("Change log (legacy)",e.changeLog)}${j("Legacy free-text note — not a review decision",e.reviewerNote||"Not recorded")}${j("Derivative SHA-256",e.source.sha256)}</dl></div>`},Ge=e=>{const t=o=>e.querySelector(`#${o}`).value,i=(o,n=`${o}-status`)=>({status:t(n),value:t(o)});return{label:t("derivative-label"),purpose:t("derivative-purpose"),processingType:t("intervention-processing"),toolName:i("intervention-tool"),toolVersion:i("intervention-version"),model:i("intervention-model"),instruction:i("derivative-method","intervention-instruction-status"),settings:i("intervention-settings"),authorityBasis:t("intervention-authority"),authorityScope:t("intervention-scope"),authorityEvidence:t("intervention-evidence"),changes:t("derivative-changes"),preservedFeatures:t("intervention-preserved"),uncertainty:t("intervention-uncertainty"),reviewStatus:t("intervention-review-status"),reviewer:t("intervention-reviewer"),reviewNote:t("derivative-review"),originalUnchanged:e.querySelector("#derivative-master-check").checked}},ne=e=>{const t=e.querySelector("#intervention-processing").value;for(const n of["intervention-tool","intervention-version","intervention-model","derivative-method","intervention-settings"]){const r=n==="derivative-method"?"intervention-instruction-status":`${n}-status`,s=e.querySelector(`#${r}`),p=e.querySelector(`#${n}`),b=s.querySelector('option[value="not-applicable"]'),F=n==="intervention-model"&&t!=="non-ai"||n==="intervention-tool"&&t==="ai";b&&(b.disabled=F),F&&s.value==="not-applicable"&&(s.value="unknown"),p.hidden=s.value!=="provided",p.disabled=p.hidden,p.required=!p.hidden}const i=e.querySelector("#intervention-review-status").value!=="pending";e.querySelector("#intervention-reviewer").required=i,e.querySelector("#derivative-review").required=i;const o=e.querySelector("#intervention-review-help");o&&(o.textContent=i?"Enter the reviewer (a pseudonym is fine) and a substantive note. Reviewed does not mean approved or rights-cleared.":"Pending is the default. A name or note alone does not mark review complete.")},_e=(e,t,i,o)=>{if(e==="present"){if(!t||!t.size||t.size>O)throw new Error("Choose a nonempty source file within the browser size limit.");if(i!==!0)throw new Error("Confirm that you control the file or have permission to preserve it.")}return{mode:e,file:e==="present"?t:null,preservationConsent:e==="present"&&i,values:structuredClone(o)}},Ke=(e,t)=>{if(e.mode==="present"&&(!e.file||e.preservationConsent!==!0||!Ne(t)))throw new Error("The captured source, preservation consent, and SHA-256 digest are required.");const i=e.mode==="present"&&e.file?{filename:e.file.name,mediaType:e.file.type||"application/octet-stream",bytes:e.file.size,sha256:t}:void 0,o=Re({...e.values,status:i?"fingerprinted":"source-missing",source:i});if(!oe(o))throw new Error("The captured passport details are incomplete. Review the form and create the passport again.");return o};new URL("./",window.location.href).toString().split("?")[0];const a=e=>e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]),z=(e,t,i,o=!1,n=`${e}-status`)=>`
  <div class="intervention-disclosure">
    <label for="${n}">${a(t)}</label>
    <div class="intervention-disclosure-controls">
      <select id="${n}" aria-label="${a(t)} disclosure">
        <option value="unknown">Unknown</option><option value="provided">Provide details</option>
        <option value="not-disclosed">Not disclosed</option><option value="not-applicable">Not applicable</option>
      </select>
      ${o?`<textarea id="${e}" rows="3" placeholder="${a(i)}" aria-label="${a(t)} details" hidden disabled></textarea>`:`<input id="${e}" placeholder="${a(i)}" aria-label="${a(t)} details" hidden disabled />`}
    </div>
  </div>`;document.querySelector("#app").innerHTML=`
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
              <small id="file-meta">WAV, MP3, M4A, FLAC, or another audio format · browser pilot limit ${L(O)}</small>
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
        <form class="derivative-form panel intervention-form" id="derivative-form" novalidate>
          <fieldset class="intervention-step">
            <legend class="intervention-legend"><span class="intervention-step-number">1</span> Source master &amp; derived file</legend>
            <div class="field-grid">
              <label>Source master passport<select id="derivative-passport" required><option value="">No fingerprinted passports yet</option></select><small class="intervention-hint" id="intervention-source-note">Create or import a fingerprinted passport first. Selecting it declares which source this copy came from.</small></label>
              <label class="dropzone" for="derivative-file">
                <input id="derivative-file" type="file" accept="audio/*" />
                <span class="drop-icon" aria-hidden="true">↗</span>
                <strong id="derivative-file-label">Choose the derived audio file</strong>
                <small>A separate version; the master is never replaced.</small>
              </label>
            </div>
            <label>Derivative label<input id="derivative-label" required placeholder="Performance remix, classroom edit, or listening copy" /></label>
            <label>Purpose / context<input id="derivative-purpose" required placeholder="What is this version for? Research, education, listening access…" /></label>
          </fieldset>
          <fieldset class="intervention-step">
            <legend class="intervention-legend"><span class="intervention-step-number">2</span> Processing type &amp; details</legend>
            <div class="field-grid">
              <label>Processing type<select id="intervention-processing"><option value="unknown">Unknown / not established</option><option value="ai">AI-assisted processing</option><option value="non-ai">Non-AI processing</option></select></label>
              ${z("intervention-tool","Tool name","Software or service used")}
            </div>
            <details class="intervention-details">
              <summary>Model, version &amp; settings — add known details</summary>
              <p class="intervention-hint">These start as Unknown. Not disclosed means information is withheld. Model is Not applicable only for explicitly non-AI processing.</p>
              <div class="field-grid">
                ${z("intervention-model","Model","Model name, if established")}
                ${z("intervention-version","Tool version","Exact version, if established")}
              </div>
              ${z("intervention-settings","Settings","Parameters, configuration, or a processing preset",!0)}
            </details>
            ${z("derivative-method","Processing instruction / method","What was requested or done? Include the exact prompt when available.",!0,"intervention-instruction-status")}
            <label>Change log<textarea id="derivative-changes" required rows="3" placeholder="What changed? Describe removal, repair, separation, generated material, or what has not yet been assessed."></textarea></label>
          </fieldset>
          <fieldset class="intervention-step">
            <legend class="intervention-legend"><span class="intervention-step-number">3</span> Permission scope</legend>
            <div class="field-grid">
              <label>Declared permission basis<select id="intervention-authority"><option value="unknown">Unknown / not established</option><option value="creator-owned">Creator-owned — declared</option><option value="permission">Permission obtained — declared</option><option value="public-domain">Public domain — declared</option><option value="no-permission">No permission</option></select></label>
              <label>Evidence / reference <span class="optional">optional</span><textarea id="intervention-evidence" rows="2" placeholder="License, agreement, date, or a private reference. Do not include sensitive documents."></textarea></label>
            </div>
            <label>Scope and limits<textarea id="intervention-scope" required rows="2" placeholder="What use is covered? If unknown, say what still needs permission or review."></textarea></label>
            <p class="intervention-notice">Unknown or No permission can be documented. Registration does not authorize processing, redistribution, or reuse, and the master's rights do not automatically cover this derivative.</p>
          </fieldset>
          <fieldset class="intervention-step">
            <legend class="intervention-legend"><span class="intervention-step-number">4</span> Review status</legend>
            <div class="field-grid">
              <label>Declared human review<select id="intervention-review-status"><option value="pending">Pending — not reviewed</option><option value="reviewed">Reviewed — not automatically approved</option><option value="rejected">Rejected by reviewer</option></select></label>
              <label>Reviewer / pseudonym<input id="intervention-reviewer" placeholder="Required for Reviewed or Rejected" /></label>
            </div>
            <p class="intervention-hint" id="intervention-review-help">Pending is the default. A name or note alone does not mark review complete.</p>
            <div class="field-grid">
              <label>Preserved features<textarea id="intervention-preserved" rows="2" placeholder="What stayed recognizable or unchanged? Leave blank if not assessed."></textarea></label>
              <label>Uncertainty / limitations<textarea id="intervention-uncertainty" rows="2" placeholder="Artifacts, missing context, or unresolved questions. Leave blank if not assessed."></textarea></label>
            </div>
            <p class="intervention-hint">Blank preserved-features and uncertainty fields are saved explicitly as “Not assessed.” They never mean “no changes” or “no uncertainty.”</p>
            <label>Human review note<textarea id="derivative-review" rows="3" placeholder="What did the reviewer compare and conclude? Required for Reviewed or Rejected."></textarea></label>
            <label class="check-row"><input id="derivative-master-check" type="checkbox" required /><span>I confirm that this is a separate derivative and the original master remains preserved. This statement is not a certificate of authenticity or a rights grant.</span></label>
          </fieldset>
          <button class="button primary full" id="derivative-button" type="submit">Register documented derivative</button>
          <p class="form-message" id="derivative-message" role="status" aria-live="polite"></p>
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
          ${He.map(e=>`
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
`;document.querySelectorAll("option:not([value])").forEach(e=>{e.value=e.textContent??""});const P=document.querySelector("#passport-form"),se=[...document.querySelectorAll('input[name="source-mode"]')],ee=document.querySelector("#audio-file"),ge=document.querySelector("#file-label"),fe=document.querySelector("#file-meta"),H=document.querySelector("#audio-preview"),W=document.querySelector("#rights-check"),Qe=document.querySelector("#source-file-fields"),w=document.querySelector("#form-message"),V=document.querySelector("#create-button"),m=document.querySelector("#live-receipt"),ye=document.querySelector("#auth-button"),Xe=document.querySelector("#auth-copy"),qe=document.querySelector("#project"),K=document.querySelector("#transfer-button"),S=document.querySelector("#verify-passport"),be=document.querySelector("#receipt-file"),we=document.querySelector("#verify-file"),Ie=document.querySelector("#verify-file-label"),U=document.querySelector("#verify-target"),y=document.querySelector("#verify-button"),g=document.querySelector("#verify-result"),x=document.querySelector("#derivative-form"),R=document.querySelector("#derivative-passport"),te=document.querySelector("#derivative-file"),Ze=document.querySelector("#derivative-file-label"),A=document.querySelector("#derivative-button"),N=document.querySelector("#derivative-message"),T=document.querySelector("#language"),Q=document.querySelector("#language-other"),E=document.querySelector("#collection"),X=document.querySelector("#collection-other"),J=document.querySelector("#rights-basis");let Y=null,d=null,h=null,f=null,u=null,l=C(),et=null;const G=()=>se.find(e=>e.checked)?.value==="missing"?"missing":"present",c=e=>document.querySelector(e),M=e=>document.querySelector(e),tt=(e=new Date)=>{const t=e.getTimezoneOffset()*6e4;return new Date(e.getTime()-t).toISOString().slice(0,10)},Se=(e,t)=>e.value==="other"?t.value.trim():e.value.trim(),it=()=>{const e=M("#rights").value.trim();return J.value==="other"?e:`${J.value}${e?` ${e}`:""}`},ae=e=>e.size>0&&e.size<=O,le=e=>e.size===0?`${e.name} is empty. Choose an audio file that contains data.`:`${e.name} is ${L(e.size)}. This browser pilot accepts files up to ${L(O)} to avoid freezing or losing work; preserve the original and use a smaller access copy here.`,_=(e,t)=>{const i=e.value==="other";t.hidden=!i,t.required=i,i||(t.value="")},Le=()=>{P.querySelectorAll(".is-invalid").forEach(e=>e.classList.remove("is-invalid")),P.querySelectorAll("[aria-invalid='true']").forEach(e=>e.removeAttribute("aria-invalid"))},ot=()=>{Le();const e=[],t=[],i=(r,s)=>{r.value.trim()||(e.push(s),t.push(r))};i(c("#title"),"title"),i(c("#creator"),"creator or contributor"),i(T,"language"),T.value==="other"&&i(Q,"other language"),i(c("#place"),"place"),i(E,"collection"),E.value==="other"&&i(X,"other collection"),i(M("#context"),"why the recording matters"),i(J,"rights or consent basis"),J.value==="other"&&i(M("#rights"),"rights explanation");const o=c("#evidence-url");if(o.value&&!ke(o.value)&&(e.push("a complete evidence URL beginning with http:// or https://"),t.push(o)),G()==="present"&&!Y&&(e.push("audio file"),t.push(ee)),G()==="present"&&!W.checked&&(e.push("permission confirmation"),t.push(W)),t.forEach(r=>{r.setAttribute("aria-invalid","true"),(r.closest("label, .field-control, .dropzone")??r).classList.add("is-invalid")}),!e.length)return!0;w.innerHTML=`<strong>The passport was not created yet.</strong><span>Please complete: ${a(e.join(", "))}.</span>`;const n=t[0];return(n.closest("label, .field-control, .dropzone")??n).scrollIntoView({behavior:"smooth",block:"center"}),window.setTimeout(()=>n.focus({preventScroll:!0}),350),!1},ie=()=>{u=null,K.disabled=!0,m.innerHTML='<div class="empty-receipt"><p class="eyebrow">Local record unavailable</p><h3>This passport is no longer available in this browser.</h3><p>No record was recreated or exported. Choose a currently saved passport below, or restore your JSON backup.</p><a href="#corpus">Choose a saved passport →</a></div>'},D=(e,t)=>{const i=e.source?`${a(e.source.filename)} · ${L(e.source.bytes)}`:"Original source missing · recovery record only",o=e.status==="fingerprinted"?"Fingerprint created":"Recovery lead",n=(e.derivatives??[]).map(r=>`
    <li>
      <details class="intervention-saved-detail" data-derivative-id="${a(r.derivativeId)}" ${r.derivativeId===t?"open":""}>
        <summary><strong>${a(r.label)}</strong><span>${a(r.purpose)} · ${a(r.source.filename)}</span></summary>
        ${Ye(r)}
      </details>
    </li>
  `).join("");m.innerHTML=`
    <div class="receipt-head"><span>Archival Passport</span><strong>${o}</strong></div>
    <h3>${a(e.title)}</h3>
    <p class="receipt-id">No. ${a(e.archiveId)}</p>
    <dl class="receipt-data">
      <div><dt>Creator</dt><dd>${a(e.creator)}</dd></div>
      <div><dt>Language / place</dt><dd>${a(e.language)} · ${a(e.place)}</dd></div>
      <div><dt>Recorded / released</dt><dd>${a(e.recordedOn||"Not yet established")}</dd></div>
      <div><dt>Source</dt><dd>${i}</dd></div>
      <div class="full-row"><dt>Cultural context</dt><dd>${a(e.context)}</dd></div>
      <div class="full-row"><dt>Source rights / consent declaration</dt><dd>${a(e.rightsBasis)}</dd></div>
      <div class="full-row"><dt>Evidence / recovery lead</dt><dd>${e.evidenceUrl&&ke(e.evidenceUrl)?`<a href="${a(e.evidenceUrl)}" target="_blank" rel="noopener noreferrer">${a(e.evidenceUrl)}</a>`:"Not recorded"}</dd></div>
      <div class="full-row"><dt>Integrity fingerprint</dt><dd class="mono">${a(I(e))}</dd></div>
    </dl>
    <div class="citation-box"><span>Research citation</span><p>${a(he(e))}</p></div>
    ${n?`<div class="derivative-receipts"><span>Documented derivatives</span><ul>${n}</ul></div>`:""}
    <div class="receipt-actions">
      <button class="button quiet" id="download-passport" type="button">Download JSON</button>
      <button class="button quiet" id="copy-citation" type="button">Copy citation</button>
    </div>
    <div class="receipt-actions module-next-actions"><a class="button quiet" href="./atlas/">Find it in Music Atlas →</a>${e.source?`<a class="button quiet" href="./restoration/?passport=${encodeURIComponent(e.archiveId)}#lab">Create an access copy →</a>`:""}</div>
    <button class="text-button delete-local" id="delete-passport" type="button">Delete this local record</button>
    <p class="receipt-foot">Saved only in this browser. Export it to create a real backup.</p>
  `,m.tabIndex=-1,document.querySelector("#download-passport").addEventListener("click",()=>{const r=C().find(s=>s.archiveId===e.archiveId);if(!r){ie();return}u=r,D(r,t),Be(r)}),document.querySelector("#copy-citation").addEventListener("click",async r=>{const s=r.currentTarget,p=C().find(b=>b.archiveId===e.archiveId);if(!p){ie();return}try{await navigator.clipboard.writeText(he(p)),s.textContent="Citation copied"}catch{s.textContent="Select and copy the citation above"}}),document.querySelector("#delete-passport").addEventListener("click",()=>{window.confirm(`Delete “${e.title}” from this browser? Export the JSON first if you need a backup.`)&&(l=je(e.archiveId),u=null,m.innerHTML=`
      <div class="empty-receipt">
        <p class="eyebrow">Local record deleted</p>
        <h3>The passport was removed from this browser.</h3>
        <p>The audio file was never stored here. You can create or import another passport at any time.</p>
      </div>
    `,k())})},k=()=>{const e=ze(l);document.querySelector("#corpus-stats").innerHTML=`
    <article><strong>${e.recordings}</strong><span>local records</span></article>
    <article><strong>${e.fingerprinted}</strong><span>fingerprinted sources</span></article>
    <article><strong>${e.recoveryLeads}</strong><span>recovery leads</span></article>
    <article><strong>${e.languages}</strong><span>languages</span></article>
    <article><strong>${e.dateSpan}</strong><span>date span</span></article>
  `;const t=document.querySelector("#corpus-list");t.innerHTML=l.length?`<div class="corpus-table" role="table">
        <div class="corpus-row corpus-header" role="row"><span>Recording</span><span>Language</span><span>Source status</span><span>Passport</span></div>
        ${l.map(s=>`
          <div class="corpus-row" role="row">
            <span><strong>${a(s.title)}</strong><small>${a(s.creator)} · ${a(s.recordedOn||"date unknown")}${s.derivatives?.length?` · ${s.derivatives.length} derivative${s.derivatives.length===1?"":"s"}`:""}</small></span>
            <span>${a(s.language)}</span>
            <span class="status-chip ${s.status}">${s.status==="fingerprinted"?"Fingerprint recorded":"Recovery lead"}</span>
            <span><button class="text-button view-passport" data-id="${a(s.archiveId)}" type="button">View receipt</button></span>
          </div>
        `).join("")}
      </div>`:'<div class="empty-corpus"><strong>No local passports yet.</strong><p>Load the safe demo above to create and verify the first real record—without uploading anything.</p><a href="#create">Create the first passport →</a></div>',t.querySelectorAll(".view-passport").forEach(s=>{s.addEventListener("click",()=>{const p=l.find(b=>b.archiveId===s.dataset.id);p&&(u=p,D(p),document.querySelector("#create")?.scrollIntoView({behavior:"smooth"}))})});const i=l.filter(s=>s.source),o=S.value,n=R.value;S.innerHTML=i.length?`<option value="">Choose a local passport</option>${i.map(s=>`<option value="${a(s.archiveId)}">${a(s.title)} — ${a(I(s))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',R.innerHTML=i.length?`<option value="">Choose a fingerprinted source master</option>${i.map(s=>`<option value="${a(s.archiveId)}">${a(s.title)} — ${a(I(s))}</option>`).join("")}`:'<option value="">No fingerprinted passports yet</option>',S.value=o,R.value=n;const r=l.find(s=>s.archiveId===n);document.querySelector("#intervention-source-note").textContent=r?.source?`Declared source: ${r.source.filename} · SHA-256 ${I(r)}. This link does not prove how an external tool processed the file.`:"Create or import a fingerprinted passport first. Selecting it declares which source this copy came from.",c("#export-json").disabled=l.length===0,c("#export-csv").disabled=l.length===0},rt=()=>{if(!u)return;const e=l.find(i=>i.archiveId===u.archiveId);if(!e){ie();return}if(JSON.stringify(e)===JSON.stringify(u))return;const t=new Set([...m.querySelectorAll("details[open][data-derivative-id]")].map(i=>i.dataset.derivativeId));u=e,D(e);for(const i of m.querySelectorAll("details[data-derivative-id]"))t.has(i.dataset.derivativeId)&&(i.open=!0)},Te=e=>ae(e)?(Y=e,ge.textContent=e.name,fe.textContent=`${L(e.size)} · ${e.type||"audio"}`,H.src&&URL.revokeObjectURL(H.src),H.src=URL.createObjectURL(e),H.hidden=!1,!0):(Y=null,ge.textContent="Choose an audio file",fe.textContent=`Browser pilot limit ${L(O)}`,H.hidden=!0,w.textContent=le(e),!1),ce=()=>{const e=G()==="present";Qe.hidden=!e,W.required=e,w.textContent=e?"A source file will be fingerprinted locally before the passport is saved.":"This will be clearly marked as a metadata-only recovery record. No fingerprint will be invented."};se.forEach(e=>e.addEventListener("change",ce));T.addEventListener("change",()=>_(T,Q));E.addEventListener("change",()=>_(E,X));P.addEventListener("input",e=>{const t=e.target;t.removeAttribute("aria-invalid"),t.closest("label, .field-control, .dropzone")?.classList.remove("is-invalid")});ee.addEventListener("change",()=>{const e=ee.files?.[0];e&&Te(e)});document.querySelector("#load-demo").addEventListener("click",()=>{se[0].checked=!0,ce(),Te($e()),c("#title").value="Safe synthetic archive demo",c("#creator").value="Unmute the Archive",T.value="Instrumental / no linguistic content",_(T,Q),E.value="Unassigned research record",_(E,X),c("#evidence-url").value="",c("#place").value="Generated locally in the browser",c("#recorded-on").value=tt(),M("#context").value="A four-second rights-clear synthetic clip that demonstrates passport creation, fingerprinting, corpus storage, export, and later verification.",J.value="I created or performed this recording and control this source file.",M("#rights").value="Generated locally by this application. No third-party recording or performance is included.",W.checked=!0,Le(),w.textContent="Safe demo loaded. Select “Create passport → see result” to generate it now.",P.scrollIntoView({behavior:"smooth",block:"start"})});document.querySelector("#quick-demo").addEventListener("click",()=>{document.querySelector("#load-demo").click(),P.requestSubmit()});P.addEventListener("submit",async e=>{if(e.preventDefault(),V.disabled)return;const t=G();if(!ot())return;let i;try{i=_e(t,Y,c("#rights-check").checked,{collection:Se(E,X),title:c("#title").value.trim(),creator:c("#creator").value.trim(),language:Se(T,Q),place:c("#place").value.trim(),recordedOn:c("#recorded-on").value||void 0,context:M("#context").value.trim(),rightsBasis:it(),evidenceUrl:c("#evidence-url").value.trim()||void 0})}catch(o){w.textContent=o instanceof Error?o.message:"The passport details could not be captured.";return}V.disabled=!0,V.textContent=t==="present"?"Fingerprinting every byte…":"Documenting recovery record…",w.textContent="Building the archival passport locally…";try{const o=i.file?await re(i.file):void 0;u=Ke(i,o);const n=u.source;l=Pe(u),D(u),k(),w.textContent=n?"Passport saved. You can now verify this file, export the record, or optionally transfer it to Audiotool.":"Recovery record saved. It remains explicitly unverified until a source file is recovered.",m.classList.remove("result-ready"),window.requestAnimationFrame(()=>m.classList.add("result-ready")),window.matchMedia("(max-width: 900px)").matches&&m.scrollIntoView({behavior:"smooth",block:"start"}),K.disabled=!(et&&n&&qe.value)}catch(o){w.textContent=o instanceof Error?o.message:"The passport could not be created."}finally{V.disabled=!1,V.textContent="Create passport → see result"}});te.addEventListener("change",()=>{f=te.files?.[0]??null,f&&!ae(f)&&(N.textContent=le(f),f=null),Ze.textContent=f?`${f.name} · ${L(f.size)}`:"Choose the derived audio file"});R.addEventListener("change",()=>k());x.addEventListener("change",()=>ne(x));x.addEventListener("input",e=>{e.target.removeAttribute("aria-invalid")});ne(x);const xe=e=>{if(N.textContent=e instanceof Error?e.message:"The derivative could not be registered.",e instanceof v){const t=x.querySelector(`#${e.fieldId}`),i=t?.closest("details");i&&(i.open=!0),t?.setAttribute("aria-invalid","true"),t?.focus(),t?.scrollIntoView({behavior:"smooth",block:"center"})}};x.addEventListener("submit",async e=>{if(e.preventDefault(),A.disabled)return;ne(x);const t=C().find(o=>o.archiveId===R.value);if(!t?.source){N.textContent="Choose a fingerprinted source master.",R.focus();return}if(!f){N.textContent="Choose the derived audio file.",te.focus();return}let i;try{i=Je(t,f,Ge(x))}catch(o){xe(o);return}A.disabled=!0,A.textContent="Fingerprinting derivative…",N.textContent="Linking the derivative to its preserved master locally…";try{const o=await re(i.file),n=C().find(s=>s.archiveId===i.master.archiveId),r=We(i,n,o);l=Ce(r),u=r,D(r,r.derivatives?.at(-1)?.derivativeId),k(),N.textContent="Derivative registered. Export the updated passport JSON to preserve the intervention record.",A.textContent="Derivative registered",m.classList.add("result-ready"),m.focus({preventScroll:!0}),m.scrollIntoView({behavior:"smooth",block:"start"})}catch(o){xe(o),A.textContent="Register documented derivative"}finally{A.disabled=!1}});S.addEventListener("change",()=>{h=l.find(e=>e.archiveId===S.value)??null,U.textContent=h?`Comparing against “${h.title}” · ${I(h)}`:"No passport selected.",y.disabled=!(h?.source&&d),g.hidden=!0});be.addEventListener("change",async()=>{const e=be.files?.[0];if(e)try{const t=JSON.parse(await e.text());if(!oe(t)||!t.source?.sha256)throw new Error("This is not a complete, compatible fingerprinted Archive Passport receipt.");h=t,S.value="",U.textContent=`Imported “${t.title}” · ${I(t)}`,y.disabled=!d,g.hidden=!0}catch(t){h=null,y.disabled=!0,g.hidden=!0,U.textContent=t instanceof Error?t.message:"Receipt could not be read."}});we.addEventListener("change",()=>{d=we.files?.[0]??null,d&&!ae(d)&&(U.textContent=le(d),d=null),Ie.textContent=d?d.name:"Choose the audio file to check",y.disabled=!(h?.source&&d),g.hidden=!0});document.querySelector("#verify-demo").addEventListener("click",()=>{d=$e(),Ie.textContent=d.name;const e=l.find(t=>t.title==="Safe synthetic archive demo"&&t.source);e?(h=e,S.value=e.archiveId,U.textContent=`Comparing against “${e.title}” · ${I(e)}`):(h=null,S.value="",U.textContent="Create the safe demo passport in Step 01 first; then this file can prove the match."),y.disabled=!(h?.source&&d),g.hidden=!0});y.addEventListener("click",async()=>{if(!h?.source||!d)return;const e=structuredClone(h),t=d;y.disabled=!0,y.textContent="Comparing every byte…";try{const i=await re(t),o=ve(i,e.source.sha256);g.hidden=!1,g.className=`verify-result ${o?"match":"mismatch"}`,g.innerHTML=o?`<strong>Exact match.</strong><p>This file is byte-for-byte identical to the source in the passport.</p><code>${a(i)}</code>`:`<strong>Not the same file.</strong><p>The bytes differ. This may be an edit, re-export, transcoding, or another recording.</p><code>Expected ${a(e.source.sha256)}<br />Found ${a(i)}</code>`;const n=C().find(r=>r.archiveId===e.archiveId&&ve(r.source?.sha256,e.source.sha256));o&&n&&(n.events.push({type:"verified",at:new Date().toISOString(),note:`Matched ${t.name}`}),l=Ce(n),k())}catch{g.hidden=!1,g.className="verify-result mismatch",g.innerHTML="<strong>Comparison could not finish.</strong><p>The browser did not change or upload the file. Try a smaller local copy or reload the tool.</p>"}finally{y.disabled=!1,y.textContent="Compare every byte"}});document.querySelector("#export-json").addEventListener("click",()=>Ue(l));document.querySelector("#export-csv").addEventListener("click",()=>Me(l));c("#import-corpus-button").addEventListener("click",()=>c("#import-corpus").click());c("#import-corpus").addEventListener("change",async e=>{const t=e.currentTarget,i=t.files?.[0];if(!i)return;const o=document.querySelector("#import-corpus-status");try{const n=Oe(await i.text());l=C(),k(),o.textContent=n?`${n} passport(s) imported. Choose a receipt below to inspect it.`:"These passports are already saved. No duplicates were added."}catch(n){o.textContent=n instanceof Error?n.message:"The backup could not be imported."}t.value=""});const nt=async()=>{{Xe.textContent="Audiotool developer registration is not connected in this build. Passport, verification, and corpus features are fully functional.",ye.textContent="Integration pending",ye.disabled=!0;return}};qe.addEventListener("change",()=>{K.disabled=!0});K.addEventListener("click",async()=>{});ce();De();k();window.addEventListener("storage",()=>{l=C(),k(),rt()});const st=new URLSearchParams(window.location.search).get("passport"),Z=l.find(e=>e.archiveId===st);Z&&(u=Z,D(Z));nt();Fe();
