import {calculateDraniki} from './calculator.js';
import {mountResearchHelp} from '../../context-help.js';

export const messages = Object.freeze({
  en: {
    skip:'Skip to calculator', playground:'Playground · a small cultural detour', home:'← Back to research', name:'Dranik meter', eyebrow:'A very unserious unit of measure', headline:'You, in draniki.', intro:'Draniki are Belarusian potato pancakes. For a moment, let’s make them a unit of weight.', calculator:'A little potato arithmetic', weight:'Your weight', unit:'Unit', weightHelp:'Use a decimal point or comma. The number is used only in this tab.', pancake:'Assumed weight of one dranik · g', assumption:'50 g is our playful assumption, not a measured average. Change it to any value from 1 to 500 g.', calculate:'Count the draniki →', clear:'Clear', privacy:'Calculated here. Your weight is not saved or sent. Clear it or leave this page to forget it.', result:'Your potato equivalent', draniki:'hypothetical draniki', waiting:'Enter a number, then count. No guesses about you.', joke:'Same you. Different unit.', boundary:'A playful calculator, not research or health advice. No scores, comparisons or judgments.', method:'The whole method: weight in grams ÷ assumed grams per dranik. The result is approximate; actual draniki vary.', weightError:'Enter a number above zero, up to 1,000 kg (about 2,204 lb). This is an arithmetic limit, not body guidance.', pancakeError:'Choose an assumed pancake weight from 1 to 500 grams.', unitError:'Choose kg or lb.', approximate:'Approximately', formula:'Weight in grams ÷ assumed grams per dranik', title:'Dranik meter · Research playground'
  },
  be: {
    skip:'Перайсці да калькулятара', playground:'Майстэрня · маленькі культурны адступ', home:'← Да даследавання', name:'Дранікаметр', eyebrow:'Вельмі несур’ёзная адзінка вымярэння', headline:'Твая вага. У драніках.', intro:'Дранікі — беларускія бульбяныя аладкі. На хвілінку зробім іх адзінкай вагі.', calculator:'Крыху бульбяной арыфметыкі', weight:'Твая вага', unit:'Адзінка', weightHelp:'Можна выкарыстоўваць кропку або коску. Лік застаецца толькі ў гэтай укладцы.', pancake:'Умоўная вага аднаго драніка · г', assumption:'50 г — наша жартоўнае дапушчэнне, а не вымераная сярэдняя вага. Можна выбраць ад 1 да 500 г.', calculate:'Палічыць дранікі →', clear:'Ачысціць', privacy:'Лічым тут. Твая вага не захоўваецца і нікуды не адпраўляецца. Ачысці палі або пакінь старонку, каб яе забыць.', result:'Твой бульбяны эквівалент', draniki:'умоўных дранікаў', waiting:'Увядзі лік і націсні «Палічыць». Мы не робім здагадак пра цябе.', joke:'Той жа чалавек. Іншая адзінка.', boundary:'Жартоўны калькулятар, не даследаванне і не парада наконт здароўя. Без ацэнак, параўнанняў і асуджэння.', method:'Увесь метад: вага ў грамах ÷ умоўная вага аднаго драніка. Вынік прыблізны; сапраўдныя дранікі бываюць розныя.', weightError:'Увядзі лік большы за нуль, да 1 000 кг (прыкладна 2 204 фунты). Гэта мяжа разліку, а не парада наконт цела.', pancakeError:'Выберы ўмоўную вагу драніка ад 1 да 500 грамаў.', unitError:'Выберы kg або lb.', approximate:'Прыкладна', formula:'Вага ў грамах ÷ умоўная вага аднаго драніка', title:'Дранікаметр · Культурная майстэрня'
  },
  ru: {
    skip:'К калькулятору', playground:'Мастерская · небольшое культурное отступление', home:'← К исследованию', name:'Драникометр', eyebrow:'Очень несерьёзная единица измерения', headline:'Твой вес. В драниках.', intro:'Драники — белорусские картофельные оладьи. На минутку сделаем их единицей веса.', calculator:'Немного картофельной арифметики', weight:'Твой вес', unit:'Единица', weightHelp:'Можно использовать точку или запятую. Число остаётся только в этой вкладке.', pancake:'Условный вес одного драника · г', assumption:'50 г — наше шуточное допущение, а не измеренный средний вес. Можно выбрать от 1 до 500 г.', calculate:'Посчитать драники →', clear:'Очистить', privacy:'Считаем здесь. Твой вес не сохраняется и никуда не отправляется. Очисти поля или покинь страницу, чтобы его забыть.', result:'Твой картофельный эквивалент', draniki:'условных драников', waiting:'Введи число и нажми «Посчитать». Никаких догадок о тебе.', joke:'Тот же человек. Другая единица.', boundary:'Шуточный калькулятор, не исследование и не совет о здоровье. Без оценок, сравнений и осуждения.', method:'Весь метод: вес в граммах ÷ условный вес одного драника. Результат приблизительный; настоящие драники бывают разными.', weightError:'Введи число больше нуля, до 1 000 кг (примерно 2 204 фунта). Это предел расчёта, не рекомендация о теле.', pancakeError:'Выбери условный вес драника от 1 до 500 граммов.', unitError:'Выбери kg или lb.', approximate:'Примерно', formula:'Вес в граммах ÷ условный вес одного драника', title:'Драникометр · Культурная мастерская'
  }
});

