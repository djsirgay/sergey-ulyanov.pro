import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {buildResearchDomain} from '../scripts/build-research-domain.mjs';
import {buildPalettePreview} from '../scripts/build-research-palette-preview.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = () => read('research/protocol/index.html');
const sha = value => createHash('sha256').update(value).digest('hex');
const bank = () => {
  assert.ok(fs.existsSync(path.join(root, 'research/protocol/instrument.v0.3.json')),
    'Readers need the versioned review instrument, not an unversioned list');
  return JSON.parse(read('research/protocol/instrument.v0.3.json'));
};

test('C14 replaces the supplied conclusion with explicit fictional evidence cards', () => {
  assert.match(html(), /id="prompt-C14"[\s\S]*?Ніжэй — два выдуманыя апісы/);
  assert.doesNotMatch(html(), /Растлумач замежнаму чытачу, чаму нельга аўтаматычна/);
});

test('all 36 stable prompts have separate English reading translations and Belarusian input text', () => {
  assert.equal([...html().matchAll(/data-prompt-id="([A-F]\d+)"/g)].length, 36);
  assert.equal([...html().matchAll(/class="prompt-original" lang="be"/g)].length, 36);
  assert.equal([...html().matchAll(/class="prompt-reading" lang="en"/g)].length, 36);
  assert.match(html(), /English reading translations are not additional scored prompts/);
});

test('only C14 and C15 change in the administered Belarusian bank', () => {
  const data = bank();
  assert.equal(data.prompts.length, 36);
  assert.equal(new Set(data.prompts.map(prompt => prompt.id)).size, 36);
  const unchanged = data.prompts.filter(prompt => !['C14', 'C15'].includes(prompt.id))
    .map(({id, be}) => ({id, be}));
  assert.equal(sha(JSON.stringify(unchanged)), '3507400527b6a39d215808e8a0accb410f265b533a10d429758b468ebcc0180a');
  data.prompts.forEach((prompt, index) => {
    assert.equal(prompt.id, `${'ABCDEF'[Math.floor(index / 6)]}${index + 1}`);
    assert.ok(prompt.en.length > 40, prompt.id);
  });
});

test('C15 supplies its source cards as part of the exact input rather than an absent attachment', () => {
  const prompt = bank().prompts.find(prompt => prompt.id === 'C15');
  for (const language of ['be', 'en']) {
    assert.match(prompt[language], /S1/);
    assert.match(prompt[language], /S2/);
    assert.match(prompt[language], /https:\/\/shumaduo\.bandcamp\.com\/track\/zamova/);
    assert.match(prompt[language], /https:\/\/shumaduo\.bandcamp\.com\/album\/bahna/);
  }
});

test('review hashes describe a reproducible snapshot without falsely declaring collection frozen', () => {
  const data = bank();
  const manifest = JSON.parse(read('research/protocol/instrument.manifest.json'));
  assert.equal(data.version, '0.3');
  assert.equal(data.collectionFrozen, false);
  assert.equal(manifest.collectionFrozen, false);
  assert.equal(manifest.scoredLanguage, 'be');
  assert.equal(manifest.englishReadingOnly, true);
  assert.equal(manifest.instrumentFileSha256, sha(read('research/protocol/instrument.v0.3.json')));
  assert.equal(manifest.scoredPromptsSha256, sha(JSON.stringify(data.prompts.map(({id, be}) => ({id, be})))));
  assert.ok(html().includes(manifest.scoredPromptsSha256));
  assert.match(html(), /not a collection freeze/);
  assert.match(html(), /77154e4[^\s"<]*\/research\/protocol\/index\.html/);
  execFileSync(process.execPath, ['scripts/build-audit-protocol.mjs', '--check'], {cwd: root});
});

test('public design distinguishes three runs, missing dimensions and response-level reliability', () => {
  assert.match(html(), /36 prompts × 3 systems × 3 runs = 324 planned responses per web condition/);
  assert.match(html(), /108 first-pass responses/);
  assert.match(html(), /N\/A, not zero/);
  assert.match(html(), /rounded up within each system-condition group/);
  assert.match(html(), /linearly weighted Cohen/);
  assert.match(html(), /not independent learner observations/);
});

test('current research home and translated version labels agree with the new review snapshot', () => {
  assert.match(read('research/index.html'), /Public protocol v0\.2 · 36-prompt bank v0\.3 · no findings claimed/);
  assert.match(read('research/i18n.js'), /Public protocol v0\.2 · 36-prompt bank v0\.3 · no findings claimed/);
  assert.match(read('research/shared-language.js'), /Prompt bank · v0\.3/);
});

test('both published palettes contain the same revised bank and downloadable hashes', t => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'protocol-review-test-'));
  t.after(() => fs.rmSync(temporary, {recursive: true, force: true}));
  const output = path.join(temporary, 'site');
  buildResearchDomain({sourceRoot: root, outputDirectory: output});
  const preview = buildPalettePreview({sourceRoot: root, siteDirectory: output});
  for (const directory of [output, preview.outputDirectory]) {
    const page = fs.readFileSync(path.join(directory, 'protocol/index.html'), 'utf8');
    assert.match(page, /id="prompt-C14"/);
    assert.match(page, /id="prompt-C15"/);
    assert.equal([...page.matchAll(/class="prompt-reading" lang="en"/g)].length, 36);
    assert.equal(fs.readFileSync(path.join(directory, 'protocol/instrument.v0.3.json'), 'utf8'), read('research/protocol/instrument.v0.3.json'));
    assert.equal(fs.readFileSync(path.join(directory, 'protocol/instrument.manifest.json'), 'utf8'), read('research/protocol/instrument.manifest.json'));
  }
});
