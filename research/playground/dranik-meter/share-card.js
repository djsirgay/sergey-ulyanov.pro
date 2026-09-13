// All dynamic data stays in memory. The only URL in a card is this constant.
export const CANONICAL_METER_URL='https://research.sergey-ulyanov.pro/playground/dranik-meter/';
const copy={
 en:{brand:'Dranik meter',headline:'Same me.',noun:'hypothetical draniki',joke:'Different unit. Still priceless.',makeYours:'How many draniki are you?',assumption:'A little potato arithmetic · 1 dranik = 50 g (assumed)'},
 be:{brand:'Дранікаметр',headline:'Гэта ўсё я.',noun:'умоўных дранікаў',joke:'Іншая адзінка. Каштоўнасць тая ж.',makeYours:'А колькі ў табе дранікаў?',assumption:'Крыху бульбяной арыфметыкі · 1 дранік = умоўныя 50 г'},
 ru:{brand:'Драникометр',headline:'Всё тот же я.',noun:'условных драников',joke:'Другая единица. Всё ещё бесценно.',makeYours:'А сколько в тебе драников?',assumption:'Немного картофельной арифметики · 1 драник = условные 50 г'}
};
export function createShareCardModel({pancakes,lang='en',format='post'}={}){
 if(!Number.isFinite(pancakes)||pancakes<=0||pancakes>20000)throw Error('invalid-result');
 if(!['post','story'].includes(format))throw Error('invalid-format');
 lang=Object.hasOwn(copy,lang)?lang:'en';
 return {...copy[lang],lang,format,width:1080,height:format==='story'?1920:1350,
  count:new Intl.NumberFormat(lang,{maximumFractionDigits:1}).format(pancakes),
  url:CANONICAL_METER_URL,filename:`dranik-meter-${format}.png`};
}
export function cardToPng(canvas){
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('png-export-failed')),'image/png'));
}
function textFit(ctx,text,x,y,size,width,{serif=false,color='#fffaf0',weight=400}={}){
 const family=serif?'Newsreader, Georgia, serif':'Manrope, sans-serif';
 do{ctx.font=`${weight} ${size}px ${family}`;if(ctx.measureText(text).width<=width)break;size-=1;}while(size>18);
 ctx.fillStyle=color;ctx.fillText(text,x,y);return size;
}
function lines(ctx,text,x,y,width,size,color){
 ctx.font=`400 ${size}px Manrope, sans-serif`;ctx.fillStyle=color;
 let line='';for(const word of text.split(' ')){
  const next=line?line+' '+word:word;
  if(line&&ctx.measureText(next).width>width){ctx.fillText(line,x,y);y+=size*1.55;line=word;}else line=next;
 }if(line)ctx.fillText(line,x,y);
}
// Composition derived from the approved 12ui C target; original illustration
// remains a raster asset. Export formats omit the interface's action buttons.
export function drawShareCard(canvas,model,{image,weightIcon}={}){
 canvas.width=model.width;canvas.height=model.height;
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas-unavailable');
 const story=model.format==='story',x=104,w=872;
 ctx.fillStyle='#05130e';ctx.fillRect(0,0,model.width,model.height);ctx.textBaseline='top';
 textFit(ctx,model.brand.toUpperCase(),x,story?194:80,25,w,{color:'#d7f34c',weight:700});
 textFit(ctx,'≈ '+model.count,x,story?282:156,story?184:158,w,{serif:true});
 textFit(ctx,model.noun,x,story?482:336,64,w,{serif:true});
 const top=story?655:451,boxHeight=story?520:385,boxWidth=850;
 if(image?.width&&image?.height){
  const scale=Math.min(boxWidth/image.width,boxHeight/image.height),iw=image.width*scale,ih=image.height*scale;
  ctx.drawImage(image,(1080-iw)/2,top+(boxHeight-ih)/2,iw,ih);
 }else{textFit(ctx,'🥔',382,top+45,270,500);}
 const rule=story?1240:899;ctx.fillStyle='#29443a';ctx.fillRect(x,rule,w,2);
 const iconWidth=weightIcon?.width&&weightIcon?.height?42:0;
 if(iconWidth)ctx.drawImage(weightIcon,x,rule+26,iconWidth,iconWidth*weightIcon.height/weightIcon.width);
 lines(ctx,model.assumption,x+(iconWidth?62:0),rule+28,w-(iconWidth?62:0),23,'#b6c4bd');
 textFit(ctx,model.headline,x,story?1378:1030,76,w,{serif:true});
 textFit(ctx,model.joke,x,story?1480:1120,31,w,{color:'#b6c4bd'});
 textFit(ctx,model.makeYours,x,story?1570:1220,28,w,{color:'#d7f34c',weight:700});
 textFit(ctx,'research.sergey-ulyanov.pro',x,story?1620:1270,24,w,{color:'#b6c4bd'});
 textFit(ctx,'/playground/dranik-meter/',x,story?1655:1306,24,w,{color:'#b6c4bd'});
 return canvas;
}
// Must be called by a user's click with a prepared file: no asynchronous image
// generation first, which could consume the browser's transient activation.
export async function sharePreparedCard(file,{navigator,download}){
 try{
  if(typeof navigator?.share==='function'&&navigator.canShare?.({files:[file]})){
   await navigator.share({files:[file]});return 'shared';
  }
 }catch(error){if(error?.name==='AbortError')return 'cancelled';}
 download(file);return 'downloaded';
}
