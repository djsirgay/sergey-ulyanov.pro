# Research website working agreements

- Keep the black-and-green research site as the primary public version.
- Maintain the white-and-red comparison at `/palette-preview/white-red/` as an unlinked, noindex alternative.
- Content, navigation, localization, and functionality share the sources under `research/`. Make common changes there, then build and verify both versions together with `scripts/build-research-domain.mjs`; do not maintain a separate content fork for the preview.
- Restrict palette-specific styling to the preview build and its stylesheet. Do not replace the primary palette unless Sergey asks.
- All research pages open in English when the URL has no supported language parameter, regardless of saved browser preferences. Explicit `?lang=be` and the language switch remain supported; internal navigation retains the chosen language and route state.
- MAPA mode controls are ordered “Neighboring states”, then “Belarusian lands” in both languages and palettes. Order does not change the selected map mode.
