import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('research/index.html',root),'utf8');
const i18n = readFileSync(new URL('research/i18n.js',root),'utf8');

test('listening pilot is a full-card entry while prior tools remain reachable',()=>{
  assert.match(html,/<a class="research-start-card" href="\/research\/unmute-pilot\/#discover">/);
  assert.match(html,/href="\/research\/unmute-pilot\/#participate"/);
  assert.match(html,/href="\/research\/tools\/unmute-the-archive\/atlas\/#external-discovery"/);
  assert.match(html,/href="\/research\/atlas\/mapa\/"/);
  assert.equal((html.match(/class="research-start-card"/g)||[]).length,6);
  assert.doesNotMatch(html,/All five tools/);
});
test('pilot introduction is bounded and localized',()=>{
  for(const text of ['NEW · LISTENING PILOT','Find Belarusian-language music for your moment.','Try Unmute music discovery ↗','Join the listening pilot ↗','Archive & culture tools ↗'])assert.ok(i18n.includes(text));
  assert.match(html,/Search covers a growing, bounded catalogue—not the whole internet/);
  assert.match(html,/participant testing is next/);
});
