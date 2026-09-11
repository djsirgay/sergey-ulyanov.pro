import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const base = new URL('../research/tools/unmute-the-archive/', import.meta.url);
const pages = [
  ['index.html', 'Archive Passport', 'passport'],
  ['atlas/index.html', 'Music Atlas', 'atlas'],
  ['restoration/index.html', 'Restoration Lab', 'restoration'],
];

for (const [file, name, entry] of pages) {
  const html = fs.readFileSync(new URL(file, base), 'utf8');
  test(`${name}: useful, visible initial HTML without JavaScript`, () => {
    const mount = html.match(/<div id="app">([\s\S]*?)<\/div>/)?.[1] ?? '';
    assert.match(mount, /<main\b/);
    assert.match(mount, /<h1\b[^>]*>[^<]+<\/h1>/);
    assert.ok(mount.replace(/<[^>]+>/g, '').trim().length > 300);
    assert.match(mount, /JavaScript/);
    assert.doesNotMatch(mount, /<(?:noscript|button|form)\b|\bhidden\b|display\s*:\s*none|aria-hidden/);
    assert.ok([...mount.matchAll(/<a\b[^>]*href="[^"#][^"]*"/g)].length >= 3);
  });
  test(`${name}: software metadata agrees with the canonical and visible overview`, () => {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json, 'WebApplication JSON-LD is missing');
    const schema = JSON.parse(json);
    assert.equal(schema['@type'], 'WebApplication');
    assert.equal(schema.url, canonical);
    if (schema['@id'] !== undefined) assert.equal(schema['@id'], `${canonical}#application`);
    assert.ok(schema.name.includes(name));
    assert.ok(schema.description.length > 50);
    assert.match(schema.browserRequirements, /JavaScript/);
    assert.equal(schema.aggregateRating, undefined, 'Do not invent ratings');
  });
  test(`${name}: existing client entry and shared navigation remain wired`, () => {
    assert.match(html, new RegExp(`src="(?:\\.\\./|\\./)assets/${entry}-[^"/]+\\.js"`));
    assert.match(html, /src="\/research\/navigation\.js\?v=20260908-nav1"/);
    assert.match(html, /src="\/research\/shared-language\.js\?v=20260909-en-default"/);
    assert.equal((html.match(/id="app"/g) ?? []).length, 1);
    assert.match(html, /<html lang="en">/);
  });
}
