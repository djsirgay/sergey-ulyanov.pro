# Independent website sources and SEO publication

## Ownership (since 2026-09-28)

- Professional site: djsirgay/sergey-ulyanov.pro, main, GitHub Pages. Root index.html, site-fragments/, site.js and professional routes belong only to sergey-ulyanov.pro.
- Actor site: djsirgay/heyitissergey, main, existing Vercel project heyitissergey. Root Directory is EMPTY; build is node build.mjs; output is dist. The actual actor domain was verified on actor commit d4ac85d72d1f3828520a9809788bea280a24bae1 after the split.
- Never deploy this repository to the actor domain or restore an old gh-pages checkout over main. Actor changes belong only in the separate actor repository.
- actor-final/, actor-final-preview/, actor-preview/, actor-preview-v2/ are archival sources only. Keep their bytes for recovery; never use them as the live actor source. The historical actor-artifact workflow only packages the archive, not the actual actor site.

## SEO artifact finalization

The professional Pages workflow runs build-production.py, prepares _site, generates the existing research redirects, THEN runs scripts/finalize-seo.py --artifact _site.

The finalizer replaces published HTML under the four legacy actor directories with an immediate HTML redirect to heyitissergey.com and a matching canonical. Query parameters and supported section anchors are preserved. GitHub Pages is static: these are zero-delay meta-refresh/client redirects, NOT server-side HTTP 301 responses. Original source files, assets and the professional homepage remain unchanged.

The published sitemap is filtered against the FINAL artifact: only existing professional HTML with a matching canonical and no noindex or refresh remains. This removes legacy research paths pointing to research.sergey-ulyanov.pro and any other noncanonical, missing, or redirected entries. Source dates are retained; no fabricated lastmod dates are added. The source sitemap is input; the deployed sitemap is the checked result.

## Verification and safeguards

Run python3 scripts/build-production.py, node scripts/check-research.mjs, and node --test tests/*.test.mjs. SEO regression tests exercise redirect targets, legacy anchors/query strings, preservation of source/assets, sitemap filtering and idempotence. The deployment step compares source and artifact index.html byte-for-byte.

After publication, verify the actual two domains; a successful GitHub preview is not proof of Vercel production. Do not claim Google indexing or ranking based on HTTP 200. GitHub Pages environment restrictions and branch protection require separate administrative verification; this SEO fix does not change or claim them.
