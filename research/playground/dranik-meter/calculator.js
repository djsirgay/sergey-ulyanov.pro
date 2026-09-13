// A unit-conversion joke, not a nutritional model or an assessment of a person.
// No I/O: supplied values exist only in the caller's current memory.
const decimal = value => {
  if (typeof value !== 'string' && typeof value !== 'number') return NaN;
  const text = String(value).trim();
  return /^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(text) ? Number(text.replace(',', '.')) : NaN;
};

export function calculateDraniki({weight, unit = 'kg', pancakeGrams = 50} = {}) {
  if (!['kg', 'lb'].includes(unit)) return {ok: false, field: 'unit'};
  const value = decimal(weight), kilograms = unit === 'lb' ? value * 0.45359237 : value;
  if (!Number.isFinite(kilograms) || kilograms <= 0 || kilograms > 1000) return {ok: false, field: 'weight'};
  const grams = decimal(pancakeGrams);
  if (!Number.isFinite(grams) || grams < 1 || grams > 500) return {ok: false, field: 'pancakeGrams'};
  return {ok: true, kilograms, pancakeGrams: grams, pancakes: kilograms * 1000 / grams};
}
