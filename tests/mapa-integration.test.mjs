// Run: node --test tests/mapa-integration.test.mjs
// Controller integration with local data and an explicit minimal DOM/timer adapter.
// This verifies state behavior, not browser rendering or visual accessibility.
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const dir=new URL('../research/atlas/mapa/',import.meta.url);
const scripts=['history/places.js','history.js','chronology.js'].map(file=>[file,readFileSync(new URL(file,dir),'utf8')]);
const flush=()=>new Promise(resolve=>setImmediate(resolve));

async function app(query='',language='en',failures=new Set(),blocked=new Set()) {
  let url=new URL(`https://example.test/research/atlas/mapa/${query}`),timerID=0;
  let viewport={width:960,height:700},frameID=0;
  const nodes=new Map(),observers=[],timers=new Map(),mutations=[],requests=[],listeners=new Map();
  const pending=new Map(),frames=new Map();
  let document;
  class Element {
    constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this.handlers={};this.hidden=false;this.textContent='';this.value='';this.disabled=false;this.checked=false;this.style={setProperty(){}};this.classes=new Set();this.classList={toggle:(name,on)=>{const yes=on??!this.classes.has(name);yes?this.classes.add(name):this.classes.delete(name);return yes;},add:name=>this.classes.add(name),remove:name=>this.classes.delete(name)};}
    set id(value){this._id=value;nodes.set(value,this);} get id(){return this._id;}
    get options(){return this.children;}
    append(...children){for(const child of children){child.parent=this;this.children.push(child);}}
    replaceChildren(...children){for(const child of this.children)child.parent=null;this.children=[];this.append(...children);}
    remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null;}
    before(...children){this.beforeNodes=children;}
    setAttribute(key,value){this.attributes[key]=String(value);if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]=String(value);}
    toggleAttribute(key,on){if(on??!(key in this.attributes))this.setAttribute(key,'');else delete this.attributes[key];}
    getAttribute(key){return this.attributes[key]??null;}
    addEventListener(type,handler){this.handlers[type]=handler;}
    querySelectorAll(selector){return walk(this.children).filter(node=>matches(node,selector));}
    focus(){document.activeElement=this;} select(){} scrollIntoView(){}
    getBoundingClientRect(){return{x:0,y:0,left:0,top:0,right:viewport.width,bottom:viewport.height,...viewport};}
    getBBox(){
      // Deterministic SVG text approximation for exercising collision/resize code.
      // Actual glyph metrics, overlap and legibility still require browser QA.
      const children=this.children.filter(child=>child.tagName!=='TITLE');
      if(children.length){const boxes=children.map(child=>child.getBBox()),x=Math.min(...boxes.map(box=>box.x)),y=Math.min(...boxes.map(box=>box.y));return{x,y,width:Math.max(...boxes.map(box=>box.x+box.width))-x,height:Math.max(...boxes.map(box=>box.y+box.height))-y};}
      if(this.tagName==='CIRCLE'){const r=Number(this.attributes.r||0);return{x:Number(this.attributes.cx||0)-r,y:Number(this.attributes.cy||0)-r,width:r*2,height:r*2};}
      const size=parseFloat(this.style.fontSize||this.attributes['font-size']||this.parent?.attributes['font-size']||12);
      const width=String(this.textContent).length*size*.58,height=size;
      const inheritedY=Number(this.parent?.attributes.y||0);
      const dy=this.tagName==='TSPAN'?(this.parent?.children||[]).slice(0,(this.parent?.children||[]).indexOf(this)+1).reduce((sum,child)=>sum+Number(child.attributes.dy||0),0):0;
      let x=Number(this.attributes.x??this.parent?.attributes.x??0),y=Number(this.attributes.y??inheritedY)+dy-size*.8;
      const anchor=this.attributes['text-anchor']||this.parent?.attributes['text-anchor'];if(anchor==='middle')x-=width/2;else if(anchor==='end')x-=width;
      return{x,y,width,height};
    }
  }
  const walk=roots=>{const found=new Set();for(const node of roots){found.add(node);for(const child of walk(node.children))found.add(child);}return [...found];};
  const matches=(node,selector)=>{
    if(selector==='button')return node.tagName==='BUTTON';
    const match=selector.match(/^\[data-([a-z-]+)(?:="([^"]*)")?\]$/);
    if(match){const key=match[1].replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());return key in node.dataset&&(match[2]===undefined||node.dataset[key]===match[2]);}
    return false;
  };
  const get=id=>{if(!nodes.has(id)){const element=new Element();element.id=id;}return nodes.get(id);};
  const tabs=get('.mapa-history-tabs');
  const panelButtons=['borders','chronology'].map(panel=>{const button=new Element('button');button.dataset.historyPanel=panel;return button;});
  const modeButtons=['focus','region'].map(mode=>{const button=new Element('button');button.dataset.historyMode=mode;return button;});
  const overlayLabel=new Element('label');overlayLabel.dataset.history='previousOverlay';
  const extra=[...panelButtons,...modeButtons,overlayLabel];
  document={documentElement:{lang:language},hidden:false,activeElement:null,
    getElementById:get,createElement:tag=>new Element(tag),createElementNS:(_ns,tag)=>new Element(tag),
    querySelector:selector=>selector==='.mapa-history-tabs'?tabs:selector==='[data-history="previousOverlay"]'?overlayLabel:null,
    querySelectorAll:selector=>walk([...nodes.values(),...extra]).filter(node=>matches(node,selector)),
    addEventListener:(type,handler)=>listeners.set(`document:${type}`,handler)};
  const location={get href(){return url.href;},get search(){return url.search;},get hash(){return url.hash;}};
  const window={addEventListener:(type,handler)=>{if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(handler);},dispatchEvent:event=>{for(const handler of listeners.get(event.type)||[])handler(event);}};
  const context={window,document,location,URL,URLSearchParams,
    matchMedia:()=>({matches:false}),
    history:Object.fromEntries(['pushState','replaceState'].map(method=>[method,(_s,_t,value)=>{url=new URL(value,url);mutations.push({method,href:url.href});}])),
    Event:class{constructor(type){this.type=type;}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail;}},
    MutationObserver:class{constructor(callback){observers.push(callback);}observe(){}},
    setTimeout:(callback,delay)=>{const id=++timerID;timers.set(id,{callback,delay});return id;},clearTimeout:id=>timers.delete(id),
    requestAnimationFrame:callback=>{const id=++frameID;frames.set(id,callback);return id;},cancelAnimationFrame:id=>frames.delete(id),
    navigator:{clipboard:{writeText:async()=>{}}},
    fetch:async value=>{const target=new URL(value,url),name=target.pathname.split('/').at(-1);requests.push(name);if(blocked.has(name))await new Promise(resolve=>{if(!pending.has(name))pending.set(name,[]);pending.get(name).push(resolve);});if(failures.has(name))return{ok:false,status:503};return{ok:true,json:async()=>JSON.parse(readFileSync(new URL(`history/${name}`,dir),'utf8'))};}
  };
  const vmContext=vm.createContext(context);
  for(const [filename,source] of scripts)vm.runInContext(source,vmContext,{filename});
  await flush();
  const stageSelect=tabs.beforeNodes[0].children[1],routeNotice=tabs.beforeNodes[1];
  const emit=(type,detail)=>window.dispatchEvent(new context.CustomEvent(type,{detail}));
  const navigate=async target=>{const oldHash=url.hash;url=new URL(target,url);emit('popstate');if(url.hash!==oldHash)emit('hashchange');await flush();};
  const languageChange=async lang=>{document.documentElement.lang=lang;const target=new URL(url);target.searchParams.set('lang',lang);url=target;observers.forEach(callback=>callback());await flush();};
  const click=async id=>{await get(id).handlers.click?.({target:get(id)});await flush();};
  const chooseStage=async value=>{stageSelect.handlers.change({target:{value}});await flush();};
  const tick=async()=>{const [id,timer]=timers.entries().next().value||[];if(!timer)return;timers.delete(id);await timer.callback();await flush();};
  const release=async name=>{blocked.delete(name);for(const resolve of pending.get(name)||[])resolve();pending.delete(name);await flush();};
  const resize=async size=>{viewport=size;emit('resize');for(const [id,callback] of [...frames]){frames.delete(id);callback();}await flush();};
  return {get,stageSelect,routeNotice,panelButtons,modeButtons,location,document,mutations,requests,timers,failures,blocked,emit,navigate,languageChange,click,chooseStage,tick,release,resize};
}

