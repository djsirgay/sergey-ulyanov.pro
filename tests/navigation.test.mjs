import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformResearchText } from '../scripts/build-research-domain.mjs';

const source = readFileSync(new URL('../research/navigation.js', import.meta.url), 'utf8');
const importSource = code => import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const legacy = await importSource(source);
const migrated = await importSource(transformResearchText(source, 'research/navigation.js'));
const expected = {
  home: ['', 'Home', 'Галоўная', 'home'],
  tools: ['tools/', 'All tools', 'Усе інструменты', 'tools'],
  music: ['tools/unmute-the-archive/atlas/', 'Music search', 'Пошук музыкі', 'tools'],
  passport: ['tools/unmute-the-archive/', 'Recording passport', 'Пашпарт запісу', 'tools'],
  audio: ['tools/unmute-the-archive/restoration/', 'Audio lab', 'Апрацоўка гуку', 'tools'],
  culture: ['atlas/', 'Culture directory', 'Каталог культуры', 'tools'],
  mapa: ['atlas/mapa/', 'Historical map', 'Гістарычная мапа', 'tools'],
  system: ['system/', 'How the tools connect', 'Як звязаныя інструменты', 'about'],
  protocol: ['protocol/', 'Methods & AI audit', 'Метады і аўдыт ШІ', 'about'],
  help: ['help/', 'Help & guides', 'Дапамога і інструкцыі', 'help']
};
const toolIds = ['music', 'passport', 'audio', 'culture', 'mapa'];
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const anchors = html => [...html.matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)].map(([, attributes, inner]) => ({
  href: decode(attributes.match(/\bhref="([^"]+)"/)?.[1] || ''),
  active: /\baria-current="page"/.test(attributes),
  label: decode(inner.replace(/<[^>]*>/g, '')),
  attributes
}));
function nav(html, className) {
  const block = html.match(new RegExp(`<nav class="${className}"[^>]*>([\\s\\S]*?)<\\/nav>`));
  assert.ok(block, `Missing ${className}`);
  return block[1];
}

for (const [label, api, root] of [['portfolio mount', legacy, '/research/'], ['research domain', migrated, '/']]) {
  test(`${label}: every real page has an unambiguous functional name and group`, () => {
    assert.equal(api.ROOT, root);
    assert.deepEqual(api.toolIds, toolIds);
    for (const [id, [suffix, en, be, group]] of Object.entries(expected)) {
      const actual = api.routeFor(root + suffix);
      assert.deepEqual([actual.id, actual.path, actual.en, actual.be, actual.group], [id, root + suffix, en, be, group]);
      assert.equal(api.routeFor(root + suffix + 'index.html').id, id);
      if (suffix) assert.equal(api.routeFor((root + suffix).slice(0, -1)).id, id);
    }
    assert.equal(api.routeFor(root + 'unrecognised-route/').id, 'home');
    assert.notEqual(api.routes.music.en, api.routes.culture.en, 'Two different functions must not share an Atlas label');
  });

  test(`${label}: research anchors highlight the about group without masking tool anchors`, () => {
    for (const hash of ['#research-program', '#research-method', '#research-evidence', '#research-sources', '#public-protocol']) {
      assert.equal(api.routeFor(root, hash).id, 'about');
      assert.equal(api.routeFor(root + 'atlas/mapa/', hash).id, 'mapa');
    }
    assert.equal(api.routeFor(root, '#research-system').id, 'home');
    assert.equal(api.routeFor(root + 'tools/unmute-the-archive/', '#corpus').id, 'passport');
  });

  test(`${label}: language links preserve date, stage, place, discovery query and fragment`, () => {
    const path = root + 'atlas/mapa/?year=1938&city=brest&mapScope=region&stage=division-1938&discover=%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B0&lang=en#borders';
    for (const lang of ['be', 'en']) {
      const result = new URL(api.languageURL(path, lang, 'https://research.sergey-ulyanov.pro'), 'https://research.sergey-ulyanov.pro');
      const before = new URL(path, result.origin);
      assert.equal(result.pathname, before.pathname);
      assert.equal(result.hash, before.hash);
      for (const key of ['year', 'city', 'mapScope', 'stage', 'discover']) assert.equal(result.searchParams.get(key), before.searchParams.get(key));
      assert.deepEqual(result.searchParams.getAll('lang'), [lang]);
    }
    assert.equal(new URL(api.languageURL(path, 'unsupported'), 'https://example.test').searchParams.get('lang'), 'en');
  });

  for (const lang of ['en', 'be']) {
    test(`${label} ${lang}: each page has one primary current item, correct breadcrumbs and real routes`, () => {
      const permittedPaths = new Set(Object.values(api.routes).map(route => route.path));
      const pageIds = [...Object.keys(expected), 'about'];
      for (const id of pageIds) {
        const current = id === 'about' ? api.routeFor(root, '#research-program') : api.routeFor(api.routes[id].path);
        const html = api.shellHTML(current, lang);
        assert.equal(anchors(nav(html, 'research-primary')).filter(anchor => anchor.active).length, 1, `${id}: primary current item`);
        assert.match(nav(html, 'research-breadcrumb'), /aria-current="page"/, `${id}: breadcrumb current item`);
        if (id !== 'home') assert.ok(nav(html, 'research-breadcrumb').includes(current[lang].replaceAll('&', '&amp;')), `${id}: current page named`);
        assert.match(html, new RegExp(`data-shell-lang="${lang}" lang="${lang}" aria-pressed="true"`));
        assert.match(html, new RegExp(`data-shell-lang="${lang === 'en' ? 'be' : 'en'}" lang="${lang === 'en' ? 'be' : 'en'}" aria-pressed="false"`));
        assert.doesNotMatch(html, /(?:placeholder|undefined|javascript:|stanford\.|href="#")/i);
        for (const anchor of anchors(html)) {
          assert.ok(anchor.href && anchor.label.trim(), `${id}: every link is named and has a destination`);
          if (anchor.href.startsWith('https://')) {
            assert.equal(anchor.href, 'https://sergey-ulyanov.pro/', `${id}: only explicit portfolio exit`);
          } else {
            const url = new URL(anchor.href, 'https://research.sergey-ulyanov.pro');
            assert.ok(permittedPaths.has(url.pathname), `${id}: unexpected path ${url.pathname}`);
            assert.equal(url.searchParams.get('lang'), lang, `${id}: language retained`);
          }
        }
        const primary = anchors(nav(html, 'research-primary'));
        const destination = current.group === 'tools' ? api.routes.tools.path : current.group === 'help' ? api.routes.help.path : root;
        assert.equal(new URL(primary.find(anchor => anchor.active).href, 'https://example.test').pathname, destination);
        if (current.guide) {
          const guide = anchors(html).find(anchor => /class="research-guide-link"/.test(anchor.attributes));
          assert.equal(new URL(guide.href, 'https://example.test').hash, `#${current.guide}`);
          assert.equal(new URL(guide.href, 'https://example.test').pathname, api.routes.help.path);
        }
      }
    });

    test(`${label} ${lang}: five tool tabs and collection utilities have consistent destinations`, () => {
      for (const id of toolIds) {
        const html = api.shellHTML(api.routeFor(api.routes[id].path), lang);
        const links = anchors(nav(html, 'research-tool-tabs'));
        assert.equal(links.length, 5);
        assert.deepEqual(links.map(anchor => new URL(anchor.href, 'https://example.test').pathname), toolIds.map(tool => api.routes[tool].path));
        assert.deepEqual(links.filter(anchor => anchor.active).map(anchor => anchor.label), [api.routes[id][lang]]);
        if (['music', 'passport', 'audio'].includes(id)) {
          const utilities = anchors(nav(html, 'research-collection-links'));
          assert.deepEqual(utilities.map(anchor => { const url = new URL(anchor.href, 'https://example.test'); return url.pathname + url.hash; }), [api.routes.passport.path + '#corpus', api.routes.music.path + '#analytics', api.routes.help.path + '#browser-data']);
        } else assert.doesNotMatch(html, /class="research-collection-links"/, `${id}: not an audio collection`);
      }
      for (const id of ['home', 'system', 'protocol', 'help']) assert.doesNotMatch(api.shellHTML(api.routeFor(api.routes[id].path), lang), /class="research-tool-tabs"/);
    });
  }
}

