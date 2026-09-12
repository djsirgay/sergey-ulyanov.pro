/**
 * Conservative identity keys for UI counts of artist credits, not people.
 * This does not rewrite display names, catalogue metadata, or search aliases.
 * Collaborations remain their own credits; unknown spellings are not transliterated.
 */
const normalizeCredit = value => typeof value === 'string'
  ? value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase()
  : '';

// Both spellings are source-reviewed in this catalogue for the same duo:
// https://shumaduo.bandcamp.com/track/zamova (Šuma)
// https://shumaduo.bandcamp.com/track/maslenica (Shuma)
// Deliberately not a global diacritic fold or Cyrillic transliteration.
const knownAliases = new Map([
  ['šuma', 'known:shuma-duo'],
  ['shuma', 'known:shuma-duo'],
]);

export function artistIdentityKey(credit) {
  const normalized = normalizeCredit(credit);
  return normalized ? knownAliases.get(normalized) || `credit:${normalized}` : '';
}

/** Count distinct, nonempty artist credits in a record list. */
export function countArtistIdentities(records = []) {
  if (!Array.isArray(records)) return 0;
  return new Set(records.map(record => artistIdentityKey(record?.artist)).filter(Boolean)).size;
}
