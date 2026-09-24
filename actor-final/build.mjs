import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const source=path.dirname(fileURLToPath(import.meta.url));
const origin='https://heyitissergey.com/';
const args=process.argv.slice(2);
if(args.length && (args.length!==2 || args[0]!=='--out'))throw new Error('Usage: node build.mjs [--out NEW_DIRECTORY]');
if(process.env.VERCEL_ENV==='production' && process.env.VERCEL_GIT_COMMIT_REF && process.env.VERCEL_GIT_COMMIT_REF!=='main')throw new Error('Actor production builds must use main, never gh-pages or an old preview branch.');
const output=path.resolve(args[1]||path.join(source,'dist'));
if(output===source || source.startsWith(output+path.sep) || fs.existsSync(output))throw new Error('Refusing to overwrite source or an occupied output: '+output);
const extensions=new Set(['.html','.css','.js','.svg','.png','.jpg','.jpeg','.webp','.ico','.webmanifest','.woff','.woff2']);
const files=new Map();
function collect(dir,prefix=''){
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    if(['dist','node_modules','.git','.github'].includes(item.name)||item.name.startsWith('.'))continue;
    if(item.isSymbolicLink())throw new Error('Actor source must not contain symlinks: '+item.name);
    const rel=prefix+item.name,full=path.join(dir,item.name);
    if(item.isDirectory())collect(full,rel+'/');
    else if(extensions.has(path.extname(item.name)))files.set(rel,fs.readFileSync(full));
  }
}
collect(source);
if(!files.has('index.html'))throw new Error('Missing actor index.html');
let html=files.get('index.html').toString('utf8');
for(const text of ['Snapchat','Intuit TurboTax · The Tax Breakup','Wife Wife'])if(!html.includes(text))throw new Error('Actor content regression: '+text);
html=html.replaceAll('https://sergey-ulyanov.pro/actor-final/',origin);
files.set('index.html',Buffer.from(html));
// Validate dependencies reachable from the actual entry point, not retired fragments.
const seen=new Set();
function check(rel){
  if(seen.has(rel))return;seen.add(rel);
  if(!files.has(rel))throw new Error('Missing actor-local dependency: '+rel);
  if(!/\.(html|css|js)$/.test(rel))return;
  const text=files.get(rel).toString('utf8');
  const refs=rel.endsWith('.html')?[...text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)].map(m=>m[1]):rel.endsWith('.css')?[...text.matchAll(/url\(\s*["']?([^\s)'";]+)["']?\s*\)|@import\s+["']([^"']+)["']/g)].map(m=>m[1]||m[2]):[];
  for(const ref of refs){
    if(!ref || ref.startsWith('#') || ref.startsWith('?') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(ref))continue;
    const url=new URL(ref,new URL(rel,origin));
    const dep=decodeURIComponent(url.pathname).replace(/^\//,'');
    check(dep||'index.html');
  }
}
check('index.html');
files.set('robots.txt',Buffer.from('User-agent: *\nAllow: /\nSitemap: '+origin+'sitemap.xml\n'));
files.set('sitemap.xml',Buffer.from('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+origin+'</loc></url></urlset>\n'));
files.set('deployment.json',Buffer.from(JSON.stringify({site:'heyitissergey.com',sourceDirectory:'actor-final',sourceCommit:process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||null,homepageSha256:createHash('sha256').update(html).digest('hex')},null,2)+'\n'));
fs.mkdirSync(output,{recursive:true});
for(const [name,bytes]of files){const target=path.join(output,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
console.log(JSON.stringify({site:'heyitissergey.com',output,files:files.size,checkedDependencies:seen.size,homepageSha256:createHash('sha256').update(html).digest('hex')}));
