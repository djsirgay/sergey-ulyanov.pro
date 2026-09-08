// Shared wayfinding, integrated from the approved 12ui compact research shell.
// Real route mapping replaces prototype holding pages. No redirect or storage migration here.
export const ROOT = '/research/';
export const routes = Object.freeze({
  home: {path: ROOT, en: 'Home', be: 'Галоўная', group: 'home'},
  tools: {path: '/research/tools/', en: 'All tools', be: 'Усе інструменты', group: 'tools'},
  music: {path: '/research/tools/unmute-the-archive/atlas/', en: 'Music search', be: 'Пошук музыкі', group: 'tools', guide: 'music'},
  passport: {path: '/research/tools/unmute-the-archive/', en: 'Recording passport', be: 'Пашпарт запісу', group: 'tools', guide: 'passport'},
  audio: {path: '/research/tools/unmute-the-archive/restoration/', en: 'Audio lab', be: 'Апрацоўка гуку', group: 'tools', guide: 'audio'},
  culture: {path: '/research/atlas/', en: 'Culture directory', be: 'Каталог культуры', group: 'tools', guide: 'culture'},
  mapa: {path: '/research/atlas/mapa/', en: 'Historical map', be: 'Гістарычная мапа', group: 'tools', guide: 'mapa'},
  system: {path: '/research/system/', en: 'How the tools connect', be: 'Як звязаныя інструменты', group: 'about'},
  protocol: {path: '/research/protocol/', en: 'Methods & AI audit', be: 'Метады і аўдыт ШІ', group: 'about'},
  help: {path: '/research/help/', en: 'Help & guides', be: 'Дапамога і інструкцыі', group: 'help'}
});
export const toolIds = ['music', 'passport', 'audio', 'culture', 'mapa'];
const aboutHashes = ['#research-program', '#research-method', '#research-evidence', '#research-sources', '#public-protocol'];
export function routeFor(pathname, hash = '') {
  const path = pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  if (path === ROOT && aboutHashes.includes(hash)) return {id: 'about', path: ROOT + '#research-program', en: 'About the research', be: 'Пра даследаванне', group: 'about'};
  const entry = Object.entries(routes).find(([, route]) => route.path === path);
  return entry ? {id: entry[0], ...entry[1]} : {id: 'home', ...routes.home};
}
export function languageURL(path, lang, origin = 'https://sergey-ulyanov.pro') {
  const url = new URL(path, origin); url.searchParams.set('lang', lang === 'be' ? 'be' : 'en');
  return url.pathname + url.search + url.hash;
}
const words = {
  en: {by: 'Independent research · Sergéy Ulyanov', tools: 'Tools', about: 'About research', help: 'Help', portfolio: 'Portfolio ↗', menu: 'Menu', close: 'Close menu', language: 'Language', navigation: 'Research navigation', breadcrumb: 'You are here', toolNav: 'Research tools', guide: 'How to use this tool', all: 'All tools', home: 'Research home', local: 'My collection', analytics: 'Collection analytics', backup: 'Back up / transfer records'},
  be: {by: 'Незалежнае даследаванне · Сяргей Ульянаў', tools: 'Інструменты', about: 'Пра даследаванне', help: 'Дапамога', portfolio: 'Партфоліа ↗', menu: 'Меню', close: 'Закрыць меню', language: 'Мова', navigation: 'Навігацыя даследавання', breadcrumb: 'Вы тут', toolNav: 'Даследчыя інструменты', guide: 'Як карыстацца інструментам', all: 'Усе інструменты', home: 'Галоўная даследавання', local: 'Мая калекцыя', analytics: 'Аналітыка калекцыі', backup: 'Копія / перанос запісаў'}
};
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
export function shellHTML(current, lang = 'en') {
  const t = words[lang], href = path => escape(languageURL(path, lang));
  const link = (path, label, active, extra = '') => `<a href="${href(path)}"${active ? ' aria-current="page"' : ''}${extra}>${escape(label)}</a>`;
  const primary = [link(ROOT, routes.home[lang], current.group === 'home'), link(routes.tools.path, t.tools, current.group === 'tools'), link(ROOT + '#research-program', t.about, current.group === 'about'), link(routes.help.path, t.help, current.group === 'help')].join('');
  let crumbs = link(ROOT, routes.home[lang], current.id === 'home');
  if (current.group === 'tools' && current.id !== 'tools') crumbs += `<span aria-hidden="true">/</span>${link(routes.tools.path, t.tools, false)}`;
  if (current.id !== 'home') crumbs += `<span aria-hidden="true">/</span><span aria-current="page">${escape(current[lang])}</span>`;
  return `<div class="research-header"><a class="research-brand" href="${href(ROOT)}" aria-label="Unmute Belarus — ${t.home}"><img src="${ROOT}atlas/mapa/belarus-outline.svg" width="38" height="38" alt=""><span><strong>Unmute Belarus</strong><small>${t.by}</small></span></a><button class="research-menu-toggle" type="button" aria-expanded="false" aria-controls="research-menu">${t.menu}<span aria-hidden="true"> ☰</span></button><div class="research-menu" id="research-menu"><nav class="research-primary" aria-label="${t.navigation}">${primary}</nav><div class="research-lang" role="group" aria-label="${t.language}"><button type="button" data-shell-lang="en" lang="en" aria-pressed="${lang === 'en'}">EN</button><button type="button" data-shell-lang="be" lang="be" aria-pressed="${lang === 'be'}">БЕЛ</button></div><a class="research-portfolio" href="https://sergey-ulyanov.pro/">${t.portfolio}</a></div></div><div class="research-wayfinding"><nav class="research-breadcrumb" aria-label="${t.breadcrumb}">${crumbs}</nav>${current.guide ? link(routes.help.path + '#' + current.guide, t.guide + ' ↗', false, ' class="research-guide-link"') : ''}</div>${current.group === 'tools' ? `<nav class="research-tool-tabs" aria-label="${t.toolNav}">${toolIds.map(id => link(routes[id].path, routes[id][lang], current.id === id)).join('')}</nav>` : ''}${['music','passport','audio'].includes(current.id) ? `<nav class="research-collection-links" aria-label="${t.local}">${link(routes.passport.path + '#corpus', t.local, false)}${link(routes.music.path + '#analytics', t.analytics, false)}${link(routes.help.path + '#browser-data', t.backup, false)}</nav>` : ''}`;
}