test('default route renders 1938 and exposes matching labels, legend, chronology stage',async()=>{
  const ui=await app();
  assert.equal(ui.get('history-map-year').textContent,1938);
  assert.equal(ui.stageSelect.value,'division-1938');
  assert.equal(ui.get('history-load-status').hidden,true);
  assert.equal(ui.get('history-polity-labels').children.length,2);
  assert.ok(ui.get('history-legend').children.length);
});

test('context-only route stays context after the background map finishes loading',async()=>{
  const ui=await app('?year=1991&lang=be#borders','be');
  assert.equal(ui.get('borders').hidden,true);
  assert.equal(ui.stageSelect.value,'independence-1991');
  assert.equal(ui.get('chronology').hidden,false);
  assert.match(ui.get('chronology-geometry').textContent,/Межы іншага года/);
});

test('shared stage changes and Back preserve map year, city, language and context panel',async()=>{
  const ui=await app('?year=1938&city=brest&lang=be#borders','be');
  await ui.chooseStage('independence-1991');
  const contextURL=ui.location.href;
  await ui.chooseStage('gdl-1492');
  assert.equal(ui.get('borders').hidden,false);
  assert.equal(ui.get('history-map-year').textContent,1492);
  assert.equal(ui.stageSelect.value,'gdl-1492');
  assert.equal(new URL(ui.location.href).searchParams.get('city'),'brest');
  assert.equal(new URL(ui.location.href).searchParams.get('lang'),'be');
  assert.equal(new URL(ui.location.href).searchParams.has('stage'),false);
  await ui.navigate(contextURL);
  assert.equal(ui.stageSelect.value,'independence-1991');
  assert.equal(ui.get('chronology').hidden,false);
  assert.equal(ui.get('history-place-select').value,'brest');
});

