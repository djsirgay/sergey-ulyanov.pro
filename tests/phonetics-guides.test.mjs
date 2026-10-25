import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../joyofphonetics/', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');

function harness(search = '') {
  const views = new Map(['discover', 'learn', 'lab', 'coach', 'research', 'about'].map(id => [id, {
    id: 'view-' + id, active: id === 'discover', classList: {toggle(name, on) { views.get(id).active = on; }}
  }]));
  const cards = new Map(['teacher', 'student'].map(id => [id, {
    scrolled: false, focused: false,
    scrollIntoView() { this.scrolled = true; },
    querySelector() { return {focus: () => { cards.get(id).focused = true; }}; }
  }]));
  const links = [...read('index.html').matchAll(/<a\b[^>]*data-guide="([^"]+)"[^>]*>/g)].map(([, guide]) => ({
    dataset: {guide}, addEventListener(type, handler) { this[type] = handler; }
  }));
  const ready = [];
  const players = [0, 1].map(() => ({paused: true, pause() { this.paused = true; }, addEventListener(name, handler) { this[name] = handler; }}));
  const context = {
    window: {scrollTo() {}}, location: {search}, URLSearchParams,
    document: {
      addEventListener: (type, cb) => ready.push(cb),
      querySelectorAll: selector => selector === '.view' ? [...views.values()] : selector === '[data-guide]' ? links : selector === '#view-learn video' ? players : [],
      getElementById: id => cards.get(id.replace('guide-', ''))
    }, localStorage: {getItem: () => null}, Map, Set
  };
  vm.createContext(context);
  vm.runInContext(read('core.js'), context);
  context.window.JP.state.coachDraft = {practicePhrase: 'Keep my unsaved phrase'};
  vm.runInContext(read('guides.js'), context);
  // Only the guide initializer: no network indexes are needed to open a guide.
  ready.at(-1)();
  return {context, views, cards, links, players};
}

test('only one tutorial speaks at a time and leaving the guides pauses both players', () => {
  const h = harness();
  h.players.forEach(player => { player.paused = false; });
  h.players[1].play();
  assert.equal(h.players[0].paused, true);
  assert.equal(h.players[1].paused, false);
  h.context.window.JP.go('lab');
  assert.ok(h.players.every(player => player.paused));
});

test('student deep link opens and focuses its guide without loading archive indexes or replacing the draft', () => {
  const h = harness('?guide=student');
  assert.equal(h.views.get('learn').active, true);
  assert.equal(h.views.get('discover').active, false);
  assert.equal(h.cards.get('student').scrolled, true);
  assert.equal(h.cards.get('student').focused, true);
  assert.equal(h.cards.get('teacher').focused, false);
  assert.equal(h.context.window.JP.state.coachDraft.practicePhrase, 'Keep my unsaved phrase');
});

test('home guide links open the requested audience in place rather than navigating away from local audio', () => {
  const h = harness();
  assert.ok(h.links.some(link => link.dataset.guide === 'teacher'));
  assert.ok(h.links.some(link => link.dataset.guide === 'student'));
  for (const link of h.links) {
    let prevented = false;
    link.click({preventDefault() { prevented = true; }});
    assert.equal(prevented, true);
    assert.equal(h.cards.get(link.dataset.guide).focused, true);
  }
});

test('unknown guide query cannot hide the home workspace or select an arbitrary DOM target', () => {
  const h = harness('?guide=coach');
  assert.equal(h.views.get('discover').active, true);
  assert.equal(h.views.get('learn').active, false);
  assert.ok([...h.cards.values()].every(card => !card.focused));
});

test('both published players have real local media, posters and timed English captions without autoplay or preloading video', () => {
  const html = read('index.html');
  const players = [...html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)];
  assert.equal(players.length, 2);
  for (const [, attrs, content] of players) {
    assert.match(attrs, /\bcontrols\b/);
    assert.match(attrs, /\bpreload="none"/);
    assert.doesNotMatch(attrs, /\bautoplay\b/);
    const poster = attrs.match(/poster="([^"]+)"/)?.[1];
    assert.ok(poster && fs.statSync(new URL(poster, root)).size > 1000);
    const source = content.match(/<source\b[^>]*src="([^"]+)"/)?.[1];
    assert.ok(source, 'Every player must reference a shipped video');
    const video = fs.readFileSync(new URL(source, root));
    assert.ok(video.length > 1_000_000);
    assert.equal(video.subarray(4, 8).toString(), 'ftyp');
    const track = content.match(/<track\b([^>]*)>/)?.[1];
    assert.match(track || '', /kind="captions"/);
    assert.match(track || '', /srclang="en"/);
    const captionPath = track.match(/src="([^"]+)"/)?.[1];
    const captions = read(captionPath);
    assert.ok(captions.startsWith('WEBVTT'));
    const times = [...captions.matchAll(/(?:(\d\d):)?(\d\d):(\d\d)\.(\d{3}) --> (?:(\d\d):)?(\d\d):(\d\d)\.(\d{3})/g)];
    assert.ok(times.length > 0);
    for (const match of times) {
      const [h, m, s, ms, eh, em, es, ems] = match.slice(1).map(value => Number(value || 0));
      assert.ok(((eh * 60 + em) * 60 + es) * 1000 + ems > ((h * 60 + m) * 60 + s) * 1000 + ms);
    }
  }
});
