# Website working agreements

## Site ownership and publishing

- Read SITE_DEPLOYMENT.md before any publishing change.
- main is the canonical editing branch for BOTH websites. Never make actor edits directly on gh-pages or restore a whole legacy branch to fix one page.
- The professional homepage and professional routes belong to sergey-ulyanov.pro.
- actor-final/ is the actor source for heyitissergey.com. It has its own build.mjs, vercel.json, and dist output. Keep the two outputs separate. Do not add runtime dependencies between domains.
- Preserve current actor content (including Snapchat and the explicit The Tax Breakup credit) and professional content together. Run tests/site-boundaries.test.mjs before publishing.
- Retain actor preview paths for compatibility, but do not treat them as separate editing sources.
- Publishing a GitHub preview does not prove that heyitissergey.com was deployed. Verify the actual domain and source commit. Hosting authorization and branch-protection settings must be checked explicitly, not assumed from documentation.

## Research website working agreements

- Keep the black-and-green research site as the primary public version.
- Maintain the white-and-red comparison at /palette-preview/white-red/ as an unlinked, noindex alternative.
- Content, navigation, localization, and functionality share the sources under research/. Make common changes there, then build and verify both versions together with scripts/build-research-domain.mjs; do not maintain a separate content fork for the preview.
- Restrict palette-specific styling to the preview build and its stylesheet. Do not replace the primary palette unless Sergey asks.
- All research pages open in English when the URL has no supported language parameter, regardless of saved browser preferences. Explicit ?lang=be and the language switch remain supported; internal navigation retains the chosen language and route state.
- MAPA mode controls are ordered Neighboring states, then Belarusian lands in both languages and palettes. Order does not change the selected map mode.
