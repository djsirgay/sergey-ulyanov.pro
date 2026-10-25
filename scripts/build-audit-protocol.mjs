import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'research/protocol');
const filename = 'instrument.v0.3.json';
const source = fs.readFileSync(path.join(directory, filename), 'utf8');
const data = JSON.parse(source);
const sha = value => createHash('sha256').update(value).digest('hex');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const manifest = {
  schemaVersion: 1,
  protocolVersion: data.protocolVersion,
  promptBankVersion: data.version,
  revisionDate: data.revisionDate,
  status: data.status,
  collectionFrozen: false,
  scoredLanguage: 'be',
  englishReadingOnly: true,
  promptCount: data.prompts.length,
  instrumentFile: filename,
  instrumentFileSha256: sha(source),
  scoredPromptsSha256: sha(JSON.stringify(data.prompts.map(({id, be}) => ({id, be})))),
  scoredHashSerialization: 'UTF-8 JSON.stringify of the ordered array of objects with keys id, be; no added whitespace',
  previousSnapshot: data.previousSnapshot
};
if (data.prompts.length !== 36 || data.groups.length !== 6 || data.collectionFrozen !== false) {
  throw new Error('The review snapshot must contain six groups and 36 unfrozen prompts');
}
const bankHTML = `<div class="prompt-bank">\n${data.groups.map((group, index) => {
  const prompts = data.prompts.slice(index * 6, index * 6 + 6);
  return `          <details class="prompt-group"${index === 0 ? ' open' : ''}><summary><span>${group.id}</span><b>${escape(group.title)}</b><em>6 prompts</em></summary><ol start="${index * 6 + 1}" role="list">\n${prompts.map(prompt => `            <li id="prompt-${prompt.id}" data-prompt-id="${prompt.id}"><a class="prompt-id" href="#prompt-${prompt.id}">${prompt.id}</a><p class="prompt-original" lang="be" data-research-owned>${escape(prompt.be)}</p><p class="prompt-reading" lang="en" data-research-owned><strong>English reading translation:</strong> ${escape(prompt.en)}</p></li>`).join('\n')}\n          </ol></details>`;
}).join('\n')}\n        </div>`;
const htmlFile = path.join(directory, 'index.html');
const oldHTML = fs.readFileSync(htmlFile, 'utf8');
const bankPattern = /<div class="prompt-bank">[\s\S]*?<\/div>/;
if (!bankPattern.test(oldHTML)) throw new Error('Prompt-bank boundary missing');
let newHTML = oldHTML.replace(bankPattern, bankHTML);
newHTML = newHTML.replace(/(<code id="instrument-sha256"[^>]*>)[\s\S]*?(<\/code>)/, `$1${manifest.scoredPromptsSha256}$2`);
const manifestText = JSON.stringify(manifest, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (newHTML !== oldHTML || !fs.existsSync(path.join(directory, 'instrument.manifest.json')) ||
      fs.readFileSync(path.join(directory, 'instrument.manifest.json'), 'utf8') !== manifestText) {
    throw new Error('Protocol HTML or manifest is stale; run node scripts/build-audit-protocol.mjs');
  }
  console.log(`Protocol snapshot current: ${data.prompts.length} prompts; scored SHA-256 ${manifest.scoredPromptsSha256}; not frozen`);
} else {
  fs.writeFileSync(htmlFile, newHTML);
  fs.writeFileSync(path.join(directory, 'instrument.manifest.json'), manifestText);
  console.log(`Built review bank v${data.version}: ${data.prompts.length} prompts; scored SHA-256 ${manifest.scoredPromptsSha256}; not frozen`);
}
