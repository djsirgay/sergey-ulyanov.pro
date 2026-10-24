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


## Personal-brand refresh — October 2026

- `scripts/site-content.json` holds the reviewed case registry: titles, tasks, roles, stages, results and artifact captions.
- `python3 scripts/build-personal-site.py` builds the editable homepage fragments and professional work, hire, evidence and case pages from that registry. It preserves the existing inquiry form in the final fragment.
- `python3 scripts/build-production.py` assembles and validates the homepage, as before.
- `styles-personal.css` is the professional homepage and case-library visual system: Manrope / Space Mono, charcoal-to-green backgrounds, lime accents, the shared bolt-circle emblem and reduced-motion-aware orbital animation.
- `assets/work-2026/` contains optimized still artwork. Original project colors are retained; brand marks are displayed in white through presentation CSS. Images distinguish original work from portfolio adaptations in their captions.
- `/downloads/Sergey_Ulyanov_Portfolio.pdf` and `/downloads/Sergey_Ulyanov_Resume.pdf` are stable public download URLs for the approved general personal-brand files.
- The speaking/media source groupings, research tools, research palette builds and separate actor-site deployment remain independent. Video descriptions may remain as press history; outbound video URLs are omitted from the professional pages.

Review the native Google Doc working copy before publishing revised prose. Then run the production build, research route check, and repository tests. Finalize SEO only on the disposable deployment artifact according to `SITE_DEPLOYMENT.md`.
