# Website working agreements

## Site ownership and publishing

- Read SITE_DEPLOYMENT.md before any publishing change.
- This repository's main is the source ONLY for the professional website sergey-ulyanov.pro.
- The actor site heyitissergey.com now belongs to djsirgay/heyitissergey, main, repository root. Never publish this repository to that Vercel project.
- actor-final/, actor-final-preview/, actor-preview/, actor-preview-v2/ are archival copies, not editing sources. Preserve them; published HTML is converted to redirects by scripts/finalize-seo.py.
- Never edit gh-pages or restore a whole legacy branch to fix one page. Never introduce runtime or build-time dependencies between the two websites.
- Run tests/site-boundaries.test.mjs and tests/seo-artifact.test.mjs before publishing. Finalize SEO only on a disposable artifact after generating research redirects, never on the source tree.
- Verify real domains after deployment. Hosting authorization and branch-protection settings must be checked explicitly, not assumed from documentation.

## Research website working agreements

- Keep the black-and-green research site as the primary public version.
- Maintain the white-and-red comparison at /palette-preview/white-red/ as an unlinked, noindex alternative.
- Content, navigation, localization, and functionality share the sources under research/. Make common changes there, then build and verify both versions together with scripts/build-research-domain.mjs; do not maintain a separate content fork for the preview.
- Restrict palette-specific styling to the preview build and its stylesheet. Do not replace the primary palette unless Sergey asks.
- All research pages open in English when the URL has no supported language parameter, regardless of saved browser preferences. Explicit ?lang=be and the language switch remain supported; internal navigation retains the chosen language and route state.
- MAPA mode controls are ordered Neighboring states, then Belarusian lands in both languages and palettes. Order does not change the selected map mode.
