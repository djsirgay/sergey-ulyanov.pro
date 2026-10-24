import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');
const source=read('site.js');
const attr=(markup,name)=>markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]??'';
const hasClass=(markup,name)=>attr(markup,'class').split(/\s+/).includes(name);

function mount({motion=false,resizeObserver=true,specs=[{name:'work'},{name:'community'}]}={}){
  const events=new Map(),frames=[],observed=[],analytics=[];
  const listen=(target,type,callback)=>{
    if(!target.has(type))target.set(type,[]);
    target.get(type).push(callback);
  };
  const emit=(target,type,event={})=>(target.get(type)||[]).forEach(callback=>callback(event));
  const rails=specs.map(({name,points=[2,322,682,1002],clientWidth=300,scrollWidth=1302,left=37})=>{
    const handlers=new Map(),controls={hidden:true},current={textContent:'01'};
    const button=()=>{
      const handlers=new Map();
      return {disabled:false,parentElement:controls,addEventListener:(type,callback)=>listen(handlers,type,callback),click(){if(!this.disabled)emit(handlers,'click');}};
    };
    const previous=button(),next=button();
    const rail={
      dataset:{rail:name},scrollLeft:0,clientWidth,scrollWidth,points:[...points],calls:[],
      addEventListener:(type,callback)=>listen(handlers,type,callback),
      getBoundingClientRect:()=>({left}),
      scrollTo(options){
        this.calls.push({...options});
        this.scrollLeft=Math.max(0,Math.min(options.left,this.scrollWidth-this.clientWidth));
        emit(handlers,'scroll');
      },
      manualScroll(value){this.scrollLeft=Math.max(0,Math.min(value,this.scrollWidth-this.clientWidth));emit(handlers,'scroll');},
      key(key,target=this){
        const event={key,target,prevented:false,preventDefault(){this.prevented=true;}};
        emit(handlers,'keydown',event);
        return event;
      }
    };
    rail.children=points.map((_,index)=>({getBoundingClientRect:()=>({left:left+rail.points[index]-rail.scrollLeft})}));
    return {rail,previous,next,controls,current};
  });
  const byName=name=>rails.find(entry=>entry.rail.dataset.rail===name);
  const document={
    querySelector(selector){
      const name=selector.match(/^\[data-current="([^"]+)"\]$/)?.[1];
      return name?byName(name)?.current:null;
    },
    querySelectorAll(selector){
      if(selector==='[data-rail]')return rails.map(entry=>entry.rail);
      const control=selector.match(/^\[data-(prev|next)="([^"]+)"\]$/);
      return control?[byName(control[2])[control[1]==='prev'?'previous':'next']]:[];
    },
    getElementById:()=>null,
    documentElement:{scrollHeight:1000},
    body:{classList:{add(){},remove(){}}}
  };
  class ResizeObserver{
    constructor(callback){this.callback=callback;}
    observe(element){observed.push({element,callback:this.callback});}
  }
  const window={dispatchEvent:event=>{analytics.push(event.detail);}};
  if(resizeObserver)window.ResizeObserver=ResizeObserver;
  vm.runInNewContext(source,{
    document,window,URL,location:{pathname:'/'},
    localStorage:{getItem:()=> 'declined'},
    matchMedia:()=>({matches:motion}),
    addEventListener:(type,callback)=>listen(events,type,callback),
    requestAnimationFrame:callback=>{frames.push(callback);return frames.length;},
    ResizeObserver,CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},
    scrollY:0,innerHeight:700
  });
  return {
    rails,byName,analytics,
    flush(){while(frames.length){const pending=frames.splice(0);pending.forEach(callback=>callback());}},
    pending:()=>frames.length,
    resize:()=>emit(events,'resize'),
    resizeElement:rail=>observed.filter(entry=>entry.element===rail).forEach(entry=>entry.callback()),
    observed,setMotion:value=>{motion=value;}
  };
}

test('each set of arrows advances only its own rail and returns to the beginning',()=>{
  const ui=mount(),work=ui.byName('work'),community=ui.byName('community');
  assert.equal(work.previous.disabled,true);
  assert.equal(work.next.disabled,false);
  assert.equal(work.controls.hidden,false);
  work.next.click();ui.flush();
  assert.equal(work.rail.scrollLeft,322);
  assert.equal(work.current.textContent,'02');
  assert.equal(work.previous.disabled,false);
  assert.equal(community.rail.scrollLeft,0);
  assert.equal(community.current.textContent,'01');
  community.next.click();ui.flush();
  assert.equal(community.current.textContent,'02');
  work.previous.click();ui.flush();
  assert.equal(work.rail.scrollLeft,2);
  assert.equal(work.previous.disabled,true);
  assert.equal(work.current.textContent,'01');
  assert.equal(community.rail.scrollLeft,322);
});