test('all declared navigation destinations have source pages and help targets', () => {
  const help = readFileSync(new URL('../research/help/index.html', import.meta.url), 'utf8');
  for (const route of Object.values(legacy.routes)) {
    assert.ok(existsSync(new URL(`..${route.path}index.html`, import.meta.url)), `Missing page ${route.path}`);
    if (route.guide) assert.ok(help.includes(`id="${route.guide}"`), `Missing guide ${route.guide}`);
  }
  assert.match(help, /id="browser-data"/);
  assert.ok(existsSync(new URL('../research/atlas/mapa/belarus-outline.svg', import.meta.url)));
});

test('shared shell hides only obsolete global navigation and preserves MAPA functional controls', () => {
  const css = readFileSync(new URL('../research/navigation.css', import.meta.url), 'utf8');
  const hiddenRule = css.match(/\.research-shell-ready body>nav\.detail-nav[^}]+}/)?.[0] || '';
  for (const selector of ['body>nav.detail-nav', 'body>header.atlas-header', '#app>header.site-header', '#app>nav.module-rail', '#app>header.suite-header', '.research-global-lang']) assert.ok(hiddenRule.includes(selector));
  assert.doesNotMatch(hiddenRule, /mapa-history-tabs|history-mode-control|history-map-controls|history-years|mapa-events/);
  assert.match(source, /document\.dispatchEvent\(new CustomEvent\('research:language'/);
  assert.match(source, /shell\.dataset\.researchOwned/);
  assert.match(source, /new MutationObserver\(render\).*attributeFilter: \['lang'\]/);
  assert.doesNotMatch(source, /location\.(?:reload|assign|replace)\(/, 'Language changes must not reload the tools');
});

test('all legacy translators expose the same validated document event and exclude owned shell content', () => {
  for (const file of ['research/i18n.js', 'research/shared-language.js', 'research/atlas/atlas.js', 'research/atlas/mapa/mapa.js']) {
    const code = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(code, /document\.addEventListener\('research:language'/, file);
    assert.match(code, /event\.detail\?\.lang/, file);
    assert.ok(code.includes('#research-shell, [data-research-owned]'), file);
  }
});
