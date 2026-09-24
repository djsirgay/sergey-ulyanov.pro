# Two websites, one canonical source branch

## Source boundary

- Repository: djsirgay/sergey-ulyanov.pro. Canonical source branch: main.
- Professional site: root index.html, site-fragments/, site.js, professional styles and routes. Existing GitHub Pages build stays unchanged.
- Actor site: actor-final/. Current actor HTML and existing runtime assets were recovered byte-for-byte from gh-pages@288fc2154bdac418cd8925eb1b62446eb60df8d3 (the actor tree from the September 20 update). It contains Snapchat and the explicit Intuit TurboTax / The Tax Breakup credit.
- actor-final-preview/, actor-preview/, actor-preview-v2/ are compatibility paths only. Do not edit them as independent actor sources.
- gh-pages is not an editing source. Do not restore main wholesale from an old gh-pages checkout. Do not publish a branch merely because it contains a newer actor edit.

## Independent actor deployment

The actor directory owns its own build and output. `node actor-final/build.mjs --out NEW_DIRECTORY` produces only actor files; it cannot copy professional routes and does not mutate either source. The Vercel project settings required are:

- Git repository: djsirgay/sergey-ulyanov.pro
- Production branch: main
- Root Directory: actor-final
- Framework: Other
- Build Command: node build.mjs
- Output Directory: dist
- Domains: heyitissergey.com and its existing www alias

Do not attach sergey-ulyanov.pro to this Vercel project. Do not add rewrites or runtime fetches to the professional site. The actor build uses its own canonical URL and emits deployment.json with a content hash and source commit.

The actor-artifact workflow validates and packages an independently deployable actor-site artifact. It does NOT deploy to Vercel and does NOT alter DNS. The connected Vercel team returned no projects on September 23, 2026, so changing the existing heyitissergey.com project's settings and redeploying requires authorization to that actual team/project. Until then, do not claim the actor domain is updated merely because the GitHub preview is correct.

## Publishing safety

Both sources now live on main, so a professional build cannot silently omit the latest actor compatibility files. Regression tests guard current actor campaigns, current professional homepage, isolated actor output, local dependencies, non-mutation, and rejection of production actor builds from gh-pages.

GitHub Pages should ultimately use GitHub Actions only and the github-pages environment should allow main only. Those repository-admin settings are NOT changed by these files and must be verified separately. Legacy branch publishing can still bypass workflow validation until disabled.

## Required completion checks

1. Run python3 scripts/build-production.py and node --test tests/*.test.mjs.
2. Build the standalone actor artifact and verify deployment.json against the intended commit.
3. Confirm the actual heyitissergey.com domain contains Snapchat and Intuit TurboTax · The Tax Breakup, not only the /actor-final/ compatibility URL.
4. Check both domains on desktop and mobile. Do not treat HTTP 200 as version verification.
5. Never delete or reset an unmerged actor change: compare and preserve it before updating source or deployment branches.
