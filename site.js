(()=>{
  const GA4_ID='G-RQBHK9BCRX';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
  window.gtag('js',new Date());
  window.gtag('config',GA4_ID);
  if(!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA4_ID}"]`)){
    const analyticsScript=document.createElement('script');
    analyticsScript.async=true;
    analyticsScript.src=`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.append(analyticsScript);
  }
  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>20),{passive:true});
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  const track=(name,params={})=>{
    const event={event:'portfolio_interaction',interaction:name,page_path:location.pathname,...params};
    window.dataLayer=window.dataLayer||[];window.dataLayer.push(event);
    window.dispatchEvent(new CustomEvent('sergey:analytics',{detail:event}));
    if(typeof window.gtag==='function') window.gtag('event',name,params);
  };
  document.querySelectorAll('a[href],button[data-track]').forEach(el=>el.addEventListener('click',()=>track(el.dataset.track||'link_click',{label:(el.textContent||'').trim(),href:el.href||''})));
  const setupRail=(rail)=>{
    const name=rail.dataset.rail,items=[...rail.children],current=document.querySelector(`[data-current="${name}"]`);
    if(!items.length)return;
    const gap=()=>parseFloat(getComputedStyle(rail).gap||0);
    const go=dir=>{const width=items[0].getBoundingClientRect().width+gap();rail.scrollBy({left:dir*width,behavior:'smooth'});track(`rail_${name}_${dir>0?'next':'prev'}`);};
    document.querySelectorAll(`[data-prev="${name}"]`).forEach(b=>b.addEventListener('click',()=>go(-1)));
    document.querySelectorAll(`[data-next="${name}"]`).forEach(b=>b.addEventListener('click',()=>go(1)));
    const update=()=>{let best=0,min=Infinity;const left=rail.getBoundingClientRect().left;items.forEach((item,i)=>{const d=Math.abs(item.getBoundingClientRect().left-left);if(d<min){min=d;best=i}});if(current)current.textContent=String(best+1).padStart(2,'0')};
    rail.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});update();
    /* Touch and pen stay fully native: Safari can then arbitrate horizontal
       swipes without trapping the page's vertical scroll. Mouse drag keeps
       the desktop interaction without pointer-capturing mobile gestures. */
    let down=false,startX=0,startScroll=0;
    rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;down=true;startX=e.clientX;startScroll=rail.scrollLeft;rail.classList.add('dragging');rail.setPointerCapture?.(e.pointerId)});
    rail.addEventListener('pointermove',e=>{if(!down||e.pointerType!=='mouse')return;rail.scrollLeft=startScroll-(e.clientX-startX)});
    const stop=()=>{down=false;rail.classList.remove('dragging')};rail.addEventListener('pointerup',stop);rail.addEventListener('pointercancel',stop);
    rail.addEventListener('wheel',e=>{const horizontalIntent=Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey;if(!horizontalIntent||rail.scrollWidth<=rail.clientWidth)return;const delta=e.shiftKey&&Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;const atStart=rail.scrollLeft<=1&&delta<0,atEnd=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-1&&delta>0;if(!atStart&&!atEnd){e.preventDefault();rail.scrollLeft+=delta}},{passive:false});
  };
  document.querySelectorAll('[data-rail]').forEach(setupRail);
  document.querySelectorAll('#work .case').forEach(card=>{
    const link=card.querySelector('.case-link');if(!link)return;
    card.addEventListener('click',e=>{if(!e.target.closest('a,button')&&matchMedia('(min-width:641px)').matches){track(card.dataset.track||'case_open');window.open(link.href,'_blank','noopener,noreferrer')}});
    card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a,button')){e.preventDefault();track(card.dataset.track||'case_open');window.open(link.href,'_blank','noopener,noreferrer')}});
  });
  const inquiryForm=document.getElementById('inquiry');
  if(inquiryForm){
    const inquiryStatus=document.getElementById('inquiry-status');
    inquiryForm.addEventListener('submit',event=>{
      event.preventDefault();
      if(!inquiryForm.reportValidity())return;
      const data=new FormData(inquiryForm);
      const name=String(data.get('name')||'').trim();
      const email=String(data.get('email')||'').trim();
      const organization=String(data.get('organization')||'').trim();
      const inquiryType=String(data.get('inquiry_type')||'Website inquiry').trim();
      const message=String(data.get('message')||'').trim();
      const subject=`Website inquiry: ${inquiryType} — ${name}`;
      const body=[
        'Hi Sergéy,',
        '',
        message,
        '',
        '—',
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization||'Not provided'}`,
        `Inquiry type: ${inquiryType}`
      ].join('\n');
      if(inquiryStatus)inquiryStatus.textContent='Opening your email app with the message ready…';
      track('inquiry_form_prepare',{inquiry_type:inquiryType});
      location.href=`mailto:ulyanoow@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

})();
