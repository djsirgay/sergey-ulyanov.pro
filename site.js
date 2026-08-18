(()=>{
  const boot=document.querySelector('[data-culture-boot]');
  if(boot){
    const bootKey='sergey-cultural-boot-seen-v2';
    let seen=false;
    try{seen=sessionStorage.getItem(bootKey)==='1'}catch(error){}
    const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish=()=>{
      if(!boot.isConnected)return;
      document.documentElement.classList.remove('boot-active');
      boot.classList.add('is-leaving');
      setTimeout(()=>boot.remove(),360);
    };
    if(seen||reduceMotion)boot.remove();
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
  else if(!choice&&consent)consent.hidden=false;
  consent?.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{
    const accepted=button.dataset.consent==='accept';
    try{localStorage.setItem(consentKey,accepted?'accepted':'declined')}catch(error){}
    consent.hidden=true;if(accepted)loadAnalytics();
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
  document.querySelectorAll('a[href],button[data-track]').forEach(element=>element.addEventListener('click',()=>track(element.dataset.track||'link_click',{label:(element.textContent||'').trim().slice(0,100),href:element.href||''})));

  const setupRail=rail=>{
    const name=rail.dataset.rail,items=[...rail.children],current=document.querySelector(`[data-current="${name}"]`);
    if(!items.length)return;
    const update=()=>{let best=0,min=Infinity,left=rail.getBoundingClientRect().left;items.forEach((item,index)=>{const distance=Math.abs(item.getBoundingClientRect().left-left);if(distance<min){min=distance;best=index}});if(current)current.textContent=String(best+1).padStart(2,'0')};
    const go=direction=>{const gap=parseFloat(getComputedStyle(rail).gap||0);rail.scrollBy({left:direction*(items[0].getBoundingClientRect().width+gap),behavior:'smooth'});track(`rail_${name}_${direction>0?'next':'prev'}`)};
    document.querySelectorAll(`[data-prev="${name}"]`).forEach(button=>button.addEventListener('click',()=>go(-1)));
    document.querySelectorAll(`[data-next="${name}"]`).forEach(button=>button.addEventListener('click',()=>go(1)));
    rail.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});update();
  };
  document.querySelectorAll('[data-rail]').forEach(setupRail);

  const form=document.getElementById('inquiry');
  if(form){
    const status=document.getElementById('inquiry-status');
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
        form.reset();if(status)status.textContent='Thank you — your inquiry has been sent.';track('inquiry_sent',{inquiry_type:String(data.get('inquiry_type')||'')});
      }catch(error){
        if(status)status.innerHTML='The secure form could not send. Please <a href="mailto:ulyanoow@gmail.com">email Sergéy directly</a>.';
      }finally{button.disabled=false}
    });
  }
})();