test('language change translates the map and shared selector without replacing context',async()=>{
  const ui=await app('?stage=independence-1991&year=1938#chronology');
  await ui.languageChange('be');
  assert.equal(ui.stageSelect.value,'independence-1991');
  assert.equal(ui.get('chronology').hidden,false);
  assert.match(ui.get('history-answer').textContent,/Польская Рэспубліка/);
  assert.match(ui.get('chronology-body').textContent,/Незалежнасць/);
  assert.match(ui.get('chronology-kind').textContent,/1991/);
  assert.equal(new URL(ui.location.href).searchParams.get('stage'),'independence-1991');
});

test('unknown date warning survives canonical map sync and disappears on valid selection',async()=>{
  const ui=await app('?year=1400#borders');
  assert.equal(ui.routeNotice.hidden,false);
  assert.match(ui.routeNotice.textContent,/1400/);
  await ui.chooseStage('commonwealth-1600');
  assert.equal(ui.routeNotice.hidden,true);
  assert.equal(ui.get('history-map-year').textContent,1600);
  assert.equal(ui.get('history-load-status').hidden,true);
});

test('failed geometry is explicit and retry re-fetches it without substituting a year',async()=>{
  const ui=await app('?year=1492#borders','en',new Set(['focus_1492.geojson']));
  assert.equal(ui.get('history-retry').hidden,false);
  assert.equal(ui.get('history-map-year').textContent,1492);
  assert.equal(ui.get('history-shapes').children.length,0);
  assert.match(ui.get('history-load-status').textContent,/No other year/);
  ui.failures.clear();await ui.click('history-retry');
  assert.equal(ui.get('history-retry').hidden,true);
  assert.equal(ui.get('history-load-status').hidden,true);
  assert.equal(ui.requests.filter(name=>name==='focus_1492.geojson').length,2);
});