test('manual swipes update position and the last card is reported when several cards fit',()=>{
  const ui=mount({specs:[{name:'recognition',points:[2,322,642],clientWidth:660,scrollWidth:942}]}),entry=ui.rails[0];
  entry.rail.manualScroll(160);ui.flush();
  assert.equal(entry.current.textContent,'01');
  entry.rail.manualScroll(282);ui.flush();
  assert.equal(entry.current.textContent,'03','The end of a wide rail must not remain labelled as an earlier item');
  assert.equal(entry.next.disabled,true);
  assert.equal(entry.previous.disabled,false);
  const calls=entry.rail.calls.length;
  entry.next.click();
  assert.equal(entry.rail.calls.length,calls,'A disabled end control does not initiate more scrolling');
  entry.rail.manualScroll(0);ui.flush();
  assert.equal(entry.current.textContent,'01');
  assert.equal(entry.previous.disabled,true);
  assert.equal(entry.next.disabled,false);
});

test('arrows use current card positions, including unequal widths and a partial manual swipe',()=>{
  const ui=mount(),entry=ui.byName('work');
  entry.next.click();ui.flush();
  entry.next.click();ui.flush();
  assert.equal(entry.rail.scrollLeft,682,'The second step follows the actual next card rather than the first card width');
  entry.rail.manualScroll(540);ui.flush();
  entry.previous.click();ui.flush();
  assert.equal(entry.rail.scrollLeft,322);
  entry.rail.manualScroll(540);ui.flush();
  entry.next.click();ui.flush();
  assert.equal(entry.rail.scrollLeft,682);
});

test('focused rails support arrows, Home and End while child links retain their key behavior',()=>{
  const ui=mount(),entry=ui.byName('work');
  for(const key of ['ArrowRight','ArrowLeft','Home','End','Enter']){
    const calls=entry.rail.calls.length,event=entry.rail.key(key,{});
    assert.equal(event.prevented,false,`Child ${key} must not be intercepted`);
    assert.equal(entry.rail.calls.length,calls);
  }
  assert.equal(entry.rail.key('ArrowRight').prevented,true);ui.flush();
  assert.equal(entry.rail.scrollLeft,322);
  assert.equal(entry.rail.key('End').prevented,true);ui.flush();
  assert.equal(entry.current.textContent,'04');
  assert.equal(entry.next.disabled,true);
  assert.equal(entry.rail.key('ArrowLeft').prevented,true);ui.flush();
  assert.equal(entry.rail.scrollLeft,682);
  assert.equal(entry.rail.key('Home').prevented,true);ui.flush();
  assert.equal(entry.current.textContent,'01');
  assert.equal(entry.rail.scrollLeft,0);
  assert.equal(entry.rail.key('Enter').prevented,false);
});

test('resize removes redundant controls when cards fit and restores them when overflow returns',()=>{
  const ui=mount(),entry=ui.byName('work');
  assert.ok(ui.observed.some(observer=>observer.element===entry.rail));
  entry.rail.clientWidth=1400;ui.resizeElement(entry.rail);ui.flush();
  assert.equal(entry.controls.hidden,true);
  assert.equal(entry.previous.disabled,true);
  assert.equal(entry.next.disabled,true);
  entry.rail.clientWidth=300;ui.resizeElement(entry.rail);ui.flush();
  assert.equal(entry.controls.hidden,false);
  assert.equal(entry.next.disabled,false);
  entry.rail.points=[2,362,752,1102];entry.rail.scrollWidth=1402;
  ui.resize();ui.flush();entry.next.click();ui.flush();
  assert.equal(entry.rail.scrollLeft,362,'Changing layout must refresh the actual target positions');
});

test('window resize also refreshes controls without ResizeObserver support',()=>{
  const ui=mount({resizeObserver:false,specs:[{name:'work',clientWidth:1400}]}),entry=ui.rails[0];
  assert.equal(entry.controls.hidden,true);
  entry.rail.clientWidth=300;ui.resize();ui.flush();
  assert.equal(entry.controls.hidden,false);
  assert.equal(entry.next.disabled,false);
});

