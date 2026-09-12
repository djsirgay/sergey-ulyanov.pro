import {artworkReleases} from './artwork-data.js';

export const ARTWORK_PREFERENCE_KEY = 'unmute-external-artwork/v1';
export const ARTWORK_IMAGE_HOSTS = Object.freeze(['f4.bcbits.com', 'is1-ssl.mzstatic.com']);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const words = {
  en:{enable:'Show source covers',disable:'Hide source covers',privacy:'Optional: covers load from Bandcamp or Apple. Those services receive your IP address and may use cookies. Unmute does not send your search or collection. Your choice is saved in this browser.',album:'Album cover',track:'Recording artwork',source:'Artwork source',fallback:'Unmute artwork',unavailable:'Cover unavailable; Unmute artwork shown.'},
  ru:{enable:'Показать обложки из источников',disable:'Скрыть обложки из источников',privacy:'По желанию: обложки загружаются с Bandcamp или Apple. Эти сервисы получают IP-адрес и могут использовать cookies. Unmute не передаёт запрос или подборку. Выбор сохраняется в этом браузере.',album:'Обложка альбома',track:'Оформление записи',source:'Источник обложки',fallback:'Оформление Unmute',unavailable:'Обложка недоступна; показано оформление Unmute.'},
  be:{enable:'Паказаць вокладкі з крыніц',disable:'Схаваць вокладкі з крыніц',privacy:'Па жаданні: вокладкі загружаюцца з Bandcamp або Apple. Гэтыя сэрвісы атрымліваюць IP-адрас і могуць выкарыстоўваць cookies. Unmute не перадае запыт або падборку. Выбар захоўваецца ў гэтым браўзеры.',album:'Вокладка альбома',track:'Афармленне запісу',source:'Крыніца вокладкі',fallback:'Афармленне Unmute',unavailable:'Вокладка недаступная; паказана афармленне Unmute.'},
};
const copy = lang => words[lang] || words.en;
const byRecording = new Map();
for (const release of artworkReleases) for (const binding of release.bindings) {
  if (byRecording.has(binding.id)) throw new Error(`Duplicate artwork binding: ${binding.id}`);
  byRecording.set(binding.id, {release, binding});
}

/** Only literal, reviewed image URLs from the two selected provider hosts. */
export function safeArtworkUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || u.port || u.search || u.hash || !ARTWORK_IMAGE_HOSTS.includes(u.hostname)) return '';
    if (u.hostname === 'f4.bcbits.com' && !/^\/img\/a\d+_\d+\.(?:jpg|png|webp)$/.test(u.pathname)) return '';
    if (u.hostname === 'is1-ssl.mzstatic.com' && (!u.pathname.startsWith('/image/thumb/') || !/\.(?:jpg|png|webp)$/.test(u.pathname))) return '';
    return u.href;
  } catch { return ''; }
}

function sourceUrl(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || u.port || u.hash) return '';
    return /^(?:[a-z0-9-]+\.)bandcamp\.com$/.test(u.hostname) || u.hostname === 'music.apple.com' ? u.href : '';
  } catch { return ''; }
}

/** Imported/personal artwork claims never enter this reviewed lookup. */
export function artworkFor(record) {
  if (!record || record.personal) return null;
  const known = byRecording.get(record.id);
  if (!known || record.artist !== known.binding.artist || record.listenUrl !== known.binding.listenUrl) return null;
  const release = known.release;
  if (!safeArtworkUrl(release.url) || !sourceUrl(release.sourceUrl)) return null;
  return release;
}

const defaultStorage = () => { try { return globalThis.localStorage; } catch { return null; } };
export function readArtworkPreference(storage = defaultStorage()) {
  try { return storage?.getItem(ARTWORK_PREFERENCE_KEY) === 'enabled'; } catch { return false; }
}
export function saveArtworkPreference(enabled, storage = defaultStorage()) {
  try { storage?.setItem(ARTWORK_PREFERENCE_KEY, enabled === true ? 'enabled' : 'disabled'); return Boolean(storage); } catch { return false; }
}

