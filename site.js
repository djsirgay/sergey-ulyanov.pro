(()=>{
  const boot=document.querySelector('[data-culture-boot]');
  if(boot){
    const bootKey='sergey-cultural-boot-seen-v3';
    let seen=false;
    try{seen=sessionStorage.getItem(bootKey)==='1'}catch(error){}
    const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish=()=>{
      if(!boot.isConnected)return;
      document.documentElement.classList.remove('boot-active');
      boot.classList.add('is-leaving');
      setTimeout(()=>boot.remove(),360);
    };
    if(seen||reduceMotion||location.pathname.startsWith('/research/'))boot.remove();
    else{
      document.documentElement.classList.add('boot-active');
      const rain=boot.querySelector('[data-boot-rain]');
      const glyphs=['◆◇╳┼▰▱','◇◆┼╳▱▰','╳┼◇◆▰▱','▰◇┼◆╳▱','┼╳◆◇▱▰'];
      if(rain){
        for(let index=0;index<24;index+=1){
          const column=document.createElement('span');
          column.textContent=Array.from({length:12},(_,row)=>glyphs[(index+row)%glyphs.length]).join('\n');
          column.style.setProperty('--column',String(index));
          column.style.setProperty('--delay',`${-(index%7)*.17}s`);
          column.style.setProperty('--speed',`${1.05+(index%5)*.13}s`);
          rain.appendChild(column);
        }
      }
      try{sessionStorage.setItem(bootKey,'1')}catch(error){}
      boot.querySelector('[data-boot-skip]')?.addEventListener('click',finish);
      setTimeout(finish,3200);
    }
  }

  const GA4_ID='G-RQBHK9BCRX';
  const consentKey='sergey-portfolio-analytics-consent';
  const consent=document.getElementById('analytics-consent');
  const loadAnalytics=()=>{
    if(window.__sergeyAnalyticsLoaded)return;
    window.__sergeyAnalyticsLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
    window.gtag('js',new Date());
    window.gtag('config',GA4_ID,{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});
    const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;document.head.appendChild(script);
  };
  let choice='';
  try{choice=localStorage.getItem(consentKey)||''}catch(error){}
  if(choice==='accepted')loadAnalytics();
  else if(!choice&&consent){consent.hidden=false;document.body.classList.add('consent-active')}
  consent?.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{
    const accepted=button.dataset.consent==='accept';
    try{localStorage.setItem(consentKey,accepted?'accepted':'declined')}catch(error){}
    consent.hidden=true;document.body.classList.remove('consent-active');if(accepted)loadAnalytics();
  }));

  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>20),{passive:true});
  const reveal=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
    reveal.forEach(element=>observer.observe(element));
  }else reveal.forEach(element=>element.classList.add('visible'));

  const track=(name,params={})=>{
    const detail={event:name,page_path:location.pathname,...params};
    window.dispatchEvent(new CustomEvent('sergey:analytics',{detail}));
    if(window.__sergeyAnalyticsLoaded&&typeof window.gtag==='function')window.gtag('event',name,{page_path:location.pathname,...params});
  };
  const classifyLink=element=>{
    if(element.dataset.track)return element.dataset.track;
    const href=element.getAttribute('href')||'';
    if(href.startsWith('/case-studies/'))return 'case_open';
    if(href==='/hire/'||href==='/work/'||href==='/research/'||href==='/press/')return 'route_open';
    if(href.startsWith('/evidence/'))return 'evidence_open';
    if(element.closest('.press-card'))return 'press_open';
    if(/drive\.google\.com/.test(href)&&/résumé|resume/i.test(element.textContent||''))return 'resume_open';
    if(href.startsWith('mailto:'))return 'contact_open';
    return 'link_click';
  };
  document.querySelectorAll('a[href],button[data-track]').forEach(element=>element.addEventListener('click',()=>track(classifyLink(element),{
    label:(element.textContent||'').trim().replace(/\s+/g,' ').slice(0,100),
    href:element.href||'',
    link_domain:element.href?new URL(element.href,location.href).hostname:''
  })));

  const depthMarks=[25,50,75,90],seenDepth=new Set();
  const reportDepth=()=>{
    const available=document.documentElement.scrollHeight-innerHeight;
    if(available<=0)return;
    const depth=Math.min(100,Math.round(scrollY/available*100));
    depthMarks.forEach(mark=>{if(depth>=mark&&!seenDepth.has(mark)){seenDepth.add(mark);track('scroll_depth',{percent_scrolled:mark})}});
  };
  addEventListener('scroll',reportDepth,{passive:true});

  const setupRail=rail=>{
    const name=rail.dataset.rail,items=[...rail.children],current=document.querySelector(`[data-current="${name}"]`);
    const previous=[...document.querySelectorAll(`[data-prev="${name}"]`)],next=[...document.querySelectorAll(`[data-next="${name}"]`)];
    if(!items.length)return;
    let active=0,pending=false;
    const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
    const positions=()=>items.map(item=>item.getBoundingClientRect().left-rail.getBoundingClientRect().left+rail.scrollLeft);
    const update=()=>{
      pending=false;
      const max=Math.max(0,rail.scrollWidth-rail.clientWidth),left=rail.scrollLeft,points=positions();
      active=points.reduce((best,point,index)=>Math.abs(point-left)<Math.abs(points[best]-left)?index:best,0);
      if(left>=max-3&&max>3)active=items.length-1;
      if(current)current.textContent=String(active+1).padStart(2,'0');
      const status=document.querySelector(`[data-rail-status="${name}"]`);
      if(status)status.hidden=max<=3;
      previous.forEach(button=>button.disabled=left<=3);
      next.forEach(button=>button.disabled=left>=max-3);
      [...previous,...next].forEach(button=>{button.parentElement.hidden=max<=3});
    };
    const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};
    const go=direction=>{
      const left=rail.scrollLeft,points=positions();
      const target=direction>0?points.find(point=>point>left+5):points.findLast(point=>point<left-5);
      rail.scrollTo({left:target??(direction>0?rail.scrollWidth:0),behavior:reduced()?'auto':'smooth'});
      track(`rail_${name}_${direction>0?'next':'prev'}`);
    };
    previous.forEach(button=>button.addEventListener('click',()=>go(-1)));
    next.forEach(button=>button.addEventListener('click',()=>go(1)));
    rail.addEventListener('keydown',event=>{
      if(event.target!==rail)return;
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(event.key==='ArrowRight'?1:-1)}
      else if(event.key==='Home'||event.key==='End'){event.preventDefault();rail.scrollTo({left:event.key==='Home'?0:rail.scrollWidth,behavior:reduced()?'auto':'smooth'})}
    });
    rail.addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule,{passive:true});
    if('ResizeObserver' in window)new ResizeObserver(schedule).observe(rail);
    update();
  };
  document.querySelectorAll('[data-rail]').forEach(setupRail);

  const form=document.getElementById('inquiry');
  if(form){
    const status=document.getElementById('inquiry-status');
    form.addEventListener('focusin',()=>track('inquiry_start'),{once:true});
    form.addEventListener('submit',async event=>{
      event.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form);if(String(data.get('_honey')||''))return;
      const button=form.querySelector('button[type=submit]');button.disabled=true;
      if(status)status.textContent='Sending…';
      data.append('_subject',`Website inquiry: ${String(data.get('inquiry_type')||'New opportunity')} — ${String(data.get('name')||'Visitor')}`);
      data.append('_template','table');data.append('_captcha','false');
      try{
        const response=await fetch('https://formsubmit.co/ajax/5fbc3aa60c7f89f0edb8afa14702e228',{method:'POST',headers:{Accept:'application/json'},body:data});
        if(!response.ok)throw new Error('Submission failed');
        const result=await response.json();
        if(result.success!==true&&result.success!=='true')throw new Error('Submission was not confirmed');
        form.reset();if(status)status.textContent='Thank you — your inquiry has been sent.';track('inquiry_sent',{inquiry_type:String(data.get('inquiry_type')||'')});
      }catch(error){
        if(status)status.innerHTML='The secure form could not send. Please <a href="mailto:ulyanoow@gmail.com">email Sergéy directly</a>.';
      }finally{button.disabled=false}
    });
  }
})();
