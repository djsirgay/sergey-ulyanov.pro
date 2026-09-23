import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SOURCE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RESEARCH_ORIGIN = 'https://research.sergey-ulyanov.pro';
export const CURRENT_LISTENING_LOGIN = 'https://unmute.sergey-ulyanov.pro/login/';
const htmlEscape = text => String(text).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
function htmlFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    if(entry.isSymbolicLink())throw new Error('Artifact must not contain symlinks: '+entry.name);
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith('.html') ? [filename] : [];
  });
}
function redirectScript(destination,{pilot=false,recovery=false}={}) {
  const target = JSON.stringify(destination).replace(/</g, '\\u003c');
  const guard=recovery?"if(new URLSearchParams(location.search).get('stay')==='1'&&location.hash==='#browser-data')return;":'';
  const state=pilot?"const lang=new URLSearchParams(location.search).get('lang');target.searchParams.set('lang',['en','be','ru'].includes(lang)?lang:'en');":"target.search=location.search;target.hash=location.hash;";
  return `<script>(()=>{${guard}const target=new URL(${target});${state}location.replace(target.href);})();</script>`;
}
export function legacyRedirectHTML(destination,{pilot=false}={}) {
  const name=pilot?'GUCHNA':'Unmute Belarus';
  const fallback=pilot?destination+'?lang=en':destination;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${pilot?'noindex,nofollow,noarchive':'noindex,follow'}"><meta name="referrer" content="no-referrer"><link rel="canonical" href="${htmlEscape(destination)}"><title>${name} — current website</title>${redirectScript(destination,{pilot})}</head><body><main><h1>${name}</h1><p>This page has moved. Continue to the current ${pilot?'listening pilot':'research page'}.</p><p><a id="legacy-research-destination" href="${htmlEscape(fallback)}">Open the current page →</a></p><noscript><p>JavaScript is off; use the link above.</p></noscript></main></body></html>\n`;
}
export function buildLegacyResearchRedirects({sourceRoot=SOURCE_ROOT,artifactDirectory}={}) {
  if(typeof artifactDirectory!=='string'||!artifactDirectory)throw new Error('An existing artifact directory is required.');
  const source=fs.realpathSync(sourceRoot),artifact=fs.realpathSync(artifactDirectory);
  const sourceResearch=path.join(source,'research');
  if(artifact===source||source.startsWith(artifact+path.sep)||artifact===sourceResearch||artifact.startsWith(sourceResearch+path.sep))throw new Error('Redirects must target a separate artifact, never the source tree.');
  if(fs.lstatSync(artifactDirectory).isSymbolicLink())throw new Error('Artifact directory must not be a symlink.');
  const directory = path.join(artifact, 'research');
  if(fs.lstatSync(directory).isSymbolicLink())throw new Error('Artifact research directory must not be a symlink.');
  // Enumerate and validate the whole tree before any writes, avoiding a partial
  // mutation when a later entry is a symlink into the source or another directory.
  const files=htmlFiles(directory);
  let redirects=0,recoveryPages=0;
  for(const filename of files) {
    const relative=path.relative(directory,filename).split(path.sep).join('/');
    // These are explicit same-origin saved-data recovery links from the old pilot.
    // They must retain their code and storage origin; normal entry never runs it.
    if(relative==='unmute-pilot/legacy.html'){recoveryPages++;continue;}
    const route=relative.replace(/(?:^|\/)index\.html$/, match=>match.startsWith('/')?'/':'');
    const destination=RESEARCH_ORIGIN+'/'+route;
    let html;
    if(['help/index.html','system/index.html'].includes(relative)) {
      const original=fs.readFileSync(filename,'utf8');
      html=original.replace(/<head([^>]*)>/i,`<head$1><meta name="robots" content="noindex,follow">${redirectScript(destination,{recovery:true})}`);
      if(html===original)throw new Error('Recovery artifact has no head: '+relative);
      recoveryPages++;
    } else html=legacyRedirectHTML(relative.startsWith('unmute-pilot/')?CURRENT_LISTENING_LOGIN:destination,{pilot:relative.startsWith('unmute-pilot/')});
    fs.writeFileSync(filename,html); redirects++;
  }
  return {artifactDirectory:artifact,redirects,recoveryPages};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2);
  if(args.length!==2||args[0]!=='--artifact')throw new Error('Usage: node scripts/build-legacy-research-redirects.mjs --artifact EXISTING_ARTIFACT');
  console.log(JSON.stringify(buildLegacyResearchRedirects({artifactDirectory:args[1]}),null,2));
}
