import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildResearchDomain,transformResearchText} from '../scripts/build-research-domain.mjs';
import {buildPalettePreview,paletteCSS,PALETTE,PREVIEW_PATH} from '../scripts/build-research-palette-preview.mjs';
const root=path.resolve(import.meta.dirname,'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const luminance=hex=>{const values=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return values[0]*.2126+values[1]*.7152+values[2]*.0722};
const ratio=(a,b)=>{const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(l[0]+.05)/(l[1]+.05)};
test('white-red palette meets AA contrast for primary text, muted text and red actions',()=>{
 for(const [fg,bg] of [[PALETTE.ink,PALETTE.paper],[PALETTE.muted,PALETTE.paper],[PALETTE.red,PALETTE.paper],[PALETTE.paper,PALETTE.red],[PALETTE.ink,PALETTE.panel],[PALETTE.muted,PALETTE.panel]])assert.ok(ratio(fg,bg)>=4.5,`${fg}/${bg}: ${ratio(fg,bg)}`);
});
test('palette transform does not alter layout, typography, image URLs or map fills',()=>{
 const css='.x{display:grid;grid-template-columns:1fr 2fr;padding:18px;font-size:16px;background:#06110f;color:#f1efdc;background-image:url("/assets/photo.webp");fill:#456922;stroke:#efcdab;mask-image:linear-gradient(#000,transparent)}';
 const result=paletteCSS(css);
 for(const declaration of ['display:grid','grid-template-columns:1fr 2fr','padding:18px','font-size:16px','background-image:url("/assets/photo.webp")','fill:#456922','stroke:#efcdab','mask-image:linear-gradient(#000,transparent)'])assert.ok(result.includes(declaration),declaration);
 assert.match(result,/background:#faf5f4/);assert.match(result,/color:#281c20/);
});
test('mounted navigation and module imports stay in preview; portfolio links stay external',()=>{
 const result=transformResearchText(`const ROOT='/research/';const music='/research/tools/unmute-the-archive/atlas/';<script src='/research/navigation.js'></script><link href='/styles-routes.css'><a href='/work/'>Work</a>`,'research/index.html',PREVIEW_PATH);
 assert.match(result,/ROOT='\/palette-preview\/white-red\/'/);
 assert.match(result,/\/palette-preview\/white-red\/tools\/unmute-the-archive\/atlas\//);
 assert.match(result,/\/palette-preview\/white-red\/navigation\.js/);
 assert.match(result,/\/palette-preview\/white-red\/styles-routes\.css/);
 assert.match(result,/https:\/\/sergey-ulyanov\.pro\/work\//);
});
test('preview addition preserves every primary byte, all images and every noindex route',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'research-palette-test-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const site=path.join(dir,'site');buildResearchDomain({sourceRoot:root,outputDirectory:site});
 const before=new Map(walk(site).map(file=>[path.relative(site,file),sha(file)]));
 const preview=buildPalettePreview({sourceRoot:root,siteDirectory:site});
 for(const [file,hash] of before)assert.equal(sha(path.join(site,file)),hash,`Default changed: ${file}`);
 const pages=walk(preview.outputDirectory).filter(f=>f.endsWith('.html'));
 assert.ok(pages.length>=11);
 for(const file of pages){const html=fs.readFileSync(file,'utf8');assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive">/);assert.match(html,/palette-only\.css/);}
 for(const [relative,hash] of before)if(/\.(?:png|jpe?g|webp|svg|avif|mp3|wav|pdf)$/i.test(relative))assert.equal(sha(path.join(preview.outputDirectory,relative)),hash,`Media changed: ${relative}`);
 assert.doesNotMatch(fs.readFileSync(path.join(site,'sitemap.xml'),'utf8'),/palette-preview/);
 assert.doesNotMatch(fs.readFileSync(path.join(preview.outputDirectory,'sitemap.xml'),'utf8'),/<loc>/);
});
