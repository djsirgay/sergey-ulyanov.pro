// This is a display window, not a search limit or ranking. Full matches stay with
// the caller for counts, collection actions and exports. Nothing is persisted.
export const RESULT_PAGE_SIZE=24;
const contextFields=['q','scope','path','language','topic','genre','type','decade','sort'];
const listeningSearch=view=>view?.route==='discover'&&view.scope==='listen'&&view.path==null;
const contextKey=view=>JSON.stringify(contextFields.map(key=>view?.[key]??''));

export function createResultPager({pageSize=RESULT_PAGE_SIZE,maxContexts=30}={}){
  if(!Number.isInteger(pageSize)||pageSize<1||pageSize>100)throw new RangeError('Invalid result page size');
  if(!Number.isInteger(maxContexts)||maxContexts<1||maxContexts>100)throw new RangeError('Invalid context limit');
  const limits=new Map();
  function remember(key,limit){
    limits.delete(key);limits.set(key,limit);
    while(limits.size>maxContexts)limits.delete(limits.keys().next().value);
    return limit;
  }
  function snapshot(view,matches){
    const incremental=listeningSearch(view),total=matches.length;
    const limit=incremental?remember(contextKey(view),limits.get(contextKey(view))??pageSize):total;
    const shown=Math.min(limit,total);
    return {incremental,pageSize,total,shown,items:matches.slice(0,shown),hasMore:incremental&&shown<total,nextCount:incremental?Math.min(pageSize,total-shown):0};
  }
  function more(view,matches){
    const before=snapshot(view,matches);
    if(!before.hasMore)return before;
    remember(contextKey(view),before.shown+pageSize);
    return snapshot(view,matches);
  }
  return {snapshot,more};
}

const labels={
  en:{more:n=>`Show ${n} more`,shown:'shown',announcement:(before,after)=>`Now showing ${after.shown} of ${after.total} recordings. Added ${before.shown+1}–${after.shown}.`},
  be:{more:n=>`Яшчэ ${n}`,shown:'паказана',announcement:(before,after)=>`Паказана ${after.shown} з ${after.total} запісаў. Дададзены ${before.shown+1}–${after.shown}.`},
  ru:{more:n=>`Ещё ${n}`,shown:'показано',announcement:(before,after)=>`Показано ${after.shown} из ${after.total} записей. Добавлены ${before.shown+1}–${after.shown}.`}
};

export function resultPageHTML(page,renderCard,lang='en'){
  const text=labels[lang]||labels.en;
  const grid=`<div class="music-grid" id="discovery-results">${page.items.map(renderCard).join('')}</div>`;
  if(!page.incremental||page.total<=page.pageSize)return grid;
  return grid+`<div class="more-results">${page.hasMore?`<button type="button" class="button secondary" data-action="load-more" aria-controls="discovery-results" aria-describedby="discovery-pagination-status">${text.more(page.nextCount)}</button>`:''}<span id="discovery-pagination-status" role="status" aria-atomic="true">${page.shown} / ${page.total} ${text.shown}</span></div>`;
}

function cardID(card){return card.querySelector('[data-action="save"]')?.dataset.id;}

// Re-rendering also reapplies source-evidence and other existing enhancements.
// Retain the user's open evidence, unsent search text and scroll, then put keyboard
// focus on the first new recording (never back at the top or on a removed button).
export function revealMoreResults({pager,view,matches,render,document,window,lang='en',announce=()=>{}}){
  const before=pager.snapshot(view,matches);
  const grid=document.querySelector('#discovery-results');
  if(!before.hasMore||!grid)return false;
  const scroll={top:window.scrollY,left:window.scrollX||0,behavior:'instant'};
  const query=document.querySelector('#query')?.value;
  const openByRecord=new Map();
  for(const card of grid.querySelectorAll('.music-card')){
    const id=cardID(card);
    if(id)openByRecord.set(id,[...card.querySelectorAll('details')].map(detail=>detail.open));
  }
  const after=pager.more(view,matches);
  render();
  const nextGrid=document.querySelector('#discovery-results');
  const queryInput=document.querySelector('#query');
  if(query!==undefined&&queryInput)queryInput.value=query;
  if(nextGrid){
    const cards=[...nextGrid.querySelectorAll('.music-card')];
    for(const card of cards){
      const open=openByRecord.get(cardID(card));
      if(open)[...card.querySelectorAll('details')].forEach((detail,index)=>{detail.open=Boolean(open[index]);});
    }
    const firstNew=cards[before.shown];
    (firstNew?.querySelector('h3 a')||firstNew?.querySelector('a,button'))?.focus({preventScroll:true});
  }
  window.scrollTo(scroll);
  announce((labels[lang]||labels.en).announcement(before,after));
  return true;
}
