/* Progressive enhancement: every original media entry is visible without JS. */
(function () {
  'use strict';
  const form = document.getElementById('media-filters');
  if (!form) return;
  const cards = Array.from(document.querySelectorAll('[data-media-language]'));
  const groups = Array.from(document.querySelectorAll('.speaking-media-group'));
  const fields = ['language', 'topic', 'format'].map(name => document.getElementById('media-' + name));
  const result = document.getElementById('media-results');
  const empty = document.getElementById('media-empty');
  const search = document.getElementById('media-search');
  const normalize = text => String(text || '').normalize('NFKD').replace(/\p{M}+/gu, '').toLocaleLowerCase();
  const searchable = cards.map(card => normalize(card.textContent + ' ' + card.dataset.mediaTopics));
  function update() {
    const [language, topic, format] = fields.map(field => field.value);
    const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const [index, card] of cards.entries()) {
      const matches = (language === 'all' || card.dataset.mediaLanguage.split(' ').includes(language))
        && (topic === 'all' || card.dataset.mediaTopics.split(' ').includes(topic))
        && (format === 'all' || card.dataset.mediaFormat.split(' ').includes(format))
        && words.every(word => searchable[index].includes(word));
      card.hidden = !matches;
      if (matches) visible++;
    }
    for (const group of groups) group.hidden = !cards.some(card => group.contains(card) && !card.hidden);
    result.textContent = visible + ' of ' + cards.length + ' media entries.';
    empty.hidden = visible !== 0;
  }
  form.hidden = false;
  form.addEventListener('change', update);
  form.addEventListener('input', update);
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
  form.addEventListener('reset', () => {
    // Set synchronously, rather than depending on the browser's later reset action.
    fields.forEach(field => { field.value = 'all'; });
    search.value = '';
    update();
  });
  update();
}());
