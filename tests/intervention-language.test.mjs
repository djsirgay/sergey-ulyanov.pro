// Execute the real shared dictionaries/translator with minimal DOM doubles.
// These are copy, state, and preservation checks—not a browser accessibility test.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../research/shared-language.js', import.meta.url), 'utf8');
const initialization = "  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();";
assert.ok(source.includes(initialization));
const context = {
  document: {
    addEventListener() {},
    createTreeWalker(root) {
      let index = -1;
      return { currentNode: null, nextNode() { this.currentNode = root.nodes[++index]; return Boolean(this.currentNode); } };
    }
  },
  NodeFilter: { SHOW_TEXT: 4, FILTER_REJECT: 2, FILTER_ACCEPT: 1 }
};
vm.createContext(context);
vm.runInContext(source.replace(initialization, '  globalThis.languageTest = { be, attrBe, translateTextNode, translateTree, setLanguage(value) { lang = value; } };'), context);
const api = context.languageTest;

function text(value, { journalField, restorationField, protectedValue = false, sourceNote = false, sourceCheck = false } = {}) {
  const labelText = { nodeValue: journalField || restorationField || '', parentElement: { closest: () => null } };
  const label = { firstChild: labelText, get textContent() { return labelText.nodeValue; } };
  const cell = { parentElement: { querySelector: () => label } };
  const parent = { closest(selector) {
    if (selector === '.intervention-receipt dd, #intervention-log dd') return journalField || restorationField ? cell : null;
    if (selector === '.intervention-receipt dd') return journalField ? cell : null;
    if (selector.startsWith('#live-receipt > h3')) return protectedValue ? parent : null;
    if (selector === '#intervention-source-note') return sourceNote ? parent : null;
    if (selector === '#source-check') return sourceCheck ? parent : null;
    return null;
  } };
  return { node: { nodeValue: value, parentElement: parent }, labelText };
}

test('new critical labels, boundaries, review errors, and race protection have Belarusian copy', () => {
  for (const key of [
    'Source master & derived file', 'Processing type & details', 'Permission scope', 'Review status',
    'Not disclosed', 'Not applicable', 'Pending — not reviewed', 'Reviewed — not automatically approved',
    'Unknown or No permission can be documented. Registration does not authorize processing, redistribution, or reuse, and the master\'s rights do not automatically cover this derivative.',
    'Please complete permission scope (or what is unknown).', 'Please complete reviewer name or pseudonym.',
    'Please complete review note.', 'Choose a disclosure status for model name.',
    'Model is not applicable only when processing is explicitly non-AI. Choose Unknown if you do not know.',
    'The source passport changed while fingerprinting. Your form is still here; reopen the current passport and register again.',
    'The intervention journal names a different source master.',
    'Structured review not recorded.', 'Declared human review status',
    'Listening note — review remains pending',
    'Pending note saved; audio and processing settings unchanged.',
    'An existing human review cannot be replaced by a pending note.',
    'The saved processing record changed. Reopen the passport before editing its note.',
    'Metrics describe decoded audio. The browser may resample it; this is not a measurement of the original file’s encoded sample rate. Source file bytes remain untouched.'
  ]) {
    assert.ok(api.be.has(key), `Missing translation: ${key}`);
    assert.match(api.be.get(key), /[А-Яа-яІіЎў]/u);
    assert.notEqual(api.be.get(key), key);
  }
  assert.notEqual(api.be.get('Not disclosed'), api.be.get('Unknown'));
  assert.notEqual(api.be.get('Not applicable'), api.be.get('Unknown'));
});

test('generated disclosure aria-labels and all new placeholders are translated', () => {
  for (const field of ['Tool name', 'Tool version', 'Model', 'Settings', 'Processing instruction / method']) {
    for (const suffix of [' disclosure', ' details']) assert.ok(api.attrBe.has(field + suffix), field + suffix);
  }
  for (const key of [
    'What was requested or done? Include the exact prompt when available.',
    'What use is covered? If unknown, say what still needs permission or review.',
    'Required for Reviewed or Rejected',
    'After comparing A and B, note artifacts, uncertainty, or what still needs review.'
  ]) assert.ok(api.attrBe.has(key), key);
});

test('English and Belarusian switches are reversible, preserving original spacing', () => {
  const { node } = text('  Permission scope\n');
  api.setLanguage('be'); api.translateTextNode(node);
  assert.equal(node.nodeValue, '  Абсяг дазволу\n');
  api.setLanguage('en'); api.translateTextNode(node);
  assert.equal(node.nodeValue, '  Permission scope\n');
});