test('playing advances the map and shared selector, and opening context cancels playback',async()=>{
  const ui=await app('?year=1938#borders');
  await ui.click('history-play');
  assert.equal(ui.timers.size,1);
  await ui.tick();
  assert.equal(ui.get('history-map-year').textContent,1945);
  assert.equal(ui.stageSelect.value,'postwar-1945');
  assert.equal(ui.timers.size,1);
  await ui.chooseStage('invasion-1939');
  assert.equal(ui.timers.size,0);
  assert.equal(ui.get('history-play').attributes['aria-pressed'],'false');
  assert.equal(ui.get('chronology').hidden,false);
});

test('city controls stay stable while the affiliation text updates',async()=>{
  const ui=await app('?year=1938#borders');
  const cityButtons=ui.get('history-cities').children;
  const brest=cityButtons.find(button=>button.dataset.city==='brest');
  brest.focus();await brest.handlers.click();await flush();
  assert.equal(ui.get('history-cities').children,cityButtons);
  assert.equal(ui.document.activeElement,brest);
  assert.match(ui.get('history-city-result').textContent,/Polish Republic/);
  assert.equal(ui.get('history-polity-labels').children.length,2);
});

test('a failed replay start stays stopped rather than arming a timer after the error',async()=>{
  const ui=await app('?year=1994#borders','en',new Set(['focus_1492.geojson']));
  await ui.click('history-play');
  assert.equal(ui.get('history-map-year').textContent,1492);
  assert.equal(ui.get('history-retry').hidden,false);
  assert.equal(ui.timers.size,0,'Replay must not restart a timer after render reported a load failure');
  assert.equal(ui.get('history-play').attributes['aria-pressed'],'false');
});

test('selecting a place from the affiliation table retains its focused button',async()=>{
  const ui=await app('?year=1938#borders');
  const rows=ui.get('history-places-body').children;
  const brest=rows.flatMap(row=>row.children[0].children).find(button=>button.dataset.tableCity==='brest');
  brest.focus();await brest.handlers.click();await flush();
  assert.equal(ui.get('history-places-body').children,rows);
  assert.equal(ui.document.activeElement,brest);
  assert.match(ui.get('history-city-result').textContent,/Polish Republic/);
});

test('every stored source polity in the seven live maps has a Belarusian display name',()=>{
  const history=scripts.find(([filename])=>filename==='history.js')[1];
  const start=history.indexOf('  const polities='),end=history.indexOf('  const cities=');
  assert.ok(start>0&&end>start);
  const declarations=history.slice(start,end);
  const naming=history.slice(history.indexOf('  function polityName('),history.indexOf('  const color='));
  for(const year of [1492,1600,1700,1914,1938,1945,1994]){
    const context={year};
    vm.runInNewContext(declarations+'\nconst index=0,eras=[{year}],local=value=>value[1];\n'+naming+'\nglobalThis.displayName=name=>polityName(name,true)',context);
    const world=JSON.parse(readFileSync(new URL(`history/world_${year}.geojson`,dir),'utf8'));
    for(const name of new Set(world.features.map(feature=>feature.properties.NAME).filter(Boolean))){
      const label=context.displayName(name);
      assert.match(label,/[А-Яа-яЁёІіЎў]/u,`${year}: raw source name leaked into Belarusian UI: ${name}`);
      assert.notEqual(label,name,`${year}: untranslated source label: ${name}`);
    }
  }
});

test('a failed reference outline can be retried without a page reload',async()=>{
  const ui=await app('?year=1938#borders','en',new Set(['belarus-reference.geojson']));
  assert.equal(ui.get('history-retry').hidden,false);
  ui.failures.clear();await ui.click('history-retry');
  assert.equal(ui.get('history-load-status').hidden,true);
  assert.equal(ui.requests.filter(name=>name==='belarus-reference.geojson').length,2);
});