/** No remote src, URL preload, or provider request is emitted without enabled:true. */
export function renderArtwork(record, {fallbackHTML = '', lang = 'en', small = false, enabled = false} = {}) {
  const artwork = artworkFor(record);
  if (!artwork || enabled !== true) return fallbackHTML;
  const t = copy(lang), title = `${artwork.scope === 'album' ? t.album : t.track}: ${artwork.releaseTitle}`;
  // fallbackHTML is the existing trusted application renderer, never user HTML.
  return `<div class="artwork-frame${small ? ' artwork-frame--small' : ''}" data-artwork-frame><div class="artwork-fallback">${fallbackHTML}</div><img data-artwork-image src="${escape(artwork.url)}" alt="${escape(title)}" width="600" height="600" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="sr-only artwork-error-note" hidden>${escape(t.unavailable)}</span></div>`;
}

/** Keep outside the existing clickable cover anchor: no nested links. */
export function renderArtworkCredit(record, lang = 'en', {enabled = false} = {}) {
  const artwork = artworkFor(record);
  if (!artwork || enabled !== true) return '';
  const t = copy(lang);
  return `<p class="artwork-credit">${escape(artwork.scope === 'album' ? t.album : t.track)}: ${escape(artwork.releaseTitle)} · <a href="${escape(artwork.sourceUrl)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">${escape(t.source)} · ${escape(artwork.provider)}</a></p>`;
}

/** One inline preference, no dialog and no per-card permission button. */
export function artworkControlHTML(lang = 'en', {enabled = false} = {}) {
  const t = copy(lang);
  return `<div class="artwork-preference"><button type="button" class="text-button artwork-toggle" data-artwork-toggle data-artwork-lang="${['en','ru','be'].includes(lang) ? lang : 'en'}" aria-pressed="${enabled === true}" aria-describedby="artwork-privacy">${escape(enabled === true ? t.disable : t.enable)}</button><p id="artwork-privacy" class="artwork-privacy">${escape(t.privacy)}</p></div>`;
}

/** Install once at bootstrap; onChange must rerender the app with controller.enabled. */
export function mountArtworkControls({root = globalThis.document, storage = defaultStorage(), onChange = () => {}} = {}) {
  let enabled = readArtworkPreference(storage);
  if (!root?.addEventListener) return {get enabled(){ return enabled; }, destroy(){}};
  const click = event => {
    const button = event.target?.closest?.('[data-artwork-toggle]');
    if (!button) return;
    enabled = !enabled;
    const saved = saveArtworkPreference(enabled, storage);
    button.setAttribute('aria-pressed', String(enabled));
    button.textContent = copy(button.dataset?.artworkLang)[enabled ? 'disable' : 'enable'];
    // A failed preference write does not cancel the current, explicit session choice.
    onChange(enabled, {saved});
    root.querySelector?.('[data-artwork-toggle]')?.focus?.({preventScroll:true});
  };
  const imageEvent = event => {
    const img = event.target;
    if (!img?.matches?.('[data-artwork-image]')) return;
    const frame = img.closest('[data-artwork-frame]');
    if (!frame) return;
    const loaded = event.type === 'load' && img.naturalWidth > 0;
    frame.classList.toggle('is-artwork-loaded', loaded);
    frame.classList.toggle('is-artwork-error', !loaded);
    const note = frame.querySelector('.artwork-error-note');
    if (note) note.hidden = loaded;
    // No retry chain or alternative image guesses after an error.
    if (!loaded) img.hidden = true;
  };
  root.addEventListener('click', click);
  root.addEventListener('load', imageEvent, true);
  root.addEventListener('error', imageEvent, true);
  return {get enabled(){return enabled;}, destroy(){root.removeEventListener('click',click);root.removeEventListener('load',imageEvent,true);root.removeEventListener('error',imageEvent,true);}};
}
