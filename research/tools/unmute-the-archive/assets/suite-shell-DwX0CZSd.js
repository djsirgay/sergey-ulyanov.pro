const s=e=>String(e??"").replace(/[&<>'"]/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[a]),r=e=>`
  <header class="suite-header" id="top">
    <nav class="suite-primary shell" aria-label="Unmute Belarus primary navigation">
      <a class="suite-brand" href="/research/system/"><span>U/A</span><strong>Unmute Belarus</strong></a>
      <div><a href="/research/">Research</a><a href="/research/system/">System map</a><a href="/research/tools/unmute-the-archive/#guide">Guide</a></div>
    </nav>
    <nav class="suite-modules" aria-label="Research modules">
      <div class="shell">
        <a class="${e==="passport"?"current":""}" href="/research/tools/unmute-the-archive/"><b>01</b><span>Archive Passport<small>Live</small></span></a>
        <a class="${e==="atlas"?"current":""}" href="/research/tools/unmute-the-archive/atlas/"><b>02</b><span>Music Atlas<small>Live pilot</small></span></a>
        <a class="${e==="restoration"?"current":""}" href="/research/tools/unmute-the-archive/restoration/"><b>03</b><span>Restoration Lab<small>Live pilot</small></span></a>
        <a href="/research/tools/unmute-the-archive/atlas/#analytics"><b>DATA</b><span>Corpus &amp; analytics<small>Local + reviewer set</small></span></a>
      </div>
    </nav>
  </header>
`,t=()=>`
  <footer class="suite-footer shell">
    <a class="suite-brand" href="/research/system/"><span>U/A</span><strong>Unmute Belarus</strong></a>
    <p>Practice-led research prototype · local-first · source-visible · community-correctable</p>
    <a href="/research/">Sergéy Ulyanov research ↗</a>
  </footer>
`,l=e=>({high:"High evidence",medium:"Developing evidence",recovery:"Recovery lead"})[e];export{t as a,l as c,s as e,r as s};
