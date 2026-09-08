/* User-driven, local-only migration. No network requests, automatic writes, or source deletion. */
export const BACKUP_SCHEMA = 'unmute-research/browser-backup/1.0';
export const STORAGE_KEYS = Object.freeze({
  corpus: 'unmute-the-archive/corpus/v2',
  annotations: 'unmute-belarus/atlas-annotations/v1',
  language: 'research-lang',
  atlasLanguage: 'living-belarus-atlas-lang'
});
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
const ALLOWED_KEYS = Object.values(STORAGE_KEYS);
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, key) => typeof value[key] === 'string' && value[key].trim().length > 0;
const safeId = id => typeof id === 'string' && id.trim().length > 0 && id.length <= 1000 && !['__proto__', 'constructor', 'prototype'].includes(id);
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
const webURL = value => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } };
const source = value => object(value) && text(value, 'filename') && text(value, 'mediaType') && Number.isSafeInteger(value.bytes) && value.bytes > 0 && hash(value.sha256);
const event = value => object(value) && ['documented', 'fingerprinted', 'verified', 'transferred', 'derived'].includes(value.type) && text(value, 'at') && text(value, 'note');
const derivative = value => object(value) && safeId(value.derivativeId) && ['createdAt', 'label', 'purpose', 'method', 'changeLog'].every(key => text(value, key)) && source(value.source) && (value.reviewerNote === undefined || typeof value.reviewerNote === 'string');

// Matches the deployed Archive Passport 2.0/2.1 format; all extra metadata is preserved.
export function validPassport(value) {
  return object(value) && ['unmute-archive/2.0', 'unmute-archive/2.1'].includes(value.schema)
    && ['fingerprinted', 'source-missing'].includes(value.status) && safeId(value.archiveId)
    && ['createdAt', 'updatedAt', 'collection', 'title', 'creator', 'language', 'place', 'context', 'rightsBasis'].every(key => text(value, key))
    && (value.recordedOn === undefined || typeof value.recordedOn === 'string')
    && (value.evidenceUrl === undefined || (typeof value.evidenceUrl === 'string' && webURL(value.evidenceUrl)))
    && Array.isArray(value.events) && value.events.every(event)
    && (value.derivatives === undefined || (Array.isArray(value.derivatives) && value.derivatives.every(derivative)))
    && (value.status === 'fingerprinted' ? source(value.source) : value.source === undefined);
}

export function validAnnotation(value) {
  return object(value) && Object.keys(value).every(key => ['kind', 'genres', 'themes', 'bpm', 'dance', 'relationship', 'confidence'].includes(key))
    && (value.kind === undefined || ['song', 'album', 'dj-set', 'mix', 'recording', 'derivative'].includes(value.kind))
    && (value.confidence === undefined || ['high', 'medium', 'recovery'].includes(value.confidence))
    && ['genres', 'themes'].every(key => value[key] === undefined || (Array.isArray(value[key]) && value[key].every(item => typeof item === 'string')))
    && (value.bpm === undefined || (Number.isFinite(value.bpm) && value.bpm > 0 && value.bpm <= 300))
    && (value.dance === undefined || typeof value.dance === 'boolean')
    && (value.relationship === undefined || typeof value.relationship === 'string');
}

function fail(code, details = '') { const error = new Error(code); error.code = code; error.details = details; throw error; }
function safeTree(value, depth = 0) {
  if (depth > 32) fail('invalid', 'Nesting limit exceeded');
  if (typeof value === 'string' && value.length > 1000000) fail('invalid', 'Text limit exceeded');
  if (Array.isArray(value)) { if (value.length > 10000) fail('invalid', 'Record limit exceeded'); value.forEach(item => safeTree(item, depth + 1)); }
  else if (object(value)) {
    if (Object.keys(value).length > 10000) fail('invalid', 'Record limit exceeded');
    for (const [key, item] of Object.entries(value)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) fail('invalid', 'Unsafe field');
      safeTree(item, depth + 1);
    }
  }
}
const canonical = value => JSON.stringify(normalize(value));
function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (object(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalize(value[key])]));
  return value;
}

