import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PORTFOLIO_ORIGIN = 'https://sergey-ulyanov.pro';
export const RESEARCH_ORIGIN = 'https://research.sergey-ulyanov.pro';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEXT = /\.(?:html|css|js|json|geojson|svg|txt|md)$/i;
const PUBLIC = /\.(?:html|css|js|json|geojson|svg|txt|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|mp3|wav|ogg|m4a|mp4|webm|pdf)$/i;
const ASSET = /\.(?:css|js|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|mp3|wav|ogg|m4a|mp4|webm|pdf)$/i;
const EXCLUDED_PART = /^(?:\..*|node_modules|tests?|fixtures?|scripts?|private|notes?|drafts?)$/i;
const slash = value => value.split(path.sep).join('/');

export function isPublicResearchFile(relative) {
  const parts = slash(relative).split('/');
  if (parts.some(part => EXCLUDED_PART.test(part))) return false;
  const name = parts.at(-1);
  if (/^(?:LICENSE|COPYING)(?:[-_.].*)?$/i.test(name)) return true;
  return PUBLIC.test(name) && !/\.(?:test|spec)\./i.test(name)
    && !/(?:^|[-_.])(?:private|draft|notes)(?:[-_.]|$)/i.test(name);
}

// Source URLs retain their original meaning before the /research mount is removed.
// A root portfolio link is not the same thing as a /research/ home link.
export function transformResearchText(source, sourceRelative = '') {
  let output = source;
  // Reproducibility/source links remain usable without shipping build tools or notes.
  output = output.replace(/(\bhref\s*=\s*["'])([^"']+)(["'])/g, (whole, prefix, reference, quote) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(reference)) return whole;
    const pathname = reference.split(/[?#]/)[0];
    if (!/\.(?:mjs|md)$/.test(pathname) || /^LICENSE.*\.md$/i.test(path.posix.basename(pathname))) return whole;
    const filename = pathname.startsWith('/') ? pathname.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(slash(sourceRelative)), pathname));
    return `${prefix}https://github.com/djsirgay/sergey-ulyanov.pro/blob/main/${filename}${reference.slice(pathname.length)}${quote}`;
  });
  const preserved = [];
  if (slash(sourceRelative) === 'research/storage-migration.js' || slash(sourceRelative) === 'storage-migration.js') {
    output = output.replace(/https:\/\/sergey-ulyanov\.pro\/research\/[^\s"'`<>]+/g, value => {
      preserved.push(value); return `__RESEARCH_LEGACY_ORIGIN_${preserved.length - 1}__`;
    });
    output = output.replace(/https:\/\/research\.sergey-ulyanov\.pro\/(?:research\/)?system\/#browser-data/g,
      `${RESEARCH_ORIGIN}/help/#browser-data`);
  }
  output = output.replace(/https:\/\/sergey-ulyanov\.pro\/research(?=\/|[?#"'`\s<]|$)/g, RESEARCH_ORIGIN);
  output = output.replace(/https:\/\/research\.sergey-ulyanov\.pro\/research(?=\/|[?#"'`\s<]|$)/g, RESEARCH_ORIGIN);
  // Preserve old portfolio sections, including links embedded in JS templates.
  output = output.replace(/(["'`])\/(hire|work|press|evidence|privacy|case-studies|about|contact|actor-final)(?=\/|[?#"'`])/g,
    (_, quote, section) => `${quote}${PORTFOLIO_ORIGIN}/${section}`);
  output = output.replace(/(\bhref\s*=\s*\\?["'])\/(?=[?#]|\\?["'])/g, `$1${PORTFOLIO_ORIGIN}/`);
  // Do not modify external archive/GitHub URLs that happen to contain /research/.
  output = output.replace(/(?<![A-Za-z0-9._~:/-])\/research(?=\/|[?#"'`\s<]|$)\/?/g, '/');
  output = output.replace(/__RESEARCH_LEGACY_ORIGIN_(\d+)__/g, (_, index) => preserved[Number(index)]);
  return output;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error(`Symlink is not allowed in the public build: ${path.join(directory, entry.name)}`);
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? (EXCLUDED_PART.test(entry.name) ? [] : walk(filename)) : [filename];
  });
}

function references(source) {
  const found = new Set();
  for (const [, value] of source.matchAll(/(?:href|src|poster)\s*=\s*["']([^"']+)["']/g)) found.add(value);
  for (const [, value] of source.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) found.add(value);
  for (const [, value] of source.matchAll(/["'`]((?:\/|\.\.?\/)[^"'`\s<>]+)["'`]/g)) found.add(value);
  for (const [, value] of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) found.add(value);
  return [...found];
}

function localTarget(root, sourceFile, reference) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(reference)) return null;
  let pathname;
  try { pathname = decodeURIComponent(reference.split(/[?#]/)[0]); } catch { return null; }
  if (!pathname || /[${}]/.test(pathname)) return null;
  const target = pathname.startsWith('/') ? path.resolve(root, `.${pathname}`) : path.resolve(path.dirname(sourceFile), pathname);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error(`Reference escapes source root: ${reference}`);
  return target;
}

export function validateResearchArtifact(outputDirectory) {
  const failures = [], pages = walk(outputDirectory).filter(file => file.endsWith('.html'));
  for (const file of pages) {
    const source = fs.readFileSync(file, 'utf8');
    for (const [, reference] of source.matchAll(/(?:href|src|poster)\s*=\s*["']([^"']+)["']/g)) {
      let target = localTarget(outputDirectory, file, reference);
      if (!target) continue;
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) failures.push(`${slash(path.relative(outputDirectory, file))} → ${reference}`);
    }
  }
  if (failures.length) throw new Error(`Broken research-domain links:\n${failures.join('\n')}`);
  return { pages: pages.length };
}

export function buildResearchDomain({ sourceRoot = ROOT, outputDirectory = path.join(ROOT, '_research-site') } = {}) {
  const root = fs.realpathSync(sourceRoot);
  let existing = path.resolve(outputDirectory), suffix = [];
  while (!fs.existsSync(existing)) { suffix.unshift(path.basename(existing)); existing = path.dirname(existing); }
  const destination = path.join(fs.realpathSync(existing), ...suffix);
  if (destination === root || root.startsWith(`${destination}${path.sep}`) || destination.startsWith(`${root}${path.sep}research${path.sep}`) || destination === path.join(root, 'research')) {
    throw new Error('Build output must not overwrite the source tree or one of its parents.');
  }
  if (fs.existsSync(destination) && fs.readdirSync(destination).length) throw new Error(`Build output must be empty: ${destination}`);
  const researchRoot = path.join(root, 'research');
  const selected = new Map();
  for (const file of walk(researchRoot)) {
    const relative = slash(path.relative(researchRoot, file));
    if (isPublicResearchFile(relative)) selected.set(file, relative);
  }
  if (!selected.has(path.join(researchRoot, 'index.html'))) throw new Error('Research homepage is missing.');
  // Root files are an allowlisted dependency closure, not a copy of the portfolio.
  const queue = [...selected.keys()], inspected = new Set();
  for (let index = 0; index < queue.length; index++) {
    const file = queue[index];
    if (inspected.has(file) || !TEXT.test(file)) continue;
    inspected.add(file);
    for (const reference of references(fs.readFileSync(file, 'utf8'))) {
      const target = localTarget(root, file, reference);
      if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile() || selected.has(target)) continue;
      const relative = slash(path.relative(root, target));
      const allowedRoot = /^styles[-\w]*\.css$/i.test(relative) || ['site.js', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png'].includes(relative);
      const allowedAsset = relative.startsWith('assets/') && ASSET.test(relative) && !relative.split('/').some(part => EXCLUDED_PART.test(part));
      if (allowedRoot || allowedAsset) {
        if (fs.lstatSync(target).isSymbolicLink() || !fs.realpathSync(target).startsWith(`${root}${path.sep}`)) {
          throw new Error(`Public dependency must not follow a symlink outside the source: ${relative}`);
        }
        selected.set(target, relative); queue.push(target);
      }
    }
  }
  fs.mkdirSync(destination, { recursive: true });
  const written = [];
  for (const [file, relative] of selected) {
    const target = path.join(destination, relative);
    if (fs.existsSync(target)) throw new Error(`Public path collision: ${relative}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (TEXT.test(file)) fs.writeFileSync(target, transformResearchText(fs.readFileSync(file, 'utf8'), slash(path.relative(root, file))));
    else fs.copyFileSync(file, target);
    written.push(relative);
  }
  fs.writeFileSync(path.join(destination, 'CNAME'), `${new URL(RESEARCH_ORIGIN).hostname}\n`);
  fs.writeFileSync(path.join(destination, '.nojekyll'), '');
  const pages = written.filter(file => file.endsWith('/index.html') || file === 'index.html');
  const indexed = pages.filter(file => !/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(fs.readFileSync(path.join(destination, file), 'utf8')));
  const urls = indexed.map(file => `${RESEARCH_ORIGIN}/${file.replace(/(?:^|\/)index\.html$/, match => match.startsWith('/') ? '/' : '')}`);
  fs.writeFileSync(path.join(destination, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(destination, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${RESEARCH_ORIGIN}/sitemap.xml\n`);
  const validation = validateResearchArtifact(destination);
  return { outputDirectory: destination, files: written.length + 4, ...validation };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some((value, index) => index % 2 === 0 && !['--source', '--out'].includes(value)) || args.length % 2) {
    throw new Error('Usage: node scripts/build-research-domain.mjs [--source SOURCE] [--out EMPTY_OUTPUT]');
  }
  const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, index) => [args[index * 2], args[index * 2 + 1]]));
  console.log(JSON.stringify(buildResearchDomain({ sourceRoot: options['--source'] || ROOT, outputDirectory: options['--out'] || path.join(ROOT, '_research-site') }), null, 2));
}
