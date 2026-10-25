(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const players = [...document.querySelectorAll('#view-learn video')];
    function openGuide(audience) {
      if (!['teacher', 'student'].includes(audience)) return;
      const card = document.getElementById('guide-' + audience);
      if (!card) return;
      window.JP.go('learn');
      card.scrollIntoView({block: 'start', behavior: 'instant'});
      card.querySelector('h3').focus({preventScroll: true});
    }
    document.querySelectorAll('[data-guide]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        openGuide(link.dataset.guide);
      });
    });
    players.forEach(player => player.addEventListener('play', () => {
      players.filter(other => other !== player).forEach(other => other.pause());
    }));
    openGuide(new URLSearchParams(location.search).get('guide'));
  });
})();