export function languageFor(search = '') {
  const value = new URLSearchParams(search).get('lang');
  return ['en','be','ru'].includes(value) ? value : 'en';
}

export function mountMeter(doc, win) {
  let lang = languageFor(win.location.search), result = null, failedField = null;
  const weight = doc.getElementById('weight'), grams = doc.getElementById('pancake-grams'), unit = doc.getElementById('unit');
  const count = doc.getElementById('result-count'), detail = doc.getElementById('result-detail'), error = doc.getElementById('error');
  const buttons = doc.querySelectorAll('[data-language]');
  function render() {
    const t = messages[lang];
    doc.documentElement.lang = lang; doc.title = t.title;
    doc.querySelectorAll('[data-copy]').forEach(node => {if(t[node.dataset.copy]) node.textContent = t[node.dataset.copy];});
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    doc.querySelectorAll('[data-home]').forEach(link => {link.href = '/research/?lang=' + (lang === 'be' ? 'be' : 'en');});
    error.hidden = !failedField;
    error.textContent = failedField ? t[failedField === 'pancakeGrams' ? 'pancakeError' : failedField + 'Error'] : '';
    for (const [field, element] of [['weight', weight], ['pancakeGrams', grams], ['unit', unit]]) {
      if (field === failedField) element.setAttribute('aria-invalid', 'true');
      else element.removeAttribute('aria-invalid');
    }
    count.textContent = '—'; detail.textContent = t.waiting;
    if (result) {
      const format = value => new Intl.NumberFormat(lang, {maximumSignificantDigits: 8}).format(value);
      count.textContent = '≈ ' + format(result.pancakes);
      detail.textContent = `${t.formula}: ${format(result.kilograms * 1000)} ÷ ${format(result.pancakeGrams)}. ${t.approximate}.`;
    }
  }
  function calculate() {
    const value = calculateDraniki({weight:weight.value, unit:unit.value, pancakeGrams:grams.value});
    result = value.ok ? value : null; failedField = value.ok ? null : value.field;
    render();
    if (failedField) ({weight, unit, pancakeGrams:grams})[failedField].focus();
  }
  function clear() {
    weight.value = ''; grams.value = '50'; unit.value = 'kg'; result = null; failedField = null; render();
  }
  doc.getElementById('calculate').addEventListener('click', calculate);
  doc.getElementById('clear').addEventListener('click', () => {clear(); weight.focus();});
  [weight, grams, unit].forEach(input => {
    input.addEventListener('input', () => {result = null; failedField = null; render();});
    input.addEventListener('change', () => {result = null; failedField = null; render();});
    input.addEventListener('keydown', event => {if(event.key === 'Enter'){event.preventDefault(); calculate();}});
  });
  buttons.forEach(button => button.addEventListener('click', () => {
    lang = button.dataset.language;
    // Only the interface language enters history. Input and result never do.
    win.history.replaceState(null, '', win.location.pathname + '?lang=' + lang);
    render();
  }));
  win.addEventListener('pagehide', clear);
  win.addEventListener('pageshow', event => {if (event.persisted) clear();});
  clear();
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {mountMeter(document, window);mountResearchHelp();}