test('reduced motion is respected for both arrow controls and keyboard jumps',()=>{
  const ui=mount({motion:true}),entry=ui.byName('work');
  entry.next.click();ui.flush();
  assert.equal(entry.rail.calls.at(-1).behavior,'auto');
  entry.rail.key('End');ui.flush();
  assert.equal(entry.rail.calls.at(-1).behavior,'auto');
  ui.setMotion(false);entry.previous.click();ui.flush();
  assert.equal(entry.rail.calls.at(-1).behavior,'smooth');
});

test('rapid scroll events coalesce into one position update per frame',()=>{
  const ui=mount({specs:[{name:'work'}]}),entry=ui.rails[0];
  for(const position of [100,200,300,400,500,600])entry.rail.manualScroll(position);
  assert.equal(ui.pending(),1);
  ui.flush();
  assert.equal(entry.current.textContent,'03');
  assert.equal(ui.pending(),0);
});

test('an empty rail leaves progressive-enhancement controls hidden and does not crash other rails',()=>{
  const ui=mount({specs:[{name:'empty',points:[],scrollWidth:300},{name:'work'}]});
  assert.equal(ui.byName('empty').controls.hidden,true);
  ui.byName('work').next.click();ui.flush();
  assert.equal(ui.byName('work').current.textContent,'02');
});

test('generated homepage provides named, keyboard-focusable rails with correctly associated controls',()=>{
  const html=read('index.html');
  for(const name of ['work','community','recognition','approach']){
    const track=html.match(new RegExp(`<div\\b[^>]*\\bid="rail-${name}"[^>]*>`))?.[0];
    assert.ok(track,`Missing generated ${name} rail`);
    assert.equal(attr(track,'data-rail'),name);
    assert.equal(attr(track,'role'),'region');
    assert.equal(attr(track,'tabindex'),'0');
    assert.ok(attr(track,'aria-label'));
    for(const direction of ['prev','next']){
      const button=html.match(new RegExp(`<button\\b[^>]*data-${direction}="${name}"[^>]*>`))?.[0];
      assert.ok(button,`Missing ${direction} control for ${name}`);
      assert.equal(attr(button,'type'),'button');
      assert.equal(attr(button,'aria-controls'),`rail-${name}`);
      assert.ok(attr(button,'aria-label'));
    }
  }
  assert.equal((html.match(/class="case-card feature-case"/g)||[]).length,6);
  assert.equal((html.match(/class="recognition-card"/g)||[]).length,3);
  const library=read('work/index.html');
  assert.match(library,/class="case-grid"/);
  assert.doesNotMatch(library,/data-rail=/,'The full work library must keep its browsable grid');
});

test('community cards have four independent destinations and link to real publications, youth work and research',()=>{
  const html=read('index.html');
  const section=html.match(/<section\b[^>]*id="community"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section);
  const cards=[...section.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(([,attrs])=>hasClass(attrs,'community-item'));
  assert.equal(cards.length,4,'Every community card must be its own link');
  const destinations=cards.map(([,attrs])=>attr(attrs,'href'));
  assert.equal(new Set(destinations).size,4);
  assert.ok(destinations.includes('/press/#bio'));
  assert.ok(destinations.includes('/press/#public-work'));
  assert.ok(destinations.includes('/case-studies/community-advocacy/#youth'));
  const research=destinations.filter(href=>new URL(href,'https://sergey-ulyanov.pro/').hostname==='research.sergey-ulyanov.pro');
  assert.equal(research.length,1,'Only the cultural-research card points to the research project');
  for(const [card,attrs,body] of cards){
    assert.doesNotMatch(body,/<a\b/,'Cards must not contain nested links');
    assert.match(body,/<h3>/);
    assert.ok(attr(attrs,'href'));
    for(const [,path] of card.matchAll(/src="(\/[^"?]+)[^"]*"/g))assert.doesNotThrow(()=>readFileSync(new URL(path.slice(1),root)),path);
  }
  const press=read('press/index.html'),youth=read('case-studies/community-advocacy/index.html');
  assert.match(press,/id="bio"/);
  assert.match(press,/id="public-work"/);
  assert.match(youth,/id="youth"/,'The youth link must land on actual youth work');
  assert.match(section,/Unmute Belarus/);
  assert.match(section,/Broader diaspora use is a future research direction/);
});
