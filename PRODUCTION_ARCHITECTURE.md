# Production Architecture

## Source of truth

The approved current design is stored as readable HTML sections in `site-fragments/`.

`python3 scripts/build-production.py` concatenates those fragments into the deployed `index.html` and rejects the build when critical structural checks fail.

## Production files

- `site-fragments/` — semantic homepage HTML in visual order.
- `index.html` — generated homepage artifact.
- `hire/`, `work/`, `press/`, `evidence/`, `case-studies/`, `research/`, and `privacy/` — public routes.
- `styles-1.css` through `styles-4.css`, route and research styles — production presentation.
- `site.js` and `research/` scripts — navigation, interaction, localization, and instrumentation.
- `assets/` — current production imagery and social previews.
- `robots.txt` and `sitemap.xml` — crawler controls and discovery.

## Repository hygiene

Legacy redesign snapshots, actor-site copies, preview folders, one-off deployment markers, and the obsolete photo-sync workflow were removed on September 9, 2026. Git history remains available for recovery, so duplicate runtime copies are not retained in the current tree.

Generated deployment folders (`_site/` and `_research-site/`) and local operating-system files are ignored.

## Analytics hooks

Elements use `data-track` attributes. `site.js` sends interactions to:

1. `window.dataLayer`;
2. a `sergey:analytics` custom browser event;
3. `gtag`, after privacy consent, using GA4 property `G-RQBHK9BCRX` with advertising signals disabled.

Google Search Console verification and sitemap discovery are present in production. Analytics remains opt-in and the privacy page documents the behavior.

## Deployment safety

Pull requests and pushes to `main` run:

- deterministic HTML assembly and structural assertions;
- JavaScript syntax validation;
- research route and asset checks;
- navigation, storage-safety, and historical-map tests.

GitHub Pages deploys only from `main` after validation succeeds.
