import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFileSync(join(root, name), 'utf8');
const tags = (source, tag) => [...source.matchAll(new RegExp('<'+tag+'\\b([^>]*)>', 'g'))].map(match => match[1]);
const attr = (markup, name) => markup.match(new RegExp('(?:^|\\s)'+name+'="([^"]*)"'))?.[1];

const cases = readdirSync(join(root, 'case-studies'), {withFileTypes:true})
  .filter(entry => entry.isDirectory() && existsSync(join(root, 'case-studies', entry.name, 'index.html')))
  .map(entry => 'case-studies/'+entry.name+'/index.html');
const professionalPages = ['index.html','hire/index.html','press/index.html','work/index.html','evidence/index.html',...cases];

test('professional external sources, PDFs and image previews stay in a separate tab without an opener', () => {
  let count = 0;
  for (const page of professionalPages) {
    for (const a of tags(read(page), 'a')) {
      const href = attr(a, 'href');
      if (!href || !/^(?:https?:|\/)/.test(href)) continue;
      const url = new URL(href, 'https://sergey-ulyanov.pro');
      if (url.hostname === 'sergey-ulyanov.pro' && !/\.(?:pdf|jpe?g|png|webp|avif)$/i.test(url.pathname) && !url.pathname.startsWith('/research/')) continue;
      assert.equal(attr(a,'target'), '_blank', page+' '+href);
      assert.ok(attr(a,'rel')?.split(/\s+/).includes('noopener'), page+' '+href);
      count++;
    }
  }
  assert.ok(count > 35);
  const caseLink = tags(read('index.html'), 'a').find(a => attr(a,'href') === '/case-studies/scream-7-complex/');
  assert.equal(attr(caseLink,'target'), undefined);
});

test('portfolio links reach actual local routes and fragments', () => {
  for (const page of professionalPages) {
    for (const a of tags(read(page), 'a')) {
      const href = attr(a, 'href');
      if (!href?.startsWith('/') && !href?.startsWith('#')) continue;
      const url = new URL(href, 'https://sergey-ulyanov.pro/'+page);
      if (url.hostname !== 'sergey-ulyanov.pro') continue;
      const path = url.pathname.endsWith('/') ? url.pathname+'index.html' : url.pathname;
      assert.ok(existsSync(join(root,path)), page+' '+href);
      if (url.hash && path.endsWith('.html')) {
        assert.ok(read(path).includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'), page+' '+href);
      }
    }
  }
});

test('four editing previews are actual watch links and the two McDonald’s cases keep results separate', () => {
  const editing = tags(read('case-studies/video-editing/index.html'), 'a');
  assert.equal(editing.filter(a => attr(a,'class') === 'case-image-link').length,4);
  for (const id of ['Si3cF-w06IU','x0K94uUbcEE','BT2fksGo6S0','XkWH1pLDH08']) {
    assert.ok(editing.some(a => attr(a,'class') === 'case-image-link' && attr(a,'href')?.endsWith(id)), id);
  }
  assert.doesNotMatch(read('case-studies/mcdonalds-campaigns/index.html'), /200K|230K/);
  assert.match(read('case-studies/mchappy-day/index.html'), /href="\/case-studies\/mcdonalds-campaigns\/"/);
});
