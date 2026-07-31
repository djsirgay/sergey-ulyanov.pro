# Production Architecture

## Source of truth

The approved current design is stored as readable HTML sections in `site-fragments/`.

`python3 scripts/build-production.py` concatenates those fragments into the deployed `index.html` and rejects the build when critical structural checks fail.

## Production files

- `site-fragments/` — semantic HTML in visual order.
- `styles-1.css` through `styles-4.css` — core, work, proof/contact, and responsive styles.
- `site.js` — navigation state, reveal behavior, galleries, keyboard interactions, and event instrumentation.
- `assets/sergey-headshot.webp` — single production portrait asset.
- `og-image.png` — social sharing preview.
- `favicon.svg` — browser icon.
- `robots.txt` and `sitemap.xml` — crawler controls and discovery.

## Removed runtime dependencies

The deployed page no longer uses:

- an iframe wrapper;
- `new Function`;
- runtime extraction of JavaScript from another HTML document;
- four base64 portrait chunks;
- remote Wikimedia logo image URLs.

The old `base-site/` and `refinement-preview/` folders remain only as historical material and are excluded from search indexing.

## Analytics hooks

Elements use `data-track` attributes. `site.js` sends interactions to:

1. `window.dataLayer`;
2. a `sergey:analytics` custom browser event;
3. `gtag`, when a Google Analytics tag is connected later.

This means event instrumentation is active now, while persistent reporting requires an analytics provider ID.

## Deployment safety

Pull requests run:

- deterministic HTML assembly and structural assertions;
- JavaScript syntax validation.

GitHub Pages deploys only from `main` after validation succeeds.
