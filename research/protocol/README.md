# Review instrument maintenance

Canonical scored input is the ordered `id` / `be` content in `instrument.v0.3.json`.
English `en` values are AI-assisted reading translations, not scored conditions.
The October 25 revision changes only C14/C15 relative to source commit 77154e4.
It is not a collection freeze or independent full-bank validation.

After an approved instrument edit, run:

```sh
node scripts/build-audit-protocol.mjs
node scripts/build-audit-protocol.mjs --check
node --test tests/protocol-review.test.mjs
```

The generator updates the prompt-bank HTML and hash manifest together. Do not
hand-edit generated prompt rows or call a review hash a complete study freeze.
Update current version labels in the research homepage/localization when revising.
Build and inspect both palettes from shared sources before deploying the exact
canonical-source commit through the research deployment repository workflow.

The native Google Docs research portfolio is the editable prose/audit record.
Private correspondence, reviewer names, and recommendation materials must not be
copied into this public artifact. Original Belarusian wording remains visible
beside English reading translations; the explicit Belarusian view hides glosses.
