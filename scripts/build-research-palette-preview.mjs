import fs from 'node:fs';
import path from 'node:path';
import {buildResearchDomain, validateResearchArtifact} from './build-research-domain.mjs';

export const PREVIEW_PATH = '/palette-preview/white-red/';
export const PALETTE = Object.freeze({paper:'#ffffff',panel:'#faf5f4',raised:'#f4e8e8',ink:'#281c20',muted:'#65565b',red:'#a71935',line:'#cdb8be'});
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const colors = /#[a-f\d]{3,8}\b|rgba?\(\s*[\d.]+\s*[, ]\s*[\d.]+\s*[, ]\s*[\d.]+(?:\s*[,/]\s*[\d.]+)?\s*\)|\b(?:white|black)\b/gi;
function channels(value){
  if(value.toLowerCase()==='white')return [255,255,255,1];
  if(value.toLowerCase()==='black')return [0,0,0,1];
  if(value[0]==='#'){
    let digits=value.slice(1);if(digits.length===3||digits.length===4)digits=[...digits].map(x=>x+x).join('');
    return [parseInt(digits.slice(0,2),16),parseInt(digits.slice(2,4),16),parseInt(digits.slice(4,6),16),digits.length===8?parseInt(digits.slice(6,8),16)/255:1];
  }
  const values=value.match(/[\d.]+/g).map(Number);return [...values.slice(0,3),values[3]??1];
}
function recolor(value,property){
  const [r,g,b,alpha]=channels(value),light=(r*.2126+g*.7152+b*.0722)/255;
  const colorful=Math.max(r,g,b)-Math.min(r,g,b)>55;
  const brand=colorful && (g>r*1.08 || b>r*1.08 || (r>140&&g>100&&b<100));
  let next;
  if(/shadow/.test(property))next='#49222d';
  else if(/(?:border|outline|line)/.test(property))next=brand?PALETTE.red:PALETTE.line;
  else if(/(?:background|--.*(?:bg|panel|surface|paper|card))/.test(property))next=brand&&light>.48?PALETTE.red:light<.055?PALETTE.paper:light<.22?PALETTE.panel:light>.8?PALETTE.paper:PALETTE.raised;
  else if(/(?:acid|lime|accent|cyan|violet|green|moss|rust|danger)/.test(property))next=PALETTE.red;
  else if(/muted|soft/.test(property))next=PALETTE.muted;
  else next=brand?PALETTE.red:light<.18||light>.78?PALETTE.ink:PALETTE.muted;
  const mapped=channels(next),opacity=/shadow/.test(property)?Math.min(alpha,.12):property==='color'?Math.max(alpha,.78):alpha;
  return opacity<1?`rgba(${mapped.slice(0,3).join(',')},${Number(opacity.toFixed(3))})`:next;
}
export function paletteCSS(source){
  // Only declaration colors change. Layout, font sizes, image URLs, transforms,
  // masks and actual map/SVG data colors retain their original values.
  const transformed = source.replace(/([\w-]+)(\s*:\s*)([^;{}]+)(?=[;}])/g,(whole,property,colon,value)=>{
    const key=property.toLowerCase();
    if(!/color|background|border|outline|shadow|^--/.test(key)||/mask|^fill$|^stroke/.test(key))return whole;
    if(/url\(/i.test(value))return whole;
    if(key==='color-scheme')return `${property}${colon}light`;
    const resolved = /background|box-shadow/.test(key) ? value.replace(/var\(--ink(?:-soft)?\)/g, PALETTE.paper) : value;
    return property+colon+resolved.replace(colors,color=>recolor(color,key));
  });
  // A dark-text token was also used on solid lime buttons in the original.
  // Those buttons need white text when their background becomes deep red.
  return transformed.replace(/([^{}]+)\{([^{}]+)\}/g,(whole,selector,declarations)=>{
    const background=declarations.match(/(?:^|;)\s*background(?:-color)?\s*:\s*(#[a-f\d]+|var\(--(?:acid|lime|accent|moss|mapa-accent|research-lime|suite-acid)\))\s*(?:;|$)/i);
    return background && (background[1]===PALETTE.red || background[1].startsWith('var(')) ? `${selector}{${declarations.replace(/;?\s*$/,';')}color:#fff;}` : whole;
  });
}
const finishingCSS=`
/* Preview only: no production stylesheet references this file. */
:root{color-scheme:light;--bg:#fff;--panel:#faf5f4;--text:#281c20;--ink:#281c20;--ink-soft:#443039;--muted:#65565b;--paper:#fff;--paper-bright:#fff;--acid:#a71935;--lime:#a71935;--moss:#a71935;--line:#cdb8be;--research-bg:#fff;--research-panel:#faf5f4;--research-ink:#281c20;--research-muted:#65565b;--research-lime:#a71935;--research-line:#cdb8be}
html,body{background:#fff!important;color:#281c20!important}
.suite-page{--suite-paper:#281c20;--suite-bg:#fff;--suite-panel:#faf5f4;--suite-panel-2:#f4e8e8;--suite-acid:#a71935;--suite-quiet:#65565b;--suite-line:#cdb8be}
.mapa-page{--mapa-paper:#281c20;--mapa-surface:#faf5f4;--mapa-surface-raised:#f4e8e8;--mapa-line:#cdb8be;--mapa-muted:#65565b;--mapa-accent:#a71935}
body :focus-visible{outline-color:#a71935!important}
::selection{background:#a71935;color:#fff}
.primary,.btn-primary,.primary-button,.brand-mark,.atlas-mark>span,.research-page .btn.primary,.research-page .protocol-inline-action .btn,.mapa-button.primary{background:#a71935!important;border-color:#a71935!important;color:#fff!important}
button[aria-pressed=true],.research-lang button[aria-pressed=true],.history-year-buttons button[aria-pressed=true],.mapa-view-toggle button[aria-pressed=true]{background:#a71935!important;border-color:#a71935!important;color:#fff!important}
.research-shell-ready #research-shell,.research-return-bar{background:#fff!important;color:#281c20!important}
.research-brand img{filter:brightness(0);opacity:.86}
.research-primary a[aria-current=page],.research-tool-tabs a[aria-current=page],.research-collection-links a[aria-current=page]{color:#a71935!important;background:#faecef!important}
.research-hero h1,.research-hero h1 .outline,.research-hero h1 .route-accent{color:#a71935!important;-webkit-text-stroke:0}
.research-hero-hollywood,.research-hero-miensk b{color:#fff!important;text-shadow:0 1px 3px #281c20,0 1px 12px #281c20}
.research-language a,.research-brand strong,.detail-label,.detail-kicker,.eyebrow,.mapa-eyebrow,.research-start-number{color:#a71935!important}
.site-header,.hero,.module-rail,.module-head,.dark-section,.hero-section,.manifesto,.corpus-section,.lab-hero{background:#fff!important;color:#281c20!important}
.hero{box-shadow:0 0 0 100vmax #fff}
.history-map-frame,.mapa-region,canvas{background:#071914!important}
.history-map-controls button,.history-year-stamp,.history-year-stamp small,.history-year-stamp>span{background:#071914!important;color:#f1eadf!important}
.history-load-status{background:#fff!important;color:#281c20!important}
.history-polity-label text,.history-city-label{fill:#fff8e6!important}
.history-polity-label .history-polity-subtitle{fill:#f1eadf!important}
.history-city-mark.active .history-city-label{fill:#dfff9a!important}
.history-neighbor-list,.history-city-explorer,.history-context,.history-places-table th,.history-places-table td{color:#281c20}
.history-table-place,.history-context a,.history-city-hint,.history-context>p,.history-country-result{color:#65565b}
`;
export function buildPalettePreview({sourceRoot,siteDirectory}){
  const outputDirectory=path.join(siteDirectory,PREVIEW_PATH.slice(1));
  const result=buildResearchDomain({sourceRoot,outputDirectory,mountPath:PREVIEW_PATH,noindex:true});
  let styles=0;
  for(const file of walk(outputDirectory)){
    if(file.endsWith('.css')){fs.writeFileSync(file,paletteCSS(fs.readFileSync(file,'utf8')));styles++;}
    else if(file.endsWith('.html')){
      let html=fs.readFileSync(file,'utf8');
      html=html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi,(_,attributes,css)=>`<style${attributes}>${paletteCSS(css)}</style>`);
      html=html.replace(/<meta name="theme-color"[^>]*>/gi,'<meta name="theme-color" content="#a71935">');
      html=html.replace('</head>',`<link rel="stylesheet" href="${PREVIEW_PATH}palette-only.css">\n</head>`);
      html=html.replace(/<title>([\s\S]*?)<\/title>/i,'<title>$1 · White–red–white preview</title>');
      fs.writeFileSync(file,html);
    }
  }
  fs.writeFileSync(path.join(outputDirectory,'palette-only.css'),finishingCSS);
  fs.writeFileSync(path.join(outputDirectory,'robots.txt'),'User-agent: *\nDisallow: /\n');
  validateResearchArtifact(outputDirectory,{mountPath:PREVIEW_PATH});
  return {...result,path:PREVIEW_PATH,styles,robots:'noindex,nofollow,noarchive',defaultChanged:false};
}
