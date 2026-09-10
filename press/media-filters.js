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
  function update() {
    const [language, topic, format] = fields.map(field => field.value);
    let visible = 0;
    for (const card of cards) {
      const matches = (language === 'all' || card.dataset.mediaLanguage === language)
        && (topic === 'all' || card.dataset.mediaTopics.split(' ').includes(topic))
        && (format === 'all' || card.dataset.mediaFormat === format);
      card.hidden = !matches;
      if (matches) visible++;
    }
    for (const group of groups) group.hidden = !cards.some(card => group.contains(card) && !card.hidden);
    result.textContent = visible + ' of ' + cards.length + ' original-source entries.';
    empty.hidden = visible !== 0;
  }
  form.hidden = false;
  form.addEventListener('change', update);
  form.addEventListener('reset', () => {
    // Set synchronously, rather than depending on the browser's later reset action.
    fields.forEach(field => { field.value = 'all'; });
    update();
  });
  update();
}());
