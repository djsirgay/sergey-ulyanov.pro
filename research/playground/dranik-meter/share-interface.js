import {CANONICAL_METER_URL,createShareCardModel,drawShareCard,cardToPng,sharePreparedCard} from './share-card.js';
export const shareMessages={
 en:{title:'Take your potato portrait.',intro:'A little Belarusian absurdity for your feed. Pick a format, then save or share.',post:'Post · 1080 × 1350',story:'Story · 1080 × 1920',download:'Download PNG',share:'Share / save',copy:'Copy calculator link',privacy:'The image contains your result, not the kg/lb you entered. The count still reveals your approximate weight. Share only if you are comfortable with that.',instructions:'Nothing is posted automatically. Choose Instagram if it appears in your share menu, or save the PNG and upload it yourself. Text in an image is not clickable: add a Link sticker to your Instagram Story using the calculator link.',preparing:'Preparing your image in this tab…',ready:'Image ready. You decide what to share.',failed:'Image export is unavailable in this browser. You can still copy the calculator link.',copied:'Calculator link copied — no personal result included.',copyFailed:'Could not copy automatically. Copy the visible calculator link below.',downloaded:'PNG download started. You can upload it to Instagram yourself.',shared:'Shared through your device’s menu.',cancelled:'Sharing cancelled. Nothing was downloaded.',preview:'Preview of the image to download'},
 be:{title:'Забяры свой бульбяны партрэт.',intro:'Крыху беларускай абсурднасці для стужкі. Выберы фармат, потым захавай або падзяліся.',post:'Допіс · 1080 × 1350',story:'Сторыс · 1080 × 1920',download:'Спампаваць PNG',share:'Падзяліцца / захаваць',copy:'Скапіяваць спасылку',privacy:'На выяве — вынік, а не ўведзеныя кг ці фунты. Але па колькасці можна вызначыць прыблізную вагу. Дзяліся, толькі калі табе гэта камфортна.',instructions:'Нічога не публікуецца аўтаматычна. Выберы Instagram у меню, калі ён там ёсць, або захавай PNG і загрузі самастойна. Тэкст на выяве не націскаецца: дадай стыкер са спасылкай на калькулятар у Instagram Story.',preparing:'Рыхтуем выяву ў гэтай укладцы…',ready:'Выява гатовая. Ты вырашаеш, чым дзяліцца.',failed:'Гэты браўзер не змог стварыць выяву. Спасылку на калькулятар усё яшчэ можна скапіяваць.',copied:'Спасылка скапіяваная — без асабістага выніку.',copyFailed:'Не ўдалося скапіяваць аўтаматычна. Скапіюй бачную спасылку ніжэй.',downloaded:'Спампоўванне PNG пачалося. Яго можна самастойна загрузіць у Instagram.',shared:'Перададзена праз меню тваёй прылады.',cancelled:'Абмен скасаваны. Нічога не спампавана.',preview:'Папярэдні прагляд выявы для спампоўвання'},
 ru:{title:'Забери свой картофельный портрет.',intro:'Немного белорусского абсурда для ленты. Выбери формат, затем сохрани или поделись.',post:'Пост · 1080 × 1350',story:'Сторис · 1080 × 1920',download:'Скачать PNG',share:'Поделиться / сохранить',copy:'Скопировать ссылку',privacy:'На картинке — результат, а не введённые кг или фунты. Но по количеству можно определить примерный вес. Делись, только если тебе это комфортно.',instructions:'Ничего не публикуется автоматически. Выбери Instagram в меню, если он там есть, или сохрани PNG и загрузи самостоятельно. Текст на картинке не нажимается: добавь стикер со ссылкой на калькулятор в Instagram Story.',preparing:'Готовим картинку в этой вкладке…',ready:'Картинка готова. Ты решаешь, чем поделиться.',failed:'Этот браузер не смог создать картинку. Ссылку на калькулятор всё ещё можно скопировать.',copied:'Ссылка скопирована — без личного результата.',copyFailed:'Не удалось скопировать автоматически. Скопируй видимую ссылку ниже.',downloaded:'Скачивание PNG началось. Его можно самостоятельно загрузить в Instagram.',shared:'Передано через меню твоего устройства.',cancelled:'Отправка отменена. Ничего не скачано.',preview:'Предпросмотр картинки для скачивания'}
};
let artworkPromise;
function artwork(win){
 const load=path=>new Promise(resolve=>{
  const image=new win.Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);
  image.src=new URL(path,import.meta.url).href;
 });
 if(!artworkPromise)artworkPromise=Promise.all([load('./assets/cutout-5-0c59239bdc0a.png'),load('./assets/cutout-7-713dde19f7e8.png')]).then(([image,weightIcon])=>({image,weightIcon}));
 return artworkPromise;
}
export function mountShareTools(doc,win,{render}={}){
 const section=doc.getElementById('share-tools');if(!section)return {update(){}};
 const canvas=doc.getElementById('share-preview'),status=doc.getElementById('share-status');
 const downloadButton=doc.getElementById('download-card'),shareButton=doc.getElementById('share-card');
 const post=doc.getElementById('share-post'),story=doc.getElementById('share-story');
 let result=null,lang='en',format='post',generation=0,file=null;
 const urls=new Set();
 const renderImage=render|| (async(_canvas,model)=>{
  const images=await artwork(win);
  await doc.fonts?.ready;
  // Render to a detached canvas. An old asynchronous task cannot repaint the
  // current preview after the user changes/clears their input.
  const temporary=doc.createElement('canvas');drawShareCard(temporary,model,images);
  return {blob:await cardToPng(temporary),canvas:temporary};
 });
 function reset(){generation++;file=null;downloadButton.disabled=true;shareButton.disabled=true;canvas.width=1;canvas.height=1;for(const url of urls)win.URL.revokeObjectURL(url);urls.clear();}
 function download(value){
  const url=win.URL.createObjectURL(value),anchor=doc.createElement('a');urls.add(url);
  anchor.href=url;anchor.download=value.name;anchor.hidden=true;doc.body.append(anchor);anchor.click();anchor.remove();
  win.setTimeout(()=>{win.URL.revokeObjectURL(url);urls.delete(url);},60000);
 }
 function update(value,language){
  result=value?.ok?value:null;lang=Object.hasOwn(shareMessages,language)?language:'en';reset();
  const t=shareMessages[lang];
  doc.querySelectorAll('[data-share-copy]').forEach(node=>{if(t[node.dataset.shareCopy])node.textContent=t[node.dataset.shareCopy];});
  post.setAttribute('aria-pressed',String(format==='post'));story.setAttribute('aria-pressed',String(format==='story'));
  canvas.setAttribute('aria-label',t.preview);doc.getElementById('make-link').href=CANONICAL_METER_URL;
  section.hidden=!result;status.textContent='';if(!result)return;
  status.textContent=t.preparing;const own=generation;
  const model=createShareCardModel({pancakes:result.pancakes,lang,format});
  Promise.resolve(renderImage(canvas,model)).then(rendered=>{
   if(own!==generation)return;
   const blob=rendered instanceof Blob?rendered:rendered.blob;
   file=new win.File([blob],model.filename,{type:'image/png',lastModified:0});
   if(rendered.canvas){canvas.width=model.width;canvas.height=model.height;canvas.getContext('2d').drawImage(rendered.canvas,0,0);}
   canvas.setAttribute('aria-label',`${t.preview}: ${model.count} ${model.noun}. ${model.width} × ${model.height}.`);
   downloadButton.disabled=false;shareButton.disabled=false;status.textContent=t.ready;
  }).catch(()=>{if(own===generation)status.textContent=t.failed;});
 }
 post.addEventListener('click',()=>{format='post';update(result,lang);});
 story.addEventListener('click',()=>{format='story';update(result,lang);});
 downloadButton.addEventListener('click',()=>{if(file){download(file);status.textContent=shareMessages[lang].downloaded;}});
 shareButton.addEventListener('click',async()=>{
  if(!file)return;const own=generation;shareButton.disabled=true;
  try{const outcome=await sharePreparedCard(file,{navigator:win.navigator,download});if(own===generation)status.textContent=shareMessages[lang][outcome];}
  catch{if(own===generation)status.textContent=shareMessages[lang].failed;}
  finally{if(own===generation)shareButton.disabled=false;}
 });
 doc.getElementById('copy-link').addEventListener('click',async()=>{
  try{await win.navigator.clipboard.writeText(CANONICAL_METER_URL);status.textContent=shareMessages[lang].copied;}
  catch{status.textContent=shareMessages[lang].copyFailed;}
 });
 update(null,'en');return {update};
}