test('Back during playback stops the timer and restores the explicit map state',async()=>{
  const ui=await app('?year=1938&city=brest#borders');
  await ui.click('history-next');
  await ui.click('history-play');
  assert.equal(ui.timers.size,1);
  await ui.navigate('?year=1938&city=brest#borders');
  assert.equal(ui.timers.size,0);
  assert.equal(ui.get('history-map-year').textContent,1938);
  assert.equal(ui.stageSelect.value,'division-1938');
  assert.equal(ui.get('history-place-select').value,'brest');
});

test('late geometry cannot repaint an older year after another stage was selected',async()=>{
  const ui=await app('?year=1938#borders','en',new Set(),new Set(['focus_1938.geojson']));
  assert.equal(ui.get('history-load-status').hidden,false);
  await ui.chooseStage('gdl-1492');
  assert.equal(ui.get('history-map-year').textContent,1492);
  await ui.release('focus_1938.geojson');
  assert.equal(ui.get('history-map-year').textContent,1492);
  assert.equal(ui.stageSelect.value,'gdl-1492');
  assert.ok(ui.get('history-shapes').children.every(shape=>shape.dataset.polity==='Poland-Lithuania'));
});

test('leaving for context while replay is loading prevents playback from restarting',async()=>{
  const ui=await app('?year=1994#borders','en',new Set(),new Set(['focus_1492.geojson']));
  const replay=ui.click('history-play');await flush();
  await ui.chooseStage('independence-1991');
  await ui.release('focus_1492.geojson');await replay;
  assert.equal(ui.timers.size,0);
  assert.equal(ui.get('chronology').hidden,false);
  assert.equal(ui.stageSelect.value,'independence-1991');
});

test('pause and restart during a slow autoplay load cannot leave two ticking timers',async()=>{
  const ui=await app('?year=1938#borders','en',new Set(),new Set(['focus_1945.geojson']));
  await ui.click('history-play');
  const pendingTick=ui.tick();await flush();
  await ui.click('history-play'); // pause the pending tick
  await ui.click('history-play'); // explicitly start one fresh timer
  await ui.release('focus_1945.geojson');await pendingTick;
  assert.equal(ui.timers.size,1,'The old pending tick must not schedule a second timer after a restart');
});

test('a second click cancels a pending replay start and cannot resurrect its timer',async()=>{
  const ui=await app('?year=1994#borders','en',new Set(),new Set(['focus_1492.geojson']));
  const pendingReplay=ui.click('history-play');await flush();
  await ui.click('history-play');
  await ui.release('focus_1492.geojson');await pendingReplay;
  assert.equal(ui.timers.size,0);
  assert.equal(ui.get('history-play').attributes['aria-pressed'],'false');
});

test('responsive redraw preserves dated state, country labels, all place markers and table focus',async()=>{
  const ui=await app('?year=1938&city=brest&lang=be#borders','be');
  const url=ui.location.href,rows=ui.get('history-places-body').children;
  const brest=rows.flatMap(row=>row.children[0].children).find(button=>button.dataset.tableCity==='brest');
  brest.focus();
  for(const width of [390,1440]){
    await ui.resize({width,height:600});
    assert.equal(ui.get('history-map-year').textContent,1938);
    assert.equal(ui.stageSelect.value,'division-1938');
    assert.equal(ui.get('history-polity-labels').children.length,2);
    assert.ok(ui.get('history-polity-labels').children.every(label=>label.getBBox().width>0&&label.getBBox().height>0));
    assert.equal(ui.get('history-labels').children.length,ui.get('history-place-select').options.length);
    assert.equal(ui.get('history-place-select').value,'brest');
    assert.equal(ui.get('history-places-body').children,rows);
    assert.equal(ui.document.activeElement,brest);
    assert.equal(ui.location.href,url);
  }
});