function validateStores(stores) {
  if (!object(stores) || Object.keys(stores).some(key => !ALLOWED_KEYS.includes(key))) fail('invalid', 'Unexpected storage key');
  safeTree(stores);
  if (own(stores, STORAGE_KEYS.corpus)) {
    const corpus = stores[STORAGE_KEYS.corpus];
    if (!Array.isArray(corpus) || !corpus.every(validPassport)) fail('invalid', 'Incomplete archival passport');
    if (new Set(corpus.map(record => record.archiveId)).size !== corpus.length) fail('invalid', 'Duplicate archive ID');
  }
  if (own(stores, STORAGE_KEYS.annotations)) {
    const annotations = stores[STORAGE_KEYS.annotations];
    if (!object(annotations) || !Object.entries(annotations).every(([id, annotation]) => safeId(id) && validAnnotation(annotation))) fail('invalid', 'Invalid music annotation');
  }
  for (const key of [STORAGE_KEYS.language, STORAGE_KEYS.atlasLanguage]) {
    if (own(stores, key) && !['en', 'be'].includes(stores[key])) fail('invalid', 'Invalid language');
  }
  return stores;
}

export function readRawResearchStorage(storage) {
  const raw = {};
  try { for (const key of ALLOWED_KEYS) { const value = storage.getItem(key); if (value !== null) raw[key] = value; } }
  catch { fail('unavailable'); }
  return raw;
}

export function readResearchStorage(storage) {
  const raw = readRawResearchStorage(storage), stores = {};
  try {
    for (const [key, value] of Object.entries(raw)) stores[key] = [STORAGE_KEYS.language, STORAGE_KEYS.atlasLanguage].includes(key) ? value : JSON.parse(value);
    return validateStores(stores);
  } catch { fail('damaged'); }
}

export function createBackup(storage, origin, now = new Date()) {
  if (!webURL(origin)) fail('invalid', 'Invalid source origin');
  return { schema: BACKUP_SCHEMA, sourceOrigin: new URL(origin).origin, exportedAt: now.toISOString(), stores: readResearchStorage(storage) };
}

export function parseBackup(raw) {
  if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) fail('large');
  let backup;
  try { backup = JSON.parse(raw); } catch { fail('invalid', 'Not a JSON backup'); }
  if (!object(backup) || backup.schema !== BACKUP_SCHEMA || !webURL(backup.sourceOrigin) || !Number.isFinite(Date.parse(backup.exportedAt))) fail('invalid', 'Not a complete browser backup');
  safeTree(backup);
  validateStores(backup.stores);
  return backup;
}

// Keeps local versions on conflict. The imported file remains the source of recovery for skipped versions.
export function planImport(current, incoming) {
  validateStores(current); validateStores(incoming);
  const merged = structuredClone(current);
  const result = { addedPassports: 0, identicalPassports: 0, addedAnnotations: 0, annotationFields: 0, preferences: 0, conflicts: [] };
  const records = new Map((current[STORAGE_KEYS.corpus] || []).map(record => [record.archiveId, record]));
  const blockedIds = new Set();
  for (const record of incoming[STORAGE_KEYS.corpus] || []) {
    const existing = records.get(record.archiveId);
    if (!existing) { records.set(record.archiveId, structuredClone(record)); result.addedPassports++; }
    else if (canonical(existing) === canonical(record)) result.identicalPassports++;
    else {
      blockedIds.add(record.archiveId);
      for (const child of record.derivatives || []) blockedIds.add(child.derivativeId);
      result.conflicts.push({ type: 'passport', id: record.archiveId, title: record.title });
    }
  }
  if (result.addedPassports) merged[STORAGE_KEYS.corpus] = [...records.values()];
  const annotations = structuredClone(current[STORAGE_KEYS.annotations] || {});
  for (const [id, annotation] of Object.entries(incoming[STORAGE_KEYS.annotations] || {})) {
    if (blockedIds.has(id)) { result.conflicts.push({ type: 'annotation', id }); continue; }
    if (!own(annotations, id)) { annotations[id] = structuredClone(annotation); result.addedAnnotations++; continue; }
    const conflicts = [];
    for (const [field, value] of Object.entries(annotation)) {
      if (!own(annotations[id], field)) { annotations[id][field] = structuredClone(value); result.annotationFields++; }
      else if (canonical(annotations[id][field]) !== canonical(value)) conflicts.push(field);
    }
    if (conflicts.length) result.conflicts.push({ type: 'annotation', id, fields: conflicts });
  }
  if (result.addedAnnotations || result.annotationFields) merged[STORAGE_KEYS.annotations] = annotations;
  for (const key of [STORAGE_KEYS.language, STORAGE_KEYS.atlasLanguage]) {
    if (!own(merged, key) && own(incoming, key)) { merged[key] = incoming[key]; result.preferences++; }
  }
  return { merged, result };
}

