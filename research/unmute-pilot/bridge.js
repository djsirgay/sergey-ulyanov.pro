// Explicit navigation only: never forward old queries, invitation IDs or fragments.
// This controller does not access storage, start the legacy app or contact a service.
(()=>{
 const lang=new URLSearchParams(location.search).get('lang')==='be'?'be':'en';
 const be={
  home:'← Галоўная даследавання',eyebrow:'Музычны пілот пераехаў',title:'Гучна · Пошук беларускай музыкі',
  intro:'Гэта спасылка на ранейшы прататып. Цяперашняе тэставанне музычнага пошуку праходзіць на асобным сайце па запрашэннях. Скарыстайцеся словам для ўваходу і паролем, якія даслаў Сяргей.',
  login:'Увайсці ў цяперашні пілот ↗',
  privacy:'Гэтая старонка не запускае музычны пошук, не спампоўвае мадэль ШІ і не адпраўляе вашы ранейшыя нататкі на новы сайт. Перад удзелам азнаёмцеся з актуальнай інфармацыяй пра прыватнасць у новым пілоце.',
  recoveryLabel:'Ужо карысталіся ранейшай версіяй?',recoveryTitle:'Захавайце сваю працу.',
  recoveryIntro:'Ранейшыя калекцыі і водгукі застаюцца ў тым жа браўзеры і на тым жа сайце, дзе вы іх захавалі. Яны не пераносяцца аўтаматычна ў новы пілот. Каб іх экспартаваць, выкарыстоўвайце тую ж прыладу і профіль браўзера.',
  collection:'Адкрыць ранейшыя калекцыі',study:'Адкрыць ранейшыя водгукі',
  recoveryNote:'Гэтыя спасылкі адкрываюць гістарычную версію для аднаўлення даных, а не цяперашняе тэставанне. Экспартуйце там калекцыю або ўсе захаваныя водгукі; пры жаданні самі дашліце файлы водгукаў Сяргею. Пераезд нічога не выдаляе.',
  back:'← Да цяперашняга пілота і аднаўлення даных'
 };
 document.documentElement.lang=lang;
 if(lang==='be')document.querySelectorAll('[data-bridge-text]').forEach(node=>{if(be[node.dataset.bridgeText])node.textContent=be[node.dataset.bridgeText];});
 const links={login:'https://unmute.sergey-ulyanov.pro/login/?lang='+lang,collection:'./legacy.html?lang='+lang+'#collection',study:'./legacy.html?lang='+lang+'#study',back:'./?lang='+lang,home:'/research/?lang='+lang};
 document.querySelectorAll('[data-bridge-link]').forEach(link=>{if(links[link.dataset.bridgeLink])link.href=links[link.dataset.bridgeLink];});
 document.querySelectorAll('[data-bridge-lang]').forEach(link=>link.setAttribute('aria-current',String(link.dataset.bridgeLang===lang)));
})();