test('empty-receipt headings translate but a real recording title with identical text stays verbatim', () => {
  const heading = 'A passport appears here.';
  // A nested .empty-receipt h3 matches the old descendant selector, not the real
  // receipt title's direct-child selector. This double reproduces that regression.
  const emptyParent = { closest(selectors) {
    return selectors.split(',').some(selector => selector.trim() === '#live-receipt h3') ? emptyParent : null;
  } };
  const emptyNode = { nodeValue: heading, parentElement: emptyParent };
  const actualTitle = text(heading, { protectedValue: true }).node;
  api.setLanguage('be');
  api.translateTextNode(emptyNode); api.translateTextNode(actualTitle);
  assert.equal(emptyNode.nodeValue, api.be.get(heading));
  assert.notEqual(emptyNode.nodeValue, heading);
  assert.equal(actualTitle.nodeValue, heading);
  api.setLanguage('en'); api.translateTextNode(emptyNode);
  assert.equal(emptyNode.nodeValue, heading);
});

test('receipt enum labels translate after their dt label, without changing stored enum spelling', () => {
  for (const [label, value, expected] of [
    ['Processing type', 'non-ai', 'Без ШІ'],
    ['Declared authority basis', 'no-permission', 'Дазволу няма'],
    ['Declared human review status', 'pending', 'Чакае праверкі'],
    ['Declared human review status', 'reviewed', 'Праверана'],
    ['Declared human review status', 'rejected', 'Адхілена пасля праверкі']
  ]) {
    const { node, labelText } = text(value, { journalField: label });
    api.setLanguage('be'); api.translateTextNode(labelText); api.translateTextNode(node);
    assert.equal(node.nodeValue, expected);
    api.setLanguage('en'); api.translateTextNode(node);
    assert.equal(node.nodeValue, value);
  }
});

test('user-authored record values remain verbatim even when they match a UI dictionary key', () => {
  for (const options of [
    { protectedValue: true }, { journalField: 'Instruction / method' }, { journalField: 'Tool' },
    { journalField: 'Settings' }, { journalField: 'Permission scope' }, { journalField: 'Review note' }
  ]) {
    const { node } = text('  Unknown\n', options);
    api.setLanguage('be'); api.translateTextNode(node);
    assert.equal(node.nodeValue, '  Unknown\n');
  }
});

test('dynamic source notices preserve file names and exact hashes including internal spacing', () => {
  const original = 'Declared source: my  master.wav · SHA-256 abc…123. This link does not prove how an external tool processed the file.';
  const { node } = text(original, { sourceNote: true });
  api.setLanguage('be'); api.translateTextNode(node);
  assert.match(node.nodeValue, /^Пазначаная крыніца:/u);
  assert.ok(node.nodeValue.includes('my  master.wav'));
  assert.ok(node.nodeValue.includes('abc…123'));
  api.setLanguage('en'); api.translateTextNode(node);
  assert.equal(node.nodeValue, original);
});

test('restoration method translation preserves captured numbers and distinguishes the filter directions', () => {
  const { node } = text('High-pass 35 Hz; low-pass 18000 Hz; gain +1 dB; peak normalization to 95%; output 16-bit PCM WAV.', { restorationField: 'Applied method' });
  api.setLanguage('be'); api.translateTextNode(node);
  assert.ok(node.nodeValue.includes('Адсячэнне нізкіх частот: 35 Hz'));
  assert.ok(node.nodeValue.includes('абмежаванне высокіх частот: 18000 Hz'));
  assert.ok(node.nodeValue.includes('+1 dB'));
  assert.ok(node.nodeValue.includes('95%'));
  const off = text('High-pass off; low-pass off; gain +0 dB; no normalization; output 16-bit PCM WAV.', { restorationField: 'Applied method' });
  api.translateTextNode(off.node);
  assert.equal(off.node.nodeValue.includes(' off'), false);
  assert.ok(off.node.nodeValue.includes('без нармалізацыі'));
});

test('translating options and hints does not mutate control values, JSON, or the English default', () => {
  const journal = { processingType: 'unknown', authority: { basis: 'no-permission' }, review: { status: 'pending' }, instruction: { status: 'provided', value: 'Unknown' } };
  const original = JSON.stringify(journal);
  const option = { value: 'pending', ...text('Pending — not reviewed').node };
  const attributes = { placeholder: 'Required for Reviewed or Rejected' };
  const input = { value: 'Unknown', dataset: {}, closest: () => null, hasAttribute: key => key in attributes, getAttribute: key => attributes[key], setAttribute: (key, value) => { attributes[key] = value; } };
  const root = { closest: () => null, nodes: [option], querySelectorAll: selector => selector === '[placeholder],[aria-label]' ? [input] : [] };
  api.setLanguage('be'); api.translateTree(root);
  assert.equal(option.nodeValue, 'Чакае праверкі — яшчэ не праверана');
  assert.equal(option.value, 'pending');
  assert.equal(input.value, 'Unknown');
  assert.equal(JSON.stringify(journal), original);
  assert.notEqual(attributes.placeholder, 'Required for Reviewed or Rejected');
  api.setLanguage('en'); api.translateTree(root);
  assert.equal(attributes.placeholder, 'Required for Reviewed or Rejected');
  assert.ok(source.includes("apply(query==='be'?'be':'en')"));
});