export function applyImport(storage, backup, expected) {
  const checked = parseBackup(JSON.stringify(backup));
  const current = readResearchStorage(storage);
  if (canonical(current) !== canonical(expected)) fail('changed');
  const { merged, result } = planImport(current, checked.stores);
  const originals = readRawResearchStorage(storage), written = [];
  const changes = Object.entries(merged).filter(([key, value]) => !own(current, key) || canonical(value) !== canonical(current[key]));
  try {
    for (const [key, value] of changes) {
      storage.setItem(key, [STORAGE_KEYS.language, STORAGE_KEYS.atlasLanguage].includes(key) ? value : JSON.stringify(value));
      written.push(key);
    }
  } catch {
    let recovered = true;
    for (const key of written.reverse()) {
      try { own(originals, key) ? storage.setItem(key, originals[key]) : storage.removeItem(key); } catch { recovered = false; }
    }
    fail(recovered ? 'saveFailed' : 'partial');
  }
  return result;
}

const COPY = {
  en: {
    title: 'Move or back up your saved research data',
    intro: 'Your passports and music annotations are saved in this browser, separately for each website address. Nothing transfers automatically. Export on the old address, then import the file on the new address. Your old data stays untouched.',
    introPending: 'Your passports and music annotations are saved in this browser, separately for each website address. You can export a full backup or import a reviewed backup here now. Nothing transfers automatically, and existing versions are not overwritten.',
    destinationPending: 'The new research address is not enabled yet. Export and import work here; keep this address and your backup file until the new address is ready.',
    privacy: 'The JSON backup contains passport metadata, fingerprints, event and derivative logs, annotations, and language preferences — not audio files. Keep it private if it contains personal notes. Nothing is uploaded.',
    export: 'Download browser backup', old: 'Open the old address to export', next: 'Open the new research address',
    choose: 'Choose browser backup JSON for import', confirm: 'Import the reviewed additions', cancel: 'Cancel import', reload: 'Reload to show imported data',
    recovery: 'Download original stored data for recovery', recoverNotice: 'This recovery file preserves the original text. It is not an importable browser backup; keep it for repair.',
    unavailable: 'Browser storage is unavailable. Use the browser where you created the records and allow site storage. Do not clear website data.',
    damaged: 'Existing saved data needs recovery. No data was changed. Download the original stored data before troubleshooting.',
    invalid: 'This is not a valid complete browser backup. Use “Download browser backup” on the old address. Passport-only JSON and search reports do not contain all annotations.',
    large: 'This file exceeds the 10 MB backup limit. Do not choose an audio file.',
    changed: 'Saved data changed after this preview. Nothing was imported. Choose the backup again to review the latest merge.',
    saveFailed: 'The browser could not save this import. Earlier values were restored. Keep your backup and check available storage.',
    partial: 'Storage failed and rollback could not finish. Keep the backup; do not clear site data. Review this browser’s data before retrying.',
    downloaded: 'Backup downloaded. Keep this file safely. You can import it on a working research address when you choose. Source audio stays in your own files.',
    empty: 'There are no saved passports or music annotations in this browser yet. Language preferences can still be backed up.',
    cancelled: 'Import cancelled. Nothing changed.',
    preview: (p, a, f, c) => `Review: ${p} new passports, ${a} new annotation records, ${f} additional annotation fields. ${c} conflicts will be skipped; existing values will not be overwritten.`,
    complete: (p, a, f, c) => `Saved: ${p} new passports, ${a} new annotation records, ${f} additional annotation fields. ${c} conflicts skipped. Keep the original file for skipped versions. Reload to refresh the tools.`,
    from: origin => `Backup source: ${origin}`, current: (p, a) => `Saved here: ${p} passports and ${a} annotation records.`, conflicts: 'Conflicting versions kept unchanged', none: 'The records already exist or there are no additions. No import is needed.', language: 'Language preferences are added only if this browser does not already have them.'
  },
  be: {
    title: 'Перанесці або захаваць рэзервовую копію даных',
    intro: 'Пашпарты і музычныя пазнакі захоўваюцца ў гэтым браўзеры асобна для кожнага адраса сайта. Аўтаматычнага пераносу няма. Экспартуйце файл на старым адрасе, затым імпартуйце яго на новым. Старыя даныя застануцца некранутымі.',
    introPending: 'Пашпарты і музычныя пазнакі захоўваюцца ў гэтым браўзеры асобна для кожнага адраса сайта. Ужо цяпер тут можна спампаваць поўную копію або імпартаваць правераную. Аўтаматычнага пераносу няма; ранейшыя версіі не перазапісваюцца.',
    destinationPending: 'Новы адрас даследавання пакуль не ўключаны. Экспарт і імпарт працуюць тут; захоўвайце гэты адрас і рэзервовы файл, пакуль новы адрас не будзе гатовы.',
    privacy: 'JSON-копія змяшчае метаданыя пашпартоў, адбіткі, журналы падзей і вытворных копій, пазнакі і моўныя налады — але не аўдыяфайлы. Не распаўсюджвайце файл, калі ён утрымлівае асабістыя нататкі. Нічога не загружаецца на сервер.',
    export: 'Спампаваць рэзервовую копію', old: 'Адкрыць стары адрас для экспарту', next: 'Адкрыць новы адрас даследавання',
    choose: 'Выбраць JSON-копію для імпарту', confirm: 'Імпартаваць правераныя дапаўненні', cancel: 'Скасаваць імпарт', reload: 'Абнавіць старонку, каб убачыць даныя',
    recovery: 'Спампаваць зыходныя даныя для аднаўлення', recoverNotice: 'Гэты файл захоўвае зыходны тэкст. Ён не падыходзіць для звычайнага імпарту; захавайце яго для аднаўлення.',
    unavailable: 'Сховішча браўзера недаступнае. Адкрыйце браўзер, у якім стварылі запісы, і дазвольце захоўванне даных. Не ачышчайце даныя сайта.',
    damaged: 'Захаваным даным патрэбнае аднаўленне. Нічога не зменена. Спачатку спампуйце зыходныя даныя.',
    invalid: 'Гэта не поўная рэзервовая копія браўзера. Скарыстайцеся кнопкай «Спампаваць рэзервовую копію» на старым адрасе. Асобны пашпарт або справаздача пошуку не змяшчаюць усіх пазнак.',
    large: 'Файл перавышае ліміт 10 МБ. Не выбірайце аўдыяфайл.',
    changed: 'Пасля папярэдняга прагляду даныя змяніліся. Нічога не імпартавана. Выберыце копію яшчэ раз, каб праверыць аб’яднанне.',
    saveFailed: 'Браўзер не змог захаваць імпарт. Ранейшыя значэнні адноўлены. Захавайце копію і праверце вольнае месца.',
    partial: 'Сховішча дало збой, і адмена змен не завяршылася. Захавайце копію, не ачышчайце даныя сайта. Праверце даныя перад паўторнай спробай.',
    downloaded: 'Копія спампавана. Захавайце гэты файл. Калі вырашыце, яго можна імпартаваць на працоўным адрасе даследавання. Аўдыязапісы застаюцца ў вашых файлах.',
    empty: 'У гэтым браўзеры пакуль няма захаваных пашпартоў або музычных пазнак. Моўныя налады ўсё роўна можна захаваць.',
    cancelled: 'Імпарт скасаваны. Нічога не зменена.',
    preview: (p, a, f, c) => `Праверка: ${p} новых пашпартоў, ${a} новых запісаў пазнак, ${f} дадатковых палёў. Канфліктаў будзе прапушчана: ${c}; ранейшыя значэнні не будуць заменены.`,
    complete: (p, a, f, c) => `Захавана: ${p} новых пашпартоў, ${a} новых запісаў пазнак, ${f} дадатковых палёў. Канфліктаў прапушчана: ${c}. Захавайце зыходны файл з прапушчанымі версіямі. Абнавіце старонку.`,
    from: origin => `Крыніца копіі: ${origin}`, current: (p, a) => `Тут захавана пашпартоў: ${p}; запісаў пазнак: ${a}.`, conflicts: 'Канфліктныя версіі пакінуты без змен', none: 'Запісы ўжо існуюць або дапаўненняў няма. Імпарт не патрэбны.', language: 'Моўныя налады дадаюцца, толькі калі ў гэтым браўзеры іх яшчэ няма.'
  }
};

