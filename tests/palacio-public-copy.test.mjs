import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const route = path.join(root, 'palacio-study');

test('Palacio public copy is a self-contained, non-interactive review package', () => {
  assert.ok(fs.existsSync(path.join(route, 'index.html')), 'The sanitized public route must exist');
  const files = fs.readdirSync(route).sort();
  assert.deepEqual(files, ['index.html', 'palacio-wordmark.svg', 'study.css']);
  const html = fs.readFileSync(path.join(route, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<(?:audio|video|iframe|form|input|button|script)\b/i,
    'This review copy must not ship private media, input collection, or active app code');
  assert.doesNotMatch(html, /(?:password|api[_-]?key)\s*[:=]|AIza[\w-]+|mailto:/i);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)) {
    assert.ok(fs.existsSync(path.resolve(route, asset)), `Missing local asset ${asset}`);
  }
  const svg = fs.readFileSync(path.join(route, 'palacio-wordmark.svg'), 'utf8');
  assert.doesNotMatch(svg, /<(?:script|image|foreignObject)\b|(?:href|xlink:href)=/i);
});

test('Palacio study cannot submit, embed another site, or make background network requests', () => {
  assert.ok(fs.existsSync(path.join(route, 'index.html')), 'The public review route must exist');
  const html = fs.readFileSync(path.join(route, 'index.html'), 'utf8');
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)?.[1];
  assert.ok(policy, 'The public package needs an explicit network boundary');
  for (const directive of ["connect-src 'none'", "form-action 'none'", "frame-src 'none'", "script-src 'none'"]) {
    assert.ok(policy.split(';').map(x => x.trim()).includes(directive), `Missing ${directive}`);
  }
});