if (typeof document !== 'undefined') {
  const init = () => {
    if (document.querySelector('#research-shell')) return;
    const shell = document.createElement('header'); shell.id = 'research-shell'; shell.dataset.researchOwned = '';
    document.body.prepend(shell);
    const skip = document.createElement('a'); skip.className = 'research-skip'; skip.dataset.researchOwned = ''; skip.href = '#main'; shell.before(skip);
    let previous = '';
    function render() {
      const lang = document.documentElement.lang === 'be' ? 'be' : 'en';
      skip.textContent = lang === 'be' ? 'Перайсці да зместу' : 'Skip to content';
      const current = routeFor(location.pathname, location.hash), signature = lang + ':' + current.id;
      if (signature === previous) return;
      previous = signature; shell.innerHTML = shellHTML(current, lang);
      const toggle = shell.querySelector('.research-menu-toggle'), menu = shell.querySelector('.research-menu');
      function close() { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.innerHTML = words[lang].menu + '<span aria-hidden="true"> ☰</span>'; }
      toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); menu.classList.toggle('is-open', open); toggle.textContent = open ? words[lang].close + ' ×' : words[lang].menu + ' ☰'; });
      shell.onkeydown = event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); } };
      shell.querySelectorAll('[data-shell-lang]').forEach(button => button.addEventListener('click', () => {
        const next = button.dataset.shellLang;
        document.dispatchEvent(new CustomEvent('research:language', {detail: {lang: next}}));
        // New directory/help pages do not depend on a legacy translator.
        if (document.documentElement.lang !== next) {
          document.documentElement.lang = next;
          const url = new URL(location.href); url.searchParams.set('lang', next); history.replaceState(history.state, '', url);
          try { localStorage.setItem('research-lang', next); } catch { /* Navigation works without storage. */ }
        }
        render(); shell.querySelector(`[data-shell-lang="${next}"]`)?.focus();
      }));
      shell.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', close));
    }
    render(); document.documentElement.classList.add('research-shell-ready');
    const returnBar = document.createElement('nav'); returnBar.className = 'research-return-bar'; returnBar.dataset.researchOwned = ''; returnBar.hidden = true;
    function updateReturnBar() { const lang = document.documentElement.lang === 'be' ? 'be' : 'en'; returnBar.setAttribute('aria-label', words[lang].navigation); returnBar.innerHTML = `<a href="${languageURL(ROOT, lang)}">← ${words[lang].home}</a><a href="${languageURL(routes.tools.path, lang)}">${words[lang].all} ↗</a>`; }
    updateReturnBar(); document.body.append(returnBar);
    if (typeof IntersectionObserver !== 'undefined') new IntersectionObserver(entries => { returnBar.hidden = entries[0].isIntersecting; }).observe(shell);
    new MutationObserver(updateReturnBar).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
    new MutationObserver(render).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
    window.addEventListener('popstate', render); window.addEventListener('hashchange', render);
    // Preserve old language bindings and local controls; hide only obsolete global navigation with CSS.
    const syncTargets = () => {
      const main = document.querySelector('main');
      if (main && !main.id) main.id = 'main';
      const legacyTop = document.querySelector('#app > header#top');
      if (legacyTop) legacyTop.removeAttribute('id');
      if (!document.getElementById('top')) { const top = document.createElement('span'); top.id = 'top'; shell.before(top); }
    };
    syncTargets();
    const app = document.getElementById('app'); if (app) new MutationObserver(syncTargets).observe(app, {childList: true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}