function download(document, content, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function mountStorageMigration(host, options = {}) {
  if (!host || host.dataset.migrationMounted) return;
  host.dataset.migrationMounted = 'true';
  const doc = host.ownerDocument, win = doc.defaultView;
  const lang = () => doc.documentElement.lang.toLowerCase().startsWith('be') ? 'be' : 'en';
  const copy = () => COPY[lang()];
  const legacy = options.legacyURL || 'https://sergey-ulyanov.pro/research/help/?stay=1#browser-data';
  const destination = options.destinationURL || 'https://research.sergey-ulyanov.pro/help/#browser-data';
  // DNS activation is still pending. Never offer a dead destination from the live old site.
  // Once verified, callers can opt in; the isolated destination already knows its own origin.
  const destinationEnabled = options.destinationEnabled === true || win.location.origin === new URL(destination).origin;
  let pending = null, messageCode = '', messageValues = [], revision = 0;
  const details = doc.createElement('details'), summary = doc.createElement('summary');
  const body = doc.createElement('div'); body.className = 'research-storage-body';
  details.className = 'research-storage-migration';
  const intro = doc.createElement('p'), privacy = doc.createElement('p'), count = doc.createElement('p'), preferenceNote = doc.createElement('p');
  const controls = doc.createElement('div'); controls.className = 'research-storage-actions';
  const exportButton = doc.createElement('button'), oldLink = doc.createElement('a'), nextLink = doc.createElement(destinationEnabled ? 'a' : 'p');
  exportButton.type = 'button'; oldLink.href = legacy;
  if (destinationEnabled) nextLink.href = destination;
  const label = doc.createElement('label'), labelText = doc.createElement('span'), file = doc.createElement('input');
  file.type = 'file'; file.accept = '.json,application/json'; label.append(labelText, file);
  const status = doc.createElement('p'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const conflicts = doc.createElement('details'), conflictHeading = doc.createElement('summary'), conflictList = doc.createElement('ul');
  conflicts.append(conflictHeading, conflictList); conflicts.hidden = true;
  const confirm = doc.createElement('button'), cancel = doc.createElement('button'), reload = doc.createElement('button'), recovery = doc.createElement('button');
  for (const button of [confirm, cancel, reload, recovery]) { button.type = 'button'; button.hidden = true; }
  controls.append(exportButton, oldLink, nextLink);
  body.append(intro, privacy, count, controls, label, preferenceNote, status, conflicts, confirm, cancel, reload, recovery);
  details.append(summary, body); host.append(details);
  const storage = () => { try { return options.storage || win.localStorage; } catch { fail('unavailable'); } };
  const announce = (code, values = []) => { messageCode = code; messageValues = values; status.textContent = typeof copy()[code] === 'function' ? copy()[code](...values) : copy()[code] || copy().invalid; };
  const failUI = error => { announce(error.code || 'invalid'); recovery.hidden = error.code !== 'damaged'; };
  const clearPending = () => { pending = null; confirm.hidden = true; cancel.hidden = true; conflicts.hidden = true; conflictList.replaceChildren(); };
  const refreshCount = () => {
    try { const saved = readResearchStorage(storage()); count.textContent = copy().current((saved[STORAGE_KEYS.corpus] || []).length, Object.keys(saved[STORAGE_KEYS.annotations] || {}).length); }
    catch (error) { count.textContent = ''; failUI(error); }
  };
  const translate = () => {
    const t = copy(); summary.textContent = t.title; intro.textContent = destinationEnabled ? t.intro : t.introPending; privacy.textContent = t.privacy;
    exportButton.textContent = t.export; oldLink.textContent = t.old; nextLink.textContent = destinationEnabled ? t.next : t.destinationPending;
    labelText.textContent = t.choose; preferenceNote.textContent = t.language; confirm.textContent = t.confirm; cancel.textContent = t.cancel;
    reload.textContent = t.reload; recovery.textContent = t.recovery; conflictHeading.textContent = t.conflicts;
    if (messageCode) announce(messageCode, messageValues); refreshCount();
  };
  exportButton.addEventListener('click', () => {
    try { const backup = createBackup(storage(), win.location.origin); download(doc, backup, `unmute-browser-backup-${backup.exportedAt.slice(0, 10)}.json`); announce('downloaded'); }
    catch (error) { failUI(error); }
  });
  recovery.addEventListener('click', () => {
    try { download(doc, { schema: 'unmute-research/raw-recovery/1.0', sourceOrigin: win.location.origin, exportedAt: new Date().toISOString(), raw: readRawResearchStorage(storage()) }, 'unmute-original-storage-recovery.json'); announce('recoverNotice'); }
    catch (error) { failUI(error); }
  });
  file.addEventListener('change', async () => {
    const attempt = ++revision; clearPending(); reload.hidden = true; recovery.hidden = true;
    const selected = file.files?.[0]; if (!selected) return;
    try {
      if (selected.size > MAX_BACKUP_BYTES) fail('large');
      const backup = parseBackup(await selected.text()); if (attempt !== revision) return;
      const current = readResearchStorage(storage()), plan = planImport(current, backup.stores), r = plan.result;
      pending = { backup, current };
      announce('preview', [r.addedPassports, r.addedAnnotations, r.annotationFields, r.conflicts.length]);
      const origin = doc.createElement('li'); origin.textContent = copy().from(backup.sourceOrigin); conflictList.append(origin);
      for (const conflict of r.conflicts) { const item = doc.createElement('li'); item.textContent = `${conflict.title || conflict.id}${conflict.fields ? ` (${conflict.fields.join(', ')})` : ''}`; conflictList.append(item); }
      conflicts.hidden = !r.conflicts.length;
      confirm.hidden = !(r.addedPassports || r.addedAnnotations || r.annotationFields || r.preferences); cancel.hidden = false;
      if (confirm.hidden && !r.conflicts.length) announce('none');
    } catch (error) { if (attempt === revision) failUI(error); }
  });
  confirm.addEventListener('click', () => {
    if (!pending) return;
    try {
      const r = applyImport(storage(), pending.backup, pending.current); clearPending(); file.value = ''; refreshCount();
      announce('complete', [r.addedPassports, r.addedAnnotations, r.annotationFields, r.conflicts.length]); reload.hidden = false;
      win.dispatchEvent(new CustomEvent('research-storage-imported', { detail: r }));
    } catch (error) { clearPending(); file.value = ''; failUI(error); }
  });
  cancel.addEventListener('click', () => { revision++; clearPending(); file.value = ''; announce('cancelled'); });
  reload.addEventListener('click', () => win.location.reload());
  new MutationObserver(translate).observe(doc.documentElement, { attributes: true, attributeFilter: ['lang'] });
  translate();
  if (win.location.hash === '#browser-data') details.open = true;
  win.addEventListener('hashchange', () => { if (win.location.hash === '#browser-data') details.open = true; });
  return { details, refresh: translate };
}

if (typeof document !== 'undefined') {
  const init = () => document.querySelectorAll('[data-research-storage-migration]').forEach(host => mountStorageMigration(host));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}
